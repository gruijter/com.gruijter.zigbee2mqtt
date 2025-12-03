/**
 * Parse the given code using known formats:
 * - 95 or 91-length
 * - Widely adopted (Ubisys, Danfoss, Inovelli, Ledvance): ...Z:<ieee>$I:<key>...
 * - Pipe-separated (Muller-Licht, Innr): <ieee>|<key>
 * - Aqara: G$M:...$A:<ieee>$I:<key>
 * - Hue: HUE:Z:<key> M:<ieee>...
 * @param installCode
 * @returns
 *   - the IEEE address
 *   - the raw key
 */
export declare function parseInstallCode(installCode: string): [ieeeAddr: string, key: string];
/**
 * Check if install code (little-endian) is valid, and if not, and requested, fix it.
 *
 * WARNING: Due to conflicting sizes between 8-length code with invalid CRC, and 10-length code missing CRC, given 8-length codes are always assumed to be 8-length code with invalid CRC (most probable scenario).
 *
 * @param code The code to check. Reference is not modified by this procedure but is returned when code was valid, as `outCode`.
 * @param adjust If false, throws if the install code is invalid, otherwise try to fix it (CRC)
 * @returns
 *   - The adjusted code, or `code` if not adjusted.
 *   - If adjust is false, undefined, otherwise, the reason why the code needed adjusting or undefined if not.
 *   - Throws when adjust=false and invalid, or cannot fix.
 */
export declare function checkInstallCode(code: Buffer, adjust?: boolean): [outCode: Buffer, adjusted: "invalid CRC" | "missing CRC" | undefined];
//# sourceMappingURL=installCodes.d.ts.map