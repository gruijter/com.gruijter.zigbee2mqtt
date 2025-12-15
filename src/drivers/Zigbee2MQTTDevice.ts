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
import { mapCapabilities, getCapabilityConverters } from '../capabilitymap';
import {
  CapabilityMapping, CapabilityMappings, DeviceAvailability, Z2MDevice, Z2MGroup, DeviceSettings, CapabilityOptions,
} from '../types';
import Zigbee2MQTTBridge from './bridge/device';

const setTimeoutPromise = util.promisify(setTimeout);

// Store version - increment when CapabilityMappings format changes
const STORE_VERSION = 2;

export default abstract class Zigbee2MQTTDevice extends Homey.Device {
  store: { capabilityMappings: CapabilityMappings; storeVersion: number };
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
    this.log(`checking store migration for ${this.getName()}`);
    let storeChanged = false;

    // Remove unexpected store values
    if (this.store) {
      const keysToKeep = ['capabilityMappings', 'storeVersion'];
      for (const key of Object.keys(this.store)) {
        if (!keysToKeep.includes(key)) {
          this.log(`Removing deprecated ${key} from store for ${this.getName()}`);
          await this.unsetStoreValue(key);
          storeChanged = true;
        }
      }
    }

    const deviceInfo = this.getDeviceInfo();
    if (deviceInfo) {
      const isGroup = deviceInfo.type === 'group';
      const device = isGroup ? deviceInfo.devices[0] : deviceInfo.device;
      const capabilityMappings = mapCapabilities(device, { isGroup });

      const needsUpdate = !this.store?.capabilityMappings
        || !util.isDeepStrictEqual(this.store.capabilityMappings, capabilityMappings)
        || this.store.storeVersion !== STORE_VERSION;

      if (needsUpdate) {
        this.log(`Updating capabilityMappings in store for ${this.getName()}`);
        await this.setStoreValue('capabilityMappings', capabilityMappings);
        await this.setStoreValue('storeVersion', STORE_VERSION);
        storeChanged = true;
      }
    } else {
      this.error(`Cannot migrate store for ${this.getName()}: device info not available`);
      return false;
    }

    if (storeChanged) {
      this.store = this.getStore();
    }

    return storeChanged;
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
    this.log(`checking device migration for ${this.getName()}`);

    if (!this.isStoreUpToDate()) {
      this.log(`Store outdated for ${this.getName()}, waiting for device to be available`);
      return false;
    }
    const { capabilityMappings } = this.store;

    // Get capability sets for comparison
    const currentCaps = new Set(this.getCapabilities());
    const mappedCaps = new Set(Object.values(capabilityMappings).flatMap((m) => m.homeyCapabilities));

    // Capabilities to ADD: in mappings but not on device
    const capsToAdd = [...mappedCaps].filter((cap) => !currentCaps.has(cap));

    // Capabilities to REMOVE: on device but not in mappings
    const capsToRemove = [...currentCaps].filter((cap) => !mappedCaps.has(cap));

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

    // Remove capabilities no longer in mappings
    for (const cap of capsToRemove) {
      this.log(`removing capability ${cap} for ${this.getName()}`);
      await this.removeCapability(cap).catch((error) => this.log(error));
      await setTimeoutPromise(2 * 1000);
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
      await setTimeoutPromise(2 * 1000);
    }

    await this.setCapabilityUnits();
    return true;
  }

  async setCapabilityUnits() {
    this.log(`Checking Capability Units and Titles for ${this.getName()}`);
    let unitsChanged = false;
    const { capabilityMappings } = this.store;
    if (!capabilityMappings) return;

    // Flatten mappings to iterate over all capabilities
    const allMappings = Object.values(capabilityMappings).flatMap(
      ({ homeyCapabilities, expose }) => homeyCapabilities.map((cap) => ({ cap, expose })),
    );

    for (const { cap: homeyCapability, expose } of allMappings) {
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
  }

  async setCapability(capability: string, value: any) {
    if (this.hasCapability(capability) && value !== undefined) {
      await this.setCapabilityValue(capability, value)
        .catch((error) => {
          this.log(error, capability, value);
        });
    }
  }

  isStoreUpToDate(): boolean {
    return !!this.store?.capabilityMappings && this.store.storeVersion === STORE_VERSION;
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
    if (!this.bridge?.client?.connected) throw new Error('Bridge is not connected');

    const deviceInfo = this.getDeviceInfo();

    // skip battery devices
    if (deviceInfo?.type === 'device' && deviceInfo.device.power_source === 'Battery') return; 

    const pl = payload || { state: '' };
    await this.bridge.client.publish(`${this.deviceTopic}/get`, JSON.stringify(pl));
    this.log(`${JSON.stringify(pl)} sent by ${source}`);
  }

  async setCommand(payload: any, source: string) {
    if (!this.bridge?.client?.connected) throw Error('Bridge is not connected');
    if (!this.isStoreUpToDate()) throw Error('Store outdated');
    if (!payload) throw Error('setCommand started without payload');

    // get the capability mapping for this command
    const [payLoadArray] = Object.entries(payload);
    const z2mProperty = payLoadArray[0] as string;
    const mapping = this.store.capabilityMappings[z2mProperty];
    if (!mapping) throw Error(`${z2mProperty} capability not supported`);

    const { expose } = mapping;

    // check if command is settable
    const mask = 0b00010;
    const settable = (expose.access & mask) === mask;
    if (!settable) throw Error(`${z2mProperty} capability is not settable`);

    // check if ENUM command is supported by this device
    if (expose.type === 'enum' && expose.values && !expose.values.includes(payLoadArray[1] as string)) {
      throw Error(`${payLoadArray[1]} command not supported`);
    }

    await this.bridge.client.publish(`${this.deviceTopic}/set`, JSON.stringify(payload));
    this.log(`${JSON.stringify(payload)} sent by ${source}`);
  }

  // Set command by Homey capability name (used by flow action cards)
  async setCapabilityCommand(homeyCapability: string, value: any, source: string) {
    if (!this.isStoreUpToDate()) throw Error('Store outdated');

    // Find the Z2M property for this Homey capability
    const entry = Object.entries(this.store.capabilityMappings).find(
      ([, m]) => m.homeyCapabilities.includes(homeyCapability),
    );

    if (!entry) throw Error(`${homeyCapability} capability not mapped`);
    const [foundZ2mProperty, { expose: foundExpose }] = entry;

    const converters = getCapabilityConverters(foundZ2mProperty, foundExpose);
    if (!converters?.homeyToZ2m) throw Error(`${homeyCapability} is not settable`);

    const command = converters.homeyToZ2m(
      { [homeyCapability]: value },
      (cap) => this.getCapabilityValue(cap),
    );
    if (command) {
      await this.setCommand(command, source);
    }
  }

  async setCustomPayload(payload: any, source: string) {
    if (!this.bridge?.client?.connected) throw Error('Bridge is not connected');
    if (!this.isStoreUpToDate()) throw Error('Store outdated');
    if (!payload) throw Error('setCommand started without payload');

    await this.bridge.client.publish(`${this.deviceTopic}/set`, payload);
    this.log(`${payload} sent by ${source}`);
  }

  async checkChangedOrDeleted() {
    const deviceInfo = this.getDeviceInfo();

    if (!deviceInfo) {
      // Device deleted deleted
      this.error(this.zigbee2MqttType, 'was deleted in Zigbee2MQTT', this.settings.friendly_name);
      this.setUnavailable(`${this.zigbee2MqttType} went missing in Zigbee2MQTT`).catch(this.error);
      this.availability = 'offline';
    } else {
      if (!this.isStoreUpToDate()) {
        // Device reappeared or store outdated
        this.log('Store outdated, retrying migration...');
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
              console.log('DEBUG: info', info);
              console.log('DEBUG: topic', topic);
              // console.log(`${this.getName()} update:`, info);
              // this.setAvailable();
              for (const entry of Object.entries<any>(info)) {
                const z2mProperty = entry[0];
                const mapping = this.store.capabilityMappings?.[z2mProperty];
                if (!mapping) {
                  this.log(`Capability ${z2mProperty} not mapped`);
                  continue;
                }

                // Get expose from first element (same for all in multi-cap array)
                const { expose } = mapping;
                const converters = getCapabilityConverters(z2mProperty, expose);
                if (!converters) continue;

                // z2mToHomey returns object keyed by capability name
                const capValues = converters.z2mToHomey(entry[1]);

                for (const [capName, capVal] of Object.entries(capValues)) {
                  // Skip undefined values (multi-cap may return partial updates)
                  if (capVal === undefined) continue;

                  // Add extra triggers for ACTION
                  if (capName === 'action') {
                    if (capVal !== null && capVal !== '') {
                      const tokens = { action: capVal };
                      const state = { event: capVal };
                      this.homey.flow.getDeviceTriggerCard('action_event_received').trigger(this, tokens, state).catch(this.error);
                    }
                    await this.setCapability(capName, '---').catch((error) => this.error(error));
                  }
                  await this.setCapability(capName, capVal).catch((error) => this.error(error));
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

  async registerHomeyEventListeners() {
    if (this.eventListenerBridgeOffline) {
      this.homey.removeListener('bridgeoffline', this.eventListenerBridgeOffline);
    }
    this.eventListenerBridgeOffline = (offline: boolean) => {
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

  async registerListeners() {
    if (!this.capabilityListeners) this.capabilityListeners = {};
    if (!this.isStoreUpToDate()) return;

    for (const [z2mProperty, mapping] of Object.entries(this.store.capabilityMappings)) {
      if (mapping.homeyCapabilities.length > 1) {
        this.registerMultiCapListener(z2mProperty, mapping);
      } else {
        this.registerSingleCapListener(z2mProperty, mapping);
      }
    }
  }

  private registerMultiCapListener(z2mProperty: string, mapping: CapabilityMapping) {
    const listenerKey = `multi_${z2mProperty}`;
    if (this.capabilityListeners[listenerKey]) return;

    const converters = getCapabilityConverters(z2mProperty, mapping.expose);
    if (!converters?.homeyToZ2m) return;

    const deviceCaps = mapping.homeyCapabilities.filter((cap) => this.getCapabilities().includes(cap));
    if (deviceCaps.length === 0) return;

    this.log(`${this.getName()} adding multi-capability listener for ${z2mProperty}: ${deviceCaps.join(', ')}`);
    this.registerMultipleCapabilityListener(
      deviceCaps,
      (changedValues: Record<string, any>) => {
        const command = converters.homeyToZ2m!(changedValues, (cap) => this.getCapabilityValue(cap));
        if (command) this.setCommand(command, 'app').catch((error) => this.error(error));
      },
      500,
    );
    this.capabilityListeners[listenerKey] = true;
  }

  private registerSingleCapListener(z2mProperty: string, mapping: CapabilityMapping) {
    const converters = getCapabilityConverters(z2mProperty, mapping.expose);
    if (!converters?.homeyToZ2m) return;

    const [homeyCapability] = mapping.homeyCapabilities;
    if (!this.getCapabilities().includes(homeyCapability)) return;
    if (this.capabilityListeners[homeyCapability]) return;

    this.log(`${this.getName()} adding capability listener ${homeyCapability}`);
    this.registerCapabilityListener(homeyCapability, (val: any) => {
      const command = converters.homeyToZ2m!({ [homeyCapability]: val }, (cap) => this.getCapabilityValue(cap));
      if (command) this.setCommand(command, 'app').catch((error) => this.error(error));
    });
    this.capabilityListeners[homeyCapability] = true;
  }

  destroyListeners() {
    this.log('removing listeners', this.getName());
    this.bridge.client.removeListener('connect', this.subscribeTopics);
    this.bridge.client.removeListener('message', this.handleMessage);
    if (this.eventListenerBridgeOffline) this.homey.removeListener('bridgeoffline', this.eventListenerBridgeOffline);
  }

}
