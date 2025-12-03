import type { SerializableMemoryObject } from "./serializable-memory-object";
import type { BuiltStruct, StructFactorySignature, StructMemoryAlignment } from "./struct";
type TableBuildOmitKeys = "struct" | "header" | "occupancy" | "load" | "build" | "inlineHeader";
export type BuiltTable<R extends BuiltStruct, T = Table<R>> = Omit<T, TableBuildOmitKeys>;
export type TableFactorySignature<R extends BuiltStruct, T = Table<R>> = (data?: Buffer) => T;
/**
 * Table structure wraps `Struct`-based entries for tables present within ZNP NV memory.
 */
export declare class Table<R extends BuiltStruct> implements SerializableMemoryObject {
    /**
     * Create a new table builder.
     */
    static new<R extends BuiltStruct>(): Table<R>;
    private data;
    private emptyEntry;
    private hasInlineLengthHeader;
    private entryStructFactory;
    private entryOccupancyFunction;
    private constructor();
    /**
     * Return total capacity of the table.
     */
    get capacity(): number;
    /**
     * Returns all entries within table.
     */
    get entries(): R[];
    /**
     * Returns all used entries.
     */
    get used(): R[];
    /**
     * Returns all unused entries.
     */
    get free(): R[];
    /**
     * Return number of records marked as free.
     */
    get freeCount(): number;
    /**
     * Return number of records marked as used.
     */
    get usedCount(): number;
    /**
     * Return next free entry or `null` if no entries are free within the table.
     */
    getNextFree(): R;
    /**
     * Returns index of element in table.
     *
     * @param entry Entry to resolve index for.
     */
    indexOf(entry: R): number | null;
    /**
     * Export the table in target platform format.
     *
     * @param alignment Memory alignment to use for export.
     */
    serialize(alignment?: StructMemoryAlignment): Buffer;
    /**
     * Applies function to determine table entry occupancy. This function is invoked with an entry instance
     * and returns `boolean` indicating if the entry is occupied or not.
     *
     * @param fn Function to determine entry occupancy.
     */
    occupancy(fn: (entry: R) => boolean): this;
    /**
     * Defines a struct factory for entries contained within table.
     *
     * @param entryStructFactory Struct factory.
     */
    struct(entryStructFactory: StructFactorySignature<R>): this;
    /**
     * Sets whether the table has a table header containing a 16-bit unsigned used table length.
     *
     * @param hasInlineHeader Sets whether table has record count header.
     */
    inlineHeader(hasInlineHeader?: boolean): this;
    /**
     * Builds the table from existing buffer or buffers representing entries.
     *
     * @param data Buffer to populate table from.
     * @param alignment Memory alignment of the source platform.
     */
    build(data: Buffer | Buffer[], alignment?: StructMemoryAlignment): BuiltTable<R>;
    /**
     * Creates an empty table with set capacity.
     *
     * @param capacity Capacity to create the table with.
     */
    build(capacity: number): BuiltTable<R>;
}
export {};
//# sourceMappingURL=table.d.ts.map