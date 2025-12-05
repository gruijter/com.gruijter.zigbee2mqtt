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

import sourceMapSupport from 'source-map-support';
import Homey from 'homey';
import Zigbee2MQTTDevice from './drivers/Zigbee2MQTTDevice';

sourceMapSupport.install();

module.exports = class MyApp extends Homey.App {

  async onInit() {
    try {
      this.registerFlowListeners();
      this.homey.setMaxListeners(100); // INCREASE LISTENERS
      this.registerFlowTriggers();
      this.log('App has been initialized');
    } catch (error) {
      this.error(error);
    }
  }

  async onUninit() {
    this.log('app onUninit');
  }

  registerFlowListeners() {
    // custom action cards
    // const setDimL1 = this.homey.flow.getActionCard('set_dim.l1');
    // setDimL1.registerRunListener((args) => args.device.setCommand({ brightness_l1: Number(args.dim) * 254 }, 'flow'));

    const actionListeners: Record<string, Homey.FlowCardAction> = {};
    const actionList = this.manifest.flow.actions;

    actionList.forEach((action: any) => {
      // actions for bridge
      if (action.args && action.args[0].filter && action.args[0].filter.includes('bridge')) {
        this.log('setting up Bridge action listener', action.id);
        actionListeners[action.id] = this.homey.flow.getActionCard(action.id);
        actionListeners[action.id].registerRunListener(async (args) => {
          try {
            await args.device[action.id](args.val, 'flow');
          } catch (error) {
            this.error(error);
          }
        });
        return; // Skip device/group registration for bridge actions
      }

      // actions for device or group
      this.log('setting up action listener', action.id);
      actionListeners[action.id] = this.homey.flow.getActionCard(action.id);
      actionListeners[action.id].registerRunListener(async (args) => {
        try {
          const device = args.device as Zigbee2MQTTDevice;
          await device.setCapabilityCommand(action.id, args.val, 'flow');
        } catch (error) {
          this.error(error);
        }
      });
    });

    // add custom payload action
    this.log('setting up action listener custom_payload_set');
    actionListeners.custom_payload_set = this.homey.flow.getActionCard('custom_payload_set');
    actionListeners.custom_payload_set.registerRunListener(async (args) => {
      try {
        await args.device.setCustomPayload(args.val, 'flow');
      } catch (error) {
        this.error(error);
      }
    });
  }

  registerFlowTriggers() {
    // custom trgger cards
    const actionEventReceived = this.homey.flow.getDeviceTriggerCard('action_event_received');
    actionEventReceived.registerRunListener(async (args, state) => {
      if (args.event !== state.event) return false;
      return true;
    });
  }

};
