"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endpoints = void 0;
const ZSpec = __importStar(require("../../../zspec"));
const cluster_1 = require("../../../zspec/zcl/definition/cluster");
const Constants = __importStar(require("../constants"));
const EndpointDefaults = {
    appdeviceid: 0x0005,
    appdevver: 0,
    appnuminclusters: 0,
    appinclusterlist: [],
    appnumoutclusters: 0,
    appoutclusterlist: [],
    latencyreq: Constants.AF.networkLatencyReq.NO_LATENCY_REQS,
};
exports.Endpoints = [
    { ...EndpointDefaults, endpoint: 1, appprofid: 0x0104 },
    { ...EndpointDefaults, endpoint: 2, appprofid: 0x0101 },
    // Required for https://github.com/Koenkk/zigbee-herdsman-converters/commit/d0fb06c2429171f327950484ea3dec80864637cc
    { ...EndpointDefaults, endpoint: 3, appprofid: 0x0104 },
    { ...EndpointDefaults, endpoint: 4, appprofid: 0x0107 },
    { ...EndpointDefaults, endpoint: 5, appprofid: 0x0108 },
    { ...EndpointDefaults, endpoint: 6, appprofid: 0x0109 },
    { ...EndpointDefaults, endpoint: 8, appprofid: 0x0104 },
    { ...EndpointDefaults, endpoint: 10, appprofid: 0x0104 },
    {
        ...EndpointDefaults,
        endpoint: 11,
        appprofid: 0x0104,
        appdeviceid: 0x0400,
        appnumoutclusters: 2,
        appoutclusterlist: [cluster_1.Clusters.ssIasZone.ID, cluster_1.Clusters.ssIasWd.ID],
        appnuminclusters: 2,
        // genTime required for https://github.com/Koenkk/zigbee2mqtt/issues/10816
        appinclusterlist: [cluster_1.Clusters.ssIasAce.ID, cluster_1.Clusters.genTime.ID],
    },
    // TERNCY: https://github.com/Koenkk/zigbee-herdsman/issues/82
    { ...EndpointDefaults, endpoint: 0x6e, appprofid: 0x0104 },
    { ...EndpointDefaults, endpoint: 12, appprofid: 0xc05e },
    {
        ...EndpointDefaults,
        endpoint: 13,
        appprofid: 0x0104,
        appnuminclusters: 1,
        appinclusterlist: [cluster_1.Clusters.genOta.ID],
    },
    // Insta/Jung/Gira: OTA fallback EP (since it's buggy in firmware 10023202 when it tries to find a matching EP for
    // OTA - it queries for ZLL profile, but then contacts with HA profile)
    { ...EndpointDefaults, endpoint: 47, appprofid: 0x0104 },
    // Required for shelly wifi and rpc clusters
    { ...EndpointDefaults, endpoint: 239, appprofid: ZSpec.CUSTOM_SHELLY_PROFILE_ID },
    { ...EndpointDefaults, endpoint: 242, appprofid: 0xa1e0 },
];
//# sourceMappingURL=endpoints.js.map