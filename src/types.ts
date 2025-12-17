/* eslint-disable camelcase */

// eslint-disable-next-line node/no-unpublished-import
import type * as zigbeeHerdsman from 'zigbee-herdsman/dist';
// eslint-disable-next-line node/no-unpublished-import
import type * as zigbeeHerdsmanConverter from 'zigbee-herdsman-converters';

export { zigbeeHerdsmanConverter };

/*------------------------------------------------------------------------*/
/* Zigbee2MQTT API types
/*------------------------------------------------------------------------*/

export interface Z2MDeviceDefinition {
    source: 'native' | 'generated' | 'external';
    model: string;
    vendor: string;
    description: string;
    exposes: zigbeeHerdsmanConverter.Expose[];
    supports_ota: boolean;
    options: zigbeeHerdsmanConverter.Option[];
    icon: string;
}

export interface Z2MDevice {
    ieee_address: zigbeeHerdsman.Models.Device['ieeeAddr'];
    type: zigbeeHerdsman.Models.Device['type'];
    network_address: zigbeeHerdsman.Models.Device['networkAddress'];
    supported: boolean;
    friendly_name: string;
    disabled: boolean;
    description?: string;
    definition?: Z2MDeviceDefinition;
    power_source: zigbeeHerdsman.Models.Device['powerSource'];
    software_build_id: zigbeeHerdsman.Models.Device['softwareBuildID'];
    date_code: zigbeeHerdsman.Models.Device['dateCode'];
    model_id: zigbeeHerdsman.Models.Device['modelID'];
    interviewing: boolean;
    interview_completed: boolean;
    interview_state: zigbeeHerdsman.Models.Device['interviewState'];
    manufacturer: zigbeeHerdsman.Models.Device['manufacturerName'];
    // endpoints: Record<number, Zigbee2MQTTDeviceEndpoint>;
}

export interface DeviceAvailability {
    availability: 'online' | 'offline' | 'unknown';
}

export interface Z2MGroupMember {
    ieee_address: zigbeeHerdsman.Models.Device['ieeeAddr'];
    endpoint: number;
}

export interface Z2MGroup {
    id: number;
    friendly_name: 'default_bind_group' | string;
    description?: string;
    // scenes: Zigbee2MQTTScene[];
    members: Z2MGroupMember[];
}

/*------------------------------------------------------------------------*/
/* Capability mapping types
/*------------------------------------------------------------------------*/

// Single-capability converters (used in capabilityMap for 1:1 mappings)
export type SingleZ2MToHomeyConverter = (z2mVal: any, z2mState: Z2MState) => any;
export type SingleHomeyToZ2MConverter = (homeyVal: any, getCapValue: (cap: string) => any) => Record<string, any>;

// Multi-capability converters (used in capabilityMap for 1:N mappings)
export type MultiZ2MToHomeyConverter = (z2mVal: any, z2mState: Z2MState) => Record<string, any> | null;
export type MultiHomeyToZ2MConverter = (values: Record<string, any>, getCapValue: (cap: string) => any) => Record<string, any> | null;

// Single-capability tuple: [capability, z2mToHomey, homeyToZ2m?]
export type SingleCapabilityMapTuple = [string, SingleZ2MToHomeyConverter, SingleHomeyToZ2MConverter?];

// Multi-capability tuple: [capabilities[], z2mToHomey, homeyToZ2m?]
export type MultiCapabilityMapTuple = { caps: string[], z2mToHomey: MultiZ2MToHomeyConverter, homeyToZ2m?: MultiHomeyToZ2MConverter };

// Raw tuple (as stored in capabilityMap)
export type AnyCapabilityMapTuple = SingleCapabilityMapTuple | MultiCapabilityMapTuple;

// Map entry (can be tuple or function returning tuple)
export type CapabilityMapEntry = AnyCapabilityMapTuple | ((exp: zigbeeHerdsmanConverter.Expose) => AnyCapabilityMapTuple);

// Normalized tuple (always multi-format, returned by resolveCapabilityEntry)
export type CapabilityMapTuple = MultiCapabilityMapTuple;

// Converter result interface from getCapabilityConverters()
export interface CapabilityConverters {
    z2mToHomey: MultiZ2MToHomeyConverter;
    homeyToZ2m?: MultiHomeyToZ2MConverter;
}

export interface CapabilityMapping {
    homeyCapabilities: string[];
    expose: zigbeeHerdsmanConverter.Expose;
}

export type CapabilityMappings = { [z2mProperty: string]: CapabilityMapping };

export interface CapabilityOptions {
    units?: { en: string };
    title?: { en: string };
}

/*------------------------------------------------------------------------*/
/* App settings types
/*------------------------------------------------------------------------*/

export interface MQTTSettings {
    host: string;
    port: number;
    username?: string;
    password?: string;
    tls: boolean;
    topic: string;
}

export interface BridgeSettings extends MQTTSettings {
    version?: string;
    uid?: string;
    zigbee_channel?: string;
    pan_id?: string;
    force_info_log_level?: boolean;
}

export interface DeviceSettings {
    uid: string;
    friendly_name: string;
    bridge_uid: string;
    homeyclass: string;
    model?: string;
    description?: string;
}

export interface GroupSettings extends DeviceSettings {
    members: Z2MGroupMember[];
    models: string;
}

/*------------------------------------------------------------------------*/
/* Zigbee2MQTT State types
/*------------------------------------------------------------------------*/

export type Z2MState = Record<string, any>;
