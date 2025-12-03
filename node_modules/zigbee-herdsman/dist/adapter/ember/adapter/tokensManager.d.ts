import { SLStatus } from "../enums";
import type { Ezsp } from "../ezsp/ezsp";
import type { EmberTokenData } from "../types";
export declare class EmberTokensManager {
    /**
     * Host-only API to check whether the NCP uses key storage.
     *
     * @returns false if keys are in classic key storage, and true if they are located in PSA key storage.
     */
    static ncpUsesPSAKeyStorage(ezsp: Ezsp): Promise<boolean>;
    /**
     * Matcher for Zigbeed tokens.
     * @param nvm3Key
     * @returns
     */
    static getCreatorFromNvm3Key(nvm3Key: number): number;
    /**
     * Saves tokens. Only for NVM3-based NCP.
     *
     * The binary file format to save the tokens are
     *
     * Number of Tokens (1 byte)
     * Token0 (4 bytes) Token0Size(1 byte) Token0ArraySize(1 byte) Token0Data(Token0Size * Token0ArraySize)
     * :
     * :
     * TokenM (4 bytes) TokenMSize(1 byte) TokenMArraySize(1 byte) TokenMData(TokenMSize * TokenMArraySize)
     *
     * @param localEui64 Used in place of blank `restoredEui64` keys
     *
     * @return Saved tokens buffer or null.
     */
    static saveTokens(ezsp: Ezsp, localEui64: Buffer): Promise<Buffer | undefined>;
    /**
     * Restores tokens. Only for NVM3-based NCP.
     * XXX: If a previous backup from an NVM3 NCP is attempted on a non-NVM3 NCP,
     *      it should just fail (LIBRARY_NOT_PRESENT all on token-related functions).
     *
     * @see EmberTokensManager.saveTokens() for format
     *
     * @return SLStatus status code
     */
    static restoreTokens(ezsp: Ezsp, inBuffer: Buffer): Promise<SLStatus>;
    /**
     * Secure key storage needs to export the keys first so backup file has them.
     *
     * @param tokenData EmberTokenData* [IN/OUT]
     * @param nvm3Key uint32_t
     * @param index uint8_t
     * @returns
     */
    static saveKeysToData(ezsp: Ezsp, tokenData: EmberTokenData, nvm3Key: number, index: number): Promise<SLStatus>;
    /**
     *
     * @param data_s EmberTokenData*
     * @param nvm3Key uint32_t
     * @param index uint8_t
     * @returns
     *
     * @from sli_zigbee_af_trust_center_backup_restore_keys_from_data
     */
    static restoreKeysFromData(ezsp: Ezsp, tokenData: EmberTokenData, nvm3Key: number, index: number): Promise<SLStatus>;
    /**
     * Updates zigbeed tokens from a backup of NCP tokens.
     *
     * @return SLStatus status code
     */
    static writeNcpTokensToZigbeedTokens(ezsp: Ezsp, inBuffer: Buffer): Promise<SLStatus>;
}
//# sourceMappingURL=tokensManager.d.ts.map