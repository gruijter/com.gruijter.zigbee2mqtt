"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationMethod = exports.PowerSource = exports.StructuredIndicatorType = exports.Direction = exports.FrameType = exports.ParameterCondition = exports.BuffaloZclDataType = exports.DataTypeClass = exports.DataType = void 0;
/**
 * This is the specification-defined data types. It should not contain "custom" types and is expected to have [0x00-0xFF] values.
 *
 * - Values of analog types may be added to or subtracted from other values of the same type and are typically
 * used to measure the value of properties in the real world that vary continuously over a range.
 * - Values of discrete data types only have meaning as individual values and may not be added or subtracted.
 */
var DataType;
(function (DataType) {
    /** length=0 */
    DataType[DataType["NO_DATA"] = 0] = "NO_DATA";
    /** class=discrete, length=1 */
    DataType[DataType["DATA8"] = 8] = "DATA8";
    /** class=discrete, length=2 */
    DataType[DataType["DATA16"] = 9] = "DATA16";
    /** class=discrete, length=3 */
    DataType[DataType["DATA24"] = 10] = "DATA24";
    /** class=discrete, length=4 */
    DataType[DataType["DATA32"] = 11] = "DATA32";
    /** class=discrete, length=5 */
    DataType[DataType["DATA40"] = 12] = "DATA40";
    /** class=discrete, length=6 */
    DataType[DataType["DATA48"] = 13] = "DATA48";
    /** class=discrete, length=7 */
    DataType[DataType["DATA56"] = 14] = "DATA56";
    /** class=discrete, length=8 */
    DataType[DataType["DATA64"] = 15] = "DATA64";
    /** 0x00=false, 0x01=true, class=discrete, length=1, non-value=0xFF */
    DataType[DataType["BOOLEAN"] = 16] = "BOOLEAN";
    /** class=discrete, length=1 */
    DataType[DataType["BITMAP8"] = 24] = "BITMAP8";
    /** class=discrete, length=2 */
    DataType[DataType["BITMAP16"] = 25] = "BITMAP16";
    /** class=discrete, length=3 */
    DataType[DataType["BITMAP24"] = 26] = "BITMAP24";
    /** class=discrete, length=4 */
    DataType[DataType["BITMAP32"] = 27] = "BITMAP32";
    /** class=discrete, length=5 */
    DataType[DataType["BITMAP40"] = 28] = "BITMAP40";
    /** class=discrete, length=6 */
    DataType[DataType["BITMAP48"] = 29] = "BITMAP48";
    /** class=discrete, length=7 */
    DataType[DataType["BITMAP56"] = 30] = "BITMAP56";
    /** class=discrete, length=8 */
    DataType[DataType["BITMAP64"] = 31] = "BITMAP64";
    /** class=discrete, length=1, non-value=0xFF */
    DataType[DataType["UINT8"] = 32] = "UINT8";
    /** class=analog, length=2, non-value=0xFFFF */
    DataType[DataType["UINT16"] = 33] = "UINT16";
    /** class=analog, length=3, non-value=0xFFFFFF */
    DataType[DataType["UINT24"] = 34] = "UINT24";
    /** class=analog, length=4, non-value=0xFFFFFFFF */
    DataType[DataType["UINT32"] = 35] = "UINT32";
    /** class=analog, length=5, non-value=0xFFFFFFFFFF */
    DataType[DataType["UINT40"] = 36] = "UINT40";
    /** class=analog, length=6, non-value=0xFFFFFFFFFFFF */
    DataType[DataType["UINT48"] = 37] = "UINT48";
    /** class=analog, length=7, non-value=0xFFFFFFFFFFFFFF */
    DataType[DataType["UINT56"] = 38] = "UINT56";
    /** class=analog, length=8, non-value=0xFFFFFFFFFFFFFFFF */
    DataType[DataType["UINT64"] = 39] = "UINT64";
    /** class=analog, length=1, non-value=0x80 */
    DataType[DataType["INT8"] = 40] = "INT8";
    /** class=analog, length=2, non-value=0x8000 */
    DataType[DataType["INT16"] = 41] = "INT16";
    /** class=analog, length=3, non-value=0x800000 */
    DataType[DataType["INT24"] = 42] = "INT24";
    /** class=analog, length=4, non-value=0x80000000 */
    DataType[DataType["INT32"] = 43] = "INT32";
    /** class=analog, length=5, non-value=0x8000000000 */
    DataType[DataType["INT40"] = 44] = "INT40";
    /** class=analog, length=6, non-value=0x800000000000 */
    DataType[DataType["INT48"] = 45] = "INT48";
    /** class=analog, length=7, non-value=0x80000000000000 */
    DataType[DataType["INT56"] = 46] = "INT56";
    /** class=analog, length=8, non-value=0x8000000000000000 */
    DataType[DataType["INT64"] = 47] = "INT64";
    /** class=discrete, length=1, non-value=0xFF */
    DataType[DataType["ENUM8"] = 48] = "ENUM8";
    /** class=discrete, length=2, non-value=0xFF */
    DataType[DataType["ENUM16"] = 49] = "ENUM16";
    /** class=analog, length=2, non-value=NaN */
    DataType[DataType["SEMI_PREC"] = 56] = "SEMI_PREC";
    /** class=analog, length=4, non-value=NaN */
    DataType[DataType["SINGLE_PREC"] = 57] = "SINGLE_PREC";
    /** class=analog, length=8, non-value=NaN */
    DataType[DataType["DOUBLE_PREC"] = 58] = "DOUBLE_PREC";
    /** class=composite, length=0x00-0xFE, non-value=0xFF */
    DataType[DataType["OCTET_STR"] = 65] = "OCTET_STR";
    /** class=composite, length=0x00-0xFE, non-value=0xFF */
    DataType[DataType["CHAR_STR"] = 66] = "CHAR_STR";
    /** class=composite, length=0x0000-0xFFFE, non-value=0xFFFF */
    DataType[DataType["LONG_OCTET_STR"] = 67] = "LONG_OCTET_STR";
    /** class=composite, length=0x0000-0xFFFE, non-value=0xFFFF */
    DataType[DataType["LONG_CHAR_STR"] = 68] = "LONG_CHAR_STR";
    /** class=composite, length=variable, non-value=(length=0xFFFF) */
    DataType[DataType["ARRAY"] = 72] = "ARRAY";
    /** class=composite, length=variable, non-value=(length=0xFFFF) */
    DataType[DataType["STRUCT"] = 76] = "STRUCT";
    /** class=composite, length=max(0xFFFE * DataType) non-value=(length=0xFFFF) */
    DataType[DataType["SET"] = 80] = "SET";
    /** @see SET Same but allows duplicate values */
    DataType[DataType["BAG"] = 81] = "BAG";
    /** Time of Day, @see ZclTimeOfDay , class=analog, length=4, unused-subfield=0xFF, non-value=0xFFFFFFFF */
    DataType[DataType["TOD"] = 224] = "TOD";
    /** @see ZclDate , class=analog, length=4, unused-subfield=0xFF, non-value=0xFFFFFFFF */
    DataType[DataType["DATE"] = 225] = "DATE";
    /** Number of seconds since 2000-01-01 00:00:00 UTC, class=analog, length=4, non-value=0xFFFFFFFF */
    DataType[DataType["UTC"] = 226] = "UTC";
    /** Defined in 2.6.1.3 of ZCL spec, class=discrete, length=2, non-value=0xFFFF */
    DataType[DataType["CLUSTER_ID"] = 232] = "CLUSTER_ID";
    /** Defined in 2.6.1.4 of ZCL spec, class=discrete, length=2, non-value=0xFFFF */
    DataType[DataType["ATTR_ID"] = 233] = "ATTR_ID";
    /** BACnet OID, allow internetworking (format defined in BACnet ref), class=discrete, length=4, non-value=0xFFFFFFFF */
    DataType[DataType["BAC_OID"] = 234] = "BAC_OID";
    /** class=discrete, length=8, non-value=0xFFFFFFFFFFFFFFFF */
    DataType[DataType["IEEE_ADDR"] = 240] = "IEEE_ADDR";
    /** Any 128-bit value, class=discrete, length=16 */
    DataType[DataType["SEC_KEY"] = 241] = "SEC_KEY";
    /** length=0 */
    DataType[DataType["UNKNOWN"] = 255] = "UNKNOWN";
})(DataType || (exports.DataType = DataType = {}));
/** @TODO strings for backwards compat in tests. Should be moved to numbers. */
var DataTypeClass;
(function (DataTypeClass) {
    DataTypeClass["ANALOG"] = "ANALOG";
    DataTypeClass["DISCRETE"] = "DISCRETE";
})(DataTypeClass || (exports.DataTypeClass = DataTypeClass = {}));
var BuffaloZclDataType;
(function (BuffaloZclDataType) {
    BuffaloZclDataType[BuffaloZclDataType["USE_DATA_TYPE"] = 1000] = "USE_DATA_TYPE";
    BuffaloZclDataType[BuffaloZclDataType["LIST_UINT8"] = 1001] = "LIST_UINT8";
    BuffaloZclDataType[BuffaloZclDataType["LIST_UINT16"] = 1002] = "LIST_UINT16";
    BuffaloZclDataType[BuffaloZclDataType["LIST_UINT24"] = 1003] = "LIST_UINT24";
    BuffaloZclDataType[BuffaloZclDataType["LIST_UINT32"] = 1004] = "LIST_UINT32";
    BuffaloZclDataType[BuffaloZclDataType["LIST_ZONEINFO"] = 1005] = "LIST_ZONEINFO";
    BuffaloZclDataType[BuffaloZclDataType["EXTENSION_FIELD_SETS"] = 1006] = "EXTENSION_FIELD_SETS";
    BuffaloZclDataType[BuffaloZclDataType["LIST_THERMO_TRANSITIONS"] = 1007] = "LIST_THERMO_TRANSITIONS";
    BuffaloZclDataType[BuffaloZclDataType["BUFFER"] = 1008] = "BUFFER";
    BuffaloZclDataType[BuffaloZclDataType["GPD_FRAME"] = 1009] = "GPD_FRAME";
    BuffaloZclDataType[BuffaloZclDataType["STRUCTURED_SELECTOR"] = 1010] = "STRUCTURED_SELECTOR";
    BuffaloZclDataType[BuffaloZclDataType["LIST_TUYA_DATAPOINT_VALUES"] = 1011] = "LIST_TUYA_DATAPOINT_VALUES";
    BuffaloZclDataType[BuffaloZclDataType["LIST_MIBOXER_ZONES"] = 1012] = "LIST_MIBOXER_ZONES";
    BuffaloZclDataType[BuffaloZclDataType["BIG_ENDIAN_UINT24"] = 1013] = "BIG_ENDIAN_UINT24";
    BuffaloZclDataType[BuffaloZclDataType["MI_STRUCT"] = 1014] = "MI_STRUCT";
})(BuffaloZclDataType || (exports.BuffaloZclDataType = BuffaloZclDataType = {}));
/** @TODO strings for backwards compat in tests. Should be moved to numbers. */
var ParameterCondition;
(function (ParameterCondition) {
    ParameterCondition["MINIMUM_REMAINING_BUFFER_BYTES"] = "minimumRemainingBufferBytes";
    ParameterCondition["BITMASK_SET"] = "bitMaskSet";
    ParameterCondition["BITFIELD_ENUM"] = "bitFieldEnum";
    ParameterCondition["DATA_TYPE_CLASS_EQUAL"] = "dataTypeValueTypeEquals";
    ParameterCondition["FIELD_EQUAL"] = "fieldEquals";
    ParameterCondition["FIELD_GT"] = "fieldGT";
})(ParameterCondition || (exports.ParameterCondition = ParameterCondition = {}));
var FrameType;
(function (FrameType) {
    FrameType[FrameType["GLOBAL"] = 0] = "GLOBAL";
    FrameType[FrameType["SPECIFIC"] = 1] = "SPECIFIC";
})(FrameType || (exports.FrameType = FrameType = {}));
var Direction;
(function (Direction) {
    Direction[Direction["CLIENT_TO_SERVER"] = 0] = "CLIENT_TO_SERVER";
    Direction[Direction["SERVER_TO_CLIENT"] = 1] = "SERVER_TO_CLIENT";
})(Direction || (exports.Direction = Direction = {}));
/**
 * The upper 4 bits of the Indicator subfield for Attributes Structured commands.
 */
var StructuredIndicatorType;
(function (StructuredIndicatorType) {
    /**
     * Write: Only for attributes of type other than array, structure, set or bag
     *
     * Read: Only for attributes of type other than array or structure
     */
    StructuredIndicatorType[StructuredIndicatorType["Whole"] = 0] = "Whole";
    /** Add element to the set/bag */
    StructuredIndicatorType[StructuredIndicatorType["WriteAdd"] = 16] = "WriteAdd";
    /** Remove element from the set/bag */
    StructuredIndicatorType[StructuredIndicatorType["WriteRemove"] = 32] = "WriteRemove";
})(StructuredIndicatorType || (exports.StructuredIndicatorType = StructuredIndicatorType = {}));
/** Mapping of descriptive string power to source bits. */
var PowerSource;
(function (PowerSource) {
    PowerSource[PowerSource["Unknown"] = 0] = "Unknown";
    PowerSource[PowerSource["Mains (single phase)"] = 1] = "Mains (single phase)";
    PowerSource[PowerSource["Mains (3 phase)"] = 2] = "Mains (3 phase)";
    PowerSource[PowerSource["Battery"] = 3] = "Battery";
    PowerSource[PowerSource["DC Source"] = 4] = "DC Source";
    PowerSource[PowerSource["Emergency mains constantly powered"] = 5] = "Emergency mains constantly powered";
    PowerSource[PowerSource["Emergency mains and transfer switch"] = 6] = "Emergency mains and transfer switch";
})(PowerSource || (exports.PowerSource = PowerSource = {}));
/** Used by the RSSI Location cluster */
var LocationMethod;
(function (LocationMethod) {
    /** A method based on RSSI measurements from three or more sources. */
    LocationMethod[LocationMethod["Lateration"] = 0] = "Lateration";
    /** The location reported is the location of the neighboring device with the strongest received signal. */
    LocationMethod[LocationMethod["Signposting"] = 1] = "Signposting";
    /**
     * RSSI signatures are collected into a database at commissioning time.
     * The location reported is the location taken from the RSSI signature database that most closely matches the device’s own RSSI signature.
     */
    LocationMethod[LocationMethod["RfFingerprinting"] = 2] = "RfFingerprinting";
    /** The location is obtained by accessing an out-of-band device (that is, the device providing the location is not part of the network). */
    LocationMethod[LocationMethod["OutOfBand"] = 3] = "OutOfBand";
    /**
     * The location is performed in a centralized way (e.g., by the GW) by a device on the network.
     * Different from the above because the device performing the localization is part of the network.
     */
    LocationMethod[LocationMethod["Centralized"] = 4] = "Centralized";
    // 0x40 to 0xff - Reserved for manufacturer specific location methods.
})(LocationMethod || (exports.LocationMethod = LocationMethod = {}));
//# sourceMappingURL=enums.js.map