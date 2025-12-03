"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nwkPanId = void 0;
const struct_1 = require("../struct");
/**
 * Creates a network PAN ID struct.
 *
 * @param data Data to initialize structure with.
 */
const nwkPanId = (data) => struct_1.Struct.new().member("uint16", "panId").build(data);
exports.nwkPanId = nwkPanId;
//# sourceMappingURL=nwk-pan-id.js.map