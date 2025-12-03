"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchZdoBuffaloBE = void 0;
const buffaloZdo_1 = require("../../../zspec/zdo/buffaloZdo");
class ZiGateZdoBuffalo extends buffaloZdo_1.BuffaloZdo {
    writeUInt16(value) {
        this.position = this.buffer.writeUInt16BE(value, this.position);
    }
    writeUInt32(value) {
        this.position = this.buffer.writeUInt32BE(value, this.position);
    }
    writeIeeeAddr(value /*TODO: EUI64*/) {
        this.writeUInt32(Number.parseInt(value.slice(2, 10), 16));
        this.writeUInt32(Number.parseInt(value.slice(10), 16));
    }
}
/**
 * Patch BuffaloZdo to use Big Endian variants.
 */
const patchZdoBuffaloBE = () => {
    buffaloZdo_1.BuffaloZdo.prototype.writeUInt16 = ZiGateZdoBuffalo.prototype.writeUInt16;
    buffaloZdo_1.BuffaloZdo.prototype.writeUInt32 = ZiGateZdoBuffalo.prototype.writeUInt32;
    buffaloZdo_1.BuffaloZdo.prototype.writeIeeeAddr = ZiGateZdoBuffalo.prototype.writeIeeeAddr;
};
exports.patchZdoBuffaloBE = patchZdoBuffaloBE;
//# sourceMappingURL=patchZdoBuffaloBE.js.map