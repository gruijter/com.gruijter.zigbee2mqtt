import { Readable, type ReadableOptions } from "node:stream";
export declare class ZBOSSWriter extends Readable {
    private bytesToWrite;
    constructor(opts?: ReadableOptions);
    private writeBytes;
    writeByte(byte: number): void;
    writeAvailable(): boolean;
    /**
     * If there is anything to send, send to the port.
     */
    writeFlush(): void;
    _read(): void;
}
//# sourceMappingURL=writer.d.ts.map