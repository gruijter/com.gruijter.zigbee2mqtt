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
        zigbeeModel: ["VOLARE ZB3\u0000\u0000\u0000\u0000\u0000\u0000\u0000"],
        model: "676-00301024955Z",
        vendor: "TCI",
        description: "Dash L DC Volare",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["MAXI JOLLY ZB3"],
        model: "151570",
        vendor: "TCI",
        description: "LED driver for wireless control (60 watt)",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["PROFESSIONALE ZB3"],
        model: "122576",
        vendor: "TCI",
        description: "Direct current wireless dimmable electronic drivers with DIP-SWITCH",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["TCI - Mini ZLL I"],
        model: "TCI - Mini ZLL I",
        vendor: "TCI",
        description: "Dali 1-10V driver",
        extend: [m.light(), m.commandsOnOff(), m.commandsLevelCtrl()],
    },
];
//# sourceMappingURL=tci.js.map