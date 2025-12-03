"use strict";
/* v8 ignore start */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AshParser = void 0;
const node_stream_1 = require("node:stream");
// import {logger} from '../../../utils/logger';
const enums_1 = require("./enums");
// const NS = 'zh:ember:uart:ash:parser';
class AshParser extends node_stream_1.Transform {
    buffer;
    constructor(opts) {
        super(opts);
        this.buffer = Buffer.alloc(0);
    }
    _transform(chunk, _encoding, cb) {
        let data = Buffer.concat([this.buffer, chunk]);
        let position;
        // biome-ignore lint/suspicious/noAssignInExpressions: shorter
        while ((position = data.indexOf(enums_1.AshReservedByte.FLAG)) !== -1) {
            // emit the frame via 'data' event
            const frame = data.subarray(0, position + 1);
            // expensive and very verbose, enable locally only if necessary
            // logger.debug(`<<<< [FRAME raw=${frame.toString('hex')}]`, NS);
            this.push(frame);
            // remove the frame from internal buffer (set below)
            data = data.subarray(position + 1);
        }
        this.buffer = data;
        cb();
    }
    _flush(cb) {
        this.push(this.buffer);
        this.buffer = Buffer.alloc(0);
        cb();
    }
}
exports.AshParser = AshParser;
//# sourceMappingURL=parser.js.map