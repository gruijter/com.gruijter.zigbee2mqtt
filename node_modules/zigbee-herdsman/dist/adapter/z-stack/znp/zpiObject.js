"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZpiObject = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const zdo_1 = require("../../../zspec/zdo");
const buffaloZdo_1 = require("../../../zspec/zdo/buffaloZdo");
const unpi_1 = require("../unpi");
const constants_1 = require("../unpi/constants");
const buffaloZnp_1 = __importDefault(require("./buffaloZnp"));
const definition_1 = __importDefault(require("./definition"));
const parameterType_1 = __importDefault(require("./parameterType"));
const utils_1 = require("./utils");
const BufferAndListTypes = [
    parameterType_1.default.BUFFER,
    parameterType_1.default.BUFFER8,
    parameterType_1.default.BUFFER16,
    parameterType_1.default.BUFFER18,
    parameterType_1.default.BUFFER32,
    parameterType_1.default.BUFFER42,
    parameterType_1.default.BUFFER100,
    parameterType_1.default.LIST_UINT16,
    parameterType_1.default.LIST_NETWORK,
    parameterType_1.default.LIST_UINT8,
];
class ZpiObject {
    type;
    subsystem;
    command;
    payload;
    unpiFrame;
    constructor(type, subsystem, command, payload, unpiFrame) {
        this.type = type;
        this.subsystem = subsystem;
        this.command = command;
        this.payload = payload;
        this.unpiFrame = unpiFrame;
    }
    static createRequest(subsystem, command, payload) {
        if (!definition_1.default[subsystem]) {
            throw new Error(`Subsystem '${subsystem}' does not exist`);
        }
        const cmd = definition_1.default[subsystem].find((c) => c.name === command);
        if (cmd === undefined || (0, utils_1.isMtCmdAreqZdo)(cmd) || (0, utils_1.isMtCmdSreqZdo)(cmd) || cmd.request === undefined) {
            throw new Error(`Command request '${command}' from subsystem '${subsystem}' not found`);
        }
        // Create the UnpiFrame
        const buffalo = new buffaloZnp_1.default(Buffer.alloc(constants_1.MaxDataSize));
        for (const parameter of cmd.request) {
            const value = payload[parameter.name];
            buffalo.write(parameter.parameterType, value, {});
        }
        const buffer = buffalo.getWritten();
        const unpiFrame = new unpi_1.Frame(cmd.type, subsystem, cmd.ID, buffer);
        return new ZpiObject(cmd.type, subsystem, cmd, payload, unpiFrame);
    }
    static fromUnpiFrame(frame) {
        const cmd = definition_1.default[frame.subsystem].find((c) => c.ID === frame.commandID);
        if (!cmd) {
            throw new Error(`CommandID '${frame.commandID}' from subsystem '${frame.subsystem}' not found`);
        }
        let payload = {};
        // hotpath AREQ & SREQ ZDO since payload is identical (no need to instantiate BuffaloZnp or parse generically)
        if ((0, utils_1.isMtCmdAreqZdo)(cmd)) {
            if (cmd.zdoClusterId === zdo_1.ClusterId.NETWORK_ADDRESS_RESPONSE || cmd.zdoClusterId === zdo_1.ClusterId.IEEE_ADDRESS_RESPONSE) {
                // ZStack swaps the `startindex` and `numassocdev` compared to ZDO swap them back before handing to ZDO
                const startIndex = frame.data[11];
                const assocDevCount = frame.data[12];
                frame.data[11] = assocDevCount;
                frame.data[12] = startIndex;
                payload.zdo = buffaloZdo_1.BuffaloZdo.readResponse(false, cmd.zdoClusterId, frame.data);
            }
            else {
                payload.srcaddr = frame.data.readUInt16LE(0);
                payload.zdo = buffaloZdo_1.BuffaloZdo.readResponse(false, cmd.zdoClusterId, frame.data.subarray(2));
            }
        }
        else if ((0, utils_1.isMtCmdSreqZdo)(cmd)) {
            payload.status = frame.data.readUInt8(0);
        }
        else {
            const parameters = frame.type === constants_1.Type.SRSP && cmd.type !== constants_1.Type.AREQ ? cmd.response : cmd.request;
            (0, node_assert_1.default)(parameters, `CommandID '${frame.commandID}' from subsystem '${frame.subsystem}' cannot be a ` +
                `${frame.type === constants_1.Type.SRSP ? "response" : "request"}`);
            payload = ZpiObject.readParameters(frame.data, parameters);
        }
        // GC UnpiFrame as early as possible, no longer needed
        return new ZpiObject(frame.type, frame.subsystem, cmd, payload, undefined);
    }
    static readParameters(buffer, parameters) {
        const buffalo = new buffaloZnp_1.default(buffer);
        const result = {};
        for (const parameter of parameters) {
            const options = {};
            if (BufferAndListTypes.includes(parameter.parameterType)) {
                // When reading a buffer, assume that the previous parsed parameter contains
                // the length of the buffer
                const lengthParameter = parameters[parameters.indexOf(parameter) - 1];
                const length = result[lengthParameter.name];
                if (typeof length === "number") {
                    options.length = length;
                }
            }
            result[parameter.name] = buffalo.read(parameter.parameterType, options);
        }
        return result;
    }
    isResetCommand() {
        return ((this.command.name === "resetReq" && this.subsystem === constants_1.Subsystem.SYS) ||
            /* v8 ignore next */
            (this.command.name === "systemReset" && this.subsystem === constants_1.Subsystem.SAPI));
    }
    toString(includePayload = true) {
        const baseStr = `${constants_1.Type[this.type]}: ${constants_1.Subsystem[this.subsystem]} - ${this.command.name}`;
        return includePayload ? `${baseStr} - ${JSON.stringify(this.payload)}` : baseStr;
    }
}
exports.ZpiObject = ZpiObject;
//# sourceMappingURL=zpiObject.js.map