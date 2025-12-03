import { NvItemsIds, type NvSystemIds } from "../constants/common";
import type * as Structs from "../structs";
import type { BuiltTable } from "../structs";
import type { Znp } from "../znp";
/**
 * Adapter non-volatile memory instrumentation. This class provides interface to interact
 * with ZNP adapter's NV memory. Provided functionality covers basic operations from reading,
 * writing and deleting keys to extended table manipulation.
 */
export declare class AdapterNvMemory {
    memoryAlignment?: Structs.StructMemoryAlignment;
    private znp;
    constructor(znp: Znp);
    /**
     * Initialize NV memory driver by examining target and determining memory alignment.
     */
    init(): Promise<void>;
    /**
     * Reads a variable-length item from NV memory and returns buffer object. Read can be offset as required.
     *
     * @param id NV item identifier.
     * @param offset Desired data offset to read from.
     */
    readItem(id: NvItemsIds, offset?: number): Promise<Buffer>;
    /**
     * Reads a variable-length item from NV memory and creates a builds a requested struct.
     *
     * @param id NV item identifier.
     * @param offset Desired data offset to read from.
     * @param useStruct Struct factory to use to wrap the data in.
     */
    readItem<R extends Structs.BuiltStruct, T extends R | Structs.BuiltTable<R>>(id: NvItemsIds, offset?: number, useStruct?: Structs.MemoryObjectFactory<T>): Promise<T>;
    /**
     * Writes data to adapter NV memory. Method fails if write fails.
     *
     * @param id NV item identifier.
     * @param data Data to be written.
     * @param offset Offset within NV item to write the data.
     * @param autoInit Whether NV item should be automatically initialized if not present.
     */
    writeItem(id: NvItemsIds, data: Buffer | Structs.SerializableMemoryObject, offset?: number, autoInit?: boolean): Promise<void>;
    /**
     * Determines whether NV item is different from provided data and updates if necessary.
     *
     * @param id NV item identifier.
     * @param data Desired NV item value.
     * @param autoInit Whether NV item should be automatically initialized if not present.
     */
    updateItem(id: NvItemsIds, data: Buffer, autoInit?: boolean): Promise<void>;
    /**
     * Deletes an NV memory item.
     *
     * @param id NV item identifier.
     */
    deleteItem(id: NvItemsIds): Promise<void>;
    /**
     * Reads extended table entry (used by Z-Stack 3.x+). NV tables within newer Z-Stack releases include 16-bit `subId`
     * identifying table entries.
     *
     * @param sysId SimpleLink system identifier.
     * @param id NV item identifier.
     * @param subId Entry index.
     * @param offset Data offset to read from.
     */
    readExtendedTableEntry(sysId: NvSystemIds, id: NvItemsIds, subId: number, offset?: number): Promise<Buffer>;
    readExtendedTableEntry<T extends Structs.BuiltStruct>(sysId: NvSystemIds, id: NvItemsIds, subId: number, offset?: number, useStruct?: Structs.MemoryObjectFactory<T>): Promise<T>;
    /**
     * Writes extended table entry (user by Z-Stack 3.x+). NV tables within newer Z-Stack releases include 16-bit `subId`
     * identifying table tnreis.
     *
     * @param sysId SimpleLink system identifier.
     * @param id NV item identifier.
     * @param subId Entry index.
     * @param data Data to write to the table.
     * @param offset Offset to write at.
     * @param autoInit Whether non-existent entry should be automatically initialized.
     */
    writeExtendedTableEntry(sysId: NvSystemIds, id: NvItemsIds, subId: number, data: Buffer, offset?: number, autoInit?: boolean): Promise<void>;
    /**
     * Reads a legacy NV table at defined index into raw `Buffer` object array. Providing maximum
     * length is necessary in order to prevent invalid memory access.
     *
     * @param mode Only legacy mode is supported with this signature.
     * @param id The item index at which the table starts.
     * @param maxLength Maximum number of items the table may contain.
     */
    readTable(mode: "legacy", id: NvItemsIds, maxLength: number): Promise<Buffer[]>;
    /**
     * Reads a legacy table at defined index into a table structure covering struct entries.
     * Providing maximum length is necessary in order to prevent invalid memory access.
     *
     * @param mode Only legacy mode is supported with this signature.
     * @param id The item index at which the table starts.
     * @param maxLength Maximum number of items the table may contain.
     * @param useTable Table factory to spawn a table and populate with retrieved data.
     */
    readTable<R extends Structs.BuiltStruct, T extends Structs.BuiltTable<R>>(mode: "legacy", id: NvItemsIds, maxLength: number, useTable?: Structs.MemoryObjectFactory<T>): Promise<T>;
    /**
     * Reads an extended (Z-Stack 3.x.0+) table into raw `Buffer` object array.
     * Maximum length is optional since the table boundary can be detected automatically.
     *
     * @param mode Only extended mode is supported with this signature.
     * @param sysId SimpleLink system identifier.
     * @param id Extended table NV index.
     * @param maxLength Maximum number of entries to load from the table.
     */
    readTable(mode: "extended", sysId: NvSystemIds, id: NvItemsIds, maxLength?: number): Promise<Buffer[]>;
    /**
     * Reads an extended (Z-Stack 3.x.0+) table into a table structure covering struct entries.
     * Maximum length is optional since the table boundary can be detected automatically.
     *
     * @param mode Only extended mode is supported with this signature.
     * @param sysId SimpleLink system identifier.
     * @param id Extended table NV index.
     * @param maxLength Maximum number of entries to load from the table.
     * @param useTable Table factory to spawn a table and populate with retrieved data.
     */
    readTable<R extends Structs.BuiltStruct, T extends Structs.BuiltTable<R>>(mode: "extended", sysId: NvSystemIds, id: NvItemsIds, maxLength?: number, useTable?: Structs.MemoryObjectFactory<T>): Promise<T>;
    /**
     * Writes a struct-based table structure into a legacy NV memory position.
     *
     * @param mode Only legacy mode is supported with this signature.
     * @param id Start NV item index.
     * @param table Table structure to write to NV memory.
     */
    writeTable<R extends Structs.BuiltStruct>(mode: "legacy", id: NvItemsIds, table: BuiltTable<R>): Promise<void>;
    /**
     * Writes a struct-based table structure into an extended NV memory position.
     *
     * @param mode Only extended mode is supported with this signature.
     * @param sysId SimpleLink system identifier.
     * @param id Extended table NV item index.
     * @param table Table structure to write to NV memory.
     */
    writeTable<R extends Structs.BuiltStruct>(mode: "extended", sysId: NvSystemIds, id: NvItemsIds, table: BuiltTable<R>): Promise<void>;
    /**
     * Internal function to prevent occasional ZNP request failures.
     *
     * *Some timeouts were present when working with SimpleLink Z-Stack 3.x.0+.*
     *
     * @param fn Function to retry.
     * @param retries Maximum number of retries.
     */
    private retry;
    /**
     * Internal function used by NV manipulation methods to check for correct driver initialization.
     */
    private checkMemoryAlignmentSetup;
}
//# sourceMappingURL=adapter-nv-memory.d.ts.map