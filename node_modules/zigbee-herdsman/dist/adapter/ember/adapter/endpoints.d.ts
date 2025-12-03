import type { ClusterId, EmberMulticastId, ProfileId } from "../types";
type FixedEndpointInfo = {
    /** Actual Zigbee endpoint number. uint8_t */
    endpoint: number;
    /** Profile ID of the device on this endpoint. */
    profileId: ProfileId;
    /** Device ID of the device on this endpoint. uint16_t*/
    deviceId: number;
    /** Version of the device. uint8_t */
    deviceVersion: number;
    /** List of server clusters. */
    inClusterList: readonly ClusterId[];
    /** List of client clusters. */
    outClusterList: readonly ClusterId[];
    /** Network index for this endpoint. uint8_t */
    networkIndex: number;
    /** Multicast group IDs to register in the multicast table */
    multicastIds: readonly EmberMulticastId[];
};
/**
 * List of endpoints to register.
 *
 * Index 0 is used as default and expected to be the primary network.
 */
export declare const FIXED_ENDPOINTS: readonly FixedEndpointInfo[];
export {};
//# sourceMappingURL=endpoints.d.ts.map