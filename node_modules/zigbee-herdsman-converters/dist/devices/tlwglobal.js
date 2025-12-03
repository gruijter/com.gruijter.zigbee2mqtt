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
    // Tested working with firmware 2.5.3_r58: dimming, on/off, and effects give no
    // errors (although the stop effect and the finish effect do nothing).
    {
        zigbeeModel: ["K10-1220Z"],
        model: "K10-1220Z",
        vendor: "TLW Global",
        description: "12V LED smart driver 15W with 6-port micro plug connector",
        extend: [m.light()],
    },
    // K10-1230Z and K10-1250Z untested, but assumed to be consistent with K10-1220W
    {
        zigbeeModel: ["K10-1230Z"],
        model: "K10-1230Z",
        vendor: "TLW Global",
        description: "12V LED smart driver 30W with 6-port micro plug connector",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["K10-1250Z"],
        model: "K10-1250Z",
        vendor: "TLW Global",
        description: "12V LED smart driver 50W with 6-port micro plug connector",
        extend: [m.light()],
    },
];
//# sourceMappingURL=tlwglobal.js.map