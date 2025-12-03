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
exports.apsBusyQueue = exports.busyQueue = void 0;
const node_events_1 = __importDefault(require("node:events"));
const node_net_1 = __importDefault(require("node:net"));
const slip_1 = __importDefault(require("slip"));
const buffalo_1 = require("../../../buffalo");
const logger_1 = require("../../../utils/logger");
const serialPort_1 = require("../../serialPort");
const utils_1 = require("../../utils");
const constants_1 = __importStar(require("./constants"));
const frameParser_1 = require("./frameParser");
const parser_1 = __importDefault(require("./parser"));
const writer_1 = __importDefault(require("./writer"));
const NS = "zh:deconz:driver";
const queue = [];
exports.busyQueue = [];
const apsQueue = [];
exports.apsBusyQueue = [];
const DRIVER_EVENT = Symbol("drv_ev");
const DEV_STATUS_NET_STATE_MASK = 0x03;
const DEV_STATUS_APS_CONFIRM = 0x04;
const DEV_STATUS_APS_INDICATION = 0x08;
const DEV_STATUS_APS_FREE_SLOTS = 0x20;
//const DEV_STATUS_CONFIG_CHANGED = 0x10;
var DriverState;
(function (DriverState) {
    DriverState[DriverState["Init"] = 0] = "Init";
    DriverState[DriverState["Connected"] = 1] = "Connected";
    DriverState[DriverState["Connecting"] = 2] = "Connecting";
    DriverState[DriverState["ReadConfiguration"] = 3] = "ReadConfiguration";
    DriverState[DriverState["WaitToReconnect"] = 4] = "WaitToReconnect";
    DriverState[DriverState["Reconfigure"] = 5] = "Reconfigure";
    DriverState[DriverState["CloseAndRestart"] = 6] = "CloseAndRestart";
})(DriverState || (DriverState = {}));
var TxState;
(function (TxState) {
    TxState[TxState["Idle"] = 0] = "Idle";
    TxState[TxState["WaitResponse"] = 1] = "WaitResponse";
})(TxState || (TxState = {}));
var DriverEvent;
(function (DriverEvent) {
    DriverEvent[DriverEvent["Action"] = 0] = "Action";
    DriverEvent[DriverEvent["Connected"] = 1] = "Connected";
    DriverEvent[DriverEvent["Disconnected"] = 2] = "Disconnected";
    DriverEvent[DriverEvent["DeviceStateUpdated"] = 3] = "DeviceStateUpdated";
    DriverEvent[DriverEvent["ConnectError"] = 4] = "ConnectError";
    DriverEvent[DriverEvent["CloseError"] = 5] = "CloseError";
    DriverEvent[DriverEvent["EnqueuedApsDataRequest"] = 6] = "EnqueuedApsDataRequest";
    DriverEvent[DriverEvent["Tick"] = 7] = "Tick";
    DriverEvent[DriverEvent["FirmwareCommandSend"] = 8] = "FirmwareCommandSend";
    DriverEvent[DriverEvent["FirmwareCommandReceived"] = 9] = "FirmwareCommandReceived";
    DriverEvent[DriverEvent["FirmwareCommandTimeout"] = 10] = "FirmwareCommandTimeout";
})(DriverEvent || (DriverEvent = {}));
class Driver extends node_events_1.default.EventEmitter {
    serialPort;
    serialPortOptions;
    writer;
    parser;
    frameParserEvent = frameParser_1.frameParserEvents;
    seqNumber;
    deviceStatus = 0;
    // biome-ignore lint/correctness/noUnusedPrivateClassMembers: ignore
    configChanged;
    socketPort;
    // biome-ignore lint/correctness/noUnusedPrivateClassMembers: ignore
    timeoutCounter = 0;
    watchdogTriggeredTime = 0;
    // biome-ignore lint/correctness/noUnusedPrivateClassMembers: ignore
    lastFirmwareRxTime = 0;
    // biome-ignore lint/correctness/noUnusedPrivateClassMembers: ignore
    tickTimer;
    driverStateStart = 0;
    driverState = DriverState.Init;
    firmwareLog;
    transactionID = 0; // for APS and ZDO
    // in flight lockstep sending commands
    txState = TxState.Idle;
    txCommand = 0;
    txSeq = 0;
    txTime = 0;
    networkOptions;
    backup;
    configMatchesBackup = false;
    configIsNewNetwork = false;
    restoredFromBackup = false;
    paramMacAddress = 0n;
    paramTcAddress = 0n;
    paramFirmwareVersion = 0;
    paramCurrentChannel = 0;
    paramNwkPanid = 0;
    paramNwkKey = Buffer.alloc(16);
    paramEndpoint0;
    paramEndpoint1;
    fixParamEndpoint0;
    fixParamEndpoint1;
    paramNwkUpdateId = 0;
    paramChannelMask = 0;
    paramProtocolVersion = 0;
    paramFrameCounter = 0;
    paramApsUseExtPanid = 0n;
    constructor(serialPortOptions, networkOptions, backup, firmwareLog) {
        super();
        this.seqNumber = 0;
        this.configChanged = 0;
        this.networkOptions = networkOptions;
        this.serialPortOptions = serialPortOptions;
        this.backup = backup;
        this.firmwareLog = firmwareLog;
        this.writer = new writer_1.default();
        this.parser = new parser_1.default();
        this.fixParamEndpoint0 = Buffer.from([
            0x00, // index
            0x01, // endpoint,
            0x04, // profileId
            0x01,
            0x05, // deviceId
            0x00,
            0x01, // deviceVersion
            0x05, // in cluster count
            0x00, // basic
            0x00,
            0x06, // on/off
            0x00,
            0x0a, // time
            0x00,
            0x19, // ota
            0x00,
            0x01, // ias ace
            0x05,
            0x04, // out cluster count
            0x01, // power configuration
            0x00,
            0x20, // poll control
            0x00,
            0x00, // ias zone
            0x05,
            0x02, // ias wd
            0x05,
        ]);
        this.fixParamEndpoint1 = Buffer.from([
            0x01, // index
            0xf2, // endpoint,
            0xe0, // profileId
            0xa1,
            0x64, // deviceId
            0x00,
            0x01, // deviceVersion
            0x00, // in cluster count
            0x01, // out cluster count
            0x21, // green power
            0x00,
        ]);
        this.tickTimer = setInterval(() => {
            this.tick();
        }, 100);
        this.onParsed = this.onParsed.bind(this);
        this.frameParserEvent.on("deviceStateUpdated", (data) => {
            this.checkDeviceStatus(data);
        });
        this.on("close", () => {
            for (const interval of this.intervals) {
                clearInterval(interval);
            }
            this.timeoutCounter = 0;
            this.cleanupAllQueues();
        });
        this.on(DRIVER_EVENT, (event, data) => {
            this.handleStateEvent(event, data);
        });
    }
    cleanupAllQueues() {
        const msg = `Cleanup in state: ${DriverState[this.driverState]}`;
        for (let i = 0; i < queue.length; i++) {
            queue[i].reject(new Error(msg));
        }
        queue.length = 0;
        for (let i = 0; i < exports.busyQueue.length; i++) {
            exports.busyQueue[i].reject(new Error(msg));
        }
        exports.busyQueue.length = 0;
        for (let i = 0; i < apsQueue.length; i++) {
            apsQueue[i].reject(new Error(msg));
        }
        apsQueue.length = 0;
        for (let i = 0; i < exports.apsBusyQueue.length; i++) {
            exports.apsBusyQueue[i].reject(new Error(msg));
        }
        exports.apsBusyQueue.length = 0;
    }
    started() {
        return this.driverState === DriverState.Connected;
    }
    intervals = [];
    registerInterval(interval) {
        this.intervals.push(interval);
    }
    async catchPromise(val) {
        return (await Promise.resolve(val).catch((err) => logger_1.logger.debug(`Promise was caught with reason: ${err}`, NS)));
    }
    nextTransactionID() {
        this.transactionID++;
        if (this.transactionID > 255) {
            this.transactionID = 1;
        }
        return this.transactionID;
    }
    tick() {
        this.emitStateEvent(DriverEvent.Tick);
    }
    emitStateEvent(event, data) {
        this.emit(DRIVER_EVENT, event, data);
    }
    needWatchdogReset() {
        const now = Date.now();
        if (300 * 1000 < now - this.watchdogTriggeredTime) {
            return true;
        }
        return false;
    }
    async resetWatchdog() {
        const lastTime = this.watchdogTriggeredTime;
        try {
            logger_1.logger.debug("Reset firmware watchdog", NS);
            // Set timestamp before command to let needWatchdogReset() no trigger multiple times.
            this.watchdogTriggeredTime = Date.now();
            await this.writeParameterRequest(constants_1.ParamId.DEV_WATCHDOG_TTL, 600);
            logger_1.logger.debug("Reset firmware watchdog success", NS);
        }
        catch (_err) {
            this.watchdogTriggeredTime = lastTime;
            logger_1.logger.debug("Reset firmware watchdog failed", NS);
        }
    }
    handleFirmwareEvent(event, data) {
        if (event === DriverEvent.FirmwareCommandSend) {
            if (this.txState !== TxState.Idle) {
                throw new Error("Unexpected TX state not idle");
            }
            const d = data;
            this.txState = TxState.WaitResponse;
            this.txCommand = d.cmd;
            this.txSeq = d.seq;
            this.txTime = Date.now();
            //logger.debug(`tx wait for cmd: ${d.cmd.toString(16).padStart(2, "0")}, seq: ${d.seq}`, NS);
        }
        else if (event === DriverEvent.FirmwareCommandReceived) {
            if (this.txState !== TxState.WaitResponse) {
                return;
            }
            const d = data;
            if (this.txCommand === d.cmd && this.txSeq === d.seq) {
                this.txState = TxState.Idle;
                //logger.debug(`tx released for cmd: ${d.cmd.toString(16).padStart(2, "0")}, seq: ${d.seq}`, NS);
            }
        }
        else if (event === DriverEvent.FirmwareCommandTimeout) {
            if (this.txState === TxState.WaitResponse) {
                this.txState = TxState.Idle;
                logger_1.logger.debug(`tx timeout for cmd: ${this.txCommand.toString(16).padStart(2, "0")}, seq: ${this.txSeq}`, NS);
            }
        }
        else if (event === DriverEvent.Tick) {
            if (this.txState === TxState.WaitResponse) {
                if (Date.now() - this.txTime > 2000) {
                    this.emitStateEvent(DriverEvent.FirmwareCommandTimeout);
                }
            }
        }
    }
    handleConnectedStateEvent(event, _data) {
        if (event === DriverEvent.DeviceStateUpdated) {
            this.handleApsQueueOnDeviceState();
        }
        else if (event === DriverEvent.Tick) {
            if (this.needWatchdogReset()) {
                this.resetWatchdog();
            }
            this.processQueue();
            if (this.txState === TxState.Idle) {
                this.deviceStatus = 0; // force refresh in response
                this.sendReadDeviceStateRequest(this.nextSeqNumber());
            }
        }
        else if (event === DriverEvent.Disconnected) {
            logger_1.logger.debug("Disconnected wait and reconnect", NS);
            this.driverStateStart = Date.now();
            this.driverState = DriverState.WaitToReconnect;
        }
    }
    handleConnectingStateEvent(event, _data) {
        if (event === DriverEvent.Action) {
            this.watchdogTriggeredTime = 0; // force reset watchdog
            this.cleanupAllQueues(); // start with fresh queues
            // TODO(mpi): In future we should simply try which baudrate may work (in a state machine).
            // E.g. connect with baudrate XY, query firmware, on timeout try other baudrate.
            // Most units out there are ConBee2/3 which support 115200.
            // The 38400 default is outdated now and only works for a few units.
            const baudrate = this.serialPortOptions.baudRate || 38400;
            if (!this.serialPortOptions.path) {
                // unlikely but handle it anyway
                this.driverStateStart = Date.now();
                this.driverState = DriverState.WaitToReconnect;
                return;
            }
            let prom;
            if ((0, utils_1.isTcpPath)(this.serialPortOptions.path)) {
                prom = this.openSocketPort();
            }
            else if (baudrate) {
                prom = this.openSerialPort(baudrate);
            }
            else {
                // unlikely but handle it anyway
                this.driverStateStart = Date.now();
                this.driverState = DriverState.WaitToReconnect;
            }
            if (prom) {
                prom.catch((err) => {
                    logger_1.logger.debug(`${err}`, NS);
                    this.driverStateStart = Date.now();
                    this.driverState = DriverState.WaitToReconnect;
                });
            }
        }
        else if (event === DriverEvent.Connected) {
            this.driverStateStart = Date.now();
            this.driverState = DriverState.ReadConfiguration;
            this.emitStateEvent(DriverEvent.Action);
        }
    }
    isNetworkConfigurationValid() {
        const opts = this.networkOptions;
        let configExtPanID = 0n;
        const configNetworkKey = Buffer.from(opts.networkKey || []);
        if (opts.extendedPanID) {
            // NOTE(mpi): U64 values in buffer are big endian!
            configExtPanID = Buffer.from(opts.extendedPanID).readBigUInt64BE();
        }
        if (this.backup) {
            // NOTE(mpi): U64 values in buffer are big endian!
            const backupExtPanID = Buffer.from(this.backup.networkOptions.extendedPanId).readBigUInt64BE();
            if (opts.panID === this.backup.networkOptions.panId &&
                configExtPanID === backupExtPanID &&
                opts.channelList.includes(this.backup.logicalChannel) &&
                configNetworkKey.equals(this.backup.networkOptions.networkKey)) {
                logger_1.logger.debug("Configuration matches backup", NS);
                this.configMatchesBackup = true;
            }
            else {
                logger_1.logger.debug("Configuration doesn't match backup (ignore backup)", NS);
                this.configMatchesBackup = false; // ignore Backup
            }
        }
        if (this.paramMacAddress !== this.paramTcAddress) {
            return false;
        }
        if (!this.paramEndpoint0 || this.fixParamEndpoint0.compare(this.paramEndpoint0) !== 0) {
            logger_1.logger.debug("Endpoint[0] doesn't match configuration", NS);
            return false;
        }
        if (!this.paramEndpoint1 || this.fixParamEndpoint1.compare(this.paramEndpoint1) !== 0) {
            logger_1.logger.debug("Endpoint[1] doesn't match configuration", NS);
            return false;
        }
        if ((this.deviceStatus & DEV_STATUS_NET_STATE_MASK) !== constants_1.NetworkState.Connected) {
            return false;
        }
        if (opts.channelList.find((ch) => ch === this.paramCurrentChannel) === undefined) {
            return false;
        }
        if (configExtPanID !== 0n) {
            if (configExtPanID !== this.paramApsUseExtPanid) {
                this.configIsNewNetwork = true;
                return false;
            }
        }
        if (opts.panID !== this.paramNwkPanid) {
            return false;
        }
        if (opts.networkKey) {
            if (!configNetworkKey.equals(this.paramNwkKey)) {
                // this.configIsNewNetwork = true; // maybe, but we need to consider key rotation
                return false;
            }
        }
        if (this.backup && this.configMatchesBackup) {
            // The backup might be from another unit, if the mac doesn't match clone it!
            // NOTE(mpi): U64 values in buffer are big endian!
            const backupMacAddress = this.backup.coordinatorIeeeAddress.readBigUInt64BE();
            if (backupMacAddress !== this.paramMacAddress) {
                this.configIsNewNetwork = true;
                return false;
            }
            if (this.paramNwkUpdateId < this.backup.networkUpdateId) {
                return false;
            }
            // NOTE(mpi): Ignore the frame counter for now and only handle in case of this.configIsNewNetwork == true.
            // TODO(mpi): We might also check Trust Center Link Key and key sequence number (unlikely but possible case).
        }
        // TODO(mpi): Check endpoint configuration
        // const ep1 =  = await this.driver.readParameterRequest(PARAM.PARAM.STK.Endpoint,);
        return true;
    }
    async reconfigureNetwork() {
        const opts = this.networkOptions;
        // if the configuration has a different channel, broadcast a channel change to the network first
        if (this.networkOptions.channelList.length !== 0) {
            if (opts.channelList[0] !== this.paramCurrentChannel) {
                logger_1.logger.debug(`change channel from ${this.paramCurrentChannel} to ${opts.channelList[0]}`, NS);
                // increase the NWK Update ID so devices which search for the network know this is an update
                this.paramNwkUpdateId = (this.paramNwkUpdateId + 1) % 255;
                this.paramCurrentChannel = opts.channelList[0];
                if ((this.deviceStatus & DEV_STATUS_NET_STATE_MASK) === constants_1.NetworkState.Connected) {
                    await this.sendChangeChannelRequest();
                }
            }
        }
        // first disconnect the network
        await this.changeNetworkStateRequest(constants_1.NetworkState.Disconnected);
        // check if a backup needs to be applied
        // Ember check if backup is needed:
        // - panId, extPanId, network key different -> leave network
        // - left or not joined -> consider using backup
        // backup is only used when matching the z2m config: panId, extPanId, channel, network key
        // parameters restored from backup:
        // - networkKey,
        // - networkKeyInfo.sequenceNumber  NOTE(mpi): not a reason for using backup!?
        // - networkKeyInfo.frameCounter
        // - networkOptions.panId
        // - extendedPanId
        // - logicalChannel
        // - backup!.ezsp!.hashed_tclk!     NOTE(mpi): not a reason for using backup!?
        // - backup!.networkUpdateId        NOTE(mpi): not a reason for using backup!?
        let frameCounter = 0;
        if (this.backup && this.configMatchesBackup) {
            // NOTE(mpi): U64 values in buffer are big endian!
            const backupMacAddress = this.backup.coordinatorIeeeAddress.readBigUInt64BE();
            if (backupMacAddress !== this.paramMacAddress) {
                logger_1.logger.debug(`Use mac address from backup 0x${backupMacAddress.toString(16).padStart(16, "0")}, replaces 0x${this.paramMacAddress.toString(16).padStart(16, "0")}`, NS);
                this.paramMacAddress = backupMacAddress;
                this.restoredFromBackup = true;
                await this.writeParameterRequest(constants_1.ParamId.MAC_ADDRESS, backupMacAddress);
            }
            if (this.configIsNewNetwork && this.paramFrameCounter < this.backup.networkKeyInfo.frameCounter) {
                // delicate situation, only update frame counter if:
                // - backup counter is higher
                // - this is in fact a new network
                // - configIsNewNetwork guards also from mistreating counter overflow
                logger_1.logger.debug(`Use higher frame counter from backup ${this.backup.networkKeyInfo.frameCounter}`, NS);
                // Additionally increase frame counter. Note this might still be too low!
                frameCounter = this.backup.networkKeyInfo.frameCounter + 1000;
                this.restoredFromBackup = true;
            }
            if (this.paramNwkUpdateId < this.backup.networkUpdateId) {
                logger_1.logger.debug(`Use network update ID from backup ${this.backup.networkUpdateId}`, NS);
                this.paramNwkUpdateId = this.backup.networkUpdateId;
                this.restoredFromBackup = true;
            }
            // TODO(mpi): Later on also check key sequence number.
        }
        if (this.paramMacAddress !== this.paramTcAddress) {
            this.paramTcAddress = this.paramMacAddress;
            await this.writeParameterRequest(constants_1.ParamId.APS_TRUST_CENTER_ADDRESS, this.paramTcAddress);
        }
        if (this.configIsNewNetwork && this.paramFrameCounter < frameCounter) {
            this.paramFrameCounter = frameCounter;
            try {
                await this.writeParameterRequest(constants_1.ParamId.STK_FRAME_COUNTER, this.paramFrameCounter);
            }
            catch (_err) {
                // on older firmware versions this fails as unsuppored
            }
        }
        await this.writeParameterRequest(constants_1.ParamId.STK_NWK_UPDATE_ID, this.paramNwkUpdateId);
        if (this.networkOptions.channelList.length !== 0) {
            await this.writeParameterRequest(constants_1.ParamId.APS_CHANNEL_MASK, 1 << this.networkOptions.channelList[0]);
        }
        this.paramNwkPanid = this.networkOptions.panID;
        await this.writeParameterRequest(constants_1.ParamId.NWK_PANID, this.networkOptions.panID);
        await this.writeParameterRequest(constants_1.ParamId.STK_PREDEFINED_PANID, 1);
        if (this.networkOptions.extendedPanID) {
            // NOTE(mpi): U64 values in buffer are big endian!
            this.paramApsUseExtPanid = Buffer.from(this.networkOptions.extendedPanID).readBigUInt64BE();
            await this.writeParameterRequest(constants_1.ParamId.APS_USE_EXTENDED_PANID, this.paramApsUseExtPanid);
        }
        // check current network key against configuration.yaml
        if (this.networkOptions.networkKey) {
            this.paramNwkKey = Buffer.from(this.networkOptions.networkKey);
            await this.writeParameterRequest(constants_1.ParamId.STK_NETWORK_KEY, Buffer.from([0x0, ...this.networkOptions.networkKey]));
        }
        // check current endpoint configuration
        if (!this.paramEndpoint0 || this.fixParamEndpoint0.compare(this.paramEndpoint0) !== 0) {
            this.paramEndpoint0 = this.fixParamEndpoint0;
            await this.writeParameterRequest(constants_1.ParamId.STK_ENDPOINT, this.paramEndpoint0);
        }
        if (!this.paramEndpoint1 || this.fixParamEndpoint1.compare(this.paramEndpoint1) !== 0) {
            this.paramEndpoint1 = this.fixParamEndpoint1;
            await this.writeParameterRequest(constants_1.ParamId.STK_ENDPOINT, this.paramEndpoint1);
        }
        // now reconnect, this will also store configuration in nvram
        await this.changeNetworkStateRequest(constants_1.NetworkState.Connected);
        return;
    }
    handleReadConfigurationStateEvent(event, _data) {
        if (event === DriverEvent.Action) {
            logger_1.logger.debug("Query firmware parameters", NS);
            this.deviceStatus = 0; // need fresh value
            Promise.all([
                this.resetWatchdog(),
                this.readFirmwareVersionRequest(),
                this.readDeviceStatusRequest(),
                this.readParameterRequest(constants_1.ParamId.MAC_ADDRESS),
                this.readParameterRequest(constants_1.ParamId.APS_TRUST_CENTER_ADDRESS),
                this.readParameterRequest(constants_1.ParamId.NWK_PANID),
                this.readParameterRequest(constants_1.ParamId.APS_USE_EXTENDED_PANID),
                this.readParameterRequest(constants_1.ParamId.STK_CURRENT_CHANNEL),
                this.readParameterRequest(constants_1.ParamId.STK_NETWORK_KEY, Buffer.from([0])),
                this.readParameterRequest(constants_1.ParamId.STK_NWK_UPDATE_ID),
                this.readParameterRequest(constants_1.ParamId.APS_CHANNEL_MASK),
                this.readParameterRequest(constants_1.ParamId.STK_PROTOCOL_VERSION),
                this.readParameterRequest(constants_1.ParamId.STK_FRAME_COUNTER),
                this.readParameterRequest(constants_1.ParamId.STK_ENDPOINT, Buffer.from([0])),
                this.readParameterRequest(constants_1.ParamId.STK_ENDPOINT, Buffer.from([1])),
            ])
                .then(([_watchdog, fwVersion, _deviceState, mac, tcAddress, panid, apsUseExtPanid, currentChannel, nwkKey, nwkUpdateId, channelMask, protocolVersion, frameCounter, ep0, ep1,]) => {
                this.paramFirmwareVersion = fwVersion;
                this.paramCurrentChannel = currentChannel;
                this.paramApsUseExtPanid = apsUseExtPanid;
                this.paramNwkPanid = panid;
                this.paramNwkKey = nwkKey;
                this.paramNwkUpdateId = nwkUpdateId;
                this.paramMacAddress = mac;
                this.paramTcAddress = tcAddress;
                this.paramChannelMask = channelMask;
                this.paramProtocolVersion = protocolVersion;
                if (frameCounter !== null) {
                    this.paramFrameCounter = frameCounter;
                }
                if (ep0 !== null) {
                    this.paramEndpoint0 = ep0;
                }
                if (ep1 !== null) {
                    this.paramEndpoint1 = ep1;
                }
                // console.log({fwVersion, mac, panid, apsUseExtPanid, currentChannel, nwkKey, nwkUpdateId, channelMask, protocolVersion, frameCounter});
                if (this.isNetworkConfigurationValid()) {
                    logger_1.logger.debug("Zigbee configuration valid", NS);
                    this.driverStateStart = Date.now();
                    this.driverState = DriverState.Connected;
                    // enable optional firmware debug messages
                    let logLevel = 0;
                    for (const level of this.firmwareLog) {
                        if (level === "APS")
                            logLevel |= 0x00000100;
                        else if (level === "APS_L2")
                            logLevel |= 0x00010000;
                    }
                    if (logLevel !== 0) {
                        this.writeParameterRequest(constants_1.ParamId.STK_DEBUG_LOG_LEVEL, logLevel)
                            .then((_x) => {
                            logger_1.logger.debug("Enabled firmware logging", NS);
                        })
                            .catch((_err) => {
                            logger_1.logger.debug("Firmware logging unsupported by firmware", NS);
                        });
                    }
                }
                else {
                    this.driverStateStart = Date.now();
                    this.driverState = DriverState.Reconfigure;
                    this.emitStateEvent(DriverEvent.Action);
                }
            })
                .catch((_err) => {
                this.driverStateStart = Date.now();
                this.driverState = DriverState.CloseAndRestart;
                logger_1.logger.debug("Failed to query firmware parameters", NS);
            });
        }
        else if (event === DriverEvent.Tick) {
            this.processQueue();
        }
    }
    handleReconfigureStateEvent(event, _data) {
        if (event === DriverEvent.Action) {
            logger_1.logger.debug("Reconfigure Zigbee network to match configuration", NS);
            this.reconfigureNetwork()
                .then(() => {
                this.driverStateStart = Date.now();
                this.driverState = DriverState.Connected;
            })
                .catch((err) => {
                logger_1.logger.debug(`Failed to reconfigure Zigbee network, error: ${err}, wait 15 seconds to retry`, NS);
                this.driverStateStart = Date.now();
            });
        }
        else if (event === DriverEvent.Tick) {
            this.processQueue();
            // if we run into this timeout assume some error and retry after waiting a bit
            if (15000 < Date.now() - this.driverStateStart) {
                this.driverStateStart = Date.now();
                this.driverState = DriverState.CloseAndRestart;
            }
            if (this.txState === TxState.Idle) {
                // needed to process channel change ZDP request
                this.deviceStatus = 0; // force refresh in response
                this.sendReadDeviceStateRequest(this.nextSeqNumber());
            }
        }
        else if (event === DriverEvent.DeviceStateUpdated) {
            this.handleApsQueueOnDeviceState();
        }
    }
    handleWaitToReconnectStateEvent(event, _data) {
        if (event === DriverEvent.Tick) {
            if (5000 < Date.now() - this.driverStateStart) {
                this.driverState = DriverState.Connecting;
                this.emitStateEvent(DriverEvent.Action);
            }
        }
    }
    handleCloseAndRestartStateEvent(event, _data) {
        if (event === DriverEvent.Tick) {
            if (1000 < Date.now() - this.driverStateStart) {
                // if the connection is open try to close it every second.
                this.driverStateStart = Date.now();
                if (this.isOpen()) {
                    this.close();
                }
                else {
                    this.driverState = DriverState.WaitToReconnect;
                }
            }
        }
    }
    handleApsQueueOnDeviceState() {
        // logger.debug(`Updated device status: ${data.toString(2)}`, NS);
        const netState = this.deviceStatus & DEV_STATUS_NET_STATE_MASK;
        if (this.txState === TxState.Idle) {
            if (netState === constants_1.NetworkState.Connected) {
                const status = this.deviceStatus;
                if (status & DEV_STATUS_APS_CONFIRM) {
                    this.deviceStatus = 0; // force refresh in response
                    this.sendReadApsConfirmRequest(this.nextSeqNumber());
                }
                else if (status & DEV_STATUS_APS_INDICATION) {
                    this.deviceStatus = 0; // force refresh in response
                    this.sendReadApsIndicationRequest(this.nextSeqNumber());
                }
                else if (status & DEV_STATUS_APS_FREE_SLOTS) {
                    this.deviceStatus = 0; // force refresh in response
                    this.processApsQueue();
                }
            }
        }
    }
    handleStateEvent(event, data) {
        try {
            // all states
            if (event === DriverEvent.Tick ||
                event === DriverEvent.FirmwareCommandReceived ||
                event === DriverEvent.FirmwareCommandSend ||
                event === DriverEvent.FirmwareCommandTimeout) {
                this.handleFirmwareEvent(event, data);
                this.processBusyQueueTimeouts();
                this.processApsBusyQueueTimeouts();
            }
            if (this.driverState === DriverState.Init) {
                this.driverState = DriverState.WaitToReconnect;
                this.driverStateStart = 0; // force fast initial connect
            }
            else if (this.driverState === DriverState.Connected) {
                this.handleConnectedStateEvent(event, data);
            }
            else if (this.driverState === DriverState.Connecting) {
                this.handleConnectingStateEvent(event, data);
            }
            else if (this.driverState === DriverState.WaitToReconnect) {
                this.handleWaitToReconnectStateEvent(event, data);
            }
            else if (this.driverState === DriverState.ReadConfiguration) {
                this.handleReadConfigurationStateEvent(event, data);
            }
            else if (this.driverState === DriverState.Reconfigure) {
                this.handleReconfigureStateEvent(event, data);
            }
            else if (this.driverState === DriverState.CloseAndRestart) {
                this.handleCloseAndRestartStateEvent(event, data);
            }
            else {
                if (event !== DriverEvent.Tick) {
                    logger_1.logger.debug(`handle state: ${DriverState[this.driverState]}, event: ${DriverEvent[event]}`, NS);
                }
            }
        }
        catch (_err) {
            // console.error(err);
        }
    }
    onPortClose(error) {
        if (error) {
            logger_1.logger.info(`Port close: state: ${DriverState[this.driverState]}, reason: ${error}`, NS);
        }
        else {
            logger_1.logger.debug(`Port closed in state: ${DriverState[this.driverState]}`, NS);
        }
        this.emitStateEvent(DriverEvent.Disconnected);
        this.emit("close");
    }
    onPortError(error) {
        logger_1.logger.error(`Port error: ${error}`, NS);
        this.emitStateEvent(DriverEvent.Disconnected);
        this.emit("close");
    }
    isOpen() {
        if (this.serialPort)
            return this.serialPort.isOpen;
        if (this.socketPort)
            return this.socketPort.readyState !== "closed";
        return false;
    }
    openSerialPort(baudrate) {
        return new Promise((resolve, reject) => {
            if (!this.serialPortOptions.path) {
                reject(new Error("Failed to open serial port, path is undefined"));
            }
            logger_1.logger.debug(`Opening serial port: ${this.serialPortOptions.path}`, NS);
            const path = this.serialPortOptions.path || "";
            if (!this.serialPort) {
                this.serialPort = new serialPort_1.SerialPort({ path, baudRate: baudrate, autoOpen: false });
                this.writer.pipe(this.serialPort);
                this.serialPort.pipe(this.parser);
                this.parser.on("parsed", this.onParsed);
                this.serialPort.on("close", this.onPortClose.bind(this));
                this.serialPort.on("error", this.onPortError.bind(this));
            }
            if (!this.serialPort) {
                reject(new Error("Failed to create SerialPort instance"));
                return;
            }
            if (this.serialPort.isOpen) {
                resolve();
                return;
            }
            this.serialPort.open((error) => {
                if (error) {
                    reject(new Error(`Error while opening serialport '${error}'`));
                    if (this.serialPort) {
                        if (this.serialPort.isOpen) {
                            this.emitStateEvent(DriverEvent.ConnectError);
                            //this.serialPort!.close();
                        }
                    }
                }
                else {
                    logger_1.logger.debug("Serialport opened", NS);
                    this.emitStateEvent(DriverEvent.Connected);
                    resolve();
                }
            });
        });
    }
    async openSocketPort() {
        if (!this.serialPortOptions.path) {
            throw new Error("No serial port TCP path specified");
        }
        const info = (0, utils_1.parseTcpPath)(this.serialPortOptions.path);
        logger_1.logger.debug(`Opening TCP socket with ${info.host}:${info.port}`, NS);
        this.socketPort = new node_net_1.default.Socket();
        this.socketPort.setNoDelay(true);
        this.socketPort.setKeepAlive(true, 15000);
        this.writer = new writer_1.default();
        this.writer.pipe(this.socketPort);
        this.parser = new parser_1.default();
        this.socketPort.pipe(this.parser);
        this.parser.on("parsed", this.onParsed);
        return await new Promise((resolve, reject) => {
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.on("connect", () => {
                logger_1.logger.debug("Socket connected", NS);
            });
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.on("ready", () => {
                logger_1.logger.debug("Socket ready", NS);
                this.emitStateEvent(DriverEvent.Connected);
                resolve();
            });
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.once("close", this.onPortClose);
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.on("error", (error) => {
                logger_1.logger.error(`Socket error ${error}`, NS);
                reject(new Error("Error while opening socket"));
            });
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            this.socketPort.connect(info.port, info.host);
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            if (this.serialPort) {
                if (this.serialPort.isOpen) {
                    // wait until remaining data is written
                    this.serialPort.flush();
                    this.serialPort.close((error) => {
                        if (error) {
                            // TODO(mpi): monitor, this must not happen after drain
                            // close() failes if there is pending data to write!
                            this.emitStateEvent(DriverEvent.CloseError);
                            reject(new Error(`Error while closing serialport '${error}'`));
                            return;
                        }
                    });
                }
                this.emitStateEvent(DriverEvent.Disconnected);
                this.emit("close");
                resolve();
            }
            else if (this.socketPort) {
                this.socketPort.destroy();
                this.socketPort = undefined;
                this.emitStateEvent(DriverEvent.Disconnected);
                resolve();
            }
            else {
                resolve();
                this.emit("close");
            }
        });
    }
    readParameterRequest(parameterId, parameter) {
        const seqNumber = this.nextSeqNumber();
        return new Promise((resolve, reject) => {
            //logger.debug(`push read parameter request to queue. seqNr: ${seqNumber} paramId: ${parameterId}`, NS);
            const ts = 0;
            const commandId = constants_1.FirmwareCommand.ReadParameter;
            const networkState = constants_1.NetworkState.Ignore;
            const req = { commandId, networkState, parameterId, parameter, seqNumber, resolve, reject, ts };
            queue.push(req);
        });
    }
    writeParameterRequest(parameterId, parameter) {
        const seqNumber = this.nextSeqNumber();
        return new Promise((resolve, reject) => {
            //logger.debug(`push write parameter request to queue. seqNr: ${seqNumber} paramId: ${parameterId} parameter: ${parameter}`, NS);
            const ts = 0;
            const commandId = constants_1.FirmwareCommand.WriteParameter;
            const networkState = constants_1.NetworkState.Ignore;
            const req = { commandId, networkState, parameterId, parameter, seqNumber, resolve, reject, ts };
            queue.push(req);
        });
    }
    sendChangeChannelRequest() {
        const zdpSeq = this.nextTransactionID();
        const scanChannels = 1 << this.networkOptions.channelList[0];
        const scanDuration = 0xfe; // special value = channel change
        const payload = Buffer.alloc(7);
        let pos = 0;
        pos = payload.writeUInt8(zdpSeq, pos);
        pos = payload.writeUInt32LE(scanChannels, pos);
        pos = payload.writeUInt8(scanDuration, pos);
        pos = payload.writeUInt8(this.paramNwkUpdateId, pos);
        const req = {
            requestId: this.nextTransactionID(),
            destAddrMode: constants_1.ApsAddressMode.Nwk,
            destAddr16: constants_1.NwkBroadcastAddress.BroadcastRxOnWhenIdle,
            destEndpoint: 0,
            profileId: 0,
            clusterId: 0x0038, // ZDP_MGMT_NWK_UPDATE_REQ_CLID
            srcEndpoint: 0,
            asduLength: payload.length,
            asduPayload: payload,
            txOptions: 0,
            radius: constants_1.default.PARAM.txRadius.DEFAULT_RADIUS,
            timeout: constants_1.default.PARAM.APS.MAX_SEND_TIMEOUT,
        };
        return this.enqueueApsDataRequest(req);
    }
    async writeLinkKey(ieeeAddress, hashedKey) {
        const buf = Buffer.alloc(8 + 16);
        if (ieeeAddress[1] !== "x") {
            ieeeAddress = `0x${ieeeAddress}`;
        }
        buf.writeBigUint64LE(BigInt(ieeeAddress));
        for (let i = 0; i < 16; i++) {
            buf.writeUint8(hashedKey[i], 8 + i);
        }
        await this.writeParameterRequest(constants_1.ParamId.STK_LINK_KEY, buf);
    }
    readFirmwareVersionRequest() {
        const seqNumber = this.nextSeqNumber();
        return new Promise((resolve, reject) => {
            //logger.debug(`push read firmware version request to queue. seqNr: ${seqNumber}`, NS);
            const ts = 0;
            const commandId = constants_1.FirmwareCommand.FirmwareVersion;
            const networkState = constants_1.NetworkState.Ignore;
            const parameterId = constants_1.ParamId.NONE;
            const req = { commandId, networkState, parameterId, seqNumber, resolve, reject, ts };
            queue.push(req);
        });
    }
    readDeviceStatusRequest() {
        const seqNumber = this.nextSeqNumber();
        return new Promise((resolve, reject) => {
            //logger.debug(`push read firmware version request to queue. seqNr: ${seqNumber}`, NS);
            const ts = 0;
            const commandId = constants_1.FirmwareCommand.Status;
            const networkState = constants_1.NetworkState.Ignore;
            const parameterId = constants_1.ParamId.NONE;
            const req = { commandId, networkState, parameterId, seqNumber, resolve, reject, ts };
            queue.push(req);
        });
    }
    sendReadParameterRequest(parameterId, seqNumber, arg) {
        let frameLength = 8; // starts with min. frame length
        let payloadLength = 1; // min. parameterId
        if (arg instanceof Buffer) {
            payloadLength += arg.byteLength;
            frameLength += arg.byteLength;
        }
        const buf = new buffalo_1.Buffalo(Buffer.alloc(frameLength));
        buf.writeUInt8(constants_1.FirmwareCommand.ReadParameter);
        buf.writeUInt8(seqNumber);
        buf.writeUInt8(0); // reserved, shall be 0
        buf.writeUInt16(frameLength);
        buf.writeUInt16(payloadLength);
        buf.writeUInt8(parameterId);
        if (arg instanceof Buffer) {
            buf.writeBuffer(arg, arg.byteLength);
        }
        return this.sendRequest(buf.getBuffer());
    }
    sendWriteParameterRequest(parameterId, value, seqNumber) {
        // command id, sequence number, 0, framelength(U16), payloadlength(U16), parameter id, parameter
        const param = constants_1.stackParameters.find((x) => x.id === parameterId);
        if (!param) {
            throw new Error("tried to write unknown stack parameter");
        }
        const buf = Buffer.alloc(128);
        let pos = 0;
        pos = buf.writeUInt8(constants_1.FirmwareCommand.WriteParameter, pos);
        pos = buf.writeUInt8(seqNumber, pos);
        pos = buf.writeUInt8(0, pos); // status: not used
        const posFrameLength = pos; // remember
        pos = buf.writeUInt16LE(0, pos); // dummy frame length
        // -------------- actual data ---------------------------------------
        const posPayloadLength = pos; // remember
        pos = buf.writeUInt16LE(0, pos); // dummy payload length
        pos = buf.writeUInt8(parameterId, pos);
        if (value instanceof Buffer) {
            for (let i = 0; i < value.length; i++) {
                pos = buf.writeUInt8(value[i], pos);
            }
        }
        else if (typeof value === "number") {
            if (param.type === constants_1.DataType.U8) {
                pos = buf.writeUInt8(value, pos);
            }
            else if (param.type === constants_1.DataType.U16) {
                pos = buf.writeUInt16LE(value, pos);
            }
            else if (param.type === constants_1.DataType.U32) {
                pos = buf.writeUInt32LE(value, pos);
            }
            else {
                throw new Error("tried to write unknown parameter number type");
            }
        }
        else if (typeof value === "bigint") {
            if (param.type === constants_1.DataType.U64) {
                pos = buf.writeBigUInt64LE(value, pos);
            }
            else {
                throw new Error("tried to write unknown parameter number type");
            }
        }
        else {
            throw new Error("tried to write unknown parameter type");
        }
        const payloadLength = pos - (posPayloadLength + 2);
        buf.writeUInt16LE(payloadLength, posPayloadLength); // actual payload length
        buf.writeUInt16LE(pos, posFrameLength); // actual frame length
        const out = buf.subarray(0, pos);
        return this.sendRequest(out);
    }
    sendReadFirmwareVersionRequest(seqNumber) {
        /* command id, sequence number, 0, framelength(U16) */
        return this.sendRequest(Buffer.from([constants_1.FirmwareCommand.FirmwareVersion, seqNumber, 0x00, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00]));
    }
    sendReadDeviceStateRequest(seqNumber) {
        /* command id, sequence number, 0, framelength(U16) */
        return this.sendRequest(Buffer.from([constants_1.FirmwareCommand.Status, seqNumber, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00]));
    }
    sendRequest(buffer) {
        const frame = Buffer.concat([buffer, this.calcCrc(buffer)]);
        const slipframe = slip_1.default.encode(frame);
        if (frame[0] === 0x00) {
            throw new Error(`send unexpected frame with invalid command ID: 0x${frame[0].toString(16).padStart(2, "0")}`);
        }
        if (slipframe.length >= 256) {
            throw new Error("send unexpected long slip frame");
        }
        let written = false;
        if (this.serialPort) {
            if (!this.serialPort.isOpen) {
                throw new Error("Can't write to serial port while it isn't open");
            }
            for (let retry = 0; retry < 3 && !written; retry++) {
                written = this.serialPort.write(slipframe, (err) => {
                    if (err) {
                        throw new Error(`Failed to write to serial port: ${err.message}`);
                    }
                });
                // if written is false, we also need to wait for drain()
                this.serialPort.drain(); // flush
            }
        }
        else if (this.socketPort) {
            written = this.socketPort.write(slipframe, (err) => {
                if (err) {
                    throw new Error(`Failed to write to serial port: ${err.message}`);
                }
                written = true;
            });
            // handle in upper functions
            // if (!written) {
            //     await this.sleep(1000);
            // }
        }
        if (!written) {
            throw new Error(`Failed to send request cmd: ${frame[0]}, seq: ${frame[1]}`);
        }
        const result = { cmd: frame[0], seq: frame[1] };
        this.emitStateEvent(DriverEvent.FirmwareCommandSend, result);
        return result;
    }
    processQueue() {
        if (queue.length === 0) {
            return;
        }
        if (exports.busyQueue.length > 0) {
            return;
        }
        if (this.txState !== TxState.Idle) {
            return;
        }
        const req = queue.shift();
        if (req) {
            req.ts = Date.now();
            try {
                switch (req.commandId) {
                    case constants_1.FirmwareCommand.ReadParameter:
                        logger_1.logger.debug(`send read parameter request from queue. parameter: ${constants_1.ParamId[req.parameterId]} seq: ${req.seqNumber}`, NS);
                        this.sendReadParameterRequest(req.parameterId, req.seqNumber, req.parameter);
                        break;
                    case constants_1.FirmwareCommand.WriteParameter:
                        if (req.parameter === undefined) {
                            throw new Error(`Write parameter request without parameter: ${constants_1.ParamId[req.parameterId]}`);
                        }
                        logger_1.logger.debug(`Send write parameter request from queue. seq: ${req.seqNumber} parameter: ${constants_1.ParamId[req.parameterId]}`, NS);
                        this.sendWriteParameterRequest(req.parameterId, req.parameter, req.seqNumber);
                        break;
                    case constants_1.FirmwareCommand.FirmwareVersion:
                        logger_1.logger.debug(`Send read firmware version request from queue. seq: ${req.seqNumber}`, NS);
                        this.sendReadFirmwareVersionRequest(req.seqNumber);
                        break;
                    case constants_1.FirmwareCommand.Status:
                        //logger.debug(`Send read device state from queue. seqNr: ${req.seqNumber}`, NS);
                        this.sendReadDeviceStateRequest(req.seqNumber);
                        break;
                    case constants_1.FirmwareCommand.ChangeNetworkState:
                        logger_1.logger.debug(`Send change network state request from queue. seq: ${req.seqNumber}`, NS);
                        this.sendChangeNetworkStateRequest(req.seqNumber, req.networkState);
                        break;
                    default:
                        throw new Error("process queue - unknown command id");
                }
                exports.busyQueue.push(req);
            }
            catch (_err) {
                //console.error(err);
                req.reject(new Error(`Failed to process request ${constants_1.FirmwareCommand[req.commandId]}, seq: ${req.seqNumber}`));
            }
        }
    }
    processBusyQueueTimeouts() {
        let i = exports.busyQueue.length;
        while (i--) {
            const req = exports.busyQueue[i];
            const now = Date.now();
            if (10000 < now - req.ts) {
                //remove from busyQueue
                exports.busyQueue.splice(i, 1);
                this.timeoutCounter++;
                req.reject(new Error(`Timeout for queued command ${constants_1.FirmwareCommand[req.commandId]}, seq: ${req.seqNumber}`));
            }
        }
    }
    changeNetworkStateRequest(networkState) {
        const seqNumber = this.nextSeqNumber();
        return new Promise((resolve, reject) => {
            //logger.debug(`push change network state request to apsQueue. seqNr: ${seqNumber}`, NS);
            const ts = 0;
            const commandId = constants_1.FirmwareCommand.ChangeNetworkState;
            const parameterId = constants_1.ParamId.NONE;
            const req = { commandId, networkState, parameterId, seqNumber, resolve, reject, ts };
            queue.push(req);
        });
    }
    sendChangeNetworkStateRequest(seqNumber, networkState) {
        return this.sendRequest(Buffer.from([constants_1.FirmwareCommand.ChangeNetworkState, seqNumber, 0x00, 0x06, 0x00, networkState]));
    }
    checkDeviceStatus(deviceStatus) {
        this.deviceStatus = deviceStatus;
        this.configChanged = (deviceStatus >> 4) & 0x01;
        this.emitStateEvent(DriverEvent.DeviceStateUpdated, deviceStatus);
    }
    enqueueApsDataRequest(request) {
        const seqNumber = this.nextSeqNumber();
        return new Promise((resolve, reject) => {
            //logger.debug(`push enqueue send data request to apsQueue. seqNr: ${seqNumber}`, NS);
            const ts = Date.now();
            const commandId = constants_1.FirmwareCommand.ApsDataRequest;
            const req = { commandId, seqNumber, request, resolve, reject, ts };
            apsQueue.push(req);
            this.emitStateEvent(DriverEvent.EnqueuedApsDataRequest, req.seqNumber);
        });
    }
    processApsQueue() {
        if (apsQueue.length === 0) {
            return;
        }
        if (this.txState !== TxState.Idle) {
            return;
        }
        const req = apsQueue.shift();
        if (!req) {
            return;
        }
        if (req.request) {
            req.ts = Date.now();
            if (req.commandId !== constants_1.FirmwareCommand.ApsDataRequest) {
                // should never happen
                throw new Error("process APS queue - unknown command id");
            }
            try {
                this.sendEnqueueApsDataRequest(req.request, req.seqNumber);
                exports.apsBusyQueue.push(req);
            }
            catch (_) {
                apsQueue.unshift(req);
            }
        }
    }
    sendReadApsConfirmRequest(seqNumber) {
        logger_1.logger.debug(`Request APS-DATA.confirm seq: ${seqNumber}`, NS);
        return this.sendRequest(Buffer.from([constants_1.FirmwareCommand.ApsDataConfirm, seqNumber, 0x00, 0x07, 0x00, 0x00, 0x00]));
    }
    sendReadApsIndicationRequest(seqNumber) {
        logger_1.logger.debug(`Request APS-DATA.indication seq: ${seqNumber}`, NS);
        return this.sendRequest(Buffer.from([constants_1.FirmwareCommand.ApsDataIndication, seqNumber, 0x00, 0x08, 0x00, 0x01, 0x00, 0x01]));
    }
    sendEnqueueApsDataRequest(request, seqNumber) {
        const payloadLength = 12 + (request.destAddrMode === constants_1.ApsAddressMode.Group ? 2 : request.destAddrMode === constants_1.ApsAddressMode.Nwk ? 3 : 9) + request.asduLength;
        const frameLength = 7 + payloadLength;
        const cid1 = request.clusterId & 0xff;
        const cid2 = (request.clusterId >> 8) & 0xff;
        const asdul1 = request.asduLength & 0xff;
        const asdul2 = (request.asduLength >> 8) & 0xff;
        let destArray = [];
        let dest = "";
        if (request.destAddr16 !== undefined) {
            destArray[0] = request.destAddr16 & 0xff;
            destArray[1] = (request.destAddr16 >> 8) & 0xff;
            dest = request.destAddr16.toString(16);
        }
        if (request.destAddr64 !== undefined) {
            dest = request.destAddr64;
            destArray = this.macAddrStringToArray(request.destAddr64);
        }
        if (request.destEndpoint !== undefined) {
            destArray.push(request.destEndpoint);
            dest += " EP:";
            dest += request.destEndpoint;
        }
        logger_1.logger.debug(`Request APS-DATA.request: dest: 0x${dest} seq: ${seqNumber} requestId: ${request.requestId}`, NS);
        return this.sendRequest(Buffer.from([
            constants_1.FirmwareCommand.ApsDataRequest,
            seqNumber,
            0x00,
            frameLength & 0xff,
            (frameLength >> 8) & 0xff,
            payloadLength & 0xff,
            (payloadLength >> 8) & 0xff,
            request.requestId,
            0x00,
            request.destAddrMode,
            ...destArray,
            request.profileId & 0xff,
            (request.profileId >> 8) & 0xff,
            cid1,
            cid2,
            request.srcEndpoint,
            asdul1,
            asdul2,
            ...request.asduPayload,
            request.txOptions,
            request.radius,
        ]));
    }
    processApsBusyQueueTimeouts() {
        let i = exports.apsBusyQueue.length;
        while (i--) {
            const req = exports.apsBusyQueue[i];
            const now = Date.now();
            let timeout = 60000;
            if (req.request != null && req.request.timeout != null) {
                timeout = req.request.timeout * 1000; // seconds * 1000 = milliseconds
            }
            if (now - req.ts > timeout) {
                //remove from busyQueue
                exports.apsBusyQueue.splice(i, 1);
                req.reject(new Error(`Timeout for APS-DATA.request, seq: ${req.seqNumber}`));
            }
        }
    }
    calcCrc(buffer) {
        let crc = 0;
        for (let i = 0; i < buffer.length; i++) {
            crc += buffer[i];
        }
        const crc0 = (~crc + 1) & 0xff;
        const crc1 = ((~crc + 1) >> 8) & 0xff;
        return Buffer.from([crc0, crc1]);
    }
    macAddrStringToArray(addr) {
        if (addr.indexOf("0x") === 0) {
            addr = addr.slice(2, addr.length);
        }
        if (addr.length < 16) {
            for (let l = 0; l < 16 - addr.length; l++) {
                addr = `0${addr}`;
            }
        }
        const result = [];
        let y = 0;
        for (let i = 0; i < 8; i++) {
            result[i] = Number.parseInt(addr.substr(y, 2), 16);
            y += 2;
        }
        const reverse = result.reverse();
        return reverse;
    }
    macAddrArrayToString(addr) {
        if (addr.length !== 8) {
            throw new Error(`invalid array length for MAC address: ${addr.length}`);
        }
        let result = "0x";
        let char = "";
        let i = 8;
        while (i--) {
            char = addr[i].toString(16);
            if (char.length < 2) {
                char = `0${char}`;
            }
            result += char;
        }
        return result;
    }
    /**
     *  generalArrayToString result is not reversed!
     */
    generalArrayToString(key, length) {
        let result = "0x";
        let char = "";
        let i = 0;
        while (i < length) {
            char = key[i].toString(16);
            if (char.length < 2) {
                char = `0${char}`;
            }
            result += char;
            i++;
        }
        return result;
    }
    nextSeqNumber() {
        this.seqNumber++;
        if (this.seqNumber > 254) {
            this.seqNumber = 1;
        }
        return this.seqNumber;
    }
    onParsed(frame) {
        if (frame.length >= 5) {
            // min. packet length [cmd, seq, status, u16 storedLength]
            const storedLength = (frame[4] << 8) | frame[3];
            if (storedLength + 2 !== frame.length) {
                // frame without CRC16
                return;
            }
            let crc = 0;
            for (let i = 0; i < storedLength; i++) {
                crc += frame[i];
            }
            crc = (~crc + 1) & 0xffff;
            const crcFrame = (frame[frame.length - 1] << 8) | frame[frame.length - 2];
            if (crc === crcFrame) {
                this.lastFirmwareRxTime = Date.now();
                this.emitStateEvent(DriverEvent.FirmwareCommandReceived, { cmd: frame[0], seq: frame[1] });
                this.emit("rxFrame", frame.slice(0, storedLength));
            }
            else {
                logger_1.logger.debug("frame CRC invalid (could be ASCII message)", NS);
            }
        }
        else {
            logger_1.logger.debug(`frame length (${frame.length}) < 5, discard`, NS);
        }
    }
}
exports.default = Driver;
//# sourceMappingURL=driver.js.map