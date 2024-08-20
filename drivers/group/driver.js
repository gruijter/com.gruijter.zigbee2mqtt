/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
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

const Zigbee2MQTTDriver = require('../Zigbee2MQTTDriver');
const { mapProperty, mapClassIcon } = require('../../capabilitymap');

module.exports = class ZigbeeGroupDriver extends Zigbee2MQTTDriver {

  async onPair(session) {
    session.setHandler('list_devices', async () => {
      // get all groups from all bridges
      try {
        this.log('Pairing of new Attached group started');
        const bridgeDriver = this.homey.drivers.getDriver('bridge');
        await bridgeDriver.ready(() => null);
        const bridges = bridgeDriver.getDevices();
        if (!bridges || !bridges[0]) {
          throw Error('Cannot find bridge group in Homey. Bridge needs to be added first!');
        }

        const groups = [];
        bridges.forEach((bridge) => {
          bridge.groups
            .filter((item) => item.members.length > 0)
            .forEach((item) => {
              const members = item.members.map((member) => member.ieee_address);
              const devices = bridge.devices.filter((dev) => dev.definition && dev.definition.exposes && members.includes(dev.ieee_address));
              const models = [...new Set(devices.map((dev) => dev.definition.model).filter((n) => n))].join(', ');
              const description = [...new Set(devices.map((dev) => dev.definition.description).filter((n) => n))].join(', ');

              const settings = {
                uid: item.id.toString(),
                friendly_name: item.friendly_name,
                bridge_uid: bridge.getData().id,
                members: item.members,
                models,
                description,
              };
              // map capabilities and group icons to Homey
              const { caps, capDetails } = mapProperty(devices[0]);
              const { homeyClass, icon } = mapClassIcon(devices[0]);
              settings.homeyclass = homeyClass;
              const group = {
                name: item.friendly_name,
                data: {
                  id: item.id, // `zigbee2mqtt_${Math.random().toString(16).substring(2, 8)}`,
                },
                icon, // "/my_icon.svg", // relative to: /drivers/<driver_id>/assets/
                capabilities: [...caps],
                store: { item, capDetails },
                settings,
              };
              groups.push(group);
            });
        });
        return Promise.all(groups);
      } catch (error) {
        this.error(error);
        return Promise.reject(error);
      }
    });
  }

};
/*
[
  {
    friendly_name: 'Hal',
    id: 1,
    members: [
      { endpoint: 11, ieee_address: '0x0017880109XXX' },
      { endpoint: 11, ieee_address: '0x001788010fXXX' },
      { endpoint: 11, ieee_address: '0x001788010fXXX' },
      { endpoint: 11, ieee_address: '0x00178801dfXXX' }
    ],
    scenes: []
  },
  {
    friendly_name: 'Overloop',
    id: 2,
    members: [
      { endpoint: 11, ieee_address: '0x001788010fXXX' },
      { endpoint: 11, ieee_address: '0x00178801dfXXX' },
      { endpoint: 11, ieee_address: '0x001788010fXXX' },
      { endpoint: 11, ieee_address: '0x00178801dfXXX' }
    ],
    scenes: []
  }
]
*/
