import { EventEmitter } from "node:events";
import type { SerialPortOptions } from "../../tstype";
type EZSPPacket = {
    sequence: number;
};
export declare class SerialDriver extends EventEmitter {
    private serialPort?;
    private socketPort?;
    private writer;
    private parser;
    private initialized;
    private sendSeq;
    private recvSeq;
    private ackSeq;
    private rejectCondition;
    private waitress;
    private queue;
    constructor();
    connect(options: SerialPortOptions): Promise<void>;
    private openSerialPort;
    private openSocketPort;
    private onParsed;
    private handleDATA;
    private handleACK;
    private handleNAK;
    private handleRST;
    private handleRSTACK;
    private handleError;
    reset(): Promise<void>;
    close(emitClose: boolean): Promise<void>;
    private onPortError;
    private onPortClose;
    isInitialized(): boolean;
    sendDATA(data: Buffer): Promise<void>;
    waitFor(sequence: number, timeout?: number): {
        start: () => {
            promise: Promise<EZSPPacket>;
            ID: number;
        };
        ID: number;
    };
    private waitressTimeoutFormatter;
    private waitressValidator;
}
export {};
//# sourceMappingURL=uart.d.ts.map