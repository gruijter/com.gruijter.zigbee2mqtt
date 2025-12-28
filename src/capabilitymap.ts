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
  CapabilityMap,
  AnyCapabilityMap,
  CapabilityConverters,
  SingleCapabilityMap,
} from './types';
import { hsToXy, xyYToHueSat } from './utilities';

/*
 * Capability Map
 * ==============
 * Maps Z2M exposes to Homey capabilities.
 * See https://www.zigbee2mqtt.io/guide/usage/exposes.html
 *
 * SYNTAX
 * ------
 * Each entry can be:
 *   - A static tuple/object
 *   - A function (expose) => tuple/object for dynamic mapping
 *
 * Single Capability (tuple):
 *   [homeyCapability, z2mToHomey, homeyToZ2m?]
 *   Example: brightness: ['dim', (v) => v / 254, (v) => ({ brightness: v * 254 })]
 *
 * Multi-Capability (object):
 *   {
 *     caps: ['cap1', 'cap2', ...],
 *     z2mToHomey: (z2mValue, z2mState) => ({ cap1: val1, cap2: val2, ... }),
 *     homeyToZ2m?: (values, getCapValue) => z2mPayload
 *   }
 *   Example: color maps to light_hue, light_saturation, light_mode
 *
 * NOTES
 * -----
 * - For custom/sub capabilities, create trigger flows in .homeycompose/flow/triggers
 * - For settable custom/sub capabilities, create action flows in .homeycompose/flow/actions
 * - The only file to modify to add device support is this capabilitymap
 */

const capabilityMap: { [key: string]: CapabilityMapEntry } = {
  // Standard Homey Number capabilities
  current_heating_setpoint: ['target_temperature', (v) => Number(v), (v) => ({ current_heating_setpoint: Number(v) })],
  temperature: ['measure_temperature', (v) => Number(v)],
  occupied_heating_setpoint: ['target_temperature.local', (v) => Number(v), (v) => ({ occupied_heating_setpoint: Number(v) })],
  local_temperature: ['measure_temperature.local', (v) => Number(v)],
  frost_protection_temperature: ['target_temperature.frost_protection', (v) => Number(v), (v) => ({ frost_protection_temperature: Number(v) })],
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

  // Color light related number capabilities
  brightness: ['dim', (v) => Number(v) / 254, (v) => ({ brightness: Number(v) * 254 })],
  brightness_l1: ['dim.l1', (v) => Number(v) / 254, (v) => ({ brightness_l1: Number(v) * 254 })],
  brightness_l2: ['dim.l2', (v) => Number(v) / 254, (v) => ({ brightness_l2: Number(v) * 254 })],
  color_temp: ['light_temperature', (v) => (Number(v) - 153) / 347, (v) => ({ color_temp: 153 + Number(v) * 347 })],
  color: (expose) => ({
    caps: ['light_hue', 'light_saturation', 'light_mode'],
    z2mToHomey: ({
      hue, saturation, x, y,
    }, { color_mode: colorMode }) => {
      let lightHue: number | undefined;
      let lightSaturation: number | undefined;

      if (x !== undefined && y !== undefined) {
        const hsFromXy = xyYToHueSat(x, y);
        lightHue = hsFromXy.hue / 360;
        lightSaturation = hsFromXy.saturation / 100;
      } else {
        lightHue = hue !== undefined ? hue / 360 : undefined;
        lightSaturation = saturation !== undefined ? saturation / 100 : undefined;
      }

      return {
        light_hue: lightHue,
        light_saturation: lightSaturation,
        light_mode: colorMode === 'color_temp' ? 'temperature' : 'color',
      };
    },
    homeyToZ2m: (values) => {
      const lightMode = values.light_mode;
      if (lightMode === 'temperature') return null;

      if (expose.name === 'color_hs') {
        return {
          color: {
            hue: values.light_hue * 360,
            saturation: values.light_saturation * 100,
          },
        };
      }
      const { x, y } = hsToXy(values.light_hue, values.light_saturation);
      return { color: { x, y } };
    },
  }),

  // Air Quality capabilities
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

function resolveCapabilityEntry(
  entry: CapabilityMapEntry,
  expose: zigbeeHerdsmanConverter.Expose,
): CapabilityMap {
  const tuple: AnyCapabilityMap = typeof entry === 'function' ? entry(expose) : entry;

  if (Array.isArray(tuple)) {
    // Normalize single-cap tuple to multi-cap format
    const [cap, z2mToHomey, homeyToZ2m] = tuple as SingleCapabilityMap;
    return {
      caps: [cap],
      z2mToHomey: (z2mVal, z2mState) => {
        const result = z2mToHomey(z2mVal, z2mState);
        if (result === null) return null;
        return { [cap]: result };
      },
      homeyToZ2m: homeyToZ2m ? (vals, getCapValue) => homeyToZ2m(vals[cap], getCapValue) : undefined,
    };
  }
  return tuple;
}

export function getCapabilityConverters(z2mProperty: string, expose: zigbeeHerdsmanConverter.Expose): CapabilityConverters | null {
  const entry = capabilityMap[z2mProperty];
  if (!entry) return null;

  const { caps: homeyCapabilities, z2mToHomey, homeyToZ2m } = resolveCapabilityEntry(entry, expose);

  return {
    z2mToHomey,
    homeyToZ2m: homeyToZ2m
      ? (changedValues: Record<string, any>, getCapValue: (cap: string) => any) => {
        // Merge current values with changed values for capabilities in this group
        const mergedValues: Record<string, any> = {};
        for (const cap of homeyCapabilities) {
          mergedValues[cap] = changedValues[cap] ?? getCapValue(cap);
        }
        return homeyToZ2m(mergedValues, getCapValue);
      }
      : undefined,
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

    // Handle windowcoverings_set/position: remove onoff capability if present
    if (expose.property === 'windowcoverings_set' || expose.property === 'position') {
      definedHomeyCapabilities.delete('onoff');
      delete mappings.state;
    }

    const entry = capabilityMap[expose.property];
    if (!entry) return;

    const { caps: homeyCapabilities } = resolveCapabilityEntry(entry, expose);

    // Filter out already defined, skipped, or group-excluded capabilities
    const capsToAdd = homeyCapabilities.filter((cap) => {
      if (definedHomeyCapabilities.has(cap)) return false;
      if (skipCapabilities.includes(cap)) return false;
      if (isGroup && cap === 'measure_linkquality') return false;
      return true;
    });

    if (capsToAdd.length === 0) return;

    // Mark capabilities as defined
    capsToAdd.forEach((cap) => definedHomeyCapabilities.add(cap));

    mappings[expose.property] = {
      homeyCapabilities: capsToAdd,
      expose,
    };
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

// Map Z2M device description to Homey class and icon. First hit is chosen.
// Format: '(part of) description': ['homeyClass', 'iconName']
const classIconMap: { [key: string]: [string, string] } = {
  'door sensor': ['sensor', 'contact.svg'],
  'radiator valve': ['thermostat', 'radiator_valve.svg'],
  thermostat: ['thermostat', 'thermostat.svg'],
  'soil sensor': ['sensor', 'soil_sensor.svg'],
  'vibration sensor': ['sensor', 'vibration_sensor.svg'],
  'pressure sensor': ['sensor', 'vibration_sensor.svg'],
  'wireless switch': ['sensor', 'wireless_switch.svg'],
  'dimmer switch': ['sensor', 'wireless_switch.svg'],
  'on/off switch': ['sensor', 'wireless_switch.svg'],
  motion: ['sensor', 'motion.svg'],
  presence: ['sensor', 'motion.svg'],
  occupancy: ['sensor', 'motion.svg'],
  'wall switch module': ['button', 'wireless_switch.svg'],
  'smart button': ['button', 'wireless_switch.svg'],
  '2 gang switch module': ['socket', '2gangswitch.svg'],
  '2 channel dimmer': ['light', '2gangdimmer.svg'],
  plug: ['socket', 'socket.svg'],
  bulb: ['light', 'light.svg'],
  gu10: ['light', 'light.svg'],
  e27: ['light', 'light.svg'],
  dimmer: ['light', 'light.svg'],
  bloom: ['light', 'light.svg'],
  lightstrip: ['light', 'light.svg'],
  'led controller': ['light', 'light.svg'],
  led: ['light', 'light.svg'],
  'hue go': ['light', 'light.svg'],
  fyrtur: ['windowcoverings', 'window_coverings.svg'],
  kadrilj: ['windowcoverings', 'window_coverings.svg'],
  praktlysing: ['windowcoverings', 'window_coverings.svg'],
  tredansen: ['windowcoverings', 'window_coverings.svg'],
  parasol: ['sensor', 'contact.svg'],
  'tradfri shortcut': ['button', 'wireless_switch.svg'],
  rodret: ['button', 'wireless_switch.svg'],
  somrig: ['button', 'wireless_switch.svg'],
  twinguard: ['smokealarm', 'smoke_detector.svg'],
  smoke: ['smokealarm', 'smoke_detector.svg'],
  'air quality': ['sensor', 'smoke_detector.svg'],
  'remote control': ['remote', 'remote_control.svg'],
};

export function mapClassAndIcon(device: Z2MDevice) {
  let icon = 'icon.svg';
  let homeyClass = 'other';
  if (device.definition?.description) {
    const d = device.definition.description.toLowerCase();
    // Iterate in reverse order so that more specific matches (earlier in the map) take precedence
    Object.entries(classIconMap).reverse().forEach(([key, value]) => {
      if (d.includes(key.toLowerCase())) {
        icon = value[1];
        homeyClass = value[0];
      }
    });
  }
  return { homeyClass, icon };
}

/*
https://www.zigbee2mqtt.io/supported-devices/
*/
