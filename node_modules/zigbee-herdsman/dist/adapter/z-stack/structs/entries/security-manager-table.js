"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityManagerTable = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const table_1 = require("../table");
const security_manager_entry_1 = require("./security-manager-entry");
/**
 * Creates a security manager inline table present within Z-Stack NV memory.
 *
 * @param data Data to initialize table with.
 * @param alignment Memory alignment of initialization data.
 */
const securityManagerTable = (dataOrCapacity, alignment = "unaligned") => {
    const table = table_1.Table.new()
        .struct(security_manager_entry_1.securityManagerEntry)
        .occupancy((e) => ![0xfffe, 0xffff].includes(e.ami) && !(e.ami === 0x0000 && e.authenticationOption === security_manager_entry_1.SecurityManagerAuthenticationOption.Default))
        .inlineHeader();
    (0, node_assert_1.default)(dataOrCapacity !== undefined, "dataOrCapacity cannot be undefined");
    return typeof dataOrCapacity === "number" ? table.build(dataOrCapacity) : table.build(dataOrCapacity, alignment);
};
exports.securityManagerTable = securityManagerTable;
//# sourceMappingURL=security-manager-table.js.map