import { Struct } from "../struct";
/**
 * Creates a APS Link Key Data Entry.
 *
 * *Definition from Z-Stack 3.0.2 `APSMEDE.h`*
 *
 * @param data Data to initialize structure with.
 */
export declare const apsLinkKeyDataEntry: (data?: Buffer) => import("../struct").BuiltStruct<Struct & Record<"key", Buffer<ArrayBufferLike>> & Record<"txFrmCntr", number> & Record<"rxFrmCntr", number>>;
//# sourceMappingURL=aps-link-key-data-entry.d.ts.map