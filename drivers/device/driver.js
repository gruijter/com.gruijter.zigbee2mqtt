/* eslint-disable prefer-destructuring */
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
// const util = require('util');
const { capabilityMap, mapProperty, mapClassIcon } = require('../../capabilitymap');

// const setTimeoutPromise = util.promisify(setTimeout);

class MyDriver extends Driver {

	async onInit() {
		this.ds = {
			// deviceCapabilities: capabilities,
			capabilityMap,
		};
		this.log('Device driver has been initialized');
	}

	async onUninit() {
		this.log('driver onUninit');
	}

	async onPair(session) {

		session.setHandler('list_devices', async () => {
			// get all devices from all bridges
			try {
				this.log('Pairing of new Attached device started');
				const bridgeDriver = this.homey.drivers.getDriver('bridge');
				await bridgeDriver.ready(() => null);
				const bridges = bridgeDriver.getDevices();
				if (!bridges || !bridges[0]) { throw Error('Cannot find bridge device in Homey. Bridge needs to be added first!'); }
				const devices = [];
				bridges.forEach((bridge) => {
					bridge.devices
						.filter((dev) => dev.definition && dev.definition.exposes)
						.forEach((dev) => {
							const settings = {
								uid: dev.ieee_address,
								friendly_name: dev.friendly_name,
								bridge_uid: bridge.getData().id,
							};
							if (dev.definition) {
								settings.model = dev.definition.model;
								settings.description = dev.definition.description;
							}
							// map capabilities and device icons to Homey
							const { caps, capDetails } = mapProperty(dev);
							const { homeyClass, icon } = mapClassIcon(dev);
							settings.homeyclass = homeyClass;
							const device = {
								name: dev.friendly_name,
								data: {
									id: dev.ieee_address, // `zigbee2mqtt_${Math.random().toString(16).substring(2, 8)}`,
								},
								icon, // "/my_icon.svg", // relative to: /drivers/<driver_id>/assets/
								capabilities: [...caps],
								store: { dev, capDetails },
								settings,
							};
							devices.push(device);
						});
				});
				// console.dir(devices, { depth: null });
				return Promise.all(devices);
			} catch (error) {
				this.error(error);
				return Promise.reject(error);
			}
		});

	}

}

module.exports = MyDriver;

/*
[
	{
		name: 'contact',
		data: { id: '0xa4c1383863a3de62' },
		capabilities: [
			'alarm_contact',
			'alarm_battery',
			'alarm_tamper',
			'measure_battery',
			'measure_voltage',
			'measure_linkquality'
		],
		settings: { uid: '0xa4c1383863a3de62', friendly_name: 'contact' }
	},
	{
		name: 'plug',
		data: { id: '0xa4c13839adef939a' },
		capabilities: [
			'onoff',
			'measure_power',
			'measure_current',
			'measure_voltage',
			'meter_power',
			'measure_linkquality'
		],
		settings: { uid: '0xa4c13839adef939a', friendly_name: 'plug' }
	}
]

const discovered = [
	{
		date_code: '',
		definition: {
			description: 'Door sensor',
			exposes: [
				{
					access: 1,
					description: 'Indicates if the contact is closed (= true) or open (= false)',
					name: 'contact',
					property: 'contact',
					type: 'binary',
					value_off: true,
					value_on: false,
				},
				{
					access: 1,
					description: 'Indicates if the battery of this device is almost empty',
					name: 'battery_low',
					property: 'battery_low',
					type: 'binary',
					value_off: false,
					value_on: true,
				},
				{
					access: 1,
					description: 'Indicates whether the device is tampered',
					name: 'tamper',
					property: 'tamper',
					type: 'binary',
					value_off: false,
					value_on: true,
				},
				{
					access: 1,
					description: 'Remaining battery in %, can take up to 24 hours before reported.',
					name: 'battery',
					property: 'battery',
					type: 'numeric',
					unit: '%',
					value_max: 100,
					value_min: 0,
				},
				{
					access: 1,
					description: 'Voltage of the battery in millivolts',
					name: 'voltage',
					property: 'voltage',
					type: 'numeric',
					unit: 'mV',
				},
				{
					access: 1,
					description: 'Link quality (signal strength)',
					name: 'linkquality',
					property: 'linkquality',
					type: 'numeric',
					unit: 'lqi',
					value_max: 255,
					value_min: 0,
				},
			],
			model: 'TS0203',
			options: [],
			supports_ota: false,
			vendor: 'TuYa',
		},
		disabled: false,
		endpoints: {
			1: {
				bindings: [
					{
						cluster: 'genPowerCfg',
						target: {
							endpoint: 1,
							ieee_address: '0x00124b0024c17218',
							type: 'endpoint',
						},
					},
				],
				clusters: {
					input: ['genPowerCfg', 'genIdentify', 'ssIasZone', 'genBasic'],
					output: [
						'genIdentify',
						'genGroups',
						'genScenes',
						'genOnOff',
						'genLevelCtrl',
						'touchlink',
						'genOta',
						'genTime',
					],
				},
				configured_reportings: [
					{
						attribute: 'batteryPercentageRemaining',
						cluster: 'genPowerCfg',
						maximum_report_interval: 62000,
						minimum_report_interval: 3600,
						reportable_change: 0,
					},
					{
						attribute: 'batteryVoltage',
						cluster: 'genPowerCfg',
						maximum_report_interval: 62000,
						minimum_report_interval: 3600,
						reportable_change: 0,
					},
				],
				scenes: [],
			},
		},
		friendly_name: 'contakky',
		ieee_address: '0xa4c1383863a3de62',
		interview_completed: true,
		interviewing: false,
		manufacturer: '_TZ3000_26fmupbb',
		model_id: 'TS0203',
		network_address: 35931,
		power_source: 'Battery',
		supported: true,
		type: 'EndDevice',
	},
		{
		"date_code": "",
		"definition": {
			"description": "Smart plug (with power monitoring)",
			"exposes": [
				{
					"features": [
						{
							"access": 7,
							"description": "On/off state of the switch",
							"name": "state",
							"property": "state",
							"type": "binary",
							"value_off": "OFF",
							"value_on": "ON",
							"value_toggle": "TOGGLE"
						}
					],
					"type": "switch"
				},
				{
					"access": 7,
					"description": "Recover state after power outage",
					"name": "power_outage_memory",
					"property": "power_outage_memory",
					"type": "enum",
					"values": [
						"on",
						"off",
						"restore"
					]
				},
				{
					"access": 7,
					"description": "LED indicator mode",
					"name": "indicator_mode",
					"property": "indicator_mode",
					"type": "enum",
					"values": [
						"off",
						"off/on",
						"on/off",
						"on"
					]
				},
				{
					"access": 1,
					"description": "Instantaneous measured power",
					"name": "power",
					"property": "power",
					"type": "numeric",
					"unit": "W"
				},
				{
					"access": 1,
					"description": "Instantaneous measured electrical current",
					"name": "current",
					"property": "current",
					"type": "numeric",
					"unit": "A"
				},
				{
					"access": 1,
					"description": "Measured electrical potential value",
					"name": "voltage",
					"property": "voltage",
					"type": "numeric",
					"unit": "V"
				},
				{
					"access": 1,
					"description": "Sum of consumed energy",
					"name": "energy",
					"property": "energy",
					"type": "numeric",
					"unit": "kWh"
				},
				{
					"features": [
						{
							"access": 3,
							"description": "Enables/disables physical input on the device",
							"name": "state",
							"property": "child_lock",
							"type": "binary",
							"value_off": "UNLOCK",
							"value_on": "LOCK"
						}
					],
					"type": "lock"
				},
				{
					"access": 1,
					"description": "Link quality (signal strength)",
					"name": "linkquality",
					"property": "linkquality",
					"type": "numeric",
					"unit": "lqi",
					"value_max": 255,
					"value_min": 0
				}
			],
			"model": "TS011F_plug_1",
			"options": [
				{
					"access": 2,
					"description": "State actions will also be published as 'action' when true (default false).",
					"name": "state_action",
					"property": "state_action",
					"type": "binary",
					"value_off": false,
					"value_on": true
				},
				{
					"access": 2,
					"description": "Calibrates the power value (percentual offset), takes into effect on next report of device.",
					"name": "power_calibration",
					"property": "power_calibration",
					"type": "numeric"
				},
				{
					"access": 2,
					"description": "Number of digits after decimal point for power, takes into effect on next report of device.",
					"name": "power_precision",
					"property": "power_precision",
					"type": "numeric",
					"value_max": 3,
					"value_min": 0
				},
				{
					"access": 2,
					"description": "Calibrates the current value (percentual offset), takes into effect on next report of device.",
					"name": "current_calibration",
					"property": "current_calibration",
					"type": "numeric"
				},
				{
					"access": 2,
					"description": "Number of digits after decimal point for current, takes into effect on next report of device.",
					"name": "current_precision",
					"property": "current_precision",
					"type": "numeric",
					"value_max": 3,
					"value_min": 0
				},
				{
					"access": 2,
					"description": "Calibrates the voltage value (percentual offset), takes into effect on next report of device.",
					"name": "voltage_calibration",
					"property": "voltage_calibration",
					"type": "numeric"
				},
				{
					"access": 2,
					"description": "Number of digits after decimal point for voltage, takes into effect on next report of device.",
					"name": "voltage_precision",
					"property": "voltage_precision",
					"type": "numeric",
					"value_max": 3,
					"value_min": 0
				},
				{
					"access": 2,
					"description": "Number of digits after decimal point for energy, takes into effect on next report of device.",
					"name": "energy_precision",
					"property": "energy_precision",
					"type": "numeric",
					"value_max": 3,
					"value_min": 0
				},
				{
					"access": 2,
					"description": "Calibrates the energy value (percentual offset), takes into effect on next report of device.",
					"name": "energy_calibration",
					"property": "energy_calibration",
					"type": "numeric"
				}
			],
			"supports_ota": true,
			"vendor": "TuYa"
		},
		"disabled": false,
		"endpoints": {
			"1": {
				"bindings": [
					{
						"cluster": "genOnOff",
						"target": {
							"endpoint": 242,
							"ieee_address": "0x00124b0024c17218",
							"type": "endpoint"
						}
					},
					{
						"cluster": "haElectricalMeasurement",
						"target": {
							"endpoint": 242,
							"ieee_address": "0x00124b0024c17218",
							"type": "endpoint"
						}
					},
					{
						"cluster": "seMetering",
						"target": {
							"endpoint": 242,
							"ieee_address": "0x00124b0024c17218",
							"type": "endpoint"
						}
					}
				],
				"clusters": {
					"input": [
						"genIdentify",
						"genGroups",
						"genScenes",
						"genOnOff",
						"seMetering",
						"haElectricalMeasurement",
						"manuSpecificBosch",
						"manuSpecificTuya_3",
						"genBasic"
					],
					"output": [
						"genOta",
						"genTime"
					]
				},
				"configured_reportings": [
					{
						"attribute": "rmsVoltage",
						"cluster": "haElectricalMeasurement",
						"maximum_report_interval": 3600,
						"minimum_report_interval": 5,
						"reportable_change": 5
					},
					{
						"attribute": "rmsCurrent",
						"cluster": "haElectricalMeasurement",
						"maximum_report_interval": 3600,
						"minimum_report_interval": 5,
						"reportable_change": 50
					},
					{
						"attribute": "activePower",
						"cluster": "haElectricalMeasurement",
						"maximum_report_interval": 3600,
						"minimum_report_interval": 5,
						"reportable_change": 10
					},
					{
						"attribute": "currentSummDelivered",
						"cluster": "seMetering",
						"maximum_report_interval": 3600,
						"minimum_report_interval": 5,
						"reportable_change": [
							1,
							1
						]
					}
				],
				"scenes": []
			},
			"242": {
				"bindings": [],
				"clusters": {
					"input": [],
					"output": [
						"greenPower"
					]
				},
				"configured_reportings": [],
				"scenes": []
			}
		},
		"friendly_name": "0xa4c13839adef939a",
		"ieee_address": "0xa4c13839adef939a",
		"interview_completed": true,
		"interviewing": false,
		"manufacturer": "_TZ3000_gjnozsaz",
		"model_id": "TS011F",
		"network_address": 4422,
		"power_source": "Mains (single phase)",
		"supported": true,
		"type": "Router"
	}
];

*/
