"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apsTcLinkKeyEntry = void 0;
const struct_1 = require("../struct");
/**
 * Creates a APS ME Trust Center Link Key NV Entry struct.
 *
 * *Definition from Z-Stack 3.0.2 `APSMEDE.h`*
 *
 * @param data Data to initialize structure with.
 */
const apsTcLinkKeyEntry = (data) => {
    return struct_1.Struct.new()
        .member("uint32", "txFrmCntr")
        .member("uint32", "rxFrmCntr")
        .member("uint8array-reversed", "extAddr", 8)
        .member("uint8", "keyAttributes")
        .member("uint8", "keyType")
        .member("uint8", "SeedShift_IcIndex")
        .build(data);
};
exports.apsTcLinkKeyEntry = apsTcLinkKeyEntry;
//# sourceMappingURL=aps-tc-link-key-entry.js.map