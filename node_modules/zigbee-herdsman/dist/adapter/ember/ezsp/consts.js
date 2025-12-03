"use strict";
//-------------------------------------------------------------------------------------------------
// EZSP Protocol
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMBER_CERTIFICATE_SIZE = exports.EMBER_ENCRYPTION_KEY_SIZE = exports.EXTENDED_PAN_ID_SIZE = exports.EUI64_SIZE = exports.EZSP_EXTENDED_FRAME_CONTROL_RESERVED_MASK = exports.EZSP_EXTENDED_FRAME_FORMAT_VERSION = exports.EZSP_EXTENDED_FRAME_FORMAT_VERSION_MASK = exports.EZSP_EXTENDED_FRAME_CONTROL_UNPADDED = exports.EZSP_EXTENDED_FRAME_CONTROL_PADDED = exports.EZSP_EXTENDED_FRAME_CONTROL_PADDING_MASK = exports.EZSP_EXTENDED_FRAME_CONTROL_UNSECURE = exports.EZSP_EXTENDED_FRAME_CONTROL_SECURE = exports.EZSP_EXTENDED_FRAME_CONTROL_SECURITY_MASK = exports.EZSP_FRAME_CONTROL_NOT_ASYNCH_CB = exports.EZSP_FRAME_CONTROL_ASYNCH_CB = exports.EZSP_FRAME_CONTROL_ASYNCH_CB_MASK = exports.EZSP_FRAME_CONTROL_NOT_SYNCH_CB = exports.EZSP_FRAME_CONTROL_SYNCH_CB = exports.EZSP_FRAME_CONTROL_SYNCH_CB_MASK = exports.EZSP_FRAME_CONTROL_NO_PENDING_CB = exports.EZSP_FRAME_CONTROL_PENDING_CB = exports.EZSP_FRAME_CONTROL_PENDING_CB_MASK = exports.EZSP_FRAME_CONTROL_TRUNCATED = exports.EZSP_FRAME_CONTROL_NOT_TRUNCATED = exports.EZSP_FRAME_CONTROL_TRUNCATED_MASK = exports.EZSP_FRAME_CONTROL_OVERFLOW = exports.EZSP_FRAME_CONTROL_NO_OVERFLOW = exports.EZSP_FRAME_CONTROL_OVERFLOW_MASK = exports.EZSP_FRAME_CONTROL_SLEEP_MODE_MASK = exports.EZSP_FRAME_CONTROL_NETWORK_INDEX_OFFSET = exports.EZSP_FRAME_CONTROL_NETWORK_INDEX_MASK = exports.EZSP_FRAME_CONTROL_RESPONSE = exports.EZSP_FRAME_CONTROL_COMMAND = exports.EZSP_FRAME_CONTROL_DIRECTION_MASK = exports.EZSP_STACK_TYPE_MESH = exports.EZSP_EXTENDED_PARAMETERS_INDEX = exports.EZSP_EXTENDED_FRAME_ID_HB_INDEX = exports.EZSP_EXTENDED_FRAME_ID_LB_INDEX = exports.EZSP_EXTENDED_FRAME_CONTROL_HB_INDEX = exports.EZSP_EXTENDED_FRAME_CONTROL_LB_INDEX = exports.EZSP_EXTENDED_FRAME_ID_LENGTH = exports.EZSP_EXTENDED_MIN_FRAME_LENGTH = exports.EZSP_PARAMETERS_INDEX = exports.EZSP_FRAME_ID_INDEX = exports.EZSP_FRAME_CONTROL_INDEX = exports.EZSP_MIN_FRAME_LENGTH = exports.EZSP_SEQUENCE_INDEX = exports.EZSP_MAX_FRAME_LENGTH = exports.EZSP_PROTOCOL_VERSION = exports.EZSP_MIN_PROTOCOL_VERSION = void 0;
exports.EMBER_SIGNATURE_283K1_SIZE = exports.EMBER_PRIVATE_KEY_283K1_SIZE = exports.EMBER_PUBLIC_KEY_283K1_SIZE = exports.EMBER_CERTIFICATE_283K1_SIZE = exports.EMBER_AES_HASH_BLOCK_SIZE = exports.EMBER_SIGNATURE_SIZE = exports.EMBER_SMAC_SIZE = exports.EMBER_PRIVATE_KEY_SIZE = exports.EMBER_PUBLIC_KEY_SIZE = void 0;
exports.EZSP_MIN_PROTOCOL_VERSION = 0x0d;
/** Latest EZSP protocol version */
exports.EZSP_PROTOCOL_VERSION = 0x12;
/** EZSP max length + Frame Control extra byte + Frame ID extra byte */
exports.EZSP_MAX_FRAME_LENGTH = 218 + 1 + 1;
/** EZSP Sequence Index for both legacy and extended frame format */
exports.EZSP_SEQUENCE_INDEX = 0;
/** Legacy EZSP Frame Format */
exports.EZSP_MIN_FRAME_LENGTH = 3;
/** Legacy EZSP Frame Format */
exports.EZSP_FRAME_CONTROL_INDEX = 1;
/** Legacy EZSP Frame Format */
exports.EZSP_FRAME_ID_INDEX = 2;
/** Legacy EZSP Frame Format */
exports.EZSP_PARAMETERS_INDEX = 3;
/** Extended EZSP Frame Format */
exports.EZSP_EXTENDED_MIN_FRAME_LENGTH = 5;
/** Extended EZSP Frame Format */
exports.EZSP_EXTENDED_FRAME_ID_LENGTH = 2;
/** Extended EZSP Frame Format */
exports.EZSP_EXTENDED_FRAME_CONTROL_LB_INDEX = 1;
/** Extended EZSP Frame Format */
exports.EZSP_EXTENDED_FRAME_CONTROL_HB_INDEX = 2;
/** Extended EZSP Frame Format */
exports.EZSP_EXTENDED_FRAME_ID_LB_INDEX = 3;
/** Extended EZSP Frame Format */
exports.EZSP_EXTENDED_FRAME_ID_HB_INDEX = 4;
/** Extended EZSP Frame Format */
exports.EZSP_EXTENDED_PARAMETERS_INDEX = 5;
exports.EZSP_STACK_TYPE_MESH = 0x02;
//---- Frame Control Lower Byte (LB) Definitions
/**
 * The high bit of the frame control lower byte indicates the direction of the message.
 * Commands are sent from the Host to the EM260. Responses are sent from the EM260 to the Host.
 */
exports.EZSP_FRAME_CONTROL_DIRECTION_MASK = 0x80;
exports.EZSP_FRAME_CONTROL_COMMAND = 0x00;
exports.EZSP_FRAME_CONTROL_RESPONSE = 0x80;
/** Bits 5 and 6 of the frame control lower byte carry the network index the ezsp message is related to.
 * The NCP upon processing an incoming EZSP command, temporary switches the current network to the one indicated in the EZSP frame control.
 */
exports.EZSP_FRAME_CONTROL_NETWORK_INDEX_MASK = 0x60;
exports.EZSP_FRAME_CONTROL_NETWORK_INDEX_OFFSET = 5;
// Command Frame Control Fields
/** The EM260 enters the sleep mode specified by the command frame control once it has sent its response. */
exports.EZSP_FRAME_CONTROL_SLEEP_MODE_MASK = 0x03;
// Response Frame Control Fields
/**
 * The overflow flag in the response frame control indicates to the Host that one or more callbacks occurred since the previous response
 * and there was not enough memory available to report them to the Host.
 */
exports.EZSP_FRAME_CONTROL_OVERFLOW_MASK = 0x01;
exports.EZSP_FRAME_CONTROL_NO_OVERFLOW = 0x00;
exports.EZSP_FRAME_CONTROL_OVERFLOW = 0x01;
/**
 * The truncated flag in the response frame control indicates to the Host that the response has been truncated.
 * This will happen if there is not enough memory available to complete the response or if the response
 * would have exceeded the maximum EZSP frame length.
 */
exports.EZSP_FRAME_CONTROL_TRUNCATED_MASK = 0x02;
exports.EZSP_FRAME_CONTROL_NOT_TRUNCATED = 0x00;
exports.EZSP_FRAME_CONTROL_TRUNCATED = 0x02;
/**
 * The pending callbacks flag in the response frame control lower byte indicates to the Host that there is at least one callback ready to be read.
 * This flag is clear if the response to a callback command read the last pending callback.
 */
exports.EZSP_FRAME_CONTROL_PENDING_CB_MASK = 0x04;
exports.EZSP_FRAME_CONTROL_PENDING_CB = 0x04;
exports.EZSP_FRAME_CONTROL_NO_PENDING_CB = 0x00;
/** The synchronous callback flag in the response frame control lower byte indicates this ezsp frame is the response to an ezspCallback(). */
exports.EZSP_FRAME_CONTROL_SYNCH_CB_MASK = 0x08;
exports.EZSP_FRAME_CONTROL_SYNCH_CB = 0x08;
exports.EZSP_FRAME_CONTROL_NOT_SYNCH_CB = 0x00;
/**
 * The asynchronous callback flag in the response frame control lower byte indicates this ezsp frame is a callback sent asynchronously by the ncp.
 * This flag may be set only in the uart version when EZSP_VALUE_UART_SYNCH_CALLBACKS is 0.
 */
exports.EZSP_FRAME_CONTROL_ASYNCH_CB_MASK = 0x10;
exports.EZSP_FRAME_CONTROL_ASYNCH_CB = 0x10;
exports.EZSP_FRAME_CONTROL_NOT_ASYNCH_CB = 0x00;
//---- Frame Control Higher Byte (HB) Definitions
/** Bit 7 of the frame control higher byte indicates whether security is enabled or not. */
exports.EZSP_EXTENDED_FRAME_CONTROL_SECURITY_MASK = 0x80;
exports.EZSP_EXTENDED_FRAME_CONTROL_SECURE = 0x80;
exports.EZSP_EXTENDED_FRAME_CONTROL_UNSECURE = 0x00;
/** Bit 6 of the frame control higher byte indicates whether padding is enabled or not. */
exports.EZSP_EXTENDED_FRAME_CONTROL_PADDING_MASK = 0x40;
exports.EZSP_EXTENDED_FRAME_CONTROL_PADDED = 0x40;
exports.EZSP_EXTENDED_FRAME_CONTROL_UNPADDED = 0x00;
/** Bits 0 and 1 of the frame control higher byte indicates the frame format version. */
exports.EZSP_EXTENDED_FRAME_FORMAT_VERSION_MASK = 0x03;
exports.EZSP_EXTENDED_FRAME_FORMAT_VERSION = 0x01;
/** Reserved bits 2-5 */
exports.EZSP_EXTENDED_FRAME_CONTROL_RESERVED_MASK = 0x3c;
//-------------------------------------------------------------------------------------------------
// EZSP Data types
/** Size of EUI64 (an IEEE address) in bytes (8). */
exports.EUI64_SIZE = 8;
/** Size of an extended PAN identifier in bytes (8). */
exports.EXTENDED_PAN_ID_SIZE = 8;
/** Size of an encryption key in bytes (16). */
exports.EMBER_ENCRYPTION_KEY_SIZE = 16;
/** Size of Implicit Certificates used for Certificate-based Key Exchange(CBKE). */
exports.EMBER_CERTIFICATE_SIZE = 48;
/** Size of Public Keys used in Elliptical Cryptography ECMQV algorithms. */
exports.EMBER_PUBLIC_KEY_SIZE = 22;
/** Size of Private Keys used in Elliptical Cryptography ECMQV algorithms. */
exports.EMBER_PRIVATE_KEY_SIZE = 21;
/** Size of the SMAC used in Elliptical Cryptography ECMQV algorithms. */
exports.EMBER_SMAC_SIZE = 16;
/** Size of the DSA signature used in Elliptical Cryptography   Digital Signature Algorithms. */
exports.EMBER_SIGNATURE_SIZE = 42;
/** The size of AES-128 MMO hash is 16-bytes.  This is defined in the core.  Zigbee specification. */
exports.EMBER_AES_HASH_BLOCK_SIZE = 16;
/** Size of Implicit Certificates used for Certificate Based Key Exchange using the ECC283K1 curve in bytes. */
exports.EMBER_CERTIFICATE_283K1_SIZE = 74;
/** Size of Public Keys used in SECT283k1 Elliptical Cryptography ECMQV algorithms */
exports.EMBER_PUBLIC_KEY_283K1_SIZE = 37;
/** Size of Private Keys used SECT283k1 in Elliptical Cryptography ECMQV algorithms*/
exports.EMBER_PRIVATE_KEY_283K1_SIZE = 36;
/** Size of the DSA signature used in SECT283k1 Elliptical Cryptography Digital Signature Algorithms. */
exports.EMBER_SIGNATURE_283K1_SIZE = 72;
//# sourceMappingURL=consts.js.map