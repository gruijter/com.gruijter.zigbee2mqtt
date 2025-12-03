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
const e = exposes.presets;
exports.definitions = [
    {
        zigbeeModel: ["SoftWhite"],
        model: "PSB19-SW27",
        vendor: "GE",
        description: "Link smart LED light bulb, A19 soft white (2700K)",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["ZLL Light"],
        model: "22670",
        vendor: "GE",
        description: "Link smart LED light bulb, A19/BR30 soft white (2700K)",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["Daylight"],
        model: "PQC19-DY01",
        vendor: "GE",
        description: "Link smart LED light bulb, A19/BR30 cold white (5000K)",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["45852"],
        model: "45852GE",
        vendor: "GE",
        description: "Zigbee plug-in smart dimmer",
        extend: [m.light({ configureReporting: true })],
    },
    {
        zigbeeModel: ["45853"],
        model: "45853GE",
        vendor: "GE",
        description: "Plug-in smart switch",
        fromZigbee: [fz.on_off, fz.metering],
        toZigbee: [tz.on_off, tz.ignore_transition],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genOnOff", "seMetering"]);
            await reporting.onOff(endpoint);
            await reporting.readMeteringMultiplierDivisor(endpoint);
            await reporting.instantaneousDemand(endpoint, { min: 10, change: 2 });
        },
        exposes: [e.switch(), e.power(), e.energy()],
    },
    {
        zigbeeModel: ["45856"],
        model: "45856GE",
        vendor: "GE",
        description: "In-wall smart switch",
        fromZigbee: [fz.on_off, fz.metering],
        toZigbee: [tz.on_off],
        exposes: [e.switch(), e.energy(), e.power()],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genOnOff", "seMetering"]);
            await reporting.onOff(endpoint);
            await reporting.instantaneousDemand(endpoint);
            await reporting.currentSummDelivered(endpoint);
            endpoint.saveClusterAttributeKeyValue("seMetering", { divisor: 10000, multiplier: 1 });
        },
    },
    {
        zigbeeModel: ["45857"],
        model: "45857GE",
        vendor: "GE",
        description: "Zigbee in-wall smart dimmer",
        extend: [m.light({ configureReporting: true }), m.electricityMeter({ cluster: "metering" })],
    },
    {
        zigbeeModel: ["Smart Switch"],
        model: "PTAPT-WH02",
        vendor: "GE",
        description: "Quirky smart switch",
        extend: [m.onOff()],
        endpoint: (device) => {
            return { default: 2 };
        },
    },
    {
        zigbeeModel: ["ZHA Smart Plug"],
        model: "POTLK-WH02",
        vendor: "GE",
        description: "Outlink smart remote outlet",
        extend: [m.onOff()],
    },
];
//# sourceMappingURL=ge.js.map