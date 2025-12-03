"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasValue = hasValue;
exports.getValue = getValue;
exports.putValue = putValue;
exports.clearValue = clearValue;
exports.clear = clear;
const utils_1 = require("./utils");
// biome-ignore lint/suspicious/noExplicitAny: generic
const store = new Map();
function getEntityKey(entity) {
    if (typeof entity === "string") {
        return entity;
    }
    if ((0, utils_1.isGroup)(entity)) {
        return entity.groupID;
    }
    if ((0, utils_1.isEndpoint)(entity)) {
        return `${entity.deviceIeeeAddress}_${entity.ID}`;
    }
    if ((0, utils_1.isDevice)(entity)) {
        return entity.ieeeAddr;
    }
    throw new Error("Invalid entity type");
}
function hasValue(entity, key) {
    const entityKey = getEntityKey(entity);
    const entry = store.get(entityKey);
    return entry !== undefined && key in entry;
}
// biome-ignore lint/suspicious/noExplicitAny: generic
function getValue(entity, key, fallback = undefined) {
    const entityKey = getEntityKey(entity);
    const entry = store.get(entityKey);
    if (entry !== undefined && key in entry) {
        return entry[key];
    }
    return fallback;
}
function putValue(entity, key, value) {
    const entityKey = getEntityKey(entity);
    let entry = store.get(entityKey);
    if (entry === undefined) {
        entry = {};
        store.set(entityKey, entry);
    }
    entry[key] = value;
}
function clearValue(entity, key) {
    const entityKey = getEntityKey(entity);
    const entry = store.get(entityKey);
    if (entry !== undefined) {
        delete entry[key];
    }
}
function clear() {
    store.clear();
}
//# sourceMappingURL=store.js.map