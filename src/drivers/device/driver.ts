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
import { mapProperty, mapClassIcon } from '../../capabilitymap';

module.exports = class ZigbeeDeviceDriver extends Zigbee2MQTTDriver {

  async onPair(session: any) {
    session.setHandler('list_devices', async () => {
      // get all devices from all bridges
      try {
        this.log('Pairing of new Attached device started');
        const bridgeDriver = this.homey.drivers.getDriver('bridge') as any;
        await bridgeDriver.ready();
        const bridges = bridgeDriver.getDevices();
        if (!bridges || !bridges[0]) {
          throw Error('Cannot find bridge device in Homey. Bridge needs to be added first!');
        }
        const devices: any[] = [];
        bridges.forEach((bridge: any) => {
          bridge.devices
            .filter((dev: any) => dev.definition && dev.definition.exposes)
            .forEach((dev: any) => {
              const settings: any = {
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
        return Promise.all(devices);
      } catch (error) {
        this.error(error);
        return Promise.reject(error);
      }
    });
  }

};
