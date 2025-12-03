"use strict";
/* v8 ignore start */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frame = exports.FrameType = void 0;
const consts_1 = require("./consts");
const crc16ccitt_1 = __importDefault(require("./utils/crc16ccitt"));
var FrameType;
(function (FrameType) {
    FrameType[FrameType["UNKNOWN"] = 0] = "UNKNOWN";
    FrameType[FrameType["ERROR"] = 1] = "ERROR";
    FrameType[FrameType["DATA"] = 2] = "DATA";
    FrameType[FrameType["ACK"] = 3] = "ACK";
    FrameType[FrameType["NAK"] = 4] = "NAK";
    FrameType[FrameType["RST"] = 5] = "RST";
    FrameType[FrameType["RSTACK"] = 6] = "RSTACK";
})(FrameType || (exports.FrameType = FrameType = {}));
/**
 * Basic class to handle uart-level frames
 * https://www.silabs.com/documents/public/user-guides/ug101-uart-gateway-protocol-reference.pdf
 */
class Frame {
    /**
     * Type of the Frame as determined by its control byte.
     */
    type;
    buffer;
    constructor(buffer) {
        this.buffer = buffer;
        const ctrlByte = this.buffer[0];
        if ((ctrlByte & 0x80) === 0) {
            this.type = FrameType.DATA;
        }
        else if ((ctrlByte & 0xe0) === 0x80) {
            this.type = FrameType.ACK;
        }
        else if ((ctrlByte & 0xe0) === 0xa0) {
            this.type = FrameType.NAK;
        }
        else if (ctrlByte === 0xc0) {
            this.type = FrameType.RST;
        }
        else if (ctrlByte === 0xc1) {
            this.type = FrameType.RSTACK;
        }
        else if (ctrlByte === 0xc2) {
            this.type = FrameType.ERROR;
        }
        else {
            this.type = FrameType.UNKNOWN;
        }
    }
    get control() {
        return this.buffer[0];
    }
    static fromBuffer(buffer) {
        return new Frame(buffer);
    }
    /**
     * XOR s with a pseudo-random sequence for transmission.
     * Used only in data frames.
     */
    static makeRandomizedBuffer(buffer) {
        let rand = consts_1.RANDOMIZE_START;
        const out = Buffer.alloc(buffer.length);
        let outIdx = 0;
        for (const c of buffer) {
            out.writeUInt8(c ^ rand, outIdx++);
            if (rand % 2) {
                rand = (rand >> 1) ^ consts_1.RANDOMIZE_SEQ;
            }
            else {
                rand = rand >> 1;
            }
        }
        return out;
    }
    /**
     * Throws on CRC error.
     */
    checkCRC() {
        const crc = (0, crc16ccitt_1.default)(this.buffer.subarray(0, -3), 65535);
        const crcArr = Buffer.from([crc >> 8, crc % 256]);
        const subArr = this.buffer.subarray(-3, -1);
        if (!subArr.equals(crcArr)) {
            throw new Error(`<-- CRC error: ${this.toString()}|${subArr.toString("hex")}|${crcArr.toString("hex")}`);
        }
    }
    /**
     *
     * @returns Buffer to hex string
     */
    toString() {
        return this.buffer.toString("hex");
    }
}
exports.Frame = Frame;
exports.default = Frame;
//# sourceMappingURL=frame.js.map