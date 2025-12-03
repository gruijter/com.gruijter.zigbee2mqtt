export default class ZiGateFrame {
    static readonly START_BYTE = 1;
    static readonly STOP_BYTE = 3;
    msgCodeBytes: Buffer;
    msgLengthBytes: Buffer;
    checksumBytes: Buffer;
    msgPayloadBytes: Buffer;
    rssiBytes: Buffer;
    msgLengthOffset: number;
    constructor(frame?: Buffer);
    static isValid(frame: Buffer): boolean;
    buildChunks(frame: Buffer): void;
    toBuffer(): Buffer;
    escapeData(data: Buffer): Buffer;
    readMsgCode(): number;
    writeMsgCode(msgCode: number): ZiGateFrame;
    readMsgLength(): number;
    writeMsgLength(msgLength: number): ZiGateFrame;
    readChecksum(): number;
    writeMsgPayload(msgPayload: Buffer): ZiGateFrame;
    readRSSI(): number;
    writeRSSI(rssi: number): ZiGateFrame;
    calcChecksum(): number;
    writeChecksum(): this;
}
//# sourceMappingURL=frame.d.ts.map