"use strict";
/* v8 ignore start */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZBOSSReader = void 0;
const node_stream_1 = require("node:stream");
const logger_1 = require("../../utils/logger");
const consts_1 = require("./consts");
const NS = "zh:zboss:read";
class ZBOSSReader extends node_stream_1.Transform {
    buffer;
    constructor(opts) {
        super(opts);
        this.buffer = Buffer.alloc(0);
    }
    _transform(chunk, _encoding, cb) {
        let data = Buffer.concat([this.buffer, chunk]);
        let position;
        logger_1.logger.debug(`<<<  DATA [${chunk.toString("hex")}]`, NS);
        // SIGNATURE - start of package
        // biome-ignore lint/suspicious/noAssignInExpressions: shorter
        while ((position = data.indexOf(consts_1.SIGNATURE)) !== -1) {
            // need for read length
            if (data.length > position + 3) {
                const len = data.readUInt16LE(position + 1);
                if (data.length >= position + 1 + len) {
                    const frame = data.subarray(position + 1, position + 1 + len);
                    logger_1.logger.debug(`<<< FRAME [${frame.toString("hex")}]`, NS);
                    // emit the frame via 'data' event
                    this.push(frame);
                    // if position not 1 - try to convert buffer before position to text - chip console output
                    if (position > 1) {
                        logger_1.logger.debug(`<<< CONSOLE:\n\r${data.subarray(0, position - 1).toString()}`, NS);
                    }
                    // remove the frame from internal buffer (set below)
                    data = data.subarray(position + 1 + len);
                    if (data.length)
                        logger_1.logger.debug(`<<< TAIL [${data.toString("hex")}]`, NS);
                }
                else {
                    logger_1.logger.debug(`<<< Not enough data. Length=${data.length}, frame length=${len}. Waiting`, NS);
                    break;
                }
            }
            else {
                logger_1.logger.debug(`<<< Not enough data. Length=${data.length}. Waiting`, NS);
                break;
            }
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
exports.ZBOSSReader = ZBOSSReader;
//# sourceMappingURL=reader.js.map