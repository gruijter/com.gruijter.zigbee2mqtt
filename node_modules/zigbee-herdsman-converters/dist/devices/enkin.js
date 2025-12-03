"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definitions = void 0;
const modernExtend_1 = require("../lib/modernExtend");
exports.definitions = [
    {
        zigbeeModel: ["ZDM150"],
        model: "ZDM150",
        vendor: "Enkin",
        description: "150W Dimmer module",
        extend: [(0, modernExtend_1.light)({ powerOnBehavior: false, effect: false, configureReporting: true }), (0, modernExtend_1.forcePowerSource)({ powerSource: "Mains (single phase)" })],
    },
];
//# sourceMappingURL=enkin.js.map