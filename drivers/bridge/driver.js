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

const { Driver } = require('homey');
const MQTT = require('async-mqtt');
const util = require('util');

const setTimeoutPromise = util.promisify(setTimeout);

const capabilities = [
	'allow_joining',
	'allow_joining_timeout',
	'meter_joined_devices',
	// 'measure_linkquality', // NO WAY TO RETRIEVE RETAINED STATES WITH DEFAULT Z2M CONFIG
	'meter_mpm',
	'alarm_offline',
];

class MyDriver extends Driver {

	async onInit() {
		this.log('zigbee2mqtt bridge driver has been initialized');
		this.ds = { deviceCapabilities: capabilities };
	}

	async onUninit() {
		this.log('driver onUninit');
	}

	async onPair(session) {
		let settings = null;
		let mqttClient = null;
		let discovered = null;

		session.setHandler('mqtt', async (mqttSettings) => {
			try {
				this.log(mqttSettings);
				// Check MQTT settings
				settings = { ...mqttSettings };
				mqttClient = await this.connectMQTT(settings);
				discovered = await this.discoverBridge(mqttClient, settings.topic);
				await mqttClient.end();
				await session.showView('list_devices');
				return Promise.resolve(discovered);
			} catch (error) {
				this.error(error);
				if (mqttClient) mqttClient.end();
				return Promise.reject(error);
			}
		});

		session.setHandler('list_devices', async () => {
			if (!discovered || !discovered.version || !discovered.coordinator) throw Error('Bridge information not available');
			const baseTopic = settings.topic === '' ? 'zigbee2mqtt' : `${settings.topic}`;
			const bridgeSettings = { ...settings };
			bridgeSettings.topic = baseTopic;
			bridgeSettings.version = discovered.version;
			bridgeSettings.uid = discovered.coordinator.ieee_address;
			bridgeSettings.zigbee_channel = discovered.network.channel.toString();
			bridgeSettings.pan_id = discovered.network.pan_id.toString();

			const device = {
				name: `Bridge_${discovered.coordinator.ieee_address}`,
				data: {
					id: discovered.coordinator.ieee_address, // `zigbee2mqtt_${Math.random().toString(16).substring(2, 8)}`,
				},
				capabilities,
				settings: bridgeSettings,
			};
			return [device];
		});

	}

	// returns a connected MQTT client
	async connectMQTT(mqttSettings) {
		try {
			if (!mqttSettings) throw Error('mqttSettings are required');
			const protocol = mqttSettings.tls ? 'mqtts' : 'mqtt';
			const host = `${protocol}://${mqttSettings.host}:${mqttSettings.port}`;
			const options =	{
				clientId: `Homey_${Math.random().toString(16).substring(2, 8)}`,
				username: mqttSettings.username,
				password: mqttSettings.password,
				// protocolId: 'MQTT',
				// protocolVersion: 4,
				rejectUnauthorized: false,
				keepalive: 60,
				reconnectPeriod: 10000,
				clean: true,
				queueQoSZero: false,
			};
			const mqttClient = await MQTT.connectAsync(host, options);
			return Promise.resolve(mqttClient);
		} catch (error) {
			this.error(error);
			return Promise.reject(error);
		}
	}

	// returns bridge info on the MQTT broker
	async discoverBridge(mqttClient, baseTopic) {
		const infoTopic = baseTopic === '' ? 'zigbee2mqtt/bridge/info' : `${baseTopic}/bridge/info`;
		let info = null;
		const messageListener = (topic, message) => {
			info = message;
			try {
				info = JSON.parse(message);
			} catch (error) { this.log(error); }
			this.log('info received from MQTT bridge', topic);
			this.log(info);
		};
		mqttClient.on('message', messageListener);
		await mqttClient.subscribe(infoTopic);
		await setTimeoutPromise(3000);	// wait 3 secs for message
		await mqttClient.unsubscribe(infoTopic);
		await mqttClient.removeListener('message', messageListener);
		if (!info) throw Error('MQTT settings OK, but no Zigbee2MQTT bridge info found.');
		return info;
	}

}

module.exports = MyDriver;

/*

*/
