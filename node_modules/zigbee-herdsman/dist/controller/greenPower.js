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
exports.GreenPower = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const node_crypto_1 = require("node:crypto");
const node_events_1 = require("node:events");
const zigbee_1 = require("zigbee-on-host/dist/zigbee/zigbee");
const logger_1 = require("../utils/logger");
const consts_1 = require("../zspec/consts");
const enums_1 = require("../zspec/enums");
const Zcl = __importStar(require("../zspec/zcl"));
const zclTransactionSequenceNumber_1 = __importDefault(require("./helpers/zclTransactionSequenceNumber"));
const model_1 = require("./model");
const NS = "zh:controller:greenpower";
class GreenPower extends node_events_1.EventEmitter {
    adapter;
    constructor(adapter) {
        super();
        this.adapter = adapter;
    }
    static sourceIdToIeeeAddress(sourceId) {
        return `0x${sourceId.toString(16).padStart(16, "0")}`;
    }
    encryptSecurityKey(sourceID, securityKey) {
        const nonce = Buffer.alloc(13);
        nonce.writeUInt32LE(sourceID, 0);
        nonce.writeUInt32LE(sourceID, 4);
        nonce.writeUInt32LE(sourceID, 8);
        nonce.writeUInt8(0x05, 12);
        const cipher = (0, node_crypto_1.createCipheriv)("aes-128-ccm", Buffer.from(consts_1.INTEROPERABILITY_LINK_KEY), nonce, { authTagLength: 16 });
        const encrypted = cipher.update(securityKey);
        return Buffer.concat([encrypted, cipher.final()]);
    }
    decryptPayload(sourceID, frameCounter, securityKey, payload) {
        const nonce = Buffer.alloc(13);
        nonce.writeUInt32LE(sourceID, 0);
        nonce.writeUInt32LE(sourceID, 4);
        nonce.writeUInt32LE(frameCounter, 8);
        nonce.writeUInt8(0x05, 12);
        const [, decryptedPayload] = (0, zigbee_1.aes128CcmStar)(4, securityKey, nonce, payload);
        return decryptedPayload;
    }
    static encodePairingOptions(options) {
        return ((options.appId & 0x7) |
            (((options.addSink ? 1 : 0) << 3) & 0x8) |
            (((options.removeGpd ? 1 : 0) << 4) & 0x10) |
            ((options.communicationMode << 5) & 0x60) |
            (((options.gpdFixed ? 1 : 0) << 7) & 0x80) |
            (((options.gpdMacSeqNumCapabilities ? 1 : 0) << 8) & 0x100) |
            ((options.securityLevel << 9) & 0x600) |
            ((options.securityKeyType << 11) & 0x3800) |
            (((options.gpdSecurityFrameCounterPresent ? 1 : 0) << 14) & 0x4000) |
            (((options.gpdSecurityKeyPresent ? 1 : 0) << 15) & 0x8000) |
            (((options.assignedAliasPresent ? 1 : 0) << 16) & 0x10000) |
            (((options.groupcastRadiusPresent ? 1 : 0) << 17) & 0x20000)
        // bits 18..23 reserved
        );
    }
    static decodePairingOptions(byte) {
        return {
            appId: byte & 0x7,
            addSink: Boolean((byte & 0x8) >> 3),
            removeGpd: Boolean((byte & 0x10) >> 4),
            communicationMode: (byte & 0x60) >> 5,
            gpdFixed: Boolean((byte & 0x80) >> 7),
            gpdMacSeqNumCapabilities: Boolean((byte & 0x100) >> 8),
            securityLevel: (byte & 0x600) >> 9,
            securityKeyType: (byte & 0x3800) >> 11,
            gpdSecurityFrameCounterPresent: Boolean((byte & 0x4000) >> 14),
            gpdSecurityKeyPresent: Boolean((byte & 0x8000) >> 15),
            assignedAliasPresent: Boolean((byte & 0x10000) >> 16),
            groupcastRadiusPresent: Boolean((byte & 0x20000) >> 17),
            // bits 18..23 reserved
        };
    }
    /** see 14-0563-19 A.3.3.5.2 */
    async sendPairingCommand(options, payload, gppNwkAddr) {
        payload.options = GreenPower.encodePairingOptions(options);
        logger_1.logger.debug(`[PAIRING] srcID=${payload.srcID} gpp=${gppNwkAddr ?? "NO"} options=${payload.options} (addSink=${options.addSink} commMode=${options.communicationMode})`, NS);
        // Set sink address based on communication mode
        switch (options.communicationMode) {
            case 2 /* GPCommunicationMode.GroupcastToPrecommissionedGroupId */:
            case 1 /* GPCommunicationMode.GroupcastToDgroupId */: {
                payload.sinkGroupID = consts_1.GP_GROUP_ID;
                break;
            }
            /* v8 ignore next */
            case 0 /* GPCommunicationMode.FullUnicast */:
            case 3 /* GPCommunicationMode.LightweightUnicast */: {
                payload.sinkIEEEAddr = await this.adapter.getCoordinatorIEEE();
                payload.sinkNwkAddr = consts_1.COORDINATOR_ADDRESS;
                break;
            }
        }
        const replyFrame = Zcl.Frame.create(Zcl.FrameType.SPECIFIC, Zcl.Direction.SERVER_TO_CLIENT, true, undefined, zclTransactionSequenceNumber_1.default.next(), "pairing", Zcl.Clusters.greenPower.ID, payload, {});
        if (options.communicationMode !== 3 /* GPCommunicationMode.LightweightUnicast */) {
            await this.adapter.sendZclFrameToAll(consts_1.GP_ENDPOINT, replyFrame, consts_1.GP_ENDPOINT, enums_1.BroadcastAddress.RX_ON_WHEN_IDLE);
            return;
        }
        const device = model_1.Device.byNetworkAddress(gppNwkAddr ?? /* v8 ignore next */ consts_1.COORDINATOR_ADDRESS);
        (0, node_assert_1.default)(device, "Failed to find green power proxy device");
        return await this.adapter.sendZclFrameToEndpoint(device.ieeeAddr, device.networkAddress, consts_1.GP_ENDPOINT, replyFrame, 10000, false, false, consts_1.GP_ENDPOINT);
    }
    async processCommand(dataPayload, frame, securityKey) {
        try {
            // notification: A.3.3.4.1
            // commissioningNotification: A.3.3.4.3
            const isCommissioningNotification = frame.header.commandIdentifier === Zcl.Clusters.greenPower.commands.commissioningNotification.ID;
            const securityLevel = isCommissioningNotification ? (frame.payload.options >> 4) & 0x3 : (frame.payload.options >> 6) & 0x3;
            if (securityLevel === 3 /* ZigbeeNWKGPSecurityLevel.FullEncr */ &&
                (!isCommissioningNotification || ((frame.payload.options >> 9) & 0x1) === 1) /* security processing failed */) {
                if (!securityKey) {
                    logger_1.logger.error(`[FULLENCR] srcID=${frame.payload.srcID} gpp=${frame.payload.gppNwkAddr ?? "NO"} commandIdentifier=${frame.header.commandIdentifier} Unknown security key`, NS);
                    return frame;
                }
                const oldHeader = dataPayload.data.subarray(0, 15);
                let dataEndOffset = dataPayload.data.byteLength;
                if (isCommissioningNotification) {
                    const hasMic = frame.payload.options & 0x200;
                    const hasGppData = frame.payload.options & 0x800;
                    if (hasGppData) {
                        dataEndOffset -= 3;
                    }
                    if (hasMic) {
                        dataEndOffset -= 4;
                    }
                }
                else {
                    const hasGppData = frame.payload.options & 0x4000;
                    if (hasGppData) {
                        dataEndOffset -= 3;
                    }
                }
                const hashedKey = this.encryptSecurityKey(frame.payload.srcID, securityKey);
                // 4 bytes appended for MIC placeholder (just needs the bytes present for decrypt)
                const payload = Buffer.from([frame.payload.commandID, ...dataPayload.data.subarray(15, dataEndOffset), 0, 0, 0, 0]);
                const decrypted = this.decryptPayload(frame.payload.srcID, frame.payload.frameCounter, hashedKey, payload);
                const newHeader = Buffer.alloc(15);
                newHeader.set(oldHeader, 0);
                // flip necessary bits in options before re-parsing
                // - "securityLevel" to ZigbeeNWKGPSecurityLevel.NO (for ease) and "securityProcessingFailed" to 0
                // - "securityLevel" to ZigbeeNWKGPSecurityLevel.NO (for ease)
                newHeader.writeUInt16LE(isCommissioningNotification ? frame.payload.options & ~0x30 & ~0x200 : frame.payload.options & ~0xc0, 3);
                newHeader.writeUInt8(decrypted[0], oldHeader.byteLength - 2); // commandID
                newHeader.writeUInt8(decrypted.byteLength - 1, oldHeader.byteLength - 1); // payloadSize
                // re-parse with decrypted data
                frame = Zcl.Frame.fromBuffer(dataPayload.clusterID, dataPayload.header, Buffer.concat([newHeader, decrypted.subarray(1), dataPayload.data.subarray(dataEndOffset)]), {});
            }
            let logStr;
            /* v8 ignore start */
            if (frame.payload.gppGpdLink !== undefined) {
                const rssi = frame.payload.gppGpdLink & 0x3f;
                const linkQuality = (frame.payload.gppGpdLink >> 6) & 0x3;
                let linkQualityStr;
                switch (linkQuality) {
                    case 0b00:
                        linkQualityStr = "Poor";
                        break;
                    case 0b01:
                        linkQualityStr = "Moderate";
                        break;
                    case 0b10:
                        linkQualityStr = "High";
                        break;
                    case 0b11:
                        linkQualityStr = "Excellent";
                        break;
                }
                logStr = `srcID=${frame.payload.srcID} gpp=${frame.payload.gppNwkAddr} rssi=${rssi} linkQuality=${linkQualityStr}`;
            }
            else {
                logStr = `srcID=${frame.payload.srcID} gpp=NO`;
            }
            /* v8 ignore stop */
            switch (frame.payload.commandID) {
                case 0xe0: {
                    logger_1.logger.info(`[COMMISSIONING] ${logStr}`, NS);
                    /* v8 ignore start */
                    if (frame.payload.options & 0x200) {
                        logger_1.logger.warning(`[COMMISSIONING] ${logStr} Security processing marked as failed`, NS);
                    }
                    /* v8 ignore stop */
                    const rxOnCap = frame.payload.commandFrame.options & 0x2;
                    const gpdMacSeqNumCapabilities = Boolean(frame.payload.commandFrame.options & 0x1);
                    const gpdFixed = Boolean(frame.payload.commandFrame.options & 0x40);
                    if (rxOnCap) {
                        // RX capable GPD needs GP Commissioning Reply
                        logger_1.logger.debug(`[COMMISSIONING] ${logStr} GPD has receiving capabilities in operational mode (RxOnCapability)`, NS);
                        // NOTE: currently encryption is disabled for RX capable GPDs
                        const networkParameters = await this.adapter.getNetworkParameters();
                        // Commissioning reply
                        const payloadResponse = {
                            options: 0,
                            tempMaster: frame.payload.gppNwkAddr ?? /* v8 ignore next */ consts_1.COORDINATOR_ADDRESS,
                            tempMasterTx: networkParameters.channel - 11,
                            srcID: frame.payload.srcID,
                            gpdCmd: 0xf0,
                            gpdPayload: {
                                commandID: 0xf0,
                                options: 0b00000000, // Disable encryption
                                // panID: number,
                                // securityKey: frame.payload.commandFrame.securityKey,
                                // keyMic: frame.payload.commandFrame.keyMic,
                                // frameCounter: number,
                            },
                        };
                        const replyFrame = Zcl.Frame.create(Zcl.FrameType.SPECIFIC, Zcl.Direction.SERVER_TO_CLIENT, true, undefined, zclTransactionSequenceNumber_1.default.next(), "response", Zcl.Clusters.greenPower.ID, payloadResponse, {});
                        await this.adapter.sendZclFrameToAll(consts_1.GP_ENDPOINT, replyFrame, consts_1.GP_ENDPOINT, enums_1.BroadcastAddress.RX_ON_WHEN_IDLE);
                        await this.sendPairingCommand({
                            appId: 0 /* ZigbeeNWKGPAppId.Default */,
                            addSink: true,
                            removeGpd: false,
                            communicationMode: 1 /* GPCommunicationMode.GroupcastToDgroupId */,
                            gpdFixed,
                            gpdMacSeqNumCapabilities,
                            securityLevel: 0 /* ZigbeeNWKGPSecurityLevel.No */,
                            securityKeyType: 0 /* ZigbeeNWKGPSecurityKeyType.NoKey */,
                            gpdSecurityFrameCounterPresent: false,
                            gpdSecurityKeyPresent: false,
                            assignedAliasPresent: false,
                            groupcastRadiusPresent: false,
                        }, {
                            options: 0, // set from first param in `sendPairingCommand`
                            srcID: frame.payload.srcID,
                            deviceID: frame.payload.commandFrame.deviceID,
                        }, frame.payload.gppNwkAddr);
                    }
                    else {
                        const gpdKey = this.encryptSecurityKey(frame.payload.srcID, frame.payload.commandFrame.securityKey);
                        const pairingRsp = await this.sendPairingCommand({
                            appId: 0 /* ZigbeeNWKGPAppId.Default */,
                            addSink: true,
                            removeGpd: false,
                            // keep communication mode matching incoming tx mode
                            communicationMode: dataPayload.wasBroadcast
                                ? 2 /* GPCommunicationMode.GroupcastToPrecommissionedGroupId */
                                : 3 /* GPCommunicationMode.LightweightUnicast */,
                            gpdFixed,
                            gpdMacSeqNumCapabilities,
                            securityLevel: 2 /* ZigbeeNWKGPSecurityLevel.Full */,
                            securityKeyType: 4 /* ZigbeeNWKGPSecurityKeyType.PreconfiguredIndividualGpdKey */,
                            gpdSecurityFrameCounterPresent: true,
                            gpdSecurityKeyPresent: true,
                            assignedAliasPresent: false,
                            groupcastRadiusPresent: false,
                        }, {
                            options: 0, // set from first param in `sendPairingCommand`
                            srcID: frame.payload.srcID,
                            deviceID: frame.payload.commandFrame.deviceID,
                            frameCounter: frame.payload.commandFrame.outgoingCounter,
                            gpdKey,
                        }, frame.payload.gppNwkAddr);
                        // undefined if wasBroadcast
                        if (pairingRsp) {
                            const pairingRspFrame = Zcl.Frame.fromBuffer(pairingRsp.clusterID, pairingRsp.header, pairingRsp.data, {});
                            if (pairingRspFrame.payload.statusCode !== Zcl.Status.SUCCESS) {
                                throw new Zcl.StatusError(pairingRspFrame.payload.statusCode);
                            }
                        }
                    }
                    this.emit("deviceJoined", {
                        sourceID: frame.payload.srcID,
                        deviceID: frame.payload.commandFrame.deviceID,
                        // XXX: this has the potential to create conflicting network addresses
                        networkAddress: frame.payload.srcID & 0xffff,
                        securityKey: frame.payload.commandFrame.securityKey,
                    });
                    break;
                }
                case 0xe1: {
                    logger_1.logger.debug(`[DECOMMISSIONING] ${logStr}`, NS);
                    await this.sendPairingCommand({
                        appId: 0 /* ZigbeeNWKGPAppId.Default */,
                        addSink: false,
                        removeGpd: true,
                        communicationMode: 1 /* GPCommunicationMode.GroupcastToDgroupId */,
                        gpdFixed: false,
                        gpdMacSeqNumCapabilities: false,
                        securityLevel: 0 /* ZigbeeNWKGPSecurityLevel.No */,
                        securityKeyType: 0 /* ZigbeeNWKGPSecurityKeyType.NoKey */,
                        gpdSecurityFrameCounterPresent: false,
                        gpdSecurityKeyPresent: false,
                        assignedAliasPresent: false,
                        groupcastRadiusPresent: false,
                    }, {
                        options: 0, // set from first param in `sendPairingCommand`
                        srcID: frame.payload.srcID,
                    }, frame.payload.gppNwkAddr);
                    this.emit("deviceLeave", frame.payload.srcID);
                    break;
                }
                /* v8 ignore start */
                case 0xe2: {
                    logger_1.logger.debug(`[SUCCESS] ${logStr}`, NS);
                    break;
                }
                /* v8 ignore stop */
                case 0xe3: {
                    logger_1.logger.debug(`[CHANNEL_REQUEST] ${logStr}`, NS);
                    const networkParameters = await this.adapter.getNetworkParameters();
                    // Channel notification
                    const payload = {
                        options: 0,
                        tempMaster: frame.payload.gppNwkAddr ?? /* v8 ignore next */ consts_1.COORDINATOR_ADDRESS,
                        tempMasterTx: frame.payload.commandFrame.nextChannel,
                        srcID: frame.payload.srcID,
                        gpdCmd: 0xf3,
                        gpdPayload: {
                            commandID: 0xf3,
                            operationalChannel: networkParameters.channel - 11,
                            // If EITHER the sink is a GP Basic sink OR the sink is a GP Advanced sink,
                            // but all of the candidate TempMasters are GP Basic proxies (as indicated by the BidirectionalCommunicationCapability
                            // sub-field of the Options field of the received GP Commissioning Notification set to 0b0),
                            // the sink SHALL set the Basic sub-field of the Channel field to 0b1.
                            basic: true,
                        },
                    };
                    const replyFrame = Zcl.Frame.create(Zcl.FrameType.SPECIFIC, Zcl.Direction.SERVER_TO_CLIENT, true, undefined, zclTransactionSequenceNumber_1.default.next(), "response", Zcl.Clusters.greenPower.ID, payload, {});
                    await this.adapter.sendZclFrameToAll(consts_1.GP_ENDPOINT, replyFrame, consts_1.GP_ENDPOINT, enums_1.BroadcastAddress.RX_ON_WHEN_IDLE);
                    break;
                }
                /* v8 ignore start */
                case 0xe4: {
                    logger_1.logger.debug(`[APP_DESCRIPTION] ${logStr}`, NS);
                    break;
                }
                case 0xa1: {
                    // GP Manufacturer-specific Attribute Reporting
                    break;
                }
                /* v8 ignore stop */
                default: {
                    // NOTE: this is spammy because it logs everything that is handed back to Controller without special processing here
                    logger_1.logger.debug(`[UNHANDLED_CMD/PASSTHROUGH] command=0x${frame.payload.commandID.toString(16)} ${logStr}`, NS);
                }
            }
            /* v8 ignore start */
        }
        catch (error) {
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            logger_1.logger.error(error.stack, NS);
        }
        /* v8 ignore stop */
        return frame;
    }
    static encodeCommissioningModeOptions(options) {
        return ((options.action & 0x1) |
            (((options.commissioningWindowPresent ? 1 : 0) << 1) & 0x2) |
            ((options.exitMode << 2) & 0x0c) |
            (((options.channelPresent ? 1 : 0) << 4) & 0x10) |
            (((options.unicastCommunication ? 1 : 0) << 5) & 0x20));
    }
    static decodeCommissioningModeOptions(byte) {
        return {
            action: byte & 0x1,
            commissioningWindowPresent: Boolean((byte & 0x2) >> 1),
            exitMode: (byte & 0x0c) >> 2,
            channelPresent: Boolean((byte & 0x10) >> 4),
            unicastCommunication: Boolean((byte & 0x20) >> 5),
        };
    }
    async permitJoin(time, networkAddress) {
        const payload = {
            options: GreenPower.encodeCommissioningModeOptions({
                action: time > 0 ? 1 : 0,
                commissioningWindowPresent: true,
                exitMode: 0b10,
                channelPresent: false,
                unicastCommunication: networkAddress !== undefined,
            }),
            commisioningWindow: time,
        };
        const frame = Zcl.Frame.create(Zcl.FrameType.SPECIFIC, Zcl.Direction.SERVER_TO_CLIENT, true, // avoid receiving many responses, especially from the nodes not supporting this functionality
        undefined, zclTransactionSequenceNumber_1.default.next(), "commisioningMode", Zcl.Clusters.greenPower.ID, payload, {});
        if (networkAddress === undefined) {
            await this.adapter.sendZclFrameToAll(consts_1.GP_ENDPOINT, frame, consts_1.GP_ENDPOINT, enums_1.BroadcastAddress.RX_ON_WHEN_IDLE);
        }
        else {
            const device = model_1.Device.byNetworkAddress(networkAddress);
            (0, node_assert_1.default)(device, "Failed to find device to permit GP join on");
            await this.adapter.sendZclFrameToEndpoint(device.ieeeAddr, networkAddress, consts_1.GP_ENDPOINT, frame, 10000, false, false, consts_1.GP_ENDPOINT);
        }
    }
}
exports.GreenPower = GreenPower;
exports.default = GreenPower;
//# sourceMappingURL=greenPower.js.map