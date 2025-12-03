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
exports.ZclFrame = void 0;
require("../../utils/patchBigIntSerialization");
const buffaloZcl_1 = require("./buffaloZcl");
const enums_1 = require("./definition/enums");
const Utils = __importStar(require("./utils"));
const zclHeader_1 = require("./zclHeader");
const ListTypes = [
    enums_1.BuffaloZclDataType.LIST_UINT8,
    enums_1.BuffaloZclDataType.LIST_UINT16,
    enums_1.BuffaloZclDataType.LIST_UINT24,
    enums_1.BuffaloZclDataType.LIST_UINT32,
    enums_1.BuffaloZclDataType.LIST_ZONEINFO,
];
class ZclFrame {
    header;
    payload;
    cluster;
    command;
    constructor(header, payload, cluster, command) {
        this.header = header;
        this.payload = payload;
        this.cluster = cluster;
        this.command = command;
    }
    toString() {
        return JSON.stringify({ header: this.header, payload: this.payload, command: this.command });
    }
    /**
     * Creating
     */
    static create(frameType, direction, disableDefaultResponse, manufacturerCode, transactionSequenceNumber, commandKey, clusterKey, payload, customClusters, reservedBits = 0) {
        const cluster = typeof clusterKey === "object" ? clusterKey : Utils.getCluster(clusterKey, manufacturerCode, customClusters);
        const command = typeof commandKey === "object"
            ? commandKey
            : frameType === enums_1.FrameType.GLOBAL
                ? Utils.getGlobalCommand(commandKey)
                : direction === enums_1.Direction.CLIENT_TO_SERVER
                    ? cluster.getCommand(commandKey)
                    : cluster.getCommandResponse(commandKey);
        const header = new zclHeader_1.ZclHeader({ reservedBits, frameType, direction, disableDefaultResponse, manufacturerSpecific: manufacturerCode != null }, manufacturerCode, transactionSequenceNumber, command.ID);
        return new ZclFrame(header, payload, cluster, command);
    }
    toBuffer() {
        const buffalo = new buffaloZcl_1.BuffaloZcl(Buffer.alloc(250));
        this.header.write(buffalo);
        if (this.header.isGlobal) {
            this.writePayloadGlobal(buffalo);
        }
        else if (this.header.isSpecific) {
            this.writePayloadCluster(buffalo);
        }
        else {
            throw new Error(`Frametype '${this.header.frameControl.frameType}' not valid`);
        }
        return buffalo.getWritten();
    }
    writePayloadGlobal(buffalo) {
        const command = Utils.getFoundationCommand(this.command.ID);
        if (command.parseStrategy === "repetitive") {
            for (const entry of this.payload) {
                for (const parameter of command.parameters) {
                    const options = {};
                    if (!ZclFrame.conditionsValid(parameter, entry, undefined)) {
                        continue;
                    }
                    if (parameter.type === enums_1.BuffaloZclDataType.USE_DATA_TYPE && typeof entry.dataType === "number") {
                        // We need to grab the dataType to parse useDataType
                        options.dataType = entry.dataType;
                    }
                    buffalo.write(parameter.type, entry[parameter.name], options);
                }
            }
        }
        else if (command.parseStrategy === "flat") {
            for (const parameter of command.parameters) {
                buffalo.write(parameter.type, this.payload[parameter.name], {});
            }
        }
        else {
            if (command.parseStrategy === "oneof") {
                if (Utils.isFoundationDiscoverRsp(command.ID)) {
                    buffalo.writeUInt8(this.payload.discComplete);
                    for (const entry of this.payload.attrInfos) {
                        for (const parameter of command.parameters) {
                            buffalo.write(parameter.type, entry[parameter.name], {});
                        }
                    }
                }
            }
        }
    }
    writePayloadCluster(buffalo) {
        for (const parameter of this.command.parameters) {
            if (!ZclFrame.conditionsValid(parameter, this.payload, undefined)) {
                continue;
            }
            // TODO: biome migration - safer
            if (this.payload[parameter.name] == null) {
                throw new Error(`Parameter '${parameter.name}' is missing`);
            }
            buffalo.write(parameter.type, this.payload[parameter.name], {});
        }
    }
    /**
     * Parsing
     */
    static fromBuffer(clusterID, header, buffer, customClusters) {
        if (!header) {
            throw new Error("Invalid ZclHeader.");
        }
        const buffalo = new buffaloZcl_1.BuffaloZcl(buffer, header.length);
        const cluster = Utils.getCluster(clusterID, header.manufacturerCode, customClusters);
        const command = header.isGlobal
            ? Utils.getGlobalCommand(header.commandIdentifier)
            : header.frameControl.direction === enums_1.Direction.CLIENT_TO_SERVER
                ? cluster.getCommand(header.commandIdentifier)
                : cluster.getCommandResponse(header.commandIdentifier);
        const payload = ZclFrame.parsePayload(header, cluster, buffalo);
        return new ZclFrame(header, payload, cluster, command);
    }
    static parsePayload(header, cluster, buffalo) {
        if (header.isGlobal) {
            return ZclFrame.parsePayloadGlobal(header, buffalo);
        }
        if (header.isSpecific) {
            return ZclFrame.parsePayloadCluster(header, cluster, buffalo);
        }
        throw new Error(`Unsupported frameType '${header.frameControl.frameType}'`);
    }
    static parsePayloadCluster(header, cluster, buffalo) {
        const command = header.frameControl.direction === enums_1.Direction.CLIENT_TO_SERVER
            ? cluster.getCommand(header.commandIdentifier)
            : cluster.getCommandResponse(header.commandIdentifier);
        const payload = {};
        for (const parameter of command.parameters) {
            const options = { payload };
            if (!ZclFrame.conditionsValid(parameter, payload, buffalo.getBuffer().length - buffalo.getPosition())) {
                continue;
            }
            if (ListTypes.includes(parameter.type)) {
                const lengthParameter = command.parameters[command.parameters.indexOf(parameter) - 1];
                const length = payload[lengthParameter.name];
                if (typeof length === "number") {
                    options.length = length;
                }
            }
            try {
                payload[parameter.name] = buffalo.read(parameter.type, options);
            }
            catch (error) {
                throw new Error(`Cannot parse '${command.name}:${parameter.name}' (${error.message})`);
            }
        }
        return payload;
    }
    static parsePayloadGlobal(header, buffalo) {
        const command = Utils.getFoundationCommand(header.commandIdentifier);
        if (command.parseStrategy === "repetitive") {
            const payload = [];
            while (buffalo.isMore()) {
                // biome-ignore lint/suspicious/noExplicitAny: API
                const entry = {};
                for (const parameter of command.parameters) {
                    const options = {};
                    if (!ZclFrame.conditionsValid(parameter, entry, buffalo.getBuffer().length - buffalo.getPosition())) {
                        continue;
                    }
                    if (parameter.type === enums_1.BuffaloZclDataType.USE_DATA_TYPE && typeof entry.dataType === "number") {
                        // We need to grab the dataType to parse useDataType
                        options.dataType = entry.dataType;
                        if (entry.dataType === enums_1.DataType.CHAR_STR && entry.attrId === 65281) {
                            // [workaround] parse char str as Xiaomi struct
                            options.dataType = enums_1.BuffaloZclDataType.MI_STRUCT;
                        }
                    }
                    entry[parameter.name] = buffalo.read(parameter.type, options);
                    // TODO: not needed, but temp workaroudn to make payload equal to that of zcl-packet
                    // XXX: is this still needed?
                    if (parameter.type === enums_1.BuffaloZclDataType.USE_DATA_TYPE && entry.dataType === enums_1.DataType.STRUCT) {
                        entry.structElms = entry.attrData;
                        entry.numElms = entry.attrData.length;
                    }
                }
                payload.push(entry);
            }
            return payload;
        }
        if (command.parseStrategy === "flat") {
            // biome-ignore lint/suspicious/noExplicitAny: API
            const payload = {};
            for (const parameter of command.parameters) {
                payload[parameter.name] = buffalo.read(parameter.type, {});
            }
            return payload;
        }
        if (command.parseStrategy === "oneof") {
            if (Utils.isFoundationDiscoverRsp(command.ID)) {
                // biome-ignore lint/suspicious/noExplicitAny: API
                const payload = {
                    discComplete: buffalo.readUInt8(),
                    attrInfos: [],
                };
                while (buffalo.isMore()) {
                    const entry = {};
                    for (const parameter of command.parameters) {
                        entry[parameter.name] = buffalo.read(parameter.type, {});
                    }
                    payload.attrInfos.push(entry);
                }
                return payload;
            }
        }
    }
    /**
     * Utils
     */
    static conditionsValid(parameter, entry, remainingBufferBytes) {
        if (parameter.conditions) {
            for (const condition of parameter.conditions) {
                switch (condition.type) {
                    case enums_1.ParameterCondition.FIELD_EQUAL: {
                        if (condition.reversed) {
                            if (entry[condition.field] === condition.value) {
                                return false;
                            }
                        }
                        else if (entry[condition.field] !== condition.value) {
                            return false;
                        }
                        break;
                    }
                    case enums_1.ParameterCondition.BITMASK_SET: {
                        if (condition.reversed) {
                            if ((entry[condition.param] & condition.mask) === condition.mask) {
                                return false;
                            }
                        }
                        else if ((entry[condition.param] & condition.mask) !== condition.mask) {
                            return false;
                        }
                        break;
                    }
                    case enums_1.ParameterCondition.BITFIELD_ENUM: {
                        if (((entry[condition.param] >> condition.offset) & ((1 << condition.size) - 1)) !== condition.value) {
                            return false;
                        }
                        break;
                    }
                    case enums_1.ParameterCondition.MINIMUM_REMAINING_BUFFER_BYTES: {
                        if (remainingBufferBytes !== undefined && remainingBufferBytes < condition.value) {
                            return false;
                        }
                        break;
                    }
                    case enums_1.ParameterCondition.DATA_TYPE_CLASS_EQUAL: {
                        if (Utils.getDataTypeClass(entry.dataType) !== condition.value) {
                            return false;
                        }
                        break;
                    }
                    case enums_1.ParameterCondition.FIELD_GT: {
                        /*if (condition.reversed) {
                            if (entry[condition.field] >= condition.value) {
                                return false;
                            }
                        } else */
                        if (entry[condition.field] <= condition.value) {
                            return false;
                        }
                        break;
                    }
                }
            }
        }
        return true;
    }
    isCluster(clusterName) {
        return this.cluster.name === clusterName;
    }
    // List of commands is not completed, feel free to add more.
    isCommand(commandName) {
        return this.command.name === commandName;
    }
}
exports.ZclFrame = ZclFrame;
//# sourceMappingURL=zclFrame.js.map