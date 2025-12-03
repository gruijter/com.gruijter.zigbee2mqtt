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
const e = exposes.presets;
exports.definitions = [
    {
        zigbeeModel: ["ZBHS4RGBW"],
        model: "ZBHS4RGBW",
        vendor: "EVN",
        description: "Zigbee 4 channel RGBW remote control",
        fromZigbee: [
            fz.battery,
            fz.command_move_to_color,
            fz.command_move_to_color_temp,
            fz.command_move_hue,
            fz.command_step,
            fz.command_stop,
            fz.command_move,
            fz.command_recall,
            fz.command_on,
            fz.command_off,
        ],
        exposes: [
            e.battery(),
            e.action([
                "color_move",
                "color_temperature_move",
                "brightness_step_up",
                "brightness_step_down",
                "brightness_move_up",
                "brightness_move_down",
                "brightness_stop",
                "hue_move",
                "hue_stop",
                "recall_*",
                "on",
                "off",
            ]),
        ],
        toZigbee: [],
        meta: { multiEndpoint: true, battery: { dontDividePercentage: true } },
        endpoint: (device) => {
            return { ep1: 1, ep2: 2, ep3: 3, ep4: 4 };
        },
    },
    {
        zigbeeModel: ["ZB24100VS"],
        model: "ZB24100VS",
        vendor: "EVN",
        description: "Zigbee multicolor controller with power supply",
        extend: [m.light({ colorTemp: { range: [160, 450] }, color: { modes: ["xy", "hs"] } })],
    },
    {
        zigbeeModel: ["ZBPD23400"],
        model: "ZBPD23400",
        vendor: "EVN",
        description: "Zigbee AC dimmer",
        extend: [m.light({ configureReporting: true })],
    },
];
//# sourceMappingURL=evn.js.map