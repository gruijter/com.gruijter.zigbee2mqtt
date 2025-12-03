import { Struct } from "../struct";
/**
 * Address manager entry flags present in `user` field.
 *
 * *Definition from Z-Stack 3.0.2 `ADdrMgr.h`*
 */
export declare enum AddressManagerUser {
    Default = 0,
    Assoc = 1,
    Security = 2,
    Binding = 4,
    Private1 = 8
}
/**
 * Creates an address manager entry.
 *
 * *Definition from Z-Stack 3.0.2 `AddrMgr.h`*
 * *The `uint16` index field is not physically present.*
 *
 * @param data Data to initialize structure with.
 */
export declare const addressManagerEntry: (data?: Buffer) => import("../struct").BuiltStruct<Struct & Record<"user", number> & Record<"nwkAddr", number> & Record<"extAddr", Buffer<ArrayBufferLike>> & Record<"isSet", () => Boolean>>;
//# sourceMappingURL=address-manager-entry.d.ts.map