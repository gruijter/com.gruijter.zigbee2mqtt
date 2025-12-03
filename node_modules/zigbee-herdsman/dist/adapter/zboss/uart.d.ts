import EventEmitter from "node:events";
import type { SerialPortOptions } from "../tstype";
import { type ZBOSSFrame } from "./frame";
export declare class ZBOSSUart extends EventEmitter {
    private readonly portOptions;
    private serialPort?;
    private socketPort?;
    private writer;
    private reader;
    private closing;
    private sendSeq;
    private recvSeq;
    private ackSeq;
    private waitress;
    private queue;
    inReset: boolean;
    constructor(options: SerialPortOptions);
    resetNcp(): Promise<boolean>;
    get portOpen(): boolean | undefined;
    start(): Promise<boolean>;
    stop(): Promise<void>;
    private openPort;
    closePort(): Promise<void>;
    private onPortClose;
    private onPortError;
    private onPackage;
    sendBuffer(buf: Buffer): Promise<void>;
    sendFrame(frame: ZBOSSFrame): Promise<void>;
    private sendDATA;
    private handleACK;
    private sendACK;
    private writeBuffer;
    private makePack;
    private waitFor;
    private waitressTimeoutFormatter;
    private waitressValidator;
}
//# sourceMappingURL=uart.d.ts.map