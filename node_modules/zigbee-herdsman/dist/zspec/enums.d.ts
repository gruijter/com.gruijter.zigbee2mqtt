/**
 * Zigbee Broadcast Addresses
 *
 * Zigbee specifies three different broadcast addresses that reach different collections of nodes.
 * Broadcasts are normally sent only to routers.
 * Broadcasts can also be forwarded to end devices, either all of them or only those that do not sleep.
 * Broadcasting to end devices is both significantly more resource-intensive and significantly less reliable than broadcasting to routers.
 */
export declare enum BroadcastAddress {
    /** Low power routers only */
    LOW_POWER_ROUTERS = 65531,
    /** All routers and coordinator */
    DEFAULT = 65532,
    /** macRxOnWhenIdle = TRUE (all non-sleepy devices) */
    RX_ON_WHEN_IDLE = 65533,
    /** All devices in PAN (including sleepy end devices) */
    SLEEPY = 65535
}
//# sourceMappingURL=enums.d.ts.map