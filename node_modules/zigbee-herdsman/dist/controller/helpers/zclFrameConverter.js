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
exports.attributeKeyValue = attributeKeyValue;
exports.attributeList = attributeList;
const Zcl = __importStar(require("../../zspec/zcl"));
// Legrand devices (e.g. 4129) fail to set the manufacturerSpecific flag and
// manufacturerCode in the frame header, despite using specific attributes.
// This leads to incorrect reported attribute names.
// Remap the attributes using the target device's manufacturer ID
// if the header is lacking the information.
function getCluster(frame, deviceManufacturerID, customClusters) {
    let cluster = frame.cluster;
    if (!frame?.header?.manufacturerCode && frame?.cluster && deviceManufacturerID === Zcl.ManufacturerCode.LEGRAND_GROUP) {
        cluster = Zcl.Utils.getCluster(frame.cluster.ID, deviceManufacturerID, customClusters);
    }
    return cluster;
}
function attributeKeyValue(frame, deviceManufacturerID, customClusters) {
    const payload = {};
    const cluster = getCluster(frame, deviceManufacturerID, customClusters);
    // TODO: remove this type once Zcl.Frame is typed
    for (const item of frame.payload) {
        payload[cluster.getAttribute(item.attrId)?.name ?? item.attrId] = item.attrData;
    }
    return payload;
}
function attributeList(frame, deviceManufacturerID, customClusters) {
    const payload = [];
    const cluster = getCluster(frame, deviceManufacturerID, customClusters);
    // TODO: remove this type once Zcl.Frame is typed
    for (const item of frame.payload) {
        payload.push(cluster.getAttribute(item.attrId)?.name ?? item.attrId);
    }
    return payload;
}
//# sourceMappingURL=zclFrameConverter.js.map