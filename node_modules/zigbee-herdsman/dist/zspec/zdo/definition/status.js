"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
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
var Status;
(function (Status) {
    /** The requested operation or transmission was completed successfully. */
    Status[Status["SUCCESS"] = 0] = "SUCCESS";
    // 0x01 – 0x7F are reserved
    /** The supplied request type was invalid. */
    Status[Status["INV_REQUESTTYPE"] = 128] = "INV_REQUESTTYPE";
    /** The requested device did not exist on a device following a child descriptor request to a parent. */
    Status[Status["DEVICE_NOT_FOUND"] = 129] = "DEVICE_NOT_FOUND";
    /** The supplied endpoint was equal to 0x00 or 0xff. */
    Status[Status["INVALID_EP"] = 130] = "INVALID_EP";
    /** The requested endpoint is not described by a simple descriptor. */
    Status[Status["NOT_ACTIVE"] = 131] = "NOT_ACTIVE";
    /** The requested optional feature is not supported on the target device. */
    Status[Status["NOT_SUPPORTED"] = 132] = "NOT_SUPPORTED";
    /** A timeout has occurred with the requested operation. */
    Status[Status["TIMEOUT"] = 133] = "TIMEOUT";
    /** failure to match any suitable clusters. */
    Status[Status["NO_MATCH"] = 134] = "NO_MATCH";
    // 0x87 is reserved        = 0x87,
    /** The unbind request was unsuccessful due to the coordinator or source device not having an entry in its binding table to unbind. */
    Status[Status["NO_ENTRY"] = 136] = "NO_ENTRY";
    /** A child descriptor was not available following a discovery request to a parent. */
    Status[Status["NO_DESCRIPTOR"] = 137] = "NO_DESCRIPTOR";
    /** The device does not have storage space to support the requested operation. */
    Status[Status["INSUFFICIENT_SPACE"] = 138] = "INSUFFICIENT_SPACE";
    /** The device is not in the proper state to support the requested operation. */
    Status[Status["NOT_PERMITTED"] = 139] = "NOT_PERMITTED";
    /** The device does not have table space to support the operation. */
    Status[Status["TABLE_FULL"] = 140] = "TABLE_FULL";
    /** The device has rejected the command due to security restrictions. */
    Status[Status["NOT_AUTHORIZED"] = 141] = "NOT_AUTHORIZED";
    /** The device does not have binding table space to support the operation. */
    Status[Status["DEVICE_BINDING_TABLE_FULL"] = 142] = "DEVICE_BINDING_TABLE_FULL";
    /** The index in the received command is out of bounds. */
    Status[Status["INVALID_INDEX"] = 143] = "INVALID_INDEX";
    /** The response was too large to fit in a single unfragmented message. */
    Status[Status["FRAME_TOO_LARGE"] = 144] = "FRAME_TOO_LARGE";
    /** The requested Key Negotiation Method was not accepted. */
    Status[Status["BAD_KEY_NEGOTIATION_METHOD"] = 145] = "BAD_KEY_NEGOTIATION_METHOD";
    /** The request encountered a temporary failure but a retry at a later time should be attempted and may succeed. */
    Status[Status["TEMPORARY_FAILURE"] = 146] = "TEMPORARY_FAILURE";
    // 0x92 – 0xff are reserved
    //-- NWK layer statuses included because some like TLV-related are used as ZDO status
    /** An invalid or out-of-range parameter has been passed to a primitive from the next higher layer. */
    Status[Status["NWK_LAYER_INVALID_PARAMETER"] = 193] = "NWK_LAYER_INVALID_PARAMETER";
    /** The next higher layer has issued a request that is invalid or cannot be executed given the current state of the NWK layer. */
    Status[Status["NWK_LAYER_INV_REQUESTTYPE"] = 194] = "NWK_LAYER_INV_REQUESTTYPE";
    /** An NLME-JOIN.request has been disallowed. */
    Status[Status["NWK_LAYER_NOT_PERMITTED"] = 195] = "NWK_LAYER_NOT_PERMITTED";
    /** An NLME-NETWORK-FORMATION.request has failed to start a network. */
    Status[Status["NWK_LAYER_STARTUP_FAILURE"] = 196] = "NWK_LAYER_STARTUP_FAILURE";
    /**
     * A device with the address supplied to the NLME-ADDNEIGHBOR. request is already present in the neighbor table of the device
     * on which the NLME-ADD-NEIGHBOR.request was issued.
     */
    Status[Status["NWK_LAYER_ALREADY_PRESENT"] = 197] = "NWK_LAYER_ALREADY_PRESENT";
    /** Used to indicate that an NLME-SYNC.request has failed at the MAC layer. */
    Status[Status["NWK_LAYER_SYNC_FAILURE"] = 198] = "NWK_LAYER_SYNC_FAILURE";
    /** An NLME-JOIN-DIRECTLY.request has failed because there is no more room in the neighbor table. */
    Status[Status["NWK_LAYER_NEIGHBOR_TABLE_FULL"] = 199] = "NWK_LAYER_NEIGHBOR_TABLE_FULL";
    /** An NLME-LEAVE.request has failed because the device addressed in the parameter list is not in the neighbor table of the issuing device. */
    Status[Status["NWK_LAYER_UNKNOWN_DEVICE"] = 200] = "NWK_LAYER_UNKNOWN_DEVICE";
    /** An NLME-GET.request or NLME-SET.request has been issued with an unknown attribute identifier. */
    Status[Status["NWK_LAYER_UNSUPPORTED_ATTRIBUTE"] = 201] = "NWK_LAYER_UNSUPPORTED_ATTRIBUTE";
    /** An NLME-JOIN.request has been issued in an environment where no networks are detectable. */
    Status[Status["NWK_LAYER_NO_NETWORKS"] = 202] = "NWK_LAYER_NO_NETWORKS";
    // Reserved 0xcb Reserved for future use.
    /** Security processing has been attempted on an outgoing frame, and has failed because the frame counter has reached its maximum value. */
    Status[Status["NWK_LAYER_MAX_FRM_COUNTER"] = 204] = "NWK_LAYER_MAX_FRM_COUNTER";
    /** Security processing has been attempted on an outgoing frame, and has failed because no key was available with which to process it. */
    Status[Status["NWK_LAYER_NO_KEY"] = 205] = "NWK_LAYER_NO_KEY";
    /** Security processing has been attempted on an outgoing frame, and has failed because the security engine produced erroneous output. */
    Status[Status["NWK_LAYER_BAD_CCM_OUTPUT"] = 206] = "NWK_LAYER_BAD_CCM_OUTPUT";
    /** Reserved for future use. */
    Status[Status["NWK_LAYER_RESERVED"] = 207] = "NWK_LAYER_RESERVED";
    /** An attempt to discover a route has failed due to a reason other than a lack of routing capacity. */
    Status[Status["NWK_LAYER_ROUTE_DISCOVERY_FAILED"] = 208] = "NWK_LAYER_ROUTE_DISCOVERY_FAILED";
    /**
     * An NLDE-DATA.request has failed due to a routing failure on the sending device or an NLME-ROUTE-DISCOVERY.request has failed due to
     * the cause cited in the accompanying NetworkStatusCode.
     */
    Status[Status["NWK_LAYER_ROUTE_ERROR"] = 209] = "NWK_LAYER_ROUTE_ERROR";
    /** An attempt to send a broadcast frame has failed because there is no room in the BTT. */
    Status[Status["NWK_LAYER_BT_TABLE_FULL"] = 210] = "NWK_LAYER_BT_TABLE_FULL";
    /** An NLDE-DATA.request has failed due to insufficient buffering available. */
    Status[Status["NWK_LAYER_FRAME_NOT_BUFFERED"] = 211] = "NWK_LAYER_FRAME_NOT_BUFFERED";
    /** An attempt was made to use a MAC Interface with a state that is currently set to FALSE (disabled) or that is unknown to the stack.. */
    Status[Status["NWK_LAYER_INVALID_INTERFACE"] = 213] = "NWK_LAYER_INVALID_INTERFACE";
    /** A required TLV for processing the request was not present. */
    Status[Status["NWK_LAYER_MISSING_TLV"] = 214] = "NWK_LAYER_MISSING_TLV";
    /** A TLV was malformed or missing relevant information. */
    Status[Status["NWK_LAYER_INVALID_TLV"] = 215] = "NWK_LAYER_INVALID_TLV";
})(Status || (exports.Status = Status = {}));
//# sourceMappingURL=status.js.map