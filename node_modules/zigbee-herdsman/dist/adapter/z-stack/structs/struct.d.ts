import type { SerializableMemoryObject } from "./serializable-memory-object";
type StructBuildOmitKeys = "member" | "method" | "padding" | "build" | "default";
export type BuiltStruct<T = Struct> = Omit<T, StructBuildOmitKeys>;
export type StructFactorySignature<T = Struct> = (data?: Buffer) => T;
export type StructMemoryAlignment = "unaligned" | "aligned";
/**
 * Struct provides a builder-like interface to create Buffer-based memory
 * structures for read/write interfacing with data structures from adapters.
 */
export declare class Struct implements SerializableMemoryObject {
    /**
     * Creates an empty struct. Further calls to `member()` and `method()` functions will form the structure.
     * Finally call to `build()` will type the resulting structure appropriately without internal functions.
     */
    static new(): Struct;
    private buffer;
    private defaultData;
    private members;
    private childStructs;
    private length;
    private paddingByte;
    private constructor();
    /**
     * Returns raw contents of the structure as a sliced Buffer.
     * Mutations to the returned buffer will not be reflected within struct.
     */
    serialize(alignment?: StructMemoryAlignment, padLength?: boolean, parentOffset?: number): Buffer;
    /**
     * Returns total length of the struct. Struct length is always fixed and configured
     * by calls to `member()` methods.
     */
    getLength(alignment?: StructMemoryAlignment, padLength?: boolean, parentOffset?: number): number;
    /**
     * Returns structure contents in JS object format.
     */
    toJSON(): any;
    /**
     * Adds a numeric member of `uint8`, `uint16` or `uint32` type.
     * Internal representation is always little endian.
     *
     * *This method is stripped from type on struct `build()`.*
     *
     * @param type Underlying data type (uint8, uint16 or uint32).
     * @param name Name of the struct member.
     */
    member<T extends number, N extends string, R extends this & Record<N, T>>(type: "uint8" | "uint16" | "uint32", name: N): R;
    /**
     * Adds an uint8 array (byte array) as a struct member.
     *
     * *This method is stripped from type on struct `build()`.*
     *
     * @param type Underlying data type. Must be `uint8array`.
     * @param name Name of the struct member.
     * @param length Length of the byte array.
     */
    member<T extends Buffer, N extends string, R extends this & Record<N, T>>(type: "uint8array" | "uint8array-reversed", name: N, length: number): R;
    /**
     * Adds another struct type as a struct member. Struct factory is provided
     * as a child struct definition source.
     *
     * *This method is stripped from type on struct `build()`.*
     *
     * @param type Underlying data type. Must be `struct`.
     * @param name Name of the struct member.
     * @param structFactory Factory providing the wanted child struct.
     */
    member<T extends BuiltStruct, N extends string, R extends this & Record<N, T>>(type: "struct", name: N, structFactory: StructFactorySignature<T>): R;
    /**
     * Adds a custom method to the struct.
     *
     * *This method is stripped from type on struct `build()`.*
     *
     * @param name Name of the method to be appended.
     * @param _returnType Return type (eg. `Buffer.prototype`).
     * @param body Function implementation. Takes struct as a first and single input parameter.
     */
    method<T, N extends string, R extends this & Record<N, () => T>>(name: N, _returnType: T, body: (struct: R) => T): R;
    /**
     * Sets default data to initialize empty struct with.
     *
     * @param data Data to initialize empty struct with.
     */
    default(data: Buffer): this;
    /**
     * Sets byte to use for padding.
     *
     * @param padding Byte to use for padding
     */
    padding(padding?: number): this;
    /**
     * Creates the struct and optionally fills it with data. If data is provided, the length
     * of the provided buffer needs to match the structure length.
     *
     * *This method is stripped from type on struct `build()`.*
     */
    build(data?: Buffer): BuiltStruct<this>;
}
export {};
//# sourceMappingURL=struct.d.ts.map