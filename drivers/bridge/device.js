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
			await this.migrate();

			await this.connectBridge();
			await this.registerListeners();
			this.restarting = false;
			this.setAvailable();
			this.log(this.getName(), 'bridge device has been initialized');
		} catch (error) {
			this.error(error);
			this.restarting = false;
			this.restartDevice(60 * 1000).catch(this.error);
		}
	}

	async onUninit() {
		this.log('Device unInit', this.getName());
		await this.destroyListeners();
		await setTimeoutPromise(5000);	// wait 5 secs
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

	async migrate() {
		try {
			this.log(`checking device migration for ${this.getName()}`);
			// store the capability states before migration
			const sym = Object.getOwnPropertySymbols(this).find((s) => String(s) === 'Symbol(state)');
			const state = this[sym];
			// check and repair incorrect capability(order)
			let capsChanged = false;
			const correctCaps = this.driver.ds.deviceCapabilities;
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
			if (capsChanged) this.restartDevice(1 * 1000).catch(this.error);
		} catch (error) {
			this.error(error);
		}
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
						// console.dir(info, { depth: null });
						// console.dir(info.config.devices, { depth: null });

						// check for joining status
						if (info.permit_join !== this.getCapabilityValue('allow_joining')) {
							this.setCapability('allow_joining', info.permit_join);
							this.log('Allow joining:', info.permit_join);
						}
						this.setCapability('allow_joining_timeout', Number(info.permit_join_timeout));

						// check number of joined devices
						if (info.config && info.config.devices) this.setCapability('meter_joined_devices', Object.keys(info.config.devices).length);

						// check for channel, pan_id and version change
						if (info.version !== this.getSettings().version) {
							this.setSettings({ version: info.version });
							const excerpt = `Zigbee2MQTT Bridge was updated to ${info.version}`;
							this.log(excerpt);
							await this.homey.notifications.createNotification({ excerpt });
						}
						if (info.network.pan_id.toString() !== this.getSettings().pan_id) {
							const pid = info.network && info.network.pan_id ? info.network.pan_id.toString() : '';
							this.setSettings({ pan_id: pid });
							const excerpt = `Zigbee2MQTT PanID was changed to ${pid}`;
							this.log(excerpt);
							await this.homey.notifications.createNotification({ excerpt });
						}
						if (info.network.channel.toString() !== this.getSettings().zigbee_channel) {
							const zc = info.network && info.network.channel ? info.network.channel.toString() : '';
							this.setSettings({ zigbee_channel: zc });
							const excerpt = `Zigbee2MQTT channel was changed to ${zc}`;
							this.log(excerpt);
							await this.homey.notifications.createNotification({ excerpt });
						}
					}

					// check for online/offline
					if (topic.includes(`${this.bridgeTopic}/state`)) {
						if (info === 'online' || info.state === 'online') {
							this.log('Zigbee2MQTT bridge is connected');
							// INFORM ALL DEVICES UNAVAILABLE
							this.homey.emit('bridgeoffline', false);
							this.setCapability('alarm_offline', false);
							// this.setAvailable();
						}
						if (info === 'offline' || info.state === 'offline') {
							this.error('Zigbee2MQTT bridge disconnected');
							// INFORM ALL DEVICES AVAILABLE
							this.homey.emit('bridgeoffline', true);
							this.setCapability('alarm_offline', true);
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
					// INFORM ALL DEVICES UNAVAILABLE
					this.homey.emit('bridgeoffline', true);
					this.setCapability('alarm_offline', true);
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
			// this.homey.removeAllListeners('devicelistupdate');
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
