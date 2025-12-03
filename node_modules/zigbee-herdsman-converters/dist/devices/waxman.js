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
const reporting = __importStar(require("../lib/reporting"));
const e = exposes.presets;
exports.definitions = [
    // Disabled because fz._8840100H_water_leak_alarm is very likely broken
    // https://github.com/Koenkk/zigbee-herdsman-converters/pull/9867#discussion_r2311954776
    // {
    //     zigbeeModel: ["leakSMART Water Sensor V2"],
    //     model: "8840100H",
    //     vendor: "Waxman",
    //     description: "leakSMART water sensor v2",
    //     fromZigbee: [fz._8840100H_water_leak_alarm, fz.temperature, fz.battery],
    //     toZigbee: [],
    //     exposes: [e.battery(), e.temperature(), e.water_leak()],
    //     configure: async (device, coordinatorEndpoint) => {
    //         const endpoint = device.getEndpoint(1);
    //         await reporting.bind(endpoint, coordinatorEndpoint, ["genPowerCfg", "haApplianceEventsAlerts", "msTemperatureMeasurement"]);
    //         await reporting.batteryPercentageRemaining(endpoint);
    //         await reporting.temperature(endpoint);
    //     },
    // },
    {
        zigbeeModel: ["House Water Valve - MDL-TBD", "leakSMART Water Valve v2.10"],
        // Should work with all manufacturer model numbers for the 2.0 series:
        // 8850000 3/4"
        // 8850100 1"
        // 8850200 1-1/4"
        // 8850300 1-1/2"
        // 8850310 2"
        model: "8850100",
        vendor: "Waxman",
        description: "leakSMART automatic water shut-off valve 2.0",
        fromZigbee: [fz.battery, fz.on_off],
        toZigbee: [tz.on_off],
        exposes: [e.battery(), e.switch()],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genPowerCfg", "haApplianceEventsAlerts", "genOnOff"]);
            await reporting.onOff(endpoint);
            await reporting.batteryPercentageRemaining(endpoint);
            await reporting.batteryVoltage(endpoint);
        },
    },
];
//# sourceMappingURL=waxman.js.map