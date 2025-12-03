import * as stream from "node:stream";
import type Frame from "./frame";
declare class Writer extends stream.Readable {
    writeFrame(frame: Frame): void;
    _read(): void;
}
export default Writer;
//# sourceMappingURL=writer.d.ts.map