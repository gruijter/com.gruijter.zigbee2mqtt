"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityManagerEntry = exports.SecurityManagerAuthenticationOption = void 0;
const struct_1 = require("../struct");
/**
 * Security manager authentication options.
 *
 * *Definition from Z-Stack 3.0.2 `ZDSecMgr.h.h`*
 */
var SecurityManagerAuthenticationOption;
(function (SecurityManagerAuthenticationOption) {
    /* ZDSecMgr_Not_Authenticated */
    SecurityManagerAuthenticationOption[SecurityManagerAuthenticationOption["Default"] = 0] = "Default";
    /* ZDSecMgr_Authenticated_CBCK */
    SecurityManagerAuthenticationOption[SecurityManagerAuthenticationOption["AuthenticatedCBCK"] = 1] = "AuthenticatedCBCK";
    /* ZDSecMgr_Authenticated_EA */
    SecurityManagerAuthenticationOption[SecurityManagerAuthenticationOption["AuthenticatedEA"] = 2] = "AuthenticatedEA";
})(SecurityManagerAuthenticationOption || (exports.SecurityManagerAuthenticationOption = SecurityManagerAuthenticationOption = {}));
/**
 * Creates a security manager entry.
 *
 * *Definition from Z-Stack 3.0.2 `ZDSecMgr.c`*
 *
 * @param data Data to initialize structure with.
 */
const securityManagerEntry = (data) => {
    return struct_1.Struct.new()
        .member("uint16", "ami")
        .member("uint16", "keyNvId")
        .member("uint8", "authenticationOption")
        .default(Buffer.from("feff000000", "hex"))
        .build(data);
};
exports.securityManagerEntry = securityManagerEntry;
//# sourceMappingURL=security-manager-entry.js.map