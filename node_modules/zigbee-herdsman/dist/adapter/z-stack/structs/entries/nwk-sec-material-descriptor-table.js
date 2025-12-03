"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nwkSecMaterialDescriptorTable = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const table_1 = require("../table");
const nwk_sec_material_descriptor_entry_1 = require("./nwk-sec-material-descriptor-entry");
/**
 * Creates a network security material table.
 *
 * @param data Data to initialize table with.
 * @param alignment Memory alignment of initialization data.
 */
const nwkSecMaterialDescriptorTable = (dataOrCapacity, alignment = "unaligned") => {
    const table = table_1.Table.new()
        .struct(nwk_sec_material_descriptor_entry_1.nwkSecMaterialDescriptorEntry)
        .occupancy((e) => e.isSet());
    (0, node_assert_1.default)(dataOrCapacity !== undefined, "dataOrCapacity cannot be undefined");
    return typeof dataOrCapacity === "number" ? table.build(dataOrCapacity) : table.build(dataOrCapacity, alignment);
};
exports.nwkSecMaterialDescriptorTable = nwkSecMaterialDescriptorTable;
//# sourceMappingURL=nwk-sec-material-descriptor-table.js.map