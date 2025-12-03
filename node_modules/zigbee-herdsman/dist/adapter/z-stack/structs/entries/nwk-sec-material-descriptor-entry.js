"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nwkSecMaterialDescriptorEntry = void 0;
const struct_1 = require("../struct");
const emptyExtendedPanId = Buffer.alloc(8, 0x00);
/**
 * Create a Zigbee Device Security Manager Security Material struct. This structure stores a frame counter
 * associated with a particular Extended PAN ID used by device. Used in NV in table format:
 * - `ZCD_NV_EX_NWK_SEC_MATERIAL_TABLE` - extended table (SimpleLink Z-Stack 3.x.0)
 * - `ZCD_NV_LEGACY_NWK_SEC_MATERIAL_TABLE_START` through `ZCD_NV_LEGACY_NWK_SEC_MATERIAL_TABLE_END` (Z-Stack 3.0.x)
 *
 * *Definition from Z-Stack 3.0.2 `ZDSecMgr.h`*
 *
 * @param data Data to initialize structure with.
 */
const nwkSecMaterialDescriptorEntry = (data) => struct_1.Struct.new()
    .member("uint32", "FrameCounter")
    .member("uint8array-reversed", "extendedPanID", 8)
    .method("isSet", Boolean.prototype, (struct) => !struct.extendedPanID.equals(emptyExtendedPanId))
    .build(data);
exports.nwkSecMaterialDescriptorEntry = nwkSecMaterialDescriptorEntry;
//# sourceMappingURL=nwk-sec-material-descriptor-entry.js.map