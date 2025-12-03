import { ClusterId } from "./definition/clusters";
import type { MACCapabilityFlags, ServerMask } from "./definition/tstypes";
/**
 * Get a the response cluster ID corresponding to a request.
 * @param requestClusterId
 * @returns Response cluster ID or undefined if unknown/invalid
 */
export declare const getResponseClusterId: (requestClusterId: ClusterId) => ClusterId | undefined;
/**
 * Get the values for the bitmap `Mac Capability Flags Field` as per spec.
 * Given value is assumed to be a proper 1-byte length.
 * @param capabilities
 * @returns
 */
export declare const getMacCapFlags: (capabilities: number) => MACCapabilityFlags;
/**
 * Get the values for the bitmap `Server Mask Field` as per spec.
 * Given value is assumed to be a proper 2-byte length.
 * @param serverMask
 * @returns
 */
export declare const getServerMask: (serverMask: number) => ServerMask;
export declare const createServerMask: (serverMask: ServerMask) => number;
//# sourceMappingURL=utils.d.ts.map