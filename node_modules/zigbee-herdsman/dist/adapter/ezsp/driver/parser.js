"use strict";
/* v8 ignore start */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const stream = __importStar(require("node:stream"));
const logger_1 = require("../../../utils/logger");
const consts = __importStar(require("./consts"));
const frame_1 = __importDefault(require("./frame"));
const NS = "zh:ezsp:uart";
class Parser extends stream.Transform {
    tail;
    constructor() {
        super();
        this.tail = [];
    }
    _transform(chunk, _, cb) {
        if (chunk.indexOf(consts.CANCEL) >= 0) {
            this.reset();
            chunk = chunk.subarray(chunk.lastIndexOf(consts.CANCEL) + 1);
        }
        if (chunk.indexOf(consts.SUBSTITUTE) >= 0) {
            this.reset();
            chunk = chunk.subarray(chunk.indexOf(consts.FLAG) + 1);
        }
        logger_1.logger.debug(`<-- [${chunk.toString("hex")}]`, NS);
        let delimiterPlace = chunk.indexOf(consts.FLAG);
        while (delimiterPlace >= 0) {
            const buffer = chunk.subarray(0, delimiterPlace + 1);
            const frameBuffer = Buffer.from([...this.unstuff(Buffer.concat([...this.tail, buffer]))]);
            this.reset();
            try {
                const frame = frame_1.default.fromBuffer(frameBuffer);
                if (frame) {
                    this.emit("parsed", frame);
                }
            }
            catch (error) {
                logger_1.logger.debug(`<-- error ${error}`, NS);
            }
            chunk = chunk.subarray(delimiterPlace + 1);
            delimiterPlace = chunk.indexOf(consts.FLAG);
        }
        this.tail.push(chunk);
        cb();
    }
    *unstuff(buffer) {
        /* Unstuff (unescape) a buffer after receipt */
        let escaped = false;
        for (const byte of buffer) {
            if (escaped) {
                yield byte ^ consts.STUFF;
                escaped = false;
            }
            else {
                if (byte === consts.ESCAPE) {
                    escaped = true;
                }
                else if (byte === consts.XOFF || byte === consts.XON) {
                    // skip
                }
                else {
                    yield byte;
                }
            }
        }
    }
    reset() {
        // clear tail
        this.tail.length = 0;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map