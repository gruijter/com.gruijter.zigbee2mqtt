"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelList = void 0;
const struct_1 = require("../struct");
/**
 * Creates a channel list struct.
 *
 * @param data Data to initialize structure with.
 */
const channelList = (data) => struct_1.Struct.new().member("uint32", "channelList").build(data);
exports.channelList = channelList;
//# sourceMappingURL=channel-list.js.map