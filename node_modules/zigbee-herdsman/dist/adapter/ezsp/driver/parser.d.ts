import * as stream from "node:stream";
export declare class Parser extends stream.Transform {
    private tail;
    constructor();
    _transform(chunk: Buffer, _: string, cb: () => void): void;
    private unstuff;
    reset(): void;
}
//# sourceMappingURL=parser.d.ts.map