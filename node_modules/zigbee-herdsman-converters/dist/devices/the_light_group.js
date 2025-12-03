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
        zigbeeModel: ["S24019"],
        model: "S24019",
        vendor: "The Light Group",
        description: "SLC SmartOne led dimmer",
        fromZigbee: [fz.on_off, fz.brightness, fz.metering, fz.electrical_measurement],
        toZigbee: [tz.light_onoff_brightness, tz.level_config],
        exposes: [e.light_brightness().withLevelConfig()],
        configure: async (device, coordinatorEndpoint) => {
            // Endpoint 1
            const endpoint1 = device.getEndpoint(1);
            const binds1 = ["genOnOff", "genLevelCtrl", "haElectricalMeasurement", "seMetering"];
            await reporting.bind(endpoint1, coordinatorEndpoint, binds1);
            await reporting.onOff(endpoint1);
            await reporting.brightness(endpoint1);
            await reporting.readEletricalMeasurementMultiplierDivisors(endpoint1);
            await reporting.activePower(endpoint1, { min: 5, max: 3600, change: 1000 });
            await reporting.rmsCurrent(endpoint1, { min: 5, max: 3600, change: 100 });
            await reporting.rmsVoltage(endpoint1, { min: 5, max: 3600, change: 100 });
            // read switch state
            await endpoint1.read("genOnOff", ["onOff"]);
        },
    },
    {
        zigbeeModel: ["S57003"],
        model: "S57003",
        vendor: "The Light Group",
        description: "SLC SmartOne Zigbee wall remote 4-channels",
        fromZigbee: [fz.command_on, fz.command_off, fz.battery, fz.command_move, fz.command_stop],
        exposes: [
            e.battery(),
            e.action([
                "on_l1",
                "off_l1",
                "brightness_move_up_l1",
                "brightness_move_down_l1",
                "brightness_stop_l1",
                "on_l2",
                "off_l2",
                "brightness_move_up_l2",
                "brightness_move_down_l2",
                "brightness_stop_l2",
                "on_l3",
                "off_l3",
                "brightness_move_up_l3",
                "brightness_move_down_l3",
                "brightness_stop_l3",
                "on_l4",
                "off_l4",
                "brightness_move_up_l4",
                "brightness_move_down_l4",
                "brightness_stop_l4",
            ]),
        ],
        toZigbee: [],
        meta: { multiEndpoint: true },
        endpoint: (device) => {
            return { l1: 1, l2: 2, l3: 3, l4: 4 };
        },
    },
    {
        zigbeeModel: ["S24013"],
        model: "S24013",
        vendor: "The Light Group",
        description: "SLC SmartOne AC dimmer mini 200W Zigbee LN",
        extend: [m.light({ configureReporting: true })],
    },
    {
        zigbeeModel: ["S32052"],
        model: "S32052",
        vendor: "SLC",
        description: "SLC SmartOne Driver CC LED dimmable driver 2CH TW 350-1500mA 50W",
        extend: [m.light({ colorTemp: { range: [160, 450] } })],
    },
    {
        zigbeeModel: ["S32053"],
        model: "S32053",
        vendor: "The Light Group",
        description: "SLC SmartOne CV led dimmable driver",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["S32055"],
        model: "S32055",
        vendor: "The Light Group",
        description: "SLC SmartOne TW led dimmable driver 24V/75W",
        extend: [m.light({ colorTemp: { range: [160, 450] } })],
    },
    {
        zigbeeModel: ["S57007"],
        model: "S57007",
        vendor: "The Light Group",
        description: "SLC SmartOne Zigbee remote control Zigbee IP20",
        extend: [
            m.deviceEndpoints({ endpoints: { "1": 1, "2": 2, "3": 3 } }),
            m.battery(),
            m.commandsOnOff({ endpointNames: ["1", "2", "3"] }),
            m.commandsScenes({ endpointNames: ["1", "2", "3"] }),
        ],
    },
];
//# sourceMappingURL=the_light_group.js.map