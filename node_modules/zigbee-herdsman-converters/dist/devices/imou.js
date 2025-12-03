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
const exposes_1 = require("../lib/exposes");
const m = __importStar(require("../lib/modernExtend"));
function imouAlarmButton() {
    const exposes = [exposes_1.presets.action(["press"])];
    const fromZigbee = [
        {
            cluster: "ssIasZone",
            type: "commandStatusChangeNotification",
            convert: (model, msg, publish, options, meta) => {
                const payload = {};
                const zoneStatus = msg.data.zonestatus;
                if (zoneStatus === 2)
                    payload.action = "press";
                return payload;
            },
        },
    ];
    return { exposes, fromZigbee, isModernExtend: true };
}
exports.definitions = [
    {
        zigbeeModel: ["ZP1-EN"],
        model: "ZP1-EN",
        vendor: "IMOU",
        description: "Zigbee ZP1 PIR motion sensor",
        extend: [m.battery(), m.iasZoneAlarm({ zoneType: "occupancy", zoneAttributes: ["alarm_1", "tamper", "battery_low"], alarmTimeout: true })],
    },
    {
        zigbeeModel: ["ZR1-EN"],
        model: "ZR1-EN",
        vendor: "IMOU",
        description: "Zigbee ZR1 siren",
        extend: [
            m.battery(),
            m.forceDeviceType({ type: "EndDevice" }),
            m.iasWarning(),
            m.iasZoneAlarm({ zoneType: "alarm", zoneAttributes: ["alarm_1", "tamper", "battery_low"] }),
        ],
        meta: { disableDefaultResponse: true },
    },
    {
        zigbeeModel: ["ZD1-EN"],
        model: "ZD1-EN",
        vendor: "IMOU",
        description: "Door & window sensor",
        extend: [m.iasZoneAlarm({ zoneType: "alarm", zoneAttributes: ["alarm_1", "tamper", "battery_low"] }), m.battery()],
    },
    {
        zigbeeModel: ["ZGA1-EN"],
        model: "ZGA1-EN",
        vendor: "IMOU",
        description: "Smart gas detector",
        extend: [
            m.forceDeviceType({ type: "Router" }),
            m.iasZoneAlarm({ zoneType: "gas", zoneAttributes: ["alarm_1", "alarm_2", "tamper", "test"], alarmTimeout: true }),
        ],
    },
    {
        zigbeeModel: ["ZTM1-EN"],
        model: "ZTM1-EN",
        vendor: "IMOU",
        description: "Temperature and humidity sensor",
        extend: [m.battery(), m.temperature(), m.humidity()],
    },
    {
        zigbeeModel: ["ZE1-EN"],
        model: "ZE1-EN",
        vendor: "IMOU",
        description: "Wireless switch",
        extend: [m.battery(), imouAlarmButton()],
    },
];
//# sourceMappingURL=imou.js.map