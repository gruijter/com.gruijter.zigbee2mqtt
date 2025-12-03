"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZclStatusError = void 0;
const status_1 = require("./definition/status");
class ZclStatusError extends Error {
    code;
    constructor(code) {
        super(`Status '${status_1.Status[code]}'`);
        this.code = code;
    }
}
exports.ZclStatusError = ZclStatusError;
//# sourceMappingURL=zclStatusError.js.map