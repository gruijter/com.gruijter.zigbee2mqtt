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
    {
        zigbeeModel: ["SMARTCODE_CONVERT_GEN1", "Smartcode"],
        model: "66492-001",
        vendor: "Kwikset",
        description: "Home connect smart lock conversion kit",
        fromZigbee: [fz.lock, fz.lock_operation_event, fz.battery],
        toZigbee: [tz.lock],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(2);
            await reporting.bind(endpoint, coordinatorEndpoint, ["closuresDoorLock", "genPowerCfg"]);
            await reporting.lockState(endpoint);
            await reporting.batteryPercentageRemaining(endpoint);
        },
        exposes: [e.lock(), e.battery(), e.lock_action(), e.lock_action_source_name(), e.lock_action_user()],
    },
    {
        zigbeeModel: ["SMARTCODE_CONVERT_GEN1_W3"],
        model: "99140-139",
        vendor: "Kwikset",
        description: "Home connect smart lock conversion kit",
        fromZigbee: [fz.lock, fz.lock_operation_event, fz.battery],
        toZigbee: [tz.lock],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(2);
            await reporting.bind(endpoint, coordinatorEndpoint, ["closuresDoorLock", "genPowerCfg"]);
            await reporting.lockState(endpoint);
            await reporting.batteryPercentageRemaining(endpoint);
        },
        exposes: [e.lock(), e.battery(), e.lock_action(), e.lock_action_source_name(), e.lock_action_user()],
    },
    {
        zigbeeModel: ["SMARTCODE_DEADBOLT_10_L"],
        model: "99140-002",
        vendor: "Kwikset",
        description: "SmartCode traditional electronic deadbolt",
        fromZigbee: [fz.lock, fz.lock_operation_event, fz.battery, fz.lock_programming_event, fz.lock_pin_code_response],
        toZigbee: [tz.lock, tz.pincode_lock],
        meta: { pinCodeCount: 30 },
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(2);
            await reporting.bind(endpoint, coordinatorEndpoint, ["closuresDoorLock", "genPowerCfg"]);
            await reporting.lockState(endpoint);
            await reporting.batteryPercentageRemaining(endpoint);
        },
        exposes: [e.lock(), e.battery(), e.pincode(), e.lock_action(), e.lock_action_source_name(), e.lock_action_user()],
    },
    {
        zigbeeModel: ["SMARTCODE_DEADBOLT_10_W3", "SMARTCODE_DEADBOLT_10T_W3", "SMARTCODE_DEADBOLT_10_W3_L"],
        model: "99140-031",
        vendor: "Kwikset",
        description: "SmartCode traditional electronic deadbolt",
        fromZigbee: [fz.lock, fz.lock_operation_event, fz.battery, fz.lock_programming_event, fz.lock_pin_code_response],
        toZigbee: [tz.lock, tz.pincode_lock],
        meta: { pinCodeCount: 30 },
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(2);
            await reporting.bind(endpoint, coordinatorEndpoint, ["closuresDoorLock", "genPowerCfg"]);
            await reporting.lockState(endpoint);
            await reporting.batteryPercentageRemaining(endpoint);
        },
        exposes: [e.lock(), e.battery(), e.pincode(), e.lock_action(), e.lock_action_source_name(), e.lock_action_user()],
    },
    {
        zigbeeModel: ["SMARTCODE_DEADBOLT_5"],
        model: "99100-045",
        vendor: "Kwikset",
        description: "910 SmartCode traditional electronic deadbolt",
        fromZigbee: [fz.lock, fz.lock_operation_event, fz.battery, fz.lock_programming_event, fz.lock_pin_code_response],
        toZigbee: [tz.lock, tz.pincode_lock],
        meta: { pinCodeCount: 30 },
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(2);
            await reporting.bind(endpoint, coordinatorEndpoint, ["closuresDoorLock", "genPowerCfg"]);
            await reporting.lockState(endpoint);
            await reporting.batteryPercentageRemaining(endpoint);
        },
        exposes: [e.lock(), e.battery(), e.pincode(), e.lock_action(), e.lock_action_source_name(), e.lock_action_user()],
    },
    {
        zigbeeModel: ["SMARTCODE_DEADBOLT_5_L"],
        model: "99100-006",
        vendor: "Kwikset",
        description: "910 SmartCode traditional electronic deadbolt",
        fromZigbee: [fz.lock, fz.lock_operation_event, fz.battery],
        toZigbee: [tz.lock],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(2);
            await reporting.bind(endpoint, coordinatorEndpoint, ["closuresDoorLock", "genPowerCfg"]);
            await reporting.lockState(endpoint);
            await reporting.batteryPercentageRemaining(endpoint);
        },
        exposes: [e.lock(), e.battery(), e.lock_action(), e.lock_action_source_name(), e.lock_action_user()],
    },
    {
        zigbeeModel: ["SMARTCODE_LEVER_5"],
        model: "99120-021",
        vendor: "Kwikset",
        description: "912 SmartCode traditional electronic lever",
        fromZigbee: [fz.lock, fz.lock_operation_event, fz.battery, fz.lock_programming_event, fz.lock_pin_code_response],
        toZigbee: [tz.lock, tz.pincode_lock],
        meta: { pinCodeCount: 30 },
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(2);
            await reporting.bind(endpoint, coordinatorEndpoint, ["closuresDoorLock", "genPowerCfg"]);
            await reporting.lockState(endpoint);
            await reporting.batteryPercentageRemaining(endpoint);
        },
        exposes: [e.lock(), e.battery(), e.pincode(), e.lock_action(), e.lock_action_source_name(), e.lock_action_user()],
    },
];
//# sourceMappingURL=kwikset.js.map