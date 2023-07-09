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

// map Z2M exposes and its value to a Homey capability. See https://www.zigbee2mqtt.io/guide/usage/exposes.html
// Z2M exp: (val) => [homey_capability, get_conversion, set_conversion]
const capabilityMap = {
	// Number capabilities
	brightness: (val) => ['dim', Number(val) * (100 / 254), { brightness: Number(val) * (254 / 100) }],
	// : (val) => ['light_hue', Number(val)],
	// : (val) => ['light_saturation', Number(val)],
	color_temp: (val) => ['light_temperature', Number(val)],
	current_heating_setpoint: (val) => ['target_temperature', Number(val), { current_heating_setpoint: Number(val) }],
	temperature: (val) => ['measure_temperature.sensor', Number(val)],
	local_temperature: (val) => ['measure_temperature', Number(val)],
	device_temperature: (val) => ['measure_temperature.device', Number(val)],
	co: (val) => ['measure_co', Number(val)],
	co2: (val) => ['measure_co2', Number(val)],
	smoke_concentration: (val) => ['measure_pm25', Number(val)],
	humidity: (val) => ['measure_humidity', Number(val)],
	soil_moisture: (val) => ['measure_humidity.soil', Number(val)],
	pressure: (val) => ['measure_pressure', Number(val)],
	// : (val) => ['measure_noise', Number(val)],
	// : (val) => ['measure_rain', Number(val)],
	// : (val) => ['measure_wind_strength', Number(val)],
	// : (val) => ['measure_wind_angle', Number(val)],
	// : (val) => ['measure_gust_strength', Number(val)],
	// : (val) => ['measure_gust_angle', Number(val)],
	battery: (val) => ['measure_battery', Number(val)],
	power: (val) => ['measure_power', Number(val)],
	voltage: (val) => ['measure_voltage', Number(val)],
	current: (val) => ['measure_current', Number(val)],
	illuminance: (val) => ['measure_luminance', Number(val)],
	Illuminance_lux: (val) => ['measure_luminance.lux', Number(val)],
	// : (val) => ['measure_ultraviolet', Number(val)],
	// : (val) => ['measure_water', Number(val)],
	energy: (val) => ['meter_power', Number(val)],
	water_consumed: (val) => ['meter_water', Number(val)],
	// : (val) => ['meter_gas', Number(val)]
	// : (val) => ['meter_rain', Number(val)]
	// : (val) => ['volume_set', Number(val)]
	// : (val) => ['windowcoverings_tilt_set', Number(val)]
	// : (val) => ['windowcoverings_set', Number(val)]
	// : (val) => ['speaker_duration', Number(val)]
	// : (val) => ['speaker_position', Number(val)]

	// custom number capabilities
	linkquality: (val) => ['measure_linkquality', Number(val)],
	// custom string capabilities
	// preset: (val) => ['generic_string', (val || '').toString()],	// thermosatat valve mode

	// enum capabilities
	// light_mode
	// vacuumcleaner_state
	// thermostat_mode
	// homealarm_state
	// lock_mode
	// windowcoverings_state
	// speaker_repeat

	// string capabilities
	// : (val) => ['speaker_artist', val],
	// : (val) => ['speaker_album', val],
	// : (val) => ['speaker_track', val],

	// Boolean capabilities
	state: (val) => ['onoff', val === 'ON', { state: val ? 'ON' : 'OFF' }],
	device_fault: (val) => ['alarm_generic.fault', !val],
	vibration: (val) => ['alarm_generic.vibration', !val],
	gas: (val) => ['alarm_generic.gas', !val],
	occupancy: (val) => ['alarm_motion', val],
	presence: (val) => ['alarm_motion.presence', val],
	contact: (val) => ['alarm_contact', !val],
	// : (val) => ['alarm_co2', val],
	carbon_monoxide: (val) => ['alarm_co', val],
	// : (val) => ['alarm_pm25', val],
	tamper: (val) => ['alarm_tamper', val],
	smoke: (val) => ['alarm_smoke', val],
	// : (val) => ['alarm_fire', val],
	// : (val) => ['alarm_heat', val],
	water_leak: (val) => ['alarm_water', val],
	rain: (val) => ['alarm_water.rain', val],
	battery_low: (val) => ['alarm_battery', val],
	// : (val) => ['alarm_night', val],
	// : (val) => ['volume_up', val],	// only settable
	// : (val) => ['volume_down', val], // only settable
	// : (val) => ['volume_mute', val],
	// : (val) => ['channel_up', val], // only settable
	// : (val) => ['channel_down', val], // only settable
	lock: (val) => ['locked', val, { lock: val ? 'LOCK' : 'UNLOCK' }],
	child_lock: (val) => ['locked.child', val === 'LOCK', { child_lock: val ? 'LOCK' : 'UNLOCK' }],
	garage_door_contact: (val) => ['garagedoor_closed', val],
	// : (val) => ['windowcoverings_tilt_up', val], // only settable
	// : (val) => ['windowcoverings_tilt_down', val], // only settable
	// : (val) => ['windowcoverings_closed', val],
	// : (val) => ['button', val], // only settable
	// : (val) => ['speaker_playing', val],
	// : (val) => ['speaker_next', val], // only settable
	// : (val) => ['speaker_previous', val], // only settable
	// : (val) => ['speaker_shuffle', val],
};

// map Z2M device description to Homey class and icon. First hit is chosen. '(part of) description': ['homeyClass', 'iconName']
const classIconMap = {
	'door sensor': ['sensor', 'contact.svg'],
	'radiator valve': ['thermostat', 'radiator_valve.svg'],
	plug: ['socket', 'socket.svg'],
	bulb: ['light', 'light.svg'],
	led: ['light', 'light.svg'],
};

// map capabilities to Homey
const mapProperty = function mapProperty(Z2MDevice) {
	const homeyCapabilities = [];
	const capUnits = {};
	if (Z2MDevice.definition && Z2MDevice.definition.exposes) {
		Z2MDevice.definition.exposes.forEach((exp) => {
			// specific or composite (e.g. light or switch)
			if (exp.features) {
				exp.features.forEach((feature) => {
					const mapFunc = capabilityMap[feature.property];
					if (mapFunc) { 		//  included in Homey mapping
						const capVal = mapFunc();
						homeyCapabilities.push(capVal[0]);
						// if (feature.unit && feature.unit !== '') capUnits[capVal[0]] = feature.unit;
						capUnits[capVal[0]] = [feature.unit, feature.name];
					}
				});
			}
			// generic types (e.g. numeric or binary)
			const mapFunc = capabilityMap[exp.property];
			if (mapFunc) { 		//  included in Homey mapping
				const capVal = mapFunc();
				homeyCapabilities.push(capVal[0]);
				// if (exp.unit && exp.unit !== '') capUnits[capVal[0]] = exp.unit;
				capUnits[capVal[0]] = [exp.unit, exp.name];
			}
		});
	}
	const caps = homeyCapabilities.filter((cap) => cap !== null);
	return { caps, capUnits };
};

const mapClassIcon = function mapClassIcon(Z2MDevice) {
	let icon = 'icon.svg';
	let homeyClass = 'other';
	if (Z2MDevice.definition && Z2MDevice.definition.description) {
		const d = Z2MDevice.definition.description.toLowerCase();
		Object.entries(classIconMap).reverse().forEach((pair) => {
			if (d.includes(pair[0].toLowerCase())) {
				icon = pair[1][1];
				homeyClass = pair[1][0];
			}
		});
	}
	return { homeyClass, icon };
};

module.exports = {
	capabilityMap, classIconMap, mapProperty, mapClassIcon,
};

/*
https://www.zigbee2mqtt.io/supported-devices/
*/
