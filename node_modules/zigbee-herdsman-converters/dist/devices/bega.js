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
        fingerprint: [
            {
                type: "Router",
                manufacturerName: "BEGA Gantenbrink-Leuchten KG",
                modelID: "",
                endpoints: [{ ID: 1, profileID: 260, deviceID: 258, inputClusters: [0, 3, 4, 5, 6, 8, 9, 768, 769, 64733], outputClusters: [25] }],
            },
        ],
        model: "70049",
        vendor: "Bega",
        description: "Zigbee control module DALI",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["BEGA 13557 bulb E27 RGBW 805lm"],
        model: "13557",
        vendor: "Bega",
        description: "LED lamp with adjustable LED color temperature (Tunable White - RGBW) for use in luminaires with E27 lamp base",
        extend: [m.light({ colorTemp: { range: [153, 556] }, color: true })],
    },
    {
        zigbeeModel: ["BEGA 85000 Garden Spotlight"],
        model: "85000",
        vendor: "Bega",
        description: "Wired Garden LED Spotlight color temperature (Tunable White - RGBW)",
        extend: [m.light({ colorTemp: { range: [50, 1000] }, color: { modes: ["xy", "hs"], enhancedHue: true } })],
    },
];
//# sourceMappingURL=bega.js.map