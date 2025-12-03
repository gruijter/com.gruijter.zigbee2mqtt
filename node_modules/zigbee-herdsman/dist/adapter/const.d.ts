import * as Zcl from "../zspec/zcl";
/**
 * Workaround for devices that require a specific manufacturer code to be reported by coordinator while interviewing...
 * - Lumi/Aqara devices do not work properly otherwise (missing features): https://github.com/Koenkk/zigbee2mqtt/issues/9274
 */
export declare const WORKAROUND_JOIN_MANUF_IEEE_PREFIX_TO_CODE: {
    [ieeePrefix: string]: Zcl.ManufacturerCode;
};
//# sourceMappingURL=const.d.ts.map