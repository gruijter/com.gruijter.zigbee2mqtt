import type { Zh } from "./types";
export declare function hasValue(entity: Zh.Endpoint | Zh.Group | Zh.Device | string, key: string): boolean;
export declare function getValue(entity: Zh.Endpoint | Zh.Group | Zh.Device | string, key: string, fallback?: unknown): any;
export declare function putValue(entity: Zh.Endpoint | Zh.Group | Zh.Device | string, key: string, value: unknown & {}): void;
export declare function clearValue(entity: Zh.Endpoint | Zh.Group | Zh.Device | string, key: string): void;
export declare function clear(): void;
//# sourceMappingURL=store.d.ts.map