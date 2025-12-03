"use strict";
/* v8 ignore start */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UartAsh = exports.CONFIG_TX_K = void 0;
const node_events_1 = require("node:events");
const node_net_1 = require("node:net");
const utils_1 = require("../../../utils");
const logger_1 = require("../../../utils/logger");
const serialPort_1 = require("../../serialPort");
const utils_2 = require("../../utils");
const enums_1 = require("../enums");
const math_1 = require("../utils/math");
const consts_1 = require("./consts");
const enums_2 = require("./enums");
const parser_1 = require("./parser");
const queues_1 = require("./queues");
const writer_1 = require("./writer");
const NS = "zh:ember:uart:ash";
/** ASH get rflag in control byte */
// const ashGetRFlag = (ctrl: number): number => (ctrl & ASH_RFLAG_MASK) >> ASH_RFLAG_BIT;
/** ASH get nflag in control byte */
// const ashGetNFlag = (ctrl: number): number => (ctrl & ASH_NFLAG_MASK) >> ASH_NFLAG_BIT;
/** ASH get frmnum in control byte */
const ashGetFrmNum = (ctrl) => (ctrl & consts_1.ASH_FRMNUM_MASK) >> consts_1.ASH_FRMNUM_BIT;
/** ASH get acknum in control byte */
const ashGetACKNum = (ctrl) => (ctrl & consts_1.ASH_ACKNUM_MASK) >> consts_1.ASH_ACKNUM_BIT;
var SendState;
(function (SendState) {
    SendState[SendState["IDLE"] = 0] = "IDLE";
    SendState[SendState["SHFRAME"] = 1] = "SHFRAME";
    SendState[SendState["TX_DATA"] = 2] = "TX_DATA";
    SendState[SendState["RETX_DATA"] = 3] = "RETX_DATA";
})(SendState || (SendState = {}));
// Bits in ashFlags
var Flag;
(function (Flag) {
    /** Reject Condition */
    Flag[Flag["REJ"] = 1] = "REJ";
    /** Retransmit Condition */
    Flag[Flag["RETX"] = 2] = "RETX";
    /** send NAK */
    Flag[Flag["NAK"] = 4] = "NAK";
    /** send ACK */
    Flag[Flag["ACK"] = 8] = "ACK";
    /** send RST */
    Flag[Flag["RST"] = 16] = "RST";
    /** send immediate CAN */
    Flag[Flag["CAN"] = 32] = "CAN";
    /** in CONNECTED state, else ERROR */
    Flag[Flag["CONNECTED"] = 64] = "CONNECTED";
    /** not ready to receive DATA frames */
    Flag[Flag["NR"] = 256] = "NR";
    /** last transmitted NR status */
    Flag[Flag["NRTX"] = 512] = "NRTX";
})(Flag || (Flag = {}));
/** max frames sent without being ACKed (1-7) */
exports.CONFIG_TX_K = 3;
/** enables randomizing DATA frame payloads */
const CONFIG_RANDOMIZE = true;
/** adaptive rec'd ACK timeout initial value */
const CONFIG_ACK_TIME_INIT = 800;
/**  "     "     "     "     " minimum value */
const CONFIG_ACK_TIME_MIN = 400;
/**  "     "     "     "     " maximum value */
const CONFIG_ACK_TIME_MAX = 2400;
/** time allowed to receive RSTACK after ncp is reset */
const CONFIG_TIME_RST = 5000;
/** time between checks for received RSTACK (CONNECTED status) */
const CONFIG_TIME_RST_CHECK = 100;
/** if free buffers < limit, host receiver isn't ready, will hold off the ncp from sending normal priority frames */
const CONFIG_NR_LOW_LIMIT = 8; // RX_FREE_LW
/** if free buffers > limit, host receiver is ready */
const CONFIG_NR_HIGH_LIMIT = 12; // RX_FREE_HW
/** time until a set nFlag must be resent (max 2032) */
const CONFIG_NR_TIME = 480;
/** Read/write max bytes count at stream level */
const CONFIG_HIGHWATER_MARK = 256;
/**
 * ASH Protocol handler.
 */
class UartAsh extends node_events_1.EventEmitter {
    portOptions;
    serialPort;
    socketPort;
    writer;
    parser;
    /** True when serial/socket is currently closing. */
    closing;
    /** time ackTimer started: 0 means not ready uint16_t */
    ackTimer;
    /** time used to check ackTimer expiry (msecs) uint16_t */
    ackPeriod;
    /** not ready timer (16 msec units). Set to (now + config.nrTime) when started. uint8_t */
    nrTimer;
    /** frame decode in progress */
    decodeInProgress;
    // Variables used in encoding frames
    /** true when preceding byte was escaped */
    encodeEscFlag;
    /** byte to send after ASH_ESC uint8_t */
    encodeFlip;
    /** uint16_t */
    encodeCrc;
    /** encoder state: 0 = control/data bytes, 1 = crc low byte, 2 = crc high byte, 3 = flag. uint8_t */
    encodeState;
    /** bytes remaining to encode. uint8_t */
    encodeCount;
    // Variables used in decoding frames
    /** bytes in frame, plus CRC, clamped to limit +1: high values also used to record certain errors. uint8_t */
    decodeLen;
    /** ASH_FLIP if previous byte was ASH_ESC. uint8_t */
    decodeFlip;
    /** a 2 byte queue to avoid outputting crc bytes. uint8_t */
    decodeByte1;
    /** at frame end, they contain the received crc. uint8_t */
    decodeByte2;
    /** uint16_t */
    decodeCrc;
    /** outgoing short frames */
    txSHBuffer;
    /** incoming short frames */
    rxSHBuffer;
    /** bit flags for top-level logic. uint16_t */
    flags;
    /** frame ack'ed from remote peer. uint8_t */
    ackRx;
    /** frame ack'ed to remote peer. uint8_t */
    ackTx;
    /** next frame to be transmitted. uint8_t */
    frmTx;
    /** next frame to be retransmitted. uint8_t */
    frmReTx;
    /** next frame expected to be rec'd. uint8_t */
    frmRx;
    /** frame at retx queue's head. uint8_t */
    frmReTxHead;
    /** consecutive timeout counter. uint8_t */
    timeouts;
    /** rec'd DATA frame buffer. uint8_t */
    rxDataBuffer;
    /** rec'd frame length. uint8_t */
    rxLen;
    /** tx frame offset. uint8_t */
    txOffset;
    counters;
    /**
     * Errors reported by the NCP.
     * The `NcpFailedCode` from the frame reporting this is logged before this is set to make it clear where it failed:
     * - The NCP sent an ERROR frame during the initial reset sequence (before CONNECTED state)
     * - The NCP sent an ERROR frame
     * - The NCP sent an unexpected RSTACK
     */
    ncpError;
    /** Errors reported by the Host. */
    hostError;
    /** sendExec() state variable */
    sendState;
    /** NCP is enabled to sleep, set by EZSP, not supported atm, always false */
    ncpSleepEnabled;
    /**
     * Set when the ncp has indicated it has a pending callback by seting the callback flag in the frame control byte
     * or (uart version only) by sending an an ASH_WAKE byte between frames.
     */
    ncpHasCallbacks;
    /** Transmit buffers */
    txPool;
    txQueue;
    reTxQueue;
    txFree;
    /** Receive buffers */
    rxPool;
    rxQueue;
    rxFree;
    constructor(options) {
        super();
        this.portOptions = options;
        this.serialPort = undefined;
        this.socketPort = undefined;
        this.writer = new writer_1.AshWriter({ highWaterMark: CONFIG_HIGHWATER_MARK });
        this.parser = new parser_1.AshParser({ readableHighWaterMark: CONFIG_HIGHWATER_MARK });
        this.txPool = new Array(consts_1.TX_POOL_BUFFERS);
        this.txQueue = new queues_1.EzspQueue();
        this.reTxQueue = new queues_1.EzspQueue();
        this.txFree = new queues_1.EzspFreeList();
        this.rxPool = new Array(consts_1.EZSP_HOST_RX_POOL_SIZE);
        this.rxQueue = new queues_1.EzspQueue();
        this.rxFree = new queues_1.EzspFreeList();
        this.closing = false;
        this.txSHBuffer = Buffer.alloc(consts_1.SH_TX_BUFFER_LEN);
        this.rxSHBuffer = Buffer.alloc(consts_1.SH_RX_BUFFER_LEN);
        this.ackTimer = 0;
        this.ackPeriod = 0;
        this.nrTimer = 0;
        this.flags = 0;
        this.decodeInProgress = false;
        this.ackRx = 0;
        this.ackTx = 0;
        this.frmTx = 0;
        this.frmReTx = 0;
        this.frmRx = 0;
        this.frmReTxHead = 0;
        this.timeouts = 0;
        this.rxDataBuffer = undefined;
        this.rxLen = 0;
        // init to "start of frame" default
        this.encodeCount = 0;
        this.encodeState = 0;
        this.encodeEscFlag = false;
        this.encodeFlip = 0;
        this.encodeCrc = 0xffff;
        this.txOffset = 0;
        // init to "start of frame" default
        this.decodeLen = 0;
        this.decodeByte1 = 0;
        this.decodeByte2 = 0;
        this.decodeFlip = 0;
        this.decodeCrc = 0xffff;
        this.ncpError = enums_1.EzspStatus.NO_ERROR;
        this.hostError = enums_1.EzspStatus.NO_ERROR;
        this.sendState = SendState.IDLE;
        this.ncpSleepEnabled = false;
        this.ncpHasCallbacks = false;
        this.stopAckTimer();
        this.stopNrTimer();
        this.counters = {
            txData: 0,
            txAllFrames: 0,
            txDataFrames: 0,
            txAckFrames: 0,
            txNakFrames: 0,
            txReDataFrames: 0,
            // txN0Frames: 0,
            txN1Frames: 0,
            txCancelled: 0,
            rxData: 0,
            rxAllFrames: 0,
            rxDataFrames: 0,
            rxAckFrames: 0,
            rxNakFrames: 0,
            rxReDataFrames: 0,
            // rxN0Frames: 0,
            rxN1Frames: 0,
            rxCancelled: 0,
            rxCrcErrors: 0,
            rxCommErrors: 0,
            rxTooShort: 0,
            rxTooLong: 0,
            rxBadControl: 0,
            rxBadLength: 0,
            rxBadAckNumber: 0,
            rxNoBuffer: 0,
            rxDuplicates: 0,
            rxOutOfSequence: 0,
            rxAckTimeouts: 0,
        };
        // All transmit buffers are put into txFree, and txQueue and reTxQueue are empty.
        this.txQueue.tail = undefined;
        this.reTxQueue.tail = undefined;
        this.txFree.link = undefined;
        for (let i = 0; i < consts_1.TX_POOL_BUFFERS; i++) {
            this.txPool[i] = new queues_1.EzspBuffer();
            this.txFree.freeBuffer(this.txPool[i]);
        }
        // All receive buffers are put into rxFree, and rxQueue is empty.
        this.rxQueue.tail = undefined;
        this.rxFree.link = undefined;
        for (let i = 0; i < consts_1.EZSP_HOST_RX_POOL_SIZE; i++) {
            this.rxPool[i] = new queues_1.EzspBuffer();
            this.rxFree.freeBuffer(this.rxPool[i]);
        }
    }
    /**
     * Check if port is valid, open, and not closing.
     */
    get portOpen() {
        if (this.closing) {
            return false;
        }
        // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
        if ((0, utils_2.isTcpPath)(this.portOptions.path)) {
            return this.socketPort ? !this.socketPort.closed : false;
        }
        return this.serialPort ? this.serialPort.isOpen : false;
    }
    /**
     * Get max wait time before response is considered timed out.
     */
    get responseTimeout() {
        return consts_1.ASH_MAX_TIMEOUTS * CONFIG_ACK_TIME_MAX;
    }
    /**
     * Indicates if the host is in the Connected state.
     * If not, the host and NCP cannot exchange DATA frames.
     * Note that this function does not actively confirm that communication with NCP is healthy, but simply returns its last known status.
     *
     * @returns
     * - true  - host and NCP can exchange DATA frames
     * - false - host and NCP cannot now exchange DATA frames
     */
    get connected() {
        return (this.flags & Flag.CONNECTED) !== 0;
    }
    /**
     * Has nothing to do...
     */
    get idle() {
        return (!this.decodeInProgress && // don't have a partial frame
            // && (this.serial.readAvailable() === EzspStatus.NO_RX_DATA) // no rx data
            this.rxQueue.empty && // no rx frames to process
            !this.ncpHasCallbacks && // no pending callbacks
            this.flags === Flag.CONNECTED && // no pending ACKs, NAKs, etc.
            this.ackTx === this.frmRx && // do not need to send an ACK
            this.ackRx === this.frmTx && // not waiting to receive an ACK
            this.sendState === SendState.IDLE && // nothing being transmitted now
            this.txQueue.empty // nothing waiting to transmit
        // && this.serial.outputIsIdle()          // nothing in OS buffers or UART FIFO
        );
    }
    /**
     * Init the serial or socket port and hook parser/writer.
     * NOTE: This is the only function that throws/rejects in the ASH layer (caught by resetNcp and turned into an EzspStatus).
     */
    async initPort() {
        await this.closePort(); // will do nothing if nothing's open
        // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
        if (!(0, utils_2.isTcpPath)(this.portOptions.path)) {
            const serialOpts = {
                // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                path: this.portOptions.path,
                baudRate: typeof this.portOptions.baudRate === "number" ? this.portOptions.baudRate : 115200,
                rtscts: typeof this.portOptions.rtscts === "boolean" ? this.portOptions.rtscts : false,
                autoOpen: false,
                parity: "none",
                stopBits: 1,
                xon: false,
                xoff: false,
            };
            // enable software flow control if RTS/CTS not enabled in config
            if (!serialOpts.rtscts) {
                logger_1.logger.info("RTS/CTS config is off, enabling software flow control.", NS);
                serialOpts.xon = true;
                serialOpts.xoff = true;
            }
            // @ts-expect-error Jest testing
            if (this.portOptions.binding !== undefined) {
                // @ts-expect-error Jest testing
                serialOpts.binding = this.portOptions.binding;
            }
            logger_1.logger.debug(() => `Opening serial port with ${JSON.stringify(serialOpts)}`, NS);
            this.serialPort = new serialPort_1.SerialPort(serialOpts);
            this.writer.pipe(this.serialPort);
            this.serialPort.pipe(this.parser);
            this.parser.on("data", this.onFrame.bind(this));
            try {
                await this.serialPort.asyncOpen();
                logger_1.logger.info("Serial port opened", NS);
                this.serialPort.once("close", this.onPortClose.bind(this));
                this.serialPort.on("error", this.onPortError.bind(this));
            }
            catch (error) {
                await this.stop();
                throw error;
            }
        }
        else {
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            const info = (0, utils_2.parseTcpPath)(this.portOptions.path);
            logger_1.logger.debug(`Opening TCP socket with ${info.host}:${info.port}`, NS);
            this.socketPort = new node_net_1.Socket();
            this.socketPort.setNoDelay(true);
            this.socketPort.setKeepAlive(true, 15000);
            this.writer.pipe(this.socketPort);
            this.socketPort.pipe(this.parser);
            this.parser.on("data", this.onFrame.bind(this));
            return await new Promise((resolve, reject) => {
                const openError = async (err) => {
                    await this.stop();
                    reject(err);
                };
                // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                this.socketPort.on("connect", () => {
                    logger_1.logger.debug("Socket connected", NS);
                });
                // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                this.socketPort.on("ready", () => {
                    logger_1.logger.info("Socket ready", NS);
                    // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                    this.socketPort.removeListener("error", openError);
                    // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                    this.socketPort.once("close", this.onPortClose.bind(this));
                    // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                    this.socketPort.on("error", this.onPortError.bind(this));
                    resolve();
                });
                // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                this.socketPort.once("error", openError);
                // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                this.socketPort.connect(info.port, info.host);
            });
        }
    }
    /**
     * Handle port closing
     * @param err A boolean for Socket, an Error for serialport
     */
    onPortClose(error) {
        logger_1.logger.info(`Port closed, error=${error}`, NS);
        if (this.flags !== 0) {
            this.flags = 0;
            this.emit("fatalError", enums_1.EzspStatus.ERROR_SERIAL_INIT);
        }
    }
    /**
     * Handle port error
     * @param error
     */
    onPortError(error) {
        logger_1.logger.error(`Port ${error}`, NS);
    }
    /**
     * Handle received frame from AshParser.
     * @param buf
     */
    onFrame(buffer) {
        const iCAN = buffer.lastIndexOf(enums_2.AshReservedByte.CANCEL); // should only be one, but just in case...
        if (iCAN !== -1) {
            // ignore the cancel before RSTACK
            if (this.flags & Flag.CONNECTED) {
                this.counters.rxCancelled += 1;
                logger_1.logger.warning(`Frame(s) in progress cancelled in [${buffer.toString("hex")}]`, NS);
            }
            // get rid of everything up to the CAN flag and start reading frame from there, no need to loop through bytes in vain
            buffer = buffer.subarray(iCAN + 1);
        }
        if (!buffer.length) {
            // skip any CANCEL that results in empty frame (have yet to see one, but just in case...)
            // shouldn't happen for any other reason, unless receiving bad stuff from port?
            logger_1.logger.debug("Received empty frame. Skipping.", NS);
            return;
        }
        const status = this.receiveFrame(buffer);
        this.sendExec(); // always trigger to cover all cases
        if (status !== enums_1.EzspStatus.SUCCESS && status !== enums_1.EzspStatus.ASH_IN_PROGRESS && status !== enums_1.EzspStatus.NO_RX_DATA) {
            logger_1.logger.error(`Error while parsing received frame, status=${enums_1.EzspStatus[status]}.`, NS);
            this.emit("fatalError", enums_1.EzspStatus.HOST_FATAL_ERROR);
            return;
        }
    }
    /**
     * Initializes the ASH protocol, and waits until the NCP finishes rebooting, or a non-recoverable error occurs.
     *
     * @returns
     * - EzspStatus.SUCCESS
     * - EzspStatus.HOST_FATAL_ERROR
     * - EzspStatus.ASH_NCP_FATAL_ERROR)
     */
    async start() {
        if (!this.portOpen || this.flags & Flag.CONNECTED) {
            return enums_1.EzspStatus.ERROR_INVALID_CALL;
        }
        logger_1.logger.info("======== ASH starting ========", NS);
        try {
            if (this.serialPort) {
                await this.serialPort.asyncFlush(); // clear read/write buffers
            }
            else {
                // XXX: Socket equiv?
            }
        }
        catch (err) {
            logger_1.logger.error(`Error while flushing before start: ${err}`, NS);
        }
        // block til RSTACK, fatal error or timeout
        // NOTE: on average, this seems to take around 1000ms when successful
        for (let i = 0; i < CONFIG_TIME_RST; i += CONFIG_TIME_RST_CHECK) {
            this.sendExec();
            if (this.flags & Flag.CONNECTED) {
                logger_1.logger.info("======== ASH started ========", NS);
                return enums_1.EzspStatus.SUCCESS;
            }
            if (this.hostError !== enums_1.EzspStatus.NO_ERROR || this.ncpError !== enums_1.EzspStatus.NO_ERROR) {
                // don't wait for inevitable fail, bail early, let retry logic in EZSP layer do its thing
                break;
            }
            logger_1.logger.debug(`Waiting for RSTACK... ${i}/${CONFIG_TIME_RST}`, NS);
            await (0, utils_1.wait)(CONFIG_TIME_RST_CHECK);
        }
        return enums_1.EzspStatus.HOST_FATAL_ERROR;
    }
    /**
     * Stops the ASH protocol - flushes and closes the serial port, clears all queues, stops timers, etc.
     */
    async stop() {
        this.closing = true;
        this.logCounters();
        await this.closePort();
        logger_1.logger.info("======== ASH stopped ========", NS);
    }
    /**
     * Close port and remove listeners.
     * Does nothing if port not defined/open.
     */
    async closePort() {
        this.flags = 0;
        if (this.serialPort?.isOpen) {
            try {
                await this.serialPort.asyncFlushAndClose();
            }
            catch (err) {
                logger_1.logger.error(`Failed to close serial port ${err}.`, NS);
            }
            this.serialPort.removeAllListeners();
        }
        else if (this.socketPort != null && !this.socketPort.closed) {
            this.socketPort.destroy();
            this.socketPort.removeAllListeners();
        }
    }
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
    async resetNcp() {
        if (this.closing) {
            return enums_1.EzspStatus.ERROR_INVALID_CALL;
        }
        logger_1.logger.info("======== ASH Adapter reset ========", NS);
        // ask ncp to reset itself using RST frame
        try {
            if (!this.portOpen) {
                await this.initPort();
            }
            this.flags = Flag.RST | Flag.CAN;
            return enums_1.EzspStatus.SUCCESS;
        }
        catch (err) {
            logger_1.logger.error(`Failed to init port with error ${err}`, NS);
            this.hostError = enums_1.EzspStatus.HOST_FATAL_ERROR;
            return this.hostError;
        }
    }
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
    send(len, inBuf) {
        // Check for errors that might have been detected
        if (this.hostError !== enums_1.EzspStatus.NO_ERROR) {
            return enums_1.EzspStatus.HOST_FATAL_ERROR;
        }
        if (this.ncpError !== enums_1.EzspStatus.NO_ERROR) {
            return enums_1.EzspStatus.ASH_NCP_FATAL_ERROR;
        }
        // After verifying that the data field length is within bounds,
        // copies data frame to a buffer and appends it to the transmit queue.
        if (len < consts_1.ASH_MIN_DATA_FIELD_LEN) {
            return enums_1.EzspStatus.DATA_FRAME_TOO_SHORT;
        }
        if (len > consts_1.ASH_MAX_DATA_FIELD_LEN) {
            return enums_1.EzspStatus.DATA_FRAME_TOO_LONG;
        }
        if (!(this.flags & Flag.CONNECTED)) {
            return enums_1.EzspStatus.NOT_CONNECTED;
        }
        const buffer = this.txFree.allocBuffer();
        if (buffer === undefined) {
            return enums_1.EzspStatus.NO_TX_SPACE;
        }
        inBuf.copy(buffer.data, 0, 0, len);
        buffer.len = len;
        this.randomizeBuffer(buffer.data, buffer.len); // IN/OUT data
        this.txQueue.addTail(buffer);
        this.sendExec();
        return enums_1.EzspStatus.SUCCESS;
    }
    /**
     * Manages outgoing communication to the NCP, including DATA frames as well as the frames used for
     * initialization and error detection and recovery.
     */
    sendExec() {
        let outByte = 0x00;
        let inByte = 0x00;
        let len = 0;
        let buffer;
        // Check for received acknowledgement timer expiry
        if (this.ackTimerHasExpired()) {
            if (this.flags & Flag.CONNECTED) {
                const reTx = this.flags & Flag.RETX;
                const expectedFrm = reTx ? this.frmReTx : this.frmTx;
                if (this.ackRx !== expectedFrm) {
                    this.counters.rxAckTimeouts += 1;
                    this.adjustAckPeriod(true);
                    logger_1.logger.debug(`Timer expired waiting for ACK for ${reTx ? "frmReTx" : "frmTx"}=${expectedFrm}, ackRx=${this.ackRx}`, NS);
                    if (++this.timeouts >= consts_1.ASH_MAX_TIMEOUTS) {
                        this.hostDisconnect(enums_1.EzspStatus.ASH_ERROR_TIMEOUTS);
                        return;
                    }
                    this.startRetransmission();
                }
                else {
                    this.stopAckTimer();
                }
            } /* else {
                this.hostDisconnect(EzspStatus.ASH_ERROR_RESET_FAIL);
            }*/
            // let Ezsp layer retry logic handle timeout
        }
        while (this.writer.writeAvailable()) {
            // Send ASH_CAN character immediately, ahead of any other transmit data
            if (this.flags & Flag.CAN) {
                if (this.sendState === SendState.IDLE) {
                    // sending RST or just woke NCP
                    this.writer.writeByte(enums_2.AshReservedByte.CANCEL);
                }
                else if (this.sendState === SendState.TX_DATA) {
                    // cancel frame in progress
                    this.counters.txCancelled += 1;
                    this.writer.writeByte(enums_2.AshReservedByte.CANCEL);
                    this.stopAckTimer();
                    this.sendState = SendState.IDLE;
                }
                this.flags &= ~Flag.CAN;
                continue;
            }
            switch (this.sendState) {
                case SendState.IDLE: {
                    // In between frames - do some housekeeping and decide what to send next
                    // If retransmitting, set the next frame to send to the last ackNum
                    // received, then check to see if retransmission is now complete.
                    if (this.flags & Flag.RETX) {
                        if ((0, math_1.withinRange)(this.frmReTx, this.ackRx, this.frmTx)) {
                            this.frmReTx = this.ackRx;
                        }
                        if (this.frmReTx === this.frmTx) {
                            this.flags &= ~Flag.RETX;
                            this.scrubReTxQueue();
                        }
                    }
                    // restrain ncp if needed
                    this.dataFrameFlowControl();
                    // See if a short frame is flagged to be sent
                    // The order of the tests below - RST, NAK and ACK -
                    // sets the relative priority of sending these frame types.
                    if (this.flags & Flag.RST) {
                        this.txSHBuffer[0] = enums_2.AshFrameType.RST;
                        this.setAndStartAckTimer(CONFIG_TIME_RST);
                        len = 1;
                        this.flags &= ~(Flag.RST | Flag.NAK | Flag.ACK);
                        this.sendState = SendState.SHFRAME;
                        logger_1.logger.debug("---> [FRAME type=RST]", NS);
                    }
                    else if (this.flags & (Flag.NAK | Flag.ACK)) {
                        if (this.flags & Flag.NAK) {
                            this.txSHBuffer[0] = enums_2.AshFrameType.NAK + (this.frmRx << consts_1.ASH_ACKNUM_BIT);
                            this.flags &= ~(Flag.NRTX | Flag.NAK | Flag.ACK);
                            logger_1.logger.debug(`---> [FRAME type=NAK frmRx=${this.frmRx}](ackRx=${this.ackRx})`, NS);
                        }
                        else {
                            this.txSHBuffer[0] = enums_2.AshFrameType.ACK + (this.frmRx << consts_1.ASH_ACKNUM_BIT);
                            this.flags &= ~(Flag.NRTX | Flag.ACK);
                            logger_1.logger.debug(`---> [FRAME type=ACK frmRx=${this.frmRx}](ackRx=${this.ackRx})`, NS);
                        }
                        if (this.flags & Flag.NR) {
                            this.txSHBuffer[0] |= consts_1.ASH_NFLAG_MASK;
                            this.flags |= Flag.NRTX;
                            this.startNrTimer();
                        }
                        this.ackTx = this.frmRx;
                        len = 1;
                        this.sendState = SendState.SHFRAME;
                    }
                    else if (this.flags & Flag.RETX) {
                        // Retransmitting DATA frames for error recovery
                        // buffer assumed valid from loop logic
                        // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                        buffer = this.reTxQueue.getNthEntry((0, math_1.mod8)(this.frmTx - this.frmReTx));
                        len = buffer.len + 1;
                        this.txSHBuffer[0] = enums_2.AshFrameType.DATA | (this.frmReTx << consts_1.ASH_FRMNUM_BIT) | (this.frmRx << consts_1.ASH_ACKNUM_BIT) | consts_1.ASH_RFLAG_MASK;
                        this.sendState = SendState.RETX_DATA;
                        logger_1.logger.debug(`---> [FRAME type=DATA_RETX frmReTx=${this.frmReTx} frmRx=${this.frmRx}](ackRx=${this.ackRx} frmTx=${this.frmTx})`, NS);
                    }
                    else if (this.ackTx !== this.frmRx) {
                        // An ACK should be generated
                        this.flags |= Flag.ACK;
                        break;
                    }
                    else if (!this.txQueue.empty && (0, math_1.withinRange)(this.ackRx, this.frmTx, this.ackRx + exports.CONFIG_TX_K - 1)) {
                        // Send a DATA frame if ready
                        buffer = this.txQueue.head;
                        len = buffer.len + 1;
                        this.counters.txData += len - 1;
                        this.txSHBuffer[0] = enums_2.AshFrameType.DATA | (this.frmTx << consts_1.ASH_FRMNUM_BIT) | (this.frmRx << consts_1.ASH_ACKNUM_BIT);
                        this.sendState = SendState.TX_DATA;
                        logger_1.logger.debug(`---> [FRAME type=DATA frmTx=${this.frmTx} frmRx=${this.frmRx}](ackRx=${this.ackRx})`, NS);
                    }
                    else {
                        // Otherwise there's nothing to send
                        this.writer.writeFlush();
                        return;
                    }
                    this.countFrame(true);
                    // Start frame - encodeByte() is inited by a non-zero length argument
                    outByte = this.encodeByte(len, this.txSHBuffer[0]);
                    this.writer.writeByte(outByte);
                    break;
                }
                case SendState.SHFRAME: {
                    // sending short frame
                    if (this.txOffset !== 0xff) {
                        inByte = this.txSHBuffer[this.txOffset];
                        outByte = this.encodeByte(0, inByte);
                        this.writer.writeByte(outByte);
                    }
                    else {
                        this.sendState = SendState.IDLE;
                    }
                    break;
                }
                case SendState.TX_DATA:
                case SendState.RETX_DATA: {
                    // sending OR resending data frame
                    if (this.txOffset !== 0xff) {
                        // buffer assumed valid from loop logic
                        // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                        inByte = this.txOffset ? buffer.data[this.txOffset - 1] : this.txSHBuffer[0];
                        outByte = this.encodeByte(0, inByte);
                        this.writer.writeByte(outByte);
                    }
                    else {
                        if (this.sendState === SendState.TX_DATA) {
                            this.frmTx = (0, math_1.inc8)(this.frmTx);
                            buffer = this.txQueue.removeHead();
                            this.reTxQueue.addTail(buffer);
                        }
                        else {
                            this.frmReTx = (0, math_1.inc8)(this.frmReTx);
                        }
                        if (this.ackTimerIsNotRunning()) {
                            this.startAckTimer();
                        }
                        this.ackTx = this.frmRx;
                        this.sendState = SendState.IDLE;
                    }
                    break;
                }
            }
        }
        this.writer.writeFlush();
    }
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
    receiveFrame(buffer) {
        // Check for errors that might have been detected
        if (this.hostError !== enums_1.EzspStatus.NO_ERROR) {
            return enums_1.EzspStatus.HOST_FATAL_ERROR;
        }
        if (this.ncpError !== enums_1.EzspStatus.NO_ERROR) {
            return enums_1.EzspStatus.ASH_NCP_FATAL_ERROR;
        }
        let ackNum = 0;
        let frmNum = 0;
        let frameType = enums_2.AshFrameType.INVALID;
        // Read data from serial port and assemble a frame until complete, aborted
        // due to an error, cancelled, or there is no more serial data available.
        const status = this.readFrame(buffer);
        switch (status) {
            case enums_1.EzspStatus.SUCCESS:
                break;
            case enums_1.EzspStatus.ASH_IN_PROGRESS:
                // should have a complete frame by now, if not, don't process further
                return enums_1.EzspStatus.NO_RX_DATA;
            case enums_1.EzspStatus.ASH_CANCELLED:
                // should have been taken out in onFrame
                return this.hostDisconnect(status);
            case enums_1.EzspStatus.ASH_BAD_CRC:
                this.counters.rxCrcErrors += 1;
                this.rejectFrame();
                logger_1.logger.error("Received frame with CRC error", NS);
                return enums_1.EzspStatus.NO_RX_DATA;
            case enums_1.EzspStatus.ASH_COMM_ERROR:
                this.counters.rxCommErrors += 1;
                this.rejectFrame();
                logger_1.logger.error("Received frame with comm error", NS);
                return enums_1.EzspStatus.NO_RX_DATA;
            case enums_1.EzspStatus.ASH_TOO_SHORT:
                this.counters.rxTooShort += 1;
                this.rejectFrame();
                logger_1.logger.error("Received frame shorter than minimum", NS);
                return enums_1.EzspStatus.NO_RX_DATA;
            case enums_1.EzspStatus.ASH_TOO_LONG:
                this.counters.rxTooLong += 1;
                this.rejectFrame();
                logger_1.logger.error("Received frame longer than maximum", NS);
                return enums_1.EzspStatus.NO_RX_DATA;
            case enums_1.EzspStatus.ASH_ERROR_XON_XOFF:
                return this.hostDisconnect(status);
            default:
                logger_1.logger.error(`Unhandled error while receiving frame, status=${enums_1.EzspStatus[status]}.`, NS);
                return this.hostDisconnect(enums_1.EzspStatus.HOST_FATAL_ERROR);
        }
        // Got a complete frame - validate its control and length.
        // On an error the type returned will be TYPE_INVALID.
        frameType = this.getFrameType(this.rxSHBuffer[0], this.rxLen);
        // Free buffer allocated for a received frame if:
        //    DATA frame, and out of order
        //    DATA frame, and not in the CONNECTED state
        //    not a DATA frame
        if (frameType === enums_2.AshFrameType.DATA) {
            if (!(this.flags & Flag.CONNECTED) || ashGetFrmNum(this.rxSHBuffer[0]) !== this.frmRx) {
                this.freeAllocatedRxBuffer();
            }
        }
        else {
            this.freeAllocatedRxBuffer();
        }
        const frameTypeStr = enums_2.AshFrameType[frameType];
        logger_1.logger.debug(`<--- [FRAME type=${frameTypeStr}]`, NS);
        this.countFrame(false);
        // Process frames received while not in the connected state -
        // ignore everything except RSTACK and ERROR frames
        if (!(this.flags & Flag.CONNECTED)) {
            if (frameType === enums_2.AshFrameType.RSTACK) {
                // RSTACK frames have the ncp ASH version in the first data field byte,
                // and the reset reason in the second byte
                if (this.rxSHBuffer[1] !== consts_1.ASH_VERSION) {
                    return this.hostDisconnect(enums_1.EzspStatus.ASH_ERROR_VERSION);
                }
                // Ignore a RSTACK if the reset reason doesn't match our reset method
                if (this.rxSHBuffer[2] !== enums_2.NcpFailedCode.RESET_SOFTWARE) {
                    return enums_1.EzspStatus.ASH_IN_PROGRESS;
                }
                this.ncpError = enums_1.EzspStatus.NO_ERROR;
                this.stopAckTimer();
                this.timeouts = 0;
                this.setAckPeriod(CONFIG_ACK_TIME_INIT);
                this.flags = Flag.CONNECTED | Flag.ACK;
                logger_1.logger.info("======== ASH connected ========", NS);
                return enums_1.EzspStatus.SUCCESS;
            }
            if (frameType === enums_2.AshFrameType.ERROR) {
                logger_1.logger.error(`Received ERROR from adapter while connecting, with code=${enums_2.NcpFailedCode[this.rxSHBuffer[2]]}.`, NS);
                // let Ezsp retry logic handle error
                // return this.ncpDisconnect(EzspStatus.ASH_NCP_FATAL_ERROR);
            }
            return enums_1.EzspStatus.ASH_IN_PROGRESS;
        }
        // Connected - process the ackNum in ACK, NAK and DATA frames
        if (frameType === enums_2.AshFrameType.DATA || frameType === enums_2.AshFrameType.ACK || frameType === enums_2.AshFrameType.NAK) {
            ackNum = ashGetACKNum(this.rxSHBuffer[0]);
            logger_1.logger.debug(`<--- [FRAME type=${frameTypeStr} ackNum=${ackNum}](ackRx=${this.ackRx} frmTx=${this.frmTx})`, NS);
            if (!(0, math_1.withinRange)(this.ackRx, ackNum, this.frmTx)) {
                this.counters.rxBadAckNumber += 1;
                logger_1.logger.debug(`<-x- [FRAME type=${frameTypeStr} ackNum=${ackNum}] Invalid ACK num; not within <${this.ackRx}-${this.frmTx}>`, NS);
                frameType = enums_2.AshFrameType.INVALID;
            }
            else if (ackNum !== this.ackRx) {
                // new frame(s) ACK'ed?
                this.ackRx = ackNum;
                this.timeouts = 0;
                if (this.flags & Flag.RETX) {
                    // start timer if unACK'ed frames
                    this.stopAckTimer();
                    if (ackNum !== this.frmReTx) {
                        this.startAckTimer();
                    }
                }
                else {
                    this.adjustAckPeriod(false); // factor ACK time into period
                    if (ackNum !== this.frmTx) {
                        // if more unACK'ed frames,
                        this.startAckTimer(); // then restart ACK timer
                    }
                    this.scrubReTxQueue(); // free buffer(s) in ReTx queue
                }
            }
        }
        // Process frames received while connected
        switch (frameType) {
            case enums_2.AshFrameType.DATA: {
                frmNum = ashGetFrmNum(this.rxSHBuffer[0]);
                const frameStr = `[FRAME type=${frameTypeStr} ackNum=${ackNum} frmNum=${frmNum}](frmRx=${this.frmRx})`;
                if (frmNum === this.frmRx) {
                    // is frame in sequence?
                    if (this.rxDataBuffer == null) {
                        // valid frame but no memory?
                        this.counters.rxNoBuffer += 1;
                        logger_1.logger.debug(`<-x- ${frameStr} No buffer available`, NS);
                        this.rejectFrame();
                        return enums_1.EzspStatus.NO_RX_SPACE;
                    }
                    if (this.rxSHBuffer[0] & consts_1.ASH_RFLAG_MASK) {
                        // if retransmitted, force ACK
                        this.flags |= Flag.ACK;
                    }
                    this.flags &= ~(Flag.REJ | Flag.NAK); // clear the REJ condition
                    this.frmRx = (0, math_1.inc8)(this.frmRx);
                    this.randomizeBuffer(this.rxDataBuffer.data, this.rxDataBuffer.len); // IN/OUT data
                    this.rxQueue.addTail(this.rxDataBuffer); // add frame to receive queue
                    logger_1.logger.debug(`<--- ${frameStr} Added to rxQueue`, NS);
                    this.counters.rxData += this.rxDataBuffer.len;
                    setImmediate(() => this.emit("frame"));
                    return enums_1.EzspStatus.SUCCESS;
                }
                // frame is out of sequence
                if (this.rxSHBuffer[0] & consts_1.ASH_RFLAG_MASK) {
                    // if retransmitted, force ACK
                    this.counters.rxDuplicates += 1;
                    this.flags |= Flag.ACK;
                }
                else {
                    // 1st OOS? then set REJ, send NAK
                    if ((this.flags & Flag.REJ) === 0) {
                        this.counters.rxOutOfSequence += 1;
                        logger_1.logger.debug(`<-x- ${frameStr} Out of sequence: expected ${this.frmRx}; got ${frmNum}.`, NS);
                    }
                    this.rejectFrame();
                }
                break;
            }
            case enums_2.AshFrameType.ACK:
                // already fully processed
                break;
            case enums_2.AshFrameType.NAK:
                // start retransmission if needed
                this.startRetransmission();
                break;
            case enums_2.AshFrameType.RSTACK:
                // unexpected ncp reset
                logger_1.logger.error(`Received unexpected reset from adapter, with reason=${enums_2.NcpFailedCode[this.rxSHBuffer[2]]}.`, NS);
                this.ncpError = enums_1.EzspStatus.ASH_NCP_FATAL_ERROR;
                return this.hostDisconnect(enums_1.EzspStatus.ASH_ERROR_NCP_RESET);
            case enums_2.AshFrameType.ERROR:
                // ncp error
                logger_1.logger.error(`Received ERROR from adapter, with code=${enums_2.NcpFailedCode[this.rxSHBuffer[2]]}.`, NS);
                return this.ncpDisconnect(enums_1.EzspStatus.ASH_NCP_FATAL_ERROR);
            case enums_2.AshFrameType.INVALID:
                // reject invalid frames
                logger_1.logger.debug(`<-x- [FRAME type=${frameTypeStr}] Rejecting. ${this.rxSHBuffer.toString("hex")}`, NS);
                this.rejectFrame();
                break;
        }
        return enums_1.EzspStatus.ASH_IN_PROGRESS;
    }
    /**
     * If the last control byte received was a DATA control, and we are connected and not already in the reject condition,
     * then send a NAK and set the reject condition.
     */
    rejectFrame() {
        if ((this.rxSHBuffer[0] & consts_1.ASH_DFRAME_MASK) === enums_2.AshFrameType.DATA && (this.flags & (Flag.REJ | Flag.CONNECTED)) === Flag.CONNECTED) {
            this.flags |= Flag.REJ | Flag.NAK;
        }
    }
    /**
     * Retrieve and process serial bytes.
     * @returns
     */
    readFrame(buffer) {
        let status = enums_1.EzspStatus.ERROR_INVALID_CALL; // no actual data to read, something's very wrong
        let index = 0;
        // let inByte: number = 0x00;
        let outByte = 0x00;
        if (!this.decodeInProgress) {
            this.rxLen = 0;
            this.rxDataBuffer = undefined;
        }
        for (const inByte of buffer) {
            // 0xFF byte signals a callback is pending when between frames in synchronous (polled) callback mode.
            if (!this.decodeInProgress && inByte === consts_1.ASH_WAKE) {
                if (this.ncpSleepEnabled) {
                    this.ncpHasCallbacks = true;
                }
                status = enums_1.EzspStatus.ASH_IN_PROGRESS;
                continue;
            }
            // Decode next input byte - note that many input bytes do not produce
            // an output byte. Return on any error in decoding.
            index = this.rxLen;
            [status, outByte, this.rxLen] = this.decodeByte(inByte, outByte, this.rxLen);
            // discard an invalid frame
            if (status !== enums_1.EzspStatus.ASH_IN_PROGRESS && status !== enums_1.EzspStatus.SUCCESS) {
                this.freeAllocatedRxBuffer();
                break;
            }
            // if input byte produced an output byte
            if (this.rxLen !== index) {
                if (this.rxLen <= consts_1.SH_RX_BUFFER_LEN) {
                    // if a short frame, return in rxBuffer
                    this.rxSHBuffer[index] = outByte;
                }
                else {
                    // if a longer DATA frame, allocate an EzspBuffer for it.
                    // (Note the control byte is always returned in shRxBuffer[0].
                    // Even if no buffer can be allocated, the control's ackNum must be processed.)
                    if (this.rxLen === consts_1.SH_RX_BUFFER_LEN + 1) {
                        // alloc buffer, copy prior data
                        this.rxDataBuffer = this.rxFree.allocBuffer();
                        if (this.rxDataBuffer !== undefined) {
                            // const len = SH_RX_BUFFER_LEN - 1;
                            // (void) memcpy(this.rxDataBuffer.data, this.shRxBuffer + 1, SH_RX_BUFFER_LEN - 1);
                            this.rxSHBuffer.copy(this.rxDataBuffer.data, 0, 1, consts_1.SH_RX_BUFFER_LEN);
                            this.rxDataBuffer.len = consts_1.SH_RX_BUFFER_LEN - 1;
                        }
                    }
                    if (this.rxDataBuffer !== undefined) {
                        // copy next byte to buffer
                        this.rxDataBuffer.data[index - 1] = outByte; // -1 since control is omitted
                        this.rxDataBuffer.len = index;
                    }
                }
            }
            if (status !== enums_1.EzspStatus.ASH_IN_PROGRESS) {
                break;
            }
        }
        return status;
    }
    /**
     *
     */
    freeAllocatedRxBuffer() {
        if (this.rxDataBuffer !== undefined) {
            this.rxFree.freeBuffer(this.rxDataBuffer);
            this.rxDataBuffer = undefined;
        }
    }
    /**
     *
     */
    scrubReTxQueue() {
        let buffer;
        while (this.ackRx !== this.frmReTxHead) {
            buffer = this.reTxQueue.removeHead();
            this.txFree.freeBuffer(buffer);
            this.frmReTxHead = (0, math_1.inc8)(this.frmReTxHead);
        }
    }
    /**
     * If not already retransmitting, and there are unacked frames, start retransmitting after the last frame that was acked.
     */
    startRetransmission() {
        if (!(this.flags & Flag.RETX) && this.ackRx !== this.frmTx) {
            this.stopAckTimer();
            this.frmReTx = this.ackRx;
            this.flags |= Flag.RETX | Flag.CAN;
        }
    }
    /**
     * Check free rx buffers to see whether able to receive DATA frames: set or clear NR flag appropriately.
     * Inform ncp of our status using the nFlag in ACKs and NAKs.
     * Note that not ready status must be refreshed if it persists beyond a maximum time limit.
     */
    dataFrameFlowControl() {
        if (this.flags & Flag.CONNECTED) {
            // Set/clear NR flag based on the number of buffers free
            if (this.rxFree.length < CONFIG_NR_LOW_LIMIT) {
                this.flags |= Flag.NR;
                logger_1.logger.warning("NOT READY - Signaling adapter", NS);
            }
            else if (this.rxFree.length > CONFIG_NR_HIGH_LIMIT) {
                this.flags &= ~Flag.NR;
                this.stopNrTimer(); // needed??
            }
            // Force an ACK (or possibly NAK) if we need to send an updated nFlag
            // due to either a changed NR status or to refresh a set nFlag
            if (this.flags & Flag.NR) {
                if (!(this.flags & Flag.NRTX) || this.nrTimerHasExpired()) {
                    this.flags |= Flag.ACK;
                    this.startNrTimer();
                }
            }
            else {
                this.nrTimerHasExpired(); // ensure timer checked often
                if (this.flags & Flag.NRTX) {
                    this.flags |= Flag.ACK;
                    this.stopNrTimer(); // needed???
                }
            }
        }
        else {
            this.stopNrTimer();
            this.flags &= ~(Flag.NRTX | Flag.NR);
        }
    }
    /**
     * Sets a fatal error state at the Host level.
     * @param error
     * @returns EzspStatus.HOST_FATAL_ERROR
     */
    hostDisconnect(error) {
        this.flags = 0;
        this.hostError = error;
        logger_1.logger.error(`ASH disconnected: ${enums_1.EzspStatus[error]} | Adapter status: ${enums_1.EzspStatus[this.ncpError]}`, NS);
        return enums_1.EzspStatus.HOST_FATAL_ERROR;
    }
    /**
     * Sets a fatal error state at the NCP level. Will require a reset.
     * @param error
     * @returns EzspStatus.ASH_NCP_FATAL_ERROR
     */
    ncpDisconnect(error) {
        this.flags = 0;
        this.ncpError = error;
        logger_1.logger.error(`ASH disconnected | Adapter status: ${enums_1.EzspStatus[this.ncpError]}`, NS);
        return enums_1.EzspStatus.ASH_NCP_FATAL_ERROR;
    }
    /**
     * Same as randomizeArray(0, buffer, len).
     * Returns buffer as-is if randomize is OFF.
     * @param buffer IN/OUT
     * @param len
     */
    randomizeBuffer(buffer, len) {
        // If enabled, exclusive-OR buffer data with a pseudo-random sequence
        if (CONFIG_RANDOMIZE) {
            this.randomizeArray(0, buffer, len); // zero inits the random sequence
        }
    }
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
    randomizeArray(seed, buf, len) {
        let outIdx = 0;
        if (seed === 0) {
            seed = consts_1.LFSR_SEED;
        }
        while (len--) {
            // *buf++ ^= seed;
            buf[outIdx++] ^= seed;
            seed = seed & 1 ? (seed >> 1) ^ consts_1.LFSR_POLY : seed >> 1;
        }
        return seed;
    }
    /**
     * Get the frame type from the control byte and validate it against the frame length.
     * @param control
     * @param len Frame length
     * @returns AshFrameType.INVALID if bad control/length otherwise the frame type.
     */
    getFrameType(control, len) {
        if (control === enums_2.AshFrameType.RSTACK) {
            if (len === consts_1.ASH_FRAME_LEN_RSTACK) {
                return enums_2.AshFrameType.RSTACK;
            }
        }
        else if (control === enums_2.AshFrameType.ERROR) {
            if (len === consts_1.ASH_FRAME_LEN_ERROR) {
                return enums_2.AshFrameType.ERROR;
            }
        }
        else if ((control & consts_1.ASH_DFRAME_MASK) === enums_2.AshFrameType.DATA) {
            if (len >= consts_1.ASH_FRAME_LEN_DATA_MIN) {
                return enums_2.AshFrameType.DATA;
            }
        }
        else if ((control & consts_1.ASH_SHFRAME_MASK) === enums_2.AshFrameType.ACK) {
            if (len === consts_1.ASH_FRAME_LEN_ACK) {
                return enums_2.AshFrameType.ACK;
            }
        }
        else if ((control & consts_1.ASH_SHFRAME_MASK) === enums_2.AshFrameType.NAK) {
            if (len === consts_1.ASH_FRAME_LEN_NAK) {
                return enums_2.AshFrameType.NAK;
            }
        }
        else {
            this.counters.rxBadControl += 1;
            logger_1.logger.debug(`Frame illegal control ${control}.`, NS); // EzspStatus.ASH_BAD_CONTROL
            return enums_2.AshFrameType.INVALID;
        }
        this.counters.rxBadLength += 1;
        logger_1.logger.debug(`Frame illegal length ${len} for control ${control}.`, NS); // EzspStatus.ASH_BAD_LENGTH
        return enums_2.AshFrameType.INVALID;
    }
    /**
     * Encode byte for sending.
     * @param len Start a new frame if non-zero
     * @param byte
     * @returns outByte
     */
    encodeByte(len, byte) {
        // start a new frame if len is non-zero
        if (len) {
            this.encodeCount = len;
            this.txOffset = 0;
            this.encodeState = 0;
            this.encodeEscFlag = false;
            this.encodeCrc = 0xffff;
        }
        // was an escape last time?
        if (this.encodeEscFlag) {
            this.encodeEscFlag = false;
            // send data byte with bit flipped
            return this.encodeFlip;
        }
        // control and data field bytes
        if (this.encodeState === 0) {
            this.encodeCrc = (0, math_1.halCommonCrc16)(byte, this.encodeCrc);
            if (--this.encodeCount === 0) {
                this.encodeState = 1;
            }
            else {
                ++this.txOffset;
            }
            return this.encodeStuffByte(byte);
        }
        if (this.encodeState === 1) {
            // CRC high byte
            this.encodeState = 2;
            return this.encodeStuffByte(this.encodeCrc >> 8);
        }
        if (this.encodeState === 2) {
            // CRC low byte
            this.encodeState = 3;
            return this.encodeStuffByte(this.encodeCrc & 0xff);
        }
        this.txOffset = 0xff;
        return enums_2.AshReservedByte.FLAG;
    }
    /**
     * Stuff byte as defined by ASH protocol.
     * @param byte
     * @returns
     */
    encodeStuffByte(byte) {
        if (enums_2.AshReservedByte[byte] != null) {
            // is special byte
            this.encodeEscFlag = true;
            this.encodeFlip = byte ^ consts_1.ASH_FLIP;
            return enums_2.AshReservedByte.ESCAPE;
        }
        return byte;
    }
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
    decodeByte(byte, inByte, inLen) {
        let status = enums_1.EzspStatus.ASH_IN_PROGRESS;
        if (!this.decodeInProgress) {
            this.decodeLen = 0;
            this.decodeByte1 = 0;
            this.decodeByte2 = 0;
            this.decodeFlip = 0;
            this.decodeCrc = 0xffff;
        }
        switch (byte) {
            case enums_2.AshReservedByte.FLAG:
                // flag byte (frame delimiter)
                if (this.decodeLen === 0) {
                    // if no frame data, not end flag, so ignore it
                    this.decodeFlip = 0; // ignore isolated data escape between flags
                    break;
                }
                if (this.decodeLen === 0xff) {
                    status = enums_1.EzspStatus.ASH_COMM_ERROR;
                }
                else if (this.decodeCrc !== (this.decodeByte2 << 8) + this.decodeByte1) {
                    status = enums_1.EzspStatus.ASH_BAD_CRC;
                }
                else if (this.decodeLen < consts_1.ASH_MIN_FRAME_WITH_CRC_LEN) {
                    status = enums_1.EzspStatus.ASH_TOO_SHORT;
                }
                else if (this.decodeLen > consts_1.ASH_MAX_FRAME_WITH_CRC_LEN) {
                    status = enums_1.EzspStatus.ASH_TOO_LONG;
                }
                else {
                    status = enums_1.EzspStatus.SUCCESS;
                }
                break;
            case enums_2.AshReservedByte.ESCAPE:
                // byte stuffing escape byte
                this.decodeFlip = consts_1.ASH_FLIP;
                break;
            case enums_2.AshReservedByte.CANCEL:
                // cancel frame without an error
                status = enums_1.EzspStatus.ASH_CANCELLED;
                break;
            case enums_2.AshReservedByte.SUBSTITUTE:
                // discard remainder of frame
                this.decodeLen = 0xff; // special value flags low level comm error
                break;
            case enums_2.AshReservedByte.XON:
            case enums_2.AshReservedByte.XOFF:
                // If host is using RTS/CTS, ignore any XON/XOFFs received from the NCP.
                // If using XON/XOFF, the host driver must remove them from the input stream.
                // If it doesn't, it probably means the driver isn't setup for XON/XOFF,
                // so issue an error to flag the serial port driver problem.
                if (this.serialPort != null && !this.serialPort.settings.rtscts) {
                    status = enums_1.EzspStatus.ASH_ERROR_XON_XOFF;
                }
                break;
            default:
                // a normal byte
                byte ^= this.decodeFlip;
                this.decodeFlip = 0;
                if (this.decodeLen <= consts_1.ASH_MAX_FRAME_WITH_CRC_LEN) {
                    // limit length to max + 1
                    ++this.decodeLen;
                }
                if (this.decodeLen > consts_1.ASH_CRC_LEN) {
                    // compute frame CRC even if too long
                    this.decodeCrc = (0, math_1.halCommonCrc16)(this.decodeByte2, this.decodeCrc);
                    if (this.decodeLen <= consts_1.ASH_MAX_FRAME_WITH_CRC_LEN) {
                        // store to only max len
                        inByte = this.decodeByte2;
                        inLen = this.decodeLen - consts_1.ASH_CRC_LEN; // CRC is not output, reduce length
                    }
                }
                this.decodeByte2 = this.decodeByte1;
                this.decodeByte1 = byte;
                break;
        }
        this.decodeInProgress = status === enums_1.EzspStatus.ASH_IN_PROGRESS;
        return [status, inByte, inLen];
    }
    /**
     * Starts the Not Ready timer
     *
     * On the host, this times nFlag refreshing when the host doesn't have room for callbacks for a prolonged period.
     *
     * On the NCP, if this times out the NCP resumes sending callbacks.
     */
    startNrTimer() {
        this.nrTimer = Date.now() + CONFIG_NR_TIME;
    }
    /**
     * Stop Not Ready timer (set to 0).
     */
    stopNrTimer() {
        this.nrTimer = 0;
    }
    /**
     * Tests whether the Not Ready timer has expired or has stopped. If expired, it is stopped.
     *
     * @returns  true if the Not Ready timer has expired or stopped
     */
    nrTimerHasExpired() {
        if (this.nrTimer) {
            if (Date.now() - this.nrTimer >= 0) {
                this.nrTimer = 0;
            }
        }
        return !this.nrTimer;
    }
    /**
     * Sets the acknowledgement timer period (in msec) and stops the timer.
     */
    setAckPeriod(msec) {
        this.ackPeriod = msec;
        this.ackTimer = 0;
    }
    /**
     * Sets the acknowledgement timer period (in msec), and starts the timer running.
     */
    setAndStartAckTimer(msec) {
        this.setAckPeriod(msec);
        this.startAckTimer();
    }
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
    adjustAckPeriod(expired) {
        if (expired) {
            // if expired, double the period
            this.ackPeriod += this.ackPeriod;
        }
        else if (this.ackTimer) {
            // adjust period only if running
            // time elapsed since timer was started
            let temp = this.ackPeriod;
            // compute time to receive acknowledgement, then stop timer
            const lastAckTime = Date.now() - this.ackTimer;
            temp = (temp << 3) - temp;
            temp += lastAckTime << 2;
            temp >>= 3;
            this.ackPeriod = temp & 0xffff;
        }
        // keep ackPeriod within limits
        if (this.ackPeriod > CONFIG_ACK_TIME_MAX) {
            this.ackPeriod = CONFIG_ACK_TIME_MAX;
        }
        else if (this.ackPeriod < CONFIG_ACK_TIME_MIN) {
            this.ackPeriod = CONFIG_ACK_TIME_MIN;
        }
        this.ackTimer = 0; // always stop the timer
    }
    /**
     * Sets ACK Timer to the specified period and starts it running.
     */
    startAckTimer() {
        this.ackTimer = Date.now();
    }
    /**
     * Stops and clears ACK Timer.
     */
    stopAckTimer() {
        this.ackTimer = 0;
    }
    /**
     * Indicates whether or not ACK Timer has expired.
     * If the timer is stopped (0) then it is not expired.
     *
     * @returns
     */
    ackTimerHasExpired() {
        if (this.ackTimer === 0) {
            // if timer is not running, return false
            return false;
        }
        // return ((halCommonGetInt16uMillisecondTick() - this.ackTimer) >= this.ackPeriod);
        return Date.now() - this.ackTimer >= this.ackPeriod;
    }
    /**
     * Indicates whether or not ACK Timer is currently running (!= 0).
     * The timer may be running even if expired.
     */
    ackTimerIsNotRunning() {
        return this.ackTimer === 0;
    }
    /**
     * Increase counters based on frame type and direction.
     * @param sent True if frame being sent, false if being received.
     */
    countFrame(sent) {
        let control;
        if (sent) {
            control = this.txSHBuffer[0];
            this.counters.txAllFrames += 1;
        }
        else {
            control = this.rxSHBuffer[0];
            this.counters.rxAllFrames += 1;
        }
        if ((control & consts_1.ASH_DFRAME_MASK) === enums_2.AshFrameType.DATA) {
            if (sent) {
                if (control & consts_1.ASH_RFLAG_MASK) {
                    this.counters.txReDataFrames += 1;
                }
                else {
                    this.counters.txDataFrames += 1;
                }
            }
            else {
                if (control & consts_1.ASH_RFLAG_MASK) {
                    this.counters.rxReDataFrames += 1;
                }
                else {
                    this.counters.rxDataFrames += 1;
                }
            }
        }
        else if ((control & consts_1.ASH_SHFRAME_MASK) === enums_2.AshFrameType.ACK) {
            if (sent) {
                this.counters.txAckFrames += 1;
                if (control & consts_1.ASH_NFLAG_MASK) {
                    this.counters.txN1Frames += 1;
                } /* else {
                    this.counters.txN0Frames += 1;
                }*/
            }
            else {
                this.counters.rxAckFrames += 1;
                if (control & consts_1.ASH_NFLAG_MASK) {
                    this.counters.rxN1Frames += 1;
                } /* else {
                    this.counters.rxN0Frames += 1;
                }*/
            }
        }
        else if ((control & consts_1.ASH_SHFRAME_MASK) === enums_2.AshFrameType.NAK) {
            if (sent) {
                this.counters.txNakFrames += 1;
                if (control & consts_1.ASH_NFLAG_MASK) {
                    this.counters.txN1Frames += 1;
                } /* else {
                    this.counters.txN0Frames += 1;
                }*/
            }
            else {
                this.counters.rxNakFrames += 1;
                if (control & consts_1.ASH_NFLAG_MASK) {
                    this.counters.rxN1Frames += 1;
                } /* else {
                    this.counters.rxN0Frames += 1;
                }*/
            }
        }
    }
    /**
     * Read and clear ASH layer counters in the same manner as the NCP ones.
     * @returns
     */
    readAndClearCounters() {
        const counters = [
            this.counters.txData,
            this.counters.txAllFrames,
            this.counters.txDataFrames,
            this.counters.txAckFrames,
            this.counters.txNakFrames,
            this.counters.txReDataFrames,
            this.counters.txN1Frames,
            this.counters.txCancelled,
            this.counters.rxData,
            this.counters.rxAllFrames,
            this.counters.rxDataFrames,
            this.counters.rxAckFrames,
            this.counters.rxNakFrames,
            this.counters.rxReDataFrames,
            this.counters.rxN1Frames,
            this.counters.rxCancelled,
            this.counters.rxCrcErrors,
            this.counters.rxCommErrors,
            this.counters.rxTooShort,
            this.counters.rxTooLong,
            this.counters.rxBadControl,
            this.counters.rxBadLength,
            this.counters.rxBadAckNumber,
            this.counters.rxNoBuffer,
            this.counters.rxDuplicates,
            this.counters.rxOutOfSequence,
            this.counters.rxAckTimeouts,
        ];
        for (const c in this.counters) {
            this.counters[c] = 0;
        }
        return counters;
    }
    /**
     * Log counters (pretty-formatted) as they are since last time they were cleared.
     * Used on ASH layer stop to get 'pre-stop state'.
     */
    logCounters() {
        logger_1.logger.info("ASH COUNTERS since last clear:", NS);
        logger_1.logger.info(`  Total frames: RX=${this.counters.rxAllFrames}, TX=${this.counters.txAllFrames}`, NS);
        logger_1.logger.info(`  Cancelled   : RX=${this.counters.rxCancelled}, TX=${this.counters.txCancelled}`, NS);
        logger_1.logger.info(`  DATA frames : RX=${this.counters.rxDataFrames}, TX=${this.counters.txDataFrames}`, NS);
        logger_1.logger.info(`  DATA bytes  : RX=${this.counters.rxData}, TX=${this.counters.txData}`, NS);
        logger_1.logger.info(`  Retry frames: RX=${this.counters.rxReDataFrames}, TX=${this.counters.txReDataFrames}`, NS);
        logger_1.logger.info(`  ACK frames  : RX=${this.counters.rxAckFrames}, TX=${this.counters.txAckFrames}`, NS);
        logger_1.logger.info(`  NAK frames  : RX=${this.counters.rxNakFrames}, TX=${this.counters.txNakFrames}`, NS);
        logger_1.logger.info(`  nRdy frames : RX=${this.counters.rxN1Frames}, TX=${this.counters.txN1Frames}`, NS);
        logger_1.logger.info(`  CRC errors      : RX=${this.counters.rxCrcErrors}`, NS);
        logger_1.logger.info(`  Comm errors     : RX=${this.counters.rxCommErrors}`, NS);
        logger_1.logger.info(`  Length < minimum: RX=${this.counters.rxTooShort}`, NS);
        logger_1.logger.info(`  Length > maximum: RX=${this.counters.rxTooLong}`, NS);
        logger_1.logger.info(`  Bad controls    : RX=${this.counters.rxBadControl}`, NS);
        logger_1.logger.info(`  Bad lengths     : RX=${this.counters.rxBadLength}`, NS);
        logger_1.logger.info(`  Bad ACK numbers : RX=${this.counters.rxBadAckNumber}`, NS);
        logger_1.logger.info(`  Out of buffers  : RX=${this.counters.rxNoBuffer}`, NS);
        logger_1.logger.info(`  Retry dupes     : RX=${this.counters.rxDuplicates}`, NS);
        logger_1.logger.info(`  Out of sequence : RX=${this.counters.rxOutOfSequence}`, NS);
        logger_1.logger.info(`  ACK timeouts    : RX=${this.counters.rxAckTimeouts}`, NS);
    }
}
exports.UartAsh = UartAsh;
//# sourceMappingURL=ash.js.map