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
const constants = __importStar(require("../lib/constants"));
const exposes = __importStar(require("../lib/exposes"));
const reporting = __importStar(require("../lib/reporting"));
const utils = __importStar(require("../lib/utils"));
const e = exposes.presets;
const ea = exposes.access;
exports.definitions = [
    {
        zigbeeModel: ["E-Ctrl", "RPH E-Ctrl", "RSS E-Ctrl"],
        model: "E-Ctrl",
        vendor: "Imhotep Creation",
        description: "Heater thermostat PH25 and compliant",
        whiteLabel: [
            {
                vendor: "Imhotep Creation",
                model: "RSS E-Ctrl",
                description: "Towel heater thermostat THIE (TH ECTRL) and compliant",
                fingerprint: [{ modelID: "RSS E-Ctrl" }],
            },
            {
                vendor: "Imhotep Creation",
                model: "RPH E-Ctrl",
                description: "Panel radiant heater thermostat MPHIE (NRPH) and compliant",
                fingerprint: [{ modelID: "RPH E-Ctrl" }],
            },
        ],
        fromZigbee: [fz.thermostat, fz.occupancy],
        toZigbee: [
            tz.thermostat_system_mode,
            tz.thermostat_occupied_heating_setpoint,
            tz.thermostat_min_heat_setpoint_limit,
            tz.thermostat_max_heat_setpoint_limit,
            tz.thermostat_local_temperature,
            tz.thermostat_setpoint_raise_lower,
        ],
        exposes: [
            e.climate().withSystemMode(["off", "heat"]).withLocalTemperature().withSetpoint("occupied_heating_setpoint", 5, 30, 0.5, ea.ALL),
            e
                .numeric("min_heat_setpoint_limit", ea.ALL)
                .withUnit("°C")
                .withDescription("Minimum Heating set point limit")
                .withValueMin(5)
                .withValueMax(30)
                .withValueStep(0.5),
            e
                .numeric("max_heat_setpoint_limit", ea.ALL)
                .withUnit("°C")
                .withDescription("Maximum Heating set point limit")
                .withValueMin(5)
                .withValueMax(30)
                .withValueStep(0.5),
            e.occupancy(),
        ],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device?.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["hvacThermostat", "msOccupancySensing"]);
            await reporting.thermostatSystemMode(endpoint);
            await reporting.occupancy(endpoint);
            await reporting.thermostatTemperature(endpoint);
            await reporting.thermostatOccupiedHeatingSetpoint(endpoint);
            await endpoint.read("hvacThermostat", ["localTemp"]);
            await endpoint.read("hvacThermostat", ["absMinHeatSetpointLimit"]);
            await endpoint.read("hvacThermostat", ["absMaxHeatSetpointLimit"]);
            await endpoint.read("hvacThermostat", ["minHeatSetpointLimit"]);
            await endpoint.read("hvacThermostat", ["maxHeatSetpointLimit"]);
            await endpoint.read("hvacThermostat", ["occupiedHeatingSetpoint"]);
            await endpoint.read("hvacThermostat", ["systemMode"]);
            await endpoint.read("msOccupancySensing", ["occupancy"]);
        },
    },
    {
        zigbeeModel: ["BRI4P"],
        model: "BRI4P",
        vendor: "Imhotep Creation",
        description: "BRI4P Bridge for underfloor heating central and local thermostats",
        fromZigbee: [fz.thermostat],
        toZigbee: [
            tz.thermostat_local_temperature,
            tz.thermostat_system_mode,
            tz.thermostat_occupied_heating_setpoint,
            tz.thermostat_occupied_cooling_setpoint,
            tz.thermostat_min_heat_setpoint_limit,
            tz.thermostat_max_heat_setpoint_limit,
            tz.thermostat_min_cool_setpoint_limit,
            tz.thermostat_max_cool_setpoint_limit,
            tz.thermostat_setpoint_raise_lower,
        ],
        meta: { multiEndpoint: true },
        endpoint: (device) => {
            return {
                l1: 1,
                l2: 2,
                l3: 3,
                l4: 4,
                l5: 5,
                l6: 6,
                l7: 7,
                l8: 8,
                l9: 9,
                l10: 10,
                l11: 11,
                l12: 12,
                l13: 13,
                l14: 14,
                l15: 15,
                l16: 16,
            };
        },
        exposes: (device, options) => {
            const features = [];
            if (!utils.isDummyDevice(device)) {
                for (let i = 1; i <= 16; i++) {
                    const endpoint = device?.getEndpoint(i);
                    if (endpoint !== undefined) {
                        const epName = `l${i}`;
                        features.push(e.climate().withSystemMode(["off", "cool", "heat"]).withLocalTemperature().withEndpoint(epName));
                        features.push(e.climate().withSetpoint("occupied_heating_setpoint", 5, 30, 0.5, ea.ALL).withEndpoint(epName));
                        features.push(e
                            .numeric("min_heat_setpoint_limit", ea.ALL)
                            .withUnit("°C")
                            .withDescription("Minimum Heating set point limit")
                            .withValueMin(5)
                            .withValueMax(30)
                            .withValueStep(0.5)
                            .withEndpoint(epName));
                        features.push(e
                            .numeric("max_heat_setpoint_limit", ea.ALL)
                            .withUnit("°C")
                            .withDescription("Maximum Heating set point limit")
                            .withValueMin(5)
                            .withValueMax(30)
                            .withValueStep(0.5)
                            .withEndpoint(epName));
                        features.push(e.climate().withSetpoint("occupied_cooling_setpoint", 5, 38, 0.5, ea.ALL).withEndpoint(epName));
                        features.push(e
                            .numeric("min_cool_setpoint_limit", ea.ALL)
                            .withUnit("°C")
                            .withDescription("Minimum Cooling point limit")
                            .withValueMin(5)
                            .withValueMax(38)
                            .withValueStep(0.5)
                            .withEndpoint(epName));
                        features.push(e
                            .numeric("max_cool_setpoint_limit", ea.ALL)
                            .withUnit("°C")
                            .withDescription("Maximum Cooling set point limit")
                            .withValueMin(5)
                            .withValueMax(38)
                            .withValueStep(0.5)
                            .withEndpoint(epName));
                    }
                }
            }
            return features;
        },
        configure: async (device, coordinatorEndpoint) => {
            for (let i = 1; i <= 20; i++) {
                const endpoint = device?.getEndpoint(i);
                if (typeof endpoint !== "undefined") {
                    await reporting.bind(endpoint, coordinatorEndpoint, ["hvacThermostat"]);
                    await reporting.thermostatSystemMode(endpoint);
                    await reporting.thermostatTemperature(endpoint);
                    await reporting.thermostatOccupiedHeatingSetpoint(endpoint);
                    await reporting.thermostatOccupiedCoolingSetpoint(endpoint);
                    const thermostatMinHeatSetpointLimit = async (endpoint) => {
                        const p = reporting.payload("minHeatSetpointLimit", 0, constants.repInterval.HOUR, 10);
                        await endpoint.configureReporting("hvacThermostat", p);
                    };
                    const thermostatMaxHeatSetpointLimit = async (endpoint) => {
                        const p = reporting.payload("maxHeatSetpointLimit", 0, constants.repInterval.HOUR, 10);
                        await endpoint.configureReporting("hvacThermostat", p);
                    };
                    const thermostatMinCoolSetpointLimit = async (endpoint) => {
                        const p = reporting.payload("minCoolSetpointLimit", 0, constants.repInterval.HOUR, 10);
                        await endpoint.configureReporting("hvacThermostat", p);
                    };
                    const thermostatMaxCoolSetpointLimit = async (endpoint) => {
                        const p = reporting.payload("maxCoolSetpointLimit", 0, constants.repInterval.HOUR, 10);
                        await endpoint.configureReporting("hvacThermostat", p);
                    };
                    await thermostatMinHeatSetpointLimit(endpoint);
                    await thermostatMaxHeatSetpointLimit(endpoint);
                    await thermostatMinCoolSetpointLimit(endpoint);
                    await thermostatMaxCoolSetpointLimit(endpoint);
                    await endpoint.read("hvacThermostat", ["localTemp"]);
                    await endpoint.read("hvacThermostat", ["systemMode"]);
                    await endpoint.read("hvacThermostat", ["absMinHeatSetpointLimit"]);
                    await endpoint.read("hvacThermostat", ["absMaxHeatSetpointLimit"]);
                    await endpoint.read("hvacThermostat", ["minHeatSetpointLimit"]);
                    await endpoint.read("hvacThermostat", ["maxHeatSetpointLimit"]);
                    await endpoint.read("hvacThermostat", ["absMinCoolSetpointLimit"]);
                    await endpoint.read("hvacThermostat", ["absMaxCoolSetpointLimit"]);
                    await endpoint.read("hvacThermostat", ["minCoolSetpointLimit"]);
                    await endpoint.read("hvacThermostat", ["maxCoolSetpointLimit"]);
                    await endpoint.read("hvacThermostat", ["occupiedHeatingSetpoint"]);
                    await endpoint.read("hvacThermostat", ["occupiedCoolingSetpoint"]);
                }
            }
        },
    },
];
//# sourceMappingURL=imhotepcreation.js.map