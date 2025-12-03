import { BuffaloZcl } from "./buffaloZcl";
import type { FrameControl } from "./definition/tstype";
export declare class ZclHeader {
    readonly frameControl: FrameControl;
    readonly manufacturerCode: number | undefined;
    readonly transactionSequenceNumber: number;
    readonly commandIdentifier: number;
    constructor(frameControl: FrameControl, manufacturerCode: number | undefined, transactionSequenceNumber: number, commandIdentifier: number);
    /** Returns the amount of bytes used by this header */
    get length(): number;
    get isGlobal(): boolean;
    get isSpecific(): boolean;
    write(buffalo: BuffaloZcl): void;
    static fromBuffer(buffer: Buffer): ZclHeader | undefined;
}
//# sourceMappingURL=zclHeader.d.ts.map