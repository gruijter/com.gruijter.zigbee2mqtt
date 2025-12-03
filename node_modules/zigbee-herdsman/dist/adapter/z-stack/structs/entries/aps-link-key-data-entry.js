"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apsLinkKeyDataEntry = void 0;
const struct_1 = require("../struct");
/**
 * Creates a APS Link Key Data Entry.
 *
 * *Definition from Z-Stack 3.0.2 `APSMEDE.h`*
 *
 * @param data Data to initialize structure with.
 */
const apsLinkKeyDataEntry = (data) => {
    return struct_1.Struct.new().member("uint8array", "key", 16).member("uint32", "txFrmCntr").member("uint32", "rxFrmCntr").build(data);
};
exports.apsLinkKeyDataEntry = apsLinkKeyDataEntry;
//# sourceMappingURL=aps-link-key-data-entry.js.map