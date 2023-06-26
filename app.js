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

const Homey = require('homey');

class MyApp extends Homey.App {

	async onInit() {
		// this.registerFlowListeners();
		this.log('App has been initialized');
	}

	async onUninit() {
		this.log('app onUninit');
	}

	registerFlowListeners() {
		// action cards
		const sendCommand = this.homey.flow.getActionCard('send_command');
		sendCommand.registerRunListener((args) => args.device.sendCommand(args.command, 'flow'));

	}
}

module.exports = MyApp;
