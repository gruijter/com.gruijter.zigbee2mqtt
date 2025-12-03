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
const m = __importStar(require("../lib/modernExtend"));
exports.definitions = [
    {
        zigbeeModel: ["35938"],
        model: "ZB3102",
        vendor: "Jasco Products",
        description: "Zigbee plug-in smart dimmer",
        extend: [m.light({ configureReporting: true })],
    },
    {
        zigbeeModel: ["43132"],
        model: "43132",
        vendor: "Jasco",
        description: "Zigbee smart outlet",
        extend: [m.onOff(), m.electricityMeter({ cluster: "metering" })],
    },
    {
        zigbeeModel: ["43095"],
        model: "43095",
        vendor: "Jasco Products",
        description: "Zigbee smart plug-in switch with energy metering",
        fromZigbee: [fz.command_on_state, fz.command_off_state],
        extend: [m.onOff(), m.electricityMeter({ cluster: "metering" })],
    },
];
//# sourceMappingURL=jasco.js.map