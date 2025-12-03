"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frame = void 0;
const constants_1 = require("./constants");
class Frame {
    type;
    subsystem;
    commandID;
    data;
    length;
    fcs;
    constructor(type, subsystem, commandID, data, length, fcs) {
        this.type = type;
        this.subsystem = subsystem;
        this.commandID = commandID;
        this.data = data;
        this.length = length;
        this.fcs = fcs;
    }
    toBuffer() {
        const length = this.data.length;
        const cmd0 = ((this.type << 5) & 0xe0) | (this.subsystem & 0x1f);
        let payload = Buffer.from([constants_1.SOF, length, cmd0, this.commandID]);
        payload = Buffer.concat([payload, this.data]);
        const fcs = Frame.calculateChecksum(payload.slice(1, payload.length));
        return Buffer.concat([payload, Buffer.from([fcs])]);
    }
    static fromBuffer(length, fcsPosition, buffer) {
        const subsystem = buffer.readUInt8(constants_1.PositionCmd0) & 0x1f;
        const type = (buffer.readUInt8(constants_1.PositionCmd0) & 0xe0) >> 5;
        const commandID = buffer.readUInt8(constants_1.PositionCmd1);
        const data = buffer.subarray(constants_1.DataStart, fcsPosition);
        const fcs = buffer.readUInt8(fcsPosition);
        // Validate the checksum to see if we fully received the message
        const checksum = Frame.calculateChecksum(buffer.subarray(1, fcsPosition));
        if (checksum === fcs) {
            return new Frame(type, subsystem, commandID, data, length, fcs);
        }
        throw new Error("Invalid checksum");
    }
    static calculateChecksum(values) {
        let checksum = 0;
        for (const value of values) {
            checksum ^= value;
        }
        return checksum;
    }
    toString() {
        return `${this.length} - ${this.type} - ${this.subsystem} - ${this.commandID} - [${[...this.data]}] - ${this.fcs}`;
    }
}
exports.Frame = Frame;
//# sourceMappingURL=frame.js.map