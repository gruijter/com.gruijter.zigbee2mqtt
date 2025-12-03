import * as stream from "node:stream";
export declare class Writer extends stream.Readable {
    writeBuffer(buffer: Buffer): void;
    _read(): void;
    sendACK(ackNum: number): void;
    sendNAK(ackNum: number): void;
    sendReset(): void;
    sendData(data: Buffer, seq: number, rxmit: number, ackSeq: number): void;
    private stuff;
    private makeFrame;
}
//# sourceMappingURL=writer.d.ts.map