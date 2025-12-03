export declare enum FrameType {
    UNKNOWN = 0,
    ERROR = 1,
    DATA = 2,
    ACK = 3,
    NAK = 4,
    RST = 5,
    RSTACK = 6
}
/**
 * Basic class to handle uart-level frames
 * https://www.silabs.com/documents/public/user-guides/ug101-uart-gateway-protocol-reference.pdf
 */
export declare class Frame {
    /**
     * Type of the Frame as determined by its control byte.
     */
    readonly type: FrameType;
    readonly buffer: Buffer;
    constructor(buffer: Buffer);
    get control(): number;
    static fromBuffer(buffer: Buffer): Frame;
    /**
     * XOR s with a pseudo-random sequence for transmission.
     * Used only in data frames.
     */
    static makeRandomizedBuffer(buffer: Buffer): Buffer;
    /**
     * Throws on CRC error.
     */
    checkCRC(): void;
    /**
     *
     * @returns Buffer to hex string
     */
    toString(): string;
}
export default Frame;
//# sourceMappingURL=frame.d.ts.map