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
const exposes = __importStar(require("../lib/exposes"));
const m = __importStar(require("../lib/modernExtend"));
const e = exposes.presets;
exports.definitions = [
    {
        zigbeeModel: ["HejSW01"],
        model: "GLSK3ZB-1711",
        vendor: "Hej",
        description: "Goqual 1 gang Switch",
        extend: [m.onOff({ configureReporting: false, powerOnBehavior: false })],
    },
    {
        zigbeeModel: ["HejSW02"],
        model: "GLSK3ZB-1712",
        vendor: "Hej",
        description: "Goqual 2 gang Switch",
        extend: [
            m.deviceEndpoints({ endpoints: { top: 1, bottom: 2 } }),
            m.onOff({ configureReporting: false, endpointNames: ["top", "bottom"], powerOnBehavior: false }),
        ],
    },
    {
        zigbeeModel: ["HejSW03"],
        model: "GLSK3ZB-1713",
        vendor: "Hej",
        description: "Goqual 3 gang Switch",
        extend: [
            m.deviceEndpoints({ endpoints: { top: 1, center: 2, bottom: 3 } }),
            m.onOff({ configureReporting: false, endpointNames: ["top", "center", "bottom"], powerOnBehavior: false }),
        ],
    },
    {
        zigbeeModel: ["HejSW04"],
        model: "GLSK6ZB-1714",
        vendor: "Hej",
        description: "Goqual 4 gang Switch",
        extend: [
            m.deviceEndpoints({ endpoints: { top_left: 1, bottom_left: 2, top_right: 3, bottom_right: 4 } }),
            m.onOff({ configureReporting: false, endpointNames: ["top_left", "bottom_left", "top_right", "bottom_right"], powerOnBehavior: false }),
        ],
    },
    {
        zigbeeModel: ["HejSW05"],
        model: "GLSK6ZB-1715",
        vendor: "Hej",
        description: "Goqual 5 gang Switch",
        extend: [
            m.deviceEndpoints({ endpoints: { top_left: 1, center_left: 2, bottom_left: 3, top_right: 4, bottom_right: 5 } }),
            m.onOff({
                configureReporting: false,
                endpointNames: ["top_left", "center_left", "bottom_left", "top_right", "bottom_right"],
                powerOnBehavior: false,
            }),
        ],
    },
    {
        zigbeeModel: ["HejSW06"],
        model: "GLSK6ZB-1716",
        vendor: "Hej",
        description: "Goqual 6 gang Switch",
        extend: [
            m.deviceEndpoints({ endpoints: { top_left: 1, center_left: 2, bottom_left: 3, top_right: 4, center_right: 5, bottom_right: 6 } }),
            m.onOff({
                configureReporting: false,
                endpointNames: ["top_left", "center_left", "bottom_left", "top_right", "center_right", "bottom_right"],
                powerOnBehavior: false,
            }),
        ],
    },
    {
        fingerprint: [{ modelID: "RH3001", manufacturerName: "TUYATEC-ktge2vqt" }],
        model: "KKZ-DO021",
        vendor: "Hej",
        description: "Door contact sensor",
        fromZigbee: [fz.ias_contact_alarm_1, fz.battery],
        toZigbee: [],
        exposes: [e.contact(), e.battery()],
    },
    {
        fingerprint: [{ modelID: "RH3040", manufacturerName: "TUYATEC-smmlguju" }],
        model: "KKZ-MO021",
        vendor: "Hej",
        description: "PIR sensor",
        fromZigbee: [fz.battery, fz.ias_occupancy_alarm_1],
        toZigbee: [],
        exposes: [e.battery(), e.occupancy()],
    },
];
//# sourceMappingURL=hej.js.map