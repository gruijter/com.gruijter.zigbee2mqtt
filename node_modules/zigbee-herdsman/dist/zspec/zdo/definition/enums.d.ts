export declare enum LeaveRequestFlags {
    /** Leave and rejoin. */
    AND_REJOIN = 128,
    /** DEPRECATED */
    /** Leave. */
    WITHOUT_REJOIN = 0
}
export declare enum JoiningPolicy {
    /** Any device is allowed to join. */
    ALL_JOIN = 0,
    /** Only devices on the mibJoiningIeeeList are allowed to join. */
    IEEELIST_JOIN = 1,
    /** No device is allowed to join. */
    NO_JOIN = 2
}
export declare enum SelectedKeyNegotiationProtocol {
    /** (Zigbee 3.0 Mechanism) */
    RESERVED = 0,
    /** SPEKE using Curve25519 with Hash AES-MMO-128 */
    SPEKE_CURVE25519_AESMMO128 = 1,
    /**  SPEKE using Curve25519 with Hash SHA-256 */
    SPEKE_CURVE25519_SHA256 = 2
}
export declare enum SelectedPreSharedSecret {
    /** Symmetric Authentication Token */
    SYMMETRIC_AUTHENTICATION_TOKEN = 0,
    /** Pre-configured link-ley derived from installation code */
    PRECONFIGURED_LINKKEY_DERIVED_FROM_INSTALL_CODE = 1,
    /** Variable-length pass code (for PAKE protocols) */
    PAKE_VARIABLE_LENGTH_PASS_CODE = 2,
    /** Basic Authorization Key */
    BASIC_AUTHORIZATION_KEY = 3,
    /** Administrative Authorization Key */
    ADMIN_AUTHORIZATION_KEY = 4,
    /** Anonymous Well-Known Secret */
    ANONYMOUS_WELLKNOWN_SECRET = 255
}
export declare enum InitialJoinMethod {
    ANONYMOUS = 0,
    INSTALL_CODE_KEY = 1,
    WELLKNOWN_PASSPHRASE = 2,
    INSTALL_CODE_PASSPHRASE = 3
}
export declare enum ActiveLinkKeyType {
    NOT_UPDATED = 0,
    KEY_REQUEST_METHOD = 1,
    UNAUTHENTICATED_KEY_NEGOTIATION = 2,
    AUTHENTICATED_KEY_NEGOTIATION = 3,
    APPLICATION_DEFINED_CERTIFICATE_BASED_MUTUAL_AUTHENTICATION = 4
}
export declare enum GlobalTLV {
    /** Minimum Length 2-byte */
    MANUFACTURER_SPECIFIC = 64,
    /** Minimum Length 2-byte */
    SUPPORTED_KEY_NEGOTIATION_METHODS = 65,
    /** Minimum Length 4-byte XXX: spec min doesn't make sense, this is one pan id => 2-byte??? */
    PAN_ID_CONFLICT_REPORT = 66,
    /** Minimum Length 2-byte */
    NEXT_PAN_ID_CHANGE = 67,
    /** Minimum Length 4-byte */
    NEXT_CHANNEL_CHANGE = 68,
    /** Minimum Length 16-byte */
    SYMMETRIC_PASSPHRASE = 69,
    /** Minimum Length 2-byte */
    ROUTER_INFORMATION = 70,
    /** Minimum Length 2-byte */
    FRAGMENTATION_PARAMETERS = 71,
    JOINER_ENCAPSULATION = 72,
    BEACON_APPENDIX_ENCAPSULATION = 73,
    /** Minimum Length 2-byte XXX: min not in spec??? */
    CONFIGURATION_PARAMETERS = 75,
    /** Refer to the Zigbee Direct specification for more details. */
    DEVICE_CAPABILITY_EXTENSION = 76
}
export declare enum RoutingTableStatus {
    ACTIVE = 0,
    DISCOVERY_UNDERWAY = 1,
    DISCOVERY_FAILED = 2,
    INACTIVE = 3,
    VALIDATION_UNDERWAY = 4,
    RESERVED1 = 5,
    RESERVED2 = 6,
    RESERVED3 = 7
}
//# sourceMappingURL=enums.d.ts.map