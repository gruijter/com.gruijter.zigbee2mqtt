"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IEEE802154CcaMode = exports.EmberTransmitPriority = exports.EmberLeaveNetworkOption = exports.EmberGpSinkTableEntryStatus = exports.EmberGpSinkType = exports.EmberGpProxyTableEntryStatus = exports.EmberGpKeyType = exports.EmberGpSecurityLevel = exports.EmberGpApplicationId = exports.EmberZllKeyIndex = exports.EzspZllNetworkOperation = exports.EmberZllState = exports.EmberJoinDecision = exports.EmberDeviceUpdate = exports.EmberKeyStructBitmask = exports.EmberKeyStatus = exports.SecManFlag = exports.SecManDerivedKeyType = exports.SecManKeyType = exports.EmberCurrentSecurityBitmask = exports.EmberInterpanMessageType = exports.EmberMacPassthroughType = exports.EmberSourceRouteDiscoveryMode = exports.EmberApsOption = exports.EmberIncomingMessageType = exports.EmberOutgoingMessageType = exports.EmberBindingType = exports.EmberDutyCycleState = exports.EmberMultiPhyNwkConfig = exports.EmberNodeType = exports.EmberJoinMethod = exports.EzspNetworkScanType = exports.EmberNetworkStatus = exports.EmberNetworkInitBitmask = exports.EmberEntropySource = exports.EmberLibraryStatus = exports.EmberLibraryId = exports.EmberCounterType = exports.EmberEventUnits = exports.EmberInitialSecurityBitmask = exports.EmberExtendedSecurityBitmask = exports.EmberKeepAliveMode = exports.EmberTXPowerMode = exports.EmberVersionType = exports.EmberGPStatus = exports.EmberStackError = exports.EzspStatus = exports.SLStatus = void 0;
/** Status Codes contains error and status code definitions used by Simplicity SDK software components and stacks. */
var SLStatus;
(function (SLStatus) {
    // -----------------------------------------------------------------------------
    // Generic Errors
    /** No error. */
    SLStatus[SLStatus["OK"] = 0] = "OK";
    /** Generic error. */
    SLStatus[SLStatus["FAIL"] = 1] = "FAIL";
    // -----------------------------------------------------------------------------
    // State Errors
    /** Generic invalid state error. */
    SLStatus[SLStatus["INVALID_STATE"] = 2] = "INVALID_STATE";
    /** Module is not ready for requested operation. */
    SLStatus[SLStatus["NOT_READY"] = 3] = "NOT_READY";
    /** Module is busy and cannot carry out requested operation. */
    SLStatus[SLStatus["BUSY"] = 4] = "BUSY";
    /** Operation is in progress and not yet complete (pass or fail). */
    SLStatus[SLStatus["IN_PROGRESS"] = 5] = "IN_PROGRESS";
    /** Operation aborted. */
    SLStatus[SLStatus["ABORT"] = 6] = "ABORT";
    /** Operation timed out. */
    SLStatus[SLStatus["TIMEOUT"] = 7] = "TIMEOUT";
    /** Operation not allowed per permissions. */
    SLStatus[SLStatus["PERMISSION"] = 8] = "PERMISSION";
    /** Non-blocking operation would block. */
    SLStatus[SLStatus["WOULD_BLOCK"] = 9] = "WOULD_BLOCK";
    /** Operation/module is Idle, cannot carry requested operation. */
    SLStatus[SLStatus["IDLE"] = 10] = "IDLE";
    /** Operation cannot be done while construct is waiting. */
    SLStatus[SLStatus["IS_WAITING"] = 11] = "IS_WAITING";
    /** No task/construct waiting/pending for that action/event. */
    SLStatus[SLStatus["NONE_WAITING"] = 12] = "NONE_WAITING";
    /** Operation cannot be done while construct is suspended. */
    SLStatus[SLStatus["SUSPENDED"] = 13] = "SUSPENDED";
    /** Feature not available due to software configuration. */
    SLStatus[SLStatus["NOT_AVAILABLE"] = 14] = "NOT_AVAILABLE";
    /** Feature not supported. */
    SLStatus[SLStatus["NOT_SUPPORTED"] = 15] = "NOT_SUPPORTED";
    /** Initialization failed. */
    SLStatus[SLStatus["INITIALIZATION"] = 16] = "INITIALIZATION";
    /** Module has not been initialized. */
    SLStatus[SLStatus["NOT_INITIALIZED"] = 17] = "NOT_INITIALIZED";
    /** Module has already been initialized. */
    SLStatus[SLStatus["ALREADY_INITIALIZED"] = 18] = "ALREADY_INITIALIZED";
    /** Object/construct has been deleted. */
    SLStatus[SLStatus["DELETED"] = 19] = "DELETED";
    /** Illegal call from ISR. */
    SLStatus[SLStatus["ISR"] = 20] = "ISR";
    /** Illegal call because network is up. */
    SLStatus[SLStatus["NETWORK_UP"] = 21] = "NETWORK_UP";
    /** Illegal call because network is down. */
    SLStatus[SLStatus["NETWORK_DOWN"] = 22] = "NETWORK_DOWN";
    /** Failure due to not being joined in a network. */
    SLStatus[SLStatus["NOT_JOINED"] = 23] = "NOT_JOINED";
    /** Invalid operation as there are no beacons. */
    SLStatus[SLStatus["NO_BEACONS"] = 24] = "NO_BEACONS";
    // -----------------------------------------------------------------------------
    // Allocation/ownership Errors
    /** Generic allocation error. */
    SLStatus[SLStatus["ALLOCATION_FAILED"] = 25] = "ALLOCATION_FAILED";
    /** No more resource available to perform the operation. */
    SLStatus[SLStatus["NO_MORE_RESOURCE"] = 26] = "NO_MORE_RESOURCE";
    /** Item/list/queue is empty. */
    SLStatus[SLStatus["EMPTY"] = 27] = "EMPTY";
    /** Item/list/queue is full. */
    SLStatus[SLStatus["FULL"] = 28] = "FULL";
    /** Item would overflow. */
    SLStatus[SLStatus["WOULD_OVERFLOW"] = 29] = "WOULD_OVERFLOW";
    /** Item/list/queue has been overflowed. */
    SLStatus[SLStatus["HAS_OVERFLOWED"] = 30] = "HAS_OVERFLOWED";
    /** Generic ownership error. */
    SLStatus[SLStatus["OWNERSHIP"] = 31] = "OWNERSHIP";
    /** Already/still owning resource. */
    SLStatus[SLStatus["IS_OWNER"] = 32] = "IS_OWNER";
    // -----------------------------------------------------------------------------
    // Invalid Parameters Errors
    /** Generic invalid argument or consequence of invalid argument. */
    SLStatus[SLStatus["INVALID_PARAMETER"] = 33] = "INVALID_PARAMETER";
    /** Invalid null pointer received as argument. */
    SLStatus[SLStatus["NULL_POINTER"] = 34] = "NULL_POINTER";
    /** Invalid configuration provided. */
    SLStatus[SLStatus["INVALID_CONFIGURATION"] = 35] = "INVALID_CONFIGURATION";
    /** Invalid mode. */
    SLStatus[SLStatus["INVALID_MODE"] = 36] = "INVALID_MODE";
    /** Invalid handle. */
    SLStatus[SLStatus["INVALID_HANDLE"] = 37] = "INVALID_HANDLE";
    /** Invalid type for operation. */
    SLStatus[SLStatus["INVALID_TYPE"] = 38] = "INVALID_TYPE";
    /** Invalid index. */
    SLStatus[SLStatus["INVALID_INDEX"] = 39] = "INVALID_INDEX";
    /** Invalid range. */
    SLStatus[SLStatus["INVALID_RANGE"] = 40] = "INVALID_RANGE";
    /** Invalid key. */
    SLStatus[SLStatus["INVALID_KEY"] = 41] = "INVALID_KEY";
    /** Invalid credentials. */
    SLStatus[SLStatus["INVALID_CREDENTIALS"] = 42] = "INVALID_CREDENTIALS";
    /** Invalid count. */
    SLStatus[SLStatus["INVALID_COUNT"] = 43] = "INVALID_COUNT";
    /** Invalid signature / verification failed. */
    SLStatus[SLStatus["INVALID_SIGNATURE"] = 44] = "INVALID_SIGNATURE";
    /** Item could not be found. */
    SLStatus[SLStatus["NOT_FOUND"] = 45] = "NOT_FOUND";
    /** Item already exists. */
    SLStatus[SLStatus["ALREADY_EXISTS"] = 46] = "ALREADY_EXISTS";
    // -----------------------------------------------------------------------------
    // IO/Communication Errors
    /** Generic I/O failure. */
    SLStatus[SLStatus["IO"] = 47] = "IO";
    /** I/O failure due to timeout. */
    SLStatus[SLStatus["IO_TIMEOUT"] = 48] = "IO_TIMEOUT";
    /** Generic transmission error. */
    SLStatus[SLStatus["TRANSMIT"] = 49] = "TRANSMIT";
    /** Transmit underflowed. */
    SLStatus[SLStatus["TRANSMIT_UNDERFLOW"] = 50] = "TRANSMIT_UNDERFLOW";
    /** Transmit is incomplete. */
    SLStatus[SLStatus["TRANSMIT_INCOMPLETE"] = 51] = "TRANSMIT_INCOMPLETE";
    /** Transmit is busy. */
    SLStatus[SLStatus["TRANSMIT_BUSY"] = 52] = "TRANSMIT_BUSY";
    /** Generic reception error. */
    SLStatus[SLStatus["RECEIVE"] = 53] = "RECEIVE";
    /** Failed to read on/via given object. */
    SLStatus[SLStatus["OBJECT_READ"] = 54] = "OBJECT_READ";
    /** Failed to write on/via given object. */
    SLStatus[SLStatus["OBJECT_WRITE"] = 55] = "OBJECT_WRITE";
    /** Message is too long. */
    SLStatus[SLStatus["MESSAGE_TOO_LONG"] = 56] = "MESSAGE_TOO_LONG";
    // -----------------------------------------------------------------------------
    // EEPROM/Flash Errors
    /** EEPROM MFG version mismatch. */
    SLStatus[SLStatus["EEPROM_MFG_VERSION_MISMATCH"] = 57] = "EEPROM_MFG_VERSION_MISMATCH";
    /** EEPROM Stack version mismatch. */
    SLStatus[SLStatus["EEPROM_STACK_VERSION_MISMATCH"] = 58] = "EEPROM_STACK_VERSION_MISMATCH";
    /** Flash write is inhibited. */
    SLStatus[SLStatus["FLASH_WRITE_INHIBITED"] = 59] = "FLASH_WRITE_INHIBITED";
    /** Flash verification failed. */
    SLStatus[SLStatus["FLASH_VERIFY_FAILED"] = 60] = "FLASH_VERIFY_FAILED";
    /** Flash programming failed. */
    SLStatus[SLStatus["FLASH_PROGRAM_FAILED"] = 61] = "FLASH_PROGRAM_FAILED";
    /** Flash erase failed. */
    SLStatus[SLStatus["FLASH_ERASE_FAILED"] = 62] = "FLASH_ERASE_FAILED";
    // -----------------------------------------------------------------------------
    // MAC Errors
    /** MAC no data. */
    SLStatus[SLStatus["MAC_NO_DATA"] = 63] = "MAC_NO_DATA";
    /** MAC no ACK received. */
    SLStatus[SLStatus["MAC_NO_ACK_RECEIVED"] = 64] = "MAC_NO_ACK_RECEIVED";
    /** MAC indirect timeout. */
    SLStatus[SLStatus["MAC_INDIRECT_TIMEOUT"] = 65] = "MAC_INDIRECT_TIMEOUT";
    /** MAC unknown header type. */
    SLStatus[SLStatus["MAC_UNKNOWN_HEADER_TYPE"] = 66] = "MAC_UNKNOWN_HEADER_TYPE";
    /** MAC ACK unknown header type. */
    SLStatus[SLStatus["MAC_ACK_HEADER_TYPE"] = 67] = "MAC_ACK_HEADER_TYPE";
    /** MAC command transmit failure. */
    SLStatus[SLStatus["MAC_COMMAND_TRANSMIT_FAILURE"] = 68] = "MAC_COMMAND_TRANSMIT_FAILURE";
    // -----------------------------------------------------------------------------
    // CLI_STORAGE Errors
    /** Error in open NVM */
    SLStatus[SLStatus["CLI_STORAGE_NVM_OPEN_ERROR"] = 69] = "CLI_STORAGE_NVM_OPEN_ERROR";
    // -----------------------------------------------------------------------------
    // Security status codes
    /** Image checksum is not valid. */
    SLStatus[SLStatus["SECURITY_IMAGE_CHECKSUM_ERROR"] = 70] = "SECURITY_IMAGE_CHECKSUM_ERROR";
    /** Decryption failed */
    SLStatus[SLStatus["SECURITY_DECRYPT_ERROR"] = 71] = "SECURITY_DECRYPT_ERROR";
    // -----------------------------------------------------------------------------
    // Command status codes
    /** Command was not recognized */
    SLStatus[SLStatus["COMMAND_IS_INVALID"] = 72] = "COMMAND_IS_INVALID";
    /** Command or parameter maximum length exceeded */
    SLStatus[SLStatus["COMMAND_TOO_LONG"] = 73] = "COMMAND_TOO_LONG";
    /** Data received does not form a complete command */
    SLStatus[SLStatus["COMMAND_INCOMPLETE"] = 74] = "COMMAND_INCOMPLETE";
    // -----------------------------------------------------------------------------
    // Misc Errors
    /** Bus error, e.g. invalid DMA address */
    SLStatus[SLStatus["BUS_ERROR"] = 75] = "BUS_ERROR";
    // -----------------------------------------------------------------------------
    // Unified MAC Errors
    /** CCA failure. */
    SLStatus[SLStatus["CCA_FAILURE"] = 76] = "CCA_FAILURE";
    // -----------------------------------------------------------------------------
    // Scan errors
    /** MAC scanning. */
    SLStatus[SLStatus["MAC_SCANNING"] = 77] = "MAC_SCANNING";
    /** MAC incorrect scan type. */
    SLStatus[SLStatus["MAC_INCORRECT_SCAN_TYPE"] = 78] = "MAC_INCORRECT_SCAN_TYPE";
    /** Invalid channel mask. */
    SLStatus[SLStatus["INVALID_CHANNEL_MASK"] = 79] = "INVALID_CHANNEL_MASK";
    /** Bad scan duration. */
    SLStatus[SLStatus["BAD_SCAN_DURATION"] = 80] = "BAD_SCAN_DURATION";
    // -----------------------------------------------------------------------------
    // MAC transmit related status
    /** The MAC transmit queue is full */
    SLStatus[SLStatus["MAC_TRANSMIT_QUEUE_FULL"] = 83] = "MAC_TRANSMIT_QUEUE_FULL";
    /**
     * The transmit attempt failed because the radio scheduler could not find a slot to transmit this packet in or
     * a higher priority event interrupted it
     */
    SLStatus[SLStatus["TRANSMIT_SCHEDULER_FAIL"] = 84] = "TRANSMIT_SCHEDULER_FAIL";
    /** An unsupported channel setting was specified */
    SLStatus[SLStatus["TRANSMIT_INVALID_CHANNEL"] = 85] = "TRANSMIT_INVALID_CHANNEL";
    /** An unsupported power setting was specified */
    SLStatus[SLStatus["TRANSMIT_INVALID_POWER"] = 86] = "TRANSMIT_INVALID_POWER";
    /** The expected ACK was received after the last transmission */
    SLStatus[SLStatus["TRANSMIT_ACK_RECEIVED"] = 87] = "TRANSMIT_ACK_RECEIVED";
    /**
     * The transmit attempt was blocked from going over the air.
     * Typically this is due to the Radio Hold Off (RHO) or Coexistence plugins as they can prevent transmits based on external signals.
     */
    SLStatus[SLStatus["TRANSMIT_BLOCKED"] = 88] = "TRANSMIT_BLOCKED";
    // -----------------------------------------------------------------------------
    // NVM3 specific errors
    /** The initialization was aborted as the NVM3 instance is not aligned properly in memory */
    SLStatus[SLStatus["NVM3_ALIGNMENT_INVALID"] = 89] = "NVM3_ALIGNMENT_INVALID";
    /** The initialization was aborted as the size of the NVM3 instance is too small */
    SLStatus[SLStatus["NVM3_SIZE_TOO_SMALL"] = 90] = "NVM3_SIZE_TOO_SMALL";
    /** The initialization was aborted as the NVM3 page size is not supported */
    SLStatus[SLStatus["NVM3_PAGE_SIZE_NOT_SUPPORTED"] = 91] = "NVM3_PAGE_SIZE_NOT_SUPPORTED";
    /** The application that there was an error initializing some of the tokens */
    SLStatus[SLStatus["NVM3_TOKEN_INIT_FAILED"] = 92] = "NVM3_TOKEN_INIT_FAILED";
    /** The initialization was aborted as the NVM3 instance was already opened with other parameters */
    SLStatus[SLStatus["NVM3_OPENED_WITH_OTHER_PARAMETERS"] = 93] = "NVM3_OPENED_WITH_OTHER_PARAMETERS";
    // -----------------------------------------------------------------------------
    // MVP Driver and MVP Math status codes
    /** Critical fault */
    SLStatus[SLStatus["COMPUTE_DRIVER_FAULT"] = 5377] = "COMPUTE_DRIVER_FAULT";
    /** ALU operation output NaN */
    SLStatus[SLStatus["COMPUTE_DRIVER_ALU_NAN"] = 5378] = "COMPUTE_DRIVER_ALU_NAN";
    /** ALU numeric overflow */
    SLStatus[SLStatus["COMPUTE_DRIVER_ALU_OVERFLOW"] = 5379] = "COMPUTE_DRIVER_ALU_OVERFLOW";
    /** ALU numeric underflow */
    SLStatus[SLStatus["COMPUTE_DRIVER_ALU_UNDERFLOW"] = 5380] = "COMPUTE_DRIVER_ALU_UNDERFLOW";
    /** Overflow during array store */
    SLStatus[SLStatus["COMPUTE_DRIVER_STORE_CONVERSION_OVERFLOW"] = 5381] = "COMPUTE_DRIVER_STORE_CONVERSION_OVERFLOW";
    /** Underflow during array store conversion */
    SLStatus[SLStatus["COMPUTE_DRIVER_STORE_CONVERSION_UNDERFLOW"] = 5382] = "COMPUTE_DRIVER_STORE_CONVERSION_UNDERFLOW";
    /** Infinity encountered during array store conversion */
    SLStatus[SLStatus["COMPUTE_DRIVER_STORE_CONVERSION_INFINITY"] = 5383] = "COMPUTE_DRIVER_STORE_CONVERSION_INFINITY";
    /** NaN encountered during array store conversion */
    SLStatus[SLStatus["COMPUTE_DRIVER_STORE_CONVERSION_NAN"] = 5384] = "COMPUTE_DRIVER_STORE_CONVERSION_NAN";
    /** MATH NaN encountered */
    SLStatus[SLStatus["COMPUTE_MATH_NAN"] = 5394] = "COMPUTE_MATH_NAN";
    /** MATH Infinity encountered */
    SLStatus[SLStatus["COMPUTE_MATH_INFINITY"] = 5395] = "COMPUTE_MATH_INFINITY";
    /** MATH numeric overflow */
    SLStatus[SLStatus["COMPUTE_MATH_OVERFLOW"] = 5396] = "COMPUTE_MATH_OVERFLOW";
    /** MATH numeric underflow */
    SLStatus[SLStatus["COMPUTE_MATH_UNDERFLOW"] = 5397] = "COMPUTE_MATH_UNDERFLOW";
    // -----------------------------------------------------------------------------
    // Zigbee status codes
    /** Packet is dropped by packet-handoff callbacks */
    SLStatus[SLStatus["ZIGBEE_PACKET_HANDOFF_DROPPED"] = 3073] = "ZIGBEE_PACKET_HANDOFF_DROPPED";
    /** The APS layer attempted to send or deliver a message and failed */
    SLStatus[SLStatus["ZIGBEE_DELIVERY_FAILED"] = 3074] = "ZIGBEE_DELIVERY_FAILED";
    /** The maximum number of in-flight messages ::EMBER_APS_UNICAST_MESSAGE_COUNT has been reached */
    SLStatus[SLStatus["ZIGBEE_MAX_MESSAGE_LIMIT_REACHED"] = 3075] = "ZIGBEE_MAX_MESSAGE_LIMIT_REACHED";
    /** The application is trying to delete or overwrite a binding that is in use */
    SLStatus[SLStatus["ZIGBEE_BINDING_IS_ACTIVE"] = 3076] = "ZIGBEE_BINDING_IS_ACTIVE";
    /** The application is trying to overwrite an address table entry that is in use */
    SLStatus[SLStatus["ZIGBEE_ADDRESS_TABLE_ENTRY_IS_ACTIVE"] = 3077] = "ZIGBEE_ADDRESS_TABLE_ENTRY_IS_ACTIVE";
    /** After moving, a mobile node's attempt to re-establish contact with the network failed */
    SLStatus[SLStatus["ZIGBEE_MOVE_FAILED"] = 3078] = "ZIGBEE_MOVE_FAILED";
    /** The local node ID has changed. The application can get the new node ID by calling ::sl_zigbee_get_node_id() */
    SLStatus[SLStatus["ZIGBEE_NODE_ID_CHANGED"] = 3079] = "ZIGBEE_NODE_ID_CHANGED";
    /** The chosen security level is not supported by the stack */
    SLStatus[SLStatus["ZIGBEE_INVALID_SECURITY_LEVEL"] = 3080] = "ZIGBEE_INVALID_SECURITY_LEVEL";
    /** An error occurred when trying to encrypt at the APS Level */
    SLStatus[SLStatus["ZIGBEE_IEEE_ADDRESS_DISCOVERY_IN_PROGRESS"] = 3081] = "ZIGBEE_IEEE_ADDRESS_DISCOVERY_IN_PROGRESS";
    /** An error occurred when trying to encrypt at the APS Level */
    SLStatus[SLStatus["ZIGBEE_APS_ENCRYPTION_ERROR"] = 3082] = "ZIGBEE_APS_ENCRYPTION_ERROR";
    /** There was an attempt to form or join a network with security without calling ::sl_zigbee_set_initial_security_state() first */
    SLStatus[SLStatus["ZIGBEE_SECURITY_STATE_NOT_SET"] = 3083] = "ZIGBEE_SECURITY_STATE_NOT_SET";
    /**
     * There was an attempt to broadcast a key switch too quickly after broadcasting the next network key.
     * The Trust Center must wait at least a period equal to the broadcast timeout so that all routers have a chance
     * to receive the broadcast of the new network key
     */
    SLStatus[SLStatus["ZIGBEE_TOO_SOON_FOR_SWITCH_KEY"] = 3084] = "ZIGBEE_TOO_SOON_FOR_SWITCH_KEY";
    /** The received signature corresponding to the message that was passed to the CBKE Library failed verification and is not valid */
    SLStatus[SLStatus["ZIGBEE_SIGNATURE_VERIFY_FAILURE"] = 3085] = "ZIGBEE_SIGNATURE_VERIFY_FAILURE";
    /** The message could not be sent because the link key corresponding to the destination is not authorized for use in APS data messages */
    SLStatus[SLStatus["ZIGBEE_KEY_NOT_AUTHORIZED"] = 3086] = "ZIGBEE_KEY_NOT_AUTHORIZED";
    /** The application tried to use a binding that has been remotely modified and the change has not yet been reported to the application */
    SLStatus[SLStatus["ZIGBEE_BINDING_HAS_CHANGED"] = 3087] = "ZIGBEE_BINDING_HAS_CHANGED";
    /** The EUI of the Trust center has changed due to a successful rejoin after TC Swapout */
    SLStatus[SLStatus["ZIGBEE_TRUST_CENTER_SWAP_EUI_HAS_CHANGED"] = 3088] = "ZIGBEE_TRUST_CENTER_SWAP_EUI_HAS_CHANGED";
    /** A Trust Center Swapout Rejoin has occurred without the EUI of the TC changing */
    SLStatus[SLStatus["ZIGBEE_TRUST_CENTER_SWAP_EUI_HAS_NOT_CHANGED"] = 3089] = "ZIGBEE_TRUST_CENTER_SWAP_EUI_HAS_NOT_CHANGED";
    /** An attempt to generate random bytes failed because of insufficient random data from the radio */
    SLStatus[SLStatus["ZIGBEE_INSUFFICIENT_RANDOM_DATA"] = 3090] = "ZIGBEE_INSUFFICIENT_RANDOM_DATA";
    /** A Zigbee route error command frame was received indicating that a source routed message from this node failed en route */
    SLStatus[SLStatus["ZIGBEE_SOURCE_ROUTE_FAILURE"] = 3091] = "ZIGBEE_SOURCE_ROUTE_FAILURE";
    /** A Zigbee route error command frame was received indicating that a message sent to this node along a many-to-one route failed en route */
    SLStatus[SLStatus["ZIGBEE_MANY_TO_ONE_ROUTE_FAILURE"] = 3092] = "ZIGBEE_MANY_TO_ONE_ROUTE_FAILURE";
    /** A critical and fatal error indicating that the version of the stack trying to run does not match with the chip it's running on */
    SLStatus[SLStatus["ZIGBEE_STACK_AND_HARDWARE_MISMATCH"] = 3093] = "ZIGBEE_STACK_AND_HARDWARE_MISMATCH";
    /** The local PAN ID has changed. The application can get the new PAN ID by calling ::emberGetPanId() */
    SLStatus[SLStatus["ZIGBEE_PAN_ID_CHANGED"] = 3094] = "ZIGBEE_PAN_ID_CHANGED";
    /** The channel has changed. */
    SLStatus[SLStatus["ZIGBEE_CHANNEL_CHANGED"] = 3095] = "ZIGBEE_CHANNEL_CHANGED";
    /** The network has been opened for joining. */
    SLStatus[SLStatus["ZIGBEE_NETWORK_OPENED"] = 3096] = "ZIGBEE_NETWORK_OPENED";
    /** The network has been closed for joining. */
    SLStatus[SLStatus["ZIGBEE_NETWORK_CLOSED"] = 3097] = "ZIGBEE_NETWORK_CLOSED";
    /**
     * An attempt was made to join a Secured Network using a pre-configured key, but the Trust Center sent back a
     * Network Key in-the-clear when an encrypted Network Key was required. (::EMBER_REQUIRE_ENCRYPTED_KEY)
     */
    SLStatus[SLStatus["ZIGBEE_RECEIVED_KEY_IN_THE_CLEAR"] = 3098] = "ZIGBEE_RECEIVED_KEY_IN_THE_CLEAR";
    /** An attempt was made to join a Secured Network, but the device did not receive a Network Key. */
    SLStatus[SLStatus["ZIGBEE_NO_NETWORK_KEY_RECEIVED"] = 3099] = "ZIGBEE_NO_NETWORK_KEY_RECEIVED";
    /** After a device joined a Secured Network, a Link Key was requested (::EMBER_GET_LINK_KEY_WHEN_JOINING) but no response was ever received. */
    SLStatus[SLStatus["ZIGBEE_NO_LINK_KEY_RECEIVED"] = 3100] = "ZIGBEE_NO_LINK_KEY_RECEIVED";
    /**
     * An attempt was made to join a Secured Network without a pre-configured key, but the Trust Center sent encrypted data using a
     * pre-configured key.
     */
    SLStatus[SLStatus["ZIGBEE_PRECONFIGURED_KEY_REQUIRED"] = 3101] = "ZIGBEE_PRECONFIGURED_KEY_REQUIRED";
    /** A Zigbee EZSP error has occured. Track the origin and corresponding EzspStatus for more info. */
    SLStatus[SLStatus["ZIGBEE_EZSP_ERROR"] = 3102] = "ZIGBEE_EZSP_ERROR";
    /** Node ID discovery failed. */
    SLStatus[SLStatus["ZIGBEE_ID_DISCOVERY_FAILED"] = 3103] = "ZIGBEE_ID_DISCOVERY_FAILED";
    /** Message was sent but no APS ACK received. */
    SLStatus[SLStatus["ZIGBEE_NO_APS_ACK"] = 3104] = "ZIGBEE_NO_APS_ACK";
    /** APS message was canceled. */
    SLStatus[SLStatus["ZIGBEE_APS_MESSAGE_CANCELED"] = 3105] = "ZIGBEE_APS_MESSAGE_CANCELED";
    /** Node ID discovery not enabled. */
    SLStatus[SLStatus["ZIGBEE_ID_DISCOVERY_NOT_ENABLED"] = 3106] = "ZIGBEE_ID_DISCOVERY_NOT_ENABLED";
    /** Message was not sent, Node ID discovery is underway. */
    SLStatus[SLStatus["ZIGBEE_ID_DISCOVERY_UNDERWAY"] = 3107] = "ZIGBEE_ID_DISCOVERY_UNDERWAY";
    /** The message was not sent because a route discovery is currently underway. There is no route to the target until the route discovery completes. */
    SLStatus[SLStatus["ZIGBEE_SEND_UNICAST_ROUTE_DISCOVERY_UNDERWAY"] = 3108] = "ZIGBEE_SEND_UNICAST_ROUTE_DISCOVERY_UNDERWAY";
    /** Radius is 0 or message has been dropped because route request failed or failed to submit message to tx queue. */
    SLStatus[SLStatus["ZIGBEE_SEND_UNICAST_FAILURE"] = 3109] = "ZIGBEE_SEND_UNICAST_FAILURE";
    /** No active route to the destination. */
    SLStatus[SLStatus["ZIGBEE_SEND_UNICAST_NO_ROUTE"] = 3110] = "ZIGBEE_SEND_UNICAST_NO_ROUTE";
    /** Broadcast message timeout while waiting for sleepy children to poll. */
    SLStatus[SLStatus["ZIGBEE_BROADCAST_TO_SLEEPY_CHILDREN_TIMEOUT"] = 3111] = "ZIGBEE_BROADCAST_TO_SLEEPY_CHILDREN_TIMEOUT";
    /** Expected a neighbor to relay the message, but none did. */
    SLStatus[SLStatus["ZIGBEE_BROADCAST_RELAY_FAILED"] = 3112] = "ZIGBEE_BROADCAST_RELAY_FAILED";
})(SLStatus || (exports.SLStatus = SLStatus = {}));
/** Status values used by EZSP. */
var EzspStatus;
(function (EzspStatus) {
    /** Success. */
    EzspStatus[EzspStatus["SUCCESS"] = 0] = "SUCCESS";
    /** Fatal error. */
    EzspStatus[EzspStatus["SPI_ERR_FATAL"] = 16] = "SPI_ERR_FATAL";
    /** The Response frame of the current transaction indicates the NCP has reset. */
    EzspStatus[EzspStatus["SPI_ERR_NCP_RESET"] = 17] = "SPI_ERR_NCP_RESET";
    /** The NCP is reporting that the Command frame of the current transaction is oversized (the length byte is too large). */
    EzspStatus[EzspStatus["SPI_ERR_OVERSIZED_EZSP_FRAME"] = 18] = "SPI_ERR_OVERSIZED_EZSP_FRAME";
    /** The Response frame of the current transaction indicates the previous transaction was aborted (nSSEL deasserted too soon). */
    EzspStatus[EzspStatus["SPI_ERR_ABORTED_TRANSACTION"] = 19] = "SPI_ERR_ABORTED_TRANSACTION";
    /** The Response frame of the current transaction indicates the frame terminator is missing from the Command frame. */
    EzspStatus[EzspStatus["SPI_ERR_MISSING_FRAME_TERMINATOR"] = 20] = "SPI_ERR_MISSING_FRAME_TERMINATOR";
    /** The NCP has not provided a Response within the time limit defined by WAIT_SECTION_TIMEOUT. */
    EzspStatus[EzspStatus["SPI_ERR_WAIT_SECTION_TIMEOUT"] = 21] = "SPI_ERR_WAIT_SECTION_TIMEOUT";
    /** The Response frame from the NCP is missing the frame terminator. */
    EzspStatus[EzspStatus["SPI_ERR_NO_FRAME_TERMINATOR"] = 22] = "SPI_ERR_NO_FRAME_TERMINATOR";
    /** The Host attempted to send an oversized Command (the length byte is too large) and the AVR's spi-protocol.c blocked the transmission. */
    EzspStatus[EzspStatus["SPI_ERR_EZSP_COMMAND_OVERSIZED"] = 23] = "SPI_ERR_EZSP_COMMAND_OVERSIZED";
    /** The NCP attempted to send an oversized Response (the length byte is too large) and the AVR's spi-protocol.c blocked the reception. */
    EzspStatus[EzspStatus["SPI_ERR_EZSP_RESPONSE_OVERSIZED"] = 24] = "SPI_ERR_EZSP_RESPONSE_OVERSIZED";
    /** The Host has sent the Command and is still waiting for the NCP to send a Response. */
    EzspStatus[EzspStatus["SPI_WAITING_FOR_RESPONSE"] = 25] = "SPI_WAITING_FOR_RESPONSE";
    /** The NCP has not asserted nHOST_INT within the time limit defined by WAKE_HANDSHAKE_TIMEOUT. */
    EzspStatus[EzspStatus["SPI_ERR_HANDSHAKE_TIMEOUT"] = 26] = "SPI_ERR_HANDSHAKE_TIMEOUT";
    /** The NCP has not asserted nHOST_INT after an NCP reset within the time limit defined by STARTUP_TIMEOUT. */
    EzspStatus[EzspStatus["SPI_ERR_STARTUP_TIMEOUT"] = 27] = "SPI_ERR_STARTUP_TIMEOUT";
    /** The Host attempted to verify the SPI Protocol activity and version number, and the verification failed. */
    EzspStatus[EzspStatus["SPI_ERR_STARTUP_FAIL"] = 28] = "SPI_ERR_STARTUP_FAIL";
    /** The Host has sent a command with a SPI Byte that is unsupported by the current mode the NCP is operating in. */
    EzspStatus[EzspStatus["SPI_ERR_UNSUPPORTED_SPI_COMMAND"] = 29] = "SPI_ERR_UNSUPPORTED_SPI_COMMAND";
    /** Operation not yet complete. */
    EzspStatus[EzspStatus["ASH_IN_PROGRESS"] = 32] = "ASH_IN_PROGRESS";
    /** Fatal error detected by host. */
    EzspStatus[EzspStatus["HOST_FATAL_ERROR"] = 33] = "HOST_FATAL_ERROR";
    /** Fatal error detected by NCP. */
    EzspStatus[EzspStatus["ASH_NCP_FATAL_ERROR"] = 34] = "ASH_NCP_FATAL_ERROR";
    /** Tried to send DATA frame too long. */
    EzspStatus[EzspStatus["DATA_FRAME_TOO_LONG"] = 35] = "DATA_FRAME_TOO_LONG";
    /** Tried to send DATA frame too short. */
    EzspStatus[EzspStatus["DATA_FRAME_TOO_SHORT"] = 36] = "DATA_FRAME_TOO_SHORT";
    /** No space for tx'ed DATA frame. */
    EzspStatus[EzspStatus["NO_TX_SPACE"] = 37] = "NO_TX_SPACE";
    /** No space for rec'd DATA frame. */
    EzspStatus[EzspStatus["NO_RX_SPACE"] = 38] = "NO_RX_SPACE";
    /** No receive data available. */
    EzspStatus[EzspStatus["NO_RX_DATA"] = 39] = "NO_RX_DATA";
    /** Not in Connected state. */
    EzspStatus[EzspStatus["NOT_CONNECTED"] = 40] = "NOT_CONNECTED";
    /** The NCP received a command before the EZSP version had been set. */
    EzspStatus[EzspStatus["ERROR_VERSION_NOT_SET"] = 48] = "ERROR_VERSION_NOT_SET";
    /** The NCP received a command containing an unsupported frame ID. */
    EzspStatus[EzspStatus["ERROR_INVALID_FRAME_ID"] = 49] = "ERROR_INVALID_FRAME_ID";
    /** The direction flag in the frame control field was incorrect. */
    EzspStatus[EzspStatus["ERROR_WRONG_DIRECTION"] = 50] = "ERROR_WRONG_DIRECTION";
    /**
     * The truncated flag in the frame control field was set, indicating there was not enough memory available to
     * complete the response or that the response would have exceeded the maximum EZSP frame length.
     */
    EzspStatus[EzspStatus["ERROR_TRUNCATED"] = 51] = "ERROR_TRUNCATED";
    /**
     * The overflow flag in the frame control field was set, indicating one or more callbacks occurred since the previous
     * response and there was not enough memory available to report them to the Host.
     */
    EzspStatus[EzspStatus["ERROR_OVERFLOW"] = 52] = "ERROR_OVERFLOW";
    /** Insufficient memory was available. */
    EzspStatus[EzspStatus["ERROR_OUT_OF_MEMORY"] = 53] = "ERROR_OUT_OF_MEMORY";
    /** The value was out of bounds. */
    EzspStatus[EzspStatus["ERROR_INVALID_VALUE"] = 54] = "ERROR_INVALID_VALUE";
    /** The configuration id was not recognized. */
    EzspStatus[EzspStatus["ERROR_INVALID_ID"] = 55] = "ERROR_INVALID_ID";
    /** Configuration values can no longer be modified. */
    EzspStatus[EzspStatus["ERROR_INVALID_CALL"] = 56] = "ERROR_INVALID_CALL";
    /** The NCP failed to respond to a command. */
    EzspStatus[EzspStatus["ERROR_NO_RESPONSE"] = 57] = "ERROR_NO_RESPONSE";
    /** The length of the command exceeded the maximum EZSP frame length. */
    EzspStatus[EzspStatus["ERROR_COMMAND_TOO_LONG"] = 64] = "ERROR_COMMAND_TOO_LONG";
    /** The UART receive queue was full causing a callback response to be dropped. */
    EzspStatus[EzspStatus["ERROR_QUEUE_FULL"] = 65] = "ERROR_QUEUE_FULL";
    /** The command has been filtered out by NCP. */
    EzspStatus[EzspStatus["ERROR_COMMAND_FILTERED"] = 66] = "ERROR_COMMAND_FILTERED";
    /** EZSP Security Key is already set */
    EzspStatus[EzspStatus["ERROR_SECURITY_KEY_ALREADY_SET"] = 67] = "ERROR_SECURITY_KEY_ALREADY_SET";
    /** EZSP Security Type is invalid */
    EzspStatus[EzspStatus["ERROR_SECURITY_TYPE_INVALID"] = 68] = "ERROR_SECURITY_TYPE_INVALID";
    /** EZSP Security Parameters are invalid */
    EzspStatus[EzspStatus["ERROR_SECURITY_PARAMETERS_INVALID"] = 69] = "ERROR_SECURITY_PARAMETERS_INVALID";
    /** EZSP Security Parameters are already set */
    EzspStatus[EzspStatus["ERROR_SECURITY_PARAMETERS_ALREADY_SET"] = 70] = "ERROR_SECURITY_PARAMETERS_ALREADY_SET";
    /** EZSP Security Key is not set */
    EzspStatus[EzspStatus["ERROR_SECURITY_KEY_NOT_SET"] = 71] = "ERROR_SECURITY_KEY_NOT_SET";
    /** EZSP Security Parameters are not set */
    EzspStatus[EzspStatus["ERROR_SECURITY_PARAMETERS_NOT_SET"] = 72] = "ERROR_SECURITY_PARAMETERS_NOT_SET";
    /** Received frame with unsupported control byte */
    EzspStatus[EzspStatus["ERROR_UNSUPPORTED_CONTROL"] = 73] = "ERROR_UNSUPPORTED_CONTROL";
    /** Received frame is unsecure, when security is established */
    EzspStatus[EzspStatus["ERROR_UNSECURE_FRAME"] = 74] = "ERROR_UNSECURE_FRAME";
    /** Incompatible ASH version */
    EzspStatus[EzspStatus["ASH_ERROR_VERSION"] = 80] = "ASH_ERROR_VERSION";
    /** Exceeded max ACK timeouts */
    EzspStatus[EzspStatus["ASH_ERROR_TIMEOUTS"] = 81] = "ASH_ERROR_TIMEOUTS";
    /** Timed out waiting for RSTACK */
    EzspStatus[EzspStatus["ASH_ERROR_RESET_FAIL"] = 82] = "ASH_ERROR_RESET_FAIL";
    /** Unexpected ncp reset */
    EzspStatus[EzspStatus["ASH_ERROR_NCP_RESET"] = 83] = "ASH_ERROR_NCP_RESET";
    /** Serial port initialization failed */
    EzspStatus[EzspStatus["ERROR_SERIAL_INIT"] = 84] = "ERROR_SERIAL_INIT";
    /** Invalid ncp processor type */
    EzspStatus[EzspStatus["ASH_ERROR_NCP_TYPE"] = 85] = "ASH_ERROR_NCP_TYPE";
    /** Invalid ncp reset method */
    EzspStatus[EzspStatus["ASH_ERROR_RESET_METHOD"] = 86] = "ASH_ERROR_RESET_METHOD";
    /** XON/XOFF not supported by host driver */
    EzspStatus[EzspStatus["ASH_ERROR_XON_XOFF"] = 87] = "ASH_ERROR_XON_XOFF";
    /** ASH protocol started */
    EzspStatus[EzspStatus["ASH_STARTED"] = 112] = "ASH_STARTED";
    /** ASH protocol connected */
    EzspStatus[EzspStatus["ASH_CONNECTED"] = 113] = "ASH_CONNECTED";
    /** ASH protocol disconnected */
    EzspStatus[EzspStatus["ASH_DISCONNECTED"] = 114] = "ASH_DISCONNECTED";
    /** Timer expired waiting for ack */
    EzspStatus[EzspStatus["ASH_ACK_TIMEOUT"] = 115] = "ASH_ACK_TIMEOUT";
    /** Frame in progress cancelled */
    EzspStatus[EzspStatus["ASH_CANCELLED"] = 116] = "ASH_CANCELLED";
    /** Received frame out of sequence */
    EzspStatus[EzspStatus["ASH_OUT_OF_SEQUENCE"] = 117] = "ASH_OUT_OF_SEQUENCE";
    /** Received frame with CRC error */
    EzspStatus[EzspStatus["ASH_BAD_CRC"] = 118] = "ASH_BAD_CRC";
    /** Received frame with comm error */
    EzspStatus[EzspStatus["ASH_COMM_ERROR"] = 119] = "ASH_COMM_ERROR";
    /** Received frame with bad ackNum */
    EzspStatus[EzspStatus["ASH_BAD_ACKNUM"] = 120] = "ASH_BAD_ACKNUM";
    /** Received frame shorter than minimum */
    EzspStatus[EzspStatus["ASH_TOO_SHORT"] = 121] = "ASH_TOO_SHORT";
    /** Received frame longer than maximum */
    EzspStatus[EzspStatus["ASH_TOO_LONG"] = 122] = "ASH_TOO_LONG";
    /** Received frame with illegal control byte */
    EzspStatus[EzspStatus["ASH_BAD_CONTROL"] = 123] = "ASH_BAD_CONTROL";
    /** Received frame with illegal length for its type */
    EzspStatus[EzspStatus["ASH_BAD_LENGTH"] = 124] = "ASH_BAD_LENGTH";
    /** Received ASH Ack */
    EzspStatus[EzspStatus["ASH_ACK_RECEIVED"] = 125] = "ASH_ACK_RECEIVED";
    /** Sent ASH Ack */
    EzspStatus[EzspStatus["ASH_ACK_SENT"] = 126] = "ASH_ACK_SENT";
    /** Received ASH Nak */
    EzspStatus[EzspStatus["ASH_NAK_RECEIVED"] = 127] = "ASH_NAK_RECEIVED";
    /** Sent ASH Nak */
    EzspStatus[EzspStatus["ASH_NAK_SENT"] = 128] = "ASH_NAK_SENT";
    /** Received ASH RST */
    EzspStatus[EzspStatus["ASH_RST_RECEIVED"] = 129] = "ASH_RST_RECEIVED";
    /** Sent ASH RST */
    EzspStatus[EzspStatus["ASH_RST_SENT"] = 130] = "ASH_RST_SENT";
    /** ASH Status */
    EzspStatus[EzspStatus["ASH_STATUS"] = 131] = "ASH_STATUS";
    /** ASH TX */
    EzspStatus[EzspStatus["ASH_TX"] = 132] = "ASH_TX";
    /** ASH RX */
    EzspStatus[EzspStatus["ASH_RX"] = 133] = "ASH_RX";
    /** Failed to connect to CPC daemon or failed to open CPC endpoint */
    EzspStatus[EzspStatus["CPC_ERROR_INIT"] = 134] = "CPC_ERROR_INIT";
    /** No reset or error */
    EzspStatus[EzspStatus["NO_ERROR"] = 255] = "NO_ERROR";
})(EzspStatus || (exports.EzspStatus = EzspStatus = {}));
var EmberStackError;
(function (EmberStackError) {
    // Error codes that a router uses to notify the message initiator about a broken route.
    EmberStackError[EmberStackError["ROUTE_ERROR_NO_ROUTE_AVAILABLE"] = 0] = "ROUTE_ERROR_NO_ROUTE_AVAILABLE";
    EmberStackError[EmberStackError["ROUTE_ERROR_TREE_LINK_FAILURE"] = 1] = "ROUTE_ERROR_TREE_LINK_FAILURE";
    EmberStackError[EmberStackError["ROUTE_ERROR_NON_TREE_LINK_FAILURE"] = 2] = "ROUTE_ERROR_NON_TREE_LINK_FAILURE";
    EmberStackError[EmberStackError["ROUTE_ERROR_LOW_BATTERY_LEVEL"] = 3] = "ROUTE_ERROR_LOW_BATTERY_LEVEL";
    EmberStackError[EmberStackError["ROUTE_ERROR_NO_ROUTING_CAPACITY"] = 4] = "ROUTE_ERROR_NO_ROUTING_CAPACITY";
    EmberStackError[EmberStackError["ROUTE_ERROR_NO_INDIRECT_CAPACITY"] = 5] = "ROUTE_ERROR_NO_INDIRECT_CAPACITY";
    EmberStackError[EmberStackError["ROUTE_ERROR_INDIRECT_TRANSACTION_EXPIRY"] = 6] = "ROUTE_ERROR_INDIRECT_TRANSACTION_EXPIRY";
    EmberStackError[EmberStackError["ROUTE_ERROR_TARGET_DEVICE_UNAVAILABLE"] = 7] = "ROUTE_ERROR_TARGET_DEVICE_UNAVAILABLE";
    EmberStackError[EmberStackError["ROUTE_ERROR_TARGET_ADDRESS_UNALLOCATED"] = 8] = "ROUTE_ERROR_TARGET_ADDRESS_UNALLOCATED";
    EmberStackError[EmberStackError["ROUTE_ERROR_PARENT_LINK_FAILURE"] = 9] = "ROUTE_ERROR_PARENT_LINK_FAILURE";
    EmberStackError[EmberStackError["ROUTE_ERROR_VALIDATE_ROUTE"] = 10] = "ROUTE_ERROR_VALIDATE_ROUTE";
    EmberStackError[EmberStackError["ROUTE_ERROR_SOURCE_ROUTE_FAILURE"] = 11] = "ROUTE_ERROR_SOURCE_ROUTE_FAILURE";
    EmberStackError[EmberStackError["ROUTE_ERROR_MANY_TO_ONE_ROUTE_FAILURE"] = 12] = "ROUTE_ERROR_MANY_TO_ONE_ROUTE_FAILURE";
    EmberStackError[EmberStackError["ROUTE_ERROR_ADDRESS_CONFLICT"] = 13] = "ROUTE_ERROR_ADDRESS_CONFLICT";
    EmberStackError[EmberStackError["ROUTE_ERROR_VERIFY_ADDRESSES"] = 14] = "ROUTE_ERROR_VERIFY_ADDRESSES";
    EmberStackError[EmberStackError["ROUTE_ERROR_PAN_IDENTIFIER_UPDATE"] = 15] = "ROUTE_ERROR_PAN_IDENTIFIER_UPDATE";
    EmberStackError[EmberStackError["NETWORK_STATUS_NETWORK_ADDRESS_UPDATE"] = 16] = "NETWORK_STATUS_NETWORK_ADDRESS_UPDATE";
    EmberStackError[EmberStackError["NETWORK_STATUS_BAD_FRAME_COUNTER"] = 17] = "NETWORK_STATUS_BAD_FRAME_COUNTER";
    EmberStackError[EmberStackError["NETWORK_STATUS_BAD_KEY_SEQUENCE_NUMBER"] = 18] = "NETWORK_STATUS_BAD_KEY_SEQUENCE_NUMBER";
    EmberStackError[EmberStackError["NETWORK_STATUS_UNKNOWN_COMMAND"] = 19] = "NETWORK_STATUS_UNKNOWN_COMMAND";
})(EmberStackError || (exports.EmberStackError = EmberStackError = {}));
var EmberGPStatus;
(function (EmberGPStatus) {
    /** Success Status */
    EmberGPStatus[EmberGPStatus["OK"] = 0] = "OK";
    /** Match Frame */
    EmberGPStatus[EmberGPStatus["MATCH"] = 1] = "MATCH";
    /** Drop Frame */
    EmberGPStatus[EmberGPStatus["DROP_FRAME"] = 2] = "DROP_FRAME";
    /** Frame Unprocessed */
    EmberGPStatus[EmberGPStatus["UNPROCESSED"] = 3] = "UNPROCESSED";
    /** Frame Pass Unprocessed */
    EmberGPStatus[EmberGPStatus["PASS_UNPROCESSED"] = 4] = "PASS_UNPROCESSED";
    /** Frame TX Then Drop */
    EmberGPStatus[EmberGPStatus["TX_THEN_DROP"] = 5] = "TX_THEN_DROP";
    /** No Security */
    EmberGPStatus[EmberGPStatus["NO_SECURITY"] = 6] = "NO_SECURITY";
    /** Security Failure */
    EmberGPStatus[EmberGPStatus["AUTH_FAILURE"] = 7] = "AUTH_FAILURE";
})(EmberGPStatus || (exports.EmberGPStatus = EmberGPStatus = {}));
/** Type of Ember software version */
var EmberVersionType;
(function (EmberVersionType) {
    EmberVersionType[EmberVersionType["PRE_RELEASE"] = 0] = "PRE_RELEASE";
    // Alpha, should be used rarely
    EmberVersionType[EmberVersionType["ALPHA_1"] = 17] = "ALPHA_1";
    EmberVersionType[EmberVersionType["ALPHA_2"] = 18] = "ALPHA_2";
    EmberVersionType[EmberVersionType["ALPHA_3"] = 19] = "ALPHA_3";
    // Leave space in case we decide to add other types in the future.
    EmberVersionType[EmberVersionType["BETA_1"] = 33] = "BETA_1";
    EmberVersionType[EmberVersionType["BETA_2"] = 34] = "BETA_2";
    EmberVersionType[EmberVersionType["BETA_3"] = 35] = "BETA_3";
    // Anything other than 0xAA is considered pre-release
    // Silicon Labs may define other types in the future (e.g. beta, alpha)
    // Silicon Labs chose an arbitrary number (0xAA) to allow for expansion, but
    // to prevent ambiguity in case 0x00 or 0xFF is accidentally retrieved
    // as the version type.
    EmberVersionType[EmberVersionType["GA"] = 170] = "GA";
})(EmberVersionType || (exports.EmberVersionType = EmberVersionType = {}));
/**
 * For emberSetTxPowerMode and mfglibSetPower.
 * uint16_t
 */
var EmberTXPowerMode;
(function (EmberTXPowerMode) {
    /**
     * The application should call ::emberSetTxPowerMode() with the
     * txPowerMode parameter set to this value to disable all power mode options,
     * resulting in normal power mode and bi-directional RF transmitter output.
     */
    EmberTXPowerMode[EmberTXPowerMode["DEFAULT"] = 0] = "DEFAULT";
    /**
     * The application should call ::emberSetTxPowerMode() with the
     * txPowerMode parameter set to this value to enable boost power mode.
     */
    EmberTXPowerMode[EmberTXPowerMode["BOOST"] = 1] = "BOOST";
    /**
     * The application should call ::emberSetTxPowerMode() with the
     * txPowerMode parameter set to this value to enable the alternate transmitter
     * output.
     */
    EmberTXPowerMode[EmberTXPowerMode["ALTERNATE"] = 2] = "ALTERNATE";
    /**
     * The application should call ::emberSetTxPowerMode() with the
     * txPowerMode parameter set to this value to enable both boost mode and the
     * alternate transmitter output.
     */
    EmberTXPowerMode[EmberTXPowerMode["BOOST_AND_ALTERNATE"] = 3] = "BOOST_AND_ALTERNATE";
    // The application does not ever need to call emberSetTxPowerMode() with the
    // txPowerMode parameter set to this value.  This value is used internally by
    // the stack to indicate that the default token configuration has not been
    // overridden by a prior call to emberSetTxPowerMode().
    EmberTXPowerMode[EmberTXPowerMode["USE_TOKEN"] = 32768] = "USE_TOKEN";
})(EmberTXPowerMode || (exports.EmberTXPowerMode = EmberTXPowerMode = {}));
/** uint8_t */
var EmberKeepAliveMode;
(function (EmberKeepAliveMode) {
    EmberKeepAliveMode[EmberKeepAliveMode["KEEP_ALIVE_SUPPORT_UNKNOWN"] = 0] = "KEEP_ALIVE_SUPPORT_UNKNOWN";
    EmberKeepAliveMode[EmberKeepAliveMode["MAC_DATA_POLL_KEEP_ALIVE"] = 1] = "MAC_DATA_POLL_KEEP_ALIVE";
    EmberKeepAliveMode[EmberKeepAliveMode["END_DEVICE_TIMEOUT_KEEP_ALIVE"] = 2] = "END_DEVICE_TIMEOUT_KEEP_ALIVE";
    EmberKeepAliveMode[EmberKeepAliveMode["KEEP_ALIVE_SUPPORT_ALL"] = 3] = "KEEP_ALIVE_SUPPORT_ALL";
})(EmberKeepAliveMode || (exports.EmberKeepAliveMode = EmberKeepAliveMode = {}));
/** This is the Extended Security Bitmask that controls the use of various extended security features. */
var EmberExtendedSecurityBitmask;
(function (EmberExtendedSecurityBitmask) {
    /**
     * If this bit is set, the 'key token data' field is set in the Initial Security Bitmask to 0 (No Preconfig Key token).
     * Otherwise, the field is left as is.
     */
    EmberExtendedSecurityBitmask[EmberExtendedSecurityBitmask["PRECONFIG_KEY_NOT_VALID"] = 1] = "PRECONFIG_KEY_NOT_VALID";
    // bits 2-3 are unused.
    /**
     * This denotes that the network key update can only happen if the network key update request is unicast and encrypted
     * i.e. broadcast network key update requests will not be processed if bit 1 is set
     */
    EmberExtendedSecurityBitmask[EmberExtendedSecurityBitmask["SECURE_NETWORK_KEY_ROTATION"] = 2] = "SECURE_NETWORK_KEY_ROTATION";
    /** This denotes whether a joiner node (router or end-device) uses a Global Link Key or a Unique Link Key. */
    EmberExtendedSecurityBitmask[EmberExtendedSecurityBitmask["JOINER_GLOBAL_LINK_KEY"] = 16] = "JOINER_GLOBAL_LINK_KEY";
    /**
     * This denotes whether the device's outgoing frame counter is allowed to be reset during forming or joining.
     * If the flag is set, the outgoing frame counter is not allowed to be reset.
     * If the flag is not set, the frame counter is allowed to be reset.
     */
    EmberExtendedSecurityBitmask[EmberExtendedSecurityBitmask["EXT_NO_FRAME_COUNTER_RESET"] = 32] = "EXT_NO_FRAME_COUNTER_RESET";
    /** This denotes whether a device should discard or accept network leave without rejoin commands. */
    EmberExtendedSecurityBitmask[EmberExtendedSecurityBitmask["NWK_LEAVE_WITHOUT_REJOIN_NOT_ALLOWED"] = 64] = "NWK_LEAVE_WITHOUT_REJOIN_NOT_ALLOWED";
    // Bit 7 reserved for future use (stored in TOKEN).
    /** This denotes whether a router node should discard or accept network Leave Commands. */
    EmberExtendedSecurityBitmask[EmberExtendedSecurityBitmask["NWK_LEAVE_REQUEST_NOT_ALLOWED"] = 256] = "NWK_LEAVE_REQUEST_NOT_ALLOWED";
    /**
     * This denotes whether a node is running the latest stack specification or is emulating R18 specs behavior.
     * If this flag is enabled, a router node should only send encrypted Update Device messages while the TC
     * should only accept encrypted Updated Device messages.
     */
    EmberExtendedSecurityBitmask[EmberExtendedSecurityBitmask["R18_STACK_BEHAVIOR"] = 512] = "R18_STACK_BEHAVIOR";
    // Bit 10 is reserved for future use (stored in TOKEN).
    // Bit 11 is reserved for future use(stored in RAM).
    // Bit 12 - This denotes whether an end device should discard or accept ZDO Leave
    // from a network node other than its parent.
    EmberExtendedSecurityBitmask[EmberExtendedSecurityBitmask["ZDO_LEAVE_FROM_NON_PARENT_NOT_ALLOWED"] = 4096] = "ZDO_LEAVE_FROM_NON_PARENT_NOT_ALLOWED";
    // Bits 13-15 are unused.
})(EmberExtendedSecurityBitmask || (exports.EmberExtendedSecurityBitmask = EmberExtendedSecurityBitmask = {}));
/** This is the Initial Security Bitmask that controls the use of various security features. */
var EmberInitialSecurityBitmask;
(function (EmberInitialSecurityBitmask) {
    /** Enables Distributed Trust Center Mode for the device forming the network. (Previously known as ::EMBER_NO_TRUST_CENTER_MODE) */
    EmberInitialSecurityBitmask[EmberInitialSecurityBitmask["DISTRIBUTED_TRUST_CENTER_MODE"] = 2] = "DISTRIBUTED_TRUST_CENTER_MODE";
    /** Enables a Global Link Key for the Trust Center. All nodes will share the same Trust Center Link Key. */
    EmberInitialSecurityBitmask[EmberInitialSecurityBitmask["TRUST_CENTER_GLOBAL_LINK_KEY"] = 4] = "TRUST_CENTER_GLOBAL_LINK_KEY";
    /** Enables devices that perform MAC Association with a pre-configured Network Key to join the network. It is only set on the Trust Center. */
    EmberInitialSecurityBitmask[EmberInitialSecurityBitmask["PRECONFIGURED_NETWORK_KEY_MODE"] = 8] = "PRECONFIGURED_NETWORK_KEY_MODE";
    // Hidden field used internally.
    EmberInitialSecurityBitmask[EmberInitialSecurityBitmask["HAVE_TRUST_CENTER_UNKNOWN_KEY_TOKEN"] = 16] = "HAVE_TRUST_CENTER_UNKNOWN_KEY_TOKEN";
    // Hidden field used internally.
    EmberInitialSecurityBitmask[EmberInitialSecurityBitmask["HAVE_TRUST_CENTER_LINK_KEY_TOKEN"] = 32] = "HAVE_TRUST_CENTER_LINK_KEY_TOKEN";
    /**
     * This denotes that the ::EmberInitialSecurityState::preconfiguredTrustCenterEui64 has a value in it containing the trust center EUI64.
     * The device will only join a network and accept commands from a trust center with that EUI64.
     * Normally this bit is NOT set and the EUI64 of the trust center is learned during the join process.
     * When commissioning a device to join onto an existing network that is using a trust center and without sending any messages,
     * this bit must be set and the field ::EmberInitialSecurityState::preconfiguredTrustCenterEui64 must be populated with the appropriate EUI64.
     */
    EmberInitialSecurityBitmask[EmberInitialSecurityBitmask["HAVE_TRUST_CENTER_EUI64"] = 64] = "HAVE_TRUST_CENTER_EUI64";
    /**
     * This denotes that the ::EmberInitialSecurityState::preconfiguredKey is not the actual Link Key but a Root Key known only to the Trust Center.
     * It is hashed with the IEEE Address of the destination device to create the actual Link Key used in encryption.
     * This is bit is only used by the Trust Center. The joining device need not set this.
     */
    EmberInitialSecurityBitmask[EmberInitialSecurityBitmask["TRUST_CENTER_USES_HASHED_LINK_KEY"] = 132] = "TRUST_CENTER_USES_HASHED_LINK_KEY";
    /**
     * This denotes that the ::EmberInitialSecurityState::preconfiguredKey element has valid data that should be used to configure
     * the initial security state.
     */
    EmberInitialSecurityBitmask[EmberInitialSecurityBitmask["HAVE_PRECONFIGURED_KEY"] = 256] = "HAVE_PRECONFIGURED_KEY";
    /**
     * This denotes that the ::EmberInitialSecurityState::networkKey element has valid data that should be used to configure
     * the initial security state.
     */
    EmberInitialSecurityBitmask[EmberInitialSecurityBitmask["HAVE_NETWORK_KEY"] = 512] = "HAVE_NETWORK_KEY";
    /**
     * This denotes to a joining node that it should attempt to acquire a Trust Center Link Key during joining.
     * This is necessary if the device does not have a pre-configured key, or wants to obtain a new one
     * (since it may be using a well-known key during joining).
     */
    EmberInitialSecurityBitmask[EmberInitialSecurityBitmask["GET_LINK_KEY_WHEN_JOINING"] = 1024] = "GET_LINK_KEY_WHEN_JOINING";
    /**
     * This denotes that a joining device should only accept an encrypted network key from the Trust Center (using its pre-configured key).
     * A key sent in-the-clear by the Trust Center will be rejected and the join will fail.
     * This option is only valid when using a pre-configured key.
     */
    EmberInitialSecurityBitmask[EmberInitialSecurityBitmask["REQUIRE_ENCRYPTED_KEY"] = 2048] = "REQUIRE_ENCRYPTED_KEY";
    /**
     * This denotes whether the device should NOT reset its outgoing frame counters (both NWK and APS) when
     * ::emberSetInitialSecurityState() is called.
     * Normally it is advised to reset the frame counter before joining a new network.
     * However, when a device is joining to the same network again (but not using ::emberRejoinNetwork()),
     * it should keep the NWK and APS frame counters stored in its tokens.
     *
     * NOTE: The application is allowed to dynamically change the behavior via EMBER_EXT_NO_FRAME_COUNTER_RESET field.
     */
    EmberInitialSecurityBitmask[EmberInitialSecurityBitmask["NO_FRAME_COUNTER_RESET"] = 4096] = "NO_FRAME_COUNTER_RESET";
    /**
     * This denotes that the device should obtain its pre-configured key from an installation code stored in the manufacturing token.
     * The token contains a value that will be hashed to obtain the actual pre-configured key.
     * If that token is not valid, the call to ::emberSetInitialSecurityState() will fail.
     */
    EmberInitialSecurityBitmask[EmberInitialSecurityBitmask["GET_PRECONFIGURED_KEY_FROM_INSTALL_CODE"] = 8192] = "GET_PRECONFIGURED_KEY_FROM_INSTALL_CODE";
    // Internal data
    EmberInitialSecurityBitmask[EmberInitialSecurityBitmask["EM_SAVED_IN_TOKEN"] = 16384] = "EM_SAVED_IN_TOKEN";
    /* All other bits are reserved and must be zero. */
})(EmberInitialSecurityBitmask || (exports.EmberInitialSecurityBitmask = EmberInitialSecurityBitmask = {}));
/** Either marks an event as inactive or specifies the units for the event execution time. uint8_t */
var EmberEventUnits;
(function (EmberEventUnits) {
    /** The event is not scheduled to run. */
    EmberEventUnits[EmberEventUnits["INACTIVE"] = 0] = "INACTIVE";
    /** The execution time is in approximate milliseconds.  */
    EmberEventUnits[EmberEventUnits["MS_TIME"] = 1] = "MS_TIME";
    /** The execution time is in 'binary' quarter seconds (256 approximate milliseconds each). */
    EmberEventUnits[EmberEventUnits["QS_TIME"] = 2] = "QS_TIME";
    /** The execution time is in 'binary' minutes (65536 approximate milliseconds each). */
    EmberEventUnits[EmberEventUnits["MINUTE_TIME"] = 3] = "MINUTE_TIME";
    /** The event is scheduled to run at the earliest opportunity. */
    EmberEventUnits[EmberEventUnits["ZERO_DELAY"] = 4] = "ZERO_DELAY";
})(EmberEventUnits || (exports.EmberEventUnits = EmberEventUnits = {}));
/**
 * Defines the events reported to the application by the ::emberCounterHandler().
 * Usage of the destinationNodeId or data fields found in the EmberCounterInfo or EmberExtraCounterInfo
 * structs is denoted for counter types that use them.
 * (See comments accompanying enum definitions in this source file for details.)
 */
var EmberCounterType;
(function (EmberCounterType) {
    /**
     * The MAC received a broadcast Data frame, Command frame, or Beacon.
     * - destinationNodeId: BROADCAST_ADDRESS or Data frames or sender node ID for Beacon frames
     * - data: not used
     */
    EmberCounterType[EmberCounterType["MAC_RX_BROADCAST"] = 0] = "MAC_RX_BROADCAST";
    /**
     * The MAC transmitted a broadcast Data frame, Command frame or Beacon.
     * - destinationNodeId: BROADCAST_ADDRESS
     * - data: not used
     */
    EmberCounterType[EmberCounterType["MAC_TX_BROADCAST"] = 1] = "MAC_TX_BROADCAST";
    /**
     * The MAC received a unicast Data or Command frame.
     * - destinationNodeId: MAC layer source or EMBER_UNKNOWN_NODE_ID if no 16-bit source node ID is present in the frame
     * - data: not used
     */
    EmberCounterType[EmberCounterType["MAC_RX_UNICAST"] = 2] = "MAC_RX_UNICAST";
    /**
     * The MAC successfully transmitted a unicast Data or Command frame.
     *   Note: Only frames with a 16-bit destination node ID are counted.
     * - destinationNodeId: MAC layer destination address
     * - data: not used
     */
    EmberCounterType[EmberCounterType["MAC_TX_UNICAST_SUCCESS"] = 3] = "MAC_TX_UNICAST_SUCCESS";
    /**
     * The MAC retried a unicast Data or Command frame after initial Tx attempt.
     *   Note: CSMA-related failures are tracked separately via PHY_CCA_FAIL_COUNT.
     * - destinationNodeId: MAC layer destination or EMBER_UNKNOWN_NODE_ID if no 16-bit destination node ID is present in the frame
     * - data: number of retries (after initial Tx attempt) accumulated so far for this packet. (Should always be >0.)
     */
    EmberCounterType[EmberCounterType["MAC_TX_UNICAST_RETRY"] = 4] = "MAC_TX_UNICAST_RETRY";
    /**
     * The MAC unsuccessfully transmitted a unicast Data or Command frame.
     *   Note: Only frames with a 16-bit destination node ID are counted.
     * - destinationNodeId: MAC layer destination address
     * - data: not used
     */
    EmberCounterType[EmberCounterType["MAC_TX_UNICAST_FAILED"] = 5] = "MAC_TX_UNICAST_FAILED";
    /**
     * The APS layer received a data broadcast.
     * - destinationNodeId: sender's node ID
     * - data: not used
     */
    EmberCounterType[EmberCounterType["APS_DATA_RX_BROADCAST"] = 6] = "APS_DATA_RX_BROADCAST";
    /** The APS layer transmitted a data broadcast. */
    EmberCounterType[EmberCounterType["APS_DATA_TX_BROADCAST"] = 7] = "APS_DATA_TX_BROADCAST";
    /**
     * The APS layer received a data unicast.
     * - destinationNodeId: sender's node ID
     * - data: not used
     */
    EmberCounterType[EmberCounterType["APS_DATA_RX_UNICAST"] = 8] = "APS_DATA_RX_UNICAST";
    /**
     * The APS layer successfully transmitted a data unicast.
     * - destinationNodeId: NWK destination address
     * - data: number of APS retries (>=0) consumed for this unicast.
     */
    EmberCounterType[EmberCounterType["APS_DATA_TX_UNICAST_SUCCESS"] = 9] = "APS_DATA_TX_UNICAST_SUCCESS";
    /**
     * The APS layer retried a unicast Data frame.
     * This is a placeholder and is not used by the @c ::emberCounterHandler() callback.
     * Instead, the number of APS retries are returned in the data parameter of the callback
     * for the @c ::APS_DATA_TX_UNICAST_SUCCESS and @c ::APS_DATA_TX_UNICAST_FAILED types.
     * However, our supplied Counters component code will attempt to collect this information
     * from the aforementioned counters and populate this counter.
     * Note that this counter's behavior differs from that of @c ::MAC_TX_UNICAST_RETRY .
     */
    EmberCounterType[EmberCounterType["APS_DATA_TX_UNICAST_RETRY"] = 10] = "APS_DATA_TX_UNICAST_RETRY";
    /**
     * The APS layer unsuccessfully transmitted a data unicast.
     * - destinationNodeId: NWK destination address
     * - data: number of APS retries (>=0) consumed for this unicast.
     */
    EmberCounterType[EmberCounterType["APS_DATA_TX_UNICAST_FAILED"] = 11] = "APS_DATA_TX_UNICAST_FAILED";
    /** The network layer successfully submitted a new route discovery to the MAC. */
    EmberCounterType[EmberCounterType["ROUTE_DISCOVERY_INITIATED"] = 12] = "ROUTE_DISCOVERY_INITIATED";
    /** An entry was added to the neighbor table. */
    EmberCounterType[EmberCounterType["NEIGHBOR_ADDED"] = 13] = "NEIGHBOR_ADDED";
    /** An entry was removed from the neighbor table. */
    EmberCounterType[EmberCounterType["NEIGHBOR_REMOVED"] = 14] = "NEIGHBOR_REMOVED";
    /** A neighbor table entry became stale because it had not been heard from. */
    EmberCounterType[EmberCounterType["NEIGHBOR_STALE"] = 15] = "NEIGHBOR_STALE";
    /**
     * A node joined or rejoined to the network via this node.
     * - destinationNodeId: node ID of child
     * - data: not used
     */
    EmberCounterType[EmberCounterType["JOIN_INDICATION"] = 16] = "JOIN_INDICATION";
    /**
     * An entry was removed from the child table.
     * - destinationNodeId: node ID of child
     * - data: not used
     */
    EmberCounterType[EmberCounterType["CHILD_REMOVED"] = 17] = "CHILD_REMOVED";
    /** EZSP-UART only. An overflow error occurred in the UART. */
    EmberCounterType[EmberCounterType["ASH_OVERFLOW_ERROR"] = 18] = "ASH_OVERFLOW_ERROR";
    /** EZSP-UART only. A framing error occurred in the UART. */
    EmberCounterType[EmberCounterType["ASH_FRAMING_ERROR"] = 19] = "ASH_FRAMING_ERROR";
    /** EZSP-UART only. An overrun error occurred in the UART. */
    EmberCounterType[EmberCounterType["ASH_OVERRUN_ERROR"] = 20] = "ASH_OVERRUN_ERROR";
    /** A message was dropped at the Network layer because the NWK frame counter was not higher than the last message seen from that source. */
    EmberCounterType[EmberCounterType["NWK_FRAME_COUNTER_FAILURE"] = 21] = "NWK_FRAME_COUNTER_FAILURE";
    /**
     * A message was dropped at the APS layer because the APS frame counter was not higher than the last message seen from that source.
     * - destinationNodeId: node ID of MAC source that relayed the message
     * - data: not used
     */
    EmberCounterType[EmberCounterType["APS_FRAME_COUNTER_FAILURE"] = 22] = "APS_FRAME_COUNTER_FAILURE";
    /** EZSP-UART only. An XOFF was transmitted by the UART. */
    EmberCounterType[EmberCounterType["ASH_XOFF"] = 23] = "ASH_XOFF";
    /**
     * An encrypted message was dropped by the APS layer because the sender's key has not been authenticated.
     * As a result, the key is not authorized for use in APS data messages.
     * - destinationNodeId: EMBER_NULL_NODE_ID
     * - data: APS key table index related to the sender
     */
    EmberCounterType[EmberCounterType["APS_LINK_KEY_NOT_AUTHORIZED"] = 24] = "APS_LINK_KEY_NOT_AUTHORIZED";
    /**
     * A NWK encrypted message was received but dropped because decryption failed.
     * - destinationNodeId: sender of the dropped packet
     * - data: not used
     */
    EmberCounterType[EmberCounterType["NWK_DECRYPTION_FAILURE"] = 25] = "NWK_DECRYPTION_FAILURE";
    /**
     * An APS encrypted message was received but dropped because decryption failed.
     * - destinationNodeId: sender of the dropped packet
     * - data: not used
     */
    EmberCounterType[EmberCounterType["APS_DECRYPTION_FAILURE"] = 26] = "APS_DECRYPTION_FAILURE";
    /**
     * The number of failures to allocate a set of linked packet buffers.
     * This doesn't necessarily mean that the packet buffer count was 0 at the time,
     * but that the number requested was greater than the number free.
     */
    EmberCounterType[EmberCounterType["ALLOCATE_PACKET_BUFFER_FAILURE"] = 27] = "ALLOCATE_PACKET_BUFFER_FAILURE";
    /**
     * The number of relayed unicast packets.
     * - destinationId: NWK layer destination address of relayed packet
     * - data: not used
     */
    EmberCounterType[EmberCounterType["RELAYED_UNICAST"] = 28] = "RELAYED_UNICAST";
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
    EmberCounterType[EmberCounterType["PHY_TO_MAC_QUEUE_LIMIT_REACHED"] = 29] = "PHY_TO_MAC_QUEUE_LIMIT_REACHED";
    /**
     * The number of times a packet was dropped due to the packet-validate library checking a packet
     * and rejecting it due to length or other formatting problems.
     * - destinationNodeId: not used
     * - data: type of validation condition that failed
     */
    EmberCounterType[EmberCounterType["PACKET_VALIDATE_LIBRARY_DROPPED_COUNT"] = 30] = "PACKET_VALIDATE_LIBRARY_DROPPED_COUNT";
    /**
     * The number of times the NWK retry queue is full and a new message failed to be added.
     * - destinationNodeId; not used
     * - data: NWK retry queue size that has been exceeded
     */
    EmberCounterType[EmberCounterType["TYPE_NWK_RETRY_OVERFLOW"] = 31] = "TYPE_NWK_RETRY_OVERFLOW";
    /**
     * The number of times the PHY layer was unable to transmit due to a failed CCA (Clear Channel Assessment) attempt.
     * See also: MAC_TX_UNICAST_RETRY.
     * - destinationNodeId: MAC layer destination or EMBER_UNKNOWN_NODE_ID if no 16-bit destination node ID is present in the frame
     * - data: not used
     */
    EmberCounterType[EmberCounterType["PHY_CCA_FAIL_COUNT"] = 32] = "PHY_CCA_FAIL_COUNT";
    /** The number of times a NWK broadcast was dropped because the broadcast table was full. */
    EmberCounterType[EmberCounterType["BROADCAST_TABLE_FULL"] = 33] = "BROADCAST_TABLE_FULL";
    /** The number of times a low-priority packet traffic arbitration request has been made. */
    EmberCounterType[EmberCounterType["PTA_LO_PRI_REQUESTED"] = 34] = "PTA_LO_PRI_REQUESTED";
    /** The number of times a high-priority packet traffic arbitration request has been made. */
    EmberCounterType[EmberCounterType["PTA_HI_PRI_REQUESTED"] = 35] = "PTA_HI_PRI_REQUESTED";
    /** The number of times a low-priority packet traffic arbitration request has been denied. */
    EmberCounterType[EmberCounterType["PTA_LO_PRI_DENIED"] = 36] = "PTA_LO_PRI_DENIED";
    /** The number of times a high-priority packet traffic arbitration request has been denied. */
    EmberCounterType[EmberCounterType["PTA_HI_PRI_DENIED"] = 37] = "PTA_HI_PRI_DENIED";
    /** The number of times a low-priority packet traffic arbitration transmission has been aborted. */
    EmberCounterType[EmberCounterType["PTA_LO_PRI_TX_ABORTED"] = 38] = "PTA_LO_PRI_TX_ABORTED";
    /** The number of times a high-priority packet traffic arbitration transmission has been aborted. */
    EmberCounterType[EmberCounterType["PTA_HI_PRI_TX_ABORTED"] = 39] = "PTA_HI_PRI_TX_ABORTED";
    /** The number of times an address conflict has caused node_id change, and an address conflict error is sent. */
    EmberCounterType[EmberCounterType["ADDRESS_CONFLICT_SENT"] = 40] = "ADDRESS_CONFLICT_SENT";
    /** The number of times CSL failed to schedule Rx on target */
    EmberCounterType[EmberCounterType["CSL_RX_SCHEDULE_FAILED"] = 41] = "CSL_RX_SCHEDULE_FAILED";
    /** A placeholder giving the number of Ember counter types. */
    EmberCounterType[EmberCounterType["COUNT"] = 42] = "COUNT";
})(EmberCounterType || (exports.EmberCounterType = EmberCounterType = {}));
/** An enumerated list of library identifiers. */
var EmberLibraryId;
(function (EmberLibraryId) {
    EmberLibraryId[EmberLibraryId["FIRST"] = 0] = "FIRST";
    EmberLibraryId[EmberLibraryId["ZIGBEE_PRO"] = 0] = "ZIGBEE_PRO";
    EmberLibraryId[EmberLibraryId["BINDING"] = 1] = "BINDING";
    EmberLibraryId[EmberLibraryId["END_DEVICE_BIND"] = 2] = "END_DEVICE_BIND";
    EmberLibraryId[EmberLibraryId["SECURITY_CORE"] = 3] = "SECURITY_CORE";
    EmberLibraryId[EmberLibraryId["SECURITY_LINK_KEYS"] = 4] = "SECURITY_LINK_KEYS";
    EmberLibraryId[EmberLibraryId["ALARM"] = 5] = "ALARM";
    EmberLibraryId[EmberLibraryId["CBKE"] = 6] = "CBKE";
    EmberLibraryId[EmberLibraryId["CBKE_DSA_SIGN"] = 7] = "CBKE_DSA_SIGN";
    EmberLibraryId[EmberLibraryId["ECC"] = 8] = "ECC";
    EmberLibraryId[EmberLibraryId["CBKE_DSA_VERIFY"] = 9] = "CBKE_DSA_VERIFY";
    EmberLibraryId[EmberLibraryId["PACKET_VALIDATE"] = 10] = "PACKET_VALIDATE";
    EmberLibraryId[EmberLibraryId["INSTALL_CODE"] = 11] = "INSTALL_CODE";
    EmberLibraryId[EmberLibraryId["ZLL"] = 12] = "ZLL";
    EmberLibraryId[EmberLibraryId["CBKE_283K1"] = 13] = "CBKE_283K1";
    EmberLibraryId[EmberLibraryId["ECC_283K1"] = 14] = "ECC_283K1";
    EmberLibraryId[EmberLibraryId["CBKE_CORE"] = 15] = "CBKE_CORE";
    EmberLibraryId[EmberLibraryId["NCP"] = 16] = "NCP";
    EmberLibraryId[EmberLibraryId["MULTI_NETWORK"] = 17] = "MULTI_NETWORK";
    EmberLibraryId[EmberLibraryId["ENHANCED_BEACON_REQUEST"] = 18] = "ENHANCED_BEACON_REQUEST";
    EmberLibraryId[EmberLibraryId["CBKE_283K1_DSA_VERIFY"] = 19] = "CBKE_283K1_DSA_VERIFY";
    EmberLibraryId[EmberLibraryId["MULTI_PAN"] = 20] = "MULTI_PAN";
    EmberLibraryId[EmberLibraryId["NUMBER_OF_LIBRARIES"] = 21] = "NUMBER_OF_LIBRARIES";
    EmberLibraryId[EmberLibraryId["NULL"] = 255] = "NULL";
})(EmberLibraryId || (exports.EmberLibraryId = EmberLibraryId = {}));
/** This indicates the presence, absence, or status of an Ember stack library. */
var EmberLibraryStatus;
(function (EmberLibraryStatus) {
    // Base return codes. These may be ORed with statuses further below.
    EmberLibraryStatus[EmberLibraryStatus["LIBRARY_PRESENT_MASK"] = 128] = "LIBRARY_PRESENT_MASK";
    EmberLibraryStatus[EmberLibraryStatus["LIBRARY_IS_STUB"] = 0] = "LIBRARY_IS_STUB";
    EmberLibraryStatus[EmberLibraryStatus["LIBRARY_ERROR"] = 255] = "LIBRARY_ERROR";
    // The Zigbee Pro library uses the following to indicate additional functionality:
    /** no router capability */
    EmberLibraryStatus[EmberLibraryStatus["ZIGBEE_PRO_LIBRARY_END_DEVICE_ONLY"] = 0] = "ZIGBEE_PRO_LIBRARY_END_DEVICE_ONLY";
    EmberLibraryStatus[EmberLibraryStatus["ZIGBEE_PRO_LIBRARY_HAVE_ROUTER_CAPABILITY"] = 1] = "ZIGBEE_PRO_LIBRARY_HAVE_ROUTER_CAPABILITY";
    EmberLibraryStatus[EmberLibraryStatus["ZIGBEE_PRO_LIBRARY_ZLL_SUPPORT"] = 2] = "ZIGBEE_PRO_LIBRARY_ZLL_SUPPORT";
    // The Security library uses the following to indicate additional functionality:
    EmberLibraryStatus[EmberLibraryStatus["SECURITY_LIBRARY_END_DEVICE_ONLY"] = 0] = "SECURITY_LIBRARY_END_DEVICE_ONLY";
    /** router or trust center support */
    EmberLibraryStatus[EmberLibraryStatus["SECURITY_LIBRARY_HAVE_ROUTER_SUPPORT"] = 1] = "SECURITY_LIBRARY_HAVE_ROUTER_SUPPORT";
    // The Packet Validate library may be globally turned on/off. Bit 0 indicates whether the library is enabled/disabled.
    EmberLibraryStatus[EmberLibraryStatus["PACKET_VALIDATE_LIBRARY_DISABLED"] = 0] = "PACKET_VALIDATE_LIBRARY_DISABLED";
    EmberLibraryStatus[EmberLibraryStatus["PACKET_VALIDATE_LIBRARY_ENABLED"] = 1] = "PACKET_VALIDATE_LIBRARY_ENABLED";
    EmberLibraryStatus[EmberLibraryStatus["PACKET_VALIDATE_LIBRARY_ENABLE_MASK"] = 1] = "PACKET_VALIDATE_LIBRARY_ENABLE_MASK";
})(EmberLibraryStatus || (exports.EmberLibraryStatus = EmberLibraryStatus = {}));
/** Defines the entropy source used by the stack. */
var EmberEntropySource;
(function (EmberEntropySource) {
    /** Error in identifying the entropy source. */
    EmberEntropySource[EmberEntropySource["ERROR"] = 0] = "ERROR";
    /** The default radio entropy source. */
    EmberEntropySource[EmberEntropySource["RADIO"] = 1] = "RADIO";
    /** TRNG with mbed TLS support. */
    EmberEntropySource[EmberEntropySource["MBEDTLS_TRNG"] = 2] = "MBEDTLS_TRNG";
    /** Other mbed TLS entropy source. */
    EmberEntropySource[EmberEntropySource["MBEDTLS"] = 3] = "MBEDTLS";
})(EmberEntropySource || (exports.EmberEntropySource = EmberEntropySource = {}));
/** Defines the options that should be used when initializing the node's network configuration. */
var EmberNetworkInitBitmask;
(function (EmberNetworkInitBitmask) {
    EmberNetworkInitBitmask[EmberNetworkInitBitmask["NO_OPTIONS"] = 0] = "NO_OPTIONS";
    /** The Parent Node ID and EUI64 are stored in a token. This prevents the need to perform an Orphan scan on startup. */
    EmberNetworkInitBitmask[EmberNetworkInitBitmask["PARENT_INFO_IN_TOKEN"] = 1] = "PARENT_INFO_IN_TOKEN";
    /** Z3 compliant end devices on a network must send a rejoin request on reboot. */
    EmberNetworkInitBitmask[EmberNetworkInitBitmask["END_DEVICE_REJOIN_ON_REBOOT"] = 2] = "END_DEVICE_REJOIN_ON_REBOOT";
})(EmberNetworkInitBitmask || (exports.EmberNetworkInitBitmask = EmberNetworkInitBitmask = {}));
/** Defines the possible join states for a node. uint8_t */
var EmberNetworkStatus;
(function (EmberNetworkStatus) {
    /** The node is not associated with a network in any way. */
    EmberNetworkStatus[EmberNetworkStatus["NO_NETWORK"] = 0] = "NO_NETWORK";
    /** The node is currently attempting to join a network. */
    EmberNetworkStatus[EmberNetworkStatus["JOINING_NETWORK"] = 1] = "JOINING_NETWORK";
    /** The node is joined to a network. */
    EmberNetworkStatus[EmberNetworkStatus["JOINED_NETWORK"] = 2] = "JOINED_NETWORK";
    /** The node is an end device joined to a network but its parent is not responding. */
    EmberNetworkStatus[EmberNetworkStatus["JOINED_NETWORK_NO_PARENT"] = 3] = "JOINED_NETWORK_NO_PARENT";
    /** The node is a Sleepy-to-Sleepy initiator */
    EmberNetworkStatus[EmberNetworkStatus["JOINED_NETWORK_S2S_INITIATOR"] = 4] = "JOINED_NETWORK_S2S_INITIATOR";
    /** The node is a Sleepy-to-Sleepy target */
    EmberNetworkStatus[EmberNetworkStatus["JOINED_NETWORK_S2S_TARGET"] = 5] = "JOINED_NETWORK_S2S_TARGET";
    /** The node is in the process of leaving its current network. */
    EmberNetworkStatus[EmberNetworkStatus["LEAVING_NETWORK"] = 6] = "LEAVING_NETWORK";
})(EmberNetworkStatus || (exports.EmberNetworkStatus = EmberNetworkStatus = {}));
/** Network scan types. */
var EzspNetworkScanType;
(function (EzspNetworkScanType) {
    /** An energy scan scans each channel for its RSSI value. */
    EzspNetworkScanType[EzspNetworkScanType["ENERGY_SCAN"] = 0] = "ENERGY_SCAN";
    /** An active scan scans each channel for available networks. */
    EzspNetworkScanType[EzspNetworkScanType["ACTIVE_SCAN"] = 1] = "ACTIVE_SCAN";
})(EzspNetworkScanType || (exports.EzspNetworkScanType = EzspNetworkScanType = {}));
/** The type of method used for joining. uint8_t */
var EmberJoinMethod;
(function (EmberJoinMethod) {
    /** Devices normally use MAC association to join a network, which respects
     *  the "permit joining" flag in the MAC beacon.
     *  This value should be used by default.
     */
    EmberJoinMethod[EmberJoinMethod["MAC_ASSOCIATION"] = 0] = "MAC_ASSOCIATION";
    /** For networks where the "permit joining" flag is never turned
     *  on, devices will need to use a Zigbee NWK Rejoin.  This value causes the
     *  rejoin to be sent withOUT NWK security and the Trust Center will be
     *  asked to send the NWK key to the device.  The NWK key sent to the device
     *  can be encrypted with the device's corresponding Trust Center link key.
     *  That is determined by the ::EmberJoinDecision on the Trust Center
     *  returned by the ::emberTrustCenterJoinHandler().
     */
    EmberJoinMethod[EmberJoinMethod["NWK_REJOIN"] = 1] = "NWK_REJOIN";
    /* For networks where the "permit joining" flag is never turned
     * on, devices will need to use a NWK Rejoin.  If those devices have been
     * preconfigured with the  NWK key (including sequence number), they can use
     * a secured rejoin.  This is only necessary for end devices since they need
     * a parent.  Routers can simply use the ::CONFIGURED_NWK_STATE
     * join method below.
     */
    EmberJoinMethod[EmberJoinMethod["NWK_REJOIN_HAVE_NWK_KEY"] = 2] = "NWK_REJOIN_HAVE_NWK_KEY";
    /** For networks where all network and security information is known
         ahead of time, a router device may be commissioned such that it does
        not need to send any messages to begin communicating on the network.
    */
    EmberJoinMethod[EmberJoinMethod["CONFIGURED_NWK_STATE"] = 3] = "CONFIGURED_NWK_STATE";
    /** This enumeration causes an unencrypted Network Commissioning Request to be
         sent out with joinType set to initial join. The trust center may respond
        by establishing a new dynamic link key and then sending the network key.
        Network Commissioning Requests should only be sent to parents that support
        processing of the command.
    */
    EmberJoinMethod[EmberJoinMethod["NWK_COMMISSIONING_JOIN"] = 4] = "NWK_COMMISSIONING_JOIN";
    /** This enumeration causes an unencrypted Network Commissioning Request to be
         sent out with joinType set to rejoin. The trust center may respond
        by establishing a new dynamic link key and then sending the network key.
        Network Commissioning Requests should only be sent to parents that support
        processing of the command.
    */
    EmberJoinMethod[EmberJoinMethod["NWK_COMMISSIONING_REJOIN"] = 5] = "NWK_COMMISSIONING_REJOIN";
    /** This enumeration causes an encrypted Network Commissioning Request to be
         sent out with joinType set to rejoin. This enumeration is used by devices
        that already have the network key and wish to recover connection to a
        parent or the network in general.
        Network Commissioning Requests should only be sent to parents that support
        processing of the command.
    */
    EmberJoinMethod[EmberJoinMethod["NWK_COMMISSIONING_REJOIN_HAVE_NWK_KEY"] = 6] = "NWK_COMMISSIONING_REJOIN_HAVE_NWK_KEY";
})(EmberJoinMethod || (exports.EmberJoinMethod = EmberJoinMethod = {}));
/** Defines the possible types of nodes and the roles that a node might play in a network. */
var EmberNodeType;
(function (EmberNodeType) {
    /** The device is not joined. */
    EmberNodeType[EmberNodeType["UNKNOWN_DEVICE"] = 0] = "UNKNOWN_DEVICE";
    /** Will relay messages and can act as a parent to other nodes. */
    EmberNodeType[EmberNodeType["COORDINATOR"] = 1] = "COORDINATOR";
    /** Will relay messages and can act as a parent to other nodes. */
    EmberNodeType[EmberNodeType["ROUTER"] = 2] = "ROUTER";
    /** Communicates only with its parent and will not relay messages. */
    EmberNodeType[EmberNodeType["END_DEVICE"] = 3] = "END_DEVICE";
    /** An end device whose radio can be turned off to save power. The application must call ::emberPollForData() to receive messages. */
    EmberNodeType[EmberNodeType["SLEEPY_END_DEVICE"] = 4] = "SLEEPY_END_DEVICE";
    /** Sleepy end device which transmits with wake up frames (CSL). */
    EmberNodeType[EmberNodeType["S2S_INITIATOR_DEVICE"] = 5] = "S2S_INITIATOR_DEVICE";
    /** Sleepy end device which duty cycles the radio Rx (CSL). */
    EmberNodeType[EmberNodeType["S2S_TARGET_DEVICE"] = 6] = "S2S_TARGET_DEVICE";
})(EmberNodeType || (exports.EmberNodeType = EmberNodeType = {}));
/**  */
var EmberMultiPhyNwkConfig;
(function (EmberMultiPhyNwkConfig) {
    EmberMultiPhyNwkConfig[EmberMultiPhyNwkConfig["ROUTERS_ALLOWED"] = 1] = "ROUTERS_ALLOWED";
    EmberMultiPhyNwkConfig[EmberMultiPhyNwkConfig["BROADCASTS_ENABLED"] = 2] = "BROADCASTS_ENABLED";
    EmberMultiPhyNwkConfig[EmberMultiPhyNwkConfig["DISABLED"] = 128] = "DISABLED";
})(EmberMultiPhyNwkConfig || (exports.EmberMultiPhyNwkConfig = EmberMultiPhyNwkConfig = {}));
/**
 * Duty cycle states
 *
 * Applications have no control over the state but the callback exposes
 * state changes to the application.
 */
var EmberDutyCycleState;
(function (EmberDutyCycleState) {
    /** No duty cycle tracking or metrics are taking place. */
    EmberDutyCycleState[EmberDutyCycleState["TRACKING_OFF"] = 0] = "TRACKING_OFF";
    /** Duty Cycle is tracked and has not exceeded any thresholds. */
    EmberDutyCycleState[EmberDutyCycleState["LBT_NORMAL"] = 1] = "LBT_NORMAL";
    /** The limited threshold of the total duty cycle allotment was exceeded. */
    EmberDutyCycleState[EmberDutyCycleState["LBT_LIMITED_THRESHOLD_REACHED"] = 2] = "LBT_LIMITED_THRESHOLD_REACHED";
    /** The critical threshold of the total duty cycle allotment was exceeded. */
    EmberDutyCycleState[EmberDutyCycleState["LBT_CRITICAL_THRESHOLD_REACHED"] = 3] = "LBT_CRITICAL_THRESHOLD_REACHED";
    /** The suspend limit was reached and all outbound transmissions are blocked. */
    EmberDutyCycleState[EmberDutyCycleState["LBT_SUSPEND_LIMIT_REACHED"] = 4] = "LBT_SUSPEND_LIMIT_REACHED";
})(EmberDutyCycleState || (exports.EmberDutyCycleState = EmberDutyCycleState = {}));
/** Defines binding types. uint8_t */
var EmberBindingType;
(function (EmberBindingType) {
    /** A binding that is currently not in use. */
    EmberBindingType[EmberBindingType["UNUSED_BINDING"] = 0] = "UNUSED_BINDING";
    /** A unicast binding whose 64-bit identifier is the destination EUI64. */
    EmberBindingType[EmberBindingType["UNICAST_BINDING"] = 1] = "UNICAST_BINDING";
    /**
     * A unicast binding whose 64-bit identifier is the many-to-one destination EUI64.
     * Route discovery should be disabled when sending unicasts via many-to-one bindings.
     */
    EmberBindingType[EmberBindingType["MANY_TO_ONE_BINDING"] = 2] = "MANY_TO_ONE_BINDING";
    /**
     * A multicast binding whose 64-bit identifier is the group address.
     * This binding can be used to send messages to the group and to receive messages sent to the group.
     */
    EmberBindingType[EmberBindingType["MULTICAST_BINDING"] = 3] = "MULTICAST_BINDING";
})(EmberBindingType || (exports.EmberBindingType = EmberBindingType = {}));
/** Defines the possible outgoing message types. uint8_t */
var EmberOutgoingMessageType;
(function (EmberOutgoingMessageType) {
    /** Unicast sent directly to an EmberNodeId. */
    EmberOutgoingMessageType[EmberOutgoingMessageType["DIRECT"] = 0] = "DIRECT";
    /** Unicast sent using an entry in the address table. */
    EmberOutgoingMessageType[EmberOutgoingMessageType["VIA_ADDRESS_TABLE"] = 1] = "VIA_ADDRESS_TABLE";
    /** Unicast sent using an entry in the binding table. */
    EmberOutgoingMessageType[EmberOutgoingMessageType["VIA_BINDING"] = 2] = "VIA_BINDING";
    /** Multicast message. This value is passed to emberMessageSentHandler() only. It may not be passed to emberSendUnicast(). */
    EmberOutgoingMessageType[EmberOutgoingMessageType["MULTICAST"] = 3] = "MULTICAST";
    /** An aliased multicast message. This value is passed to emberMessageSentHandler() only. It may not be passed to emberSendUnicast(). */
    EmberOutgoingMessageType[EmberOutgoingMessageType["MULTICAST_WITH_ALIAS"] = 4] = "MULTICAST_WITH_ALIAS";
    /** An aliased Broadcast message. This value is passed to emberMessageSentHandler() only. It may not be passed to emberSendUnicast(). */
    EmberOutgoingMessageType[EmberOutgoingMessageType["BROADCAST_WITH_ALIAS"] = 5] = "BROADCAST_WITH_ALIAS";
    /** A broadcast message. This value is passed to emberMessageSentHandler() only. It may not be passed to emberSendUnicast(). */
    EmberOutgoingMessageType[EmberOutgoingMessageType["BROADCAST"] = 6] = "BROADCAST";
})(EmberOutgoingMessageType || (exports.EmberOutgoingMessageType = EmberOutgoingMessageType = {}));
/** Defines the possible incoming message types. uint8_t */
var EmberIncomingMessageType;
(function (EmberIncomingMessageType) {
    /** Unicast. */
    EmberIncomingMessageType[EmberIncomingMessageType["UNICAST"] = 0] = "UNICAST";
    /** Unicast reply. */
    EmberIncomingMessageType[EmberIncomingMessageType["UNICAST_REPLY"] = 1] = "UNICAST_REPLY";
    /** Multicast. */
    EmberIncomingMessageType[EmberIncomingMessageType["MULTICAST"] = 2] = "MULTICAST";
    /** Multicast sent by the local device. */
    EmberIncomingMessageType[EmberIncomingMessageType["MULTICAST_LOOPBACK"] = 3] = "MULTICAST_LOOPBACK";
    /** Broadcast. */
    EmberIncomingMessageType[EmberIncomingMessageType["BROADCAST"] = 4] = "BROADCAST";
    /** Broadcast sent by the local device. */
    EmberIncomingMessageType[EmberIncomingMessageType["BROADCAST_LOOPBACK"] = 5] = "BROADCAST_LOOPBACK";
})(EmberIncomingMessageType || (exports.EmberIncomingMessageType = EmberIncomingMessageType = {}));
/**
 * Options to use when sending a message.
 *
 * The discover-route, APS-retry, and APS-indirect options may be used together.
 * Poll response cannot be combined with any other options.
 * uint16_t
 */
var EmberApsOption;
(function (EmberApsOption) {
    /** No options. */
    EmberApsOption[EmberApsOption["NONE"] = 0] = "NONE";
    EmberApsOption[EmberApsOption["ENCRYPT_WITH_TRANSIENT_KEY"] = 1] = "ENCRYPT_WITH_TRANSIENT_KEY";
    EmberApsOption[EmberApsOption["USE_ALIAS_SEQUENCE_NUMBER"] = 2] = "USE_ALIAS_SEQUENCE_NUMBER";
    /**
     * This signs the application layer message body (APS Frame not included) and appends the ECDSA signature to the end of the message,
     * which is needed by Smart Energy applications and requires the CBKE and ECC libraries.
     * The ::emberDsaSignHandler() function is called after DSA signing is complete but before the message has been sent by the APS layer.
     * Note that when passing a buffer to the stack for DSA signing, the final byte in the buffer has a special significance as an indicator
     * of how many leading bytes should be ignored for signature purposes. See the API documentation of emberDsaSign()
     * or the dsaSign EZSP command for more details about this requirement.
     */
    EmberApsOption[EmberApsOption["DSA_SIGN"] = 16] = "DSA_SIGN";
    /** Send the message using APS Encryption using the Link Key shared with the destination node to encrypt the data at the APS Level. */
    EmberApsOption[EmberApsOption["ENCRYPTION"] = 32] = "ENCRYPTION";
    /**
     * Resend the message using the APS retry mechanism.
     * This option and the enable route discovery option must be enabled for an existing route to be repaired automatically.
     */
    EmberApsOption[EmberApsOption["RETRY"] = 64] = "RETRY";
    /**
     * Send the message with the NWK 'enable route discovery' flag, which  causes a route discovery to be initiated if no route to the
     * destination is known. Note that in the mesh stack, this option and the APS retry option must be enabled an existing route to be
     * repaired automatically.
     */
    EmberApsOption[EmberApsOption["ENABLE_ROUTE_DISCOVERY"] = 256] = "ENABLE_ROUTE_DISCOVERY";
    /** Send the message with the NWK 'force route discovery' flag, which causes a route discovery to be initiated even if one is known. */
    EmberApsOption[EmberApsOption["FORCE_ROUTE_DISCOVERY"] = 512] = "FORCE_ROUTE_DISCOVERY";
    /** Include the source EUI64 in the network frame. */
    EmberApsOption[EmberApsOption["SOURCE_EUI64"] = 1024] = "SOURCE_EUI64";
    /** Include the destination EUI64 in the network frame. */
    EmberApsOption[EmberApsOption["DESTINATION_EUI64"] = 2048] = "DESTINATION_EUI64";
    /** Send a ZDO request to discover the node ID of the destination if it is not already known. */
    EmberApsOption[EmberApsOption["ENABLE_ADDRESS_DISCOVERY"] = 4096] = "ENABLE_ADDRESS_DISCOVERY";
    /**
     * This message is being sent in response to a call to  ::emberPollHandler().
     * It causes the message to be sent immediately instead of being queued up until the next poll from the (end device) destination.
     */
    EmberApsOption[EmberApsOption["POLL_RESPONSE"] = 8192] = "POLL_RESPONSE";
    /**
     * This incoming message is a valid ZDO request and the application is responsible for sending a ZDO response.
     * This flag is used only within emberIncomingMessageHandler() when EMBER_APPLICATION_RECEIVES_UNSUPPORTED_ZDO_REQUESTS is defined. */
    EmberApsOption[EmberApsOption["ZDO_RESPONSE_REQUIRED"] = 16384] = "ZDO_RESPONSE_REQUIRED";
    /**
     * This message is part of a fragmented message.  This option may only  be set for unicasts.
     * The groupId field gives the index of this fragment in the low-order byte.
     * If the low-order byte is zero this is the first fragment and the high-order byte contains the number of fragments in the message.
     */
    EmberApsOption[EmberApsOption["FRAGMENT"] = 32768] = "FRAGMENT";
})(EmberApsOption || (exports.EmberApsOption = EmberApsOption = {}));
/**
 * Types of source route discovery modes used by the concentrator.
 *
 * OFF no source route discovery is scheduled
 *
 * ON source routes discovery is scheduled, and it is triggered periodically
 *
 * RESCHEDULE  source routes discoveries are re-scheduled to be sent once immediately and then triggered periodically
 */
var EmberSourceRouteDiscoveryMode;
(function (EmberSourceRouteDiscoveryMode) {
    /** off  */
    EmberSourceRouteDiscoveryMode[EmberSourceRouteDiscoveryMode["OFF"] = 0] = "OFF";
    /** on  */
    EmberSourceRouteDiscoveryMode[EmberSourceRouteDiscoveryMode["ON"] = 1] = "ON";
    /** reschedule */
    EmberSourceRouteDiscoveryMode[EmberSourceRouteDiscoveryMode["RESCHEDULE"] = 2] = "RESCHEDULE";
})(EmberSourceRouteDiscoveryMode || (exports.EmberSourceRouteDiscoveryMode = EmberSourceRouteDiscoveryMode = {}));
/** The types of MAC passthrough messages that an application may receive. This is a bitmask. */
var EmberMacPassthroughType;
(function (EmberMacPassthroughType) {
    /** No MAC passthrough messages. */
    EmberMacPassthroughType[EmberMacPassthroughType["NONE"] = 0] = "NONE";
    /** SE InterPAN messages. */
    EmberMacPassthroughType[EmberMacPassthroughType["SE_INTERPAN"] = 1] = "SE_INTERPAN";
    /** EmberNet and first generation (v1) standalone bootloader messages. */
    EmberMacPassthroughType[EmberMacPassthroughType["EMBERNET"] = 2] = "EMBERNET";
    /** EmberNet messages filtered by their source address. */
    EmberMacPassthroughType[EmberMacPassthroughType["EMBERNET_SOURCE"] = 4] = "EMBERNET_SOURCE";
    /** Application-specific passthrough messages. */
    EmberMacPassthroughType[EmberMacPassthroughType["APPLICATION"] = 8] = "APPLICATION";
    /** Custom inter-pan filter. */
    EmberMacPassthroughType[EmberMacPassthroughType["CUSTOM"] = 16] = "CUSTOM";
    /** Internal Stack passthrough. */
    EmberMacPassthroughType[EmberMacPassthroughType["INTERNAL_ZLL"] = 128] = "INTERNAL_ZLL";
    EmberMacPassthroughType[EmberMacPassthroughType["INTERNAL_GP"] = 64] = "INTERNAL_GP";
})(EmberMacPassthroughType || (exports.EmberMacPassthroughType = EmberMacPassthroughType = {}));
/**
 * Interpan Message type: unicast, broadcast, or multicast.
 * uint8_t
 */
var EmberInterpanMessageType;
(function (EmberInterpanMessageType) {
    EmberInterpanMessageType[EmberInterpanMessageType["UNICAST"] = 0] = "UNICAST";
    EmberInterpanMessageType[EmberInterpanMessageType["BROADCAST"] = 8] = "BROADCAST";
    EmberInterpanMessageType[EmberInterpanMessageType["MULTICAST"] = 12] = "MULTICAST";
})(EmberInterpanMessageType || (exports.EmberInterpanMessageType = EmberInterpanMessageType = {}));
/** This is the Current Security Bitmask that details the use of various security features. */
var EmberCurrentSecurityBitmask;
(function (EmberCurrentSecurityBitmask) {
    // These options are the same for Initial and Current Security state.
    /** This denotes that the device is running in a network with Zigbee
     *  Standard Security. */
    EmberCurrentSecurityBitmask[EmberCurrentSecurityBitmask["STANDARD_SECURITY_MODE"] = 0] = "STANDARD_SECURITY_MODE";
    /** This denotes that the device is running in a network without
     *  a centralized Trust Center. */
    EmberCurrentSecurityBitmask[EmberCurrentSecurityBitmask["DISTRIBUTED_TRUST_CENTER_MODE"] = 2] = "DISTRIBUTED_TRUST_CENTER_MODE";
    /** This denotes that the device has a Global Link Key.  The Trust Center
     *  Link Key is the same across multiple nodes. */
    EmberCurrentSecurityBitmask[EmberCurrentSecurityBitmask["TRUST_CENTER_GLOBAL_LINK_KEY"] = 4] = "TRUST_CENTER_GLOBAL_LINK_KEY";
    // Bit 3 reserved
    /** This denotes that the node has a Trust Center Link Key. */
    EmberCurrentSecurityBitmask[EmberCurrentSecurityBitmask["HAVE_TRUST_CENTER_LINK_KEY"] = 16] = "HAVE_TRUST_CENTER_LINK_KEY";
    /** This denotes that the Trust Center is using a Hashed Link Key. */
    EmberCurrentSecurityBitmask[EmberCurrentSecurityBitmask["TRUST_CENTER_USES_HASHED_LINK_KEY"] = 132] = "TRUST_CENTER_USES_HASHED_LINK_KEY";
    // Bits 1, 5, 6, and 8-15 reserved.
})(EmberCurrentSecurityBitmask || (exports.EmberCurrentSecurityBitmask = EmberCurrentSecurityBitmask = {}));
/**
 * The list of supported key types used by Zigbee Security Manager.
 * uint8_t
 */
var SecManKeyType;
(function (SecManKeyType) {
    SecManKeyType[SecManKeyType["NONE"] = 0] = "NONE";
    /**
     * This is the network key, used for encrypting and decrypting network payloads.
     * There is only one of these keys in storage.
     */
    SecManKeyType[SecManKeyType["NETWORK"] = 1] = "NETWORK";
    /**
     * This is the Trust Center Link Key. On the joining device, this is the APS
     * key used to communicate with the trust center. On the trust center, this
     * key can be used as a root key for APS encryption and decryption when
     * communicating with joining devices (if the security policy has the
     * EMBER_TRUST_CENTER_USES_HASHED_LINK_KEY bit set).
     * There is only one of these keys in storage.
     */
    SecManKeyType[SecManKeyType["TC_LINK"] = 2] = "TC_LINK";
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
    SecManKeyType[SecManKeyType["TC_LINK_WITH_TIMEOUT"] = 3] = "TC_LINK_WITH_TIMEOUT";
    /**
     * This is an Application link key. On both joining devices and the trust
     * center, this key is used in APS encryption and decryption when
     * communicating to a joining device.
     * This is an indexed key table of size EMBER_KEY_TABLE_SIZE, so long as there
     * is sufficient nonvolatile memory to store keys.
     */
    SecManKeyType[SecManKeyType["APP_LINK"] = 4] = "APP_LINK";
    /** This is the ZLL encryption key for use by algorithms that require it. */
    SecManKeyType[SecManKeyType["ZLL_ENCRYPTION_KEY"] = 5] = "ZLL_ENCRYPTION_KEY";
    /** For ZLL, this is the pre-configured link key used during classical Zigbee commissioning. */
    SecManKeyType[SecManKeyType["ZLL_PRECONFIGURED_KEY"] = 6] = "ZLL_PRECONFIGURED_KEY";
    /** This is a Green Power Device (GPD) key used on a Proxy device. */
    SecManKeyType[SecManKeyType["GREEN_POWER_PROXY_TABLE_KEY"] = 7] = "GREEN_POWER_PROXY_TABLE_KEY";
    /** This is a Green Power Device (GPD) key used on a Sink device. */
    SecManKeyType[SecManKeyType["GREEN_POWER_SINK_TABLE_KEY"] = 8] = "GREEN_POWER_SINK_TABLE_KEY";
    /**
     * This is a generic key type intended to be loaded for one-time hashing or crypto operations.
     * This key is not persisted. Intended for use by the Zigbee stack.
     */
    SecManKeyType[SecManKeyType["INTERNAL"] = 9] = "INTERNAL";
})(SecManKeyType || (exports.SecManKeyType = SecManKeyType = {}));
/**
 * Derived keys are calculated when performing Zigbee crypto operations. The stack makes use of these derivations.
 * Compounding derivations can be specified by using an or-equals on two derived types if applicable;
 * this is limited to performing the key-transport, key-load, or verify-key hashes on either the TC Swap Out or TC Hashed Link keys.
 * uint16_t
 */
var SecManDerivedKeyType;
(function (SecManDerivedKeyType) {
    /** Perform no derivation; use the key as is. */
    SecManDerivedKeyType[SecManDerivedKeyType["NONE"] = 0] = "NONE";
    /** Perform the Key-Transport-Key hash. */
    SecManDerivedKeyType[SecManDerivedKeyType["KEY_TRANSPORT_KEY"] = 1] = "KEY_TRANSPORT_KEY";
    /** Perform the Key-Load-Key hash. */
    SecManDerivedKeyType[SecManDerivedKeyType["KEY_LOAD_KEY"] = 2] = "KEY_LOAD_KEY";
    /** Perform the Verify Key hash. */
    SecManDerivedKeyType[SecManDerivedKeyType["VERIFY_KEY"] = 4] = "VERIFY_KEY";
    /** Perform a simple AES hash of the key for TC backup. */
    SecManDerivedKeyType[SecManDerivedKeyType["TC_SWAP_OUT_KEY"] = 8] = "TC_SWAP_OUT_KEY";
    /** For a TC using hashed link keys, hashed the root key against the supplied EUI in context. */
    SecManDerivedKeyType[SecManDerivedKeyType["TC_HASHED_LINK_KEY"] = 16] = "TC_HASHED_LINK_KEY";
})(SecManDerivedKeyType || (exports.SecManDerivedKeyType = SecManDerivedKeyType = {}));
/**
 * Security Manager context flags.
 * uint8_t
 */
var SecManFlag;
(function (SecManFlag) {
    SecManFlag[SecManFlag["NONE"] = 0] = "NONE";
    /**
     * For export APIs, this flag indicates the key_index parameter is valid in
     *  the ::sl_zb_sec_man_context_t structure. This bit is set by the caller
     *  when intending to search for a key by key_index. This flag has no
     *  significance for import APIs. */
    SecManFlag[SecManFlag["KEY_INDEX_IS_VALID"] = 1] = "KEY_INDEX_IS_VALID";
    /**
     * For export APIs, this flag indicates the eui64 parameter is valid in the
     *  ::sl_zb_sec_man_context_t structure. This bit is set by the caller when
     *  intending to search for a key by eui64. It is also set when searching by
     *  key_index and an entry is found. This flag has no significance for import
     *  APIs. */
    SecManFlag[SecManFlag["EUI_IS_VALID"] = 2] = "EUI_IS_VALID";
    /**
     * Internal use only. This indicates that the transient key being added is an
     * unconfirmed, updated key. This bit is set when we add a transient key and
     * the ::EmberTcLinkKeyRequestPolicy policy
     * is ::EMBER_ALLOW_TC_LINK_KEY_REQUEST_AND_GENERATE_NEW_KEY, whose behavior
     * dictates that we generate a new, unconfirmed key, send it to the requester,
     * and await for a Verify Key Confirm message. */
    SecManFlag[SecManFlag["UNCONFIRMED_TRANSIENT_KEY"] = 4] = "UNCONFIRMED_TRANSIENT_KEY";
    /**
     * Internal use only.  This indicates that the key being added was derived via
     * dynamic link key negotiation.  This may be used in conjunction with the above
     * ::UNCONFIRMED_TRANSIENT_KEY while the derived link key awaits
     * confirmation
     */
    SecManFlag[SecManFlag["AUTHENTICATED_DYNAMIC_LINK_KEY"] = 8] = "AUTHENTICATED_DYNAMIC_LINK_KEY";
    /**
     * Internal use only.  This indicates that the "key" being added is instead the
     * symmetric passphrase to be stored in the link key table. This flag will trigger the
     * addition of the KEY_TABLE_SYMMETRIC_PASSPHRASE bitmask when storing the symmetric
     * passphrase so that it can be differentiated from other keys with the same EUI64.
     */
    SecManFlag[SecManFlag["SYMMETRIC_PASSPHRASE"] = 16] = "SYMMETRIC_PASSPHRASE";
})(SecManFlag || (exports.SecManFlag = SecManFlag = {}));
/** This denotes the status of an attempt to establish a key with another device. */
var EmberKeyStatus;
(function (EmberKeyStatus) {
    EmberKeyStatus[EmberKeyStatus["STATUS_NONE"] = 0] = "STATUS_NONE";
    EmberKeyStatus[EmberKeyStatus["APP_LINK_KEY_ESTABLISHED"] = 1] = "APP_LINK_KEY_ESTABLISHED";
    EmberKeyStatus[EmberKeyStatus["TRUST_CENTER_LINK_KEY_ESTABLISHED"] = 3] = "TRUST_CENTER_LINK_KEY_ESTABLISHED";
    EmberKeyStatus[EmberKeyStatus["ESTABLISHMENT_TIMEOUT"] = 4] = "ESTABLISHMENT_TIMEOUT";
    EmberKeyStatus[EmberKeyStatus["TABLE_FULL"] = 5] = "TABLE_FULL";
    // These are success status values applying only to the Trust Center answering key requests.
    EmberKeyStatus[EmberKeyStatus["TC_RESPONDED_TO_KEY_REQUEST"] = 6] = "TC_RESPONDED_TO_KEY_REQUEST";
    EmberKeyStatus[EmberKeyStatus["TC_APP_KEY_SENT_TO_REQUESTER"] = 7] = "TC_APP_KEY_SENT_TO_REQUESTER";
    // These are failure status values applying only to the
    // Trust Center answering key requests.
    EmberKeyStatus[EmberKeyStatus["TC_RESPONSE_TO_KEY_REQUEST_FAILED"] = 8] = "TC_RESPONSE_TO_KEY_REQUEST_FAILED";
    EmberKeyStatus[EmberKeyStatus["TC_REQUEST_KEY_TYPE_NOT_SUPPORTED"] = 9] = "TC_REQUEST_KEY_TYPE_NOT_SUPPORTED";
    EmberKeyStatus[EmberKeyStatus["TC_NO_LINK_KEY_FOR_REQUESTER"] = 10] = "TC_NO_LINK_KEY_FOR_REQUESTER";
    EmberKeyStatus[EmberKeyStatus["TC_REQUESTER_EUI64_UNKNOWN"] = 11] = "TC_REQUESTER_EUI64_UNKNOWN";
    EmberKeyStatus[EmberKeyStatus["TC_RECEIVED_FIRST_APP_KEY_REQUEST"] = 12] = "TC_RECEIVED_FIRST_APP_KEY_REQUEST";
    EmberKeyStatus[EmberKeyStatus["TC_TIMEOUT_WAITING_FOR_SECOND_APP_KEY_REQUEST"] = 13] = "TC_TIMEOUT_WAITING_FOR_SECOND_APP_KEY_REQUEST";
    EmberKeyStatus[EmberKeyStatus["TC_NON_MATCHING_APP_KEY_REQUEST_RECEIVED"] = 14] = "TC_NON_MATCHING_APP_KEY_REQUEST_RECEIVED";
    EmberKeyStatus[EmberKeyStatus["TC_FAILED_TO_SEND_APP_KEYS"] = 15] = "TC_FAILED_TO_SEND_APP_KEYS";
    EmberKeyStatus[EmberKeyStatus["TC_FAILED_TO_STORE_APP_KEY_REQUEST"] = 16] = "TC_FAILED_TO_STORE_APP_KEY_REQUEST";
    EmberKeyStatus[EmberKeyStatus["TC_REJECTED_APP_KEY_REQUEST"] = 17] = "TC_REJECTED_APP_KEY_REQUEST";
    EmberKeyStatus[EmberKeyStatus["TC_FAILED_TO_GENERATE_NEW_KEY"] = 18] = "TC_FAILED_TO_GENERATE_NEW_KEY";
    EmberKeyStatus[EmberKeyStatus["TC_FAILED_TO_SEND_TC_KEY"] = 19] = "TC_FAILED_TO_SEND_TC_KEY";
    // These are generic status values for a key requester.
    EmberKeyStatus[EmberKeyStatus["TRUST_CENTER_IS_PRE_R21"] = 30] = "TRUST_CENTER_IS_PRE_R21";
    // These are status values applying only to the Trust Center verifying link keys.
    EmberKeyStatus[EmberKeyStatus["TC_REQUESTER_VERIFY_KEY_TIMEOUT"] = 50] = "TC_REQUESTER_VERIFY_KEY_TIMEOUT";
    EmberKeyStatus[EmberKeyStatus["TC_REQUESTER_VERIFY_KEY_FAILURE"] = 51] = "TC_REQUESTER_VERIFY_KEY_FAILURE";
    EmberKeyStatus[EmberKeyStatus["TC_REQUESTER_VERIFY_KEY_SUCCESS"] = 52] = "TC_REQUESTER_VERIFY_KEY_SUCCESS";
    // These are status values applying only to the key requester
    // verifying link keys.
    EmberKeyStatus[EmberKeyStatus["VERIFY_LINK_KEY_FAILURE"] = 100] = "VERIFY_LINK_KEY_FAILURE";
    EmberKeyStatus[EmberKeyStatus["VERIFY_LINK_KEY_SUCCESS"] = 101] = "VERIFY_LINK_KEY_SUCCESS";
})(EmberKeyStatus || (exports.EmberKeyStatus = EmberKeyStatus = {}));
/** This bitmask describes the presence of fields within the ::EmberKeyStruct. uint16_t */
var EmberKeyStructBitmask;
(function (EmberKeyStructBitmask) {
    /** This indicates that the key has a sequence number associated with it. (i.e., a Network Key). */
    EmberKeyStructBitmask[EmberKeyStructBitmask["HAS_SEQUENCE_NUMBER"] = 1] = "HAS_SEQUENCE_NUMBER";
    /** This indicates that the key has an outgoing frame counter and the corresponding value within the ::EmberKeyStruct has been populated.*/
    EmberKeyStructBitmask[EmberKeyStructBitmask["HAS_OUTGOING_FRAME_COUNTER"] = 2] = "HAS_OUTGOING_FRAME_COUNTER";
    /** This indicates that the key has an incoming frame counter and the corresponding value within the ::EmberKeyStruct has been populated.*/
    EmberKeyStructBitmask[EmberKeyStructBitmask["HAS_INCOMING_FRAME_COUNTER"] = 4] = "HAS_INCOMING_FRAME_COUNTER";
    /**
     * This indicates that the key has an associated Partner EUI64 address and the corresponding value
     * within the ::EmberKeyStruct has been populated.
     */
    EmberKeyStructBitmask[EmberKeyStructBitmask["HAS_PARTNER_EUI64"] = 8] = "HAS_PARTNER_EUI64";
    /**
     * This indicates the key is authorized for use in APS data messages.
     * If the key is not authorized for use in APS data messages it has not yet gone through a key agreement protocol, such as CBKE (i.e., ECC).
     */
    EmberKeyStructBitmask[EmberKeyStructBitmask["IS_AUTHORIZED"] = 16] = "IS_AUTHORIZED";
    /**
     * This indicates that the partner associated with the link is a sleepy end device.
     * This bit is set automatically if the local device hears a device announce from the partner indicating it is not an 'RX on when idle' device.
     */
    EmberKeyStructBitmask[EmberKeyStructBitmask["PARTNER_IS_SLEEPY"] = 32] = "PARTNER_IS_SLEEPY";
    /**
     * This indicates that the transient key which is being added is unconfirmed.
     * This bit is set when we add a transient key while the EmberTcLinkKeyRequestPolicy is EMBER_ALLOW_TC_LINK_KEY_REQUEST_AND_GENERATE_NEW_KEY
     */
    EmberKeyStructBitmask[EmberKeyStructBitmask["UNCONFIRMED_TRANSIENT"] = 64] = "UNCONFIRMED_TRANSIENT";
    /** This indicates that the actual key data is stored in PSA, and the respective PSA ID is recorded in the psa_id field. */
    EmberKeyStructBitmask[EmberKeyStructBitmask["HAS_PSA_ID"] = 128] = "HAS_PSA_ID";
    /**
     * This indicates that the keyData field has valid data. On certain parts and depending on the security configuration,
     * keys may live in secure storage and are not exportable. In such cases, keyData will not house the actual key contents.
     */
    EmberKeyStructBitmask[EmberKeyStructBitmask["HAS_KEY_DATA"] = 256] = "HAS_KEY_DATA";
    /**
     * This indicates that the key represents a Device Authentication Token and is not an encryption key.
     * The Authentication token is persisted for the lifetime of the device on the network and used to validate and update the device connection.
     * It is only removed when the device leaves or is decommissioned from the network
     */
    EmberKeyStructBitmask[EmberKeyStructBitmask["IS_AUTHENTICATION_TOKEN"] = 512] = "IS_AUTHENTICATION_TOKEN";
    /** This indicates that the key has been derived by the Dynamic Link Key feature. */
    EmberKeyStructBitmask[EmberKeyStructBitmask["DLK_DERIVED"] = 1024] = "DLK_DERIVED";
    /** This indicates that the device this key is being used to communicate with supports the APS frame counter synchronization procedure. */
    EmberKeyStructBitmask[EmberKeyStructBitmask["FC_SYNC_SUPPORTED"] = 2048] = "FC_SYNC_SUPPORTED";
})(EmberKeyStructBitmask || (exports.EmberKeyStructBitmask = EmberKeyStructBitmask = {}));
/**
 * The Status of the Update Device message sent to the Trust Center.
 * The device may have joined or rejoined insecurely, rejoined securely, or left.
 * MAC Security has been deprecated and therefore there is no secure join.
 * These map to the actual values within the APS Command frame so they cannot be arbitrarily changed.
 * uint8_t
 */
var EmberDeviceUpdate;
(function (EmberDeviceUpdate) {
    EmberDeviceUpdate[EmberDeviceUpdate["STANDARD_SECURITY_SECURED_REJOIN"] = 0] = "STANDARD_SECURITY_SECURED_REJOIN";
    EmberDeviceUpdate[EmberDeviceUpdate["STANDARD_SECURITY_UNSECURED_JOIN"] = 1] = "STANDARD_SECURITY_UNSECURED_JOIN";
    EmberDeviceUpdate[EmberDeviceUpdate["DEVICE_LEFT"] = 2] = "DEVICE_LEFT";
    EmberDeviceUpdate[EmberDeviceUpdate["STANDARD_SECURITY_UNSECURED_REJOIN"] = 3] = "STANDARD_SECURITY_UNSECURED_REJOIN";
})(EmberDeviceUpdate || (exports.EmberDeviceUpdate = EmberDeviceUpdate = {}));
/** The decision made by the Trust Center when a node attempts to join. uint8_t */
var EmberJoinDecision;
(function (EmberJoinDecision) {
    /** Allow the node to join. The node has the key. */
    EmberJoinDecision[EmberJoinDecision["USE_PRECONFIGURED_KEY"] = 0] = "USE_PRECONFIGURED_KEY";
    /** Allow the node to join. Send the key to the node. */
    EmberJoinDecision[EmberJoinDecision["SEND_KEY_IN_THE_CLEAR"] = 1] = "SEND_KEY_IN_THE_CLEAR";
    /** Deny join. */
    EmberJoinDecision[EmberJoinDecision["DENY_JOIN"] = 2] = "DENY_JOIN";
    /** Take no action. */
    EmberJoinDecision[EmberJoinDecision["NO_ACTION"] = 3] = "NO_ACTION";
    /** Allow rejoins only.*/
    EmberJoinDecision[EmberJoinDecision["ALLOW_REJOINS_ONLY"] = 4] = "ALLOW_REJOINS_ONLY";
})(EmberJoinDecision || (exports.EmberJoinDecision = EmberJoinDecision = {}));
/** A bitmask indicating the state of the ZLL device. This maps directly to the ZLL information field in the scan response. uint16_t */
var EmberZllState;
(function (EmberZllState) {
    /** No state. */
    EmberZllState[EmberZllState["NONE"] = 0] = "NONE";
    /** The device is factory new. */
    EmberZllState[EmberZllState["FACTORY_NEW"] = 1] = "FACTORY_NEW";
    /** The device is capable of assigning addresses to other devices. */
    EmberZllState[EmberZllState["ADDRESS_ASSIGNMENT_CAPABLE"] = 2] = "ADDRESS_ASSIGNMENT_CAPABLE";
    /** The device is initiating a link operation. */
    EmberZllState[EmberZllState["LINK_INITIATOR"] = 16] = "LINK_INITIATOR";
    /** The device is requesting link priority. */
    EmberZllState[EmberZllState["LINK_PRIORITY_REQUEST"] = 32] = "LINK_PRIORITY_REQUEST";
    /** The device is a Zigbee 3.0 device. */
    EmberZllState[EmberZllState["PROFILE_INTEROP"] = 128] = "PROFILE_INTEROP";
    /** The device is on a non-ZLL network. */
    EmberZllState[EmberZllState["NON_ZLL_NETWORK"] = 256] = "NON_ZLL_NETWORK";
    /** Internal use: the ZLL token's key values point to a PSA key identifier */
    EmberZllState[EmberZllState["TOKEN_POINTS_TO_PSA_ID"] = 512] = "TOKEN_POINTS_TO_PSA_ID";
})(EmberZllState || (exports.EmberZllState = EmberZllState = {}));
/** Differentiates among ZLL network operations. */
var EzspZllNetworkOperation;
(function (EzspZllNetworkOperation) {
    /** ZLL form network command. */
    EzspZllNetworkOperation[EzspZllNetworkOperation["FORM_NETWORK"] = 0] = "FORM_NETWORK";
    /** ZLL join target command. */
    EzspZllNetworkOperation[EzspZllNetworkOperation["JOIN_TARGET"] = 1] = "JOIN_TARGET";
})(EzspZllNetworkOperation || (exports.EzspZllNetworkOperation = EzspZllNetworkOperation = {}));
/** The key encryption algorithms supported by the stack. */
var EmberZllKeyIndex;
(function (EmberZllKeyIndex) {
    /** The key encryption algorithm for use during development. */
    EmberZllKeyIndex[EmberZllKeyIndex["DEVELOPMENT"] = 0] = "DEVELOPMENT";
    /** The key encryption algorithm shared by all certified devices. */
    EmberZllKeyIndex[EmberZllKeyIndex["MASTER"] = 4] = "MASTER";
    /** The key encryption algorithm for use during development and certification. */
    EmberZllKeyIndex[EmberZllKeyIndex["CERTIFICATION"] = 15] = "CERTIFICATION";
})(EmberZllKeyIndex || (exports.EmberZllKeyIndex = EmberZllKeyIndex = {}));
/** uint8_t */
var EmberGpApplicationId;
(function (EmberGpApplicationId) {
    /** Source identifier. */
    EmberGpApplicationId[EmberGpApplicationId["SOURCE_ID"] = 0] = "SOURCE_ID";
    /** IEEE address. */
    EmberGpApplicationId[EmberGpApplicationId["IEEE_ADDRESS"] = 2] = "IEEE_ADDRESS";
})(EmberGpApplicationId || (exports.EmberGpApplicationId = EmberGpApplicationId = {}));
/** Green Power Security Level. uint8_t */
var EmberGpSecurityLevel;
(function (EmberGpSecurityLevel) {
    /** No Security  */
    EmberGpSecurityLevel[EmberGpSecurityLevel["NONE"] = 0] = "NONE";
    /** Reserved  */
    EmberGpSecurityLevel[EmberGpSecurityLevel["RESERVED"] = 1] = "RESERVED";
    /** 4 Byte Frame Counter and 4 Byte MIC */
    EmberGpSecurityLevel[EmberGpSecurityLevel["FC_MIC"] = 2] = "FC_MIC";
    /** 4 Byte Frame Counter and 4 Byte MIC with encryption */
    EmberGpSecurityLevel[EmberGpSecurityLevel["FC_MIC_ENCRYPTED"] = 3] = "FC_MIC_ENCRYPTED";
})(EmberGpSecurityLevel || (exports.EmberGpSecurityLevel = EmberGpSecurityLevel = {}));
/** Green Power Security Security Key Type. uint8_t */
var EmberGpKeyType;
(function (EmberGpKeyType) {
    /** No Key */
    EmberGpKeyType[EmberGpKeyType["NONE"] = 0] = "NONE";
    /** GP Security Key Type is Zigbee Network Key */
    EmberGpKeyType[EmberGpKeyType["NWK"] = 1] = "NWK";
    /** GP Security Key Type is Group Key */
    EmberGpKeyType[EmberGpKeyType["GPD_GROUP"] = 2] = "GPD_GROUP";
    /** GP Security Key Type is Derived Network Key */
    EmberGpKeyType[EmberGpKeyType["NWK_DERIVED"] = 3] = "NWK_DERIVED";
    /** GP Security Key Type is Out Of Box Key */
    EmberGpKeyType[EmberGpKeyType["GPD_OOB"] = 4] = "GPD_OOB";
    /** GP Security Key Type is GPD Derived Key */
    EmberGpKeyType[EmberGpKeyType["GPD_DERIVED"] = 7] = "GPD_DERIVED";
})(EmberGpKeyType || (exports.EmberGpKeyType = EmberGpKeyType = {}));
/** uint8_t */
var EmberGpProxyTableEntryStatus;
(function (EmberGpProxyTableEntryStatus) {
    /** The GP table entry is in use for a Proxy Table Entry. */
    EmberGpProxyTableEntryStatus[EmberGpProxyTableEntryStatus["ACTIVE"] = 1] = "ACTIVE";
    /** The proxy table entry is not in use. */
    EmberGpProxyTableEntryStatus[EmberGpProxyTableEntryStatus["UNUSED"] = 255] = "UNUSED";
})(EmberGpProxyTableEntryStatus || (exports.EmberGpProxyTableEntryStatus = EmberGpProxyTableEntryStatus = {}));
/** GP Sink Type. */
var EmberGpSinkType;
(function (EmberGpSinkType) {
    /** Sink Type is Full Unicast */
    EmberGpSinkType[EmberGpSinkType["FULL_UNICAST"] = 0] = "FULL_UNICAST";
    /** Sink Type is Derived groupcast, the group ID is derived from the GpdId during commissioning.
     * The sink is added to the APS group with that groupId.
     */
    EmberGpSinkType[EmberGpSinkType["D_GROUPCAST"] = 1] = "D_GROUPCAST";
    /** Sink type GROUPCAST, the groupId can be obtained from the APS group table
     * or from the sink table.
     */
    EmberGpSinkType[EmberGpSinkType["GROUPCAST"] = 2] = "GROUPCAST";
    /** Sink Type is Light Weight Unicast. */
    EmberGpSinkType[EmberGpSinkType["LW_UNICAST"] = 3] = "LW_UNICAST";
    /** Unused sink type */
    EmberGpSinkType[EmberGpSinkType["UNUSED"] = 255] = "UNUSED";
})(EmberGpSinkType || (exports.EmberGpSinkType = EmberGpSinkType = {}));
/** uint8_t */
var EmberGpSinkTableEntryStatus;
(function (EmberGpSinkTableEntryStatus) {
    /** The GP table entry is in use for a Sink Table Entry. */
    EmberGpSinkTableEntryStatus[EmberGpSinkTableEntryStatus["ACTIVE"] = 1] = "ACTIVE";
    /** The proxy table entry is not in use. */
    EmberGpSinkTableEntryStatus[EmberGpSinkTableEntryStatus["UNUSED"] = 255] = "UNUSED";
})(EmberGpSinkTableEntryStatus || (exports.EmberGpSinkTableEntryStatus = EmberGpSinkTableEntryStatus = {}));
var EmberLeaveNetworkOption;
(function (EmberLeaveNetworkOption) {
    /** Leave with no option. */
    EmberLeaveNetworkOption[EmberLeaveNetworkOption["WITH_NO_OPTION"] = 0] = "WITH_NO_OPTION";
    /** Leave with option rejoin. */
    EmberLeaveNetworkOption[EmberLeaveNetworkOption["WITH_OPTION_REJOIN"] = 32] = "WITH_OPTION_REJOIN";
    /** Leave is requested. */
    EmberLeaveNetworkOption[EmberLeaveNetworkOption["IS_REQUESTED"] = 64] = "IS_REQUESTED";
})(EmberLeaveNetworkOption || (exports.EmberLeaveNetworkOption = EmberLeaveNetworkOption = {}));
/**
 * Packet transmit priorities in terms of getting into the MAC queue.
 *
 * SL_802154_TRANSMIT_PRIORITY_HIGH High priority headers go on the front of the queue.
 * SL_802154_TRANSMIT_PRIORITY_NORMAL  Normal priority headers go on the back of the queue.
 * SL_802154_TRANSMIT_PRIORITY_SCAN_OKAY Normally, only beacon requests and orphan notifications can be sent during a scan.
 * They are submitted with SCAN_OKAY and go on the front of the queue. Other packets could be submitted with this priority, but it is not recommended.
 */
var EmberTransmitPriority;
(function (EmberTransmitPriority) {
    EmberTransmitPriority[EmberTransmitPriority["HIGH"] = 0] = "HIGH";
    EmberTransmitPriority[EmberTransmitPriority["NORMAL"] = 1] = "NORMAL";
    EmberTransmitPriority[EmberTransmitPriority["SCAN_OKAY"] = 2] = "SCAN_OKAY";
})(EmberTransmitPriority || (exports.EmberTransmitPriority = EmberTransmitPriority = {}));
var IEEE802154CcaMode;
(function (IEEE802154CcaMode) {
    /** RSSI-based CCA. CCA reports a busy medium upon detecting any energy above -75 (default RAIL_CsmaConfig_t.ccaThreshold). */
    IEEE802154CcaMode[IEEE802154CcaMode["RSSI"] = 0] = "RSSI";
    /**
     * Signal Identifier-based CCA. CCA reports a busy medium only upon the detection of a signal compliant with this standard
     * with the same modulation and spreading characteristics of the PHY that is currently in use.
     */
    IEEE802154CcaMode[IEEE802154CcaMode["SIGNAL"] = 1] = "SIGNAL";
    /**
     * RSSI or signal identifier-based CCA. CCA reports a busy medium on either detecting any energy above
     * -75 (default RAIL_CsmaConfig_t.ccaThreshold) or detection of a signal compliant with this standard with the same modulation
     * and spreading characteristics of the PHY that is currently in use.
     */
    IEEE802154CcaMode[IEEE802154CcaMode["SIGNAL_OR_RSSI"] = 2] = "SIGNAL_OR_RSSI";
    /**
     * RSSI and signal identifier-based CCA. CCA reports a busy medium only on detecting any energy above -75 (default RAIL_CsmaConfig_t.ccaThreshold)
     * of a signal compliant with this standard with the same modulation and spreading characteristics of the PHY that is currently in use.
     */
    IEEE802154CcaMode[IEEE802154CcaMode["SIGNAL_AND_RSSI"] = 3] = "SIGNAL_AND_RSSI";
    /** ALOHA. Always transmit CCA=1. CCA always reports an idle medium. */
    IEEE802154CcaMode[IEEE802154CcaMode["ALWAYS_TRANSMIT"] = 4] = "ALWAYS_TRANSMIT";
})(IEEE802154CcaMode || (exports.IEEE802154CcaMode = IEEE802154CcaMode = {}));
//# sourceMappingURL=enums.js.map