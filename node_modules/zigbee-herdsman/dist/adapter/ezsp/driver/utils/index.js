"use strict";
/* v8 ignore start */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crc16ccitt = void 0;
exports.emberSecurity = emberSecurity;
const node_crypto_1 = require("node:crypto");
const named_1 = require("../types/named");
const struct_1 = require("../types/struct");
const crc16ccitt_1 = __importDefault(require("./crc16ccitt"));
exports.crc16ccitt = crc16ccitt_1.default;
if (!Symbol.asyncIterator) {
    // biome-ignore lint/suspicious/noExplicitAny: API
    Symbol.asyncIterator = Symbol.for("Symbol.asyncIterator");
}
function emberSecurity(networkKey) {
    const isc = new struct_1.EmberInitialSecurityState();
    isc.bitmask =
        named_1.EmberInitialSecurityBitmask.HAVE_PRECONFIGURED_KEY |
            named_1.EmberInitialSecurityBitmask.TRUST_CENTER_GLOBAL_LINK_KEY |
            named_1.EmberInitialSecurityBitmask.HAVE_NETWORK_KEY |
            //EmberInitialSecurityBitmask.PRECONFIGURED_NETWORK_KEY_MODE |
            named_1.EmberInitialSecurityBitmask.REQUIRE_ENCRYPTED_KEY |
            named_1.EmberInitialSecurityBitmask.TRUST_CENTER_USES_HASHED_LINK_KEY;
    isc.preconfiguredKey = new struct_1.EmberKeyData();
    isc.preconfiguredKey.contents = (0, node_crypto_1.randomBytes)(16);
    isc.networkKey = new struct_1.EmberKeyData();
    isc.networkKey.contents = networkKey;
    isc.networkKeySequenceNumber = 0;
    isc.preconfiguredTrustCenterEui64 = new named_1.EmberEUI64([0, 0, 0, 0, 0, 0, 0, 0]);
    return isc;
}
//# sourceMappingURL=index.js.map