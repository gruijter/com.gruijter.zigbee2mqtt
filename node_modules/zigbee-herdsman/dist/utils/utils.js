"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumberArray = isNumberArray;
exports.isNumberArrayOfLength = isNumberArrayOfLength;
exports.assertString = assertString;
exports.isObjectEmpty = isObjectEmpty;
function isNumberArray(value) {
    return Array.isArray(value) && value.every((item) => typeof item === "number");
}
function isNumberArrayOfLength(value, length) {
    return isNumberArray(value) && value.length === length;
}
function assertString(input) {
    if (typeof input !== "string") {
        throw new Error("Input must be a string!");
    }
}
function isObjectEmpty(object) {
    // much faster than checking `Object.keys(object).length`
    for (const _k in object)
        return false;
    return true;
}
//# sourceMappingURL=utils.js.map