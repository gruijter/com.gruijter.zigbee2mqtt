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
        zigbeeModel: ["Ecosmart-ZBT-A19-CCT-Bulb"],
        model: "A9A19A60WESDZ02",
        vendor: "EcoSmart",
        description: "Tuneable white (A19)",
        extend: [m.light({ colorTemp: { range: [153, 370] } })],
    },
    {
        zigbeeModel: ["Ecosmart-ZBT-BR30-CCT-Bulb"],
        model: "A9BR3065WESDZ02",
        vendor: "EcoSmart",
        description: "Tuneable white (BR30)",
        extend: [m.light({ colorTemp: { range: [153, 370] } })],
    },
    {
        zigbeeModel: ["zhaRGBW"],
        model: "D1821",
        vendor: "EcoSmart",
        description: "A19 RGB bulb",
        extend: [m.light({ colorTemp: { range: undefined }, color: true })],
    },
    {
        zigbeeModel: [
            "\u0000\u0002\u0000\u0004\u0000\f^I\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u000e",
            "\u0000\u0002\u0000\u0004^��&\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u000e",
        ],
        model: "D1531",
        vendor: "EcoSmart",
        description: "A19 bright white bulb",
        extend: [m.light()],
    },
    {
        zigbeeModel: [
            "\u0000\u0002\u0000\u0004\u0012 �P\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u000e",
        ],
        model: "D1532",
        vendor: "EcoSmart",
        description: "A19 soft white bulb",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["zhaTunW"],
        model: "D1542",
        vendor: "EcoSmart",
        description: "GU10 adjustable white bulb",
        extend: [m.light({ colorTemp: { range: undefined } })],
    },
    {
        zigbeeModel: [
            "\u0000\u0002\u0000\u0004T\u0002\u000eZ\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u000e",
            "\u0000\u0002\u0000\u0004\u0000\f]�\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u000e",
            '\u0000\u0002\u0000\u0004"�T\u0004\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u000e',
            "\u0000\u0002\u0000\u0004\u0000\f^�\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u000e",
            '\u0000\u0002\u0000\u0004\u0011�"�\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u000e',
            "\u0000\u0002\u0000\u0004� �P\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u000e",
            "\u0000\u0002\u0000\u0004\u0000\f^\u0014\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u000e",
        ],
        model: "D1533",
        vendor: "EcoSmart",
        description: "PAR20/A19 bright white bulb",
        extend: [m.light()],
    },
    {
        zigbeeModel: [
            "\u0000\u0002\u0000\u0004�V\u0000\n\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u000e",
            '\u0000\u0002\u0000\u0004��"�\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u000e',
            '\u0000\u0002\u0000\u0004�\u0003"�\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u000e',
            "\u0000\u0002\u0000\u0004r �P\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u000e",
            "\u0000\u0002\u0000\u0004b �P\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u000e",
        ],
        model: "D1523",
        vendor: "EcoSmart",
        description: "A19 soft white bulb",
        extend: [m.light()],
    },
];
//# sourceMappingURL=ecosmart.js.map