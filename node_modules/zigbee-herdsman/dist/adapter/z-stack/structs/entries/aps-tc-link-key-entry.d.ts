import { Struct } from "../struct";
/**
 * Creates a APS ME Trust Center Link Key NV Entry struct.
 *
 * *Definition from Z-Stack 3.0.2 `APSMEDE.h`*
 *
 * @param data Data to initialize structure with.
 */
export declare const apsTcLinkKeyEntry: (data?: Buffer) => import("../struct").BuiltStruct<Struct & Record<"txFrmCntr", number> & Record<"rxFrmCntr", number> & Record<"extAddr", Buffer<ArrayBufferLike>> & Record<"keyAttributes", number> & Record<"keyType", number> & Record<"SeedShift_IcIndex", number>>;
//# sourceMappingURL=aps-tc-link-key-entry.d.ts.map