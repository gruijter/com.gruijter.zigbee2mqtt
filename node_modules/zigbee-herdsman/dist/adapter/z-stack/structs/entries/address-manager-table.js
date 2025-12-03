"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressManagerTable = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const table_1 = require("../table");
const address_manager_entry_1 = require("./address-manager-entry");
/**
 * Creates an address manager inline table present within Z-Stack NV memory.
 *
 * @param data Data to initialize table with.
 * @param alignment Memory alignment of initialization data.
 */
const addressManagerTable = (dataOrCapacity, alignment = "unaligned") => {
    const table = table_1.Table.new()
        .struct(address_manager_entry_1.addressManagerEntry)
        .occupancy((e) => e.isSet());
    (0, node_assert_1.default)(dataOrCapacity !== undefined, "dataOrCapacity cannot be undefined");
    return typeof dataOrCapacity === "number" ? table.build(dataOrCapacity) : table.build(dataOrCapacity, alignment);
};
exports.addressManagerTable = addressManagerTable;
//# sourceMappingURL=address-manager-table.js.map