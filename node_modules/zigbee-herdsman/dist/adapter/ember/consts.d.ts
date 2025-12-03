/** Serves to initialize cache for config IDs */
export declare const INVALID_CONFIG_VALUE = 65535;
/** Serves to initialize cache */
export declare const INVALID_RADIO_CHANNEL = 255;
/**
 * A distinguished network ID that will never be assigned to any node.
 * This value is returned when getting the remote node ID from the binding table and the given binding table index refers
 * to a multicast binding entry.
 */
export declare const EMBER_MULTICAST_NODE_ID = 65534;
/**
 * A distinguished network ID that will never be assigned
 * to any node.  This value is used when getting the remote node ID
 * from the address or binding tables.  It indicates that the address
 * or binding table entry is currently in use but the node ID
 * corresponding to the EUI64 in the table is currently unknown.
 */
export declare const EMBER_UNKNOWN_NODE_ID = 65533;
/**
 * A distinguished network ID that will never be assigned
 * to any node.  This value is used when getting the remote node ID
 * from the address or binding tables.  It indicates that the address
 * or binding table entry is currently in use and network address
 * discovery is underway.
 */
export declare const EMBER_DISCOVERY_ACTIVE_NODE_ID = 65532;
/** A distinguished address table index used to indicate the absence of an address table entry. */
export declare const EMBER_NULL_ADDRESS_TABLE_INDEX = 255;
/** Invalidates cached information */
export declare const SOURCE_ROUTE_OVERHEAD_UNKNOWN = 255;
export declare const EMBER_MIN_BROADCAST_ADDRESS = 65528;
/**
 * The additional overhead required for network source routing (relay count = 1, relay index = 1).
 * This does not include the size of the relay list itself.
 */
export declare const NWK_SOURCE_ROUTE_OVERHEAD = 2;
export declare const SOURCE_ROUTING_RESERVED_PAYLOAD_LENGTH = 0;
/**
 * The maximum APS payload, not including any APS options.
 * This value is also available from emberMaximumApsPayloadLength() or ezspMaximumPayloadLength().
 * See http://portal.ember.com/faq/payload for more information.
 */
export declare const MAXIMUM_APS_PAYLOAD_LENGTH: number;
/** The additional overhead required for APS encryption (security = 5, MIC = 4). */
export declare const APS_ENCRYPTION_OVERHEAD = 9;
/** The additional overhead required for APS fragmentation. */
export declare const APS_FRAGMENTATION_OVERHEAD = 2;
/** An inactive concentrator. */
export declare const EMBER_INACTIVE_CONCENTRATOR = 65535;
/**
 * A concentrator with insufficient memory to store source routes for the entire network.
 * Route records are sent to the concentrator prior to every inbound APS unicast.
 */
export declare const EMBER_LOW_RAM_CONCENTRATOR = 65528;
/**
 * A concentrator with sufficient memory to store source routes for the entire network.
 * Remote nodes stop sending route records once the concentrator has successfully received one.
 */
export declare const EMBER_HIGH_RAM_CONCENTRATOR = 65529;
/** The short address of the trust center. This address never changes dynamically. */
export declare const EMBER_TRUST_CENTER_NODE_ID = 0;
/**
 * Default value for context's PSA algorithm permission (CCM* with 4 byte tag).
 * Only used by NCPs with secure key storage; define is mirrored here to allow
 * host code to initialize the context itself rather than needing a new EZSP frame.
 */
export declare const ZB_PSA_ALG = 88342784;
export declare const STACK_PROFILE_ZIGBEE_PRO = 2;
export declare const SECURITY_LEVEL_Z3 = 5;
/** This key is "ZigBeeAlliance09" */
export declare const ZIGBEE_PROFILE_INTEROPERABILITY_LINK_KEY: readonly number[];
/** Number of GP sink list entries. Minimum is 2 sink list entries. */
export declare const GP_SINK_LIST_ENTRIES = 2;
/** The size of the SinkList entries in sink table in format of octet string that has a format of {<1 byte length>, <n bytes for sink groups>} */
export declare const GP_SIZE_OF_SINK_LIST_ENTRIES_OCTET_STRING: number;
export declare const MAXIMUM_INTERPAN_LENGTH = 125;
export declare const SHORT_DEST_FRAME_CONTROL: number;
export declare const LONG_DEST_FRAME_CONTROL: number;
export declare const MAC_ACK_REQUIRED = 32;
/** NWK stub frame has two control bytes. */
export declare const STUB_NWK_SIZE = 2;
export declare const STUB_NWK_FRAME_CONTROL = 11;
/**
 * Interpan APS Unicast, same for Broadcast.
 * - Frame Control   (1-byte)
 * - Cluster ID      (2-bytes)
 * - Profile ID      (2-bytes)
 */
export declare const INTERPAN_APS_UNICAST_BROADCAST_SIZE = 5;
/**
 * Interpan APS Multicast
 * - Frame Control   (1-byte)
 * - Group ID        (2-bytes)
 * - Cluster ID      (2-bytes)
 * - Profile ID      (2-bytes)
 */
export declare const INTERPAN_APS_MULTICAST_SIZE = 7;
export declare const MAX_STUB_APS_SIZE = 7;
export declare const MIN_STUB_APS_SIZE = 5;
export declare const INTERPAN_APS_FRAME_TYPE = 3;
export declare const INTERPAN_APS_FRAME_TYPE_MASK = 3;
/** The only allowed APS FC value (without the delivery mode subfield) */
export declare const INTERPAN_APS_FRAME_CONTROL_NO_DELIVERY_MODE = 3;
export declare const INTERPAN_APS_FRAME_DELIVERY_MODE_MASK = 12;
export declare const INTERPAN_APS_FRAME_SECURITY = 32;
export declare const MANUFACTURING_STRING_SIZE = 16;
//# sourceMappingURL=consts.d.ts.map