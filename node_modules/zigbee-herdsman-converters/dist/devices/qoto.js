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
const legacy = __importStar(require("../lib/legacy"));
const tuya = __importStar(require("../lib/tuya"));
const e = exposes.presets;
const ea = exposes.access;
exports.definitions = [
    {
        fingerprint: tuya.fingerprint("TS0601", ["_TZE200_arge1ptm", "_TZE200_anv5ujhv", "_TZE200_xlppj4f5"]),
        model: "QT-05M",
        vendor: "QOTO",
        description: "Solar powered garden watering timer",
        fromZigbee: [fz.ignore_tuya_set_time, fz.ignore_onoff_report, legacy.fromZigbee.watering_timer],
        toZigbee: [legacy.tz.valve_state, legacy.tz.shutdown_timer, legacy.tz.valve_state_auto_shutdown],
        exposes: [
            e.numeric("water_flow", ea.STATE).withUnit("%").withValueMin(0).withDescription("Current water flow in %."),
            e.numeric("last_watering_duration", ea.STATE).withUnit("sec").withValueMin(0).withDescription("Last watering duration in seconds."),
            e
                .numeric("remaining_watering_time", ea.STATE)
                .withUnit("sec")
                .withValueMin(0)
                .withDescription("Remaining watering time (for auto shutdown). Updates every minute, and every 10s in the last minute."),
            e
                .numeric("valve_state", ea.STATE_SET)
                .withValueMin(0)
                .withValueMax(100)
                .withValueStep(5)
                .withUnit("%")
                .withDescription("Set valve to %."),
            e
                .numeric("valve_state_auto_shutdown", ea.STATE_SET)
                .withValueMin(0)
                .withValueMax(100)
                .withValueStep(5)
                .withUnit("%")
                .withDescription("Set valve to % with auto shutdown. Must be set before setting the shutdown timer."),
            e
                .numeric("shutdown_timer", ea.STATE_SET)
                .withValueMin(0)
                .withValueMax(14400)
                .withUnit("sec")
                .withDescription("Auto shutdown in seconds. Must be set after setting valve state auto shutdown."),
            e.battery(),
        ],
    },
];
//# sourceMappingURL=qoto.js.map