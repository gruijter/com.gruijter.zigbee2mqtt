import * as basic from "./basic";
import * as named from "./named";
export declare class EzspStruct {
    static serialize(cls: any, obj: any): Buffer;
    static deserialize(cls: any, data: Buffer): any[];
    toString(): string;
}
export declare class EmberNetworkParameters extends EzspStruct {
    extendedPanId: Buffer;
    panId: number;
    radioTxPower: number;
    radioChannel: number;
    joinMethod: named.EmberJoinMethod;
    nwkManagerId: named.EmberNodeId;
    nwkUpdateId: number;
    channels: number;
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberZigbeeNetwork extends EzspStruct {
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberApsFrame extends EzspStruct {
    profileId: number;
    sequence: number;
    clusterId: number;
    sourceEndpoint: number;
    destinationEndpoint: number;
    groupId?: number;
    options?: named.EmberApsOption;
    static _fields: (string | typeof basic.uint16_t)[][];
}
export declare class EmberBindingTableEntry extends EzspStruct {
    static _fields: ((string | typeof basic.uint16_t)[] | (string | typeof named.EmberEUI64)[])[];
}
export declare class EmberMulticastTableEntry extends EzspStruct {
    multicastId: number;
    endpoint: number;
    networkIndex: number;
    static _fields: (string | typeof basic.uint8_t)[][];
}
export declare class EmberKeyData extends EzspStruct {
    contents: Buffer;
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberCertificateData extends EzspStruct {
    contents: Buffer;
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberPublicKeyData extends EzspStruct {
    contents: Buffer;
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberPrivateKeyData extends EzspStruct {
    contents: Buffer;
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberSmacData extends EzspStruct {
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberSignatureData extends EzspStruct {
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberCertificate283k1Data extends EzspStruct {
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberPublicKey283k1Data extends EzspStruct {
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberPrivateKey283k1Data extends EzspStruct {
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberSignature283k1Data extends EzspStruct {
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberMessageDigest extends EzspStruct {
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberAesMmoHashContext extends EzspStruct {
    result: Buffer;
    length: number;
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberNeighborTableEntry extends EzspStruct {
    static _fields: ((string | typeof basic.uint16_t)[] | (string | typeof named.EmberEUI64)[])[];
}
export declare class EmberRouteTableEntry extends EzspStruct {
    static _fields: (string | typeof basic.uint16_t)[][];
}
export declare class EmberInitialSecurityState extends EzspStruct {
    bitmask: number;
    preconfiguredKey: EmberKeyData;
    networkKey: EmberKeyData;
    networkKeySequenceNumber: number;
    preconfiguredTrustCenterEui64: named.EmberEUI64;
    static _fields: ((string | typeof basic.uint8_t)[] | (string | typeof named.EmberEUI64)[] | (string | typeof EmberKeyData)[])[];
}
export declare class EmberCurrentSecurityState extends EzspStruct {
    static _fields: ((string | typeof named.EmberEUI64)[] | (string | typeof named.EmberCurrentSecurityBitmask)[])[];
}
export declare class EmberKeyStruct extends EzspStruct {
    key: EmberKeyData;
    outgoingFrameCounter: number;
    sequenceNumber: number;
    static _fields: ((string | typeof basic.uint8_t)[] | (string | typeof named.EmberEUI64)[] | (string | typeof EmberKeyData)[])[];
}
export declare class EmberNetworkInitStruct extends EzspStruct {
    static _fields: (string | typeof named.EmberNetworkInitBitmask)[][];
}
export declare class EmberZllSecurityAlgorithmData extends EzspStruct {
    static _fields: (string | typeof basic.uint16_t)[][];
}
export declare class EmberZllNetwork extends EzspStruct {
    static _fields: ((string | typeof basic.uint8_t)[] | (string | typeof named.EmberEUI64)[] | (string | typeof EmberZigbeeNetwork)[])[];
}
export declare class EmberZllInitialSecurityState extends EzspStruct {
    static _fields: ((string | typeof basic.uint32_t)[] | (string | typeof EmberKeyData)[])[];
}
export declare class EmberZllDeviceInfoRecord extends EzspStruct {
    static _fields: ((string | typeof basic.uint16_t)[] | (string | typeof named.EmberEUI64)[])[];
}
export declare class EmberZllAddressAssignment extends EzspStruct {
    static _fields: (string | typeof named.EmberNodeId)[][];
}
export declare class EmberTokTypeStackZllData extends EzspStruct {
    static _fields: (string | typeof basic.uint16_t)[][];
}
export declare class EmberTokTypeStackZllSecurity extends EzspStruct {
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberRf4ceVendorInfo extends EzspStruct {
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberRf4ceApplicationInfo extends EzspStruct {
    static _fields: (string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[][];
}
export declare class EmberRf4cePairingTableEntry extends EzspStruct {
    static _fields: ((string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[] | (string | typeof named.EmberEUI64)[])[];
}
export declare class EmberGpAddress extends EzspStruct {
    static _fields: ((string | typeof basic.uint8_t)[] | (string | typeof named.EmberEUI64)[])[];
}
export declare class EmberGpSinkListEntry extends EzspStruct {
    static _fields: ((string | typeof basic.uint8_t)[] | (string | typeof named.EmberEUI64)[])[];
}
export declare class EmberNodeDescriptor extends EzspStruct {
    static _fields: (string | typeof basic.uint16_t)[][];
}
export declare class EmberSimpleDescriptor extends EzspStruct {
    static _fields: basic.List[][];
}
export declare class EmberMultiAddress extends EzspStruct {
    static fields3: ((string | typeof basic.uint8_t)[] | (string | typeof named.EmberEUI64)[])[];
    static fields1: (string | typeof basic.uint8_t)[][];
    static serialize(cls: any, obj: any): Buffer;
}
export declare class EmberNeighbor extends EzspStruct {
    static _fields: ((string | {
        new (): any;
        deserialize(cls: any, data: Buffer): any;
    })[] | (string | typeof named.EmberEUI64)[])[];
}
export declare class EmberNeighbors extends EzspStruct {
    static _fields: basic.List[][];
}
export declare class EmberRoutingTableEntry extends EzspStruct {
    static _fields: (string | typeof basic.uint16_t)[][];
}
export declare class EmberRoutingTable extends EzspStruct {
    static _fields: basic.List[][];
}
export declare class EmberRawFrame extends EzspStruct {
    ieeeFrameControl: number;
    sequence: number;
    destPanId: number;
    destNodeId: named.EmberNodeId;
    sourcePanId: number;
    ieeeAddress: named.EmberEUI64;
    nwkFrameControl: number;
    appFrameControl: number;
    clusterId: number;
    profileId: number;
    static _fields: ((string | typeof basic.uint16_t)[] | (string | typeof named.EmberEUI64)[])[];
}
export declare class EmberIeeeRawFrame extends EzspStruct {
    ieeeFrameControl: number;
    sequence: number;
    destPanId: number;
    destAddress: named.EmberEUI64;
    sourcePanId: number;
    sourceAddress: named.EmberEUI64;
    nwkFrameControl: number;
    appFrameControl: number;
    clusterId: number;
    profileId: number;
    static _fields: ((string | typeof basic.uint16_t)[] | (string | typeof named.EmberEUI64)[])[];
}
export declare class EmberSecurityManagerContext extends EzspStruct {
    type: named.EmberKeyType;
    index: number;
    derivedType: named.EmberDerivedKeyType;
    eui64: named.EmberEUI64;
    multiNetworkIndex: number;
    flags: number;
    psaKeyAlgPermission: basic.uint32_t;
    static _fields: ((string | typeof basic.uint8_t)[] | (string | typeof named.EmberEUI64)[])[];
}
/** This data structure contains the metadata pertaining to an network key */
export declare class EmberSecurityManagerNetworkKeyInfo extends EzspStruct {
    networkKeySet: number;
    alternateNetworkKeySet: number;
    networkKeySequenceNumber: number;
    altNetworkKeySequenceNumber: number;
    networkKeyFrameCounter: number;
    static _fields: (string | typeof basic.uint8_t)[][];
}
//# sourceMappingURL=struct.d.ts.map