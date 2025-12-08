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

export type Z2MToHomeyConverter<T = any, R = any> = (z2mVal: T) => R;
export type HomeyToZ2MConverter<T = any> = (homeyVal: T) => Record<string, any>;
export type CapabilityMapTuple = [string, Z2MToHomeyConverter, HomeyToZ2MConverter?];
export type CapabilityMapEntry = CapabilityMapTuple | ((exp: zigbeeHerdsmanConverter.Expose) => CapabilityMapTuple);

export interface CapabilityMapping {
    homeyCapability: string;
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
