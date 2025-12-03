"use strict";
/* v8 ignore start */
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
const node_assert_1 = __importDefault(require("node:assert"));
const node_events_1 = require("node:events");
const node_net_1 = __importDefault(require("node:net"));
const parser_delimiter_1 = require("@serialport/parser-delimiter");
const utils_1 = require("../../../utils");
const logger_1 = require("../../../utils/logger");
const waitress_1 = require("../../../utils/waitress");
const ZSpec = __importStar(require("../../../zspec"));
const Zdo = __importStar(require("../../../zspec/zdo"));
const serialPort_1 = require("../../serialPort");
const utils_2 = require("../../utils");
const commandType_1 = require("./commandType");
const constants_1 = require("./constants");
const frame_1 = __importDefault(require("./frame"));
const ziGateObject_1 = __importDefault(require("./ziGateObject"));
const NS = "zh:zigate:driver";
const timeouts = {
    reset: 30000,
    default: 10000,
};
function zeroPad(number, size) {
    return number.toString(16).padStart(size || 4, "0");
}
// biome-ignore lint/suspicious/noExplicitAny: API
function resolve(path, obj, separator = ".") {
    const properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev?.[curr], obj);
}
class ZiGate extends node_events_1.EventEmitter {
    path;
    baudRate;
    initialized;
    parser;
    serialPort;
    socketPort;
    queue;
    portWrite;
    waitress;
    zdoWaitress;
    constructor(path, serialPortOptions) {
        super();
        this.path = path;
        this.baudRate = typeof serialPortOptions.baudRate === "number" ? serialPortOptions.baudRate : 115200;
        // XXX: not used?
        // this.rtscts = typeof serialPortOptions.rtscts === 'boolean' ? serialPortOptions.rtscts : false;
        this.initialized = false;
        this.queue = new utils_1.Queue(1);
        this.waitress = new waitress_1.Waitress(this.waitressValidator, this.waitressTimeoutFormatter);
        this.zdoWaitress = new waitress_1.Waitress(this.zdoWaitressValidator, this.waitressTimeoutFormatter);
    }
    async sendCommand(code, payload, timeout, extraParameters, disableResponse = false) {
        const waiters = [];
        const waitersId = [];
        return await this.queue.execute(async () => {
            try {
                logger_1.logger.debug(() => `Send command \x1b[32m>>>> ${constants_1.ZiGateCommandCode[code]} 0x${zeroPad(code)} <<<<\x1b[0m \nPayload: ${JSON.stringify(payload)}`, NS);
                const ziGateObject = ziGateObject_1.default.createRequest(code, payload);
                const frame = ziGateObject.toZiGateFrame();
                logger_1.logger.debug(() => `${JSON.stringify(frame)}`, NS);
                const sendBuffer = frame.toBuffer();
                logger_1.logger.debug(`<-- send command ${sendBuffer.toString("hex")}`, NS);
                logger_1.logger.debug(`DisableResponse: ${disableResponse}`, NS);
                if (!disableResponse && Array.isArray(ziGateObject.command.response)) {
                    for (const rules of ziGateObject.command.response) {
                        const waiter = this.waitress.waitFor({ ziGateObject, rules, extraParameters }, timeout || timeouts.default);
                        waitersId.push(waiter.ID);
                        waiters.push(waiter.start().promise);
                    }
                }
                let resultPromise;
                if (ziGateObject.command.waitStatus !== false) {
                    const ruleStatus = [
                        { receivedProperty: "code", matcher: commandType_1.equal, value: constants_1.ZiGateMessageCode.Status },
                        { receivedProperty: "payload.packetType", matcher: commandType_1.equal, value: ziGateObject.code },
                    ];
                    const statusWaiter = this.waitress.waitFor({ ziGateObject, rules: ruleStatus }, timeout || timeouts.default).start();
                    resultPromise = statusWaiter.promise;
                }
                // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                this.portWrite.write(sendBuffer);
                if (ziGateObject.command.waitStatus !== false && resultPromise) {
                    const statusResponse = await resultPromise;
                    if (statusResponse.payload.status !== constants_1.Status.E_SL_MSG_STATUS_SUCCESS) {
                        waitersId.map((id) => this.waitress.remove(id));
                        return await Promise.reject(new Error(`${statusResponse}`));
                    }
                    if (waiters.length === 0) {
                        return await Promise.resolve(statusResponse);
                    }
                }
                return await Promise.race(waiters);
            }
            catch (e) {
                logger_1.logger.error(`sendCommand error ${e}`, NS);
                return await Promise.reject(new Error(`sendCommand error: ${e}`));
            }
        });
    }
    async requestZdo(clusterId, payload) {
        return await this.queue.execute(async () => {
            const commandCode = constants_1.ZDO_REQ_CLUSTER_ID_TO_ZIGATE_COMMAND_ID[clusterId];
            (0, node_assert_1.default)(commandCode !== undefined, `ZDO cluster ID '${clusterId}' not supported.`);
            const ruleStatus = [
                { receivedProperty: "code", matcher: commandType_1.equal, value: constants_1.ZiGateMessageCode.Status },
                { receivedProperty: "payload.packetType", matcher: commandType_1.equal, value: commandCode },
            ];
            logger_1.logger.debug(() => `ZDO ${Zdo.ClusterId[clusterId]}(cmd code: ${commandCode}) ${payload.toString("hex")}`, NS);
            const frame = new frame_1.default();
            frame.writeMsgCode(commandCode);
            frame.writeMsgPayload(payload);
            logger_1.logger.debug(() => `ZDO ${JSON.stringify(frame)}`, NS);
            const sendBuffer = frame.toBuffer();
            logger_1.logger.debug(`<-- ZDO send command ${sendBuffer.toString("hex")}`, NS);
            const statusWaiter = this.waitress.waitFor({ rules: ruleStatus }, timeouts.default);
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.portWrite.write(sendBuffer);
            const statusResponse = await statusWaiter.start().promise;
            return statusResponse.payload.status === constants_1.Status.E_SL_MSG_STATUS_SUCCESS;
        });
    }
    open() {
        return (0, utils_2.isTcpPath)(this.path) ? this.openSocketPort() : this.openSerialPort();
    }
    async close() {
        logger_1.logger.info("closing", NS);
        this.queue.clear();
        if (this.initialized) {
            this.portWrite = undefined;
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
                this.socketPort?.destroy();
            }
        }
        this.emit("close");
    }
    async openSerialPort() {
        this.serialPort = new serialPort_1.SerialPort({
            path: this.path,
            baudRate: this.baudRate,
            dataBits: 8,
            parity: "none" /* one of ['none', 'even', 'mark', 'odd', 'space'] */,
            stopBits: 1 /* one of [1,2] */,
            autoOpen: false,
        });
        this.parser = this.serialPort.pipe(new parser_delimiter_1.DelimiterParser({ delimiter: [frame_1.default.STOP_BYTE], includeDelimiter: true }));
        this.parser.on("data", this.onSerialData.bind(this));
        this.portWrite = this.serialPort;
        try {
            await this.serialPort.asyncOpen();
            logger_1.logger.debug("Serialport opened", NS);
            this.serialPort.once("close", this.onPortClose.bind(this));
            this.serialPort.once("error", this.onPortError.bind(this));
            this.initialized = true;
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
        logger_1.logger.debug(`Opening TCP socket with ${info.host}:${info.port}`, NS);
        this.socketPort = new node_net_1.default.Socket();
        this.socketPort.setNoDelay(true);
        this.socketPort.setKeepAlive(true, 15000);
        this.parser = this.socketPort.pipe(new parser_delimiter_1.DelimiterParser({ delimiter: [frame_1.default.STOP_BYTE], includeDelimiter: true }));
        this.parser.on("data", this.onSerialData.bind(this));
        this.portWrite = this.socketPort;
        return await new Promise((resolve, reject) => {
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.on("connect", () => {
                logger_1.logger.debug("Socket connected", NS);
            });
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.on("ready", () => {
                logger_1.logger.debug("Socket ready", NS);
                this.initialized = true;
                resolve();
            });
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.once("close", this.onPortClose.bind(this));
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.on("error", (error) => {
                logger_1.logger.error(`Socket error ${error}`, NS);
                reject(new Error("Error while opening socket"));
                this.initialized = false;
            });
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.connect(info.port, info.host);
        });
    }
    onPortError(error) {
        logger_1.logger.error(`Port error: ${error}`, NS);
    }
    onPortClose() {
        logger_1.logger.debug("Port closed", NS);
        this.initialized = false;
        this.emit("close");
    }
    onSerialData(buffer) {
        try {
            // logger.debug(() => `--- parseNext ${JSON.stringify(buffer)}`, NS);
            const frame = new frame_1.default(buffer);
            if (!(frame instanceof frame_1.default))
                return; // @Todo fix
            const code = frame.readMsgCode();
            const msgName = `${constants_1.ZiGateMessageCode[code] ? constants_1.ZiGateMessageCode[code] : ""} 0x${zeroPad(code)}`;
            logger_1.logger.debug(`--> parsed frame \x1b[1;34m>>>> ${msgName} <<<<\x1b[0m `, NS);
            try {
                const ziGateObject = ziGateObject_1.default.fromZiGateFrame(frame);
                logger_1.logger.debug(() => `${JSON.stringify(ziGateObject.payload)}`, NS);
                if (code === constants_1.ZiGateMessageCode.DataIndication && ziGateObject.payload.profileID === Zdo.ZDO_PROFILE_ID) {
                    const ziGatePayload = ziGateObject.payload;
                    // requests don't have tsn, but responses do
                    // https://zigate.fr/documentation/commandes-zigate/
                    const zdo = Zdo.Buffalo.readResponse(true, ziGatePayload.clusterID, ziGatePayload.payload);
                    this.zdoWaitress.resolve({ ziGatePayload, zdo });
                    this.emit("zdoResponse", ziGatePayload.clusterID, zdo);
                }
                else if (code === constants_1.ZiGateMessageCode.LeaveIndication && ziGateObject.payload.rejoin === 0) {
                    // mock a ZDO response (if waiter present) as zigate does not follow spec on this (missing ZDO LEAVE_RESPONSE)
                    const ziGatePayload = {
                        status: 0,
                        profileID: Zdo.ZDO_PROFILE_ID,
                        clusterID: Zdo.ClusterId.LEAVE_RESPONSE, // only piece actually required for waitress validation
                        sourceEndpoint: Zdo.ZDO_ENDPOINT,
                        destinationEndpoint: Zdo.ZDO_ENDPOINT,
                        sourceAddressMode: 0x03,
                        sourceAddress: ziGateObject.payload.extendedAddress,
                        destinationAddressMode: 0x03,
                        destinationAddress: ZSpec.BLANK_EUI64,
                        // @ts-expect-error not used
                        payload: undefined,
                    };
                    // Workaround: `zdo` is not valid for LEAVE_RESPONSE, but required to pass altered waitress validation (in sendZdo)
                    if (this.zdoWaitress.resolve({ ziGatePayload, zdo: [Zdo.Status.SUCCESS, { eui64: ziGateObject.payload.extendedAddress }] })) {
                        this.emit("zdoResponse", Zdo.ClusterId.LEAVE_RESPONSE, [
                            Zdo.Status.SUCCESS,
                            undefined,
                        ]);
                    }
                    this.emit("LeaveIndication", ziGateObject);
                }
                else {
                    this.waitress.resolve(ziGateObject);
                    if (code === constants_1.ZiGateMessageCode.DataIndication) {
                        if (ziGateObject.payload.profileID === ZSpec.HA_PROFILE_ID) {
                            this.emit("received", ziGateObject);
                        }
                        else {
                            logger_1.logger.debug(`not implemented profile: ${ziGateObject.payload.profileID}`, NS);
                        }
                    }
                    else if (code === constants_1.ZiGateMessageCode.DeviceAnnounce) {
                        this.emit("DeviceAnnounce", {
                            nwkAddress: ziGateObject.payload.shortAddress,
                            eui64: ziGateObject.payload.ieee,
                            capabilities: ziGateObject.payload.MACcapability,
                        });
                    }
                }
            }
            catch (error) {
                logger_1.logger.error(`Parsing error: ${error}`, NS);
            }
        }
        catch (error) {
            logger_1.logger.error(`Error while parsing Frame '${error}'`, NS);
        }
    }
    waitressTimeoutFormatter(matcher, timeout) {
        return `${JSON.stringify(matcher)} after ${timeout}ms`;
    }
    waitressValidator(ziGateObject, matcher) {
        const validator = (rule) => {
            try {
                let expectedValue;
                if (rule.value == null && rule.expectedProperty != null) {
                    (0, node_assert_1.default)(matcher.ziGateObject, "Matcher ziGateObject expected valid.");
                    expectedValue = resolve(rule.expectedProperty, matcher.ziGateObject);
                }
                else if (rule.value == null && rule.expectedExtraParameter != null) {
                    // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                    expectedValue = resolve(rule.expectedExtraParameter, matcher.extraParameters); // XXX: assumed valid?
                }
                else {
                    // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
                    expectedValue = rule.value; // XXX: assumed valid?
                }
                const receivedValue = resolve(rule.receivedProperty, ziGateObject);
                return rule.matcher(expectedValue, receivedValue);
            }
            catch {
                return false;
            }
        };
        return matcher.rules.every(validator);
    }
    zdoWaitFor(matcher) {
        return this.zdoWaitress.waitFor(matcher, timeouts.default);
    }
    zdoWaitressValidator(payload, matcher) {
        return ((matcher.target === undefined ||
            (typeof matcher.target === "number"
                ? matcher.target === payload.ziGatePayload.sourceAddress
                : // @ts-expect-error checked with ?
                    matcher.target === payload.zdo?.[1]?.eui64)) &&
            payload.ziGatePayload.clusterID === matcher.clusterId);
    }
}
exports.default = ZiGate;
//# sourceMappingURL=zigate.js.map