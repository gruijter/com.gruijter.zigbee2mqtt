export declare enum Status {
    /**  Operation was successful. */
    SUCCESS = 0,
    /**  Operation was not successful. */
    FAILURE = 1,
    /** The sender of the command does not have authorization to carry out this command. */
    NOT_AUTHORIZED = 126,
    RESERVED = 127,
    /**
     * The command appears to contain the wrong fields, as detected either by the presence of one or more invalid
     * field entries or by there being missing fields.
     * Command not carried out. Implementer has discretion as to whether to return this error or INVALID_FIELD.
     */
    MALFORMED_COMMAND = 128,
    /** The specified command is not supported on the device. Command not carried out. */
    UNSUP_COMMAND = 129,
    UNSUP_GENERAL_COMMAND = 130,// DEPRECATED in favor of UNSUP_COMMAND
    UNSUP_MANUF_CLUSTER_COMMAND = 131,// DEPRECATED in favor of UNSUP_COMMAND
    UNSUP_MANUF_GENERAL_COMMAND = 132,// DEPRECATED in favor of UNSUP_COMMAND
    /** At least one field of the command contains an incorrect value, according to the specification the device is implemented to. */
    INVALID_FIELD = 133,
    /** The specified attribute does not exist on the device. */
    UNSUPPORTED_ATTRIBUTE = 134,
    /**
     * Out of range error or set to a reserved value. Attribute keeps its old value.
     * Note that an attribute value may be out of range if an attribute is related to another,
     * e.g., with minimum and maximum attributes. See the individual attribute descriptions for specific details.
     */
    INVALID_VALUE = 135,
    /** Attempt to write a read-only attribute. */
    READ_ONLY = 136,
    /** An operation failed due to an insufficient amount of free space available. */
    INSUFFICIENT_SPACE = 137,
    DUPLICATE_EXISTS = 138,// DEPRECATED in favor of SUCCESS
    /** The requested information (e.g., table entry) could not be found. */
    NOT_FOUND = 139,
    /** Periodic reports cannot be issued for this attribute.*/
    UNREPORTABLE_ATTRIBUTE = 140,
    /** The data type given for an attribute is incorrect. Command not carried out.*/
    INVALID_DATA_TYPE = 141,
    /** The selector for an attribute is incorrect. */
    INVALID_SELECTOR = 142,
    WRITE_ONLY = 143,// DEPRECATED in favor of NOT_AUTHORIZED
    INCONSISTENT_STARTUP_STATE = 144,// DEPRECATED in favor of FAILURE
    DEFINED_OUT_OF_BAND = 145,// DEPRECATED in favor of FAILURE
    RESERVED14 = 146,
    ACTION_DENIED = 147,// DEPRECATED in favor of FAILURE
    /** The exchange was aborted due to excessive response time. */
    TIMEOUT = 148,
    /** Failed case when a client or a server decides to abort the upgrade process. */
    ABORT = 149,
    /** Invalid OTA upgrade image (ex. failed signature validation or signer information check or CRC check). */
    INVALID_IMAGE = 150,
    /** Server does not have data block available yet. */
    WAIT_FOR_DATA = 151,
    /** No OTA upgrade image available for the client. */
    NO_IMAGE_AVAILABLE = 152,
    /** The client still requires more OTA upgrade image files to successfully upgrade. */
    REQUIRE_MORE_IMAGE = 153,
    /** The command has been received and is being processed. */
    NOTIFICATION_PENDING = 154,
    HARDWARE_FAILURE = 192,// DEPRECATED in favor of FAILURE
    SOFTWARE_FAILURE = 193,// DEPRECATED in favor of FAILURE
    RESERVED15 = 194,
    /** The cluster is not supported. */
    UNSUPPORTED_CLUSTER = 195,
    LIMIT_REACHED = 196
}
//# sourceMappingURL=status.d.ts.map