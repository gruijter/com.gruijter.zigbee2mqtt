"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTcpPath = isTcpPath;
exports.parseTcpPath = parseTcpPath;
exports.readBackup = readBackup;
const node_fs_1 = require("node:fs");
function isTcpPath(path) {
    // tcp path must be:
    // tcp://<host>:<port>
    const regex = /^(?:tcp:\/\/)[\w.-]+[:][\d]+$/gm;
    return regex.test(path);
}
function parseTcpPath(path) {
    // built-in extra validation
    const info = new URL(path);
    return {
        host: info.hostname,
        port: Number(info.port),
    };
}
function readBackup(path) {
    if (!(0, node_fs_1.existsSync)(path)) {
        return undefined;
    }
    try {
        return JSON.parse((0, node_fs_1.readFileSync)(path).toString());
    }
    catch (error) {
        throw new Error(`[BACKUP] Coordinator backup is corrupted. This can happen due to filesystem corruption. To re-create the backup, delete '${path}' and start again. (${error.stack})`);
    }
}
//# sourceMappingURL=utils.js.map