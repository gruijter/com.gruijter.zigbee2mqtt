"use strict";
/* v8 ignore start */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameType = exports.ZBOSSBuffaloZcl = void 0;
exports.readZBOSSFrame = readZBOSSFrame;
exports.writeZBOSSFrame = writeZBOSSFrame;
exports.makeFrame = makeFrame;
const buffaloZcl_1 = require("../../zspec/zcl/buffaloZcl");
const zdo_1 = require("../../zspec/zdo");
const buffaloZdo_1 = require("../../zspec/zdo/buffaloZdo");
const commands_1 = require("./commands");
const enums_1 = require("./enums");
class ZBOSSBuffaloZcl extends buffaloZcl_1.BuffaloZcl {
    // biome-ignore lint/suspicious/noExplicitAny: API
    write(type, value, options) {
        switch (type) {
            case enums_1.BuffaloZBOSSDataType.EXTENDED_PAN_ID: {
                this.writeBuffer(value, 8);
                break;
            }
            default: {
                super.write(type, value, options);
                break;
            }
        }
    }
    // biome-ignore lint/suspicious/noExplicitAny: API
    read(type, options) {
        switch (type) {
            case enums_1.BuffaloZBOSSDataType.EXTENDED_PAN_ID: {
                return this.readBuffer(8);
            }
            default: {
                return super.read(type, options);
            }
        }
    }
    writeByDesc(payload, params) {
        const start = this.getPosition();
        for (const parameter of params) {
            const options = {};
            if (parameter.condition && !parameter.condition(payload, this)) {
                continue;
            }
            if (parameter.options)
                parameter.options(payload, options);
            if (parameter.type === enums_1.BuffaloZBOSSDataType.LIST_TYPED && parameter.typed) {
                const internalPaload = payload[parameter.name];
                for (const value of internalPaload) {
                    this.writeByDesc(value, parameter.typed);
                }
            }
            else {
                this.write(parameter.type, payload[parameter.name], options);
            }
        }
        return this.getPosition() - start;
    }
    readByDesc(params) {
        const payload = {};
        for (const parameter of params) {
            const options = { payload };
            if (parameter.condition && !parameter.condition(payload, this)) {
                continue;
            }
            if (parameter.options)
                parameter.options(payload, options);
            if (parameter.type === enums_1.BuffaloZBOSSDataType.LIST_TYPED && parameter.typed) {
                payload[parameter.name] = [];
                if (!this.isMore())
                    break;
                for (let i = 0; i < (options.length || 0); i++) {
                    const internalPaload = this.readByDesc(parameter.typed);
                    payload[parameter.name].push(internalPaload);
                }
            }
            else {
                if (!this.isMore())
                    break;
                payload[parameter.name] = this.read(parameter.type, options);
            }
        }
        return payload;
    }
}
exports.ZBOSSBuffaloZcl = ZBOSSBuffaloZcl;
function getFrameDesc(type, key) {
    const frameDesc = commands_1.FRAMES[key];
    if (!frameDesc)
        throw new Error(`Unrecognized frame type from FrameID ${key}`);
    switch (type) {
        case FrameType.REQUEST:
            return frameDesc.request || [];
        case FrameType.RESPONSE:
            return frameDesc.response || [];
        case FrameType.INDICATION:
            return frameDesc.indication || [];
    }
}
function fixNonStandardZdoRspPayload(clusterId, buffer) {
    switch (clusterId) {
        case zdo_1.ClusterId.NODE_DESCRIPTOR_RESPONSE:
        case zdo_1.ClusterId.POWER_DESCRIPTOR_RESPONSE:
        case zdo_1.ClusterId.ACTIVE_ENDPOINTS_RESPONSE:
        case zdo_1.ClusterId.MATCH_DESCRIPTORS_RESPONSE: {
            // flip nwkAddress from end to start
            return Buffer.concat([buffer.subarray(0, 1), buffer.subarray(-2), buffer.subarray(1, -2)]);
        }
        case zdo_1.ClusterId.SIMPLE_DESCRIPTOR_RESPONSE: {
            // flip nwkAddress from end to start
            // add length after nwkAddress
            // move outClusterCount before inClusterList
            const inClusterListSize = buffer[7] * 2; // uint16
            return Buffer.concat([
                buffer.subarray(0, 1), // status
                buffer.subarray(-2), // nwkAddress
                Buffer.from([buffer.length - 3 /* status + nwkAddress */]),
                buffer.subarray(1, 8), // endpoint>inClusterCount
                buffer.subarray(9, 9 + inClusterListSize), // inClusterList
                buffer.subarray(8, 9), // outClusterCount
                buffer.subarray(9 + inClusterListSize, -2), // outClusterList
            ]);
        }
    }
    return buffer;
}
function readZBOSSFrame(buffer) {
    const buf = new ZBOSSBuffaloZcl(buffer);
    const version = buf.readUInt8();
    const type = buf.readUInt8();
    const commandId = buf.readUInt16();
    const tsn = type === FrameType.REQUEST || type === FrameType.RESPONSE ? buf.readUInt8() : 0;
    const zdoResponseClusterId = type === FrameType.RESPONSE || type === FrameType.INDICATION ? commands_1.ZBOSS_COMMAND_ID_TO_ZDO_RSP_CLUSTER_ID[commandId] : undefined;
    if (zdoResponseClusterId !== undefined) {
        // FrameType.INDICATION has no tsn (above), no category
        const category = type === FrameType.RESPONSE ? buf.readUInt8() : undefined;
        const zdoPayload = fixNonStandardZdoRspPayload(zdoResponseClusterId, buffer.subarray(type === FrameType.RESPONSE ? 6 : 4));
        const zdo = buffaloZdo_1.BuffaloZdo.readResponse(false, zdoResponseClusterId, zdoPayload);
        return {
            version,
            type,
            commandId,
            tsn,
            payload: {
                category,
                zdoClusterId: zdoResponseClusterId,
                zdo,
            },
        };
    }
    return {
        version,
        type,
        commandId,
        tsn,
        payload: readPayload(type, commandId, buf),
    };
}
function writeZBOSSFrame(frame) {
    const buf = new ZBOSSBuffaloZcl(Buffer.alloc(247));
    buf.writeInt8(frame.version);
    buf.writeInt8(frame.type);
    buf.writeUInt16(frame.commandId);
    buf.writeUInt8(frame.tsn);
    writePayload(frame.type, frame.commandId, frame.payload, buf);
    return buf.getWritten();
}
var FrameType;
(function (FrameType) {
    FrameType[FrameType["REQUEST"] = 0] = "REQUEST";
    FrameType[FrameType["RESPONSE"] = 1] = "RESPONSE";
    FrameType[FrameType["INDICATION"] = 2] = "INDICATION";
})(FrameType || (exports.FrameType = FrameType = {}));
function makeFrame(type, commandId, params) {
    const frameDesc = getFrameDesc(type, commandId);
    const payload = {};
    for (const parameter of frameDesc) {
        // const options: BuffaloZclOptions = {payload};
        if (parameter.condition && !parameter.condition(params, undefined)) {
            continue;
        }
        payload[parameter.name] = params[parameter.name];
    }
    return {
        version: 0,
        type: type,
        commandId: commandId,
        tsn: 0,
        payload: payload,
    };
}
function readPayload(type, commandId, buffalo) {
    const frameDesc = getFrameDesc(type, commandId);
    return buffalo.readByDesc(frameDesc);
}
function writePayload(type, commandId, payload, buffalo) {
    const frameDesc = getFrameDesc(type, commandId);
    return buffalo.writeByDesc(payload, frameDesc);
}
//# sourceMappingURL=frame.js.map