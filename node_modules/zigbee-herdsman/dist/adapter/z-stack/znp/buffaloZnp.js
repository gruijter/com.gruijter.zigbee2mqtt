"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const buffalo_1 = require("../../../buffalo");
const parameterType_1 = __importDefault(require("./parameterType"));
class BuffaloZnp extends buffalo_1.Buffalo {
    readListNetwork(length) {
        const value = [];
        for (let i = 0; i < length; i++) {
            const neightborPanId = this.readUInt16();
            const logicalChannel = this.readUInt8();
            const value1 = this.readUInt8();
            const value2 = this.readUInt8();
            const permitJoin = this.readUInt8();
            value.push({
                neightborPanId,
                logicalChannel,
                stackProfile: value1 & 0x0f,
                zigbeeVersion: (value1 & 0xf0) >> 4,
                beaconOrder: value2 & 0x0f,
                superFrameOrder: (value2 & 0xf0) >> 4,
                permitJoin,
            });
        }
        return value;
    }
    // biome-ignore lint/suspicious/noExplicitAny: API
    write(type, value, options) {
        switch (type) {
            case parameterType_1.default.UINT8: {
                this.writeUInt8(value);
                break;
            }
            case parameterType_1.default.UINT16: {
                this.writeUInt16(value);
                break;
            }
            case parameterType_1.default.UINT32: {
                this.writeUInt32(value);
                break;
            }
            case parameterType_1.default.IEEEADDR: {
                this.writeIeeeAddr(value);
                break;
            }
            case parameterType_1.default.BUFFER: {
                this.writeBuffer(value, options.length ?? value.length);
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
                this.writeListUInt16(value);
                break;
            }
            // NOTE: not writable
            // case ParameterType.LIST_NETWORK:
            case parameterType_1.default.INT8: {
                this.writeInt8(value);
                break;
            }
            default: {
                throw new Error(`Write for '${type}' not available`);
            }
        }
    }
    // biome-ignore lint/suspicious/noExplicitAny: API
    read(type, options) {
        switch (type) {
            case parameterType_1.default.UINT8: {
                return this.readUInt8();
            }
            case parameterType_1.default.UINT16: {
                return this.readUInt16();
            }
            case parameterType_1.default.UINT32: {
                return this.readUInt32();
            }
            case parameterType_1.default.IEEEADDR: {
                return this.readIeeeAddr();
            }
            case parameterType_1.default.BUFFER: {
                if (options.length == null) {
                    throw new Error("Cannot read BUFFER without length option specified");
                }
                return this.readBuffer(options.length);
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
                if (options.length == null) {
                    throw new Error("Cannot read LIST_UINT8 without length option specified");
                }
                return this.readListUInt8(options.length);
            }
            case parameterType_1.default.LIST_UINT16: {
                if (options.length == null) {
                    throw new Error("Cannot read LIST_UINT16 without length option specified");
                }
                return this.readListUInt16(options.length);
            }
            case parameterType_1.default.LIST_NETWORK: {
                if (options.length == null) {
                    throw new Error("Cannot read LIST_NETWORK without length option specified");
                }
                return this.readListNetwork(options.length);
            }
            case parameterType_1.default.INT8: {
                return this.readInt8();
            }
            default: {
                throw new Error(`Read for '${type}' not available`);
            }
        }
    }
}
exports.default = BuffaloZnp;
//# sourceMappingURL=buffaloZnp.js.map