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
exports.AdapterBackup = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const utils_1 = require("../../../utils");
const logger_1 = require("../../../utils/logger");
const zspec_1 = require("../../../zspec");
const utils_2 = require("../../utils");
const common_1 = require("../constants/common");
const Structs = __importStar(require("../structs"));
const structs_1 = require("../structs");
const constants_1 = require("../unpi/constants");
const Utils = __importStar(require("../utils"));
const tstype_1 = require("./tstype");
const NS = "zh:zstack:backup";
/**
 * Class providing ZNP adapter backup and restore procedures based mostly on NV memory manipulation.
 */
class AdapterBackup {
    znp;
    nv;
    defaultPath;
    constructor(znp, nv, path) {
        this.znp = znp;
        this.nv = nv;
        this.defaultPath = path;
    }
    /**
     * Loads currently stored backup and returns it in internal backup model.
     */
    getStoredBackup() {
        const data = (0, utils_2.readBackup)(this.defaultPath);
        if (!data)
            return undefined;
        if ("adapterType" in data) {
            return utils_1.BackupUtils.fromLegacyBackup(data);
        }
        if (data.metadata?.format === "zigpy/open-coordinator-backup" && data.metadata?.version) {
            if (data.metadata?.version !== 1) {
                throw new Error(`Unsupported open coordinator backup version (version=${data.metadata?.version})`);
            }
            return utils_1.BackupUtils.fromUnifiedBackup(data);
        }
        throw new Error("Unknown backup format");
    }
    /**
     * Creates a new backup from connected ZNP adapter and returns it in internal backup model format.
     */
    async createBackup(ieeeAddressesInDatabase) {
        logger_1.logger.debug("creating backup", NS);
        const version = await this.getAdapterVersion();
        /* get adapter ieee address */
        const ieeeAddressResponse = await this.znp.requestWithReply(constants_1.Subsystem.SYS, "getExtAddr", {});
        if (!ieeeAddressResponse.payload.extaddress || !ieeeAddressResponse.payload.extaddress.startsWith("0x")) {
            throw new Error("Failed to read adapter IEEE address");
        }
        const ieeeAddress = Buffer.from(ieeeAddressResponse.payload.extaddress.split("0x")[1], "hex");
        logger_1.logger.debug("fetched adapter ieee address", NS);
        /* get adapter nib */
        const nib = await this.nv.readItem(common_1.NvItemsIds.NIB, 0, Structs.nib);
        if (!nib) {
            throw new Error("Cannot backup - adapter not commissioned");
        }
        logger_1.logger.debug("fetched adapter nib", NS);
        /* get adapter active key information */
        let activeKeyInfo;
        if (version === tstype_1.ZnpVersion.ZStack12) {
            const key = Structs.nwkKey((await this.znp.requestWithReply(constants_1.Subsystem.SAPI, "readConfiguration", { configid: common_1.NvItemsIds.PRECFGKEY })).payload.value);
            activeKeyInfo = Structs.nwkKeyDescriptor();
            activeKeyInfo.key = key.key;
        }
        else {
            activeKeyInfo = await this.nv.readItem(common_1.NvItemsIds.NWK_ACTIVE_KEY_INFO, 0, Structs.nwkKeyDescriptor);
        }
        if (!activeKeyInfo) {
            throw new Error("Cannot backup - missing active key info");
        }
        logger_1.logger.debug("fetched adapter active key information", NS);
        /* get adapter security data */
        const preconfiguredKeyEnabled = await this.nv.readItem(common_1.NvItemsIds.PRECFGKEYS_ENABLE, 0);
        logger_1.logger.debug("fetched adapter pre-configured key", NS);
        const addressManagerTable = await this.getAddressManagerTable(version);
        logger_1.logger.debug(`fetched adapter address manager table (capacity=${addressManagerTable?.capacity || 0}, used=${addressManagerTable?.usedCount || 0})`, NS);
        const securityManagerTable = await this.getSecurityManagerTable();
        logger_1.logger.debug(`fetched adapter security manager table (capacity=${securityManagerTable?.usedCount || 0}, used=${securityManagerTable?.usedCount || 0})`, NS);
        const apsLinkKeyDataTable = await this.getApsLinkKeyDataTable(version);
        logger_1.logger.debug(`fetched adapter aps link key data table (capacity=${apsLinkKeyDataTable?.usedCount || 0}, used=${apsLinkKeyDataTable?.usedCount || 0})`, NS);
        const tclkSeed = version === tstype_1.ZnpVersion.ZStack12 ? null : await this.nv.readItem(common_1.NvItemsIds.TCLK_SEED, 0, Structs.nwkKey);
        logger_1.logger.debug("fetched adapter tclk seed", NS);
        const tclkTable = await this.getTclkTable(version);
        logger_1.logger.debug(`fetched adapter tclk table (capacity=${tclkTable?.usedCount || 0}, used=${tclkTable?.usedCount || 0})`, NS);
        const secMaterialTable = await this.getNetworkSecurityMaterialTable(version);
        logger_1.logger.debug(`fetched adapter network security material table (capacity=${secMaterialTable?.usedCount || 0}, used=${secMaterialTable?.usedCount || 0})`, NS);
        /* examine network security material table */
        const genericExtendedPanId = Buffer.alloc(8, 0xff);
        let secMaterialDescriptor;
        for (const entry of secMaterialTable.used) {
            if (entry.extendedPanID.equals(nib.extendedPANID)) {
                secMaterialDescriptor = entry;
                break;
            }
            if (!secMaterialDescriptor && entry.extendedPanID.equals(genericExtendedPanId)) {
                secMaterialDescriptor = entry;
            }
        }
        if (!secMaterialDescriptor) {
            secMaterialDescriptor = Structs.nwkSecMaterialDescriptorEntry();
            secMaterialDescriptor.extendedPanID = nib.extendedPANID;
            secMaterialDescriptor.FrameCounter = version === tstype_1.ZnpVersion.ZStack12 ? 0 : 1250;
        }
        /* return backup structure */
        const backup = {
            znp: {
                version: version,
                trustCenterLinkKeySeed: tclkSeed?.key || undefined,
            },
            networkOptions: {
                panId: nib.nwkPanId,
                extendedPanId: nib.extendedPANID,
                channelList: Utils.unpackChannelList(nib.channelList),
                networkKey: activeKeyInfo.key,
                networkKeyDistribute: preconfiguredKeyEnabled && preconfiguredKeyEnabled[0] === 0x01,
            },
            logicalChannel: nib.nwkLogicalChannel,
            networkKeyInfo: {
                sequenceNumber: activeKeyInfo.keySeqNum,
                frameCounter: secMaterialDescriptor.FrameCounter,
            },
            securityLevel: nib.SecurityLevel,
            networkUpdateId: nib.nwkUpdateId,
            coordinatorIeeeAddress: ieeeAddress,
            devices: addressManagerTable?.used
                .map((ame, ami) => {
                /* take all entries of assoc and/or security type */
                /* v8 ignore start */
                if (!ame.isSet() || (ame.user & (structs_1.AddressManagerUser.Assoc | structs_1.AddressManagerUser.Security)) === 0) {
                    return null;
                }
                /* v8 ignore stop */
                let linkKeyInfo;
                const sme = securityManagerTable.used.find((e) => e.ami === ami);
                if (sme) {
                    const apsKeyDataIndex = version === tstype_1.ZnpVersion.ZStack30x ? sme.keyNvId - common_1.NvItemsIds.APS_LINK_KEY_DATA_START : sme.keyNvId;
                    /* v8 ignore next */
                    const apsKeyData = apsLinkKeyDataTable.used[apsKeyDataIndex] || null;
                    if (apsKeyData) {
                        linkKeyInfo = {
                            key: apsKeyData.key,
                            rxCounter: apsKeyData.rxFrmCntr,
                            txCounter: apsKeyData.txFrmCntr,
                        };
                    }
                }
                else {
                    const tclkTableEntry = tclkTable.used.find((e) => e.extAddr.equals(ame.extAddr));
                    if (tclkTableEntry) {
                        (0, node_assert_1.default)(tclkSeed, "Cannot be undefined because this is only called for ZStack 3");
                        const rotatedSeed = Buffer.concat([
                            tclkSeed.key.subarray(tclkTableEntry.SeedShift_IcIndex),
                            tclkSeed.key.subarray(0, tclkTableEntry.SeedShift_IcIndex),
                        ]);
                        const extAddrReversed = Buffer.from(ame.extAddr).reverse();
                        const extAddrRepeated = Buffer.concat([extAddrReversed, extAddrReversed]);
                        const derivedKey = Buffer.alloc(16);
                        for (let i = 0; i < 16; i++) {
                            derivedKey[i] = rotatedSeed[i] ^ extAddrRepeated[i];
                        }
                        linkKeyInfo = {
                            key: derivedKey,
                            rxCounter: tclkTableEntry.rxFrmCntr,
                            txCounter: tclkTableEntry.txFrmCntr,
                        };
                    }
                }
                return {
                    networkAddress: ame.nwkAddr,
                    ieeeAddress: ame.extAddr,
                    isDirectChild: (ame.user & structs_1.AddressManagerUser.Assoc) > 0,
                    linkKey: !linkKeyInfo ? undefined : linkKeyInfo,
                };
            })
                .filter((e) => e != null) || [],
        };
        try {
            /**
             * Due to a bug in ZStack, some devices go missing from the backed-up device tables which makes them disappear from the backup.
             * This causes the devices not to be restored when e.g. re-flashing the adapter.
             * If you then try to join a new device via a Zigbee 3.0 router that went missing (those with a linkkey), joining fails as the coordinator
             * does not have the linkKey anymore.
             * Below we don't remove any devices from the backup which have a linkkey and are still in the database (=ieeeAddressesInDatabase)
             */
            const oldBackup = this.getStoredBackup();
            (0, node_assert_1.default)(oldBackup, "Old backup doesn't exist");
            const missing = oldBackup.devices.filter((d) => d.linkKey &&
                ieeeAddressesInDatabase.includes(zspec_1.Utils.eui64BEBufferToHex(d.ieeeAddress)) &&
                !backup.devices.find((dd) => d.ieeeAddress.equals(dd.ieeeAddress)));
            const missingStr = missing.map((d) => zspec_1.Utils.eui64BEBufferToHex(d.ieeeAddress)).join(", ");
            logger_1.logger.debug(`Following devices with link key are missing from new backup but present in old backup and database, adding them back: ${missingStr}`, NS);
            backup.devices = [...backup.devices, ...missing];
        }
        catch (error) {
            logger_1.logger.debug(`Failed to read old backup, not checking for missing routers: ${error}`, NS);
        }
        return backup;
    }
    /**
     * Restores a structure in internal backup format to connected ZNP adapter.
     *
     * @param backup Backup to restore to connected adapter.
     */
    async restoreBackup(backup) {
        logger_1.logger.debug("restoring backup", NS);
        const version = await this.getAdapterVersion();
        /* v8 ignore start */
        if (version === tstype_1.ZnpVersion.ZStack12) {
            throw new Error("backup cannot be restored on Z-Stack 1.2 adapter");
        }
        /* v8 ignore stop */
        /* fetch provisional NIB */
        const nib = await this.nv.readItem(common_1.NvItemsIds.NIB, 0, Structs.nib);
        /* update NIB with desired nwk config */
        nib.nwkPanId = backup.networkOptions.panId;
        nib.channelList = Utils.packChannelList(backup.networkOptions.channelList);
        nib.nwkLogicalChannel = backup.networkOptions.channelList[0];
        nib.extendedPANID = backup.networkOptions.extendedPanId;
        nib.SecurityLevel = backup.securityLevel;
        nib.nwkUpdateId = backup.networkUpdateId;
        /* prepare key info */
        const keyDescriptor = Structs.nwkKeyDescriptor();
        keyDescriptor.keySeqNum = backup.networkKeyInfo.sequenceNumber || 0;
        keyDescriptor.key = backup.networkOptions.networkKey;
        /* determine table sizes */
        const currentAddressManagerTable = await this.getAddressManagerTable(version);
        const currentSecurityManagerTable = await this.getSecurityManagerTable();
        const currentApsLinkKeyDataTable = await this.getApsLinkKeyDataTable(version);
        const currentTclkTable = await this.getTclkTable(version);
        const currentNwkSecMaterialTable = await this.getNetworkSecurityMaterialTable(version);
        logger_1.logger.debug("got target adapter table sizes:", NS);
        logger_1.logger.debug(` - address manager table: ${currentAddressManagerTable.capacity}`, NS);
        logger_1.logger.debug(` - security manager table: ${currentSecurityManagerTable.capacity}`, NS);
        logger_1.logger.debug(` - aps link key data table: ${currentApsLinkKeyDataTable.capacity}`, NS);
        logger_1.logger.debug(` - tclk table: ${currentTclkTable.capacity}`, NS);
        logger_1.logger.debug(` - network security material table: ${currentNwkSecMaterialTable.capacity}`, NS);
        /* prepare table structures */
        const addressManagerTable = Structs.addressManagerTable(currentAddressManagerTable.capacity);
        const securityManagerTable = Structs.securityManagerTable(currentSecurityManagerTable.capacity);
        const apsLinkKeyDataTable = Structs.apsLinkKeyDataTable(currentApsLinkKeyDataTable.capacity);
        const tclkTable = Structs.apsTcLinkKeyTable(currentTclkTable.capacity);
        const nwkSecurityMaterialTable = Structs.nwkSecMaterialDescriptorTable(currentNwkSecMaterialTable.capacity);
        /* prepare security material table (nwk frame counters) */
        const mwkSecMaterialEntry = nwkSecurityMaterialTable.entries[0];
        mwkSecMaterialEntry.extendedPanID = backup.networkOptions.extendedPanId;
        mwkSecMaterialEntry.FrameCounter = backup.networkKeyInfo.frameCounter + 2500;
        const genericNwkSecMaterialEntry = nwkSecurityMaterialTable.entries[nwkSecurityMaterialTable.capacity - 1];
        genericNwkSecMaterialEntry.extendedPanID = Buffer.alloc(8, 0xff);
        genericNwkSecMaterialEntry.FrameCounter = backup.networkKeyInfo.frameCounter + 2500;
        /* populate device & security tables and write them */
        for (const device of backup.devices) {
            const ame = addressManagerTable.getNextFree();
            ame.nwkAddr = device.networkAddress != null ? device.networkAddress : zspec_1.NULL_NODE_ID;
            ame.extAddr = device.ieeeAddress;
            ame.user = device.isDirectChild ? structs_1.AddressManagerUser.Assoc : structs_1.AddressManagerUser.Default;
            if (device.linkKey) {
                let linkKeyProcessed = false;
                /* attempt to recover tclk seed parameters (if available) */
                if (backup.znp?.trustCenterLinkKeySeed) {
                    const tclkSeed = backup.znp.trustCenterLinkKeySeed;
                    const extAddrReversed = Buffer.from(ame.extAddr).reverse();
                    const extAddrRepeated = Buffer.concat([extAddrReversed, extAddrReversed]);
                    const recoveredKey = Buffer.alloc(16);
                    for (let i = 0; i < 16; i++) {
                        recoveredKey[i] = device.linkKey.key[i] ^ extAddrRepeated[i];
                    }
                    let recoveredSeedShift = null;
                    for (let i = 0; i < 16; i++) {
                        const rotated = Buffer.concat([
                            recoveredKey.slice(recoveredKey.length - i, recoveredKey.length),
                            recoveredKey.slice(0, recoveredKey.length - i),
                        ]);
                        if (rotated.equals(tclkSeed)) {
                            recoveredSeedShift = i;
                            break;
                        }
                    }
                    if (recoveredSeedShift !== null) {
                        ame.user |= structs_1.AddressManagerUser.Security;
                        const tclkEntry = tclkTable.getNextFree();
                        if (!tclkEntry) {
                            throw new Error(`target adapter tclk table size insufficient (size=${tclkTable.capacity})`);
                        }
                        tclkEntry.extAddr = ame.extAddr;
                        tclkEntry.SeedShift_IcIndex = recoveredSeedShift;
                        tclkEntry.keyAttributes = 2;
                        tclkEntry.keyType = 0;
                        tclkEntry.rxFrmCntr = device.linkKey.rxCounter;
                        tclkEntry.txFrmCntr = device.linkKey.txCounter + 2500;
                        linkKeyProcessed = true;
                        logger_1.logger.debug(`successfully recovered link key for ${device.ieeeAddress.toString("hex")} using tclk seed (shift=${recoveredSeedShift})`, NS);
                    }
                }
                /* attempt to create aps link key data entry */
                if (!linkKeyProcessed) {
                    ame.user |= structs_1.AddressManagerUser.Security;
                    const apsKeyDataEntry = apsLinkKeyDataTable.getNextFree();
                    if (!apsKeyDataEntry) {
                        throw new Error(`target adapter aps link key data table size insufficient (size=${apsLinkKeyDataTable.capacity})`);
                    }
                    apsKeyDataEntry.key = device.linkKey.key;
                    apsKeyDataEntry.rxFrmCntr = device.linkKey.rxCounter;
                    apsKeyDataEntry.txFrmCntr = device.linkKey.txCounter + 2500;
                    const sme = securityManagerTable.getNextFree();
                    if (!sme) {
                        throw new Error(`target adapter security manager table size insufficient (size=${securityManagerTable.capacity})`);
                    }
                    const ameIndex = addressManagerTable.indexOf(ame);
                    (0, node_assert_1.default)(ameIndex != null);
                    sme.ami = ameIndex;
                    const apsKeyDataEntryIndex = apsLinkKeyDataTable.indexOf(apsKeyDataEntry);
                    (0, node_assert_1.default)(apsKeyDataEntryIndex != null);
                    sme.keyNvId = version === tstype_1.ZnpVersion.ZStack3x0 ? apsKeyDataEntryIndex : common_1.NvItemsIds.APS_LINK_KEY_DATA_START + apsKeyDataEntryIndex;
                    sme.authenticationOption = structs_1.SecurityManagerAuthenticationOption.AuthenticatedCBCK;
                    linkKeyProcessed = true;
                    logger_1.logger.debug(`successfully recovered link key for ${device.ieeeAddress.toString("hex")} using aps key data table`, NS);
                }
            }
        }
        /* recover coordinator ieee address */
        const reversedAdapterIeee = Buffer.from(backup.coordinatorIeeeAddress).reverse();
        await this.nv.writeItem(common_1.NvItemsIds.EXTADDR, reversedAdapterIeee);
        /* write updated nib */
        await this.nv.writeItem(common_1.NvItemsIds.NIB, nib);
        /* write network key info */
        await this.nv.updateItem(common_1.NvItemsIds.NWK_ACTIVE_KEY_INFO, keyDescriptor.serialize());
        await this.nv.updateItem(common_1.NvItemsIds.NWK_ALTERN_KEY_INFO, keyDescriptor.serialize());
        /* write tclk seed if present */
        if (backup.znp?.trustCenterLinkKeySeed) {
            await this.nv.writeItem(common_1.NvItemsIds.TCLK_SEED, backup.znp.trustCenterLinkKeySeed);
        }
        /* write network security material table (nwk frame counters) */
        if (version === tstype_1.ZnpVersion.ZStack3x0) {
            await this.nv.writeTable("extended", common_1.NvSystemIds.ZSTACK, common_1.NvItemsIds.EX_NWK_SEC_MATERIAL_TABLE, nwkSecurityMaterialTable);
        }
        else {
            await this.nv.writeTable("legacy", common_1.NvItemsIds.LEGACY_NWK_SEC_MATERIAL_TABLE_START, nwkSecurityMaterialTable);
        }
        /* write address manager table */
        if (version === tstype_1.ZnpVersion.ZStack3x0) {
            await this.nv.writeTable("extended", common_1.NvSystemIds.ZSTACK, common_1.NvItemsIds.ZCD_NV_EX_ADDRMGR, addressManagerTable);
        }
        else {
            await this.nv.writeItem(common_1.NvItemsIds.ADDRMGR, addressManagerTable);
        }
        /* write security manager table */
        await this.nv.writeItem(common_1.NvItemsIds.APS_LINK_KEY_TABLE, securityManagerTable);
        /* write aps link key data table */
        if (version === tstype_1.ZnpVersion.ZStack3x0) {
            await this.nv.writeTable("extended", common_1.NvSystemIds.ZSTACK, common_1.NvItemsIds.ZCD_NV_EX_APS_KEY_DATA_TABLE, apsLinkKeyDataTable);
        }
        else {
            await this.nv.writeTable("legacy", common_1.NvItemsIds.APS_LINK_KEY_DATA_START, apsLinkKeyDataTable);
        }
        /* write tclk table */
        if (version === tstype_1.ZnpVersion.ZStack3x0) {
            await this.nv.writeTable("extended", common_1.NvSystemIds.ZSTACK, common_1.NvItemsIds.EX_TCLK_TABLE, tclkTable);
        }
        else {
            await this.nv.writeTable("legacy", common_1.NvItemsIds.LEGACY_TCLK_TABLE_START, tclkTable);
        }
    }
    /**
     * Acquires ZNP version internal to `zigbee-herdsman` from controller.
     *
     * *If Z-Stack 1.2 controller is detected an error is thrown, since Z-Stack 1.2 backup
     * and restore procedures are not supported.*
     */
    async getAdapterVersion() {
        const versionResponse = await this.znp.requestWithReply(constants_1.Subsystem.SYS, "version", {});
        const version = versionResponse.payload.product;
        return version;
    }
    /**
     * Internal method to retrieve address manager table.
     *
     * @param version ZNP stack version the adapter is running.
     */
    async getAddressManagerTable(version) {
        if (version === tstype_1.ZnpVersion.ZStack3x0) {
            return await this.nv.readTable("extended", common_1.NvSystemIds.ZSTACK, common_1.NvItemsIds.ZCD_NV_EX_ADDRMGR, undefined, Structs.addressManagerTable);
        }
        return await this.nv.readItem(common_1.NvItemsIds.ADDRMGR, 0, Structs.addressManagerTable);
    }
    /**
     * Internal method to retrieve security manager table. Also referred to as APS Link Key Table.
     */
    async getSecurityManagerTable() {
        return await this.nv.readItem(common_1.NvItemsIds.APS_LINK_KEY_TABLE, 0, Structs.securityManagerTable);
    }
    /**
     * Internal method to retrieve APS Link Key Data Table containing arbitrary APS link keys.
     *
     * @param version ZNP stack version the adapter is running.
     */
    async getApsLinkKeyDataTable(version) {
        if (version === tstype_1.ZnpVersion.ZStack3x0) {
            return await this.nv.readTable("extended", common_1.NvSystemIds.ZSTACK, common_1.NvItemsIds.ZCD_NV_EX_APS_KEY_DATA_TABLE, undefined, Structs.apsLinkKeyDataTable);
        }
        return await this.nv.readTable("legacy", common_1.NvItemsIds.APS_LINK_KEY_DATA_START, 255, Structs.apsLinkKeyDataTable);
    }
    /**
     * Internal method to retrieve Trust Center Link Key table which describes seed-based APS link keys for devices.
     *
     * @param version ZNP stack version the adapter is running.
     */
    async getTclkTable(version) {
        if (version === tstype_1.ZnpVersion.ZStack3x0) {
            return await this.nv.readTable("extended", common_1.NvSystemIds.ZSTACK, common_1.NvItemsIds.EX_TCLK_TABLE, undefined, Structs.apsTcLinkKeyTable);
        }
        return await this.nv.readTable("legacy", common_1.NvItemsIds.LEGACY_TCLK_TABLE_START, 239, Structs.apsTcLinkKeyTable);
    }
    /**
     * Internal method to retrieve network security material table, which contains network key frame counter.
     *
     * @param version ZNP stack version the adapter is running.
     */
    async getNetworkSecurityMaterialTable(version) {
        if (version === tstype_1.ZnpVersion.ZStack3x0) {
            return await this.nv.readTable("extended", common_1.NvSystemIds.ZSTACK, common_1.NvItemsIds.EX_NWK_SEC_MATERIAL_TABLE, undefined, Structs.nwkSecMaterialDescriptorTable);
        }
        return await this.nv.readTable("legacy", common_1.NvItemsIds.LEGACY_NWK_SEC_MATERIAL_TABLE_START, 12, Structs.nwkSecMaterialDescriptorTable);
    }
}
exports.AdapterBackup = AdapterBackup;
//# sourceMappingURL=adapter-backup.js.map