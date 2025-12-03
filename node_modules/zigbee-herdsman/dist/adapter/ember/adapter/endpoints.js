"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIXED_ENDPOINTS = void 0;
const consts_1 = require("../../../zspec/consts");
const cluster_1 = require("../../../zspec/zcl/definition/cluster");
/**
 * List of endpoints to register.
 *
 * Index 0 is used as default and expected to be the primary network.
 */
exports.FIXED_ENDPOINTS = [
    {
        // primary network
        endpoint: 1,
        profileId: consts_1.HA_PROFILE_ID,
        deviceId: 0x65, // ?
        deviceVersion: 1,
        inClusterList: [
            cluster_1.Clusters.genBasic.ID, // 0x0000,// Basic
            cluster_1.Clusters.genIdentify.ID, // 0x0003,// Identify
            cluster_1.Clusters.genOnOff.ID, // 0x0006,// On/off
            cluster_1.Clusters.genLevelCtrl.ID, // 0x0008,// Level Control
            cluster_1.Clusters.genTime.ID, // 0x000A,// Time
            cluster_1.Clusters.genOta.ID, // 0x0019,// Over the Air Bootloading
            // Cluster.genPowerProfile.ID,// 0x001A,// Power Profile XXX: missing ZCL cluster def in Z2M?
            cluster_1.Clusters.lightingColorCtrl.ID, // 0x0300,// Color Control
        ],
        outClusterList: [
            cluster_1.Clusters.genBasic.ID, // 0x0000,// Basic
            cluster_1.Clusters.genIdentify.ID, // 0x0003,// Identify
            cluster_1.Clusters.genGroups.ID, // 0x0004,// Groups
            cluster_1.Clusters.genScenes.ID, // 0x0005,// Scenes
            cluster_1.Clusters.genOnOff.ID, // 0x0006,// On/off
            cluster_1.Clusters.genLevelCtrl.ID, // 0x0008,// Level Control
            cluster_1.Clusters.genPollCtrl.ID, // 0x0020,// Poll Control
            cluster_1.Clusters.lightingColorCtrl.ID, // 0x0300,// Color Control
            cluster_1.Clusters.msIlluminanceMeasurement.ID, // 0x0400,// Illuminance Measurement
            cluster_1.Clusters.msTemperatureMeasurement.ID, // 0x0402,// Temperature Measurement
            cluster_1.Clusters.msRelativeHumidity.ID, // 0x0405,// Relative Humidity Measurement
            cluster_1.Clusters.msOccupancySensing.ID, // 0x0406,// Occupancy Sensing
            cluster_1.Clusters.ssIasZone.ID, // 0x0500,// IAS Zone
            cluster_1.Clusters.seMetering.ID, // 0x0702,// Simple Metering
            cluster_1.Clusters.haMeterIdentification.ID, // 0x0B01,// Meter Identification
            cluster_1.Clusters.haApplianceStatistics.ID, // 0x0B03,// Appliance Statistics
            cluster_1.Clusters.haElectricalMeasurement.ID, // 0x0B04,// Electrical Measurement
            cluster_1.Clusters.touchlink.ID, // 0x1000, // touchlink
        ],
        networkIndex: 0x00,
        // - Cluster spec 3.7.2.4.1: group identifier 0x0000 is reserved for the global scene used by the OnOff cluster.
        // - 901: defaultBindGroup
        multicastIds: [0, 901],
    },
    {
        // green power
        endpoint: consts_1.GP_ENDPOINT,
        profileId: consts_1.GP_PROFILE_ID,
        deviceId: 0x66,
        deviceVersion: 1,
        inClusterList: [
            cluster_1.Clusters.greenPower.ID, // 0x0021,// Green Power
        ],
        outClusterList: [
            cluster_1.Clusters.greenPower.ID, // 0x0021,// Green Power
        ],
        networkIndex: 0x00,
        multicastIds: [0x0b84],
    },
];
//# sourceMappingURL=endpoints.js.map