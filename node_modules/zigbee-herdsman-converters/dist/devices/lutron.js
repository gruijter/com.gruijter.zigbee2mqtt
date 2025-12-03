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
const e = exposes.presets;
const ea = exposes.access;
const fzLocal = {
    custom_command_move_to_level: {
        cluster: "genLevelCtrl",
        type: ["commandMoveToLevel", "commandMoveToLevelWithOnOff"],
        options: [exposes.options.simulated_brightness()],
        convert: (model, msg, publish, options, meta) => {
            // Map null to 255
            // https://github.com/Koenkk/zigbee2mqtt/issues/28450
            const newMsg = { ...msg, data: { ...msg.data, level: Number.isNaN(msg.data.level) ? 255 : msg.data.level } };
            return fz.command_move_to_level.convert(model, newMsg, publish, options, meta);
        },
    },
};
exports.definitions = [
    {
        zigbeeModel: ["LZL4BWHL01 Remote"],
        model: "LZL4BWHL01",
        vendor: "Lutron",
        description: "Connected bulb remote control",
        fromZigbee: [fz.command_step, fz.command_step, fzLocal.custom_command_move_to_level, fz.command_stop],
        toZigbee: [],
        exposes: [e.action(["brightness_step_down", "brightness_step_up", "brightness_stop", "brightness_move_to_level"])],
    },
    {
        zigbeeModel: ["Z3-1BRL"],
        model: "Z3-1BRL",
        vendor: "Lutron",
        description: "Aurora smart bulb dimmer",
        fromZigbee: [fzLocal.custom_command_move_to_level],
        extend: [m.battery()],
        exposes: [e.action(["brightness"]), e.numeric("brightness", ea.STATE)],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genLevelCtrl"]);
        },
        ota: true,
    },
];
//# sourceMappingURL=lutron.js.map