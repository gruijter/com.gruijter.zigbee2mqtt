"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZdoStatusError = void 0;
const status_1 = require("./definition/status");
class ZdoStatusError extends Error {
    code;
    constructor(code) {
        super(`Status '${status_1.Status[code]}'`);
        this.code = code;
    }
}
exports.ZdoStatusError = ZdoStatusError;
//# sourceMappingURL=zdoStatusError.js.map