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
const legacy = __importStar(require("../lib/legacy"));
const tuya = __importStar(require("../lib/tuya"));
const e = exposes.presets;
const ea = exposes.access;
exports.definitions = [
    {
        fingerprint: tuya.fingerprint("TS0601", ["_TZE200_dmfguuli", "_TZE200_rxypyjkw"]),
        model: "EZ200",
        vendor: "Evanell",
        description: "Thermostatic radiator valve",
        fromZigbee: [legacy.fz.evanell_thermostat],
        toZigbee: [
            legacy.tz.evanell_thermostat_current_heating_setpoint,
            legacy.tz.evanell_thermostat_system_mode,
            legacy.tz.evanell_thermostat_child_lock,
        ],
        extend: [tuya.modernExtend.tuyaBase({ timeStart: "2000", bindBasicOnConfigure: true })],
        exposes: [
            e.child_lock(),
            e.battery(),
            e
                .climate()
                .withSetpoint("current_heating_setpoint", 5, 30, 0.5, ea.STATE_SET)
                .withLocalTemperature(ea.STATE)
                .withSystemMode(["off", "heat", "auto"], ea.STATE_SET),
        ],
    },
];
//# sourceMappingURL=evanell.js.map