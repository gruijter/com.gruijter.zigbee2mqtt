"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
var Status;
(function (Status) {
    /**  Operation was successful. */
    Status[Status["SUCCESS"] = 0] = "SUCCESS";
    /**  Operation was not successful. */
    Status[Status["FAILURE"] = 1] = "FAILURE";
    /** The sender of the command does not have authorization to carry out this command. */
    Status[Status["NOT_AUTHORIZED"] = 126] = "NOT_AUTHORIZED";
    Status[Status["RESERVED"] = 127] = "RESERVED";
    /**
     * The command appears to contain the wrong fields, as detected either by the presence of one or more invalid
     * field entries or by there being missing fields.
     * Command not carried out. Implementer has discretion as to whether to return this error or INVALID_FIELD.
     */
    Status[Status["MALFORMED_COMMAND"] = 128] = "MALFORMED_COMMAND";
    // UNSUP_CLUSTER_COMMAND = 0x81, DEPRECATED in favor of UNSUP_COMMAND
    /** The specified command is not supported on the device. Command not carried out. */
    Status[Status["UNSUP_COMMAND"] = 129] = "UNSUP_COMMAND";
    Status[Status["UNSUP_GENERAL_COMMAND"] = 130] = "UNSUP_GENERAL_COMMAND";
    Status[Status["UNSUP_MANUF_CLUSTER_COMMAND"] = 131] = "UNSUP_MANUF_CLUSTER_COMMAND";
    Status[Status["UNSUP_MANUF_GENERAL_COMMAND"] = 132] = "UNSUP_MANUF_GENERAL_COMMAND";
    /** At least one field of the command contains an incorrect value, according to the specification the device is implemented to. */
    Status[Status["INVALID_FIELD"] = 133] = "INVALID_FIELD";
    /** The specified attribute does not exist on the device. */
    Status[Status["UNSUPPORTED_ATTRIBUTE"] = 134] = "UNSUPPORTED_ATTRIBUTE";
    /**
     * Out of range error or set to a reserved value. Attribute keeps its old value.
     * Note that an attribute value may be out of range if an attribute is related to another,
     * e.g., with minimum and maximum attributes. See the individual attribute descriptions for specific details.
     */
    Status[Status["INVALID_VALUE"] = 135] = "INVALID_VALUE";
    /** Attempt to write a read-only attribute. */
    Status[Status["READ_ONLY"] = 136] = "READ_ONLY";
    /** An operation failed due to an insufficient amount of free space available. */
    Status[Status["INSUFFICIENT_SPACE"] = 137] = "INSUFFICIENT_SPACE";
    Status[Status["DUPLICATE_EXISTS"] = 138] = "DUPLICATE_EXISTS";
    /** The requested information (e.g., table entry) could not be found. */
    Status[Status["NOT_FOUND"] = 139] = "NOT_FOUND";
    /** Periodic reports cannot be issued for this attribute.*/
    Status[Status["UNREPORTABLE_ATTRIBUTE"] = 140] = "UNREPORTABLE_ATTRIBUTE";
    /** The data type given for an attribute is incorrect. Command not carried out.*/
    Status[Status["INVALID_DATA_TYPE"] = 141] = "INVALID_DATA_TYPE";
    /** The selector for an attribute is incorrect. */
    Status[Status["INVALID_SELECTOR"] = 142] = "INVALID_SELECTOR";
    Status[Status["WRITE_ONLY"] = 143] = "WRITE_ONLY";
    Status[Status["INCONSISTENT_STARTUP_STATE"] = 144] = "INCONSISTENT_STARTUP_STATE";
    Status[Status["DEFINED_OUT_OF_BAND"] = 145] = "DEFINED_OUT_OF_BAND";
    Status[Status["RESERVED14"] = 146] = "RESERVED14";
    Status[Status["ACTION_DENIED"] = 147] = "ACTION_DENIED";
    /** The exchange was aborted due to excessive response time. */
    Status[Status["TIMEOUT"] = 148] = "TIMEOUT";
    /** Failed case when a client or a server decides to abort the upgrade process. */
    Status[Status["ABORT"] = 149] = "ABORT";
    /** Invalid OTA upgrade image (ex. failed signature validation or signer information check or CRC check). */
    Status[Status["INVALID_IMAGE"] = 150] = "INVALID_IMAGE";
    /** Server does not have data block available yet. */
    Status[Status["WAIT_FOR_DATA"] = 151] = "WAIT_FOR_DATA";
    /** No OTA upgrade image available for the client. */
    Status[Status["NO_IMAGE_AVAILABLE"] = 152] = "NO_IMAGE_AVAILABLE";
    /** The client still requires more OTA upgrade image files to successfully upgrade. */
    Status[Status["REQUIRE_MORE_IMAGE"] = 153] = "REQUIRE_MORE_IMAGE";
    /** The command has been received and is being processed. */
    Status[Status["NOTIFICATION_PENDING"] = 154] = "NOTIFICATION_PENDING";
    Status[Status["HARDWARE_FAILURE"] = 192] = "HARDWARE_FAILURE";
    Status[Status["SOFTWARE_FAILURE"] = 193] = "SOFTWARE_FAILURE";
    Status[Status["RESERVED15"] = 194] = "RESERVED15";
    /** The cluster is not supported. */
    Status[Status["UNSUPPORTED_CLUSTER"] = 195] = "UNSUPPORTED_CLUSTER";
    Status[Status["LIMIT_REACHED"] = 196] = "LIMIT_REACHED";
})(Status || (exports.Status = Status = {}));
//# sourceMappingURL=status.js.map