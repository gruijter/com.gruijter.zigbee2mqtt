"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Struct = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
/**
 * Struct provides a builder-like interface to create Buffer-based memory
 * structures for read/write interfacing with data structures from adapters.
 */
class Struct {
    /**
     * Creates an empty struct. Further calls to `member()` and `method()` functions will form the structure.
     * Finally call to `build()` will type the resulting structure appropriately without internal functions.
     */
    static new() {
        return new Struct();
    }
    // @ts-expect-error initialized in `build()`
    buffer;
    defaultData;
    members = [];
    childStructs = {};
    length = 0;
    paddingByte = 0x00;
    constructor() { }
    /**
     * Returns raw contents of the structure as a sliced Buffer.
     * Mutations to the returned buffer will not be reflected within struct.
     */
    serialize(alignment = "unaligned", padLength = true, parentOffset = 0) {
        switch (alignment) {
            case "unaligned": {
                /* update child struct values and return as-is (unaligned) */
                for (const key of Object.keys(this.childStructs)) {
                    const child = this.childStructs[key];
                    this.buffer.set(child.struct.serialize(alignment), child.offset);
                }
                return Buffer.from(this.buffer);
            }
            case "aligned": {
                /* create 16-bit aligned buffer */
                const aligned = Buffer.alloc(this.getLength(alignment, padLength, parentOffset), this.paddingByte);
                let offset = 0;
                for (const member of this.members) {
                    switch (member.type) {
                        case "uint8":
                            aligned.set(this.buffer.slice(member.offset, member.offset + 1), offset);
                            offset += 1;
                            break;
                        case "uint16":
                            offset += offset % 2;
                            aligned.set(this.buffer.slice(member.offset, member.offset + 2), offset);
                            offset += 2;
                            break;
                        case "uint32":
                            offset += offset % 2;
                            aligned.set(this.buffer.slice(member.offset, member.offset + 4), offset);
                            offset += 4;
                            break;
                        case "uint8array":
                        case "uint8array-reversed":
                            (0, node_assert_1.default)(member.length !== undefined);
                            aligned.set(this.buffer.slice(member.offset, member.offset + member.length), offset);
                            offset += member.length;
                            break;
                        case "struct": {
                            const structData = this.childStructs[member.key].struct.serialize(alignment, false, offset);
                            aligned.set(structData, offset);
                            offset += structData.length;
                            break;
                        }
                    }
                }
                return aligned;
            }
        }
    }
    /**
     * Returns total length of the struct. Struct length is always fixed and configured
     * by calls to `member()` methods.
     */
    getLength(alignment = "unaligned", padLength = true, parentOffset = 0) {
        switch (alignment) {
            case "unaligned": {
                /* return actual length */
                return this.length;
            }
            case "aligned": {
                /* compute aligned length and return */
                let length = this.members.reduce((offset, member) => {
                    switch (member.type) {
                        case "uint8":
                            offset += 1;
                            break;
                        case "uint16":
                            offset += ((parentOffset + offset) % 2) + 2;
                            break;
                        case "uint32":
                            offset += ((parentOffset + offset) % 2) + 4;
                            break;
                        case "uint8array":
                        case "uint8array-reversed":
                            (0, node_assert_1.default)(member.length !== undefined);
                            offset += member.length;
                            break;
                        case "struct":
                            offset += this.childStructs[member.key].struct.getLength(alignment, false);
                            break;
                    }
                    return offset;
                }, 0);
                if (padLength) {
                    length += length % 2;
                }
                return length;
            }
        }
    }
    /**
     * Returns structure contents in JS object format.
     */
    toJSON() {
        return this.members.reduce((a, c) => {
            // biome-ignore lint/suspicious/noExplicitAny: API
            a[c.key] = this[c.key];
            return a;
            // biome-ignore lint/suspicious/noExplicitAny: API
        }, {});
    }
    member(type, name, lengthOrStructFactory) {
        const offset = this.length;
        const structFactory = type === "struct" ? lengthOrStructFactory : undefined;
        const length = structFactory ? structFactory().length : lengthOrStructFactory;
        switch (type) {
            case "uint8": {
                Object.defineProperty(this, name, {
                    enumerable: true,
                    get: () => this.buffer.readUInt8(offset),
                    set: (value) => this.buffer.writeUInt8(value, offset),
                });
                this.length += 1;
                break;
            }
            case "uint16": {
                Object.defineProperty(this, name, {
                    enumerable: true,
                    get: () => this.buffer.readUInt16LE(offset),
                    set: (value) => this.buffer.writeUInt16LE(value, offset),
                });
                this.length += 2;
                break;
            }
            case "uint32": {
                Object.defineProperty(this, name, {
                    enumerable: true,
                    get: () => this.buffer.readUInt32LE(offset),
                    set: (value) => this.buffer.writeUInt32LE(value, offset),
                });
                this.length += 4;
                break;
            }
            case "uint8array":
            case "uint8array-reversed": {
                /* v8 ignore start */
                if (!length) {
                    throw new Error("Struct builder requires length for `uint8array` and `uint8array-reversed` type");
                }
                /* v8 ignore stop */
                Object.defineProperty(this, name, {
                    enumerable: true,
                    get: () => type === "uint8array-reversed"
                        ? Buffer.from(this.buffer.slice(offset, offset + length)).reverse()
                        : Buffer.from(this.buffer.slice(offset, offset + length)),
                    set: (value) => {
                        if (value.length !== length) {
                            throw new Error(`Invalid length for member ${name} (expected=${length}, got=${value.length})`);
                        }
                        if (type === "uint8array-reversed") {
                            value = Buffer.from(value).reverse();
                        }
                        for (let i = 0; i < length; i++) {
                            this.buffer[offset + i] = value[i];
                        }
                    },
                });
                this.length += length;
                break;
            }
            case "struct": {
                (0, node_assert_1.default)(structFactory);
                this.childStructs[name] = { offset, struct: structFactory() };
                Object.defineProperty(this, name, {
                    enumerable: true,
                    get: () => this.childStructs[name].struct,
                });
                this.length += length;
            }
        }
        this.members.push({ key: name, offset, type, length });
        return this;
    }
    /**
     * Adds a custom method to the struct.
     *
     * *This method is stripped from type on struct `build()`.*
     *
     * @param name Name of the method to be appended.
     * @param _returnType Return type (eg. `Buffer.prototype`).
     * @param body Function implementation. Takes struct as a first and single input parameter.
     */
    method(name, _returnType, body) {
        Object.defineProperty(this, name, {
            enumerable: true,
            configurable: false,
            writable: false,
            // @ts-expect-error ignore because we are using `this`
            value: () => body.bind(this)(this),
        });
        return this;
    }
    /**
     * Sets default data to initialize empty struct with.
     *
     * @param data Data to initialize empty struct with.
     */
    default(data) {
        /* v8 ignore start */
        if (data.length !== this.length) {
            throw new Error("Default value needs to have the length of unaligned structure.");
        }
        /* v8 ignore stop */
        this.defaultData = Buffer.from(data);
        return this;
    }
    /**
     * Sets byte to use for padding.
     *
     * @param padding Byte to use for padding
     */
    padding(padding = 0x00) {
        this.paddingByte = padding;
        return this;
    }
    /**
     * Creates the struct and optionally fills it with data. If data is provided, the length
     * of the provided buffer needs to match the structure length.
     *
     * *This method is stripped from type on struct `build()`.*
     */
    build(data) {
        if (data) {
            if (data.length === this.getLength("unaligned")) {
                this.buffer = Buffer.from(data);
                for (const key of Object.keys(this.childStructs)) {
                    const child = this.childStructs[key];
                    child.struct.build(this.buffer.slice(child.offset, child.offset + child.struct.length));
                }
            }
            else if (data.length === this.getLength("aligned")) {
                this.buffer = Buffer.alloc(this.length, this.paddingByte);
                let offset = 0;
                for (const member of this.members) {
                    switch (member.type) {
                        case "uint8":
                            this.buffer.set(data.slice(offset, offset + 1), member.offset);
                            offset += 1;
                            break;
                        case "uint16":
                            offset += offset % 2;
                            this.buffer.set(data.slice(offset, offset + 2), member.offset);
                            offset += 2;
                            break;
                        case "uint32":
                            offset += offset % 2;
                            this.buffer.set(data.slice(offset, offset + 4), member.offset);
                            offset += 4;
                            break;
                        case "uint8array":
                        case "uint8array-reversed":
                            (0, node_assert_1.default)(member.length !== undefined);
                            this.buffer.set(data.slice(offset, offset + member.length), member.offset);
                            offset += member.length;
                            break;
                        case "struct": {
                            const child = this.childStructs[member.key];
                            child.struct.build(data.slice(offset, offset + child.struct.length));
                            this.buffer.set(child.struct.serialize(), member.offset);
                            offset += child.struct.length;
                            break;
                        }
                    }
                }
            }
            else {
                const expectedLengths = `${this.getLength("unaligned")}/${this.getLength("aligned")}`;
                throw new Error(`Struct length mismatch (expected=${expectedLengths}, got=${data.length})`);
            }
        }
        else {
            this.buffer = this.defaultData ? Buffer.from(this.defaultData) : Buffer.alloc(this.length);
        }
        return this;
    }
}
exports.Struct = Struct;
//# sourceMappingURL=struct.js.map