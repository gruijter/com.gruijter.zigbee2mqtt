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
        zigbeeModel: ["KONOZ"],
        model: "KN-Z-WH1-B04",
        vendor: "LUX",
        description: "KONOz thermostat",
        fromZigbee: [fz.battery, fz.thermostat, fz.fan, fz.thermostat_weekly_schedule],
        toZigbee: [
            tz.thermostat_local_temperature,
            tz.thermostat_occupancy,
            tz.thermostat_occupied_heating_setpoint,
            tz.thermostat_occupied_cooling_setpoint,
            tz.thermostat_unoccupied_heating_setpoint,
            tz.thermostat_setpoint_raise_lower,
            tz.thermostat_running_state,
            tz.fan_mode,
            tz.thermostat_system_mode,
            tz.thermostat_weekly_schedule,
            tz.thermostat_clear_weekly_schedule,
            tz.thermostat_relay_status_log,
        ],
        exposes: [
            e
                .climate()
                .withSetpoint("occupied_heating_setpoint", 10, 30, 0.05)
                .withSetpoint("occupied_cooling_setpoint", 10, 30, 0.05)
                .withLocalTemperature()
                .withSystemMode(["off", "heat", "cool"])
                .withRunningState(["idle", "heat", "cool"])
                .withFanMode(["on", "auto"]),
        ],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(3) || device.getEndpoint(1);
            const binds = ["genBasic", "genIdentify", "genPowerCfg", "genTime", "hvacThermostat", "hvacUserInterfaceCfg"];
            await reporting.bind(endpoint, coordinatorEndpoint, binds);
            await reporting.thermostatSystemMode(endpoint);
            await reporting.batteryVoltage(endpoint);
            await reporting.thermostatTemperature(endpoint);
            await reporting.thermostatRunningState(endpoint);
            await reporting.thermostatOccupiedHeatingSetpoint(endpoint);
            await reporting.thermostatOccupiedCoolingSetpoint(endpoint);
            await reporting.fanMode(endpoint);
        },
    },
];
//# sourceMappingURL=lux.js.map