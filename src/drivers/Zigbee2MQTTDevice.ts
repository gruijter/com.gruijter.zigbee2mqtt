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
import { capabilityMap, mapProperty } from '../capabilitymap';

const setTimeoutPromise = util.promisify(setTimeout);

/**
 * Converts hsb data to rgb object.
 * @param {number} hue Hue [0 - 1]
 * @param {number} sat Saturation [0 - 1]
 * @param {number} dim Brightness [0 - 1]
 * @returns {object} RGB object. [0 - 255]
 */
const hsbToRgb = (hue: number, sat: number, dim: number) => {
  let red;
  let green;
  let blue;
  const i = Math.floor(hue * 6);
  const f = hue * 6 - i;
  const p = dim * (1 - sat);
  const q = dim * (1 - f * sat);
  const t = dim * (1 - (1 - f) * sat);
  switch (i % 6) {
    case 0:
      red = dim;
      green = t;
      blue = p;
      break;
    case 1:
      red = q;
      green = dim;
      blue = p;
      break;
    case 2:
      red = p;
      green = dim;
      blue = t;
      break;
    case 3:
      red = p;
      green = q;
      blue = dim;
      break;
    case 4:
      red = t;
      green = p;
      blue = dim;
      break;
    case 5:
      red = dim;
      green = p;
      blue = q;
      break;
    default:
      red = dim;
      green = dim;
      blue = dim;
  }
  const r = Math.round(red * 255);
  const g = Math.round(green * 255);
  const b = Math.round(blue * 255);
  const rgbHexString = `${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  return {
    r,
    g,
    b,
    rgbHexString,
  };
};

export default abstract class Zigbee2MQTTDevice extends Homey.Device {
  store: any;
  settings: any;
  bridge: any;
  deviceTopic: string;
  restarting: boolean;
  availability: string;
  zigbee2MqttType: string;
  eventListenerBridgeOffline: any;
  bridgeOffline: boolean;
  capabilityListeners: any;
  handleMessage: any;
  subscribeTopics: any;

  abstract getDeviceInfo(): any;

  async onInit() {
    try {
      this.store = this.getStore();
      this.settings = this.getSettings();
      await setTimeoutPromise(2000);
      await this.connectBridge();
      await setTimeoutPromise(2000);
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
      // check and repair incorrect capability(order)

      const [deviceInfo] = this.getDeviceInfo();
      if (!deviceInfo) return Promise.resolve(false);

      const { caps: correctCapsFromMap, capDetails } = mapProperty(deviceInfo);
      await this.setStoreValue('capDetails', { ...capDetails });
      await this.setStoreValue('caps', { ...correctCapsFromMap });

      // store the capability states before migration
      const sym = Object.getOwnPropertySymbols(this).find((s) => String(s) === 'Symbol(state)');
      const state = sym ? (this as any)[sym] : {};
      // check and repair incorrect capability(order)
      let capsChanged = false;
      // check if we need to add capabilities
      let correctCaps: string[] = [];
      if (this.driver) {
        correctCaps = (this.driver as any).ds && (this.driver as any).ds.deviceCapabilities ? (this.driver as any).ds.deviceCapabilities : [];
      }

      for (let index = 0; index < correctCaps.length; index += 1) {
        const caps = this.getCapabilities();
        const newCap = correctCaps[index];
        if (caps[index] !== newCap) {
          this.setUnavailable(`${this.zigbee2MqttType} is migrating. Please wait!`).catch(this.error);
          // remove all caps from here
          for (let i = index; i < caps.length; i += 1) {
            this.log(`removing capability ${caps[i]} for ${this.getName()}`);
            await this.removeCapability(caps[i]).catch((error) => this.log(error));
            await setTimeoutPromise(2 * 1000).catch((error) => this.log(error)); // wait a bit for Homey to settle
          }
          // add the new cap
          this.log(`adding capability ${newCap} for ${this.getName()}`);
          await this.addCapability(newCap).catch((error) => this.log(error));
          // restore capability state
          if (state[newCap]) this.log(`${this.getName()} restoring value ${newCap} to ${state[newCap]}`);
          // else this.log(`${this.getName()} has gotten a new capability ${newCap}!`);
          if (state[newCap] !== undefined) this.setCapability(newCap, state[newCap]).catch((error) => this.error(error));
          await setTimeoutPromise(2 * 1000).catch((error) => this.log(error)); // wait a bit for Homey to settle
        }
      }
      await this.setCapabilityUnits();
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async setCapabilityUnits() {
    try {
      this.log(`Checking Capability Units and Titles for ${this.getName()}`);
      this.setUnavailable(`${this.zigbee2MqttType} is migrating. Please wait!`).catch(this.error);
      let unitsChanged = false;
      const { capDetails } = this.store;
      // console.log(this.getName(), capDetails);

      if (!capDetails) return;
      const capDetailsArray = Object.entries<any>(capDetails);
      // console.dir(capDetailsArray, { depth: null });
      for (let index = 0; index < capDetailsArray.length; index += 1) {
        if (capDetailsArray[index][1]) {
          // && capDetailsArray[index][1].unit) {
          const capOptions: any = {};

          if (capDetailsArray[index][1].unit) {
            capOptions.units = { en: capDetailsArray[index][1].unit };
          }
          if (capDetailsArray[index][1].name && !capDetailsArray[index][0].includes('onoff')) {
            const title = capDetailsArray[index][1].name.replace(/./, (c) => c.toUpperCase());
            capOptions.title = { en: title };
          }
          // decimals: dec,
          if (Object.keys(capOptions).length > 0) {
            // check if the unit or name changed for this capability
            let currentCapOptions: any = {};
            try {
              currentCapOptions = this.getCapabilityOptions(capDetailsArray[index][0]);
            } catch (error) {
              this.log(`${this.getName()} has no capability options set for ${capDetailsArray[index][0]}`);
            }
            // console.log(this.getName(), capDetailsArray[index][0], currentCapOptions);
            if (currentCapOptions.unit !== capOptions.unit || currentCapOptions.name !== capOptions.name) {
              unitsChanged = true;
              this.log('Migrating unit and title for', capDetailsArray[index][0], capDetailsArray[index][1].unit, capDetailsArray[index][1].name);
              await this.setCapabilityOptions(capDetailsArray[index][0], capOptions).catch(this.error);
              await setTimeoutPromise(2 * 1000).catch((error) => this.log(error));
            }
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

    // also set the value to the store, so it is available after reboot
    this.setStoreValue(capability, value)
      .catch((error) => {
        this.log(error, capability, value);
      });
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
    if (this.store && this.store.dev && this.store.dev.power_source === 'Battery') return Promise.resolve(true); // skip battery devices
    const pl = payload || { state: '' };
    await this.bridge.client.publish(`${this.deviceTopic}/get`, JSON.stringify(pl));
    this.log(`${JSON.stringify(pl)} sent by ${source}`);
    return Promise.resolve(true);
  }

  async setCommand(payload: any, source: string) {
    if (!this.bridge || !this.bridge.client || !this.bridge.client.connected) throw Error('Bridge is not connected');
    if (!this.store || !this.store.capDetails) throw Error('Store capabilities undefined');
    if (!payload) throw Error('setCommand started without payload');
    // get the capDetails for this command
    const [payLoadArray] = Object.entries(payload);
    const capDetail = Object.entries<any>(this.store.capDetails).find((cap: any) => cap[1].property === payLoadArray[0]);
    if (!capDetail || !capDetail[1]) throw Error(`${payLoadArray[0]} capability not supported`);
    // check if command is settable
    const mask = 0b00010;
    const { access } = capDetail[1];
    // eslint-disable-next-line no-bitwise
    const settable = (access & mask) === mask;
    if (!settable) throw Error(`${payLoadArray[0]} capability is not settable`);
    // check if ENUM command is supported by this device
    if (capDetail[1].values && !capDetail[1].values.includes(payLoadArray[1])) throw Error(`${payLoadArray[1]} command not supported`);
    await this.bridge.client.publish(`${this.deviceTopic}/set`, JSON.stringify(payload));
    this.log(`${JSON.stringify(payload)} sent by ${source}`);
    return Promise.resolve(true);
  }

  async setCustomPayload(payload: any, source: string) {
    if (!this.bridge || !this.bridge.client || !this.bridge.client.connected) throw Error('Bridge is not connected');
    if (!this.store || !this.store.capDetails) throw Error('Store capabilities undefined');
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
    if (this.store.capDetails && this.store.capDetails.light_mode && this.store.capDetails.light_mode.name === 'color_hs') {
      return { color: { hue: 360 * hue, saturation: 100 * sat } };
    }
    const dim = this.getCapabilityValue('dim');
    const { r, g, b } = hsbToRgb(hue, sat, dim);
    return { color: { r, g, b } };
  }

  async checkChangedOrDeleted() {
    const [deviceInfo] = this.getDeviceInfo();
    if (!deviceInfo) return;
    // check deleted
    if (!deviceInfo) {
      this.error(this.zigbee2MqttType, 'was deleted in Zigbee2MQTT', this.settings.friendly_name);
      this.setUnavailable(`${this.zigbee2MqttType} went missing in Zigbee2MQTT`).catch(this.error);
      throw Error(`${this.zigbee2MqttType} went missing in Zigbee2MQTT`);
    }
    // check for name change
    if (deviceInfo.friendly_name !== this.settings.friendly_name) {
      this.log(this.zigbee2MqttType, 'was renamed in Zigbee2MQTT', this.settings.friendly_name, deviceInfo.friendly_name);
      this.setSetting('friendly_name', deviceInfo.friendly_name);
      this.restartDevice(1000).catch((error) => this.error(error));
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
                  const mapFunc = capabilityMap[entry[0]];
                  if (mapFunc) { //  included in Homey mapping
                    const exp = Object.values(this.store.capDetails).find((item: any) => item.property === entry[0]);
                    const capVal = mapFunc(entry[1], exp);
                    // Add extra triggers for ACTION
                    if (capVal[0] === 'action') {
                      // Action event received
                      if (capVal[1] !== null && capVal[1] !== undefined && capVal[1] !== '') {
                        const tokens = { action: capVal[1] };
                        const state = { event: capVal[1] };
                        this.homey.flow.getDeviceTriggerCard('action_event_received').trigger(this, tokens, state).catch(this.error);
                      }
                      // Original extra action trigger
                      this.setCapability(capVal[0], '---').catch((error) => this.error(error));
                    }
                    this.setCapability(capVal[0], capVal[1]).catch((error) => this.error(error));
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
      const capArray = Object.entries(capabilityMap);
      capArray.forEach((map) => {
        const mapFunc = map[1];
        const capabilityName = mapFunc()[0];
        if (mapFunc().length > 2 && this.getCapabilities().includes(capabilityName)) {
          // capability setting is mapped and present in device
          if (!this.capabilityListeners[capabilityName]) {
            this.log(`${this.getName()} adding capability listener ${capabilityName}`);
            this.registerCapabilityListener(mapFunc()[0], (val: any) => {
              const command = mapFunc(val)[2];
              this.setCommand(command, 'app').catch((error) => this.error(error));
              return Promise.resolve();
            });
            this.capabilityListeners[capabilityName] = true;
          }
        }
      });
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

};
