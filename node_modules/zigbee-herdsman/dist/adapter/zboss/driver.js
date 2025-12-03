"use strict";
/* v8 ignore start */
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
exports.ZBOSSDriver = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const node_events_1 = __importDefault(require("node:events"));
const es6_1 = __importDefault(require("fast-deep-equal/es6"));
const utils_1 = require("../../utils");
const logger_1 = require("../../utils/logger");
const Zdo = __importStar(require("../../zspec/zdo"));
const commands_1 = require("./commands");
const enums_1 = require("./enums");
const frame_1 = require("./frame");
const uart_1 = require("./uart");
const NS = "zh:zboss:driv";
const MAX_INIT_ATTEMPTS = 5;
class ZBOSSDriver extends node_events_1.default {
    port;
    waitress;
    queue;
    tsn = 1; // command sequence
    nwkOpt;
    netInfo; // expected valid upon startup of driver
    constructor(options, nwkOpt) {
        super();
        this.nwkOpt = nwkOpt;
        this.queue = new utils_1.Queue();
        this.waitress = new utils_1.Waitress(this.waitressValidator, this.waitressTimeoutFormatter);
        this.port = new uart_1.ZBOSSUart(options);
        this.port.on("frame", this.onFrame.bind(this));
    }
    async connect() {
        logger_1.logger.info("Driver connecting", NS);
        let status = false;
        for (let i = 0; i < MAX_INIT_ATTEMPTS; i++) {
            status = await this.port.resetNcp();
            // fail early if we couldn't even get the port set up
            if (!status) {
                return status;
            }
            status = await this.port.start();
            if (status) {
                logger_1.logger.info("Driver connected", NS);
                return status;
            }
        }
        return status;
    }
    async reset(options = enums_1.ResetOptions.NoOptions) {
        logger_1.logger.info("Driver reset", NS);
        this.port.inReset = true;
        await this.execCommand(enums_1.CommandId.NCP_RESET, { options }, 10000);
    }
    async startup(transmitPower) {
        logger_1.logger.info("Driver startup", NS);
        let result = "resumed";
        if (await this.needsToBeInitialised(this.nwkOpt)) {
            // need to check the backup
            // const restore = await this.needsToBeRestore(this.nwkOpt);
            const restore = false;
            if (this.netInfo.joined) {
                logger_1.logger.info("Leaving current network and forming new network", NS);
                await this.reset(enums_1.ResetOptions.FactoryReset);
            }
            if (restore) {
                // // restore
                // logger.info('Restore network from backup', NS);
                // await this.formNetwork(true);
                // result = 'restored';
            }
            else {
                // reset
                logger_1.logger.info("Form network", NS);
                await this.formNetwork(); // false
                result = "reset";
            }
        }
        else {
            await this.execCommand(enums_1.CommandId.NWK_START_WITHOUT_FORMATION, {});
        }
        await this.execCommand(enums_1.CommandId.SET_TC_POLICY, { type: enums_1.PolicyType.LINK_KEY_REQUIRED, value: 0 });
        await this.execCommand(enums_1.CommandId.SET_TC_POLICY, { type: enums_1.PolicyType.IC_REQUIRED, value: 0 });
        await this.execCommand(enums_1.CommandId.SET_TC_POLICY, { type: enums_1.PolicyType.TC_REJOIN_ENABLED, value: 1 });
        await this.execCommand(enums_1.CommandId.SET_TC_POLICY, { type: enums_1.PolicyType.IGNORE_TC_REJOIN, value: 0 });
        await this.execCommand(enums_1.CommandId.SET_TC_POLICY, { type: enums_1.PolicyType.APS_INSECURE_JOIN, value: 0 });
        await this.execCommand(enums_1.CommandId.SET_TC_POLICY, { type: enums_1.PolicyType.DISABLE_NWK_MGMT_CHANNEL_UPDATE, value: 0 });
        await this.addEndpoint(1, 260, 0xbeef, [0x0000, 0x0003, 0x0006, 0x000a, 0x0019, 0x001a, 0x0300], [
            0x0000, 0x0003, 0x0004, 0x0005, 0x0006, 0x0008, 0x0020, 0x0300, 0x0400, 0x0402, 0x0405, 0x0406, 0x0500, 0x0b01, 0x0b03, 0x0b04,
            0x0702, 0x1000, 0xfc01, 0xfc02,
        ]);
        await this.addEndpoint(242, 0xa1e0, 0x61, [], [0x0021]);
        await this.execCommand(enums_1.CommandId.SET_RX_ON_WHEN_IDLE, { rxOn: 1 });
        //await this.execCommand(CommandId.SET_ED_TIMEOUT, {timeout: 8});
        //await this.execCommand(CommandId.SET_MAX_CHILDREN, {children: 100});
        if (transmitPower != null) {
            await this.execCommand(enums_1.CommandId.SET_TX_POWER, { txPower: transmitPower });
        }
        return result;
    }
    async needsToBeInitialised(options) {
        let valid = true;
        this.netInfo = await this.getNetworkInfo();
        logger_1.logger.debug(() => `Current network parameters: ${JSON.stringify(this.netInfo)}`, NS);
        if (this.netInfo) {
            valid = valid && this.netInfo.nodeType === enums_1.DeviceType.COORDINATOR;
            valid = valid && options.panID === this.netInfo.network.panID;
            valid = valid && options.channelList.includes(this.netInfo.network.channel);
            valid = valid && (0, es6_1.default)(Buffer.from(options.extendedPanID || []), Buffer.from(this.netInfo.network.extendedPanID));
        }
        else {
            valid = false;
        }
        return !valid;
    }
    async getNetworkInfo() {
        let result = await this.execCommand(enums_1.CommandId.GET_JOINED, {});
        const joined = result.payload.joined === 1;
        if (!joined) {
            logger_1.logger.debug("Network not formed", NS);
        }
        result = await this.execCommand(enums_1.CommandId.GET_ZIGBEE_ROLE, {});
        const nodeType = result.payload.role;
        result = await this.execCommand(enums_1.CommandId.GET_LOCAL_IEEE_ADDR, { mac: 0 });
        const ieeeAddr = result.payload.ieee;
        result = await this.execCommand(enums_1.CommandId.GET_EXTENDED_PAN_ID, {});
        // TODO: bug in extendedPanID - got reversed value
        const extendedPanID = result.payload.extendedPanID.reverse();
        result = await this.execCommand(enums_1.CommandId.GET_PAN_ID, {});
        const panID = result.payload.panID;
        result = await this.execCommand(enums_1.CommandId.GET_ZIGBEE_CHANNEL, {});
        const channel = result.payload.channel;
        return {
            joined,
            nodeType,
            ieeeAddr,
            network: {
                panID,
                extendedPanID,
                channel,
            },
        };
    }
    async addEndpoint(endpoint, profileId, deviceId, inputClusters, outputClusters) {
        const res = await this.execCommand(enums_1.CommandId.AF_SET_SIMPLE_DESC, {
            endpoint: endpoint,
            profileID: profileId,
            deviceID: deviceId,
            version: 0,
            inputClusterCount: inputClusters.length,
            outputClusterCount: outputClusters.length,
            inputClusters: inputClusters,
            outputClusters: outputClusters,
        });
        logger_1.logger.debug(() => `Adding endpoint: ${JSON.stringify(res)}`, NS);
    }
    getChannelMask(channels) {
        return channels.reduce((mask, channel) => mask | (1 << channel), 0);
    }
    async formNetwork() {
        const channelMask = this.getChannelMask(this.nwkOpt.channelList);
        await this.execCommand(enums_1.CommandId.SET_ZIGBEE_ROLE, { role: enums_1.DeviceType.COORDINATOR });
        await this.execCommand(enums_1.CommandId.SET_ZIGBEE_CHANNEL_MASK, { page: 0, mask: channelMask });
        await this.execCommand(enums_1.CommandId.SET_PAN_ID, { panID: this.nwkOpt.panID });
        // await this.execCommand(CommandId.SET_EXTENDED_PAN_ID, {extendedPanID: this.nwkOpt.extendedPanID});
        await this.execCommand(enums_1.CommandId.SET_NWK_KEY, { nwkKey: this.nwkOpt.networkKey, index: 0 });
        const res = await this.execCommand(enums_1.CommandId.NWK_FORMATION, {
            len: 1,
            channels: [{ page: 0, mask: channelMask }],
            duration: 0x05,
            distribFlag: 0x00,
            distribNwk: 0x0000,
            extendedPanID: this.nwkOpt.extendedPanID,
        }, 20000);
        logger_1.logger.debug(() => `Forming network: ${JSON.stringify(res)}`, NS);
    }
    async stop() {
        await this.port.stop();
        logger_1.logger.info("Driver stopped", NS);
    }
    onFrame(frame) {
        logger_1.logger.debug(() => `<== Frame: ${JSON.stringify(frame)}`, NS);
        const handled = this.waitress.resolve(frame);
        if (!handled) {
            this.emit("frame", frame);
        }
    }
    isInitialized() {
        return this.port.portOpen && !this.port.inReset;
    }
    async execCommand(commandId, params = {}, timeout = 10000) {
        logger_1.logger.debug(() => `==> ${enums_1.CommandId[commandId]}(${commandId}): ${JSON.stringify(params)}`, NS);
        if (!this.port.portOpen) {
            throw new Error("Connection not initialized");
        }
        return await this.queue.execute(async () => {
            const frame = (0, frame_1.makeFrame)(frame_1.FrameType.REQUEST, commandId, params);
            frame.tsn = this.tsn;
            const waiter = this.waitFor(commandId, commandId === enums_1.CommandId.NCP_RESET ? undefined : this.tsn, timeout);
            this.tsn = (this.tsn + 1) & 255;
            try {
                logger_1.logger.debug(() => `==> FRAME: ${JSON.stringify(frame)}`, NS);
                await this.port.sendFrame(frame);
                const response = await waiter.start().promise;
                if (response?.payload?.status !== enums_1.StatusCodeGeneric.OK) {
                    throw new Error(`Error on command ${enums_1.CommandId[commandId]}(${commandId}): ${JSON.stringify(response)}`);
                }
                return response;
            }
            catch (error) {
                this.waitress.remove(waiter.ID);
                logger_1.logger.error(`==> Error: ${error}`, NS);
                throw new Error(`Failure send ${commandId}:${JSON.stringify(frame)}`);
            }
        });
    }
    waitFor(commandId, tsn, timeout = 10000) {
        return this.waitress.waitFor({ commandId, tsn }, timeout);
    }
    waitressTimeoutFormatter(matcher, timeout) {
        return `${JSON.stringify(matcher)} after ${timeout}ms`;
    }
    waitressValidator(payload, matcher) {
        return (matcher.tsn === undefined || matcher.tsn === payload.tsn) && matcher.commandId === payload.commandId;
    }
    async request(ieee, profileID, clusterID, dstEp, srcEp, data) {
        const payload = {
            paramLength: 21,
            dataLength: data.length,
            addr: ieee,
            profileID: profileID,
            clusterID: clusterID,
            dstEndpoint: dstEp,
            srcEndpoint: srcEp,
            radius: 3,
            dstAddrMode: 3, // ADDRESS MODE ieee
            txOptions: 2, // ROUTE DISCOVERY
            useAlias: 0,
            aliasAddr: 0,
            aliasSequence: 0,
            data: data,
        };
        return await this.execCommand(enums_1.CommandId.APSDE_DATA_REQ, payload);
    }
    async brequest(addr, profileID, clusterID, dstEp, srcEp, data) {
        const payload = {
            paramLength: 21,
            dataLength: data.length,
            addr: `0x${addr.toString(16).padStart(16, "0")}`,
            profileID: profileID,
            clusterID: clusterID,
            dstEndpoint: dstEp,
            srcEndpoint: srcEp,
            radius: 3,
            dstAddrMode: 2, // ADDRESS MODE broadcast
            txOptions: 2, // ROUTE DISCOVERY
            useAlias: 0,
            aliasAddr: 0,
            aliasSequence: 0,
            data: data,
        };
        return await this.execCommand(enums_1.CommandId.APSDE_DATA_REQ, payload);
    }
    async grequest(group, profileID, clusterID, srcEp, data) {
        const payload = {
            paramLength: 20,
            dataLength: data.length,
            addr: `0x${group.toString(16).padStart(16, "0")}`,
            profileID: profileID,
            clusterID: clusterID,
            srcEndpoint: srcEp,
            radius: 3,
            dstAddrMode: 1, // ADDRESS MODE group
            txOptions: 2, // ROUTE DISCOVERY
            useAlias: 0,
            aliasAddr: 0,
            aliasSequence: 0,
            data: data,
        };
        return await this.execCommand(enums_1.CommandId.APSDE_DATA_REQ, payload);
    }
    async requestZdo(clusterId, payload, disableResponse) {
        if (!this.port.portOpen) {
            throw new Error("Connection not initialized");
        }
        const commandId = commands_1.ZDO_REQ_CLUSTER_ID_TO_ZBOSS_COMMAND_ID[clusterId];
        (0, node_assert_1.default)(commandId !== undefined, `ZDO cluster ID '${clusterId}' not supported.`);
        const cmdLog = `${Zdo.ClusterId[clusterId]}(cmd: ${commandId})`;
        logger_1.logger.debug(() => `===> ZDO ${cmdLog}: ${payload.toString("hex")}`, NS);
        return await this.queue.execute(async () => {
            const buf = Buffer.alloc(5 + payload.length);
            buf.writeInt8(0, 0);
            buf.writeInt8(frame_1.FrameType.REQUEST, 1);
            buf.writeUInt16LE(commandId, 2);
            buf.writeUInt8(this.tsn, 4);
            buf.set(payload, 5);
            let waiter;
            if (!disableResponse) {
                waiter = this.waitFor(commandId, this.tsn, 10000);
            }
            this.tsn = (this.tsn + 1) & 255;
            try {
                await this.port.sendBuffer(buf);
                if (waiter) {
                    return await waiter.start().promise;
                }
            }
            catch (error) {
                if (waiter) {
                    this.waitress.remove(waiter.ID);
                }
                logger_1.logger.debug(`=x=> Failed to send ${cmdLog}: ${error.stack}`, NS);
                throw new Error(`Failed to send ${cmdLog}.`);
            }
        });
    }
    async ieeeByNwk(nwk) {
        return (await this.execCommand(enums_1.CommandId.NWK_GET_IEEE_BY_SHORT, { nwk: nwk })).payload.ieee;
    }
}
exports.ZBOSSDriver = ZBOSSDriver;
//# sourceMappingURL=driver.js.map