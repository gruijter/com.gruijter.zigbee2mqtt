/**
 * Buffer to hold a DATA frame.
 * Allocates `data` to `EZSP_MAX_FRAME_LENGTH` filled with zeroes.
 */
export declare class EzspBuffer {
    /** uint8_t[EZSP_MAX_FRAME_LENGTH] */
    data: Buffer;
    link?: EzspBuffer;
    /** uint8_t */
    len: number;
    constructor();
}
/**
 * Simple queue (singly-linked list)
 */
export declare class EzspQueue {
    tail?: EzspBuffer;
    constructor();
    /**
     * Get the number of buffers in the queue.
     * @returns
     */
    get length(): number;
    get empty(): boolean;
    /**
     * Get a pointer to the buffer at the head of the queue.
     * @returns
     */
    get head(): EzspBuffer;
    /**
     * Get a pointer to the Nth entry in the queue (the tail corresponds to N = 1).
     *
     * @param n
     * @returns
     */
    getNthEntry(n: number): EzspBuffer | undefined;
    /**
     * Get a pointer to the entry before the specified entry (closer to the tail).
     * If the buffer specified is undefined, the head entry is returned.
     * If the buffer specified is the tail, undefined is returned.
     * @param entry The buffer to look before.
     * @returns
     */
    getPrecedingEntry(entry?: EzspBuffer): EzspBuffer | undefined;
    /**
     * Add a buffer to the tail of the queue.
     * @param buf
     */
    addTail(buf: EzspBuffer): void;
    /**
     * Remove the buffer at the head of the queue.
     * @returns The removed buffer.
     */
    removeHead(): EzspBuffer;
    /**
     * Remove the specified entry from the queue.
     * @param entry
     * @returns A pointer to the preceding entry (if any).
     */
    removeEntry(entry: EzspBuffer): EzspBuffer | undefined;
}
/**
 * Simple free list (singly-linked list)
 */
export declare class EzspFreeList {
    link?: EzspBuffer;
    constructor();
    /**
     * Get the number of buffers in the free list.
     * @returns
     */
    get length(): number;
    /**
     * Add a buffer to the free list.
     * @param buf
     */
    freeBuffer(buf: EzspBuffer): void;
    /**
     * Get a buffer from the free list.
     * @returns
     */
    allocBuffer(): EzspBuffer | undefined;
}
//# sourceMappingURL=queues.d.ts.map