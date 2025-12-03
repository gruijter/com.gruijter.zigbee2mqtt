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
exports.Driver = void 0;
const node_events_1 = require("node:events");
const es6_1 = __importDefault(require("fast-deep-equal/es6"));
const utils_1 = require("../../../utils");
const logger_1 = require("../../../utils/logger");
const ZSpec = __importStar(require("../../../zspec"));
const cluster_1 = require("../../../zspec/zcl/definition/cluster");
const Zdo = __importStar(require("../../../zspec/zdo"));
const backup_1 = require("../adapter/backup");
const ezsp_1 = require("./ezsp");
const multicast_1 = require("./multicast");
const types_1 = require("./types");
const named_1 = require("./types/named");
const struct_1 = require("./types/struct");
const utils_2 = require("./utils");
const NS = "zh:ezsp:driv";
const IEEE_PREFIX_MFG_ID = [
    { mfgId: 0x115f, prefix: [0x04, 0xcf, 0xfc] },
    { mfgId: 0x115f, prefix: [0x54, 0xef, 0x44] },
];
const DEFAULT_MFG_ID = 0x1049;
// we make three attempts to send the request
const REQUEST_ATTEMPT_DELAYS = [500, 1000, 1500];
class Driver extends node_events_1.EventEmitter {
    // @ts-expect-error XXX: init in startup
    ezsp;
    nwkOpt;
    // @ts-expect-error XXX: init in startup
    networkParams;
    // @ts-expect-error XXX: init in startup
    version;
    eui64ToNodeId = new Map();
    // private eui64ToRelays = new Map<string, number>();
    // @ts-expect-error XXX: init in startup
    ieee;
    // @ts-expect-error XXX: init in startup
    multicast;
    waitress;
    transactionID = 1;
    serialOpt;
    backupMan;
    constructor(serialOpt, nwkOpt, backupPath) {
        super();
        this.nwkOpt = nwkOpt;
        this.serialOpt = serialOpt;
        this.waitress = new utils_1.Waitress(this.waitressValidator, this.waitressTimeoutFormatter);
        this.backupMan = new backup_1.EZSPAdapterBackup(this, backupPath);
    }
    /**
     * Requested by the EZSP watchdog after too many failures, or by UART layer after port closed unexpectedly.
     * Tries to stop the layers below and startup again.
     * @returns
     */
    async reset() {
        logger_1.logger.debug("Reset connection.", NS);
        try {
            // don't emit 'close' on stop since we don't want this to bubble back up as 'disconnected' to the controller.
            await this.stop(false);
        }
        catch (err) {
            logger_1.logger.debug(`Stop error ${err}`, NS);
        }
        try {
            await (0, utils_1.wait)(1000);
            logger_1.logger.debug("Startup again.", NS);
            await this.startup();
        }
        catch (err) {
            logger_1.logger.debug(`Reset error ${err}`, NS);
            try {
                // here we let emit
                await this.stop();
            }
            catch (stopErr) {
                logger_1.logger.debug(`Failed to stop after failed reset ${stopErr}`, NS);
            }
        }
    }
    async onEzspReset() {
        logger_1.logger.debug("onEzspReset()", NS);
        await this.reset();
    }
    onEzspClose() {
        logger_1.logger.debug("onEzspClose()", NS);
        this.emit("close");
    }
    async stop(emitClose = true) {
        logger_1.logger.debug("Stopping driver", NS);
        if (this.ezsp) {
            return await this.ezsp.close(emitClose);
        }
    }
    async startup(transmitPower) {
        let result = "resumed";
        this.transactionID = 1;
        // this.ezsp = undefined;
        this.ezsp = new ezsp_1.Ezsp();
        this.ezsp.on("close", this.onEzspClose.bind(this));
        try {
            await this.ezsp.connect(this.serialOpt);
        }
        catch (error) {
            logger_1.logger.debug(`EZSP could not connect: ${error}`, NS);
            throw error;
        }
        this.ezsp.on("reset", this.onEzspReset.bind(this));
        await this.ezsp.version();
        await this.ezsp.updateConfig();
        await this.ezsp.updatePolicies();
        //await this.ezsp.setValue(EzspValueId.VALUE_MAXIMUM_OUTGOING_TRANSFER_SIZE, 82);
        //await this.ezsp.setValue(EzspValueId.VALUE_MAXIMUM_INCOMING_TRANSFER_SIZE, 82);
        await this.ezsp.setValue(named_1.EzspValueId.VALUE_END_DEVICE_KEEP_ALIVE_SUPPORT_MODE, 3);
        await this.ezsp.setValue(named_1.EzspValueId.VALUE_CCA_THRESHOLD, 0);
        await this.ezsp.setSourceRouting();
        //const count = await ezsp.getConfigurationValue(EzspConfigId.CONFIG_APS_UNICAST_MESSAGE_COUNT);
        //logger.info("APS_UNICAST_MESSAGE_COUNT is set to %s", count, NS);
        await this.addEndpoint({
            inputClusters: [0x0000, 0x0003, 0x0006, 0x000a, 0x0019, 0x001a, 0x0300],
            outputClusters: [
                0x0000, 0x0003, 0x0004, 0x0005, 0x0006, 0x0008, 0x0020, 0x0300, 0x0400, 0x0402, 0x0405, 0x0406, 0x0500, 0x0b01, 0x0b03, 0x0b04,
                0x0702, 0x1000, 0xfc01, 0xfc02,
            ],
        });
        await this.addEndpoint({
            endpoint: 242,
            profileId: 0xa1e0,
            deviceId: 0x61,
            outputClusters: [0x0021],
        });
        // getting MFG_STRING token
        //const mfgName = await ezsp.execCommand('getMfgToken', EzspMfgTokenId.MFG_STRING);
        // getting MFG_BOARD_NAME token
        //const boardName = await ezsp.execCommand('getMfgToken', EzspMfgTokenId.MFG_BOARD_NAME);
        let verInfo = await this.ezsp.getValue(named_1.EzspValueId.VALUE_VERSION_INFO);
        // biome-ignore lint/style/useConst: legacy
        let build;
        // biome-ignore lint/style/useConst: legacy
        let major;
        // biome-ignore lint/style/useConst: legacy
        let minor;
        // biome-ignore lint/style/useConst: legacy
        let patch;
        // biome-ignore lint/style/useConst: legacy
        let special;
        [build, verInfo] = types_1.uint16_t.deserialize(types_1.uint16_t, verInfo);
        [major, verInfo] = types_1.uint8_t.deserialize(types_1.uint8_t, verInfo);
        [minor, verInfo] = types_1.uint8_t.deserialize(types_1.uint8_t, verInfo);
        [patch, verInfo] = types_1.uint8_t.deserialize(types_1.uint8_t, verInfo);
        [special, verInfo] = types_1.uint8_t.deserialize(types_1.uint8_t, verInfo);
        const vers = `${major}.${minor}.${patch}.${special} build ${build}`;
        logger_1.logger.debug(`EmberZNet version: ${vers}`, NS);
        this.version = {
            product: this.ezsp.ezspV,
            majorrel: `${major}`,
            minorrel: `${minor}`,
            maintrel: `${patch} `,
            revision: vers,
        };
        if (await this.needsToBeInitialised(this.nwkOpt)) {
            // need to check the backup
            const restore = await this.needsToBeRestore(this.nwkOpt);
            const res = await this.ezsp.execCommand("networkState");
            logger_1.logger.debug(`Network state ${res.status}`, NS);
            if (res.status === named_1.EmberNetworkStatus.JOINED_NETWORK) {
                logger_1.logger.info("Leaving current network and forming new network", NS);
                const st = await this.ezsp.leaveNetwork();
                if (st !== types_1.EmberStatus.NETWORK_DOWN) {
                    logger_1.logger.error(`leaveNetwork returned unexpected status: ${st}`, NS);
                }
            }
            if (restore) {
                // restore
                logger_1.logger.info("Restore network from backup", NS);
                await this.formNetwork(true, transmitPower);
                result = "restored";
            }
            else {
                // reset
                logger_1.logger.info("Form network", NS);
                await this.formNetwork(false, transmitPower);
                result = "reset";
            }
        }
        const state = (await this.ezsp.execCommand("networkState")).status;
        logger_1.logger.debug(`Network state ${state}`, NS);
        const netParams = await this.ezsp.execCommand("getNetworkParameters");
        if (netParams.status !== types_1.EmberStatus.SUCCESS) {
            logger_1.logger.error(`Command (getNetworkParameters) returned unexpected state: ${netParams.status}`, NS);
        }
        this.networkParams = netParams.parameters;
        logger_1.logger.debug(`Node type: ${netParams.nodeType}, Network parameters: ${this.networkParams}`, NS);
        const nwk = (await this.ezsp.execCommand("getNodeId")).nodeId;
        const ieee = (await this.ezsp.execCommand("getEui64")).eui64;
        this.ieee = new named_1.EmberEUI64(ieee);
        logger_1.logger.debug("Network ready", NS);
        this.ezsp.on("frame", this.handleFrame.bind(this));
        logger_1.logger.debug(`EZSP nwk=${nwk}, IEEE=0x${this.ieee}`, NS);
        const linkResult = await this.getKey(named_1.EmberKeyType.TRUST_CENTER_LINK_KEY);
        logger_1.logger.debug(`TRUST_CENTER_LINK_KEY: ${JSON.stringify(linkResult)}`, NS);
        const netResult = await this.getKey(named_1.EmberKeyType.CURRENT_NETWORK_KEY);
        logger_1.logger.debug(`CURRENT_NETWORK_KEY: ${JSON.stringify(netResult)}`, NS);
        await (0, utils_1.wait)(1000);
        await this.ezsp.execCommand("setManufacturerCode", { code: DEFAULT_MFG_ID });
        this.multicast = new multicast_1.Multicast(this);
        await this.multicast.startup([]);
        await this.multicast.subscribe(ZSpec.GP_GROUP_ID, ZSpec.GP_ENDPOINT);
        // await this.multicast.subscribe(1, 901);
        if (transmitPower != null && this.networkParams.radioTxPower !== transmitPower) {
            await this.ezsp.execCommand("setRadioPower", { power: transmitPower });
        }
        return result;
    }
    async needsToBeInitialised(options) {
        let valid = true;
        valid = valid && (await this.ezsp.networkInit());
        const netParams = await this.ezsp.execCommand("getNetworkParameters");
        const networkParams = netParams.parameters;
        logger_1.logger.debug(`Current Node type: ${netParams.nodeType}, Network parameters: ${networkParams}`, NS);
        valid = valid && netParams.status === types_1.EmberStatus.SUCCESS;
        valid = valid && netParams.nodeType === types_1.EmberNodeType.COORDINATOR;
        valid = valid && options.panID === networkParams.panId;
        valid = valid && options.channelList.includes(networkParams.radioChannel);
        valid = valid && (0, es6_1.default)(options.extendedPanID, networkParams.extendedPanId);
        return !valid;
    }
    async formNetwork(restore, transmitPower) {
        let backup;
        await this.ezsp.execCommand("clearTransientLinkKeys");
        let initialSecurityState;
        if (restore) {
            backup = this.backupMan.getStoredBackup();
            if (!backup) {
                throw new Error("No valid backup found.");
            }
            initialSecurityState = (0, utils_2.emberSecurity)(backup.networkOptions.networkKey);
            initialSecurityState.bitmask |= named_1.EmberInitialSecurityBitmask.NO_FRAME_COUNTER_RESET;
            initialSecurityState.networkKeySequenceNumber = backup.networkKeyInfo.sequenceNumber;
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            initialSecurityState.preconfiguredKey.contents = backup.ezsp.hashed_tclk;
        }
        else {
            await this.ezsp.execCommand("clearKeyTable");
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            initialSecurityState = (0, utils_2.emberSecurity)(Buffer.from(this.nwkOpt.networkKey));
        }
        await this.ezsp.setInitialSecurityState(initialSecurityState);
        const parameters = new struct_1.EmberNetworkParameters();
        parameters.radioTxPower = transmitPower ?? 5;
        parameters.joinMethod = named_1.EmberJoinMethod.USE_MAC_ASSOCIATION;
        parameters.nwkManagerId = 0;
        parameters.nwkUpdateId = 0;
        parameters.channels = 0x07fff800; // all channels
        if (restore) {
            // `backup` valid from above
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            parameters.panId = backup.networkOptions.panId;
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            parameters.extendedPanId = backup.networkOptions.extendedPanId;
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            parameters.radioChannel = backup.logicalChannel;
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            parameters.nwkUpdateId = backup.networkUpdateId;
        }
        else {
            parameters.radioChannel = this.nwkOpt.channelList[0];
            parameters.panId = this.nwkOpt.panID;
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            parameters.extendedPanId = Buffer.from(this.nwkOpt.extendedPanID);
        }
        await this.ezsp.formNetwork(parameters);
        await this.ezsp.setValue(named_1.EzspValueId.VALUE_STACK_TOKEN_WRITING, 1);
    }
    handleFrame(frameName, frame) {
        switch (true) {
            case frameName === "incomingMessageHandler": {
                const apsFrame = frame.apsFrame;
                if (apsFrame.profileId === Zdo.ZDO_PROFILE_ID && apsFrame.clusterId >= 0x8000 /* response only */) {
                    const zdoResponse = Zdo.Buffalo.readResponse(true, apsFrame.clusterId, frame.message);
                    if (apsFrame.clusterId === Zdo.ClusterId.NETWORK_ADDRESS_RESPONSE) {
                        // special case to properly resolve a NETWORK_ADDRESS_RESPONSE following a NETWORK_ADDRESS_REQUEST (based on EUI64 from ZDO payload)
                        // NOTE: if response has invalid status (no EUI64 available), response waiter will eventually time out
                        if (Zdo.Buffalo.checkStatus(zdoResponse)) {
                            const eui64 = zdoResponse[1].eui64;
                            // update cache with new network address
                            this.eui64ToNodeId.set(eui64, frame.sender);
                            this.waitress.resolve({
                                address: eui64,
                                payload: frame.message,
                                frame: apsFrame,
                                zdoResponse,
                            });
                        }
                    }
                    else {
                        this.waitress.resolve({
                            address: frame.sender,
                            payload: frame.message,
                            frame: apsFrame,
                            zdoResponse,
                        });
                    }
                    // always pass ZDO to bubble up to controller
                    this.emit("incomingMessage", {
                        messageType: frame.type,
                        apsFrame,
                        lqi: frame.lastHopLqi,
                        rssi: frame.lastHopRssi,
                        sender: frame.sender,
                        bindingIndex: frame.bindingIndex,
                        addressIndex: frame.addressIndex,
                        message: frame.message,
                        senderEui64: this.eui64ToNodeId.get(frame.sender),
                        zdoResponse,
                    });
                }
                else {
                    const handled = this.waitress.resolve({
                        address: frame.sender,
                        payload: frame.message,
                        frame: apsFrame,
                    });
                    if (!handled) {
                        this.emit("incomingMessage", {
                            messageType: frame.type,
                            apsFrame,
                            lqi: frame.lastHopLqi,
                            rssi: frame.lastHopRssi,
                            sender: frame.sender,
                            bindingIndex: frame.bindingIndex,
                            addressIndex: frame.addressIndex,
                            message: frame.message,
                            senderEui64: this.eui64ToNodeId.get(frame.sender),
                        });
                    }
                }
                break;
            }
            case frameName === "trustCenterJoinHandler": {
                if (frame.status === named_1.EmberDeviceUpdate.DEVICE_LEFT) {
                    this.handleNodeLeft(frame.newNodeId, frame.newNodeEui64);
                }
                else {
                    if (frame.policyDecision !== types_1.EmberJoinDecision.DENY_JOIN) {
                        this.handleNodeJoined(frame.newNodeId, frame.newNodeEui64);
                    }
                }
                break;
            }
            case frameName === "incomingRouteRecordHandler": {
                this.handleRouteRecord(frame.source, frame.longId, frame.lastHopLqi, frame.lastHopRssi, frame.relay);
                break;
            }
            case frameName === "incomingRouteErrorHandler": {
                this.handleRouteError(frame.status, frame.target);
                break;
            }
            case frameName === "incomingNetworkStatusHandler": {
                this.handleNetworkStatus(frame.errorCode, frame.target);
                break;
            }
            case frameName === "messageSentHandler": {
                // todo
                const status = frame.status;
                if (status !== 0) {
                    // send failure
                    logger_1.logger.debug(() => `Delivery failed for ${JSON.stringify(frame)}.`, NS);
                }
                else {
                    // send success
                    // If there was a message to the group and this group is not known,
                    // then we will register the coordinator in this group
                    // Applicable for IKEA remotes
                    const msgType = frame.type;
                    if (msgType === named_1.EmberOutgoingMessageType.OUTGOING_MULTICAST) {
                        const apsFrame = frame.apsFrame;
                        if (apsFrame.destinationEndpoint === 255) {
                            this.multicast.subscribe(apsFrame.groupId, 1);
                        }
                    }
                }
                break;
            }
            case frameName === "macFilterMatchMessageHandler": {
                const [rawFrame, data] = struct_1.EmberIeeeRawFrame.deserialize(struct_1.EmberIeeeRawFrame, frame.message);
                logger_1.logger.debug(`macFilterMatchMessageHandler frame message: ${rawFrame}`, NS);
                this.emit("incomingMessage", {
                    messageType: null,
                    apsFrame: rawFrame,
                    lqi: frame.lastHopLqi,
                    rssi: frame.lastHopRssi,
                    sender: null,
                    bindingIndex: null,
                    addressIndex: null,
                    message: data,
                    senderEui64: new named_1.EmberEUI64(rawFrame.sourceAddress),
                });
                break;
            }
            case frameName === "stackStatusHandler": {
                logger_1.logger.debug(`stackStatusHandler: ${types_1.EmberStatus.valueToName(types_1.EmberStatus, frame.status)}`, NS);
                break;
            }
            // case (frameName === 'childJoinHandler'): {
            //     if (!frame.joining) {
            //         this.handleNodeLeft(frame.childId, frame.childEui64);
            //     } else {
            //         this.handleNodeJoined(frame.childId, frame.childEui64);
            //     }
            //     break;
            // }
            case frameName === "gpepIncomingMessageHandler": {
                let commandIdentifier = cluster_1.Clusters.greenPower.commands.notification.ID;
                if (frame.gpdCommandId === 0xe0) {
                    if (!frame.gpdCommandPayload.length) {
                        // XXX: seem to be receiving duplicate commissioningNotification from some devices, second one with empty payload?
                        //      this will mess with the process no doubt, so dropping them
                        return;
                    }
                    commandIdentifier = cluster_1.Clusters.greenPower.commands.commissioningNotification.ID;
                }
                const gpdHeader = Buffer.alloc(15);
                gpdHeader.writeUInt8(0b00000001, 0); // frameControl: FrameType.SPECIFIC + Direction.CLIENT_TO_SERVER + disableDefaultResponse=false
                gpdHeader.writeUInt8(frame.sequenceNumber, 1); // transactionSequenceNumber
                gpdHeader.writeUInt8(commandIdentifier, 2); // commandIdentifier
                gpdHeader.writeUInt16LE(0, 3); // options XXX: bypassed, same as deconz https://github.com/Koenkk/zigbee-herdsman/pull/536
                gpdHeader.writeUInt32LE(frame.srcId, 5); // srcID
                // omitted: gpdIEEEAddr ieeeAddr
                // omitted: gpdEndpoint uint8
                gpdHeader.writeUInt32LE(frame.gpdSecurityFrameCounter, 9); // frameCounter
                gpdHeader.writeUInt8(frame.gpdCommandId, 13); // commandID
                gpdHeader.writeUInt8(frame.gpdCommandPayload.length, 14); // payloadSize
                const gpdMessage = {
                    messageType: frame.gpdCommandId,
                    apsFrame: {
                        profileId: 0xa1e0,
                        sourceEndpoint: 242,
                        clusterId: 0x0021,
                        sequence: frame.sequenceNumber,
                    },
                    lqi: frame.gpdLink,
                    message: Buffer.concat([gpdHeader, frame.gpdCommandPayload]),
                    sender: frame.addr,
                };
                this.emit("incomingMessage", gpdMessage);
                break;
            }
            default:
                // <=== Application frame 35 (childJoinHandler) received: 00013e9c2ebd08feff9ffd9004 +1ms
                // <=== Application frame 35 (childJoinHandler)   parsed: 0,1,39998,144,253,159,255,254,8,189,46,4 +1ms
                // Unhandled frame childJoinHandler +2s
                // <=== Application frame 98 (incomingSenderEui64Handler) received: 2ebd08feff9ffd90 +2ms
                // <=== Application frame 98 (incomingSenderEui64Handler)   parsed: 144,253,159,255,254,8,189,46 +1ms
                // Unhandled frame incomingSenderEui64Handler
                // <=== Application frame 155 (zigbeeKeyEstablishmentHandler) received: 2ebd08feff9ffd9006 +2ms
                // <=== Application frame 155 (zigbeeKeyEstablishmentHandler)   parsed: 144,253,159,255,254,8,189,46,6 +2ms
                // Unhandled frame zigbeeKeyEstablishmentHandler
                logger_1.logger.debug(`Unhandled frame ${frameName}`, NS);
        }
    }
    handleRouteRecord(nwk, ieee, lqi, rssi, relays) {
        // todo
        logger_1.logger.debug(`handleRouteRecord: nwk=${nwk}, ieee=${ieee.toString()}, lqi=${lqi}, rssi=${rssi}, relays=${relays}`, NS);
        this.setNode(nwk, ieee);
        // if (ieee && !(ieee instanceof EmberEUI64)) {
        //     ieee = new EmberEUI64(ieee);
        // }
        // this.eui64ToRelays.set(ieee.toString(), relays);
    }
    handleRouteError(status, nwk) {
        // todo
        logger_1.logger.debug(`handleRouteError: nwk=${nwk}, status=${status}`, NS);
        //this.waitress.reject({address: nwk, payload: null, frame: null}, 'Route error');
        // const ieee = await this.networkIdToEUI64(nwk);
        // this.eui64ToRelays.set(ieee.toString(), null);
    }
    handleNetworkStatus(errorCode, nwk) {
        // todo
        // <== Frame: e19401c4000684c5
        // <== 0xc4: {
        //     "_cls_":"incomingNetworkStatusHandler",
        //     "_id_":196,
        //     "_isRequest_":false,
        //     "errorCode":6,
        //     "target":50564
        // }
        // https://docs.silabs.com/d/zigbee-stack-api/7.4.0/message#ember-incoming-network-status-handler
        logger_1.logger.debug(`handleNetworkStatus: nwk=${nwk}, errorCode=${errorCode}`, NS);
    }
    handleNodeLeft(nwk, ieee) {
        if (ieee && !(ieee instanceof named_1.EmberEUI64)) {
            ieee = new named_1.EmberEUI64(ieee);
        }
        this.eui64ToNodeId.delete(ieee.toString());
        this.emit("deviceLeft", nwk, ieee);
    }
    async resetMfgId(mfgId) {
        await this.ezsp.execCommand("setManufacturerCode", { code: mfgId });
        // 60 sec for waiting
        await (0, utils_1.wait)(60000);
        await this.ezsp.execCommand("setManufacturerCode", { code: DEFAULT_MFG_ID });
    }
    handleNodeJoined(nwk, ieee) {
        if (ieee && !(ieee instanceof named_1.EmberEUI64)) {
            ieee = new named_1.EmberEUI64(ieee);
        }
        for (const rec of IEEE_PREFIX_MFG_ID) {
            if (Buffer.from(ieee.value).indexOf(Buffer.from(rec.prefix)) === 0) {
                // set ManufacturerCode
                logger_1.logger.debug(`handleNodeJoined: change ManufacturerCode for ieee ${ieee} to ${rec.mfgId}`, NS);
                this.resetMfgId(rec.mfgId);
                break;
            }
        }
        this.eui64ToNodeId.set(ieee.toString(), nwk);
        this.emit("deviceJoined", nwk, ieee);
    }
    setNode(nwk, ieee) {
        if (ieee && !(ieee instanceof named_1.EmberEUI64)) {
            ieee = new named_1.EmberEUI64(ieee);
        }
        this.eui64ToNodeId.set(ieee.toString(), nwk);
    }
    async request(nwk, apsFrame, data, extendedTimeout = false) {
        let result = false;
        for (const delay of REQUEST_ATTEMPT_DELAYS) {
            try {
                const seq = (apsFrame.sequence + 1) & 0xff;
                let eui64;
                if (typeof nwk !== "number") {
                    eui64 = nwk;
                    const strEui64 = eui64.toString();
                    let nodeId = this.eui64ToNodeId.get(strEui64);
                    if (nodeId === undefined) {
                        nodeId = (await this.ezsp.execCommand("lookupNodeIdByEui64", { eui64: eui64 })).nodeId;
                        if (nodeId && nodeId !== 0xffff) {
                            this.eui64ToNodeId.set(strEui64, nodeId);
                        }
                        else {
                            throw new Error(`Unknown EUI64:${strEui64}`);
                        }
                    }
                    nwk = nodeId;
                }
                else {
                    eui64 = await this.networkIdToEUI64(nwk);
                }
                if (this.ezsp.ezspV < 8) {
                    // const route = this.eui64ToRelays.get(eui64.toString());
                    // if (route) {
                    //     const = await this.ezsp.execCommand('setSourceRoute', {eui64});
                    // // }
                }
                if (extendedTimeout) {
                    await this.ezsp.execCommand("setExtendedTimeout", { remoteEui64: eui64, extendedTimeout: true });
                }
                const sendResult = await this.ezsp.sendUnicast(named_1.EmberOutgoingMessageType.OUTGOING_DIRECT, nwk, apsFrame, seq, data);
                // repeat only for these statuses
                if ([types_1.EmberStatus.MAX_MESSAGE_LIMIT_REACHED, types_1.EmberStatus.NO_BUFFERS, types_1.EmberStatus.NETWORK_BUSY].includes(sendResult.status)) {
                    // need to repeat after pause
                    logger_1.logger.error(`Request send status ${sendResult.status}. Attempt to repeat the request`, NS);
                    await (0, utils_1.wait)(delay);
                }
                else {
                    result = sendResult.status === types_1.EmberStatus.SUCCESS;
                    break;
                }
            }
            catch (e) {
                logger_1.logger.debug(`Request error ${e}`, NS);
                break;
            }
        }
        return result;
    }
    async mrequest(apsFrame, data, _timeout = 30000) {
        try {
            const seq = (apsFrame.sequence + 1) & 0xff;
            await this.ezsp.sendMulticast(apsFrame, seq, data);
            return true;
        }
        catch {
            return false;
        }
    }
    async rawrequest(rawFrame, data, _timeout = 10000) {
        try {
            const msgData = Buffer.concat([struct_1.EmberRawFrame.serialize(struct_1.EmberRawFrame, rawFrame), data]);
            await this.ezsp.execCommand("sendRawMessage", { message: msgData });
            return true;
        }
        catch (e) {
            logger_1.logger.debug(`Request error ${e}`, NS);
            return false;
        }
    }
    async ieeerawrequest(rawFrame, data, _timeout = 10000) {
        try {
            const msgData = Buffer.concat([struct_1.EmberIeeeRawFrame.serialize(struct_1.EmberIeeeRawFrame, rawFrame), data]);
            await this.ezsp.execCommand("sendRawMessage", { message: msgData });
            return true;
        }
        catch (e) {
            logger_1.logger.debug(`Request error ${e}`, NS);
            return false;
        }
    }
    async brequest(destination, apsFrame, data) {
        try {
            const seq = (apsFrame.sequence + 1) & 0xff;
            await this.ezsp.sendBroadcast(destination, apsFrame, seq, data);
            return true;
        }
        catch {
            return false;
        }
    }
    nextTransactionID() {
        this.transactionID = (this.transactionID + 1) & 0xff;
        return this.transactionID;
    }
    makeApsFrame(clusterId, disableResponse) {
        const frame = new struct_1.EmberApsFrame();
        frame.clusterId = clusterId;
        frame.profileId = 0;
        frame.sequence = this.nextTransactionID();
        frame.sourceEndpoint = 0;
        frame.destinationEndpoint = 0;
        frame.groupId = 0;
        frame.options = types_1.EmberApsOption.APS_OPTION_ENABLE_ROUTE_DISCOVERY || types_1.EmberApsOption.APS_OPTION_ENABLE_ADDRESS_DISCOVERY;
        if (!disableResponse) {
            frame.options ||= types_1.EmberApsOption.APS_OPTION_RETRY;
        }
        return frame;
    }
    makeEmberRawFrame() {
        const frame = new struct_1.EmberRawFrame();
        frame.sequence = this.nextTransactionID();
        return frame;
    }
    makeEmberIeeeRawFrame() {
        const frame = new struct_1.EmberIeeeRawFrame();
        frame.sequence = this.nextTransactionID();
        return frame;
    }
    async networkIdToEUI64(nwk) {
        for (const [eUI64, value] of this.eui64ToNodeId) {
            if (value === nwk)
                return new named_1.EmberEUI64(eUI64);
        }
        const value = await this.ezsp.execCommand("lookupEui64ByNodeId", { nodeId: nwk });
        if (value.status === types_1.EmberStatus.SUCCESS) {
            const eUI64 = new named_1.EmberEUI64(value.eui64);
            this.eui64ToNodeId.set(eUI64.toString(), nwk);
            return eUI64;
        }
        throw new Error(`Unrecognized nodeId:${nwk}`);
    }
    async preJoining(seconds) {
        if (seconds) {
            const ieee = new named_1.EmberEUI64("0xFFFFFFFFFFFFFFFF");
            const linkKey = new types_1.EmberKeyData();
            linkKey.contents = Buffer.from("ZigBeeAlliance09");
            const result = await this.addTransientLinkKey(ieee, linkKey);
            if (result.status !== types_1.EmberStatus.SUCCESS) {
                throw new Error(`Add Transient Link Key for '${ieee}' failed`);
            }
            if (this.ezsp.ezspV >= 8) {
                await this.ezsp.setPolicy(named_1.EzspPolicyId.TRUST_CENTER_POLICY, named_1.EzspDecisionBitmask.ALLOW_UNSECURED_REJOINS | named_1.EzspDecisionBitmask.ALLOW_JOINS);
                //| EzspDecisionBitmask.JOINS_USE_INSTALL_CODE_KEY
            }
        }
        else {
            await this.ezsp.execCommand("clearTransientLinkKeys");
        }
    }
    async permitJoining(seconds) {
        return await this.ezsp.execCommand("permitJoining", { duration: seconds });
    }
    makeZDOframe(name, params) {
        return this.ezsp.makeZDOframe(name, params);
    }
    async addEndpoint({ endpoint = 1, profileId = 260, deviceId = 0xbeef, appFlags = 0, inputClusters = [], outputClusters = [], }) {
        const res = await this.ezsp.execCommand("addEndpoint", {
            endpoint: endpoint,
            profileId: profileId,
            deviceId: deviceId,
            appFlags: appFlags,
            inputClusterCount: inputClusters.length,
            outputClusterCount: outputClusters.length,
            inputClusterList: inputClusters,
            outputClusterList: outputClusters,
        });
        logger_1.logger.debug(() => `Ezsp adding endpoint: ${JSON.stringify(res)}`, NS);
    }
    waitFor(address, clusterId, sequence, timeout = 10000) {
        const waiter = this.waitress.waitFor({ address, clusterId, sequence }, timeout);
        return { ...waiter, cancel: () => this.waitress.remove(waiter.ID) };
    }
    waitressTimeoutFormatter(matcher, timeout) {
        return `${JSON.stringify(matcher)} after ${timeout}ms`;
    }
    waitressValidator(payload, matcher) {
        return ((!matcher.address || payload.address === matcher.address) &&
            (!payload.frame || payload.frame.clusterId === matcher.clusterId) &&
            (!payload.frame || payload.payload[0] === matcher.sequence));
    }
    setChannel(channel) {
        return this.ezsp.execCommand("setLogicalAndRadioChannel", { radioChannel: channel });
    }
    addTransientLinkKey(partner, transientKey) {
        if (this.ezsp.ezspV < 13) {
            return this.ezsp.execCommand("addTransientLinkKey", { partner, transientKey });
        }
        return this.ezsp.execCommand("importTransientKey", { partner, transientKey, flags: 0 });
    }
    async addInstallCode(ieeeAddress, key, hashed) {
        const ieee = new named_1.EmberEUI64(ieeeAddress);
        const linkKey = new types_1.EmberKeyData();
        linkKey.contents = hashed ? key : ZSpec.Utils.aes128MmoHash(key);
        const result = await this.addTransientLinkKey(ieee, linkKey);
        if (result.status !== types_1.EmberStatus.SUCCESS) {
            throw new Error(`Add install code for '${ieeeAddress}' failed`);
        }
    }
    async getKey(keyType) {
        if (this.ezsp.ezspV < 13) {
            return await this.ezsp.execCommand("getKey", { keyType });
        }
        // Mapping EmberKeyType to SecManKeyType (ezsp13)
        const SecManKeyType = {
            [named_1.EmberKeyType.TRUST_CENTER_LINK_KEY]: 2,
            [named_1.EmberKeyType.CURRENT_NETWORK_KEY]: 1,
        };
        const smc = new struct_1.EmberSecurityManagerContext();
        smc.type = SecManKeyType[keyType];
        smc.index = 0;
        smc.derivedType = named_1.EmberDerivedKeyType.NONE;
        smc.eui64 = new named_1.EmberEUI64("0x0000000000000000");
        smc.multiNetworkIndex = 0;
        smc.flags = 0;
        smc.psaKeyAlgPermission = 0;
        const keyInfo = await this.ezsp.execCommand("exportKey", { context: smc });
        if (keyInfo.status !== named_1.SLStatus.SL_STATUS_OK) {
            logger_1.logger.error(`exportKey(${named_1.EmberKeyType.valueToName(named_1.EmberKeyType, keyType)}) returned unexpected SL status: ${keyInfo.status}`, NS);
        }
        return keyInfo;
    }
    async getNetworkKeyInfo() {
        if (this.ezsp.ezspV < 13) {
            throw new Error("getNetKeyInfo(): Invalid call on EZSP < 13.");
        }
        const keyInfo = await this.ezsp.execCommand("getNetworkKeyInfo");
        if (keyInfo.status !== named_1.SLStatus.SL_STATUS_OK) {
            logger_1.logger.error(`getNetworkKeyInfo() returned unexpected SL status: ${keyInfo.status}`, NS);
        }
        return keyInfo;
    }
    async needsToBeRestore(options) {
        // if no backup and the settings have been changed, then need to start a new network
        const backup = this.backupMan.getStoredBackup();
        if (!backup)
            return false;
        let valid = true;
        //valid = valid && (await this.ezsp.networkInit());
        const netParams = await this.ezsp.execCommand("getNetworkParameters");
        const networkParams = netParams.parameters;
        logger_1.logger.debug(`Current Node type: ${netParams.nodeType}, Network parameters: ${networkParams}`, NS);
        logger_1.logger.debug(`Backuped network parameters: ${backup.networkOptions}`, NS);
        const networkKey = await this.getKey(named_1.EmberKeyType.CURRENT_NETWORK_KEY);
        let netKey;
        if (this.ezsp.ezspV < 13) {
            netKey = Buffer.from(networkKey.keyStruct.key.contents);
        }
        else {
            netKey = Buffer.from(networkKey.keyData.contents);
        }
        // if the settings in the backup match the chip, then need to warn to delete the backup file first
        valid = valid && networkParams.panId === backup.networkOptions.panId;
        valid = valid && networkParams.radioChannel === backup.logicalChannel;
        valid = valid && Buffer.from(networkParams.extendedPanId).equals(backup.networkOptions.extendedPanId);
        valid = valid && Buffer.from(netKey).equals(backup.networkOptions.networkKey);
        if (valid) {
            logger_1.logger.error("Configuration is not consistent with adapter backup!", NS);
            logger_1.logger.error(`- PAN ID: configured=${options.panID}, adapter=${networkParams.panId}, backup=${backup.networkOptions.panId}`, NS);
            logger_1.logger.error(`- Extended PAN ID: configured=${
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            Buffer.from(options.extendedPanID).toString("hex")}, ` +
                `adapter=${Buffer.from(networkParams.extendedPanId).toString("hex")}, ` +
                `backup=${Buffer.from(networkParams.extendedPanId).toString("hex")}`, NS);
            logger_1.logger.error(`- Channel: configured=${options.channelList}, adapter=${networkParams.radioChannel}, backup=${backup.logicalChannel}`, NS);
            logger_1.logger.error(`- Network key: configured=${
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            Buffer.from(options.networkKey).toString("hex")}, ` +
                `adapter=${Buffer.from(netKey).toString("hex")}, ` +
                `backup=${backup.networkOptions.networkKey.toString("hex")}`, NS);
            logger_1.logger.error("Please update configuration to prevent further issues.", NS);
            logger_1.logger.error("If you wish to re-commission your network, please remove coordinator backup.", NS);
            logger_1.logger.error("Re-commissioning your network will require re-pairing of all devices!", NS);
            throw new Error("startup failed - configuration-adapter mismatch - see logs above for more information");
        }
        valid = true;
        // if the settings in the backup match the config, then the old network is in the chip and needs to be restored
        valid = valid && options.panID === backup.networkOptions.panId;
        valid = valid && options.channelList.includes(backup.logicalChannel);
        // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
        valid = valid && Buffer.from(options.extendedPanID).equals(backup.networkOptions.extendedPanId);
        // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
        valid = valid && Buffer.from(options.networkKey).equals(backup.networkOptions.networkKey);
        return valid;
    }
}
exports.Driver = Driver;
//# sourceMappingURL=driver.js.map