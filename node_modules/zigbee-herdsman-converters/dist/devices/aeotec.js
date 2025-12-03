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
        zigbeeModel: ["WG001-Z01"],
        model: "WG001",
        vendor: "Aeotec",
        description: "Range extender Zi",
        fromZigbee: [fz.linkquality_from_basic],
        toZigbee: [],
        exposes: [],
    },
    {
        zigbeeModel: ["ZGA002"],
        model: "ZGA002",
        vendor: "Aeotec",
        description: "Pico switch with power meter",
        extend: [
            m.deviceEndpoints({ endpoints: { "1": 1, "2": 2, "3": 3 }, multiEndpointSkip: ["state", "voltage", "power", "current", "energy"] }),
            m.deviceTemperature(),
            m.identify(),
            m.onOff({ powerOnBehavior: false }),
            m.electricityMeter(),
            m.commandsOnOff({ endpointNames: ["2", "3"] }),
            m.commandsLevelCtrl({ endpointNames: ["2", "3"] }),
        ],
    },
    {
        zigbeeModel: ["ZGA003"],
        model: "ZGA003",
        vendor: "Aeotec",
        description: "Pico switch duo with power meter",
        extend: [
            m.deviceEndpoints({ endpoints: { "1": 1, "2": 2, "3": 3, "4": 4 } }),
            m.deviceTemperature(),
            m.identify(),
            m.onOff({ powerOnBehavior: false, endpointNames: ["1", "2"] }),
            m.electricityMeter({ endpointNames: ["1", "2"] }),
            m.commandsOnOff({ endpointNames: ["3", "4"] }),
            m.commandsLevelCtrl({ endpointNames: ["3", "4"] }),
        ],
    },
    {
        zigbeeModel: ["ZGA004"],
        model: "ZGA004",
        vendor: "Aeotec",
        description: "Pico shutter",
        extend: [
            m.deviceEndpoints({ endpoints: { "1": 1, "2": 2, "3": 3, "4": 4, "5": 5 }, multiEndpointSkip: ["position", "tilt", "state"] }),
            m.deviceTemperature(),
            m.identify(),
            m.windowCovering({ controls: ["lift", "tilt"] }),
            m.commandsWindowCovering({ endpointNames: ["3"] }),
            m.commandsOnOff({ endpointNames: ["4", "5"] }),
            m.commandsLevelCtrl({ endpointNames: ["4", "5"] }),
        ],
    },
];
//# sourceMappingURL=aeotec.js.map