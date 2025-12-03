import Buffalo from "../../../buffalo/buffalo";
import { EzspStatus, SLStatus } from "../enums";
import type { Ember802154RadioPriorities, EmberAesMmoHashContext, EmberApsFrame, EmberBeaconClassificationParams, EmberBeaconData, EmberBeaconIterator, EmberBindingTableEntry, EmberCertificate283k1Data, EmberCertificateData, EmberChildData, EmberCurrentSecurityState, EmberDutyCycleLimits, EmberEndpointDescription, EmberGpAddress, EmberGpProxyTableEntry, EmberGpSinkListEntry, EmberGpSinkTableEntry, EmberInitialSecurityState, EmberKeyData, EmberMessageDigest, EmberMulticastTableEntry, EmberMultiPhyRadioParameters, EmberMultiprotocolPriorities, EmberNeighborTableEntry, EmberNetworkInitStruct, EmberNetworkParameters, EmberPerDeviceDutyCycle, EmberPrivateKey283k1Data, EmberPrivateKeyData, EmberPublicKey283k1Data, EmberPublicKeyData, EmberRouteTableEntry, EmberRxPacketInfo, EmberSignature283k1Data, EmberSignatureData, EmberSmacData, EmberTokenData, EmberTokenInfo, EmberTokTypeStackZllData, EmberTokTypeStackZllSecurity, EmberZigbeeNetwork, EmberZllAddressAssignment, EmberZllDeviceInfoRecord, EmberZllInitialSecurityState, EmberZllNetwork, EmberZllSecurityAlgorithmData, SecManAPSKeyMetadata, SecManContext, SecManKey, SecManNetworkKeyInfo } from "../types";
import type { EzspFrameID } from "./enums";
export declare class EzspBuffalo extends Buffalo {
    getBufferLength(): number;
    /**
     * Set the byte at given position without affecting the internal position tracker.
     * @param position
     * @param value
     */
    setCommandByte(position: number, value: number): void;
    /**
     * Get the byte at given position without affecting the internal position tracker.
     * @param position
     * @returns
     */
    getCommandByte(position: number): number;
    /**
     * Get the byte at given position without affecting the internal position tracker.
     * @param position
     * @returns
     */
    getResponseByte(position: number): number;
    getExtFrameControl(): number;
    getExtFrameId(): EzspFrameID;
    getFrameId(): EzspFrameID;
    /**
     * Get the frame control, ID and params index according to format version.
     * Throws if frame control is unsupported (using reserved).
     * @returns Anything but SUCCESS should stop further processing.
     */
    getResponseMetadata(): [status: EzspStatus, frameControl: number, frameId: EzspFrameID, parametersIndex: number];
    /**
     * Get a copy of the rest of the buffer (from current position to end).
     * WARNING: Make sure the length is appropriate, if alloc'ed longer, it will return everything until the end.
     * @returns
     */
    readRest(): Buffer;
    /**
     * This is mostly used for payload/encryption stuff.
     * Copies the buffer to avoid memory referencing issues since Ezsp has a single buffer allocated.
     * @param length
     * @returns
     */
    protected readBufferCopy(length: number): Buffer;
    /**
     * Write a uint8_t for payload length, followed by payload buffer (copied at post-length position).
     *
     * WARNING: `payload` must have a valid length (as in, not a Buffer allocated to longer length).
     *          Should be passed with getWritten() in most cases.
     * @param payload
     */
    writePayload(payload: Buffer): void;
    /**
     * Read a uint8_t for payload length, followed by payload buffer (using post-length position).
     * @returns
     */
    readPayload(): Buffer;
    writeEmberNetworkParameters(value: EmberNetworkParameters): void;
    readEmberNetworkParameters(): EmberNetworkParameters;
    writeEmberMultiPhyRadioParameters(value: EmberMultiPhyRadioParameters): void;
    readEmberMultiPhyRadioParameters(): EmberMultiPhyRadioParameters;
    writeEmberApsFrame(value: EmberApsFrame): void;
    readEmberApsFrame(): EmberApsFrame;
    writeEmberBindingTableEntry(value: EmberBindingTableEntry): void;
    readEmberBindingTableEntry(): EmberBindingTableEntry;
    writeEmberMulticastTableEntry(value: EmberMulticastTableEntry): void;
    readEmberMulticastTableEntry(): EmberMulticastTableEntry;
    writeEmberBeaconClassificationParams(value: EmberBeaconClassificationParams): void;
    readEmberBeaconClassificationParams(): EmberBeaconClassificationParams;
    writeEmberNeighborTableEntry(value: EmberNeighborTableEntry): void;
    readEmberNeighborTableEntry(): EmberNeighborTableEntry;
    writeEmberRouteTableEntry(value: EmberRouteTableEntry): void;
    readEmberRouteTableEntry(): EmberRouteTableEntry;
    writeEmberKeyData(value: EmberKeyData): void;
    readEmberKeyData(): EmberKeyData;
    writeSecManKey(value: SecManKey): void;
    readSecManKey(): SecManKey;
    writeSecManContext(value: SecManContext): void;
    readSecManContext(): SecManContext;
    writeSecManNetworkKeyInfo(value: SecManNetworkKeyInfo): void;
    readSecManNetworkKeyInfo(): SecManNetworkKeyInfo;
    writeSecManAPSKeyMetadata(value: SecManAPSKeyMetadata): void;
    readSecManAPSKeyMetadata(): SecManAPSKeyMetadata;
    writeEmberInitialSecurityState(value: EmberInitialSecurityState): void;
    readEmberInitialSecurityState(): EmberInitialSecurityState;
    writeEmberCurrentSecurityState(value: EmberCurrentSecurityState): void;
    readEmberCurrentSecurityState(): EmberCurrentSecurityState;
    writeEmberChildData(value: EmberChildData): void;
    readEmberChildData(): EmberChildData;
    readEmberZigbeeNetwork(): EmberZigbeeNetwork;
    writeEmberZigbeeNetwork(value: EmberZigbeeNetwork): void;
    writeEmberCertificateData(value: EmberCertificateData): void;
    readEmberCertificateData(): EmberCertificateData;
    writeEmberPublicKeyData(value: EmberPublicKeyData): void;
    readEmberPublicKeyData(): EmberPublicKeyData;
    writeEmberPrivateKeyData(value: EmberPrivateKeyData): void;
    readEmberPrivateKeyData(): EmberPrivateKeyData;
    writeEmberSmacData(value: EmberSmacData): void;
    readEmberSmacData(): EmberSmacData;
    writeEmberSignatureData(value: EmberSignatureData): void;
    readEmberSignatureData(): EmberSignatureData;
    writeEmberCertificate283k1Data(value: EmberCertificate283k1Data): void;
    readEmberCertificate283k1Data(): EmberCertificate283k1Data;
    writeEmberPublicKey283k1Data(value: EmberPublicKey283k1Data): void;
    readEmberPublicKey283k1Data(): EmberPublicKey283k1Data;
    writeEmberPrivateKey283k1Data(value: EmberPrivateKey283k1Data): void;
    readEmberPrivateKey283k1Data(): EmberPrivateKey283k1Data;
    writeEmberSignature283k1Data(value: EmberSignature283k1Data): void;
    readEmberSignature283k1Data(): EmberSignature283k1Data;
    writeEmberAesMmoHashContext(context: EmberAesMmoHashContext): void;
    readEmberAesMmoHashContext(): EmberAesMmoHashContext;
    writeEmberMessageDigest(value: EmberMessageDigest): void;
    readEmberMessageDigest(): EmberMessageDigest;
    writeEmberNetworkInitStruct(networkInitStruct: EmberNetworkInitStruct): void;
    readEmberNetworkInitStruct(): EmberNetworkInitStruct;
    writeEmberZllNetwork(network: EmberZllNetwork): void;
    readEmberZllNetwork(): EmberZllNetwork;
    writeEmberZllSecurityAlgorithmData(data: EmberZllSecurityAlgorithmData): void;
    readEmberZllSecurityAlgorithmData(): EmberZllSecurityAlgorithmData;
    writeEmberZllInitialSecurityState(state: EmberZllInitialSecurityState): void;
    writeEmberTokTypeStackZllData(data: EmberTokTypeStackZllData): void;
    readEmberTokTypeStackZllData(): EmberTokTypeStackZllData;
    writeEmberTokTypeStackZllSecurity(security: EmberTokTypeStackZllSecurity): void;
    readEmberTokTypeStackZllSecurity(): EmberTokTypeStackZllSecurity;
    writeEmberGpAddress(value: EmberGpAddress): void;
    readEmberGpAddress(): EmberGpAddress;
    readEmberGpSinkList(): EmberGpSinkListEntry[];
    writeEmberGpSinkList(value: EmberGpSinkListEntry[]): void;
    readEmberGpProxyTableEntry(): EmberGpProxyTableEntry;
    writeEmberGpProxyTableEntry(value: EmberGpProxyTableEntry): void;
    readEmberGpSinkTableEntry(): EmberGpSinkTableEntry;
    writeEmberGpSinkTableEntry(value: EmberGpSinkTableEntry): void;
    writeEmberDutyCycleLimits(limits: EmberDutyCycleLimits): void;
    readEmberDutyCycleLimits(): EmberDutyCycleLimits;
    writeEmberPerDeviceDutyCycle(maxDevices: number, arrayOfDeviceDutyCycles: EmberPerDeviceDutyCycle[]): void;
    readEmberPerDeviceDutyCycle(): EmberPerDeviceDutyCycle[];
    readEmberZllDeviceInfoRecord(): EmberZllDeviceInfoRecord;
    readEmberZllInitialSecurityState(): EmberZllInitialSecurityState;
    readEmberZllAddressAssignment(): EmberZllAddressAssignment;
    writeEmberBeaconIterator(value: EmberBeaconIterator): void;
    readEmberBeaconIterator(): EmberBeaconIterator;
    writeEmberBeaconData(value: EmberBeaconData): void;
    readEmberBeaconData(): EmberBeaconData;
    writeEmberTokenData(tokenData: EmberTokenData): void;
    readEmberTokenData(): EmberTokenData;
    readEmberTokenInfo(): EmberTokenInfo;
    writeEmberTokenInfo(tokenInfo: EmberTokenInfo): void;
    /**
     * EZSP switched to using SLStatus for command returns from version 14.
     * @param version EZSP protocol version in use
     * @param mapFromEmber If true, map from EmberStatus, otherwise map from EzspStatus
     * @returns EzspStatus, EmberStatus or SLStatus as SLStatus
     */
    readStatus(version: number, mapFromEmber?: boolean): SLStatus;
    readEmberEndpointDescription(): EmberEndpointDescription;
    /** @deprecated removed in EZSP v16 in favor of @see readEmber802154RadioPriorities */
    readEmberMultiprotocolPriorities(): EmberMultiprotocolPriorities;
    /** @deprecated removed in EZSP v16 in favor of @see writeEmber802154RadioPriorities */
    writeEmberMultiprotocolPriorities(priorities: EmberMultiprotocolPriorities): void;
    readEmber802154RadioPriorities(): Ember802154RadioPriorities;
    writeEmber802154RadioPriorities(priorities: Ember802154RadioPriorities): void;
    readEmberRxPacketInfo(): EmberRxPacketInfo;
}
//# sourceMappingURL=buffalo.d.ts.map