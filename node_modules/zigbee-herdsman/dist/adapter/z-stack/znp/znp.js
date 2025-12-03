"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Znp = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const node_events_1 = __importDefault(require("node:events"));
const node_net_1 = require("node:net");
const utils_1 = require("../../../utils");
const logger_1 = require("../../../utils/logger");
const zdo_1 = require("../../../zspec/zdo");
const serialPort_1 = require("../../serialPort");
const utils_2 = require("../../utils");
const Constants = __importStar(require("../constants"));
const unpi_1 = require("../unpi");
const constants_1 = require("../unpi/constants");
const definition_1 = __importDefault(require("./definition"));
const utils_3 = require("./utils");
const zpiObject_1 = require("./zpiObject");
const { COMMON: { ZnpCommandStatus }, Utils: { statusDescription }, } = Constants;
const timeouts = {
    SREQ: 6000,
    reset: 30000,
    default: 10000,
};
const NS = "zh:zstack:znp";
class Znp extends node_events_1.default.EventEmitter {
    path;
    baudRate;
    rtscts;
    serialPort;
    socketPort;
    unpiWriter;
    unpiParser;
    initialized;
    queue;
    waitress;
    constructor(path, baudRate, rtscts) {
        super();
        this.path = path;
        this.baudRate = typeof baudRate === "number" ? baudRate : 115200;
        this.rtscts = typeof rtscts === "boolean" ? rtscts : false;
        this.initialized = false;
        this.queue = new utils_1.Queue();
        this.waitress = new utils_1.Waitress(this.waitressValidator, this.waitressTimeoutFormatter);
        this.unpiWriter = new unpi_1.Writer();
        this.unpiParser = new unpi_1.Parser();
    }
    onUnpiParsed(frame) {
        try {
            const object = zpiObject_1.ZpiObject.fromUnpiFrame(frame);
            logger_1.logger.debug(() => `<-- ${object.toString(object.subsystem !== constants_1.Subsystem.ZDO)}`, NS);
            this.waitress.resolve(object);
            this.emit("received", object);
        }
        catch (error) {
            logger_1.logger.error(`Error while parsing to ZpiObject '${error}'`, NS);
        }
    }
    isInitialized() {
        return this.initialized;
    }
    onPortError(error) {
        logger_1.logger.error(`Port error: ${error}`, NS);
    }
    onPortClose() {
        logger_1.logger.info("Port closed", NS);
        this.initialized = false;
        this.emit("close");
    }
    async open() {
        return (0, utils_2.isTcpPath)(this.path) ? await this.openSocketPort() : await this.openSerialPort();
    }
    async openSerialPort() {
        const options = { path: this.path, baudRate: this.baudRate, rtscts: this.rtscts, autoOpen: false };
        logger_1.logger.info(`Opening SerialPort with ${JSON.stringify(options)}`, NS);
        this.serialPort = new serialPort_1.SerialPort(options);
        this.unpiWriter.pipe(this.serialPort);
        this.serialPort.pipe(this.unpiParser);
        this.unpiParser.on("parsed", this.onUnpiParsed.bind(this));
        try {
            await this.serialPort.asyncOpen();
            logger_1.logger.info("Serialport opened", NS);
            this.serialPort.once("close", this.onPortClose.bind(this));
            this.serialPort.once("error", this.onPortError.bind(this));
            this.initialized = true;
            await this.skipBootloader();
        }
        catch (error) {
            this.initialized = false;
            if (this.serialPort.isOpen) {
                this.serialPort.close();
            }
            throw error;
        }
    }
    async openSocketPort() {
        const info = (0, utils_2.parseTcpPath)(this.path);
        logger_1.logger.info(`Opening TCP socket with ${info.host}:${info.port}`, NS);
        this.socketPort = new node_net_1.Socket();
        this.socketPort.setNoDelay(true);
        this.socketPort.setKeepAlive(true, 15000);
        this.unpiWriter.pipe(this.socketPort);
        this.socketPort.pipe(this.unpiParser);
        this.unpiParser.on("parsed", this.onUnpiParsed.bind(this));
        return await new Promise((resolve, reject) => {
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.on("connect", () => {
                logger_1.logger.info("Socket connected", NS);
            });
            const self = this;
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.on("ready", async () => {
                logger_1.logger.info("Socket ready", NS);
                await self.skipBootloader();
                self.initialized = true;
                resolve();
            });
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.once("close", this.onPortClose.bind(this));
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.on("error", (error) => {
                logger_1.logger.error(`Socket error ${error}`, NS);
                reject(new Error("Error while opening socket"));
                self.initialized = false;
            });
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.connect(info.port, info.host);
        });
    }
    async skipBootloader() {
        try {
            await this.request(constants_1.Subsystem.SYS, "ping", { capabilities: 1 }, undefined, 250);
        }
        catch {
            // Skip bootloader on CC2530/CC2531
            // Send magic byte: https://github.com/Koenkk/zigbee2mqtt/issues/1343 to bootloader
            // and give ZNP 1 second to start.
            try {
                logger_1.logger.info("Writing CC2530/CC2531 skip bootloader payload", NS);
                this.unpiWriter.writeBuffer(Buffer.from([0xef]));
                await (0, utils_1.wait)(1000);
                await this.request(constants_1.Subsystem.SYS, "ping", { capabilities: 1 }, undefined, 250 /* v8 ignore next */);
            }
            catch {
                // Skip bootloader on some CC2652 devices (e.g. zzh-p)
                logger_1.logger.info("Skip bootloader for CC2652/CC1352", NS);
                if (this.serialPort) {
                    await this.serialPort.asyncSet({ dtr: false, rts: false });
                    await (0, utils_1.wait)(150);
                    await this.serialPort.asyncSet({ dtr: false, rts: true });
                    await (0, utils_1.wait)(150);
                    await this.serialPort.asyncSet({ dtr: false, rts: false });
                    await (0, utils_1.wait)(150);
                }
            }
        }
    }
    async close() {
        logger_1.logger.info("closing", NS);
        this.queue.clear();
        if (this.initialized) {
            this.initialized = false;
            if (this.serialPort) {
                try {
                    await this.serialPort.asyncFlushAndClose();
                }
                catch (error) {
                    this.emit("close");
                    throw error;
                }
            }
            else {
                // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                this.socketPort.destroy();
            }
        }
        this.emit("close");
    }
    async requestWithReply(subsystem, command, payload, waiterID, timeout, expectedStatuses = [ZnpCommandStatus.SUCCESS]) {
        const reply = await this.request(subsystem, command, payload, waiterID, timeout, expectedStatuses);
        if (reply === undefined) {
            throw new Error(`Command ${command} has no reply`);
        }
        return reply;
    }
    request(subsystem, command, payload, waiterID, timeout, expectedStatuses = [ZnpCommandStatus.SUCCESS]) {
        if (!this.initialized) {
            throw new Error("Cannot request when znp has not been initialized yet");
        }
        const object = zpiObject_1.ZpiObject.createRequest(subsystem, command, payload);
        return this.queue.execute(async () => {
            logger_1.logger.debug(() => `--> ${object}`, NS);
            if (object.type === constants_1.Type.SREQ) {
                const t = object.command.name === "bdbStartCommissioning" || object.command.name === "startupFromApp" ? 40000 : timeouts.SREQ;
                const waiter = this.waitress.waitFor({ type: constants_1.Type.SRSP, subsystem: object.subsystem, command: object.command.name }, timeout || t);
                this.unpiWriter.writeFrame(object.unpiFrame);
                const result = await waiter.start().promise;
                if (result?.payload.status !== undefined && !expectedStatuses.includes(result.payload.status)) {
                    if (typeof waiterID === "number") {
                        this.waitress.remove(waiterID);
                    }
                    throw new Error(`--> '${object}' failed with status '${statusDescription(result.payload.status)}' (expected '${expectedStatuses.map(statusDescription)}')`);
                }
                return result;
            }
            if (object.type === constants_1.Type.AREQ && object.isResetCommand()) {
                const waiter = this.waitress.waitFor({ type: constants_1.Type.AREQ, subsystem: constants_1.Subsystem.SYS, command: "resetInd" }, timeout || timeouts.reset);
                this.queue.clear();
                this.unpiWriter.writeFrame(object.unpiFrame);
                return await waiter.start().promise;
            }
            if (object.type === constants_1.Type.AREQ) {
                this.unpiWriter.writeFrame(object.unpiFrame);
                /* v8 ignore start */
            }
            else {
                throw new Error(`Unknown type '${object.type}'`);
            }
            /* v8 ignore stop */
        });
    }
    requestZdo(clusterId, payload, waiterID) {
        return this.queue.execute(async () => {
            const cmd = definition_1.default[constants_1.Subsystem.ZDO].find((c) => (0, utils_3.isMtCmdSreqZdo)(c) && c.zdoClusterId === clusterId);
            (0, node_assert_1.default)(cmd, `Command for ZDO cluster ID '${clusterId}' not supported.`);
            const unpiFrame = new unpi_1.Frame(constants_1.Type.SREQ, constants_1.Subsystem.ZDO, cmd.ID, payload);
            const waiter = this.waitress.waitFor({ type: constants_1.Type.SRSP, subsystem: constants_1.Subsystem.ZDO, command: cmd.name }, timeouts.SREQ);
            this.unpiWriter.writeFrame(unpiFrame);
            const result = await waiter.start().promise;
            if (result?.payload.status !== undefined && result.payload.status !== ZnpCommandStatus.SUCCESS) {
                if (waiterID !== undefined) {
                    this.waitress.remove(waiterID);
                }
                throw new Error(`--> 'SREQ: ZDO - ${zdo_1.ClusterId[clusterId]} - ${payload.toString("hex")}' failed with status '${statusDescription(result.payload.status)}'`);
            }
        });
    }
    waitressTimeoutFormatter(matcher, timeout) {
        return `${constants_1.Type[matcher.type]} - ${constants_1.Subsystem[matcher.subsystem]} - ${matcher.command} after ${timeout}ms`;
    }
    waitFor(type, subsystem, command, target, transid, state, timeout = timeouts.default) {
        return this.waitress.waitFor({ type, subsystem, command, target, transid, state }, timeout);
    }
    waitressValidator(zpiObject, matcher) {
        return (matcher.type === zpiObject.type &&
            matcher.subsystem === zpiObject.subsystem &&
            matcher.command === zpiObject.command.name &&
            (matcher.target === undefined ||
                (typeof matcher.target === "number"
                    ? matcher.target === zpiObject.payload.srcaddr
                    : matcher.target === zpiObject.payload.zdo?.[1]?.eui64)) &&
            (matcher.transid === undefined || matcher.transid === zpiObject.payload.transid) &&
            (matcher.state === undefined || matcher.state === zpiObject.payload.state));
    }
}
exports.Znp = Znp;
//# sourceMappingURL=znp.js.map