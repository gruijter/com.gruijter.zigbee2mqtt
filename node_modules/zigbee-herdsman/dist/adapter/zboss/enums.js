"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceUpdateTCAction = exports.DeviceUpdateStatus = exports.DeviceAuthorizedSECBKEStatus = exports.DeviceAuthorizedR21TCLKStatus = exports.DeviceAuthorizedLegacyStatus = exports.DeviceAuthorizedType = exports.BuffaloZBOSSDataType = exports.PolicyType = exports.ResetSource = exports.ResetOptions = exports.CommandId = exports.DeviceType = exports.EspNCPSecur = exports.NetworkState = exports.StatusCodeCBKE = exports.StatusCodeAPS = exports.StatusCodeGeneric = exports.StatusCategory = void 0;
var StatusCategory;
(function (StatusCategory) {
    StatusCategory[StatusCategory["GENERIC"] = 0] = "GENERIC";
    StatusCategory[StatusCategory["MAC"] = 2] = "MAC";
    StatusCategory[StatusCategory["NWK"] = 3] = "NWK";
    StatusCategory[StatusCategory["APS"] = 4] = "APS";
    StatusCategory[StatusCategory["ZDO"] = 5] = "ZDO";
    StatusCategory[StatusCategory["CBKE"] = 6] = "CBKE";
})(StatusCategory || (exports.StatusCategory = StatusCategory = {}));
var StatusCodeGeneric;
(function (StatusCodeGeneric) {
    StatusCodeGeneric[StatusCodeGeneric["OK"] = 0] = "OK";
    StatusCodeGeneric[StatusCodeGeneric["ERROR"] = 1] = "ERROR";
    StatusCodeGeneric[StatusCodeGeneric["BLOCKED"] = 2] = "BLOCKED";
    StatusCodeGeneric[StatusCodeGeneric["EXIT"] = 3] = "EXIT";
    StatusCodeGeneric[StatusCodeGeneric["BUSY"] = 4] = "BUSY";
    StatusCodeGeneric[StatusCodeGeneric["EOF"] = 5] = "EOF";
    StatusCodeGeneric[StatusCodeGeneric["OUT_OF_RANGE"] = 6] = "OUT_OF_RANGE";
    StatusCodeGeneric[StatusCodeGeneric["EMPTY"] = 7] = "EMPTY";
    StatusCodeGeneric[StatusCodeGeneric["CANCELLED"] = 8] = "CANCELLED";
    StatusCodeGeneric[StatusCodeGeneric["INVALID_PARAMETER_1"] = 10] = "INVALID_PARAMETER_1";
    StatusCodeGeneric[StatusCodeGeneric["INVALID_PARAMETER_2"] = 11] = "INVALID_PARAMETER_2";
    StatusCodeGeneric[StatusCodeGeneric["INVALID_PARAMETER_3"] = 12] = "INVALID_PARAMETER_3";
    StatusCodeGeneric[StatusCodeGeneric["INVALID_PARAMETER_4"] = 13] = "INVALID_PARAMETER_4";
    StatusCodeGeneric[StatusCodeGeneric["INVALID_PARAMETER_5"] = 14] = "INVALID_PARAMETER_5";
    StatusCodeGeneric[StatusCodeGeneric["INVALID_PARAMETER_6"] = 15] = "INVALID_PARAMETER_6";
    StatusCodeGeneric[StatusCodeGeneric["INVALID_PARAMETER_7"] = 16] = "INVALID_PARAMETER_7";
    StatusCodeGeneric[StatusCodeGeneric["INVALID_PARAMETER_8"] = 17] = "INVALID_PARAMETER_8";
    StatusCodeGeneric[StatusCodeGeneric["INVALID_PARAMETER_9"] = 18] = "INVALID_PARAMETER_9";
    StatusCodeGeneric[StatusCodeGeneric["INVALID_PARAMETER_10"] = 19] = "INVALID_PARAMETER_10";
    StatusCodeGeneric[StatusCodeGeneric["INVALID_PARAMETER_11_OR_MORE"] = 20] = "INVALID_PARAMETER_11_OR_MORE";
    StatusCodeGeneric[StatusCodeGeneric["PENDING"] = 21] = "PENDING";
    StatusCodeGeneric[StatusCodeGeneric["NO_MEMORY"] = 22] = "NO_MEMORY";
    StatusCodeGeneric[StatusCodeGeneric["INVALID_PARAMETER"] = 23] = "INVALID_PARAMETER";
    StatusCodeGeneric[StatusCodeGeneric["OPERATION_FAILED"] = 24] = "OPERATION_FAILED";
    StatusCodeGeneric[StatusCodeGeneric["BUFFER_TOO_SMALL"] = 25] = "BUFFER_TOO_SMALL";
    StatusCodeGeneric[StatusCodeGeneric["END_OF_LIST"] = 26] = "END_OF_LIST";
    StatusCodeGeneric[StatusCodeGeneric["ALREADY_EXISTS"] = 27] = "ALREADY_EXISTS";
    StatusCodeGeneric[StatusCodeGeneric["NOT_FOUND"] = 28] = "NOT_FOUND";
    StatusCodeGeneric[StatusCodeGeneric["OVERFLOW"] = 29] = "OVERFLOW";
    StatusCodeGeneric[StatusCodeGeneric["TIMEOUT"] = 30] = "TIMEOUT";
    StatusCodeGeneric[StatusCodeGeneric["NOT_IMPLEMENTED"] = 31] = "NOT_IMPLEMENTED";
    StatusCodeGeneric[StatusCodeGeneric["NO_RESOURCES"] = 32] = "NO_RESOURCES";
    StatusCodeGeneric[StatusCodeGeneric["UNINITIALIZED"] = 33] = "UNINITIALIZED";
    StatusCodeGeneric[StatusCodeGeneric["NO_SERVER"] = 34] = "NO_SERVER";
    StatusCodeGeneric[StatusCodeGeneric["INVALID_STATE"] = 35] = "INVALID_STATE";
    StatusCodeGeneric[StatusCodeGeneric["CONNECTION_FAILED"] = 37] = "CONNECTION_FAILED";
    StatusCodeGeneric[StatusCodeGeneric["CONNECTION_LOST"] = 38] = "CONNECTION_LOST";
    StatusCodeGeneric[StatusCodeGeneric["UNAUTHORIZED"] = 40] = "UNAUTHORIZED";
    StatusCodeGeneric[StatusCodeGeneric["CONFLICT"] = 41] = "CONFLICT";
    StatusCodeGeneric[StatusCodeGeneric["INVALID_FORMAT"] = 42] = "INVALID_FORMAT";
    StatusCodeGeneric[StatusCodeGeneric["NO_MATCH"] = 43] = "NO_MATCH";
    StatusCodeGeneric[StatusCodeGeneric["PROTOCOL_ERROR"] = 44] = "PROTOCOL_ERROR";
    StatusCodeGeneric[StatusCodeGeneric["VERSION"] = 45] = "VERSION";
    StatusCodeGeneric[StatusCodeGeneric["MALFORMED_ADDRESS"] = 46] = "MALFORMED_ADDRESS";
    StatusCodeGeneric[StatusCodeGeneric["COULD_NOT_READ_FILE"] = 47] = "COULD_NOT_READ_FILE";
    StatusCodeGeneric[StatusCodeGeneric["FILE_NOT_FOUND"] = 48] = "FILE_NOT_FOUND";
    StatusCodeGeneric[StatusCodeGeneric["DIRECTORY_NOT_FOUND"] = 49] = "DIRECTORY_NOT_FOUND";
    StatusCodeGeneric[StatusCodeGeneric["CONVERSION_ERROR"] = 50] = "CONVERSION_ERROR";
    StatusCodeGeneric[StatusCodeGeneric["INCOMPATIBLE_TYPES"] = 51] = "INCOMPATIBLE_TYPES";
    StatusCodeGeneric[StatusCodeGeneric["FILE_CORRUPTED"] = 56] = "FILE_CORRUPTED";
    StatusCodeGeneric[StatusCodeGeneric["PAGE_NOT_FOUND"] = 57] = "PAGE_NOT_FOUND";
    StatusCodeGeneric[StatusCodeGeneric["ILLEGAL_REQUEST"] = 62] = "ILLEGAL_REQUEST";
    StatusCodeGeneric[StatusCodeGeneric["INVALID_GROUP"] = 64] = "INVALID_GROUP";
    StatusCodeGeneric[StatusCodeGeneric["TABLE_FULL"] = 65] = "TABLE_FULL";
    StatusCodeGeneric[StatusCodeGeneric["IGNORE"] = 69] = "IGNORE";
    StatusCodeGeneric[StatusCodeGeneric["AGAIN"] = 70] = "AGAIN";
    StatusCodeGeneric[StatusCodeGeneric["DEVICE_NOT_FOUND"] = 71] = "DEVICE_NOT_FOUND";
    StatusCodeGeneric[StatusCodeGeneric["OBSOLETE"] = 72] = "OBSOLETE";
})(StatusCodeGeneric || (exports.StatusCodeGeneric = StatusCodeGeneric = {}));
var StatusCodeAPS;
(function (StatusCodeAPS) {
    // A request has been executed successfully.
    StatusCodeAPS[StatusCodeAPS["SUCCESS"] = 0] = "SUCCESS";
    // A transmit request failed since the ASDU is too large and fragmentation is not supported.
    StatusCodeAPS[StatusCodeAPS["ASDU_TOO_LONG"] = 160] = "ASDU_TOO_LONG";
    // A received fragmented frame could not be defragmented at the current time.
    StatusCodeAPS[StatusCodeAPS["DEFRAG_DEFERRED"] = 161] = "DEFRAG_DEFERRED";
    // A received fragmented frame could not be defragmented since the device does not support fragmentation.
    StatusCodeAPS[StatusCodeAPS["DEFRAG_UNSUPPORTED"] = 162] = "DEFRAG_UNSUPPORTED";
    // A parameter value was out of range.
    StatusCodeAPS[StatusCodeAPS["ILLEGAL_REQUEST"] = 163] = "ILLEGAL_REQUEST";
    // An APSME-UNBIND.request failed due to the requested binding link not existing in the binding table.
    StatusCodeAPS[StatusCodeAPS["INVALID_BINDING"] = 164] = "INVALID_BINDING";
    // An APSME-REMOVE-GROUP.request has been issued with a group identifier that does not appear in the group table.
    StatusCodeAPS[StatusCodeAPS["INVALID_GROUP"] = 165] = "INVALID_GROUP";
    // A parameter value was invalid or out of range.
    StatusCodeAPS[StatusCodeAPS["INVALID_PARAMETER"] = 166] = "INVALID_PARAMETER";
    // An APSDE-DATA.request requesting acknowledged trans- mission failed due to no acknowledgement being received.
    StatusCodeAPS[StatusCodeAPS["NO_ACK"] = 167] = "NO_ACK";
    // An APSDE-DATA.request with a destination addressing mode set to 0x00 failed due to there being no devices bound to this device.
    StatusCodeAPS[StatusCodeAPS["NO_BOUND_DEVICE"] = 168] = "NO_BOUND_DEVICE";
    // An APSDE-DATA.request with a destination addressing mode set to 0x03 failed due to no corresponding short address found in the address map table.
    StatusCodeAPS[StatusCodeAPS["NO_SHORT_ADDRESS"] = 169] = "NO_SHORT_ADDRESS";
    // An APSDE-DATA.request with a destination addressing mode set to 0x00 failed due to a binding table not being supported on the device.
    StatusCodeAPS[StatusCodeAPS["NOT_SUPPORTED"] = 170] = "NOT_SUPPORTED";
    // An ASDU was received that was secured using a link key.
    StatusCodeAPS[StatusCodeAPS["SECURED_LINK_KEY"] = 171] = "SECURED_LINK_KEY";
    // An ASDU was received that was secured using a network key.
    StatusCodeAPS[StatusCodeAPS["SECURED_NWK_KEY"] = 172] = "SECURED_NWK_KEY";
    // An APSDE-DATA.request requesting security has resulted in an error during the corresponding security processing.
    StatusCodeAPS[StatusCodeAPS["SECURITY_FAIL"] = 173] = "SECURITY_FAIL";
    // An APSME-BIND.request or APSME.ADD-GROUP.request issued when the binding or group tables, respectively, were full.
    StatusCodeAPS[StatusCodeAPS["TABLE_FULL"] = 174] = "TABLE_FULL";
    // An ASDU was received without any security.
    StatusCodeAPS[StatusCodeAPS["UNSECURED"] = 175] = "UNSECURED";
    // An APSME-GET.request or APSME-SET.request has been issued with an unknown attribute identifier.
    StatusCodeAPS[StatusCodeAPS["UNSUPPORTED_ATTRIBUTE"] = 176] = "UNSUPPORTED_ATTRIBUTE";
})(StatusCodeAPS || (exports.StatusCodeAPS = StatusCodeAPS = {}));
var StatusCodeCBKE;
(function (StatusCodeCBKE) {
    // The Issuer field within the key establishment partner's certificate is unknown to the sending device
    StatusCodeCBKE[StatusCodeCBKE["UNKNOWN_ISSUER"] = 1] = "UNKNOWN_ISSUER";
    // The device could not confirm that it shares the same key with the corresponding device
    StatusCodeCBKE[StatusCodeCBKE["BAD_KEY_CONFIRM"] = 2] = "BAD_KEY_CONFIRM";
    // The device received a bad message from the corresponding device
    StatusCodeCBKE[StatusCodeCBKE["BAD_MESSAGE"] = 3] = "BAD_MESSAGE";
    // The device does not currently have the internal resources necessary to perform key establishment
    StatusCodeCBKE[StatusCodeCBKE["NO_RESOURCES"] = 4] = "NO_RESOURCES";
    // The device does not support the specified key establishment suite in the partner's Initiate Key Establishment message
    StatusCodeCBKE[StatusCodeCBKE["UNSUPPORTED_SUITE"] = 5] = "UNSUPPORTED_SUITE";
    // The received certificate specifies a type, curve, hash, or other parameter that is either unsupported by the device or invalid
    StatusCodeCBKE[StatusCodeCBKE["INVALID_CERTIFICATE"] = 6] = "INVALID_CERTIFICATE";
    // Non-standard ZBOSS extension: SE KE endpoint not found
    StatusCodeCBKE[StatusCodeCBKE["NO_KE_EP"] = 7] = "NO_KE_EP";
})(StatusCodeCBKE || (exports.StatusCodeCBKE = StatusCodeCBKE = {}));
/**
 * Enum of the network state
 */
var NetworkState;
(function (NetworkState) {
    NetworkState[NetworkState["OFFLINE"] = 0] = "OFFLINE"; /*!< The network is offline */
    NetworkState[NetworkState["JOINING"] = 1] = "JOINING"; /*!< Joinging the network */
    NetworkState[NetworkState["CONNECTED"] = 2] = "CONNECTED"; /*!< Conneted with the network */
    NetworkState[NetworkState["LEAVING"] = 3] = "LEAVING"; /*!< Leaving the network */
    NetworkState[NetworkState["CONFIRM"] = 4] = "CONFIRM"; /*!< Confirm the APS */
    NetworkState[NetworkState["INDICATION"] = 5] = "INDICATION"; /*!< Indication the APS */
})(NetworkState || (exports.NetworkState = NetworkState = {}));
/**
 * Enum of the network security mode
 */
var EspNCPSecur;
(function (EspNCPSecur) {
    EspNCPSecur[EspNCPSecur["ESP_NCP_NO_SECURITY"] = 0] = "ESP_NCP_NO_SECURITY"; /*!< The network is no security mode */
    EspNCPSecur[EspNCPSecur["ESP_NCP_PRECONFIGURED_NETWORK_KEY"] = 1] = "ESP_NCP_PRECONFIGURED_NETWORK_KEY"; /*!< Pre-configured the network key */
    EspNCPSecur[EspNCPSecur["ESP_NCP_NETWORK_KEY_FROM_TC"] = 2] = "ESP_NCP_NETWORK_KEY_FROM_TC";
    EspNCPSecur[EspNCPSecur["ESP_NCP_ONLY_TCLK"] = 3] = "ESP_NCP_ONLY_TCLK";
})(EspNCPSecur || (exports.EspNCPSecur = EspNCPSecur = {}));
var DeviceType;
(function (DeviceType) {
    DeviceType[DeviceType["COORDINATOR"] = 0] = "COORDINATOR";
    DeviceType[DeviceType["ROUTER"] = 1] = "ROUTER";
    DeviceType[DeviceType["ED"] = 2] = "ED";
    DeviceType[DeviceType["NONE"] = 3] = "NONE";
})(DeviceType || (exports.DeviceType = DeviceType = {}));
var CommandId;
(function (CommandId) {
    // NCP config
    CommandId[CommandId["GET_MODULE_VERSION"] = 1] = "GET_MODULE_VERSION";
    CommandId[CommandId["NCP_RESET"] = 2] = "NCP_RESET";
    CommandId[CommandId["GET_ZIGBEE_ROLE"] = 4] = "GET_ZIGBEE_ROLE";
    CommandId[CommandId["SET_ZIGBEE_ROLE"] = 5] = "SET_ZIGBEE_ROLE";
    CommandId[CommandId["GET_ZIGBEE_CHANNEL_MASK"] = 6] = "GET_ZIGBEE_CHANNEL_MASK";
    CommandId[CommandId["SET_ZIGBEE_CHANNEL_MASK"] = 7] = "SET_ZIGBEE_CHANNEL_MASK";
    CommandId[CommandId["GET_ZIGBEE_CHANNEL"] = 8] = "GET_ZIGBEE_CHANNEL";
    CommandId[CommandId["GET_PAN_ID"] = 9] = "GET_PAN_ID";
    CommandId[CommandId["SET_PAN_ID"] = 10] = "SET_PAN_ID";
    CommandId[CommandId["GET_LOCAL_IEEE_ADDR"] = 11] = "GET_LOCAL_IEEE_ADDR";
    CommandId[CommandId["SET_LOCAL_IEEE_ADDR"] = 12] = "SET_LOCAL_IEEE_ADDR";
    CommandId[CommandId["GET_TX_POWER"] = 16] = "GET_TX_POWER";
    CommandId[CommandId["SET_TX_POWER"] = 17] = "SET_TX_POWER";
    CommandId[CommandId["GET_RX_ON_WHEN_IDLE"] = 18] = "GET_RX_ON_WHEN_IDLE";
    CommandId[CommandId["SET_RX_ON_WHEN_IDLE"] = 19] = "SET_RX_ON_WHEN_IDLE";
    CommandId[CommandId["GET_JOINED"] = 20] = "GET_JOINED";
    CommandId[CommandId["GET_AUTHENTICATED"] = 21] = "GET_AUTHENTICATED";
    CommandId[CommandId["GET_ED_TIMEOUT"] = 22] = "GET_ED_TIMEOUT";
    CommandId[CommandId["SET_ED_TIMEOUT"] = 23] = "SET_ED_TIMEOUT";
    CommandId[CommandId["SET_NWK_KEY"] = 27] = "SET_NWK_KEY";
    CommandId[CommandId["GET_NWK_KEYS"] = 30] = "GET_NWK_KEYS";
    CommandId[CommandId["GET_APS_KEY_BY_IEEE"] = 31] = "GET_APS_KEY_BY_IEEE";
    CommandId[CommandId["GET_PARENT_ADDRESS"] = 34] = "GET_PARENT_ADDRESS";
    CommandId[CommandId["GET_EXTENDED_PAN_ID"] = 35] = "GET_EXTENDED_PAN_ID";
    CommandId[CommandId["GET_COORDINATOR_VERSION"] = 36] = "GET_COORDINATOR_VERSION";
    CommandId[CommandId["GET_SHORT_ADDRESS"] = 37] = "GET_SHORT_ADDRESS";
    CommandId[CommandId["GET_TRUST_CENTER_ADDRESS"] = 38] = "GET_TRUST_CENTER_ADDRESS";
    CommandId[CommandId["NCP_RESET_IND"] = 43] = "NCP_RESET_IND";
    CommandId[CommandId["NVRAM_WRITE"] = 46] = "NVRAM_WRITE";
    CommandId[CommandId["NVRAM_READ"] = 47] = "NVRAM_READ";
    CommandId[CommandId["NVRAM_ERASE"] = 48] = "NVRAM_ERASE";
    CommandId[CommandId["NVRAM_CLEAR"] = 49] = "NVRAM_CLEAR";
    CommandId[CommandId["SET_TC_POLICY"] = 50] = "SET_TC_POLICY";
    CommandId[CommandId["SET_EXTENDED_PAN_ID"] = 51] = "SET_EXTENDED_PAN_ID";
    CommandId[CommandId["SET_MAX_CHILDREN"] = 52] = "SET_MAX_CHILDREN";
    CommandId[CommandId["GET_MAX_CHILDREN"] = 53] = "GET_MAX_CHILDREN";
    // Application Framework
    CommandId[CommandId["AF_SET_SIMPLE_DESC"] = 257] = "AF_SET_SIMPLE_DESC";
    CommandId[CommandId["AF_DEL_SIMPLE_DESC"] = 258] = "AF_DEL_SIMPLE_DESC";
    CommandId[CommandId["AF_SET_NODE_DESC"] = 259] = "AF_SET_NODE_DESC";
    CommandId[CommandId["AF_SET_POWER_DESC"] = 260] = "AF_SET_POWER_DESC";
    // Zigbee Device Object
    CommandId[CommandId["ZDO_NWK_ADDR_REQ"] = 513] = "ZDO_NWK_ADDR_REQ";
    CommandId[CommandId["ZDO_IEEE_ADDR_REQ"] = 514] = "ZDO_IEEE_ADDR_REQ";
    CommandId[CommandId["ZDO_POWER_DESC_REQ"] = 515] = "ZDO_POWER_DESC_REQ";
    CommandId[CommandId["ZDO_NODE_DESC_REQ"] = 516] = "ZDO_NODE_DESC_REQ";
    CommandId[CommandId["ZDO_SIMPLE_DESC_REQ"] = 517] = "ZDO_SIMPLE_DESC_REQ";
    CommandId[CommandId["ZDO_ACTIVE_EP_REQ"] = 518] = "ZDO_ACTIVE_EP_REQ";
    CommandId[CommandId["ZDO_MATCH_DESC_REQ"] = 519] = "ZDO_MATCH_DESC_REQ";
    CommandId[CommandId["ZDO_BIND_REQ"] = 520] = "ZDO_BIND_REQ";
    CommandId[CommandId["ZDO_UNBIND_REQ"] = 521] = "ZDO_UNBIND_REQ";
    CommandId[CommandId["ZDO_MGMT_LEAVE_REQ"] = 522] = "ZDO_MGMT_LEAVE_REQ";
    CommandId[CommandId["ZDO_PERMIT_JOINING_REQ"] = 523] = "ZDO_PERMIT_JOINING_REQ";
    CommandId[CommandId["ZDO_DEV_ANNCE_IND"] = 524] = "ZDO_DEV_ANNCE_IND";
    CommandId[CommandId["ZDO_REJOIN"] = 525] = "ZDO_REJOIN";
    CommandId[CommandId["ZDO_SYSTEM_SRV_DISCOVERY_REQ"] = 526] = "ZDO_SYSTEM_SRV_DISCOVERY_REQ";
    CommandId[CommandId["ZDO_MGMT_BIND_REQ"] = 527] = "ZDO_MGMT_BIND_REQ";
    CommandId[CommandId["ZDO_MGMT_LQI_REQ"] = 528] = "ZDO_MGMT_LQI_REQ";
    // ZDO_MGMT_RTG_REQ = 0x0???,
    CommandId[CommandId["ZDO_MGMT_NWK_UPDATE_REQ"] = 529] = "ZDO_MGMT_NWK_UPDATE_REQ";
    CommandId[CommandId["ZDO_GET_STATS"] = 531] = "ZDO_GET_STATS";
    CommandId[CommandId["ZDO_DEV_AUTHORIZED_IND"] = 532] = "ZDO_DEV_AUTHORIZED_IND";
    CommandId[CommandId["ZDO_DEV_UPDATE_IND"] = 533] = "ZDO_DEV_UPDATE_IND";
    CommandId[CommandId["ZDO_SET_NODE_DESC_MANUF_CODE"] = 534] = "ZDO_SET_NODE_DESC_MANUF_CODE";
    // Application Support Sub-layer
    CommandId[CommandId["APSDE_DATA_REQ"] = 769] = "APSDE_DATA_REQ";
    CommandId[CommandId["APSME_BIND"] = 770] = "APSME_BIND";
    CommandId[CommandId["APSME_UNBIND"] = 771] = "APSME_UNBIND";
    CommandId[CommandId["APSME_ADD_GROUP"] = 772] = "APSME_ADD_GROUP";
    CommandId[CommandId["APSME_RM_GROUP"] = 773] = "APSME_RM_GROUP";
    CommandId[CommandId["APSDE_DATA_IND"] = 774] = "APSDE_DATA_IND";
    CommandId[CommandId["APSME_RM_ALL_GROUPS"] = 775] = "APSME_RM_ALL_GROUPS";
    CommandId[CommandId["APS_CHECK_BINDING"] = 776] = "APS_CHECK_BINDING";
    CommandId[CommandId["APS_GET_GROUP_TABLE"] = 777] = "APS_GET_GROUP_TABLE";
    CommandId[CommandId["APSME_UNBIND_ALL"] = 778] = "APSME_UNBIND_ALL";
    // Network Layer
    CommandId[CommandId["NWK_FORMATION"] = 1025] = "NWK_FORMATION";
    CommandId[CommandId["NWK_DISCOVERY"] = 1026] = "NWK_DISCOVERY";
    CommandId[CommandId["NWK_NLME_JOIN"] = 1027] = "NWK_NLME_JOIN";
    CommandId[CommandId["NWK_PERMIT_JOINING"] = 1028] = "NWK_PERMIT_JOINING";
    CommandId[CommandId["NWK_GET_IEEE_BY_SHORT"] = 1029] = "NWK_GET_IEEE_BY_SHORT";
    CommandId[CommandId["NWK_GET_SHORT_BY_IEEE"] = 1030] = "NWK_GET_SHORT_BY_IEEE";
    CommandId[CommandId["NWK_GET_NEIGHBOR_BY_IEEE"] = 1031] = "NWK_GET_NEIGHBOR_BY_IEEE";
    CommandId[CommandId["NWK_REJOINED_IND"] = 1033] = "NWK_REJOINED_IND";
    CommandId[CommandId["NWK_REJOIN_FAILED_IND"] = 1034] = "NWK_REJOIN_FAILED_IND";
    CommandId[CommandId["NWK_LEAVE_IND"] = 1035] = "NWK_LEAVE_IND";
    CommandId[CommandId["PIM_SET_FAST_POLL_INTERVAL"] = 1038] = "PIM_SET_FAST_POLL_INTERVAL";
    CommandId[CommandId["PIM_SET_LONG_POLL_INTERVAL"] = 1039] = "PIM_SET_LONG_POLL_INTERVAL";
    CommandId[CommandId["PIM_START_FAST_POLL"] = 1040] = "PIM_START_FAST_POLL";
    CommandId[CommandId["PIM_START_LONG_POLL"] = 1041] = "PIM_START_LONG_POLL";
    CommandId[CommandId["PIM_START_POLL"] = 1042] = "PIM_START_POLL";
    CommandId[CommandId["PIM_STOP_FAST_POLL"] = 1044] = "PIM_STOP_FAST_POLL";
    CommandId[CommandId["PIM_STOP_POLL"] = 1045] = "PIM_STOP_POLL";
    CommandId[CommandId["PIM_ENABLE_TURBO_POLL"] = 1046] = "PIM_ENABLE_TURBO_POLL";
    CommandId[CommandId["PIM_DISABLE_TURBO_POLL"] = 1047] = "PIM_DISABLE_TURBO_POLL";
    CommandId[CommandId["NWK_PAN_ID_CONFLICT_RESOLVE"] = 1050] = "NWK_PAN_ID_CONFLICT_RESOLVE";
    CommandId[CommandId["NWK_PAN_ID_CONFLICT_IND"] = 1051] = "NWK_PAN_ID_CONFLICT_IND";
    CommandId[CommandId["NWK_ADDRESS_UPDATE_IND"] = 1052] = "NWK_ADDRESS_UPDATE_IND";
    CommandId[CommandId["NWK_START_WITHOUT_FORMATION"] = 1053] = "NWK_START_WITHOUT_FORMATION";
    CommandId[CommandId["NWK_NLME_ROUTER_START"] = 1054] = "NWK_NLME_ROUTER_START";
    CommandId[CommandId["PARENT_LOST_IND"] = 1056] = "PARENT_LOST_IND";
    CommandId[CommandId["PIM_START_TURBO_POLL_PACKETS"] = 1060] = "PIM_START_TURBO_POLL_PACKETS";
    CommandId[CommandId["PIM_START_TURBO_POLL_CONTINUOUS"] = 1061] = "PIM_START_TURBO_POLL_CONTINUOUS";
    CommandId[CommandId["PIM_TURBO_POLL_CONTINUOUS_LEAVE"] = 1062] = "PIM_TURBO_POLL_CONTINUOUS_LEAVE";
    CommandId[CommandId["PIM_TURBO_POLL_PACKETS_LEAVE"] = 1063] = "PIM_TURBO_POLL_PACKETS_LEAVE";
    CommandId[CommandId["PIM_PERMIT_TURBO_POLL"] = 1064] = "PIM_PERMIT_TURBO_POLL";
    CommandId[CommandId["PIM_SET_FAST_POLL_TIMEOUT"] = 1065] = "PIM_SET_FAST_POLL_TIMEOUT";
    CommandId[CommandId["PIM_GET_LONG_POLL_INTERVAL"] = 1066] = "PIM_GET_LONG_POLL_INTERVAL";
    CommandId[CommandId["PIM_GET_IN_FAST_POLL_FLAG"] = 1067] = "PIM_GET_IN_FAST_POLL_FLAG";
    CommandId[CommandId["SET_KEEPALIVE_MOVE"] = 1068] = "SET_KEEPALIVE_MOVE";
    CommandId[CommandId["START_CONCENTRATOR_MODE"] = 1069] = "START_CONCENTRATOR_MODE";
    CommandId[CommandId["STOP_CONCENTRATOR_MODE"] = 1070] = "STOP_CONCENTRATOR_MODE";
    CommandId[CommandId["NWK_ENABLE_PAN_ID_CONFLICT_RESOLUTION"] = 1071] = "NWK_ENABLE_PAN_ID_CONFLICT_RESOLUTION";
    CommandId[CommandId["NWK_ENABLE_AUTO_PAN_ID_CONFLICT_RESOLUTION"] = 1072] = "NWK_ENABLE_AUTO_PAN_ID_CONFLICT_RESOLUTION";
    CommandId[CommandId["PIM_TURBO_POLL_CANCEL_PACKET"] = 1073] = "PIM_TURBO_POLL_CANCEL_PACKET";
    // Security
    CommandId[CommandId["SECUR_SET_LOCAL_IC"] = 1281] = "SECUR_SET_LOCAL_IC";
    CommandId[CommandId["SECUR_ADD_IC"] = 1282] = "SECUR_ADD_IC";
    CommandId[CommandId["SECUR_DEL_IC"] = 1283] = "SECUR_DEL_IC";
    CommandId[CommandId["SECUR_GET_LOCAL_IC"] = 1293] = "SECUR_GET_LOCAL_IC";
    CommandId[CommandId["SECUR_TCLK_IND"] = 1294] = "SECUR_TCLK_IND";
    CommandId[CommandId["SECUR_TCLK_EXCHANGE_FAILED_IND"] = 1295] = "SECUR_TCLK_EXCHANGE_FAILED_IND";
    CommandId[CommandId["SECUR_NWK_INITIATE_KEY_SWITCH_PROCEDURE"] = 1303] = "SECUR_NWK_INITIATE_KEY_SWITCH_PROCEDURE";
    CommandId[CommandId["SECUR_GET_IC_LIST"] = 1304] = "SECUR_GET_IC_LIST";
    CommandId[CommandId["SECUR_GET_IC_BY_IDX"] = 1305] = "SECUR_GET_IC_BY_IDX";
    CommandId[CommandId["SECUR_REMOVE_ALL_IC"] = 1306] = "SECUR_REMOVE_ALL_IC";
    ///////////////////
    CommandId[CommandId["UNKNOWN_1"] = 2562] = "UNKNOWN_1";
})(CommandId || (exports.CommandId = CommandId = {}));
var ResetOptions;
(function (ResetOptions) {
    ResetOptions[ResetOptions["NoOptions"] = 0] = "NoOptions";
    ResetOptions[ResetOptions["EraseNVRAM"] = 1] = "EraseNVRAM";
    ResetOptions[ResetOptions["FactoryReset"] = 2] = "FactoryReset";
    ResetOptions[ResetOptions["LockReadingKeys"] = 3] = "LockReadingKeys";
})(ResetOptions || (exports.ResetOptions = ResetOptions = {}));
var ResetSource;
(function (ResetSource) {
    ResetSource[ResetSource["RESET_SRC_POWER_ON"] = 0] = "RESET_SRC_POWER_ON";
    ResetSource[ResetSource["RESET_SRC_SW_RESET"] = 1] = "RESET_SRC_SW_RESET";
    ResetSource[ResetSource["RESET_SRC_RESET_PIN"] = 2] = "RESET_SRC_RESET_PIN";
    ResetSource[ResetSource["RESET_SRC_BROWN_OUT"] = 3] = "RESET_SRC_BROWN_OUT";
    ResetSource[ResetSource["RESET_SRC_CLOCK_LOSS"] = 4] = "RESET_SRC_CLOCK_LOSS";
    ResetSource[ResetSource["RESET_SRC_OTHER"] = 5] = "RESET_SRC_OTHER";
})(ResetSource || (exports.ResetSource = ResetSource = {}));
var PolicyType;
(function (PolicyType) {
    PolicyType[PolicyType["LINK_KEY_REQUIRED"] = 0] = "LINK_KEY_REQUIRED";
    PolicyType[PolicyType["IC_REQUIRED"] = 1] = "IC_REQUIRED";
    PolicyType[PolicyType["TC_REJOIN_ENABLED"] = 2] = "TC_REJOIN_ENABLED";
    PolicyType[PolicyType["IGNORE_TC_REJOIN"] = 3] = "IGNORE_TC_REJOIN";
    PolicyType[PolicyType["APS_INSECURE_JOIN"] = 4] = "APS_INSECURE_JOIN";
    PolicyType[PolicyType["DISABLE_NWK_MGMT_CHANNEL_UPDATE"] = 5] = "DISABLE_NWK_MGMT_CHANNEL_UPDATE";
})(PolicyType || (exports.PolicyType = PolicyType = {}));
var BuffaloZBOSSDataType;
(function (BuffaloZBOSSDataType) {
    BuffaloZBOSSDataType[BuffaloZBOSSDataType["LIST_TYPED"] = 3000] = "LIST_TYPED";
    BuffaloZBOSSDataType[BuffaloZBOSSDataType["EXTENDED_PAN_ID"] = 3001] = "EXTENDED_PAN_ID";
})(BuffaloZBOSSDataType || (exports.BuffaloZBOSSDataType = BuffaloZBOSSDataType = {}));
var DeviceAuthorizedType;
(function (DeviceAuthorizedType) {
    DeviceAuthorizedType[DeviceAuthorizedType["LEGACY"] = 0] = "LEGACY";
    DeviceAuthorizedType[DeviceAuthorizedType["R21_TCLK"] = 1] = "R21_TCLK";
    DeviceAuthorizedType[DeviceAuthorizedType["SE_CBKE"] = 2] = "SE_CBKE";
})(DeviceAuthorizedType || (exports.DeviceAuthorizedType = DeviceAuthorizedType = {}));
var DeviceAuthorizedLegacyStatus;
(function (DeviceAuthorizedLegacyStatus) {
    DeviceAuthorizedLegacyStatus[DeviceAuthorizedLegacyStatus["SUCCESS"] = 0] = "SUCCESS";
    DeviceAuthorizedLegacyStatus[DeviceAuthorizedLegacyStatus["FAILED"] = 1] = "FAILED";
})(DeviceAuthorizedLegacyStatus || (exports.DeviceAuthorizedLegacyStatus = DeviceAuthorizedLegacyStatus = {}));
var DeviceAuthorizedR21TCLKStatus;
(function (DeviceAuthorizedR21TCLKStatus) {
    DeviceAuthorizedR21TCLKStatus[DeviceAuthorizedR21TCLKStatus["SUCCESS"] = 0] = "SUCCESS";
    DeviceAuthorizedR21TCLKStatus[DeviceAuthorizedR21TCLKStatus["TIMEOUT"] = 1] = "TIMEOUT";
    DeviceAuthorizedR21TCLKStatus[DeviceAuthorizedR21TCLKStatus["FAILED"] = 2] = "FAILED";
})(DeviceAuthorizedR21TCLKStatus || (exports.DeviceAuthorizedR21TCLKStatus = DeviceAuthorizedR21TCLKStatus = {}));
var DeviceAuthorizedSECBKEStatus;
(function (DeviceAuthorizedSECBKEStatus) {
    DeviceAuthorizedSECBKEStatus[DeviceAuthorizedSECBKEStatus["SUCCESS"] = 0] = "SUCCESS";
})(DeviceAuthorizedSECBKEStatus || (exports.DeviceAuthorizedSECBKEStatus = DeviceAuthorizedSECBKEStatus = {}));
var DeviceUpdateStatus;
(function (DeviceUpdateStatus) {
    DeviceUpdateStatus[DeviceUpdateStatus["SECURED_REJOIN"] = 0] = "SECURED_REJOIN";
    DeviceUpdateStatus[DeviceUpdateStatus["UNSECURED_JOIN"] = 1] = "UNSECURED_JOIN";
    DeviceUpdateStatus[DeviceUpdateStatus["LEFT"] = 2] = "LEFT";
    DeviceUpdateStatus[DeviceUpdateStatus["TC_REJOIN"] = 3] = "TC_REJOIN";
    // 0x04 – 0x07 = Reserved
})(DeviceUpdateStatus || (exports.DeviceUpdateStatus = DeviceUpdateStatus = {}));
var DeviceUpdateTCAction;
(function (DeviceUpdateTCAction) {
    /* authorize device */
    DeviceUpdateTCAction[DeviceUpdateTCAction["AUTHORIZE"] = 0] = "AUTHORIZE";
    /* deby authorization - msend Remove device  */
    DeviceUpdateTCAction[DeviceUpdateTCAction["DENY"] = 1] = "DENY";
    /* ignore Update Device - that meay lead to authorization deny */
    DeviceUpdateTCAction[DeviceUpdateTCAction["IGNORE"] = 2] = "IGNORE";
})(DeviceUpdateTCAction || (exports.DeviceUpdateTCAction = DeviceUpdateTCAction = {}));
//# sourceMappingURL=enums.js.map