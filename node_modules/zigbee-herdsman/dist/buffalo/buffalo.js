"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buffalo = void 0;
const zspec_1 = require("../zspec");
class Buffalo {
    position;
    buffer;
    constructor(buffer, position = 0) {
        this.position = position;
        this.buffer = buffer;
    }
    getPosition() {
        return this.position;
    }
    /**
     * Set the position of the internal position tracker.
     * @param position
     */
    setPosition(position) {
        this.position = position;
    }
    getBuffer() {
        return this.buffer;
    }
    getWritten() {
        return this.buffer.subarray(0, this.position);
    }
    isMore() {
        return this.position < this.buffer.length;
    }
    writeUInt8(value) {
        this.position = this.buffer.writeUInt8(value, this.position);
    }
    readUInt8() {
        const value = this.buffer.readUInt8(this.position);
        this.position++;
        return value;
    }
    writeUInt16(value) {
        this.position = this.buffer.writeUInt16LE(value, this.position);
    }
    readUInt16() {
        const value = this.buffer.readUInt16LE(this.position);
        this.position += 2;
        return value;
    }
    writeUInt24(value) {
        this.position = this.buffer.writeUIntLE(value, this.position, 3);
    }
    readUInt24() {
        const value = this.buffer.readUIntLE(this.position, 3);
        this.position += 3;
        return value;
    }
    writeUInt32(value) {
        this.position = this.buffer.writeUInt32LE(value, this.position);
    }
    readUInt32() {
        const value = this.buffer.readUInt32LE(this.position);
        this.position += 4;
        return value;
    }
    writeUInt40(value) {
        this.position = this.buffer.writeUIntLE(value, this.position, 5);
    }
    readUInt40() {
        const value = this.buffer.readUIntLE(this.position, 5);
        this.position += 5;
        return value;
    }
    writeUInt48(value) {
        this.position = this.buffer.writeUIntLE(value, this.position, 6);
    }
    readUInt48() {
        const value = this.buffer.readUIntLE(this.position, 6);
        this.position += 6;
        return value;
    }
    writeUInt56(value) {
        this.position = this.buffer.writeUIntLE(Number(value & 0xffffffffffffn), this.position, 6);
        this.position = this.buffer.writeUInt8(Number(value >> 48n), this.position);
    }
    readUInt56() {
        const low = this.buffer.readUIntLE(this.position, 6);
        const high = this.buffer.readUInt8(this.position + 6);
        this.position += 7;
        return (BigInt(high) << 48n) | BigInt(low);
    }
    writeUInt64(value) {
        this.position = this.buffer.writeBigUInt64LE(value, this.position);
    }
    readUInt64() {
        const value = this.buffer.readBigUInt64LE(this.position);
        this.position += 8;
        return value;
    }
    writeInt8(value) {
        this.position = this.buffer.writeInt8(value, this.position);
    }
    readInt8() {
        const value = this.buffer.readInt8(this.position);
        this.position++;
        return value;
    }
    writeInt16(value) {
        this.position = this.buffer.writeInt16LE(value, this.position);
    }
    readInt16() {
        const value = this.buffer.readInt16LE(this.position);
        this.position += 2;
        return value;
    }
    writeInt24(value) {
        this.position = this.buffer.writeIntLE(value, this.position, 3);
    }
    readInt24() {
        const value = this.buffer.readIntLE(this.position, 3);
        this.position += 3;
        return value;
    }
    writeInt32(value) {
        this.position = this.buffer.writeInt32LE(value, this.position);
    }
    readInt32() {
        const value = this.buffer.readInt32LE(this.position);
        this.position += 4;
        return value;
    }
    writeInt40(value) {
        this.position = this.buffer.writeIntLE(value, this.position, 5);
    }
    readInt40() {
        const value = this.buffer.readIntLE(this.position, 5);
        this.position += 5;
        return value;
    }
    writeInt48(value) {
        this.position = this.buffer.writeIntLE(value, this.position, 6);
    }
    readInt48() {
        const value = this.buffer.readIntLE(this.position, 6);
        this.position += 6;
        return value;
    }
    writeInt56(value) {
        const unsignedValue = value < 0n ? (1n << 56n) + value : value;
        this.position = this.buffer.writeUIntLE(Number(unsignedValue & 0xffffffffffffn), this.position, 6);
        this.position = this.buffer.writeUInt8(Number(unsignedValue >> 48n), this.position);
    }
    readInt56() {
        const low = BigInt(this.buffer.readUIntLE(this.position, 6));
        const high = BigInt(this.buffer.readUInt8(this.position + 6));
        let result = (high << 48n) | low;
        if (high & 0x80n) {
            result -= 1n << 56n;
        }
        this.position += 7;
        return result;
    }
    writeInt64(value) {
        this.position = this.buffer.writeBigInt64LE(value, this.position);
    }
    readInt64() {
        const value = this.buffer.readBigInt64LE(this.position);
        this.position += 8;
        return value;
    }
    writeFloatLE(value) {
        this.position = this.buffer.writeFloatLE(value, this.position);
    }
    readFloatLE() {
        const value = this.buffer.readFloatLE(this.position);
        this.position += 4;
        return value;
    }
    writeDoubleLE(value) {
        this.position = this.buffer.writeDoubleLE(value, this.position);
    }
    readDoubleLE() {
        const value = this.buffer.readDoubleLE(this.position);
        this.position += 8;
        return value;
    }
    writeIeeeAddr(value /*TODO: EUI64*/) {
        this.writeUInt32(Number.parseInt(value.slice(10), 16));
        this.writeUInt32(Number.parseInt(value.slice(2, 10), 16));
    }
    readIeeeAddr() {
        return zspec_1.Utils.eui64LEBufferToHex(this.readBuffer(8));
    }
    writeBuffer(values, length) {
        if (values.length !== length) {
            throw new Error(`Length of values: '${values}' is not consitent with expected length '${length}'`);
        }
        if (values.length === 0) {
            return;
        }
        if (!(values instanceof Buffer)) {
            values = Buffer.from(values);
        }
        this.position += values.copy(this.buffer, this.position);
    }
    readBuffer(length) {
        const value = this.buffer.subarray(this.position, this.position + length);
        this.position += length;
        return value;
    }
    writeListUInt8(values) {
        for (const value of values) {
            this.writeUInt8(value);
        }
    }
    readListUInt8(length) {
        const value = [];
        for (let i = 0; i < length; i++) {
            value.push(this.readUInt8());
        }
        return value;
    }
    writeListUInt16(values) {
        for (const value of values) {
            this.writeUInt16(value);
        }
    }
    readListUInt16(length) {
        const value = [];
        for (let i = 0; i < length; i++) {
            value.push(this.readUInt16());
        }
        return value;
    }
    writeListUInt24(values) {
        for (const value of values) {
            this.writeUInt24(value);
        }
    }
    readListUInt24(length) {
        const value = [];
        for (let i = 0; i < length; i++) {
            value.push(this.readUInt24());
        }
        return value;
    }
    writeListUInt32(values) {
        for (const value of values) {
            this.writeUInt32(value);
        }
    }
    readListUInt32(length) {
        const value = [];
        for (let i = 0; i < length; i++) {
            value.push(this.readUInt32());
        }
        return value;
    }
    writeUtf8String(value) {
        if (value === "") {
            // identified as "empty string", no need to write anything
            return;
        }
        this.position += this.buffer.write(value, this.position, "utf8");
    }
    readUtf8String(length) {
        if (length === 0) {
            // is identified as "empty string", no need to read anything
            return "";
        }
        const value = this.buffer.toString("utf8", this.position, this.position + length);
        this.position += length;
        return value;
    }
}
exports.Buffalo = Buffalo;
exports.default = Buffalo;
//# sourceMappingURL=buffalo.js.map