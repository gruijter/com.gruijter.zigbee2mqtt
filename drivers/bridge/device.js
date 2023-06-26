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
			this.settings = await this.getSettings();
			this.bridgeTopic = `${this.settings.topic}/bridge`; // default zigbee2mqtt/bridge
			await this.connectBridge();
			this.restarting = false;
			this.setAvailable();
			this.log(this.getName(), 'bridge device has been initialized');
		} catch (error) {
			this.error(error);
			this.restartDevice(60 * 1000).catch(this.error);
		}
	}

	async onUninit() {
		this.log('Device unInit', this.getName());
		if (this.client) await this.client.end();
		await setTimeoutPromise(2000);	// wait 2 secs
	}

	async onAdded() {
		this.log('Device added', this.getName());
	}

	async onSettings({ newSettings }) { 	// oldSettings changedKeys
		this.log('Settings changed', newSettings);
		this.restartDevice(1000).catch(this.error);
	}

	async onDeleted() {
		if (this.client) await this.client.end();
		this.log('Device deleted', this.getName());
	}

	async restartDevice(delay) {
		// this.destroyListeners();
		if (this.restarting) return;
		this.restarting = true;
		if (this.client) await this.client.end();
		const dly = delay || 1000 * 5;
		this.log(`Device will restart in ${dly / 1000} seconds`);
		// this.setUnavailable('Device is restarting');
		await setTimeoutPromise(dly);
		this.onInit();
	}

	// setCapability(capability, value) {
	// 	if (this.hasCapability(capability) && value !== undefined) {
	// 		this.setCapabilityValue(capability, value)
	// 			.catch((error) => {
	// 				this.log(error, capability, value);
	// 			});
	// 	}
	// }

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

	async connectBridge() {
		try {
			if (!this.settings.host) throw Error('No MQTT server configured');
			if (this.client) await this.client.end();

			const handleMessage = async (topic, message) => {
				try {
					this.log(`message received from topic: ${topic}`);
					if (message.toString() === '') return;
					const info = JSON.parse(message);

					// check for online/offline
					if (topic.includes(`${this.bridgeTopic}/state`)) {
						if (info === 'online' || info.state === 'online') {
							this.log('Zigbee2MQTT bridge is connected');
							// this.setAvailable();
						}
						if (info === 'offline' || info.state === 'offline') {
							this.error('Zigbee2MQTT bridge disconnected');
							// this.setUnavailable('Zigbee2MQTT bridge disconnected');
						}
					}

					// get device list
					if (topic.includes(`${this.bridgeTopic}/devices`)) {
						console.log('device list was updated');
						const devices = info.filter((device) => device.type === 'EndDevice' || device.type === 'Router');
						this.devices = devices;
					}

					// check for namechange
					// if (topic.includes(`${this.bridgeTopic}/devices`)) {
					// 	const deviceInfo = info.filter((dev) => dev.ieee_address === this.settings.uid);
					// 	if (!deviceInfo[0]) this.setUnavailable('device went missing in Zigbee2MQTT');
					// 	if (deviceInfo[0] && deviceInfo[0].friendly_name !== this.settings.friendly_name) {
					// 		this.log('device was renamed in Zigbee2MQTT', this.settings.friendly_name, deviceInfo[0].friendly_name);
					// 		this.setSettings({ friendly_name: deviceInfo[0].friendly_name });
					// 		this.restartDevice(1000).catch(this.error);
					// 	}
					// }

				} catch (error) {
					this.error(error);
				}
			};

			const subscribeTopics = async () => {
				try {
					this.log(`Subscribing to ${this.bridgeTopic}/state`);
					await this.client.subscribe([`${this.bridgeTopic}/state`]); // bridge online/offline updates
					this.log(`Subscribing to ${this.bridgeTopic}/devices`);
					await this.client.subscribe([`${this.bridgeTopic}/devices`]); // bridge all devices updates
					this.log('mqtt subscriptions ok');
				} catch (error) {
					this.error(error);
				}
			};

			this.log('connecting to MQTT', this.settings);
			this.client = await this.driver.connectMQTT(this.settings);
			this.client
				.on('error', (error) => { this.error(error); })
				.on('offline', () => { this.log('mqtt broker is offline'); })
				.on('reconnect', () => { this.log('mqtt is trying to reconnect'); })
				.on('close', () => { this.log('mqtt closed (disconnected)'); })
				.on('end', () => { this.log('mqtt client ended'); })
				.on('connect', subscribeTopics)
				.on('message', handleMessage);
			if (this.client.connected) await subscribeTopics();
			return Promise.resolve(true);
		} catch (error) {
			return Promise.reject(error);
		}
	}

}

module.exports = MyDevice;

/*

*/
