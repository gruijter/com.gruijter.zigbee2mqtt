"use strict";
/* v8 ignore start */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const buffalo_1 = require("../../../buffalo");
const zspec_1 = require("../../../zspec");
const utils_1 = require("../../../zspec/zdo/utils");
const constants_1 = require("./constants");
const parameterType_1 = __importDefault(require("./parameterType"));
class BuffaloZiGate extends buffalo_1.Buffalo {
    // biome-ignore lint/suspicious/noExplicitAny: API
    write(type, value, _options) {
        switch (type) {
            case parameterType_1.default.UINT8: {
                this.writeUInt8(value);
                break;
            }
            case parameterType_1.default.UINT16: {
                this.writeUInt16BE(value);
                break;
            }
            case parameterType_1.default.UINT32: {
                this.writeUInt32BE(value);
                break;
            }
            case parameterType_1.default.IEEEADDR: {
                this.writeIeeeAddrBE(value);
                break;
            }
            case parameterType_1.default.BUFFER: {
                this.writeBuffer(value, value.length);
                break;
            }
            case parameterType_1.default.BUFFER8: {
                this.writeBuffer(value, 8);
                break;
            }
            case parameterType_1.default.BUFFER16: {
                this.writeBuffer(value, 16);
                break;
            }
            case parameterType_1.default.BUFFER18: {
                this.writeBuffer(value, 18);
                break;
            }
            case parameterType_1.default.BUFFER32: {
                this.writeBuffer(value, 32);
                break;
            }
            case parameterType_1.default.BUFFER42: {
                this.writeBuffer(value, 42);
                break;
            }
            case parameterType_1.default.BUFFER100: {
                this.writeBuffer(value, 100);
                break;
            }
            case parameterType_1.default.LIST_UINT8: {
                this.writeListUInt8(value);
                break;
            }
            case parameterType_1.default.LIST_UINT16: {
                this.writeListUInt16BE(value);
                break;
            }
            case parameterType_1.default.INT8: {
                this.writeInt8(value);
                break;
            }
            case parameterType_1.default.ADDRESS_WITH_TYPE_DEPENDENCY: {
                const addressMode = this.buffer.readUInt8(this.position - 1);
                addressMode === 3 ? this.writeIeeeAddrBE(value) : this.writeUInt16BE(value);
                break;
            }
            case parameterType_1.default.RAW: {
                this.writeRaw(value);
                break;
            }
            default: {
                throw new Error(`Write for '${type}' not available`);
            }
        }
    }
    read(type, options) {
        switch (type) {
            case parameterType_1.default.UINT8: {
                return this.readUInt8();
            }
            case parameterType_1.default.UINT16: {
                return this.readUInt16BE();
            }
            case parameterType_1.default.UINT32: {
                return this.readUInt32BE();
            }
            case parameterType_1.default.IEEEADDR: {
                return this.readIeeeAddrBE();
            }
            case parameterType_1.default.BUFFER: {
                // if length option not specified, read the whole buffer
                return this.readBuffer(options.length ?? this.buffer.length);
            }
            case parameterType_1.default.BUFFER8: {
                return this.readBuffer(8);
            }
            case parameterType_1.default.BUFFER16: {
                return this.readBuffer(16);
            }
            case parameterType_1.default.BUFFER18: {
                return this.readBuffer(18);
            }
            case parameterType_1.default.BUFFER32: {
                return this.readBuffer(32);
            }
            case parameterType_1.default.BUFFER42: {
                return this.readBuffer(42);
            }
            case parameterType_1.default.BUFFER100: {
                return this.readBuffer(100);
            }
            case parameterType_1.default.LIST_UINT8: {
                return this.readListUInt8(options.length ?? 0); // XXX: should always be valid?
            }
            case parameterType_1.default.LIST_UINT16: {
                return this.readListUInt16BE(options.length ?? 0); // XXX: should always be valid?
            }
            case parameterType_1.default.INT8: {
                return this.readInt8();
            }
            case parameterType_1.default.MACCAPABILITY: {
                return (0, utils_1.getMacCapFlags)(this.readUInt8());
            }
            case parameterType_1.default.ADDRESS_WITH_TYPE_DEPENDENCY: {
                const addressMode = this.buffer.readUInt8(this.position - 1);
                return addressMode === 3 ? this.readIeeeAddrBE() : this.readUInt16BE();
            }
            case parameterType_1.default.BUFFER_RAW: {
                const buffer = this.buffer.subarray(this.position);
                this.position += buffer.length;
                return buffer;
            }
            case parameterType_1.default.STRING: {
                const buffer = this.buffer.subarray(this.position);
                this.position += buffer.length;
                return unescape(buffer.toString());
            }
            case parameterType_1.default.LOG_LEVEL: {
                return constants_1.LogLevel[this.readUInt8()];
            }
            case parameterType_1.default.MAYBE_UINT8: {
                return this.isMore() ? this.readUInt8() : null;
            }
        }
        throw new Error(`Read for '${type}' not available`);
    }
    writeRaw(value) {
        this.buffer.set(value, this.position);
        this.position += value.length;
    }
    readUInt16BE() {
        const value = this.buffer.readUInt16BE(this.position);
        this.position += 2;
        return value;
    }
    writeUInt16BE(value) {
        this.position = this.buffer.writeUInt16BE(value, this.position);
    }
    readUInt32BE() {
        const value = this.buffer.readUInt32BE(this.position);
        this.position += 4;
        return value;
    }
    writeUInt32BE(value) {
        this.position = this.buffer.writeUInt32BE(value, this.position);
    }
    readListUInt16BE(length) {
        const value = [];
        for (let i = 0; i < length; i++) {
            value.push(this.readUInt16BE());
        }
        return value;
    }
    writeListUInt16BE(values) {
        for (const value of values) {
            this.writeUInt16BE(value);
        }
    }
    readIeeeAddrBE() {
        return zspec_1.Utils.eui64BEBufferToHex(this.readBuffer(8));
    }
    writeIeeeAddrBE(value /*TODO: EUI64*/) {
        this.writeUInt32BE(Number.parseInt(value.slice(2, 10), 16));
        this.writeUInt32BE(Number.parseInt(value.slice(10), 16));
    }
}
exports.default = BuffaloZiGate;
//# sourceMappingURL=buffaloZiGate.js.map