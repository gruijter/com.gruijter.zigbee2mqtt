import { EventEmitter } from "node:events";
import type { SerialPortOptions } from "../../tstype";
import { EzspStatus } from "../enums";
import { AshFrameType } from "./enums";
import { EzspFreeList, EzspQueue } from "./queues";
type UartAshCounters = {
    /** DATA frame data fields bytes transmitted */
    txData: number;
    /** frames of all types transmitted */
    txAllFrames: number;
    /** DATA frames transmitted */
    txDataFrames: number;
    /** ACK frames transmitted */
    txAckFrames: number;
    /** NAK frames transmitted */
    txNakFrames: number;
    /** DATA frames retransmitted */
    txReDataFrames: number;
    /** ACK and NAK frames with nFlag 0 transmitted */
    /** ACK and NAK frames with nFlag 1 transmitted */
    txN1Frames: number;
    /** frames cancelled (with ASH_CAN byte) */
    txCancelled: number;
    /** DATA frame data fields bytes received */
    rxData: number;
    /** frames of all types received */
    rxAllFrames: number;
    /** DATA frames received */
    rxDataFrames: number;
    /** ACK frames received */
    rxAckFrames: number;
    /** NAK frames received */
    rxNakFrames: number;
    /** retransmitted DATA frames received */
    rxReDataFrames: number;
    /** ACK and NAK frames with nFlag 0 received */
    /** ACK and NAK frames with nFlag 1 received */
    rxN1Frames: number;
    /** frames cancelled (with ASH_CAN byte) */
    rxCancelled: number;
    /** frames with CRC errors */
    rxCrcErrors: number;
    /** frames with comm errors (with ASH_SUB byte) */
    rxCommErrors: number;
    /** frames shorter than minimum */
    rxTooShort: number;
    /** frames longer than maximum */
    rxTooLong: number;
    /** frames with illegal control byte */
    rxBadControl: number;
    /** frames with illegal length for type of frame */
    rxBadLength: number;
    /** frames with bad ACK numbers */
    rxBadAckNumber: number;
    /** DATA frames discarded due to lack of buffers */
    rxNoBuffer: number;
    /** duplicate retransmitted DATA frames */
    rxDuplicates: number;
    /** DATA frames received out of sequence */
    rxOutOfSequence: number;
    /** received ACK timeouts */
    rxAckTimeouts: number;
};
/** max frames sent without being ACKed (1-7) */
export declare const CONFIG_TX_K = 3;
interface UartAshEventMap {
    fatalError: [status: EzspStatus];
    frame: [];
}
/**
 * ASH Protocol handler.
 */
export declare class UartAsh extends EventEmitter<UartAshEventMap> {
    private readonly portOptions;
    private serialPort?;
    private socketPort?;
    private writer;
    private parser;
    /** True when serial/socket is currently closing. */
    private closing;
    /** time ackTimer started: 0 means not ready uint16_t */
    private ackTimer;
    /** time used to check ackTimer expiry (msecs) uint16_t */
    private ackPeriod;
    /** not ready timer (16 msec units). Set to (now + config.nrTime) when started. uint8_t */
    private nrTimer;
    /** frame decode in progress */
    private decodeInProgress;
    /** true when preceding byte was escaped */
    private encodeEscFlag;
    /** byte to send after ASH_ESC uint8_t */
    private encodeFlip;
    /** uint16_t */
    private encodeCrc;
    /** encoder state: 0 = control/data bytes, 1 = crc low byte, 2 = crc high byte, 3 = flag. uint8_t */
    private encodeState;
    /** bytes remaining to encode. uint8_t */
    private encodeCount;
    /** bytes in frame, plus CRC, clamped to limit +1: high values also used to record certain errors. uint8_t */
    private decodeLen;
    /** ASH_FLIP if previous byte was ASH_ESC. uint8_t */
    private decodeFlip;
    /** a 2 byte queue to avoid outputting crc bytes. uint8_t */
    private decodeByte1;
    /** at frame end, they contain the received crc. uint8_t */
    private decodeByte2;
    /** uint16_t */
    private decodeCrc;
    /** outgoing short frames */
    private txSHBuffer;
    /** incoming short frames */
    private rxSHBuffer;
    /** bit flags for top-level logic. uint16_t */
    private flags;
    /** frame ack'ed from remote peer. uint8_t */
    private ackRx;
    /** frame ack'ed to remote peer. uint8_t */
    private ackTx;
    /** next frame to be transmitted. uint8_t */
    private frmTx;
    /** next frame to be retransmitted. uint8_t */
    private frmReTx;
    /** next frame expected to be rec'd. uint8_t */
    private frmRx;
    /** frame at retx queue's head. uint8_t */
    private frmReTxHead;
    /** consecutive timeout counter. uint8_t */
    private timeouts;
    /** rec'd DATA frame buffer. uint8_t */
    private rxDataBuffer?;
    /** rec'd frame length. uint8_t */
    private rxLen;
    /** tx frame offset. uint8_t */
    private txOffset;
    counters: UartAshCounters;
    /**
     * Errors reported by the NCP.
     * The `NcpFailedCode` from the frame reporting this is logged before this is set to make it clear where it failed:
     * - The NCP sent an ERROR frame during the initial reset sequence (before CONNECTED state)
     * - The NCP sent an ERROR frame
     * - The NCP sent an unexpected RSTACK
     */
    private ncpError;
    /** Errors reported by the Host. */
    private hostError;
    /** sendExec() state variable */
    private sendState;
    /** NCP is enabled to sleep, set by EZSP, not supported atm, always false */
    ncpSleepEnabled: boolean;
    /**
     * Set when the ncp has indicated it has a pending callback by seting the callback flag in the frame control byte
     * or (uart version only) by sending an an ASH_WAKE byte between frames.
     */
    ncpHasCallbacks: boolean;
    /** Transmit buffers */
    private readonly txPool;
    readonly txQueue: EzspQueue;
    readonly reTxQueue: EzspQueue;
    readonly txFree: EzspFreeList;
    /** Receive buffers */
    private readonly rxPool;
    readonly rxQueue: EzspQueue;
    readonly rxFree: EzspFreeList;
    constructor(options: SerialPortOptions);
    /**
     * Check if port is valid, open, and not closing.
     */
    get portOpen(): boolean;
    /**
     * Get max wait time before response is considered timed out.
     */
    get responseTimeout(): number;
    /**
     * Indicates if the host is in the Connected state.
     * If not, the host and NCP cannot exchange DATA frames.
     * Note that this function does not actively confirm that communication with NCP is healthy, but simply returns its last known status.
     *
     * @returns
     * - true  - host and NCP can exchange DATA frames
     * - false - host and NCP cannot now exchange DATA frames
     */
    get connected(): boolean;
    /**
     * Has nothing to do...
     */
    get idle(): boolean;
    /**
     * Init the serial or socket port and hook parser/writer.
     * NOTE: This is the only function that throws/rejects in the ASH layer (caught by resetNcp and turned into an EzspStatus).
     */
    private initPort;
    /**
     * Handle port closing
     * @param err A boolean for Socket, an Error for serialport
     */
    private onPortClose;
    /**
     * Handle port error
     * @param error
     */
    private onPortError;
    /**
     * Handle received frame from AshParser.
     * @param buf
     */
    private onFrame;
    /**
     * Initializes the ASH protocol, and waits until the NCP finishes rebooting, or a non-recoverable error occurs.
     *
     * @returns
     * - EzspStatus.SUCCESS
     * - EzspStatus.HOST_FATAL_ERROR
     * - EzspStatus.ASH_NCP_FATAL_ERROR)
     */
    start(): Promise<EzspStatus>;
    /**
     * Stops the ASH protocol - flushes and closes the serial port, clears all queues, stops timers, etc.
     */
    stop(): Promise<void>;
    /**
     * Close port and remove listeners.
     * Does nothing if port not defined/open.
     */
    closePort(): Promise<void>;
    /**
     * Initializes the ASH serial port and (if enabled) resets the NCP.
     * The method used to do the reset is specified by the the host configuration parameter resetMethod.
     *
     * When the reset method is sending a RST frame, the caller should retry NCP resets a few times if it fails.
     *
     * @returns
     * - EzspStatus.SUCCESS
     * - EzspStatus.HOST_FATAL_ERROR
     */
    resetNcp(): Promise<EzspStatus>;
    /**
     * Adds a DATA frame to the transmit queue to send to the NCP.
     * Frames that are too long or too short will not be sent, and frames will not be added to the queue
     * if the host is not in the Connected state, or the NCP is not ready to receive a DATA frame or if there
     * is no room in the queue;
     *
     * @param len    length of data field
     * @param inBuf  array containing the data to be sent
     *
     * @returns
     * - EzspStatus.SUCCESS
     * - EzspStatus.NO_TX_SPACE
     * - EzspStatus.DATA_FRAME_TOO_SHORT
     * - EzspStatus.DATA_FRAME_TOO_LONG
     * - EzspStatus.NOT_CONNECTED
     */
    send(len: number, inBuf: Buffer): EzspStatus;
    /**
     * Manages outgoing communication to the NCP, including DATA frames as well as the frames used for
     * initialization and error detection and recovery.
     */
    sendExec(): void;
    /**
     * Retrieve a frame and accept, reTx, reject, fail based on type & validity in current state.
     * @returns
     * - EzspStatus.SUCCESS On valid RSTACK or valid DATA frame.
     * - EzspStatus.ASH_IN_PROGRESS
     * - EzspStatus.NO_RX_DATA
     * - EzspStatus.NO_RX_SPACE
     * - EzspStatus.HOST_FATAL_ERROR
     * - EzspStatus.ASH_NCP_FATAL_ERROR
     */
    private receiveFrame;
    /**
     * If the last control byte received was a DATA control, and we are connected and not already in the reject condition,
     * then send a NAK and set the reject condition.
     */
    private rejectFrame;
    /**
     * Retrieve and process serial bytes.
     * @returns
     */
    private readFrame;
    /**
     *
     */
    private freeAllocatedRxBuffer;
    /**
     *
     */
    private scrubReTxQueue;
    /**
     * If not already retransmitting, and there are unacked frames, start retransmitting after the last frame that was acked.
     */
    private startRetransmission;
    /**
     * Check free rx buffers to see whether able to receive DATA frames: set or clear NR flag appropriately.
     * Inform ncp of our status using the nFlag in ACKs and NAKs.
     * Note that not ready status must be refreshed if it persists beyond a maximum time limit.
     */
    private dataFrameFlowControl;
    /**
     * Sets a fatal error state at the Host level.
     * @param error
     * @returns EzspStatus.HOST_FATAL_ERROR
     */
    private hostDisconnect;
    /**
     * Sets a fatal error state at the NCP level. Will require a reset.
     * @param error
     * @returns EzspStatus.ASH_NCP_FATAL_ERROR
     */
    private ncpDisconnect;
    /**
     * Same as randomizeArray(0, buffer, len).
     * Returns buffer as-is if randomize is OFF.
     * @param buffer IN/OUT
     * @param len
     */
    randomizeBuffer(buffer: Buffer, len: number): void;
    /**
     * Randomizes array contents by XORing with an 8-bit pseudo random sequence.
     * This reduces the likelihood that byte-stuffing will greatly increase the size of the payload.
     * (This could happen if a DATA frame contained repeated instances of the same reserved byte value.)
     *
     * @param seed  zero initializes the random sequence a non-zero value continues from a previous invocation
     * @param buf IN/OUT pointer to the array whose contents will be randomized
     * @param len  number of bytes in the array to modify
     * @returns  last value of the sequence.
     *           If a buffer is processed in two or more chunks, as with linked buffers,
     *           this value should be passed back as the value of the seed argument
     */
    randomizeArray(seed: number, buf: Buffer, len: number): number;
    /**
     * Get the frame type from the control byte and validate it against the frame length.
     * @param control
     * @param len Frame length
     * @returns AshFrameType.INVALID if bad control/length otherwise the frame type.
     */
    getFrameType(control: number, len: number): AshFrameType;
    /**
     * Encode byte for sending.
     * @param len Start a new frame if non-zero
     * @param byte
     * @returns outByte
     */
    private encodeByte;
    /**
     * Stuff byte as defined by ASH protocol.
     * @param byte
     * @returns
     */
    private encodeStuffByte;
    /**
     * Decode received byte.
     * @param byte
     * @param inByte IN/OUT
     * @param inLen IN/OUT
     * @returns  [EzspStatus, outByte, outLen]
     * - EzspStatus.ASH_IN_PROGRESS
     * - EzspStatus.ASH_COMM_ERROR
     * - EzspStatus.ASH_BAD_CRC
     * - EzspStatus.ASH_TOO_SHORT
     * - EzspStatus.ASH_TOO_LONG
     * - EzspStatus.SUCCESS
     * - EzspStatus.ASH_CANCELLED
     * - EzspStatus.ASH_ERROR_XON_XOFF
     */
    private decodeByte;
    /**
     * Starts the Not Ready timer
     *
     * On the host, this times nFlag refreshing when the host doesn't have room for callbacks for a prolonged period.
     *
     * On the NCP, if this times out the NCP resumes sending callbacks.
     */
    private startNrTimer;
    /**
     * Stop Not Ready timer (set to 0).
     */
    private stopNrTimer;
    /**
     * Tests whether the Not Ready timer has expired or has stopped. If expired, it is stopped.
     *
     * @returns  true if the Not Ready timer has expired or stopped
     */
    private nrTimerHasExpired;
    /**
     * Sets the acknowledgement timer period (in msec) and stops the timer.
     */
    private setAckPeriod;
    /**
     * Sets the acknowledgement timer period (in msec), and starts the timer running.
     */
    private setAndStartAckTimer;
    /**
     * Adapts the acknowledgement timer period to the observed ACK delay.
     * If the timer is not running, it does nothing.
     * If the timer has expired, the timeout period is doubled.
     * If the timer has not expired, the elapsed time is fed into simple
     *
     * IIR filter:
     *          T[n+1] = (7*T[n] + elapsedTime) / 8
     *
     * The timeout period, ackPeriod, is limited such that:
     * config.ackTimeMin <= ackPeriod <= config.ackTimeMax.
     *
     * The acknowledgement timer is always stopped by this function.
     *
     * @param expired true if timer has expired
     */
    private adjustAckPeriod;
    /**
     * Sets ACK Timer to the specified period and starts it running.
     */
    private startAckTimer;
    /**
     * Stops and clears ACK Timer.
     */
    private stopAckTimer;
    /**
     * Indicates whether or not ACK Timer has expired.
     * If the timer is stopped (0) then it is not expired.
     *
     * @returns
     */
    private ackTimerHasExpired;
    /**
     * Indicates whether or not ACK Timer is currently running (!= 0).
     * The timer may be running even if expired.
     */
    private ackTimerIsNotRunning;
    /**
     * Increase counters based on frame type and direction.
     * @param sent True if frame being sent, false if being received.
     */
    private countFrame;
    /**
     * Read and clear ASH layer counters in the same manner as the NCP ones.
     * @returns
     */
    readAndClearCounters(): number[];
    /**
     * Log counters (pretty-formatted) as they are since last time they were cleared.
     * Used on ASH layer stop to get 'pre-stop state'.
     */
    private logCounters;
}
export {};
//# sourceMappingURL=ash.d.ts.map