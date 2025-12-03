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
exports.definitions = [
    {
        zigbeeModel: ["intuisradiator                 "],
        model: "intuisradiator",
        vendor: "Intuis",
        description: "Radiator with nativ and intuis 3.0",
        extend: [
            m.deviceEndpoints({ endpoints: { 1: 1, 5: 5 } }),
            m.electricityMeter({
                cluster: "metering",
                power: false,
                status: true,
                endpointNames: ["1"],
            }),
            m.occupancy({ endpointNames: ["1"] }),
        ],
        fromZigbee: [fz.thermostat, fz.hvac_user_interface],
        toZigbee: [
            tz.thermostat_local_temperature,
            tz.thermostat_occupied_heating_setpoint,
            tz.thermostat_unoccupied_heating_setpoint,
            tz.thermostat_running_state,
            tz.thermostat_system_mode,
            tz.thermostat_temperature_display_mode,
            tz.thermostat_keypad_lockout,
        ],
        exposes: [
            exposes.presets
                .climate()
                .withLocalTemperature()
                .withSetpoint("occupied_heating_setpoint", 7, 28, 0.5)
                .withSetpoint("unoccupied_heating_setpoint", 7, 28, 0.5)
                .withRunningState(["idle", "heat"])
                .withSystemMode(["off", "heat"])
                .withEndpoint("1"),
            exposes.presets.keypad_lockout(),
            new exposes.Enum("temperature_display_mode", exposes.access.ALL, ["celsius", "fahrenheit"]).withDescription("Controls the temperature unit of the thermostat display."),
        ],
        configure: async (device, coordinatorEndpoint, definition) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["hvacThermostat", "hvacUserInterfaceCfg"]);
            await reporting.thermostatTemperature(endpoint);
            await reporting.thermostatOccupiedHeatingSetpoint(endpoint);
            await reporting.thermostatRunningState(endpoint);
            await reporting.thermostatSystemMode(endpoint);
            // These are not reportable so we poll them once
            await endpoint.read("hvacThermostat", ["unoccupiedHeatingSetpoint"]);
            await endpoint.read("hvacUserInterfaceCfg", ["tempDisplayMode"]);
            await endpoint.read("hvacUserInterfaceCfg", ["keypadLockout"]);
        },
        meta: { multiEndpoint: true },
    },
];
//# sourceMappingURL=intuis.js.map