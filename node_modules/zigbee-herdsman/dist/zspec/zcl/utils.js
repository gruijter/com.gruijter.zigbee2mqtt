"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataTypeClass = getDataTypeClass;
exports.getCluster = getCluster;
exports.getGlobalCommand = getGlobalCommand;
exports.isClusterName = isClusterName;
exports.getFoundationCommand = getFoundationCommand;
exports.isFoundationDiscoverRsp = isFoundationDiscoverRsp;
const cluster_1 = require("./definition/cluster");
const enums_1 = require("./definition/enums");
const foundation_1 = require("./definition/foundation");
const DATA_TYPE_CLASS_DISCRETE = [
    enums_1.DataType.DATA8,
    enums_1.DataType.DATA16,
    enums_1.DataType.DATA24,
    enums_1.DataType.DATA32,
    enums_1.DataType.DATA40,
    enums_1.DataType.DATA48,
    enums_1.DataType.DATA56,
    enums_1.DataType.DATA64,
    enums_1.DataType.BOOLEAN,
    enums_1.DataType.BITMAP8,
    enums_1.DataType.BITMAP16,
    enums_1.DataType.BITMAP24,
    enums_1.DataType.BITMAP32,
    enums_1.DataType.BITMAP40,
    enums_1.DataType.BITMAP48,
    enums_1.DataType.BITMAP56,
    enums_1.DataType.BITMAP64,
    enums_1.DataType.ENUM8,
    enums_1.DataType.ENUM16,
    enums_1.DataType.OCTET_STR,
    enums_1.DataType.CHAR_STR,
    enums_1.DataType.LONG_OCTET_STR,
    enums_1.DataType.LONG_CHAR_STR,
    enums_1.DataType.ARRAY,
    enums_1.DataType.STRUCT,
    enums_1.DataType.SET,
    enums_1.DataType.BAG,
    enums_1.DataType.CLUSTER_ID,
    enums_1.DataType.ATTR_ID,
    enums_1.DataType.BAC_OID,
    enums_1.DataType.IEEE_ADDR,
    enums_1.DataType.SEC_KEY,
];
const DATA_TYPE_CLASS_ANALOG = [
    enums_1.DataType.UINT8,
    enums_1.DataType.UINT16,
    enums_1.DataType.UINT24,
    enums_1.DataType.UINT32,
    enums_1.DataType.UINT40,
    enums_1.DataType.UINT48,
    enums_1.DataType.UINT56,
    enums_1.DataType.INT8,
    enums_1.DataType.INT16,
    enums_1.DataType.INT24,
    enums_1.DataType.INT32,
    enums_1.DataType.INT40,
    enums_1.DataType.INT48,
    enums_1.DataType.INT56,
    enums_1.DataType.SEMI_PREC,
    enums_1.DataType.SINGLE_PREC,
    enums_1.DataType.DOUBLE_PREC,
    enums_1.DataType.TOD,
    enums_1.DataType.DATE,
    enums_1.DataType.UTC,
];
const FOUNDATION_DISCOVER_RSP_IDS = [
    foundation_1.Foundation.discoverRsp.ID,
    foundation_1.Foundation.discoverCommandsRsp.ID,
    foundation_1.Foundation.discoverCommandsGenRsp.ID,
    foundation_1.Foundation.discoverExtRsp.ID,
];
function getDataTypeClass(dataType) {
    if (DATA_TYPE_CLASS_DISCRETE.includes(dataType)) {
        return enums_1.DataTypeClass.DISCRETE;
    }
    if (DATA_TYPE_CLASS_ANALOG.includes(dataType)) {
        return enums_1.DataTypeClass.ANALOG;
    }
    throw new Error(`Don't know value type for '${enums_1.DataType[dataType]}'`);
}
function hasCustomClusters(customClusters) {
    // XXX: was there a good reason to not set the parameter `customClusters` optional? it would allow simple undefined check
    // below is twice faster than checking `Object.keys(customClusters).length`
    for (const _k in customClusters)
        return true;
    return false;
}
function findClusterNameByID(id, manufacturerCode, clusters) {
    let name;
    // if manufacturer code is given, consider partial match if didn't match against manufacturer code
    let partialMatch = Boolean(manufacturerCode);
    for (const clusterName in clusters) {
        const cluster = clusters[clusterName];
        if (cluster.ID === id) {
            // priority on first match when matching only ID
            if (name === undefined) {
                name = clusterName;
            }
            if (manufacturerCode && cluster.manufacturerCode === manufacturerCode) {
                name = clusterName;
                partialMatch = false;
                break;
            }
            if (!cluster.manufacturerCode) {
                name = clusterName;
                break;
            }
        }
    }
    return [name, partialMatch];
}
function getClusterDefinition(key, manufacturerCode, customClusters) {
    let name;
    if (typeof key === "number") {
        let partialMatch;
        // custom clusters have priority over Zcl clusters, except in case of better match (see below)
        [name, partialMatch] = findClusterNameByID(key, manufacturerCode, customClusters);
        if (!name) {
            [name, partialMatch] = findClusterNameByID(key, manufacturerCode, cluster_1.Clusters);
        }
        else if (partialMatch) {
            let zclName;
            [zclName, partialMatch] = findClusterNameByID(key, manufacturerCode, cluster_1.Clusters);
            // Zcl clusters contain a better match, use that one
            if (zclName !== undefined && !partialMatch) {
                name = zclName;
            }
        }
    }
    else {
        name = key;
    }
    let cluster = name !== undefined && hasCustomClusters(customClusters)
        ? {
            ...cluster_1.Clusters[name],
            ...customClusters[name], // should override Zcl clusters
        }
        : cluster_1.Clusters[name];
    if (!cluster || cluster.ID === undefined) {
        if (typeof key === "number") {
            name = key.toString();
            cluster = { attributes: {}, commands: {}, commandsResponse: {}, manufacturerCode: undefined, ID: key };
        }
        else {
            name = undefined;
        }
    }
    if (!name) {
        throw new Error(`Cluster with name '${key}' does not exist`);
    }
    return { name, cluster };
}
function cloneClusterEntriesWithName(entries) {
    const clone = {};
    for (const key in entries) {
        clone[key] = { ...entries[key], name: key };
    }
    return clone;
}
function createCluster(name, cluster, manufacturerCode) {
    const attributes = cloneClusterEntriesWithName(cluster.attributes);
    const commands = cloneClusterEntriesWithName(cluster.commands);
    const commandsResponse = cloneClusterEntriesWithName(cluster.commandsResponse);
    const getAttribute = (key) => {
        if (typeof key === "number") {
            let partialMatchAttr;
            for (const attrKey in attributes) {
                const attr = attributes[attrKey];
                if (attr.ID === key) {
                    if (manufacturerCode && attr.manufacturerCode === manufacturerCode) {
                        return attr;
                    }
                    if (attr.manufacturerCode === undefined) {
                        partialMatchAttr = attr;
                    }
                }
            }
            return partialMatchAttr;
        }
        return attributes[key];
    };
    const getCommand = (key) => {
        if (typeof key === "number") {
            for (const cmdKey in commands) {
                const cmd = commands[cmdKey];
                if (cmd.ID === key) {
                    return cmd;
                }
            }
        }
        else {
            const cmd = commands[key];
            if (cmd) {
                return cmd;
            }
        }
        throw new Error(`Cluster '${name}' has no command '${key}'`);
    };
    const getCommandResponse = (key) => {
        if (typeof key === "number") {
            for (const cmdKey in commandsResponse) {
                const cmd = commandsResponse[cmdKey];
                if (cmd.ID === key) {
                    return cmd;
                }
            }
        }
        else {
            const cmd = commandsResponse[key];
            if (cmd) {
                return cmd;
            }
        }
        throw new Error(`Cluster '${name}' has no command response '${key}'`);
    };
    return {
        ID: cluster.ID,
        attributes,
        manufacturerCode: cluster.manufacturerCode,
        name,
        commands,
        commandsResponse,
        getAttribute,
        getCommand,
        getCommandResponse,
    };
}
function getCluster(key, manufacturerCode = undefined, customClusters = {}) {
    const { name, cluster } = getClusterDefinition(key, manufacturerCode, customClusters);
    return createCluster(name, cluster, manufacturerCode);
}
function getGlobalCommandNameById(id) {
    for (const commandName in foundation_1.Foundation) {
        if (foundation_1.Foundation[commandName].ID === id) {
            return commandName;
        }
    }
    throw new Error(`Global command with id '${id}' does not exist.`);
}
function getGlobalCommand(key) {
    const name = typeof key === "number" ? getGlobalCommandNameById(key) : key;
    const command = foundation_1.Foundation[name];
    if (!command) {
        throw new Error(`Global command with key '${key}' does not exist`);
    }
    const result = {
        ID: command.ID,
        name,
        parameters: command.parameters,
    };
    if (command.response !== undefined) {
        result.response = command.response;
    }
    return result;
}
function isClusterName(name) {
    return name in cluster_1.Clusters;
}
function getFoundationCommand(id) {
    for (const commandName in foundation_1.Foundation) {
        const command = foundation_1.Foundation[commandName];
        if (command.ID === id) {
            return command;
        }
    }
    throw new Error(`Foundation command '${id}' does not exist.`);
}
function isFoundationDiscoverRsp(id) {
    return FOUNDATION_DISCOVER_RSP_IDS.includes(id);
}
//# sourceMappingURL=utils.js.map