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
import { AsyncMqttClient } from 'async-mqtt';
import {
  DeviceAvailability, Z2MDevice, Z2MGroup, BridgeSettings,
} from '../../types';
import Zigbee2MQTTBridgeDriver from './driver';

const setTimeoutPromise = util.promisify(setTimeout);

export default class Zigbee2MQTTBridge extends Homey.Device {
  settings: BridgeSettings;
  baseTopic: string;
  devices: (Z2MDevice & DeviceAvailability)[];
  msgCounter: number;
  lastMPMUpdate: number;
  restarting: boolean;
  client: AsyncMqttClient;
  endTime: number | null;
  listenersSet: boolean;
  groups: Z2MGroup[];

  async onInit() {
    try {
      this.settings = this.getSettings();
      this.baseTopic = `${this.settings.topic}`; // default zigbee2mqtt
      this.devices = await this.getStoreValue('devices') || [];
      this.msgCounter = 0;
      this.lastMPMUpdate = Date.now();
      await this.destroyListeners();
      await this.migrate();
      await this.connectBridge();
      await this.registerListeners();
      if (this.settings.force_info_log_level) await this.setLogLevel('info', 'onInit');
      this.restarting = false;
      this.setAvailable().catch(this.error);
      this.log(this.getName(), 'bridge device has been initialized');
    } catch (error) {
      this.error(error);
      this.restarting = false;
      this.restartDevice(60 * 1000).catch((error) => this.error(error));
    }
  }

  async onUninit() {
    this.log('Device unInit', this.getName());
    await this.destroyListeners();
    await setTimeoutPromise(5000); // wait 5 secs
  }

  async onAdded() {
    this.log('Device added', this.getName());
  }

  async onSettings({ newSettings }: { newSettings: any }) { // oldSettings changedKeys
    this.log('Settings changed', newSettings);
    this.restartDevice(1000).catch((error) => this.error(error));
  }

  async onDeleted() {
    await this.destroyListeners();
    this.log('Device deleted', this.getName());
  }

  async migrate() {
    try {
      this.log(`checking device migration for ${this.getName()}`);
      // store the capability states before migration
      const sym = Object.getOwnPropertySymbols(this).find((s) => String(s) === 'Symbol(state)');
      const state = sym ? (this as any)[sym] : {};
      // check and repair incorrect capability(order)
      let capsChanged = false;
      const correctCaps = (this.driver as Zigbee2MQTTBridgeDriver).ds.deviceCapabilities;
      for (let index = 0; index < correctCaps.length; index += 1) {
        const caps = this.getCapabilities();
        const newCap = correctCaps[index];
        if (caps[index] !== newCap) {
          this.setUnavailable('Bridge device is migrating. Please wait!').catch(this.error);
          capsChanged = true;
          // remove all caps from here
          for (let i = index; i < caps.length; i += 1) {
            this.log(`removing capability ${caps[i]} for ${this.getName()}`);
            await this.removeCapability(caps[i])
              .catch((error) => this.log(error));
            await setTimeoutPromise(2 * 1000); // wait a bit for Homey to settle
          }
          // add the new cap
          this.log(`adding capability ${newCap} for ${this.getName()}`);
          await this.addCapability(newCap);
          // restore capability state
          if (state[newCap]) this.log(`${this.getName()} restoring value ${newCap} to ${state[newCap]}`);
          // else this.log(`${this.getName()} has gotten a new capability ${newCap}!`);
          if (state[newCap] !== undefined) this.setCapability(newCap, state[newCap]);
          await setTimeoutPromise(2 * 1000); // wait a bit for Homey to settle
        }
      }
      if (capsChanged) this.restartDevice(1 * 1000).catch((error) => this.error(error));
    } catch (error) {
      this.error(error);
    }
  }

  async restartDevice(delay: number) {
    // this.destroyListeners();
    if (this.restarting) return;
    this.restarting = true;
    await this.destroyListeners();
    if (this.client) await this.client.end();
    const dly = delay || 1000 * 5;
    this.log(`Device will restart in ${dly / 1000} seconds`);
    // this.setUnavailable('Device is restarting');
    await setTimeoutPromise(dly);
    this.onInit().catch((error) => this.error(error));
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
      this.setSettings(settings)
        .catch((error) => {
          this.log(error, setting, value);
        });
    }
  }

  async connectBridge() {
    try {
      if (!this.settings.host) throw Error('No MQTT server configured');
      if (this.client) await this.client.end();

      const handleMessage = async (topic: string, message: any) => {
        try {
          // console.log(`message received from topic: ${topic}`);
          if (message.toString() === '') return;
          const info = JSON.parse(message);

          // get bridge info and join permit status
          if (topic.includes(`${this.baseTopic}/bridge/info`)) {
            // console.dir(info, { depth: null });
            // console.dir(info.config.devices, { depth: null });

            // check for joining status
            if (info.permit_join !== this.getCapabilityValue('allow_joining')) {
              this.setCapability('allow_joining', info.permit_join);
              this.log('Allow joining:', info.permit_join);
            }
            // start / reset joining timer
            this.joiningTimer(info.permit_join_end).catch((error) => this.error(error));

            // check number of joined devices
            if (info.config && info.config.devices) this.setCapability('meter_joined_devices', Object.keys(info.config.devices).length);

            // check number of joined groups
            if (info.config && info.config.groups) this.setCapability('meter_joined_groups', Object.keys(info.config.groups).length);

            // check for channel, pan_id and version change
            if (info.version !== this.getSettings().version) {
              this.setSetting('version', info.version);
              const excerpt = `Zigbee2MQTT Bridge was updated to ${info.version}`;
              this.log(excerpt);
              (this.homey.notifications as any).createNotification({ excerpt });
            }
            if (info.network.pan_id.toString() !== this.getSettings().pan_id) {
              const pid = info.network && info.network.pan_id ? info.network.pan_id.toString() : '';
              this.setSetting('pan_id', pid);
              const excerpt = `Zigbee2MQTT PanID was changed to ${pid}`;
              this.log(excerpt);
              (this.homey.notifications as any).createNotification({ excerpt });
            }
            if (info.network.channel.toString() !== this.getSettings().zigbee_channel) {
              const zc = info.network && info.network.channel ? info.network.channel.toString() : '';
              this.setSetting('zigbee_channel', zc);
              const excerpt = `Zigbee2MQTT channel was changed to ${zc}`;
              this.log(excerpt);
              (this.homey.notifications as any).createNotification({ excerpt });
            }
          }

          // check for bridge online/offline
          if (topic.includes(`${this.baseTopic}/bridge/state`)) {
            if (message === 'online' || info.state === 'online') {
              this.log('Zigbee2MQTT bridge is connected');
              // INFORM ALL DEVICES UNAVAILABLE
              this.homey.emit('bridgeoffline', false);
              this.setCapability('alarm_offline', false);
              // this.setAvailable();
            }
            if (message === 'offline' || info.state === 'offline') {
              this.error('Zigbee2MQTT bridge disconnected');
              // INFORM ALL DEVICES AVAILABLE
              this.homey.emit('bridgeoffline', true);
              this.setCapability('alarm_offline', true);
              // this.setUnavailable('Zigbee2MQTT bridge is disconnected');
            }
          }

          // get logging msg/minute
          if (topic.includes(`${this.baseTopic}/bridge/logging`)) {
            if (info.level === 'info'
              && info.message.includes('MQTT publish: topic')
              && !info.message.includes(`${this.baseTopic}/bridge/response`)) {
              // console.log('logging was updated', info);
              this.msgCounter += 1;
              const minutesPassed = (Date.now() - this.lastMPMUpdate) / (60 * 1000);
              if (minutesPassed > 1) {
                this.setCapability('meter_mpm', Math.round((10 * this.msgCounter) / minutesPassed) / 10);
                this.lastMPMUpdate = Date.now();
                this.msgCounter = 0;
              }
            }
          }

          // get device list
          if (topic.includes(`${this.baseTopic}/bridge/devices`)) {
            // console.log('device list was updated', info);
            const devicesInfo = info as (Z2MDevice & DeviceAvailability)[];
            const devices = devicesInfo.filter((device) => device.type === 'EndDevice'
              || device.type === 'Router' || device.type === 'GreenPower');
            // add last known availability state
            devices.forEach((dev) => {
              dev.availability = this.devices.find((oldDev) => oldDev.ieee_address === dev.ieee_address)?.availability;
            });
            this.devices = devices;
            // console.dir(this.devices, { depth: null });
            this.homey.emit('devicelistupdate', true);
          }

          // check for devices online/offline
          if (topic.includes('availability')) {
            const deviceName = topic.split('/').slice(-2, -1)[0];
            const idx = this.devices.findIndex((dev) => dev.friendly_name === deviceName);
            if (idx !== -1) this.devices[idx].availability = info && info.state;
            // console.log(this.devices[idx]);
            const unavailables = this.devices.filter((dev) => dev.availability === 'offline');
            this.setCapability('meter_offline_devices', unavailables.length);
          }

          // get group list
          if (topic.includes(`${this.baseTopic}/bridge/groups`)) {
            // console.log('group list was updated', info);
            this.groups = info;
            // console.dir(this.groups, { depth: null });
            this.homey.emit('grouplistupdate', true);
          }
        } catch (error) {
          this.error(error);
        }
      };

      const subscribeTopics = async () => {
        try {
          this.log(`Subscribing to ${this.baseTopic}/bridge/info`);
          await this.client.subscribe([`${this.baseTopic}/bridge/info`]); // bridge info updates
          this.log(`Subscribing to ${this.baseTopic}/bridge/logging`);
          await this.client.subscribe([`${this.baseTopic}/bridge/logging`]); // bridge logging updates
          this.log(`Subscribing to ${this.baseTopic}/bridge/groups`);
          await this.client.subscribe([`${this.baseTopic}/bridge/groups`]); // bridge all group updates
          this.log(`Subscribing to ${this.baseTopic}/bridge/state`);
          await this.client.subscribe([`${this.baseTopic}/bridge/state`]); // bridge online/offline updates
          this.log(`Subscribing to ${this.baseTopic}/bridge/devices`);
          await this.client.subscribe([`${this.baseTopic}/bridge/devices`]); // bridge all device updates
          this.log(`Subscribing to ${this.baseTopic}/+/availability`);
          await this.client.subscribe([`${this.baseTopic}/+/availability`]); // bridge all devices availability update
          this.log('mqtt bridge subscriptions ok');
        } catch (error) {
          this.error(error);
        }
      };

      const handleDisconnect = async (event: string) => {
        try {
          // if (event === 'error') this.error(err);
          if (event === 'close') this.log('mqtt closed (disconnected)');
          if (event === 'offline') this.log('mqtt broker is offline');
          if (event === 'end') this.log('mqtt client ended');
          // INFORM ALL DEVICES UNAVAILABLE
          this.homey.emit('bridgeoffline', true);
          this.setCapability('alarm_offline', true);
        } catch (error) {
          this.error(error);
        }
      };

      this.log('connecting to MQTT', this.settings);
      this.client = await (this.driver as Zigbee2MQTTBridgeDriver).connectMQTT(this.settings);
      this.client
        .on('error', this.error)
        .on('offline', () => handleDisconnect('offline'))
        .on('close', () => handleDisconnect('close'))
        .on('end', () => handleDisconnect('end'))
        .on('reconnect', () => {
          this.log('mqtt is trying to reconnect');
        })
        .on('connect', subscribeTopics)
        .on('message', handleMessage);
      this.client.setMaxListeners(100); // INCREASE LISTENERS
      if (this.client.connected) await subscribeTopics();
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async joiningTimer(endTime: number | null): Promise<boolean> {
    this.endTime = endTime;
    const timeout = Math.round((new Date(endTime).getTime() - Date.now()) / 1000) % (60 * 60);
    if (endTime && timeout > 0) {
      this.setCapability('allow_joining_timeout', timeout);
      await setTimeoutPromise(1000);
      if (this.endTime) return this.joiningTimer(endTime);
    }
    this.setCapability('allow_joining_timeout', 0);
    return Promise.resolve(true);
  }

  async joinOnOff(onoff: boolean, source: string) {
    if (!this.client || !this.client.connected) return Promise.reject(Error('Bridge is not connected'));
    const payload = { value: onoff, time: 240 * (onoff ? 1 : 0) };
    await this.client.publish(`${this.baseTopic}/bridge/request/permit_join`, JSON.stringify(payload));
    this.log(`Permit_join ${onoff} sent by ${source}`);
    return Promise.resolve(true);
  }

  async setLogLevel(level: string, source: string) {
    if (!this.client || !this.client.connected) return Promise.reject(Error('Bridge is not connected'));
    const payload = { options: { advanced: { log_level: level } } };
    await this.client.publish(`${this.baseTopic}/bridge/request/options`, JSON.stringify(payload));
    this.log(`Log level set to ${level} by ${source}`);
    return Promise.resolve(true);
  }

  async restart(_ignore: unknown, source: string) {
    if (!this.client || !this.client.connected) return Promise.reject(Error('Bridge is not connected'));
    await this.client.publish(`${this.baseTopic}/bridge/request/restart`, '');
    this.log(`Restart Z2M command sent by ${source}`);
    return Promise.resolve(true);
  }

  // remove listeners
  async destroyListeners() {
    try {
      this.log('removing listeners', this.getName());
      // this.homey.removeAllListeners('devicelistupdate');
      // this.homey.removeAllListeners('grouplistupdate');
      // this.homey.removeAllListeners('bridgeoffline');
      if (this.client) await this.client.end();
    } catch (error) {
      this.error(error);
    }
  }

  // register capability listeners
  registerListeners() {
    try {
      if (this.listenersSet) return true;
      this.log('registering listeners');

      // capabilityListeners will be overwritten, so no need to unregister them

      this.registerCapabilityListener('allow_joining', (onoff: boolean) => {
        this.joinOnOff(onoff, 'app').catch((error) => this.error(error));
      });

      this.registerCapabilityListener('restart_bridge', async () => {
        await this.restart(null, 'app').catch((error) => {
          this.error(error);
          throw error;
        });
      });

      this.listenersSet = true;
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }

}

module.exports = Zigbee2MQTTBridge;
