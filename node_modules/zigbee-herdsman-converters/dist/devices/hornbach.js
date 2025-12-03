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
const m = __importStar(require("../lib/modernExtend"));
exports.definitions = [
    {
        zigbeeModel: ["VIYU-A60-806-RGBW-10011725"],
        model: "10011725",
        vendor: "HORNBACH",
        description: "FLAIR Viyu smart LED bulb RGB E27",
        extend: [m.light({ colorTemp: { range: undefined }, color: true })],
    },
    {
        zigbeeModel: ["VIYU_A60_806_RGBW_10454471"],
        model: "10454471",
        vendor: "HORNBACH",
        description: "FLAIR Viyu smart LED bulb RGBW E27",
        extend: [m.light({ colorTemp: { range: [153, 555] }, color: true })],
    },
    {
        zigbeeModel: ["VIYU_C35_470_RGBW_10454467"],
        model: "10454467",
        vendor: "HORNBACH",
        description: "FLAIR Viyu smart LED candle RGB E14",
        extend: [m.light({ colorTemp: { range: [153, 555] }, color: true })],
    },
    {
        zigbeeModel: ["VIYU_C35_470_RGBW_10297667"],
        model: "10297667",
        vendor: "HORNBACH",
        description: "FLAIR Viyu smart LED bulb RGB E14",
        extend: [m.light({ colorTemp: { range: undefined }, color: true })],
    },
    {
        zigbeeModel: ["VIYU-A60-806-CCT-10011723"],
        model: "10011723",
        vendor: "HORNBACH",
        description: "FLAIR Viyu smart LED bulb CCT E27",
        extend: [m.light({ colorTemp: { range: [153, 370] } })],
    },
    {
        zigbeeModel: ["VIYU-C35-470-CCT-10011722"],
        model: "10011722",
        vendor: "HORNBACH",
        description: "FLAIR Viyu smart LED candle CCT E14",
        extend: [m.light({ colorTemp: { range: undefined } })],
    },
    {
        zigbeeModel: ["VIYU_GU10_350_RGBW_10297666"],
        model: "10297666",
        vendor: "HORNBACH",
        description: "FLAIR Viyu smart GU10 RGBW lamp",
        extend: [m.light({ colorTemp: { range: undefined }, color: true })],
    },
    {
        zigbeeModel: ["VIYU_GU10_350_RGBW_10454466"],
        model: "10454466",
        vendor: "HORNBACH",
        description: "FLAIR Viyu smart LED GU10 RGBW lamp",
        extend: [m.light({ colorTemp: { range: [153, 555] }, color: true })],
    },
    {
        zigbeeModel: ["VIYU-GU10-350-CCT-10011724"],
        model: "10011724",
        vendor: "HORNBACH",
        description: "FLAIR Viyu smart GU10 CCT lamp",
        extend: [m.light({ colorTemp: { range: undefined } })],
    },
    {
        zigbeeModel: ["VIYU_A60_470_FI_D_CCT_10297665"],
        model: "10297665",
        vendor: "HORNBACH",
        description: "FLAIR Viyu smart LED bulb CCT E27 filament",
        extend: [m.light({ colorTemp: { range: [250, 454] } })],
    },
    {
        zigbeeModel: ["VIYU_A60_806_CCT_10454469"],
        model: "10454469",
        vendor: "HORNBACH",
        description: "FLAIR Viyu smart LED bulb CCT E27",
        extend: [m.light({ colorTemp: { range: [220, 500] } })],
    },
    {
        zigbeeModel: ["VIYU_C35_470_CCT_10454468"],
        model: "10454468",
        vendor: "HORNBACH",
        description: "FLAIR Viyu smart LED bulb CCT E27",
        extend: [m.light({ colorTemp: { range: [200, 454] } })],
    },
    {
        zigbeeModel: ["VIYU_GU10_350_CCT_10454470"],
        model: "10454470",
        vendor: "HORNBACH",
        description: "FLAIR Viyu smart GU10 CCT lamp",
        extend: [m.light({ colorTemp: { range: [200, 454] } })],
    },
    {
        zigbeeModel: ["VIYU_MUSICA_CCT_10447293"],
        model: "10447293",
        vendor: "HORNBACH",
        description: "10445606 FLAIR Viyu Smart LED Ceiling Luminaire",
        extend: [m.light({ colorTemp: { range: [153, 370] } })],
    },
];
//# sourceMappingURL=hornbach.js.map