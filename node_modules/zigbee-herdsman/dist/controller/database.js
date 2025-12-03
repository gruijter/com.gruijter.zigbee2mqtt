"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const logger_1 = require("../utils/logger");
const NS = "zh:controller:database";
class Database {
    entries;
    path;
    maxId;
    constructor(entries, path) {
        this.entries = entries;
        this.maxId = Math.max(...Object.keys(entries).map((t) => Number(t)), 0);
        this.path = path;
    }
    static open(path) {
        const entries = {};
        if (node_fs_1.default.existsSync(path)) {
            const file = node_fs_1.default.readFileSync(path, "utf-8");
            for (const row of file.split("\n")) {
                if (!row) {
                    continue;
                }
                try {
                    const json = JSON.parse(row);
                    if (json.id != null) {
                        entries[json.id] = json;
                    }
                }
                catch (error) {
                    logger_1.logger.error(`Corrupted database line, ignoring. ${error}`, NS);
                }
            }
        }
        return new Database(entries, path);
    }
    *getEntriesIterator(type) {
        for (const id in this.entries) {
            const entry = this.entries[id];
            if (type.includes(entry.type)) {
                yield entry;
            }
        }
    }
    insert(databaseEntry) {
        if (this.entries[databaseEntry.id]) {
            throw new Error(`DatabaseEntry with ID '${databaseEntry.id}' already exists`);
        }
        this.entries[databaseEntry.id] = databaseEntry;
        this.write();
    }
    update(databaseEntry, write) {
        if (!this.entries[databaseEntry.id]) {
            throw new Error(`DatabaseEntry with ID '${databaseEntry.id}' does not exist`);
        }
        this.entries[databaseEntry.id] = databaseEntry;
        if (write) {
            this.write();
        }
    }
    remove(id) {
        if (!this.entries[id]) {
            throw new Error(`DatabaseEntry with ID '${id}' does not exist`);
        }
        delete this.entries[id];
        this.write();
    }
    has(id) {
        return Boolean(this.entries[id]);
    }
    newID() {
        this.maxId += 1;
        return this.maxId;
    }
    write() {
        logger_1.logger.debug(`Writing database to '${this.path}'`, NS);
        let lines = "";
        for (const id in this.entries) {
            lines += `${JSON.stringify(this.entries[id])}\n`;
        }
        const tmpPath = `${this.path}.tmp`;
        try {
            // If there already exsits a database.db.tmp, rename it to database.db.tmp.<now>
            const dateTmpPath = `${tmpPath}.${new Date().toISOString().replaceAll(":", "-")}`;
            node_fs_1.default.renameSync(tmpPath, dateTmpPath);
            // If we got this far, we succeeded! Warn the user about this
            logger_1.logger.warning(`Found '${tmpPath}' when writing database, indicating past write failure; renamed it to '${dateTmpPath}'`, NS);
        }
        catch {
            // Nothing to catch; if the renameSync fails, we ignore that exception
        }
        const fd = node_fs_1.default.openSync(tmpPath, "w");
        node_fs_1.default.writeFileSync(fd, lines.slice(0, -1)); // remove last newline, no effect if empty string
        // Ensure file is on disk https://github.com/Koenkk/zigbee2mqtt/issues/11759
        node_fs_1.default.fsyncSync(fd);
        node_fs_1.default.closeSync(fd);
        node_fs_1.default.renameSync(tmpPath, this.path);
    }
}
exports.Database = Database;
exports.default = Database;
//# sourceMappingURL=database.js.map