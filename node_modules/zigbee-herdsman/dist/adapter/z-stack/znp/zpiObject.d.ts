import { Frame as UnpiFrame } from "../unpi";
import { Subsystem, Type } from "../unpi/constants";
import type { MtCmd, ZpiObjectPayload } from "./tstype";
type ZpiObjectType = "Request" | "Response";
export declare class ZpiObject<T extends ZpiObjectType = "Response"> {
    readonly type: Type;
    readonly subsystem: Subsystem;
    readonly command: MtCmd;
    readonly payload: ZpiObjectPayload;
    readonly unpiFrame: T extends "Request" ? UnpiFrame : undefined;
    private constructor();
    static createRequest(subsystem: Subsystem, command: string, payload: ZpiObjectPayload): ZpiObject<"Request">;
    static fromUnpiFrame(frame: UnpiFrame): ZpiObject<"Response">;
    private static readParameters;
    isResetCommand(): boolean;
    toString(includePayload?: boolean): string;
}
export {};
//# sourceMappingURL=zpiObject.d.ts.map