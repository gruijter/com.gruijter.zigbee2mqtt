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

import PairSession from 'homey/lib/PairSession';
import Zigbee2MQTTDriver from '../Zigbee2MQTTDriver';
import Zigbee2MQTTBridgeDriver from '../bridge/driver';
import Zigbee2MQTTBridge from '../bridge/device';
import { mapCapabilities, mapClassAndIcon } from '../../capabilitymap';
import { DeviceSettings } from '../../types';

module.exports = class ZigbeeDeviceDriver extends Zigbee2MQTTDriver {

  async onPair(session: PairSession) {
    session.setHandler('list_devices', async () => {
      // get all devices from all bridges
      try {
        this.log('Pairing of new Attached device started');
        const bridgeDriver = this.homey.drivers.getDriver('bridge') as Zigbee2MQTTBridgeDriver;
        await bridgeDriver.ready();
        const bridges = bridgeDriver.getDevices() as unknown as Zigbee2MQTTBridge[];
        if (!bridges || !bridges[0]) {
          throw Error('Cannot find bridge device in Homey. Bridge needs to be added first!');
        }
        const devices: any[] = [];
        bridges.forEach((bridge) => {
          bridge.devices
             // TEMPORARILY DISABLED: Filter devices by definition.exposes
             // .filter((dev) => dev.definition && dev.definition.exposes)
            .forEach((dev) => {
              const capabilityMappings = mapCapabilities(dev);
              const { homeyClass, icon } = mapClassAndIcon(dev);
              const model = dev.definition?.model;

              const SPLIT_DEVICE_MODELS = ['WS-USC04', 'WS-USC02'];

              if (model && SPLIT_DEVICE_MODELS.includes(model)) {
                // --- TOP DEVICE ---
                // Clone mappings
                const mappingsTop = JSON.parse(JSON.stringify(capabilityMappings));
                // Remove Bottom controls
                delete mappingsTop.state_bottom;
                delete mappingsTop.operation_mode_bottom;
                
                // Use distinct ID for Top to allow split
                const idTop = `${dev.ieee_address}_top`;

                const settingsTop: DeviceSettings = {
                  homeyclass: homeyClass,
                  uid: dev.ieee_address, // Shared UID for Z2M lookup
                  friendly_name: dev.friendly_name, // Shared friendly_name for Z2M topic
                  bridge_uid: bridge.getData().id,
                  model: dev.definition?.model,
                  description: dev.definition?.description,
                };

                devices.push({
                  name: `${dev.friendly_name} - TOP`,
                  data: { id: idTop },
                  icon,
                  capabilities: Object.values(mappingsTop).flatMap((m: any) => m.homeyCapabilities),
                  store: { capabilityMappings: mappingsTop },
                  settings: settingsTop,
                });

                // --- BOTTOM DEVICE ---
                const mappingsBottom = JSON.parse(JSON.stringify(capabilityMappings));
                
                // Remove Top controls
                delete mappingsBottom.state_top;
                delete mappingsBottom.operation_mode_top;
                // Remove shared/global stats from Bottom to keep it clean
                delete mappingsBottom.power; 
                delete mappingsBottom.energy;
                delete mappingsBottom.voltage;
                delete mappingsBottom.current;

                // Remap state_bottom to main 'onoff'
                if (mappingsBottom.state_bottom) {
                  mappingsBottom.state_bottom.homeyCapabilities = ['onoff'];
                }

                const idBottom = `${dev.ieee_address}_bottom`;
                
                const settingsBottom: DeviceSettings = {
                    homeyclass: homeyClass,
                    uid: dev.ieee_address,
                    friendly_name: dev.friendly_name,
                    bridge_uid: bridge.getData().id,
                    model: dev.definition?.model,
                    description: dev.definition?.description,
                };

                devices.push({
                  name: `${dev.friendly_name} - BOTTOM`,
                  data: { id: idBottom },
                  icon,
                  capabilities: Object.values(mappingsBottom).flatMap((m: any) => m.homeyCapabilities),
                  store: { capabilityMappings: mappingsBottom },
                  settings: settingsBottom,
                });

              } else {
                // --- STANDARD DEVICE ---
                const settings: DeviceSettings = {
                  homeyclass: homeyClass,
                  uid: dev.ieee_address,
                  friendly_name: dev.friendly_name,
                  bridge_uid: bridge.getData().id,
                  model: dev.definition?.model,
                  description: dev.definition?.description,
                };

                devices.push({
                  name: dev.friendly_name,
                  data: {
                    id: dev.ieee_address, 
                  },
                  icon, 
                  capabilities: Object.values(capabilityMappings).flatMap((m) => m.homeyCapabilities),
                  store: { capabilityMappings },
                  settings,
                });
              }
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
