"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = wait;
function wait(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), milliseconds);
    });
}
//# sourceMappingURL=wait.js.map