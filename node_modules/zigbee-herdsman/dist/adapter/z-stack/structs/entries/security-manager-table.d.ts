import type { StructMemoryAlignment } from "../struct";
import { Table } from "../table";
/**
 * Creates a security manager inline table present within Z-Stack NV memory.
 *
 * @param data Data to initialize table with.
 * @param alignment Memory alignment of initialization data.
 */
export declare const securityManagerTable: (dataOrCapacity?: Buffer | Buffer[] | number, alignment?: StructMemoryAlignment) => import("../table").BuiltTable<import("../struct").BuiltStruct<import("../struct").Struct & Record<"ami", number> & Record<"keyNvId", number> & Record<"authenticationOption", number>>, Table<import("../struct").BuiltStruct<import("../struct").Struct & Record<"ami", number> & Record<"keyNvId", number> & Record<"authenticationOption", number>>>>;
//# sourceMappingURL=security-manager-table.d.ts.map