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
        zigbeeModel: ["43076", "43109", "43102", "43100", "43094", "43084"],
        model: "43076",
        vendor: "Enbrighten",
        description: "Zigbee in-wall smart switch",
        extend: [m.identify(), m.onOff({ configureReporting: true, powerOnBehavior: false }), m.commandsOnOff({ commands: ["on", "off"], bind: true })],
        whiteLabel: [
            {
                model: "43109",
                vendor: "Enbrighten",
                description: "Zigbee in-wall smart switch",
                fingerprint: [{ modelID: "43109" }],
            },
            {
                model: "43102",
                vendor: "Enbrighten",
                description: "Zigbee in-wall tamper-resistant smart outlet",
                fingerprint: [{ modelID: "43102" }],
            },
            {
                model: "43100",
                vendor: "Enbrighten",
                description: "Zigbee plug-in outdoor smart switch",
                fingerprint: [{ modelID: "43100" }],
            },
            {
                model: "43094",
                vendor: "Enbrighten",
                description: "Zigbee plug-in indoor smart switch with dual outlets on one control",
                fingerprint: [{ modelID: "43094" }],
            },
            {
                model: "43084",
                vendor: "Enbrighten",
                description: "Zigbee in-wall smart toggle style switch",
                fingerprint: [{ modelID: "43084" }],
            },
        ],
    },
    {
        zigbeeModel: ["43078"],
        model: "43078",
        vendor: "Enbrighten",
        description: "Zigbee in-wall smart switch with energy monitoring",
        extend: [
            m.identify(),
            m.onOff({ configureReporting: true, powerOnBehavior: false }),
            m.electricityMeter({ cluster: "metering" }),
            m.commandsOnOff({ commands: ["on", "off"], bind: true }),
        ],
    },
    {
        zigbeeModel: ["43080", "43113", "43090", "43096"],
        model: "43080",
        vendor: "Enbrighten",
        description: "Zigbee in-wall smart dimmer",
        extend: [
            m.identify(),
            m.light({
                configureReporting: true,
                effect: false,
                powerOnBehavior: false,
                levelConfig: { features: ["on_level", "execute_if_off"] },
            }),
            m.commandsOnOff({ commands: ["on", "off"], bind: true }),
            m.commandsLevelCtrl({
                commands: ["brightness_move_up", "brightness_move_down", "brightness_stop"],
                bind: true,
            }),
        ],
        whiteLabel: [
            {
                model: "43113",
                vendor: "Enbrighten",
                description: "Zigbee in-wall smart dimmer",
                fingerprint: [{ modelID: "43113" }],
            },
            {
                model: "43090",
                vendor: "Enbrighten",
                description: "Zigbee in-wall smart toggle style dimmer",
                fingerprint: [{ modelID: "43090" }],
            },
            {
                model: "43096",
                vendor: "Enbrighten",
                description: "Zigbee plug-in smart dimmer with dual outlets on one control",
                fingerprint: [{ modelID: "43096" }],
            },
        ],
    },
    {
        zigbeeModel: ["43082"],
        model: "43082",
        vendor: "Enbrighten",
        description: "Zigbee in-wall smart dimmer",
        extend: [
            m.identify(),
            m.light({
                configureReporting: true,
                effect: false,
                powerOnBehavior: false,
                levelConfig: { features: ["on_level", "execute_if_off"] },
            }),
            m.electricityMeter({ cluster: "metering" }),
            m.commandsOnOff({ commands: ["on", "off"], bind: true }),
            m.commandsLevelCtrl({
                commands: ["brightness_move_up", "brightness_move_down", "brightness_stop"],
                bind: true,
            }),
        ],
    },
];
//# sourceMappingURL=enbrighten.js.map