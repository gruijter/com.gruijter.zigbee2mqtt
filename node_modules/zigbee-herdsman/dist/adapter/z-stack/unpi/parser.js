"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const stream = __importStar(require("node:stream"));
const logger_1 = require("../../../utils/logger");
const constants_1 = require("./constants");
const frame_1 = require("./frame");
const NS = "zh:zstack:unpi:parser";
class Parser extends stream.Transform {
    buffer;
    constructor() {
        super();
        this.buffer = Buffer.from([]);
    }
    _transform(chunk, _, cb) {
        logger_1.logger.debug(`<-- [${[...chunk]}]`, NS);
        this.buffer = Buffer.concat([this.buffer, chunk]);
        this.parseNext();
        cb();
    }
    parseNext() {
        logger_1.logger.debug(`--- parseNext [${[...this.buffer]}]`, NS);
        if (this.buffer.length !== 0 && this.buffer.readUInt8(0) !== constants_1.SOF) {
            // Buffer doesn't start with SOF, skip till SOF.
            const index = this.buffer.indexOf(constants_1.SOF);
            if (index !== -1) {
                this.buffer = this.buffer.slice(index, this.buffer.length);
            }
        }
        if (this.buffer.length >= constants_1.MinMessageLength && this.buffer.readUInt8(0) === constants_1.SOF) {
            const dataLength = this.buffer[constants_1.PositionDataLength];
            const fcsPosition = constants_1.DataStart + dataLength;
            const frameLength = fcsPosition + 1;
            if (this.buffer.length >= frameLength) {
                const frameBuffer = this.buffer.slice(0, frameLength);
                try {
                    const frame = frame_1.Frame.fromBuffer(dataLength, fcsPosition, frameBuffer);
                    logger_1.logger.debug(`--> parsed ${frame}`, NS);
                    this.emit("parsed", frame);
                }
                catch (error) {
                    logger_1.logger.debug(`--> error ${error}`, NS);
                }
                this.buffer = this.buffer.slice(frameLength, this.buffer.length);
                this.parseNext();
            }
        }
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map