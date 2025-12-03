/** mask to frame number modulus */
export declare const mod8: (n: number) => number;
/** increment in frame number modulus */
export declare const inc8: (n: number) => number;
/** Return true if n is within the range lo through hi, computed (mod 8) */
export declare const withinRange: (lo: number, n: number, hi: number) => boolean;
/**
 * Calculates 16-bit cyclic redundancy code (CITT CRC 16).
 *
 * Applies the standard CITT CRC 16 polynomial to a
 * single byte. It should support being called first with an initial
 * value, then repeatedly until all data is processed.
 *
 * @param newByte     The new byte to be run through CRC.
 * @param prevResult  The previous CRC result.
 * @returns The new CRC result.
 */
export declare const halCommonCrc16: (newByte: number, prevResult: number) => number;
/** Returns the low bits of the 8-bit value 'n' as uint8_t. */
export declare const lowBits: (n: number) => number;
/** Returns the high bits of the 8-bit value 'n' as uint8_t. */
export declare const highBits: (n: number) => number;
/** Returns the low byte of the 16-bit value 'n' as uint8_t. */
export declare const lowByte: (n: number) => number;
/** Returns the high byte of the 16-bit value 'n' as uint8_t. */
export declare const highByte: (n: number) => number;
/** Returns the value built from the two uint8_t values high and low. */
export declare const highLowToInt: (high: number, low: number) => number;
/** Useful to reference a single bit of a byte. */
export declare const bit: (x: number) => number;
/** Useful to reference a single bit of an uint32_t type. */
export declare const bit32: (x: number) => number;
/** Returns both the low and high bytes (in that order) of the same 16-bit value 'n' as uint8_t. */
export declare const lowHighBytes: (n: number) => [number, highByte: number];
/** Returns both the low and high bits (in that order) of the same 8-bit value 'n' as uint8_t. */
export declare const lowHighBits: (n: number) => [number, highBits: number];
/**
 * Get byte as an 8-bit string (`n` assumed of proper range).
 * @param n
 * @returns
 */
export declare const byteToBits: (n: number) => string;
//# sourceMappingURL=math.d.ts.map