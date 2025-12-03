"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nwkKey = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const struct_1 = require("../struct");
/**
 * Creates a network key struct.
 *
 * @param data Data to initialize structure with.
 */
const nwkKey = (data) => {
    (0, node_assert_1.default)(!Array.isArray(data));
    return struct_1.Struct.new().member("uint8array", "key", 16).build(data);
};
exports.nwkKey = nwkKey;
//# sourceMappingURL=nwk-key.js.map