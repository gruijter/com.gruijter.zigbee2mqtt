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
const tz = __importStar(require("../converters/toZigbee"));
const exposes = __importStar(require("../lib/exposes"));
const legacy = __importStar(require("../lib/legacy"));
const m = __importStar(require("../lib/modernExtend"));
const tuya = __importStar(require("../lib/tuya"));
const e = exposes.presets;
exports.definitions = [
    {
        zigbeeModel: ["5j6ifxj", "5j6ifxj\u0000"],
        model: "BW-IS3",
        vendor: "BlitzWolf",
        description: "Rechargeable Zigbee PIR motion sensor",
        fromZigbee: [legacy.fz.blitzwolf_occupancy_with_timeout],
        toZigbee: [],
        exposes: [e.occupancy()],
    },
    {
        fingerprint: tuya.fingerprint("TS0003", ["_TYZB01_aneiicmq"]),
        model: "BW-SS7_1gang",
        vendor: "BlitzWolf",
        description: "Zigbee 3.0 smart light switch module 1 gang",
        extend: [m.onOff()],
        toZigbee: [tz.TYZB01_on_off],
    },
    {
        fingerprint: tuya.fingerprint("TS0003", ["_TYZB01_digziiav"]),
        model: "BW-SS7_2gang",
        vendor: "BlitzWolf",
        description: "Zigbee 3.0 smart light switch module 2 gang",
        extend: [m.deviceEndpoints({ endpoints: { l1: 1, l2: 2 } }), m.onOff({ endpointNames: ["l1", "l2"] })],
        toZigbee: [tz.TYZB01_on_off],
    },
    {
        fingerprint: tuya.fingerprint("TS0207", ["_TZ3000_eit7p838 "]),
        model: "BW-IS9",
        vendor: "BlitzWolf",
        description: "ZigBee Water Leak Sensor",
        extend: [m.battery(), m.iasZoneAlarm({ zoneType: "water_leak", zoneAttributes: ["alarm_1", "alarm_2", "tamper", "battery_low"] })],
    },
];
//# sourceMappingURL=blitzwolf.js.map