export declare const EZSP_MIN_PROTOCOL_VERSION = 13;
/** Latest EZSP protocol version */
export declare const EZSP_PROTOCOL_VERSION = 18;
/** EZSP max length + Frame Control extra byte + Frame ID extra byte */
export declare const EZSP_MAX_FRAME_LENGTH: number;
/** EZSP Sequence Index for both legacy and extended frame format */
export declare const EZSP_SEQUENCE_INDEX = 0;
/** Legacy EZSP Frame Format */
export declare const EZSP_MIN_FRAME_LENGTH = 3;
/** Legacy EZSP Frame Format */
export declare const EZSP_FRAME_CONTROL_INDEX = 1;
/** Legacy EZSP Frame Format */
export declare const EZSP_FRAME_ID_INDEX = 2;
/** Legacy EZSP Frame Format */
export declare const EZSP_PARAMETERS_INDEX = 3;
/** Extended EZSP Frame Format */
export declare const EZSP_EXTENDED_MIN_FRAME_LENGTH = 5;
/** Extended EZSP Frame Format */
export declare const EZSP_EXTENDED_FRAME_ID_LENGTH = 2;
/** Extended EZSP Frame Format */
export declare const EZSP_EXTENDED_FRAME_CONTROL_LB_INDEX = 1;
/** Extended EZSP Frame Format */
export declare const EZSP_EXTENDED_FRAME_CONTROL_HB_INDEX = 2;
/** Extended EZSP Frame Format */
export declare const EZSP_EXTENDED_FRAME_ID_LB_INDEX = 3;
/** Extended EZSP Frame Format */
export declare const EZSP_EXTENDED_FRAME_ID_HB_INDEX = 4;
/** Extended EZSP Frame Format */
export declare const EZSP_EXTENDED_PARAMETERS_INDEX = 5;
export declare const EZSP_STACK_TYPE_MESH = 2;
/**
 * The high bit of the frame control lower byte indicates the direction of the message.
 * Commands are sent from the Host to the EM260. Responses are sent from the EM260 to the Host.
 */
export declare const EZSP_FRAME_CONTROL_DIRECTION_MASK = 128;
export declare const EZSP_FRAME_CONTROL_COMMAND = 0;
export declare const EZSP_FRAME_CONTROL_RESPONSE = 128;
/** Bits 5 and 6 of the frame control lower byte carry the network index the ezsp message is related to.
 * The NCP upon processing an incoming EZSP command, temporary switches the current network to the one indicated in the EZSP frame control.
 */
export declare const EZSP_FRAME_CONTROL_NETWORK_INDEX_MASK = 96;
export declare const EZSP_FRAME_CONTROL_NETWORK_INDEX_OFFSET = 5;
/** The EM260 enters the sleep mode specified by the command frame control once it has sent its response. */
export declare const EZSP_FRAME_CONTROL_SLEEP_MODE_MASK = 3;
/**
 * The overflow flag in the response frame control indicates to the Host that one or more callbacks occurred since the previous response
 * and there was not enough memory available to report them to the Host.
 */
export declare const EZSP_FRAME_CONTROL_OVERFLOW_MASK = 1;
export declare const EZSP_FRAME_CONTROL_NO_OVERFLOW = 0;
export declare const EZSP_FRAME_CONTROL_OVERFLOW = 1;
/**
 * The truncated flag in the response frame control indicates to the Host that the response has been truncated.
 * This will happen if there is not enough memory available to complete the response or if the response
 * would have exceeded the maximum EZSP frame length.
 */
export declare const EZSP_FRAME_CONTROL_TRUNCATED_MASK = 2;
export declare const EZSP_FRAME_CONTROL_NOT_TRUNCATED = 0;
export declare const EZSP_FRAME_CONTROL_TRUNCATED = 2;
/**
 * The pending callbacks flag in the response frame control lower byte indicates to the Host that there is at least one callback ready to be read.
 * This flag is clear if the response to a callback command read the last pending callback.
 */
export declare const EZSP_FRAME_CONTROL_PENDING_CB_MASK = 4;
export declare const EZSP_FRAME_CONTROL_PENDING_CB = 4;
export declare const EZSP_FRAME_CONTROL_NO_PENDING_CB = 0;
/** The synchronous callback flag in the response frame control lower byte indicates this ezsp frame is the response to an ezspCallback(). */
export declare const EZSP_FRAME_CONTROL_SYNCH_CB_MASK = 8;
export declare const EZSP_FRAME_CONTROL_SYNCH_CB = 8;
export declare const EZSP_FRAME_CONTROL_NOT_SYNCH_CB = 0;
/**
 * The asynchronous callback flag in the response frame control lower byte indicates this ezsp frame is a callback sent asynchronously by the ncp.
 * This flag may be set only in the uart version when EZSP_VALUE_UART_SYNCH_CALLBACKS is 0.
 */
export declare const EZSP_FRAME_CONTROL_ASYNCH_CB_MASK = 16;
export declare const EZSP_FRAME_CONTROL_ASYNCH_CB = 16;
export declare const EZSP_FRAME_CONTROL_NOT_ASYNCH_CB = 0;
/** Bit 7 of the frame control higher byte indicates whether security is enabled or not. */
export declare const EZSP_EXTENDED_FRAME_CONTROL_SECURITY_MASK = 128;
export declare const EZSP_EXTENDED_FRAME_CONTROL_SECURE = 128;
export declare const EZSP_EXTENDED_FRAME_CONTROL_UNSECURE = 0;
/** Bit 6 of the frame control higher byte indicates whether padding is enabled or not. */
export declare const EZSP_EXTENDED_FRAME_CONTROL_PADDING_MASK = 64;
export declare const EZSP_EXTENDED_FRAME_CONTROL_PADDED = 64;
export declare const EZSP_EXTENDED_FRAME_CONTROL_UNPADDED = 0;
/** Bits 0 and 1 of the frame control higher byte indicates the frame format version. */
export declare const EZSP_EXTENDED_FRAME_FORMAT_VERSION_MASK = 3;
export declare const EZSP_EXTENDED_FRAME_FORMAT_VERSION = 1;
/** Reserved bits 2-5 */
export declare const EZSP_EXTENDED_FRAME_CONTROL_RESERVED_MASK = 60;
/** Size of EUI64 (an IEEE address) in bytes (8). */
export declare const EUI64_SIZE = 8;
/** Size of an extended PAN identifier in bytes (8). */
export declare const EXTENDED_PAN_ID_SIZE = 8;
/** Size of an encryption key in bytes (16). */
export declare const EMBER_ENCRYPTION_KEY_SIZE = 16;
/** Size of Implicit Certificates used for Certificate-based Key Exchange(CBKE). */
export declare const EMBER_CERTIFICATE_SIZE = 48;
/** Size of Public Keys used in Elliptical Cryptography ECMQV algorithms. */
export declare const EMBER_PUBLIC_KEY_SIZE = 22;
/** Size of Private Keys used in Elliptical Cryptography ECMQV algorithms. */
export declare const EMBER_PRIVATE_KEY_SIZE = 21;
/** Size of the SMAC used in Elliptical Cryptography ECMQV algorithms. */
export declare const EMBER_SMAC_SIZE = 16;
/** Size of the DSA signature used in Elliptical Cryptography   Digital Signature Algorithms. */
export declare const EMBER_SIGNATURE_SIZE = 42;
/** The size of AES-128 MMO hash is 16-bytes.  This is defined in the core.  Zigbee specification. */
export declare const EMBER_AES_HASH_BLOCK_SIZE = 16;
/** Size of Implicit Certificates used for Certificate Based Key Exchange using the ECC283K1 curve in bytes. */
export declare const EMBER_CERTIFICATE_283K1_SIZE = 74;
/** Size of Public Keys used in SECT283k1 Elliptical Cryptography ECMQV algorithms */
export declare const EMBER_PUBLIC_KEY_283K1_SIZE = 37;
/** Size of Private Keys used SECT283k1 in Elliptical Cryptography ECMQV algorithms*/
export declare const EMBER_PRIVATE_KEY_283K1_SIZE = 36;
/** Size of the DSA signature used in SECT283k1 Elliptical Cryptography Digital Signature Algorithms. */
export declare const EMBER_SIGNATURE_283K1_SIZE = 72;
//# sourceMappingURL=consts.d.ts.map