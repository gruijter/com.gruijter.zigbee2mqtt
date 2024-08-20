/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
/*
Copyright 2023 - 2024, Robin de Gruijter (gruijter@hotmail.com)

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

module.exports = class ZigbeeDevice extends Zigbee2MQTTDevice {

  getDeviceInfo() {
    if (!this.bridge) throw Error('No bridge, or bridge not ready');
    if (!this.bridge.devices) throw Error('No devices, or devices not ready');
    return this.bridge.devices.filter((dev) => dev.ieee_address === this.settings.uid);
  }

  async onInit() {
    this.zigbee2MqttType = 'Device';
    await super.onInit();
  }

  // register homey event listeners
  async registerHomeyEventListeners() {
    if (this.eventListenerDeviceListUpdate) this.homey.removeListener('devicelistupdate', this.eventListenerDeviceListUpdate);
    this.eventListenerDeviceListUpdate = async () => {
      this.checkChangedOrDeleted().catch((error) => this.error(error));
    };
    this.homey.on('devicelistupdate', this.eventListenerDeviceListUpdate);
    await super.registerHomeyEventListeners();
  }

  destroyListeners() {
    super.destroyListeners();
    if (this.eventListenerDeviceListUpdate) this.homey.removeListener('devicelistupdate', this.eventListenerDeviceListUpdate);
  }

};

/*
{
  battery: 100,
  battery_low: false,
  contact: true,
  linkquality: 25,
  tamper: false,
  voltage": 3000
}

{
  child_lock: "UNLOCK",
  current: 0,
  energy: 7.12,
  indicator_mode: "off/on",
  linkquality: 218,
  power: 0,
  power_outage_memory: "restore",
  state: "ON",
  update: { installed_version: 192, latest_version: 192, state: idle },
  voltage: 232
}

*/
