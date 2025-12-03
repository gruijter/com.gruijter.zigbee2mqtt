import { ClusterId as ZdoClusterId } from "../../../zspec/zdo";
export declare enum AddressMode {
    Bound = 0,//Use one or more bound nodes/endpoints, with acknowledgements
    Group = 1,//Use a pre-defined group address, with acknowledgements
    Short = 2,//Use a 16-bit network address, with acknowledgements
    Ieee = 3,//Use a 64-bit IEEE/MAC address, with acknowledgements
    Broadcast = 4,//Perform a broadcast
    NoTransmit = 5,//Do not transmit
    BoundNoAck = 6,//Perform a bound transmission, with no acknowledgements
    ShortNoAck = 7,//Perform a transmission using a 16-bit network address, with no acknowledgements
    IeeeNoAck = 8,//Perform a transmission using a 64-bit IEEE/MAC address, with no acknowledgements
    BoundNonBlocking = 9,//Perform a non-blocking bound transmission, with acknowledgements
    BoundNonBlockingNoAck = 10
}
export declare enum DeviceType {
    Coordinator = 0,
    Router = 1,
    LegacyRouter = 2
}
export declare enum LogLevel {
    EMERG = 0,
    ALERT = 1,
    "CRIT " = 2,
    ERROR = 3,
    "WARN " = 4,
    "NOT  " = 5,
    "INFO " = 6,
    DEBUG = 7
}
export declare enum Status {
    E_SL_MSG_STATUS_SUCCESS = 0,
    E_SL_MSG_STATUS_INCORRECT_PARAMETERS = 1,
    E_SL_MSG_STATUS_UNHANDLED_COMMAND = 2,
    E_SL_MSG_STATUS_BUSY = 3,
    E_SL_MSG_STATUS_STACK_ALREADY_STARTED = 4
}
export declare enum ZiGateCommandCode {
    GetNetworkState = 9,
    RawMode = 2,
    SetExtendedPANID = 32,
    SetChannelMask = 33,
    GetVersion = 16,
    Reset = 17,
    ErasePersistentData = 18,
    RemoveDevice = 38,
    RawAPSDataRequest = 1328,
    GetTimeServer = 23,
    SetTimeServer = 22,
    PermitJoinStatus = 20,
    GetDevicesList = 21,
    StartNetwork = 36,
    StartNetworkScan = 37,
    SetCertification = 25,
    OnOff = 146,
    OnOffTimed = 147,
    AttributeDiscovery = 320,
    AttributeRead = 256,
    AttributeWrite = 272,
    DescriptorComplex = 1329,
    Bind = 48,
    UnBind = 49,
    NwkAddress = 64,
    IEEEAddress = 65,
    NodeDescriptor = 66,
    SimpleDescriptor = 67,
    PowerDescriptor = 68,
    ActiveEndpoint = 69,
    MatchDescriptor = 70,
    PermitJoin = 73,
    ManagementNetworkUpdate = 74,
    SystemServerDiscovery = 75,
    LeaveRequest = 76,
    ManagementLQI = 78,
    SetDeviceType = 35,
    LED = 24,
    SetTXpower = 2054,
    SetSecurityStateKey = 34,
    AddGroup = 96
}
export declare const ZDO_REQ_CLUSTER_ID_TO_ZIGATE_COMMAND_ID: Readonly<Partial<Record<ZdoClusterId, ZiGateCommandCode>>>;
export declare enum ZiGateMessageCode {
    DeviceAnnounce = 77,
    Status = 32768,
    LOG = 32769,
    DataIndication = 32770,
    NodeClusterList = 32771,
    NodeAttributeList = 32772,
    NodeCommandIDList = 32773,
    SimpleDescriptorResponse = 32835,
    NetworkState = 32777,
    VersionList = 32784,
    APSDataACK = 32785,
    APSDataConfirm = 32786,
    APSDataConfirmFailed = 34562,
    NetworkJoined = 32804,
    LeaveIndication = 32840,
    RouterDiscoveryConfirm = 34561,
    PermitJoinStatus = 32788,
    GetTimeServer = 32791,
    ManagementLQIResponse = 32846,
    ManagementLeaveResponse = 32839,
    PDMEvent = 32821,
    PDMLoaded = 770,
    RestartNonFactoryNew = 32774,
    RestartFactoryNew = 32775,
    ExtendedStatusCallBack = 39321,
    AddGroupResponse = 32864
}
export type ZiGateObjectPayload = any;
export declare enum ZPSNwkKeyState {
    ZPS_ZDO_NO_NETWORK_KEY = 0,
    ZPS_ZDO_PRECONFIGURED_LINK_KEY = 1,
    ZPS_ZDO_DISTRIBUTED_LINK_KEY = 2,
    ZPS_ZDO_PRECONFIGURED_INSTALLATION_CODE = 3
}
//# sourceMappingURL=constants.d.ts.map