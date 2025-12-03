"use strict";
/* v8 ignore start */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AshWriter = void 0;
const node_stream_1 = require("node:stream");
// import {logger} from '../../../utils/logger';
// const NS = 'zh:ember:uart:ash:writer';
class AshWriter extends node_stream_1.Readable {
    bytesToWrite;
    constructor(opts) {
        super(opts);
        this.bytesToWrite = [];
    }
    writeBytes() {
        const buffer = Buffer.from(this.bytesToWrite);
        this.bytesToWrite = [];
        // expensive and very verbose, enable locally only if necessary
        // logger.debug(`>>>> [FRAME raw=${buffer.toString('hex')}]`, NS);
        // this.push(buffer);
        this.emit("data", buffer);
    }
    writeByte(byte) {
        this.bytesToWrite.push(byte);
    }
    writeAvailable() {
        if (this.readableLength < this.readableHighWaterMark) {
            return true;
        }
        this.writeFlush();
        return false;
    }
    /**
     * If there is anything to send, send to the port.
     */
    writeFlush() {
        if (this.bytesToWrite.length) {
            this.writeBytes();
        }
    }
    _read() { }
}
exports.AshWriter = AshWriter;
//# sourceMappingURL=writer.js.map