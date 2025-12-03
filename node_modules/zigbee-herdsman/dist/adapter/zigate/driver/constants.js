"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZPSNwkKeyState = exports.ZiGateMessageCode = exports.ZDO_REQ_CLUSTER_ID_TO_ZIGATE_COMMAND_ID = exports.ZiGateCommandCode = exports.Status = exports.LogLevel = exports.DeviceType = exports.AddressMode = void 0;
const zdo_1 = require("../../../zspec/zdo");
var AddressMode;
(function (AddressMode) {
    AddressMode[AddressMode["Bound"] = 0] = "Bound";
    AddressMode[AddressMode["Group"] = 1] = "Group";
    AddressMode[AddressMode["Short"] = 2] = "Short";
    AddressMode[AddressMode["Ieee"] = 3] = "Ieee";
    AddressMode[AddressMode["Broadcast"] = 4] = "Broadcast";
    AddressMode[AddressMode["NoTransmit"] = 5] = "NoTransmit";
    AddressMode[AddressMode["BoundNoAck"] = 6] = "BoundNoAck";
    AddressMode[AddressMode["ShortNoAck"] = 7] = "ShortNoAck";
    AddressMode[AddressMode["IeeeNoAck"] = 8] = "IeeeNoAck";
    AddressMode[AddressMode["BoundNonBlocking"] = 9] = "BoundNonBlocking";
    AddressMode[AddressMode["BoundNonBlockingNoAck"] = 10] = "BoundNonBlockingNoAck";
})(AddressMode || (exports.AddressMode = AddressMode = {}));
var DeviceType;
(function (DeviceType) {
    DeviceType[DeviceType["Coordinator"] = 0] = "Coordinator";
    DeviceType[DeviceType["Router"] = 1] = "Router";
    DeviceType[DeviceType["LegacyRouter"] = 2] = "LegacyRouter";
})(DeviceType || (exports.DeviceType = DeviceType = {}));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["EMERG"] = 0] = "EMERG";
    LogLevel[LogLevel["ALERT"] = 1] = "ALERT";
    LogLevel[LogLevel["CRIT "] = 2] = "CRIT ";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["WARN "] = 4] = "WARN ";
    LogLevel[LogLevel["NOT  "] = 5] = "NOT  ";
    LogLevel[LogLevel["INFO "] = 6] = "INFO ";
    LogLevel[LogLevel["DEBUG"] = 7] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
var Status;
(function (Status) {
    Status[Status["E_SL_MSG_STATUS_SUCCESS"] = 0] = "E_SL_MSG_STATUS_SUCCESS";
    Status[Status["E_SL_MSG_STATUS_INCORRECT_PARAMETERS"] = 1] = "E_SL_MSG_STATUS_INCORRECT_PARAMETERS";
    Status[Status["E_SL_MSG_STATUS_UNHANDLED_COMMAND"] = 2] = "E_SL_MSG_STATUS_UNHANDLED_COMMAND";
    Status[Status["E_SL_MSG_STATUS_BUSY"] = 3] = "E_SL_MSG_STATUS_BUSY";
    Status[Status["E_SL_MSG_STATUS_STACK_ALREADY_STARTED"] = 4] = "E_SL_MSG_STATUS_STACK_ALREADY_STARTED";
})(Status || (exports.Status = Status = {}));
var ZiGateCommandCode;
(function (ZiGateCommandCode) {
    ZiGateCommandCode[ZiGateCommandCode["GetNetworkState"] = 9] = "GetNetworkState";
    ZiGateCommandCode[ZiGateCommandCode["RawMode"] = 2] = "RawMode";
    ZiGateCommandCode[ZiGateCommandCode["SetExtendedPANID"] = 32] = "SetExtendedPANID";
    ZiGateCommandCode[ZiGateCommandCode["SetChannelMask"] = 33] = "SetChannelMask";
    ZiGateCommandCode[ZiGateCommandCode["GetVersion"] = 16] = "GetVersion";
    ZiGateCommandCode[ZiGateCommandCode["Reset"] = 17] = "Reset";
    ZiGateCommandCode[ZiGateCommandCode["ErasePersistentData"] = 18] = "ErasePersistentData";
    ZiGateCommandCode[ZiGateCommandCode["RemoveDevice"] = 38] = "RemoveDevice";
    ZiGateCommandCode[ZiGateCommandCode["RawAPSDataRequest"] = 1328] = "RawAPSDataRequest";
    ZiGateCommandCode[ZiGateCommandCode["GetTimeServer"] = 23] = "GetTimeServer";
    ZiGateCommandCode[ZiGateCommandCode["SetTimeServer"] = 22] = "SetTimeServer";
    ZiGateCommandCode[ZiGateCommandCode["PermitJoinStatus"] = 20] = "PermitJoinStatus";
    ZiGateCommandCode[ZiGateCommandCode["GetDevicesList"] = 21] = "GetDevicesList";
    ZiGateCommandCode[ZiGateCommandCode["StartNetwork"] = 36] = "StartNetwork";
    ZiGateCommandCode[ZiGateCommandCode["StartNetworkScan"] = 37] = "StartNetworkScan";
    ZiGateCommandCode[ZiGateCommandCode["SetCertification"] = 25] = "SetCertification";
    // ResetFactoryNew = 0x0013,
    ZiGateCommandCode[ZiGateCommandCode["OnOff"] = 146] = "OnOff";
    ZiGateCommandCode[ZiGateCommandCode["OnOffTimed"] = 147] = "OnOffTimed";
    ZiGateCommandCode[ZiGateCommandCode["AttributeDiscovery"] = 320] = "AttributeDiscovery";
    ZiGateCommandCode[ZiGateCommandCode["AttributeRead"] = 256] = "AttributeRead";
    ZiGateCommandCode[ZiGateCommandCode["AttributeWrite"] = 272] = "AttributeWrite";
    ZiGateCommandCode[ZiGateCommandCode["DescriptorComplex"] = 1329] = "DescriptorComplex";
    // zdo
    ZiGateCommandCode[ZiGateCommandCode["Bind"] = 48] = "Bind";
    ZiGateCommandCode[ZiGateCommandCode["UnBind"] = 49] = "UnBind";
    ZiGateCommandCode[ZiGateCommandCode["NwkAddress"] = 64] = "NwkAddress";
    ZiGateCommandCode[ZiGateCommandCode["IEEEAddress"] = 65] = "IEEEAddress";
    ZiGateCommandCode[ZiGateCommandCode["NodeDescriptor"] = 66] = "NodeDescriptor";
    ZiGateCommandCode[ZiGateCommandCode["SimpleDescriptor"] = 67] = "SimpleDescriptor";
    ZiGateCommandCode[ZiGateCommandCode["PowerDescriptor"] = 68] = "PowerDescriptor";
    ZiGateCommandCode[ZiGateCommandCode["ActiveEndpoint"] = 69] = "ActiveEndpoint";
    ZiGateCommandCode[ZiGateCommandCode["MatchDescriptor"] = 70] = "MatchDescriptor";
    // ManagementLeaveRequest = 0x0047, XXX: some non-standard form of LeaveRequest?
    ZiGateCommandCode[ZiGateCommandCode["PermitJoin"] = 73] = "PermitJoin";
    ZiGateCommandCode[ZiGateCommandCode["ManagementNetworkUpdate"] = 74] = "ManagementNetworkUpdate";
    ZiGateCommandCode[ZiGateCommandCode["SystemServerDiscovery"] = 75] = "SystemServerDiscovery";
    ZiGateCommandCode[ZiGateCommandCode["LeaveRequest"] = 76] = "LeaveRequest";
    ZiGateCommandCode[ZiGateCommandCode["ManagementLQI"] = 78] = "ManagementLQI";
    // ManagementRtg = 0x004?,
    // ManagementBind = 0x004?,
    ZiGateCommandCode[ZiGateCommandCode["SetDeviceType"] = 35] = "SetDeviceType";
    ZiGateCommandCode[ZiGateCommandCode["LED"] = 24] = "LED";
    ZiGateCommandCode[ZiGateCommandCode["SetTXpower"] = 2054] = "SetTXpower";
    ZiGateCommandCode[ZiGateCommandCode["SetSecurityStateKey"] = 34] = "SetSecurityStateKey";
    ZiGateCommandCode[ZiGateCommandCode["AddGroup"] = 96] = "AddGroup";
})(ZiGateCommandCode || (exports.ZiGateCommandCode = ZiGateCommandCode = {}));
exports.ZDO_REQ_CLUSTER_ID_TO_ZIGATE_COMMAND_ID = {
    [zdo_1.ClusterId.NETWORK_ADDRESS_REQUEST]: ZiGateCommandCode.NwkAddress,
    [zdo_1.ClusterId.IEEE_ADDRESS_REQUEST]: ZiGateCommandCode.IEEEAddress,
    [zdo_1.ClusterId.NODE_DESCRIPTOR_REQUEST]: ZiGateCommandCode.NodeDescriptor,
    [zdo_1.ClusterId.POWER_DESCRIPTOR_REQUEST]: ZiGateCommandCode.PowerDescriptor,
    [zdo_1.ClusterId.SIMPLE_DESCRIPTOR_REQUEST]: ZiGateCommandCode.SimpleDescriptor,
    [zdo_1.ClusterId.MATCH_DESCRIPTORS_REQUEST]: ZiGateCommandCode.MatchDescriptor,
    [zdo_1.ClusterId.ACTIVE_ENDPOINTS_REQUEST]: ZiGateCommandCode.ActiveEndpoint,
    [zdo_1.ClusterId.SYSTEM_SERVER_DISCOVERY_REQUEST]: ZiGateCommandCode.SystemServerDiscovery,
    [zdo_1.ClusterId.BIND_REQUEST]: ZiGateCommandCode.Bind,
    [zdo_1.ClusterId.UNBIND_REQUEST]: ZiGateCommandCode.UnBind,
    [zdo_1.ClusterId.LQI_TABLE_REQUEST]: ZiGateCommandCode.ManagementLQI,
    // [ZdoClusterId.ROUTING_TABLE_REQUEST]: ZiGateCommandCode.ManagementRtg,
    // [ZdoClusterId.BINDING_TABLE_REQUEST]: ZiGateCommandCode.ManagementBind,
    [zdo_1.ClusterId.LEAVE_REQUEST]: ZiGateCommandCode.LeaveRequest,
    [zdo_1.ClusterId.NWK_UPDATE_REQUEST]: ZiGateCommandCode.ManagementNetworkUpdate,
    [zdo_1.ClusterId.PERMIT_JOINING_REQUEST]: ZiGateCommandCode.PermitJoin,
};
var ZiGateMessageCode;
(function (ZiGateMessageCode) {
    ZiGateMessageCode[ZiGateMessageCode["DeviceAnnounce"] = 77] = "DeviceAnnounce";
    ZiGateMessageCode[ZiGateMessageCode["Status"] = 32768] = "Status";
    ZiGateMessageCode[ZiGateMessageCode["LOG"] = 32769] = "LOG";
    ZiGateMessageCode[ZiGateMessageCode["DataIndication"] = 32770] = "DataIndication";
    ZiGateMessageCode[ZiGateMessageCode["NodeClusterList"] = 32771] = "NodeClusterList";
    ZiGateMessageCode[ZiGateMessageCode["NodeAttributeList"] = 32772] = "NodeAttributeList";
    ZiGateMessageCode[ZiGateMessageCode["NodeCommandIDList"] = 32773] = "NodeCommandIDList";
    ZiGateMessageCode[ZiGateMessageCode["SimpleDescriptorResponse"] = 32835] = "SimpleDescriptorResponse";
    ZiGateMessageCode[ZiGateMessageCode["NetworkState"] = 32777] = "NetworkState";
    ZiGateMessageCode[ZiGateMessageCode["VersionList"] = 32784] = "VersionList";
    ZiGateMessageCode[ZiGateMessageCode["APSDataACK"] = 32785] = "APSDataACK";
    ZiGateMessageCode[ZiGateMessageCode["APSDataConfirm"] = 32786] = "APSDataConfirm";
    ZiGateMessageCode[ZiGateMessageCode["APSDataConfirmFailed"] = 34562] = "APSDataConfirmFailed";
    ZiGateMessageCode[ZiGateMessageCode["NetworkJoined"] = 32804] = "NetworkJoined";
    ZiGateMessageCode[ZiGateMessageCode["LeaveIndication"] = 32840] = "LeaveIndication";
    ZiGateMessageCode[ZiGateMessageCode["RouterDiscoveryConfirm"] = 34561] = "RouterDiscoveryConfirm";
    ZiGateMessageCode[ZiGateMessageCode["PermitJoinStatus"] = 32788] = "PermitJoinStatus";
    ZiGateMessageCode[ZiGateMessageCode["GetTimeServer"] = 32791] = "GetTimeServer";
    ZiGateMessageCode[ZiGateMessageCode["ManagementLQIResponse"] = 32846] = "ManagementLQIResponse";
    ZiGateMessageCode[ZiGateMessageCode["ManagementLeaveResponse"] = 32839] = "ManagementLeaveResponse";
    ZiGateMessageCode[ZiGateMessageCode["PDMEvent"] = 32821] = "PDMEvent";
    ZiGateMessageCode[ZiGateMessageCode["PDMLoaded"] = 770] = "PDMLoaded";
    ZiGateMessageCode[ZiGateMessageCode["RestartNonFactoryNew"] = 32774] = "RestartNonFactoryNew";
    ZiGateMessageCode[ZiGateMessageCode["RestartFactoryNew"] = 32775] = "RestartFactoryNew";
    ZiGateMessageCode[ZiGateMessageCode["ExtendedStatusCallBack"] = 39321] = "ExtendedStatusCallBack";
    ZiGateMessageCode[ZiGateMessageCode["AddGroupResponse"] = 32864] = "AddGroupResponse";
})(ZiGateMessageCode || (exports.ZiGateMessageCode = ZiGateMessageCode = {}));
var ZPSNwkKeyState;
(function (ZPSNwkKeyState) {
    ZPSNwkKeyState[ZPSNwkKeyState["ZPS_ZDO_NO_NETWORK_KEY"] = 0] = "ZPS_ZDO_NO_NETWORK_KEY";
    ZPSNwkKeyState[ZPSNwkKeyState["ZPS_ZDO_PRECONFIGURED_LINK_KEY"] = 1] = "ZPS_ZDO_PRECONFIGURED_LINK_KEY";
    ZPSNwkKeyState[ZPSNwkKeyState["ZPS_ZDO_DISTRIBUTED_LINK_KEY"] = 2] = "ZPS_ZDO_DISTRIBUTED_LINK_KEY";
    ZPSNwkKeyState[ZPSNwkKeyState["ZPS_ZDO_PRECONFIGURED_INSTALLATION_CODE"] = 3] = "ZPS_ZDO_PRECONFIGURED_INSTALLATION_CODE";
})(ZPSNwkKeyState || (exports.ZPSNwkKeyState = ZPSNwkKeyState = {}));
//# sourceMappingURL=constants.js.map