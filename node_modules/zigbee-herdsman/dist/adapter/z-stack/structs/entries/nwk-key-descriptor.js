"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nwkKeyDescriptor = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const struct_1 = require("../struct");
/**
 * Creates a Security Service Provider (SSP) Network Descriptor struct.
 *
 * *Definition from Z-Stack 3.0.2 `ssp.h`*
 *
 * @param data Data to initialize structure with.
 */
const nwkKeyDescriptor = (data) => {
    (0, node_assert_1.default)(!Array.isArray(data));
    return struct_1.Struct.new().member("uint8", "keySeqNum").member("uint8array", "key", 16).build(data);
};
exports.nwkKeyDescriptor = nwkKeyDescriptor;
//# sourceMappingURL=nwk-key-descriptor.js.map