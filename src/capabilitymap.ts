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

import {
  zigbeeHerdsmanConverter, Z2MDevice, CapabilityMappings,
  CapabilityMapEntry,
  CapabilityMapTuple,
  Z2MToHomeyConverter,
  HomeyToZ2MConverter,
} from './types';

// map Z2M exposes and its value to a Homey capability. See https://www.zigbee2mqtt.io/guide/usage/exposes.html
// Z2M exp: [homey_capability, z2mToHomey, homeyToZ2m?] or (exp) => [homey_capability, z2mToHomey, homeyToZ2m?]
// FOR CUSTOM AND SUB CAPABILITIES TRIGGER FLOWS NEED TO BE CREATED IN .homeycompose/flow/triggers
// FOR SETTABLE CUSTOM AND SUB CAPABILITIES ACTION FLOWS NEED TO BE CREATED IN .homeycompose/flow/actions

const capabilityMap: { [key: string]: CapabilityMapEntry } = {
  // Standard Homey Number capabilities
  current_heating_setpoint: ['target_temperature', (v) => Number(v), (v) => ({ current_heating_setpoint: Number(v) })],
  temperature: ['measure_temperature', (v) => Number(v)],
  occupied_heating_setpoint: ['target_temperature.local', (v) => Number(v), (v) => ({ occupied_heating_setpoint: Number(v) })],
  local_temperature: ['measure_temperature.local', (v) => Number(v)],
  device_temperature: ['measure_temperature.device', (v) => Number(v)],
  co: ['measure_co', (v) => Number(v)],
  co2: ['measure_co2', (v) => Number(v)],
  smoke_concentration: ['measure_pm1', (v) => Number(v)],
  pm10: ['measure_pm10', (v) => Number(v)],
  pm25: ['measure_pm25', (v) => Number(v)],
  humidity: ['measure_humidity', (v) => Number(v)],
  soil_moisture: ['measure_humidity.soil', (v) => Number(v)],
  pressure: ['measure_pressure', (v) => Number(v)],
  battery: ['measure_battery', (v) => Number(v)],
  power: ['measure_power', (v) => Number(v)],
  voltage: (exp) => [(exp as zigbeeHerdsmanConverter.Numeric)?.unit === 'V' ? 'measure_voltage' : 'measure_voltage_mv', (v) => Number(v)],
  current: ['measure_current', (v) => Number(v)],
  illuminance: ['measure_luminance', (v) => Number(v)],
  illuminance_lux: ['measure_luminance.lux', (v) => Number(v)],
  water_flow: ['measure_water', (v) => Number(v)],
  energy: ['meter_power', (v) => Number(v)],
  water_consumed: ['meter_water', (v) => Number(v)],
  position: ['windowcoverings_set', (v) => Number(v) / 100, (v) => ({ position: Number(v) * 100 })],
  valve_state: ['valve_state', (v) => Number(v), (v) => ({ valve_state: Number(v) * 100 })],
  target_distance: ['target_distance', (v) => Number(v)],

  // color light related number capabilities
  brightness: ['dim', (v) => Number(v) / 254, (v) => ({ brightness: Number(v) * 254 })],
  brightness_l1: ['dim.l1', (v) => Number(v) / 254, (v) => ({ brightness_l1: Number(v) * 254 })],
  brightness_l2: ['dim.l2', (v) => Number(v) / 254, (v) => ({ brightness_l2: Number(v) * 254 })],
  color_temp: ['light_temperature', (v) => (Number(v) - 153) / 347, (v) => ({ color_temp: 153 + Number(v) * 347 })],
  color_mode: ['light_mode', (v) => (v === 'xy' || v === 'hs' ? 'color' : 'temperature')],
  voc: ['measure_tvoc', (v) => Number(v)],
  voc_index: ['measure_tvoc_index', (v) => Number(v)],
  aqi: ['measure_aqi', (v) => Number(v)],

  // Standard Homey Boolean capabilities
  state: ['onoff', (v) => v === 'ON', (v) => ({ state: v ? 'ON' : 'OFF' })],
  state_l1: ['onoff.l1', (v) => v === 'ON', (v) => ({ state_l1: v ? 'ON' : 'OFF' })],
  state_l2: ['onoff.l2', (v) => v === 'ON', (v) => ({ state_l2: v ? 'ON' : 'OFF' })],
  state_l3: ['onoff.l3', (v) => v === 'ON', (v) => ({ state_l3: v ? 'ON' : 'OFF' })],
  state_l4: ['onoff.l4', (v) => v === 'ON', (v) => ({ state_l4: v ? 'ON' : 'OFF' })],
  state_left: ['onoff.left', (v) => v === 'ON', (v) => ({ state_left: v ? 'ON' : 'OFF' })],
  state_center: ['onoff.center', (v) => v === 'ON', (v) => ({ state_center: v ? 'ON' : 'OFF' })],
  state_right: ['onoff.right', (v) => v === 'ON', (v) => ({ state_right: v ? 'ON' : 'OFF' })],
  backlight_mode: ['onoff.backlight', (v) => v === 'ON', (v) => ({ backlight_mode: v ? 'ON' : 'OFF' })],
  system_mode: ['onoff.system_mode', (v) => v === 'heat', (v) => ({ system_mode: v ? 'heat' : 'off' })], // MOES BHT series thermostat
  indicator: ['onoff.indicator', (v) => v === 'ON', (v) => ({ indicator: v ? 'ON' : 'OFF' })], // TuYa ZG-204ZM presence sensor
  heartbeat: ['onoff.heartbeat', (v) => v === 'ON', (v) => ({ heartbeat: v ? 'ON' : 'OFF' })], // Bosch TwinGuard
  pre_alarm: ['onoff.pre_alarm', (v) => v === 'ON', (v) => ({ pre_alarm: v ? 'ON' : 'OFF' })], // Bosch TwinGuard
  self_test: ['onoff.self_test', (v) => v === 'ON', (v) => ({ self_test: v ? 'ON' : 'OFF' })], // Bosch TwinGuard
  open_window: ['alarm_generic.open_window', (v) => v === 'ON'],

  device_fault: ['alarm_problem', (v) => v],
  vibration: ['alarm_vibration', (v) => v],
  gas: ['alarm_gas', (v) => v],
  occupancy: ['alarm_occupancy', (v) => v],
  presence: ['alarm_presence', (v) => v],
  contact: ['alarm_contact', (v) => !v],
  carbon_monoxide: ['alarm_co', (v) => v],
  tamper: ['alarm_tamper', (v) => v],
  smoke: ['alarm_smoke', (v) => v],
  water_leak: ['alarm_water', (v) => v],
  rain: ['alarm_water.rain', (v) => v],
  battery_low: ['alarm_battery', (v) => v],
  lock: ['locked', (v) => v, (v) => ({ lock: v ? 'LOCK' : 'UNLOCK' })],
  child_lock: ['locked.child', (v) => v === 'LOCK', (v) => ({ child_lock: v ? 'LOCK' : 'UNLOCK' })],
  garage_door_contact: ['garagedoor_closed', (v) => v],

  // Custom number capabilities
  linkquality: ['measure_linkquality', (v) => Number(v)],
  strength: ['meter_strength', (v) => Number(v)],
  angle_x: ['meter_angle_x', (v) => Number(v)],
  angle_y: ['meter_angle_y', (v) => Number(v)],
  angle_z: ['meter_angle_z', (v) => Number(v)],
  x_axis: ['meter_axis_x', (v) => Number(v)],
  y_axis: ['meter_axis_y', (v) => Number(v)],
  z_axis: ['meter_axis_z', (v) => Number(v)],
  action_group: ['action_group', (v) => Number(v)],

  // Custom string capabilities
  action: ['action', (v) => (v || '').toString()],
  running_state: ['running_state', (v) => (v || '').toString()],
  motion_state: ['motion_state', (v) => (v || '').toString()],
  siren_state: ['siren_state', (v) => (v || '').toString()],

  // Custom settable ENUM capabilities
  preset: ['preset', (v) => v, (v) => ({ preset: v })], // ["auto", "manual", "holiday"]
  power_on_behavior: ['power_on_behavior', (v) => v, (v) => ({ power_on_behavior: v })], // [off, on, toggle, previous]
  color_power_on_behavior: ['color_power_on_behavior', (v) => v, (v) => ({ color_power_on_behavior: v })], // [initial, previous, cutomized]
  power_outage_memory: ['power_outage_memory', (v) => v, (v) => ({ power_outage_memory: v })], // [off, on, restore]
  indicator_mode: ['indicator_mode', (v) => v, (v) => ({ indicator_mode: v })], // [off, off/on, on/off, on]
  switch_type: ['switch_type', (v) => v, (v) => ({ switch_type: v })], // [toggle, state, momentary]
  switch_type_l1: ['switch_type.l1', (v) => v, (v) => ({ switch_type_l1: v })], // [toggle, state, momentary]
  switch_type_l2: ['switch_type.l2', (v) => v, (v) => ({ switch_type_l2: v })], // [toggle, state, momentary]
  switch_type_left: ['switch_type.left', (v) => v, (v) => ({ switch_type_left: v })], // [toggle, state, momentary]
  switch_type_center: ['switch_type.center', (v) => v, (v) => ({ switch_type_center: v })], // [toggle, state, momentary]
  switch_type_right: ['switch_type.right', (v) => v, (v) => ({ switch_type_right: v })], // [toggle, state, momentary]
  sensor: ['sensor', (v) => v, (v) => ({ sensor: v })], // ["IN", "AL", "OU"]  // thermostats and mmWave presence
  effect: ['effect', (v) => v, (v) => ({ effect: v })], // [blink, breathe, okay, channel_change, finish_effect, stop_effect]
  alarm: ['alarm_sound', (v) => v, (v) => ({ alarm: v })], // [stop, pre_alarm, fire, burglar]
  sensitivity: ['sensitivity', (v) => v, (v) => ({ sensitivity: v })], // [low, medium, high]
  motion_sensitivity: ['sensitivity.motion', (v) => v, (v) => ({ motion_sensitivity: v })], // [low, medium, high]
  pilot_wire_mode: ['pilot_wire_mode', (v) => v, (v) => ({ pilot_wire_mode: v })], // [comfort, eco, frost_protection, off, comfort_-1, comfort_-2]
};

// Define the skip map for specific device models (model name -> capabilities to skip)
const propertySkipMap: { [model: string]: string[] } = {
  DJT11LM: ['sensitivity'],
  // 'OTHERDEVICE': ['some_property', 'another_property'],
};

// Define the add map for specific device models (model name -> exposes to add)
const propertyAddMap: { [model: string]: zigbeeHerdsmanConverter.Expose[] } = {
  'ICZB-RM11S': [
    {
      access: 1,
      name: 'action group',
      property: 'action_group',
      type: 'numeric',
      unit: '',
    } as zigbeeHerdsmanConverter.Numeric,
  ],
};

/*------------------------------------------------------------------------*/
/* Helper functions
/*------------------------------------------------------------------------*/

function getDeviceModel(device: Z2MDevice): string {
  // Look in definition.model
  if (device.definition?.model) {
    return device.definition.model.trim().toUpperCase();
  }
  // Try model_id
  if (device.model_id) {
    return device.model_id.trim().toUpperCase();
  }
  return '';
}

function resolveCapabilityEntry(entry: CapabilityMapEntry, expose: zigbeeHerdsmanConverter.Expose): CapabilityMapTuple {
  return typeof entry === 'function' ? entry(expose) : entry;
}

export function getCapabailityConverters(z2mProperty: string, expose: zigbeeHerdsmanConverter.Expose): {
  homeyCapability: string, z2mProperty: string,
  z2mToHomey: Z2MToHomeyConverter; homeyToZ2m?: HomeyToZ2MConverter } | null {
  const entry = capabilityMap[z2mProperty];
  if (!entry) return null;

  const [homeyCapability, z2mToHomey, homeyToZ2m] = resolveCapabilityEntry(entry, expose);
  return {
    homeyCapability,
    z2mProperty,
    z2mToHomey,
    homeyToZ2m,
  };
}

export interface MapCapabilitiesOptions {
  /** Whether this is a group (skips linkquality capability) */
  isGroup?: boolean;
}

export function mapCapabilities(device: Z2MDevice, options: MapCapabilitiesOptions = {}): CapabilityMappings {
  const mappings: CapabilityMappings = {};
  const definedHomeyCapabilities = new Set<string>();
  const { isGroup = false } = options;

  // Get the device model for skip/add map lookups
  const modelId = getDeviceModel(device);

  // Get the array of capabilities to skip for this model
  const skipCapabilities = propertySkipMap[modelId] || [];

  // Get additional exposes to add for this model
  const addProperties = propertyAddMap[modelId] || [];

  const addCapability = (expose: zigbeeHerdsmanConverter.Expose) => {
    if (!expose.property) return;

    // Handle color property specially (maps to multiple Homey capabilities)
    if (expose.property === 'color') {
      const colorCapabilities = ['light_hue', 'light_saturation', 'light_mode'];
      colorCapabilities.forEach((capName) => {
        if (!definedHomeyCapabilities.has(capName)) {
          definedHomeyCapabilities.add(capName);
          mappings[`${expose.property}_${capName}`] = { homeyCapability: capName, expose };
        }
      });

      // Also map color_mode if it's not already mapped (implicit for color lights)
      if (!mappings.color_mode) {
        mappings.color_mode = { homeyCapability: 'light_mode', expose };
      }
      return;
    }

    // Handle windowcoverings_set/position: remove onoff capability if present
    if (expose.property === 'windowcoverings_set' || expose.property === 'position') {
      definedHomeyCapabilities.delete('onoff');
      delete mappings['state'];
    }

    const entry = capabilityMap[expose.property];
    if (entry) {
      const [homeyCapability] = resolveCapabilityEntry(entry, expose);

      // Skip linkquality for groups
      if (isGroup && homeyCapability === 'measure_linkquality') {
        return;
      }

      // Skip capabilities in the skip list for this device model
      if (skipCapabilities.includes(homeyCapability)) {
        return;
      }

      if (!definedHomeyCapabilities.has(homeyCapability)) {
        definedHomeyCapabilities.add(homeyCapability);
        mappings[expose.property] = { homeyCapability, expose };
      }
    }
  };

  // Collect all exposes from device definition
  let exposes: zigbeeHerdsmanConverter.Expose[] = [];
  if (device.definition?.exposes) {
    exposes = [...device.definition.exposes];
  }

  // Add model-specific additional properties
  exposes = exposes.concat(addProperties);

  // Process all exposes
  exposes.forEach((expose) => {
    // Process nested features first (e.g., for composite capabilities like light)
    expose.features?.forEach(addCapability);
    addCapability(expose);
  });

  return mappings;
}

export function mapClassAndIcon(device: Z2MDevice) {
  let homeyClass = 'other';
  let icon = '/icons/zigbee.svg';
  if (device.definition?.description) {
    const description = device.definition.description.toLowerCase();
    if (description.includes('switch') || description.includes('plug') || description.includes('outlet')) {
      homeyClass = 'socket';
      icon = '/icons/socket.svg';
    } else if (description.includes('light') || description.includes('lamp') || description.includes('bulb') || description.includes('spot')) {
      homeyClass = 'light';
      icon = '/icons/light.svg';
    } else if (description.includes('motion') || description.includes('presence')) {
      homeyClass = 'sensor';
      icon = '/icons/motion.svg';
    } else if (description.includes('contact') || description.includes('door') || description.includes('window')) {
      homeyClass = 'sensor';
      icon = '/icons/contact.svg';
    } else if (description.includes('temperature') || description.includes('humidity') || description.includes('pressure')) {
      homeyClass = 'sensor';
      icon = '/icons/climate.svg';
    } else if (description.includes('button') || description.includes('remote') || description.includes('click')) {
      homeyClass = 'button';
      icon = '/icons/button.svg';
    }
  }
  return { homeyClass, icon };
}

/*
https://www.zigbee2mqtt.io/supported-devices/
*/
