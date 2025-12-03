"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// All multi-byte values are big-endian
var ParameterType;
(function (ParameterType) {
    ParameterType[ParameterType["UINT8"] = 0] = "UINT8";
    ParameterType[ParameterType["UINT16"] = 1] = "UINT16";
    ParameterType[ParameterType["UINT32"] = 2] = "UINT32";
    ParameterType[ParameterType["IEEEADDR"] = 3] = "IEEEADDR";
    ParameterType[ParameterType["BUFFER"] = 4] = "BUFFER";
    ParameterType[ParameterType["BUFFER8"] = 5] = "BUFFER8";
    ParameterType[ParameterType["BUFFER16"] = 6] = "BUFFER16";
    ParameterType[ParameterType["BUFFER18"] = 7] = "BUFFER18";
    ParameterType[ParameterType["BUFFER32"] = 8] = "BUFFER32";
    ParameterType[ParameterType["BUFFER42"] = 9] = "BUFFER42";
    ParameterType[ParameterType["BUFFER100"] = 10] = "BUFFER100";
    ParameterType[ParameterType["LIST_UINT8"] = 11] = "LIST_UINT8";
    ParameterType[ParameterType["LIST_UINT16"] = 12] = "LIST_UINT16";
    ParameterType[ParameterType["INT8"] = 18] = "INT8";
    ParameterType[ParameterType["MACCAPABILITY"] = 100] = "MACCAPABILITY";
    ParameterType[ParameterType["ADDRESS_WITH_TYPE_DEPENDENCY"] = 101] = "ADDRESS_WITH_TYPE_DEPENDENCY";
    ParameterType[ParameterType["RAW"] = 102] = "RAW";
    // /!\ TODO missing but used in code, IDs assigned for proper compiling, NOT based on spec, needs updating
    // /!\      some also don't have proper read/write in BuffaloZiGate
    ParameterType[ParameterType["BUFFER_RAW"] = 247] = "BUFFER_RAW";
    ParameterType[ParameterType["MAYBE_UINT8"] = 252] = "MAYBE_UINT8";
    ParameterType[ParameterType["LOG_LEVEL"] = 253] = "LOG_LEVEL";
    ParameterType[ParameterType["STRING"] = 254] = "STRING";
})(ParameterType || (ParameterType = {}));
exports.default = ParameterType;
//# sourceMappingURL=parameterType.js.map