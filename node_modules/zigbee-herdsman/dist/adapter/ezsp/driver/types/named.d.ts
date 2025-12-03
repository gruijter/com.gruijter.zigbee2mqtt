import * as basic from "./basic";
export declare class NcpResetCode extends basic.uint8_t {
    static RESET_UNKNOWN_REASON: number;
    static RESET_EXTERNAL: number;
    static RESET_POWER_ON: number;
    static RESET_WATCHDOG: number;
    static RESET_ASSERT: number;
    static RESET_BOOTLOADER: number;
    static RESET_SOFTWARE: number;
    static ERROR_EXCEEDED_MAXIMUM_ACK_TIMEOUT_COUNT: number;
    static ERROR_UNKNOWN_EM3XX_ERROR: number;
}
export declare class EmberRf4ceTxOption extends basic.uint8_t {
}
export declare class EmberRf4ceNodeCapabilities extends basic.uint8_t {
}
export declare class EmberRf4ceApplicationCapabilities extends basic.uint8_t {
}
export declare class EmberNodeId extends basic.uint16_t {
}
export declare class EmberPanId extends basic.uint16_t {
}
export declare class EmberMulticastId extends basic.uint16_t {
}
declare const EmberEUI64_base: {
    new (): any;
    deserialize(cls: any, data: Buffer): any;
};
export declare class EmberEUI64 extends EmberEUI64_base {
    private _value;
    constructor(_value: ArrayLike<number> | string);
    static deserialize(cls: any, data: Buffer): any[];
    static serialize(_cls: any, value: number[] | EmberEUI64): Buffer;
    get value(): any;
    toString(): string;
}
export declare class EmberLibraryStatus extends basic.uint8_t {
}
export declare class SecureEzspSecurityType extends basic.uint32_t {
}
export declare class SecureEzspSecurityLevel extends basic.uint8_t {
}
export declare class EmberGpSecurityLevel extends basic.uint8_t {
}
export declare class EmberGpKeyType extends basic.uint8_t {
}
export declare class SecureEzspRandomNumber extends basic.uint64_t {
}
export declare class SecureEzspSessionId extends basic.uint64_t {
}
export declare class Bool extends basic.uint8_t {
    static false: number;
    static true: number;
}
export declare class EzspConfigId extends basic.uint8_t {
    static CONFIG_PACKET_BUFFER_COUNT: number;
    static CONFIG_NEIGHBOR_TABLE_SIZE: number;
    static CONFIG_APS_UNICAST_MESSAGE_COUNT: number;
    static CONFIG_BINDING_TABLE_SIZE: number;
    static CONFIG_ADDRESS_TABLE_SIZE: number;
    static CONFIG_MULTICAST_TABLE_SIZE: number;
    static CONFIG_ROUTE_TABLE_SIZE: number;
    static CONFIG_DISCOVERY_TABLE_SIZE: number;
    static CONFIG_BROADCAST_ALARM_DATA_SIZE: number;
    static CONFIG_UNICAST_ALARM_DATA_SIZE: number;
    static CONFIG_STACK_PROFILE: number;
    static CONFIG_SECURITY_LEVEL: number;
    static CONFIG_MAX_HOPS: number;
    static CONFIG_MAX_END_DEVICE_CHILDREN: number;
    static CONFIG_INDIRECT_TRANSMISSION_TIMEOUT: number;
    static CONFIG_END_DEVICE_POLL_TIMEOUT: number;
    static CONFIG_MOBILE_NODE_POLL_TIMEOUT: number;
    static CONFIG_RESERVED_MOBILE_CHILD_ENTRIES: number;
    static CONFIG_TX_POWER_MODE: number;
    static CONFIG_DISABLE_RELAY: number;
    static CONFIG_TRUST_CENTER_ADDRESS_CACHE_SIZE: number;
    static CONFIG_SOURCE_ROUTE_TABLE_SIZE: number;
    static CONFIG_END_DEVICE_POLL_TIMEOUT_SHIFT: number;
    static CONFIG_FRAGMENT_WINDOW_SIZE: number;
    static CONFIG_FRAGMENT_DELAY_MS: number;
    static CONFIG_KEY_TABLE_SIZE: number;
    static CONFIG_APS_ACK_TIMEOUT: number;
    static CONFIG_ACTIVE_SCAN_DURATION: number;
    static CONFIG_END_DEVICE_BIND_TIMEOUT: number;
    static CONFIG_PAN_ID_CONFLICT_REPORT_THRESHOLD: number;
    static CONFIG_REQUEST_KEY_TIMEOUT: number;
    static CONFIG_CERTIFICATE_TABLE_SIZE: number;
    static CONFIG_APPLICATION_ZDO_FLAGS: number;
    static CONFIG_BROADCAST_TABLE_SIZE: number;
    static CONFIG_MAC_FILTER_TABLE_SIZE: number;
    static CONFIG_SUPPORTED_NETWORKS: number;
    static CONFIG_SEND_MULTICASTS_TO_SLEEPY_ADDRESS: number;
    static CONFIG_ZLL_GROUP_ADDRESSES: number;
    static CONFIG_ZLL_RSSI_THRESHOLD: number;
    static CONFIG_RF4CE_PAIRING_TABLE_SIZE: number;
    static CONFIG_RF4CE_PENDING_OUTGOING_PACKET_TABLE_SIZE: number;
    static CONFIG_MTORR_FLOW_CONTROL: number;
    static CONFIG_RETRY_QUEUE_SIZE: number;
    static CONFIG_NEW_BROADCAST_ENTRY_THRESHOLD: number;
    static CONFIG_TRANSIENT_KEY_TIMEOUT_S: number;
    static CONFIG_BROADCAST_MIN_ACKS_NEEDED: number;
    static CONFIG_TC_REJOINS_USING_WELL_KNOWN_KEY_TIMEOUT_S: number;
}
export declare class EzspValueId extends basic.uint8_t {
    static VALUE_TOKEN_STACK_NODE_DATA: number;
    static VALUE_MAC_PASSTHROUGH_FLAGS: number;
    static VALUE_EMBERNET_PASSTHROUGH_SOURCE_ADDRESS: number;
    static VALUE_FREE_BUFFERS: number;
    static VALUE_UART_SYNCH_CALLBACKS: number;
    static VALUE_MAXIMUM_INCOMING_TRANSFER_SIZE: number;
    static VALUE_MAXIMUM_OUTGOING_TRANSFER_SIZE: number;
    static VALUE_STACK_TOKEN_WRITING: number;
    static VALUE_STACK_IS_PERFORMING_REJOIN: number;
    static VALUE_MAC_FILTER_LIST: number;
    static VALUE_EXTENDED_SECURITY_BITMASK: number;
    static VALUE_NODE_SHORT_ID: number;
    static VALUE_DESCRIPTOR_CAPABILITY: number;
    static VALUE_STACK_DEVICE_REQUEST_SEQUENCE_NUMBER: number;
    static VALUE_RADIO_HOLD_OFF: number;
    static VALUE_ENDPOINT_FLAGS: number;
    static VALUE_MFG_SECURITY_CONFIG: number;
    static VALUE_VERSION_INFO: number;
    static VALUE_NEXT_HOST_REJOIN_REASON: number;
    static VALUE_LAST_REJOIN_REASON: number;
    static VALUE_NEXT_ZIGBEE_SEQUENCE_NUMBER: number;
    static VALUE_CCA_THRESHOLD: number;
    static VALUE_SET_COUNTER_THRESHOLD: number;
    static VALUE_RESET_COUNTER_THRESHOLDS: number;
    static VALUE_CLEAR_COUNTERS: number;
    static VALUE_RF4CE_BASE_CHANNEL: number;
    static VALUE_RF4CE_SUPPORTED_DEVICE_TYPES_LIST: number;
    static VALUE_RF4CE_SUPPORTED_PROFILES_LIST: number;
    static VALUE_ENABLE_R21_BEHAVIOR: number;
    static VALUE_ANTENNA_MODE: number;
    static VALUE_RF4CE_GDP_BINDING_RECIPIENT_PARAMETERS: number;
    static VALUE_RF4CE_GDP_PUSH_BUTTON_STIMULUS_RECEIVED_PENDING_FLAG: number;
    static VALUE_RF4CE_GDP_BINDING_PROXY_FLAG: number;
    static VALUE_RF4CE_GDP_APPLICATION_SPECIFIC_USER_STRING: number;
    static VALUE_RF4CE_MSO_USER_STRING: number;
    static VALUE_RF4CE_MSO_BINDING_RECIPIENT_PARAMETERS: number;
    static VALUE_NWK_FRAME_COUNTER: number;
    static VALUE_APS_FRAME_COUNTER: number;
    static VALUE_RETRY_DEVICE_TYPE: number;
    static VALUE_RF4CE_BASE_CHANNEL2: number;
    static VALUE_RF4CE_SUPPORTED_DEVICE_TYPES_LIST2: number;
    static VALUE_RF4CE_SUPPORTED_PROFILES_LIST2: number;
    static VALUE_ENABLE_PTA: number;
    static VALUE_PTA_OPTIONS: number;
    static VALUE_MFGLIB_OPTIONS: number;
    static VALUE_END_DEVICE_KEEP_ALIVE_SUPPORT_MODE: number;
}
export declare class EzspExtendedValueId extends basic.uint8_t {
    static EXTENDED_VALUE_ENDPOINT_FLAGS: number;
    static EXTENDED_VALUE_LAST_LEAVE_REASON: number;
    static EXTENDED_VALUE_GET_SOURCE_ROUTE_OVERHEAD: number;
}
export declare class EzspEndpointFlags extends basic.uint16_t {
    static ENDPOINT_DISABLED: number;
    static ENDPOINT_ENABLED: number;
}
export declare class EmberConfigTxPowerMode extends basic.uint16_t {
    static TX_POWER_MODE_DEFAULT: number;
    static TX_POWER_MODE_BOOST: number;
    static TX_POWER_MODE_ALTERNATE: number;
}
export declare class EzspPolicyId extends basic.uint8_t {
    static TRUST_CENTER_POLICY: number;
    static BINDING_MODIFICATION_POLICY: number;
    static UNICAST_REPLIES_POLICY: number;
    static POLL_HANDLER_POLICY: number;
    static MESSAGE_CONTENTS_IN_CALLBACK_POLICY: number;
    static TC_KEY_REQUEST_POLICY: number;
    static APP_KEY_REQUEST_POLICY: number;
    static PACKET_VALIDATE_LIBRARY_POLICY: number;
    static ZLL_POLICY: number;
    static TC_REJOINS_USING_WELL_KNOWN_KEY_POLICY: number;
}
export declare class EzspDecisionId extends basic.uint16_t {
    static ALLOW_JOINS: number;
    static ALLOW_JOINS_REJOINS_HAVE_LINK_KEY: number;
    static ALLOW_PRECONFIGURED_KEY_JOINS: number;
    static ALLOW_REJOINS_ONLY: number;
    static DISALLOW_ALL_JOINS_AND_REJOINS: number;
    static IGNORE_TRUST_CENTER_REJOINS: number;
    static DISALLOW_BINDING_MODIFICATION: number;
    static ALLOW_BINDING_MODIFICATION: number;
    static CHECK_BINDING_MODIFICATIONS_ARE_VALID_ENDPOINT_CLUSTERS: number;
    static HOST_WILL_NOT_SUPPLY_REPLY: number;
    static HOST_WILL_SUPPLY_REPLY: number;
    static POLL_HANDLER_IGNORE: number;
    static POLL_HANDLER_CALLBACK: number;
    static MESSAGE_TAG_ONLY_IN_CALLBACK: number;
    static MESSAGE_TAG_AND_CONTENTS_IN_CALLBACK: number;
    static DENY_TC_KEY_REQUESTS: number;
    static ALLOW_TC_KEY_REQUESTS: number;
    static GENERATE_NEW_TC_LINK_KEY: number;
    static DENY_APP_KEY_REQUESTS: number;
    static ALLOW_APP_KEY_REQUESTS: number;
    static PACKET_VALIDATE_LIBRARY_CHECKS_ENABLED: number;
    static PACKET_VALIDATE_LIBRARY_CHECKS_DISABLED: number;
}
export declare class EzspMfgTokenId extends basic.uint8_t {
    static MFG_CUSTOM_VERSION: number;
    static MFG_STRING: number;
    static MFG_BOARD_NAME: number;
    static MFG_MANUF_ID: number;
    static MFG_PHY_CONFIG: number;
    static MFG_BOOTLOAD_AES_KEY: number;
    static MFG_ASH_CONFIG: number;
    static MFG_STORAGE: number;
    static STACK_CAL_DATA: number;
    static MFG_CBKE_DATA: number;
    static MFG_INSTALLATION_CODE: number;
    static STACK_CAL_FILTER: number;
    static MFG_CUSTOM_EUI_64: number;
    static MFG_CTUNE: number;
}
export declare class EzspStatus extends basic.uint8_t {
    static SUCCESS: number;
    static SPI_ERR_FATAL: number;
    static SPI_ERR_NCP_RESET: number;
    static SPI_ERR_OVERSIZED_FRAME: number;
    static SPI_ERR_ABORTED_TRANSACTION: number;
    static SPI_ERR_MISSING_FRAME_TERMINATOR: number;
    static SPI_ERR_WAIT_SECTION_TIMEOUT: number;
    static SPI_ERR_NO_FRAME_TERMINATOR: number;
    static SPI_ERR_COMMAND_OVERSIZED: number;
    static SPI_ERR_RESPONSE_OVERSIZED: number;
    static SPI_WAITING_FOR_RESPONSE: number;
    static SPI_ERR_HANDSHAKE_TIMEOUT: number;
    static SPI_ERR_STARTUP_TIMEOUT: number;
    static SPI_ERR_STARTUP_FAIL: number;
    static SPI_ERR_UNSUPPORTED_SPI_COMMAND: number;
    static ASH_IN_PROGRESS: number;
    static HOST_FATAL_ERROR: number;
    static ASH_NCP_FATAL_ERROR: number;
    static DATA_FRAME_TOO_LONG: number;
    static DATA_FRAME_TOO_SHORT: number;
    static NO_TX_SPACE: number;
    static NO_RX_SPACE: number;
    static NO_RX_DATA: number;
    static NOT_CONNECTED: number;
    static ERROR_VERSION_NOT_SET: number;
    static ERROR_INVALID_FRAME_ID: number;
    static ERROR_WRONG_DIRECTION: number;
    static ERROR_TRUNCATED: number;
    static ERROR_OVERFLOW: number;
    static ERROR_OUT_OF_MEMORY: number;
    static ERROR_INVALID_VALUE: number;
    static ERROR_INVALID_ID: number;
    static ERROR_INVALID_CALL: number;
    static ERROR_NO_RESPONSE: number;
    static ERROR_COMMAND_TOO_LONG: number;
    static ERROR_QUEUE_FULL: number;
    static ERROR_COMMAND_FILTERED: number;
    static ERROR_SECURITY_KEY_ALREADY_SET: number;
    static ERROR_SECURITY_TYPE_INVALID: number;
    static ERROR_SECURITY_PARAMETERS_INVALID: number;
    static ERROR_SECURITY_PARAMETERS_ALREADY_SET: number;
    static ERROR_SECURITY_KEY_NOT_SET: number;
    static ERROR_SECURITY_PARAMETERS_NOT_SET: number;
    static ERROR_UNSUPPORTED_CONTROL: number;
    static ERROR_UNSECURE_FRAME: number;
    static ASH_ERROR_VERSION: number;
    static ASH_ERROR_TIMEOUTS: number;
    static ASH_ERROR_RESET_FAIL: number;
    static ASH_ERROR_NCP_RESET: number;
    static ERROR_SERIAL_INIT: number;
    static ASH_ERROR_NCP_TYPE: number;
    static ASH_ERROR_RESET_METHOD: number;
    static ASH_ERROR_XON_XOFF: number;
    static ASH_STARTED: number;
    static ASH_CONNECTED: number;
    static ASH_DISCONNECTED: number;
    static ASH_ACK_TIMEOUT: number;
    static ASH_CANCELLED: number;
    static ASH_OUT_OF_SEQUENCE: number;
    static ASH_BAD_CRC: number;
    static ASH_COMM_ERROR: number;
    static ASH_BAD_ACKNUM: number;
    static ASH_TOO_SHORT: number;
    static ASH_TOO_LONG: number;
    static ASH_BAD_CONTROL: number;
    static ASH_BAD_LENGTH: number;
    static ASH_ACK_RECEIVED: number;
    static ASH_ACK_SENT: number;
    static NO_ERROR: number;
}
export declare class EmberStatus extends basic.uint8_t {
    static SUCCESS: number;
    static ERR_FATAL: number;
    static BAD_ARGUMENT: number;
    static EEPROM_MFG_STACK_VERSION_MISMATCH: number;
    static INCOMPATIBLE_STATIC_MEMORY_DEFINITIONS: number;
    static EEPROM_MFG_VERSION_MISMATCH: number;
    static EEPROM_STACK_VERSION_MISMATCH: number;
    static NO_BUFFERS: number;
    static SERIAL_INVALID_BAUD_RATE: number;
    static SERIAL_INVALID_PORT: number;
    static SERIAL_TX_OVERFLOW: number;
    static SERIAL_RX_OVERFLOW: number;
    static SERIAL_RX_FRAME_ERROR: number;
    static SERIAL_RX_PARITY_ERROR: number;
    static SERIAL_RX_EMPTY: number;
    static SERIAL_RX_OVERRUN_ERROR: number;
    static MAC_TRANSMIT_QUEUE_FULL: number;
    static MAC_UNKNOWN_HEADER_TYPE: number;
    static MAC_SCANNING: number;
    static MAC_NO_DATA: number;
    static MAC_JOINED_NETWORK: number;
    static MAC_BAD_SCAN_DURATION: number;
    static MAC_INCORRECT_SCAN_TYPE: number;
    static MAC_INVALID_CHANNEL_MASK: number;
    static MAC_COMMAND_TRANSMIT_FAILURE: number;
    static MAC_NO_ACK_RECEIVED: number;
    static MAC_INDIRECT_TIMEOUT: number;
    static SIM_EEPROM_ERASE_PAGE_GREEN: number;
    static SIM_EEPROM_ERASE_PAGE_RED: number;
    static SIM_EEPROM_FULL: number;
    static ERR_FLASH_WRITE_INHIBITED: number;
    static ERR_FLASH_VERIFY_FAILED: number;
    static SIM_EEPROM_INIT_1_FAILED: number;
    static SIM_EEPROM_INIT_2_FAILED: number;
    static SIM_EEPROM_INIT_3_FAILED: number;
    static ERR_FLASH_PROG_FAIL: number;
    static ERR_FLASH_ERASE_FAIL: number;
    static ERR_BOOTLOADER_TRAP_TABLE_BAD: number;
    static ERR_BOOTLOADER_TRAP_UNKNOWN: number;
    static ERR_BOOTLOADER_NO_IMAGE: number;
    static DELIVERY_FAILED: number;
    static BINDING_INDEX_OUT_OF_RANGE: number;
    static ADDRESS_TABLE_INDEX_OUT_OF_RANGE: number;
    static INVALID_BINDING_INDEX: number;
    static INVALID_CALL: number;
    static COST_NOT_KNOWN: number;
    static MAX_MESSAGE_LIMIT_REACHED: number;
    static MESSAGE_TOO_LONG: number;
    static BINDING_IS_ACTIVE: number;
    static ADDRESS_TABLE_ENTRY_IS_ACTIVE: number;
    static ADC_CONVERSION_DONE: number;
    static ADC_CONVERSION_BUSY: number;
    static ADC_CONVERSION_DEFERRED: number;
    static ADC_NO_CONVERSION_PENDING: number;
    static SLEEP_INTERRUPTED: number;
    static PHY_TX_UNDERFLOW: number;
    static PHY_TX_INCOMPLETE: number;
    static PHY_INVALID_CHANNEL: number;
    static PHY_INVALID_POWER: number;
    static PHY_TX_BUSY: number;
    static PHY_OSCILLATOR_CHECK_FAILED: number;
    static PHY_ACK_RECEIVED: number;
    static NETWORK_UP: number;
    static NETWORK_DOWN: number;
    static JOIN_FAILED: number;
    static MOVE_FAILED: number;
    static CANNOT_JOIN_AS_ROUTER: number;
    static NODE_ID_CHANGED: number;
    static PAN_ID_CHANGED: number;
    static NO_BEACONS: number;
    static RECEIVED_KEY_IN_THE_CLEAR: number;
    static NO_NETWORK_KEY_RECEIVED: number;
    static NO_LINK_KEY_RECEIVED: number;
    static PRECONFIGURED_KEY_REQUIRED: number;
    static NOT_JOINED: number;
    static INVALID_SECURITY_LEVEL: number;
    static NETWORK_BUSY: number;
    static INVALID_ENDPOINT: number;
    static BINDING_HAS_CHANGED: number;
    static INSUFFICIENT_RANDOM_DATA: number;
    static APS_ENCRYPTION_ERROR: number;
    static SECURITY_STATE_NOT_SET: number;
    static KEY_TABLE_INVALID_ADDRESS: number;
    static SECURITY_CONFIGURATION_INVALID: number;
    static TOO_SOON_FOR_SWITCH_KEY: number;
    static KEY_NOT_AUTHORIZED: number;
    static SECURITY_DATA_INVALID: number;
    static SOURCE_ROUTE_FAILURE: number;
    static MANY_TO_ONE_ROUTE_FAILURE: number;
    static STACK_AND_HARDWARE_MISMATCH: number;
    static INDEX_OUT_OF_RANGE: number;
    static TABLE_FULL: number;
    static TABLE_ENTRY_ERASED: number;
    static LIBRARY_NOT_PRESENT: number;
    static OPERATION_IN_PROGRESS: number;
    static APPLICATION_ERROR_0: number;
    static APPLICATION_ERROR_1: number;
    static APPLICATION_ERROR_2: number;
    static APPLICATION_ERROR_3: number;
    static APPLICATION_ERROR_4: number;
    static APPLICATION_ERROR_5: number;
    static APPLICATION_ERROR_6: number;
    static APPLICATION_ERROR_7: number;
    static APPLICATION_ERROR_8: number;
    static APPLICATION_ERROR_9: number;
    static APPLICATION_ERROR_10: number;
    static APPLICATION_ERROR_11: number;
    static APPLICATION_ERROR_12: number;
    static APPLICATION_ERROR_13: number;
    static APPLICATION_ERROR_14: number;
    static APPLICATION_ERROR_15: number;
}
/** define global status variable. */
export declare class SLStatus extends basic.uint32_t {
    /** No error. */
    static SL_STATUS_OK: number;
    /** Generic error. */
    static SL_STATUS_FAIL: number;
    /**State Errors */
    /** Generic invalid state error. */
    static SL_STATUS_INVALID_STATE: number;
    /** Module is not ready for requested operation. */
    static SL_STATUS_NOT_READY: number;
    /** Module is busy and cannot carry out requested operation. */
    static SL_STATUS_BUSY: number;
    /** Operation is in progress and not yet complete (pass or fail). */
    static SL_STATUS_IN_PROGRESS: number;
    /** Operation aborted. */
    static SL_STATUS_ABORT: number;
    /** Operation timed out. */
    static SL_STATUS_TIMEOUT: number;
    /** Operation not allowed per permissions. */
    static SL_STATUS_PERMISSION: number;
    /** Non-blocking operation would block. */
    static SL_STATUS_WOULD_BLOCK: number;
    /** Operation/module is Idle, cannot carry requested operation. */
    static SL_STATUS_IDLE: number;
    /** Operation cannot be done while construct is waiting. */
    static SL_STATUS_IS_WAITING: number;
    /** No task/construct waiting/pending for that action/event. */
    static SL_STATUS_NONE_WAITING: number;
    /** Operation cannot be done while construct is suspended. */
    static SL_STATUS_SUSPENDED: number;
    /** Feature not available due to software configuration. */
    static SL_STATUS_NOT_AVAILABLE: number;
    /** Feature not supported. */
    static SL_STATUS_NOT_SUPPORTED: number;
    /** Initialization failed. */
    static SL_STATUS_INITIALIZATION: number;
    /** Module has not been initialized. */
    static SL_STATUS_NOT_INITIALIZED: number;
    /** Module has already been initialized. */
    static SL_STATUS_ALREADY_INITIALIZED: number;
    /** Object/construct has been deleted. */
    static SL_STATUS_DELETED: number;
    /** Illegal call from ISR. */
    static SL_STATUS_ISR: number;
    /** Illegal call because network is up. */
    static SL_STATUS_NETWORK_UP: number;
    /** Illegal call because network is down. */
    static SL_STATUS_NETWORK_DOWN: number;
    /** Failure due to not being joined in a network. */
    static SL_STATUS_NOT_JOINED: number;
    /** Invalid operation as there are no beacons. */
    static SL_STATUS_NO_BEACONS: number;
    /**Allocation/ownership Errors */
    /** Generic allocation error. */
    static SL_STATUS_ALLOCATION_FAILED: number;
    /** No more resource available to perform the operation. */
    static SL_STATUS_NO_MORE_RESOURCE: number;
    /** Item/list/queue is empty. */
    static SL_STATUS_EMPTY: number;
    /** Item/list/queue is full. */
    static SL_STATUS_FULL: number;
    /** Item would overflow. */
    static SL_STATUS_WOULD_OVERFLOW: number;
    /** Item/list/queue has been overflowed. */
    static SL_STATUS_HAS_OVERFLOWED: number;
    /** Generic ownership error. */
    static SL_STATUS_OWNERSHIP: number;
    /** Already/still owning resource. */
    static SL_STATUS_IS_OWNER: number;
    /**Invalid Parameters Errors */
    /** Generic invalid argument or consequence of invalid argument. */
    static SL_STATUS_INVALID_PARAMETER: number;
    /** Invalid null pointer received as argument. */
    static SL_STATUS_NULL_POINTER: number;
    /** Invalid configuration provided. */
    static SL_STATUS_INVALID_CONFIGURATION: number;
    /** Invalid mode. */
    static SL_STATUS_INVALID_MODE: number;
    /** Invalid handle. */
    static SL_STATUS_INVALID_HANDLE: number;
    /** Invalid type for operation. */
    static SL_STATUS_INVALID_TYPE: number;
    /** Invalid index. */
    static SL_STATUS_INVALID_INDEX: number;
    /** Invalid range. */
    static SL_STATUS_INVALID_RANGE: number;
    /** Invalid key. */
    static SL_STATUS_INVALID_KEY: number;
    /** Invalid credentials. */
    static SL_STATUS_INVALID_CREDENTIALS: number;
    /** Invalid count. */
    static SL_STATUS_INVALID_COUNT: number;
    /** Invalid signature / verification failed. */
    static SL_STATUS_INVALID_SIGNATURE: number;
    /** Item could not be found. */
    static SL_STATUS_NOT_FOUND: number;
    /** Item already exists. */
    static SL_STATUS_ALREADY_EXISTS: number;
    /**IO/Communication Errors */
    /** Generic I/O failure. */
    static SL_STATUS_IO: number;
    /** I/O failure due to timeout. */
    static SL_STATUS_IO_TIMEOUT: number;
    /** Generic transmission error. */
    static SL_STATUS_TRANSMIT: number;
    /** Transmit underflowed. */
    static SL_STATUS_TRANSMIT_UNDERFLOW: number;
    /** Transmit is incomplete. */
    static SL_STATUS_TRANSMIT_INCOMPLETE: number;
    /** Transmit is busy. */
    static SL_STATUS_TRANSMIT_BUSY: number;
    /** Generic reception error. */
    static SL_STATUS_RECEIVE: number;
    /** Failed to read on/via given object. */
    static SL_STATUS_OBJECT_READ: number;
    /** Failed to write on/via given object. */
    static SL_STATUS_OBJECT_WRITE: number;
    /** Message is too long. */
    static SL_STATUS_MESSAGE_TOO_LONG: number;
    /**EEPROM/Flash Errors */
    static SL_STATUS_EEPROM_MFG_VERSION_MISMATCH: number;
    static SL_STATUS_EEPROM_STACK_VERSION_MISMATCH: number;
    /** Flash write is inhibited. */
    static SL_STATUS_FLASH_WRITE_INHIBITED: number;
    /** Flash verification failed. */
    static SL_STATUS_FLASH_VERIFY_FAILED: number;
    /** Flash programming failed. */
    static SL_STATUS_FLASH_PROGRAM_FAILED: number;
    /** Flash erase failed. */
    static SL_STATUS_FLASH_ERASE_FAILED: number;
    /**MAC Errors */
    static SL_STATUS_MAC_NO_DATA: number;
    static SL_STATUS_MAC_NO_ACK_RECEIVED: number;
    static SL_STATUS_MAC_INDIRECT_TIMEOUT: number;
    static SL_STATUS_MAC_UNKNOWN_HEADER_TYPE: number;
    static SL_STATUS_MAC_ACK_HEADER_TYPE: number;
    static SL_STATUS_MAC_COMMAND_TRANSMIT_FAILURE: number;
    /**CLI_STORAGE Errors */
    /** Error in open NVM */
    static SL_STATUS_CLI_STORAGE_NVM_OPEN_ERROR: number;
    /**Security status codes */
    /** Image checksum is not valid. */
    static SL_STATUS_SECURITY_IMAGE_CHECKSUM_ERROR: number;
    /** Decryption failed */
    static SL_STATUS_SECURITY_DECRYPT_ERROR: number;
    /**Command status codes */
    /** Command was not recognized */
    static SL_STATUS_COMMAND_IS_INVALID: number;
    /** Command or parameter maximum length exceeded */
    static SL_STATUS_COMMAND_TOO_LONG: number;
    /** Data received does not form a complete command */
    static SL_STATUS_COMMAND_INCOMPLETE: number;
    /**Misc Errors */
    /** Bus error, e.g. invalid DMA address */
    static SL_STATUS_BUS_ERROR: number;
    /**Unified MAC Errors */
    static SL_STATUS_CCA_FAILURE: number;
    /**Scan errors */
    static SL_STATUS_MAC_SCANNING: number;
    static SL_STATUS_MAC_INCORRECT_SCAN_TYPE: number;
    static SL_STATUS_INVALID_CHANNEL_MASK: number;
    static SL_STATUS_BAD_SCAN_DURATION: number;
    /**Bluetooth status codes */
    /** Bonding procedure can't be started because device has no space */
    /** left for bond. */
    static SL_STATUS_BT_OUT_OF_BONDS: number;
    /** Unspecified error */
    static SL_STATUS_BT_UNSPECIFIED: number;
    /** Hardware failure */
    static SL_STATUS_BT_HARDWARE: number;
    /** The bonding does not exist. */
    static SL_STATUS_BT_NO_BONDING: number;
    /** Error using crypto functions */
    static SL_STATUS_BT_CRYPTO: number;
    /** Data was corrupted. */
    static SL_STATUS_BT_DATA_CORRUPTED: number;
    /** Invalid periodic advertising sync handle */
    static SL_STATUS_BT_INVALID_SYNC_HANDLE: number;
    /** Bluetooth cannot be used on this hardware */
    static SL_STATUS_BT_INVALID_MODULE_ACTION: number;
    /** Error received from radio */
    static SL_STATUS_BT_RADIO: number;
    /** Returned when remote disconnects the connection-oriented channel by sending */
    /** disconnection request. */
    static SL_STATUS_BT_L2CAP_REMOTE_DISCONNECTED: number;
    /** Returned when local host disconnect the connection-oriented channel by sending */
    /** disconnection request. */
    static SL_STATUS_BT_L2CAP_LOCAL_DISCONNECTED: number;
    /** Returned when local host did not find a connection-oriented channel with given */
    /** destination CID. */
    static SL_STATUS_BT_L2CAP_CID_NOT_EXIST: number;
    /** Returned when connection-oriented channel disconnected due to LE connection is dropped. */
    static SL_STATUS_BT_L2CAP_LE_DISCONNECTED: number;
    /** Returned when connection-oriented channel disconnected due to remote end send data */
    /** even without credit. */
    static SL_STATUS_BT_L2CAP_FLOW_CONTROL_VIOLATED: number;
    /** Returned when connection-oriented channel disconnected due to remote end send flow */
    /** control credits exceed 65535. */
    static SL_STATUS_BT_L2CAP_FLOW_CONTROL_CREDIT_OVERFLOWED: number;
    /** Returned when connection-oriented channel has run out of flow control credit and */
    /** local application still trying to send data. */
    static SL_STATUS_BT_L2CAP_NO_FLOW_CONTROL_CREDIT: number;
    /** Returned when connection-oriented channel has not received connection response message */
    /** within maximum timeout. */
    static SL_STATUS_BT_L2CAP_CONNECTION_REQUEST_TIMEOUT: number;
    /** Returned when local host received a connection-oriented channel connection response */
    /** with an invalid destination CID. */
    static SL_STATUS_BT_L2CAP_INVALID_CID: number;
    /** Returned when local host application tries to send a command which is not suitable */
    /** for L2CAP channel's current state. */
    static SL_STATUS_BT_L2CAP_WRONG_STATE: number;
    /** Flash reserved for PS store is full */
    static SL_STATUS_BT_PS_STORE_FULL: number;
    /** PS key not found */
    static SL_STATUS_BT_PS_KEY_NOT_FOUND: number;
    /** Mismatched or insufficient security level */
    static SL_STATUS_BT_APPLICATION_MISMATCHED_OR_INSUFFICIENT_SECURITY: number;
    /** Encrypion/decryption operation failed. */
    static SL_STATUS_BT_APPLICATION_ENCRYPTION_DECRYPTION_ERROR: number;
    /**Bluetooth controller status codes */
    /** Connection does not exist, or connection open request was cancelled. */
    static SL_STATUS_BT_CTRL_UNKNOWN_CONNECTION_IDENTIFIER: number;
    /** Pairing or authentication failed due to incorrect results in the pairing or */
    /** authentication procedure. This could be due to an incorrect PIN or Link Key */
    static SL_STATUS_BT_CTRL_AUTHENTICATION_FAILURE: number;
    /** Pairing failed because of missing PIN, or authentication failed because of missing Key */
    static SL_STATUS_BT_CTRL_PIN_OR_KEY_MISSING: number;
    /** Controller is out of memory. */
    static SL_STATUS_BT_CTRL_MEMORY_CAPACITY_EXCEEDED: number;
    /** Link supervision timeout has expired. */
    static SL_STATUS_BT_CTRL_CONNECTION_TIMEOUT: number;
    /** Controller is at limit of connections it can support. */
    static SL_STATUS_BT_CTRL_CONNECTION_LIMIT_EXCEEDED: number;
    /** The Synchronous Connection Limit to a Device Exceeded error code indicates that */
    /** the Controller has reached the limit to the number of synchronous connections that */
    /** can be achieved to a device. */
    static SL_STATUS_BT_CTRL_SYNCHRONOUS_CONNECTION_LIMIT_EXCEEDED: number;
    /** The ACL Connection Already Exists error code indicates that an attempt to create */
    /** a new ACL Connection to a device when there is already a connection to this device. */
    static SL_STATUS_BT_CTRL_ACL_CONNECTION_ALREADY_EXISTS: number;
    /** Command requested cannot be executed because the Controller is in a state where */
    /** it cannot process this command at this time. */
    static SL_STATUS_BT_CTRL_COMMAND_DISALLOWED: number;
    /** The Connection Rejected Due To Limited Resources error code indicates that an */
    /** incoming connection was rejected due to limited resources. */
    static SL_STATUS_BT_CTRL_CONNECTION_REJECTED_DUE_TO_LIMITED_RESOURCES: number;
    /** The Connection Rejected Due To Security Reasons error code indicates that a */
    /** connection was rejected due to security requirements not being fulfilled, like */
    /** authentication or pairing. */
    static SL_STATUS_BT_CTRL_CONNECTION_REJECTED_DUE_TO_SECURITY_REASONS: number;
    /** The Connection was rejected because this device does not accept the BD_ADDR. */
    /** This may be because the device will only accept connections from specific BD_ADDRs. */
    static SL_STATUS_BT_CTRL_CONNECTION_REJECTED_DUE_TO_UNACCEPTABLE_BD_ADDR: number;
    /** The Connection Accept Timeout has been exceeded for this connection attempt. */
    static SL_STATUS_BT_CTRL_CONNECTION_ACCEPT_TIMEOUT_EXCEEDED: number;
    /** A feature or parameter value in the HCI command is not supported. */
    static SL_STATUS_BT_CTRL_UNSUPPORTED_FEATURE_OR_PARAMETER_VALUE: number;
    /** Command contained invalid parameters. */
    static SL_STATUS_BT_CTRL_INVALID_COMMAND_PARAMETERS: number;
    /** User on the remote device terminated the connection. */
    static SL_STATUS_BT_CTRL_REMOTE_USER_TERMINATED: number;
    /** The remote device terminated the connection because of low resources */
    static SL_STATUS_BT_CTRL_REMOTE_DEVICE_TERMINATED_CONNECTION_DUE_TO_LOW_RESOURCES: number;
    /** Remote Device Terminated Connection due to Power Off */
    static SL_STATUS_BT_CTRL_REMOTE_POWERING_OFF: number;
    /** Local device terminated the connection. */
    static SL_STATUS_BT_CTRL_CONNECTION_TERMINATED_BY_LOCAL_HOST: number;
    /** The Controller is disallowing an authentication or pairing procedure because */
    /** too little time has elapsed since the last authentication or pairing attempt failed. */
    static SL_STATUS_BT_CTRL_REPEATED_ATTEMPTS: number;
    /** The device does not allow pairing. This can be for example, when a device only */
    /** allows pairing during a certain time window after some user input allows pairing */
    static SL_STATUS_BT_CTRL_PAIRING_NOT_ALLOWED: number;
    /** The remote device does not support the feature associated with the issued command. */
    static SL_STATUS_BT_CTRL_UNSUPPORTED_REMOTE_FEATURE: number;
    /** No other error code specified is appropriate to use. */
    static SL_STATUS_BT_CTRL_UNSPECIFIED_ERROR: number;
    /** Connection terminated due to link-layer procedure timeout. */
    static SL_STATUS_BT_CTRL_LL_RESPONSE_TIMEOUT: number;
    /** LL procedure has collided with the same transaction or procedure that is already */
    /** in progress. */
    static SL_STATUS_BT_CTRL_LL_PROCEDURE_COLLISION: number;
    /** The requested encryption mode is not acceptable at this time. */
    static SL_STATUS_BT_CTRL_ENCRYPTION_MODE_NOT_ACCEPTABLE: number;
    /** Link key cannot be changed because a fixed unit key is being used. */
    static SL_STATUS_BT_CTRL_LINK_KEY_CANNOT_BE_CHANGED: number;
    /** LMP PDU or LL PDU that includes an instant cannot be performed because the instan */
    /** when this would have occurred has passed. */
    static SL_STATUS_BT_CTRL_INSTANT_PASSED: number;
    /** It was not possible to pair as a unit key was requested and it is not supported. */
    static SL_STATUS_BT_CTRL_PAIRING_WITH_UNIT_KEY_NOT_SUPPORTED: number;
    /** LMP transaction was started that collides with an ongoing transaction. */
    static SL_STATUS_BT_CTRL_DIFFERENT_TRANSACTION_COLLISION: number;
    /** The Controller cannot perform channel assessment because it is not supported. */
    static SL_STATUS_BT_CTRL_CHANNEL_ASSESSMENT_NOT_SUPPORTED: number;
    /** The HCI command or LMP PDU sent is only possible on an encrypted link. */
    static SL_STATUS_BT_CTRL_INSUFFICIENT_SECURITY: number;
    /** A parameter value requested is outside the mandatory range of parameters for the */
    /** given HCI command or LMP PDU. */
    static SL_STATUS_BT_CTRL_PARAMETER_OUT_OF_MANDATORY_RANGE: number;
    /** The IO capabilities request or response was rejected because the sending Host does */
    /** not support Secure Simple Pairing even though the receiving Link Manager does. */
    static SL_STATUS_BT_CTRL_SIMPLE_PAIRING_NOT_SUPPORTED_BY_HOST: number;
    /** The Host is busy with another pairing operation and unable to support the requested */
    /** pairing. The receiving device should retry pairing again later. */
    static SL_STATUS_BT_CTRL_HOST_BUSY_PAIRING: number;
    /** The Controller could not calculate an appropriate value for the Channel selection operation. */
    static SL_STATUS_BT_CTRL_CONNECTION_REJECTED_DUE_TO_NO_SUITABLE_CHANNEL_FOUND: number;
    /** Operation was rejected because the controller is busy and unable to process the request. */
    static SL_STATUS_BT_CTRL_CONTROLLER_BUSY: number;
    /** Remote device terminated the connection because of an unacceptable connection interval. */
    static SL_STATUS_BT_CTRL_UNACCEPTABLE_CONNECTION_INTERVAL: number;
    /** Ddvertising for a fixed duration completed or, for directed advertising, that advertising */
    /** completed without a connection being created. */
    static SL_STATUS_BT_CTRL_ADVERTISING_TIMEOUT: number;
    /** Connection was terminated because the Message Integrity Check (MIC) failed on a */
    /** received packet. */
    static SL_STATUS_BT_CTRL_CONNECTION_TERMINATED_DUE_TO_MIC_FAILURE: number;
    /** LL initiated a connection but the connection has failed to be established. Controller did not receive */
    /** any packets from remote end. */
    static SL_STATUS_BT_CTRL_CONNECTION_FAILED_TO_BE_ESTABLISHED: number;
    /** The MAC of the 802.11 AMP was requested to connect to a peer, but the connection failed. */
    static SL_STATUS_BT_CTRL_MAC_CONNECTION_FAILED: number;
    /** The master, at this time, is unable to make a coarse adjustment to the piconet clock, */
    /** using the supplied parameters. Instead the master will attempt to move the clock using clock dragging. */
    static SL_STATUS_BT_CTRL_COARSE_CLOCK_ADJUSTMENT_REJECTED_BUT_WILL_TRY_TO_ADJUST_USING_CLOCK_DRAGGING: number;
    /** A command was sent from the Host that should identify an Advertising or Sync handle, but the */
    /** Advertising or Sync handle does not exist. */
    static SL_STATUS_BT_CTRL_UNKNOWN_ADVERTISING_IDENTIFIER: number;
    /** Number of operations requested has been reached and has indicated the completion of the activity */
    /** (e.g., advertising or scanning). */
    static SL_STATUS_BT_CTRL_LIMIT_REACHED: number;
    /** A request to the Controller issued by the Host and still pending was successfully canceled. */
    static SL_STATUS_BT_CTRL_OPERATION_CANCELLED_BY_HOST: number;
    /** An attempt was made to send or receive a packet that exceeds the maximum allowed packet l */
    static SL_STATUS_BT_CTRL_PACKET_TOO_LONG: number;
    /**Bluetooth attribute status codes */
    /** The attribute handle given was not valid on this server */
    static SL_STATUS_BT_ATT_INVALID_HANDLE: number;
    /** The attribute cannot be read */
    static SL_STATUS_BT_ATT_READ_NOT_PERMITTED: number;
    /** The attribute cannot be written */
    static SL_STATUS_BT_ATT_WRITE_NOT_PERMITTED: number;
    /** The attribute PDU was invalid */
    static SL_STATUS_BT_ATT_INVALID_PDU: number;
    /** The attribute requires authentication before it can be read or written. */
    static SL_STATUS_BT_ATT_INSUFFICIENT_AUTHENTICATION: number;
    /** Attribute Server does not support the request received from the client. */
    static SL_STATUS_BT_ATT_REQUEST_NOT_SUPPORTED: number;
    /** Offset specified was past the end of the attribute */
    static SL_STATUS_BT_ATT_INVALID_OFFSET: number;
    /** The attribute requires authorization before it can be read or written. */
    static SL_STATUS_BT_ATT_INSUFFICIENT_AUTHORIZATION: number;
    /** Too many prepare writes have been queued */
    static SL_STATUS_BT_ATT_PREPARE_QUEUE_FULL: number;
    /** No attribute found within the given attribute handle range. */
    static SL_STATUS_BT_ATT_ATT_NOT_FOUND: number;
    /** The attribute cannot be read or written using the Read Blob Request */
    static SL_STATUS_BT_ATT_ATT_NOT_LONG: number;
    /** The Encryption Key Size used for encrypting this link is insufficient. */
    static SL_STATUS_BT_ATT_INSUFFICIENT_ENC_KEY_SIZE: number;
    /** The attribute value length is invalid for the operation */
    static SL_STATUS_BT_ATT_INVALID_ATT_LENGTH: number;
    /** The attribute request that was requested has encountered an error that was unlikely, and */
    /** therefore could not be completed as requested. */
    static SL_STATUS_BT_ATT_UNLIKELY_ERROR: number;
    /** The attribute requires encryption before it can be read or written. */
    static SL_STATUS_BT_ATT_INSUFFICIENT_ENCRYPTION: number;
    /** The attribute type is not a supported grouping attribute as defined by a higher layer */
    /** specification. */
    static SL_STATUS_BT_ATT_UNSUPPORTED_GROUP_TYPE: number;
    /** Insufficient Resources to complete the request */
    static SL_STATUS_BT_ATT_INSUFFICIENT_RESOURCES: number;
    /** The server requests the client to rediscover the database. */
    static SL_STATUS_BT_ATT_OUT_OF_SYNC: number;
    /** The attribute parameter value was not allowed. */
    static SL_STATUS_BT_ATT_VALUE_NOT_ALLOWED: number;
    /** When this is returned in a BGAPI response, the application tried to read or write the */
    /** value of a user attribute from the GATT databa */
    static SL_STATUS_BT_ATT_APPLICATION: number;
    /** The requested write operation cannot be fulfilled for reasons other than permissions. */
    static SL_STATUS_BT_ATT_WRITE_REQUEST_REJECTED: number;
    /** The Client Characteristic Configuration descriptor is not configured according to the */
    /** requirements of the profile or service. */
    static SL_STATUS_BT_ATT_CLIENT_CHARACTERISTIC_CONFIGURATION_DESCRIPTOR_IMPROPERLY_CONFIGURED: number;
    /** The profile or service request cannot be serviced because an operation that has been */
    /** previously triggered is still in progress. */
    static SL_STATUS_BT_ATT_PROCEDURE_ALREADY_IN_PROGRESS: number;
    /** The attribute value is out of range as defined by a profile or service specification. */
    static SL_STATUS_BT_ATT_OUT_OF_RANGE: number;
    /**Bluetooth Security Manager Protocol status codes */
    /** The user input of passkey failed, for example, the user cancelled the operation */
    static SL_STATUS_BT_SMP_PASSKEY_ENTRY_FAILED: number;
    /** Out of Band data is not available for authentication */
    static SL_STATUS_BT_SMP_OOB_NOT_AVAILABLE: number;
    /** The pairing procedure cannot be performed as authentication requirements cannot be */
    /** met due to IO capabilities of one or both devices */
    static SL_STATUS_BT_SMP_AUTHENTICATION_REQUIREMENTS: number;
    /** The confirm value does not match the calculated compare value */
    static SL_STATUS_BT_SMP_CONFIRM_VALUE_FAILED: number;
    /** Pairing is not supported by the device */
    static SL_STATUS_BT_SMP_PAIRING_NOT_SUPPORTED: number;
    /** The resultant encryption key size is insufficient for the security requirements of this device */
    static SL_STATUS_BT_SMP_ENCRYPTION_KEY_SIZE: number;
    /** The SMP command received is not supported on this device */
    static SL_STATUS_BT_SMP_COMMAND_NOT_SUPPORTED: number;
    /** Pairing failed due to an unspecified reason */
    static SL_STATUS_BT_SMP_UNSPECIFIED_REASON: number;
    /** Pairing or authentication procedure is disallowed because too little time has elapsed */
    /** since last pairing request or security request */
    static SL_STATUS_BT_SMP_REPEATED_ATTEMPTS: number;
    /** The Invalid Parameters error code indicates: the command length is invalid or a parameter */
    /** is outside of the specified range. */
    static SL_STATUS_BT_SMP_INVALID_PARAMETERS: number;
    /** Indicates to the remote device that the DHKey Check value received doesn't match the one */
    /** calculated by the local device. */
    static SL_STATUS_BT_SMP_DHKEY_CHECK_FAILED: number;
    /** Indicates that the confirm values in the numeric comparison protocol do not match. */
    static SL_STATUS_BT_SMP_NUMERIC_COMPARISON_FAILED: number;
    /** Indicates that the pairing over the LE transport failed due to a Pairing Request */
    /** sent over the BR/EDR transport in process. */
    static SL_STATUS_BT_SMP_BREDR_PAIRING_IN_PROGRESS: number;
    /** Indicates that the BR/EDR Link Key generated on the BR/EDR transport cannot be used */
    /** to derive and distribute keys for the LE transport. */
    static SL_STATUS_BT_SMP_CROSS_TRANSPORT_KEY_DERIVATION_GENERATION_NOT_ALLOWED: number;
    /** Indicates that the device chose not to accept a distributed key. */
    static SL_STATUS_BT_SMP_KEY_REJECTED: number;
    /**Bluetooth Mesh status codes */
    /** Returned when trying to add a key or some other unique resource with an ID which already exists */
    static SL_STATUS_BT_MESH_ALREADY_EXISTS: number;
    /** Returned when trying to manipulate a key or some other resource with an ID which does not exist */
    static SL_STATUS_BT_MESH_DOES_NOT_EXIST: number;
    /** Returned when an operation cannot be executed because a pre-configured limit for keys, */
    /** key bindings, elements, models, virtual addresses, provisioned devices, or provisioning sessions is reached */
    static SL_STATUS_BT_MESH_LIMIT_REACHED: number;
    /** Returned when trying to use a reserved address or add a "pre-provisioned" device */
    /** using an address already used by some other device */
    static SL_STATUS_BT_MESH_INVALID_ADDRESS: number;
    /** In a BGAPI response, the user supplied malformed data; in a BGAPI event, the remote */
    /** end responded with malformed or unrecognized data */
    static SL_STATUS_BT_MESH_MALFORMED_DATA: number;
    /** An attempt was made to initialize a subsystem that was already initialized. */
    static SL_STATUS_BT_MESH_ALREADY_INITIALIZED: number;
    /** An attempt was made to use a subsystem that wasn't initialized yet. Call the */
    /** subsystem's init function first. */
    static SL_STATUS_BT_MESH_NOT_INITIALIZED: number;
    /** Returned when trying to establish a friendship as a Low Power Node, but no acceptable */
    /** friend offer message was received. */
    static SL_STATUS_BT_MESH_NO_FRIEND_OFFER: number;
    /** Provisioning link was unexpectedly closed before provisioning was complete. */
    static SL_STATUS_BT_MESH_PROV_LINK_CLOSED: number;
    /** An unrecognized provisioning PDU was received. */
    static SL_STATUS_BT_MESH_PROV_INVALID_PDU: number;
    /** A provisioning PDU with wrong length or containing field values that are out of */
    /** bounds was received. */
    static SL_STATUS_BT_MESH_PROV_INVALID_PDU_FORMAT: number;
    /** An unexpected (out of sequence) provisioning PDU was received. */
    static SL_STATUS_BT_MESH_PROV_UNEXPECTED_PDU: number;
    /** The computed confirmation value did not match the expected value. */
    static SL_STATUS_BT_MESH_PROV_CONFIRMATION_FAILED: number;
    /** Provisioning could not be continued due to insufficient resources. */
    static SL_STATUS_BT_MESH_PROV_OUT_OF_RESOURCES: number;
    /** The provisioning data block could not be decrypted. */
    static SL_STATUS_BT_MESH_PROV_DECRYPTION_FAILED: number;
    /** An unexpected error happened during provisioning. */
    static SL_STATUS_BT_MESH_PROV_UNEXPECTED_ERROR: number;
    /** Device could not assign unicast addresses to all of its elements. */
    static SL_STATUS_BT_MESH_PROV_CANNOT_ASSIGN_ADDR: number;
    /** Returned when trying to reuse an address of a previously deleted device before an */
    /** IV Index Update has been executed. */
    static SL_STATUS_BT_MESH_ADDRESS_TEMPORARILY_UNAVAILABLE: number;
    /** Returned when trying to assign an address that is used by one of the devices in the */
    /** Device Database, or by the Provisioner itself. */
    static SL_STATUS_BT_MESH_ADDRESS_ALREADY_USED: number;
    /** Application key or publish address are not set */
    static SL_STATUS_BT_MESH_PUBLISH_NOT_CONFIGURED: number;
    /** Application key is not bound to a model */
    static SL_STATUS_BT_MESH_APP_KEY_NOT_BOUND: number;
    /**Bluetooth Mesh foundation status codes */
    /** Returned when address in request was not valid */
    static SL_STATUS_BT_MESH_FOUNDATION_INVALID_ADDRESS: number;
    /** Returned when model identified is not found for a given element */
    static SL_STATUS_BT_MESH_FOUNDATION_INVALID_MODEL: number;
    /** Returned when the key identified by AppKeyIndex is not stored in the node */
    static SL_STATUS_BT_MESH_FOUNDATION_INVALID_APP_KEY: number;
    /** Returned when the key identified by NetKeyIndex is not stored in the node */
    static SL_STATUS_BT_MESH_FOUNDATION_INVALID_NET_KEY: number;
    /** Returned when The node cannot serve the request due to insufficient resources */
    static SL_STATUS_BT_MESH_FOUNDATION_INSUFFICIENT_RESOURCES: number;
    /** Returned when the key identified is already stored in the node and the new */
    /** NetKey value is different */
    static SL_STATUS_BT_MESH_FOUNDATION_KEY_INDEX_EXISTS: number;
    /** Returned when the model does not support the publish mechanism */
    static SL_STATUS_BT_MESH_FOUNDATION_INVALID_PUBLISH_PARAMS: number;
    /** Returned when  the model does not support the subscribe mechanism */
    static SL_STATUS_BT_MESH_FOUNDATION_NOT_SUBSCRIBE_MODEL: number;
    /** Returned when storing of the requested parameters failed */
    static SL_STATUS_BT_MESH_FOUNDATION_STORAGE_FAILURE: number;
    /** Returned when requested setting is not supported */
    static SL_STATUS_BT_MESH_FOUNDATION_NOT_SUPPORTED: number;
    /** Returned when the requested update operation cannot be performed due to general constraints */
    static SL_STATUS_BT_MESH_FOUNDATION_CANNOT_UPDATE: number;
    /** Returned when the requested delete operation cannot be performed due to general constraints */
    static SL_STATUS_BT_MESH_FOUNDATION_CANNOT_REMOVE: number;
    /** Returned when the requested bind operation cannot be performed due to general constraints */
    static SL_STATUS_BT_MESH_FOUNDATION_CANNOT_BIND: number;
    /** Returned when The node cannot start advertising with Node Identity or Proxy since the */
    /** maximum number of parallel advertising is reached */
    static SL_STATUS_BT_MESH_FOUNDATION_TEMPORARILY_UNABLE: number;
    /** Returned when the requested state cannot be set */
    static SL_STATUS_BT_MESH_FOUNDATION_CANNOT_SET: number;
    /** Returned when an unspecified error took place */
    static SL_STATUS_BT_MESH_FOUNDATION_UNSPECIFIED: number;
    /** Returned when the NetKeyIndex and AppKeyIndex combination is not valid for a Config AppKey Update */
    static SL_STATUS_BT_MESH_FOUNDATION_INVALID_BINDING: number;
    /**Wi-Fi Errors */
    /** Invalid firmware keyset */
    static SL_STATUS_WIFI_INVALID_KEY: number;
    /** The firmware download took too long */
    static SL_STATUS_WIFI_FIRMWARE_DOWNLOAD_TIMEOUT: number;
    /** Unknown request ID or wrong interface ID used */
    static SL_STATUS_WIFI_UNSUPPORTED_MESSAGE_ID: number;
    /** The request is successful but some parameters have been ignored */
    static SL_STATUS_WIFI_WARNING: number;
    /** No Packets waiting to be received */
    static SL_STATUS_WIFI_NO_PACKET_TO_RECEIVE: number;
    /** The sleep mode is granted */
    static SL_STATUS_WIFI_SLEEP_GRANTED: number;
    /** The WFx does not go back to sleep */
    static SL_STATUS_WIFI_SLEEP_NOT_GRANTED: number;
    /** The SecureLink MAC key was not found */
    static SL_STATUS_WIFI_SECURE_LINK_MAC_KEY_ERROR: number;
    /** The SecureLink MAC key is already installed in OTP */
    static SL_STATUS_WIFI_SECURE_LINK_MAC_KEY_ALREADY_BURNED: number;
    /** The SecureLink MAC key cannot be installed in RAM */
    static SL_STATUS_WIFI_SECURE_LINK_RAM_MODE_NOT_ALLOWED: number;
    /** The SecureLink MAC key installation failed */
    static SL_STATUS_WIFI_SECURE_LINK_FAILED_UNKNOWN_MODE: number;
    /** SecureLink key (re)negotiation failed */
    static SL_STATUS_WIFI_SECURE_LINK_EXCHANGE_FAILED: number;
    /** The device is in an inappropriate state to perform the request */
    static SL_STATUS_WIFI_WRONG_STATE: number;
    /** The request failed due to regulatory limitations */
    static SL_STATUS_WIFI_CHANNEL_NOT_ALLOWED: number;
    /** The connection request failed because no suitable AP was found */
    static SL_STATUS_WIFI_NO_MATCHING_AP: number;
    /** The connection request was aborted by host */
    static SL_STATUS_WIFI_CONNECTION_ABORTED: number;
    /** The connection request failed because of a timeout */
    static SL_STATUS_WIFI_CONNECTION_TIMEOUT: number;
    /** The connection request failed because the AP rejected the device */
    static SL_STATUS_WIFI_CONNECTION_REJECTED_BY_AP: number;
    /** The connection request failed because the WPA handshake did not complete successfully */
    static SL_STATUS_WIFI_CONNECTION_AUTH_FAILURE: number;
    /** The request failed because the retry limit was exceeded */
    static SL_STATUS_WIFI_RETRY_EXCEEDED: number;
    /** The request failed because the MSDU life time was exceeded */
    static SL_STATUS_WIFI_TX_LIFETIME_EXCEEDED: number;
}
export declare class EmberStackError extends basic.uint8_t {
    static EMBER_ROUTE_ERROR_NO_ROUTE_AVAILABLE: number;
    static EMBER_ROUTE_ERROR_TREE_LINK_FAILURE: number;
    static EMBER_ROUTE_ERROR_NON_TREE_LINK_FAILURE: number;
    static EMBER_ROUTE_ERROR_LOW_BATTERY_LEVEL: number;
    static EMBER_ROUTE_ERROR_NO_ROUTING_CAPACITY: number;
    static EMBER_ROUTE_ERROR_NO_INDIRECT_CAPACITY: number;
    static EMBER_ROUTE_ERROR_INDIRECT_TRANSACTION_EXPIRY: number;
    static EMBER_ROUTE_ERROR_TARGET_DEVICE_UNAVAILABLE: number;
    static EMBER_ROUTE_ERROR_TARGET_ADDRESS_UNALLOCATED: number;
    static EMBER_ROUTE_ERROR_PARENT_LINK_FAILURE: number;
    static EMBER_ROUTE_ERROR_VALIDATE_ROUTE: number;
    static EMBER_ROUTE_ERROR_SOURCE_ROUTE_FAILURE: number;
    static EMBER_ROUTE_ERROR_MANY_TO_ONE_ROUTE_FAILURE: number;
    static EMBER_ROUTE_ERROR_ADDRESS_CONFLICT: number;
    static EMBER_ROUTE_ERROR_VERIFY_ADDRESSES: number;
    static EMBER_ROUTE_ERROR_PAN_IDENTIFIER_UPDATE: number;
    static ZIGBEE_NETWORK_STATUS_NETWORK_ADDRESS_UPDATE: number;
    static ZIGBEE_NETWORK_STATUS_BAD_FRAME_COUNTER: number;
    static ZIGBEE_NETWORK_STATUS_BAD_KEY_SEQUENCE_NUMBER: number;
    static ZIGBEE_NETWORK_STATUS_UNKNOWN_COMMAND: number;
}
export declare class EmberEventUnits extends basic.uint8_t {
    static EVENT_INACTIVE: number;
    static EVENT_MS_TIME: number;
    static EVENT_QS_TIME: number;
    static EVENT_MINUTE_TIME: number;
}
export declare class EmberNodeType extends basic.uint8_t {
    static UNKNOWN_DEVICE: number;
    static COORDINATOR: number;
    static ROUTER: number;
    static END_DEVICE: number;
    static SLEEPY_END_DEVICE: number;
    static MOBILE_END_DEVICE: number;
}
export declare class EmberNetworkStatus extends basic.uint8_t {
    static NO_NETWORK: number;
    static JOINING_NETWORK: number;
    static JOINED_NETWORK: number;
    static JOINED_NETWORK_NO_PARENT: number;
    static LEAVING_NETWORK: number;
}
export declare class EmberIncomingMessageType extends basic.uint8_t {
    static INCOMING_UNICAST: number;
    static INCOMING_UNICAST_REPLY: number;
    static INCOMING_MULTICAST: number;
    static INCOMING_MULTICAST_LOOPBACK: number;
    static INCOMING_BROADCAST: number;
    static INCOMING_BROADCAST_LOOPBACK: number;
    static INCOMING_MANY_TO_ONE_ROUTE_REQUEST: number;
}
export declare class EmberOutgoingMessageType extends basic.uint8_t {
    static OUTGOING_DIRECT: number;
    static OUTGOING_VIA_ADDRESS_TABLE: number;
    static OUTGOING_VIA_BINDING: number;
    static OUTGOING_MULTICAST: number;
    static OUTGOING_BROADCAST: number;
}
export declare class EmberMacPassthroughType extends basic.uint8_t {
    static MAC_PASSTHROUGH_NONE: number;
    static MAC_PASSTHROUGH_SE_INTERPAN: number;
    static MAC_PASSTHROUGH_EMBERNET: number;
    static MAC_PASSTHROUGH_EMBERNET_SOURCE: number;
    static MAC_PASSTHROUGH_APPLICATION: number;
    static MAC_PASSTHROUGH_CUSTOM: number;
    static MAC_PASSTHROUGH_INTERNAL: number;
}
export declare class EmberBindingType extends basic.uint8_t {
    static UNUSED_BINDING: number;
    static UNICAST_BINDING: number;
    static MANY_TO_ONE_BINDING: number;
    static MULTICAST_BINDING: number;
}
export declare class EmberApsOption extends basic.uint16_t {
    static APS_OPTION_NONE: number;
    static APS_OPTION_UNKNOWN: number;
    static APS_OPTION_ENCRYPTION: number;
    static APS_OPTION_RETRY: number;
    static APS_OPTION_ENABLE_ROUTE_DISCOVERY: number;
    static APS_OPTION_FORCE_ROUTE_DISCOVERY: number;
    static APS_OPTION_SOURCE_EUI64: number;
    static APS_OPTION_DESTINATION_EUI64: number;
    static APS_OPTION_ENABLE_ADDRESS_DISCOVERY: number;
    static APS_OPTION_POLL_RESPONSE: number;
    static APS_OPTION_ZDO_RESPONSE_REQUIRED: number;
    static APS_OPTION_FRAGMENT: number;
}
export declare class EzspNetworkScanType extends basic.uint8_t {
    static ENERGY_SCAN: number;
    static ACTIVE_SCAN: number;
}
export declare class EmberJoinDecision extends basic.uint8_t {
    static USE_PRECONFIGURED_KEY: number;
    static SEND_KEY_IN_THE_CLEAR: number;
    static DENY_JOIN: number;
    static NO_ACTION: number;
}
export declare class EmberInitialSecurityBitmask extends basic.uint16_t {
    static STANDARD_SECURITY_MODE: number;
    static DISTRIBUTED_TRUST_CENTER_MODE: number;
    static TRUST_CENTER_GLOBAL_LINK_KEY: number;
    static PRECONFIGURED_NETWORK_KEY_MODE: number;
    static TRUST_CENTER_USES_HASHED_LINK_KEY: number;
    static HAVE_PRECONFIGURED_KEY: number;
    static HAVE_NETWORK_KEY: number;
    static GET_LINK_KEY_WHEN_JOINING: number;
    static REQUIRE_ENCRYPTED_KEY: number;
    static NO_FRAME_COUNTER_RESET: number;
    static GET_PRECONFIGURED_KEY_FROM_INSTALL_CODE: number;
    static HAVE_TRUST_CENTER_EUI64: number;
}
export declare class EmberCurrentSecurityBitmask extends basic.uint16_t {
    static STANDARD_SECURITY_MODE: number;
    static HIGH_SECURITY_MODE: number;
    static DISTRIBUTED_TRUST_CENTER_MODE: number;
    static GLOBAL_LINK_KEY: number;
    static HAVE_TRUST_CENTER_LINK_KEY: number;
    static TRUST_CENTER_USES_HASHED_LINK_KEY: number;
}
export declare class EmberKeyType extends basic.uint8_t {
    static TRUST_CENTER_LINK_KEY: number;
    static TRUST_CENTER_MASTER_KEY: number;
    static CURRENT_NETWORK_KEY: number;
    static NEXT_NETWORK_KEY: number;
    static APPLICATION_LINK_KEY: number;
    static APPLICATION_MASTER_KEY: number;
}
export declare class EmberKeyStructBitmask extends basic.uint16_t {
    static KEY_HAS_SEQUENCE_NUMBER: number;
    static KEY_HAS_OUTGOING_FRAME_COUNTER: number;
    static KEY_HAS_INCOMING_FRAME_COUNTER: number;
    static KEY_HAS_PARTNER_EUI64: number;
}
export declare class EmberDeviceUpdate extends basic.uint8_t {
    static STANDARD_SECURITY_SECURED_REJOIN: number;
    static STANDARD_SECURITY_UNSECURED_JOIN: number;
    static DEVICE_LEFT: number;
    static STANDARD_SECURITY_UNSECURED_REJOIN: number;
    static HIGH_SECURITY_SECURED_REJOIN: number;
    static HIGH_SECURITY_UNSECURED_JOIN: number;
    static HIGH_SECURITY_UNSECURED_REJOIN: number;
}
export declare class EmberKeyStatus extends basic.uint8_t {
    static APP_LINK_KEY_ESTABLISHED: number;
    static APP_MASTER_KEY_ESTABLISHED: number;
    static TRUST_CENTER_LINK_KEY_ESTABLISHED: number;
    static KEY_ESTABLISHMENT_TIMEOUT: number;
    static KEY_TABLE_FULL: number;
    static TC_RESPONDED_TO_KEY_REQUEST: number;
    static TC_APP_KEY_SENT_TO_REQUESTER: number;
    static TC_RESPONSE_TO_KEY_REQUEST_FAILED: number;
    static TC_REQUEST_KEY_TYPE_NOT_SUPPORTED: number;
    static TC_NO_LINK_KEY_FOR_REQUESTER: number;
    static TC_REQUESTER_EUI64_UNKNOWN: number;
    static TC_RECEIVED_FIRST_APP_KEY_REQUEST: number;
    static TC_TIMEOUT_WAITING_FOR_SECOND_APP_KEY_REQUEST: number;
    static TC_NON_MATCHING_APP_KEY_REQUEST_RECEIVED: number;
    static TC_FAILED_TO_SEND_APP_KEYS: number;
    static TC_FAILED_TO_STORE_APP_KEY_REQUEST: number;
    static TC_REJECTED_APP_KEY_REQUEST: number;
}
export declare class EmberCounterType extends basic.uint8_t {
    static COUNTER_MAC_RX_BROADCAST: number;
    static COUNTER_MAC_TX_BROADCAST: number;
    static COUNTER_MAC_RX_UNICAST: number;
    static COUNTER_MAC_TX_UNICAST_SUCCESS: number;
    static COUNTER_MAC_TX_UNICAST_RETRY: number;
    static COUNTER_MAC_TX_UNICAST_FAILED: number;
    static COUNTER_APS_DATA_RX_BROADCAST: number;
    static COUNTER_APS_DATA_TX_BROADCAST: number;
    static COUNTER_APS_DATA_RX_UNICAST: number;
    static COUNTER_APS_DATA_TX_UNICAST_SUCCESS: number;
    static COUNTER_APS_DATA_TX_UNICAST_RETRY: number;
    static COUNTER_APS_DATA_TX_UNICAST_FAILED: number;
    static COUNTER_ROUTE_DISCOVERY_INITIATED: number;
    static COUNTER_NEIGHBOR_ADDED: number;
    static COUNTER_NEIGHBOR_REMOVED: number;
    static COUNTER_NEIGHBOR_STALE: number;
    static COUNTER_JOIN_INDICATION: number;
    static COUNTER_CHILD_REMOVED: number;
    static COUNTER_ASH_OVERFLOW_ERROR: number;
    static COUNTER_ASH_FRAMING_ERROR: number;
    static COUNTER_ASH_OVERRUN_ERROR: number;
    static COUNTER_NWK_FRAME_COUNTER_FAILURE: number;
    static COUNTER_APS_FRAME_COUNTER_FAILURE: number;
    static COUNTER_UTILITY: number;
    static COUNTER_APS_LINK_KEY_NOT_AUTHORIZED: number;
    static COUNTER_NWK_DECRYPTION_FAILURE: number;
    static COUNTER_APS_DECRYPTION_FAILURE: number;
    static COUNTER_ALLOCATE_PACKET_BUFFER_FAILURE: number;
    static COUNTER_RELAYED_UNICAST: number;
    static COUNTER_PHY_TO_MAC_QUEUE_LIMIT_REACHED: number;
    static COUNTER_PACKET_VALIDATE_LIBRARY_DROPPED_COUNT: number;
    static COUNTER_TYPE_NWK_RETRY_OVERFLOW: number;
    static COUNTER_PHY_CCA_FAIL_COUNT: number;
    static COUNTER_BROADCAST_TABLE_FULL: number;
    static COUNTER_PTA_LO_PRI_REQUESTED: number;
    static COUNTER_PTA_HI_PRI_REQUESTED: number;
    static COUNTER_PTA_LO_PRI_DENIED: number;
    static COUNTER_PTA_HI_PRI_DENIED: number;
    static COUNTER_PTA_LO_PRI_TX_ABORTED: number;
    static COUNTER_PTA_HI_PRI_TX_ABORTED: number;
    static COUNTER_TYPE_COUNT: number;
}
export declare class EmberJoinMethod extends basic.uint8_t {
    static USE_MAC_ASSOCIATION: number;
    static USE_NWK_REJOIN: number;
    static USE_NWK_REJOIN_HAVE_NWK_KEY: number;
    static USE_NWK_COMMISSIONING: number;
}
export declare class EmberZdoConfigurationFlags extends basic.uint8_t {
    static APP_RECEIVES_SUPPORTED_ZDO_REQUESTS: number;
    static APP_HANDLES_UNSUPPORTED_ZDO_REQUESTS: number;
    static APP_HANDLES_ZDO_ENDPOINT_REQUESTS: number;
    static APP_HANDLES_ZDO_BINDING_REQUESTS: number;
}
export declare class EmberConcentratorType extends basic.uint16_t {
    static LOW_RAM_CONCENTRATOR: number;
    static HIGH_RAM_CONCENTRATOR: number;
}
export declare class EmberZllState extends basic.uint16_t {
    static ZLL_STATE_NONE: number;
    static ZLL_STATE_FACTORY_NEW: number;
    static ZLL_STATE_ADDRESS_ASSIGNMENT_CAPABLE: number;
    static ZLL_STATE_LINK_INITIATOR: number;
    static ZLL_STATE_LINK_PRIORITY_REQUEST: number;
    static ZLL_STATE_NON_ZLL_NETWORK: number;
}
export declare class EmberZllKeyIndex extends basic.uint8_t {
    static ZLL_KEY_INDEX_DEVELOPMENT: number;
    static ZLL_KEY_INDEX_MASTER: number;
    static ZLL_KEY_INDEX_CERTIFICATION: number;
}
export declare class EzspZllNetworkOperation extends basic.uint8_t {
    static ZLL_FORM_NETWORK: number;
    static ZLL_JOIN_TARGET: number;
}
export declare class EzspSourceRouteOverheadInformation extends basic.uint8_t {
    static SOURCE_ROUTE_OVERHEAD_UNKNOWN: number;
}
export declare class EmberNetworkInitBitmask extends basic.uint16_t {
    static NETWORK_INIT_NO_OPTIONS: number;
    static NETWORK_INIT_PARENT_INFO_IN_TOKEN: number;
}
export declare class EmberZDOCmd extends basic.uint16_t {
    static NWK_addr_req: number;
    static IEEE_addr_req: number;
    static Node_Desc_req: number;
    static Power_Desc_req: number;
    static Simple_Desc_req: number;
    static Active_EP_req: number;
    static Match_Desc_req: number;
    static Complex_Desc_req: number;
    static User_Desc_req: number;
    static Discovery_Cache_req: number;
    static Device_annce: number;
    static User_Desc_set: number;
    static System_Server_Discovery_req: number;
    static Discovery_store_req: number;
    static Node_Desc_store_req: number;
    static Active_EP_store_req: number;
    static Simple_Desc_store_req: number;
    static Remove_node_cache_req: number;
    static Find_node_cache_req: number;
    static Extended_Simple_Desc_req: number;
    static Extended_Active_EP_req: number;
    static Parent_annce: number;
    static End_Device_Bind_req: number;
    static Bind_req: number;
    static Unbind_req: number;
    static Mgmt_Lqi_req: number;
    static Mgmt_Rtg_req: number;
    static Mgmt_Leave_req: number;
    static Mgmt_Permit_Joining_req: number;
    static Mgmt_NWK_Update_req: number;
    static NWK_addr_rsp: number;
    static IEEE_addr_rsp: number;
    static Node_Desc_rsp: number;
    static Power_Desc_rsp: number;
    static Simple_Desc_rsp: number;
    static Active_EP_rsp: number;
    static Match_Desc_rsp: number;
    static Complex_Desc_rsp: number;
    static User_Desc_rsp: number;
    static Discovery_Cache_rsp: number;
    static User_Desc_conf: number;
    static System_Server_Discovery_rsp: number;
    static Discovery_Store_rsp: number;
    static Node_Desc_store_rsp: number;
    static Power_Desc_store_rsp: number;
    static Active_EP_store_rsp: number;
    static Simple_Desc_store_rsp: number;
    static Remove_node_cache_rsp: number;
    static Find_node_cache_rsp: number;
    static Extended_Simple_Desc_rsp: number;
    static Extended_Active_EP_rsp: number;
    static Parent_annce_rsp: number;
    static End_Device_Bind_rsp: number;
    static Bind_rsp: number;
    static Unbind_rsp: number;
    static Mgmt_Lqi_rsp: number;
    static Mgmt_Rtg_rsp: number;
    static Mgmt_Leave_rsp: number;
    static Mgmt_Permit_Joining_rsp: number;
    static Mgmt_NWK_Update_rsp: number;
}
export declare class EzspDecisionBitmask extends basic.uint16_t {
    static DEFAULT_CONFIGURATION: number;
    static ALLOW_JOINS: number;
    static ALLOW_UNSECURED_REJOINS: number;
    static SEND_KEY_IN_CLEAR: number;
    static IGNORE_UNSECURED_REJOINS: number;
    static JOINS_USE_INSTALL_CODE_KEY: number;
    static DEFER_JOINS: number;
}
export declare class EmberDerivedKeyType extends basic.uint8_t {
    static NONE: number;
    static KEY_TRANSPORT_KEY: number;
    static KEY_LOAD_KEY: number;
    static VERIFY_KEY: number;
    static TC_SWAP_OUT_KEY: number;
    static TC_HASHED_LINK_KEY: number;
}
export {};
//# sourceMappingURL=named.d.ts.map