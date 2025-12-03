import * as stream from "node:stream";
export declare class Parser extends stream.Transform {
    private buffer;
    constructor();
    _transform(chunk: Buffer, _: string, cb: () => void): void;
    private parseNext;
}
//# sourceMappingURL=parser.d.ts.map