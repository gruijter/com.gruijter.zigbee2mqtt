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
exports.definitions = [
    {
        zigbeeModel: ["ZBT-DimmableLight"],
        model: "4713407",
        vendor: "Airam",
        description: "LED OP A60 ZB 9W/827 E27",
        extend: [m.light({ configureReporting: true })],
    },
    {
        zigbeeModel: ["ZBT-Remote-EU-DIMV1A2"],
        model: "AIRAM-CTR.U",
        vendor: "Airam",
        description: "CTR.U remote",
        exposes: [
            e.action([
                "on",
                "off",
                "brightness_down_click",
                "brightness_up_click",
                "brightness_down_hold",
                "brightness_up_hold",
                "brightness_down_release",
                "brightness_up_release",
            ]),
        ],
        fromZigbee: [fz.command_on, fz.command_off, fz.command_step, fz.command_move, fz.command_stop, fz.command_recall],
        toZigbee: [],
    },
    {
        zigbeeModel: ["ZBT-Remote-EU-DIMV2A2"],
        model: "CTR.UBX",
        vendor: "Airam",
        description: "CTR.U remote BX",
        fromZigbee: [fz.command_on, fz.command_off, fz.command_step, fz.command_move, fz.command_stop, fz.command_recall],
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
            ]),
        ],
        toZigbee: [],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genBasic", "genOnOff", "genLevelCtrl", "genScenes"]);
        },
    },
    {
        zigbeeModel: ["Dimmable-GU10-4713404"],
        model: "4713406",
        vendor: "Airam",
        description: "GU10 spot 4.8W 2700K 385lm",
        extend: [m.light()],
    },
];
//# sourceMappingURL=airam.js.map