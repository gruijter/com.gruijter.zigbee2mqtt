"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ZclTransactionSequenceNumber {
    sequence = -1;
    get current() {
        return this.sequence;
    }
    next() {
        this.sequence = (this.sequence + 1) % 256;
        return this.sequence;
    }
}
exports.default = new ZclTransactionSequenceNumber();
//# sourceMappingURL=zclTransactionSequenceNumber.js.map