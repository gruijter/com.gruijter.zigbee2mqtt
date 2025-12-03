"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasConfigured = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const struct_1 = require("../struct");
/**
 * Creates a zigbee-herdsman `hasConfigured` struct.
 *
 * @param data Data to initialize structure with.
 */
const hasConfigured = (data) => {
    (0, node_assert_1.default)(!Array.isArray(data));
    return struct_1.Struct.new()
        .member("uint8", "hasConfigured")
        .method("isConfigured", Boolean.prototype, (struct) => struct.hasConfigured === 0x55)
        .build(data);
};
exports.hasConfigured = hasConfigured;
//# sourceMappingURL=has-configured.js.map