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
        zigbeeModel: ["1719SP-PS1-02"],
        model: "SP-PS1-02",
        vendor: "Spotmau",
        description: "Smart wall switch - 1 gang",
        extend: [m.onOff()],
        endpoint: (device) => {
            return { default: 16 };
        },
    },
    {
        zigbeeModel: ["1719SP-PS2-02"],
        model: "SP-PS2-02",
        vendor: "Spotmau",
        description: "Smart wall switch - 2 gang",
        extend: [m.deviceEndpoints({ endpoints: { left: 16, right: 17 } }), m.onOff({ endpointNames: ["left", "right"] })],
    },
    {
        zigbeeModel: ["1719SP-PS3-02"],
        model: "SP-PS3-02",
        vendor: "Spotmau",
        description: "Smart wall switch - 3 gang",
        extend: [m.deviceEndpoints({ endpoints: { left: 16, center: 17, right: 18 } }), m.onOff({ endpointNames: ["left", "center", "right"] })],
    },
    {
        zigbeeModel: ["1719SP-WS-02"],
        model: "SP-WS-02",
        vendor: "Spotmau",
        description: "Smart wall switch - Socket",
        extend: [m.onOff()],
        endpoint: (device) => {
            return { default: 16 };
        },
    },
];
//# sourceMappingURL=spotmau.js.map