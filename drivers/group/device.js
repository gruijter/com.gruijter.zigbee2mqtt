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

const Zigbee2MQTTDevice = require('../Zigbee2MQTTDevice');

module.exports = class ZigbeeGroup extends Zigbee2MQTTDevice { 

	zigbee2MqttType() {
		return "Group"
	}

	getDeviceInfo() {
		if (!this.bridge || !this.bridge.groups) return;
		return this.bridge.groups.filter((group) => group.id === this.settings.uid);
	}

	// register homey event listeners
	async registerHomeyEventListeners() {
		if (this.eventListenerGroupListUpdate) this.homey.removeListener('grouplistupdate', this.eventListenerGroupListUpdate);
		this.eventListenerGroupListUpdate = async () => {
			this.checkChangedOrDeleted().catch(this.error);
		};
		this.homey.on('grouplistupdate', this.eventListenerGroupListUpdate);

        await super.registerHomeyEventListeners();
	}

	destroyListeners() {
        super.destroyListeners();
		if (this.eventListenerGroupListUpdate) this.homey.removeListener('grouplistupdate', this.eventListenerGroupListUpdate);
	}
}

/*
*/
