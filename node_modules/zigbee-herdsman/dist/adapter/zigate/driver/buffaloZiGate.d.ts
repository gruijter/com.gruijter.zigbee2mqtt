import { Buffalo } from "../../../buffalo";
import type { Eui64 } from "../../../zspec/tstypes";
import type { BuffaloZclOptions } from "../../../zspec/zcl/definition/tstype";
import ParameterType from "./parameterType";
export interface BuffaloZiGateOptions extends BuffaloZclOptions {
    startIndex?: number;
}
declare class BuffaloZiGate extends Buffalo {
    write(type: ParameterType, value: any, _options: BuffaloZiGateOptions): void;
    read(type: ParameterType, options: BuffaloZiGateOptions): unknown;
    writeRaw(value: Buffer): void;
    readUInt16BE(): number;
    writeUInt16BE(value: number): void;
    readUInt32BE(): number;
    writeUInt32BE(value: number): void;
    readListUInt16BE(length: number): number[];
    writeListUInt16BE(values: number[]): void;
    readIeeeAddrBE(): Eui64;
    writeIeeeAddrBE(value: string): void;
}
export default BuffaloZiGate;
//# sourceMappingURL=buffaloZiGate.d.ts.map