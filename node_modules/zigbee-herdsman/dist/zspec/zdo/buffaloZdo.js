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
exports.BuffaloZdo = void 0;
const buffalo_1 = __importDefault(require("../../buffalo/buffalo"));
const logger_1 = require("../../utils/logger");
const consts_1 = require("../consts");
const ZSpecUtils = __importStar(require("../utils"));
const clusters_1 = require("./definition/clusters");
const consts_2 = require("./definition/consts");
const enums_1 = require("./definition/enums");
const status_1 = require("./definition/status");
const Utils = __importStar(require("./utils"));
const zdoStatusError_1 = require("./zdoStatusError");
const NS = "zh:zdo:buffalo";
const MAX_BUFFER_SIZE = 255;
class BuffaloZdo extends buffalo_1.default {
    /**
     * Set the byte at given position without affecting the internal position tracker.
     * TODO: move to base `Buffalo` class
     * @param position
     * @param value
     */
    setByte(position, value) {
        this.buffer.writeUInt8(value, position);
    }
    /**
     * Get the byte at given position without affecting the internal position tracker.
     * TODO: move to base `Buffalo` class
     * @param position
     * @returns
     */
    getByte(position) {
        return this.buffer.readUInt8(position);
    }
    /**
     * Check if internal buffer has enough bytes to satisfy: (current position + given count).
     * TODO: move to base `Buffalo` class
     * @param count
     * @returns True if has given more bytes
     */
    isMoreBy(count) {
        return this.position + count <= this.buffer.length;
    }
    //-- GLOBAL TLVS
    writeManufacturerSpecificGlobalTLV(tlv) {
        this.writeUInt16(tlv.zigbeeManufacturerId);
        this.writeBuffer(tlv.additionalData, tlv.additionalData.length);
    }
    readManufacturerSpecificGlobalTLV(length) {
        logger_1.logger.debug(`readManufacturerSpecificGlobalTLV with length=${length}`, NS);
        if (length < 2) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected at least 2.`);
        }
        const zigbeeManufacturerId = this.readUInt16();
        const additionalData = this.readBuffer(length - 2);
        return {
            zigbeeManufacturerId,
            additionalData,
        };
    }
    writeSupportedKeyNegotiationMethodsGlobalTLV(tlv) {
        this.writeUInt8(tlv.keyNegotiationProtocolsBitmask);
        this.writeUInt8(tlv.preSharedSecretsBitmask);
        if (tlv.sourceDeviceEui64) {
            this.writeIeeeAddr(tlv.sourceDeviceEui64);
        }
    }
    readSupportedKeyNegotiationMethodsGlobalTLV(length) {
        logger_1.logger.debug(`readSupportedKeyNegotiationMethodsGlobalTLV with length=${length}`, NS);
        if (length < 2) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected at least 2.`);
        }
        const keyNegotiationProtocolsBitmask = this.readUInt8();
        const preSharedSecretsBitmask = this.readUInt8();
        let sourceDeviceEui64;
        if (length >= 2 + consts_1.EUI64_SIZE) {
            sourceDeviceEui64 = this.readIeeeAddr();
        }
        return {
            keyNegotiationProtocolsBitmask,
            preSharedSecretsBitmask,
            sourceDeviceEui64,
        };
    }
    writePanIdConflictReportGlobalTLV(tlv) {
        this.writeUInt16(tlv.nwkPanIdConflictCount);
    }
    readPanIdConflictReportGlobalTLV(length) {
        logger_1.logger.debug(`readPanIdConflictReportGlobalTLV with length=${length}`, NS);
        if (length < 2) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected at least 2.`);
        }
        const nwkPanIdConflictCount = this.readUInt16();
        return {
            nwkPanIdConflictCount,
        };
    }
    writeNextPanIdChangeGlobalTLV(tlv) {
        this.writeUInt16(tlv.panId);
    }
    readNextPanIdChangeGlobalTLV(length) {
        logger_1.logger.debug(`readNextPanIdChangeGlobalTLV with length=${length}`, NS);
        if (length < consts_1.PAN_ID_SIZE) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected at least ${consts_1.PAN_ID_SIZE}.`);
        }
        const panId = this.readUInt16();
        return {
            panId,
        };
    }
    writeNextChannelChangeGlobalTLV(tlv) {
        this.writeUInt32(tlv.channel);
    }
    readNextChannelChangeGlobalTLV(length) {
        logger_1.logger.debug(`readNextChannelChangeGlobalTLV with length=${length}`, NS);
        if (length < 4) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected at least 4.`);
        }
        const channel = this.readUInt32();
        return {
            channel,
        };
    }
    writeSymmetricPassphraseGlobalTLV(tlv) {
        this.writeBuffer(tlv.passphrase, consts_1.DEFAULT_ENCRYPTION_KEY_SIZE);
    }
    readSymmetricPassphraseGlobalTLV(length) {
        logger_1.logger.debug(`readSymmetricPassphraseGlobalTLV with length=${length}`, NS);
        if (length < consts_1.DEFAULT_ENCRYPTION_KEY_SIZE) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected at least ${consts_1.DEFAULT_ENCRYPTION_KEY_SIZE}.`);
        }
        const passphrase = this.readBuffer(consts_1.DEFAULT_ENCRYPTION_KEY_SIZE);
        return {
            passphrase,
        };
    }
    writeRouterInformationGlobalTLV(tlv) {
        this.writeUInt16(tlv.bitmask);
    }
    readRouterInformationGlobalTLV(length) {
        logger_1.logger.debug(`readRouterInformationGlobalTLV with length=${length}`, NS);
        if (length < 2) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected at least 2.`);
        }
        const bitmask = this.readUInt16();
        return {
            bitmask,
        };
    }
    writeFragmentationParametersGlobalTLV(tlv) {
        this.writeUInt16(tlv.nwkAddress);
        if (tlv.fragmentationOptions !== undefined) {
            this.writeUInt8(tlv.fragmentationOptions);
        }
        if (tlv.maxIncomingTransferUnit !== undefined) {
            this.writeUInt16(tlv.maxIncomingTransferUnit);
        }
    }
    readFragmentationParametersGlobalTLV(length) {
        logger_1.logger.debug(`readFragmentationParametersGlobalTLV with length=${length}`, NS);
        if (length < 2) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected at least 2.`);
        }
        const nwkAddress = this.readUInt16();
        let fragmentationOptions;
        let maxIncomingTransferUnit;
        if (length >= 3) {
            fragmentationOptions = this.readUInt8();
        }
        if (length >= 5) {
            maxIncomingTransferUnit = this.readUInt16();
        }
        return {
            nwkAddress,
            fragmentationOptions,
            maxIncomingTransferUnit,
        };
    }
    writeJoinerEncapsulationGlobalTLV(encapsulationTLV) {
        this.writeGlobalTLVs(encapsulationTLV.additionalTLVs);
    }
    readJoinerEncapsulationGlobalTLV(length) {
        logger_1.logger.debug(`readJoinerEncapsulationGlobalTLV with length=${length}`, NS);
        // at least the length of tagId+length for first encapsulated tlv, doesn't make sense otherwise
        if (length < 2) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected at least 2.`);
        }
        const encapsulationBuffalo = new BuffaloZdo(this.readBuffer(length));
        const additionalTLVs = encapsulationBuffalo.readTLVs(undefined, true);
        return {
            additionalTLVs,
        };
    }
    writeBeaconAppendixEncapsulationGlobalTLV(encapsulationTLV) {
        this.writeGlobalTLVs(encapsulationTLV.additionalTLVs);
    }
    readBeaconAppendixEncapsulationGlobalTLV(length) {
        logger_1.logger.debug(`readBeaconAppendixEncapsulationGlobalTLV with length=${length}`, NS);
        // at least the length of tagId+length for first encapsulated tlv, doesn't make sense otherwise
        if (length < 2) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected at least 2.`);
        }
        const encapsulationBuffalo = new BuffaloZdo(this.readBuffer(length));
        // Global: SupportedKeyNegotiationMethodsGlobalTLV
        // Global: FragmentationParametersGlobalTLV
        const additionalTLVs = encapsulationBuffalo.readTLVs(undefined, true);
        return {
            additionalTLVs,
        };
    }
    writeConfigurationParametersGlobalTLV(configurationParameters) {
        this.writeUInt16(configurationParameters.configurationParameters);
    }
    readConfigurationParametersGlobalTLV(length) {
        logger_1.logger.debug(`readConfigurationParametersGlobalTLV with length=${length}`, NS);
        if (length < 2) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected at least 2.`);
        }
        const configurationParameters = this.readUInt16();
        return {
            configurationParameters,
        };
    }
    writeDeviceCapabilityExtensionGlobalTLV(tlv) {
        this.writeBuffer(tlv.data, tlv.data.length);
    }
    readDeviceCapabilityExtensionGlobalTLV(length) {
        logger_1.logger.debug(`readDeviceCapabilityExtensionGlobalTLV with length=${length}`, NS);
        const data = this.readBuffer(length);
        return {
            data,
        };
    }
    writeGlobalTLV(tlv) {
        this.writeUInt8(tlv.tagId);
        this.writeUInt8(tlv.length - 1); // remove offset (spec quirk...)
        switch (tlv.tagId) {
            case enums_1.GlobalTLV.MANUFACTURER_SPECIFIC: {
                this.writeManufacturerSpecificGlobalTLV(tlv.tlv);
                break;
            }
            case enums_1.GlobalTLV.SUPPORTED_KEY_NEGOTIATION_METHODS: {
                this.writeSupportedKeyNegotiationMethodsGlobalTLV(tlv.tlv);
                break;
            }
            case enums_1.GlobalTLV.PAN_ID_CONFLICT_REPORT: {
                this.writePanIdConflictReportGlobalTLV(tlv.tlv);
                break;
            }
            case enums_1.GlobalTLV.NEXT_PAN_ID_CHANGE: {
                this.writeNextPanIdChangeGlobalTLV(tlv.tlv);
                break;
            }
            case enums_1.GlobalTLV.NEXT_CHANNEL_CHANGE: {
                this.writeNextChannelChangeGlobalTLV(tlv.tlv);
                break;
            }
            case enums_1.GlobalTLV.SYMMETRIC_PASSPHRASE: {
                this.writeSymmetricPassphraseGlobalTLV(tlv.tlv);
                break;
            }
            case enums_1.GlobalTLV.ROUTER_INFORMATION: {
                this.writeRouterInformationGlobalTLV(tlv.tlv);
                break;
            }
            case enums_1.GlobalTLV.FRAGMENTATION_PARAMETERS: {
                this.writeFragmentationParametersGlobalTLV(tlv.tlv);
                break;
            }
            case enums_1.GlobalTLV.JOINER_ENCAPSULATION: {
                this.writeJoinerEncapsulationGlobalTLV(tlv.tlv);
                break;
            }
            case enums_1.GlobalTLV.BEACON_APPENDIX_ENCAPSULATION: {
                this.writeBeaconAppendixEncapsulationGlobalTLV(tlv.tlv);
                break;
            }
            case enums_1.GlobalTLV.CONFIGURATION_PARAMETERS: {
                this.writeConfigurationParametersGlobalTLV(tlv.tlv);
                break;
            }
            case enums_1.GlobalTLV.DEVICE_CAPABILITY_EXTENSION: {
                this.writeDeviceCapabilityExtensionGlobalTLV(tlv.tlv);
                break;
            }
            default: {
                throw new zdoStatusError_1.ZdoStatusError(status_1.Status.NOT_SUPPORTED);
            }
        }
    }
    readGlobalTLV(tagId, length) {
        switch (tagId) {
            case enums_1.GlobalTLV.MANUFACTURER_SPECIFIC: {
                return this.readManufacturerSpecificGlobalTLV(length);
            }
            case enums_1.GlobalTLV.SUPPORTED_KEY_NEGOTIATION_METHODS: {
                return this.readSupportedKeyNegotiationMethodsGlobalTLV(length);
            }
            case enums_1.GlobalTLV.PAN_ID_CONFLICT_REPORT: {
                return this.readPanIdConflictReportGlobalTLV(length);
            }
            case enums_1.GlobalTLV.NEXT_PAN_ID_CHANGE: {
                return this.readNextPanIdChangeGlobalTLV(length);
            }
            case enums_1.GlobalTLV.NEXT_CHANNEL_CHANGE: {
                return this.readNextChannelChangeGlobalTLV(length);
            }
            case enums_1.GlobalTLV.SYMMETRIC_PASSPHRASE: {
                return this.readSymmetricPassphraseGlobalTLV(length);
            }
            case enums_1.GlobalTLV.ROUTER_INFORMATION: {
                return this.readRouterInformationGlobalTLV(length);
            }
            case enums_1.GlobalTLV.FRAGMENTATION_PARAMETERS: {
                return this.readFragmentationParametersGlobalTLV(length);
            }
            case enums_1.GlobalTLV.JOINER_ENCAPSULATION: {
                return this.readJoinerEncapsulationGlobalTLV(length);
            }
            case enums_1.GlobalTLV.BEACON_APPENDIX_ENCAPSULATION: {
                return this.readBeaconAppendixEncapsulationGlobalTLV(length);
            }
            case enums_1.GlobalTLV.CONFIGURATION_PARAMETERS: {
                return this.readConfigurationParametersGlobalTLV(length);
            }
            case enums_1.GlobalTLV.DEVICE_CAPABILITY_EXTENSION: {
                return this.readDeviceCapabilityExtensionGlobalTLV(length);
            }
            default: {
                // validation: unknown tag shall be ignored
                return undefined;
            }
        }
    }
    writeGlobalTLVs(tlvs) {
        for (const tlv of tlvs) {
            this.writeGlobalTLV(tlv);
        }
    }
    //-- LOCAL TLVS
    // write only
    // private readBeaconSurveyConfigurationTLV(length: number): BeaconSurveyConfigurationTLV {
    //     logger.debug(`readBeaconSurveyConfigurationTLV with length=${length}`, NS);
    //     const count = this.readUInt8();
    //     if (length !== (1 + (count * 4) + 1)) {
    //         throw new Error(`Malformed TLV. Invalid length '${length}', expected ${(1 + (count * 4) + 1)}.`);
    //     }
    //     const scanChannelList = this.readListUInt32(count);
    //     const configurationBitmask = this.readUInt8();
    //     return {
    //         scanChannelList,
    //         configurationBitmask,
    //     };
    // }
    readCurve25519PublicPointTLV(length) {
        logger_1.logger.debug(`readCurve25519PublicPointTLV with length=${length}`, NS);
        if (length !== consts_1.EUI64_SIZE + consts_2.CURVE_PUBLIC_POINT_SIZE) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected ${consts_1.EUI64_SIZE + consts_2.CURVE_PUBLIC_POINT_SIZE}.`);
        }
        const eui64 = this.readIeeeAddr();
        const publicPoint = this.readBuffer(consts_2.CURVE_PUBLIC_POINT_SIZE);
        return {
            eui64,
            publicPoint,
        };
    }
    // write only
    // private readTargetIEEEAddressTLV(length: number): TargetIEEEAddressTLV {
    //     logger.debug(`readTargetIEEEAddressTLV with length=${length}`, NS);
    //     if (length !== EUI64_SIZE) {
    //         throw new Error(`Malformed TLV. Invalid length '${length}', expected ${EUI64_SIZE}.`);
    //     }
    //     const ieee = this.readIeeeAddr();
    //     return {
    //         ieee,
    //     };
    // }
    // write only
    // private readSelectedKeyNegotiationMethodTLV(length: number): SelectedKeyNegotiationMethodTLV {
    //     logger.debug(`readSelectedKeyNegotiationMethodTLV with length=${length}`, NS);
    //     if (length !== 10) {
    //         throw new Error(`Malformed TLV. Invalid length '${length}', expected 10.`);
    //     }
    //     const protocol = this.readUInt8();
    //     const presharedSecret = this.readUInt8();
    //     const sendingDeviceEui64 = this.readIeeeAddr();
    //     return {
    //         protocol,
    //         presharedSecret,
    //         sendingDeviceEui64,
    //     };
    // }
    // write only
    // private readDeviceEUI64ListTLV(length: number): DeviceEUI64ListTLV {
    //     logger.debug(`readDeviceEUI64ListTLV with length=${length}`, NS);
    //     const count = this.readUInt8();
    //     if (length !== (1 + (count * EUI64_SIZE))) {
    //         throw new Error(`Malformed TLV. Invalid length '${length}', expected ${(1 + (count * EUI64_SIZE))}.`);
    //     }
    //     const eui64List: DeviceEUI64ListTLV['eui64List'] = [];
    //     for (let i = 0; i < count; i++) {
    //         const eui64 = this.readIeeeAddr();
    //         eui64List.push(eui64);
    //     }
    //     return {
    //         eui64List,
    //     };
    // }
    readAPSFrameCounterResponseTLV(length) {
        logger_1.logger.debug(`readAPSFrameCounterResponseTLV with length=${length}`, NS);
        if (length !== 32) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected 32.`);
        }
        const responderEui64 = this.readIeeeAddr();
        const receivedChallengeValue = this.readBuffer(consts_2.CHALLENGE_VALUE_SIZE);
        const apsFrameCounter = this.readUInt32();
        const challengeSecurityFrameCounter = this.readUInt32();
        const mic = this.readBuffer(8);
        return {
            responderEui64,
            receivedChallengeValue,
            apsFrameCounter,
            challengeSecurityFrameCounter,
            mic,
        };
    }
    readBeaconSurveyResultsTLV(length) {
        logger_1.logger.debug(`readBeaconSurveyResultsTLV with length=${length}`, NS);
        if (length !== 4) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected 4.`);
        }
        const totalBeaconsReceived = this.readUInt8();
        const onNetworkBeacons = this.readUInt8();
        const potentialParentBeacons = this.readUInt8();
        const otherNetworkBeacons = this.readUInt8();
        return {
            totalBeaconsReceived,
            onNetworkBeacons,
            potentialParentBeacons,
            otherNetworkBeacons,
        };
    }
    readPotentialParentsTLV(length) {
        logger_1.logger.debug(`readPotentialParentsTLV with length=${length}`, NS);
        if (length < 4) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected at least 4.`);
        }
        const currentParentNwkAddress = this.readUInt16();
        const currentParentLQA = this.readUInt8();
        // [0x00 - 0x05]
        const entryCount = this.readUInt8();
        if (length !== 4 + entryCount * 3) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected ${4 + entryCount * 3}.`);
        }
        const potentialParents = [];
        for (let i = 0; i < entryCount; i++) {
            const nwkAddress = this.readUInt16();
            const lqa = this.readUInt8();
            potentialParents.push({
                nwkAddress,
                lqa,
            });
        }
        return {
            currentParentNwkAddress,
            currentParentLQA,
            entryCount,
            potentialParents,
        };
    }
    readDeviceAuthenticationLevelTLV(length) {
        logger_1.logger.debug(`readDeviceAuthenticationLevelTLV with length=${length}`, NS);
        if (length !== 10) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected 10.`);
        }
        const remoteNodeIeee = this.readIeeeAddr();
        const initialJoinMethod = this.readUInt8();
        const activeLinkKeyType = this.readUInt8();
        return {
            remoteNodeIeee,
            initialJoinMethod,
            activeLinkKeyType,
        };
    }
    readProcessingStatusTLV(length) {
        logger_1.logger.debug(`readProcessingStatusTLV with length=${length}`, NS);
        const count = this.readUInt8();
        if (length !== 1 + count * 2) {
            throw new Error(`Malformed TLV. Invalid length '${length}', expected ${1 + count * 2}.`);
        }
        const tlvs = [];
        for (let i = 0; i < count; i++) {
            const tagId = this.readUInt8();
            const processingStatus = this.readUInt8();
            tlvs.push({
                tagId,
                processingStatus,
            });
        }
        return {
            count,
            tlvs,
        };
    }
    /**
     * ANNEX I ZIGBEE TLV DEFINITIONS AND FORMAT
     *
     * Unknown tags => TLV ignored
     * Duplicate tags => reject message except for MANUFACTURER_SPECIFIC_GLOBAL_TLV
     * Malformed TLVs => reject message
     *
     * @param localTLVReaders Mapping of tagID to local TLV reader function
     * @param encapsulated Default false. If true, this is reading inside an encapsuled TLV (excludes further encapsulation)
     * @returns
     */
    readTLVs(localTLVReaders, encapsulated = false) {
        const tlvs = [];
        while (this.isMore()) {
            const tagId = this.readUInt8();
            // validation: cannot have duplicate tagId, except MANUFACTURER_SPECIFIC_GLOBAL_TLV
            if (tagId !== enums_1.GlobalTLV.MANUFACTURER_SPECIFIC && tlvs.findIndex((tlv) => tlv.tagId === tagId) !== -1) {
                throw new Error(`Duplicate tag. Cannot have more than one of tagId=${tagId}.`);
            }
            // validation: encapsulation TLV cannot contain another encapsulation TLV, outer considered malformed, reject message
            if (encapsulated && (tagId === enums_1.GlobalTLV.BEACON_APPENDIX_ENCAPSULATION || tagId === enums_1.GlobalTLV.JOINER_ENCAPSULATION)) {
                throw new Error(`Invalid nested encapsulation for tagId=${tagId}.`);
            }
            const length = this.readUInt8() + 1; // add offset (spec quirk...)
            // validation: invalid if not at least ${length} bytes to read
            if (!this.isMoreBy(length)) {
                throw new Error(`Malformed TLV. Invalid data length for tagId=${tagId}, expected ${length}.`);
            }
            const nextTLVStart = this.getPosition() + length;
            // undefined == unknown tag
            let tlv;
            if (tagId < enums_1.GlobalTLV.MANUFACTURER_SPECIFIC) {
                if (localTLVReaders) {
                    const localTLVReader = localTLVReaders.get(tagId);
                    if (localTLVReader) {
                        tlv = localTLVReader.call(this, length);
                        /* v8 ignore start */
                    }
                    else {
                        logger_1.logger.debug(`Local TLV found tagId=${tagId} but no reader given for it. Ignoring it.`, NS);
                    }
                    /* v8 ignore stop */
                    /* v8 ignore start */
                }
                else {
                    logger_1.logger.debug(`Local TLV found tagId=${tagId} but no reader available. Ignoring it.`, NS);
                }
                /* v8 ignore stop */
            }
            else {
                tlv = this.readGlobalTLV(tagId, length);
            }
            // validation: unknown tag shall be ignored
            if (tlv) {
                tlvs.push({
                    tagId,
                    length,
                    tlv,
                });
            }
            else {
                logger_1.logger.debug(`Unknown TLV tagId=${tagId}. Ignoring it.`, NS);
            }
            // ensure we're at the right position as dictated by the tlv length field, and not the tlv reader (should be the same if proper)
            this.setPosition(nextTLVStart);
        }
        return tlvs;
    }
    //-- REQUESTS
    static buildRequest(hasZdoMessageOverhead, clusterId, ...args) {
        const buffalo = new BuffaloZdo(Buffer.alloc(MAX_BUFFER_SIZE), hasZdoMessageOverhead ? consts_2.ZDO_MESSAGE_OVERHEAD : 0);
        switch (clusterId) {
            case clusters_1.ClusterId.NETWORK_ADDRESS_REQUEST: {
                return buffalo.buildNetworkAddressRequest(...args);
            }
            case clusters_1.ClusterId.IEEE_ADDRESS_REQUEST: {
                return buffalo.buildIeeeAddressRequest(...args);
            }
            case clusters_1.ClusterId.NODE_DESCRIPTOR_REQUEST: {
                return buffalo.buildNodeDescriptorRequest(...args);
            }
            case clusters_1.ClusterId.POWER_DESCRIPTOR_REQUEST: {
                return buffalo.buildPowerDescriptorRequest(...args);
            }
            case clusters_1.ClusterId.SIMPLE_DESCRIPTOR_REQUEST: {
                return buffalo.buildSimpleDescriptorRequest(...args);
            }
            case clusters_1.ClusterId.ACTIVE_ENDPOINTS_REQUEST: {
                return buffalo.buildActiveEndpointsRequest(...args);
            }
            case clusters_1.ClusterId.MATCH_DESCRIPTORS_REQUEST: {
                return buffalo.buildMatchDescriptorRequest(...args);
            }
            case clusters_1.ClusterId.SYSTEM_SERVER_DISCOVERY_REQUEST: {
                return buffalo.buildSystemServiceDiscoveryRequest(...args);
            }
            case clusters_1.ClusterId.PARENT_ANNOUNCE: {
                return buffalo.buildParentAnnounce(...args);
            }
            case clusters_1.ClusterId.BIND_REQUEST: {
                return buffalo.buildBindRequest(...args);
            }
            case clusters_1.ClusterId.UNBIND_REQUEST: {
                return buffalo.buildUnbindRequest(...args);
            }
            case clusters_1.ClusterId.CLEAR_ALL_BINDINGS_REQUEST: {
                return buffalo.buildClearAllBindingsRequest(...args);
            }
            case clusters_1.ClusterId.LQI_TABLE_REQUEST: {
                return buffalo.buildLqiTableRequest(...args);
            }
            case clusters_1.ClusterId.ROUTING_TABLE_REQUEST: {
                return buffalo.buildRoutingTableRequest(...args);
            }
            case clusters_1.ClusterId.BINDING_TABLE_REQUEST: {
                return buffalo.buildBindingTableRequest(...args);
            }
            case clusters_1.ClusterId.LEAVE_REQUEST: {
                return buffalo.buildLeaveRequest(...args);
            }
            case clusters_1.ClusterId.PERMIT_JOINING_REQUEST: {
                return buffalo.buildPermitJoining(...args);
            }
            case clusters_1.ClusterId.NWK_UPDATE_REQUEST: {
                return buffalo.buildNwkUpdateRequest(...args);
            }
            case clusters_1.ClusterId.NWK_ENHANCED_UPDATE_REQUEST: {
                return buffalo.buildNwkEnhancedUpdateRequest(...args);
            }
            case clusters_1.ClusterId.NWK_IEEE_JOINING_LIST_REQUEST: {
                return buffalo.buildNwkIEEEJoiningListRequest(...args);
            }
            case clusters_1.ClusterId.NWK_BEACON_SURVEY_REQUEST: {
                return buffalo.buildNwkBeaconSurveyRequest(...args);
            }
            case clusters_1.ClusterId.START_KEY_NEGOTIATION_REQUEST: {
                return buffalo.buildStartKeyNegotiationRequest(...args);
            }
            case clusters_1.ClusterId.RETRIEVE_AUTHENTICATION_TOKEN_REQUEST: {
                return buffalo.buildRetrieveAuthenticationTokenRequest(...args);
            }
            case clusters_1.ClusterId.GET_AUTHENTICATION_LEVEL_REQUEST: {
                return buffalo.buildGetAuthenticationLevelRequest(...args);
            }
            case clusters_1.ClusterId.SET_CONFIGURATION_REQUEST: {
                return buffalo.buildSetConfigurationRequest(...args);
            }
            case clusters_1.ClusterId.GET_CONFIGURATION_REQUEST: {
                return buffalo.buildGetConfigurationRequest(...args);
            }
            case clusters_1.ClusterId.START_KEY_UPDATE_REQUEST: {
                return buffalo.buildStartKeyUpdateRequest(...args);
            }
            case clusters_1.ClusterId.DECOMMISSION_REQUEST: {
                return buffalo.buildDecommissionRequest(...args);
            }
            case clusters_1.ClusterId.CHALLENGE_REQUEST: {
                return buffalo.buildChallengeRequest(...args);
            }
            default: {
                throw new Error(`Unsupported request building for cluster ID '${clusterId}'.`);
            }
        }
    }
    /**
     * @see ClusterId.NETWORK_ADDRESS_REQUEST
     * @param target IEEE address for the request
     * @param reportKids True to request that the target list their children in the response. [request type = 0x01]
     * @param childStartIndex The index of the first child to list in the response. Ignored if reportKids is false.
     */
    buildNetworkAddressRequest(target, reportKids, childStartIndex) {
        this.writeIeeeAddr(target);
        this.writeUInt8(reportKids ? 1 : 0);
        this.writeUInt8(childStartIndex);
        return this.getWritten();
    }
    /**
     * @see ClusterId.IEEE_ADDRESS_REQUEST
     * Can be sent to target, or to another node that will send to target.
     * @param target NWK address for the request
     * @param reportKids True to request that the target list their children in the response. [request type = 0x01]
     * @param childStartIndex The index of the first child to list in the response. Ignored if reportKids is false.
     */
    buildIeeeAddressRequest(target, reportKids, childStartIndex) {
        this.writeUInt16(target);
        this.writeUInt8(reportKids ? 1 : 0);
        this.writeUInt8(childStartIndex);
        return this.getWritten();
    }
    /**
     * @see ClusterId.NODE_DESCRIPTOR_REQUEST
     * @param target NWK address for the request
     */
    buildNodeDescriptorRequest(target, fragmentationParameters) {
        this.writeUInt16(target);
        if (fragmentationParameters) {
            let length = 2;
            if (fragmentationParameters.fragmentationOptions) {
                length += 1;
            }
            if (fragmentationParameters.maxIncomingTransferUnit) {
                length += 2;
            }
            this.writeGlobalTLV({ tagId: enums_1.GlobalTLV.FRAGMENTATION_PARAMETERS, length, tlv: fragmentationParameters });
        }
        return this.getWritten();
    }
    /**
     * @see ClusterId.POWER_DESCRIPTOR_REQUEST
     * @param target NWK address for the request
     */
    buildPowerDescriptorRequest(target) {
        this.writeUInt16(target);
        return this.getWritten();
    }
    /**
     * @see ClusterId.SIMPLE_DESCRIPTOR_REQUEST
     * @param target NWK address for the request
     * @param targetEndpoint The endpoint on the destination
     */
    buildSimpleDescriptorRequest(target, targetEndpoint) {
        this.writeUInt16(target);
        this.writeUInt8(targetEndpoint);
        return this.getWritten();
    }
    /**
     * @see ClusterId.ACTIVE_ENDPOINTS_REQUEST
     * @param target NWK address for the request
     */
    buildActiveEndpointsRequest(target) {
        this.writeUInt16(target);
        return this.getWritten();
    }
    /**
     * @see ClusterId.MATCH_DESCRIPTORS_REQUEST
     * @param target NWK address for the request
     * @param profileId Profile ID to be matched at the destination
     * @param inClusterList List of Input ClusterIDs to be used for matching
     * @param outClusterList List of Output ClusterIDs to be used for matching
     */
    buildMatchDescriptorRequest(target, profileId, inClusterList, outClusterList) {
        this.writeUInt16(target);
        this.writeUInt16(profileId);
        this.writeUInt8(inClusterList.length);
        this.writeListUInt16(inClusterList);
        this.writeUInt8(outClusterList.length);
        this.writeListUInt16(outClusterList);
        return this.getWritten();
    }
    /**
     * @see ClusterId.SYSTEM_SERVER_DISCOVERY_REQUEST
     * @param serverMask See Table 2-34 for bit assignments.
     */
    buildSystemServiceDiscoveryRequest(serverMask) {
        this.writeUInt16(Utils.createServerMask(serverMask));
        return this.getWritten();
    }
    /**
     * @see ClusterId.PARENT_ANNOUNCE
     * @param children The IEEE addresses of the children bound to the parent.
     */
    buildParentAnnounce(children) {
        this.writeUInt8(children.length);
        for (const child of children) {
            this.writeIeeeAddr(child);
        }
        return this.getWritten();
    }
    /**
     * @see ClusterId.BIND_REQUEST
     *
     * @param source The IEEE address for the source.
     * @param sourceEndpoint The source endpoint for the binding entry.
     * @param clusterId The identifier of the cluster on the source device that is bound to the destination.
     * @param type The addressing mode for the destination address used in this command, either ::UNICAST_BINDING, ::MULTICAST_BINDING.
     * @param destination The destination address for the binding entry. IEEE for ::UNICAST_BINDING.
     * @param groupAddress The destination address for the binding entry. Group ID for ::MULTICAST_BINDING.
     * @param destinationEndpoint The destination endpoint for the binding entry. Only if ::UNICAST_BINDING.
     */
    buildBindRequest(source, sourceEndpoint, clusterId, type, destination, groupAddress, destinationEndpoint) {
        this.writeIeeeAddr(source);
        this.writeUInt8(sourceEndpoint);
        this.writeUInt16(clusterId);
        this.writeUInt8(type);
        switch (type) {
            case consts_2.UNICAST_BINDING: {
                this.writeIeeeAddr(destination);
                this.writeUInt8(destinationEndpoint);
                break;
            }
            case consts_2.MULTICAST_BINDING: {
                this.writeUInt16(groupAddress);
                break;
            }
            default:
                throw new zdoStatusError_1.ZdoStatusError(status_1.Status.NOT_SUPPORTED);
        }
        return this.getWritten();
    }
    /**
     * @see ClusterId.UNBIND_REQUEST
     *
     * @param source The IEEE address for the source.
     * @param sourceEndpoint The source endpoint for the binding entry.
     * @param clusterId The identifier of the cluster on the source device that is bound to the destination.
     * @param type The addressing mode for the destination address used in this command, either ::UNICAST_BINDING, ::MULTICAST_BINDING.
     * @param destination The destination address for the binding entry. IEEE for ::UNICAST_BINDING.
     * @param groupAddress The destination address for the binding entry. Group ID for ::MULTICAST_BINDING.
     * @param destinationEndpoint The destination endpoint for the binding entry. Only if ::UNICAST_BINDING.
     */
    buildUnbindRequest(source, sourceEndpoint, clusterId, type, destination, groupAddress, destinationEndpoint) {
        this.writeIeeeAddr(source);
        this.writeUInt8(sourceEndpoint);
        this.writeUInt16(clusterId);
        this.writeUInt8(type);
        switch (type) {
            case consts_2.UNICAST_BINDING: {
                this.writeIeeeAddr(destination);
                this.writeUInt8(destinationEndpoint);
                break;
            }
            case consts_2.MULTICAST_BINDING: {
                this.writeUInt16(groupAddress);
                break;
            }
            default:
                throw new zdoStatusError_1.ZdoStatusError(status_1.Status.NOT_SUPPORTED);
        }
        return this.getWritten();
    }
    /**
     * @see ClusterId.CLEAR_ALL_BINDINGS_REQUEST
     */
    buildClearAllBindingsRequest(tlv) {
        // ClearAllBindingsReqEUI64TLV: Local: ID: 0x00
        this.writeUInt8(0x00);
        this.writeUInt8(tlv.eui64List.length * consts_1.EUI64_SIZE + 1 - 1);
        this.writeUInt8(tlv.eui64List.length);
        for (const entry of tlv.eui64List) {
            this.writeIeeeAddr(entry);
        }
        return this.getWritten();
    }
    /**
     * @see ClusterId.LQI_TABLE_REQUEST
     * @param startIndex Starting Index for the requested elements of the Neighbor Table.
     */
    buildLqiTableRequest(startIndex) {
        this.writeUInt8(startIndex);
        return this.getWritten();
    }
    /**
     * @see ClusterId.ROUTING_TABLE_REQUEST
     * @param startIndex Starting Index for the requested elements of the Neighbor Table.
     */
    buildRoutingTableRequest(startIndex) {
        this.writeUInt8(startIndex);
        return this.getWritten();
    }
    /**
     * @see ClusterId.BINDING_TABLE_REQUEST
     * @param startIndex Starting Index for the requested elements of the Neighbor Table.
     */
    buildBindingTableRequest(startIndex) {
        this.writeUInt8(startIndex);
        return this.getWritten();
    }
    /**
     * @see ClusterId.LEAVE_REQUEST
     * @param deviceAddress All zeros if the target is to remove itself from the network or
     *   the EUI64 of a child of the target device to remove that child.
     * @param leaveRequestFlags A bitmask of leave options. Include ::AND_REJOIN if the target is to rejoin the network immediately after leaving.
     */
    buildLeaveRequest(deviceAddress, leaveRequestFlags) {
        this.writeIeeeAddr(deviceAddress);
        this.writeUInt8(leaveRequestFlags);
        return this.getWritten();
    }
    /**
     * @see ClusterId.PERMIT_JOINING_REQUEST
     * @param duration A value of 0x00 disables joining. A value of 0xFF enables joining. Any other value enables joining for that number of seconds.
     * @param authentication Controls Trust Center authentication behavior.
     *   This field SHALL always have a value of 1, indicating a request to change the Trust Center policy.
     *   If a frame is received with a value of 0, it shall be treated as having a value of 1.
     */
    buildPermitJoining(duration, authentication, tlvs) {
        this.writeUInt8(duration);
        this.writeUInt8(authentication);
        // BeaconAppendixEncapsulationGlobalTLV
        //   - SupportedKeyNegotiationMethodsGlobalTLV
        //   - FragmentationParametersGlobalTLV
        this.writeGlobalTLVs(tlvs);
        return this.getWritten();
    }
    /**
     * @see ClusterId.NWK_UPDATE_REQUEST
     * @param channels See Table 3-7 for details on the 32-bit field structure..
     * @param duration A value used to calculate the length of time to spend scanning each channel.
     *   The time spent scanning each channel is (aBaseSuperframeDuration * (2n + 1)) symbols, where n is the value of the duration parameter.
     *   If has a value of 0xfe this is a request for channel change.
     *   If has a value of 0xff this is a request to change the apsChannelMaskList and nwkManagerAddr attributes.
     * @param count This field represents the number of energy scans to be conducted and reported.
     *   This field SHALL be present only if the duration is within the range of 0x00 to 0x05.
     * @param nwkUpdateId The value of the nwkUpdateId contained in this request.
     *   This value is set by the Network Channel Manager prior to sending the message.
     *   This field SHALL only be present if the duration is 0xfe or 0xff.
     *   If the ScanDuration is 0xff, then the value in the nwkUpdateID SHALL be ignored.
     * @param nwkManagerAddr This field SHALL be present only if the duration is set to 0xff, and, where present,
     *   indicates the NWK address for the device with the Network Manager bit set in its Node Descriptor.
     */
    buildNwkUpdateRequest(channels, duration, count, nwkUpdateId, nwkManagerAddr) {
        this.writeUInt32(ZSpecUtils.channelsToUInt32Mask(channels));
        this.writeUInt8(duration);
        if (count !== undefined && duration >= 0x00 && duration <= 0x05) {
            this.writeUInt8(count);
        }
        // TODO: What does "This value is set by the Network Channel Manager prior to sending the message." mean exactly??
        //       (isn't used/mentioned in EmberZNet, confirmed working if not set at all for channel change)
        // for now, allow to bypass with undefined, otherwise should throw if undefined and duration passes below conditions (see NwkEnhancedUpdateRequest)
        if (nwkUpdateId !== undefined && (duration === 0xfe || duration === 0xff)) {
            this.writeUInt8(nwkUpdateId);
        }
        if (nwkManagerAddr !== undefined && duration === 0xff) {
            this.writeUInt16(nwkManagerAddr);
        }
        return this.getWritten();
    }
    // /**
    //  * Shortcut for @see BuffaloZdo.buildNwkUpdateRequest
    //  */
    // private buildScanChannelsRequest(scanChannels: number[], duration: number, count: number): Buffer {
    //     return this.buildNwkUpdateRequest(scanChannels, duration, count, undefined, undefined);
    // }
    // /**
    //  * Shortcut for @see BuffaloZdo.buildNwkUpdateRequest
    //  */
    // private buildChannelChangeRequest(channel: number, nwkUpdateId: number | undefined): Buffer {
    //     return this.buildNwkUpdateRequest([channel], 0xfe, undefined, nwkUpdateId, undefined);
    // }
    // /**
    //  * Shortcut for @see BuffaloZdo.buildNwkUpdateRequest
    //  */
    // private buildSetActiveChannelsAndNwkManagerIdRequest(channels: number[], nwkUpdateId: number | undefined, nwkManagerAddr: NodeId): Buffer {
    //     return this.buildNwkUpdateRequest(channels, 0xff, undefined, nwkUpdateId, nwkManagerAddr);
    // }
    /**
     * @see ClusterId.NWK_ENHANCED_UPDATE_REQUEST
     * @param channelPages The set of channels (32-bit bitmap) for each channel page.
     *   The five most significant bits (b27,..., b31) represent the binary encoded Channel Page.
     *   The 27 least significant bits (b0, b1,... b26) indicate which channels are to be scanned
     *   (1 = scan, 0 = do not scan) for each of the 27 valid channels
     *   If duration is in the range 0x00 to 0x05, SHALL be restricted to a single page.
     * @param duration A value used to calculate the length of time to spend scanning each channel.
     *   The time spent scanning each channel is (aBaseSuperframeDuration * (2n + 1)) symbols, where n is the value of the duration parameter.
     *   If has a value of 0xfe this is a request for channel change.
     *   If has a value of 0xff this is a request to change the apsChannelMaskList and nwkManagerAddr attributes.
     * @param count This field represents the number of energy scans to be conducted and reported.
     *   This field SHALL be present only if the duration is within the range of 0x00 to 0x05.
     * @param nwkUpdateId The value of the nwkUpdateId contained in this request.
     *   This value is set by the Network Channel Manager prior to sending the message.
     *   This field SHALL only be present if the duration is 0xfe or 0xff.
     *   If the ScanDuration is 0xff, then the value in the nwkUpdateID SHALL be ignored.
     * @param nwkManagerAddr This field SHALL be present only if the duration is set to 0xff, and, where present,
     *   indicates the NWK address for the device with the Network Manager bit set in its Node Descriptor.
     * @param configurationBitmask Defined in defined in section 2.4.3.3.12.
     *   The configurationBitmask must be added to the end of the list of parameters.
     *   This octet may or may not be present.
     *   If not present then assumption should be that it is enhanced active scan.
     *   Bit 0: This bit determines whether to do an Active Scan or Enhanced Active Scan.
     *          When the bit is set to 1 it indicates an Enhanced Active Scan.
     *          And in case of Enhanced Active scan EBR shall be sent with EPID filter instead of PJOIN filter.
     *   Bit 1-7: Reserved
     */
    buildNwkEnhancedUpdateRequest(channelPages, duration, count, nwkUpdateId, nwkManagerAddr, configurationBitmask) {
        this.writeUInt8(channelPages.length);
        for (const channelPage of channelPages) {
            this.writeUInt32(channelPage);
        }
        this.writeUInt8(duration);
        if (count !== undefined && duration >= 0x00 && duration <= 0x05) {
            this.writeUInt8(count);
        }
        if (nwkUpdateId !== undefined && (duration === 0xfe || duration === 0xff)) {
            this.writeUInt8(nwkUpdateId);
        }
        if (nwkManagerAddr !== undefined && duration === 0xff) {
            this.writeUInt16(nwkManagerAddr);
        }
        if (configurationBitmask !== undefined) {
            this.writeUInt8(configurationBitmask);
        }
        return this.getWritten();
    }
    // /**
    //  * Shortcut for @see BuffaloZdo.buildNwkEnhancedUpdateRequest
    //  */
    // private buildEnhancedScanChannelsRequest(channelPages: number[], duration: number, count: number, configurationBitmask: number | undefined): Buffer {
    //     return this.buildNwkEnhancedUpdateRequest(channelPages, duration, count, undefined, undefined, configurationBitmask);
    // }
    // /**
    //  * Shortcut for @see BuffaloZdo.buildNwkEnhancedUpdateRequest
    //  */
    // private buildEnhancedChannelChangeRequest(channelPage: number, nwkUpdateId: number | undefined, configurationBitmask: number | undefined): Buffer {
    //     return this.buildNwkEnhancedUpdateRequest([channelPage], 0xfe, undefined, nwkUpdateId, undefined, configurationBitmask);
    // }
    // /**
    //  * Shortcut for @see BuffaloZdo.buildNwkEnhancedUpdateRequest
    //  */
    // private buildEnhancedSetActiveChannelsAndNwkManagerIdRequest(
    //     channelPages: number[],
    //     nwkUpdateId: number | undefined,
    //     nwkManagerAddr: NodeId,
    //     configurationBitmask: number | undefined,
    // ): Buffer {
    //     return this.buildNwkEnhancedUpdateRequest(channelPages, 0xff, undefined, nwkUpdateId, nwkManagerAddr, configurationBitmask);
    // }
    /**
     * @see ClusterId.NWK_IEEE_JOINING_LIST_REQUEST
     * @param startIndex The starting index into the receiving device’s nwkIeeeJoiningList that SHALL be sent back.
     */
    buildNwkIEEEJoiningListRequest(startIndex) {
        this.writeUInt8(startIndex);
        return this.getWritten();
    }
    /**
     * @see ClusterId.NWK_BEACON_SURVEY_REQUEST
     */
    buildNwkBeaconSurveyRequest(tlv) {
        // BeaconSurveyConfigurationTLV: Local: ID: 0x00
        this.writeUInt8(0x00);
        this.writeUInt8(2 + tlv.scanChannelList.length * 4 - 1);
        this.writeUInt8(tlv.scanChannelList.length);
        this.writeListUInt32(tlv.scanChannelList);
        this.writeUInt8(tlv.configurationBitmask);
        return this.getWritten();
    }
    /**
     * @see ClusterId.START_KEY_NEGOTIATION_REQUEST
     */
    buildStartKeyNegotiationRequest(tlv) {
        // Curve25519PublicPointTLV: Local: ID: 0x00
        this.writeUInt8(0x00);
        this.writeUInt8(consts_1.EUI64_SIZE + consts_2.CURVE_PUBLIC_POINT_SIZE - 1);
        this.writeIeeeAddr(tlv.eui64);
        this.writeBuffer(tlv.publicPoint, consts_2.CURVE_PUBLIC_POINT_SIZE);
        return this.getWritten();
    }
    /**
     * @see ClusterId.RETRIEVE_AUTHENTICATION_TOKEN_REQUEST
     */
    buildRetrieveAuthenticationTokenRequest(tlv) {
        // AuthenticationTokenIdTLV: Local: ID: 0x00
        this.writeUInt8(0x00);
        this.writeUInt8(1 - 1);
        this.writeUInt8(tlv.tlvTypeTagId);
        return this.getWritten();
    }
    /**
     * @see ClusterId.GET_AUTHENTICATION_LEVEL_REQUEST
     */
    buildGetAuthenticationLevelRequest(tlv) {
        // TargetIEEEAddressTLV: Local: ID: 0x00
        this.writeUInt8(0x00);
        this.writeUInt8(consts_1.EUI64_SIZE - 1);
        this.writeIeeeAddr(tlv.ieee);
        return this.getWritten();
    }
    /**
     * @see ClusterId.SET_CONFIGURATION_REQUEST
     */
    buildSetConfigurationRequest(nextPanIdChange, nextChannelChange, configurationParameters) {
        this.writeGlobalTLV({ tagId: enums_1.GlobalTLV.NEXT_PAN_ID_CHANGE, length: consts_1.PAN_ID_SIZE, tlv: nextPanIdChange });
        this.writeGlobalTLV({ tagId: enums_1.GlobalTLV.NEXT_CHANNEL_CHANGE, length: 4, tlv: nextChannelChange });
        this.writeGlobalTLV({ tagId: enums_1.GlobalTLV.CONFIGURATION_PARAMETERS, length: 2, tlv: configurationParameters });
        return this.getWritten();
    }
    /**
     * @see ClusterId.GET_CONFIGURATION_REQUEST
     * @param tlvIds The IDs of each TLV that are being requested.
     *   Maximum number dependent on the underlying maximum size of the message as allowed by fragmentation.
     */
    buildGetConfigurationRequest(tlvIds) {
        this.writeUInt8(tlvIds.length);
        for (const tlvId of tlvIds) {
            this.writeUInt8(tlvId);
        }
        return this.getWritten();
    }
    /**
     * @see ClusterId.START_KEY_UPDATE_REQUEST
     */
    buildStartKeyUpdateRequest(selectedKeyNegotiationMethod, fragmentationParameters) {
        // SelectedKeyNegotiationMethodTLV: Local: ID: 0x00
        this.writeUInt8(0x00);
        this.writeUInt8(consts_1.EUI64_SIZE + 2 - 1);
        this.writeUInt8(selectedKeyNegotiationMethod.protocol);
        this.writeUInt8(selectedKeyNegotiationMethod.presharedSecret);
        this.writeIeeeAddr(selectedKeyNegotiationMethod.sendingDeviceEui64);
        {
            let length = 2;
            if (fragmentationParameters.fragmentationOptions) {
                length += 1;
            }
            if (fragmentationParameters.maxIncomingTransferUnit) {
                length += 2;
            }
            this.writeGlobalTLV({ tagId: enums_1.GlobalTLV.FRAGMENTATION_PARAMETERS, length, tlv: fragmentationParameters });
        }
        return this.getWritten();
    }
    /**
     * @see ClusterId.DECOMMISSION_REQUEST
     */
    buildDecommissionRequest(tlv) {
        // DeviceEUI64ListTLV: Local: ID: 0x00
        this.writeUInt8(0x00);
        this.writeUInt8(tlv.eui64List.length * consts_1.EUI64_SIZE + 1 - 1);
        this.writeUInt8(tlv.eui64List.length);
        for (const eui64 of tlv.eui64List) {
            this.writeIeeeAddr(eui64);
        }
        return this.getWritten();
    }
    /**
     * @see ClusterId.CHALLENGE_REQUEST
     */
    buildChallengeRequest(tlv) {
        // APSFrameCounterChallengeTLV: Local: ID: 0x00
        this.writeUInt8(0x00);
        this.writeUInt8(consts_1.EUI64_SIZE + consts_2.CHALLENGE_VALUE_SIZE - 1);
        this.writeIeeeAddr(tlv.senderEui64);
        this.writeBuffer(tlv.challengeValue, consts_2.CHALLENGE_VALUE_SIZE);
        return this.getWritten();
    }
    //-- RESPONSES
    static checkStatus(result) {
        return result[0] === status_1.Status.SUCCESS;
    }
    static readResponse(hasZdoMessageOverhead, clusterId, buffer) {
        const buffalo = new BuffaloZdo(buffer, hasZdoMessageOverhead ? consts_2.ZDO_MESSAGE_OVERHEAD : 0); // set pos to skip `transaction sequence number`
        switch (clusterId) {
            case clusters_1.ClusterId.NETWORK_ADDRESS_RESPONSE: {
                return buffalo.readNetworkAddressResponse();
            }
            case clusters_1.ClusterId.IEEE_ADDRESS_RESPONSE: {
                return buffalo.readIEEEAddressResponse();
            }
            case clusters_1.ClusterId.NODE_DESCRIPTOR_RESPONSE: {
                return buffalo.readNodeDescriptorResponse();
            }
            case clusters_1.ClusterId.POWER_DESCRIPTOR_RESPONSE: {
                return buffalo.readPowerDescriptorResponse();
            }
            case clusters_1.ClusterId.SIMPLE_DESCRIPTOR_RESPONSE: {
                return buffalo.readSimpleDescriptorResponse();
            }
            case clusters_1.ClusterId.ACTIVE_ENDPOINTS_RESPONSE: {
                return buffalo.readActiveEndpointsResponse();
            }
            case clusters_1.ClusterId.MATCH_DESCRIPTORS_RESPONSE: {
                return buffalo.readMatchDescriptorsResponse();
            }
            case clusters_1.ClusterId.END_DEVICE_ANNOUNCE: {
                return buffalo.readEndDeviceAnnounce();
            }
            case clusters_1.ClusterId.SYSTEM_SERVER_DISCOVERY_RESPONSE: {
                return buffalo.readSystemServerDiscoveryResponse();
            }
            case clusters_1.ClusterId.PARENT_ANNOUNCE_RESPONSE: {
                return buffalo.readParentAnnounceResponse();
            }
            case clusters_1.ClusterId.BIND_RESPONSE: {
                return buffalo.readBindResponse();
            }
            case clusters_1.ClusterId.UNBIND_RESPONSE: {
                return buffalo.readUnbindResponse();
            }
            case clusters_1.ClusterId.CLEAR_ALL_BINDINGS_RESPONSE: {
                return buffalo.readClearAllBindingsResponse();
            }
            case clusters_1.ClusterId.LQI_TABLE_RESPONSE: {
                return buffalo.readLQITableResponse();
            }
            case clusters_1.ClusterId.ROUTING_TABLE_RESPONSE: {
                return buffalo.readRoutingTableResponse();
            }
            case clusters_1.ClusterId.BINDING_TABLE_RESPONSE: {
                return buffalo.readBindingTableResponse();
            }
            case clusters_1.ClusterId.LEAVE_RESPONSE: {
                return buffalo.readLeaveResponse();
            }
            case clusters_1.ClusterId.PERMIT_JOINING_RESPONSE: {
                return buffalo.readPermitJoiningResponse();
            }
            case clusters_1.ClusterId.NWK_UPDATE_RESPONSE: {
                return buffalo.readNwkUpdateResponse();
            }
            case clusters_1.ClusterId.NWK_ENHANCED_UPDATE_RESPONSE: {
                return buffalo.readNwkEnhancedUpdateResponse();
            }
            case clusters_1.ClusterId.NWK_IEEE_JOINING_LIST_RESPONSE: {
                return buffalo.readNwkIEEEJoiningListResponse();
            }
            case clusters_1.ClusterId.NWK_UNSOLICITED_ENHANCED_UPDATE_RESPONSE: {
                return buffalo.readNwkUnsolicitedEnhancedUpdateResponse();
            }
            case clusters_1.ClusterId.NWK_BEACON_SURVEY_RESPONSE: {
                return buffalo.readNwkBeaconSurveyResponse();
            }
            case clusters_1.ClusterId.START_KEY_NEGOTIATION_RESPONSE: {
                return buffalo.readStartKeyNegotiationResponse();
            }
            case clusters_1.ClusterId.RETRIEVE_AUTHENTICATION_TOKEN_RESPONSE: {
                return buffalo.readRetrieveAuthenticationTokenResponse();
            }
            case clusters_1.ClusterId.GET_AUTHENTICATION_LEVEL_RESPONSE: {
                return buffalo.readGetAuthenticationLevelResponse();
            }
            case clusters_1.ClusterId.SET_CONFIGURATION_RESPONSE: {
                return buffalo.readSetConfigurationResponse();
            }
            case clusters_1.ClusterId.GET_CONFIGURATION_RESPONSE: {
                return buffalo.readGetConfigurationResponse();
            }
            case clusters_1.ClusterId.START_KEY_UPDATE_RESPONSE: {
                return buffalo.readStartKeyUpdateResponse();
            }
            case clusters_1.ClusterId.DECOMMISSION_RESPONSE: {
                return buffalo.readDecommissionResponse();
            }
            case clusters_1.ClusterId.CHALLENGE_RESPONSE: {
                return buffalo.readChallengeResponse();
            }
            default: {
                throw new Error(`Unsupported response reading for cluster ID '${clusterId}'.`);
            }
        }
    }
    /**
     * @see ClusterId.NETWORK_ADDRESS_RESPONSE
     */
    readNetworkAddressResponse() {
        // INV_REQUESTTYPE or DEVICE_NOT_FOUND
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const eui64 = this.readIeeeAddr();
            const nwkAddress = this.readUInt16();
            let assocDevCount = 0;
            let startIndex = 0;
            let assocDevList = [];
            if (this.isMore()) {
                assocDevCount = this.readUInt8();
                startIndex = this.readUInt8();
                assocDevList = this.readListUInt16(assocDevCount);
            }
            result = {
                eui64,
                nwkAddress,
                startIndex,
                assocDevList,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.IEEE_ADDRESS_RESPONSE
     */
    readIEEEAddressResponse() {
        // INV_REQUESTTYPE or DEVICE_NOT_FOUND
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const eui64 = this.readIeeeAddr();
            const nwkAddress = this.readUInt16();
            let assocDevCount = 0;
            let startIndex = 0;
            let assocDevList = [];
            if (this.isMore()) {
                assocDevCount = this.readUInt8();
                startIndex = this.readUInt8();
                assocDevList = this.readListUInt16(assocDevCount);
            }
            result = {
                eui64,
                nwkAddress,
                startIndex,
                assocDevList,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.NODE_DESCRIPTOR_RESPONSE
     */
    readNodeDescriptorResponse() {
        // DEVICE_NOT_FOUND, INV_REQUESTTYPE, or NO_DESCRIPTOR
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const nwkAddress = this.readUInt16();
            // in bits: [logical type: 3] [deprecated: 1] [deprecated: 1] [fragmentation supported (R23): 1] [reserved/unused: 2]
            const nodeDescByte1 = this.readUInt8();
            // in bits: [aps flags: 3] [frequency band: 5]
            const nodeDescByte2 = this.readUInt8();
            const macCapFlags = Utils.getMacCapFlags(this.readUInt8());
            const manufacturerCode = this.readUInt16();
            const maxBufSize = this.readUInt8();
            const maxIncTxSize = this.readUInt16();
            const serverMask = Utils.getServerMask(this.readUInt16());
            const maxOutTxSize = this.readUInt16();
            const deprecated1 = this.readUInt8();
            // Global: FragmentationParametersGlobalTLV
            const tlvs = this.readTLVs();
            result = {
                nwkAddress,
                logicalType: nodeDescByte1 & 0x07,
                fragmentationSupported: serverMask.stackComplianceRevision >= 23 ? (nodeDescByte1 & 0x20) >> 5 === 1 : undefined,
                apsFlags: nodeDescByte2 & 0x07,
                frequencyBand: (nodeDescByte2 & 0xf8) >> 3,
                capabilities: macCapFlags,
                manufacturerCode,
                maxBufSize,
                maxIncTxSize,
                serverMask,
                maxOutTxSize,
                deprecated1,
                tlvs,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.POWER_DESCRIPTOR_RESPONSE
     */
    readPowerDescriptorResponse() {
        // DEVICE_NOT_FOUND, INV_REQUESTTYPE, or NO_DESCRIPTOR
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const nwkAddress = this.readUInt16();
            const byte1 = this.readUInt8();
            const byte2 = this.readUInt8();
            result = {
                nwkAddress,
                currentPowerMode: byte1 & 0xf,
                availPowerSources: (byte1 >> 4) & 0xf,
                currentPowerSource: byte2 & 0xf,
                currentPowerSourceLevel: (byte2 >> 4) & 0xf,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.SIMPLE_DESCRIPTOR_RESPONSE
     */
    readSimpleDescriptorResponse() {
        // INVALID_EP, NOT_ACTIVE, DEVICE_NOT_FOUND, INV_REQUESTTYPE or NO_DESCRIPTOR
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const nwkAddress = this.readUInt16();
            // Length in bytes of the Simple Descriptor to follow. [0x00-0xff]
            const length = this.readUInt8();
            const endpoint = this.readUInt8();
            const profileId = this.readUInt16();
            const deviceId = this.readUInt16();
            const deviceVersion = this.readUInt8();
            const inClusterCount = this.readUInt8();
            const inClusterList = this.readListUInt16(inClusterCount); // empty if inClusterCount==0
            const outClusterCount = this.readUInt8();
            const outClusterList = this.readListUInt16(outClusterCount); // empty if outClusterCount==0
            result = {
                nwkAddress,
                length,
                endpoint,
                profileId,
                deviceId,
                deviceVersion,
                inClusterList,
                outClusterList,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.ACTIVE_ENDPOINTS_RESPONSE
     */
    readActiveEndpointsResponse() {
        // DEVICE_NOT_FOUND, INV_REQUESTTYPE, or NO_DESCRIPTOR
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const nwkAddress = this.readUInt16();
            const endpointCount = this.readUInt8();
            const endpointList = this.readListUInt8(endpointCount);
            result = {
                nwkAddress,
                endpointList,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.MATCH_DESCRIPTORS_RESPONSE
     */
    readMatchDescriptorsResponse() {
        // DEVICE_NOT_FOUND, INV_REQUESTTYPE, or NO_DESCRIPTOR
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const nwkAddress = this.readUInt16();
            const endpointCount = this.readUInt8();
            const endpointList = this.readListUInt8(endpointCount);
            result = {
                nwkAddress,
                endpointList,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.END_DEVICE_ANNOUNCE
     */
    readEndDeviceAnnounce() {
        const nwkAddress = this.readUInt16();
        const eui64 = this.readIeeeAddr();
        /** @see MACCapabilityFlags */
        const capabilities = this.readUInt8();
        return [status_1.Status.SUCCESS, { nwkAddress, eui64, capabilities: Utils.getMacCapFlags(capabilities) }];
    }
    /**
     * @see ClusterId.SYSTEM_SERVER_DISCOVERY_RESPONSE
     */
    readSystemServerDiscoveryResponse() {
        // never expected !== SUCCESS
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const serverMask = Utils.getServerMask(this.readUInt16());
            result = {
                serverMask,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.PARENT_ANNOUNCE_RESPONSE
     */
    readParentAnnounceResponse() {
        // NOT_SUPPORTED
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const numberOfChildren = this.readUInt8();
            const children = [];
            for (let i = 0; i < numberOfChildren; i++) {
                const childEui64 = this.readIeeeAddr();
                children.push(childEui64);
            }
            result = { children };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.BIND_RESPONSE
     * @returns No response payload, throws if not success
     */
    readBindResponse() {
        // NOT_SUPPORTED, INVALID_EP, TABLE_FULL, or NOT_AUTHORIZED
        const status = this.readUInt8();
        return [status, undefined];
    }
    /**
     * @see ClusterId.UNBIND_RESPONSE
     * @returns No response payload, throws if not success
     */
    readUnbindResponse() {
        // NOT_SUPPORTED, INVALID_EP, NO_ENTRY or NOT_AUTHORIZED
        const status = this.readUInt8();
        return [status, undefined];
    }
    /**
     * @see ClusterId.CLEAR_ALL_BINDINGS_RESPONSE
     * @returns No response payload, throws if not success
     */
    readClearAllBindingsResponse() {
        // NOT_SUPPORTED, NOT_AUTHORIZED, INV_REQUESTTYPE, or NO_MATCH.
        const status = this.readUInt8();
        return [status, undefined];
    }
    /**
     * @see ClusterId.LQI_TABLE_RESPONSE
     */
    readLQITableResponse() {
        // NOT_SUPPORTED or any status code returned from the NLME-GET.confirm primitive.
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const neighborTableEntries = this.readUInt8();
            const startIndex = this.readUInt8();
            // [0x00-0x02]
            const entryCount = this.readUInt8();
            const entryList = [];
            for (let i = 0; i < entryCount; i++) {
                const extendedPanId = this.readListUInt8(consts_1.EXTENDED_PAN_ID_SIZE);
                const eui64 = this.readIeeeAddr();
                const nwkAddress = this.readUInt16();
                const deviceTypeByte = this.readUInt8();
                const permitJoiningByte = this.readUInt8();
                const depth = this.readUInt8();
                const lqi = this.readUInt8();
                entryList.push({
                    extendedPanId,
                    eui64,
                    nwkAddress,
                    deviceType: deviceTypeByte & 0x03,
                    rxOnWhenIdle: (deviceTypeByte & 0x0c) >> 2,
                    relationship: (deviceTypeByte & 0x70) >> 4,
                    reserved1: (deviceTypeByte & 0x10) >> 7,
                    permitJoining: permitJoiningByte & 0x03,
                    reserved2: (permitJoiningByte & 0xfc) >> 2,
                    depth,
                    lqi,
                });
            }
            result = {
                neighborTableEntries,
                startIndex,
                entryList,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.ROUTING_TABLE_RESPONSE
     */
    readRoutingTableResponse() {
        // NOT_SUPPORTED or any status code returned from the NLMEGET.confirm primitive.
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const routingTableEntries = this.readUInt8();
            const startIndex = this.readUInt8();
            // [0x00-0xFF]
            const entryCount = this.readUInt8();
            const entryList = [];
            for (let i = 0; i < entryCount; i++) {
                const destinationAddress = this.readUInt16();
                const statusByte = this.readUInt8();
                const nextHopAddress = this.readUInt16();
                entryList.push({
                    destinationAddress,
                    status: enums_1.RoutingTableStatus[statusByte & 0x07],
                    memoryConstrained: (statusByte & 0x08) >> 3,
                    manyToOne: (statusByte & 0x10) >> 4,
                    routeRecordRequired: (statusByte & 0x20) >> 5,
                    reserved1: (statusByte & 0xc0) >> 6,
                    nextHopAddress,
                });
            }
            result = {
                routingTableEntries,
                startIndex,
                entryList,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.BINDING_TABLE_RESPONSE
     */
    readBindingTableResponse() {
        // NOT_SUPPORTED or any status code returned from the APSMEGET.confirm primitive.
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const bindingTableEntries = this.readUInt8();
            const startIndex = this.readUInt8();
            // [0x00-0xFF]
            const entryCount = this.readUInt8();
            const entryList = [];
            for (let i = 0; i < entryCount; i++) {
                const sourceEui64 = this.readIeeeAddr();
                const sourceEndpoint = this.readUInt8();
                const clusterId = this.readUInt16();
                const destAddrMode = this.readUInt8();
                const dest = destAddrMode === 0x01 ? this.readUInt16() : destAddrMode === 0x03 ? this.readIeeeAddr() : undefined;
                const destEndpoint = destAddrMode === 0x03 ? this.readUInt8() : undefined;
                if (dest === undefined) {
                    // not supported (using reserved value)
                    continue;
                }
                entryList.push({
                    sourceEui64,
                    sourceEndpoint,
                    clusterId,
                    destAddrMode,
                    dest,
                    destEndpoint,
                });
            }
            result = {
                bindingTableEntries,
                startIndex,
                entryList,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.LEAVE_RESPONSE
     * @returns No response payload, throws if not success
     */
    readLeaveResponse() {
        // NOT_SUPPORTED, NOT_AUTHORIZED or any status code returned from the NLMELEAVE.confirm primitive.
        const status = this.readUInt8();
        return [status, undefined];
    }
    /**
     * @see ClusterId.PERMIT_JOINING_RESPONSE
     * @returns No response payload, throws if not success
     */
    readPermitJoiningResponse() {
        // INV_REQUESTTYPE, NOT_AUTHORIZED, or any status code returned from the NLME-PERMIT-JOINING.confirm primitive.
        const status = this.readUInt8();
        return [status, undefined];
    }
    /**
     * @see ClusterId.NWK_UPDATE_RESPONSE
     */
    readNwkUpdateResponse() {
        // INV_REQUESTTYPE, NOT_SUPPORTED, or any status values returned from the MLME-SCAN.confirm primitive
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const scannedChannels = this.readUInt32();
            const totalTransmissions = this.readUInt16();
            const totalFailures = this.readUInt16();
            // [0x00-0xFF]
            const entryCount = this.readUInt8();
            const entryList = this.readListUInt8(entryCount);
            result = {
                scannedChannels,
                totalTransmissions,
                totalFailures,
                entryList,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.NWK_ENHANCED_UPDATE_RESPONSE
     */
    readNwkEnhancedUpdateResponse() {
        // INV_REQUESTTYPE, NOT_SUPPORTED, or any status values returned from the MLME-SCAN.confirm primitive.
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const scannedChannels = this.readUInt32();
            const totalTransmissions = this.readUInt16();
            const totalFailures = this.readUInt16();
            // [0x00-0xFF]
            const entryCount = this.readUInt8();
            const entryList = this.readListUInt8(entryCount);
            result = {
                scannedChannels,
                totalTransmissions,
                totalFailures,
                entryList,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.NWK_IEEE_JOINING_LIST_REPONSE
     */
    readNwkIEEEJoiningListResponse() {
        // INV_REQUESTTYPE, or NOT_SUPPORTED
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const updateId = this.readUInt8();
            const joiningPolicy = this.readUInt8();
            // [0x00-0xFF]
            const entryListTotal = this.readUInt8();
            let startIndex;
            let entryList;
            if (entryListTotal > 0) {
                startIndex = this.readUInt8();
                const entryCount = this.readUInt8();
                entryList = [];
                for (let i = 0; i < entryCount; i++) {
                    const ieee = this.readIeeeAddr();
                    entryList.push(ieee);
                }
            }
            result = {
                updateId,
                joiningPolicy,
                entryListTotal,
                startIndex,
                entryList,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.NWK_UNSOLICITED_ENHANCED_UPDATE_RESPONSE
     */
    readNwkUnsolicitedEnhancedUpdateResponse() {
        // ??
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const channelInUse = this.readUInt32();
            const macTxUCastTotal = this.readUInt16();
            const macTxUCastFailures = this.readUInt16();
            const macTxUCastRetries = this.readUInt16();
            const timePeriod = this.readUInt8();
            result = {
                channelInUse,
                macTxUCastTotal,
                macTxUCastFailures,
                macTxUCastRetries,
                timePeriod,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.NWK_BEACON_SURVEY_RESPONSE
     */
    readNwkBeaconSurveyResponse() {
        // INV_REQUESTTYPE, or NOT_SUPPORTED
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const localTLVs = new Map([
                // Local: ID: 0x01: BeaconSurveyResultsTLV
                [0x01, this.readBeaconSurveyResultsTLV],
                // Local: ID: 0x02: PotentialParentsTLV
                [0x02, this.readPotentialParentsTLV],
            ]);
            const tlvs = this.readTLVs(localTLVs);
            result = {
                tlvs,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.START_KEY_NEGOTIATION_RESPONSE
     */
    readStartKeyNegotiationResponse() {
        // INVALID_TLV, MISSING_TLV, TEMPORARY_FAILURE, NOT_AUTHORIZED
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const localTLVs = new Map([
                // Local: ID: 0x00: Curve25519PublicPointTLV
                [0x00, this.readCurve25519PublicPointTLV],
            ]);
            const tlvs = this.readTLVs(localTLVs);
            result = {
                tlvs,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.RETRIEVE_AUTHENTICATION_TOKEN_RESPONSE
     */
    readRetrieveAuthenticationTokenResponse() {
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            // no local TLV
            const tlvs = this.readTLVs();
            result = {
                tlvs,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.GET_AUTHENTICATION_LEVEL_RESPONSE
     */
    readGetAuthenticationLevelResponse() {
        // NOT_SUPPORTED, INV_REQUESTTYPE, MISSING_TLV, and NOT_AUTHORIZED
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const localTLVs = new Map([
                // Local: ID: 0x00: DeviceAuthenticationLevelTLV
                [0x00, this.readDeviceAuthenticationLevelTLV],
            ]);
            const tlvs = this.readTLVs(localTLVs);
            result = {
                tlvs,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.SET_CONFIGURATION_RESPONSE
     */
    readSetConfigurationResponse() {
        // INV_REQUESTTYPE, or NOT_SUPPORTED
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const localTLVs = new Map([
                // Local: ID: 0x00: ProcessingStatusTLV
                [0x00, this.readProcessingStatusTLV],
            ]);
            const tlvs = this.readTLVs(localTLVs);
            result = {
                tlvs,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.GET_CONFIGURATION_RESPONSE
     */
    readGetConfigurationResponse() {
        // INV_REQUESTTYPE, or NOT_SUPPORTED
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            // Global: IDs: x, y, z
            const tlvs = this.readTLVs();
            result = {
                tlvs,
            };
        }
        return [status, result];
    }
    /**
     * @see ClusterId.START_KEY_UPDATE_RESPONSE
     * @returns No response payload, throws if not success
     */
    readStartKeyUpdateResponse() {
        // INV_REQUESTTYPE, NOT_AUTHORIZED or NOT_SUPPORTED
        const status = this.readUInt8();
        return [status, undefined];
    }
    /**
     * @see ClusterId.DECOMMISSION_RESPONSE
     * @returns No response payload, throws if not success
     */
    readDecommissionResponse() {
        // INV_REQUESTTYPE, NOT_AUTHORIZED or NOT_SUPPORTED
        const status = this.readUInt8();
        return [status, undefined];
    }
    /**
     * @see ClusterId.CHALLENGE_RESPONSE
     */
    readChallengeResponse() {
        const status = this.readUInt8();
        let result;
        if (status === status_1.Status.SUCCESS) {
            const localTLVs = new Map([
                // Local: ID: 0x00: APSFrameCounterResponseTLV
                [0x00, this.readAPSFrameCounterResponseTLV],
            ]);
            const tlvs = this.readTLVs(localTLVs);
            result = {
                tlvs,
            };
        }
        return [status, result];
    }
}
exports.BuffaloZdo = BuffaloZdo;
//# sourceMappingURL=buffaloZdo.js.map