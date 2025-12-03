"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressManagerEntry = exports.AddressManagerUser = void 0;
const struct_1 = require("../struct");
/**
 * Address manager entry flags present in `user` field.
 *
 * *Definition from Z-Stack 3.0.2 `ADdrMgr.h`*
 */
var AddressManagerUser;
(function (AddressManagerUser) {
    /* ADDRMGR_USER_DEFAULT */
    AddressManagerUser[AddressManagerUser["Default"] = 0] = "Default";
    /* ADDRMGR_USER_ASSOC */
    AddressManagerUser[AddressManagerUser["Assoc"] = 1] = "Assoc";
    /* ADDRMGR_USER_SECURITY */
    AddressManagerUser[AddressManagerUser["Security"] = 2] = "Security";
    /* ADDRMGR_USER_BINDING */
    AddressManagerUser[AddressManagerUser["Binding"] = 4] = "Binding";
    /* ADDRMGR_USER_PRIVATE1 */
    AddressManagerUser[AddressManagerUser["Private1"] = 8] = "Private1";
})(AddressManagerUser || (exports.AddressManagerUser = AddressManagerUser = {}));
const emptyAddress1 = Buffer.alloc(8, 0x00);
const emptyAddress2 = Buffer.alloc(8, 0xff);
/**
 * Creates an address manager entry.
 *
 * *Definition from Z-Stack 3.0.2 `AddrMgr.h`*
 * *The `uint16` index field is not physically present.*
 *
 * @param data Data to initialize structure with.
 */
const addressManagerEntry = (data) => {
    return struct_1.Struct.new()
        .member("uint8", "user")
        .member("uint16", "nwkAddr")
        .member("uint8array-reversed", "extAddr", 8)
        .method("isSet", Boolean.prototype, (e) => e.user !== 0x00 && !e.extAddr.equals(emptyAddress1) && !e.extAddr.equals(emptyAddress2))
        .padding(0xff)
        .build(data);
};
exports.addressManagerEntry = addressManagerEntry;
//# sourceMappingURL=address-manager-entry.js.map