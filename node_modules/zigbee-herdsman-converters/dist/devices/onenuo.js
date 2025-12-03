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
const exposes = __importStar(require("../lib/exposes"));
const tuya = __importStar(require("../lib/tuya"));
const e = exposes.presets;
const ea = exposes.access;
exports.definitions = [
    {
        fingerprint: tuya.fingerprint("TS0601", ["_TZE204_kgaxpvxr", "_TZE284_n4ttsck2"]),
        model: "288WZ",
        vendor: "ONENUO",
        description: "Smoke detector",
        extend: [tuya.modernExtend.tuyaBase({ dp: true })],
        exposes: [
            e.smoke(),
            e.battery(),
            tuya.exposes.silence(),
            tuya.exposes.selfTestResult(),
            e
                .enum("smoke_state", ea.STATE, ["alarm", "normal", "detecting", "unknown"])
                .withLabel("Smoke state")
                .withDescription("Possible states: alarm, normal, detecting, unknown"),
            e.enum("sensitivity", ea.STATE_SET, ["low", "medium", "high"]).withLabel("Sensitivity").withDescription("Smoke detection sensitivity"),
        ],
        meta: {
            tuyaDatapoints: [
                [
                    1,
                    null,
                    {
                        from: (v) => {
                            const lookup = { alarm: tuya.enum(0), normal: tuya.enum(1), detecting: tuya.enum(2), unknown: tuya.enum(3) };
                            const smokeState = Object.entries(lookup).find((i) => i[1].valueOf() === v)[0];
                            return {
                                smoke: smokeState === "alarm",
                                smoke_state: smokeState,
                            };
                        },
                    },
                ],
                [15, "battery", tuya.valueConverter.raw],
                [16, "silence", tuya.valueConverter.raw],
                [101, "self_test_result", tuya.valueConverterBasic.lookup({ failure: false, success: true })],
                [102, "sensitivity", tuya.valueConverterBasic.lookup({ low: tuya.enum(0), medium: tuya.enum(1), high: tuya.enum(2) })],
            ],
        },
    },
];
//# sourceMappingURL=onenuo.js.map