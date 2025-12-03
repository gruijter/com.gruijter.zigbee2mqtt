import type { StructMemoryAlignment } from "../struct";
import { Table } from "../table";
/**
 * Creates a network security material table.
 *
 * @param data Data to initialize table with.
 * @param alignment Memory alignment of initialization data.
 */
export declare const nwkSecMaterialDescriptorTable: (dataOrCapacity?: Buffer | Buffer[] | number, alignment?: StructMemoryAlignment) => import("../table").BuiltTable<import("../struct").BuiltStruct<import("../struct").Struct & Record<"FrameCounter", number> & Record<"extendedPanID", Buffer<ArrayBufferLike>> & Record<"isSet", () => Boolean>>, Table<import("../struct").BuiltStruct<import("../struct").Struct & Record<"FrameCounter", number> & Record<"extendedPanID", Buffer<ArrayBufferLike>> & Record<"isSet", () => Boolean>>>>;
//# sourceMappingURL=nwk-sec-material-descriptor-table.d.ts.map