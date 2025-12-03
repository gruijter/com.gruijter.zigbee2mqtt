"use strict";
/* v8 ignore start */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZiGateCommand = void 0;
exports.equal = equal;
exports.notEqual = notEqual;
const constants_1 = require("./constants");
const parameterType_1 = __importDefault(require("./parameterType"));
function equal(expected, received) {
    return expected === received;
}
function notEqual(expected, received) {
    return expected !== received;
}
exports.ZiGateCommand = {
    [constants_1.ZiGateCommandCode.SetDeviceType]: {
        // 0x0023
        request: [
            { name: "deviceType", parameterType: parameterType_1.default.UINT8 }, //<device type: uint8_t>
        ],
    },
    [constants_1.ZiGateCommandCode.StartNetwork]: {
        // 0x0024
        request: [],
        response: [[{ receivedProperty: "code", matcher: equal, value: constants_1.ZiGateMessageCode.NetworkJoined }]],
    },
    [constants_1.ZiGateCommandCode.StartNetworkScan]: {
        request: [],
    },
    [constants_1.ZiGateCommandCode.GetNetworkState]: {
        // 0x0009
        request: [],
        response: [[{ receivedProperty: "code", matcher: equal, value: constants_1.ZiGateMessageCode.NetworkState }]],
    },
    [constants_1.ZiGateCommandCode.GetTimeServer]: {
        // 0x0017
        request: [],
    },
    [constants_1.ZiGateCommandCode.ErasePersistentData]: {
        // 0x0012
        request: [],
        response: [
            [
                {
                    receivedProperty: "code",
                    matcher: equal,
                    value: constants_1.ZiGateMessageCode.RestartFactoryNew,
                },
            ],
        ],
        waitStatus: false,
    },
    [constants_1.ZiGateCommandCode.Reset]: {
        // 0x0011
        request: [],
        response: [
            [
                {
                    receivedProperty: "code",
                    matcher: equal,
                    value: constants_1.ZiGateMessageCode.RestartNonFactoryNew,
                },
            ],
            [
                {
                    receivedProperty: "code",
                    matcher: equal,
                    value: constants_1.ZiGateMessageCode.RestartFactoryNew,
                },
            ],
        ],
        waitStatus: false,
    },
    [constants_1.ZiGateCommandCode.SetTXpower]: {
        // SetTXpower
        request: [{ name: "value", parameterType: parameterType_1.default.UINT8 }],
    },
    // [ZiGateCommandCode.ManagementLQI]: {
    //     // 0x004E
    //     request: [
    //         {name: 'targetAddress', parameterType: ParameterType.UINT16}, //<Target Address : uint16_t>	Status
    //         {name: 'startIndex', parameterType: ParameterType.UINT8}, //<Start Index : uint8_t>
    //     ],
    //     response: [
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: ZiGateMessageCode.DataIndication,
    //             },
    //             {
    //                 receivedProperty: 'payload.sourceAddress',
    //                 matcher: equal,
    //                 expectedProperty: 'payload.targetAddress',
    //             },
    //             {
    //                 receivedProperty: 'payload.clusterID',
    //                 matcher: equal,
    //                 value: 0x8031,
    //             },
    //         ],
    //     ],
    // },
    [constants_1.ZiGateCommandCode.SetSecurityStateKey]: {
        // 0x0022
        request: [
            { name: "keyType", parameterType: parameterType_1.default.UINT8 }, // 	<key type: uint8_t>
            { name: "key", parameterType: parameterType_1.default.BUFFER }, //   <key: data>
        ],
    },
    [constants_1.ZiGateCommandCode.GetVersion]: {
        request: [],
        response: [[{ receivedProperty: "code", matcher: equal, value: constants_1.ZiGateMessageCode.VersionList }]],
    },
    [constants_1.ZiGateCommandCode.RawMode]: {
        request: [{ name: "enabled", parameterType: parameterType_1.default.INT8 }],
    },
    [constants_1.ZiGateCommandCode.SetExtendedPANID]: {
        request: [
            { name: "panId", parameterType: parameterType_1.default.BUFFER }, //<64-bit Extended PAN ID:uint64_t>
        ],
    },
    [constants_1.ZiGateCommandCode.SetChannelMask]: {
        request: [
            { name: "channelMask", parameterType: parameterType_1.default.UINT32 }, //<channel mask:uint32_t>
        ],
    },
    // [ZiGateCommandCode.ManagementLeaveRequest]: {
    //     request: [
    //         {name: 'shortAddress', parameterType: ParameterType.UINT16},
    //         {name: 'extendedAddress', parameterType: ParameterType.IEEEADDR}, // <extended address: uint64_t>
    //         {name: 'rejoin', parameterType: ParameterType.UINT8},
    //         {name: 'removeChildren', parameterType: ParameterType.UINT8}, // <Remove Children: uint8_t>
    //     ],
    //     response: [
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: ZiGateMessageCode.LeaveIndication,
    //             },
    //             {
    //                 receivedProperty: 'payload.extendedAddress',
    //                 matcher: equal,
    //                 expectedProperty: 'payload.extendedAddress',
    //             },
    //         ],
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: ZiGateMessageCode.ManagementLeaveResponse,
    //             },
    //             {
    //                 receivedProperty: 'payload.sqn',
    //                 matcher: equal,
    //                 expectedProperty: 'status.seqApsNum',
    //             },
    //         ],
    //     ],
    // },
    [constants_1.ZiGateCommandCode.RemoveDevice]: {
        request: [
            { name: "parentAddress", parameterType: parameterType_1.default.IEEEADDR }, // <parent address: uint64_t>
            { name: "extendedAddress", parameterType: parameterType_1.default.IEEEADDR }, // <extended address: uint64_t>
        ],
        response: [
            [
                {
                    receivedProperty: "code",
                    matcher: equal,
                    value: constants_1.ZiGateMessageCode.LeaveIndication,
                },
                {
                    receivedProperty: "payload.extendedAddress",
                    matcher: equal,
                    expectedProperty: "payload.extendedAddress",
                },
            ],
        ],
    },
    // [ZiGateCommandCode.PermitJoin]: {
    //     request: [
    //         {name: 'targetShortAddress', parameterType: ParameterType.UINT16}, //<target short address: uint16_t> -
    //         // broadcast 0xfffc
    //         {name: 'interval', parameterType: ParameterType.UINT8}, //<interval: uint8_t>
    //         // 0 = Disable Joining
    //         // 1 – 254 = Time in seconds to allow joins
    //         // 255 = Allow all joins
    //         // {name: 'TCsignificance', parameterType: ParameterType.UINT8}, //<TCsignificance: uint8_t>
    //         // 0 = No change in authentication
    //         // 1 = Authentication policy as spec
    //     ],
    // },
    [constants_1.ZiGateCommandCode.PermitJoinStatus]: {
        request: [
            { name: "targetShortAddress", parameterType: parameterType_1.default.UINT16 }, //<target short address: uint16_t> -
            // broadcast 0xfffc
            { name: "interval", parameterType: parameterType_1.default.UINT8 }, //<interval: uint8_t>
            // 0 = Disable Joining
            // 1 – 254 = Time in seconds to allow joins
            // 255 = Allow all joins
            { name: "TCsignificance", parameterType: parameterType_1.default.UINT8 }, //<TCsignificance: uint8_t>
            // 0 = No change in authentication
            // 1 = Authentication policy as spec
        ],
        response: [[{ receivedProperty: "code", matcher: equal, value: constants_1.ZiGateMessageCode.PermitJoinStatus }]],
    },
    [constants_1.ZiGateCommandCode.RawAPSDataRequest]: {
        request: [
            { name: "addressMode", parameterType: parameterType_1.default.UINT8 }, // <address mode: uint8_t>
            { name: "targetShortAddress", parameterType: parameterType_1.default.UINT16 }, // <target short address: uint16_t>
            { name: "sourceEndpoint", parameterType: parameterType_1.default.UINT8 }, // <source endpoint: uint8_t>
            { name: "destinationEndpoint", parameterType: parameterType_1.default.UINT8 }, // <destination endpoint: uint8_t>
            { name: "clusterID", parameterType: parameterType_1.default.UINT16 }, // <cluster ID: uint16_t>
            { name: "profileID", parameterType: parameterType_1.default.UINT16 }, // <profile ID: uint16_t>
            { name: "securityMode", parameterType: parameterType_1.default.UINT8 }, // <security mode: uint8_t>
            { name: "radius", parameterType: parameterType_1.default.UINT8 }, // <radius: uint8_t>
            { name: "dataLength", parameterType: parameterType_1.default.UINT8 }, // <data length: uint8_t>
            { name: "data", parameterType: parameterType_1.default.BUFFER }, // <data: auint8_t>
        ],
    },
    // [ZiGateCommandCode.NodeDescriptor]: {
    //     request: [
    //         {name: 'targetShortAddress', parameterType: ParameterType.UINT16}, // <target short address: uint16_t>
    //     ],
    //     response: [
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: ZiGateMessageCode.DataIndication,
    //             },
    //             {
    //                 receivedProperty: 'payload.sourceAddress',
    //                 matcher: equal,
    //                 expectedProperty: 'payload.targetShortAddress',
    //             },
    //             {
    //                 receivedProperty: 'payload.clusterID',
    //                 matcher: equal,
    //                 value: 0x8002,
    //             },
    //         ],
    //     ],
    // },
    // [ZiGateCommandCode.ActiveEndpoint]: {
    //     request: [
    //         {name: 'targetShortAddress', parameterType: ParameterType.UINT16}, // <target short address: uint16_t>
    //     ],
    //     response: [
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: ZiGateMessageCode.DataIndication,
    //             },
    //             {
    //                 receivedProperty: 'payload.sourceAddress',
    //                 matcher: equal,
    //                 expectedProperty: 'payload.targetShortAddress',
    //             },
    //             {
    //                 receivedProperty: 'payload.clusterID',
    //                 matcher: equal,
    //                 value: 0x8005,
    //             },
    //         ],
    //     ],
    // },
    // [ZiGateCommandCode.SimpleDescriptor]: {
    //     request: [
    //         {name: 'targetShortAddress', parameterType: ParameterType.UINT16}, // <target short address: uint16_t>
    //         {name: 'endpoint', parameterType: ParameterType.UINT8}, // <endpoint: uint8_t>
    //     ],
    //     response: [
    //         [
    //             {receivedProperty: 'code', matcher: equal, value: ZiGateMessageCode.DataIndication},
    //             {
    //                 receivedProperty: 'payload.sourceAddress',
    //                 matcher: equal,
    //                 expectedProperty: 'payload.targetShortAddress',
    //             },
    //             {
    //                 receivedProperty: 'payload.clusterID',
    //                 matcher: equal,
    //                 value: 0x8004,
    //             },
    //         ],
    //     ],
    // },
    // [ZiGateCommandCode.Bind]: {
    //     request: [
    //         {name: 'targetExtendedAddress', parameterType: ParameterType.IEEEADDR}, // <target extended address: uint64_t>
    //         {name: 'targetEndpoint', parameterType: ParameterType.UINT8}, // <target endpoint: uint8_t>
    //         {name: 'clusterID', parameterType: ParameterType.UINT16}, // <cluster ID: uint16_t>
    //         {name: 'destinationAddressMode', parameterType: ParameterType.UINT8}, // <destination address mode: uint8_t>
    //         {
    //             name: 'destinationAddress',
    //             parameterType: ParameterType.ADDRESS_WITH_TYPE_DEPENDENCY,
    //         }, // <destination address:uint16_t or uint64_t>
    //         {name: 'destinationEndpoint', parameterType: ParameterType.UINT8}, // <destination endpoint (
    //         // value ignored for group address): uint8_t>
    //     ],
    //     response: [
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: ZiGateMessageCode.DataIndication,
    //             },
    //             {
    //                 receivedProperty: 'payload.sourceAddress',
    //                 matcher: equal,
    //                 expectedExtraParameter: 'destinationNetworkAddress',
    //             },
    //             {
    //                 receivedProperty: 'payload.clusterID',
    //                 matcher: equal,
    //                 value: 0x8021,
    //             },
    //             {
    //                 receivedProperty: 'payload.profileID',
    //                 matcher: equal,
    //                 value: 0x0000,
    //             },
    //         ],
    //     ],
    // },
    // [ZiGateCommandCode.UnBind]: {
    //     request: [
    //         {name: 'targetExtendedAddress', parameterType: ParameterType.IEEEADDR}, // <target extended address: uint64_t>
    //         {name: 'targetEndpoint', parameterType: ParameterType.UINT8}, // <target endpoint: uint8_t>
    //         {name: 'clusterID', parameterType: ParameterType.UINT16}, // <cluster ID: uint16_t>
    //         {name: 'destinationAddressMode', parameterType: ParameterType.UINT8}, // <destination address mode: uint8_t>
    //         {
    //             name: 'destinationAddress',
    //             parameterType: ParameterType.ADDRESS_WITH_TYPE_DEPENDENCY,
    //         }, // <destination address:uint16_t or uint64_t>
    //         {name: 'destinationEndpoint', parameterType: ParameterType.UINT8}, // <destination endpoint (
    //         // value ignored for group address): uint8_t>
    //     ],
    //     response: [
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: ZiGateMessageCode.DataIndication,
    //             },
    //             {
    //                 receivedProperty: 'payload.sourceAddress',
    //                 matcher: equal,
    //                 expectedExtraParameter: 'destinationNetworkAddress',
    //             },
    //             {
    //                 receivedProperty: 'payload.clusterID',
    //                 matcher: equal,
    //                 value: 0x8022,
    //             },
    //             {
    //                 receivedProperty: 'payload.profileID',
    //                 matcher: equal,
    //                 value: 0x0000,
    //             },
    //         ],
    //     ],
    // },
    [constants_1.ZiGateCommandCode.AddGroup]: {
        request: [
            { name: "addressMode", parameterType: parameterType_1.default.UINT8 }, //<device type: uint8_t>
            { name: "shortAddress", parameterType: parameterType_1.default.UINT16 },
            { name: "sourceEndpoint", parameterType: parameterType_1.default.UINT8 },
            { name: "destinationEndpoint", parameterType: parameterType_1.default.UINT8 },
            { name: "groupAddress", parameterType: parameterType_1.default.UINT16 },
        ],
    },
};
//# sourceMappingURL=commandType.js.map