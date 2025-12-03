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
const reporting = __importStar(require("../lib/reporting"));
const utils = __importStar(require("../lib/utils"));
const e = exposes.presets;
const jetHome = {
    fz: {
        multiStateAction: {
            cluster: "genMultistateInput",
            type: ["attributeReport", "readResponse"],
            convert: (model, msg, publish, options, meta) => {
                const actionLookup = {
                    0: "release",
                    1: "single",
                    2: "double",
                    3: "triple",
                    4: "hold",
                    256: "release",
                    257: "single",
                    258: "double",
                    259: "triple",
                    260: "hold",
                    512: "release",
                    513: "single",
                    514: "double",
                    515: "triple",
                    516: "hold",
                    1024: "release",
                    1025: "single",
                    1026: "double",
                    1027: "triple",
                    1028: "hold",
                };
                const value = msg.data.presentValue;
                const action = utils.getFromLookup(value, actionLookup);
                return { action: utils.postfixWithEndpointName(action, msg, model, meta) };
            },
        },
    },
};
exports.definitions = [
    {
        fingerprint: [{ modelID: "WS7", manufacturerName: "JetHome" }],
        model: "WS7",
        vendor: "JetHome",
        description: "3-ch battery discrete input module",
        fromZigbee: [fz.battery, jetHome.fz.multiStateAction],
        toZigbee: [],
        ota: true,
        exposes: [
            e.battery(),
            e.battery_voltage(),
            e.action([
                "release_in1",
                "single_in1",
                "double_in1",
                "hold_in1",
                "release_in2",
                "single_in2",
                "double_in2",
                "hold_in2",
                "release_in3",
                "single_in3",
                "double_in3",
                "hold_in3",
            ]),
        ],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genPowerCfg"]);
            await reporting.batteryVoltage(endpoint);
            await reporting.batteryPercentageRemaining(endpoint);
        },
        meta: { multiEndpoint: true },
        endpoint: (device) => {
            return {
                in1: 1,
                in2: 2,
                in3: 3,
            };
        },
    },
];
//# sourceMappingURL=jethome.js.map