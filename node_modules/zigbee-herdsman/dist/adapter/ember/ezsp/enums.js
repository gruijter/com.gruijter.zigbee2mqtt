"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EzspMemoryUsageData = exports.EzspSleepMode = exports.EzspMfgTokenId = exports.EmberRejoinReason = exports.EmberLeaveReason = exports.EzspEndpointFlag = exports.EzspExtendedValueId = exports.EzspValueId = exports.EzspPolicyId = exports.EzspDecisionBitmask = exports.EzspDecisionId = exports.EzspConfigId = exports.EzspFrameID = void 0;
/** EZSP Frame IDs */
var EzspFrameID;
(function (EzspFrameID) {
    // Configuration Frames
    EzspFrameID[EzspFrameID["VERSION"] = 0] = "VERSION";
    EzspFrameID[EzspFrameID["GET_CONFIGURATION_VALUE"] = 82] = "GET_CONFIGURATION_VALUE";
    EzspFrameID[EzspFrameID["SET_CONFIGURATION_VALUE"] = 83] = "SET_CONFIGURATION_VALUE";
    EzspFrameID[EzspFrameID["READ_ATTRIBUTE"] = 264] = "READ_ATTRIBUTE";
    EzspFrameID[EzspFrameID["WRITE_ATTRIBUTE"] = 265] = "WRITE_ATTRIBUTE";
    EzspFrameID[EzspFrameID["ADD_ENDPOINT"] = 2] = "ADD_ENDPOINT";
    EzspFrameID[EzspFrameID["SET_POLICY"] = 85] = "SET_POLICY";
    EzspFrameID[EzspFrameID["GET_POLICY"] = 86] = "GET_POLICY";
    EzspFrameID[EzspFrameID["SEND_PAN_ID_UPDATE"] = 87] = "SEND_PAN_ID_UPDATE";
    EzspFrameID[EzspFrameID["GET_VALUE"] = 170] = "GET_VALUE";
    EzspFrameID[EzspFrameID["GET_EXTENDED_VALUE"] = 3] = "GET_EXTENDED_VALUE";
    EzspFrameID[EzspFrameID["SET_VALUE"] = 171] = "SET_VALUE";
    EzspFrameID[EzspFrameID["SET_PASSIVE_ACK_CONFIG"] = 261] = "SET_PASSIVE_ACK_CONFIG";
    /** v14+ */
    EzspFrameID[EzspFrameID["SET_PENDING_NETWORK_UPDATE_PAN_ID"] = 286] = "SET_PENDING_NETWORK_UPDATE_PAN_ID";
    /** v14+ */
    EzspFrameID[EzspFrameID["GET_ENDPOINT"] = 302] = "GET_ENDPOINT";
    /** v14+ */
    EzspFrameID[EzspFrameID["GET_ENDPOINT_COUNT"] = 303] = "GET_ENDPOINT_COUNT";
    /** v14+ */
    EzspFrameID[EzspFrameID["GET_ENDPOINT_DESCRIPTION"] = 304] = "GET_ENDPOINT_DESCRIPTION";
    /** v14+ */
    EzspFrameID[EzspFrameID["GET_ENDPOINT_CLUSTER"] = 305] = "GET_ENDPOINT_CLUSTER";
    // Utilities Frames
    EzspFrameID[EzspFrameID["NOP"] = 5] = "NOP";
    EzspFrameID[EzspFrameID["ECHO"] = 129] = "ECHO";
    EzspFrameID[EzspFrameID["INVALID_COMMAND"] = 88] = "INVALID_COMMAND";
    EzspFrameID[EzspFrameID["CALLBACK"] = 6] = "CALLBACK";
    EzspFrameID[EzspFrameID["NO_CALLBACKS"] = 7] = "NO_CALLBACKS";
    EzspFrameID[EzspFrameID["SET_TOKEN"] = 9] = "SET_TOKEN";
    EzspFrameID[EzspFrameID["GET_TOKEN"] = 10] = "GET_TOKEN";
    EzspFrameID[EzspFrameID["GET_MFG_TOKEN"] = 11] = "GET_MFG_TOKEN";
    EzspFrameID[EzspFrameID["SET_MFG_TOKEN"] = 12] = "SET_MFG_TOKEN";
    EzspFrameID[EzspFrameID["STACK_TOKEN_CHANGED_HANDLER"] = 13] = "STACK_TOKEN_CHANGED_HANDLER";
    EzspFrameID[EzspFrameID["GET_RANDOM_NUMBER"] = 73] = "GET_RANDOM_NUMBER";
    EzspFrameID[EzspFrameID["SET_TIMER"] = 14] = "SET_TIMER";
    EzspFrameID[EzspFrameID["GET_TIMER"] = 78] = "GET_TIMER";
    EzspFrameID[EzspFrameID["TIMER_HANDLER"] = 15] = "TIMER_HANDLER";
    EzspFrameID[EzspFrameID["DEBUG_WRITE"] = 18] = "DEBUG_WRITE";
    EzspFrameID[EzspFrameID["READ_AND_CLEAR_COUNTERS"] = 101] = "READ_AND_CLEAR_COUNTERS";
    EzspFrameID[EzspFrameID["READ_COUNTERS"] = 241] = "READ_COUNTERS";
    EzspFrameID[EzspFrameID["COUNTER_ROLLOVER_HANDLER"] = 242] = "COUNTER_ROLLOVER_HANDLER";
    /** v17+ */
    EzspFrameID[EzspFrameID["MUX_INVALID_RX_HANDLER"] = 98] = "MUX_INVALID_RX_HANDLER";
    EzspFrameID[EzspFrameID["DELAY_TEST"] = 157] = "DELAY_TEST";
    EzspFrameID[EzspFrameID["GET_LIBRARY_STATUS"] = 1] = "GET_LIBRARY_STATUS";
    EzspFrameID[EzspFrameID["GET_XNCP_INFO"] = 19] = "GET_XNCP_INFO";
    EzspFrameID[EzspFrameID["CUSTOM_FRAME"] = 71] = "CUSTOM_FRAME";
    EzspFrameID[EzspFrameID["CUSTOM_FRAME_HANDLER"] = 84] = "CUSTOM_FRAME_HANDLER";
    EzspFrameID[EzspFrameID["GET_EUI64"] = 38] = "GET_EUI64";
    EzspFrameID[EzspFrameID["GET_NODE_ID"] = 39] = "GET_NODE_ID";
    EzspFrameID[EzspFrameID["GET_PHY_INTERFACE_COUNT"] = 252] = "GET_PHY_INTERFACE_COUNT";
    EzspFrameID[EzspFrameID["GET_TRUE_RANDOM_ENTROPY_SOURCE"] = 79] = "GET_TRUE_RANDOM_ENTROPY_SOURCE";
    /** v14+ */
    EzspFrameID[EzspFrameID["SETUP_DELAYED_JOIN"] = 58] = "SETUP_DELAYED_JOIN";
    /** v14+ */
    EzspFrameID[EzspFrameID["RADIO_GET_SCHEDULER_PRIORITIES"] = 298] = "RADIO_GET_SCHEDULER_PRIORITIES";
    /** v14+ */
    EzspFrameID[EzspFrameID["RADIO_SET_SCHEDULER_PRIORITIES"] = 299] = "RADIO_SET_SCHEDULER_PRIORITIES";
    /** v14+ */
    EzspFrameID[EzspFrameID["RADIO_GET_SCHEDULER_SLIPTIME"] = 300] = "RADIO_GET_SCHEDULER_SLIPTIME";
    /** v14+ */
    EzspFrameID[EzspFrameID["RADIO_SET_SCHEDULER_SLIPTIME"] = 301] = "RADIO_SET_SCHEDULER_SLIPTIME";
    /** v14+ */
    EzspFrameID[EzspFrameID["COUNTER_REQUIRES_PHY_INDEX"] = 306] = "COUNTER_REQUIRES_PHY_INDEX";
    /** v14+ */
    EzspFrameID[EzspFrameID["COUNTER_REQUIRES_DESTINATION_NODE_ID"] = 307] = "COUNTER_REQUIRES_DESTINATION_NODE_ID";
    // Networking Frames
    EzspFrameID[EzspFrameID["SET_MANUFACTURER_CODE"] = 21] = "SET_MANUFACTURER_CODE";
    /** v14+ */
    EzspFrameID[EzspFrameID["GET_MANUFACTURER_CODE"] = 202] = "GET_MANUFACTURER_CODE";
    EzspFrameID[EzspFrameID["SET_POWER_DESCRIPTOR"] = 22] = "SET_POWER_DESCRIPTOR";
    EzspFrameID[EzspFrameID["NETWORK_INIT"] = 23] = "NETWORK_INIT";
    EzspFrameID[EzspFrameID["NETWORK_STATE"] = 24] = "NETWORK_STATE";
    EzspFrameID[EzspFrameID["STACK_STATUS_HANDLER"] = 25] = "STACK_STATUS_HANDLER";
    EzspFrameID[EzspFrameID["START_SCAN"] = 26] = "START_SCAN";
    EzspFrameID[EzspFrameID["ENERGY_SCAN_RESULT_HANDLER"] = 72] = "ENERGY_SCAN_RESULT_HANDLER";
    EzspFrameID[EzspFrameID["NETWORK_FOUND_HANDLER"] = 27] = "NETWORK_FOUND_HANDLER";
    EzspFrameID[EzspFrameID["SCAN_COMPLETE_HANDLER"] = 28] = "SCAN_COMPLETE_HANDLER";
    EzspFrameID[EzspFrameID["UNUSED_PAN_ID_FOUND_HANDLER"] = 210] = "UNUSED_PAN_ID_FOUND_HANDLER";
    EzspFrameID[EzspFrameID["FIND_UNUSED_PAN_ID"] = 211] = "FIND_UNUSED_PAN_ID";
    EzspFrameID[EzspFrameID["STOP_SCAN"] = 29] = "STOP_SCAN";
    EzspFrameID[EzspFrameID["FORM_NETWORK"] = 30] = "FORM_NETWORK";
    EzspFrameID[EzspFrameID["JOIN_NETWORK"] = 31] = "JOIN_NETWORK";
    EzspFrameID[EzspFrameID["JOIN_NETWORK_DIRECTLY"] = 59] = "JOIN_NETWORK_DIRECTLY";
    EzspFrameID[EzspFrameID["LEAVE_NETWORK"] = 32] = "LEAVE_NETWORK";
    EzspFrameID[EzspFrameID["FIND_AND_REJOIN_NETWORK"] = 33] = "FIND_AND_REJOIN_NETWORK";
    EzspFrameID[EzspFrameID["PERMIT_JOINING"] = 34] = "PERMIT_JOINING";
    EzspFrameID[EzspFrameID["CHILD_JOIN_HANDLER"] = 35] = "CHILD_JOIN_HANDLER";
    EzspFrameID[EzspFrameID["ENERGY_SCAN_REQUEST"] = 156] = "ENERGY_SCAN_REQUEST";
    EzspFrameID[EzspFrameID["GET_NETWORK_PARAMETERS"] = 40] = "GET_NETWORK_PARAMETERS";
    EzspFrameID[EzspFrameID["GET_RADIO_PARAMETERS"] = 253] = "GET_RADIO_PARAMETERS";
    EzspFrameID[EzspFrameID["GET_PARENT_CHILD_PARAMETERS"] = 41] = "GET_PARENT_CHILD_PARAMETERS";
    /** v14+ */
    EzspFrameID[EzspFrameID["ROUTER_CHILD_COUNT"] = 315] = "ROUTER_CHILD_COUNT";
    /** v14+ */
    EzspFrameID[EzspFrameID["MAX_CHILD_COUNT"] = 316] = "MAX_CHILD_COUNT";
    /** v14+ */
    EzspFrameID[EzspFrameID["MAX_ROUTER_CHILD_COUNT"] = 317] = "MAX_ROUTER_CHILD_COUNT";
    /** v14+ */
    EzspFrameID[EzspFrameID["GET_PARENT_INCOMING_NWK_FRAME_COUNTER"] = 318] = "GET_PARENT_INCOMING_NWK_FRAME_COUNTER";
    /** v14+ */
    EzspFrameID[EzspFrameID["SET_PARENT_INCOMING_NWK_FRAME_COUNTER"] = 319] = "SET_PARENT_INCOMING_NWK_FRAME_COUNTER";
    /** v14+ */
    EzspFrameID[EzspFrameID["CURRENT_STACK_TASKS"] = 325] = "CURRENT_STACK_TASKS";
    /** v14+ */
    EzspFrameID[EzspFrameID["OK_TO_NAP"] = 326] = "OK_TO_NAP";
    /** v14+ */
    EzspFrameID[EzspFrameID["PARENT_TOKEN_SET"] = 320] = "PARENT_TOKEN_SET";
    /** v14+ */
    EzspFrameID[EzspFrameID["OK_TO_HIBERNATE"] = 321] = "OK_TO_HIBERNATE";
    /** v14+ */
    EzspFrameID[EzspFrameID["OK_TO_LONG_POLL"] = 322] = "OK_TO_LONG_POLL";
    /** v14+ */
    EzspFrameID[EzspFrameID["STACK_POWER_DOWN"] = 323] = "STACK_POWER_DOWN";
    /** v14+ */
    EzspFrameID[EzspFrameID["STACK_POWER_UP"] = 324] = "STACK_POWER_UP";
    EzspFrameID[EzspFrameID["GET_CHILD_DATA"] = 74] = "GET_CHILD_DATA";
    EzspFrameID[EzspFrameID["SET_CHILD_DATA"] = 172] = "SET_CHILD_DATA";
    EzspFrameID[EzspFrameID["CHILD_ID"] = 262] = "CHILD_ID";
    /** v14+ */
    EzspFrameID[EzspFrameID["CHILD_POWER"] = 308] = "CHILD_POWER";
    /** v14+ */
    EzspFrameID[EzspFrameID["SET_CHILD_POWER"] = 309] = "SET_CHILD_POWER";
    EzspFrameID[EzspFrameID["CHILD_INDEX"] = 263] = "CHILD_INDEX";
    EzspFrameID[EzspFrameID["GET_SOURCE_ROUTE_TABLE_TOTAL_SIZE"] = 195] = "GET_SOURCE_ROUTE_TABLE_TOTAL_SIZE";
    EzspFrameID[EzspFrameID["GET_SOURCE_ROUTE_TABLE_FILLED_SIZE"] = 194] = "GET_SOURCE_ROUTE_TABLE_FILLED_SIZE";
    EzspFrameID[EzspFrameID["GET_SOURCE_ROUTE_TABLE_ENTRY"] = 193] = "GET_SOURCE_ROUTE_TABLE_ENTRY";
    EzspFrameID[EzspFrameID["GET_NEIGHBOR"] = 121] = "GET_NEIGHBOR";
    EzspFrameID[EzspFrameID["GET_NEIGHBOR_FRAME_COUNTER"] = 62] = "GET_NEIGHBOR_FRAME_COUNTER";
    EzspFrameID[EzspFrameID["SET_NEIGHBOR_FRAME_COUNTER"] = 173] = "SET_NEIGHBOR_FRAME_COUNTER";
    EzspFrameID[EzspFrameID["SET_ROUTING_SHORTCUT_THRESHOLD"] = 208] = "SET_ROUTING_SHORTCUT_THRESHOLD";
    EzspFrameID[EzspFrameID["GET_ROUTING_SHORTCUT_THRESHOLD"] = 209] = "GET_ROUTING_SHORTCUT_THRESHOLD";
    EzspFrameID[EzspFrameID["NEIGHBOR_COUNT"] = 122] = "NEIGHBOR_COUNT";
    EzspFrameID[EzspFrameID["GET_ROUTE_TABLE_ENTRY"] = 123] = "GET_ROUTE_TABLE_ENTRY";
    EzspFrameID[EzspFrameID["SET_RADIO_POWER"] = 153] = "SET_RADIO_POWER";
    EzspFrameID[EzspFrameID["SET_RADIO_CHANNEL"] = 154] = "SET_RADIO_CHANNEL";
    EzspFrameID[EzspFrameID["GET_RADIO_CHANNEL"] = 255] = "GET_RADIO_CHANNEL";
    EzspFrameID[EzspFrameID["SET_RADIO_IEEE802154_CCA_MODE"] = 149] = "SET_RADIO_IEEE802154_CCA_MODE";
    EzspFrameID[EzspFrameID["SET_CONCENTRATOR"] = 16] = "SET_CONCENTRATOR";
    /** v14+ */
    EzspFrameID[EzspFrameID["CONCENTRATOR_START_DISCOVERY"] = 335] = "CONCENTRATOR_START_DISCOVERY";
    /** v14+ */
    EzspFrameID[EzspFrameID["CONCENTRATOR_STOP_DISCOVERY"] = 336] = "CONCENTRATOR_STOP_DISCOVERY";
    /** v14+ */
    EzspFrameID[EzspFrameID["CONCENTRATOR_NOTE_ROUTE_ERROR"] = 337] = "CONCENTRATOR_NOTE_ROUTE_ERROR";
    EzspFrameID[EzspFrameID["SET_BROKEN_ROUTE_ERROR_CODE"] = 17] = "SET_BROKEN_ROUTE_ERROR_CODE";
    EzspFrameID[EzspFrameID["MULTI_PHY_START"] = 248] = "MULTI_PHY_START";
    EzspFrameID[EzspFrameID["MULTI_PHY_STOP"] = 249] = "MULTI_PHY_STOP";
    EzspFrameID[EzspFrameID["MULTI_PHY_SET_RADIO_POWER"] = 250] = "MULTI_PHY_SET_RADIO_POWER";
    EzspFrameID[EzspFrameID["SEND_LINK_POWER_DELTA_REQUEST"] = 247] = "SEND_LINK_POWER_DELTA_REQUEST";
    EzspFrameID[EzspFrameID["MULTI_PHY_SET_RADIO_CHANNEL"] = 251] = "MULTI_PHY_SET_RADIO_CHANNEL";
    EzspFrameID[EzspFrameID["GET_DUTY_CYCLE_STATE"] = 53] = "GET_DUTY_CYCLE_STATE";
    EzspFrameID[EzspFrameID["SET_DUTY_CYCLE_LIMITS_IN_STACK"] = 64] = "SET_DUTY_CYCLE_LIMITS_IN_STACK";
    EzspFrameID[EzspFrameID["GET_DUTY_CYCLE_LIMITS"] = 75] = "GET_DUTY_CYCLE_LIMITS";
    EzspFrameID[EzspFrameID["GET_CURRENT_DUTY_CYCLE"] = 76] = "GET_CURRENT_DUTY_CYCLE";
    EzspFrameID[EzspFrameID["DUTY_CYCLE_HANDLER"] = 77] = "DUTY_CYCLE_HANDLER";
    // GET_FIRST_BEACON                                 = 0x003D,// v13-, unused
    EzspFrameID[EzspFrameID["SET_NUM_BEACONS_TO_STORE"] = 55] = "SET_NUM_BEACONS_TO_STORE";
    // GET_NEXT_BEACON                                  = 0x0004,// v13-, unused
    EzspFrameID[EzspFrameID["GET_STORED_BEACON"] = 4] = "GET_STORED_BEACON";
    EzspFrameID[EzspFrameID["GET_NUM_STORED_BEACONS"] = 8] = "GET_NUM_STORED_BEACONS";
    EzspFrameID[EzspFrameID["CLEAR_STORED_BEACONS"] = 60] = "CLEAR_STORED_BEACONS";
    EzspFrameID[EzspFrameID["SET_LOGICAL_AND_RADIO_CHANNEL"] = 185] = "SET_LOGICAL_AND_RADIO_CHANNEL";
    /** v14+ */
    EzspFrameID[EzspFrameID["SLEEPY_TO_SLEEPY_NETWORK_START"] = 281] = "SLEEPY_TO_SLEEPY_NETWORK_START";
    /** v14+ */
    EzspFrameID[EzspFrameID["SEND_ZIGBEE_LEAVE"] = 282] = "SEND_ZIGBEE_LEAVE";
    /** v14+ */
    EzspFrameID[EzspFrameID["GET_PERMIT_JOINING"] = 287] = "GET_PERMIT_JOINING";
    /** v14+ */
    EzspFrameID[EzspFrameID["GET_EXTENDED_PAN_ID"] = 295] = "GET_EXTENDED_PAN_ID";
    /** v14+ */
    EzspFrameID[EzspFrameID["GET_CURRENT_NETWORK"] = 334] = "GET_CURRENT_NETWORK";
    /** v14+ */
    EzspFrameID[EzspFrameID["SET_INITIAL_NEIGHBOR_OUTGOING_COST"] = 290] = "SET_INITIAL_NEIGHBOR_OUTGOING_COST";
    /** v14+ */
    EzspFrameID[EzspFrameID["GET_INITIAL_NEIGHBOR_OUTGOING_COST"] = 291] = "GET_INITIAL_NEIGHBOR_OUTGOING_COST";
    /** v14+ */
    EzspFrameID[EzspFrameID["RESET_REJOINING_NEIGHBORS_FRAME_COUNTER"] = 292] = "RESET_REJOINING_NEIGHBORS_FRAME_COUNTER";
    /** v14+ */
    EzspFrameID[EzspFrameID["IS_RESET_REJOINING_NEIGHBORS_FRAME_COUNTER_ENABLED"] = 293] = "IS_RESET_REJOINING_NEIGHBORS_FRAME_COUNTER_ENABLED";
    // Binding Frames
    EzspFrameID[EzspFrameID["CLEAR_BINDING_TABLE"] = 42] = "CLEAR_BINDING_TABLE";
    EzspFrameID[EzspFrameID["SET_BINDING"] = 43] = "SET_BINDING";
    EzspFrameID[EzspFrameID["GET_BINDING"] = 44] = "GET_BINDING";
    EzspFrameID[EzspFrameID["DELETE_BINDING"] = 45] = "DELETE_BINDING";
    EzspFrameID[EzspFrameID["BINDING_IS_ACTIVE"] = 46] = "BINDING_IS_ACTIVE";
    EzspFrameID[EzspFrameID["GET_BINDING_REMOTE_NODE_ID"] = 47] = "GET_BINDING_REMOTE_NODE_ID";
    EzspFrameID[EzspFrameID["SET_BINDING_REMOTE_NODE_ID"] = 48] = "SET_BINDING_REMOTE_NODE_ID";
    EzspFrameID[EzspFrameID["REMOTE_SET_BINDING_HANDLER"] = 49] = "REMOTE_SET_BINDING_HANDLER";
    EzspFrameID[EzspFrameID["REMOTE_DELETE_BINDING_HANDLER"] = 50] = "REMOTE_DELETE_BINDING_HANDLER";
    // Messaging Frames
    EzspFrameID[EzspFrameID["MAXIMUM_PAYLOAD_LENGTH"] = 51] = "MAXIMUM_PAYLOAD_LENGTH";
    EzspFrameID[EzspFrameID["SEND_UNICAST"] = 52] = "SEND_UNICAST";
    EzspFrameID[EzspFrameID["SEND_BROADCAST"] = 54] = "SEND_BROADCAST";
    // PROXY_BROADCAST                                  = 0x0037,// v13-, unused
    EzspFrameID[EzspFrameID["PROXY_NEXT_BROADCAST_FROM_LONG"] = 102] = "PROXY_NEXT_BROADCAST_FROM_LONG";
    EzspFrameID[EzspFrameID["SEND_MULTICAST"] = 56] = "SEND_MULTICAST";
    // SEND_MULTICAST_WITH_ALIAS                        = 0x003A,// v13-, unused
    EzspFrameID[EzspFrameID["SEND_REPLY"] = 57] = "SEND_REPLY";
    EzspFrameID[EzspFrameID["MESSAGE_SENT_HANDLER"] = 63] = "MESSAGE_SENT_HANDLER";
    EzspFrameID[EzspFrameID["SEND_MANY_TO_ONE_ROUTE_REQUEST"] = 65] = "SEND_MANY_TO_ONE_ROUTE_REQUEST";
    EzspFrameID[EzspFrameID["POLL_FOR_DATA"] = 66] = "POLL_FOR_DATA";
    EzspFrameID[EzspFrameID["POLL_COMPLETE_HANDLER"] = 67] = "POLL_COMPLETE_HANDLER";
    /** v14+ */
    EzspFrameID[EzspFrameID["SET_MESSAGE_FLAG"] = 310] = "SET_MESSAGE_FLAG";
    /** v14+ */
    EzspFrameID[EzspFrameID["CLEAR_MESSAGE_FLAG"] = 311] = "CLEAR_MESSAGE_FLAG";
    EzspFrameID[EzspFrameID["POLL_HANDLER"] = 68] = "POLL_HANDLER";
    /** v14+ */
    EzspFrameID[EzspFrameID["ADD_CHILD"] = 312] = "ADD_CHILD";
    /** v14+ */
    EzspFrameID[EzspFrameID["REMOVE_CHILD"] = 313] = "REMOVE_CHILD";
    /** v14+ */
    EzspFrameID[EzspFrameID["REMOVE_NEIGHBOR"] = 314] = "REMOVE_NEIGHBOR";
    // INCOMING_SENDER_EUI64_HANDLER                    = 0x0062,// v13-, unused
    EzspFrameID[EzspFrameID["INCOMING_MESSAGE_HANDLER"] = 69] = "INCOMING_MESSAGE_HANDLER";
    EzspFrameID[EzspFrameID["SET_SOURCE_ROUTE_DISCOVERY_MODE"] = 90] = "SET_SOURCE_ROUTE_DISCOVERY_MODE";
    EzspFrameID[EzspFrameID["INCOMING_MANY_TO_ONE_ROUTE_REQUEST_HANDLER"] = 125] = "INCOMING_MANY_TO_ONE_ROUTE_REQUEST_HANDLER";
    EzspFrameID[EzspFrameID["INCOMING_ROUTE_ERROR_HANDLER"] = 128] = "INCOMING_ROUTE_ERROR_HANDLER";
    EzspFrameID[EzspFrameID["INCOMING_NETWORK_STATUS_HANDLER"] = 196] = "INCOMING_NETWORK_STATUS_HANDLER";
    EzspFrameID[EzspFrameID["INCOMING_ROUTE_RECORD_HANDLER"] = 89] = "INCOMING_ROUTE_RECORD_HANDLER";
    // SET_SOURCE_ROUTE                                 = 0x00AE,// v9-, no-op since
    EzspFrameID[EzspFrameID["UNICAST_CURRENT_NETWORK_KEY"] = 80] = "UNICAST_CURRENT_NETWORK_KEY";
    EzspFrameID[EzspFrameID["ADDRESS_TABLE_ENTRY_IS_ACTIVE"] = 91] = "ADDRESS_TABLE_ENTRY_IS_ACTIVE";
    /** v14+ */
    EzspFrameID[EzspFrameID["SET_ADDRESS_TABLE_INFO"] = 92] = "SET_ADDRESS_TABLE_INFO";
    /** v14+ */
    EzspFrameID[EzspFrameID["GET_ADDRESS_TABLE_INFO"] = 94] = "GET_ADDRESS_TABLE_INFO";
    // SET_ADDRESS_TABLE_REMOTE_EUI64                   = 0x005C,// v13-, unused
    // SET_ADDRESS_TABLE_REMOTE_NODE_ID                 = 0x005D,// v13-, unused
    // GET_ADDRESS_TABLE_REMOTE_EUI64                   = 0x005E,// v13-, unused
    // GET_ADDRESS_TABLE_REMOTE_NODE_ID                 = 0x005F,// v13-, unused
    EzspFrameID[EzspFrameID["SET_EXTENDED_TIMEOUT"] = 126] = "SET_EXTENDED_TIMEOUT";
    EzspFrameID[EzspFrameID["GET_EXTENDED_TIMEOUT"] = 127] = "GET_EXTENDED_TIMEOUT";
    EzspFrameID[EzspFrameID["REPLACE_ADDRESS_TABLE_ENTRY"] = 130] = "REPLACE_ADDRESS_TABLE_ENTRY";
    EzspFrameID[EzspFrameID["LOOKUP_NODE_ID_BY_EUI64"] = 96] = "LOOKUP_NODE_ID_BY_EUI64";
    EzspFrameID[EzspFrameID["LOOKUP_EUI64_BY_NODE_ID"] = 97] = "LOOKUP_EUI64_BY_NODE_ID";
    EzspFrameID[EzspFrameID["GET_MULTICAST_TABLE_ENTRY"] = 99] = "GET_MULTICAST_TABLE_ENTRY";
    EzspFrameID[EzspFrameID["SET_MULTICAST_TABLE_ENTRY"] = 100] = "SET_MULTICAST_TABLE_ENTRY";
    EzspFrameID[EzspFrameID["ID_CONFLICT_HANDLER"] = 124] = "ID_CONFLICT_HANDLER";
    EzspFrameID[EzspFrameID["WRITE_NODE_DATA"] = 254] = "WRITE_NODE_DATA";
    // SEND_RAW_MESSAGE                                 = 0x0096,// v13-, unused
    EzspFrameID[EzspFrameID["SEND_RAW_MESSAGE"] = 81] = "SEND_RAW_MESSAGE";
    EzspFrameID[EzspFrameID["MAC_PASSTHROUGH_MESSAGE_HANDLER"] = 151] = "MAC_PASSTHROUGH_MESSAGE_HANDLER";
    EzspFrameID[EzspFrameID["MAC_FILTER_MATCH_MESSAGE_HANDLER"] = 70] = "MAC_FILTER_MATCH_MESSAGE_HANDLER";
    EzspFrameID[EzspFrameID["RAW_TRANSMIT_COMPLETE_HANDLER"] = 152] = "RAW_TRANSMIT_COMPLETE_HANDLER";
    EzspFrameID[EzspFrameID["SET_MAC_POLL_FAILURE_WAIT_TIME"] = 244] = "SET_MAC_POLL_FAILURE_WAIT_TIME";
    /** v14+ */
    EzspFrameID[EzspFrameID["GET_MAX_MAC_RETRIES"] = 106] = "GET_MAX_MAC_RETRIES";
    EzspFrameID[EzspFrameID["SET_BEACON_CLASSIFICATION_PARAMS"] = 239] = "SET_BEACON_CLASSIFICATION_PARAMS";
    EzspFrameID[EzspFrameID["GET_BEACON_CLASSIFICATION_PARAMS"] = 243] = "GET_BEACON_CLASSIFICATION_PARAMS";
    /** v14+ */
    EzspFrameID[EzspFrameID["PENDING_ACKED_MESSAGES"] = 289] = "PENDING_ACKED_MESSAGES";
    /** v14+ */
    EzspFrameID[EzspFrameID["RESCHEDULE_LINK_STATUS_MSG"] = 283] = "RESCHEDULE_LINK_STATUS_MSG";
    /** v14+ */
    EzspFrameID[EzspFrameID["SET_NWK_UPDATE_ID"] = 285] = "SET_NWK_UPDATE_ID";
    // Security Frames
    EzspFrameID[EzspFrameID["SET_INITIAL_SECURITY_STATE"] = 104] = "SET_INITIAL_SECURITY_STATE";
    EzspFrameID[EzspFrameID["GET_CURRENT_SECURITY_STATE"] = 105] = "GET_CURRENT_SECURITY_STATE";
    EzspFrameID[EzspFrameID["EXPORT_KEY"] = 276] = "EXPORT_KEY";
    EzspFrameID[EzspFrameID["IMPORT_KEY"] = 277] = "IMPORT_KEY";
    EzspFrameID[EzspFrameID["SWITCH_NETWORK_KEY_HANDLER"] = 110] = "SWITCH_NETWORK_KEY_HANDLER";
    EzspFrameID[EzspFrameID["FIND_KEY_TABLE_ENTRY"] = 117] = "FIND_KEY_TABLE_ENTRY";
    EzspFrameID[EzspFrameID["SEND_TRUST_CENTER_LINK_KEY"] = 103] = "SEND_TRUST_CENTER_LINK_KEY";
    EzspFrameID[EzspFrameID["ERASE_KEY_TABLE_ENTRY"] = 118] = "ERASE_KEY_TABLE_ENTRY";
    EzspFrameID[EzspFrameID["CLEAR_KEY_TABLE"] = 177] = "CLEAR_KEY_TABLE";
    EzspFrameID[EzspFrameID["REQUEST_LINK_KEY"] = 20] = "REQUEST_LINK_KEY";
    EzspFrameID[EzspFrameID["UPDATE_TC_LINK_KEY"] = 108] = "UPDATE_TC_LINK_KEY";
    EzspFrameID[EzspFrameID["ZIGBEE_KEY_ESTABLISHMENT_HANDLER"] = 155] = "ZIGBEE_KEY_ESTABLISHMENT_HANDLER";
    EzspFrameID[EzspFrameID["CLEAR_TRANSIENT_LINK_KEYS"] = 107] = "CLEAR_TRANSIENT_LINK_KEYS";
    EzspFrameID[EzspFrameID["GET_NETWORK_KEY_INFO"] = 278] = "GET_NETWORK_KEY_INFO";
    EzspFrameID[EzspFrameID["GET_APS_KEY_INFO"] = 268] = "GET_APS_KEY_INFO";
    EzspFrameID[EzspFrameID["IMPORT_LINK_KEY"] = 270] = "IMPORT_LINK_KEY";
    EzspFrameID[EzspFrameID["EXPORT_LINK_KEY_BY_INDEX"] = 271] = "EXPORT_LINK_KEY_BY_INDEX";
    EzspFrameID[EzspFrameID["EXPORT_LINK_KEY_BY_EUI"] = 269] = "EXPORT_LINK_KEY_BY_EUI";
    EzspFrameID[EzspFrameID["CHECK_KEY_CONTEXT"] = 272] = "CHECK_KEY_CONTEXT";
    EzspFrameID[EzspFrameID["IMPORT_TRANSIENT_KEY"] = 273] = "IMPORT_TRANSIENT_KEY";
    EzspFrameID[EzspFrameID["EXPORT_TRANSIENT_KEY_BY_INDEX"] = 274] = "EXPORT_TRANSIENT_KEY_BY_INDEX";
    EzspFrameID[EzspFrameID["EXPORT_TRANSIENT_KEY_BY_EUI"] = 275] = "EXPORT_TRANSIENT_KEY_BY_EUI";
    /** v14+ */
    EzspFrameID[EzspFrameID["SET_INCOMING_TC_LINK_KEY_FRAME_COUNTER"] = 296] = "SET_INCOMING_TC_LINK_KEY_FRAME_COUNTER";
    /** v14+ */
    EzspFrameID[EzspFrameID["APS_CRYPT_MESSAGE"] = 297] = "APS_CRYPT_MESSAGE";
    // Trust Center Frames
    EzspFrameID[EzspFrameID["TRUST_CENTER_JOIN_HANDLER"] = 36] = "TRUST_CENTER_JOIN_HANDLER";
    EzspFrameID[EzspFrameID["BROADCAST_NEXT_NETWORK_KEY"] = 115] = "BROADCAST_NEXT_NETWORK_KEY";
    EzspFrameID[EzspFrameID["BROADCAST_NETWORK_KEY_SWITCH"] = 116] = "BROADCAST_NETWORK_KEY_SWITCH";
    EzspFrameID[EzspFrameID["AES_MMO_HASH"] = 111] = "AES_MMO_HASH";
    EzspFrameID[EzspFrameID["REMOVE_DEVICE"] = 168] = "REMOVE_DEVICE";
    EzspFrameID[EzspFrameID["UNICAST_NWK_KEY_UPDATE"] = 169] = "UNICAST_NWK_KEY_UPDATE";
    // Certificate Based Key Exchange (CBKE) Frames
    EzspFrameID[EzspFrameID["GENERATE_CBKE_KEYS"] = 164] = "GENERATE_CBKE_KEYS";
    EzspFrameID[EzspFrameID["GENERATE_CBKE_KEYS_HANDLER"] = 158] = "GENERATE_CBKE_KEYS_HANDLER";
    EzspFrameID[EzspFrameID["CALCULATE_SMACS"] = 159] = "CALCULATE_SMACS";
    EzspFrameID[EzspFrameID["CALCULATE_SMACS_HANDLER"] = 160] = "CALCULATE_SMACS_HANDLER";
    EzspFrameID[EzspFrameID["GENERATE_CBKE_KEYS283K1"] = 232] = "GENERATE_CBKE_KEYS283K1";
    EzspFrameID[EzspFrameID["GENERATE_CBKE_KEYS_HANDLER283K1"] = 233] = "GENERATE_CBKE_KEYS_HANDLER283K1";
    EzspFrameID[EzspFrameID["CALCULATE_SMACS283K1"] = 234] = "CALCULATE_SMACS283K1";
    EzspFrameID[EzspFrameID["CALCULATE_SMACS_HANDLER283K1"] = 235] = "CALCULATE_SMACS_HANDLER283K1";
    EzspFrameID[EzspFrameID["CLEAR_TEMPORARY_DATA_MAYBE_STORE_LINK_KEY"] = 161] = "CLEAR_TEMPORARY_DATA_MAYBE_STORE_LINK_KEY";
    EzspFrameID[EzspFrameID["CLEAR_TEMPORARY_DATA_MAYBE_STORE_LINK_KEY283K1"] = 238] = "CLEAR_TEMPORARY_DATA_MAYBE_STORE_LINK_KEY283K1";
    EzspFrameID[EzspFrameID["GET_CERTIFICATE"] = 165] = "GET_CERTIFICATE";
    EzspFrameID[EzspFrameID["GET_CERTIFICATE283K1"] = 236] = "GET_CERTIFICATE283K1";
    // DSA_SIGN                                         = 0x00A6,// use EmberApsOption.DSA_SIGN instead
    EzspFrameID[EzspFrameID["DSA_SIGN_HANDLER"] = 167] = "DSA_SIGN_HANDLER";
    EzspFrameID[EzspFrameID["DSA_VERIFY"] = 163] = "DSA_VERIFY";
    EzspFrameID[EzspFrameID["DSA_VERIFY_HANDLER"] = 120] = "DSA_VERIFY_HANDLER";
    EzspFrameID[EzspFrameID["DSA_VERIFY283K1"] = 176] = "DSA_VERIFY283K1";
    EzspFrameID[EzspFrameID["SET_PREINSTALLED_CBKE_DATA"] = 162] = "SET_PREINSTALLED_CBKE_DATA";
    EzspFrameID[EzspFrameID["SAVE_PREINSTALLED_CBKE_DATA283K1"] = 237] = "SAVE_PREINSTALLED_CBKE_DATA283K1";
    // Mfglib Frames
    EzspFrameID[EzspFrameID["MFGLIB_INTERNAL_START"] = 131] = "MFGLIB_INTERNAL_START";
    EzspFrameID[EzspFrameID["MFGLIB_INTERNAL_END"] = 132] = "MFGLIB_INTERNAL_END";
    EzspFrameID[EzspFrameID["MFGLIB_INTERNAL_START_TONE"] = 133] = "MFGLIB_INTERNAL_START_TONE";
    EzspFrameID[EzspFrameID["MFGLIB_INTERNAL_STOP_TONE"] = 134] = "MFGLIB_INTERNAL_STOP_TONE";
    EzspFrameID[EzspFrameID["MFGLIB_INTERNAL_START_STREAM"] = 135] = "MFGLIB_INTERNAL_START_STREAM";
    EzspFrameID[EzspFrameID["MFGLIB_INTERNAL_STOP_STREAM"] = 136] = "MFGLIB_INTERNAL_STOP_STREAM";
    EzspFrameID[EzspFrameID["MFGLIB_INTERNAL_SEND_PACKET"] = 137] = "MFGLIB_INTERNAL_SEND_PACKET";
    EzspFrameID[EzspFrameID["MFGLIB_INTERNAL_SET_CHANNEL"] = 138] = "MFGLIB_INTERNAL_SET_CHANNEL";
    EzspFrameID[EzspFrameID["MFGLIB_INTERNAL_GET_CHANNEL"] = 139] = "MFGLIB_INTERNAL_GET_CHANNEL";
    EzspFrameID[EzspFrameID["MFGLIB_INTERNAL_SET_POWER"] = 140] = "MFGLIB_INTERNAL_SET_POWER";
    EzspFrameID[EzspFrameID["MFGLIB_INTERNAL_GET_POWER"] = 141] = "MFGLIB_INTERNAL_GET_POWER";
    EzspFrameID[EzspFrameID["MFGLIB_RX_HANDLER"] = 142] = "MFGLIB_RX_HANDLER";
    // Bootloader Frames
    EzspFrameID[EzspFrameID["LAUNCH_STANDALONE_BOOTLOADER"] = 143] = "LAUNCH_STANDALONE_BOOTLOADER";
    EzspFrameID[EzspFrameID["SEND_BOOTLOAD_MESSAGE"] = 144] = "SEND_BOOTLOAD_MESSAGE";
    EzspFrameID[EzspFrameID["GET_STANDALONE_BOOTLOADER_VERSION_PLAT_MICRO_PHY"] = 145] = "GET_STANDALONE_BOOTLOADER_VERSION_PLAT_MICRO_PHY";
    EzspFrameID[EzspFrameID["INCOMING_BOOTLOAD_MESSAGE_HANDLER"] = 146] = "INCOMING_BOOTLOAD_MESSAGE_HANDLER";
    EzspFrameID[EzspFrameID["BOOTLOAD_TRANSMIT_COMPLETE_HANDLER"] = 147] = "BOOTLOAD_TRANSMIT_COMPLETE_HANDLER";
    EzspFrameID[EzspFrameID["AES_ENCRYPT"] = 148] = "AES_ENCRYPT";
    /** v14+ */
    EzspFrameID[EzspFrameID["INCOMING_MFG_TEST_MESSAGE_HANDLER"] = 327] = "INCOMING_MFG_TEST_MESSAGE_HANDLER";
    /** v14+ */
    EzspFrameID[EzspFrameID["MFG_TEST_SET_PACKET_MODE"] = 328] = "MFG_TEST_SET_PACKET_MODE";
    /** v14+ */
    EzspFrameID[EzspFrameID["MFG_TEST_SEND_REBOOT_COMMAND"] = 329] = "MFG_TEST_SEND_REBOOT_COMMAND";
    /** v14+ */
    EzspFrameID[EzspFrameID["MFG_TEST_SEND_EUI64"] = 330] = "MFG_TEST_SEND_EUI64";
    /** v14+ */
    EzspFrameID[EzspFrameID["MFG_TEST_SEND_MANUFACTURING_STRING"] = 331] = "MFG_TEST_SEND_MANUFACTURING_STRING";
    /** v14+ */
    EzspFrameID[EzspFrameID["MFG_TEST_SEND_RADIO_PARAMETERS"] = 332] = "MFG_TEST_SEND_RADIO_PARAMETERS";
    /** v14+ */
    EzspFrameID[EzspFrameID["MFG_TEST_SEND_COMMAND"] = 333] = "MFG_TEST_SEND_COMMAND";
    // ZLL Frames
    EzspFrameID[EzspFrameID["ZLL_NETWORK_OPS"] = 178] = "ZLL_NETWORK_OPS";
    EzspFrameID[EzspFrameID["ZLL_SET_INITIAL_SECURITY_STATE"] = 179] = "ZLL_SET_INITIAL_SECURITY_STATE";
    EzspFrameID[EzspFrameID["ZLL_SET_SECURITY_STATE_WITHOUT_KEY"] = 207] = "ZLL_SET_SECURITY_STATE_WITHOUT_KEY";
    EzspFrameID[EzspFrameID["ZLL_START_SCAN"] = 180] = "ZLL_START_SCAN";
    EzspFrameID[EzspFrameID["ZLL_SET_RX_ON_WHEN_IDLE"] = 181] = "ZLL_SET_RX_ON_WHEN_IDLE";
    EzspFrameID[EzspFrameID["ZLL_NETWORK_FOUND_HANDLER"] = 182] = "ZLL_NETWORK_FOUND_HANDLER";
    EzspFrameID[EzspFrameID["ZLL_SCAN_COMPLETE_HANDLER"] = 183] = "ZLL_SCAN_COMPLETE_HANDLER";
    EzspFrameID[EzspFrameID["ZLL_ADDRESS_ASSIGNMENT_HANDLER"] = 184] = "ZLL_ADDRESS_ASSIGNMENT_HANDLER";
    EzspFrameID[EzspFrameID["ZLL_TOUCH_LINK_TARGET_HANDLER"] = 187] = "ZLL_TOUCH_LINK_TARGET_HANDLER";
    EzspFrameID[EzspFrameID["ZLL_GET_TOKENS"] = 188] = "ZLL_GET_TOKENS";
    EzspFrameID[EzspFrameID["ZLL_SET_DATA_TOKEN"] = 189] = "ZLL_SET_DATA_TOKEN";
    EzspFrameID[EzspFrameID["ZLL_SET_NON_ZLL_NETWORK"] = 191] = "ZLL_SET_NON_ZLL_NETWORK";
    EzspFrameID[EzspFrameID["IS_ZLL_NETWORK"] = 190] = "IS_ZLL_NETWORK";
    EzspFrameID[EzspFrameID["ZLL_SET_RADIO_IDLE_MODE"] = 212] = "ZLL_SET_RADIO_IDLE_MODE";
    EzspFrameID[EzspFrameID["ZLL_GET_RADIO_IDLE_MODE"] = 186] = "ZLL_GET_RADIO_IDLE_MODE";
    EzspFrameID[EzspFrameID["SET_ZLL_NODE_TYPE"] = 213] = "SET_ZLL_NODE_TYPE";
    EzspFrameID[EzspFrameID["SET_ZLL_ADDITIONAL_STATE"] = 214] = "SET_ZLL_ADDITIONAL_STATE";
    EzspFrameID[EzspFrameID["ZLL_OPERATION_IN_PROGRESS"] = 215] = "ZLL_OPERATION_IN_PROGRESS";
    EzspFrameID[EzspFrameID["ZLL_RX_ON_WHEN_IDLE_GET_ACTIVE"] = 216] = "ZLL_RX_ON_WHEN_IDLE_GET_ACTIVE";
    EzspFrameID[EzspFrameID["ZLL_SCANNING_COMPLETE"] = 246] = "ZLL_SCANNING_COMPLETE";
    EzspFrameID[EzspFrameID["GET_ZLL_PRIMARY_CHANNEL_MASK"] = 217] = "GET_ZLL_PRIMARY_CHANNEL_MASK";
    EzspFrameID[EzspFrameID["GET_ZLL_SECONDARY_CHANNEL_MASK"] = 218] = "GET_ZLL_SECONDARY_CHANNEL_MASK";
    EzspFrameID[EzspFrameID["SET_ZLL_PRIMARY_CHANNEL_MASK"] = 219] = "SET_ZLL_PRIMARY_CHANNEL_MASK";
    EzspFrameID[EzspFrameID["SET_ZLL_SECONDARY_CHANNEL_MASK"] = 220] = "SET_ZLL_SECONDARY_CHANNEL_MASK";
    EzspFrameID[EzspFrameID["ZLL_CLEAR_TOKENS"] = 37] = "ZLL_CLEAR_TOKENS";
    // WWAH Frames
    // SET_PARENT_CLASSIFICATION_ENABLED                = 0x00E7,// v13-, unused
    // GET_PARENT_CLASSIFICATION_ENABLED                = 0x00F0,// v13-, unused
    // SET_LONG_UP_TIME                                 = 0x00E3,// v13-, unused
    // SET_HUB_CONNECTIVITY                             = 0x00E4,// v13-, unused
    // IS_UP_TIME_LONG                                  = 0x00E5,// v13-, unused
    // IS_HUB_CONNECTED                                 = 0x00E6,// v13-, unused
    // Green Power Frames
    EzspFrameID[EzspFrameID["GP_PROXY_TABLE_PROCESS_GP_PAIRING"] = 201] = "GP_PROXY_TABLE_PROCESS_GP_PAIRING";
    EzspFrameID[EzspFrameID["D_GP_SEND"] = 198] = "D_GP_SEND";
    EzspFrameID[EzspFrameID["D_GP_SENT_HANDLER"] = 199] = "D_GP_SENT_HANDLER";
    EzspFrameID[EzspFrameID["GPEP_INCOMING_MESSAGE_HANDLER"] = 197] = "GPEP_INCOMING_MESSAGE_HANDLER";
    EzspFrameID[EzspFrameID["GP_PROXY_TABLE_GET_ENTRY"] = 200] = "GP_PROXY_TABLE_GET_ENTRY";
    EzspFrameID[EzspFrameID["GP_PROXY_TABLE_LOOKUP"] = 192] = "GP_PROXY_TABLE_LOOKUP";
    /** v17+ */
    EzspFrameID[EzspFrameID["GP_PROXY_TABLE_REMOVE_ENTRY"] = 93] = "GP_PROXY_TABLE_REMOVE_ENTRY";
    /** v17+ */
    EzspFrameID[EzspFrameID["GP_CLEAR_PROXY_TABLE"] = 95] = "GP_CLEAR_PROXY_TABLE";
    EzspFrameID[EzspFrameID["GP_SINK_TABLE_GET_ENTRY"] = 221] = "GP_SINK_TABLE_GET_ENTRY";
    EzspFrameID[EzspFrameID["GP_SINK_TABLE_LOOKUP"] = 222] = "GP_SINK_TABLE_LOOKUP";
    EzspFrameID[EzspFrameID["GP_SINK_TABLE_SET_ENTRY"] = 223] = "GP_SINK_TABLE_SET_ENTRY";
    EzspFrameID[EzspFrameID["GP_SINK_TABLE_REMOVE_ENTRY"] = 224] = "GP_SINK_TABLE_REMOVE_ENTRY";
    EzspFrameID[EzspFrameID["GP_SINK_TABLE_FIND_OR_ALLOCATE_ENTRY"] = 225] = "GP_SINK_TABLE_FIND_OR_ALLOCATE_ENTRY";
    EzspFrameID[EzspFrameID["GP_SINK_TABLE_CLEAR_ALL"] = 226] = "GP_SINK_TABLE_CLEAR_ALL";
    EzspFrameID[EzspFrameID["GP_SINK_TABLE_INIT"] = 112] = "GP_SINK_TABLE_INIT";
    EzspFrameID[EzspFrameID["GP_SINK_TABLE_SET_SECURITY_FRAME_COUNTER"] = 245] = "GP_SINK_TABLE_SET_SECURITY_FRAME_COUNTER";
    EzspFrameID[EzspFrameID["GP_SINK_COMMISSION"] = 266] = "GP_SINK_COMMISSION";
    EzspFrameID[EzspFrameID["GP_TRANSLATION_TABLE_CLEAR"] = 267] = "GP_TRANSLATION_TABLE_CLEAR";
    EzspFrameID[EzspFrameID["GP_SINK_TABLE_GET_NUMBER_OF_ACTIVE_ENTRIES"] = 280] = "GP_SINK_TABLE_GET_NUMBER_OF_ACTIVE_ENTRIES";
    // Token Interface Frames
    EzspFrameID[EzspFrameID["GET_TOKEN_COUNT"] = 256] = "GET_TOKEN_COUNT";
    EzspFrameID[EzspFrameID["GET_TOKEN_INFO"] = 257] = "GET_TOKEN_INFO";
    EzspFrameID[EzspFrameID["GET_TOKEN_DATA"] = 258] = "GET_TOKEN_DATA";
    EzspFrameID[EzspFrameID["SET_TOKEN_DATA"] = 259] = "SET_TOKEN_DATA";
    EzspFrameID[EzspFrameID["RESET_NODE"] = 260] = "RESET_NODE";
    EzspFrameID[EzspFrameID["GP_SECURITY_TEST_VECTORS"] = 279] = "GP_SECURITY_TEST_VECTORS";
    EzspFrameID[EzspFrameID["TOKEN_FACTORY_RESET"] = 119] = "TOKEN_FACTORY_RESET";
})(EzspFrameID || (exports.EzspFrameID = EzspFrameID = {}));
/** Identifies a configuration value. uint8_t */
var EzspConfigId;
(function (EzspConfigId) {
    // 0x00?
    /**
     * The NCP no longer supports configuration of packet buffer heap at runtime using this parameter.
     * Packet buffers heap space must be configured using the EMBER_PACKET_BUFFER_COUNT macro when building the NCP project.
     */
    EzspConfigId[EzspConfigId["PACKET_BUFFER_HEAP_SIZE"] = 1] = "PACKET_BUFFER_HEAP_SIZE";
    /**
     * The maximum number of router neighbors the stack can keep track of. A
     * neighbor is a node within radio range.
     */
    EzspConfigId[EzspConfigId["NEIGHBOR_TABLE_SIZE"] = 2] = "NEIGHBOR_TABLE_SIZE";
    /**
     * The maximum number of APS retried messages the stack can be transmitting at
     * any time.
     */
    EzspConfigId[EzspConfigId["APS_UNICAST_MESSAGE_COUNT"] = 3] = "APS_UNICAST_MESSAGE_COUNT";
    /**
     * The maximum number of non-volatile bindings supported by the stack.
     */
    EzspConfigId[EzspConfigId["BINDING_TABLE_SIZE"] = 4] = "BINDING_TABLE_SIZE";
    /**
     * The maximum number of EUI64 to network address associations that the stack
     * can maintain for the application. (Note, the total number of such address
     * associations maintained by the NCP is the sum of the value of this setting
     * and the value of ::TRUST_CENTER_ADDRESS_CACHE_SIZE.
     */
    EzspConfigId[EzspConfigId["ADDRESS_TABLE_SIZE"] = 5] = "ADDRESS_TABLE_SIZE";
    /**
     * The maximum number of multicast groups that the device may be a member of.
     */
    EzspConfigId[EzspConfigId["MULTICAST_TABLE_SIZE"] = 6] = "MULTICAST_TABLE_SIZE";
    /**
     * The maximum number of destinations to which a node can route messages. This
     * includes both messages originating at this node and those relayed for
     * others.
     */
    EzspConfigId[EzspConfigId["ROUTE_TABLE_SIZE"] = 7] = "ROUTE_TABLE_SIZE";
    /**
     * The number of simultaneous route discoveries that a node will support.
     */
    EzspConfigId[EzspConfigId["DISCOVERY_TABLE_SIZE"] = 8] = "DISCOVERY_TABLE_SIZE";
    // 0x0A?
    // 0x0B?
    /**
     * Specifies the stack profile.
     */
    EzspConfigId[EzspConfigId["STACK_PROFILE"] = 12] = "STACK_PROFILE";
    /**
     * The security level used for security at the MAC and network layers. The
     * supported values are 0 (no security) and 5 (payload is encrypted and a
     * four-byte MIC is used for authentication).
     */
    EzspConfigId[EzspConfigId["SECURITY_LEVEL"] = 13] = "SECURITY_LEVEL";
    // 0x0E?
    // 0x0F?
    /**
     * The maximum number of hops for a message.
     */
    EzspConfigId[EzspConfigId["MAX_HOPS"] = 16] = "MAX_HOPS";
    /**
     * The maximum number of end device children that a router will support.
     */
    EzspConfigId[EzspConfigId["MAX_END_DEVICE_CHILDREN"] = 17] = "MAX_END_DEVICE_CHILDREN";
    /**
     * The maximum amount of time that the MAC will hold a message for indirect
     * transmission to a child.
     */
    EzspConfigId[EzspConfigId["INDIRECT_TRANSMISSION_TIMEOUT"] = 18] = "INDIRECT_TRANSMISSION_TIMEOUT";
    /**
     * The maximum amount of time that an end device child can wait between polls.
     * If no poll is heard within this timeout, then the parent removes the end
     * device from its tables. Value range 0-14. The timeout corresponding to a
     * value of zero is 10 seconds. The timeout corresponding to a nonzero value N
     * is 2^N minutes, ranging from 2^1 = 2 minutes to 2^14 = 16384 minutes.
     */
    EzspConfigId[EzspConfigId["END_DEVICE_POLL_TIMEOUT"] = 19] = "END_DEVICE_POLL_TIMEOUT";
    // 0x14?
    // 0x15?
    // 0x16?
    /**
     * Enables boost power mode and/or the alternate transmitter output.
     */
    EzspConfigId[EzspConfigId["TX_POWER_MODE"] = 23] = "TX_POWER_MODE";
    /**
     * 0: Allow this node to relay messages. 1: Prevent this node from relaying
     * messages.
     */
    EzspConfigId[EzspConfigId["DISABLE_RELAY"] = 24] = "DISABLE_RELAY";
    /**
     * The maximum number of EUI64 to network address associations that the Trust
     * Center can maintain. These address cache entries are reserved for and
     * reused by the Trust Center when processing device join/rejoin
     * authentications. This cache size limits the number of overlapping joins the
     * Trust Center can process within a narrow time window (e.g. two seconds),
     * and thus should be set to the maximum number of near simultaneous joins the
     * Trust Center is expected to accommodate. (Note, the total number of such
     * address associations maintained by the NCP is the sum of the value of this
     * setting and the value of ::ADDRESS_TABLE_SIZE.)
     */
    EzspConfigId[EzspConfigId["TRUST_CENTER_ADDRESS_CACHE_SIZE"] = 25] = "TRUST_CENTER_ADDRESS_CACHE_SIZE";
    /**
     * The size of the source route table.
     */
    EzspConfigId[EzspConfigId["SOURCE_ROUTE_TABLE_SIZE"] = 26] = "SOURCE_ROUTE_TABLE_SIZE";
    // 0x1B?
    /** The number of blocks of a fragmented message that can be sent in a single window. */
    EzspConfigId[EzspConfigId["FRAGMENT_WINDOW_SIZE"] = 28] = "FRAGMENT_WINDOW_SIZE";
    /** The time the stack will wait (in milliseconds) between sending blocks of a fragmented message. */
    EzspConfigId[EzspConfigId["FRAGMENT_DELAY_MS"] = 29] = "FRAGMENT_DELAY_MS";
    /**
     * The size of the Key Table used for storing individual link keys (if the
     * device is a Trust Center) or Application Link Keys (if the device is a normal node).
     */
    EzspConfigId[EzspConfigId["KEY_TABLE_SIZE"] = 30] = "KEY_TABLE_SIZE";
    /** The APS ACK timeout value. The stack waits this amount of time between resends of APS retried messages. */
    EzspConfigId[EzspConfigId["APS_ACK_TIMEOUT"] = 31] = "APS_ACK_TIMEOUT";
    /**
     * The duration of a beacon jitter, in the units used by the 15.4 scan
     * parameter (((1 << duration) + 1) * 15ms), when responding to a beacon request.
     */
    EzspConfigId[EzspConfigId["BEACON_JITTER_DURATION"] = 32] = "BEACON_JITTER_DURATION";
    // 0x21?
    /** The number of PAN id conflict reports that must be received by the network manager within one minute to trigger a PAN id change. */
    EzspConfigId[EzspConfigId["PAN_ID_CONFLICT_REPORT_THRESHOLD"] = 34] = "PAN_ID_CONFLICT_REPORT_THRESHOLD";
    /**
     * The timeout value in minutes for how long the Trust Center or a normal node
     * waits for the Zigbee Request Key to complete. On the Trust Center this
     * controls whether or not the device buffers the request, waiting for a
     * matching pair of Zigbee Request Key. If the value is non-zero, the Trust
     * Center buffers and waits for that amount of time. If the value is zero, the
     * Trust Center does not buffer the request and immediately responds to the
     * request. Zero is the most compliant behavior.
     */
    EzspConfigId[EzspConfigId["REQUEST_KEY_TIMEOUT"] = 36] = "REQUEST_KEY_TIMEOUT";
    // 0x25?
    // 0x26?
    // 0x27?
    // 0x28?
    /**
     * This value indicates the size of the runtime modifiable certificate table.
     * Normally certificates are stored in MFG tokens but this table can be used
     * to field upgrade devices with new Smart Energy certificates. This value
     * cannot be set, it can only be queried.
     */
    EzspConfigId[EzspConfigId["CERTIFICATE_TABLE_SIZE"] = 41] = "CERTIFICATE_TABLE_SIZE";
    /**
     * This is a bitmask that controls which incoming ZDO request messages are
     * passed to the application. The bits are defined in the
     * EmberZdoConfigurationFlags enumeration. To see if the application is
     * required to send a ZDO response in reply to an incoming message, the
     * application must check the APS options bitfield within the
     * incomingMessageHandler callback to see if the
     * EMBER_APS_OPTION_ZDO_RESPONSE_REQUIRED flag is set.
     */
    EzspConfigId[EzspConfigId["APPLICATION_ZDO_FLAGS"] = 42] = "APPLICATION_ZDO_FLAGS";
    /** The maximum number of broadcasts during a single broadcast timeout period. */
    EzspConfigId[EzspConfigId["BROADCAST_TABLE_SIZE"] = 43] = "BROADCAST_TABLE_SIZE";
    /** The size of the MAC filter list table. */
    EzspConfigId[EzspConfigId["MAC_FILTER_TABLE_SIZE"] = 44] = "MAC_FILTER_TABLE_SIZE";
    /** The number of supported networks. */
    EzspConfigId[EzspConfigId["SUPPORTED_NETWORKS"] = 45] = "SUPPORTED_NETWORKS";
    /**
     * Whether multicasts are sent to the RxOnWhenIdle=true address (0xFFFD) or
     * the sleepy broadcast address (0xFFFF). The RxOnWhenIdle=true address is the
     * Zigbee compliant destination for multicasts.
     */
    EzspConfigId[EzspConfigId["SEND_MULTICASTS_TO_SLEEPY_ADDRESS"] = 46] = "SEND_MULTICASTS_TO_SLEEPY_ADDRESS";
    /** ZLL group address initial configuration. */
    EzspConfigId[EzspConfigId["ZLL_GROUP_ADDRESSES"] = 47] = "ZLL_GROUP_ADDRESSES";
    /** ZLL rssi threshold initial configuration. */
    EzspConfigId[EzspConfigId["ZLL_RSSI_THRESHOLD"] = 48] = "ZLL_RSSI_THRESHOLD";
    // 0x31?
    // 0x32?
    /** Toggles the MTORR flow control in the stack. */
    EzspConfigId[EzspConfigId["MTORR_FLOW_CONTROL"] = 51] = "MTORR_FLOW_CONTROL";
    /** Setting the retry queue size. Applies to all queues. Default value in the sample applications is 16. */
    EzspConfigId[EzspConfigId["RETRY_QUEUE_SIZE"] = 52] = "RETRY_QUEUE_SIZE";
    /**
     * Setting the new broadcast entry threshold. The number (BROADCAST_TABLE_SIZE
     * - NEW_BROADCAST_ENTRY_THRESHOLD) of broadcast table entries are reserved
     * for relaying the broadcast messages originated on other devices. The local
     * device will fail to originate a broadcast message after this threshold is
     * reached. Setting this value to BROADCAST_TABLE_SIZE and greater will
     * effectively kill this limitation.
     */
    EzspConfigId[EzspConfigId["NEW_BROADCAST_ENTRY_THRESHOLD"] = 53] = "NEW_BROADCAST_ENTRY_THRESHOLD";
    /**
     * The length of time, in seconds, that a trust center will store a transient
     * link key that a device can use to join its network. A transient key is
     * added with a call to emberAddTransientLinkKey. After the transient key is
     * added, it will be removed once this amount of time has passed. A joining
     * device will not be able to use that key to join until it is added again on
     * the trust center. The default value is 300 seconds, i.e., 5 minutes.
     */
    EzspConfigId[EzspConfigId["TRANSIENT_KEY_TIMEOUT_S"] = 54] = "TRANSIENT_KEY_TIMEOUT_S";
    /** The number of passive acknowledgements to record from neighbors before we stop re-transmitting broadcasts */
    EzspConfigId[EzspConfigId["BROADCAST_MIN_ACKS_NEEDED"] = 55] = "BROADCAST_MIN_ACKS_NEEDED";
    /**
     * The length of time, in seconds, that a trust center will allow a Trust
     * Center (insecure) rejoin for a device that is using the well-known link
     * key. This timeout takes effect once rejoins using the well-known key has
     * been allowed. This command updates the
     * sli_zigbee_allow_tc_rejoins_using_well_known_key_timeout_sec value.
     */
    EzspConfigId[EzspConfigId["TC_REJOINS_USING_WELL_KNOWN_KEY_TIMEOUT_S"] = 56] = "TC_REJOINS_USING_WELL_KNOWN_KEY_TIMEOUT_S";
    /** Valid range of a CTUNE value is 0x0000-0x01FF. Higher order bits (0xFE00) of the 16-bit value are ignored. */
    EzspConfigId[EzspConfigId["CTUNE_VALUE"] = 57] = "CTUNE_VALUE";
    // 0x3A?
    // 0x3B?
    // 0x3C?
    // 0x3D?
    // 0x3E?
    // 0x3F?
    /**
     * To configure non trust center node to assume a concentrator type of the
     * trust center it join to, until it receive many-to-one route request from
     * the trust center. For the trust center node, concentrator type is
     * configured from the concentrator plugin. The stack by default assumes trust
     * center be a low RAM concentrator that make other devices send route record
     * to the trust center even without receiving a many-to-one route request. The
     * default concentrator type can be changed by setting appropriate
     * EmberAssumeTrustCenterConcentratorType config value.
     */
    EzspConfigId[EzspConfigId["ASSUME_TC_CONCENTRATOR_TYPE"] = 64] = "ASSUME_TC_CONCENTRATOR_TYPE";
    /** This is green power proxy table size. This value is read-only and cannot be set at runtime */
    EzspConfigId[EzspConfigId["GP_PROXY_TABLE_SIZE"] = 65] = "GP_PROXY_TABLE_SIZE";
    /** This is green power sink table size. This value is read-only and cannot be set at runtime */
    EzspConfigId[EzspConfigId["GP_SINK_TABLE_SIZE"] = 66] = "GP_SINK_TABLE_SIZE";
    /**
     * v14+
     * This is the configuration advertised by the end device to the parent when joining/rejoining,
     * either SL_ZIGBEE_END_DEVICE_CONFIG_NONE or SL_ZIGBEE_END_DEVICE_CONFIG_PERSIST_DATA_ON_PARENT.
     */
    EzspConfigId[EzspConfigId["END_DEVICE_CONFIGURATION"] = 67] = "END_DEVICE_CONFIGURATION";
})(EzspConfigId || (exports.EzspConfigId = EzspConfigId = {}));
/** Identifies a policy decision. */
var EzspDecisionId;
(function (EzspDecisionId) {
    /**
     * BINDING_MODIFICATION_POLICY default decision.
     *
     * Do not allow the local binding table to be changed by remote nodes.
     */
    EzspDecisionId[EzspDecisionId["DISALLOW_BINDING_MODIFICATION"] = 16] = "DISALLOW_BINDING_MODIFICATION";
    /**
     * BINDING_MODIFICATION_POLICY decision.
     *
     * Allow remote nodes to change the local binding table.
     */
    EzspDecisionId[EzspDecisionId["ALLOW_BINDING_MODIFICATION"] = 17] = "ALLOW_BINDING_MODIFICATION";
    /**
     * BINDING_MODIFICATION_POLICY decision.
     *
     * Allows remote nodes to set local binding entries only if the entries correspond to endpoints
     * defined on the device, and for output clusters bound to those endpoints.
     */
    EzspDecisionId[EzspDecisionId["CHECK_BINDING_MODIFICATIONS_ARE_VALID_ENDPOINT_CLUSTERS"] = 18] = "CHECK_BINDING_MODIFICATIONS_ARE_VALID_ENDPOINT_CLUSTERS";
    /**
     * UNICAST_REPLIES_POLICY default decision.
     *
     * The NCP will automatically send an empty reply (containing no payload) for every unicast received.
     * */
    EzspDecisionId[EzspDecisionId["HOST_WILL_NOT_SUPPLY_REPLY"] = 32] = "HOST_WILL_NOT_SUPPLY_REPLY";
    /**
     * UNICAST_REPLIES_POLICY decision.
     *
     * The NCP will only send a reply if it receives a sendReply command from the Host.
     */
    EzspDecisionId[EzspDecisionId["HOST_WILL_SUPPLY_REPLY"] = 33] = "HOST_WILL_SUPPLY_REPLY";
    /**
     * POLL_HANDLER_POLICY default decision.
     *
     * Do not inform the Host when a child polls.
     */
    EzspDecisionId[EzspDecisionId["POLL_HANDLER_IGNORE"] = 48] = "POLL_HANDLER_IGNORE";
    /**
     * POLL_HANDLER_POLICY decision.
     *
     * Generate a pollHandler callback when a child polls.
     */
    EzspDecisionId[EzspDecisionId["POLL_HANDLER_CALLBACK"] = 49] = "POLL_HANDLER_CALLBACK";
    /**
     * MESSAGE_CONTENTS_IN_CALLBACK_POLICY default decision.
     *
     * Include only the message tag in the messageSentHandler callback.
     */
    EzspDecisionId[EzspDecisionId["MESSAGE_TAG_ONLY_IN_CALLBACK"] = 64] = "MESSAGE_TAG_ONLY_IN_CALLBACK";
    /**
     * MESSAGE_CONTENTS_IN_CALLBACK_POLICY decision.
     *
     * Include both the message tag and the message contents in the messageSentHandler callback.
     */
    EzspDecisionId[EzspDecisionId["MESSAGE_TAG_AND_CONTENTS_IN_CALLBACK"] = 65] = "MESSAGE_TAG_AND_CONTENTS_IN_CALLBACK";
    /**
     * TC_KEY_REQUEST_POLICY decision.
     *
     * When the Trust Center receives a request for a Trust Center link key, it will be ignored.
     */
    EzspDecisionId[EzspDecisionId["DENY_TC_KEY_REQUESTS"] = 80] = "DENY_TC_KEY_REQUESTS";
    /**
     * TC_KEY_REQUEST_POLICY decision.
     *
     * When the Trust Center receives a request for a Trust Center link key, it will reply to it with the corresponding key.
     */
    EzspDecisionId[EzspDecisionId["ALLOW_TC_KEY_REQUESTS_AND_SEND_CURRENT_KEY"] = 81] = "ALLOW_TC_KEY_REQUESTS_AND_SEND_CURRENT_KEY";
    /**
     * TC_KEY_REQUEST_POLICY decision.
     *
     * When the Trust Center receives a request for a Trust Center link key, it will generate a key to send to the joiner.
     * After generation, the key will be added to the transient key tabe and After verification, this key will be added into the link key table.
     */
    EzspDecisionId[EzspDecisionId["ALLOW_TC_KEY_REQUEST_AND_GENERATE_NEW_KEY"] = 82] = "ALLOW_TC_KEY_REQUEST_AND_GENERATE_NEW_KEY";
    /**
     * APP_KEY_REQUEST_POLICY decision.
     * When the Trust Center receives a request for an application link key, it will be ignored.
     * */
    EzspDecisionId[EzspDecisionId["DENY_APP_KEY_REQUESTS"] = 96] = "DENY_APP_KEY_REQUESTS";
    /**
     * APP_KEY_REQUEST_POLICY decision.
     *
     * When the Trust Center receives a request for an application link key, it will randomly generate a key and send it to both partners.
     */
    EzspDecisionId[EzspDecisionId["ALLOW_APP_KEY_REQUESTS"] = 97] = "ALLOW_APP_KEY_REQUESTS";
    /** Indicates that packet validate library checks are enabled on the NCP. */
    EzspDecisionId[EzspDecisionId["PACKET_VALIDATE_LIBRARY_CHECKS_ENABLED"] = 98] = "PACKET_VALIDATE_LIBRARY_CHECKS_ENABLED";
    /** Indicates that packet validate library checks are NOT enabled on the NCP. */
    EzspDecisionId[EzspDecisionId["PACKET_VALIDATE_LIBRARY_CHECKS_DISABLED"] = 99] = "PACKET_VALIDATE_LIBRARY_CHECKS_DISABLED";
})(EzspDecisionId || (exports.EzspDecisionId = EzspDecisionId = {}));
/**
 * This is the policy decision bitmask that controls the trust center decision strategies.
 * The bitmask is modified and extracted from the EzspDecisionId for supporting bitmask operations.
 * uint16_t
 */
var EzspDecisionBitmask;
(function (EzspDecisionBitmask) {
    /** Disallow joins and rejoins. */
    EzspDecisionBitmask[EzspDecisionBitmask["DEFAULT_CONFIGURATION"] = 0] = "DEFAULT_CONFIGURATION";
    /** Send the network key to all joining devices. */
    EzspDecisionBitmask[EzspDecisionBitmask["ALLOW_JOINS"] = 1] = "ALLOW_JOINS";
    /** Send the network key to all rejoining devices. */
    EzspDecisionBitmask[EzspDecisionBitmask["ALLOW_UNSECURED_REJOINS"] = 2] = "ALLOW_UNSECURED_REJOINS";
    /** Send the network key in the clear. */
    EzspDecisionBitmask[EzspDecisionBitmask["SEND_KEY_IN_CLEAR"] = 4] = "SEND_KEY_IN_CLEAR";
    /** Do nothing for unsecured rejoins. */
    EzspDecisionBitmask[EzspDecisionBitmask["IGNORE_UNSECURED_REJOINS"] = 8] = "IGNORE_UNSECURED_REJOINS";
    /** Allow joins if there is an entry in the transient key table. */
    EzspDecisionBitmask[EzspDecisionBitmask["JOINS_USE_INSTALL_CODE_KEY"] = 16] = "JOINS_USE_INSTALL_CODE_KEY";
    /** Delay sending the network key to a new joining device. */
    EzspDecisionBitmask[EzspDecisionBitmask["DEFER_JOINS"] = 32] = "DEFER_JOINS";
})(EzspDecisionBitmask || (exports.EzspDecisionBitmask = EzspDecisionBitmask = {}));
/** Identifies a policy. */
var EzspPolicyId;
(function (EzspPolicyId) {
    /** Controls trust center behavior. */
    EzspPolicyId[EzspPolicyId["TRUST_CENTER_POLICY"] = 0] = "TRUST_CENTER_POLICY";
    /** Controls how external binding modification requests are handled. */
    EzspPolicyId[EzspPolicyId["BINDING_MODIFICATION_POLICY"] = 1] = "BINDING_MODIFICATION_POLICY";
    /** Controls whether the Host supplies unicast replies. */
    EzspPolicyId[EzspPolicyId["UNICAST_REPLIES_POLICY"] = 2] = "UNICAST_REPLIES_POLICY";
    /** Controls whether pollHandler callbacks are generated. */
    EzspPolicyId[EzspPolicyId["POLL_HANDLER_POLICY"] = 3] = "POLL_HANDLER_POLICY";
    /** Controls whether the message contents are included in the messageSentHandler callback. */
    EzspPolicyId[EzspPolicyId["MESSAGE_CONTENTS_IN_CALLBACK_POLICY"] = 4] = "MESSAGE_CONTENTS_IN_CALLBACK_POLICY";
    /** Controls whether the Trust Center will respond to Trust Center link key requests. */
    EzspPolicyId[EzspPolicyId["TC_KEY_REQUEST_POLICY"] = 5] = "TC_KEY_REQUEST_POLICY";
    /** Controls whether the Trust Center will respond to application link key requests. */
    EzspPolicyId[EzspPolicyId["APP_KEY_REQUEST_POLICY"] = 6] = "APP_KEY_REQUEST_POLICY";
    /**
     * Controls whether Zigbee packets that appear invalid are automatically dropped by the stack.
     * A counter will be incremented when this occurs.
     */
    EzspPolicyId[EzspPolicyId["PACKET_VALIDATE_LIBRARY_POLICY"] = 7] = "PACKET_VALIDATE_LIBRARY_POLICY";
    /** Controls whether the stack will process ZLL messages. */
    EzspPolicyId[EzspPolicyId["ZLL_POLICY"] = 8] = "ZLL_POLICY";
    /**
     * Controls whether Trust Center (insecure) rejoins for devices using the well-known link key are accepted.
     * If rejoining using the well-known key is allowed,
     * it is disabled again after sli_zigbee_allow_tc_rejoins_using_well_known_key_timeout_sec seconds.
     */
    EzspPolicyId[EzspPolicyId["TC_REJOINS_USING_WELL_KNOWN_KEY_POLICY"] = 9] = "TC_REJOINS_USING_WELL_KNOWN_KEY_POLICY";
})(EzspPolicyId || (exports.EzspPolicyId = EzspPolicyId = {}));
/** Identifies a value. */
var EzspValueId;
(function (EzspValueId) {
    /** The contents of the node data stack token. */
    EzspValueId[EzspValueId["TOKEN_STACK_NODE_DATA"] = 0] = "TOKEN_STACK_NODE_DATA";
    /** The types of MAC passthrough messages that the host wishes to receive. */
    EzspValueId[EzspValueId["MAC_PASSTHROUGH_FLAGS"] = 1] = "MAC_PASSTHROUGH_FLAGS";
    /**
     * The source address used to filter legacy EmberNet messages when the
     * EMBER_MAC_PASSTHROUGH_EMBERNET_SOURCE flag is set in MAC_PASSTHROUGH_FLAGS.
     */
    EzspValueId[EzspValueId["EMBERNET_PASSTHROUGH_SOURCE_ADDRESS"] = 2] = "EMBERNET_PASSTHROUGH_SOURCE_ADDRESS";
    /** The amount in bytes (max 2^16) of available general purpose heap memory. */
    EzspValueId[EzspValueId["BUFFER_HEAP_FREE_SIZE"] = 3] = "BUFFER_HEAP_FREE_SIZE";
    /** Selects sending synchronous callbacks in ezsp-uart. */
    EzspValueId[EzspValueId["UART_SYNCH_CALLBACKS"] = 4] = "UART_SYNCH_CALLBACKS";
    /**
     * The maximum incoming transfer size for the local node.
     * Default value is set to 82 and does not use fragmentation. Sets the value in Node Descriptor.
     * To set, this takes the input of a uint8 array of length 2 where you pass the lower byte at index 0 and upper byte at index 1.
     */
    EzspValueId[EzspValueId["MAXIMUM_INCOMING_TRANSFER_SIZE"] = 5] = "MAXIMUM_INCOMING_TRANSFER_SIZE";
    /**
     * The maximum outgoing transfer size for the local node.
     * Default value is set to 82 and does not use fragmentation. Sets the value in Node Descriptor.
     * To set, this takes the input of a uint8 array of length 2 where you pass the lower byte at index 0 and upper byte at index 1.
     */
    EzspValueId[EzspValueId["MAXIMUM_OUTGOING_TRANSFER_SIZE"] = 6] = "MAXIMUM_OUTGOING_TRANSFER_SIZE";
    /** A bool indicating whether stack tokens are written to persistent storage as they change. */
    EzspValueId[EzspValueId["STACK_TOKEN_WRITING"] = 7] = "STACK_TOKEN_WRITING";
    /** A read-only value indicating whether the stack is currently performing a rejoin. */
    EzspValueId[EzspValueId["STACK_IS_PERFORMING_REJOIN"] = 8] = "STACK_IS_PERFORMING_REJOIN";
    /** A list of EmberMacFilterMatchData values. */
    EzspValueId[EzspValueId["MAC_FILTER_LIST"] = 9] = "MAC_FILTER_LIST";
    /** The Ember Extended Security Bitmask. */
    EzspValueId[EzspValueId["EXTENDED_SECURITY_BITMASK"] = 10] = "EXTENDED_SECURITY_BITMASK";
    /** The node short ID. */
    EzspValueId[EzspValueId["NODE_SHORT_ID"] = 11] = "NODE_SHORT_ID";
    /** The descriptor capability of the local node. Write only. */
    EzspValueId[EzspValueId["DESCRIPTOR_CAPABILITY"] = 12] = "DESCRIPTOR_CAPABILITY";
    /** The stack device request sequence number of the local node. */
    EzspValueId[EzspValueId["STACK_DEVICE_REQUEST_SEQUENCE_NUMBER"] = 13] = "STACK_DEVICE_REQUEST_SEQUENCE_NUMBER";
    /** Enable or disable radio hold-off. */
    EzspValueId[EzspValueId["RADIO_HOLD_OFF"] = 14] = "RADIO_HOLD_OFF";
    /** The flags field associated with the endpoint data. */
    EzspValueId[EzspValueId["ENDPOINT_FLAGS"] = 15] = "ENDPOINT_FLAGS";
    /** Enable/disable the Mfg security config key settings. */
    EzspValueId[EzspValueId["MFG_SECURITY_CONFIG"] = 16] = "MFG_SECURITY_CONFIG";
    /** Retrieves the version information from the stack on the NCP. */
    EzspValueId[EzspValueId["VERSION_INFO"] = 17] = "VERSION_INFO";
    // NEXT_HOST_REJOIN_REASON              = 0x12,// v13-, unused
    /**
     * This is the reason that the last rejoin took place. This value may only be retrieved, not set.
     * The rejoin may have been initiated by the stack (NCP) or the application (host).
     * If a host initiated a rejoin the reason will be set by default to EMBER_REJOIN_DUE_TO_APP_EVENT_1.
     * If the application wishes to denote its own rejoin reasons it can do so by calling
     * ezspSetValue(EMBER_VALUE_HOST_REJOIN_REASON, EMBER_REJOIN_DUE_TO_APP_EVENT_X).
     * X is a number corresponding to one of the app events defined.
     * If the NCP initiated a rejoin it will record this value internally for retrieval by ezspGetValue(REAL_REJOIN_REASON).
     */
    EzspValueId[EzspValueId["LAST_REJOIN_REASON"] = 19] = "LAST_REJOIN_REASON";
    /** The next Zigbee sequence number. */
    EzspValueId[EzspValueId["NEXT_ZIGBEE_SEQUENCE_NUMBER"] = 20] = "NEXT_ZIGBEE_SEQUENCE_NUMBER";
    /** CCA energy detect threshold for radio. */
    EzspValueId[EzspValueId["CCA_THRESHOLD"] = 21] = "CCA_THRESHOLD";
    /** The threshold value for a counter */
    EzspValueId[EzspValueId["SET_COUNTER_THRESHOLD"] = 23] = "SET_COUNTER_THRESHOLD";
    /** Resets all counters thresholds to 0xFF */
    EzspValueId[EzspValueId["RESET_COUNTER_THRESHOLDS"] = 24] = "RESET_COUNTER_THRESHOLDS";
    /** Clears all the counters */
    EzspValueId[EzspValueId["CLEAR_COUNTERS"] = 25] = "CLEAR_COUNTERS";
    /** The node's new certificate signed by the CA. */
    EzspValueId[EzspValueId["CERTIFICATE_283K1"] = 26] = "CERTIFICATE_283K1";
    /** The Certificate Authority's public key. */
    EzspValueId[EzspValueId["PUBLIC_KEY_283K1"] = 27] = "PUBLIC_KEY_283K1";
    /** The node's new static private key. */
    EzspValueId[EzspValueId["PRIVATE_KEY_283K1"] = 28] = "PRIVATE_KEY_283K1";
    // 0x1D?
    // 0x1E?
    // 0x1F?
    // 0x20?
    // 0x21?
    // 0x22?
    /** The NWK layer security frame counter value */
    EzspValueId[EzspValueId["NWK_FRAME_COUNTER"] = 35] = "NWK_FRAME_COUNTER";
    /** The APS layer security frame counter value. Managed by the stack. Users should not set these unless doing backup and restore. */
    EzspValueId[EzspValueId["APS_FRAME_COUNTER"] = 36] = "APS_FRAME_COUNTER";
    /** Sets the device type to use on the next rejoin using device type */
    EzspValueId[EzspValueId["RETRY_DEVICE_TYPE"] = 37] = "RETRY_DEVICE_TYPE";
    // 0x26?
    // 0x27?
    // 0x28?
    /** Setting this byte enables R21 behavior on the NCP. */
    EzspValueId[EzspValueId["ENABLE_R21_BEHAVIOR"] = 41] = "ENABLE_R21_BEHAVIOR";
    /** Configure the antenna mode(0-don't switch,1-primary,2-secondary,3-TX antenna diversity). */
    EzspValueId[EzspValueId["ANTENNA_MODE"] = 48] = "ANTENNA_MODE";
    /** Enable or disable packet traffic arbitration. */
    EzspValueId[EzspValueId["ENABLE_PTA"] = 49] = "ENABLE_PTA";
    /** Set packet traffic arbitration configuration options. */
    EzspValueId[EzspValueId["PTA_OPTIONS"] = 50] = "PTA_OPTIONS";
    /** Configure manufacturing library options (0-non-CSMA transmits,1-CSMA transmits). To be used with Manufacturing Library. */
    EzspValueId[EzspValueId["MFGLIB_OPTIONS"] = 51] = "MFGLIB_OPTIONS";
    /**
     * Sets the flag to use either negotiated power by link power delta (LPD) or fixed power value provided by user
     * while forming/joining a network for packet transmissions on sub-ghz interface. This is mainly for testing purposes.
     */
    EzspValueId[EzspValueId["USE_NEGOTIATED_POWER_BY_LPD"] = 52] = "USE_NEGOTIATED_POWER_BY_LPD";
    /** Set packet traffic arbitration PWM options. */
    EzspValueId[EzspValueId["PTA_PWM_OPTIONS"] = 53] = "PTA_PWM_OPTIONS";
    /** Set packet traffic arbitration directional priority pulse width in microseconds. */
    EzspValueId[EzspValueId["PTA_DIRECTIONAL_PRIORITY_PULSE_WIDTH"] = 54] = "PTA_DIRECTIONAL_PRIORITY_PULSE_WIDTH";
    /** Set packet traffic arbitration phy select timeout(ms). */
    EzspValueId[EzspValueId["PTA_PHY_SELECT_TIMEOUT"] = 55] = "PTA_PHY_SELECT_TIMEOUT";
    /** Configure the RX antenna mode: (0-do not switch; 1-primary; 2-secondary; 3-RX antenna diversity). */
    EzspValueId[EzspValueId["ANTENNA_RX_MODE"] = 56] = "ANTENNA_RX_MODE";
    /** Configure the timeout to wait for the network key before failing a join. Acceptable timeout range [3,255]. Value is in seconds. */
    EzspValueId[EzspValueId["NWK_KEY_TIMEOUT"] = 57] = "NWK_KEY_TIMEOUT";
    /**
     * The number of failed CSMA attempts due to failed CCA made by the MAC before continuing transmission with CCA disabled.
     * This is the same as calling the emberForceTxAfterFailedCca(uint8_t csmaAttempts) API. A value of 0 disables the feature.
     */
    EzspValueId[EzspValueId["FORCE_TX_AFTER_FAILED_CCA_ATTEMPTS"] = 58] = "FORCE_TX_AFTER_FAILED_CCA_ATTEMPTS";
    /**
     * The length of time, in seconds, that a trust center will store a transient link key that a device can use to join its network.
     * A transient key is added with a call to sl_zb_sec_man_import_transient_key. After the transient key is added,
     * it will be removed once this amount of time has passed. A joining device will not be able to use that key to join
     * until it is added again on the trust center.
     * The default value is 300 seconds (5 minutes).
     */
    EzspValueId[EzspValueId["TRANSIENT_KEY_TIMEOUT_S"] = 59] = "TRANSIENT_KEY_TIMEOUT_S";
    /** Cumulative energy usage metric since the last value reset of the coulomb counter plugin. Setting this value will reset the coulomb counter. */
    EzspValueId[EzspValueId["COULOMB_COUNTER_USAGE"] = 60] = "COULOMB_COUNTER_USAGE";
    /**
     * When scanning, configure the maximum number of beacons to store in cache.
     * Each beacon consumes on average 32-bytes (+ buffer overhead) in RAM.
     */
    EzspValueId[EzspValueId["MAX_BEACONS_TO_STORE"] = 61] = "MAX_BEACONS_TO_STORE";
    /** Set the mask to filter out unacceptable child timeout options on a router. */
    EzspValueId[EzspValueId["END_DEVICE_TIMEOUT_OPTIONS_MASK"] = 62] = "END_DEVICE_TIMEOUT_OPTIONS_MASK";
    /** The end device keep-alive mode supported by the parent. */
    EzspValueId[EzspValueId["END_DEVICE_KEEP_ALIVE_SUPPORT_MODE"] = 63] = "END_DEVICE_KEEP_ALIVE_SUPPORT_MODE";
    /**
     * Return the active radio config. Read only.
     * Values are 0: Default, 1: Antenna Diversity, 2: Co-Existence, 3: Antenna Diversity and Co-Existence.
     */
    EzspValueId[EzspValueId["ACTIVE_RADIO_CONFIG"] = 65] = "ACTIVE_RADIO_CONFIG";
    /** Return the number of seconds the network will remain open. A return value of 0 indicates that the network is closed. Read only. */
    EzspValueId[EzspValueId["NWK_OPEN_DURATION"] = 66] = "NWK_OPEN_DURATION";
    /**
     * Timeout in milliseconds to store entries in the transient device table.
     * If the devices are not authenticated before the timeout, the entry shall be purged
     */
    EzspValueId[EzspValueId["TRANSIENT_DEVICE_TIMEOUT"] = 67] = "TRANSIENT_DEVICE_TIMEOUT";
    /**
     * Return information about the key storage on an NCP.
     * Returns 0 if keys are in classic key storage, and 1 if they are located in PSA key storage. Read only.
     */
    EzspValueId[EzspValueId["KEY_STORAGE_VERSION"] = 68] = "KEY_STORAGE_VERSION";
    /** Return activation state about TC Delayed Join on an NCP.  A return value of 0 indicates that the feature is not activated. */
    EzspValueId[EzspValueId["DELAYED_JOIN_ACTIVATION"] = 69] = "DELAYED_JOIN_ACTIVATION";
    /**
     * v14+
     * The maximum number of NWK retries that will be attempted.
     */
    EzspValueId[EzspValueId["MAX_NWK_RETRIES"] = 70] = "MAX_NWK_RETRIES";
    /**
     * v14+
     * Policies for allowing/disallowing rejoins.
     */
    EzspValueId[EzspValueId["REJOIN_MODE"] = 71] = "REJOIN_MODE";
    /**
     * v17+
     * Controls whether devices must use an install code when joining.
     */
    EzspValueId[EzspValueId["JOIN_USE_INSTALL_CODE_ENABLE"] = 72] = "JOIN_USE_INSTALL_CODE_ENABLE";
})(EzspValueId || (exports.EzspValueId = EzspValueId = {}));
/**
 * Identifies a value based on specified characteristics.
 * Each set of characteristics is unique to that value and is specified during the call to get the extended value.
 *
 * uint8_t
 */
var EzspExtendedValueId;
(function (EzspExtendedValueId) {
    /** The flags field associated with the specified endpoint. Value is uint16_t */
    EzspExtendedValueId[EzspExtendedValueId["ENDPOINT_FLAGS"] = 0] = "ENDPOINT_FLAGS";
    /**
     * This is the reason for the node to leave the network as well as the device that told it to leave.
     * The leave reason is the 1st byte of the value while the node ID is the 2nd and 3rd byte.
     * If the leave was caused due to an API call rather than an over the air message, the node ID will be EMBER_UNKNOWN_NODE_ID (0xFFFD).
     */
    EzspExtendedValueId[EzspExtendedValueId["LAST_LEAVE_REASON"] = 1] = "LAST_LEAVE_REASON";
    /** This number of bytes of overhead required in the network frame for source routing to a particular destination. */
    EzspExtendedValueId[EzspExtendedValueId["GET_SOURCE_ROUTE_OVERHEAD"] = 2] = "GET_SOURCE_ROUTE_OVERHEAD";
    /** v17+ These values are current or boot-time metrics gathered by the memory manager/buffer manager. */
    EzspExtendedValueId[EzspExtendedValueId["MEMORY_USAGE_DATA"] = 3] = "MEMORY_USAGE_DATA";
})(EzspExtendedValueId || (exports.EzspExtendedValueId = EzspExtendedValueId = {}));
/** Flags associated with the endpoint data configured on the NCP. */
var EzspEndpointFlag;
(function (EzspEndpointFlag) {
    /** Indicates that the endpoint is disabled and NOT discoverable via ZDO. */
    EzspEndpointFlag[EzspEndpointFlag["DISABLED"] = 0] = "DISABLED";
    /** Indicates that the endpoint is enabled and discoverable via ZDO. */
    EzspEndpointFlag[EzspEndpointFlag["ENABLED"] = 1] = "ENABLED";
})(EzspEndpointFlag || (exports.EzspEndpointFlag = EzspEndpointFlag = {}));
/** Notes the last leave reason. uint8_t */
var EmberLeaveReason;
(function (EmberLeaveReason) {
    EmberLeaveReason[EmberLeaveReason["REASON_NONE"] = 0] = "REASON_NONE";
    EmberLeaveReason[EmberLeaveReason["DUE_TO_NWK_LEAVE_MESSAGE"] = 1] = "DUE_TO_NWK_LEAVE_MESSAGE";
    EmberLeaveReason[EmberLeaveReason["DUE_TO_APS_REMOVE_MESSAGE"] = 2] = "DUE_TO_APS_REMOVE_MESSAGE";
    // Currently, the stack does not process the ZDO leave message since it is optional.
    EmberLeaveReason[EmberLeaveReason["DUE_TO_ZDO_LEAVE_MESSAGE"] = 3] = "DUE_TO_ZDO_LEAVE_MESSAGE";
    EmberLeaveReason[EmberLeaveReason["DUE_TO_ZLL_TOUCHLINK"] = 4] = "DUE_TO_ZLL_TOUCHLINK";
    EmberLeaveReason[EmberLeaveReason["DUE_TO_APP_EVENT_1"] = 255] = "DUE_TO_APP_EVENT_1";
})(EmberLeaveReason || (exports.EmberLeaveReason = EmberLeaveReason = {}));
/** Notes the last rejoin reason. uint8_t */
var EmberRejoinReason;
(function (EmberRejoinReason) {
    EmberRejoinReason[EmberRejoinReason["REASON_NONE"] = 0] = "REASON_NONE";
    EmberRejoinReason[EmberRejoinReason["DUE_TO_NWK_KEY_UPDATE"] = 1] = "DUE_TO_NWK_KEY_UPDATE";
    EmberRejoinReason[EmberRejoinReason["DUE_TO_LEAVE_MESSAGE"] = 2] = "DUE_TO_LEAVE_MESSAGE";
    EmberRejoinReason[EmberRejoinReason["DUE_TO_NO_PARENT"] = 3] = "DUE_TO_NO_PARENT";
    EmberRejoinReason[EmberRejoinReason["DUE_TO_ZLL_TOUCHLINK"] = 4] = "DUE_TO_ZLL_TOUCHLINK";
    EmberRejoinReason[EmberRejoinReason["DUE_TO_END_DEVICE_REBOOT"] = 5] = "DUE_TO_END_DEVICE_REBOOT";
    // App. Framework events
    // 0xA0 - 0xE0
    // See af.h for a subset of defined rejoin reasons
    // Customer-defined Events
    //   These are numbered down from 0xFF so their assigned values
    //   need not change if more application events are needed.
    EmberRejoinReason[EmberRejoinReason["DUE_TO_APP_EVENT_5"] = 251] = "DUE_TO_APP_EVENT_5";
    EmberRejoinReason[EmberRejoinReason["DUE_TO_APP_EVENT_4"] = 252] = "DUE_TO_APP_EVENT_4";
    EmberRejoinReason[EmberRejoinReason["DUE_TO_APP_EVENT_3"] = 253] = "DUE_TO_APP_EVENT_3";
    EmberRejoinReason[EmberRejoinReason["DUE_TO_APP_EVENT_2"] = 254] = "DUE_TO_APP_EVENT_2";
    EmberRejoinReason[EmberRejoinReason["DUE_TO_APP_EVENT_1"] = 255] = "DUE_TO_APP_EVENT_1";
})(EmberRejoinReason || (exports.EmberRejoinReason = EmberRejoinReason = {}));
/** Manufacturing token IDs used by ezspGetMfgToken(). */
var EzspMfgTokenId;
(function (EzspMfgTokenId) {
    /** Custom version (2 bytes). */
    EzspMfgTokenId[EzspMfgTokenId["CUSTOM_VERSION"] = 0] = "CUSTOM_VERSION";
    /** Manufacturing string (16 bytes). */
    EzspMfgTokenId[EzspMfgTokenId["STRING"] = 1] = "STRING";
    /** Board name (16 bytes). */
    EzspMfgTokenId[EzspMfgTokenId["BOARD_NAME"] = 2] = "BOARD_NAME";
    /** Manufacturing ID (2 bytes). */
    EzspMfgTokenId[EzspMfgTokenId["MANUF_ID"] = 3] = "MANUF_ID";
    /** Radio configuration (2 bytes). */
    EzspMfgTokenId[EzspMfgTokenId["PHY_CONFIG"] = 4] = "PHY_CONFIG";
    /** Bootload AES key (16 bytes). */
    EzspMfgTokenId[EzspMfgTokenId["BOOTLOAD_AES_KEY"] = 5] = "BOOTLOAD_AES_KEY";
    /** ASH configuration (40 bytes). */
    EzspMfgTokenId[EzspMfgTokenId["ASH_CONFIG"] = 6] = "ASH_CONFIG";
    /** EZSP storage (8 bytes). */
    EzspMfgTokenId[EzspMfgTokenId["EZSP_STORAGE"] = 7] = "EZSP_STORAGE";
    /**
     * Radio calibration data (64 bytes). 4 bytes are stored for each of the 16 channels.
     * This token is not stored in the Flash Information Area. It is updated by the stack each time a calibration is performed.
     */
    EzspMfgTokenId[EzspMfgTokenId["STACK_CAL_DATA"] = 8] = "STACK_CAL_DATA";
    /** Certificate Based Key Exchange (CBKE) data (92 bytes). */
    EzspMfgTokenId[EzspMfgTokenId["CBKE_DATA"] = 9] = "CBKE_DATA";
    /** Installation code (20 bytes). */
    EzspMfgTokenId[EzspMfgTokenId["INSTALLATION_CODE"] = 10] = "INSTALLATION_CODE";
    /**
     * Radio channel filter calibration data (1 byte).
     * This token is not stored in the Flash Information Area. It is updated by the stack each time a calibration is performed.
     */
    EzspMfgTokenId[EzspMfgTokenId["STACK_CAL_FILTER"] = 11] = "STACK_CAL_FILTER";
    /** Custom EUI64 MAC address (8 bytes). */
    EzspMfgTokenId[EzspMfgTokenId["CUSTOM_EUI_64"] = 12] = "CUSTOM_EUI_64";
    /** CTUNE value (2 byte). */
    EzspMfgTokenId[EzspMfgTokenId["CTUNE"] = 13] = "CTUNE";
})(EzspMfgTokenId || (exports.EzspMfgTokenId = EzspMfgTokenId = {}));
var EzspSleepMode;
(function (EzspSleepMode) {
    /** Processor idle. */
    EzspSleepMode[EzspSleepMode["IDLE"] = 0] = "IDLE";
    /** Wake on interrupt or timer. */
    EzspSleepMode[EzspSleepMode["DEEP_SLEEP"] = 1] = "DEEP_SLEEP";
    /** Wake on interrupt only. */
    EzspSleepMode[EzspSleepMode["POWER_DOWN"] = 2] = "POWER_DOWN";
    /** Reserved */
    EzspSleepMode[EzspSleepMode["RESERVED_SLEEP"] = 3] = "RESERVED_SLEEP";
})(EzspSleepMode || (exports.EzspSleepMode = EzspSleepMode = {}));
/** v17+ */
var EzspMemoryUsageData;
(function (EzspMemoryUsageData) {
    /** Gets the total available heap size in bytes */
    EzspMemoryUsageData[EzspMemoryUsageData["TOTAL_HEAP_SIZE"] = 1] = "TOTAL_HEAP_SIZE";
    /** Gets the used heap size in bytes at the time requested */
    EzspMemoryUsageData[EzspMemoryUsageData["CURRENT_USED_HEAP_SIZE"] = 2] = "CURRENT_USED_HEAP_SIZE";
    /** Gets the "high watermark" of the heap (the highest the heap has been) in bytes at the time requested */
    EzspMemoryUsageData[EzspMemoryUsageData["CURRENT_HEAP_HIGH_WATERMARK"] = 3] = "CURRENT_HEAP_HIGH_WATERMARK";
    /** Gets the used heap size in bytes at the time after sl_system_init */
    EzspMemoryUsageData[EzspMemoryUsageData["INIT_USED_HEAP_SIZE"] = 4] = "INIT_USED_HEAP_SIZE";
    /** Gets the "high watermark" of the heap (the highest the heap has been) in bytes at the time after sl_system_init */
    EzspMemoryUsageData[EzspMemoryUsageData["INIT_HEAP_HIGH_WATERMARK"] = 5] = "INIT_HEAP_HIGH_WATERMARK";
})(EzspMemoryUsageData || (exports.EzspMemoryUsageData = EzspMemoryUsageData = {}));
//# sourceMappingURL=enums.js.map