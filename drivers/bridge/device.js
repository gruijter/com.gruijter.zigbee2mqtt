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

			this.msgCounter = 0;
			this.lastMPMUpdate = Date.now();

			await this.destroyListeners();
			await this.connectBridge();
			await this.registerListeners();
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
		await this.destroyListeners();
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
		await this.destroyListeners();
		this.log('Device deleted', this.getName());
	}

	async restartDevice(delay) {
		// this.destroyListeners();
		if (this.restarting) return;
		this.restarting = true;
		await this.destroyListeners();
		if (this.client) await this.client.end();
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

	async connectBridge() {
		try {
			if (!this.settings.host) throw Error('No MQTT server configured');
			if (this.client) await this.client.end();

			const handleMessage = async (topic, message) => {
				try {
					if (message.toString() === '') return;
					const info = JSON.parse(message);
					// console.log(`message received from topic: ${topic}`, info);

					// get bridge info and join permit status
					if (topic.includes(`${this.bridgeTopic}/info`)) {
						// console.log(`${this.getName()} new info`, info);
						this.setCapability('allow_joining', info.permit_join);
						this.setCapability('allow_joining_timeout', Number(info.permit_join_timeout));
						if (info.config && info.config.devices) this.setCapability('meter_joined_devices', Object.keys(info.config.devices).length);
						// console.dir(info.config.devices, { depth: null });
						// add channel pan_id and version change
					}

					// check for online/offline
					if (topic.includes(`${this.bridgeTopic}/state`)) {
						if (info === 'online' || info.state === 'online') {
							this.log('Zigbee2MQTT bridge is connected');
							this.setCapability('alarm_offline', false);
							// INFORM ALL DEVICES UNAVAILABLE
							this.homey.emit('bridgeoffline', false);
							// this.setAvailable();
						}
						if (info === 'offline' || info.state === 'offline') {
							this.error('Zigbee2MQTT bridge disconnected');
							this.setCapability('alarm_offline', true);
							// INFORM ALL DEVICES AVAILABLE
							this.homey.emit('bridgeoffline', true);
							// this.setUnavailable('Zigbee2MQTT bridge is disconnected');
						}
					}

					// get logging msg/minute
					if (topic.includes(`${this.bridgeTopic}/logging`)) {
						// console.log('logging was updated', info.message);
						this.msgCounter += 1;
						const minutesPassed = (Date.now() - this.lastMPMUpdate) / (60 * 1000);
						if (minutesPassed > 1) {
							this.setCapability('meter_mpm', Math.round((10 * this.msgCounter) / minutesPassed) / 10);
							this.lastMPMUpdate = Date.now();
							this.msgCounter = 0;
						}
					}

					// get device list
					if (topic.includes(`${this.bridgeTopic}/devices`)) {
						// console.log('device list was updated', info);
						const devices = info.filter((device) => device.type === 'EndDevice' || device.type === 'Router');
						this.devices = devices;
						// console.dir(this.devices, { depth: null });
						this.homey.emit('devicelistupdate', true);
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
					this.log(`Subscribing to ${this.bridgeTopic}/info`);
					await this.client.subscribe([`${this.bridgeTopic}/info`]); // bridge info updates
					this.log(`Subscribing to ${this.bridgeTopic}/logging`);
					await this.client.subscribe([`${this.bridgeTopic}/logging`]); // bridge logging updates
					this.log(`Subscribing to ${this.bridgeTopic}/state`);
					await this.client.subscribe([`${this.bridgeTopic}/state`]); // bridge online/offline updates
					this.log(`Subscribing to ${this.bridgeTopic}/devices`);
					await this.client.subscribe([`${this.bridgeTopic}/devices`]); // bridge all devices updates
					this.log('mqtt bridge subscriptions ok');
				} catch (error) {
					this.error(error);
				}
			};

			const handleDisconnect = async (event) => {
				try {
					// if (event === 'error') this.error(err);
					if (event === 'close') this.log('mqtt closed (disconnected)');
					if (event === 'offline') this.log('mqtt broker is offline');
					if (event === 'end') this.log('mqtt client ended');
					this.setCapability('alarm_offline', true);
					// INFORM ALL DEVICES UNAVAILABLE
					this.homey.emit('bridgeoffline', true);
				} catch (error) {
					this.error(error);
				}
			};

			this.log('connecting to MQTT', this.settings);
			this.client = await this.driver.connectMQTT(this.settings);
			this.client
				.on('error', this.error)
				.on('offline', () => handleDisconnect('offline'))
				.on('close', () => handleDisconnect('close'))
				.on('end', () => handleDisconnect('end'))
				.on('reconnect', () => { this.log('mqtt is trying to reconnect'); })
				.on('connect', subscribeTopics)
				.on('message', handleMessage);
			this.client.setMaxListeners(100); // INCREASE LISTENERS
			if (this.client.connected) await subscribeTopics();
			return Promise.resolve(true);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async joinOnOff(payload, source) {
		if (!this.client || !this.client.connected) return Promise.reject(Error('Bridge is not connected'));
		await this.client.publish(`${this.bridgeTopic}/request/permit_join`, JSON.stringify(payload));
		this.log(`Permit_join ${JSON.stringify(payload)} sent by ${source}`);
		return Promise.resolve(true);
	}

	// remove listeners
	async destroyListeners() {
		try {
			this.log('removing listeners', this.getName());
			this.homey.removeAllListeners('devicelistupdate');
			this.homey.removeAllListeners('bridgeoffline');
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

			this.registerCapabilityListener('allow_joining', (onoff) => {
				const payload = { value: onoff, time: 240 };
				this.joinOnOff(payload, 'app').catch(this.error);
			});

			this.listenersSet = true;
			return Promise.resolve(true);
		} catch (error) {
			return Promise.reject(error);
		}
	}

}

module.exports = MyDevice;

/*

*/
