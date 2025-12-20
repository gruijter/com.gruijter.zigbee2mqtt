/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
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

import { Z2MDevice } from '../../types';
import Zigbee2MQTTDevice from '../Zigbee2MQTTDevice';

module.exports = class ZigbeeDevice extends Zigbee2MQTTDevice {
  eventListenerDeviceListUpdate: any;

  getDeviceInfo() {
    if (!this.bridge) throw Error('No bridge, or bridge not ready');
    if (!this.bridge.devices) throw Error('No devices, or devices not ready');

    const allDevices = this.bridge.devices as Z2MDevice[];
    const device = allDevices.filter((dev: any) => dev.ieee_address === this.settings.uid)[0];

    if (!device) {
      this.log('Could not find device with ieee_address', this.settings.uid, 'in bridge devices');
      return null;
    }

    return {
      type: 'device' as const,
      device,
    };
  }

  async onInit() {
    this.zigbee2MqttType = 'Device';
    await super.onInit();
  }

  // register homey event listeners
  async registerHomeyEventListeners() {
    if (this.eventListenerDeviceListUpdate) this.homey.removeListener('devicelistupdate', this.eventListenerDeviceListUpdate);
    this.eventListenerDeviceListUpdate = () => {
      this.checkChangedOrDeleted().catch((error) => this.error(error));
    };
    this.homey.on('devicelistupdate', this.eventListenerDeviceListUpdate);
    await super.registerHomeyEventListeners();
  }

  async migrateStore() {
    let storeChanged = await super.migrateStore();
    const deviceId = this.getData().id as string;
    const mappings = this.getStore().capabilityMappings;

    if (!mappings) return storeChanged; // Should not happen after super.migrateStore()

    if (deviceId.endsWith('_top')) {
      // Filter out bottom capabilities for Top device
      if (mappings.state_bottom || mappings.operation_mode_bottom) {
        this.log('Applying split-device filter for TOP device');
        delete mappings.state_bottom;
        delete mappings.operation_mode_bottom;
        await this.setStoreValue('capabilityMappings', mappings);
        storeChanged = true;
      }
    } else if (deviceId.endsWith('_bottom')) {
      // Filter out top capabilities and shared stats for Bottom device
      const needsMigration = mappings.state_top 
        || mappings.operation_mode_top 
        || mappings.power 
        || mappings.energy
        || mappings.state_bottom?.homeyCapabilities[0] !== 'onoff';

      if (needsMigration) {
        this.log('Applying split-device filter for BOTTOM device');
        delete mappings.state_top;
        delete mappings.operation_mode_top;
        delete mappings.power;
        delete mappings.energy;
        delete mappings.voltage;
        delete mappings.current;
        
        // Remap state_bottom to main 'onoff' capability
        if (mappings.state_bottom) {
          mappings.state_bottom.homeyCapabilities = ['onoff'];
        }

        await this.setStoreValue('capabilityMappings', mappings);
        storeChanged = true;
      }
    }

    if (storeChanged) {
      this.store = this.getStore();
    }

    return storeChanged;
  }

  destroyListeners() {
    super.destroyListeners();
    if (this.eventListenerDeviceListUpdate) this.homey.removeListener('devicelistupdate', this.eventListenerDeviceListUpdate);
  }

};
