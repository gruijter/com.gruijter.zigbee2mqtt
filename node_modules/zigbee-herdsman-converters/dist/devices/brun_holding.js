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
        zigbeeModel: ["Power Control Unit"],
        model: "Fire Fence",
        vendor: "Brun Holding",
        description: "Stove guard for safe cooking",
        extend: [
            m.deviceEndpoints({ endpoints: { main_switch: 1, short_override: 2 } }),
            m.onOff({ powerOnBehavior: false, endpointNames: ["main_switch"], description: "Main relay switch" }),
            m.onOff({ powerOnBehavior: false, endpointNames: ["short_override"], description: "Short override switch" }),
            m.electricityMeter({
                endpointNames: ["main_switch"],
                power: { multiplier: 1, divisor: 1 },
                voltage: false,
                current: false,
            }),
            m.battery(),
            m.temperature({ reporting: undefined }),
        ],
    },
];
//# sourceMappingURL=brun_holding.js.map