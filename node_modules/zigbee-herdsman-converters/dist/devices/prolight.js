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
        zigbeeModel: ["PROLIGHT E27 WHITE AND COLOUR"],
        model: "5412748727371",
        vendor: "Prolight",
        description: "E27 white and colour bulb",
        extend: [m.light({ colorTemp: { range: [153, 555] }, color: true })],
    },
    {
        zigbeeModel: ["PROLIGHT E27 WARM WHITE CLEAR"],
        model: "5412748727432",
        vendor: "Prolight",
        description: "E27 filament bulb dimmable",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["PROLIGHT E27 WARM WHITE"],
        model: "5412748727364",
        vendor: "Prolight",
        description: "E27 bulb dimmable",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["PROLIGHT GU10 WHITE AND COLOUR"],
        model: "5412748727401",
        vendor: "Prolight",
        description: "GU10 white and colour spot",
        extend: [m.light({ colorTemp: { range: [153, 555] }, color: true })],
    },
    {
        zigbeeModel: ["PROLIGHT GU10 WARM WHITE"],
        model: "5412748727395",
        vendor: "Prolight",
        description: "GU10 spot dimmable",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["PROLIGHT REMOTE CONTROL"],
        model: "5412748727388",
        vendor: "Prolight",
        description: "Remote control",
        toZigbee: [],
        fromZigbee: [
            fz.command_on,
            fz.command_off,
            fz.command_move_to_level,
            fz.command_move,
            fz.command_stop,
            fz.command_move_to_color_temp,
            fz.command_move_to_color,
            fz.command_move_color_temperature,
            fz.battery,
        ],
        exposes: [
            e.battery(),
            e.action([
                "on",
                "off",
                "color_temperature_move",
                "color_temperature_move_up",
                "color_temperature_move_down",
                "color_move",
                "brightness_move_up",
                "brightness_move_down",
                "brightness_stop",
                "brightness_move_to_level",
            ]),
        ],
    },
];
//# sourceMappingURL=prolight.js.map