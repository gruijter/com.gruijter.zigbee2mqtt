"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apsLinkKeyDataTable = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const table_1 = require("../table");
const aps_link_key_data_entry_1 = require("./aps-link-key-data-entry");
const emptyKey = Buffer.alloc(16, 0x00);
/**
 * Creates an APS link key data table.
 *
 * @param data Data to initialize table with.
 * @param alignment Memory alignment of initialization data.
 */
const apsLinkKeyDataTable = (dataOrCapacity, alignment = "unaligned") => {
    const table = table_1.Table.new()
        .struct(aps_link_key_data_entry_1.apsLinkKeyDataEntry)
        .occupancy((e) => !e.key.equals(emptyKey));
    (0, node_assert_1.default)(dataOrCapacity !== undefined, "dataOrCapacity cannot be undefined");
    return typeof dataOrCapacity === "number" ? table.build(dataOrCapacity) : table.build(dataOrCapacity, alignment);
};
exports.apsLinkKeyDataTable = apsLinkKeyDataTable;
//# sourceMappingURL=aps-link-key-data-table.js.map