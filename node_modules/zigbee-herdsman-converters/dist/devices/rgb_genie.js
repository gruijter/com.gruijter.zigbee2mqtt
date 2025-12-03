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
const m = __importStar(require("../lib/modernExtend"));
const reporting = __importStar(require("../lib/reporting"));
const utils = __importStar(require("../lib/utils"));
const e = exposes.presets;
const fzLocal = {
    // ZB-1026 requires separate on/off converters since it re-uses the transaction number
    // https://github.com/Koenkk/zigbee2mqtt/issues/12957
    // biome-ignore lint/style/useNamingConvention: ignored using `--suppress`
    ZB1026_command_on: {
        cluster: "genOnOff",
        type: "commandOn",
        convert: (model, msg, publish, options, meta) => {
            const payload = { action: utils.postfixWithEndpointName("on", msg, model, meta) };
            utils.addActionGroup(payload, msg, model);
            return payload;
        },
    },
    // biome-ignore lint/style/useNamingConvention: ignored using `--suppress`
    ZB1026_command_off: {
        cluster: "genOnOff",
        type: "commandOff",
        convert: (model, msg, publish, options, meta) => {
            const payload = { action: utils.postfixWithEndpointName("off", msg, model, meta) };
            utils.addActionGroup(payload, msg, model);
            return payload;
        },
    },
};
exports.definitions = [
    {
        zigbeeModel: ["RGBgenie ZB-1026"],
        model: "ZB-1026",
        vendor: "RGB Genie",
        description: "Zigbee LED dimmer controller",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["RGBgenie ZB-5001"],
        model: "ZB-5001",
        vendor: "RGB Genie",
        description: "Zigbee 3.0 remote control",
        fromZigbee: [fz.command_recall, fzLocal.ZB1026_command_on, fzLocal.ZB1026_command_off, fz.command_move, fz.command_stop, fz.battery],
        exposes: [e.battery(), e.action(["recall_*", "on", "off", "brightness_stop", "brightness_move_up", "brightness_move_down"])],
        toZigbee: [],
    },
    {
        zigbeeModel: ["RGBgenie ZB-5121"],
        model: "ZB-5121",
        vendor: "RGB Genie",
        description: "Micro remote and dimmer with single scene recall",
        fromZigbee: [fz.battery, fz.command_on, fz.command_off, fz.command_step, fz.command_move, fz.command_stop, fz.command_recall],
        exposes: [
            e.battery(),
            e.action([
                "on",
                "off",
                "brightness_step_up",
                "brightness_step_down",
                "brightness_move_up",
                "brightness_move_down",
                "brightness_stop",
                "recall_*",
            ]),
        ],
        toZigbee: [],
        meta: { battery: { dontDividePercentage: true } },
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genOnOff", "genPowerCfg"]);
            await reporting.batteryVoltage(endpoint);
            await reporting.batteryPercentageRemaining(endpoint);
        },
    },
    {
        zigbeeModel: ["RGBgenie ZB-5122"],
        model: "ZB-5122",
        vendor: "RGB Genie",
        description: "Micro remote and color dimmer with single scene recall",
        fromZigbee: [
            fz.battery,
            fz.command_on,
            fz.command_off,
            fz.command_step,
            fz.command_move,
            fz.command_stop,
            fz.command_recall,
            fz.command_move_to_color,
            fz.command_move_to_color_temp,
            fz.command_move_hue,
            fz.command_move_color_temperature,
        ],
        exposes: [
            e.battery(),
            e.action([
                "on",
                "off",
                "brightness_step_up",
                "brightness_step_down",
                "brightness_move_up",
                "brightness_move_down",
                "brightness_stop",
                "recall_*",
                "color_temperature_move_up",
                "color_temperature_move_down",
                "hue_move",
                "hue_stop",
            ]),
        ],
        toZigbee: [],
    },
    {
        zigbeeModel: ["RGBgenie ZB-3008"],
        model: "ZB-3008",
        vendor: "RGB Genie",
        description: "3 scene remote and dimmer ",
        fromZigbee: [
            fz.command_recall,
            fz.command_move_hue,
            fz.command_move,
            fz.command_stop,
            fz.command_on,
            fz.command_off,
            fz.command_move_to_color_temp,
            fz.command_move_to_color,
            fz.command_move_color_temperature,
        ],
        toZigbee: [],
        exposes: [
            e.action([
                "on",
                "off",
                "brightness_step_up",
                "brightness_step_down",
                "brightness_move_up",
                "brightness_move_down",
                "brightness_stop",
                "recall_*",
                "hue_move",
                "color_temperature_move",
                "color_move",
                "color_temperature_move_up",
                "color_temperature_move_down",
                "hue_stop",
            ]),
        ],
        meta: { multiEndpoint: true },
    },
    {
        zigbeeModel: ["RGBgenie ZB-3009"],
        model: "ZB-3009",
        vendor: "RGB Genie",
        description: "3 scene remote and dimmer ",
        fromZigbee: [
            fz.command_recall,
            fz.command_move_hue,
            fz.command_move,
            fz.command_stop,
            fz.command_on,
            fz.command_off,
            fz.command_move_to_color_temp,
            fz.command_move_to_color,
            fz.command_move_color_temperature,
        ],
        toZigbee: [],
        exposes: [
            e.action([
                "on",
                "off",
                "brightness_step_up",
                "brightness_step_down",
                "brightness_move_up",
                "brightness_move_down",
                "brightness_stop",
                "recall_*",
                "hue_move",
                "color_temperature_move",
                "color_move",
                "color_temperature_move_up",
                "color_temperature_move_down",
                "hue_stop",
            ]),
        ],
    },
    {
        zigbeeModel: ["RGBgenie ZB-5028"],
        model: "ZB-5028",
        vendor: "RGB Genie",
        description: "RGB remote with 4 endpoints and 3 scene recalls",
        fromZigbee: [
            fz.battery,
            fz.command_on,
            fz.command_off,
            fz.command_step,
            fz.command_move,
            fz.command_stop,
            fz.command_recall,
            fz.command_move_hue,
            fz.command_move_to_color,
            fz.command_move_to_color_temp,
        ],
        exposes: [
            e.battery(),
            e.action([
                "on",
                "off",
                "brightness_step_up",
                "brightness_step_down",
                "brightness_move_up",
                "brightness_move_down",
                "brightness_stop",
                "recall_1",
                "recall_2",
                "recall_3",
                "hue_move",
                "color_temperature_move",
                "color_move",
                "hue_stop",
            ]),
        ],
        toZigbee: [],
        meta: { multiEndpoint: true, battery: { dontDividePercentage: true } },
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genOnOff", "genPowerCfg"]);
            await reporting.batteryVoltage(endpoint);
            await reporting.batteryPercentageRemaining(endpoint);
        },
    },
    {
        zigbeeModel: ["RGBgenie ZB-5004"],
        model: "ZB-5004",
        vendor: "RGB Genie",
        description: "Zigbee 3.0 remote control",
        fromZigbee: [fz.command_recall, fz.command_on, fz.command_off, fz.command_move, fz.command_stop, fz.battery],
        exposes: [e.battery(), e.action(["recall_*", "on", "off", "brightness_stop", "brightness_move_up", "brightness_move_down"])],
        toZigbee: [],
    },
];
//# sourceMappingURL=rgb_genie.js.map