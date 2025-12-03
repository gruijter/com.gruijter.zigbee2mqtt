import type { StructMemoryAlignment } from "../struct";
import { Table } from "../table";
/**
 * Creates an address manager inline table present within Z-Stack NV memory.
 *
 * @param data Data to initialize table with.
 * @param alignment Memory alignment of initialization data.
 */
export declare const addressManagerTable: (dataOrCapacity?: Buffer | Buffer[] | number, alignment?: StructMemoryAlignment) => import("../table").BuiltTable<import("../struct").BuiltStruct<import("../struct").Struct & Record<"user", number> & Record<"nwkAddr", number> & Record<"extAddr", Buffer<ArrayBufferLike>> & Record<"isSet", () => Boolean>>, Table<import("../struct").BuiltStruct<import("../struct").Struct & Record<"user", number> & Record<"nwkAddr", number> & Record<"extAddr", Buffer<ArrayBufferLike>> & Record<"isSet", () => Boolean>>>>;
//# sourceMappingURL=address-manager-table.d.ts.map