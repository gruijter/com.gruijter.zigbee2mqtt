/* eslint-disable max-len */
/* eslint-disable camelcase */
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
const { capabilityMap, mapProperty } = require('../../capabilitymap');

const setTimeoutPromise = util.promisify(setTimeout);

/**
 * Converts hsb data to rgb object.
 * @param {number} hue Hue [0 - 1]
 * @param {number} sat Saturation [0 - 1]
 * @param {number} dim Brightness [0 - 1]
 * @returns {object} RGB object. [0 - 255]
 */
const hsbToRgb = (hue, sat, dim) => {
	let red;
	let green;
	let blue;
	const i = Math.floor(hue * 6);
	const f = hue * 6 - i;
	const p = dim * (1 - sat);
	const q = dim * (1 - f * sat);
	const t = dim * (1 - (1 - f) * sat);
	switch (i % 6) {
		case 0: red = dim; green = t; blue = p;	break;
		case 1: red = q; green = dim; blue = p;	break;
		case 2: red = p; green = dim; blue = t; break;
		case 3: red = p; green = q; blue = dim; break;
		case 4: red = t; green = p; blue = dim; break;
		case 5: red = dim; green = p; blue = q; break;
		default: red = dim; green = dim; blue = dim;
	}
	const r = Math.round(red * 255);
	const g = Math.round(green * 255);
	const b = Math.round(blue * 255);
	const rgbHexString = `${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
	return {
		r, g, b, rgbHexString,
	};
};

class MyDevice extends Device {

	async onInit() {
		try {
			this.store = this.getStore();
			this.settings = await this.getSettings();

			await this.registerHomeyEventListeners();
			await this.connectBridge();
			await this.checkChangedOrDeleted();
			await this.migrate();
			await this.registerListeners();
			await this.getStatus({ state: '' }, 'appInit');

			this.restarting = false;
			this.setAvailable().catch(this.error);
			this.log(this.getName(), 'has been initialized');
		} catch (error) {
			this.error(error);
			this.setUnavailable(error);
			this.restarting = false;
			this.restartDevice(60 * 1000).catch(this.error);
		}
	}

	async onUninit() {
		this.log('Device unInit', this.getName());
		this.destroyListeners();
		await setTimeoutPromise(2000);	// wait 2 secs
	}

	async onAdded() {
		this.log('Device added', this.getName());
		if (this.getClass !== this.getSettings().homeyclass)	{
			this.log(`setting new Class for ${this.getName()}`, this.getSettings().homeyclass);
			await this.setClass(this.getSettings().homeyclass).catch(this.error);
		}
		await this.setCapabilityUnits();
	}

	async onSettings({ newSettings, changedKeys }) { 	// oldSettings changedKeys
		this.log('Settings changed', newSettings);
		if (changedKeys.includes('homeyclass')) {
			this.log(`setting new Class for ${this.getName()}`, this.getClass(), this.getSettings().homeyclass);
			await this.setClass(newSettings.homeyclass).catch(this.error);
		}
		this.restartDevice(1000).catch(this.error);
	}

	async onDeleted() {
		if (this.bridge && this.bridge.client) this.destroyListeners();
		this.log('Device deleted', this.getName());
	}

	async restartDevice(delay) {
		if (this.bridge && this.bridge.client && this.bridge.client.connected) this.destroyListeners();
		if (this.restarting) return;
		this.restarting = true;
		// if (this.client) await this.client.end();
		const dly = delay || 1000 * 5;
		this.log(`Device will restart in ${dly / 1000} seconds`);
		// this.setUnavailable('Device is restarting');
		await setTimeoutPromise(dly);
		this.onInit();
	}

	async migrate() {
		try {
			this.log(`checking device migration for ${this.getName()}`);
			// check and repair incorrect capability(order)
			if (!this.bridge || !this.bridge.devices) return;
			const [deviceInfo] = this.bridge.devices.filter((dev) => dev.ieee_address === this.settings.uid);
			const { caps: correctCaps, capDetails } = mapProperty(deviceInfo);
			await this.setStoreValue('capDetails', { ...capDetails });
			await this.setStoreValue('caps', { ...correctCaps });
			let capsChanged = false;

			// if (this.getName() === 'GU10 LED links') {
			// 	console.dir(deviceInfo, { depth: null });
			// 	console.dir(capDetails, { depth: null });
			// 	console.dir(correctCaps, { depth: null });
			// 	const capDetailsArray = Object.entries(capDetails);
			// 	console.dir(capDetailsArray, { depth: null });
			// }

			// store the capability states before migration
			const sym = Object.getOwnPropertySymbols(this).find((s) => String(s) === 'Symbol(state)');
			const state = this[sym];

			for (let index = 0; index < correctCaps.length; index += 1) {
				const caps = this.getCapabilities();
				const newCap = correctCaps[index];
				if (caps[index] !== newCap) {
					this.setUnavailable('Device is migrating. Please wait!');
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
			if (capsChanged) {
				await this.setCapabilityUnits();
			}
		} catch (error) {
			this.error(error);
		}
	}

	async setCapabilityUnits() {
		try {
			this.log(`setting Capability Units and Titles for ${this.getName()}`);
			this.setUnavailable('Device is migrating. Please wait!');
			const { capDetails } = this.store;
			// console.log(capDetails);
			if (!capDetails) return;
			const capDetailsArray = Object.entries(capDetails);
			// console.dir(capDetailsArray, { depth: null });
			for (let index = 0; index < capDetailsArray.length; index += 1) {
				if (capDetailsArray[index][1]) { // && capDetailsArray[index][1].unit) {
					const capOptions = { };
					if (capDetailsArray[index][1].unit) { capOptions.units = { en: capDetailsArray[index][1].unit }; }
					if (capDetailsArray[index][1].name && !capDetailsArray[index][0].includes('onoff')) {
						const title = capDetailsArray[index][1].name.replace(/./, (c) => c.toUpperCase());
						capOptions.title = { en: title };
					}
					// decimals: dec,
					if (Object.keys(capOptions).length > 0) {
						this.log('Migrating units for', capDetailsArray[index][0], capDetailsArray[index][1].unit, capDetailsArray[index][1].name);
						await this.setCapabilityOptions(capDetailsArray[index][0], capOptions).catch(this.error);
						await setTimeoutPromise(2 * 1000);
					}
				}
			}
			this.restartDevice(1000).catch(this.error);
		} catch (error) {
			this.error(error);
		}
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
		if (this.store && this.store.dev && this.store.dev.power_source === 'Battery') return Promise.resolve(true); // skip battery devices
		const pl = payload || { state: '' };
		await this.bridge.client.publish(`${this.deviceTopic}/get`, JSON.stringify(pl));
		this.log(`${JSON.stringify(pl)} sent by ${source}`);
		return Promise.resolve(true);
	}

	async setCommand(payload, source) {
		if (!this.bridge || !this.bridge.client || !this.bridge.client.connected) throw Error('Bridge is not connected');
		if (!this.store || !this.store.capDetails) throw Error('Store capabilities undefined');
		// get the capDetails for this command
		const [payLoadArray] = Object.entries(payload);
		const capDetail = Object.entries(this.store.capDetails).find((cap) => cap[1].property === payLoadArray[0]);
		if (!capDetail[1]) throw Error(`${payLoadArray[0]} capability not supported`);
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

	// special for color light
	async dimHueSat(values, source) {
		this.log(`${this.getName()} dim/hue/set requested via ${source}`);
		const hue = values.light_hue || this.getCapabilityValue('light_hue');
		const sat = values.light_saturation || this.getCapabilityValue('light_saturation');
		const dim = this.getCapabilityValue('dim');
		const { r, g, b } = hsbToRgb(hue, sat, dim);
		const payload = { color: { r, g, b } };
		await this.bridge.client.publish(`${this.deviceTopic}/set`, JSON.stringify(payload));
		this.log(`${JSON.stringify(payload)} sent by ${source}`);
		return Promise.resolve(true);
	}

	async checkChangedOrDeleted() {
		if (!this.bridge || !this.bridge.devices) return;
		const [deviceInfo] = this.bridge.devices.filter((dev) => dev.ieee_address === this.settings.uid);
		// check deleted
		if (!deviceInfo) {
			this.error('device was deleted in Zigbee2MQTT', this.settings.friendly_name);
			this.setUnavailable('device went missing in Zigbee2MQTT').catch(this.error);
			throw Error('device went missing in Zigbee2MQTT');
		}
		// check for name change
		if (deviceInfo.friendly_name !== this.settings.friendly_name) {
			this.log('device was renamed in Zigbee2MQTT', this.settings.friendly_name, deviceInfo.friendly_name);
			this.setSettings({ friendly_name: deviceInfo.friendly_name }).catch(this.error);
			this.restartDevice(1000).catch(this.error);
		}
	}

	async connectBridge() {
		try {
			await setTimeoutPromise(5000);
			const bridgeDriver = this.homey.drivers.getDriver('bridge');
			await bridgeDriver.ready(() => null);
			if (bridgeDriver.getDevices().length < 1) throw Error('The source bridge device is missing in Homey.');
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
						Object.entries(info).forEach((entry) => {
							// exception for color light
							if (entry[0] === 'color' && this.getCapabilities().includes('light_hue')) {
								if (Object.prototype.hasOwnProperty.call(entry[1], 'hue')) this.setCapability('light_hue', entry[1].hue / 100);
								if (Object.prototype.hasOwnProperty.call(entry[1], 'saturation')) this.setCapability('saturation', entry[1].saturation / 100);
							} else {
								const mapFunc = capabilityMap[entry[0]];
								if (!mapFunc) return;	// not included in Homey maping
								const capVal = mapFunc(entry[1]);
								this.setCapability(capVal[0], capVal[1]);
							}
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
		if (this.eventListenerDeviceListUpdate) this.homey.removeListener('devicelistupdate', this.eventListenerDeviceListUpdate);
		this.eventListenerDeviceListUpdate = async () => {
			// console.log('devicelist update event received');
			this.checkChangedOrDeleted().catch(this.error);
		};
		this.homey.on('devicelistupdate', this.eventListenerDeviceListUpdate);

		if (this.eventListenerBridgeOffline) this.homey.removeListener('bridgeoffline', this.eventListenerBridgeOffline);
		this.eventListenerBridgeOffline = async (offline) => {
			// console.log('bridgeOffline event received');
			if (offline) {
				this.setUnavailable('Bridge is offline').catch(this.error);
				this.bridgeOffline = true;
			}	else {
				if (this.bridgeOffline) this.restartDevice(1000).catch(this.error);
				this.bridgeOffline = false;
			}
		};
		this.homey.on('bridgeoffline', this.eventListenerBridgeOffline);
	}

	// register capability listeners for settable commands
	registerListeners() {
		try {
			if (this.listenersSet) return true;
			// this.log('registering listeners');
			// capabilityListeners will be overwritten, so no need to unregister them

			const capArray = Object.entries(capabilityMap);
			capArray.forEach((map) => {
				const mapFunc = map[1];
				if (mapFunc().length > 2 && this.getCapabilities().includes(mapFunc()[0])) {	// capability setting is mapped and present in device
					this.log(`${this.getName()} adding capability listener ${mapFunc()[0]}`);
					this.registerCapabilityListener(mapFunc()[0], async (val) => {
						const command = mapFunc(val)[2];
						await this.setCommand(command, 'app').catch(this.error);
					});
				}
			});

			// add exception for color light
			if (this.getCapabilities().includes('light_hue')) {
				this.registerMultipleCapabilityListener(['light_hue', 'light_saturation'], (values) => {
					this.dimHueSat(values, 'app').catch(this.error);
				}, 500);
			}

			this.listenersSet = true;
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
		if (this.eventListenerBridgeOffline) this.homey.removeListener('bridgeoffline', this.eventListenerBridgeOffline);
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
