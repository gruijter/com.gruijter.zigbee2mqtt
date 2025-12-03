import type { Buffer } from "node:buffer";
type CalcFn = (buf: Buffer | number[], previous: number) => number;
declare const crc16ccitt: CalcFn;
export default crc16ccitt;
//# sourceMappingURL=crc16ccitt.d.ts.map