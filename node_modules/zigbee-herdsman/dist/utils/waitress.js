"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Waitress = void 0;
class Waitress {
    waiters;
    validator;
    timeoutFormatter;
    currentID;
    constructor(validator, timeoutFormatter) {
        this.waiters = new Map();
        this.timeoutFormatter = timeoutFormatter;
        this.validator = validator;
        this.currentID = 0;
    }
    clear() {
        for (const [, waiter] of this.waiters) {
            clearTimeout(waiter.timer);
        }
        this.waiters.clear();
    }
    resolve(payload) {
        return this.forEachMatching(payload, (waiter) => waiter.resolve(payload));
    }
    reject(payload, message) {
        return this.forEachMatching(payload, (waiter) => waiter.reject(new Error(message)));
    }
    remove(id) {
        const waiter = this.waiters.get(id);
        if (waiter) {
            if (!waiter.timedout && waiter.timer) {
                clearTimeout(waiter.timer);
            }
            this.waiters.delete(id);
        }
    }
    waitFor(matcher, timeout) {
        this.currentID += 1;
        const ID = this.currentID;
        const promise = new Promise((resolve, reject) => {
            const object = { matcher, resolve, reject, timedout: false, resolved: false, ID };
            this.waiters.set(ID, object);
        });
        const start = () => {
            const waiter = this.waiters.get(ID);
            if (waiter && !waiter.resolved && !waiter.timer) {
                // Capture the stack trace from the caller of start()
                const error = new Error(this.timeoutFormatter(matcher, timeout));
                Error.captureStackTrace(error);
                waiter.timer = setTimeout(() => {
                    waiter.timedout = true;
                    waiter.reject(error);
                }, timeout);
            }
            return { promise, ID };
        };
        return { ID, start };
    }
    forEachMatching(payload, action) {
        let foundMatching = false;
        for (const [index, waiter] of this.waiters.entries()) {
            if (waiter.timedout) {
                this.waiters.delete(index);
            }
            else if (this.validator(payload, waiter.matcher)) {
                clearTimeout(waiter.timer);
                waiter.resolved = true;
                this.waiters.delete(index);
                action(waiter);
                foundMatching = true;
            }
        }
        return foundMatching;
    }
}
exports.Waitress = Waitress;
//# sourceMappingURL=waitress.js.map