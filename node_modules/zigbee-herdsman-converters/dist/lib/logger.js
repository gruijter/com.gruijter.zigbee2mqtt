"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.setLogger = setLogger;
exports.logger = {
    debug: (messageOrLambda, namespace) => console.debug(`${namespace}: ${typeof messageOrLambda === "function" ? messageOrLambda() : messageOrLambda}`),
    info: (messageOrLambda, namespace) => console.info(`${namespace}: ${typeof messageOrLambda === "function" ? messageOrLambda() : messageOrLambda}`),
    warning: (messageOrLambda, namespace) => console.warn(`${namespace}: ${typeof messageOrLambda === "function" ? messageOrLambda() : messageOrLambda}`),
    error: (messageOrLambda, namespace) => console.error(`${namespace}: ${typeof messageOrLambda === "function" ? messageOrLambda() : messageOrLambda}`),
};
function setLogger(l) {
    exports.logger = l;
}
//# sourceMappingURL=logger.js.map