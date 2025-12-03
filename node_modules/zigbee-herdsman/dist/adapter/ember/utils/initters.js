"use strict";
/* v8 ignore start */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.aesMmoHashInit = exports.initSecurityManagerContext = exports.initNetworkCache = void 0;
const ZSpec = __importStar(require("../../../zspec"));
const consts_1 = require("../consts");
const enums_1 = require("../enums");
const consts_2 = require("../ezsp/consts");
/**
 * Initialize a network cache index with proper "invalid" values.
 * @returns
 */
const initNetworkCache = () => {
    return {
        eui64: ZSpec.BLANK_EUI64,
        parameters: {
            extendedPanId: ZSpec.BLANK_EXTENDED_PAN_ID.slice(), // copy
            panId: ZSpec.INVALID_PAN_ID,
            radioTxPower: 0,
            radioChannel: consts_1.INVALID_RADIO_CHANNEL,
            joinMethod: enums_1.EmberJoinMethod.MAC_ASSOCIATION,
            nwkManagerId: ZSpec.NULL_NODE_ID,
            nwkUpdateId: 0,
            channels: ZSpec.ALL_802_15_4_CHANNELS_MASK,
        },
    };
};
exports.initNetworkCache = initNetworkCache;
/**
 * This routine will initialize a Security Manager context correctly for use in subsequent function calls.
 * @returns
 */
const initSecurityManagerContext = () => {
    return {
        coreKeyType: enums_1.SecManKeyType.NONE,
        keyIndex: 0,
        derivedType: enums_1.SecManDerivedKeyType.NONE,
        eui64: "0x0000000000000000",
        multiNetworkIndex: 0,
        flags: enums_1.SecManFlag.NONE,
        psaKeyAlgPermission: consts_1.ZB_PSA_ALG, // unused for classic key storage
    };
};
exports.initSecurityManagerContext = initSecurityManagerContext;
/**
 *  This routine clears the passed context so that a new hash calculation
 *  can be performed.
 *
 *  @returns context A pointer to the location of hash context to clear.
 */
const aesMmoHashInit = () => {
    // MEMSET(context, 0, sizeof(EmberAesMmoHashContext));
    return {
        result: Buffer.alloc(consts_2.EMBER_AES_HASH_BLOCK_SIZE), // uint8_t[EMBER_AES_HASH_BLOCK_SIZE]
        length: 0x00000000, // uint32_t
    };
};
exports.aesMmoHashInit = aesMmoHashInit;
//# sourceMappingURL=initters.js.map