"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigUInt64ToHexBE = bigUInt64ToHexBE;
exports.bigUInt64ToBufferLE = bigUInt64ToBufferLE;
exports.bigUInt64ToBufferBE = bigUInt64ToBufferBE;
/**
 * @param value 64-bit bigint
 * @returns 16-length hex string in big-endian
 */
function bigUInt64ToHexBE(value) {
    return value.toString(16).padStart(16, "0");
}
/**
 * @param value 64-bit bigint
 * @returns 8-bytelength buffer in little-endian
 */
function bigUInt64ToBufferLE(value) {
    const b = Buffer.allocUnsafe(8);
    b.writeBigUInt64LE(value, 0);
    return b;
}
/**
 * @param value 64-bit bigint
 * @returns 8-bytelength buffer in big-endian
 */
function bigUInt64ToBufferBE(value) {
    const b = Buffer.allocUnsafe(8);
    b.writeBigUInt64BE(value, 0);
    return b;
}
//# sourceMappingURL=utils.js.map