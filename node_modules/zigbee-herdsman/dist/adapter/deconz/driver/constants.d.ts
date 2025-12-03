import type { GenericZdoResponse } from "../../../zspec/zdo/definition/tstypes";
export declare enum ApsAddressMode {
    Group = 1,
    Nwk = 2,
    Ieee = 3,
    NwkAndIeee = 4
}
export declare enum ApsStatusCode {
    Success = 0,
    ApsNoAck = 167,
    NwkRouteDiscoveryFailed = 208,
    NwkRouteError = 209,
    NwkBroadcastTableFull = 210,
    MacNoChannelAccess = 225,
    MacInvalidParameterStatus = 232,
    MacNoAck = 233,
    MacNoBeacon = 234,
    MacTransactionExpired = 240
}
export declare enum NwkBroadcastAddress {
    BroadcastAll = 65535,
    BroadcastLowPowerRouters = 65531,
    BroadcastRouters = 65532,
    BroadcastRxOnWhenIdle = 65533
}
export declare enum FirmwareCommand {
    Status = 7,
    StatusChangeIndication = 14,
    FirmwareVersion = 13,
    ReadParameter = 10,
    WriteParameter = 11,
    ChangeNetworkState = 8,
    Feature = 17,
    ApsDataRequest = 18,
    ApsDataConfirm = 4,
    ApsDataIndication = 23,
    ZgpDataIndication = 25,
    MacPollIndication = 28,
    Reboot = 30,
    Beacon = 31,
    DebugLog = 34
}
export declare enum NetworkState {
    Disconnected = 0,
    Connecting = 1,
    Connected = 2,
    Disconnecting = 3,
    Ignore = 254,
    Unknown = 255
}
export declare enum CommandStatus {
    Success = 0,
    Failure = 1,
    Busy = 2,
    Timeout = 3,
    Unsupported = 4,
    Error = 5,
    NoNetwork = 6,
    InvalidValue = 7
}
export declare enum ParamId {
    MAC_ADDRESS = 1,
    NWK_PANID = 5,
    NWK_NETWORK_ADDRESS = 7,
    NWK_EXTENDED_PANID = 8,
    APS_DESIGNED_COORDINATOR = 9,
    APS_CHANNEL_MASK = 10,
    APS_USE_EXTENDED_PANID = 11,
    APS_TRUST_CENTER_ADDRESS = 14,
    STK_ENDPOINT = 19,
    STK_PREDEFINED_PANID = 21,
    STK_STATIC_NETWORK_ADDRESS = 22,
    STK_NETWORK_KEY = 24,
    STK_LINK_KEY = 25,
    STK_CURRENT_CHANNEL = 28,
    STK_PERMIT_JOIN = 33,
    STK_PROTOCOL_VERSION = 34,
    STK_NWK_UPDATE_ID = 36,
    DEV_WATCHDOG_TTL = 38,
    STK_FRAME_COUNTER = 39,
    STK_DEBUG_LOG_LEVEL = 41,
    NONE = 255
}
export declare enum DataType {
    Custom = 0,
    U8 = 1,
    U16 = 2,
    U32 = 3,
    U64 = 4,
    SecKey = 5
}
export declare const stackParameters: ({
    id: ParamId;
    type: DataType;
    readArg?: undefined;
} | {
    id: ParamId;
    type: DataType[];
    readArg: number;
})[];
interface Request {
    commandId: FirmwareCommand;
    networkState: NetworkState;
    parameterId: ParamId;
    parameter?: Buffer | number | bigint | undefined;
    seqNumber: number;
    resolve: (value: any) => void;
    reject: (value: Error) => void;
    ts: number;
}
interface ApsRequest {
    commandId: FirmwareCommand;
    request: ApsDataRequest;
    seqNumber: number;
    resolve: (value: any) => void;
    reject: (value: Error) => void;
    ts: number;
}
interface WaitForDataRequest {
    addr: number | string;
    profileId: number;
    clusterId: number;
    transactionSequenceNumber: number;
    resolve: (value: ReceivedDataResponse | PromiseLike<ReceivedDataResponse>) => void;
    reject: (value: Error) => void;
    confirmed: boolean;
    ts: number;
    timeout: number;
}
interface ReceivedDataResponse {
    commandId: number;
    seqNr: number;
    status: number;
    frameLength: number;
    payloadLength: number;
    deviceState: number;
    destAddrMode: number;
    destAddr16: number;
    destAddr64?: string;
    destEndpoint: number;
    srcAddrMode: number;
    srcAddr16: number;
    srcAddr64?: string;
    srcEndpoint: number;
    profileId: number;
    clusterId: number;
    asduLength: number;
    asduPayload: Buffer;
    lqi: number;
    rssi: number;
    zdo?: GenericZdoResponse;
}
interface GpDataInd {
    seqNr: number;
    id: number;
    options: number;
    srcId: number;
    frameCounter: number;
    commandId: number;
    commandFrameSize: number;
    commandFrame: Buffer;
}
interface DataStateResponse {
    commandId: number;
    seqNr: number;
    status: number;
    frameLength: number;
    payloadLength: number;
    deviceState: number;
    requestId: number;
    destAddrMode: number;
    destAddr16?: number;
    destAddr64?: string;
    destEndpoint?: number;
    srcEndpoint: number;
    confirmStatus: number;
}
interface ApsDataRequest {
    requestId: number;
    destAddrMode: number;
    destAddr16?: number;
    destAddr64?: string;
    destEndpoint?: number;
    profileId: number;
    clusterId: number;
    srcEndpoint: number;
    asduLength: number;
    asduPayload: Buffer;
    txOptions: number;
    radius: number;
    timeout: number;
}
type Command = Buffer | number | bigint;
export type { ApsRequest, Request, WaitForDataRequest, ApsDataRequest, ReceivedDataResponse, DataStateResponse, Command, GpDataInd };
declare const _default: {
    PARAM: {
        STK: {
            Endpoint: number;
        };
        APS: {
            MAX_SEND_TIMEOUT: number;
        };
        txRadius: {
            DEFAULT_RADIUS: number;
            UNLIMITED: number;
        };
    };
};
export default _default;
//# sourceMappingURL=constants.d.ts.map