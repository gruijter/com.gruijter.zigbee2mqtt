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
  CapabilityMappings, DeviceAvailability, Z2MDevice, Z2MGroup,
} from '../types';
import { hsbToRgb } from '../utilities';

const setTimeoutPromise = util.promisify(setTimeout);

export default abstract class Zigbee2MQTTDevice extends Homey.Device {
  store: { capabilityMappings: CapabilityMappings };
  settings: any;
  bridge: any;
  deviceTopic: string;
  restarting: boolean;
  availability: DeviceAvailability['availability'];
  zigbee2MqttType: string;
  eventListenerBridgeOffline: any;
  bridgeOffline: boolean;
  capabilityListeners: any;
  handleMessage: any;
  subscribeTopics: any;

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
      await this.migrateStore();
      await this.registerHomeyEventListeners();
      await this.checkChangedOrDeleted();
      await this.migrate();
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

      // Add capabilityMappings if not present
      if (!this.store?.capabilityMappings) {
        this.log(`Adding capabilityMappings to store for ${this.getName()}`);
        const deviceInfo = this.getDeviceInfo();
        if (deviceInfo) {
          const isGroup = deviceInfo.type === 'group';
          const device = isGroup ? deviceInfo.devices[0] : deviceInfo.device;
          const capabilityMappings = mapCapabilities(device, { isGroup });
          await this.setStoreValue('capabilityMappings', capabilityMappings);
          storeChanged = true;
        } else {
          this.error(`Cannot migrate store for ${this.getName()}: device info not available`);
          return false;
        }
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

  async migrate() {
    try {
      this.log(`checking device migration for ${this.getName()}`);

      const deviceInfo = this.getDeviceInfo();
      if (!deviceInfo) return false;

      const isGroup = deviceInfo.type === 'group';
      const device = isGroup ? deviceInfo.devices[0] : deviceInfo.device;
      const capabilityMappings = mapCapabilities(device, { isGroup });
      await this.setStoreValue('capabilityMappings', capabilityMappings);

      const correctCaps = Object.values(capabilityMappings).map((m) => m.homeyCapability);

      // Store capability states before migration
      const sym = Object.getOwnPropertySymbols(this).find((s) => String(s) === 'Symbol(state)');
      const state = sym ? (this as any)[sym] : {};

      let migrated = false;

      for (let i = 0; i < correctCaps.length; i++) {
        const currentCaps = this.getCapabilities();
        const correctCap = correctCaps[i];

        if (currentCaps[i] !== correctCap) {
          if (!migrated) {
            this.setUnavailable(`${this.zigbee2MqttType} is migrating. Please wait!`).catch(this.error);
            migrated = true;
          }

          // Remove all capabilities from this index onwards
          const capsToRemove = currentCaps.slice(i);
          for (const cap of capsToRemove) {
            this.log(`removing capability ${cap} for ${this.getName()}`);
            await this.removeCapability(cap).catch((error) => this.log(error));
            await setTimeoutPromise(2 * 1000); // wait a bit for Homey to settle
          }

          // Add the correct capability
          this.log(`adding capability ${correctCap} for ${this.getName()}`);
          await this.addCapability(correctCap).catch((error) => this.log(error));

          // Restore capability state if available
          if (state[correctCap] !== undefined) {
            this.log(`${this.getName()} restoring value ${correctCap} to ${state[correctCap]}`);
            this.setCapability(correctCap, state[correctCap]).catch((error) => this.error(error));
          }
          await setTimeoutPromise(2 * 1000); // wait a bit for Homey to settle
        }
      }

      await this.setCapabilityUnits();
      if (!migrated) {
        this.log(`No migration needed for ${this.getName()}`);
      }
      return migrated;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async setCapabilityUnits() {
    try {
      this.log(`Checking Capability Units and Titles for ${this.getName()}`);
      this.setUnavailable(`${this.zigbee2MqttType} is migrating. Please wait!`).catch(this.error);
      let unitsChanged = false;
      const { capabilityMappings } = this.store;
      if (!capabilityMappings) return;

      for (const { homeyCapability, expose } of Object.values(capabilityMappings)) {
        const capOptions: any = {};

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
          if (currentCapOptions.unit !== capOptions.unit || currentCapOptions.name !== capOptions.name) {
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
      this.setCapabilityValue(capability, value)
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
        await this.migrate();
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
      const bridgeDriver = this.homey.drivers.getDriver('bridge') as any;
      await bridgeDriver.ready();
      if (bridgeDriver.getDevices().length < 1) throw Error('The source bridge device is missing in Homey.');
      const bridge = bridgeDriver.getDevice({ id: this.settings.bridge_uid });
      if (!bridge || !bridge.client) throw Error('Cannot connect to source bridge device in Homey.');
      this.bridge = bridge;

      this.deviceTopic = `${bridge.settings.topic}/${this.settings.friendly_name}`;
      const handleMessage = (topic: string, message: any) => {
        try {
          if (message.toString() !== '') {
            const info = JSON.parse(message);
            // Map the incoming value to a capability or setting
            if (topic === this.deviceTopic) {
              // console.log(`${this.getName()} update:`, info);
              // this.setAvailable();
              Object.entries<any>(info).forEach((entry) => {
                // exception for color light
                if (entry[0] === 'color' && this.getCapabilities().includes('light_hue')) {
                  if (entry[1].hue !== undefined) this.setCapabilityValue('light_hue', entry[1].hue).catch(this.error);
                  if (entry[1].saturation !== undefined) this.setCapabilityValue('light_saturation', entry[1].saturation).catch(this.error);
                } else {
                  const z2mProperty = entry[0];
                  if (!this.store.capabilityMappings) return;
                  const mapping = this.store.capabilityMappings[z2mProperty];
                  if (mapping) { //  included in Homey mapping
                    const converters = getCapabailityConverters(z2mProperty, mapping.expose);
                    if (!converters) return;
                    const capVal = converters.z2mToHomey(entry[1]);
                    // Add extra triggers for ACTION
                    if (mapping.homeyCapability === 'action') {
                      // Action event received
                      if (capVal[1] !== null && capVal[1] !== undefined && capVal[1] !== '') {
                        const tokens = { action: capVal[1] };
                        const state = { event: capVal[1] };
                        this.homey.flow.getDeviceTriggerCard('action_event_received').trigger(this, tokens, state).catch(this.error);
                      }
                      // Original extra action trigger
                      this.setCapability(mapping.homeyCapability, '---').catch((error) => this.error(error));
                    }
                    this.setCapability(mapping.homeyCapability, capVal).catch((error) => this.error(error));
                  } else {
                    this.log(`Capability ${entry[0]} not mapped`);
                  }
                }
              });
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

      for (const [z2mProperty, mapping] of Object.entries(capabilityMappings)) {
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
          ['light_hue', 'light_saturation', 'light_mode'],
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
