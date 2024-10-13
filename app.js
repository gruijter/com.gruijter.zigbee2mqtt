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

const Homey = require('homey');
const { capabilityMap, getExpMap } = require('./capabilitymap');

class MyApp extends Homey.App {
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

    const actionListeners = [];
    const actionList = Homey.manifest.flow.actions;
    const expMap = getExpMap();
    actionList.forEach((action, index) => {
      // actions for bridge
      if (action.args && action.args[0].filter && action.args[0].filter.includes('bridge')) {
        this.log('setting up Bridge action listener', action.id);
        actionListeners[index] = this.homey.flow.getActionCard(action.id);
        actionListeners[index].registerRunListener(async (args) => {
          try {
            await args.device[action.id](args.val, 'flow');
          } catch (error) {
            this.error(error);
          }
        });
      }

      // actions for device or group
      const z2mExp = expMap[action.id];
      const mapFunc = capabilityMap[z2mExp];
      if (!mapFunc) return; // not included in Homey maping
      this.log('setting up action listener', action.id, mapFunc('val')[2]);
      actionListeners[index] = this.homey.flow.getActionCard(action.id);
      actionListeners[index].registerRunListener(async (args) => {
        try {
          await args.device.setCommand(mapFunc(args.val)[2], 'flow');
        } catch (error) {
          this.error(error);
        }
      });
    });
  }

  registerFlowTriggers() {
    // custom trgger cards
    const action_event_received = this.homey.flow.getDeviceTriggerCard('action_event_received');
    action_event_received.registerRunListener(async (args, state) => {
      if (args.event !== state.event) return false;
      this.log(`Device: ${args.device.getName()} - action_event_received ${state.event}`);
      return true;
    });
  }
}

module.exports = MyApp;
