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
	linkquality: (val) => ['measure_linkquality', Number(val)], // 40
	battery: (val) => ['measure_battery', Number(val)], // 100
	power: (val) => ['measure_power', Number(val)], // 100
	current: (val) => ['measure_current', Number(val)], // 100
	voltage: (val) => ['measure_voltage', Number(val)], // 100
	energy: (val) => ['meter_power', Number(val)], // 100

	// Boolean capabilities
	battery_low: (val) => ['alarm_battery', val], // true or false
	contact: (val) => ['alarm_contact', !val], // true or false
	tamper: (val) => ['alarm_tamper', val], // true or false
	state: (val) => ['onoff', val === 'ON'], // true or false

};

// map Zigbee2MQTT device description to Homey icon. First hit is chosen. '(part of) description': 'iconName'.
const iconMap = {
	'door sensor': 'contact.svg',
	plug: 'plug.svg',
};

module.exports = {
	capabilityMap, iconMap,
};
