/* eslint-disable no-await-in-loop */
/*
Copyright 2023, Robin de Gruijter (gruijter@hotmail.com)

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

const { Device } = require('homey');
const util = require('util');

const setTimeoutPromise = util.promisify(setTimeout);

class MyDevice extends Device {

	async onInit() {
		try {
			this.store = this.getStore();
			this.settings = await this.getSettings();

			// await this.migrate();
			await this.connectBridge();
			await this.checkChangedOrDeleted();
			await this.registerListeners();
			await this.registerHomeyEventListeners();
			await this.getStatus({ state: '' }, 'appInit');

			this.restarting = false;
			this.setAvailable();
			this.log(this.getName(), 'has been initialized');
		} catch (error) {
			this.error(error);
			this.restartDevice(60 * 1000).catch(this.error);
		}
	}

	async onUninit() {
		this.log('Device unInit', this.getName());
		this.destroyListeners();
		await setTimeoutPromise(2000);	// wait 2 secs
	}

	async setCapabilityUnits() {
		try {
			this.log(`checking device migration for ${this.getName()}`);
			this.setUnavailable('Device is migrating. Please wait!');
			const { capUnits } = this.store;
			const capUnitsArray = Object.entries(capUnits);
			for (let index = 0; index < capUnitsArray.length; index += 1) {
				this.log('Migrating units for', capUnitsArray[index][0], capUnitsArray[index][1]);
				const capOptions = {
					units: { en: capUnitsArray[index][1] },
					// decimals: dec,
				};
				await this.setCapabilityOptions(capUnitsArray[index][0], capOptions).catch(this.error);
				await setTimeoutPromise(2 * 1000);
			}
			this.restartDevice(1000).catch(this.error);
		} catch (error) {
			this.error(error);
		}
	}

	async onAdded() {
		this.log('Device added', this.getName());
		await this.setCapabilityUnits();
	}

	async onSettings({ newSettings }) { 	// oldSettings changedKeys
		this.log('Settings changed', newSettings);
		this.restartDevice(1000).catch(this.error);
	}

	async onDeleted() {
		if (this.bridge && this.bridge.client) this.destroyListeners();
		this.log('Device deleted', this.getName());
	}

	async restartDevice(delay) {
		if (this.bridge && this.bridge.client) this.destroyListeners();
		if (this.restarting) return;
		this.restarting = true;
		// if (this.client) await this.client.end();
		const dly = delay || 1000 * 5;
		this.log(`Device will restart in ${dly / 1000} seconds`);
		// this.setUnavailable('Device is restarting');
		await setTimeoutPromise(dly);
		this.onInit();
	}

	setCapability(capability, value) {
		if (this.hasCapability(capability) && value !== undefined) {
			this.setCapabilityValue(capability, value)
				.catch((error) => {
					this.log(error, capability, value);
				});
		}
	}

	setSetting(setting, value) {
		if (this.settings && this.settings[setting] !== value) {
			const settings = {};
			settings[setting] = value;
			this.log('New setting:', settings);
			this.setSettings(settings, value)
				.catch((error) => {
					this.log(error, setting, value);
				});
		}
	}

	async getStatus(payload, source) {
		if (!this.bridge || !this.bridge.client || !this.bridge.client.connected) return Promise.reject(Error('Bridge is not connected'));
		const pl = payload || { state: '' };
		await this.bridge.client.publish(`${this.deviceTopic}/get`, JSON.stringify(pl));
		this.log(`${JSON.stringify(pl)} sent by ${source}`);
		return Promise.resolve(true);
	}

	async setCommand(payload, source) {
		if (!this.bridge || !this.bridge.client || !this.bridge.client.connected) return Promise.reject(Error('Bridge is not connected'));
		await this.bridge.client.publish(`${this.deviceTopic}/set`, JSON.stringify(payload));
		this.log(`${JSON.stringify(payload)} sent by ${source}`);
		return Promise.resolve(true);
	}

	async checkChangedOrDeleted() {
		if (!this.bridge || !this.bridge.devices) return;
		const deviceInfo = this.bridge.devices.filter((dev) => dev.ieee_address === this.settings.uid);
		// check deleted
		if (!deviceInfo[0]) {
			this.error('device was deleted in Zigbee2MQTT', this.settings.friendly_name);
			this.setUnavailable('device went missing in Zigbee2MQTT');
			throw Error('device went missing in Zigbee2MQTT');
		}
		// check for name change
		if (deviceInfo[0] && deviceInfo[0].friendly_name !== this.settings.friendly_name) {
			this.log('device was renamed in Zigbee2MQTT', this.settings.friendly_name, deviceInfo[0].friendly_name);
			this.setSettings({ friendly_name: deviceInfo[0].friendly_name });
			this.restartDevice(1000).catch(this.error);
		}
	}

	async connectBridge() {
		try {
			await setTimeoutPromise(5000);
			const bridgeDriver = this.homey.drivers.getDriver('bridge');
			await bridgeDriver.ready(() => null);
			const bridge = bridgeDriver.getDevice({ id: this.settings.bridge_uid });
			if (!bridge || !bridge.client) { throw Error('Cannot connect to source bridge device in Homey.'); }
			this.bridge = bridge;

			this.deviceTopic = `${bridge.settings.topic}/${this.settings.friendly_name}`;
			const handleMessage = async (topic, message) => {
				try {
					if (message.toString() === '') return;
					const info = JSON.parse(message);
					// Map the incoming value to a capability or setting
					if (topic.includes(this.deviceTopic)) {
						// console.log(`${this.getName()} update:`, info);
						// this.setAvailable();
						const { capabilityMap } = this.driver.ds;
						Object.entries(info).forEach((entry) => {
							const mapFunc = capabilityMap[entry[0]];
							if (!mapFunc) return;	// not included in Homey maping
							const capVal = mapFunc(entry[1]);
							this.setCapability(capVal[0], capVal[1]);
						});
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
					this.log('mqtt subscriptions ok');
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

	// remove listeners
	destroyListeners() {
		this.log('removing listeners', this.getName());
		this.bridge.client.removeListener('connect', this.subscribeTopics);
		this.bridge.client.removeListener('message', this.handleMessage);
		if (this.eventListenerDeviceListUpdate) this.homey.removeListener('devicelistupdate', this.eventListenerDeviceListUpdate);
	}

	// register homey event listeners
	async registerHomeyEventListeners() {
		if (this.eventListenerDeviceListUpdate) this.homey.removeListener('devicelistupdate', this.eventListenerDeviceListUpdate);
		this.eventListenerDeviceListUpdate = async () => {
			// console.log('devicelist update event received');
			this.checkChangedOrDeleted().catch(this.error);
		};
		this.homey.on('devicelistupdate', this.eventListenerDeviceListUpdate);
	}

	// register capability listeners
	registerListeners() {
		try {
			if (this.listenersSet) return true;
			this.log('registering listeners');

			// capabilityListeners will be overwritten, so no need to unregister them

			this.registerCapabilityListener('onoff', (onoff) => {
				let state = 'OFF';
				if (onoff) state = 'ON';
				this.setCommand({ state }, 'app').catch(this.error);
			});

			// this.registerMultipleCapabilityListener(['charge_target_slow', 'charge_target_fast'], async (values) => {
			// 	const slow = Number(values.charge_target_slow) || Number(this.getCapabilityValue('charge_target_slow'));
			// 	const fast = Number(values.charge_target_fast) || Number(this.getCapabilityValue('charge_target_fast'));
			// 	const targets = { slow, fast };
			// 	this.setChargeTargets(targets, 'app').catch(this.error);
			// }, 10000);

			this.listenersSet = true;
			return Promise.resolve(true);
		} catch (error) {
			return Promise.reject(error);
		}
	}
}

module.exports = MyDevice;

/*
{
	battery: 100,
	battery_low: false,
	contact: true,
	linkquality: 25,
	tamper: false,
	voltage": 3000
}

{
	child_lock: "UNLOCK",
	current: 0,
	energy: 7.12,
	indicator_mode: "off/on",
	linkquality: 218,
	power: 0,
	power_outage_memory: "restore",
	state: "ON",
	update: { installed_version: 192, latest_version: 192, state: idle },
	voltage: 232
}

*/
