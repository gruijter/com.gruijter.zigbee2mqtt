"use strict";
/* v8 ignore start */
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../../utils/logger");
const NS = "zh:zigate:frame";
var ZiGateFrameChunkSize;
(function (ZiGateFrameChunkSize) {
    ZiGateFrameChunkSize[ZiGateFrameChunkSize["UInt8"] = 1] = "UInt8";
    ZiGateFrameChunkSize[ZiGateFrameChunkSize["UInt16"] = 2] = "UInt16";
    ZiGateFrameChunkSize[ZiGateFrameChunkSize["UInt32"] = 3] = "UInt32";
    ZiGateFrameChunkSize[ZiGateFrameChunkSize["UInt64"] = 4] = "UInt64";
})(ZiGateFrameChunkSize || (ZiGateFrameChunkSize = {}));
const hasStartByte = (startByte, frame) => {
    return frame.indexOf(startByte, 0) === 0;
};
const hasStopByte = (stopByte, frame) => {
    return frame.indexOf(stopByte, frame.length - 1) === frame.length - 1;
};
const combineBytes = (byte, idx, frame) => {
    const nextByte = frame[idx + 1];
    return [byte, nextByte];
};
// maybe any
const removeDuplicate = (_, idx, frame) => {
    if (idx === 0) {
        return true;
    }
    const [first] = frame[idx - 1];
    return first !== 0x2;
};
const decodeBytes = (bytesPair) => {
    return bytesPair[0] === 0x2 ? bytesPair[1] ^ 0x10 : bytesPair[0];
};
const readBytes = (bytes) => {
    return bytes.readUIntBE(0, bytes.length);
};
const writeBytes = (bytes, val) => {
    bytes.writeUIntBE(val, 0, bytes.length);
};
const xor = (checksum, byte) => {
    return checksum ^ byte;
};
const decodeFrame = (frame) => {
    const arrFrame = Array.from(frame).map(combineBytes).filter(removeDuplicate).map(decodeBytes);
    return Buffer.from(arrFrame);
};
const getFrameChunk = (frame, pos, size) => {
    return frame.slice(pos, pos + size);
};
class ZiGateFrame {
    static START_BYTE = 0x1;
    static STOP_BYTE = 0x3;
    msgCodeBytes = Buffer.alloc(ZiGateFrameChunkSize.UInt16);
    msgLengthBytes = Buffer.alloc(ZiGateFrameChunkSize.UInt16);
    checksumBytes = Buffer.alloc(ZiGateFrameChunkSize.UInt8);
    msgPayloadBytes = Buffer.alloc(0);
    rssiBytes = Buffer.alloc(0);
    msgLengthOffset = 0;
    constructor(frame) {
        if (frame !== undefined) {
            const decodedFrame = decodeFrame(frame);
            // logger.debug(`decoded frame >>> %o`, decodedFrame, NS);
            // Due to ZiGate incoming frames with erroneous msg length
            this.msgLengthOffset = -1;
            if (!ZiGateFrame.isValid(frame)) {
                logger_1.logger.error("Provided frame is not a valid ZiGate frame.", NS);
                return;
            }
            this.buildChunks(decodedFrame);
            try {
                if (this.readMsgCode() !== 0x8001)
                    logger_1.logger.debug(() => `${JSON.stringify(this)}`, NS);
            }
            catch (error) {
                // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                logger_1.logger.error(error.stack, NS);
            }
            if (this.readChecksum() !== this.calcChecksum()) {
                logger_1.logger.error("Provided frame has an invalid checksum.", NS);
                return;
            }
        }
    }
    static isValid(frame) {
        return hasStartByte(ZiGateFrame.START_BYTE, frame) && hasStopByte(ZiGateFrame.STOP_BYTE, frame);
    }
    buildChunks(frame) {
        this.msgCodeBytes = getFrameChunk(frame, 1, this.msgCodeBytes.length);
        this.msgLengthBytes = getFrameChunk(frame, 3, this.msgLengthBytes.length);
        this.checksumBytes = getFrameChunk(frame, 5, this.checksumBytes.length);
        this.msgPayloadBytes = getFrameChunk(frame, 6, this.readMsgLength());
        this.rssiBytes = getFrameChunk(frame, 6 + this.readMsgLength(), ZiGateFrameChunkSize.UInt8);
    }
    toBuffer() {
        const length = 5 + this.readMsgLength();
        const escapedData = this.escapeData(Buffer.concat([this.msgCodeBytes, this.msgLengthBytes, this.checksumBytes, this.msgPayloadBytes], length));
        return Buffer.concat([Uint8Array.from([ZiGateFrame.START_BYTE]), escapedData, Uint8Array.from([ZiGateFrame.STOP_BYTE])]);
    }
    escapeData(data) {
        let encodedLength = 0;
        const encodedData = Buffer.alloc(data.length * 2);
        const FRAME_ESCAPE_XOR = 0x10;
        const FRAME_ESCAPE = 0x02;
        for (const b of data) {
            if (b <= FRAME_ESCAPE_XOR) {
                encodedData[encodedLength++] = FRAME_ESCAPE;
                encodedData[encodedLength++] = b ^ FRAME_ESCAPE_XOR;
            }
            else {
                encodedData[encodedLength++] = b;
            }
        }
        return encodedData.slice(0, encodedLength);
    }
    readMsgCode() {
        return readBytes(this.msgCodeBytes);
    }
    writeMsgCode(msgCode) {
        writeBytes(this.msgCodeBytes, msgCode);
        this.writeChecksum();
        return this;
    }
    readMsgLength() {
        return readBytes(this.msgLengthBytes) + this.msgLengthOffset;
    }
    writeMsgLength(msgLength) {
        writeBytes(this.msgLengthBytes, msgLength);
        return this;
    }
    readChecksum() {
        return readBytes(this.checksumBytes);
    }
    writeMsgPayload(msgPayload) {
        this.msgPayloadBytes = Buffer.from(msgPayload);
        this.writeMsgLength(msgPayload.length);
        this.writeChecksum();
        return this;
    }
    readRSSI() {
        return readBytes(this.rssiBytes);
    }
    writeRSSI(rssi) {
        this.rssiBytes = Buffer.from([rssi]);
        this.writeChecksum();
        return this;
    }
    calcChecksum() {
        let checksum = 0x00;
        checksum = this.msgCodeBytes.reduce(xor, checksum);
        checksum = this.msgLengthBytes.reduce(xor, checksum);
        checksum = this.rssiBytes.reduce(xor, checksum);
        checksum = this.msgPayloadBytes.reduce(xor, checksum);
        return checksum;
    }
    writeChecksum() {
        this.checksumBytes = Buffer.from([this.calcChecksum()]);
        return this;
    }
}
exports.default = ZiGateFrame;
//# sourceMappingURL=frame.js.map