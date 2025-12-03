import * as stream from "node:stream";
import type { Frame } from "./frame";
export declare class Writer extends stream.Readable {
    writeFrame(frame: Frame): void;
    writeBuffer(buffer: Buffer): void;
    _read(): void;
}
//# sourceMappingURL=writer.d.ts.map