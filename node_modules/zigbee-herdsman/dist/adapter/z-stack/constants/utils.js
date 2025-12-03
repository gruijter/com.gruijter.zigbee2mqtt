"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannelMask = getChannelMask;
exports.statusDescription = statusDescription;
const common_1 = require("./common");
function getChannelMask(channels) {
    const value = channels.reduce((mask, channel) => mask | (1 << channel), 0);
    return [value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff];
}
function statusDescription(code) {
    const hex = `0x${code.toString(16).padStart(2, "0")}`;
    return `(${hex}: ${common_1.ZnpCommandStatus[code] || "UNKNOWN"})`;
}
//# sourceMappingURL=utils.js.map