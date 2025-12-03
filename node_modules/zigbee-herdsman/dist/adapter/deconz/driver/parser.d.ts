import { Transform, type TransformCallback } from "node:stream";
declare class Parser extends Transform {
    private decoder;
    constructor();
    private onMessage;
    private onError;
    _transform(chunk: Buffer, _: string, cb: TransformCallback): void;
}
export default Parser;
//# sourceMappingURL=parser.d.ts.map