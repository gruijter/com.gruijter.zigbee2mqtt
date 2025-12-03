import events from "node:events";
import { ClusterId as ZdoClusterId } from "../../../zspec/zdo";
import * as Constants from "../constants";
import { Subsystem, Type } from "../unpi/constants";
import type { ZpiObjectPayload } from "./tstype";
import { ZpiObject } from "./zpiObject";
export declare class Znp extends events.EventEmitter {
    private path;
    private baudRate;
    private rtscts;
    private serialPort?;
    private socketPort?;
    private unpiWriter;
    private unpiParser;
    private initialized;
    private queue;
    private waitress;
    constructor(path: string, baudRate: number, rtscts: boolean);
    private onUnpiParsed;
    isInitialized(): boolean;
    private onPortError;
    private onPortClose;
    open(): Promise<void>;
    private openSerialPort;
    private openSocketPort;
    private skipBootloader;
    close(): Promise<void>;
    requestWithReply(subsystem: Subsystem, command: string, payload: ZpiObjectPayload, waiterID?: number, timeout?: number, expectedStatuses?: Constants.COMMON.ZnpCommandStatus[]): Promise<ZpiObject>;
    request(subsystem: Subsystem, command: string, payload: ZpiObjectPayload, waiterID?: number, timeout?: number, expectedStatuses?: Constants.COMMON.ZnpCommandStatus[]): Promise<ZpiObject | undefined>;
    requestZdo(clusterId: ZdoClusterId, payload: Buffer, waiterID?: number): Promise<void>;
    private waitressTimeoutFormatter;
    waitFor(type: Type, subsystem: Subsystem, command: string, target: number | string | undefined, transid: number | undefined, state: number | undefined, timeout?: number): {
        start: () => {
            promise: Promise<ZpiObject>;
            ID: number;
        };
        ID: number;
    };
    private waitressValidator;
}
//# sourceMappingURL=znp.d.ts.map