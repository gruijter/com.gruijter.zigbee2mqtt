/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/*
Copyright 2023 - 2025, Robin de Gruijter (gruijter@hotmail.com)

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

import Zigbee2MQTTDriver from '../Zigbee2MQTTDriver';
import { mapCapabilities, mapClassAndIcon } from '../../capabilitymap';
import Zigbee2MQTTBridgeDriver from '../bridge/driver';
import Zigbee2MQTTBridge from '../bridge/device';

module.exports = class ZigbeeGroupDriver extends Zigbee2MQTTDriver {

  async onPair(session: any) {
    session.setHandler('list_devices', async () => {
      // get all groups from all bridges
      try {
        this.log('Pairing of new Attached group started');
        const bridgeDriver = this.homey.drivers.getDriver('bridge') as Zigbee2MQTTBridgeDriver;
        await bridgeDriver.ready();
        const bridges = bridgeDriver.getDevices() as Zigbee2MQTTBridge[];
        if (!bridges || !bridges[0]) {
          throw Error('Cannot find bridge group in Homey. Bridge needs to be added first!');
        }

        const groups: any[] = [];
        bridges.forEach((bridge) => {
          bridge.groups
            .filter((group) => group.members.length > 0)
            .forEach((group) => {
              const members = group.members.map((member) => member.ieee_address);
              const devices = bridge.devices.filter((dev) => dev.definition && dev.definition.exposes && members.includes(dev.ieee_address));
              const models = [...new Set(devices.map((dev) => dev.definition.model).filter((n) => n))].join(', ');
              const description = [...new Set(devices.map((dev) => dev.definition.description).filter((n) => n))].join(', ');

              const settings: any = {
                uid: group.id.toString(),
                friendly_name: group.friendly_name,
                bridge_uid: bridge.getData().id,
                members: group.members,
                models,
                description,
              };

              // get all caps with isGroup option (skips linkquality automatically)
              const capabilityMappings = mapCapabilities(devices[0], { isGroup: true });

              const { homeyClass, icon } = mapClassAndIcon(devices[0]);
              settings.homeyclass = homeyClass;

              groups.push({
                name: group.friendly_name,
                data: {
                  id: group.id, // `zigbee2mqtt_${Math.random().toString(16).substring(2, 8)}`,
                },
                icon, // "/my_icon.svg", // relative to: /drivers/<driver_id>/assets/
                capabilities: Object.values(capabilityMappings).map((m) => m.homeyCapability),
                store: { capabilityMappings },
                settings,
              });
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
