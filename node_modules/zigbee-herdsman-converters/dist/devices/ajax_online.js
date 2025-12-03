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
const tuya = __importStar(require("../lib/tuya"));
exports.definitions = [
    {
        zigbeeModel: ["AJ-RGBCCT 5 in 1"],
        model: "Aj_Zigbee_Led_Strip",
        vendor: "Ajax Online",
        description: "LED Strip",
        extend: [m.light({ colorTemp: { range: undefined }, color: true })],
    },
    {
        zigbeeModel: ["AJ_ZB30_GU10", "AJ_ZB120_GU10"],
        model: "AJ_ZB_GU10",
        vendor: "Ajax Online",
        description: "Smart Zigbee pro GU10 spotlight bulb",
        extend: [m.light({ colorTemp: { range: [158, 495] }, color: true, effect: false })],
    },
    {
        zigbeeModel: ["AJ_ZBPROA60", "AJ_ZBPROA6"],
        model: "AJ_ZIGPROA60",
        vendor: "Ajax Online",
        description: "Smart Zigbee pro 12W A60 bulb",
        extend: [m.light({ colorTemp: { range: [158, 495] }, color: true, turnsOffAtBrightness1: true })],
    },
    {
        zigbeeModel: ["ZB_A60_RGBCW"],
        model: "ZB_A60_RGBCW",
        vendor: "Ajax Online",
        description: "Smart Zigbee pro 12W A60 RGBCW bulb",
        extend: [m.light({ colorTemp: { range: [153, 500] }, color: true })],
    },
    {
        fingerprint: tuya.fingerprint("TS0505B", ["_TZ3210_hzy4rjz3"]),
        model: "AJ_RGBCCT_CTRL",
        vendor: "Ajax Online",
        description: "Smart Zigbee LED strip RGB+CCT",
        extend: [tuya.modernExtend.tuyaLight({ color: true, colorTemp: { range: [153, 500] } })],
    },
    {
        fingerprint: [{ modelID: "CCT Light", manufacturerName: "ZB/Ajax Online", manufacturerID: 4137 }],
        model: "ZB-CCT_Filament",
        vendor: "Ajax Online",
        description: "Zigbee LED filament light dimmable E27, edison ST64, flame 2200K",
        extend: [m.light({ colorTemp: { range: [153, 454] } })],
    },
];
//# sourceMappingURL=ajax_online.js.map