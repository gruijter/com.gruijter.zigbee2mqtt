"use strict";
/* v8 ignore start */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZBOSSUart = void 0;
const node_events_1 = __importDefault(require("node:events"));
const node_net_1 = require("node:net");
const utils_1 = require("../../utils");
const logger_1 = require("../../utils/logger");
const serialPort_1 = require("../serialPort");
const utils_2 = require("../utils");
const consts_1 = require("./consts");
const frame_1 = require("./frame");
const reader_1 = require("./reader");
const utils_3 = require("./utils");
const writer_1 = require("./writer");
const NS = "zh:zboss:uart";
class ZBOSSUart extends node_events_1.default {
    portOptions;
    serialPort;
    socketPort;
    writer;
    reader;
    closing = false;
    sendSeq = 0; // next frame number to send
    recvSeq = 0; // next frame number to receive
    ackSeq = 0; // next number after the last accepted frame
    waitress;
    queue;
    inReset = false;
    constructor(options) {
        super();
        this.portOptions = options;
        this.serialPort = undefined;
        this.socketPort = undefined;
        this.writer = new writer_1.ZBOSSWriter();
        this.reader = new reader_1.ZBOSSReader();
        this.reader.on("data", this.onPackage.bind(this));
        this.queue = new utils_1.Queue(1);
        this.waitress = new utils_1.Waitress(this.waitressValidator, this.waitressTimeoutFormatter);
    }
    async resetNcp() {
        if (this.closing) {
            return false;
        }
        logger_1.logger.info("NCP reset", NS);
        try {
            if (!this.portOpen) {
                await this.openPort();
            }
            return true;
        }
        catch (err) {
            logger_1.logger.error(`Failed to init port with error ${err}`, NS);
            return false;
        }
    }
    get portOpen() {
        if (this.closing) {
            return false;
        }
        // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
        if ((0, utils_2.isTcpPath)(this.portOptions.path)) {
            return this.socketPort && !this.socketPort.closed;
        }
        return this.serialPort?.isOpen;
    }
    async start() {
        if (!this.portOpen) {
            return false;
        }
        logger_1.logger.info("UART starting", NS);
        try {
            if (this.serialPort != null) {
                // clear read/write buffers
                await this.serialPort.asyncFlush();
            }
        }
        catch (err) {
            logger_1.logger.error(`Error while flushing before start: ${err}`, NS);
        }
        return true;
    }
    async stop() {
        this.closing = true;
        this.queue.clear();
        await this.closePort();
        this.closing = false;
        logger_1.logger.info("UART stopped", NS);
    }
    async openPort() {
        await this.closePort();
        // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
        if (!(0, utils_2.isTcpPath)(this.portOptions.path)) {
            const serialOpts = {
                // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                path: this.portOptions.path,
                baudRate: typeof this.portOptions.baudRate === "number" ? this.portOptions.baudRate : 115200,
                rtscts: typeof this.portOptions.rtscts === "boolean" ? this.portOptions.rtscts : false,
                autoOpen: false,
            };
            //@ts-expect-error Jest testing
            if (this.portOptions.binding != null) {
                //@ts-expect-error Jest testing
                serialOpts.binding = this.portOptions.binding;
            }
            logger_1.logger.debug(`Opening serial port with ${JSON.stringify(serialOpts)}`, NS);
            this.serialPort = new serialPort_1.SerialPort(serialOpts);
            this.writer.pipe(this.serialPort);
            this.serialPort.pipe(this.reader);
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
            this.socketPort.pipe(this.reader);
            return await new Promise((resolve, reject) => {
                const openError = async (err) => {
                    await this.stop();
                    reject(err);
                };
                this.socketPort?.on("connect", () => {
                    logger_1.logger.debug("Socket connected", NS);
                });
                this.socketPort?.on("ready", () => {
                    logger_1.logger.info("Socket ready", NS);
                    this.socketPort?.removeListener("error", openError);
                    this.socketPort?.once("close", this.onPortClose.bind(this));
                    this.socketPort?.on("error", this.onPortError.bind(this));
                    resolve();
                });
                this.socketPort?.once("error", openError);
                this.socketPort?.connect(info.port, info.host);
            });
        }
    }
    async closePort() {
        if (this.serialPort?.isOpen) {
            try {
                await this.serialPort.asyncFlushAndClose();
            }
            catch (err) {
                logger_1.logger.error(`Failed to close serial port ${err}.`, NS);
            }
            this.serialPort.removeAllListeners();
            this.serialPort = undefined;
        }
        else if (this.socketPort !== undefined && !this.socketPort.closed) {
            this.socketPort.destroy();
            this.socketPort.removeAllListeners();
            this.socketPort = undefined;
        }
    }
    async onPortClose(err) {
        logger_1.logger.info(`Port closed. Error? ${err ?? "no"}`, NS);
        if (this.inReset) {
            await (0, utils_1.wait)(3000);
            await this.openPort();
            this.inReset = false;
        }
    }
    onPortError(error) {
        logger_1.logger.info(`Port error: ${error}`, NS);
    }
    async onPackage(data) {
        if (this.inReset)
            return;
        const len = data.readUInt16LE(0);
        const pType = data.readUInt8(2);
        const pFlags = data.readUInt8(3);
        const isACK = (pFlags & 0x1) === 1;
        const retransmit = ((pFlags >> 1) & 0x1) === 1;
        const sequence = (pFlags >> 2) & 0x3;
        const ACKseq = (pFlags >> 4) & 0x3;
        const isFirst = ((pFlags >> 6) & 0x1) === 1;
        const isLast = ((pFlags >> 7) & 0x1) === 1;
        logger_1.logger.debug(() => `<-- package type ${pType}, flags ${pFlags.toString(16)}` +
            `${JSON.stringify({ isACK, retransmit, sequence, ACKseq, isFirst, isLast })}`, NS);
        if (pType !== consts_1.ZBOSS_NCP_API_HL) {
            logger_1.logger.error(`<-- Wrong package type: ${pType}`, NS);
            return;
        }
        if (isACK) {
            // ACKseq is received
            this.handleACK(ACKseq);
            return;
        }
        if (len <= 5) {
            logger_1.logger.debug("<-- Empty package", NS);
            return;
        }
        // header crc
        const hCRC = data.readUInt8(4);
        const hCRC8 = (0, utils_3.crc8)(data.subarray(0, 4));
        if (hCRC !== hCRC8) {
            logger_1.logger.error(`<-- Wrong package header crc: is ${hCRC}, expected ${hCRC8}`, NS);
            return;
        }
        // body crc
        const bCRC = data.readUInt16LE(5);
        const body = data.subarray(7);
        const bodyCRC16 = (0, utils_3.crc16)(body);
        if (bCRC !== bodyCRC16) {
            logger_1.logger.error(`<-- Wrong package body crc: is ${bCRC}, expected ${bodyCRC16}`, NS);
            return;
        }
        this.recvSeq = sequence;
        // Send ACK
        logger_1.logger.debug(`--> ACK (${this.recvSeq})`, NS);
        await this.sendACK(this.recvSeq);
        try {
            logger_1.logger.debug(`<-- FRAME: ${body.toString("hex")}`, NS);
            const frame = (0, frame_1.readZBOSSFrame)(body);
            if (frame) {
                this.emit("frame", frame);
            }
        }
        catch (error) {
            logger_1.logger.debug(`<-- error ${error.stack}`, NS);
        }
    }
    async sendBuffer(buf) {
        try {
            logger_1.logger.debug(`--> FRAME: ${buf.toString("hex")}`, NS);
            let flags = (this.sendSeq & 0x03) << 2; // sequence
            flags = flags | consts_1.ZBOSS_FLAG_FIRST_FRAGMENT | consts_1.ZBOSS_FLAG_LAST_FRAGMENT;
            const pack = this.makePack(flags, buf);
            const isACK = (flags & 0x1) === 1;
            const retransmit = ((flags >> 1) & 0x1) === 1;
            const sequence = (flags >> 2) & 0x3;
            const ACKseq = (flags >> 4) & 0x3;
            const isFirst = ((flags >> 6) & 0x1) === 1;
            const isLast = ((flags >> 7) & 0x1) === 1;
            logger_1.logger.debug(() => `--> package type ${consts_1.ZBOSS_NCP_API_HL}, flags ${flags.toString(16)}` +
                `${JSON.stringify({ isACK, retransmit, sequence, ACKseq, isFirst, isLast })}`, NS);
            logger_1.logger.debug(`--> PACK: ${pack.toString("hex")}`, NS);
            await this.sendDATA(pack);
        }
        catch (error) {
            logger_1.logger.debug(`--> error ${error.stack}`, NS);
        }
    }
    async sendFrame(frame) {
        return await this.sendBuffer((0, frame_1.writeZBOSSFrame)(frame));
    }
    async sendDATA(data, isACK = false) {
        const seq = this.sendSeq;
        const nextSeq = this.sendSeq;
        const ackSeq = this.recvSeq;
        return await this.queue.execute(async () => {
            try {
                logger_1.logger.debug(`--> DATA (${seq},${ackSeq},0): ${data.toString("hex")}`, NS);
                if (!isACK) {
                    const waiter = this.waitFor(nextSeq);
                    this.writeBuffer(data);
                    logger_1.logger.debug(`-?- waiting (${nextSeq})`, NS);
                    if (!this.inReset) {
                        await waiter.start().promise;
                    }
                    logger_1.logger.debug(`-+- waiting (${nextSeq}) success`, NS);
                }
                else {
                    this.writeBuffer(data);
                }
            }
            catch (e1) {
                logger_1.logger.error(`--> Error: ${e1}`, NS);
                logger_1.logger.error(`-!- break waiting (${nextSeq})`, NS);
                logger_1.logger.error(`Can't send DATA frame (${seq},${ackSeq},0): ${data.toString("hex")}`, NS);
                throw new Error(`sendDATA error: try 1: ${e1}`);
                // try {
                //     await Wait(500);
                //     const waiter = this.waitFor(nextSeq);
                //     logger.debug(`->> DATA (${seq},${ackSeq},1): ${data.toString('hex')}`, NS);
                //     this.writeBuffer(data);
                //     logger.debug(`-?- rewaiting (${nextSeq})`, NS);
                //     await waiter.start().promise;
                //     logger.debug(`-+- rewaiting (${nextSeq}) success`, NS);
                // } catch (e2) {
                //     logger.error(`--> Error: ${e2}`, NS);
                //     logger.error(`-!- break rewaiting (${nextSeq})`, NS);
                //     logger.error(`Can't resend DATA frame (${seq},${ackSeq},1): ${data.toString('hex')}`, NS);
                //     throw new Error(`sendDATA error: try 1: ${e1}, try 2: ${e2}`);
                // }
            }
        });
    }
    handleACK(ackSeq) {
        /* Handle an acknowledgement package */
        // next number after the last accepted package
        this.ackSeq = ackSeq & 0x03;
        logger_1.logger.debug(`<-- ACK (${this.ackSeq})`, NS);
        const handled = this.waitress.resolve(this.ackSeq);
        if (!handled && this.sendSeq !== this.ackSeq) {
            // Packet confirmation received for {ackSeq}, but was expected {sendSeq}
            // This happens when the chip has not yet received of the packet {sendSeq} from us,
            // but has already sent us the next one.
            logger_1.logger.debug(`Unexpected packet sequence ${this.ackSeq} | ${this.sendSeq}`, NS);
        }
        else {
            // next
            this.sendSeq = { 0: 1, 1: 2, 2: 3, 3: 1 }[this.sendSeq] || 1;
        }
        return handled;
    }
    async sendACK(ackNum, retransmit = false) {
        /* Construct a acknowledgement package */
        let flags = (ackNum & 0x03) << 4; // ACKseq
        flags |= 0x01; // isACK
        if (retransmit) {
            flags |= 0x02; // retransmit
        }
        const ackPackage = this.makePack(flags, undefined);
        const isACK = (flags & 0x1) === 1;
        const sequence = (flags >> 2) & 0x3;
        const ACKseq = (flags >> 4) & 0x3;
        const isFirst = ((flags >> 6) & 0x1) === 1;
        const isLast = ((flags >> 7) & 0x1) === 1;
        logger_1.logger.debug(() => `--> package type ${consts_1.ZBOSS_NCP_API_HL}, flags ${flags.toString(16)}` +
            `${JSON.stringify({ isACK, retransmit, sequence, ACKseq, isFirst, isLast })}`, NS);
        logger_1.logger.debug(`-->  ACK: ${ackPackage.toString("hex")}`, NS);
        await this.sendDATA(ackPackage, true);
    }
    writeBuffer(buffer) {
        logger_1.logger.debug(`--> [${buffer.toString("hex")}]`, NS);
        this.writer.push(buffer);
    }
    makePack(flags, data) {
        /* Construct a package */
        const packLen = 5 + (data ? data.length + 2 : 0);
        const header = Buffer.alloc(7);
        header.writeUInt16BE(consts_1.SIGNATURE);
        header.writeUInt16LE(packLen, 2);
        header.writeUInt8(consts_1.ZBOSS_NCP_API_HL, 4);
        header.writeUInt8(flags, 5);
        const hCRC8 = (0, utils_3.crc8)(header.subarray(2, 6));
        header.writeUInt8(hCRC8, 6);
        if (data) {
            const pCRC16 = Buffer.alloc(2);
            pCRC16.writeUInt16LE((0, utils_3.crc16)(data));
            return Buffer.concat([header, pCRC16, data]);
        }
        return header;
    }
    waitFor(sequence, timeout = 2000) {
        return this.waitress.waitFor(sequence, timeout);
    }
    waitressTimeoutFormatter(matcher, timeout) {
        return `${matcher} after ${timeout}ms`;
    }
    waitressValidator(sequence, matcher) {
        return sequence === matcher;
    }
}
exports.ZBOSSUart = ZBOSSUart;
//# sourceMappingURL=uart.js.map