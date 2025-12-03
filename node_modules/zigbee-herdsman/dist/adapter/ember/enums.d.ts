/** Status Codes contains error and status code definitions used by Simplicity SDK software components and stacks. */
export declare enum SLStatus {
    /** No error. */
    OK = 0,
    /** Generic error. */
    FAIL = 1,
    /** Generic invalid state error. */
    INVALID_STATE = 2,
    /** Module is not ready for requested operation. */
    NOT_READY = 3,
    /** Module is busy and cannot carry out requested operation. */
    BUSY = 4,
    /** Operation is in progress and not yet complete (pass or fail). */
    IN_PROGRESS = 5,
    /** Operation aborted. */
    ABORT = 6,
    /** Operation timed out. */
    TIMEOUT = 7,
    /** Operation not allowed per permissions. */
    PERMISSION = 8,
    /** Non-blocking operation would block. */
    WOULD_BLOCK = 9,
    /** Operation/module is Idle, cannot carry requested operation. */
    IDLE = 10,
    /** Operation cannot be done while construct is waiting. */
    IS_WAITING = 11,
    /** No task/construct waiting/pending for that action/event. */
    NONE_WAITING = 12,
    /** Operation cannot be done while construct is suspended. */
    SUSPENDED = 13,
    /** Feature not available due to software configuration. */
    NOT_AVAILABLE = 14,
    /** Feature not supported. */
    NOT_SUPPORTED = 15,
    /** Initialization failed. */
    INITIALIZATION = 16,
    /** Module has not been initialized. */
    NOT_INITIALIZED = 17,
    /** Module has already been initialized. */
    ALREADY_INITIALIZED = 18,
    /** Object/construct has been deleted. */
    DELETED = 19,
    /** Illegal call from ISR. */
    ISR = 20,
    /** Illegal call because network is up. */
    NETWORK_UP = 21,
    /** Illegal call because network is down. */
    NETWORK_DOWN = 22,
    /** Failure due to not being joined in a network. */
    NOT_JOINED = 23,
    /** Invalid operation as there are no beacons. */
    NO_BEACONS = 24,
    /** Generic allocation error. */
    ALLOCATION_FAILED = 25,
    /** No more resource available to perform the operation. */
    NO_MORE_RESOURCE = 26,
    /** Item/list/queue is empty. */
    EMPTY = 27,
    /** Item/list/queue is full. */
    FULL = 28,
    /** Item would overflow. */
    WOULD_OVERFLOW = 29,
    /** Item/list/queue has been overflowed. */
    HAS_OVERFLOWED = 30,
    /** Generic ownership error. */
    OWNERSHIP = 31,
    /** Already/still owning resource. */
    IS_OWNER = 32,
    /** Generic invalid argument or consequence of invalid argument. */
    INVALID_PARAMETER = 33,
    /** Invalid null pointer received as argument. */
    NULL_POINTER = 34,
    /** Invalid configuration provided. */
    INVALID_CONFIGURATION = 35,
    /** Invalid mode. */
    INVALID_MODE = 36,
    /** Invalid handle. */
    INVALID_HANDLE = 37,
    /** Invalid type for operation. */
    INVALID_TYPE = 38,
    /** Invalid index. */
    INVALID_INDEX = 39,
    /** Invalid range. */
    INVALID_RANGE = 40,
    /** Invalid key. */
    INVALID_KEY = 41,
    /** Invalid credentials. */
    INVALID_CREDENTIALS = 42,
    /** Invalid count. */
    INVALID_COUNT = 43,
    /** Invalid signature / verification failed. */
    INVALID_SIGNATURE = 44,
    /** Item could not be found. */
    NOT_FOUND = 45,
    /** Item already exists. */
    ALREADY_EXISTS = 46,
    /** Generic I/O failure. */
    IO = 47,
    /** I/O failure due to timeout. */
    IO_TIMEOUT = 48,
    /** Generic transmission error. */
    TRANSMIT = 49,
    /** Transmit underflowed. */
    TRANSMIT_UNDERFLOW = 50,
    /** Transmit is incomplete. */
    TRANSMIT_INCOMPLETE = 51,
    /** Transmit is busy. */
    TRANSMIT_BUSY = 52,
    /** Generic reception error. */
    RECEIVE = 53,
    /** Failed to read on/via given object. */
    OBJECT_READ = 54,
    /** Failed to write on/via given object. */
    OBJECT_WRITE = 55,
    /** Message is too long. */
    MESSAGE_TOO_LONG = 56,
    /** EEPROM MFG version mismatch. */
    EEPROM_MFG_VERSION_MISMATCH = 57,
    /** EEPROM Stack version mismatch. */
    EEPROM_STACK_VERSION_MISMATCH = 58,
    /** Flash write is inhibited. */
    FLASH_WRITE_INHIBITED = 59,
    /** Flash verification failed. */
    FLASH_VERIFY_FAILED = 60,
    /** Flash programming failed. */
    FLASH_PROGRAM_FAILED = 61,
    /** Flash erase failed. */
    FLASH_ERASE_FAILED = 62,
    /** MAC no data. */
    MAC_NO_DATA = 63,
    /** MAC no ACK received. */
    MAC_NO_ACK_RECEIVED = 64,
    /** MAC indirect timeout. */
    MAC_INDIRECT_TIMEOUT = 65,
    /** MAC unknown header type. */
    MAC_UNKNOWN_HEADER_TYPE = 66,
    /** MAC ACK unknown header type. */
    MAC_ACK_HEADER_TYPE = 67,
    /** MAC command transmit failure. */
    MAC_COMMAND_TRANSMIT_FAILURE = 68,
    /** Error in open NVM */
    CLI_STORAGE_NVM_OPEN_ERROR = 69,
    /** Image checksum is not valid. */
    SECURITY_IMAGE_CHECKSUM_ERROR = 70,
    /** Decryption failed */
    SECURITY_DECRYPT_ERROR = 71,
    /** Command was not recognized */
    COMMAND_IS_INVALID = 72,
    /** Command or parameter maximum length exceeded */
    COMMAND_TOO_LONG = 73,
    /** Data received does not form a complete command */
    COMMAND_INCOMPLETE = 74,
    /** Bus error, e.g. invalid DMA address */
    BUS_ERROR = 75,
    /** CCA failure. */
    CCA_FAILURE = 76,
    /** MAC scanning. */
    MAC_SCANNING = 77,
    /** MAC incorrect scan type. */
    MAC_INCORRECT_SCAN_TYPE = 78,
    /** Invalid channel mask. */
    INVALID_CHANNEL_MASK = 79,
    /** Bad scan duration. */
    BAD_SCAN_DURATION = 80,
    /** The MAC transmit queue is full */
    MAC_TRANSMIT_QUEUE_FULL = 83,
    /**
     * The transmit attempt failed because the radio scheduler could not find a slot to transmit this packet in or
     * a higher priority event interrupted it
     */
    TRANSMIT_SCHEDULER_FAIL = 84,
    /** An unsupported channel setting was specified */
    TRANSMIT_INVALID_CHANNEL = 85,
    /** An unsupported power setting was specified */
    TRANSMIT_INVALID_POWER = 86,
    /** The expected ACK was received after the last transmission */
    TRANSMIT_ACK_RECEIVED = 87,
    /**
     * The transmit attempt was blocked from going over the air.
     * Typically this is due to the Radio Hold Off (RHO) or Coexistence plugins as they can prevent transmits based on external signals.
     */
    TRANSMIT_BLOCKED = 88,
    /** The initialization was aborted as the NVM3 instance is not aligned properly in memory */
    NVM3_ALIGNMENT_INVALID = 89,
    /** The initialization was aborted as the size of the NVM3 instance is too small */
    NVM3_SIZE_TOO_SMALL = 90,
    /** The initialization was aborted as the NVM3 page size is not supported */
    NVM3_PAGE_SIZE_NOT_SUPPORTED = 91,
    /** The application that there was an error initializing some of the tokens */
    NVM3_TOKEN_INIT_FAILED = 92,
    /** The initialization was aborted as the NVM3 instance was already opened with other parameters */
    NVM3_OPENED_WITH_OTHER_PARAMETERS = 93,
    /** Critical fault */
    COMPUTE_DRIVER_FAULT = 5377,
    /** ALU operation output NaN */
    COMPUTE_DRIVER_ALU_NAN = 5378,
    /** ALU numeric overflow */
    COMPUTE_DRIVER_ALU_OVERFLOW = 5379,
    /** ALU numeric underflow */
    COMPUTE_DRIVER_ALU_UNDERFLOW = 5380,
    /** Overflow during array store */
    COMPUTE_DRIVER_STORE_CONVERSION_OVERFLOW = 5381,
    /** Underflow during array store conversion */
    COMPUTE_DRIVER_STORE_CONVERSION_UNDERFLOW = 5382,
    /** Infinity encountered during array store conversion */
    COMPUTE_DRIVER_STORE_CONVERSION_INFINITY = 5383,
    /** NaN encountered during array store conversion */
    COMPUTE_DRIVER_STORE_CONVERSION_NAN = 5384,
    /** MATH NaN encountered */
    COMPUTE_MATH_NAN = 5394,
    /** MATH Infinity encountered */
    COMPUTE_MATH_INFINITY = 5395,
    /** MATH numeric overflow */
    COMPUTE_MATH_OVERFLOW = 5396,
    /** MATH numeric underflow */
    COMPUTE_MATH_UNDERFLOW = 5397,
    /** Packet is dropped by packet-handoff callbacks */
    ZIGBEE_PACKET_HANDOFF_DROPPED = 3073,
    /** The APS layer attempted to send or deliver a message and failed */
    ZIGBEE_DELIVERY_FAILED = 3074,
    /** The maximum number of in-flight messages ::EMBER_APS_UNICAST_MESSAGE_COUNT has been reached */
    ZIGBEE_MAX_MESSAGE_LIMIT_REACHED = 3075,
    /** The application is trying to delete or overwrite a binding that is in use */
    ZIGBEE_BINDING_IS_ACTIVE = 3076,
    /** The application is trying to overwrite an address table entry that is in use */
    ZIGBEE_ADDRESS_TABLE_ENTRY_IS_ACTIVE = 3077,
    /** After moving, a mobile node's attempt to re-establish contact with the network failed */
    ZIGBEE_MOVE_FAILED = 3078,
    /** The local node ID has changed. The application can get the new node ID by calling ::sl_zigbee_get_node_id() */
    ZIGBEE_NODE_ID_CHANGED = 3079,
    /** The chosen security level is not supported by the stack */
    ZIGBEE_INVALID_SECURITY_LEVEL = 3080,
    /** An error occurred when trying to encrypt at the APS Level */
    ZIGBEE_IEEE_ADDRESS_DISCOVERY_IN_PROGRESS = 3081,
    /** An error occurred when trying to encrypt at the APS Level */
    ZIGBEE_APS_ENCRYPTION_ERROR = 3082,
    /** There was an attempt to form or join a network with security without calling ::sl_zigbee_set_initial_security_state() first */
    ZIGBEE_SECURITY_STATE_NOT_SET = 3083,
    /**
     * There was an attempt to broadcast a key switch too quickly after broadcasting the next network key.
     * The Trust Center must wait at least a period equal to the broadcast timeout so that all routers have a chance
     * to receive the broadcast of the new network key
     */
    ZIGBEE_TOO_SOON_FOR_SWITCH_KEY = 3084,
    /** The received signature corresponding to the message that was passed to the CBKE Library failed verification and is not valid */
    ZIGBEE_SIGNATURE_VERIFY_FAILURE = 3085,
    /** The message could not be sent because the link key corresponding to the destination is not authorized for use in APS data messages */
    ZIGBEE_KEY_NOT_AUTHORIZED = 3086,
    /** The application tried to use a binding that has been remotely modified and the change has not yet been reported to the application */
    ZIGBEE_BINDING_HAS_CHANGED = 3087,
    /** The EUI of the Trust center has changed due to a successful rejoin after TC Swapout */
    ZIGBEE_TRUST_CENTER_SWAP_EUI_HAS_CHANGED = 3088,
    /** A Trust Center Swapout Rejoin has occurred without the EUI of the TC changing */
    ZIGBEE_TRUST_CENTER_SWAP_EUI_HAS_NOT_CHANGED = 3089,
    /** An attempt to generate random bytes failed because of insufficient random data from the radio */
    ZIGBEE_INSUFFICIENT_RANDOM_DATA = 3090,
    /** A Zigbee route error command frame was received indicating that a source routed message from this node failed en route */
    ZIGBEE_SOURCE_ROUTE_FAILURE = 3091,
    /** A Zigbee route error command frame was received indicating that a message sent to this node along a many-to-one route failed en route */
    ZIGBEE_MANY_TO_ONE_ROUTE_FAILURE = 3092,
    /** A critical and fatal error indicating that the version of the stack trying to run does not match with the chip it's running on */
    ZIGBEE_STACK_AND_HARDWARE_MISMATCH = 3093,
    /** The local PAN ID has changed. The application can get the new PAN ID by calling ::emberGetPanId() */
    ZIGBEE_PAN_ID_CHANGED = 3094,
    /** The channel has changed. */
    ZIGBEE_CHANNEL_CHANGED = 3095,
    /** The network has been opened for joining. */
    ZIGBEE_NETWORK_OPENED = 3096,
    /** The network has been closed for joining. */
    ZIGBEE_NETWORK_CLOSED = 3097,
    /**
     * An attempt was made to join a Secured Network using a pre-configured key, but the Trust Center sent back a
     * Network Key in-the-clear when an encrypted Network Key was required. (::EMBER_REQUIRE_ENCRYPTED_KEY)
     */
    ZIGBEE_RECEIVED_KEY_IN_THE_CLEAR = 3098,
    /** An attempt was made to join a Secured Network, but the device did not receive a Network Key. */
    ZIGBEE_NO_NETWORK_KEY_RECEIVED = 3099,
    /** After a device joined a Secured Network, a Link Key was requested (::EMBER_GET_LINK_KEY_WHEN_JOINING) but no response was ever received. */
    ZIGBEE_NO_LINK_KEY_RECEIVED = 3100,
    /**
     * An attempt was made to join a Secured Network without a pre-configured key, but the Trust Center sent encrypted data using a
     * pre-configured key.
     */
    ZIGBEE_PRECONFIGURED_KEY_REQUIRED = 3101,
    /** A Zigbee EZSP error has occured. Track the origin and corresponding EzspStatus for more info. */
    ZIGBEE_EZSP_ERROR = 3102,
    /** Node ID discovery failed. */
    ZIGBEE_ID_DISCOVERY_FAILED = 3103,
    /** Message was sent but no APS ACK received. */
    ZIGBEE_NO_APS_ACK = 3104,
    /** APS message was canceled. */
    ZIGBEE_APS_MESSAGE_CANCELED = 3105,
    /** Node ID discovery not enabled. */
    ZIGBEE_ID_DISCOVERY_NOT_ENABLED = 3106,
    /** Message was not sent, Node ID discovery is underway. */
    ZIGBEE_ID_DISCOVERY_UNDERWAY = 3107,
    /** The message was not sent because a route discovery is currently underway. There is no route to the target until the route discovery completes. */
    ZIGBEE_SEND_UNICAST_ROUTE_DISCOVERY_UNDERWAY = 3108,
    /** Radius is 0 or message has been dropped because route request failed or failed to submit message to tx queue. */
    ZIGBEE_SEND_UNICAST_FAILURE = 3109,
    /** No active route to the destination. */
    ZIGBEE_SEND_UNICAST_NO_ROUTE = 3110,
    /** Broadcast message timeout while waiting for sleepy children to poll. */
    ZIGBEE_BROADCAST_TO_SLEEPY_CHILDREN_TIMEOUT = 3111,
    /** Expected a neighbor to relay the message, but none did. */
    ZIGBEE_BROADCAST_RELAY_FAILED = 3112
}
/** Status values used by EZSP. */
export declare enum EzspStatus {
    /** Success. */
    SUCCESS = 0,
    /** Fatal error. */
    SPI_ERR_FATAL = 16,
    /** The Response frame of the current transaction indicates the NCP has reset. */
    SPI_ERR_NCP_RESET = 17,
    /** The NCP is reporting that the Command frame of the current transaction is oversized (the length byte is too large). */
    SPI_ERR_OVERSIZED_EZSP_FRAME = 18,
    /** The Response frame of the current transaction indicates the previous transaction was aborted (nSSEL deasserted too soon). */
    SPI_ERR_ABORTED_TRANSACTION = 19,
    /** The Response frame of the current transaction indicates the frame terminator is missing from the Command frame. */
    SPI_ERR_MISSING_FRAME_TERMINATOR = 20,
    /** The NCP has not provided a Response within the time limit defined by WAIT_SECTION_TIMEOUT. */
    SPI_ERR_WAIT_SECTION_TIMEOUT = 21,
    /** The Response frame from the NCP is missing the frame terminator. */
    SPI_ERR_NO_FRAME_TERMINATOR = 22,
    /** The Host attempted to send an oversized Command (the length byte is too large) and the AVR's spi-protocol.c blocked the transmission. */
    SPI_ERR_EZSP_COMMAND_OVERSIZED = 23,
    /** The NCP attempted to send an oversized Response (the length byte is too large) and the AVR's spi-protocol.c blocked the reception. */
    SPI_ERR_EZSP_RESPONSE_OVERSIZED = 24,
    /** The Host has sent the Command and is still waiting for the NCP to send a Response. */
    SPI_WAITING_FOR_RESPONSE = 25,
    /** The NCP has not asserted nHOST_INT within the time limit defined by WAKE_HANDSHAKE_TIMEOUT. */
    SPI_ERR_HANDSHAKE_TIMEOUT = 26,
    /** The NCP has not asserted nHOST_INT after an NCP reset within the time limit defined by STARTUP_TIMEOUT. */
    SPI_ERR_STARTUP_TIMEOUT = 27,
    /** The Host attempted to verify the SPI Protocol activity and version number, and the verification failed. */
    SPI_ERR_STARTUP_FAIL = 28,
    /** The Host has sent a command with a SPI Byte that is unsupported by the current mode the NCP is operating in. */
    SPI_ERR_UNSUPPORTED_SPI_COMMAND = 29,
    /** Operation not yet complete. */
    ASH_IN_PROGRESS = 32,
    /** Fatal error detected by host. */
    HOST_FATAL_ERROR = 33,
    /** Fatal error detected by NCP. */
    ASH_NCP_FATAL_ERROR = 34,
    /** Tried to send DATA frame too long. */
    DATA_FRAME_TOO_LONG = 35,
    /** Tried to send DATA frame too short. */
    DATA_FRAME_TOO_SHORT = 36,
    /** No space for tx'ed DATA frame. */
    NO_TX_SPACE = 37,
    /** No space for rec'd DATA frame. */
    NO_RX_SPACE = 38,
    /** No receive data available. */
    NO_RX_DATA = 39,
    /** Not in Connected state. */
    NOT_CONNECTED = 40,
    /** The NCP received a command before the EZSP version had been set. */
    ERROR_VERSION_NOT_SET = 48,
    /** The NCP received a command containing an unsupported frame ID. */
    ERROR_INVALID_FRAME_ID = 49,
    /** The direction flag in the frame control field was incorrect. */
    ERROR_WRONG_DIRECTION = 50,
    /**
     * The truncated flag in the frame control field was set, indicating there was not enough memory available to
     * complete the response or that the response would have exceeded the maximum EZSP frame length.
     */
    ERROR_TRUNCATED = 51,
    /**
     * The overflow flag in the frame control field was set, indicating one or more callbacks occurred since the previous
     * response and there was not enough memory available to report them to the Host.
     */
    ERROR_OVERFLOW = 52,
    /** Insufficient memory was available. */
    ERROR_OUT_OF_MEMORY = 53,
    /** The value was out of bounds. */
    ERROR_INVALID_VALUE = 54,
    /** The configuration id was not recognized. */
    ERROR_INVALID_ID = 55,
    /** Configuration values can no longer be modified. */
    ERROR_INVALID_CALL = 56,
    /** The NCP failed to respond to a command. */
    ERROR_NO_RESPONSE = 57,
    /** The length of the command exceeded the maximum EZSP frame length. */
    ERROR_COMMAND_TOO_LONG = 64,
    /** The UART receive queue was full causing a callback response to be dropped. */
    ERROR_QUEUE_FULL = 65,
    /** The command has been filtered out by NCP. */
    ERROR_COMMAND_FILTERED = 66,
    /** EZSP Security Key is already set */
    ERROR_SECURITY_KEY_ALREADY_SET = 67,
    /** EZSP Security Type is invalid */
    ERROR_SECURITY_TYPE_INVALID = 68,
    /** EZSP Security Parameters are invalid */
    ERROR_SECURITY_PARAMETERS_INVALID = 69,
    /** EZSP Security Parameters are already set */
    ERROR_SECURITY_PARAMETERS_ALREADY_SET = 70,
    /** EZSP Security Key is not set */
    ERROR_SECURITY_KEY_NOT_SET = 71,
    /** EZSP Security Parameters are not set */
    ERROR_SECURITY_PARAMETERS_NOT_SET = 72,
    /** Received frame with unsupported control byte */
    ERROR_UNSUPPORTED_CONTROL = 73,
    /** Received frame is unsecure, when security is established */
    ERROR_UNSECURE_FRAME = 74,
    /** Incompatible ASH version */
    ASH_ERROR_VERSION = 80,
    /** Exceeded max ACK timeouts */
    ASH_ERROR_TIMEOUTS = 81,
    /** Timed out waiting for RSTACK */
    ASH_ERROR_RESET_FAIL = 82,
    /** Unexpected ncp reset */
    ASH_ERROR_NCP_RESET = 83,
    /** Serial port initialization failed */
    ERROR_SERIAL_INIT = 84,
    /** Invalid ncp processor type */
    ASH_ERROR_NCP_TYPE = 85,
    /** Invalid ncp reset method */
    ASH_ERROR_RESET_METHOD = 86,
    /** XON/XOFF not supported by host driver */
    ASH_ERROR_XON_XOFF = 87,
    /** ASH protocol started */
    ASH_STARTED = 112,
    /** ASH protocol connected */
    ASH_CONNECTED = 113,
    /** ASH protocol disconnected */
    ASH_DISCONNECTED = 114,
    /** Timer expired waiting for ack */
    ASH_ACK_TIMEOUT = 115,
    /** Frame in progress cancelled */
    ASH_CANCELLED = 116,
    /** Received frame out of sequence */
    ASH_OUT_OF_SEQUENCE = 117,
    /** Received frame with CRC error */
    ASH_BAD_CRC = 118,
    /** Received frame with comm error */
    ASH_COMM_ERROR = 119,
    /** Received frame with bad ackNum */
    ASH_BAD_ACKNUM = 120,
    /** Received frame shorter than minimum */
    ASH_TOO_SHORT = 121,
    /** Received frame longer than maximum */
    ASH_TOO_LONG = 122,
    /** Received frame with illegal control byte */
    ASH_BAD_CONTROL = 123,
    /** Received frame with illegal length for its type */
    ASH_BAD_LENGTH = 124,
    /** Received ASH Ack */
    ASH_ACK_RECEIVED = 125,
    /** Sent ASH Ack */
    ASH_ACK_SENT = 126,
    /** Received ASH Nak */
    ASH_NAK_RECEIVED = 127,
    /** Sent ASH Nak */
    ASH_NAK_SENT = 128,
    /** Received ASH RST */
    ASH_RST_RECEIVED = 129,
    /** Sent ASH RST */
    ASH_RST_SENT = 130,
    /** ASH Status */
    ASH_STATUS = 131,
    /** ASH TX */
    ASH_TX = 132,
    /** ASH RX */
    ASH_RX = 133,
    /** Failed to connect to CPC daemon or failed to open CPC endpoint */
    CPC_ERROR_INIT = 134,
    /** No reset or error */
    NO_ERROR = 255
}
export declare enum EmberStackError {
    ROUTE_ERROR_NO_ROUTE_AVAILABLE = 0,
    ROUTE_ERROR_TREE_LINK_FAILURE = 1,
    ROUTE_ERROR_NON_TREE_LINK_FAILURE = 2,
    ROUTE_ERROR_LOW_BATTERY_LEVEL = 3,
    ROUTE_ERROR_NO_ROUTING_CAPACITY = 4,
    ROUTE_ERROR_NO_INDIRECT_CAPACITY = 5,
    ROUTE_ERROR_INDIRECT_TRANSACTION_EXPIRY = 6,
    ROUTE_ERROR_TARGET_DEVICE_UNAVAILABLE = 7,
    ROUTE_ERROR_TARGET_ADDRESS_UNALLOCATED = 8,
    ROUTE_ERROR_PARENT_LINK_FAILURE = 9,
    ROUTE_ERROR_VALIDATE_ROUTE = 10,
    ROUTE_ERROR_SOURCE_ROUTE_FAILURE = 11,
    ROUTE_ERROR_MANY_TO_ONE_ROUTE_FAILURE = 12,
    ROUTE_ERROR_ADDRESS_CONFLICT = 13,
    ROUTE_ERROR_VERIFY_ADDRESSES = 14,
    ROUTE_ERROR_PAN_IDENTIFIER_UPDATE = 15,
    NETWORK_STATUS_NETWORK_ADDRESS_UPDATE = 16,
    NETWORK_STATUS_BAD_FRAME_COUNTER = 17,
    NETWORK_STATUS_BAD_KEY_SEQUENCE_NUMBER = 18,
    NETWORK_STATUS_UNKNOWN_COMMAND = 19
}
export declare enum EmberGPStatus {
    /** Success Status */
    OK = 0,
    /** Match Frame */
    MATCH = 1,
    /** Drop Frame */
    DROP_FRAME = 2,
    /** Frame Unprocessed */
    UNPROCESSED = 3,
    /** Frame Pass Unprocessed */
    PASS_UNPROCESSED = 4,
    /** Frame TX Then Drop */
    TX_THEN_DROP = 5,
    /** No Security */
    NO_SECURITY = 6,
    /** Security Failure */
    AUTH_FAILURE = 7
}
/** Type of Ember software version */
export declare enum EmberVersionType {
    PRE_RELEASE = 0,
    ALPHA_1 = 17,
    ALPHA_2 = 18,
    ALPHA_3 = 19,
    BETA_1 = 33,
    BETA_2 = 34,
    BETA_3 = 35,
    GA = 170
}
/**
 * For emberSetTxPowerMode and mfglibSetPower.
 * uint16_t
 */
export declare enum EmberTXPowerMode {
    /**
     * The application should call ::emberSetTxPowerMode() with the
     * txPowerMode parameter set to this value to disable all power mode options,
     * resulting in normal power mode and bi-directional RF transmitter output.
     */
    DEFAULT = 0,
    /**
     * The application should call ::emberSetTxPowerMode() with the
     * txPowerMode parameter set to this value to enable boost power mode.
     */
    BOOST = 1,
    /**
     * The application should call ::emberSetTxPowerMode() with the
     * txPowerMode parameter set to this value to enable the alternate transmitter
     * output.
     */
    ALTERNATE = 2,
    /**
     * The application should call ::emberSetTxPowerMode() with the
     * txPowerMode parameter set to this value to enable both boost mode and the
     * alternate transmitter output.
     */
    BOOST_AND_ALTERNATE = 3,// (BOOST | ALTERNATE)
    USE_TOKEN = 32768
}
/** uint8_t */
export declare enum EmberKeepAliveMode {
    KEEP_ALIVE_SUPPORT_UNKNOWN = 0,
    MAC_DATA_POLL_KEEP_ALIVE = 1,
    END_DEVICE_TIMEOUT_KEEP_ALIVE = 2,
    KEEP_ALIVE_SUPPORT_ALL = 3
}
/** This is the Extended Security Bitmask that controls the use of various extended security features. */
export declare enum EmberExtendedSecurityBitmask {
    /**
     * If this bit is set, the 'key token data' field is set in the Initial Security Bitmask to 0 (No Preconfig Key token).
     * Otherwise, the field is left as is.
     */
    PRECONFIG_KEY_NOT_VALID = 1,
    /**
     * This denotes that the network key update can only happen if the network key update request is unicast and encrypted
     * i.e. broadcast network key update requests will not be processed if bit 1 is set
     */
    SECURE_NETWORK_KEY_ROTATION = 2,
    /** This denotes whether a joiner node (router or end-device) uses a Global Link Key or a Unique Link Key. */
    JOINER_GLOBAL_LINK_KEY = 16,
    /**
     * This denotes whether the device's outgoing frame counter is allowed to be reset during forming or joining.
     * If the flag is set, the outgoing frame counter is not allowed to be reset.
     * If the flag is not set, the frame counter is allowed to be reset.
     */
    EXT_NO_FRAME_COUNTER_RESET = 32,
    /** This denotes whether a device should discard or accept network leave without rejoin commands. */
    NWK_LEAVE_WITHOUT_REJOIN_NOT_ALLOWED = 64,
    /** This denotes whether a router node should discard or accept network Leave Commands. */
    NWK_LEAVE_REQUEST_NOT_ALLOWED = 256,
    /**
     * This denotes whether a node is running the latest stack specification or is emulating R18 specs behavior.
     * If this flag is enabled, a router node should only send encrypted Update Device messages while the TC
     * should only accept encrypted Updated Device messages.
     */
    R18_STACK_BEHAVIOR = 512,
    ZDO_LEAVE_FROM_NON_PARENT_NOT_ALLOWED = 4096
}
/** This is the Initial Security Bitmask that controls the use of various security features. */
export declare enum EmberInitialSecurityBitmask {
    /** Enables Distributed Trust Center Mode for the device forming the network. (Previously known as ::EMBER_NO_TRUST_CENTER_MODE) */
    DISTRIBUTED_TRUST_CENTER_MODE = 2,
    /** Enables a Global Link Key for the Trust Center. All nodes will share the same Trust Center Link Key. */
    TRUST_CENTER_GLOBAL_LINK_KEY = 4,
    /** Enables devices that perform MAC Association with a pre-configured Network Key to join the network. It is only set on the Trust Center. */
    PRECONFIGURED_NETWORK_KEY_MODE = 8,
    HAVE_TRUST_CENTER_UNKNOWN_KEY_TOKEN = 16,
    HAVE_TRUST_CENTER_LINK_KEY_TOKEN = 32,
    /**
     * This denotes that the ::EmberInitialSecurityState::preconfiguredTrustCenterEui64 has a value in it containing the trust center EUI64.
     * The device will only join a network and accept commands from a trust center with that EUI64.
     * Normally this bit is NOT set and the EUI64 of the trust center is learned during the join process.
     * When commissioning a device to join onto an existing network that is using a trust center and without sending any messages,
     * this bit must be set and the field ::EmberInitialSecurityState::preconfiguredTrustCenterEui64 must be populated with the appropriate EUI64.
     */
    HAVE_TRUST_CENTER_EUI64 = 64,
    /**
     * This denotes that the ::EmberInitialSecurityState::preconfiguredKey is not the actual Link Key but a Root Key known only to the Trust Center.
     * It is hashed with the IEEE Address of the destination device to create the actual Link Key used in encryption.
     * This is bit is only used by the Trust Center. The joining device need not set this.
     */
    TRUST_CENTER_USES_HASHED_LINK_KEY = 132,
    /**
     * This denotes that the ::EmberInitialSecurityState::preconfiguredKey element has valid data that should be used to configure
     * the initial security state.
     */
    HAVE_PRECONFIGURED_KEY = 256,
    /**
     * This denotes that the ::EmberInitialSecurityState::networkKey element has valid data that should be used to configure
     * the initial security state.
     */
    HAVE_NETWORK_KEY = 512,
    /**
     * This denotes to a joining node that it should attempt to acquire a Trust Center Link Key during joining.
     * This is necessary if the device does not have a pre-configured key, or wants to obtain a new one
     * (since it may be using a well-known key during joining).
     */
    GET_LINK_KEY_WHEN_JOINING = 1024,
    /**
     * This denotes that a joining device should only accept an encrypted network key from the Trust Center (using its pre-configured key).
     * A key sent in-the-clear by the Trust Center will be rejected and the join will fail.
     * This option is only valid when using a pre-configured key.
     */
    REQUIRE_ENCRYPTED_KEY = 2048,
    /**
     * This denotes whether the device should NOT reset its outgoing frame counters (both NWK and APS) when
     * ::emberSetInitialSecurityState() is called.
     * Normally it is advised to reset the frame counter before joining a new network.
     * However, when a device is joining to the same network again (but not using ::emberRejoinNetwork()),
     * it should keep the NWK and APS frame counters stored in its tokens.
     *
     * NOTE: The application is allowed to dynamically change the behavior via EMBER_EXT_NO_FRAME_COUNTER_RESET field.
     */
    NO_FRAME_COUNTER_RESET = 4096,
    /**
     * This denotes that the device should obtain its pre-configured key from an installation code stored in the manufacturing token.
     * The token contains a value that will be hashed to obtain the actual pre-configured key.
     * If that token is not valid, the call to ::emberSetInitialSecurityState() will fail.
     */
    GET_PRECONFIGURED_KEY_FROM_INSTALL_CODE = 8192,
    EM_SAVED_IN_TOKEN = 16384
}
/** Either marks an event as inactive or specifies the units for the event execution time. uint8_t */
export declare enum EmberEventUnits {
    /** The event is not scheduled to run. */
    INACTIVE = 0,
    /** The execution time is in approximate milliseconds.  */
    MS_TIME = 1,
    /** The execution time is in 'binary' quarter seconds (256 approximate milliseconds each). */
    QS_TIME = 2,
    /** The execution time is in 'binary' minutes (65536 approximate milliseconds each). */
    MINUTE_TIME = 3,
    /** The event is scheduled to run at the earliest opportunity. */
    ZERO_DELAY = 4
}
/**
 * Defines the events reported to the application by the ::emberCounterHandler().
 * Usage of the destinationNodeId or data fields found in the EmberCounterInfo or EmberExtraCounterInfo
 * structs is denoted for counter types that use them.
 * (See comments accompanying enum definitions in this source file for details.)
 */
export declare enum EmberCounterType {
    /**
     * The MAC received a broadcast Data frame, Command frame, or Beacon.
     * - destinationNodeId: BROADCAST_ADDRESS or Data frames or sender node ID for Beacon frames
     * - data: not used
     */
    MAC_RX_BROADCAST = 0,
    /**
     * The MAC transmitted a broadcast Data frame, Command frame or Beacon.
     * - destinationNodeId: BROADCAST_ADDRESS
     * - data: not used
     */
    MAC_TX_BROADCAST = 1,
    /**
     * The MAC received a unicast Data or Command frame.
     * - destinationNodeId: MAC layer source or EMBER_UNKNOWN_NODE_ID if no 16-bit source node ID is present in the frame
     * - data: not used
     */
    MAC_RX_UNICAST = 2,
    /**
     * The MAC successfully transmitted a unicast Data or Command frame.
     *   Note: Only frames with a 16-bit destination node ID are counted.
     * - destinationNodeId: MAC layer destination address
     * - data: not used
     */
    MAC_TX_UNICAST_SUCCESS = 3,
    /**
     * The MAC retried a unicast Data or Command frame after initial Tx attempt.
     *   Note: CSMA-related failures are tracked separately via PHY_CCA_FAIL_COUNT.
     * - destinationNodeId: MAC layer destination or EMBER_UNKNOWN_NODE_ID if no 16-bit destination node ID is present in the frame
     * - data: number of retries (after initial Tx attempt) accumulated so far for this packet. (Should always be >0.)
     */
    MAC_TX_UNICAST_RETRY = 4,
    /**
     * The MAC unsuccessfully transmitted a unicast Data or Command frame.
     *   Note: Only frames with a 16-bit destination node ID are counted.
     * - destinationNodeId: MAC layer destination address
     * - data: not used
     */
    MAC_TX_UNICAST_FAILED = 5,
    /**
     * The APS layer received a data broadcast.
     * - destinationNodeId: sender's node ID
     * - data: not used
     */
    APS_DATA_RX_BROADCAST = 6,
    /** The APS layer transmitted a data broadcast. */
    APS_DATA_TX_BROADCAST = 7,
    /**
     * The APS layer received a data unicast.
     * - destinationNodeId: sender's node ID
     * - data: not used
     */
    APS_DATA_RX_UNICAST = 8,
    /**
     * The APS layer successfully transmitted a data unicast.
     * - destinationNodeId: NWK destination address
     * - data: number of APS retries (>=0) consumed for this unicast.
     */
    APS_DATA_TX_UNICAST_SUCCESS = 9,
    /**
     * The APS layer retried a unicast Data frame.
     * This is a placeholder and is not used by the @c ::emberCounterHandler() callback.
     * Instead, the number of APS retries are returned in the data parameter of the callback
     * for the @c ::APS_DATA_TX_UNICAST_SUCCESS and @c ::APS_DATA_TX_UNICAST_FAILED types.
     * However, our supplied Counters component code will attempt to collect this information
     * from the aforementioned counters and populate this counter.
     * Note that this counter's behavior differs from that of @c ::MAC_TX_UNICAST_RETRY .
     */
    APS_DATA_TX_UNICAST_RETRY = 10,
    /**
     * The APS layer unsuccessfully transmitted a data unicast.
     * - destinationNodeId: NWK destination address
     * - data: number of APS retries (>=0) consumed for this unicast.
     */
    APS_DATA_TX_UNICAST_FAILED = 11,
    /** The network layer successfully submitted a new route discovery to the MAC. */
    ROUTE_DISCOVERY_INITIATED = 12,
    /** An entry was added to the neighbor table. */
    NEIGHBOR_ADDED = 13,
    /** An entry was removed from the neighbor table. */
    NEIGHBOR_REMOVED = 14,
    /** A neighbor table entry became stale because it had not been heard from. */
    NEIGHBOR_STALE = 15,
    /**
     * A node joined or rejoined to the network via this node.
     * - destinationNodeId: node ID of child
     * - data: not used
     */
    JOIN_INDICATION = 16,
    /**
     * An entry was removed from the child table.
     * - destinationNodeId: node ID of child
     * - data: not used
     */
    CHILD_REMOVED = 17,
    /** EZSP-UART only. An overflow error occurred in the UART. */
    ASH_OVERFLOW_ERROR = 18,
    /** EZSP-UART only. A framing error occurred in the UART. */
    ASH_FRAMING_ERROR = 19,
    /** EZSP-UART only. An overrun error occurred in the UART. */
    ASH_OVERRUN_ERROR = 20,
    /** A message was dropped at the Network layer because the NWK frame counter was not higher than the last message seen from that source. */
    NWK_FRAME_COUNTER_FAILURE = 21,
    /**
     * A message was dropped at the APS layer because the APS frame counter was not higher than the last message seen from that source.
     * - destinationNodeId: node ID of MAC source that relayed the message
     * - data: not used
     */
    APS_FRAME_COUNTER_FAILURE = 22,
    /** EZSP-UART only. An XOFF was transmitted by the UART. */
    ASH_XOFF = 23,
    /**
     * An encrypted message was dropped by the APS layer because the sender's key has not been authenticated.
     * As a result, the key is not authorized for use in APS data messages.
     * - destinationNodeId: EMBER_NULL_NODE_ID
     * - data: APS key table index related to the sender
     */
    APS_LINK_KEY_NOT_AUTHORIZED = 24,
    /**
     * A NWK encrypted message was received but dropped because decryption failed.
     * - destinationNodeId: sender of the dropped packet
     * - data: not used
     */
    NWK_DECRYPTION_FAILURE = 25,
    /**
     * An APS encrypted message was received but dropped because decryption failed.
     * - destinationNodeId: sender of the dropped packet
     * - data: not used
     */
    APS_DECRYPTION_FAILURE = 26,
    /**
     * The number of failures to allocate a set of linked packet buffers.
     * This doesn't necessarily mean that the packet buffer count was 0 at the time,
     * but that the number requested was greater than the number free.
     */
    ALLOCATE_PACKET_BUFFER_FAILURE = 27,
    /**
     * The number of relayed unicast packets.
     * - destinationId: NWK layer destination address of relayed packet
     * - data: not used
     */
    RELAYED_UNICAST = 28,
    /**
     * The number of times a packet was dropped due to reaching the preset PHY-to-MAC queue limit (sli_mac_phy_to_mac_queue_length).
     * The limit will determine how many messages are accepted by the PHY between calls to emberTick().
     * After that limit is reached, packets will be dropped. The counter records the number of dropped packets.
     *
     * NOTE: For each call to emberCounterHandler() there may be more than 1 packet that was dropped due to the limit reached.
     * The actual number of packets dropped will be returned in the 'data' parameter passed to that function.
     *
     * - destinationNodeId: not used
     * - data: number of dropped packets represented by this counter event
     * - phyIndex: present
     */
    PHY_TO_MAC_QUEUE_LIMIT_REACHED = 29,
    /**
     * The number of times a packet was dropped due to the packet-validate library checking a packet
     * and rejecting it due to length or other formatting problems.
     * - destinationNodeId: not used
     * - data: type of validation condition that failed
     */
    PACKET_VALIDATE_LIBRARY_DROPPED_COUNT = 30,
    /**
     * The number of times the NWK retry queue is full and a new message failed to be added.
     * - destinationNodeId; not used
     * - data: NWK retry queue size that has been exceeded
     */
    TYPE_NWK_RETRY_OVERFLOW = 31,
    /**
     * The number of times the PHY layer was unable to transmit due to a failed CCA (Clear Channel Assessment) attempt.
     * See also: MAC_TX_UNICAST_RETRY.
     * - destinationNodeId: MAC layer destination or EMBER_UNKNOWN_NODE_ID if no 16-bit destination node ID is present in the frame
     * - data: not used
     */
    PHY_CCA_FAIL_COUNT = 32,
    /** The number of times a NWK broadcast was dropped because the broadcast table was full. */
    BROADCAST_TABLE_FULL = 33,
    /** The number of times a low-priority packet traffic arbitration request has been made. */
    PTA_LO_PRI_REQUESTED = 34,
    /** The number of times a high-priority packet traffic arbitration request has been made. */
    PTA_HI_PRI_REQUESTED = 35,
    /** The number of times a low-priority packet traffic arbitration request has been denied. */
    PTA_LO_PRI_DENIED = 36,
    /** The number of times a high-priority packet traffic arbitration request has been denied. */
    PTA_HI_PRI_DENIED = 37,
    /** The number of times a low-priority packet traffic arbitration transmission has been aborted. */
    PTA_LO_PRI_TX_ABORTED = 38,
    /** The number of times a high-priority packet traffic arbitration transmission has been aborted. */
    PTA_HI_PRI_TX_ABORTED = 39,
    /** The number of times an address conflict has caused node_id change, and an address conflict error is sent. */
    ADDRESS_CONFLICT_SENT = 40,
    /** The number of times CSL failed to schedule Rx on target */
    CSL_RX_SCHEDULE_FAILED = 41,
    /** A placeholder giving the number of Ember counter types. */
    COUNT = 42
}
/** An enumerated list of library identifiers. */
export declare enum EmberLibraryId {
    FIRST = 0,
    ZIGBEE_PRO = 0,
    BINDING = 1,
    END_DEVICE_BIND = 2,
    SECURITY_CORE = 3,
    SECURITY_LINK_KEYS = 4,
    ALARM = 5,
    CBKE = 6,
    CBKE_DSA_SIGN = 7,
    ECC = 8,
    CBKE_DSA_VERIFY = 9,
    PACKET_VALIDATE = 10,
    INSTALL_CODE = 11,
    ZLL = 12,
    CBKE_283K1 = 13,
    ECC_283K1 = 14,
    CBKE_CORE = 15,
    NCP = 16,
    MULTI_NETWORK = 17,
    ENHANCED_BEACON_REQUEST = 18,
    CBKE_283K1_DSA_VERIFY = 19,
    MULTI_PAN = 20,
    NUMBER_OF_LIBRARIES = 21,
    NULL = 255
}
/** This indicates the presence, absence, or status of an Ember stack library. */
export declare enum EmberLibraryStatus {
    LIBRARY_PRESENT_MASK = 128,
    LIBRARY_IS_STUB = 0,
    LIBRARY_ERROR = 255,
    /** no router capability */
    ZIGBEE_PRO_LIBRARY_END_DEVICE_ONLY = 0,
    ZIGBEE_PRO_LIBRARY_HAVE_ROUTER_CAPABILITY = 1,
    ZIGBEE_PRO_LIBRARY_ZLL_SUPPORT = 2,
    SECURITY_LIBRARY_END_DEVICE_ONLY = 0,
    /** router or trust center support */
    SECURITY_LIBRARY_HAVE_ROUTER_SUPPORT = 1,
    PACKET_VALIDATE_LIBRARY_DISABLED = 0,
    PACKET_VALIDATE_LIBRARY_ENABLED = 1,
    PACKET_VALIDATE_LIBRARY_ENABLE_MASK = 1
}
/** Defines the entropy source used by the stack. */
export declare enum EmberEntropySource {
    /** Error in identifying the entropy source. */
    ERROR = 0,
    /** The default radio entropy source. */
    RADIO = 1,
    /** TRNG with mbed TLS support. */
    MBEDTLS_TRNG = 2,
    /** Other mbed TLS entropy source. */
    MBEDTLS = 3
}
/** Defines the options that should be used when initializing the node's network configuration. */
export declare enum EmberNetworkInitBitmask {
    NO_OPTIONS = 0,
    /** The Parent Node ID and EUI64 are stored in a token. This prevents the need to perform an Orphan scan on startup. */
    PARENT_INFO_IN_TOKEN = 1,
    /** Z3 compliant end devices on a network must send a rejoin request on reboot. */
    END_DEVICE_REJOIN_ON_REBOOT = 2
}
/** Defines the possible join states for a node. uint8_t */
export declare enum EmberNetworkStatus {
    /** The node is not associated with a network in any way. */
    NO_NETWORK = 0,
    /** The node is currently attempting to join a network. */
    JOINING_NETWORK = 1,
    /** The node is joined to a network. */
    JOINED_NETWORK = 2,
    /** The node is an end device joined to a network but its parent is not responding. */
    JOINED_NETWORK_NO_PARENT = 3,
    /** The node is a Sleepy-to-Sleepy initiator */
    JOINED_NETWORK_S2S_INITIATOR = 4,
    /** The node is a Sleepy-to-Sleepy target */
    JOINED_NETWORK_S2S_TARGET = 5,
    /** The node is in the process of leaving its current network. */
    LEAVING_NETWORK = 6
}
/** Network scan types. */
export declare enum EzspNetworkScanType {
    /** An energy scan scans each channel for its RSSI value. */
    ENERGY_SCAN = 0,
    /** An active scan scans each channel for available networks. */
    ACTIVE_SCAN = 1
}
/** The type of method used for joining. uint8_t */
export declare enum EmberJoinMethod {
    /** Devices normally use MAC association to join a network, which respects
     *  the "permit joining" flag in the MAC beacon.
     *  This value should be used by default.
     */
    MAC_ASSOCIATION = 0,
    /** For networks where the "permit joining" flag is never turned
     *  on, devices will need to use a Zigbee NWK Rejoin.  This value causes the
     *  rejoin to be sent withOUT NWK security and the Trust Center will be
     *  asked to send the NWK key to the device.  The NWK key sent to the device
     *  can be encrypted with the device's corresponding Trust Center link key.
     *  That is determined by the ::EmberJoinDecision on the Trust Center
     *  returned by the ::emberTrustCenterJoinHandler().
     */
    NWK_REJOIN = 1,
    NWK_REJOIN_HAVE_NWK_KEY = 2,
    /** For networks where all network and security information is known
         ahead of time, a router device may be commissioned such that it does
        not need to send any messages to begin communicating on the network.
    */
    CONFIGURED_NWK_STATE = 3,
    /** This enumeration causes an unencrypted Network Commissioning Request to be
         sent out with joinType set to initial join. The trust center may respond
        by establishing a new dynamic link key and then sending the network key.
        Network Commissioning Requests should only be sent to parents that support
        processing of the command.
    */
    NWK_COMMISSIONING_JOIN = 4,
    /** This enumeration causes an unencrypted Network Commissioning Request to be
         sent out with joinType set to rejoin. The trust center may respond
        by establishing a new dynamic link key and then sending the network key.
        Network Commissioning Requests should only be sent to parents that support
        processing of the command.
    */
    NWK_COMMISSIONING_REJOIN = 5,
    /** This enumeration causes an encrypted Network Commissioning Request to be
         sent out with joinType set to rejoin. This enumeration is used by devices
        that already have the network key and wish to recover connection to a
        parent or the network in general.
        Network Commissioning Requests should only be sent to parents that support
        processing of the command.
    */
    NWK_COMMISSIONING_REJOIN_HAVE_NWK_KEY = 6
}
/** Defines the possible types of nodes and the roles that a node might play in a network. */
export declare enum EmberNodeType {
    /** The device is not joined. */
    UNKNOWN_DEVICE = 0,
    /** Will relay messages and can act as a parent to other nodes. */
    COORDINATOR = 1,
    /** Will relay messages and can act as a parent to other nodes. */
    ROUTER = 2,
    /** Communicates only with its parent and will not relay messages. */
    END_DEVICE = 3,
    /** An end device whose radio can be turned off to save power. The application must call ::emberPollForData() to receive messages. */
    SLEEPY_END_DEVICE = 4,
    /** Sleepy end device which transmits with wake up frames (CSL). */
    S2S_INITIATOR_DEVICE = 5,
    /** Sleepy end device which duty cycles the radio Rx (CSL). */
    S2S_TARGET_DEVICE = 6
}
/**  */
export declare enum EmberMultiPhyNwkConfig {
    ROUTERS_ALLOWED = 1,
    BROADCASTS_ENABLED = 2,
    DISABLED = 128
}
/**
 * Duty cycle states
 *
 * Applications have no control over the state but the callback exposes
 * state changes to the application.
 */
export declare enum EmberDutyCycleState {
    /** No duty cycle tracking or metrics are taking place. */
    TRACKING_OFF = 0,
    /** Duty Cycle is tracked and has not exceeded any thresholds. */
    LBT_NORMAL = 1,
    /** The limited threshold of the total duty cycle allotment was exceeded. */
    LBT_LIMITED_THRESHOLD_REACHED = 2,
    /** The critical threshold of the total duty cycle allotment was exceeded. */
    LBT_CRITICAL_THRESHOLD_REACHED = 3,
    /** The suspend limit was reached and all outbound transmissions are blocked. */
    LBT_SUSPEND_LIMIT_REACHED = 4
}
/** Defines binding types. uint8_t */
export declare enum EmberBindingType {
    /** A binding that is currently not in use. */
    UNUSED_BINDING = 0,
    /** A unicast binding whose 64-bit identifier is the destination EUI64. */
    UNICAST_BINDING = 1,
    /**
     * A unicast binding whose 64-bit identifier is the many-to-one destination EUI64.
     * Route discovery should be disabled when sending unicasts via many-to-one bindings.
     */
    MANY_TO_ONE_BINDING = 2,
    /**
     * A multicast binding whose 64-bit identifier is the group address.
     * This binding can be used to send messages to the group and to receive messages sent to the group.
     */
    MULTICAST_BINDING = 3
}
/** Defines the possible outgoing message types. uint8_t */
export declare enum EmberOutgoingMessageType {
    /** Unicast sent directly to an EmberNodeId. */
    DIRECT = 0,
    /** Unicast sent using an entry in the address table. */
    VIA_ADDRESS_TABLE = 1,
    /** Unicast sent using an entry in the binding table. */
    VIA_BINDING = 2,
    /** Multicast message. This value is passed to emberMessageSentHandler() only. It may not be passed to emberSendUnicast(). */
    MULTICAST = 3,
    /** An aliased multicast message. This value is passed to emberMessageSentHandler() only. It may not be passed to emberSendUnicast(). */
    MULTICAST_WITH_ALIAS = 4,
    /** An aliased Broadcast message. This value is passed to emberMessageSentHandler() only. It may not be passed to emberSendUnicast(). */
    BROADCAST_WITH_ALIAS = 5,
    /** A broadcast message. This value is passed to emberMessageSentHandler() only. It may not be passed to emberSendUnicast(). */
    BROADCAST = 6
}
/** Defines the possible incoming message types. uint8_t */
export declare enum EmberIncomingMessageType {
    /** Unicast. */
    UNICAST = 0,
    /** Unicast reply. */
    UNICAST_REPLY = 1,
    /** Multicast. */
    MULTICAST = 2,
    /** Multicast sent by the local device. */
    MULTICAST_LOOPBACK = 3,
    /** Broadcast. */
    BROADCAST = 4,
    /** Broadcast sent by the local device. */
    BROADCAST_LOOPBACK = 5
}
/**
 * Options to use when sending a message.
 *
 * The discover-route, APS-retry, and APS-indirect options may be used together.
 * Poll response cannot be combined with any other options.
 * uint16_t
 */
export declare enum EmberApsOption {
    /** No options. */
    NONE = 0,
    ENCRYPT_WITH_TRANSIENT_KEY = 1,
    USE_ALIAS_SEQUENCE_NUMBER = 2,
    /**
     * This signs the application layer message body (APS Frame not included) and appends the ECDSA signature to the end of the message,
     * which is needed by Smart Energy applications and requires the CBKE and ECC libraries.
     * The ::emberDsaSignHandler() function is called after DSA signing is complete but before the message has been sent by the APS layer.
     * Note that when passing a buffer to the stack for DSA signing, the final byte in the buffer has a special significance as an indicator
     * of how many leading bytes should be ignored for signature purposes. See the API documentation of emberDsaSign()
     * or the dsaSign EZSP command for more details about this requirement.
     */
    DSA_SIGN = 16,
    /** Send the message using APS Encryption using the Link Key shared with the destination node to encrypt the data at the APS Level. */
    ENCRYPTION = 32,
    /**
     * Resend the message using the APS retry mechanism.
     * This option and the enable route discovery option must be enabled for an existing route to be repaired automatically.
     */
    RETRY = 64,
    /**
     * Send the message with the NWK 'enable route discovery' flag, which  causes a route discovery to be initiated if no route to the
     * destination is known. Note that in the mesh stack, this option and the APS retry option must be enabled an existing route to be
     * repaired automatically.
     */
    ENABLE_ROUTE_DISCOVERY = 256,
    /** Send the message with the NWK 'force route discovery' flag, which causes a route discovery to be initiated even if one is known. */
    FORCE_ROUTE_DISCOVERY = 512,
    /** Include the source EUI64 in the network frame. */
    SOURCE_EUI64 = 1024,
    /** Include the destination EUI64 in the network frame. */
    DESTINATION_EUI64 = 2048,
    /** Send a ZDO request to discover the node ID of the destination if it is not already known. */
    ENABLE_ADDRESS_DISCOVERY = 4096,
    /**
     * This message is being sent in response to a call to  ::emberPollHandler().
     * It causes the message to be sent immediately instead of being queued up until the next poll from the (end device) destination.
     */
    POLL_RESPONSE = 8192,
    /**
     * This incoming message is a valid ZDO request and the application is responsible for sending a ZDO response.
     * This flag is used only within emberIncomingMessageHandler() when EMBER_APPLICATION_RECEIVES_UNSUPPORTED_ZDO_REQUESTS is defined. */
    ZDO_RESPONSE_REQUIRED = 16384,
    /**
     * This message is part of a fragmented message.  This option may only  be set for unicasts.
     * The groupId field gives the index of this fragment in the low-order byte.
     * If the low-order byte is zero this is the first fragment and the high-order byte contains the number of fragments in the message.
     */
    FRAGMENT = 32768
}
/**
 * Types of source route discovery modes used by the concentrator.
 *
 * OFF no source route discovery is scheduled
 *
 * ON source routes discovery is scheduled, and it is triggered periodically
 *
 * RESCHEDULE  source routes discoveries are re-scheduled to be sent once immediately and then triggered periodically
 */
export declare enum EmberSourceRouteDiscoveryMode {
    /** off  */
    OFF = 0,
    /** on  */
    ON = 1,
    /** reschedule */
    RESCHEDULE = 2
}
/** The types of MAC passthrough messages that an application may receive. This is a bitmask. */
export declare enum EmberMacPassthroughType {
    /** No MAC passthrough messages. */
    NONE = 0,
    /** SE InterPAN messages. */
    SE_INTERPAN = 1,
    /** EmberNet and first generation (v1) standalone bootloader messages. */
    EMBERNET = 2,
    /** EmberNet messages filtered by their source address. */
    EMBERNET_SOURCE = 4,
    /** Application-specific passthrough messages. */
    APPLICATION = 8,
    /** Custom inter-pan filter. */
    CUSTOM = 16,
    /** Internal Stack passthrough. */
    INTERNAL_ZLL = 128,
    INTERNAL_GP = 64
}
/**
 * Interpan Message type: unicast, broadcast, or multicast.
 * uint8_t
 */
export declare enum EmberInterpanMessageType {
    UNICAST = 0,
    BROADCAST = 8,
    MULTICAST = 12
}
/** This is the Current Security Bitmask that details the use of various security features. */
export declare enum EmberCurrentSecurityBitmask {
    /** This denotes that the device is running in a network with Zigbee
     *  Standard Security. */
    STANDARD_SECURITY_MODE = 0,
    /** This denotes that the device is running in a network without
     *  a centralized Trust Center. */
    DISTRIBUTED_TRUST_CENTER_MODE = 2,
    /** This denotes that the device has a Global Link Key.  The Trust Center
     *  Link Key is the same across multiple nodes. */
    TRUST_CENTER_GLOBAL_LINK_KEY = 4,
    /** This denotes that the node has a Trust Center Link Key. */
    HAVE_TRUST_CENTER_LINK_KEY = 16,
    /** This denotes that the Trust Center is using a Hashed Link Key. */
    TRUST_CENTER_USES_HASHED_LINK_KEY = 132
}
/**
 * The list of supported key types used by Zigbee Security Manager.
 * uint8_t
 */
export declare enum SecManKeyType {
    NONE = 0,
    /**
     * This is the network key, used for encrypting and decrypting network payloads.
     * There is only one of these keys in storage.
     */
    NETWORK = 1,
    /**
     * This is the Trust Center Link Key. On the joining device, this is the APS
     * key used to communicate with the trust center. On the trust center, this
     * key can be used as a root key for APS encryption and decryption when
     * communicating with joining devices (if the security policy has the
     * EMBER_TRUST_CENTER_USES_HASHED_LINK_KEY bit set).
     * There is only one of these keys in storage.
     */
    TC_LINK = 2,
    /**
     * This is a Trust Center Link Key, but it times out after either
     * ::EMBER_TRANSIENT_KEY_TIMEOUT_S or
     * ::EMBER_AF_PLUGIN_NETWORK_CREATOR_SECURITY_NETWORK_OPEN_TIME_S (if
     * defined), whichever is longer. This type of key is set on trust centers
     * who wish to open joining with a temporary, or transient, APS key for
     * devices to join with. Joiners who wish to try several keys when joining a
     * network may set several of these types of keys before attempting to join.
     * This is an indexed key, and local storage can fit as many keys as
     * available RAM allows.
     */
    TC_LINK_WITH_TIMEOUT = 3,
    /**
     * This is an Application link key. On both joining devices and the trust
     * center, this key is used in APS encryption and decryption when
     * communicating to a joining device.
     * This is an indexed key table of size EMBER_KEY_TABLE_SIZE, so long as there
     * is sufficient nonvolatile memory to store keys.
     */
    APP_LINK = 4,
    /** This is the ZLL encryption key for use by algorithms that require it. */
    ZLL_ENCRYPTION_KEY = 5,
    /** For ZLL, this is the pre-configured link key used during classical Zigbee commissioning. */
    ZLL_PRECONFIGURED_KEY = 6,
    /** This is a Green Power Device (GPD) key used on a Proxy device. */
    GREEN_POWER_PROXY_TABLE_KEY = 7,
    /** This is a Green Power Device (GPD) key used on a Sink device. */
    GREEN_POWER_SINK_TABLE_KEY = 8,
    /**
     * This is a generic key type intended to be loaded for one-time hashing or crypto operations.
     * This key is not persisted. Intended for use by the Zigbee stack.
     */
    INTERNAL = 9
}
/**
 * Derived keys are calculated when performing Zigbee crypto operations. The stack makes use of these derivations.
 * Compounding derivations can be specified by using an or-equals on two derived types if applicable;
 * this is limited to performing the key-transport, key-load, or verify-key hashes on either the TC Swap Out or TC Hashed Link keys.
 * uint16_t
 */
export declare enum SecManDerivedKeyType {
    /** Perform no derivation; use the key as is. */
    NONE = 0,
    /** Perform the Key-Transport-Key hash. */
    KEY_TRANSPORT_KEY = 1,
    /** Perform the Key-Load-Key hash. */
    KEY_LOAD_KEY = 2,
    /** Perform the Verify Key hash. */
    VERIFY_KEY = 4,
    /** Perform a simple AES hash of the key for TC backup. */
    TC_SWAP_OUT_KEY = 8,
    /** For a TC using hashed link keys, hashed the root key against the supplied EUI in context. */
    TC_HASHED_LINK_KEY = 16
}
/**
 * Security Manager context flags.
 * uint8_t
 */
export declare enum SecManFlag {
    NONE = 0,
    /**
     * For export APIs, this flag indicates the key_index parameter is valid in
     *  the ::sl_zb_sec_man_context_t structure. This bit is set by the caller
     *  when intending to search for a key by key_index. This flag has no
     *  significance for import APIs. */
    KEY_INDEX_IS_VALID = 1,
    /**
     * For export APIs, this flag indicates the eui64 parameter is valid in the
     *  ::sl_zb_sec_man_context_t structure. This bit is set by the caller when
     *  intending to search for a key by eui64. It is also set when searching by
     *  key_index and an entry is found. This flag has no significance for import
     *  APIs. */
    EUI_IS_VALID = 2,
    /**
     * Internal use only. This indicates that the transient key being added is an
     * unconfirmed, updated key. This bit is set when we add a transient key and
     * the ::EmberTcLinkKeyRequestPolicy policy
     * is ::EMBER_ALLOW_TC_LINK_KEY_REQUEST_AND_GENERATE_NEW_KEY, whose behavior
     * dictates that we generate a new, unconfirmed key, send it to the requester,
     * and await for a Verify Key Confirm message. */
    UNCONFIRMED_TRANSIENT_KEY = 4,
    /**
     * Internal use only.  This indicates that the key being added was derived via
     * dynamic link key negotiation.  This may be used in conjunction with the above
     * ::UNCONFIRMED_TRANSIENT_KEY while the derived link key awaits
     * confirmation
     */
    AUTHENTICATED_DYNAMIC_LINK_KEY = 8,
    /**
     * Internal use only.  This indicates that the "key" being added is instead the
     * symmetric passphrase to be stored in the link key table. This flag will trigger the
     * addition of the KEY_TABLE_SYMMETRIC_PASSPHRASE bitmask when storing the symmetric
     * passphrase so that it can be differentiated from other keys with the same EUI64.
     */
    SYMMETRIC_PASSPHRASE = 16
}
/** This denotes the status of an attempt to establish a key with another device. */
export declare enum EmberKeyStatus {
    STATUS_NONE = 0,
    APP_LINK_KEY_ESTABLISHED = 1,
    TRUST_CENTER_LINK_KEY_ESTABLISHED = 3,
    ESTABLISHMENT_TIMEOUT = 4,
    TABLE_FULL = 5,
    TC_RESPONDED_TO_KEY_REQUEST = 6,
    TC_APP_KEY_SENT_TO_REQUESTER = 7,
    TC_RESPONSE_TO_KEY_REQUEST_FAILED = 8,
    TC_REQUEST_KEY_TYPE_NOT_SUPPORTED = 9,
    TC_NO_LINK_KEY_FOR_REQUESTER = 10,
    TC_REQUESTER_EUI64_UNKNOWN = 11,
    TC_RECEIVED_FIRST_APP_KEY_REQUEST = 12,
    TC_TIMEOUT_WAITING_FOR_SECOND_APP_KEY_REQUEST = 13,
    TC_NON_MATCHING_APP_KEY_REQUEST_RECEIVED = 14,
    TC_FAILED_TO_SEND_APP_KEYS = 15,
    TC_FAILED_TO_STORE_APP_KEY_REQUEST = 16,
    TC_REJECTED_APP_KEY_REQUEST = 17,
    TC_FAILED_TO_GENERATE_NEW_KEY = 18,
    TC_FAILED_TO_SEND_TC_KEY = 19,
    TRUST_CENTER_IS_PRE_R21 = 30,
    TC_REQUESTER_VERIFY_KEY_TIMEOUT = 50,
    TC_REQUESTER_VERIFY_KEY_FAILURE = 51,
    TC_REQUESTER_VERIFY_KEY_SUCCESS = 52,
    VERIFY_LINK_KEY_FAILURE = 100,
    VERIFY_LINK_KEY_SUCCESS = 101
}
/** This bitmask describes the presence of fields within the ::EmberKeyStruct. uint16_t */
export declare enum EmberKeyStructBitmask {
    /** This indicates that the key has a sequence number associated with it. (i.e., a Network Key). */
    HAS_SEQUENCE_NUMBER = 1,
    /** This indicates that the key has an outgoing frame counter and the corresponding value within the ::EmberKeyStruct has been populated.*/
    HAS_OUTGOING_FRAME_COUNTER = 2,
    /** This indicates that the key has an incoming frame counter and the corresponding value within the ::EmberKeyStruct has been populated.*/
    HAS_INCOMING_FRAME_COUNTER = 4,
    /**
     * This indicates that the key has an associated Partner EUI64 address and the corresponding value
     * within the ::EmberKeyStruct has been populated.
     */
    HAS_PARTNER_EUI64 = 8,
    /**
     * This indicates the key is authorized for use in APS data messages.
     * If the key is not authorized for use in APS data messages it has not yet gone through a key agreement protocol, such as CBKE (i.e., ECC).
     */
    IS_AUTHORIZED = 16,
    /**
     * This indicates that the partner associated with the link is a sleepy end device.
     * This bit is set automatically if the local device hears a device announce from the partner indicating it is not an 'RX on when idle' device.
     */
    PARTNER_IS_SLEEPY = 32,
    /**
     * This indicates that the transient key which is being added is unconfirmed.
     * This bit is set when we add a transient key while the EmberTcLinkKeyRequestPolicy is EMBER_ALLOW_TC_LINK_KEY_REQUEST_AND_GENERATE_NEW_KEY
     */
    UNCONFIRMED_TRANSIENT = 64,
    /** This indicates that the actual key data is stored in PSA, and the respective PSA ID is recorded in the psa_id field. */
    HAS_PSA_ID = 128,
    /**
     * This indicates that the keyData field has valid data. On certain parts and depending on the security configuration,
     * keys may live in secure storage and are not exportable. In such cases, keyData will not house the actual key contents.
     */
    HAS_KEY_DATA = 256,
    /**
     * This indicates that the key represents a Device Authentication Token and is not an encryption key.
     * The Authentication token is persisted for the lifetime of the device on the network and used to validate and update the device connection.
     * It is only removed when the device leaves or is decommissioned from the network
     */
    IS_AUTHENTICATION_TOKEN = 512,
    /** This indicates that the key has been derived by the Dynamic Link Key feature. */
    DLK_DERIVED = 1024,
    /** This indicates that the device this key is being used to communicate with supports the APS frame counter synchronization procedure. */
    FC_SYNC_SUPPORTED = 2048
}
/**
 * The Status of the Update Device message sent to the Trust Center.
 * The device may have joined or rejoined insecurely, rejoined securely, or left.
 * MAC Security has been deprecated and therefore there is no secure join.
 * These map to the actual values within the APS Command frame so they cannot be arbitrarily changed.
 * uint8_t
 */
export declare enum EmberDeviceUpdate {
    STANDARD_SECURITY_SECURED_REJOIN = 0,
    STANDARD_SECURITY_UNSECURED_JOIN = 1,
    DEVICE_LEFT = 2,
    STANDARD_SECURITY_UNSECURED_REJOIN = 3
}
/** The decision made by the Trust Center when a node attempts to join. uint8_t */
export declare enum EmberJoinDecision {
    /** Allow the node to join. The node has the key. */
    USE_PRECONFIGURED_KEY = 0,
    /** Allow the node to join. Send the key to the node. */
    SEND_KEY_IN_THE_CLEAR = 1,
    /** Deny join. */
    DENY_JOIN = 2,
    /** Take no action. */
    NO_ACTION = 3,
    /** Allow rejoins only.*/
    ALLOW_REJOINS_ONLY = 4
}
/** A bitmask indicating the state of the ZLL device. This maps directly to the ZLL information field in the scan response. uint16_t */
export declare enum EmberZllState {
    /** No state. */
    NONE = 0,
    /** The device is factory new. */
    FACTORY_NEW = 1,
    /** The device is capable of assigning addresses to other devices. */
    ADDRESS_ASSIGNMENT_CAPABLE = 2,
    /** The device is initiating a link operation. */
    LINK_INITIATOR = 16,
    /** The device is requesting link priority. */
    LINK_PRIORITY_REQUEST = 32,
    /** The device is a Zigbee 3.0 device. */
    PROFILE_INTEROP = 128,
    /** The device is on a non-ZLL network. */
    NON_ZLL_NETWORK = 256,
    /** Internal use: the ZLL token's key values point to a PSA key identifier */
    TOKEN_POINTS_TO_PSA_ID = 512
}
/** Differentiates among ZLL network operations. */
export declare enum EzspZllNetworkOperation {
    /** ZLL form network command. */
    FORM_NETWORK = 0,
    /** ZLL join target command. */
    JOIN_TARGET = 1
}
/** The key encryption algorithms supported by the stack. */
export declare enum EmberZllKeyIndex {
    /** The key encryption algorithm for use during development. */
    DEVELOPMENT = 0,
    /** The key encryption algorithm shared by all certified devices. */
    MASTER = 4,
    /** The key encryption algorithm for use during development and certification. */
    CERTIFICATION = 15
}
/** uint8_t */
export declare enum EmberGpApplicationId {
    /** Source identifier. */
    SOURCE_ID = 0,
    /** IEEE address. */
    IEEE_ADDRESS = 2
}
/** Green Power Security Level. uint8_t */
export declare enum EmberGpSecurityLevel {
    /** No Security  */
    NONE = 0,
    /** Reserved  */
    RESERVED = 1,
    /** 4 Byte Frame Counter and 4 Byte MIC */
    FC_MIC = 2,
    /** 4 Byte Frame Counter and 4 Byte MIC with encryption */
    FC_MIC_ENCRYPTED = 3
}
/** Green Power Security Security Key Type. uint8_t */
export declare enum EmberGpKeyType {
    /** No Key */
    NONE = 0,
    /** GP Security Key Type is Zigbee Network Key */
    NWK = 1,
    /** GP Security Key Type is Group Key */
    GPD_GROUP = 2,
    /** GP Security Key Type is Derived Network Key */
    NWK_DERIVED = 3,
    /** GP Security Key Type is Out Of Box Key */
    GPD_OOB = 4,
    /** GP Security Key Type is GPD Derived Key */
    GPD_DERIVED = 7
}
/** uint8_t */
export declare enum EmberGpProxyTableEntryStatus {
    /** The GP table entry is in use for a Proxy Table Entry. */
    ACTIVE = 1,
    /** The proxy table entry is not in use. */
    UNUSED = 255
}
/** GP Sink Type. */
export declare enum EmberGpSinkType {
    /** Sink Type is Full Unicast */
    FULL_UNICAST = 0,
    /** Sink Type is Derived groupcast, the group ID is derived from the GpdId during commissioning.
     * The sink is added to the APS group with that groupId.
     */
    D_GROUPCAST = 1,
    /** Sink type GROUPCAST, the groupId can be obtained from the APS group table
     * or from the sink table.
     */
    GROUPCAST = 2,
    /** Sink Type is Light Weight Unicast. */
    LW_UNICAST = 3,
    /** Unused sink type */
    UNUSED = 255
}
/** uint8_t */
export declare enum EmberGpSinkTableEntryStatus {
    /** The GP table entry is in use for a Sink Table Entry. */
    ACTIVE = 1,
    /** The proxy table entry is not in use. */
    UNUSED = 255
}
export declare enum EmberLeaveNetworkOption {
    /** Leave with no option. */
    WITH_NO_OPTION = 0,
    /** Leave with option rejoin. */
    WITH_OPTION_REJOIN = 32,
    /** Leave is requested. */
    IS_REQUESTED = 64
}
/**
 * Packet transmit priorities in terms of getting into the MAC queue.
 *
 * SL_802154_TRANSMIT_PRIORITY_HIGH High priority headers go on the front of the queue.
 * SL_802154_TRANSMIT_PRIORITY_NORMAL  Normal priority headers go on the back of the queue.
 * SL_802154_TRANSMIT_PRIORITY_SCAN_OKAY Normally, only beacon requests and orphan notifications can be sent during a scan.
 * They are submitted with SCAN_OKAY and go on the front of the queue. Other packets could be submitted with this priority, but it is not recommended.
 */
export declare enum EmberTransmitPriority {
    HIGH = 0,
    NORMAL = 1,
    SCAN_OKAY = 2
}
export declare enum IEEE802154CcaMode {
    /** RSSI-based CCA. CCA reports a busy medium upon detecting any energy above -75 (default RAIL_CsmaConfig_t.ccaThreshold). */
    RSSI = 0,
    /**
     * Signal Identifier-based CCA. CCA reports a busy medium only upon the detection of a signal compliant with this standard
     * with the same modulation and spreading characteristics of the PHY that is currently in use.
     */
    SIGNAL = 1,
    /**
     * RSSI or signal identifier-based CCA. CCA reports a busy medium on either detecting any energy above
     * -75 (default RAIL_CsmaConfig_t.ccaThreshold) or detection of a signal compliant with this standard with the same modulation
     * and spreading characteristics of the PHY that is currently in use.
     */
    SIGNAL_OR_RSSI = 2,
    /**
     * RSSI and signal identifier-based CCA. CCA reports a busy medium only on detecting any energy above -75 (default RAIL_CsmaConfig_t.ccaThreshold)
     * of a signal compliant with this standard with the same modulation and spreading characteristics of the PHY that is currently in use.
     */
    SIGNAL_AND_RSSI = 3,
    /** ALOHA. Always transmit CCA=1. CCA always reports an idle medium. */
    ALWAYS_TRANSMIT = 4
}
//# sourceMappingURL=enums.d.ts.map