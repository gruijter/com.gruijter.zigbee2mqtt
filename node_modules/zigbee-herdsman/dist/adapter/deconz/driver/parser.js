"use strict";
/* v8 ignore start */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_stream_1 = require("node:stream");
const slip_1 = __importDefault(require("slip"));
const logger_1 = require("../../../utils/logger");
const NS = "zh:deconz:driver:parser";
class Parser extends node_stream_1.Transform {
    decoder;
    constructor() {
        super();
        this.onMessage = this.onMessage.bind(this);
        this.onError = this.onError.bind(this);
        this.decoder = new slip_1.default.Decoder({
            onMessage: this.onMessage,
            onError: this.onError,
            maxMessageSize: 1000000,
            bufferSize: 2048,
        });
    }
    onMessage(message) {
        //logger.debug(`message received: ${message}`, NS);
        this.emit("parsed", message);
    }
    onError(_, error) {
        logger_1.logger.debug(`<-- error '${error}'`, NS);
    }
    _transform(chunk, _, cb) {
        //logger.debug(`<-- [${[...chunk]}]`, NS);
        this.decoder.decode(chunk);
        //logger.debug(`<-- [${[...chunk]}]`, NS);
        cb();
    }
}
exports.default = Parser;
//# sourceMappingURL=parser.js.map