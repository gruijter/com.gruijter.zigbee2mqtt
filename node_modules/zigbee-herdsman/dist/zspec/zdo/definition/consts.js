"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURVE_PUBLIC_POINT_SIZE = exports.CHALLENGE_VALUE_SIZE = exports.UNICAST_BINDING = exports.MULTICAST_BINDING = exports.ZDO_MESSAGE_OVERHEAD = exports.ZDO_PROFILE_ID = exports.ZDO_ENDPOINT = void 0;
/** The endpoint where the Zigbee Device Object (ZDO) resides. */
exports.ZDO_ENDPOINT = 0;
/** The profile ID used by the Zigbee Device Object (ZDO). */
exports.ZDO_PROFILE_ID = 0x0000;
/** ZDO messages start with a sequence number. */
exports.ZDO_MESSAGE_OVERHEAD = 1;
exports.MULTICAST_BINDING = 0x01;
exports.UNICAST_BINDING = 0x03;
/** 64-bit challenge value used by CHALLENGE_REQUEST/CHALLENGE_RESPONSE clusters */
exports.CHALLENGE_VALUE_SIZE = 8;
/** The 256-bit Curve 25519 public point. */
exports.CURVE_PUBLIC_POINT_SIZE = 32;
//# sourceMappingURL=consts.js.map