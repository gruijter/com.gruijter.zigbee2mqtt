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
const sunricher = __importStar(require("../lib/sunricher"));
exports.definitions = [
    {
        fingerprint: [
            { modelID: "WSZ 98426061", manufacturerName: "Nordtronic A/S" },
            { modelID: "WSZ 98426061", manufacturerName: "Nordtronic" },
            { modelID: "98426061", manufacturerName: "Nordtronic A/S" },
            { modelID: "98426061", manufacturerName: "Nordtronic" },
        ],
        model: "98426061",
        vendor: "Nordtronic",
        description: "Remote Control",
        extend: [m.battery(), m.identify(), m.commandsOnOff(), m.commandsLevelCtrl(), m.commandsColorCtrl()],
    },
    {
        zigbeeModel: ["BoxDIM2 98425031", "98425031", "BoxDIMZ 98425031"],
        model: "98425031",
        vendor: "Nordtronic",
        description: "Box Dimmer 2.0",
        extend: [m.light({ configureReporting: true })],
    },
    {
        zigbeeModel: ["BoxRelay2 98423051", "98423051", "BoxRelayZ 98423051"],
        model: "98423051",
        vendor: "Nordtronic",
        description: "Zigbee switch 400W",
        extend: [m.onOff()],
    },
    {
        zigbeeModel: ["RotDIM2 98424072", "98424072", "RotDIMZ 98424072"],
        model: "98424072",
        vendor: "Nordtronic",
        description: "Zigbee rotary dimmer",
        extend: [m.light({ configureReporting: true }), m.electricityMeter()],
    },
    {
        zigbeeModel: ["BoxDimZG2 98425271"],
        model: "98425271",
        vendor: "Nordtronic",
        description: "Box Dimmer G2",
        extend: [m.light({ configureReporting: true }), m.electricityMeter()],
    },
    {
        zigbeeModel: ["CoDIMZ 98425033"],
        model: "98425033",
        vendor: "Nordtronic",
        description: "Ceiling mounted zigbee micro smart dimmer",
        extend: [m.light({ configureReporting: true }), m.electricityMeter(), sunricher.extend.externalSwitchType()],
    },
    {
        zigbeeModel: ["DINDimZ 98425034"],
        model: "98425034",
        vendor: "Nordtronic",
        description: "Zigbee din rail smart dimmer",
        extend: [m.light({ configureReporting: true }), m.electricityMeter()],
    },
];
//# sourceMappingURL=nordtronic.js.map