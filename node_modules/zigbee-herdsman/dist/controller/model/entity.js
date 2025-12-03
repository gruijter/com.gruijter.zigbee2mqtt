"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const node_events_1 = __importDefault(require("node:events"));
class Entity extends node_events_1.default.EventEmitter {
    static database;
    static adapter;
    static injectDatabase(database) {
        Entity.database = database;
    }
    static injectAdapter(adapter) {
        Entity.adapter = adapter;
    }
}
exports.Entity = Entity;
exports.default = Entity;
//# sourceMappingURL=entity.js.map