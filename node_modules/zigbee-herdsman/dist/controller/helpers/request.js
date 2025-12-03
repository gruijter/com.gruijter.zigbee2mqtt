"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
// biome-ignore lint/suspicious/noExplicitAny: API
class Request {
    static defaultSendPolicy = {
        0: "keep-payload", // Read Attributes
        1: "immediate", // Read Attributes Response
        2: "keep-command", // Write Attributes
        3: "keep-cmd-undiv", // Write Attributes Undivided
        4: "immediate", // Write Attributes Response
        5: "keep-command", // Write Attributes No Response
        6: "keep-payload", // Configure Reporting
        7: "immediate", // Configure Reporting Response
        8: "keep-payload", // Read Reporting Configuration
        9: "immediate", // Read Reporting Configuration Response
        10: "keep-payload", // Report attributes
        11: "immediate", // Default Response
        12: "keep-payload", // Discover Attributes
        13: "immediate", // Discover Attributes Response
        14: "keep-payload", // Read Attributes Structured
        15: "keep-payload", // Write Attributes Structured
        16: "immediate", // Write Attributes Structured response
        17: "keep-payload", // Discover Commands Received
        18: "immediate", // Discover Commands Received Response
        19: "keep-payload", // Discover Commands Generated
        20: "immediate", // Discover Commands Generated Response
        21: "keep-payload", // Discover Attributes Extended
        22: "immediate", // Discover Attributes Extended Response
    };
    func;
    frame;
    expires;
    sendPolicy;
    resolveQueue;
    rejectQueue;
    lastError;
    constructor(func, frame, timeout, sendPolicy, lastError, resolve, reject) {
        this.func = func;
        this.frame = frame;
        this.expires = timeout + Date.now();
        this.sendPolicy = sendPolicy ?? (!frame.command ? undefined : Request.defaultSendPolicy[frame.command.ID]);
        this.resolveQueue = resolve === undefined ? [] : new Array(resolve);
        this.rejectQueue = reject === undefined ? [] : new Array(reject);
        this.lastError = lastError ?? Error("Request rejected before first send");
    }
    moveCallbacks(from) {
        this.resolveQueue = this.resolveQueue.concat(from.resolveQueue);
        this.rejectQueue = this.rejectQueue.concat(from.rejectQueue);
        from.resolveQueue.length = 0;
        from.rejectQueue.length = 0;
    }
    addCallbacks(resolve, reject) {
        this.resolveQueue.push(resolve);
        this.rejectQueue.push(reject);
    }
    reject(error) {
        for (const el of this.rejectQueue) {
            el(error ?? this.lastError);
        }
        this.rejectQueue.length = 0;
    }
    resolve(value) {
        for (const el of this.resolveQueue) {
            el(value);
        }
        this.resolveQueue.length = 0;
    }
    async send() {
        try {
            const ret = await this.func();
            return ret;
        }
        catch (error) {
            this.lastError = error;
            throw error;
        }
    }
}
exports.Request = Request;
exports.default = Request;
//# sourceMappingURL=request.js.map