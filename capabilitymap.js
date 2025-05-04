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

// map Z2M exposes and its value to a Homey capability. See https://www.zigbee2mqtt.io/guide/usage/exposes.html
// Z2M exp: (val) => [homey_capability, get_conversion, set_conversion]
// FOR CUSTOM AND SUB CAPABILITIES TRIGGER FLOWS NEED TO BE CREATED IN .homeycompose/flow/triggers
// FOR SETTABLE CUSTOM AND SUB CAPABILITIES ACTION FLOWS NEED TO BE CREATED IN .homeycompose/flow/actions

function getDeviceModel(Z2MDevice) {
  // First, look in Z2MDevice.definition.model (as seen in your object)
  if (Z2MDevice.definition && Z2MDevice.definition.model) {
    return Z2MDevice.definition.model.trim().toUpperCase();
  }
  // Alternatively try other locations if needed
  if (Z2MDevice.modelId) {
    return Z2MDevice.modelId.trim().toUpperCase();
  }
  if (Z2MDevice.devices && 
      Z2MDevice.devices[0] && 
      Z2MDevice.devices[0].definition && 
      Z2MDevice.devices[0].definition.model) {
    return Z2MDevice.devices[0].definition.model.trim().toUpperCase();
  }
  return '';
}

const capabilityMap = {
  // Standard Homey Number capabilities
  current_heating_setpoint: (val) => ['target_temperature', Number(val), { current_heating_setpoint: Number(val) }],
  temperature: (val) => ['measure_temperature', Number(val)],
  occupied_heating_setpoint: (val) => ['target_temperature.local', Number(val), { occupied_heating_setpoint: Number(val) }],
  local_temperature: (val) => ['measure_temperature.local', Number(val)],
  device_temperature: (val) => ['measure_temperature.device', Number(val)],
  co: (val) => ['measure_co', Number(val)],
  co2: (val) => ['measure_co2', Number(val)],
  smoke_concentration: (val) => ['measure_pm1', Number(val)],
  pm10: (val) => ['measure_pm10', Number(val)],
  pm25: (val) => ['measure_pm25', Number(val)],
  humidity: (val) => ['measure_humidity', Number(val)],
  soil_moisture: (val) => ['measure_humidity.soil', Number(val)],
  pressure: (val) => ['measure_pressure', Number(val)],
  // : (val) => ['measure_noise.strength', Number(val)],
  // : (val) => ['measure_rain', Number(val)],
  // : (val) => ['measure_wind_strength.strength', Number(val)],
  // : (val) => ['measure_wind_angle', Number(val)],
  // : (val) => ['measure_gust_strength', Number(val)],
  // : (val) => ['measure_gust_angle', Number(val)],
  battery: (val) => ['measure_battery', Number(val)],
  power: (val) => ['measure_power', Number(val)],
  // For voltage we choose the conversion based on the presence of "power"
  // If hasPower is true, we assume voltage is in V; otherwise, we assume it's in mV.
  voltage: (val, hasPower) => {
    if (hasPower) {
      return ['measure_voltage', Number(val)];
    } else {
      return ['measure_voltage_mv', Number(val)];
    }
  },
  current: (val) => ['measure_current', Number(val)],
  illuminance: (val) => ['measure_luminance', Number(val)],
  illuminance_lux: (val) => ['measure_luminance.lux', Number(val)],
  // : (val) => ['measure_ultraviolet', Number(val)],
  water_flow: (val) => ['measure_water', Number(val)],
  energy: (val) => ['meter_power', Number(val)],
  water_consumed: (val) => ['meter_water', Number(val)],
  // : (val) => ['meter_gas', Number(val)]
  // : (val) => ['meter_rain', Number(val)]
  // : (val) => ['volume_set.strength', Number(val)],
  // : (val) => ['windowcoverings_tilt_set', Number(val)]
  position: (val) => ['windowcoverings_set', Number(val) / 100, { position: Number(val) * 100 }],
  // : (val) => ['speaker_duration', Number(val)]
  // : (val) => ['speaker_position', Number(val)]
  valve_state: (val) => ['valve_state', Number(val), { valve_state: Number(val) * 100 }],
  target_distance: (val) => ['target_distance', Number(val)],

  // color light related number capabilities
  brightness: (val) => ['dim', Number(val) / 254, { brightness: Number(val) * 254 }],
  brightness_l1: (val) => ['dim.l1', Number(val) / 254, { brightness_l1: Number(val) * 254 }],
  brightness_l2: (val) => ['dim.l2', Number(val) / 254, { brightness_l2: Number(val) * 254 }],
  // : (val) => ['light_hue', val.hue], // { color: { x: Number(val), y: Number(val) } }
  // : (val) => ['light_saturation', Number(val)],
  color_temp: (val) => ['light_temperature', (Number(val) - 153) / 347, { color_temp: 153 + (Number(val) * 347) }],
  color_mode: (val) => ['light_mode', val === 'xy' || val === 'hs' ? 'color' : 'temperature'],
  voc: (val) => ['measure_tvoc', Number(val)],
  voc_index: (val) => ['measure_tvoc_index', Number(val)],
  aqi: (val) => ['measure_aqi', Number(val)],

  // Standard Homey enum capabilities
  // light_mode
  // vacuumcleaner_state
  // thermostat_mode
  // homealarm_state
  // lock_mode
  // windowcoverings_state
  // speaker_repeat

  // Standard Homey string capabilities
  // : (val) => ['speaker_artist', val],
  // : (val) => ['speaker_album', val],
  // : (val) => ['speaker_track', val],

  // Standard Homey Boolean capabilities
  state: (val) => ['onoff', val === 'ON', { state: val ? 'ON' : 'OFF' }],
  state_l1: (val) => ['onoff.l1', val === 'ON', { state_l1: val ? 'ON' : 'OFF' }],
  state_l2: (val) => ['onoff.l2', val === 'ON', { state_l2: val ? 'ON' : 'OFF' }],
  state_l3: (val) => ['onoff.l3', val === 'ON', { state_l3: val ? 'ON' : 'OFF' }],
  state_l4: (val) => ['onoff.l4', val === 'ON', { state_l4: val ? 'ON' : 'OFF' }],
  state_left: (val) => ['onoff.left', val === 'ON', { state_left: val ? 'ON' : 'OFF' }],
  state_center: (val) => ['onoff.center', val === 'ON', { state_center: val ? 'ON' : 'OFF' }],
  state_right: (val) => ['onoff.right', val === 'ON', { state_right: val ? 'ON' : 'OFF' }],
  backlight_mode: (val) => ['onoff.backlight', val === 'ON', { backlight_mode: val ? 'ON' : 'OFF' }],
  system_mode: (val) => ['onoff.system_mode', val === 'heat', { system_mode: val ? 'heat' : 'off' }], // MOES BHT series thermostat
  indicator: (val) => ['onoff.indicator', val === 'ON', { indicator: val ? 'ON' : 'OFF' }], // TuYa ZG-204ZM presence sensor
  heartbeat: (val) => ['onoff.heartbeat', val === 'ON', { heartbeat: val ? 'ON' : 'OFF' }], // Bosch TwinGuard
  pre_alarm: (val) => ['onoff.pre_alarm', val === 'ON', { pre_alarm: val ? 'ON' : 'OFF' }], // Bosch TwinGuard
  self_test: (val) => ['onoff.self_test', val === 'ON', { self_test: val ? 'ON' : 'OFF' }], // Bosch TwinGuard

  // frost_protection: (val) => ['onoff.frost_protection', val === 'ON', { frost_protection: val ? 'ON' : 'OFF' }],
  open_window: (val) => ['alarm_generic.open_window', val === 'ON'],

  device_fault: (val) => ['alarm_problem', val],
  vibration: (val) => ['alarm_vibration', val],
  gas: (val) => ['alarm_gas', val],
  occupancy: (val) => ['alarm_occupancy', val],
  presence: (val) => ['alarm_presence', val],
  contact: (val) => ['alarm_contact', !val],
  // : (val) => ['alarm_co2', val],
  carbon_monoxide: (val) => ['alarm_co', val],
  // : (val) => ['alarm_pm25', val],
  tamper: (val) => ['alarm_tamper', val],
  smoke: (val) => ['alarm_smoke', val],
  // : (val) => ['alarm_fire', val],
  // : (val) => ['alarm_heat', val],
  water_leak: (val) => ['alarm_water', val],
  rain: (val) => ['alarm_water.rain', val],
  battery_low: (val) => ['alarm_battery', val],
  // : (val) => ['alarm_night', val],
  // : (val) => ['volume_up', val], // only settable
  // : (val) => ['volume_down', val], // only settable
  // : (val) => ['volume_mute', val],
  // : (val) => ['channel_up', val], // only settable
  // : (val) => ['channel_down', val], // only settable
  lock: (val) => ['locked', val, { lock: val ? 'LOCK' : 'UNLOCK' }],
  child_lock: (val) => ['locked.child', val === 'LOCK', { child_lock: val ? 'LOCK' : 'UNLOCK' }],
  garage_door_contact: (val) => ['garagedoor_closed', val],
  // : (val) => ['windowcoverings_tilt_up', val], // only settable
  // : (val) => ['windowcoverings_tilt_down', val], // only settable
  // : (val) => ['windowcoverings_closed', val],
  // : (val) => ['button', val], // only settable
  // : (val) => ['speaker_playing', val],
  // : (val) => ['speaker_next', val], // only settable
  // : (val) => ['speaker_previous', val], // only settable
  // : (val) => ['speaker_shuffle', val],

  // Custom number capabilities
  linkquality: (val) => ['measure_linkquality', Number(val)],
  strength: (val) => ['meter_strength', Number(val)],
  angle_x: (val) => ['meter_angle_x', Number(val)],
  angle_y: (val) => ['meter_angle_y', Number(val)],
  angle_z: (val) => ['meter_angle_z', Number(val)],
  x_axis: (val) => ['meter_axis_x', Number(val)],
  y_axis: (val) => ['meter_axis_y', Number(val)],
  z_axis: (val) => ['meter_axis_z', Number(val)],
  
  // Custom string capabilities
  action: (val) => ['action', (val || '').toString()],
  action_group: (val) => ['action.group', Number(val)],
  running_state: (val) => ['running_state', (val || '').toString()],
  motion_state: (val) => ['motion_state', (val || '').toString()],
  siren_state: (val) => ['siren_state', (val || '').toString()],

  // Custom settable ENUM capabilities
  preset: (val) => ['preset', val, { preset: val }], // ["auto", "manual", "holiday"]
  power_on_behavior: (val) => ['power_on_behavior', val, { power_on_behavior: val }], // [off, on, toggle, previous]
  color_power_on_behavior: (val) => ['color_power_on_behavior', val, { color_power_on_behavior: val }], // [initial, previous, cutomized]
  power_outage_memory: (val) => ['power_outage_memory', val, { power_outage_memory: val }], // [off, on, restore]
  indicator_mode: (val) => ['indicator_mode', val, { indicator_mode: val }], // [off, off/on, on/off, on]
  switch_type: (val) => ['switch_type', val, { switch_type: val }], // [toggle, state, momentary]
  switch_type_l1: (val) => ['switch_type.l1', val, { switch_type_l1: val }], // [toggle, state, momentary]
  switch_type_l2: (val) => ['switch_type.l2', val, { switch_type_l2: val }], // [toggle, state, momentary]
  switch_type_left: (val) => ['switch_type.left', val, { switch_type_left: val }], // [toggle, state, momentary]
  switch_type_center: (val) => ['switch_type.center', val, { switch_type_center: val }], // [toggle, state, momentary]
  switch_type_right: (val) => ['switch_type.right', val, { switch_type_right: val }], // [toggle, state, momentary]
  sensor: (val) => ['sensor', val, { sensor: val }], // ["IN", "AL", "OU"]  // thermostats and mmWave presence
  effect: (val) => ['effect', val, { effect: val }], // [blink, breathe, okay, channel_change, finish_effect, stop_effect]
  alarm: (val) => ['alarm_sound', val, { alarm: val }], // [stop, pre_alarm, fire, burglar]
  motion_sensitivity: (val) => ['motion_state', val, { motion_sensitivity: val }], // [low, medium, high]
  sensitivity: (val) => ['sensitivity', val, { sensitivity: val }], // [low, medium, high]

  // useless ENUM capabilities
  // system_mode: (val) => ['system_mode', val, { system_mode: val }], // ["auto", "heat", "off", "cool", "emergency_heating", "precooling", "fan_only", "dry", "sleep" ]
  // sensitivity: (val) => ['sensitivity_enum', val, { sensitivity: val }], // [low, medium, high]

};

// map Z2M device description to Homey class and icon. First hit is chosen. '(part of) description': ['homeyClass', 'iconName']
const classIconMap = {
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
};

// map capabilities to Homey
const getExpMap = function mapExposure() {
  const expMap = {};
  Object.entries(capabilityMap).forEach((pair) => {
    const z2mExp = pair[0];
    const mapFunc = pair[1];
    const homeyCap = mapFunc()[0];
    expMap[homeyCap] = z2mExp;
  });
  return expMap;
};

// Define the skip map for specific device models
const propertySkipMap = {
  'DJT11LM': ['sensitivity'],
  //'OTHERDEVICE': ['some_property', 'another_property'],
  // Add more devices here easily
};

const mapProperty = function mapProperty(Z2MDevice) {
  // Retrieve the model using our helper function
  const modelId = getDeviceModel(Z2MDevice);
  // Determine if the current device is a group
  const isGroup = Array.isArray(Z2MDevice.members);

  // Get the array of properties to skip for this model. This is done once per device.
  const skipProperties = propertySkipMap[modelId] || [];
  
  let homeyCapabilities = [];
  function pushUniqueCapabilities(capVal) {
    if (!homeyCapabilities.includes(capVal)) {
      homeyCapabilities.push(capVal);
    }
  }
  const capDetails = {};

  let exposes = [];
  if (Z2MDevice.devices && Z2MDevice.devices[0].definition && Z2MDevice.devices[0].definition.exposes) {
    exposes = Z2MDevice.devices[0].definition.exposes;
  } else if (Z2MDevice.definition && Z2MDevice.definition.exposes) {
    exposes = Z2MDevice.definition.exposes;
  }

  // Determine once if the device has a 'power' exposure.
  const hasPower = exposes.some(exp => {
    if (exp.property === 'power') return true;
    if (exp.features) return exp.features.some(feature => feature.property === 'power');
    return false;
  });

  const mapExposure = (exp) => {
    if (exp.property === 'windowcoverings_set' || exp.property === 'position') {
      homeyCapabilities = homeyCapabilities.filter((cap) => cap !== 'onoff');
    }
    if (exp.property === 'color') {
      pushUniqueCapabilities('light_hue');
      capDetails.light_hue = exp;
      pushUniqueCapabilities('light_saturation');
      capDetails.light_saturation = exp;
      pushUniqueCapabilities('light_mode');
      capDetails.light_mode = exp;
    } else if (exp.property === 'voltage') {
      // Special handling for voltage: pass the 'hasPower' flag and the value.
      const capVal = capabilityMap.voltage(exp.value, hasPower);
      const capName = capVal[0];
      if (skipProperties.includes(capName)) return;
      pushUniqueCapabilities(capName);
      capDetails[capName] = exp;
    } else {
      const mapFunc = capabilityMap[exp.property];
      if (mapFunc) {
        const capVal = mapFunc();
        const capName = capVal[0];

        // Skip linkquality for groups
        if (isGroup && capName === 'measure_linkquality') {
          console.log(`Skipping ${capName} for group`);
          return; // Do not add this capability
        }
  
        // Check using the pre-determined skip list; only if the device model has rules
        if (skipProperties.includes(capName)) {
          // console.log(`Skipping capability '${capName}' for model '${modelId}'`);
          return; // Do not add this capability
        }
  
        pushUniqueCapabilities(capName);
        capDetails[capName] = exp;
      }
    }
  };

  exposes.forEach((exp) => {
    if (exp.features) {
      exp.features.forEach((feature) => {
        mapExposure(feature);
      });
    } else {
      mapExposure(exp);
    }
  });
  
  const caps = homeyCapabilities.filter((cap) => cap !== null);
  return { caps, capDetails };
};

const mapClassIcon = function mapClassIcon(Z2MDevice) {
  let icon = 'icon.svg';
  let homeyClass = 'other';
  if (Z2MDevice.definition && Z2MDevice.definition.description) {
    const d = Z2MDevice.definition.description.toLowerCase();
    Object.entries(classIconMap).reverse().forEach((pair) => {
      if (d.includes(pair[0].toLowerCase())) {
        icon = pair[1][1];
        homeyClass = pair[1][0];
      }
    });
  }
  return { homeyClass, icon };
};

module.exports = {
  capabilityMap, classIconMap, mapProperty, mapClassIcon, getExpMap,
};

/*
https://www.zigbee2mqtt.io/supported-devices/
*/
