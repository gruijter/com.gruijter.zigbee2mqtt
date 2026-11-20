/*
Copyright 2023 - 2026, Robin de Gruijter (gruijter@hotmail.com)

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

// Minimal type for manifest flow action entries
interface ManifestFlowAction {
  id: string;
  args?: Array<{ filter?: string }>;
}

// Minimal type for manifest flow condition entries
interface ManifestFlowCondition {
  id: string;
  args?: Array<{ filter?: string }>;
}

module.exports = class MyApp extends Homey.App {

  async onInit() {
    try {
      this.registerFlowListeners();
      this.homey.setMaxListeners(1000); // Support large networks
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

    const actionList = this.manifest.flow.actions as ManifestFlowAction[];

    actionList.forEach((action) => {
      this.log('setting up action listener', action.id);
      this.homey.flow.getActionCard(action.id).registerRunListener(async (args) => {
        if (action.args?.[0]?.filter?.includes('bridge')) {
          const method = (args.device as any)[action.id];
          if (typeof method !== 'function') throw new Error(`Action ${action.id} is not implemented on this device`);
          return method.call(args.device, args.val, 'flow');
        }
        const device = args.device as Zigbee2MQTTDevice;
        if (action.id === 'custom_payload_set') return device.setCustomPayload(args.val, 'flow');
        return device.setCapabilityCommand(action.id, args.val, 'flow');
      });
    });

    // Register condition cards
    this.registerFlowConditions();
  }

  registerFlowConditions() {
    const conditionListeners: Record<string, Homey.FlowCardCondition> = {};
    const conditionList = this.manifest.flow.conditions as ManifestFlowCondition[] | undefined;

    if (!conditionList) return;

    conditionList.forEach((condition) => {
      this.log('setting up condition listener', condition.id);
      conditionListeners[condition.id] = this.homey.flow.getConditionCard(condition.id);
      conditionListeners[condition.id].registerRunListener(async (args) => {
        try {
          const device = args.device as Zigbee2MQTTDevice;
          // Extract capability name from condition id (e.g., "onoff.l1_is_on" -> "onoff.l1")
          const capabilityName = condition.id.replace('_is_on', '');
          const capabilityValue = await device.getCapabilityValue(capabilityName);
          return capabilityValue === true;
        } catch (error) {
          this.error(error);
          return false;
        }
      });
    });
  }

  registerFlowTriggers() {
    // custom trgger cards
    const actionEventReceived = this.homey.flow.getDeviceTriggerCard('action_event_received');
    actionEventReceived.registerRunListener(async (args, state) => {
      return args.event === state.event;
    });
  }

};
