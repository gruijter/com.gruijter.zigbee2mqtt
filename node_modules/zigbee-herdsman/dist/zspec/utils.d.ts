import type { Eui64 } from "./tstypes";
/**
 * Convert a channels array to a uint32 channel mask.
 * @param channels
 * @returns
 */
export declare const channelsToUInt32Mask: (channels: number[]) => number;
/**
 * Convert a uint32 channel mask to a channels array.
 * @param mask
 * @returns
 */
export declare const uint32MaskToChannels: (mask: number) => number[];
export declare const isBroadcastAddress: (address: number) => boolean;
/**
 * Represent a little endian buffer in `0x...` form
 *
 * NOTE: the buffer is always copied to avoid reversal in reference
 */
export declare const eui64LEBufferToHex: (eui64LEBuf: Buffer) => Eui64;
/**
 * Represent a big endian buffer in `0x...` form
 */
export declare const eui64BEBufferToHex: (eui64BEBuf: Buffer) => Eui64;
/**
 * CRC-16/X-25
 * aka CRC-16/IBM-SDLC
 * aka CRC-16/ISO-HDLC
 * aka CRC-16/ISO-IEC-14443-3-B
 * aka CRC-B
 * aka X-25
 *
 * Shortcut for `calcCRC(data, 16, 0x1021, 0xFFFF, 0xFFFF, true, true)`
 *
 * Used for Install Codes - see Document 13-0402-13 - 10.1
 */
export declare function crc16X25(data: number[] | Uint8Array | Buffer): number;
/**
 * CRC-16/XMODEM
 * aka CRC-16/ACORN
 * aka CRC-16/LTE
 * aka CRC-16/V-41-MSB
 * aka XMODEM
 * aka ZMODEM
 *
 * Shortcut for `calcCRC(data, 16, 0x1021)`
 *
 * Used for XMODEM transfers, often involved in Zigbee environments
 */
export declare function crc16XMODEM(data: number[] | Uint8Array | Buffer): number;
/**
 * CRC-16/CCITT
 * aka CRC-16/KERMIT
 * aka CRC-16/BLUETOOTH
 * aka CRC-16/CCITT-TRUE
 * aka CRC-16/V-41-LSB
 * aka CRC-CCITT
 * aka KERMIT
 *
 * Shortcut for `calcCRC(data, 16, 0x1021, 0x0000, 0x0000, true, true)`
 */
export declare function crc16CCITT(data: number[] | Uint8Array | Buffer): number;
/**
 * CRC-16/CCITT-FALSE
 * aka CRC-16/IBM-3740
 * aka CRC-16/AUTOSAR
 *
 * Shortcut for `calcCRC(data, 16, 0x1021, 0xffff)`
 */
export declare function crc16CCITTFALSE(data: number[] | Uint8Array | Buffer): number;
/**
 * AES-128-MMO (Matyas-Meyer-Oseas) hashing (using node 'crypto' built-in with 'aes-128-ecb')
 *
 * Used for Install Codes - see Document 13-0402-13 - 10.1
 */
export declare function aes128MmoHash(data: Buffer): Buffer;
//# sourceMappingURL=utils.d.ts.map