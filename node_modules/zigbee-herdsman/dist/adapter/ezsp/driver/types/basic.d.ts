export declare class int_t {
    static _signed: boolean;
    static serialize(cls: any, value: number): Buffer;
    static deserialize(cls: any, data: Buffer): any[];
    static valueToName(cls: any, value: any): string;
    static valueName(cls: any, value: any): string;
}
export declare class int8s extends int_t {
    static _size: number;
}
export declare class int16s extends int_t {
    static _size: number;
}
export declare class int24s extends int_t {
    static _size: number;
}
export declare class int32s extends int_t {
    static _size: number;
}
export declare class int64s extends int_t {
    static _size: number;
}
export declare class uint_t extends int_t {
    static _signed: boolean;
}
export declare class uint8_t extends uint_t {
    static _size: number;
}
export declare class uint16_t extends uint_t {
    static _size: number;
}
export declare class uint24_t extends uint_t {
    static _size: number;
}
export declare class uint32_t extends uint_t {
    static _size: number;
}
export declare class uint64_t extends uint_t {
    static _size: number;
}
export declare class LVBytes {
    static serialize(_cls: any, value: any[]): Buffer;
    static deserialize(_cls: any, data: Buffer): any[];
}
export declare abstract class List {
    static serialize(cls: any, value: any[]): Buffer;
    static deserialize(cls: any, data: Buffer): any[];
}
export declare function list(itemtype: any): List;
export declare function LVList(itemtype: any): List;
export declare class WordList extends List {
    static serialize(_cls: any, value: any[]): Buffer;
}
export declare function fixed_list(length: number, itemtype: any): {
    new (): any;
    deserialize(cls: any, data: Buffer): any;
};
export declare class Bytes {
    static serialize(_cls: any, value: any[]): Buffer;
    static deserialize(_cls: any, data: Buffer): any[];
}
//# sourceMappingURL=basic.d.ts.map