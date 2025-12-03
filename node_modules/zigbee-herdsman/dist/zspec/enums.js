"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastAddress = void 0;
/**
 * Zigbee Broadcast Addresses
 *
 * Zigbee specifies three different broadcast addresses that reach different collections of nodes.
 * Broadcasts are normally sent only to routers.
 * Broadcasts can also be forwarded to end devices, either all of them or only those that do not sleep.
 * Broadcasting to end devices is both significantly more resource-intensive and significantly less reliable than broadcasting to routers.
 */
var BroadcastAddress;
(function (BroadcastAddress) {
    // Reserved = 0xfff8,
    // Reserved = 0xfff9,
    // Reserved = 0xfffa,
    /** Low power routers only */
    BroadcastAddress[BroadcastAddress["LOW_POWER_ROUTERS"] = 65531] = "LOW_POWER_ROUTERS";
    /** All routers and coordinator */
    BroadcastAddress[BroadcastAddress["DEFAULT"] = 65532] = "DEFAULT";
    /** macRxOnWhenIdle = TRUE (all non-sleepy devices) */
    BroadcastAddress[BroadcastAddress["RX_ON_WHEN_IDLE"] = 65533] = "RX_ON_WHEN_IDLE";
    // Reserved = 0xFFFE,
    /** All devices in PAN (including sleepy end devices) */
    BroadcastAddress[BroadcastAddress["SLEEPY"] = 65535] = "SLEEPY";
})(BroadcastAddress || (exports.BroadcastAddress = BroadcastAddress = {}));
//# sourceMappingURL=enums.js.map