import type { NetworkCache } from "../adapter/emberAdapter";
import type { EmberAesMmoHashContext, SecManContext } from "../types";
/**
 * Initialize a network cache index with proper "invalid" values.
 * @returns
 */
export declare const initNetworkCache: () => NetworkCache;
/**
 * This routine will initialize a Security Manager context correctly for use in subsequent function calls.
 * @returns
 */
export declare const initSecurityManagerContext: () => SecManContext;
/**
 *  This routine clears the passed context so that a new hash calculation
 *  can be performed.
 *
 *  @returns context A pointer to the location of hash context to clear.
 */
export declare const aesMmoHashInit: () => EmberAesMmoHashContext;
//# sourceMappingURL=initters.d.ts.map