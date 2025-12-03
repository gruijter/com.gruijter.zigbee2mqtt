"use strict";
/* v8 ignore start */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stackParameters = exports.DataType = exports.ParamId = exports.CommandStatus = exports.NetworkState = exports.FirmwareCommand = exports.NwkBroadcastAddress = exports.ApsStatusCode = exports.ApsAddressMode = void 0;
const PARAM = {
    STK: {
        Endpoint: 0x13,
    },
    APS: {
        MAX_SEND_TIMEOUT: 60000,
    },
    txRadius: {
        DEFAULT_RADIUS: 30,
        UNLIMITED: 0,
    },
};
var ApsAddressMode;
(function (ApsAddressMode) {
    ApsAddressMode[ApsAddressMode["Group"] = 1] = "Group";
    ApsAddressMode[ApsAddressMode["Nwk"] = 2] = "Nwk";
    ApsAddressMode[ApsAddressMode["Ieee"] = 3] = "Ieee";
    ApsAddressMode[ApsAddressMode["NwkAndIeee"] = 4] = "NwkAndIeee";
})(ApsAddressMode || (exports.ApsAddressMode = ApsAddressMode = {}));
var ApsStatusCode;
(function (ApsStatusCode) {
    ApsStatusCode[ApsStatusCode["Success"] = 0] = "Success";
    ApsStatusCode[ApsStatusCode["ApsNoAck"] = 167] = "ApsNoAck";
    ApsStatusCode[ApsStatusCode["NwkRouteDiscoveryFailed"] = 208] = "NwkRouteDiscoveryFailed";
    ApsStatusCode[ApsStatusCode["NwkRouteError"] = 209] = "NwkRouteError";
    ApsStatusCode[ApsStatusCode["NwkBroadcastTableFull"] = 210] = "NwkBroadcastTableFull";
    ApsStatusCode[ApsStatusCode["MacNoChannelAccess"] = 225] = "MacNoChannelAccess";
    ApsStatusCode[ApsStatusCode["MacInvalidParameterStatus"] = 232] = "MacInvalidParameterStatus";
    ApsStatusCode[ApsStatusCode["MacNoAck"] = 233] = "MacNoAck";
    ApsStatusCode[ApsStatusCode["MacNoBeacon"] = 234] = "MacNoBeacon";
    ApsStatusCode[ApsStatusCode["MacTransactionExpired"] = 240] = "MacTransactionExpired";
})(ApsStatusCode || (exports.ApsStatusCode = ApsStatusCode = {}));
var NwkBroadcastAddress;
(function (NwkBroadcastAddress) {
    NwkBroadcastAddress[NwkBroadcastAddress["BroadcastAll"] = 65535] = "BroadcastAll";
    NwkBroadcastAddress[NwkBroadcastAddress["BroadcastLowPowerRouters"] = 65531] = "BroadcastLowPowerRouters";
    NwkBroadcastAddress[NwkBroadcastAddress["BroadcastRouters"] = 65532] = "BroadcastRouters";
    NwkBroadcastAddress[NwkBroadcastAddress["BroadcastRxOnWhenIdle"] = 65533] = "BroadcastRxOnWhenIdle";
})(NwkBroadcastAddress || (exports.NwkBroadcastAddress = NwkBroadcastAddress = {}));
var FirmwareCommand;
(function (FirmwareCommand) {
    FirmwareCommand[FirmwareCommand["Status"] = 7] = "Status";
    FirmwareCommand[FirmwareCommand["StatusChangeIndication"] = 14] = "StatusChangeIndication";
    FirmwareCommand[FirmwareCommand["FirmwareVersion"] = 13] = "FirmwareVersion";
    FirmwareCommand[FirmwareCommand["ReadParameter"] = 10] = "ReadParameter";
    FirmwareCommand[FirmwareCommand["WriteParameter"] = 11] = "WriteParameter";
    FirmwareCommand[FirmwareCommand["ChangeNetworkState"] = 8] = "ChangeNetworkState";
    FirmwareCommand[FirmwareCommand["Feature"] = 17] = "Feature";
    FirmwareCommand[FirmwareCommand["ApsDataRequest"] = 18] = "ApsDataRequest";
    FirmwareCommand[FirmwareCommand["ApsDataConfirm"] = 4] = "ApsDataConfirm";
    FirmwareCommand[FirmwareCommand["ApsDataIndication"] = 23] = "ApsDataIndication";
    FirmwareCommand[FirmwareCommand["ZgpDataIndication"] = 25] = "ZgpDataIndication";
    FirmwareCommand[FirmwareCommand["MacPollIndication"] = 28] = "MacPollIndication";
    FirmwareCommand[FirmwareCommand["Reboot"] = 30] = "Reboot";
    FirmwareCommand[FirmwareCommand["Beacon"] = 31] = "Beacon";
    FirmwareCommand[FirmwareCommand["DebugLog"] = 34] = "DebugLog";
})(FirmwareCommand || (exports.FirmwareCommand = FirmwareCommand = {}));
var NetworkState;
(function (NetworkState) {
    NetworkState[NetworkState["Disconnected"] = 0] = "Disconnected";
    NetworkState[NetworkState["Connecting"] = 1] = "Connecting";
    NetworkState[NetworkState["Connected"] = 2] = "Connected";
    NetworkState[NetworkState["Disconnecting"] = 3] = "Disconnecting";
    // only internal
    NetworkState[NetworkState["Ignore"] = 254] = "Ignore";
    NetworkState[NetworkState["Unknown"] = 255] = "Unknown";
})(NetworkState || (exports.NetworkState = NetworkState = {}));
var CommandStatus;
(function (CommandStatus) {
    CommandStatus[CommandStatus["Success"] = 0] = "Success";
    CommandStatus[CommandStatus["Failure"] = 1] = "Failure";
    CommandStatus[CommandStatus["Busy"] = 2] = "Busy";
    CommandStatus[CommandStatus["Timeout"] = 3] = "Timeout";
    CommandStatus[CommandStatus["Unsupported"] = 4] = "Unsupported";
    CommandStatus[CommandStatus["Error"] = 5] = "Error";
    CommandStatus[CommandStatus["NoNetwork"] = 6] = "NoNetwork";
    CommandStatus[CommandStatus["InvalidValue"] = 7] = "InvalidValue";
})(CommandStatus || (exports.CommandStatus = CommandStatus = {}));
var ParamId;
(function (ParamId) {
    ParamId[ParamId["MAC_ADDRESS"] = 1] = "MAC_ADDRESS";
    ParamId[ParamId["NWK_PANID"] = 5] = "NWK_PANID";
    ParamId[ParamId["NWK_NETWORK_ADDRESS"] = 7] = "NWK_NETWORK_ADDRESS";
    ParamId[ParamId["NWK_EXTENDED_PANID"] = 8] = "NWK_EXTENDED_PANID";
    ParamId[ParamId["APS_DESIGNED_COORDINATOR"] = 9] = "APS_DESIGNED_COORDINATOR";
    ParamId[ParamId["APS_CHANNEL_MASK"] = 10] = "APS_CHANNEL_MASK";
    ParamId[ParamId["APS_USE_EXTENDED_PANID"] = 11] = "APS_USE_EXTENDED_PANID";
    ParamId[ParamId["APS_TRUST_CENTER_ADDRESS"] = 14] = "APS_TRUST_CENTER_ADDRESS";
    ParamId[ParamId["STK_ENDPOINT"] = 19] = "STK_ENDPOINT";
    ParamId[ParamId["STK_PREDEFINED_PANID"] = 21] = "STK_PREDEFINED_PANID";
    ParamId[ParamId["STK_STATIC_NETWORK_ADDRESS"] = 22] = "STK_STATIC_NETWORK_ADDRESS";
    ParamId[ParamId["STK_NETWORK_KEY"] = 24] = "STK_NETWORK_KEY";
    ParamId[ParamId["STK_LINK_KEY"] = 25] = "STK_LINK_KEY";
    ParamId[ParamId["STK_CURRENT_CHANNEL"] = 28] = "STK_CURRENT_CHANNEL";
    ParamId[ParamId["STK_PERMIT_JOIN"] = 33] = "STK_PERMIT_JOIN";
    ParamId[ParamId["STK_PROTOCOL_VERSION"] = 34] = "STK_PROTOCOL_VERSION";
    ParamId[ParamId["STK_NWK_UPDATE_ID"] = 36] = "STK_NWK_UPDATE_ID";
    ParamId[ParamId["DEV_WATCHDOG_TTL"] = 38] = "DEV_WATCHDOG_TTL";
    ParamId[ParamId["STK_FRAME_COUNTER"] = 39] = "STK_FRAME_COUNTER";
    ParamId[ParamId["STK_DEBUG_LOG_LEVEL"] = 41] = "STK_DEBUG_LOG_LEVEL";
    // internal
    ParamId[ParamId["NONE"] = 255] = "NONE";
})(ParamId || (exports.ParamId = ParamId = {}));
var DataType;
(function (DataType) {
    DataType[DataType["Custom"] = 0] = "Custom";
    DataType[DataType["U8"] = 1] = "U8";
    DataType[DataType["U16"] = 2] = "U16";
    DataType[DataType["U32"] = 3] = "U32";
    DataType[DataType["U64"] = 4] = "U64";
    DataType[DataType["SecKey"] = 5] = "SecKey";
})(DataType || (exports.DataType = DataType = {}));
exports.stackParameters = [
    { id: ParamId.MAC_ADDRESS, type: DataType.U64 },
    { id: ParamId.NWK_PANID, type: DataType.U16 },
    { id: ParamId.STK_PROTOCOL_VERSION, type: DataType.U16 },
    { id: ParamId.NWK_NETWORK_ADDRESS, type: DataType.U16 },
    { id: ParamId.STK_NWK_UPDATE_ID, type: DataType.U8 },
    { id: ParamId.STK_CURRENT_CHANNEL, type: DataType.U8 },
    { id: ParamId.STK_STATIC_NETWORK_ADDRESS, type: DataType.U8 },
    { id: ParamId.STK_PREDEFINED_PANID, type: DataType.U8 },
    { id: ParamId.STK_NETWORK_KEY, type: [DataType.U8, DataType.SecKey], readArg: 1 }, // index, key
    { id: ParamId.STK_LINK_KEY, type: [DataType.U64, DataType.SecKey], readArg: 1 }, // mac addess, key
    { id: ParamId.STK_ENDPOINT, type: DataType.Custom },
    { id: ParamId.DEV_WATCHDOG_TTL, type: DataType.U32 },
    { id: ParamId.STK_PERMIT_JOIN, type: DataType.U8 },
    { id: ParamId.NWK_EXTENDED_PANID, type: DataType.U64 },
    { id: ParamId.APS_CHANNEL_MASK, type: DataType.U32 },
    { id: ParamId.STK_FRAME_COUNTER, type: DataType.U32 },
    { id: ParamId.STK_DEBUG_LOG_LEVEL, type: DataType.U32 },
    { id: ParamId.APS_USE_EXTENDED_PANID, type: DataType.U64 },
    { id: ParamId.APS_TRUST_CENTER_ADDRESS, type: DataType.U64 },
];
exports.default = { PARAM };
//# sourceMappingURL=constants.js.map