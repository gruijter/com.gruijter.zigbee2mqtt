"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.definitions = void 0;
const fz = __importStar(require("../converters/fromZigbee"));
const exposes = __importStar(require("../lib/exposes"));
const m = __importStar(require("../lib/modernExtend"));
const reporting = __importStar(require("../lib/reporting"));
const e = exposes.presets;
exports.definitions = [
    {
        zigbeeModel: ["MP-840"],
        model: "MP-840",
        vendor: "Visonic",
        description: "Long range pet immune PIR motion sensor",
        fromZigbee: [fz.ias_occupancy_alarm_1, fz.temperature, fz.battery],
        toZigbee: [],
        meta: { battery: { voltageToPercentage: { min: 2500, max: 3000 } } },
        exposes: [e.occupancy(), e.battery_low(), e.tamper(), e.battery_voltage(), e.temperature(), e.battery()],
    },
    {
        zigbeeModel: ["MP-841"],
        model: "MP-841",
        vendor: "Visonic",
        description: "Motion sensor",
        fromZigbee: [fz.ias_occupancy_alarm_1],
        toZigbee: [],
        exposes: [e.occupancy(), e.battery_low(), e.tamper()],
    },
    {
        zigbeeModel: ["MCT-370 SMA"],
        model: "MCT-370 SMA",
        vendor: "Visonic",
        description: "Magnetic door & window contact sensor",
        fromZigbee: [fz.ias_contact_alarm_1],
        toZigbee: [],
        exposes: [e.contact(), e.battery_low(), e.tamper()],
    },
    {
        zigbeeModel: ["MCT-350 SMA"],
        model: "MCT-350 SMA",
        vendor: "Visonic",
        description: "Magnetic door & window contact sensor",
        fromZigbee: [fz.ias_contact_alarm_1, fz.temperature],
        toZigbee: [],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["msTemperatureMeasurement"]);
            await reporting.temperature(endpoint);
        },
        exposes: [e.contact(), e.battery_low(), e.tamper(), e.temperature()],
    },
    {
        zigbeeModel: ["MCT-340 E"],
        model: "MCT-340 E",
        vendor: "Visonic",
        description: "Magnetic door & window contact sensor",
        fromZigbee: [fz.ias_contact_alarm_1, fz.temperature, fz.battery],
        toZigbee: [],
        meta: { battery: { voltageToPercentage: "3V_2100" } },
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["msTemperatureMeasurement", "genPowerCfg"]);
            await reporting.temperature(endpoint);
            await reporting.batteryVoltage(endpoint);
        },
        exposes: [e.contact(), e.battery_low(), e.tamper(), e.temperature(), e.battery()],
    },
    {
        zigbeeModel: ["MCT-340 SMA"],
        model: "MCT-340 SMA",
        vendor: "Visonic",
        description: "Magnetic door & window contact sensor",
        fromZigbee: [fz.ias_contact_alarm_1, fz.temperature, fz.battery],
        toZigbee: [],
        meta: { battery: { voltageToPercentage: "3V_2100" } },
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["msTemperatureMeasurement", "genPowerCfg"]);
            await reporting.temperature(endpoint);
            await reporting.batteryVoltage(endpoint);
        },
        exposes: [e.contact(), e.battery_low(), e.tamper(), e.temperature(), e.battery()],
    },
    {
        zigbeeModel: ["GB-540"],
        model: "GB-540",
        vendor: "Visonic",
        description: "Glass break detector",
        fromZigbee: [fz.ias_vibration_alarm_1],
        toZigbee: [],
        exposes: [e.vibration(), e.battery_low(), e.tamper()],
    },
    {
        zigbeeModel: ["MCT-302 SMA"],
        model: "MCT-302 SMA",
        vendor: "Visonic",
        description: "Magnetic door & window contact senso",
        extend: [m.temperature(), m.battery(), m.iasZoneAlarm({ zoneType: "contact", zoneAttributes: ["alarm_1", "tamper", "battery_low"] })],
    },
];
//# sourceMappingURL=visonic.js.map