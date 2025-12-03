"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMtCmdAreqZdo = isMtCmdAreqZdo;
exports.isMtCmdSreqZdo = isMtCmdSreqZdo;
const constants_1 = require("../unpi/constants");
function isMtCmdAreqZdo(cmd) {
    return cmd.type === constants_1.Type.AREQ && "zdoClusterId" in cmd;
}
function isMtCmdSreqZdo(cmd) {
    return cmd.type === constants_1.Type.SREQ && "zdoClusterId" in cmd;
}
//# sourceMappingURL=utils.js.map