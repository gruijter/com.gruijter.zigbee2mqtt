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
        zigbeeModel: ["On_Off_Switch_Module_v1.0"],
        model: "03981",
        vendor: "Vimar",
        description: "IoT connected relay module",
        extend: [m.onOff({ powerOnBehavior: false })],
    },
    {
        zigbeeModel: ["DimmerSwitch_v1.0"],
        model: "14595.0",
        vendor: "Vimar",
        description: "IoT connected dimmer mechanism 220-240V",
        extend: [m.light({ configureReporting: true, powerOnBehavior: false })],
        endpoint: (device) => {
            return { default: 10 };
        },
    },
    {
        zigbeeModel: ["2_Way_Switch_v1.0", "On_Off_Switch_v1.0"],
        model: "14592.0",
        vendor: "Vimar",
        description: "2-way switch IoT connected mechanism",
        extend: [m.onOff({ powerOnBehavior: false })],
    },
    {
        zigbeeModel: ["Window_Cov_v1.0"],
        model: "14594",
        vendor: "Vimar",
        description: "Roller shutter with slat orientation and change-over relay",
        fromZigbee: [fz.cover_position_tilt],
        toZigbee: [tz.cover_state, tz.cover_position_tilt],
        exposes: [e.cover_position()],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(10);
            const binds = ["closuresWindowCovering"];
            await reporting.bind(endpoint, coordinatorEndpoint, binds);
            await reporting.currentPositionLiftPercentage(endpoint);
        },
    },
    {
        zigbeeModel: ["Window_Cov_Module_v1.0"],
        model: "03982",
        vendor: "Vimar",
        description: "Roller shutter with slat orientation and change-over relay",
        fromZigbee: [fz.cover_position_tilt],
        toZigbee: [tz.cover_state, tz.cover_position_tilt],
        exposes: [e.cover_position()],
    },
    {
        zigbeeModel: ["Mains_Power_Outlet_v1.0"],
        model: "14593",
        vendor: "Vimar",
        description: "16A outlet IoT connected",
        fromZigbee: [fz.on_off, fz.electrical_measurement],
        toZigbee: [tz.on_off],
        exposes: [e.switch(), e.power()],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(10);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genOnOff", "haElectricalMeasurement"]);
        },
    },
    {
        zigbeeModel: ["Thermostat_v0.1", "WheelThermostat_v1.0"],
        model: "02973.B",
        vendor: "Vimar",
        description: "Vimar IoT thermostat",
        fromZigbee: [fz.thermostat],
        toZigbee: [
            tz.thermostat_local_temperature,
            tz.thermostat_occupied_heating_setpoint,
            tz.thermostat_occupied_cooling_setpoint,
            tz.thermostat_system_mode,
        ],
        exposes: [
            e
                .climate()
                .withSetpoint("occupied_heating_setpoint", 4, 40, 0.1)
                .withSetpoint("occupied_cooling_setpoint", 4, 40, 0.1)
                .withLocalTemperature()
                .withSystemMode(["off", "heat", "cool"]),
        ],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(10);
            const binds = ["genBasic", "genIdentify", "hvacThermostat"];
            await reporting.bind(endpoint, coordinatorEndpoint, binds);
            await reporting.thermostatTemperature(endpoint);
        },
    },
    {
        zigbeeModel: ["RemoteControl_v1.0"],
        model: "RemoteControl_v1.0",
        vendor: "Vimar",
        description: "Remote control IoT",
        extend: [m.commandsOnOff(), m.commandsWindowCovering(), m.commandsLevelCtrl()],
    },
];
//# sourceMappingURL=vimar.js.map