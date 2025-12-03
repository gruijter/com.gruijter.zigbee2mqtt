"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingTableStatus = exports.GlobalTLV = exports.ActiveLinkKeyType = exports.InitialJoinMethod = exports.SelectedPreSharedSecret = exports.SelectedKeyNegotiationProtocol = exports.JoiningPolicy = exports.LeaveRequestFlags = void 0;
var LeaveRequestFlags;
(function (LeaveRequestFlags) {
    /** Leave and rejoin. */
    LeaveRequestFlags[LeaveRequestFlags["AND_REJOIN"] = 128] = "AND_REJOIN";
    /** DEPRECATED */
    // AND_REMOVE_CHILDREN = 0x40,
    /** Leave. */
    LeaveRequestFlags[LeaveRequestFlags["WITHOUT_REJOIN"] = 0] = "WITHOUT_REJOIN";
})(LeaveRequestFlags || (exports.LeaveRequestFlags = LeaveRequestFlags = {}));
var JoiningPolicy;
(function (JoiningPolicy) {
    /** Any device is allowed to join. */
    JoiningPolicy[JoiningPolicy["ALL_JOIN"] = 0] = "ALL_JOIN";
    /** Only devices on the mibJoiningIeeeList are allowed to join. */
    JoiningPolicy[JoiningPolicy["IEEELIST_JOIN"] = 1] = "IEEELIST_JOIN";
    /** No device is allowed to join. */
    JoiningPolicy[JoiningPolicy["NO_JOIN"] = 2] = "NO_JOIN";
})(JoiningPolicy || (exports.JoiningPolicy = JoiningPolicy = {}));
//-------------------------------------------------------------------------------------------------
//-- TLVs
var SelectedKeyNegotiationProtocol;
(function (SelectedKeyNegotiationProtocol) {
    /** (Zigbee 3.0 Mechanism) */
    SelectedKeyNegotiationProtocol[SelectedKeyNegotiationProtocol["RESERVED"] = 0] = "RESERVED";
    /** SPEKE using Curve25519 with Hash AES-MMO-128 */
    SelectedKeyNegotiationProtocol[SelectedKeyNegotiationProtocol["SPEKE_CURVE25519_AESMMO128"] = 1] = "SPEKE_CURVE25519_AESMMO128";
    /**  SPEKE using Curve25519 with Hash SHA-256 */
    SelectedKeyNegotiationProtocol[SelectedKeyNegotiationProtocol["SPEKE_CURVE25519_SHA256"] = 2] = "SPEKE_CURVE25519_SHA256";
    // 3 – 255 Reserved
})(SelectedKeyNegotiationProtocol || (exports.SelectedKeyNegotiationProtocol = SelectedKeyNegotiationProtocol = {}));
var SelectedPreSharedSecret;
(function (SelectedPreSharedSecret) {
    /** Symmetric Authentication Token */
    SelectedPreSharedSecret[SelectedPreSharedSecret["SYMMETRIC_AUTHENTICATION_TOKEN"] = 0] = "SYMMETRIC_AUTHENTICATION_TOKEN";
    /** Pre-configured link-ley derived from installation code */
    SelectedPreSharedSecret[SelectedPreSharedSecret["PRECONFIGURED_LINKKEY_DERIVED_FROM_INSTALL_CODE"] = 1] = "PRECONFIGURED_LINKKEY_DERIVED_FROM_INSTALL_CODE";
    /** Variable-length pass code (for PAKE protocols) */
    SelectedPreSharedSecret[SelectedPreSharedSecret["PAKE_VARIABLE_LENGTH_PASS_CODE"] = 2] = "PAKE_VARIABLE_LENGTH_PASS_CODE";
    /** Basic Authorization Key */
    SelectedPreSharedSecret[SelectedPreSharedSecret["BASIC_AUTHORIZATION_KEY"] = 3] = "BASIC_AUTHORIZATION_KEY";
    /** Administrative Authorization Key */
    SelectedPreSharedSecret[SelectedPreSharedSecret["ADMIN_AUTHORIZATION_KEY"] = 4] = "ADMIN_AUTHORIZATION_KEY";
    // 5 – 254 Reserved,
    /** Anonymous Well-Known Secret */
    SelectedPreSharedSecret[SelectedPreSharedSecret["ANONYMOUS_WELLKNOWN_SECRET"] = 255] = "ANONYMOUS_WELLKNOWN_SECRET";
})(SelectedPreSharedSecret || (exports.SelectedPreSharedSecret = SelectedPreSharedSecret = {}));
var InitialJoinMethod;
(function (InitialJoinMethod) {
    InitialJoinMethod[InitialJoinMethod["ANONYMOUS"] = 0] = "ANONYMOUS";
    InitialJoinMethod[InitialJoinMethod["INSTALL_CODE_KEY"] = 1] = "INSTALL_CODE_KEY";
    InitialJoinMethod[InitialJoinMethod["WELLKNOWN_PASSPHRASE"] = 2] = "WELLKNOWN_PASSPHRASE";
    InitialJoinMethod[InitialJoinMethod["INSTALL_CODE_PASSPHRASE"] = 3] = "INSTALL_CODE_PASSPHRASE";
})(InitialJoinMethod || (exports.InitialJoinMethod = InitialJoinMethod = {}));
var ActiveLinkKeyType;
(function (ActiveLinkKeyType) {
    ActiveLinkKeyType[ActiveLinkKeyType["NOT_UPDATED"] = 0] = "NOT_UPDATED";
    ActiveLinkKeyType[ActiveLinkKeyType["KEY_REQUEST_METHOD"] = 1] = "KEY_REQUEST_METHOD";
    ActiveLinkKeyType[ActiveLinkKeyType["UNAUTHENTICATED_KEY_NEGOTIATION"] = 2] = "UNAUTHENTICATED_KEY_NEGOTIATION";
    ActiveLinkKeyType[ActiveLinkKeyType["AUTHENTICATED_KEY_NEGOTIATION"] = 3] = "AUTHENTICATED_KEY_NEGOTIATION";
    ActiveLinkKeyType[ActiveLinkKeyType["APPLICATION_DEFINED_CERTIFICATE_BASED_MUTUAL_AUTHENTICATION"] = 4] = "APPLICATION_DEFINED_CERTIFICATE_BASED_MUTUAL_AUTHENTICATION";
})(ActiveLinkKeyType || (exports.ActiveLinkKeyType = ActiveLinkKeyType = {}));
var GlobalTLV;
(function (GlobalTLV) {
    /** Minimum Length 2-byte */
    GlobalTLV[GlobalTLV["MANUFACTURER_SPECIFIC"] = 64] = "MANUFACTURER_SPECIFIC";
    /** Minimum Length 2-byte */
    GlobalTLV[GlobalTLV["SUPPORTED_KEY_NEGOTIATION_METHODS"] = 65] = "SUPPORTED_KEY_NEGOTIATION_METHODS";
    /** Minimum Length 4-byte XXX: spec min doesn't make sense, this is one pan id => 2-byte??? */
    GlobalTLV[GlobalTLV["PAN_ID_CONFLICT_REPORT"] = 66] = "PAN_ID_CONFLICT_REPORT";
    /** Minimum Length 2-byte */
    GlobalTLV[GlobalTLV["NEXT_PAN_ID_CHANGE"] = 67] = "NEXT_PAN_ID_CHANGE";
    /** Minimum Length 4-byte */
    GlobalTLV[GlobalTLV["NEXT_CHANNEL_CHANGE"] = 68] = "NEXT_CHANNEL_CHANGE";
    /** Minimum Length 16-byte */
    GlobalTLV[GlobalTLV["SYMMETRIC_PASSPHRASE"] = 69] = "SYMMETRIC_PASSPHRASE";
    /** Minimum Length 2-byte */
    GlobalTLV[GlobalTLV["ROUTER_INFORMATION"] = 70] = "ROUTER_INFORMATION";
    /** Minimum Length 2-byte */
    GlobalTLV[GlobalTLV["FRAGMENTATION_PARAMETERS"] = 71] = "FRAGMENTATION_PARAMETERS";
    GlobalTLV[GlobalTLV["JOINER_ENCAPSULATION"] = 72] = "JOINER_ENCAPSULATION";
    GlobalTLV[GlobalTLV["BEACON_APPENDIX_ENCAPSULATION"] = 73] = "BEACON_APPENDIX_ENCAPSULATION";
    // Reserved = 74,
    /** Minimum Length 2-byte XXX: min not in spec??? */
    GlobalTLV[GlobalTLV["CONFIGURATION_PARAMETERS"] = 75] = "CONFIGURATION_PARAMETERS";
    /** Refer to the Zigbee Direct specification for more details. */
    GlobalTLV[GlobalTLV["DEVICE_CAPABILITY_EXTENSION"] = 76] = "DEVICE_CAPABILITY_EXTENSION";
    // Reserved = 77-255
})(GlobalTLV || (exports.GlobalTLV = GlobalTLV = {}));
var RoutingTableStatus;
(function (RoutingTableStatus) {
    RoutingTableStatus[RoutingTableStatus["ACTIVE"] = 0] = "ACTIVE";
    RoutingTableStatus[RoutingTableStatus["DISCOVERY_UNDERWAY"] = 1] = "DISCOVERY_UNDERWAY";
    RoutingTableStatus[RoutingTableStatus["DISCOVERY_FAILED"] = 2] = "DISCOVERY_FAILED";
    RoutingTableStatus[RoutingTableStatus["INACTIVE"] = 3] = "INACTIVE";
    RoutingTableStatus[RoutingTableStatus["VALIDATION_UNDERWAY"] = 4] = "VALIDATION_UNDERWAY";
    RoutingTableStatus[RoutingTableStatus["RESERVED1"] = 5] = "RESERVED1";
    RoutingTableStatus[RoutingTableStatus["RESERVED2"] = 6] = "RESERVED2";
    RoutingTableStatus[RoutingTableStatus["RESERVED3"] = 7] = "RESERVED3";
})(RoutingTableStatus || (exports.RoutingTableStatus = RoutingTableStatus = {}));
//# sourceMappingURL=enums.js.map