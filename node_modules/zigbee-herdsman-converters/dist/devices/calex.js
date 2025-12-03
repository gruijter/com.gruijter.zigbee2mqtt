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
        zigbeeModel: ["EC-Z3.0-CCT"],
        model: "421786",
        vendor: "Calex",
        description: "LED A60 Zigbee GLS-lamp",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["EC-Z3.0-RGBW"],
        model: "421792",
        vendor: "Calex",
        description: "LED A60 Zigbee RGB lamp",
        extend: [m.light({ colorTemp: { range: [153, 370] }, color: { modes: ["xy", "hs"] } })],
    },
    {
        zigbeeModel: ["Smart Wall Switch "], // Yes, it has a space at the end :(
        model: "421782",
        vendor: "Calex",
        description: "Smart Wall Switch, wall mounted RGB controller",
        toZigbee: [],
        fromZigbee: [
            fz.command_off,
            fz.command_on,
            fz.command_step,
            fz.command_move_to_color_temp,
            fz.command_move,
            fz.command_stop,
            fz.command_enhanced_move_to_hue_and_saturation,
        ],
        exposes: [
            e.action([
                "on",
                "off",
                "color_temperature_move",
                "brightness_step_up",
                "brightness_step_down",
                "brightness_move_up",
                "brightness_move_down",
                "brightness_stop",
                "enhanced_move_to_hue_and_saturation",
            ]),
        ],
        meta: { disableActionGroup: true },
    },
];
//# sourceMappingURL=calex.js.map