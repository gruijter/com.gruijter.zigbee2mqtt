"use strict";
/* v8 ignore start */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialPort = void 0;
const bindings_cpp_1 = require("@serialport/bindings-cpp");
// This file was copied from https://github.com/serialport/node-serialport/blob/master/packages/serialport/lib/serialport.ts.
const stream_1 = require("@serialport/stream");
const DetectedBinding = (0, bindings_cpp_1.autoDetect)();
class SerialPort extends stream_1.SerialPortStream {
    static list = DetectedBinding.list;
    static binding = DetectedBinding;
    constructor(options, openCallback) {
        const opts = {
            binding: DetectedBinding,
            ...options,
        };
        super(opts, openCallback);
    }
    async asyncOpen() {
        return await new Promise((resolve, reject) => {
            this.open((err) => (err ? reject(err) : resolve()));
        });
    }
    async asyncClose() {
        return await new Promise((resolve, reject) => {
            this.close((err) => (err ? reject(err) : resolve()));
        });
    }
    async asyncFlush() {
        return await new Promise((resolve, reject) => {
            this.flush((err) => (err ? reject(err) : resolve()));
        });
    }
    async asyncFlushAndClose() {
        await this.asyncFlush();
        await this.asyncClose();
    }
    async asyncGet() {
        return await new Promise((resolve, reject) => {
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.get((err, options) => (err ? reject(err) : resolve(options)));
        });
    }
    async asyncSet(options) {
        return await new Promise((resolve, reject) => {
            this.set(options, (err) => (err ? reject(err) : resolve()));
        });
    }
}
exports.SerialPort = SerialPort;
//# sourceMappingURL=serialPort.js.map