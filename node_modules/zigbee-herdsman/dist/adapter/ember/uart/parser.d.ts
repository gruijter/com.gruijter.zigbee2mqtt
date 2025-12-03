import { Transform, type TransformCallback, type TransformOptions } from "node:stream";
export declare class AshParser extends Transform {
    private buffer;
    constructor(opts?: TransformOptions);
    _transform(chunk: Buffer, _encoding: BufferEncoding, cb: TransformCallback): void;
    _flush(cb: TransformCallback): void;
}
//# sourceMappingURL=parser.d.ts.map