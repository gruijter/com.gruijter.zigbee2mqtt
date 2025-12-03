/**
 * ZDO response status.
 *
 * Most responses to ZDO commands contain a status byte.
 * The meaning of this byte is defined by the Zigbee Device Profile.
 *
 * Zigbee Document – 05-3474-23 - Table 2-129. ZDP Enumerations Description
 *
 * uint8_t
 */
export declare enum Status {
    /** The requested operation or transmission was completed successfully. */
    SUCCESS = 0,
    /** The supplied request type was invalid. */
    INV_REQUESTTYPE = 128,
    /** The requested device did not exist on a device following a child descriptor request to a parent. */
    DEVICE_NOT_FOUND = 129,
    /** The supplied endpoint was equal to 0x00 or 0xff. */
    INVALID_EP = 130,
    /** The requested endpoint is not described by a simple descriptor. */
    NOT_ACTIVE = 131,
    /** The requested optional feature is not supported on the target device. */
    NOT_SUPPORTED = 132,
    /** A timeout has occurred with the requested operation. */
    TIMEOUT = 133,
    /** failure to match any suitable clusters. */
    NO_MATCH = 134,
    /** The unbind request was unsuccessful due to the coordinator or source device not having an entry in its binding table to unbind. */
    NO_ENTRY = 136,
    /** A child descriptor was not available following a discovery request to a parent. */
    NO_DESCRIPTOR = 137,
    /** The device does not have storage space to support the requested operation. */
    INSUFFICIENT_SPACE = 138,
    /** The device is not in the proper state to support the requested operation. */
    NOT_PERMITTED = 139,
    /** The device does not have table space to support the operation. */
    TABLE_FULL = 140,
    /** The device has rejected the command due to security restrictions. */
    NOT_AUTHORIZED = 141,
    /** The device does not have binding table space to support the operation. */
    DEVICE_BINDING_TABLE_FULL = 142,
    /** The index in the received command is out of bounds. */
    INVALID_INDEX = 143,
    /** The response was too large to fit in a single unfragmented message. */
    FRAME_TOO_LARGE = 144,
    /** The requested Key Negotiation Method was not accepted. */
    BAD_KEY_NEGOTIATION_METHOD = 145,
    /** The request encountered a temporary failure but a retry at a later time should be attempted and may succeed. */
    TEMPORARY_FAILURE = 146,
    /** An invalid or out-of-range parameter has been passed to a primitive from the next higher layer. */
    NWK_LAYER_INVALID_PARAMETER = 193,
    /** The next higher layer has issued a request that is invalid or cannot be executed given the current state of the NWK layer. */
    NWK_LAYER_INV_REQUESTTYPE = 194,
    /** An NLME-JOIN.request has been disallowed. */
    NWK_LAYER_NOT_PERMITTED = 195,
    /** An NLME-NETWORK-FORMATION.request has failed to start a network. */
    NWK_LAYER_STARTUP_FAILURE = 196,
    /**
     * A device with the address supplied to the NLME-ADDNEIGHBOR. request is already present in the neighbor table of the device
     * on which the NLME-ADD-NEIGHBOR.request was issued.
     */
    NWK_LAYER_ALREADY_PRESENT = 197,
    /** Used to indicate that an NLME-SYNC.request has failed at the MAC layer. */
    NWK_LAYER_SYNC_FAILURE = 198,
    /** An NLME-JOIN-DIRECTLY.request has failed because there is no more room in the neighbor table. */
    NWK_LAYER_NEIGHBOR_TABLE_FULL = 199,
    /** An NLME-LEAVE.request has failed because the device addressed in the parameter list is not in the neighbor table of the issuing device. */
    NWK_LAYER_UNKNOWN_DEVICE = 200,
    /** An NLME-GET.request or NLME-SET.request has been issued with an unknown attribute identifier. */
    NWK_LAYER_UNSUPPORTED_ATTRIBUTE = 201,
    /** An NLME-JOIN.request has been issued in an environment where no networks are detectable. */
    NWK_LAYER_NO_NETWORKS = 202,
    /** Security processing has been attempted on an outgoing frame, and has failed because the frame counter has reached its maximum value. */
    NWK_LAYER_MAX_FRM_COUNTER = 204,
    /** Security processing has been attempted on an outgoing frame, and has failed because no key was available with which to process it. */
    NWK_LAYER_NO_KEY = 205,
    /** Security processing has been attempted on an outgoing frame, and has failed because the security engine produced erroneous output. */
    NWK_LAYER_BAD_CCM_OUTPUT = 206,
    /** Reserved for future use. */
    NWK_LAYER_RESERVED = 207,
    /** An attempt to discover a route has failed due to a reason other than a lack of routing capacity. */
    NWK_LAYER_ROUTE_DISCOVERY_FAILED = 208,
    /**
     * An NLDE-DATA.request has failed due to a routing failure on the sending device or an NLME-ROUTE-DISCOVERY.request has failed due to
     * the cause cited in the accompanying NetworkStatusCode.
     */
    NWK_LAYER_ROUTE_ERROR = 209,
    /** An attempt to send a broadcast frame has failed because there is no room in the BTT. */
    NWK_LAYER_BT_TABLE_FULL = 210,
    /** An NLDE-DATA.request has failed due to insufficient buffering available. */
    NWK_LAYER_FRAME_NOT_BUFFERED = 211,
    /** An attempt was made to use a MAC Interface with a state that is currently set to FALSE (disabled) or that is unknown to the stack.. */
    NWK_LAYER_INVALID_INTERFACE = 213,
    /** A required TLV for processing the request was not present. */
    NWK_LAYER_MISSING_TLV = 214,
    /** A TLV was malformed or missing relevant information. */
    NWK_LAYER_INVALID_TLV = 215
}
//# sourceMappingURL=status.d.ts.map