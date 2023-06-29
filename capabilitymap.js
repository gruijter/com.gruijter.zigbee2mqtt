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

// map Zigbee2MQTT exposes and its value to a Homey capability. See https://www.zigbee2mqtt.io/guide/usage/exposes.html
const capabilityMap = {
	// Number capabilities
	brightness: (val) => ['dim', Number(val) * (100 / 254)],	// also settable
	// : (val) => ['light_hue', Number(val)],
	// : (val) => ['light_saturation', Number(val)],
	color_temp: (val) => ['light_temperature', Number(val)],
	current_heating_setpoint: (val) => ['target_temperature', Number(val)], // also settable
	temperature: (val) => ['measure_temperature', Number(val)],
	local_temperature: (val) => ['measure_temperature', Number(val)],
	co: (val) => ['measure_co', Number(val)],
	co2: (val) => ['measure_co2', Number(val)],
	smoke_concentration: (val) => ['measure_pm25', Number(val)],
	humidity: (val) => ['measure_humidity', Number(val)],
	soil_moisture: (val) => ['measure_humidity', Number(val)],
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
	Illuminance_lux: (val) => ['measure_luminance', Number(val)],
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
	state: (val) => ['onoff', val === 'ON'],
	device_fault: (val) => ['alarm_generic', !val],
	vibration: (val) => ['alarm_generic', !val],
	gas: (val) => ['alarm_generic', !val],
	occupancy: (val) => ['alarm_motion', val],
	contact: (val) => ['alarm_contact', !val],
	// : (val) => ['alarm_co2', val],
	carbon_monoxide: (val) => ['alarm_co', val],
	// : (val) => ['alarm_pm25', val],
	tamper: (val) => ['alarm_tamper', val],
	smoke: (val) => ['alarm_smoke', val],
	// : (val) => ['alarm_fire', val],
	// : (val) => ['alarm_heat', val],
	water_leak: (val) => ['alarm_water', val],
	rain: (val) => ['alarm_water', val],
	battery_low: (val) => ['alarm_battery', val],
	// : (val) => ['alarm_night', val],
	// : (val) => ['volume_up', val],	// only settable
	// : (val) => ['volume_down', val], // only settable
	// : (val) => ['volume_mute', val],
	// : (val) => ['channel_up', val], // only settable
	// : (val) => ['channel_down', val], // only settable
	lock: (val) => ['locked', val],
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

// map Zigbee2MQTT device description to Homey icon. First hit is chosen. '(part of) description': 'iconName'.
const iconMap = {
	'door sensor': 'contact.svg',
	plug: 'plug.svg',
};

module.exports = {
	capabilityMap, iconMap,
};

/*
https://www.zigbee2mqtt.io/supported-devices/
*/
