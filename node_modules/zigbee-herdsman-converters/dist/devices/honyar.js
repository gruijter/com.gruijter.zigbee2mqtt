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
const tz = __importStar(require("../converters/toZigbee"));
const exposes = __importStar(require("../lib/exposes"));
const m = __importStar(require("../lib/modernExtend"));
const reporting = __importStar(require("../lib/reporting"));
const tuya = __importStar(require("../lib/tuya"));
const e = exposes.presets;
exports.definitions = [
    {
        zigbeeModel: ["00500c35"],
        model: "U86K31ND6",
        vendor: "Honyar",
        description: "3 gang switch ",
        extend: [m.deviceEndpoints({ endpoints: { left: 1, center: 2, right: 3 } }), m.onOff({ endpointNames: ["left", "center", "right"] })],
    },
    {
        zigbeeModel: ["HY0043"],
        model: "U86Z13A16-ZJH(HA)",
        vendor: "Honyar",
        description: "Smart Power Socket 16A (with power monitoring)",
        fromZigbee: [fz.on_off, fz.electrical_measurement, fz.metering],
        toZigbee: [tz.on_off],
        exposes: [e.switch(), e.power(), e.current(), e.voltage(), e.energy()],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genOnOff", "haElectricalMeasurement", "seMetering"]);
            await reporting.onOff(endpoint);
            await reporting.readEletricalMeasurementMultiplierDivisors(endpoint);
            await reporting.activePower(endpoint);
            await reporting.rmsCurrent(endpoint);
            await reporting.rmsVoltage(endpoint);
            await reporting.readMeteringMultiplierDivisor(endpoint);
            await reporting.currentSummDelivered(endpoint);
        },
    },
    {
        zigbeeModel: ["HY0157"],
        model: "U86Z223A10-ZJU01(GD)",
        vendor: "Honyar",
        description: "Smart power socket 10A with USB (with power monitoring)",
        fromZigbee: [fz.on_off, fz.electrical_measurement, fz.metering],
        toZigbee: [tz.on_off],
        exposes: [e.switch().withEndpoint("l1"), e.switch().withEndpoint("l2"), e.power(), e.current(), e.voltage(), e.energy()],
        meta: { multiEndpoint: true, multiEndpointSkip: ["energy", "current", "voltage", "power"] },
        endpoint: (device) => {
            return { l1: 1, l2: 2 };
        },
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await tuya.configureMagicPacket(device, coordinatorEndpoint);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genOnOff", "haElectricalMeasurement", "seMetering"]);
            await reporting.bind(device.getEndpoint(2), coordinatorEndpoint, ["genOnOff"]);
            await reporting.activePower(endpoint, { min: 10, change: 10 });
            await reporting.rmsCurrent(endpoint, { min: 10, change: 50 });
            await reporting.rmsVoltage(endpoint, { min: 10, change: 10 });
            await reporting.currentSummDelivered(endpoint, { min: 10 });
            await reporting.readMeteringMultiplierDivisor(endpoint);
            endpoint.saveClusterAttributeKeyValue("seMetering", { divisor: 1000, multiplier: 1 });
            endpoint.saveClusterAttributeKeyValue("haElectricalMeasurement", {
                acVoltageMultiplier: 1,
                acVoltageDivisor: 10,
                acCurrentMultiplier: 1,
                acCurrentDivisor: 1000,
                acPowerMultiplier: 1,
                acPowerDivisor: 10,
            });
            device.save();
        },
    },
    {
        zigbeeModel: ["HY0095"],
        model: "U2-86K11ND10-ZD",
        vendor: "Honyar",
        description: "1 gang switch",
        fromZigbee: [fz.on_off],
        toZigbee: [tz.on_off],
        exposes: [e.switch()],
        meta: { disableDefaultResponse: true },
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genOnOff"]);
            await reporting.onOff(endpoint);
        },
    },
    {
        zigbeeModel: ["HY0096"],
        model: "U2-86K21ND10-ZD",
        vendor: "Honyar",
        description: "2 gang switch",
        fromZigbee: [fz.on_off],
        toZigbee: [tz.on_off],
        exposes: [e.switch().withEndpoint("left"), e.switch().withEndpoint("right")],
        endpoint: (device) => {
            return { left: 1, right: 2 };
        },
        meta: { multiEndpoint: true, disableDefaultResponse: true },
        configure: async (device, coordinatorEndpoint) => {
            const endpoint1 = device.getEndpoint(1);
            const endpoint2 = device.getEndpoint(2);
            await reporting.bind(endpoint1, coordinatorEndpoint, ["genOnOff"]);
            await reporting.onOff(endpoint1);
            await reporting.bind(endpoint2, coordinatorEndpoint, ["genOnOff"]);
            await reporting.onOff(endpoint2);
        },
    },
    {
        zigbeeModel: ["HY0097"],
        model: "U2-86K31ND10-ZD",
        vendor: "Honyar",
        description: "3 gang switch",
        fromZigbee: [fz.on_off],
        toZigbee: [tz.on_off],
        exposes: [e.switch().withEndpoint("left"), e.switch().withEndpoint("right"), e.switch().withEndpoint("center")],
        endpoint: (device) => {
            return { left: 1, center: 2, right: 3 };
        },
        meta: { multiEndpoint: true, disableDefaultResponse: true },
        configure: async (device, coordinatorEndpoint) => {
            const endpoint1 = device.getEndpoint(1);
            const endpoint2 = device.getEndpoint(2);
            const endpoint3 = device.getEndpoint(3);
            await reporting.bind(endpoint1, coordinatorEndpoint, ["genOnOff"]);
            await reporting.onOff(endpoint1);
            await reporting.bind(endpoint2, coordinatorEndpoint, ["genOnOff"]);
            await reporting.onOff(endpoint2);
            await reporting.bind(endpoint3, coordinatorEndpoint, ["genOnOff"]);
            await reporting.onOff(endpoint3);
        },
    },
];
//# sourceMappingURL=honyar.js.map