import type { Eui64 } from "../zspec/tstypes";
export declare class Buffalo {
    protected position: number;
    protected buffer: Buffer;
    constructor(buffer: Buffer, position?: number);
    getPosition(): number;
    /**
     * Set the position of the internal position tracker.
     * @param position
     */
    setPosition(position: number): void;
    getBuffer(): Buffer;
    getWritten(): Buffer;
    isMore(): boolean;
    writeUInt8(value: number): void;
    readUInt8(): number;
    writeUInt16(value: number): void;
    readUInt16(): number;
    writeUInt24(value: number): void;
    readUInt24(): number;
    writeUInt32(value: number): void;
    readUInt32(): number;
    writeUInt40(value: number): void;
    readUInt40(): number;
    writeUInt48(value: number): void;
    readUInt48(): number;
    writeUInt56(value: bigint): void;
    readUInt56(): bigint;
    writeUInt64(value: bigint): void;
    readUInt64(): bigint;
    writeInt8(value: number): void;
    readInt8(): number;
    writeInt16(value: number): void;
    readInt16(): number;
    writeInt24(value: number): void;
    readInt24(): number;
    writeInt32(value: number): void;
    readInt32(): number;
    writeInt40(value: number): void;
    readInt40(): number;
    writeInt48(value: number): void;
    readInt48(): number;
    writeInt56(value: bigint): void;
    readInt56(): bigint;
    writeInt64(value: bigint): void;
    readInt64(): bigint;
    writeFloatLE(value: number): void;
    readFloatLE(): number;
    writeDoubleLE(value: number): void;
    readDoubleLE(): number;
    writeIeeeAddr(value: string): void;
    readIeeeAddr(): Eui64;
    writeBuffer(values: Buffer | number[], length: number): void;
    readBuffer(length: number): Buffer;
    writeListUInt8(values: number[]): void;
    readListUInt8(length: number): number[];
    writeListUInt16(values: number[]): void;
    readListUInt16(length: number): number[];
    writeListUInt24(values: number[]): void;
    readListUInt24(length: number): number[];
    writeListUInt32(values: number[]): void;
    readListUInt32(length: number): number[];
    writeUtf8String(value: string): void;
    readUtf8String(length: number): string;
}
export default Buffalo;
//# sourceMappingURL=buffalo.d.ts.map