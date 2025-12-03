"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EzspError = void 0;
const enums_1 = require("./enums");
class EzspError extends Error {
    code;
    constructor(code) {
        super(enums_1.EzspStatus[code]);
        this.code = code;
    }
}
exports.EzspError = EzspError;
//# sourceMappingURL=ezspError.js.map