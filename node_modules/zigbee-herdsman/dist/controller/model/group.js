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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const logger_1 = require("../../utils/logger");
const Zcl = __importStar(require("../../zspec/zcl"));
const zclTransactionSequenceNumber_1 = __importDefault(require("../helpers/zclTransactionSequenceNumber"));
const device_1 = __importDefault(require("./device"));
const entity_1 = __importDefault(require("./entity"));
const zigbeeEntity_1 = require("./zigbeeEntity");
const NS = "zh:controller:group";
class Group extends zigbeeEntity_1.ZigbeeEntity {
    databaseID;
    groupID;
    _members;
    #customClusters;
    // Can be used by applications to store data.
    meta;
    // This lookup contains all groups that are queried from the database, this is to ensure that always
    // the same instance is returned.
    static groups = new Map();
    static loadedFromDatabase = false;
    /** Member endpoints with valid devices (not unknown/deleted) */
    get members() {
        return this._members.filter((e) => e.getDevice() !== undefined);
    }
    /** List of server / client custom clusters common to all devices in the group */
    get customClusters() {
        return this.#customClusters;
    }
    constructor(databaseID, groupID, members, meta) {
        super();
        this.databaseID = databaseID;
        this.groupID = groupID;
        this._members = members;
        this.meta = meta;
        this.#customClusters = this.#identifyCustomClusters();
    }
    /*
     * CRUD
     */
    /**
     * Reset runtime lookups.
     */
    static resetCache() {
        Group.groups.clear();
        Group.loadedFromDatabase = false;
    }
    static fromDatabaseEntry(entry) {
        // db is expected to never contain duplicate, so no need for explicit check
        const members = [];
        for (const member of entry.members) {
            const device = device_1.default.byIeeeAddr(member.deviceIeeeAddr);
            if (device) {
                const endpoint = device.getEndpoint(member.endpointID);
                if (endpoint) {
                    members.push(endpoint);
                }
            }
        }
        return new Group(entry.id, entry.groupID, members, entry.meta);
    }
    toDatabaseRecord() {
        const members = [];
        for (const member of this._members) {
            const device = member.getDevice();
            if (device) {
                members.push({ deviceIeeeAddr: device.ieeeAddr, endpointID: member.ID });
            }
        }
        return { id: this.databaseID, type: "Group", groupID: this.groupID, members, meta: this.meta };
    }
    static loadFromDatabaseIfNecessary() {
        if (!Group.loadedFromDatabase) {
            for (const entry of entity_1.default.database.getEntriesIterator(["Group"])) {
                const group = Group.fromDatabaseEntry(entry);
                Group.groups.set(group.groupID, group);
            }
            Group.loadedFromDatabase = true;
        }
    }
    static byGroupID(groupID) {
        Group.loadFromDatabaseIfNecessary();
        return Group.groups.get(groupID);
    }
    /**
     * @deprecated use allIterator()
     */
    static all() {
        Group.loadFromDatabaseIfNecessary();
        return Array.from(Group.groups.values());
    }
    static *allIterator(predicate) {
        Group.loadFromDatabaseIfNecessary();
        for (const group of Group.groups.values()) {
            if (!predicate || predicate(group)) {
                yield group;
            }
        }
    }
    static create(groupID) {
        (0, node_assert_1.default)(typeof groupID === "number", "GroupID must be a number");
        // Don't allow groupID 0, from the spec:
        // "Scene identifier 0x00, along with group identifier 0x0000, is reserved for the global scene used by the OnOff cluster"
        (0, node_assert_1.default)(groupID >= 1, "GroupID must be at least 1");
        Group.loadFromDatabaseIfNecessary();
        if (Group.groups.has(groupID)) {
            throw new Error(`Group with groupID '${groupID}' already exists`);
        }
        const databaseID = entity_1.default.database.newID();
        const group = new Group(databaseID, groupID, [], {});
        entity_1.default.database.insert(group.toDatabaseRecord());
        Group.groups.set(group.groupID, group);
        return group;
    }
    async removeFromNetwork() {
        for (const endpoint of this._members) {
            await endpoint.removeFromGroup(this);
        }
        this.removeFromDatabase();
    }
    removeFromDatabase() {
        Group.loadFromDatabaseIfNecessary();
        if (entity_1.default.database.has(this.databaseID)) {
            entity_1.default.database.remove(this.databaseID);
        }
        Group.groups.delete(this.groupID);
    }
    save(writeDatabase = true) {
        entity_1.default.database.update(this.toDatabaseRecord(), writeDatabase);
    }
    addMember(endpoint) {
        if (!this._members.includes(endpoint)) {
            this._members.push(endpoint);
            this.save();
            this.#customClusters = this.#identifyCustomClusters();
        }
    }
    removeMember(endpoint) {
        const i = this._members.indexOf(endpoint);
        if (i > -1) {
            this._members.splice(i, 1);
            this.save();
            this.#customClusters = this.#identifyCustomClusters();
        }
    }
    hasMember(endpoint) {
        return this._members.includes(endpoint);
    }
    #identifyCustomClusters() {
        const members = this.members;
        if (members.length > 0) {
            const customClusters = members[0].getDevice().customClusters;
            const inputClusters = {};
            const outputClusters = {};
            for (const clusterName in customClusters) {
                const customCluster = customClusters[clusterName];
                let hasInput = true;
                let hasOutput = true;
                for (const member of members) {
                    if (clusterName in member.getDevice().customClusters) {
                        hasInput = member.inputClusters.includes(customCluster.ID);
                        hasOutput = member.outputClusters.includes(customCluster.ID);
                        if (!hasInput && !hasOutput) {
                            break;
                        }
                    }
                    else {
                        hasInput = false;
                        hasOutput = false;
                        break;
                    }
                }
                if (hasInput) {
                    inputClusters[clusterName] = customCluster;
                }
                if (hasOutput) {
                    outputClusters[clusterName] = customCluster;
                }
            }
            return [inputClusters, outputClusters];
        }
        return [{}, {}];
    }
    /*
     * Zigbee functions
     */
    async write(clusterKey, attributes, options) {
        const customClusters = this.#customClusters[options?.direction === Zcl.Direction.SERVER_TO_CLIENT ? 1 : 0 /* default to CLIENT_TO_SERVER */];
        const cluster = Zcl.Utils.getCluster(clusterKey, options?.manufacturerCode, customClusters);
        const optionsWithDefaults = this.getOptionsWithDefaults(options, Zcl.Direction.CLIENT_TO_SERVER, cluster.manufacturerCode);
        const payload = [];
        for (const nameOrID in attributes) {
            const attribute = cluster.getAttribute(nameOrID);
            if (attribute) {
                payload.push({ attrId: attribute.ID, attrData: attributes[nameOrID], dataType: attribute.type });
            }
            else if (!Number.isNaN(Number(nameOrID))) {
                const value = attributes[nameOrID];
                payload.push({ attrId: Number(nameOrID), attrData: value.value, dataType: value.type });
            }
            else {
                throw new Error(`Unknown attribute '${nameOrID}', specify either an existing attribute or a number`);
            }
        }
        const createLogMessage = () => `Write ${this.groupID} ${cluster.name}(${JSON.stringify(attributes)}, ${JSON.stringify(optionsWithDefaults)})`;
        logger_1.logger.debug(createLogMessage, NS);
        try {
            const frame = Zcl.Frame.create(Zcl.FrameType.GLOBAL, optionsWithDefaults.direction, true, optionsWithDefaults.manufacturerCode, optionsWithDefaults.transactionSequenceNumber ?? zclTransactionSequenceNumber_1.default.next(), "write", cluster, payload, customClusters, optionsWithDefaults.reservedBits);
            await entity_1.default.adapter.sendZclFrameToGroup(this.groupID, frame, optionsWithDefaults.srcEndpoint);
        }
        catch (error) {
            const err = error;
            err.message = `${createLogMessage()} failed (${err.message})`;
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            logger_1.logger.debug(err.stack, NS);
            throw error;
        }
    }
    async read(clusterKey, attributes, options) {
        const customClusters = this.#customClusters[options?.direction === Zcl.Direction.SERVER_TO_CLIENT ? 1 : 0 /* default to CLIENT_TO_SERVER */];
        const cluster = Zcl.Utils.getCluster(clusterKey, options?.manufacturerCode, customClusters);
        const optionsWithDefaults = this.getOptionsWithDefaults(options, Zcl.Direction.CLIENT_TO_SERVER, cluster.manufacturerCode);
        const payload = [];
        for (const attribute of attributes) {
            if (typeof attribute === "number") {
                payload.push({ attrId: attribute });
            }
            else {
                const attr = cluster.getAttribute(attribute);
                if (attr) {
                    payload.push({ attrId: attr.ID });
                }
                else {
                    logger_1.logger.warning(`Ignoring unknown attribute ${attribute} in cluster ${cluster.name}`, NS);
                }
            }
        }
        const frame = Zcl.Frame.create(Zcl.FrameType.GLOBAL, optionsWithDefaults.direction, true, optionsWithDefaults.manufacturerCode, optionsWithDefaults.transactionSequenceNumber ?? zclTransactionSequenceNumber_1.default.next(), "read", cluster, payload, customClusters, optionsWithDefaults.reservedBits);
        const createLogMessage = () => `Read ${this.groupID} ${cluster.name}(${JSON.stringify(attributes)}, ${JSON.stringify(optionsWithDefaults)})`;
        logger_1.logger.debug(createLogMessage, NS);
        try {
            await entity_1.default.adapter.sendZclFrameToGroup(this.groupID, frame, optionsWithDefaults.srcEndpoint);
        }
        catch (error) {
            const err = error;
            err.message = `${createLogMessage()} failed (${err.message})`;
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            logger_1.logger.debug(err.stack, NS);
            throw error;
        }
    }
    async command(clusterKey, commandKey, payload, options) {
        const customClusters = this.#customClusters[options?.direction === Zcl.Direction.SERVER_TO_CLIENT ? 1 : 0 /* default to CLIENT_TO_SERVER */];
        const cluster = Zcl.Utils.getCluster(clusterKey, options?.manufacturerCode, customClusters);
        const optionsWithDefaults = this.getOptionsWithDefaults(options, Zcl.Direction.CLIENT_TO_SERVER, cluster.manufacturerCode);
        const command = optionsWithDefaults.direction === Zcl.Direction.CLIENT_TO_SERVER
            ? cluster.getCommand(commandKey)
            : cluster.getCommandResponse(commandKey);
        const createLogMessage = () => `Command ${this.groupID} ${cluster.name}.${command.name}(${JSON.stringify(payload)})`;
        logger_1.logger.debug(createLogMessage, NS);
        try {
            const frame = Zcl.Frame.create(Zcl.FrameType.SPECIFIC, optionsWithDefaults.direction, true, optionsWithDefaults.manufacturerCode, optionsWithDefaults.transactionSequenceNumber ?? zclTransactionSequenceNumber_1.default.next(), command, cluster, payload, customClusters, optionsWithDefaults.reservedBits);
            await entity_1.default.adapter.sendZclFrameToGroup(this.groupID, frame, optionsWithDefaults.srcEndpoint);
        }
        catch (error) {
            const err = error;
            err.message = `${createLogMessage()} failed (${err.message})`;
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            logger_1.logger.debug(err.stack, NS);
            throw error;
        }
    }
    getOptionsWithDefaults(options, direction, manufacturerCode) {
        return {
            direction,
            srcEndpoint: undefined,
            reservedBits: 0,
            manufacturerCode,
            transactionSequenceNumber: undefined,
            ...(options || {}),
        };
    }
}
exports.Group = Group;
exports.default = Group;
//# sourceMappingURL=group.js.map