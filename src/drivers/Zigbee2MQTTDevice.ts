/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
/*
Copyright 2023 - 2025, Robin de Gruijter (gruijter@hotmail.com)

This file is part of com.gruijter.zigbee2mqtt.

com.gruijter.zigbee2mqtt is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

com.gruijter.zigbee2mqtt is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with com.gruijter.zigbee2mqtt.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

import Homey from 'homey';
import util from 'util';
import { mapCapabilities, getCapabailityConverters } from '../capabilitymap';
import {
  CapabilityMappings, DeviceAvailability, Z2MDevice, Z2MGroup, DeviceSettings, CapabilityOptions,
} from '../types';
import { hsbToRgb } from '../utilities';
import Zigbee2MQTTBridge from './bridge/device';

const setTimeoutPromise = util.promisify(setTimeout);

export default abstract class Zigbee2MQTTDevice extends Homey.Device {
  store: { capabilityMappings: CapabilityMappings };
  settings: DeviceSettings;
  bridge: Zigbee2MQTTBridge;
  deviceTopic: string;
  restarting: boolean;
  availability: DeviceAvailability['availability'];
  zigbee2MqttType: string;
  eventListenerBridgeOffline: ((offline: boolean) => void) | null;
  bridgeOffline: boolean;
  capabilityListeners: Record<string, boolean>;
  handleMessage: (topic: string, message: Buffer) => void;
  subscribeTopics: () => Promise<void>;

  abstract getDeviceInfo():
  { type: 'group', device: Z2MGroup, devices: Z2MDevice[] } |
  { type: 'device', device: Z2MDevice } |
  null;

  async onInit() {
    try {
      this.store = this.getStore();
      this.settings = this.getSettings();
      await setTimeoutPromise(2000);
      await this.connectBridge();
      await setTimeoutPromise(2000);
      // Save old mappings before migrateStore() updates them
      const oldCapabilityMappings = this.store?.capabilityMappings;
      await this.migrateStore();
      await this.registerHomeyEventListeners();
      await this.checkChangedOrDeleted();
      await this.migrate(oldCapabilityMappings);
      await this.registerListeners();
      await this.getStatus({ state: '' }, 'appInit');
      this.restarting = false;
      if (this.availability === 'offline') this.setUnavailable('Device is offline').catch(this.error);
      else await this.setAvailable();
      this.log(this.getName(), 'has been initialized');
    } catch (error) {
      this.error(error);
      this.setUnavailable(String(error)).catch(this.error);
      this.restarting = false;
      this.restartDevice(60 * 1000).catch((error) => this.error(error));
    }
  }

  async onUninit() {
    this.log(this.zigbee2MqttType, 'unInit', this.getName());
    this.destroyListeners();
    await setTimeoutPromise(2000).catch((error) => this.error(error)); // wait 2 secs
  }

  async onAdded() {
    this.log(this.zigbee2MqttType, 'added', this.getName());
    if (this.getClass() !== this.getSettings().homeyclass) {
      this.log(`setting new Class for ${this.getName()}`, this.getSettings().homeyclass);
      await this.setClass(this.getSettings().homeyclass).catch((error) => this.error(error));
    }
    // await this.setCapabilityUnits();
  }

  async onSettings({ newSettings, changedKeys }: { newSettings: any, changedKeys: string[] }) {
    // oldSettings changedKeys
    this.log('Settings changed', newSettings);
    if (changedKeys.includes('homeyclass')) {
      this.log(`setting new Class for ${this.getName()}`, this.getClass(), this.getSettings().homeyclass);
      await this.setClass(newSettings.homeyclass).catch((error) => this.error(error));
    }
    this.restartDevice(1000).catch((error) => this.error(error));
  }

  async onDeleted() {
    if (this.bridge && this.bridge.client) this.destroyListeners();
    this.log(this.zigbee2MqttType, 'deleted', this.getName());
  }

  async migrateStore() {
    try {
      this.log(`checking store migration for ${this.getName()}`);
      let storeChanged = false;

      // Remove all store values except capabilityMappings
      if (this.store) {
        for (const key of Object.keys(this.store)) {
          if (key !== 'capabilityMappings') {
            this.log(`Removing deprecated ${key} from store for ${this.getName()}`);
            await this.unsetStoreValue(key);
            storeChanged = true;
          }
        }
      }

      // Update capabilityMappings
      const deviceInfo = this.getDeviceInfo();
      if (deviceInfo) {
        const isGroup = deviceInfo.type === 'group';
        const device = isGroup ? deviceInfo.devices[0] : deviceInfo.device;
        const capabilityMappings = mapCapabilities(device, { isGroup });

        if (
          !this.store?.capabilityMappings
          || !util.isDeepStrictEqual(this.store.capabilityMappings, capabilityMappings)
        ) {
          this.log(`Updating capabilityMappings in store for ${this.getName()}`);
          await this.setStoreValue('capabilityMappings', capabilityMappings);
          storeChanged = true;
        }
      } else {
        this.error(`Cannot migrate store for ${this.getName()}: device info not available`);
        return false;
      }

      // Refresh store reference if changed
      if (storeChanged) {
        this.store = this.getStore();
      }

      return storeChanged;
    } catch (error) {
      this.error('Store migration failed:', error);
      return Promise.reject(error);
    }
  }

  async restartDevice(delay: number) {
    if (this.bridge && this.bridge.client && this.bridge.client.connected) this.destroyListeners();
    if (this.restarting) return;
    this.restarting = true;
    // if (this.client) await this.client.end();
    const dly = delay || 1000 * 5;
    this.log(`Device will restart in ${dly / 1000} seconds`);
    // this.setUnavailable(this.zigbee2MqttType, 'is restarting');
    await setTimeoutPromise(dly);
    this.onInit().catch((error) => this.error(error));
  }

  async migrate(oldCapabilityMappings?: CapabilityMappings) {
    try {
      this.log(`checking device migration for ${this.getName()}`);

      // Use the already-updated store mappings (from migrateStore())
      const newCapabilityMappings = this.store?.capabilityMappings;
      if (!newCapabilityMappings) {
        this.log(`No capability mappings found for ${this.getName()}, skipping migration`);
        return false;
      }

      // Get capability sets for comparison
      const currentCaps = new Set(this.getCapabilities());
      const newCaps = new Set(Object.values(newCapabilityMappings).map((m) => m.homeyCapability));
      const oldCaps = new Set(oldCapabilityMappings ? Object.values(oldCapabilityMappings).map((m) => m.homeyCapability) : []);

      // Capabilities to ADD: in new mappings but not on device
      const capsToAdd = [...newCaps].filter((cap) => !currentCaps.has(cap));

      // Capabilities to REMOVE: in old mappings but NOT in new mappings (and exist on device)
      // This preserves Homey-set capabilities that aren't part of our Z2M mapping
      const capsToRemove = [...oldCaps].filter((cap) => !newCaps.has(cap) && currentCaps.has(cap));

      if (capsToAdd.length === 0 && capsToRemove.length === 0) {
        this.log(`No migration needed for ${this.getName()}`);
        await this.setCapabilityUnits();
        return false;
      }

      // Store capability states before migration
      const sym = Object.getOwnPropertySymbols(this).find((s) => String(s) === 'Symbol(state)');
      const state = sym ? (this as any)[sym] : {};

      this.setUnavailable(`${this.zigbee2MqttType} is migrating. Please wait!`).catch(this.error);
      this.log(`${this.getName()} is migrating. Please wait!`);

      // Remove capabilities that are no longer in the mapping
      for (const cap of capsToRemove) {
        this.log(`removing capability ${cap} for ${this.getName()}`);
        await this.removeCapability(cap).catch((error) => this.log(error));
        await setTimeoutPromise(2 * 1000); // wait a bit for Homey to settle
      }

      // Add missing capabilities
      for (const cap of capsToAdd) {
        this.log(`adding capability ${cap} for ${this.getName()}`);
        await this.addCapability(cap).catch((error) => this.log(error));

        // Restore capability state if available
        if (state[cap] !== undefined) {
          this.log(`${this.getName()} restoring value ${cap} to ${state[cap]}`);
          this.setCapability(cap, state[cap]).catch((error) => this.error(error));
        }
        await setTimeoutPromise(2 * 1000); // wait a bit for Homey to settle
      }

      await this.setCapabilityUnits();
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async setCapabilityUnits() {
    try {
      this.log(`Checking Capability Units and Titles for ${this.getName()}`);
      let unitsChanged = false;
      const { capabilityMappings } = this.store;
      if (!capabilityMappings) return;

      for (const { homeyCapability, expose } of Object.values(capabilityMappings)) {
        const capOptions: CapabilityOptions = {};

        if (expose.type === 'numeric' && expose.unit) {
          capOptions.units = { en: expose.unit };
        }
        if (expose.name && !homeyCapability.includes('onoff')) {
          const title = expose.name.replace(/./, (c) => c.toUpperCase());
          capOptions.title = { en: title };
        }
        // decimals: dec,
        if (Object.keys(capOptions).length > 0) {
          // check if the unit or name changed for this capability
          let currentCapOptions: any = {};
          try {
            currentCapOptions = this.getCapabilityOptions(homeyCapability);
          } catch (error) {
            this.log(`${this.getName()} has no capability options set for ${homeyCapability}`);
          }
          // console.log(this.getName(), capDetailsArray[index][0], currentCapOptions);
          if (currentCapOptions.units?.en !== capOptions.units?.en || currentCapOptions.title?.en !== capOptions.title?.en) {
            if (!unitsChanged) {
              // Only show migrating message on first change
              this.setUnavailable(`${this.zigbee2MqttType} is migrating. Please wait!`).catch(this.error);
            }
            unitsChanged = true;
            this.log('Migrating unit and title for', homeyCapability, (expose.type === 'numeric' ? expose.unit : 'no unit'), expose.name);
            await this.setCapabilityOptions(homeyCapability, capOptions).catch(this.error);
            await setTimeoutPromise(2 * 1000).catch((error) => this.log(error));
          }
        }
      }
      if (unitsChanged) this.restartDevice(1000).catch((error) => this.error(error));
    } catch (error) {
      this.error(error);
    }
  }

  async setCapability(capability: string, value: any) {
    if (this.hasCapability(capability) && value !== undefined) {
      await this.setCapabilityValue(capability, value)
        .catch((error) => {
          this.log(error, capability, value);
        });
    }
  }

  setSetting(setting: string, value: any) {
    if (this.settings && this.settings[setting] !== value) {
      const settings: any = {};
      settings[setting] = value;
      this.log('New setting:', settings);
      this.setSettings(settings).catch((error) => {
        this.log(error, setting, value);
      });
    }
  }

  async getStatus(payload: any, source: string) {
    if (!this.bridge || !this.bridge.client || !this.bridge.client.connected) return Promise.reject(Error('Bridge is not connected'));
    const deviceInfo = this.getDeviceInfo();
    if (deviceInfo?.type === 'device' && deviceInfo.device.power_source === 'Battery') return Promise.resolve(true); // skip battery devices
    const pl = payload || { state: '' };
    await this.bridge.client.publish(`${this.deviceTopic}/get`, JSON.stringify(pl));
    this.log(`${JSON.stringify(pl)} sent by ${source}`);
    return Promise.resolve(true);
  }

  async setCommand(payload: any, source: string) {
    if (!this.bridge || !this.bridge.client || !this.bridge.client.connected) throw Error('Bridge is not connected');
    if (!this.store || !this.store.capabilityMappings) throw Error('Store capabilities undefined');
    if (!payload) throw Error('setCommand started without payload');

    // get the capability mapping for this command
    const [payLoadArray] = Object.entries(payload);
    const z2mProperty = payLoadArray[0] as string;
    const mapping = this.store.capabilityMappings[z2mProperty];
    if (!mapping) throw Error(`${z2mProperty} capability not supported`);

    // check if command is settable
    const mask = 0b00010;
    const settable = (mapping.expose.access & mask) === mask;
    if (!settable) throw Error(`${z2mProperty} capability is not settable`);

    // check if ENUM command is supported by this device
    if (mapping.expose.type === 'enum' && mapping.expose.values && !mapping.expose.values.includes(payLoadArray[1] as string)) {
      throw Error(`${payLoadArray[1]} command not supported`);
    }

    await this.bridge.client.publish(`${this.deviceTopic}/set`, JSON.stringify(payload));
    this.log(`${JSON.stringify(payload)} sent by ${source}`);
    return Promise.resolve(true);
  }

  // Set command by Homey capability name (used by flow action cards)
  async setCapabilityCommand(homeyCapability: string, value: any, source: string) {
    if (!this.store?.capabilityMappings) throw Error('Store capabilities undefined');

    // Find the Z2M property for this Homey capability
    const z2mProperty = Object.keys(this.store.capabilityMappings).find(
      (key) => this.store.capabilityMappings[key].homeyCapability === homeyCapability,
    );
    if (!z2mProperty) throw Error(`${homeyCapability} capability not mapped`);

    const mapping = this.store.capabilityMappings[z2mProperty];
    const converters = getCapabailityConverters(z2mProperty, mapping.expose);
    if (!converters?.homeyToZ2m) throw Error(`${homeyCapability} is not settable`);

    const command = converters.homeyToZ2m(value);
    await this.setCommand(command, source);
  }

  async setCustomPayload(payload: any, source: string) {
    if (!this.bridge?.client?.connected) throw Error('Bridge is not connected');
    if (!this.store?.capabilityMappings) throw Error('Store capabilities undefined');
    if (!payload) throw Error('setCommand started without payload');

    await this.bridge.client.publish(`${this.deviceTopic}/set`, payload);
    this.log(`${payload} sent by ${source}`);
    return Promise.resolve(true);
  }

  // special for color light
  async dimHueSat(values: any, source: string) {
    if (values && values.light_mode === 'temperature') return Promise.resolve(true);
    this.log(`${this.getName()} dim/hue/set requested via ${source}`);
    const hue = values.light_hue || this.getCapabilityValue('light_hue');
    const sat = values.light_saturation || this.getCapabilityValue('light_saturation');
    const payload = this.getColorPayload(hue, sat);
    await this.bridge.client.publish(`${this.deviceTopic}/set`, JSON.stringify(payload));
    this.log(`${JSON.stringify(payload)} sent by ${source}`);
    return Promise.resolve(true);
  }

  getColorPayload(hue: number, sat: number) {
    const colorEntry = Object.entries(this.store?.capabilityMappings || {}).find(([, m]) => m.homeyCapability === 'light_hue');
    if (colorEntry && colorEntry[1].expose.name === 'color_hs') {
      return { color: { hue: 360 * hue, saturation: 100 * sat } };
    }
    const dim = this.getCapabilityValue('dim');
    const { r, g, b } = hsbToRgb(hue, sat, dim);
    return { color: { r, g, b } };
  }

  async checkChangedOrDeleted() {
    const deviceInfo = this.getDeviceInfo();

    if (!deviceInfo) {
      // Device deleted deleted
      this.error(this.zigbee2MqttType, 'was deleted in Zigbee2MQTT', this.settings.friendly_name);
      this.setUnavailable(`${this.zigbee2MqttType} went missing in Zigbee2MQTT`).catch(this.error);
      this.availability = 'offline';
    } else {
      if (!this.store?.capabilityMappings) {
        // Device reappeared
        this.log('Device reappeared, retrying migration...');
        await this.migrateStore();
        await this.migrate(); // No old mappings to compare - will only add missing capabilities
        await this.registerListeners();
      }

      if (deviceInfo.device.friendly_name !== this.settings.friendly_name) {
        // Device renamed
        this.log(this.zigbee2MqttType, 'was renamed in Zigbee2MQTT', this.settings.friendly_name, deviceInfo.device.friendly_name);
        this.setSetting('friendly_name', deviceInfo.device.friendly_name);
        this.restartDevice(1000).catch((error) => this.error(error));
      }
    }
  }

  async connectBridge() {
    try {
      const bridgeDriver = this.homey.drivers.getDriver('bridge');
      await bridgeDriver.ready();
      if (bridgeDriver.getDevices().length < 1) throw Error('The source bridge device is missing in Homey.');
      const bridge = bridgeDriver.getDevice({ id: this.settings.bridge_uid }) as unknown as Zigbee2MQTTBridge;
      if (!bridge || !bridge.client) throw Error('Cannot connect to source bridge device in Homey.');
      this.bridge = bridge;

      this.deviceTopic = `${bridge.settings.topic}/${this.settings.friendly_name}`;
      const handleMessage = async (topic: string, message: any) => {
        try {
          if (message.toString() !== '') {
            const info = JSON.parse(message);
            // Map the incoming value to a capability or setting
            if (topic === this.deviceTopic) {
              // console.log(`${this.getName()} update:`, info);
              // this.setAvailable();
              for (const entry of Object.entries<any>(info)) {
                // exception for color light
                if (entry[0] === 'color' && this.getCapabilities().includes('light_hue')) {
                  if (entry[1].hue !== undefined) await this.setCapabilityValue('light_hue', entry[1].hue).catch(this.error);
                  if (entry[1].saturation !== undefined) await this.setCapabilityValue('light_saturation', entry[1].saturation).catch(this.error);
                } else {
                  const z2mProperty = entry[0];
                  if (!this.store.capabilityMappings) continue;
                  const mapping = this.store.capabilityMappings[z2mProperty];
                  if (mapping) { //  included in Homey mapping
                    const converters = getCapabailityConverters(z2mProperty, mapping.expose);
                    if (!converters) continue;
                    const capVal = converters.z2mToHomey(entry[1]);
                    // Add extra triggers for ACTION
                    if (mapping.homeyCapability === 'action') {
                      // Action event received
                      if (capVal !== null && capVal !== undefined && capVal !== '') {
                        const tokens = { action: capVal };
                        const state = { event: capVal };
                        this.homey.flow.getDeviceTriggerCard('action_event_received').trigger(this, tokens, state).catch(this.error);
                      }
                      // Original extra action trigger
                      await this.setCapability(mapping.homeyCapability, '---').catch((error) => this.error(error));
                    }
                    await this.setCapability(mapping.homeyCapability, capVal).catch((error) => this.error(error));
                  } else {
                    this.log(`Capability ${entry[0]} not mapped`);
                  }
                }
              }
            }
            // handle device availability, but not for groups
            if (this.zigbee2MqttType !== 'Group' && topic === `${this.deviceTopic}/availability`) {
              this.availability = info && info.state;
              if (this.availability === 'online') this.setAvailable().catch(this.error);
              else if (this.availability === 'offline') this.setUnavailable('Device is offline').catch(this.error);
            }
          }
        } catch (error) {
          this.error(error);
        }
      };
      this.handleMessage = handleMessage;

      const subscribeTopics = async () => {
        try {
          this.log(`Subscribing to ${this.deviceTopic}`);
          await this.bridge.client.subscribe([`${this.deviceTopic}`]); // device state updates
          await this.bridge.client.subscribe([`${this.deviceTopic}/availability`]); // device availability updates
          this.log(`${this.getName()} mqtt subscriptions ok`);
        } catch (error) {
          this.error(error);
        }
      };
      this.subscribeTopics = subscribeTopics;

      this.log('connecting to Bridge MQTT');
      this.bridge.client
        .on('connect', this.subscribeTopics)
        .on('message', this.handleMessage);
      if (this.bridge.client.connected) await subscribeTopics();
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // register homey event listeners
  async registerHomeyEventListeners() {
    if (this.eventListenerBridgeOffline) this.homey.on('bridgeoffline', this.eventListenerBridgeOffline); // Re-add listener if it was removed? Logic seems slightly off in original code or I misunderstood. Original: remove then define then add.
    // Actually, the original code checks if it exists, removes it, then redefines it and adds it.
    if (this.eventListenerBridgeOffline) {
      this.homey.removeListener('bridgeoffline', this.eventListenerBridgeOffline);
    }
    this.eventListenerBridgeOffline = (offline: boolean) => {
      // console.log('bridgeOffline event received');
      if (offline) {
        this.setUnavailable('Bridge is offline').catch(this.error);
        this.bridgeOffline = true;
      } else if (this.bridgeOffline) {
        this.bridgeOffline = false;
        this.restartDevice(1000).catch((error) => this.error(error));
      }
    };
    this.homey.on('bridgeoffline', this.eventListenerBridgeOffline);
  }

  // register capability listeners for settable commands
  async registerListeners() {
    try {
      if (!this.capabilityListeners) this.capabilityListeners = {};
      const { capabilityMappings } = this.store;
      if (!capabilityMappings) return Promise.resolve(false);

      const lightCapabilities = ['light_hue', 'light_saturation', 'light_mode'];

      for (const [z2mProperty, mapping] of Object.entries(capabilityMappings)) {
        if (lightCapabilities.includes(mapping.homeyCapability)) {
          // skip color light capabilities, handled separately
          continue;
        }

        const converters = getCapabailityConverters(z2mProperty, mapping.expose);
        if (!converters) {
          this.log(`No converters found for ${z2mProperty}`);
          continue;
        }

        if (converters.homeyToZ2m && this.getCapabilities().includes(converters.homeyCapability)) {
          // capability setting is mapped and present in device
          if (!this.capabilityListeners[converters.homeyCapability]) {
            this.log(`${this.getName()} adding capability listener ${converters.homeyCapability}`);
            this.registerCapabilityListener(converters.homeyCapability, (val: any) => {
              if (converters.homeyToZ2m) {
                const command = converters.homeyToZ2m(val);
                this.setCommand(command, 'app').catch((error) => this.error(error));
              }
              return Promise.resolve();
            });
            this.capabilityListeners[converters.homeyCapability] = true;
          }
        }
      }

      // add exception for color light
      if (this.getCapabilities().includes('light_hue') && !this.capabilityListeners.multiLight) {
        this.log(`${this.getName()} adding multiple capability listener for Hue lights`);
        this.registerMultipleCapabilityListener(
          lightCapabilities,
          (values: any) => {
            this.dimHueSat(values, 'app').catch((error) => this.error(error));
            return Promise.resolve();
          },
          500,
        );
        this.capabilityListeners.multiLight = true;
      }

      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // remove listeners
  destroyListeners() {
    this.log('removing listeners', this.getName());
    this.bridge.client.removeListener('connect', this.subscribeTopics);
    this.bridge.client.removeListener('message', this.handleMessage);
    if (this.eventListenerBridgeOffline) this.homey.removeListener('bridgeoffline', this.eventListenerBridgeOffline);
  }

}
