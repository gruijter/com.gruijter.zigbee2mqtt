/**
 * Converts packed `uint32` channel list to array of channel numbers.
 *
 * @param packedList Packed channel list value.
 */
export declare const unpackChannelList: (packedList: number) => number[];
/**
 * Converts array of channel numbers to packed `uint32` structure represented as number.
 * Supported channel range is 11 - 29.
 *
 * @param channelList List of channels to be packed.
 */
export declare const packChannelList: (channelList: number[]) => number;
/**
 * Compares two channel lists. Either number arrays or packed `uint32` numbers may be provided.
 *
 * @param list1 First list to compare.
 * @param list2 Second list to compare.
 */
export declare const compareChannelLists: (list1: number | number[], list2: number | number[]) => boolean;
//# sourceMappingURL=channel-list.d.ts.map