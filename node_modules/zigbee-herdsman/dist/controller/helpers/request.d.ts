import type * as Zcl from "../../zspec/zcl";
import type { SendPolicy } from "../tstype";
export declare class Request<Type = any> {
    static defaultSendPolicy: {
        [key: number]: SendPolicy;
    };
    private func;
    frame: Zcl.Frame;
    expires: number;
    sendPolicy: SendPolicy | undefined;
    private resolveQueue;
    private rejectQueue;
    private lastError;
    constructor(func: () => Promise<Type>, frame: Zcl.Frame, timeout: number, sendPolicy?: SendPolicy, lastError?: Error, resolve?: (value: Type) => void, reject?: (error: Error) => void);
    moveCallbacks(from: Request<Type>): void;
    addCallbacks(resolve: (value: Type) => void, reject: (error: Error) => void): void;
    reject(error?: Error): void;
    resolve(value: Type): void;
    send(): Promise<Type>;
}
export default Request;
//# sourceMappingURL=request.d.ts.map