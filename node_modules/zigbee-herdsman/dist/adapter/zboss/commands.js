"use strict";
/* v8 ignore start */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRAMES = exports.ZBOSS_COMMAND_ID_TO_ZDO_RSP_CLUSTER_ID = exports.ZDO_REQ_CLUSTER_ID_TO_ZBOSS_COMMAND_ID = void 0;
const enums_1 = require("../../zspec/zcl/definition/enums");
const zdo_1 = require("../../zspec/zdo");
const enums_2 = require("./enums");
exports.ZDO_REQ_CLUSTER_ID_TO_ZBOSS_COMMAND_ID = {
    [zdo_1.ClusterId.NETWORK_ADDRESS_REQUEST]: enums_2.CommandId.ZDO_NWK_ADDR_REQ,
    [zdo_1.ClusterId.IEEE_ADDRESS_REQUEST]: enums_2.CommandId.ZDO_IEEE_ADDR_REQ,
    [zdo_1.ClusterId.POWER_DESCRIPTOR_REQUEST]: enums_2.CommandId.ZDO_POWER_DESC_REQ,
    [zdo_1.ClusterId.NODE_DESCRIPTOR_REQUEST]: enums_2.CommandId.ZDO_NODE_DESC_REQ,
    [zdo_1.ClusterId.SIMPLE_DESCRIPTOR_REQUEST]: enums_2.CommandId.ZDO_SIMPLE_DESC_REQ,
    [zdo_1.ClusterId.ACTIVE_ENDPOINTS_REQUEST]: enums_2.CommandId.ZDO_ACTIVE_EP_REQ,
    [zdo_1.ClusterId.MATCH_DESCRIPTORS_REQUEST]: enums_2.CommandId.ZDO_MATCH_DESC_REQ,
    [zdo_1.ClusterId.BIND_REQUEST]: enums_2.CommandId.ZDO_BIND_REQ,
    [zdo_1.ClusterId.UNBIND_REQUEST]: enums_2.CommandId.ZDO_UNBIND_REQ,
    [zdo_1.ClusterId.LEAVE_REQUEST]: enums_2.CommandId.ZDO_MGMT_LEAVE_REQ,
    [zdo_1.ClusterId.PERMIT_JOINING_REQUEST]: enums_2.CommandId.ZDO_PERMIT_JOINING_REQ,
    [zdo_1.ClusterId.BINDING_TABLE_REQUEST]: enums_2.CommandId.ZDO_MGMT_BIND_REQ,
    [zdo_1.ClusterId.LQI_TABLE_REQUEST]: enums_2.CommandId.ZDO_MGMT_LQI_REQ,
    // [ZdoClusterId.ROUTING_TABLE_REQUEST]: CommandId.ZDO_MGMT_RTG_REQ,
    [zdo_1.ClusterId.NWK_UPDATE_REQUEST]: enums_2.CommandId.ZDO_MGMT_NWK_UPDATE_REQ,
};
exports.ZBOSS_COMMAND_ID_TO_ZDO_RSP_CLUSTER_ID = {
    [enums_2.CommandId.ZDO_NWK_ADDR_REQ]: zdo_1.ClusterId.NETWORK_ADDRESS_RESPONSE,
    [enums_2.CommandId.ZDO_IEEE_ADDR_REQ]: zdo_1.ClusterId.IEEE_ADDRESS_RESPONSE,
    [enums_2.CommandId.ZDO_POWER_DESC_REQ]: zdo_1.ClusterId.POWER_DESCRIPTOR_RESPONSE,
    [enums_2.CommandId.ZDO_NODE_DESC_REQ]: zdo_1.ClusterId.NODE_DESCRIPTOR_RESPONSE,
    [enums_2.CommandId.ZDO_SIMPLE_DESC_REQ]: zdo_1.ClusterId.SIMPLE_DESCRIPTOR_RESPONSE,
    [enums_2.CommandId.ZDO_ACTIVE_EP_REQ]: zdo_1.ClusterId.ACTIVE_ENDPOINTS_RESPONSE,
    [enums_2.CommandId.ZDO_MATCH_DESC_REQ]: zdo_1.ClusterId.MATCH_DESCRIPTORS_RESPONSE,
    [enums_2.CommandId.ZDO_BIND_REQ]: zdo_1.ClusterId.BIND_RESPONSE,
    [enums_2.CommandId.ZDO_UNBIND_REQ]: zdo_1.ClusterId.UNBIND_RESPONSE,
    [enums_2.CommandId.ZDO_MGMT_LEAVE_REQ]: zdo_1.ClusterId.LEAVE_RESPONSE,
    [enums_2.CommandId.ZDO_PERMIT_JOINING_REQ]: zdo_1.ClusterId.PERMIT_JOINING_RESPONSE,
    [enums_2.CommandId.ZDO_MGMT_BIND_REQ]: zdo_1.ClusterId.BINDING_TABLE_RESPONSE,
    [enums_2.CommandId.ZDO_MGMT_LQI_REQ]: zdo_1.ClusterId.LQI_TABLE_RESPONSE,
    // [CommandId.ZDO_MGMT_RTG_REQ]: ZdoClusterId.ROUTING_TABLE_RESPONSE,
    [enums_2.CommandId.ZDO_MGMT_NWK_UPDATE_REQ]: zdo_1.ClusterId.NWK_UPDATE_RESPONSE,
    [enums_2.CommandId.ZDO_DEV_ANNCE_IND]: zdo_1.ClusterId.END_DEVICE_ANNOUNCE,
};
const commonResponse = [
    { name: "category", type: enums_1.DataType.UINT8, typed: enums_2.StatusCategory },
    { name: "status", type: enums_1.DataType.UINT8, typed: [enums_2.StatusCodeGeneric, enums_2.StatusCodeAPS, enums_2.StatusCodeCBKE] },
];
exports.FRAMES = {
    // ------------------------------------------
    // NCP config
    // ------------------------------------------
    // Requests firmware, stack and protocol versions from NCP
    [enums_2.CommandId.GET_MODULE_VERSION]: {
        request: [],
        response: [
            ...commonResponse,
            { name: "fwVersion", type: enums_1.DataType.UINT32 },
            { name: "stackVersion", type: enums_1.DataType.UINT32 },
            { name: "protocolVersion", type: enums_1.DataType.UINT32 },
        ],
    },
    // Force NCP module reboot
    [enums_2.CommandId.NCP_RESET]: {
        request: [{ name: "options", type: enums_1.DataType.UINT8, typed: enums_2.ResetOptions }],
        response: [...commonResponse],
    },
    // Requests current Zigbee role of the local device
    [enums_2.CommandId.GET_ZIGBEE_ROLE]: {
        request: [],
        response: [...commonResponse, { name: "role", type: enums_1.DataType.UINT8, typed: enums_2.DeviceType }],
    },
    // Set Zigbee role of the local device
    [enums_2.CommandId.SET_ZIGBEE_ROLE]: {
        request: [{ name: "role", type: enums_1.DataType.UINT8, typed: enums_2.DeviceType }],
        response: [...commonResponse],
    },
    // Get Zigbee channels page and mask of the local device
    [enums_2.CommandId.GET_ZIGBEE_CHANNEL_MASK]: {
        request: [],
        response: [
            ...commonResponse,
            { name: "len", type: enums_1.DataType.UINT8 },
            {
                name: "channels",
                type: enums_2.BuffaloZBOSSDataType.LIST_TYPED,
                typed: [
                    { name: "page", type: enums_1.DataType.UINT8 },
                    { name: "mask", type: enums_1.DataType.UINT32 },
                ],
            },
        ],
    },
    // Set Zigbee channels page and mask
    [enums_2.CommandId.SET_ZIGBEE_CHANNEL_MASK]: {
        request: [
            { name: "page", type: enums_1.DataType.UINT8 },
            { name: "mask", type: enums_1.DataType.UINT32 },
        ],
        response: [...commonResponse],
    },
    // Get Zigbee channel
    [enums_2.CommandId.GET_ZIGBEE_CHANNEL]: {
        request: [],
        response: [...commonResponse, { name: "page", type: enums_1.DataType.UINT8 }, { name: "channel", type: enums_1.DataType.UINT8 }],
    },
    // Requests current short PAN ID
    [enums_2.CommandId.GET_PAN_ID]: {
        request: [],
        response: [...commonResponse, { name: "panID", type: enums_1.DataType.UINT16 }],
    },
    // Set short PAN ID
    [enums_2.CommandId.SET_PAN_ID]: {
        request: [{ name: "panID", type: enums_1.DataType.UINT16 }],
        response: [...commonResponse],
    },
    // Requests local IEEE address
    [enums_2.CommandId.GET_LOCAL_IEEE_ADDR]: {
        request: [{ name: "mac", type: enums_1.DataType.UINT8 }],
        response: [...commonResponse, { name: "mac", type: enums_1.DataType.UINT8 }, { name: "ieee", type: enums_1.DataType.IEEE_ADDR }],
    },
    // Set local IEEE address
    [enums_2.CommandId.SET_LOCAL_IEEE_ADDR]: {
        request: [
            { name: "mac", type: enums_1.DataType.UINT8 },
            { name: "ieee", type: enums_1.DataType.IEEE_ADDR },
        ],
        response: [...commonResponse],
    },
    // Get Transmit Power
    [enums_2.CommandId.GET_TX_POWER]: {
        request: [],
        response: [...commonResponse, { name: "txPower", type: enums_1.DataType.UINT8 }],
    },
    // Set Transmit Power
    [enums_2.CommandId.SET_TX_POWER]: {
        request: [{ name: "txPower", type: enums_1.DataType.UINT8 }],
        response: [...commonResponse, { name: "txPower", type: enums_1.DataType.UINT8 }],
    },
    // Requests RxOnWhenIdle PIB attribute
    [enums_2.CommandId.GET_RX_ON_WHEN_IDLE]: {
        request: [],
        response: [...commonResponse, { name: "rxOn", type: enums_1.DataType.UINT8 }],
    },
    // Sets Rx On When Idle PIB attribute
    [enums_2.CommandId.SET_RX_ON_WHEN_IDLE]: {
        request: [{ name: "rxOn", type: enums_1.DataType.UINT8 }],
        response: [...commonResponse],
    },
    // Requests current join status of the device
    [enums_2.CommandId.GET_JOINED]: {
        request: [],
        response: [...commonResponse, { name: "joined", type: enums_1.DataType.UINT8 }],
    },
    // Requests current authentication status of the device
    [enums_2.CommandId.GET_AUTHENTICATED]: {
        request: [],
        response: [...commonResponse, { name: "authenticated", type: enums_1.DataType.UINT8 }],
    },
    // Requests current End Device timeout
    [enums_2.CommandId.GET_ED_TIMEOUT]: {
        request: [],
        response: [...commonResponse, { name: "timeout", type: enums_1.DataType.UINT8 }],
    },
    // Sets End Device timeout
    [enums_2.CommandId.SET_ED_TIMEOUT]: {
        request: [{ name: "timeout", type: enums_1.DataType.UINT8 }],
        response: [...commonResponse],
    },
    // Set NWK Key
    [enums_2.CommandId.SET_NWK_KEY]: {
        request: [
            { name: "nwkKey", type: enums_1.DataType.SEC_KEY },
            { name: "index", type: enums_1.DataType.UINT8 },
        ],
        response: [...commonResponse],
    },
    // Get list of NWK keys
    [enums_2.CommandId.GET_NWK_KEYS]: {
        request: [],
        response: [
            ...commonResponse,
            { name: "nwkKey1", type: enums_1.DataType.SEC_KEY },
            { name: "index1", type: enums_1.DataType.UINT8 },
            { name: "nwkKey2", type: enums_1.DataType.SEC_KEY },
            { name: "index2", type: enums_1.DataType.UINT8 },
            { name: "nwkKey3", type: enums_1.DataType.SEC_KEY },
            { name: "index3", type: enums_1.DataType.UINT8 },
        ],
    },
    // Get APS key by IEEE
    [enums_2.CommandId.GET_APS_KEY_BY_IEEE]: {
        request: [{ name: "ieee", type: enums_1.DataType.IEEE_ADDR }],
        response: [...commonResponse, { name: "apsKey", type: enums_1.DataType.SEC_KEY }],
    },
    // Get Parent short address
    [enums_2.CommandId.GET_PARENT_ADDRESS]: {
        request: [],
        response: [...commonResponse, { name: "parent", type: enums_1.DataType.UINT16 }],
    },
    // Get Extended Pan ID
    [enums_2.CommandId.GET_EXTENDED_PAN_ID]: {
        request: [],
        response: [...commonResponse, { name: "extendedPanID", type: enums_2.BuffaloZBOSSDataType.EXTENDED_PAN_ID }],
    },
    // Get Coordinator version
    [enums_2.CommandId.GET_COORDINATOR_VERSION]: {
        request: [],
        response: [...commonResponse, { name: "version", type: enums_1.DataType.UINT8 }],
    },
    // Get Short Address of the device
    [enums_2.CommandId.GET_SHORT_ADDRESS]: {
        request: [],
        response: [...commonResponse, { name: "nwk", type: enums_1.DataType.UINT16 }],
    },
    // Get Trust Center IEEE Address
    [enums_2.CommandId.GET_TRUST_CENTER_ADDRESS]: {
        request: [],
        response: [...commonResponse, { name: "ieee", type: enums_1.DataType.IEEE_ADDR }],
    },
    // Device Reset Indication with reset source
    [enums_2.CommandId.NCP_RESET_IND]: {
        request: [],
        response: [...commonResponse],
        indication: [{ name: "source", type: enums_1.DataType.UINT8, typed: enums_2.ResetSource }],
    },
    // Writes NVRAM datasets
    [enums_2.CommandId.NVRAM_WRITE]: {
        request: [
            { name: "len", type: enums_1.DataType.UINT8 },
            {
                name: "data",
                type: enums_1.BuffaloZclDataType.LIST_UINT8,
                options: (payload, options) => {
                    options.length = payload.len;
                },
            },
        ],
        response: [...commonResponse],
    },
    // Reads an NVRAM dataset
    [enums_2.CommandId.NVRAM_READ]: {
        request: [{ name: "type", type: enums_1.DataType.UINT8 }],
        response: [
            ...commonResponse,
            { name: "nvVersion", type: enums_1.DataType.UINT16 },
            { name: "type", type: enums_1.DataType.UINT16 },
            { name: "version", type: enums_1.DataType.UINT16 },
            { name: "len", type: enums_1.DataType.UINT16 },
            {
                name: "data",
                type: enums_1.BuffaloZclDataType.LIST_UINT8,
                options: (payload, options) => {
                    options.length = payload.len;
                },
            },
        ],
    },
    // Erases all datasets in NVRAM
    [enums_2.CommandId.NVRAM_ERASE]: {
        request: [],
        response: [...commonResponse],
    },
    // Erases all datasets in NVRAM except ZB_NVRAM_RESERVED, ZB_IB_COUNTERS and application datasets
    [enums_2.CommandId.NVRAM_CLEAR]: {
        request: [],
        response: [...commonResponse],
    },
    // Sets TC Policy
    [enums_2.CommandId.SET_TC_POLICY]: {
        request: [
            { name: "type", type: enums_1.DataType.UINT16, typed: enums_2.PolicyType },
            { name: "value", type: enums_1.DataType.UINT8 },
        ],
        response: [...commonResponse],
    },
    // Sets an extended PAN ID
    [enums_2.CommandId.SET_EXTENDED_PAN_ID]: {
        request: [{ name: "extendedPanID", type: enums_2.BuffaloZBOSSDataType.EXTENDED_PAN_ID }],
        response: [...commonResponse],
    },
    // Sets the maximum number of children
    [enums_2.CommandId.SET_MAX_CHILDREN]: {
        request: [{ name: "children", type: enums_1.DataType.UINT8 }],
        response: [...commonResponse],
    },
    // Gets the maximum number of children
    [enums_2.CommandId.GET_MAX_CHILDREN]: {
        request: [],
        response: [...commonResponse, { name: "children", type: enums_1.DataType.UINT8 }],
    },
    // ------------------------------------------
    // Application Framework
    // ------------------------------------------
    // Add or update Simple descriptor for a specified endpoint
    [enums_2.CommandId.AF_SET_SIMPLE_DESC]: {
        request: [
            { name: "endpoint", type: enums_1.DataType.UINT8 },
            { name: "profileID", type: enums_1.DataType.UINT16 },
            { name: "deviceID", type: enums_1.DataType.UINT16 },
            { name: "version", type: enums_1.DataType.UINT8 },
            { name: "inputClusterCount", type: enums_1.DataType.UINT8 },
            { name: "outputClusterCount", type: enums_1.DataType.UINT8 },
            {
                name: "inputClusters",
                type: enums_1.BuffaloZclDataType.LIST_UINT16,
                options: (payload, options) => {
                    options.length = payload.inputClusterCount;
                },
            },
            {
                name: "outputClusters",
                type: enums_1.BuffaloZclDataType.LIST_UINT16,
                options: (payload, options) => {
                    options.length = payload.outputClusterCount;
                },
            },
        ],
        response: [...commonResponse],
    },
    // Delete Simple Descriptor for a specified endpoint
    [enums_2.CommandId.AF_DEL_SIMPLE_DESC]: {
        request: [{ name: "endpoint", type: enums_1.DataType.UINT8 }],
        response: [...commonResponse],
    },
    // Set Node Descriptor
    [enums_2.CommandId.AF_SET_NODE_DESC]: {
        request: [
            { name: "type", type: enums_1.DataType.UINT8, typed: enums_2.DeviceType },
            { name: "macCapabilities", type: enums_1.DataType.UINT8 },
            { name: "manufacturerCode", type: enums_1.DataType.UINT16 },
        ],
        response: [...commonResponse],
    },
    // Set power descriptor for the device
    [enums_2.CommandId.AF_SET_POWER_DESC]: {
        request: [
            { name: "powerMode", type: enums_1.DataType.UINT8 },
            { name: "powerSources", type: enums_1.DataType.UINT8 },
            { name: "powerSource", type: enums_1.DataType.UINT8 },
            { name: "powerSourceLevel", type: enums_1.DataType.UINT8 },
        ],
        response: [...commonResponse],
    },
    // ------------------------------------------
    // Zigbee Device Object
    // ------------------------------------------
    // Request for a remote device NWK address
    // [CommandId.ZDO_NWK_ADDR_REQ]: {
    //     request: [
    //         {name: 'nwk', type: DataType.UINT16},
    //         {name: 'ieee', type: DataType.IEEE_ADDR},
    //         {name: 'type', type: DataType.UINT8},
    //         {name: 'startIndex', type: DataType.UINT8},
    //     ],
    //     response: [
    //         ...commonResponse,
    //         {name: 'ieee', type: DataType.IEEE_ADDR},
    //         {name: 'nwk', type: DataType.UINT16},
    //         {name: 'num', type: DataType.UINT8, condition: (payload, buffalo) => buffalo && buffalo.isMore()},
    //         {name: 'startIndex', type: DataType.UINT8, condition: (payload, buffalo) => buffalo && buffalo.isMore()},
    //         {name: 'nwks', type: BuffaloZclDataType.LIST_UINT16, options: (payload, options) => (options.length = payload.num)},
    //     ],
    // },
    // Request for a remote device IEEE address
    // [CommandId.ZDO_IEEE_ADDR_REQ]: {
    //     request: [
    //         {name: 'destNwk', type: DataType.UINT16},
    //         {name: 'nwk', type: DataType.UINT16},
    //         {name: 'type', type: DataType.UINT8},
    //         {name: 'startIndex', type: DataType.UINT8},
    //     ],
    //     response: [
    //         ...commonResponse,
    //         {name: 'ieee', type: DataType.IEEE_ADDR},
    //         {name: 'nwk', type: DataType.UINT16},
    //         {name: 'num', type: DataType.UINT8, condition: (payload, buffalo) => buffalo && buffalo.isMore()},
    //         {name: 'startIndex', type: DataType.UINT8, condition: (payload, buffalo) => buffalo && buffalo.isMore()},
    //         {name: 'nwks', type: BuffaloZclDataType.LIST_UINT16, options: (payload, options) => (options.length = payload.num)},
    //     ],
    // },
    // Get the Power Descriptor from a remote device
    // [CommandId.ZDO_POWER_DESC_REQ]: {
    //     request: [{name: 'nwk', type: DataType.UINT16}],
    //     response: [...commonResponse, {name: 'powerDescriptor', type: DataType.UINT16}, {name: 'nwk', type: DataType.UINT16}],
    // },
    // Get the Node Descriptor from a remote device
    // [CommandId.ZDO_NODE_DESC_REQ]: {
    //     request: [{name: 'nwk', type: DataType.UINT16}],
    //     response: [
    //         ...commonResponse,
    //         {name: 'flags', type: DataType.UINT16},
    //         {name: 'macCapabilities', type: DataType.UINT8},
    //         {name: 'manufacturerCode', type: DataType.UINT16},
    //         {name: 'bufferSize', type: DataType.UINT8},
    //         {name: 'incomingSize', type: DataType.UINT16},
    //         {name: 'serverMask', type: DataType.UINT16},
    //         {name: 'outgoingSize', type: DataType.UINT16},
    //         {name: 'descriptorCapabilities', type: DataType.UINT8},
    //         {name: 'nwk', type: DataType.UINT16},
    //     ],
    // },
    // Get the Simple Descriptor from a remote device
    // [CommandId.ZDO_SIMPLE_DESC_REQ]: {
    //     request: [
    //         {name: 'nwk', type: DataType.UINT16},
    //         {name: 'endpoint', type: DataType.UINT8},
    //     ],
    //     response: [
    //         ...commonResponse,
    //         {name: 'endpoint', type: DataType.UINT8},
    //         {name: 'profileID', type: DataType.UINT16},
    //         {name: 'deviceID', type: DataType.UINT16},
    //         {name: 'version', type: DataType.UINT8},
    //         {name: 'inputClusterCount', type: DataType.UINT8},
    //         {name: 'outputClusterCount', type: DataType.UINT8},
    //         {
    //             name: 'inputClusters',
    //             type: BuffaloZclDataType.LIST_UINT16,
    //             options: (payload, options) => (options.length = payload.inputClusterCount),
    //         },
    //         {
    //             name: 'outputClusters',
    //             type: BuffaloZclDataType.LIST_UINT16,
    //             options: (payload, options) => (options.length = payload.outputClusterCount),
    //         },
    //         {name: 'nwk', type: DataType.UINT16},
    //     ],
    // },
    // Get a list of Active Endpoints from a remote device
    // [CommandId.ZDO_ACTIVE_EP_REQ]: {
    //     request: [{name: 'nwk', type: DataType.UINT16}],
    //     response: [
    //         ...commonResponse,
    //         {name: 'len', type: DataType.UINT8},
    //         {name: 'endpoints', type: BuffaloZclDataType.LIST_UINT8, options: (payload, options) => (options.length = payload.len)},
    //         {name: 'nwk', type: DataType.UINT16},
    //     ],
    // },
    // Send Match Descriptor request to a remote device
    // [CommandId.ZDO_MATCH_DESC_REQ]: {
    //     request: [
    //         {name: 'nwk', type: DataType.UINT16},
    //         {name: 'profileID', type: DataType.UINT16},
    //         {name: 'inputClusterCount', type: DataType.UINT8},
    //         {name: 'outputClusterCount', type: DataType.UINT8},
    //         {
    //             name: 'inputClusters',
    //             type: BuffaloZclDataType.LIST_UINT16,
    //             options: (payload, options) => (options.length = payload.inputClusterCount),
    //         },
    //         {
    //             name: 'outputClusters',
    //             type: BuffaloZclDataType.LIST_UINT16,
    //             options: (payload, options) => (options.length = payload.outputClusterCount),
    //         },
    //     ],
    //     response: [
    //         ...commonResponse,
    //         {name: 'len', type: DataType.UINT8},
    //         {name: 'endpoints', type: BuffaloZclDataType.LIST_UINT8, options: (payload, options) => (options.length = payload.len)},
    //         {name: 'nwk', type: DataType.UINT16},
    //     ],
    // },
    // Send Bind request to a remote device
    // [CommandId.ZDO_BIND_REQ]: {
    //     request: [
    //         {name: 'target', type: DataType.UINT16},
    //         {name: 'srcIeee', type: DataType.IEEE_ADDR},
    //         {name: 'srcEP', type: DataType.UINT8},
    //         {name: 'clusterID', type: DataType.UINT16},
    //         {name: 'addrMode', type: DataType.UINT8},
    //         {name: 'dstIeee', type: DataType.IEEE_ADDR},
    //         {name: 'dstEP', type: DataType.UINT8},
    //     ],
    //     response: [...commonResponse],
    // },
    // Send Unbind request to a remote device
    // [CommandId.ZDO_UNBIND_REQ]: {
    //     request: [
    //         {name: 'target', type: DataType.UINT16},
    //         {name: 'srcIeee', type: DataType.IEEE_ADDR},
    //         {name: 'srcEP', type: DataType.UINT8},
    //         {name: 'clusterID', type: DataType.UINT16},
    //         {name: 'addrMode', type: DataType.UINT8},
    //         {name: 'dstIeee', type: DataType.IEEE_ADDR},
    //         {name: 'dstEP', type: DataType.UINT8},
    //     ],
    //     response: [...commonResponse],
    // },
    // Request that a Remote Device leave the network
    // [CommandId.ZDO_MGMT_LEAVE_REQ]: {
    //     request: [
    //         {name: 'nwk', type: DataType.UINT16},
    //         {name: 'ieee', type: DataType.IEEE_ADDR},
    //         {name: 'flags', type: DataType.UINT8},
    //     ],
    //     response: [...commonResponse],
    // },
    // Request a remote device or devices to allow or disallow association
    // [CommandId.ZDO_PERMIT_JOINING_REQ]: {
    //     request: [
    //         {name: 'nwk', type: DataType.UINT16},
    //         {name: 'duration', type: DataType.UINT8},
    //         {name: 'tcSignificance', type: DataType.UINT8},
    //     ],
    //     response: [...commonResponse],
    // },
    // Device announce indication
    // [CommandId.ZDO_DEV_ANNCE_IND]: {
    //     request: [],
    //     response: [],
    //     indication: [
    //         {name: 'nwk', type: DataType.UINT16},
    //         {name: 'ieee', type: DataType.IEEE_ADDR},
    //         {name: 'macCapabilities', type: DataType.UINT8},
    //     ],
    // },
    // Rejoin to remote network even if joined already. If joined, clear internal data structures prior to joining. That call is useful for rejoin after parent loss.
    [enums_2.CommandId.ZDO_REJOIN]: {
        request: [
            { name: "extendedPanID", type: enums_2.BuffaloZBOSSDataType.EXTENDED_PAN_ID },
            { name: "len", type: enums_1.DataType.UINT8 },
            {
                name: "channels",
                type: enums_2.BuffaloZBOSSDataType.LIST_TYPED,
                typed: [
                    { name: "page", type: enums_1.DataType.UINT8 },
                    { name: "mask", type: enums_1.DataType.UINT32 },
                ],
            },
            { name: "secure", type: enums_1.DataType.UINT8 },
        ],
        response: [...commonResponse, { name: "flags", type: enums_1.DataType.UINT8 }],
    },
    // Sends a ZDO system server discovery request
    [enums_2.CommandId.ZDO_SYSTEM_SRV_DISCOVERY_REQ]: {
        request: [{ name: "serverMask", type: enums_1.DataType.UINT16 }],
        response: [...commonResponse],
    },
    // Sends a ZDO Mgmt Bind request to a remote device
    // [CommandId.ZDO_MGMT_BIND_REQ]: {
    //     request: [
    //         {name: 'nwk', type: DataType.UINT16},
    //         {name: 'startIndex', type: DataType.UINT8},
    //     ],
    //     response: [...commonResponse],
    // },
    // Sends a ZDO Mgmt LQI request to a remote device
    // [CommandId.ZDO_MGMT_LQI_REQ]: {
    //     request: [
    //         {name: 'nwk', type: DataType.UINT16},
    //         {name: 'startIndex', type: DataType.UINT8},
    //     ],
    //     response: [
    //         ...commonResponse,
    //         {name: 'entries', type: DataType.UINT8},
    //         {name: 'startIndex', type: DataType.UINT8},
    //         {name: 'len', type: DataType.UINT8},
    //         {
    //             name: 'neighbors',
    //             type: BuffaloZBOSSDataType.LIST_TYPED,
    //             typed: [
    //                 {name: 'extendedPanID', type: BuffaloZBOSSDataType.EXTENDED_PAN_ID},
    //                 {name: 'ieee', type: DataType.IEEE_ADDR},
    //                 {name: 'nwk', type: DataType.UINT16},
    //                 {name: 'relationship', type: DataType.UINT8},
    //                 {name: 'joining', type: DataType.UINT8},
    //                 {name: 'depth', type: DataType.UINT8},
    //                 {name: 'lqi', type: DataType.UINT8},
    //             ],
    //             options: (payload, options) => (options.length = payload.len),
    //         },
    //     ],
    // },
    // Sends a ZDO Mgmt NWK Update Request to a remote device
    // [CommandId.ZDO_MGMT_NWK_UPDATE_REQ]: {
    //     request: [
    //         {name: 'channelMask', type: DataType.UINT32},
    //         {name: 'duration', type: DataType.UINT8},
    //         {name: 'count', type: DataType.UINT8},
    //         {name: 'managerNwk', type: DataType.UINT16},
    //         {name: 'nwk', type: DataType.UINT16},
    //     ],
    //     response: [...commonResponse],
    // },
    // Require statistics (last message LQI\RSSI, counters, etc.) from the ZDO level
    [enums_2.CommandId.ZDO_GET_STATS]: {
        request: [{ name: "cleanup", type: enums_1.DataType.UINT8 }],
        response: [
            ...commonResponse,
            { name: "mac_rx_bcast", type: enums_1.DataType.UINT32 },
            { name: "mac_tx_bcast", type: enums_1.DataType.UINT32 },
            { name: "mac_rx_ucast", type: enums_1.DataType.UINT32 },
            { name: "mac_tx_ucast_total_zcl", type: enums_1.DataType.UINT32 },
            { name: "mac_tx_ucast_failures_zcl", type: enums_1.DataType.UINT16 },
            { name: "mac_tx_ucast_retries_zcl", type: enums_1.DataType.UINT16 },
            { name: "mac_tx_ucast_total", type: enums_1.DataType.UINT16 },
            { name: "mac_tx_ucast_failures", type: enums_1.DataType.UINT16 },
            { name: "mac_tx_ucast_retries", type: enums_1.DataType.UINT16 },
            { name: "phy_to_mac_que_lim_reached", type: enums_1.DataType.UINT16 },
            { name: "mac_validate_drop_cnt", type: enums_1.DataType.UINT16 },
            { name: "phy_cca_fail_count", type: enums_1.DataType.UINT16 },
            { name: "period_of_time", type: enums_1.DataType.UINT8 },
            { name: "last_msg_lqi", type: enums_1.DataType.UINT8 },
            { name: "last_msg_rssi", type: enums_1.DataType.UINT8 },
            { name: "number_of_resets", type: enums_1.DataType.UINT16 },
            { name: "aps_tx_bcast", type: enums_1.DataType.UINT16 },
            { name: "aps_tx_ucast_success", type: enums_1.DataType.UINT16 },
            { name: "aps_tx_ucast_retry", type: enums_1.DataType.UINT16 },
            { name: "aps_tx_ucast_fail", type: enums_1.DataType.UINT16 },
            { name: "route_disc_initiated", type: enums_1.DataType.UINT16 },
            { name: "nwk_neighbor_added", type: enums_1.DataType.UINT16 },
            { name: "nwk_neighbor_removed", type: enums_1.DataType.UINT16 },
            { name: "nwk_neighbor_stale", type: enums_1.DataType.UINT16 },
            { name: "join_indication", type: enums_1.DataType.UINT16 },
            { name: "childs_removed", type: enums_1.DataType.UINT16 },
            { name: "nwk_fc_failure", type: enums_1.DataType.UINT16 },
            { name: "aps_fc_failure", type: enums_1.DataType.UINT16 },
            { name: "aps_unauthorized_key", type: enums_1.DataType.UINT16 },
            { name: "nwk_decrypt_failure", type: enums_1.DataType.UINT16 },
            { name: "aps_decrypt_failure", type: enums_1.DataType.UINT16 },
            { name: "packet_buffer_allocate_failures", type: enums_1.DataType.UINT16 },
            { name: "average_mac_retry_per_aps_message_sent", type: enums_1.DataType.UINT16 },
            { name: "nwk_retry_overflow", type: enums_1.DataType.UINT16 },
            { name: "nwk_bcast_table_full", type: enums_1.DataType.UINT16 },
            { name: "status", type: enums_1.DataType.UINT8 },
        ],
    },
    // Indicates some device in the network was authorized (e.g. received TCLK)
    [enums_2.CommandId.ZDO_DEV_AUTHORIZED_IND]: {
        request: [],
        response: [],
        indication: [
            { name: "ieee", type: enums_1.DataType.IEEE_ADDR },
            { name: "nwk", type: enums_1.DataType.UINT16 },
            { name: "authType", type: enums_1.DataType.UINT8, typed: enums_2.DeviceAuthorizedType },
            {
                name: "authStatus",
                type: enums_1.DataType.UINT8,
                /* typed: DeviceAuthorizedLegacyStatus | DeviceAuthorizedR21TCLKStatus | DeviceAuthorizedSECBKEStatus */
            },
        ],
    },
    // Indicates some device joined the network
    [enums_2.CommandId.ZDO_DEV_UPDATE_IND]: {
        request: [],
        response: [],
        indication: [
            { name: "ieee", type: enums_1.DataType.IEEE_ADDR },
            { name: "nwk", type: enums_1.DataType.UINT16 },
            { name: "status", type: enums_1.DataType.UINT8, typed: enums_2.DeviceUpdateStatus },
            // not in dsr-corporation spec
            // {name: 'tcAction', type: DataType.UINT8, typed: DeviceUpdateTCAction},
            // {name: 'parentNwk', type: DataType.UINT16},
        ],
    },
    // Sets manufacturer code field in the node descriptor
    [enums_2.CommandId.ZDO_SET_NODE_DESC_MANUF_CODE]: {
        request: [{ name: "manufacturerCode", type: enums_1.DataType.UINT16 }],
        response: [...commonResponse],
    },
    // ------------------------------------------
    // Application Support Sub-layer
    // ------------------------------------------
    // APSDE-DATA.request
    [enums_2.CommandId.APSDE_DATA_REQ]: {
        request: [
            { name: "paramLength", type: enums_1.DataType.UINT8 },
            { name: "dataLength", type: enums_1.DataType.UINT16 },
            { name: "addr", type: enums_1.DataType.IEEE_ADDR },
            { name: "profileID", type: enums_1.DataType.UINT16 },
            { name: "clusterID", type: enums_1.DataType.UINT16 },
            { name: "dstEndpoint", type: enums_1.DataType.UINT8, condition: (payload) => [2, 3].includes(payload.dstAddrMode) },
            //{name: 'dstEndpoint', type: DataType.UINT8},
            { name: "srcEndpoint", type: enums_1.DataType.UINT8 },
            { name: "radius", type: enums_1.DataType.UINT8 },
            { name: "dstAddrMode", type: enums_1.DataType.UINT8 },
            { name: "txOptions", type: enums_1.DataType.UINT8 },
            { name: "useAlias", type: enums_1.DataType.UINT8 },
            //{name: 'aliasAddr', type: DataType.UINT16, condition: (payload) => payload.useAlias !== 0},
            { name: "aliasAddr", type: enums_1.DataType.UINT16 },
            { name: "aliasSequence", type: enums_1.DataType.UINT8 },
            {
                name: "data",
                type: enums_1.BuffaloZclDataType.LIST_UINT8,
                options: (payload, options) => {
                    options.length = payload.dataLength;
                },
            },
        ],
        response: [
            ...commonResponse,
            { name: "ieee", type: enums_1.DataType.IEEE_ADDR },
            { name: "dstEndpoint", type: enums_1.DataType.UINT8, condition: (payload) => [2, 3].includes(payload.dstAddrMode) },
            { name: "srcEndpoint", type: enums_1.DataType.UINT8 },
            { name: "txTime", type: enums_1.DataType.UINT32 },
            { name: "dstAddrMode", type: enums_1.DataType.UINT8 },
        ],
    },
    // APSME-BIND.Request
    [enums_2.CommandId.APSME_BIND]: {
        request: [
            { name: "srcIeee", type: enums_1.DataType.IEEE_ADDR },
            { name: "srcEndpoint", type: enums_1.DataType.UINT8 },
            { name: "clusterID", type: enums_1.DataType.UINT16 },
            { name: "dstAddrMode", type: enums_1.DataType.UINT8 },
            { name: "dstIeee", type: enums_1.DataType.IEEE_ADDR },
            { name: "dstEndpoint", type: enums_1.DataType.UINT8 },
        ],
        response: [...commonResponse, { name: "index", type: enums_1.DataType.UINT8 }],
    },
    // APSME-UNBIND.request
    [enums_2.CommandId.APSME_UNBIND]: {
        request: [
            { name: "srcIeee", type: enums_1.DataType.IEEE_ADDR },
            { name: "srcEndpoint", type: enums_1.DataType.UINT8 },
            { name: "clusterID", type: enums_1.DataType.UINT16 },
            { name: "dstAddrMode", type: enums_1.DataType.UINT8 },
            { name: "dstIeee", type: enums_1.DataType.IEEE_ADDR },
            { name: "dstEndpoint", type: enums_1.DataType.UINT8 },
        ],
        response: [...commonResponse, { name: "index", type: enums_1.DataType.UINT8 }],
    },
    // APSME-ADD-GROUP.request
    [enums_2.CommandId.APSME_ADD_GROUP]: {
        request: [
            { name: "nwk", type: enums_1.DataType.UINT16 },
            { name: "endpoint", type: enums_1.DataType.UINT8 },
        ],
        response: [...commonResponse],
    },
    // APSME-REMOVE-GROUP.request
    [enums_2.CommandId.APSME_RM_GROUP]: {
        request: [
            { name: "nwk", type: enums_1.DataType.UINT16 },
            { name: "endpoint", type: enums_1.DataType.UINT8 },
        ],
        response: [...commonResponse],
    },
    // APSDE-DATA.indication
    [enums_2.CommandId.APSDE_DATA_IND]: {
        request: [],
        response: [],
        indication: [
            { name: "paramLength", type: enums_1.DataType.UINT8 },
            { name: "dataLength", type: enums_1.DataType.UINT16 },
            { name: "apsFC", type: enums_1.DataType.UINT8 },
            { name: "srcNwk", type: enums_1.DataType.UINT16 },
            { name: "dstNwk", type: enums_1.DataType.UINT16 },
            { name: "grpNwk", type: enums_1.DataType.UINT16 },
            { name: "dstEndpoint", type: enums_1.DataType.UINT8 },
            { name: "srcEndpoint", type: enums_1.DataType.UINT8 },
            { name: "clusterID", type: enums_1.DataType.UINT16 },
            { name: "profileID", type: enums_1.DataType.UINT16 },
            { name: "apsCounter", type: enums_1.DataType.UINT8 },
            { name: "srcMAC", type: enums_1.DataType.UINT16 },
            { name: "dstMAC", type: enums_1.DataType.UINT16 },
            { name: "lqi", type: enums_1.DataType.UINT8 },
            { name: "rssi", type: enums_1.DataType.UINT8 },
            { name: "apsKey", type: enums_1.DataType.UINT8 },
            {
                name: "data",
                type: enums_1.BuffaloZclDataType.BUFFER,
                options: (payload, options) => {
                    options.length = payload.dataLength;
                },
            },
        ],
    },
    // APSME-REMOVE-ALL-GROUPS.request
    [enums_2.CommandId.APSME_RM_ALL_GROUPS]: {
        request: [{ name: "endpoint", type: enums_1.DataType.UINT8 }],
        response: [...commonResponse],
    },
    // Checks if there are any bindings for specified endpoint and cluster
    [enums_2.CommandId.APS_CHECK_BINDING]: {
        request: [
            { name: "endpoint", type: enums_1.DataType.UINT8 },
            { name: "clusterID", type: enums_1.DataType.UINT16 },
        ],
        response: [...commonResponse, { name: "exists", type: enums_1.DataType.UINT8 }],
    },
    // Gets the APS Group Table
    [enums_2.CommandId.APS_GET_GROUP_TABLE]: {
        request: [],
        response: [
            ...commonResponse,
            { name: "length", type: enums_1.DataType.UINT16 },
            {
                name: "groups",
                type: enums_1.BuffaloZclDataType.LIST_UINT16,
                options: (payload, options) => {
                    options.length = payload.length;
                },
            },
        ],
    },
    // Removes all bindings
    [enums_2.CommandId.APSME_UNBIND_ALL]: {
        request: [],
        response: [...commonResponse],
    },
    // ------------------------------------------
    // NWK Management API
    // ------------------------------------------
    // NLME-NETWORK-FORMATION.request
    [enums_2.CommandId.NWK_FORMATION]: {
        request: [
            { name: "len", type: enums_1.DataType.UINT8 },
            {
                name: "channels",
                type: enums_2.BuffaloZBOSSDataType.LIST_TYPED,
                typed: [
                    { name: "page", type: enums_1.DataType.UINT8 },
                    { name: "mask", type: enums_1.DataType.UINT32 },
                ],
            },
            { name: "duration", type: enums_1.DataType.UINT8 },
            { name: "distribFlag", type: enums_1.DataType.UINT8 },
            { name: "distribNwk", type: enums_1.DataType.UINT16 },
            { name: "extendedPanID", type: enums_2.BuffaloZBOSSDataType.EXTENDED_PAN_ID },
        ],
        response: [...commonResponse, { name: "nwk", type: enums_1.DataType.UINT16 }],
    },
    // NLME-NETWORK-DISCOVERY.request
    [enums_2.CommandId.NWK_DISCOVERY]: {
        request: [
            { name: "len", type: enums_1.DataType.UINT8 },
            {
                name: "channels",
                type: enums_2.BuffaloZBOSSDataType.LIST_TYPED,
                typed: [
                    { name: "page", type: enums_1.DataType.UINT8 },
                    { name: "mask", type: enums_1.DataType.UINT32 },
                ],
            },
            { name: "duration", type: enums_1.DataType.UINT8 },
            { name: "macCapabilities", type: enums_1.DataType.UINT8 },
            { name: "security", type: enums_1.DataType.UINT8 },
        ],
        response: [
            ...commonResponse,
            { name: "extendedPanID", type: enums_2.BuffaloZBOSSDataType.EXTENDED_PAN_ID },
            { name: "panID", type: enums_1.DataType.UINT16 },
            { name: "nwkUpdateID", type: enums_1.DataType.UINT8 },
            { name: "page", type: enums_1.DataType.UINT8 },
            { name: "channel", type: enums_1.DataType.UINT8 },
            { name: "flags", type: enums_1.DataType.UINT8 },
            { name: "lqi", type: enums_1.DataType.UINT8 },
            { name: "rssi", type: enums_1.DataType.INT8 },
        ],
    },
    // Join network, do basic post-join actions
    [enums_2.CommandId.NWK_NLME_JOIN]: {
        request: [
            { name: "extendedPanID", type: enums_2.BuffaloZBOSSDataType.EXTENDED_PAN_ID },
            { name: "rejoin", type: enums_1.DataType.UINT8 },
            { name: "len", type: enums_1.DataType.UINT8 },
            {
                name: "channels",
                type: enums_2.BuffaloZBOSSDataType.LIST_TYPED,
                typed: [
                    { name: "page", type: enums_1.DataType.UINT8 },
                    { name: "mask", type: enums_1.DataType.UINT32 },
                ],
            },
        ],
        response: [
            ...commonResponse,
            { name: "nwk", type: enums_1.DataType.UINT16 },
            { name: "extendedPanID", type: enums_2.BuffaloZBOSSDataType.EXTENDED_PAN_ID },
            { name: "page", type: enums_1.DataType.UINT8 },
            { name: "channel", type: enums_1.DataType.UINT8 },
            { name: "beacon", type: enums_1.DataType.UINT8 },
            { name: "macInterface", type: enums_1.DataType.UINT8 },
        ],
    },
    // NLME-PERMIT-JOINING.request
    [enums_2.CommandId.NWK_PERMIT_JOINING]: {
        request: [{ name: "duration", type: enums_1.DataType.UINT8 }],
        response: [...commonResponse],
    },
    // Get IEEE address by short address from the local address translation table
    [enums_2.CommandId.NWK_GET_IEEE_BY_SHORT]: {
        request: [{ name: "nwk", type: enums_1.DataType.UINT16 }],
        response: [...commonResponse, { name: "ieee", type: enums_1.DataType.IEEE_ADDR }],
    },
    // Get short address by IEEE address from the local address translation table
    [enums_2.CommandId.NWK_GET_SHORT_BY_IEEE]: {
        request: [{ name: "ieee", type: enums_1.DataType.IEEE_ADDR }],
        response: [...commonResponse, { name: "nwk", type: enums_1.DataType.UINT16 }],
    },
    // Get local neighbor table entry by IEEE address
    [enums_2.CommandId.NWK_GET_NEIGHBOR_BY_IEEE]: {
        request: [{ name: "ieee", type: enums_1.DataType.IEEE_ADDR }],
        response: [
            ...commonResponse,
            { name: "ieee", type: enums_1.DataType.IEEE_ADDR },
            { name: "nwk", type: enums_1.DataType.UINT16 },
            { name: "role", type: enums_1.DataType.UINT8 },
            { name: "rxOnWhenIdle", type: enums_1.DataType.UINT8 },
            { name: "edConfig", type: enums_1.DataType.UINT16 },
            { name: "timeoutCounter", type: enums_1.DataType.UINT32 },
            { name: "deviceTimeout", type: enums_1.DataType.UINT32 },
            { name: "relationship", type: enums_1.DataType.UINT8 },
            { name: "failureCount", type: enums_1.DataType.UINT8 },
            { name: "lqi", type: enums_1.DataType.UINT8 },
            { name: "cost", type: enums_1.DataType.UINT8 },
            { name: "age", type: enums_1.DataType.UINT8 },
            { name: "keepalive", type: enums_1.DataType.UINT8 },
            { name: "macInterface", type: enums_1.DataType.UINT8 },
        ],
    },
    // Indicates that network rejoining procedure has completed
    [enums_2.CommandId.NWK_REJOINED_IND]: {
        request: [],
        response: [],
        indication: [
            { name: "nwk", type: enums_1.DataType.UINT16 },
            { name: "extendedPanID", type: enums_2.BuffaloZBOSSDataType.EXTENDED_PAN_ID },
            { name: "page", type: enums_1.DataType.UINT8 },
            { name: "channel", type: enums_1.DataType.UINT8 },
            { name: "beacon", type: enums_1.DataType.UINT8 },
            { name: "macInterface", type: enums_1.DataType.UINT8 },
        ],
    },
    // Indicates that network rejoining procedure has failed
    [enums_2.CommandId.NWK_REJOIN_FAILED_IND]: {
        request: [],
        response: [],
        indication: [...commonResponse],
    },
    // Network Leave indication
    [enums_2.CommandId.NWK_LEAVE_IND]: {
        request: [],
        response: [],
        indication: [
            { name: "ieee", type: enums_1.DataType.IEEE_ADDR },
            { name: "rejoin", type: enums_1.DataType.UINT8 },
        ],
    },
    // Set Fast Poll Interval PIM attribute
    [enums_2.CommandId.PIM_SET_FAST_POLL_INTERVAL]: {
        request: [{ name: "interval", type: enums_1.DataType.UINT16 }],
        response: [...commonResponse],
    },
    // Set Long Poll Interval PIM attribute
    [enums_2.CommandId.PIM_SET_LONG_POLL_INTERVAL]: {
        request: [{ name: "interval", type: enums_1.DataType.UINT32 }],
        response: [...commonResponse],
    },
    // Start poll with the Fast Poll Interval specified by PIM attribute
    [enums_2.CommandId.PIM_START_FAST_POLL]: {
        request: [],
        response: [...commonResponse],
    },
    // Start Long Poll
    [enums_2.CommandId.PIM_START_LONG_POLL]: {
        request: [],
        response: [...commonResponse],
    },
    // Start poll with the Long Poll Interval specified by PIM attribute
    [enums_2.CommandId.PIM_START_POLL]: {
        request: [],
        response: [...commonResponse],
    },
    // Stop fast poll and restart it with the Long Poll Interval
    [enums_2.CommandId.PIM_STOP_FAST_POLL]: {
        request: [],
        response: [...commonResponse, { name: "result", type: enums_1.DataType.UINT8 }],
    },
    // Stop automatic ZBOSS poll
    [enums_2.CommandId.PIM_STOP_POLL]: {
        request: [],
        response: [...commonResponse],
    },
    // Enable turbo poll for a given amount of time.
    [enums_2.CommandId.PIM_ENABLE_TURBO_POLL]: {
        request: [{ name: "time", type: enums_1.DataType.UINT32 }],
        response: [...commonResponse],
    },
    // Disable turbo poll for a given amount of time.
    [enums_2.CommandId.PIM_DISABLE_TURBO_POLL]: {
        request: [],
        response: [...commonResponse],
    },
    // Disable turbo poll for a given amount of time.
    [enums_2.CommandId.NWK_ADDRESS_UPDATE_IND]: {
        request: [],
        response: [],
        indication: [{ name: "nwk", type: enums_1.DataType.UINT16 }],
    },
    // Start without forming a new network.
    [enums_2.CommandId.NWK_START_WITHOUT_FORMATION]: {
        request: [],
        response: [...commonResponse],
    },
    // NWK NLME start router request
    [enums_2.CommandId.NWK_NLME_ROUTER_START]: {
        request: [
            { name: "beaconOrder", type: enums_1.DataType.UINT8 },
            { name: "superframeOrder", type: enums_1.DataType.UINT8 },
            { name: "batteryLife", type: enums_1.DataType.UINT8 },
        ],
        response: [...commonResponse],
    },
    // Indicates that joined device has no parent
    [enums_2.CommandId.PARENT_LOST_IND]: {
        request: [],
        response: [],
        indication: [],
    },
    // PIM_START_TURBO_POLL_PACKETS
    // PIM_START_TURBO_POLL_CONTINUOUS
    // PIM_TURBO_POLL_CONTINUOUS_LEAVE
    // PIM_TURBO_POLL_PACKETS_LEAVE
    // PIM_PERMIT_TURBO_POLL
    // PIM_SET_FAST_POLL_TIMEOUT
    // PIM_GET_LONG_POLL_INTERVAL
    // PIM_GET_IN_FAST_POLL_FLAG
    // Sets keepalive mode
    [enums_2.CommandId.SET_KEEPALIVE_MOVE]: {
        request: [{ name: "mode", type: enums_1.DataType.UINT8 }],
        response: [...commonResponse],
    },
    // Starts a concentrator mode
    [enums_2.CommandId.START_CONCENTRATOR_MODE]: {
        request: [
            { name: "radius", type: enums_1.DataType.UINT8 },
            { name: "timeout", type: enums_1.DataType.UINT32 },
        ],
        response: [...commonResponse],
    },
    // Stops a concentrator mode
    [enums_2.CommandId.STOP_CONCENTRATOR_MODE]: {
        request: [],
        response: [...commonResponse],
    },
    // Enables or disables PAN ID conflict resolution
    [enums_2.CommandId.NWK_ENABLE_PAN_ID_CONFLICT_RESOLUTION]: {
        request: [{ name: "enable", type: enums_1.DataType.UINT8 }],
        response: [...commonResponse],
    },
    // Enables or disables automatic PAN ID conflict resolution
    [enums_2.CommandId.NWK_ENABLE_AUTO_PAN_ID_CONFLICT_RESOLUTION]: {
        request: [{ name: "enable", type: enums_1.DataType.UINT8 }],
        response: [...commonResponse],
    },
    // PIM_TURBO_POLL_CANCEL_PACKET
    // ------------------------------------------
    // Security
    // ------------------------------------------
    // Set local device installcode to ZR/ZED
    [enums_2.CommandId.SECUR_SET_LOCAL_IC]: {
        request: [
            { name: "installCode", type: enums_1.BuffaloZclDataType.LIST_UINT8 }, //8, 10, 14 or 18Installcode, including trailing 2 bytes of CRC
        ],
        response: [...commonResponse],
    },
    // Set remote device installcode to ZC
    [enums_2.CommandId.SECUR_ADD_IC]: {
        request: [
            { name: "ieee", type: enums_1.DataType.IEEE_ADDR },
            { name: "installCode", type: enums_1.BuffaloZclDataType.LIST_UINT8 }, //8, 10, 14 or 18Installcode, including trailing 2 bytes of CRC
        ],
        response: [...commonResponse],
    },
    // Delete remote device installcode from ZC
    [enums_2.CommandId.SECUR_DEL_IC]: {
        request: [{ name: "ieee", type: enums_1.DataType.IEEE_ADDR }],
        response: [...commonResponse],
    },
    // Get local device Installcode
    [enums_2.CommandId.SECUR_GET_LOCAL_IC]: {
        request: [],
        response: [
            ...commonResponse,
            { name: "installCode", type: enums_1.BuffaloZclDataType.LIST_UINT8 }, //8, 10, 14 or 18Installcode, including trailing 2 bytes of CRC
        ],
    },
    // TCLK Indication
    [enums_2.CommandId.SECUR_TCLK_IND]: {
        request: [],
        response: [],
        indication: [
            { name: "ieee", type: enums_1.DataType.IEEE_ADDR },
            { name: "keyType", type: enums_1.DataType.UINT8 },
        ],
    },
    // TCLK Exchange Indication Failed
    [enums_2.CommandId.SECUR_TCLK_EXCHANGE_FAILED_IND]: {
        request: [],
        response: [],
        indication: [...commonResponse],
    },
    // Initiates a key switch procedure
    [enums_2.CommandId.SECUR_NWK_INITIATE_KEY_SWITCH_PROCEDURE]: {
        request: [],
        response: [...commonResponse],
    },
    // Gets the IC list
    [enums_2.CommandId.SECUR_GET_IC_LIST]: {
        request: [{ name: "startIndex", type: enums_1.DataType.UINT8 }],
        response: [
            ...commonResponse,
            { name: "size", type: enums_1.DataType.UINT8 },
            { name: "startIndex", type: enums_1.DataType.UINT8 },
            { name: "count", type: enums_1.DataType.UINT8 },
            {
                name: "table",
                type: enums_2.BuffaloZBOSSDataType.LIST_TYPED,
                typed: [
                    { name: "ieee", type: enums_1.DataType.IEEE_ADDR },
                    { name: "type", type: enums_1.DataType.UINT8 },
                    { name: "installCode", type: enums_1.BuffaloZclDataType.LIST_UINT8 }, //8, 10, 14 or 18Installcode, including trailing 2 bytes of CRC
                ],
            },
        ],
    },
    // Get an IC table entry by index
    [enums_2.CommandId.SECUR_GET_IC_BY_IDX]: {
        request: [{ name: "index", type: enums_1.DataType.UINT8 }],
        response: [
            ...commonResponse,
            { name: "ieee", type: enums_1.DataType.IEEE_ADDR },
            { name: "type", type: enums_1.DataType.UINT8 },
            { name: "installCode", type: enums_1.BuffaloZclDataType.LIST_UINT8 }, //8, 10, 14 or 18Installcode, including trailing 2 bytes of CRC
        ],
    },
    // Removes all IC
    [enums_2.CommandId.SECUR_REMOVE_ALL_IC]: {
        request: [],
        response: [...commonResponse],
    },
    ///////////////////
    [enums_2.CommandId.UNKNOWN_1]: {
        request: [],
        response: [...commonResponse],
        indication: [{ name: "data", type: enums_1.DataType.UINT8 }],
    },
};
//# sourceMappingURL=commands.js.map