"use strict";
/* v8 ignore start */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialDriver = void 0;
const node_events_1 = require("node:events");
const node_net_1 = __importDefault(require("node:net"));
const utils_1 = require("../../../utils");
const logger_1 = require("../../../utils/logger");
const serialPort_1 = require("../../serialPort");
const utils_2 = require("../../utils");
const frame_1 = require("./frame");
const parser_1 = require("./parser");
const writer_1 = require("./writer");
const NS = "zh:ezsp:uart";
var NcpResetCode;
(function (NcpResetCode) {
    NcpResetCode[NcpResetCode["RESET_UNKNOWN_REASON"] = 0] = "RESET_UNKNOWN_REASON";
    NcpResetCode[NcpResetCode["RESET_EXTERNAL"] = 1] = "RESET_EXTERNAL";
    NcpResetCode[NcpResetCode["RESET_POWER_ON"] = 2] = "RESET_POWER_ON";
    NcpResetCode[NcpResetCode["RESET_WATCHDOG"] = 3] = "RESET_WATCHDOG";
    NcpResetCode[NcpResetCode["RESET_ASSERT"] = 6] = "RESET_ASSERT";
    NcpResetCode[NcpResetCode["RESET_BOOTLOADER"] = 9] = "RESET_BOOTLOADER";
    NcpResetCode[NcpResetCode["RESET_SOFTWARE"] = 11] = "RESET_SOFTWARE";
    NcpResetCode[NcpResetCode["ERROR_EXCEEDED_MAXIMUM_ACK_TIMEOUT_COUNT"] = 81] = "ERROR_EXCEEDED_MAXIMUM_ACK_TIMEOUT_COUNT";
    NcpResetCode[NcpResetCode["ERROR_UNKNOWN_EM3XX_ERROR"] = 128] = "ERROR_UNKNOWN_EM3XX_ERROR";
})(NcpResetCode || (NcpResetCode = {}));
class SerialDriver extends node_events_1.EventEmitter {
    serialPort;
    socketPort;
    writer;
    parser;
    initialized;
    sendSeq = 0; // next frame number to send
    recvSeq = 0; // next frame number to receive
    ackSeq = 0; // next number after the last accepted frame
    rejectCondition = false;
    waitress;
    queue;
    constructor() {
        super();
        this.initialized = false;
        this.queue = new utils_1.Queue(1);
        this.waitress = new utils_1.Waitress(this.waitressValidator, this.waitressTimeoutFormatter);
        this.writer = new writer_1.Writer();
        this.parser = new parser_1.Parser();
    }
    async connect(options) {
        // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
        if ((0, utils_2.isTcpPath)(options.path)) {
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            await this.openSocketPort(options.path);
        }
        else {
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            await this.openSerialPort(options.path, options.baudRate, options.rtscts);
        }
    }
    async openSerialPort(path, baudRate, rtscts) {
        const options = {
            path,
            baudRate: typeof baudRate === "number" ? baudRate : 115200,
            rtscts: typeof rtscts === "boolean" ? rtscts : false,
            autoOpen: false,
            parity: "none",
            stopBits: 1,
            xon: false,
            xoff: false,
        };
        // enable software flow control if RTS/CTS not enabled in config
        if (!options.rtscts) {
            logger_1.logger.debug("RTS/CTS config is off, enabling software flow control.", NS);
            options.xon = true;
            options.xoff = true;
        }
        logger_1.logger.debug(`Opening SerialPort with ${JSON.stringify(options)}`, NS);
        // @ts-expect-error
        this.serialPort = new serialPort_1.SerialPort(options);
        this.writer.pipe(this.serialPort);
        this.serialPort.pipe(this.parser);
        this.parser.on("parsed", this.onParsed.bind(this));
        try {
            await this.serialPort.asyncOpen();
            logger_1.logger.debug("Serialport opened", NS);
            this.serialPort.once("close", this.onPortClose.bind(this));
            this.serialPort.on("error", this.onPortError.bind(this));
            // reset
            await this.reset();
            this.initialized = true;
        }
        catch (error) {
            this.initialized = false;
            if (this.serialPort.isOpen) {
                this.serialPort.close();
            }
            throw error;
        }
    }
    async openSocketPort(path) {
        const info = (0, utils_2.parseTcpPath)(path);
        logger_1.logger.debug(`Opening TCP socket with ${info.host}:${info.port}`, NS);
        this.socketPort = new node_net_1.default.Socket();
        this.socketPort.setNoDelay(true);
        this.socketPort.setKeepAlive(true, 15000);
        this.writer.pipe(this.socketPort);
        this.socketPort.pipe(this.parser);
        this.parser.on("parsed", this.onParsed.bind(this));
        return await new Promise((resolve, reject) => {
            const openError = (err) => {
                this.initialized = false;
                reject(err);
            };
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.on("connect", () => {
                logger_1.logger.debug("Socket connected", NS);
            });
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.on("ready", async () => {
                logger_1.logger.debug("Socket ready", NS);
                // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                this.socketPort.removeListener("error", openError);
                // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                this.socketPort.once("close", this.onPortClose.bind(this));
                // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                this.socketPort.on("error", this.onPortError.bind(this));
                // reset
                await this.reset();
                this.initialized = true;
                resolve();
            });
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.once("error", openError);
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.connect(info.port, info.host);
        });
    }
    async onParsed(frame) {
        const rejectCondition = this.rejectCondition;
        try {
            frame.checkCRC();
            /* Frame receive handler */
            switch (frame.type) {
                case frame_1.FrameType.DATA:
                    this.handleDATA(frame);
                    break;
                case frame_1.FrameType.ACK:
                    this.handleACK(frame);
                    break;
                case frame_1.FrameType.NAK:
                    this.handleNAK(frame);
                    break;
                case frame_1.FrameType.RST:
                    this.handleRST(frame);
                    break;
                case frame_1.FrameType.RSTACK:
                    this.handleRSTACK(frame);
                    break;
                case frame_1.FrameType.ERROR:
                    await this.handleError(frame);
                    break;
                default:
                    this.rejectCondition = true;
                    logger_1.logger.debug(`UNKNOWN FRAME RECEIVED: ${frame}`, NS);
            }
        }
        catch (error) {
            this.rejectCondition = true;
            logger_1.logger.error(`Error while parsing to NpiFrame '${error}'`, NS);
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            logger_1.logger.debug(error.stack, NS);
        }
        // We send NAK only if the rejectCondition was set in the current processing
        if (!rejectCondition && this.rejectCondition) {
            // send NAK
            this.writer.sendNAK(this.recvSeq);
        }
    }
    handleDATA(frame) {
        /* Data frame receive handler */
        const frmNum = (frame.control & 0x70) >> 4;
        const reTx = (frame.control & 0x08) >> 3;
        logger_1.logger.debug(`<-- DATA (${frmNum},${frame.control & 0x07},${reTx}): ${frame}`, NS);
        // Expected package {recvSeq}, but received {frmNum}
        // This happens when the chip sends us a reTx packet, but we are waiting for the next one
        if (this.recvSeq !== frmNum) {
            if (reTx) {
                // if the reTx flag is set, then this is a packet replay
                logger_1.logger.debug(`Unexpected DATA packet sequence ${frmNum} | ${this.recvSeq}: packet replay`, NS);
            }
            else {
                // otherwise, the sequence of packets is out of order - skip or send NAK is needed
                logger_1.logger.debug(`Unexpected DATA packet sequence ${frmNum} | ${this.recvSeq}: reject condition`, NS);
                this.rejectCondition = true;
                return;
            }
        }
        this.rejectCondition = false;
        this.recvSeq = (frmNum + 1) & 7; // next
        logger_1.logger.debug(`--> ACK  (${this.recvSeq})`, NS);
        this.writer.sendACK(this.recvSeq);
        const handled = this.handleACK(frame);
        if (reTx && !handled) {
            // if the package is resent and did not expect it,
            // then will skip it - already processed it earlier
            logger_1.logger.debug(`Skipping the packet as repeated (${this.recvSeq})`, NS);
            return;
        }
        const data = frame.buffer.subarray(1, -3);
        this.emit("received", frame_1.Frame.makeRandomizedBuffer(data));
    }
    handleACK(frame) {
        /* Handle an acknowledgement frame */
        // next number after the last accepted frame
        this.ackSeq = frame.control & 0x07;
        logger_1.logger.debug(`<-- ACK (${this.ackSeq}): ${frame}`, NS);
        const handled = this.waitress.resolve({ sequence: this.ackSeq });
        if (!handled && this.sendSeq !== this.ackSeq) {
            // Packet confirmation received for {ackSeq}, but was expected {sendSeq}
            // This happens when the chip has not yet received of the packet {sendSeq} from us,
            // but has already sent us the next one.
            logger_1.logger.debug(`Unexpected packet sequence ${this.ackSeq} | ${this.sendSeq}`, NS);
        }
        return handled;
    }
    handleNAK(frame) {
        /* Handle negative acknowledgment frame */
        const nakNum = frame.control & 0x07;
        logger_1.logger.debug(`<-- NAK (${nakNum}): ${frame}`, NS);
        const handled = this.waitress.reject({ sequence: nakNum }, "Recv NAK frame");
        if (!handled) {
            // send NAK
            logger_1.logger.debug(`NAK Unexpected packet sequence ${nakNum}`, NS);
        }
        else {
            logger_1.logger.debug(`NAK Expected packet sequence ${nakNum}`, NS);
        }
    }
    handleRST(frame) {
        logger_1.logger.debug(`<-- RST:  ${frame}`, NS);
    }
    handleRSTACK(frame) {
        /* Reset acknowledgement frame receive handler */
        let code;
        this.rejectCondition = false;
        logger_1.logger.debug(`<-- RSTACK ${frame}`, NS);
        try {
            code = NcpResetCode[frame.buffer[2]];
        }
        catch {
            code = NcpResetCode.ERROR_UNKNOWN_EM3XX_ERROR;
        }
        logger_1.logger.debug(`RSTACK Version: ${frame.buffer[1]} Reason: ${code.toString()} frame: ${frame}`, NS);
        if (NcpResetCode[code].toString() !== NcpResetCode.RESET_SOFTWARE.toString()) {
            return;
        }
        this.waitress.resolve({ sequence: -1 });
    }
    async handleError(frame) {
        logger_1.logger.debug(`<-- Error ${frame}`, NS);
        try {
            // send reset
            await this.reset();
        }
        catch (error) {
            logger_1.logger.error(`Failed to reset on Error Frame: ${error}`, NS);
        }
    }
    async reset() {
        logger_1.logger.debug("Uart reseting", NS);
        this.parser.reset();
        this.queue.clear();
        this.sendSeq = 0;
        this.recvSeq = 0;
        return await this.queue.execute(async () => {
            try {
                logger_1.logger.debug("--> Write reset", NS);
                const waiter = this.waitFor(-1, 10000);
                this.rejectCondition = false;
                this.writer.sendReset();
                logger_1.logger.debug("-?- waiting reset", NS);
                await waiter.start().promise;
                logger_1.logger.debug("-+- waiting reset success", NS);
                await (0, utils_1.wait)(2000);
            }
            catch (e) {
                logger_1.logger.error(`--> Error: ${e}`, NS);
                this.emit("reset");
                throw new Error(`Reset error: ${e}`);
            }
        });
    }
    async close(emitClose) {
        logger_1.logger.debug("Closing UART", NS);
        this.queue.clear();
        if (this.initialized) {
            this.initialized = false;
            if (this.serialPort) {
                try {
                    await this.serialPort.asyncFlushAndClose();
                }
                catch (error) {
                    if (emitClose) {
                        this.emit("close");
                    }
                    throw error;
                }
            }
            else {
                // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                this.socketPort.destroy();
            }
        }
        if (emitClose) {
            this.emit("close");
        }
    }
    onPortError(error) {
        logger_1.logger.error(`Port error: ${error}`, NS);
    }
    onPortClose(err) {
        logger_1.logger.debug(`Port closed. Error? ${err}`, NS);
        // on error: serialport passes an Error object (in case of disconnect)
        //           net.Socket passes a boolean (in case of a transmission error)
        // try to reset instead of failing immediately
        if (err != null && err !== false) {
            this.emit("reset");
        }
        else {
            this.initialized = false;
            this.emit("close");
        }
    }
    isInitialized() {
        return this.initialized;
    }
    async sendDATA(data) {
        const seq = this.sendSeq;
        this.sendSeq = (seq + 1) % 8; // next
        const nextSeq = this.sendSeq;
        const ackSeq = this.recvSeq;
        return await this.queue.execute(async () => {
            const randData = frame_1.Frame.makeRandomizedBuffer(data);
            try {
                const waiter = this.waitFor(nextSeq);
                logger_1.logger.debug(`--> DATA (${seq},${ackSeq},0): ${data.toString("hex")}`, NS);
                this.writer.sendData(randData, seq, 0, ackSeq);
                logger_1.logger.debug(`-?- waiting (${nextSeq})`, NS);
                await waiter.start().promise;
                logger_1.logger.debug(`-+- waiting (${nextSeq}) success`, NS);
            }
            catch (e1) {
                logger_1.logger.error(`--> Error: ${e1}`, NS);
                logger_1.logger.error(`-!- break waiting (${nextSeq})`, NS);
                logger_1.logger.error(`Can't send DATA frame (${seq},${ackSeq},0): ${data.toString("hex")}`, NS);
                try {
                    await (0, utils_1.wait)(500);
                    const waiter = this.waitFor(nextSeq);
                    logger_1.logger.debug(`->> DATA (${seq},${ackSeq},1): ${data.toString("hex")}`, NS);
                    this.writer.sendData(randData, seq, 1, ackSeq);
                    logger_1.logger.debug(`-?- rewaiting (${nextSeq})`, NS);
                    await waiter.start().promise;
                    logger_1.logger.debug(`-+- rewaiting (${nextSeq}) success`, NS);
                }
                catch (e2) {
                    logger_1.logger.error(`--> Error: ${e2}`, NS);
                    logger_1.logger.error(`-!- break rewaiting (${nextSeq})`, NS);
                    logger_1.logger.error(`Can't resend DATA frame (${seq},${ackSeq},1): ${data.toString("hex")}`, NS);
                    if (this.initialized) {
                        this.emit("reset");
                    }
                    throw new Error(`sendDATA error: try 1: ${e1}, try 2: ${e2}`);
                }
            }
        });
    }
    waitFor(sequence, timeout = 4000) {
        return this.waitress.waitFor({ sequence }, timeout);
    }
    waitressTimeoutFormatter(matcher, timeout) {
        return `${JSON.stringify(matcher)} after ${timeout}ms`;
    }
    waitressValidator(payload, matcher) {
        return payload.sequence === matcher.sequence;
    }
}
exports.SerialDriver = SerialDriver;
//# sourceMappingURL=uart.js.map