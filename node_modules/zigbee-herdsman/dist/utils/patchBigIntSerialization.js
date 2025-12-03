"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Patch BigInt serialization which is used in e.g. Zcl payloads.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
// biome-ignore lint/suspicious/noExplicitAny: API
BigInt.prototype.toJSON = function () {
    return this.toString();
};
//# sourceMappingURL=patchBigIntSerialization.js.map