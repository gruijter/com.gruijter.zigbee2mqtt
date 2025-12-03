import { EventEmitter } from "node:events";
import type { Adapter, Events as AdapterEvents } from "../adapter";
import * as Zcl from "../zspec/zcl";
import type { GreenPowerDeviceJoinedPayload } from "./tstype";
declare const enum ZigbeeNWKGPAppId {
    Default = 0,
    Lped = 1,
    Zgp = 2
}
declare const enum ZigbeeNWKGPSecurityLevel {
    /** No Security  */
    No = 0,
    /** Reserved?  */
    OneLsb = 1,
    /** 4 Byte Frame Counter and 4 Byte MIC */
    Full = 2,
    /** 4 Byte Frame Counter and 4 Byte MIC with encryption */
    FullEncr = 3
}
declare const enum ZigbeeNWKGPSecurityKeyType {
    NoKey = 0,
    ZbNwkKey = 1,
    GpdGroupKey = 2,
    NwkKeyDerivedGpdKeyGroupKey = 3,
    PreconfiguredIndividualGpdKey = 4,
    DerivedIndividualGpdKey = 7
}
declare const enum GPCommunicationMode {
    FullUnicast = 0,
    GroupcastToDgroupId = 1,
    GroupcastToPrecommissionedGroupId = 2,
    LightweightUnicast = 3
}
type PairingOptions = {
    appId: ZigbeeNWKGPAppId;
    addSink: boolean;
    removeGpd: boolean;
    communicationMode: GPCommunicationMode;
    gpdFixed: boolean;
    gpdMacSeqNumCapabilities: boolean;
    securityLevel: ZigbeeNWKGPSecurityLevel;
    securityKeyType: ZigbeeNWKGPSecurityKeyType;
    gpdSecurityFrameCounterPresent: boolean;
    gpdSecurityKeyPresent: boolean;
    assignedAliasPresent: boolean;
    groupcastRadiusPresent: boolean;
};
type CommissioningModeOptions = {
    action: number;
    commissioningWindowPresent: boolean;
    /** Bits: 0: On first Pairing success | 1: On GP Proxy Commissioning Mode (exit) */
    exitMode: number;
    /** should always be always false in current spec (1.1.2) */
    channelPresent: boolean;
    unicastCommunication: boolean;
};
interface GreenPowerEventMap {
    deviceJoined: [payload: GreenPowerDeviceJoinedPayload];
    deviceLeave: [sourceID: number];
}
export declare class GreenPower extends EventEmitter<GreenPowerEventMap> {
    private adapter;
    constructor(adapter: Adapter);
    static sourceIdToIeeeAddress(sourceId: number): string;
    private encryptSecurityKey;
    private decryptPayload;
    static encodePairingOptions(options: PairingOptions): number;
    static decodePairingOptions(byte: number): PairingOptions;
    /** see 14-0563-19 A.3.3.5.2 */
    private sendPairingCommand;
    processCommand(dataPayload: AdapterEvents.ZclPayload, frame: Zcl.Frame, securityKey?: Buffer): Promise<Zcl.Frame>;
    static encodeCommissioningModeOptions(options: CommissioningModeOptions): number;
    static decodeCommissioningModeOptions(byte: number): CommissioningModeOptions;
    permitJoin(time: number, networkAddress?: number): Promise<void>;
}
export default GreenPower;
//# sourceMappingURL=greenPower.d.ts.map