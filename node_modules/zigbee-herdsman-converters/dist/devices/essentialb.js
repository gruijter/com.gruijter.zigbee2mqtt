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
        zigbeeModel: ["EB-E14-P45-RGBW"],
        model: "EB-E14-P45-RGBW",
        vendor: "EssentielB",
        description: "Smart LED bulb",
        extend: [m.light({ colorTemp: { range: [153, 370] }, color: true })],
    },
    {
        zigbeeModel: ["EB-E14-FLA-CCT"],
        model: "EB-E14-FLA-CCT",
        vendor: "EssentielB",
        description: "E14 flame CCT light bulb",
        extend: [m.light({ colorTemp: { range: [153, 454] } })],
    },
    {
        zigbeeModel: ["EB-E27-A60-CCT-FC"],
        model: "EB-E27-A60-CCT-FC",
        vendor: "EssentielB",
        description: "E27 A60 CCT filament clear light bulb",
        extend: [m.light({ colorTemp: { range: [153, 454] } })],
    },
    {
        zigbeeModel: ["EB-E27-A60-CCT"],
        model: "EB-E27-A60-CCT",
        vendor: "EssentielB",
        description: "E27 A60 CCT light bulb",
        extend: [m.light({ colorTemp: { range: [153, 454] } })],
    },
    {
        zigbeeModel: ["EB-E27-A60-RGBW"],
        model: "EB-E27-A60-RGBW",
        vendor: "EssentielB",
        description: "E27 A60 RGBW light bulb",
        extend: [m.light({ colorTemp: { range: [153, 370] }, color: true })],
    },
    {
        zigbeeModel: ["EB-E27-G95-CCT-FV"],
        model: "EB-E27-G95-CCT-FV",
        vendor: "EssentielB",
        description: "Filament vintage globe light bulb",
        extend: [m.light({ colorTemp: { range: [153, 454] } })],
    },
    {
        zigbeeModel: ["EB-E27-ST64-CCT-FV"],
        model: "EB-E27-ST64-CCT-FV",
        vendor: "EssentielB",
        description: "Filament vintage edison light bulb",
        extend: [m.light({ colorTemp: { range: [153, 454] } })],
    },
    {
        zigbeeModel: ["EB-GU10-MR16-CCT"],
        model: "EB-GU10-MR16-CCT",
        vendor: "EssentielB",
        description: "GU10 MR16 CCT light bulb",
        extend: [m.light({ colorTemp: { range: [153, 454] } })],
    },
    {
        zigbeeModel: ["EB-GU10-MR16-RGBW"],
        model: "EB-GU10-MR16-RGBW",
        vendor: "EssentielB",
        description: "GU10 MR16 RGBW light bulb",
        extend: [m.light({ colorTemp: { range: [153, 370] }, color: true })],
    },
    {
        zigbeeModel: ["EB-SB-1B"],
        model: "EB-SB-1B",
        vendor: "EssentielB",
        description: "Smart button",
        fromZigbee: [fz.battery, fz.command_on, fz.command_off, fz.command_step, fz.command_stop, fz.command_step_color_temperature],
        toZigbee: [],
        exposes: [
            e.battery(),
            e.action([
                "on",
                "off",
                "color_temperature_step_up",
                "color_temperature_step_down",
                "brightness_step_up",
                "brightness_step_down",
                "brightness_stop",
            ]),
        ],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            const binds = ["genBasic", "genOnOff", "genPowerCfg", "lightingColorCtrl", "genLevelCtrl"];
            await reporting.bind(endpoint, coordinatorEndpoint, binds);
            await reporting.batteryPercentageRemaining(endpoint);
        },
    },
];
//# sourceMappingURL=essentialb.js.map