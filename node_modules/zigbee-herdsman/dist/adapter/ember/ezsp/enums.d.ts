/** EZSP Frame IDs */
export declare enum EzspFrameID {
    VERSION = 0,
    GET_CONFIGURATION_VALUE = 82,
    SET_CONFIGURATION_VALUE = 83,
    READ_ATTRIBUTE = 264,
    WRITE_ATTRIBUTE = 265,
    ADD_ENDPOINT = 2,
    SET_POLICY = 85,
    GET_POLICY = 86,
    SEND_PAN_ID_UPDATE = 87,
    GET_VALUE = 170,
    GET_EXTENDED_VALUE = 3,
    SET_VALUE = 171,
    SET_PASSIVE_ACK_CONFIG = 261,
    /** v14+ */
    SET_PENDING_NETWORK_UPDATE_PAN_ID = 286,
    /** v14+ */
    GET_ENDPOINT = 302,
    /** v14+ */
    GET_ENDPOINT_COUNT = 303,
    /** v14+ */
    GET_ENDPOINT_DESCRIPTION = 304,
    /** v14+ */
    GET_ENDPOINT_CLUSTER = 305,
    NOP = 5,
    ECHO = 129,
    INVALID_COMMAND = 88,
    CALLBACK = 6,
    NO_CALLBACKS = 7,
    SET_TOKEN = 9,
    GET_TOKEN = 10,
    GET_MFG_TOKEN = 11,
    SET_MFG_TOKEN = 12,
    STACK_TOKEN_CHANGED_HANDLER = 13,
    GET_RANDOM_NUMBER = 73,
    SET_TIMER = 14,
    GET_TIMER = 78,
    TIMER_HANDLER = 15,
    DEBUG_WRITE = 18,
    READ_AND_CLEAR_COUNTERS = 101,
    READ_COUNTERS = 241,
    COUNTER_ROLLOVER_HANDLER = 242,
    /** v17+ */
    MUX_INVALID_RX_HANDLER = 98,
    DELAY_TEST = 157,
    GET_LIBRARY_STATUS = 1,
    GET_XNCP_INFO = 19,
    CUSTOM_FRAME = 71,
    CUSTOM_FRAME_HANDLER = 84,
    GET_EUI64 = 38,
    GET_NODE_ID = 39,
    GET_PHY_INTERFACE_COUNT = 252,
    GET_TRUE_RANDOM_ENTROPY_SOURCE = 79,
    /** v14+ */
    SETUP_DELAYED_JOIN = 58,
    /** v14+ */
    RADIO_GET_SCHEDULER_PRIORITIES = 298,
    /** v14+ */
    RADIO_SET_SCHEDULER_PRIORITIES = 299,
    /** v14+ */
    RADIO_GET_SCHEDULER_SLIPTIME = 300,
    /** v14+ */
    RADIO_SET_SCHEDULER_SLIPTIME = 301,
    /** v14+ */
    COUNTER_REQUIRES_PHY_INDEX = 306,
    /** v14+ */
    COUNTER_REQUIRES_DESTINATION_NODE_ID = 307,
    SET_MANUFACTURER_CODE = 21,
    /** v14+ */
    GET_MANUFACTURER_CODE = 202,
    SET_POWER_DESCRIPTOR = 22,
    NETWORK_INIT = 23,
    NETWORK_STATE = 24,
    STACK_STATUS_HANDLER = 25,
    START_SCAN = 26,
    ENERGY_SCAN_RESULT_HANDLER = 72,
    NETWORK_FOUND_HANDLER = 27,
    SCAN_COMPLETE_HANDLER = 28,
    UNUSED_PAN_ID_FOUND_HANDLER = 210,
    FIND_UNUSED_PAN_ID = 211,
    STOP_SCAN = 29,
    FORM_NETWORK = 30,
    JOIN_NETWORK = 31,
    JOIN_NETWORK_DIRECTLY = 59,
    LEAVE_NETWORK = 32,
    FIND_AND_REJOIN_NETWORK = 33,
    PERMIT_JOINING = 34,
    CHILD_JOIN_HANDLER = 35,
    ENERGY_SCAN_REQUEST = 156,
    GET_NETWORK_PARAMETERS = 40,
    GET_RADIO_PARAMETERS = 253,
    GET_PARENT_CHILD_PARAMETERS = 41,
    /** v14+ */
    ROUTER_CHILD_COUNT = 315,
    /** v14+ */
    MAX_CHILD_COUNT = 316,
    /** v14+ */
    MAX_ROUTER_CHILD_COUNT = 317,
    /** v14+ */
    GET_PARENT_INCOMING_NWK_FRAME_COUNTER = 318,
    /** v14+ */
    SET_PARENT_INCOMING_NWK_FRAME_COUNTER = 319,
    /** v14+ */
    CURRENT_STACK_TASKS = 325,
    /** v14+ */
    OK_TO_NAP = 326,
    /** v14+ */
    PARENT_TOKEN_SET = 320,
    /** v14+ */
    OK_TO_HIBERNATE = 321,
    /** v14+ */
    OK_TO_LONG_POLL = 322,
    /** v14+ */
    STACK_POWER_DOWN = 323,
    /** v14+ */
    STACK_POWER_UP = 324,
    GET_CHILD_DATA = 74,
    SET_CHILD_DATA = 172,
    CHILD_ID = 262,
    /** v14+ */
    CHILD_POWER = 308,
    /** v14+ */
    SET_CHILD_POWER = 309,
    CHILD_INDEX = 263,
    GET_SOURCE_ROUTE_TABLE_TOTAL_SIZE = 195,
    GET_SOURCE_ROUTE_TABLE_FILLED_SIZE = 194,
    GET_SOURCE_ROUTE_TABLE_ENTRY = 193,
    GET_NEIGHBOR = 121,
    GET_NEIGHBOR_FRAME_COUNTER = 62,
    SET_NEIGHBOR_FRAME_COUNTER = 173,
    SET_ROUTING_SHORTCUT_THRESHOLD = 208,
    GET_ROUTING_SHORTCUT_THRESHOLD = 209,
    NEIGHBOR_COUNT = 122,
    GET_ROUTE_TABLE_ENTRY = 123,
    SET_RADIO_POWER = 153,
    SET_RADIO_CHANNEL = 154,
    GET_RADIO_CHANNEL = 255,
    SET_RADIO_IEEE802154_CCA_MODE = 149,
    SET_CONCENTRATOR = 16,
    /** v14+ */
    CONCENTRATOR_START_DISCOVERY = 335,
    /** v14+ */
    CONCENTRATOR_STOP_DISCOVERY = 336,
    /** v14+ */
    CONCENTRATOR_NOTE_ROUTE_ERROR = 337,
    SET_BROKEN_ROUTE_ERROR_CODE = 17,
    MULTI_PHY_START = 248,
    MULTI_PHY_STOP = 249,
    MULTI_PHY_SET_RADIO_POWER = 250,
    SEND_LINK_POWER_DELTA_REQUEST = 247,
    MULTI_PHY_SET_RADIO_CHANNEL = 251,
    GET_DUTY_CYCLE_STATE = 53,
    SET_DUTY_CYCLE_LIMITS_IN_STACK = 64,
    GET_DUTY_CYCLE_LIMITS = 75,
    GET_CURRENT_DUTY_CYCLE = 76,
    DUTY_CYCLE_HANDLER = 77,
    SET_NUM_BEACONS_TO_STORE = 55,
    GET_STORED_BEACON = 4,
    GET_NUM_STORED_BEACONS = 8,
    CLEAR_STORED_BEACONS = 60,
    SET_LOGICAL_AND_RADIO_CHANNEL = 185,
    /** v14+ */
    SLEEPY_TO_SLEEPY_NETWORK_START = 281,
    /** v14+ */
    SEND_ZIGBEE_LEAVE = 282,
    /** v14+ */
    GET_PERMIT_JOINING = 287,
    /** v14+ */
    GET_EXTENDED_PAN_ID = 295,
    /** v14+ */
    GET_CURRENT_NETWORK = 334,
    /** v14+ */
    SET_INITIAL_NEIGHBOR_OUTGOING_COST = 290,
    /** v14+ */
    GET_INITIAL_NEIGHBOR_OUTGOING_COST = 291,
    /** v14+ */
    RESET_REJOINING_NEIGHBORS_FRAME_COUNTER = 292,
    /** v14+ */
    IS_RESET_REJOINING_NEIGHBORS_FRAME_COUNTER_ENABLED = 293,
    CLEAR_BINDING_TABLE = 42,
    SET_BINDING = 43,
    GET_BINDING = 44,
    DELETE_BINDING = 45,
    BINDING_IS_ACTIVE = 46,
    GET_BINDING_REMOTE_NODE_ID = 47,
    SET_BINDING_REMOTE_NODE_ID = 48,
    REMOTE_SET_BINDING_HANDLER = 49,
    REMOTE_DELETE_BINDING_HANDLER = 50,
    MAXIMUM_PAYLOAD_LENGTH = 51,
    SEND_UNICAST = 52,
    SEND_BROADCAST = 54,
    PROXY_NEXT_BROADCAST_FROM_LONG = 102,
    SEND_MULTICAST = 56,
    SEND_REPLY = 57,
    MESSAGE_SENT_HANDLER = 63,
    SEND_MANY_TO_ONE_ROUTE_REQUEST = 65,
    POLL_FOR_DATA = 66,
    POLL_COMPLETE_HANDLER = 67,
    /** v14+ */
    SET_MESSAGE_FLAG = 310,
    /** v14+ */
    CLEAR_MESSAGE_FLAG = 311,
    POLL_HANDLER = 68,
    /** v14+ */
    ADD_CHILD = 312,
    /** v14+ */
    REMOVE_CHILD = 313,
    /** v14+ */
    REMOVE_NEIGHBOR = 314,
    INCOMING_MESSAGE_HANDLER = 69,
    SET_SOURCE_ROUTE_DISCOVERY_MODE = 90,
    INCOMING_MANY_TO_ONE_ROUTE_REQUEST_HANDLER = 125,
    INCOMING_ROUTE_ERROR_HANDLER = 128,
    INCOMING_NETWORK_STATUS_HANDLER = 196,
    INCOMING_ROUTE_RECORD_HANDLER = 89,
    UNICAST_CURRENT_NETWORK_KEY = 80,
    ADDRESS_TABLE_ENTRY_IS_ACTIVE = 91,
    /** v14+ */
    SET_ADDRESS_TABLE_INFO = 92,
    /** v14+ */
    GET_ADDRESS_TABLE_INFO = 94,
    SET_EXTENDED_TIMEOUT = 126,
    GET_EXTENDED_TIMEOUT = 127,
    REPLACE_ADDRESS_TABLE_ENTRY = 130,
    LOOKUP_NODE_ID_BY_EUI64 = 96,
    LOOKUP_EUI64_BY_NODE_ID = 97,
    GET_MULTICAST_TABLE_ENTRY = 99,
    SET_MULTICAST_TABLE_ENTRY = 100,
    ID_CONFLICT_HANDLER = 124,
    WRITE_NODE_DATA = 254,
    SEND_RAW_MESSAGE = 81,
    MAC_PASSTHROUGH_MESSAGE_HANDLER = 151,
    MAC_FILTER_MATCH_MESSAGE_HANDLER = 70,
    RAW_TRANSMIT_COMPLETE_HANDLER = 152,
    SET_MAC_POLL_FAILURE_WAIT_TIME = 244,
    /** v14+ */
    GET_MAX_MAC_RETRIES = 106,
    SET_BEACON_CLASSIFICATION_PARAMS = 239,
    GET_BEACON_CLASSIFICATION_PARAMS = 243,
    /** v14+ */
    PENDING_ACKED_MESSAGES = 289,
    /** v14+ */
    RESCHEDULE_LINK_STATUS_MSG = 283,
    /** v14+ */
    SET_NWK_UPDATE_ID = 285,
    SET_INITIAL_SECURITY_STATE = 104,
    GET_CURRENT_SECURITY_STATE = 105,
    EXPORT_KEY = 276,
    IMPORT_KEY = 277,
    SWITCH_NETWORK_KEY_HANDLER = 110,
    FIND_KEY_TABLE_ENTRY = 117,
    SEND_TRUST_CENTER_LINK_KEY = 103,
    ERASE_KEY_TABLE_ENTRY = 118,
    CLEAR_KEY_TABLE = 177,
    REQUEST_LINK_KEY = 20,
    UPDATE_TC_LINK_KEY = 108,
    ZIGBEE_KEY_ESTABLISHMENT_HANDLER = 155,
    CLEAR_TRANSIENT_LINK_KEYS = 107,
    GET_NETWORK_KEY_INFO = 278,
    GET_APS_KEY_INFO = 268,
    IMPORT_LINK_KEY = 270,
    EXPORT_LINK_KEY_BY_INDEX = 271,
    EXPORT_LINK_KEY_BY_EUI = 269,
    CHECK_KEY_CONTEXT = 272,
    IMPORT_TRANSIENT_KEY = 273,
    EXPORT_TRANSIENT_KEY_BY_INDEX = 274,
    EXPORT_TRANSIENT_KEY_BY_EUI = 275,
    /** v14+ */
    SET_INCOMING_TC_LINK_KEY_FRAME_COUNTER = 296,
    /** v14+ */
    APS_CRYPT_MESSAGE = 297,
    TRUST_CENTER_JOIN_HANDLER = 36,
    BROADCAST_NEXT_NETWORK_KEY = 115,
    BROADCAST_NETWORK_KEY_SWITCH = 116,
    AES_MMO_HASH = 111,
    REMOVE_DEVICE = 168,
    UNICAST_NWK_KEY_UPDATE = 169,
    GENERATE_CBKE_KEYS = 164,
    GENERATE_CBKE_KEYS_HANDLER = 158,
    CALCULATE_SMACS = 159,
    CALCULATE_SMACS_HANDLER = 160,
    GENERATE_CBKE_KEYS283K1 = 232,
    GENERATE_CBKE_KEYS_HANDLER283K1 = 233,
    CALCULATE_SMACS283K1 = 234,
    CALCULATE_SMACS_HANDLER283K1 = 235,
    CLEAR_TEMPORARY_DATA_MAYBE_STORE_LINK_KEY = 161,
    CLEAR_TEMPORARY_DATA_MAYBE_STORE_LINK_KEY283K1 = 238,
    GET_CERTIFICATE = 165,
    GET_CERTIFICATE283K1 = 236,
    DSA_SIGN_HANDLER = 167,
    DSA_VERIFY = 163,
    DSA_VERIFY_HANDLER = 120,
    DSA_VERIFY283K1 = 176,
    SET_PREINSTALLED_CBKE_DATA = 162,
    SAVE_PREINSTALLED_CBKE_DATA283K1 = 237,
    MFGLIB_INTERNAL_START = 131,
    MFGLIB_INTERNAL_END = 132,
    MFGLIB_INTERNAL_START_TONE = 133,
    MFGLIB_INTERNAL_STOP_TONE = 134,
    MFGLIB_INTERNAL_START_STREAM = 135,
    MFGLIB_INTERNAL_STOP_STREAM = 136,
    MFGLIB_INTERNAL_SEND_PACKET = 137,
    MFGLIB_INTERNAL_SET_CHANNEL = 138,
    MFGLIB_INTERNAL_GET_CHANNEL = 139,
    MFGLIB_INTERNAL_SET_POWER = 140,
    MFGLIB_INTERNAL_GET_POWER = 141,
    MFGLIB_RX_HANDLER = 142,
    LAUNCH_STANDALONE_BOOTLOADER = 143,
    SEND_BOOTLOAD_MESSAGE = 144,
    GET_STANDALONE_BOOTLOADER_VERSION_PLAT_MICRO_PHY = 145,
    INCOMING_BOOTLOAD_MESSAGE_HANDLER = 146,
    BOOTLOAD_TRANSMIT_COMPLETE_HANDLER = 147,
    AES_ENCRYPT = 148,
    /** v14+ */
    INCOMING_MFG_TEST_MESSAGE_HANDLER = 327,
    /** v14+ */
    MFG_TEST_SET_PACKET_MODE = 328,
    /** v14+ */
    MFG_TEST_SEND_REBOOT_COMMAND = 329,
    /** v14+ */
    MFG_TEST_SEND_EUI64 = 330,
    /** v14+ */
    MFG_TEST_SEND_MANUFACTURING_STRING = 331,
    /** v14+ */
    MFG_TEST_SEND_RADIO_PARAMETERS = 332,
    /** v14+ */
    MFG_TEST_SEND_COMMAND = 333,
    ZLL_NETWORK_OPS = 178,
    ZLL_SET_INITIAL_SECURITY_STATE = 179,
    ZLL_SET_SECURITY_STATE_WITHOUT_KEY = 207,
    ZLL_START_SCAN = 180,
    ZLL_SET_RX_ON_WHEN_IDLE = 181,
    ZLL_NETWORK_FOUND_HANDLER = 182,
    ZLL_SCAN_COMPLETE_HANDLER = 183,
    ZLL_ADDRESS_ASSIGNMENT_HANDLER = 184,
    ZLL_TOUCH_LINK_TARGET_HANDLER = 187,
    ZLL_GET_TOKENS = 188,
    ZLL_SET_DATA_TOKEN = 189,
    ZLL_SET_NON_ZLL_NETWORK = 191,
    IS_ZLL_NETWORK = 190,
    ZLL_SET_RADIO_IDLE_MODE = 212,
    ZLL_GET_RADIO_IDLE_MODE = 186,
    SET_ZLL_NODE_TYPE = 213,
    SET_ZLL_ADDITIONAL_STATE = 214,
    ZLL_OPERATION_IN_PROGRESS = 215,
    ZLL_RX_ON_WHEN_IDLE_GET_ACTIVE = 216,
    ZLL_SCANNING_COMPLETE = 246,
    GET_ZLL_PRIMARY_CHANNEL_MASK = 217,
    GET_ZLL_SECONDARY_CHANNEL_MASK = 218,
    SET_ZLL_PRIMARY_CHANNEL_MASK = 219,
    SET_ZLL_SECONDARY_CHANNEL_MASK = 220,
    ZLL_CLEAR_TOKENS = 37,
    GP_PROXY_TABLE_PROCESS_GP_PAIRING = 201,
    D_GP_SEND = 198,
    D_GP_SENT_HANDLER = 199,
    GPEP_INCOMING_MESSAGE_HANDLER = 197,
    GP_PROXY_TABLE_GET_ENTRY = 200,
    GP_PROXY_TABLE_LOOKUP = 192,
    /** v17+ */
    GP_PROXY_TABLE_REMOVE_ENTRY = 93,
    /** v17+ */
    GP_CLEAR_PROXY_TABLE = 95,
    GP_SINK_TABLE_GET_ENTRY = 221,
    GP_SINK_TABLE_LOOKUP = 222,
    GP_SINK_TABLE_SET_ENTRY = 223,
    GP_SINK_TABLE_REMOVE_ENTRY = 224,
    GP_SINK_TABLE_FIND_OR_ALLOCATE_ENTRY = 225,
    GP_SINK_TABLE_CLEAR_ALL = 226,
    GP_SINK_TABLE_INIT = 112,
    GP_SINK_TABLE_SET_SECURITY_FRAME_COUNTER = 245,
    GP_SINK_COMMISSION = 266,
    GP_TRANSLATION_TABLE_CLEAR = 267,
    GP_SINK_TABLE_GET_NUMBER_OF_ACTIVE_ENTRIES = 280,
    GET_TOKEN_COUNT = 256,
    GET_TOKEN_INFO = 257,
    GET_TOKEN_DATA = 258,
    SET_TOKEN_DATA = 259,
    RESET_NODE = 260,
    GP_SECURITY_TEST_VECTORS = 279,
    TOKEN_FACTORY_RESET = 119
}
/** Identifies a configuration value. uint8_t */
export declare enum EzspConfigId {
    /**
     * The NCP no longer supports configuration of packet buffer heap at runtime using this parameter.
     * Packet buffers heap space must be configured using the EMBER_PACKET_BUFFER_COUNT macro when building the NCP project.
     */
    PACKET_BUFFER_HEAP_SIZE = 1,
    /**
     * The maximum number of router neighbors the stack can keep track of. A
     * neighbor is a node within radio range.
     */
    NEIGHBOR_TABLE_SIZE = 2,
    /**
     * The maximum number of APS retried messages the stack can be transmitting at
     * any time.
     */
    APS_UNICAST_MESSAGE_COUNT = 3,
    /**
     * The maximum number of non-volatile bindings supported by the stack.
     */
    BINDING_TABLE_SIZE = 4,
    /**
     * The maximum number of EUI64 to network address associations that the stack
     * can maintain for the application. (Note, the total number of such address
     * associations maintained by the NCP is the sum of the value of this setting
     * and the value of ::TRUST_CENTER_ADDRESS_CACHE_SIZE.
     */
    ADDRESS_TABLE_SIZE = 5,
    /**
     * The maximum number of multicast groups that the device may be a member of.
     */
    MULTICAST_TABLE_SIZE = 6,
    /**
     * The maximum number of destinations to which a node can route messages. This
     * includes both messages originating at this node and those relayed for
     * others.
     */
    ROUTE_TABLE_SIZE = 7,
    /**
     * The number of simultaneous route discoveries that a node will support.
     */
    DISCOVERY_TABLE_SIZE = 8,
    /**
     * Specifies the stack profile.
     */
    STACK_PROFILE = 12,
    /**
     * The security level used for security at the MAC and network layers. The
     * supported values are 0 (no security) and 5 (payload is encrypted and a
     * four-byte MIC is used for authentication).
     */
    SECURITY_LEVEL = 13,
    /**
     * The maximum number of hops for a message.
     */
    MAX_HOPS = 16,
    /**
     * The maximum number of end device children that a router will support.
     */
    MAX_END_DEVICE_CHILDREN = 17,
    /**
     * The maximum amount of time that the MAC will hold a message for indirect
     * transmission to a child.
     */
    INDIRECT_TRANSMISSION_TIMEOUT = 18,
    /**
     * The maximum amount of time that an end device child can wait between polls.
     * If no poll is heard within this timeout, then the parent removes the end
     * device from its tables. Value range 0-14. The timeout corresponding to a
     * value of zero is 10 seconds. The timeout corresponding to a nonzero value N
     * is 2^N minutes, ranging from 2^1 = 2 minutes to 2^14 = 16384 minutes.
     */
    END_DEVICE_POLL_TIMEOUT = 19,
    /**
     * Enables boost power mode and/or the alternate transmitter output.
     */
    TX_POWER_MODE = 23,
    /**
     * 0: Allow this node to relay messages. 1: Prevent this node from relaying
     * messages.
     */
    DISABLE_RELAY = 24,
    /**
     * The maximum number of EUI64 to network address associations that the Trust
     * Center can maintain. These address cache entries are reserved for and
     * reused by the Trust Center when processing device join/rejoin
     * authentications. This cache size limits the number of overlapping joins the
     * Trust Center can process within a narrow time window (e.g. two seconds),
     * and thus should be set to the maximum number of near simultaneous joins the
     * Trust Center is expected to accommodate. (Note, the total number of such
     * address associations maintained by the NCP is the sum of the value of this
     * setting and the value of ::ADDRESS_TABLE_SIZE.)
     */
    TRUST_CENTER_ADDRESS_CACHE_SIZE = 25,
    /**
     * The size of the source route table.
     */
    SOURCE_ROUTE_TABLE_SIZE = 26,
    /** The number of blocks of a fragmented message that can be sent in a single window. */
    FRAGMENT_WINDOW_SIZE = 28,
    /** The time the stack will wait (in milliseconds) between sending blocks of a fragmented message. */
    FRAGMENT_DELAY_MS = 29,
    /**
     * The size of the Key Table used for storing individual link keys (if the
     * device is a Trust Center) or Application Link Keys (if the device is a normal node).
     */
    KEY_TABLE_SIZE = 30,
    /** The APS ACK timeout value. The stack waits this amount of time between resends of APS retried messages. */
    APS_ACK_TIMEOUT = 31,
    /**
     * The duration of a beacon jitter, in the units used by the 15.4 scan
     * parameter (((1 << duration) + 1) * 15ms), when responding to a beacon request.
     */
    BEACON_JITTER_DURATION = 32,
    /** The number of PAN id conflict reports that must be received by the network manager within one minute to trigger a PAN id change. */
    PAN_ID_CONFLICT_REPORT_THRESHOLD = 34,
    /**
     * The timeout value in minutes for how long the Trust Center or a normal node
     * waits for the Zigbee Request Key to complete. On the Trust Center this
     * controls whether or not the device buffers the request, waiting for a
     * matching pair of Zigbee Request Key. If the value is non-zero, the Trust
     * Center buffers and waits for that amount of time. If the value is zero, the
     * Trust Center does not buffer the request and immediately responds to the
     * request. Zero is the most compliant behavior.
     */
    REQUEST_KEY_TIMEOUT = 36,
    /**
     * This value indicates the size of the runtime modifiable certificate table.
     * Normally certificates are stored in MFG tokens but this table can be used
     * to field upgrade devices with new Smart Energy certificates. This value
     * cannot be set, it can only be queried.
     */
    CERTIFICATE_TABLE_SIZE = 41,
    /**
     * This is a bitmask that controls which incoming ZDO request messages are
     * passed to the application. The bits are defined in the
     * EmberZdoConfigurationFlags enumeration. To see if the application is
     * required to send a ZDO response in reply to an incoming message, the
     * application must check the APS options bitfield within the
     * incomingMessageHandler callback to see if the
     * EMBER_APS_OPTION_ZDO_RESPONSE_REQUIRED flag is set.
     */
    APPLICATION_ZDO_FLAGS = 42,
    /** The maximum number of broadcasts during a single broadcast timeout period. */
    BROADCAST_TABLE_SIZE = 43,
    /** The size of the MAC filter list table. */
    MAC_FILTER_TABLE_SIZE = 44,
    /** The number of supported networks. */
    SUPPORTED_NETWORKS = 45,
    /**
     * Whether multicasts are sent to the RxOnWhenIdle=true address (0xFFFD) or
     * the sleepy broadcast address (0xFFFF). The RxOnWhenIdle=true address is the
     * Zigbee compliant destination for multicasts.
     */
    SEND_MULTICASTS_TO_SLEEPY_ADDRESS = 46,
    /** ZLL group address initial configuration. */
    ZLL_GROUP_ADDRESSES = 47,
    /** ZLL rssi threshold initial configuration. */
    ZLL_RSSI_THRESHOLD = 48,
    /** Toggles the MTORR flow control in the stack. */
    MTORR_FLOW_CONTROL = 51,
    /** Setting the retry queue size. Applies to all queues. Default value in the sample applications is 16. */
    RETRY_QUEUE_SIZE = 52,
    /**
     * Setting the new broadcast entry threshold. The number (BROADCAST_TABLE_SIZE
     * - NEW_BROADCAST_ENTRY_THRESHOLD) of broadcast table entries are reserved
     * for relaying the broadcast messages originated on other devices. The local
     * device will fail to originate a broadcast message after this threshold is
     * reached. Setting this value to BROADCAST_TABLE_SIZE and greater will
     * effectively kill this limitation.
     */
    NEW_BROADCAST_ENTRY_THRESHOLD = 53,
    /**
     * The length of time, in seconds, that a trust center will store a transient
     * link key that a device can use to join its network. A transient key is
     * added with a call to emberAddTransientLinkKey. After the transient key is
     * added, it will be removed once this amount of time has passed. A joining
     * device will not be able to use that key to join until it is added again on
     * the trust center. The default value is 300 seconds, i.e., 5 minutes.
     */
    TRANSIENT_KEY_TIMEOUT_S = 54,
    /** The number of passive acknowledgements to record from neighbors before we stop re-transmitting broadcasts */
    BROADCAST_MIN_ACKS_NEEDED = 55,
    /**
     * The length of time, in seconds, that a trust center will allow a Trust
     * Center (insecure) rejoin for a device that is using the well-known link
     * key. This timeout takes effect once rejoins using the well-known key has
     * been allowed. This command updates the
     * sli_zigbee_allow_tc_rejoins_using_well_known_key_timeout_sec value.
     */
    TC_REJOINS_USING_WELL_KNOWN_KEY_TIMEOUT_S = 56,
    /** Valid range of a CTUNE value is 0x0000-0x01FF. Higher order bits (0xFE00) of the 16-bit value are ignored. */
    CTUNE_VALUE = 57,
    /**
     * To configure non trust center node to assume a concentrator type of the
     * trust center it join to, until it receive many-to-one route request from
     * the trust center. For the trust center node, concentrator type is
     * configured from the concentrator plugin. The stack by default assumes trust
     * center be a low RAM concentrator that make other devices send route record
     * to the trust center even without receiving a many-to-one route request. The
     * default concentrator type can be changed by setting appropriate
     * EmberAssumeTrustCenterConcentratorType config value.
     */
    ASSUME_TC_CONCENTRATOR_TYPE = 64,
    /** This is green power proxy table size. This value is read-only and cannot be set at runtime */
    GP_PROXY_TABLE_SIZE = 65,
    /** This is green power sink table size. This value is read-only and cannot be set at runtime */
    GP_SINK_TABLE_SIZE = 66,
    /**
     * v14+
     * This is the configuration advertised by the end device to the parent when joining/rejoining,
     * either SL_ZIGBEE_END_DEVICE_CONFIG_NONE or SL_ZIGBEE_END_DEVICE_CONFIG_PERSIST_DATA_ON_PARENT.
     */
    END_DEVICE_CONFIGURATION = 67
}
/** Identifies a policy decision. */
export declare enum EzspDecisionId {
    /**
     * BINDING_MODIFICATION_POLICY default decision.
     *
     * Do not allow the local binding table to be changed by remote nodes.
     */
    DISALLOW_BINDING_MODIFICATION = 16,
    /**
     * BINDING_MODIFICATION_POLICY decision.
     *
     * Allow remote nodes to change the local binding table.
     */
    ALLOW_BINDING_MODIFICATION = 17,
    /**
     * BINDING_MODIFICATION_POLICY decision.
     *
     * Allows remote nodes to set local binding entries only if the entries correspond to endpoints
     * defined on the device, and for output clusters bound to those endpoints.
     */
    CHECK_BINDING_MODIFICATIONS_ARE_VALID_ENDPOINT_CLUSTERS = 18,
    /**
     * UNICAST_REPLIES_POLICY default decision.
     *
     * The NCP will automatically send an empty reply (containing no payload) for every unicast received.
     * */
    HOST_WILL_NOT_SUPPLY_REPLY = 32,
    /**
     * UNICAST_REPLIES_POLICY decision.
     *
     * The NCP will only send a reply if it receives a sendReply command from the Host.
     */
    HOST_WILL_SUPPLY_REPLY = 33,
    /**
     * POLL_HANDLER_POLICY default decision.
     *
     * Do not inform the Host when a child polls.
     */
    POLL_HANDLER_IGNORE = 48,
    /**
     * POLL_HANDLER_POLICY decision.
     *
     * Generate a pollHandler callback when a child polls.
     */
    POLL_HANDLER_CALLBACK = 49,
    /**
     * MESSAGE_CONTENTS_IN_CALLBACK_POLICY default decision.
     *
     * Include only the message tag in the messageSentHandler callback.
     */
    MESSAGE_TAG_ONLY_IN_CALLBACK = 64,
    /**
     * MESSAGE_CONTENTS_IN_CALLBACK_POLICY decision.
     *
     * Include both the message tag and the message contents in the messageSentHandler callback.
     */
    MESSAGE_TAG_AND_CONTENTS_IN_CALLBACK = 65,
    /**
     * TC_KEY_REQUEST_POLICY decision.
     *
     * When the Trust Center receives a request for a Trust Center link key, it will be ignored.
     */
    DENY_TC_KEY_REQUESTS = 80,
    /**
     * TC_KEY_REQUEST_POLICY decision.
     *
     * When the Trust Center receives a request for a Trust Center link key, it will reply to it with the corresponding key.
     */
    ALLOW_TC_KEY_REQUESTS_AND_SEND_CURRENT_KEY = 81,
    /**
     * TC_KEY_REQUEST_POLICY decision.
     *
     * When the Trust Center receives a request for a Trust Center link key, it will generate a key to send to the joiner.
     * After generation, the key will be added to the transient key tabe and After verification, this key will be added into the link key table.
     */
    ALLOW_TC_KEY_REQUEST_AND_GENERATE_NEW_KEY = 82,
    /**
     * APP_KEY_REQUEST_POLICY decision.
     * When the Trust Center receives a request for an application link key, it will be ignored.
     * */
    DENY_APP_KEY_REQUESTS = 96,
    /**
     * APP_KEY_REQUEST_POLICY decision.
     *
     * When the Trust Center receives a request for an application link key, it will randomly generate a key and send it to both partners.
     */
    ALLOW_APP_KEY_REQUESTS = 97,
    /** Indicates that packet validate library checks are enabled on the NCP. */
    PACKET_VALIDATE_LIBRARY_CHECKS_ENABLED = 98,
    /** Indicates that packet validate library checks are NOT enabled on the NCP. */
    PACKET_VALIDATE_LIBRARY_CHECKS_DISABLED = 99
}
/**
 * This is the policy decision bitmask that controls the trust center decision strategies.
 * The bitmask is modified and extracted from the EzspDecisionId for supporting bitmask operations.
 * uint16_t
 */
export declare enum EzspDecisionBitmask {
    /** Disallow joins and rejoins. */
    DEFAULT_CONFIGURATION = 0,
    /** Send the network key to all joining devices. */
    ALLOW_JOINS = 1,
    /** Send the network key to all rejoining devices. */
    ALLOW_UNSECURED_REJOINS = 2,
    /** Send the network key in the clear. */
    SEND_KEY_IN_CLEAR = 4,
    /** Do nothing for unsecured rejoins. */
    IGNORE_UNSECURED_REJOINS = 8,
    /** Allow joins if there is an entry in the transient key table. */
    JOINS_USE_INSTALL_CODE_KEY = 16,
    /** Delay sending the network key to a new joining device. */
    DEFER_JOINS = 32
}
/** Identifies a policy. */
export declare enum EzspPolicyId {
    /** Controls trust center behavior. */
    TRUST_CENTER_POLICY = 0,
    /** Controls how external binding modification requests are handled. */
    BINDING_MODIFICATION_POLICY = 1,
    /** Controls whether the Host supplies unicast replies. */
    UNICAST_REPLIES_POLICY = 2,
    /** Controls whether pollHandler callbacks are generated. */
    POLL_HANDLER_POLICY = 3,
    /** Controls whether the message contents are included in the messageSentHandler callback. */
    MESSAGE_CONTENTS_IN_CALLBACK_POLICY = 4,
    /** Controls whether the Trust Center will respond to Trust Center link key requests. */
    TC_KEY_REQUEST_POLICY = 5,
    /** Controls whether the Trust Center will respond to application link key requests. */
    APP_KEY_REQUEST_POLICY = 6,
    /**
     * Controls whether Zigbee packets that appear invalid are automatically dropped by the stack.
     * A counter will be incremented when this occurs.
     */
    PACKET_VALIDATE_LIBRARY_POLICY = 7,
    /** Controls whether the stack will process ZLL messages. */
    ZLL_POLICY = 8,
    /**
     * Controls whether Trust Center (insecure) rejoins for devices using the well-known link key are accepted.
     * If rejoining using the well-known key is allowed,
     * it is disabled again after sli_zigbee_allow_tc_rejoins_using_well_known_key_timeout_sec seconds.
     */
    TC_REJOINS_USING_WELL_KNOWN_KEY_POLICY = 9
}
/** Identifies a value. */
export declare enum EzspValueId {
    /** The contents of the node data stack token. */
    TOKEN_STACK_NODE_DATA = 0,
    /** The types of MAC passthrough messages that the host wishes to receive. */
    MAC_PASSTHROUGH_FLAGS = 1,
    /**
     * The source address used to filter legacy EmberNet messages when the
     * EMBER_MAC_PASSTHROUGH_EMBERNET_SOURCE flag is set in MAC_PASSTHROUGH_FLAGS.
     */
    EMBERNET_PASSTHROUGH_SOURCE_ADDRESS = 2,
    /** The amount in bytes (max 2^16) of available general purpose heap memory. */
    BUFFER_HEAP_FREE_SIZE = 3,
    /** Selects sending synchronous callbacks in ezsp-uart. */
    UART_SYNCH_CALLBACKS = 4,
    /**
     * The maximum incoming transfer size for the local node.
     * Default value is set to 82 and does not use fragmentation. Sets the value in Node Descriptor.
     * To set, this takes the input of a uint8 array of length 2 where you pass the lower byte at index 0 and upper byte at index 1.
     */
    MAXIMUM_INCOMING_TRANSFER_SIZE = 5,
    /**
     * The maximum outgoing transfer size for the local node.
     * Default value is set to 82 and does not use fragmentation. Sets the value in Node Descriptor.
     * To set, this takes the input of a uint8 array of length 2 where you pass the lower byte at index 0 and upper byte at index 1.
     */
    MAXIMUM_OUTGOING_TRANSFER_SIZE = 6,
    /** A bool indicating whether stack tokens are written to persistent storage as they change. */
    STACK_TOKEN_WRITING = 7,
    /** A read-only value indicating whether the stack is currently performing a rejoin. */
    STACK_IS_PERFORMING_REJOIN = 8,
    /** A list of EmberMacFilterMatchData values. */
    MAC_FILTER_LIST = 9,
    /** The Ember Extended Security Bitmask. */
    EXTENDED_SECURITY_BITMASK = 10,
    /** The node short ID. */
    NODE_SHORT_ID = 11,
    /** The descriptor capability of the local node. Write only. */
    DESCRIPTOR_CAPABILITY = 12,
    /** The stack device request sequence number of the local node. */
    STACK_DEVICE_REQUEST_SEQUENCE_NUMBER = 13,
    /** Enable or disable radio hold-off. */
    RADIO_HOLD_OFF = 14,
    /** The flags field associated with the endpoint data. */
    ENDPOINT_FLAGS = 15,
    /** Enable/disable the Mfg security config key settings. */
    MFG_SECURITY_CONFIG = 16,
    /** Retrieves the version information from the stack on the NCP. */
    VERSION_INFO = 17,
    /**
     * This is the reason that the last rejoin took place. This value may only be retrieved, not set.
     * The rejoin may have been initiated by the stack (NCP) or the application (host).
     * If a host initiated a rejoin the reason will be set by default to EMBER_REJOIN_DUE_TO_APP_EVENT_1.
     * If the application wishes to denote its own rejoin reasons it can do so by calling
     * ezspSetValue(EMBER_VALUE_HOST_REJOIN_REASON, EMBER_REJOIN_DUE_TO_APP_EVENT_X).
     * X is a number corresponding to one of the app events defined.
     * If the NCP initiated a rejoin it will record this value internally for retrieval by ezspGetValue(REAL_REJOIN_REASON).
     */
    LAST_REJOIN_REASON = 19,
    /** The next Zigbee sequence number. */
    NEXT_ZIGBEE_SEQUENCE_NUMBER = 20,
    /** CCA energy detect threshold for radio. */
    CCA_THRESHOLD = 21,
    /** The threshold value for a counter */
    SET_COUNTER_THRESHOLD = 23,
    /** Resets all counters thresholds to 0xFF */
    RESET_COUNTER_THRESHOLDS = 24,
    /** Clears all the counters */
    CLEAR_COUNTERS = 25,
    /** The node's new certificate signed by the CA. */
    CERTIFICATE_283K1 = 26,
    /** The Certificate Authority's public key. */
    PUBLIC_KEY_283K1 = 27,
    /** The node's new static private key. */
    PRIVATE_KEY_283K1 = 28,
    /** The NWK layer security frame counter value */
    NWK_FRAME_COUNTER = 35,
    /** The APS layer security frame counter value. Managed by the stack. Users should not set these unless doing backup and restore. */
    APS_FRAME_COUNTER = 36,
    /** Sets the device type to use on the next rejoin using device type */
    RETRY_DEVICE_TYPE = 37,
    /** Setting this byte enables R21 behavior on the NCP. */
    ENABLE_R21_BEHAVIOR = 41,
    /** Configure the antenna mode(0-don't switch,1-primary,2-secondary,3-TX antenna diversity). */
    ANTENNA_MODE = 48,
    /** Enable or disable packet traffic arbitration. */
    ENABLE_PTA = 49,
    /** Set packet traffic arbitration configuration options. */
    PTA_OPTIONS = 50,
    /** Configure manufacturing library options (0-non-CSMA transmits,1-CSMA transmits). To be used with Manufacturing Library. */
    MFGLIB_OPTIONS = 51,
    /**
     * Sets the flag to use either negotiated power by link power delta (LPD) or fixed power value provided by user
     * while forming/joining a network for packet transmissions on sub-ghz interface. This is mainly for testing purposes.
     */
    USE_NEGOTIATED_POWER_BY_LPD = 52,
    /** Set packet traffic arbitration PWM options. */
    PTA_PWM_OPTIONS = 53,
    /** Set packet traffic arbitration directional priority pulse width in microseconds. */
    PTA_DIRECTIONAL_PRIORITY_PULSE_WIDTH = 54,
    /** Set packet traffic arbitration phy select timeout(ms). */
    PTA_PHY_SELECT_TIMEOUT = 55,
    /** Configure the RX antenna mode: (0-do not switch; 1-primary; 2-secondary; 3-RX antenna diversity). */
    ANTENNA_RX_MODE = 56,
    /** Configure the timeout to wait for the network key before failing a join. Acceptable timeout range [3,255]. Value is in seconds. */
    NWK_KEY_TIMEOUT = 57,
    /**
     * The number of failed CSMA attempts due to failed CCA made by the MAC before continuing transmission with CCA disabled.
     * This is the same as calling the emberForceTxAfterFailedCca(uint8_t csmaAttempts) API. A value of 0 disables the feature.
     */
    FORCE_TX_AFTER_FAILED_CCA_ATTEMPTS = 58,
    /**
     * The length of time, in seconds, that a trust center will store a transient link key that a device can use to join its network.
     * A transient key is added with a call to sl_zb_sec_man_import_transient_key. After the transient key is added,
     * it will be removed once this amount of time has passed. A joining device will not be able to use that key to join
     * until it is added again on the trust center.
     * The default value is 300 seconds (5 minutes).
     */
    TRANSIENT_KEY_TIMEOUT_S = 59,
    /** Cumulative energy usage metric since the last value reset of the coulomb counter plugin. Setting this value will reset the coulomb counter. */
    COULOMB_COUNTER_USAGE = 60,
    /**
     * When scanning, configure the maximum number of beacons to store in cache.
     * Each beacon consumes on average 32-bytes (+ buffer overhead) in RAM.
     */
    MAX_BEACONS_TO_STORE = 61,
    /** Set the mask to filter out unacceptable child timeout options on a router. */
    END_DEVICE_TIMEOUT_OPTIONS_MASK = 62,
    /** The end device keep-alive mode supported by the parent. */
    END_DEVICE_KEEP_ALIVE_SUPPORT_MODE = 63,
    /**
     * Return the active radio config. Read only.
     * Values are 0: Default, 1: Antenna Diversity, 2: Co-Existence, 3: Antenna Diversity and Co-Existence.
     */
    ACTIVE_RADIO_CONFIG = 65,
    /** Return the number of seconds the network will remain open. A return value of 0 indicates that the network is closed. Read only. */
    NWK_OPEN_DURATION = 66,
    /**
     * Timeout in milliseconds to store entries in the transient device table.
     * If the devices are not authenticated before the timeout, the entry shall be purged
     */
    TRANSIENT_DEVICE_TIMEOUT = 67,
    /**
     * Return information about the key storage on an NCP.
     * Returns 0 if keys are in classic key storage, and 1 if they are located in PSA key storage. Read only.
     */
    KEY_STORAGE_VERSION = 68,
    /** Return activation state about TC Delayed Join on an NCP.  A return value of 0 indicates that the feature is not activated. */
    DELAYED_JOIN_ACTIVATION = 69,
    /**
     * v14+
     * The maximum number of NWK retries that will be attempted.
     */
    MAX_NWK_RETRIES = 70,
    /**
     * v14+
     * Policies for allowing/disallowing rejoins.
     */
    REJOIN_MODE = 71,
    /**
     * v17+
     * Controls whether devices must use an install code when joining.
     */
    JOIN_USE_INSTALL_CODE_ENABLE = 72
}
/**
 * Identifies a value based on specified characteristics.
 * Each set of characteristics is unique to that value and is specified during the call to get the extended value.
 *
 * uint8_t
 */
export declare enum EzspExtendedValueId {
    /** The flags field associated with the specified endpoint. Value is uint16_t */
    ENDPOINT_FLAGS = 0,
    /**
     * This is the reason for the node to leave the network as well as the device that told it to leave.
     * The leave reason is the 1st byte of the value while the node ID is the 2nd and 3rd byte.
     * If the leave was caused due to an API call rather than an over the air message, the node ID will be EMBER_UNKNOWN_NODE_ID (0xFFFD).
     */
    LAST_LEAVE_REASON = 1,
    /** This number of bytes of overhead required in the network frame for source routing to a particular destination. */
    GET_SOURCE_ROUTE_OVERHEAD = 2,
    /** v17+ These values are current or boot-time metrics gathered by the memory manager/buffer manager. */
    MEMORY_USAGE_DATA = 3
}
/** Flags associated with the endpoint data configured on the NCP. */
export declare enum EzspEndpointFlag {
    /** Indicates that the endpoint is disabled and NOT discoverable via ZDO. */
    DISABLED = 0,
    /** Indicates that the endpoint is enabled and discoverable via ZDO. */
    ENABLED = 1
}
/** Notes the last leave reason. uint8_t */
export declare enum EmberLeaveReason {
    REASON_NONE = 0,
    DUE_TO_NWK_LEAVE_MESSAGE = 1,
    DUE_TO_APS_REMOVE_MESSAGE = 2,
    DUE_TO_ZDO_LEAVE_MESSAGE = 3,
    DUE_TO_ZLL_TOUCHLINK = 4,
    DUE_TO_APP_EVENT_1 = 255
}
/** Notes the last rejoin reason. uint8_t */
export declare enum EmberRejoinReason {
    REASON_NONE = 0,
    DUE_TO_NWK_KEY_UPDATE = 1,
    DUE_TO_LEAVE_MESSAGE = 2,
    DUE_TO_NO_PARENT = 3,
    DUE_TO_ZLL_TOUCHLINK = 4,
    DUE_TO_END_DEVICE_REBOOT = 5,
    DUE_TO_APP_EVENT_5 = 251,
    DUE_TO_APP_EVENT_4 = 252,
    DUE_TO_APP_EVENT_3 = 253,
    DUE_TO_APP_EVENT_2 = 254,
    DUE_TO_APP_EVENT_1 = 255
}
/** Manufacturing token IDs used by ezspGetMfgToken(). */
export declare enum EzspMfgTokenId {
    /** Custom version (2 bytes). */
    CUSTOM_VERSION = 0,
    /** Manufacturing string (16 bytes). */
    STRING = 1,
    /** Board name (16 bytes). */
    BOARD_NAME = 2,
    /** Manufacturing ID (2 bytes). */
    MANUF_ID = 3,
    /** Radio configuration (2 bytes). */
    PHY_CONFIG = 4,
    /** Bootload AES key (16 bytes). */
    BOOTLOAD_AES_KEY = 5,
    /** ASH configuration (40 bytes). */
    ASH_CONFIG = 6,
    /** EZSP storage (8 bytes). */
    EZSP_STORAGE = 7,
    /**
     * Radio calibration data (64 bytes). 4 bytes are stored for each of the 16 channels.
     * This token is not stored in the Flash Information Area. It is updated by the stack each time a calibration is performed.
     */
    STACK_CAL_DATA = 8,
    /** Certificate Based Key Exchange (CBKE) data (92 bytes). */
    CBKE_DATA = 9,
    /** Installation code (20 bytes). */
    INSTALLATION_CODE = 10,
    /**
     * Radio channel filter calibration data (1 byte).
     * This token is not stored in the Flash Information Area. It is updated by the stack each time a calibration is performed.
     */
    STACK_CAL_FILTER = 11,
    /** Custom EUI64 MAC address (8 bytes). */
    CUSTOM_EUI_64 = 12,
    /** CTUNE value (2 byte). */
    CTUNE = 13
}
export declare enum EzspSleepMode {
    /** Processor idle. */
    IDLE = 0,
    /** Wake on interrupt or timer. */
    DEEP_SLEEP = 1,
    /** Wake on interrupt only. */
    POWER_DOWN = 2,
    /** Reserved */
    RESERVED_SLEEP = 3
}
/** v17+ */
export declare enum EzspMemoryUsageData {
    /** Gets the total available heap size in bytes */
    TOTAL_HEAP_SIZE = 1,
    /** Gets the used heap size in bytes at the time requested */
    CURRENT_USED_HEAP_SIZE = 2,
    /** Gets the "high watermark" of the heap (the highest the heap has been) in bytes at the time requested */
    CURRENT_HEAP_HIGH_WATERMARK = 3,
    /** Gets the used heap size in bytes at the time after sl_system_init */
    INIT_USED_HEAP_SIZE = 4,
    /** Gets the "high watermark" of the heap (the highest the heap has been) in bytes at the time after sl_system_init */
    INIT_HEAP_HIGH_WATERMARK = 5
}
//# sourceMappingURL=enums.d.ts.map