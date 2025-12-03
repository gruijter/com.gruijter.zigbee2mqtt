"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALID_BAUDRATES = exports.LFSR_SEED = exports.LFSR_POLY = exports.SH_RX_BUFFER_LEN = exports.SH_TX_BUFFER_LEN = exports.ASH_FRAME_LEN_ERROR = exports.ASH_FRAME_LEN_RSTACK = exports.ASH_FRAME_LEN_RST = exports.ASH_FRAME_LEN_NAK = exports.ASH_FRAME_LEN_ACK = exports.ASH_FRAME_LEN_DATA_MIN = exports.ASH_MAX_FRAME_WITH_CRC_LEN = exports.ASH_MIN_FRAME_WITH_CRC_LEN = exports.ASH_CRC_LEN = exports.ASH_MAX_FRAME_LEN = exports.ASH_MIN_FRAME_LEN = exports.ASH_MIN_DATA_FRAME_LEN = exports.ASH_MAX_DATA_FIELD_LEN = exports.ASH_MIN_DATA_FIELD_LEN = exports.ASH_FLIP = exports.ASH_WAKE = exports.ASH_FRMNUM_BIT = exports.ASH_FRMNUM_MASK = exports.ASH_PFLAG_BIT = exports.ASH_PFLAG_MASK = exports.ASH_NFLAG_BIT = exports.ASH_NFLAG_MASK = exports.ASH_RFLAG_BIT = exports.ASH_RFLAG_MASK = exports.ASH_ACKNUM_BIT = exports.ASH_ACKNUM_MASK = exports.ASH_SHFRAME_MASK = exports.ASH_DFRAME_MASK = exports.ASH_NR_TIMER_BIT = exports.ASH_MAX_WAKE_TIME = exports.ASH_MAX_TIMEOUTS = exports.ASH_VERSION = exports.TX_POOL_BUFFERS = exports.EZSP_HOST_RX_POOL_SIZE = void 0;
const consts_1 = require("../ezsp/consts");
/**
 * Define the size of the receive buffer pool on the EZSP host.
 *
 * The number of receive buffers does not need to be greater than the number of packet buffers available on the NCP,
 * because this in turn is the maximum number of callbacks that could be received between commands.
 * In reality a value of 20 is a generous allocation.
 */
exports.EZSP_HOST_RX_POOL_SIZE = 32;
/**
 * The number of transmit buffers must be set to the number of receive buffers
 * -- to hold the immediate ACKs sent for each callabck frame received --
 * plus 3 buffers for the retransmit queue and one each for an automatic ACK
 * (due to data flow control) and a command.
 */
exports.TX_POOL_BUFFERS = exports.EZSP_HOST_RX_POOL_SIZE + 5;
/** protocol version */
exports.ASH_VERSION = 2;
/**
 * Timeouts before link is judged down.
 *
 * Consecutive ACK timeouts (minus 1) needed to enter the ERROR state.
 *
 * Is 3 in ash-ncp.h
 */
exports.ASH_MAX_TIMEOUTS = 6;
/** max time in msecs for ncp to wake */
exports.ASH_MAX_WAKE_TIME = 150;
/**
 * Define the units used by the Not Ready timer as 2**n msecs
 * log2 of msecs per NR timer unit
 */
exports.ASH_NR_TIMER_BIT = 4;
/** Control byte mask for DATA frame */
exports.ASH_DFRAME_MASK = 0x80;
/** Control byte mask for short frames (ACK/NAK) */
exports.ASH_SHFRAME_MASK = 0xe0;
/** Acknowledge frame number */
exports.ASH_ACKNUM_MASK = 0x07;
exports.ASH_ACKNUM_BIT = 0;
/** Retransmitted frame flag */
exports.ASH_RFLAG_MASK = 0x08;
exports.ASH_RFLAG_BIT = 3;
/** Receiver not ready flag */
exports.ASH_NFLAG_MASK = 0x08;
exports.ASH_NFLAG_BIT = 3;
/** Reserved for future use */
exports.ASH_PFLAG_MASK = 0x10;
exports.ASH_PFLAG_BIT = 4;
/** DATA frame number */
exports.ASH_FRMNUM_MASK = 0x70;
exports.ASH_FRMNUM_BIT = 4;
/**
 * The wake byte special function applies only when in between frames,
 * so it does not need to be escaped within a frame.
 * (also means NCP data pending)
 */
exports.ASH_WAKE = 0xff; /*!<   */
/** Constant used in byte-stuffing (XOR mask used in byte stuffing) */
exports.ASH_FLIP = 0x20;
// Field and frame lengths, excluding flag byte and any byte stuffing overhead
// All limits are inclusive
exports.ASH_MIN_DATA_FIELD_LEN = consts_1.EZSP_MIN_FRAME_LENGTH;
exports.ASH_MAX_DATA_FIELD_LEN = consts_1.EZSP_MAX_FRAME_LENGTH;
/** with control */
exports.ASH_MIN_DATA_FRAME_LEN = exports.ASH_MIN_DATA_FIELD_LEN + 1;
/** control plus data field, but not CRC */
exports.ASH_MIN_FRAME_LEN = 1;
exports.ASH_MAX_FRAME_LEN = exports.ASH_MAX_DATA_FIELD_LEN + 1;
exports.ASH_CRC_LEN = 2;
exports.ASH_MIN_FRAME_WITH_CRC_LEN = exports.ASH_MIN_FRAME_LEN + exports.ASH_CRC_LEN;
exports.ASH_MAX_FRAME_WITH_CRC_LEN = exports.ASH_MAX_FRAME_LEN + exports.ASH_CRC_LEN;
// Lengths for each frame type: includes control and data field (if any), excludes the CRC and flag bytes
/** ash frame len data min */
exports.ASH_FRAME_LEN_DATA_MIN = exports.ASH_MIN_DATA_FIELD_LEN + 1;
/** [control] */
exports.ASH_FRAME_LEN_ACK = 1;
/** [control] */
exports.ASH_FRAME_LEN_NAK = 1;
/** [control] */
exports.ASH_FRAME_LEN_RST = 1;
/** [control, version, reset reason] */
exports.ASH_FRAME_LEN_RSTACK = 3;
/** [control, version, error] */
exports.ASH_FRAME_LEN_ERROR = 3;
// Define lengths of short frames - includes control byte and data field
/** longest non-data frame sent */
exports.SH_TX_BUFFER_LEN = 2;
/** longest non-data frame received */
exports.SH_RX_BUFFER_LEN = 3;
// Define constants for the LFSR in randomizeBuffer()
/** polynomial */
exports.LFSR_POLY = 0xb8;
/** initial value (seed) */
exports.LFSR_SEED = 0x42;
exports.VALID_BAUDRATES = [600, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800];
//# sourceMappingURL=consts.js.map