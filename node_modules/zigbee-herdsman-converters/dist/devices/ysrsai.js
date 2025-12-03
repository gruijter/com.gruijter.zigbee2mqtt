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
const tuya = __importStar(require("../lib/tuya"));
exports.definitions = [
    {
        fingerprint: [
            { modelID: "ZB-CL01", manufacturerName: "YSRSAI" },
            { modelID: "TS0503B", manufacturerName: "_TZ3210_f0byevky" },
        ],
        zigbeeModel: ["ZB-CL03", "FB56-ZCW20FB1.2"],
        model: "YSR-MINI-01_rgbcct",
        vendor: "YSRSAI",
        description: "Zigbee LED controller (RGB+CCT)",
        extend: [tuya.modernExtend.tuyaLight({ colorTemp: { range: [160, 370] }, color: true })],
    },
    {
        zigbeeModel: ["ZB-CT01"],
        model: "YSR-MINI-01_wwcw",
        vendor: "YSRSAI",
        description: "Zigbee LED controller (WW/CW)",
        extend: [tuya.modernExtend.tuyaLight({ colorTemp: { range: [153, 500] } })],
        configure: (device, coordinatorEndpoint) => {
            device.getEndpoint(1).saveClusterAttributeKeyValue("lightingColorCtrl", { colorCapabilities: 0x10 });
        },
    },
    {
        zigbeeModel: ["ZB-DL01"],
        model: "YSR-MINI-01_dimmer",
        vendor: "YSRSAI",
        description: "Zigbee LED controller (Dimmer)",
        extend: [tuya.modernExtend.tuyaLight({ configureReporting: true })],
    },
];
//# sourceMappingURL=ysrsai.js.map