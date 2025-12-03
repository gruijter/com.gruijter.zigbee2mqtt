import { EventEmitter } from "node:events";
import type { SerialPortOptions } from "../../tstype";
import { type EZSPFrameDesc, type ParamsDesc } from "./commands";
import * as t from "./types";
import { type EmberOutgoingMessageType, EmberStatus, EzspPolicyId } from "./types/named";
import type { EmberApsFrame, EmberNetworkParameters } from "./types/struct";
type EZSPFrame = {
    sequence: number;
    frameId: number;
    frameName: string;
    payload: EZSPFrameData;
};
export declare class EZSPFrameData {
    _cls_: string;
    _id_: number;
    _isRequest_: boolean;
    [name: string]: any;
    static createFrame(ezspv: number, frameId: number, isRequest: boolean, params: ParamsDesc | Buffer): EZSPFrameData;
    static getFrame(name: string): EZSPFrameDesc;
    constructor(key: string, isRequest: boolean, params: ParamsDesc | Buffer | undefined);
    serialize(): Buffer;
    get name(): string;
    get id(): number;
}
export declare class EZSPZDORequestFrameData {
    _cls_: string;
    _id_: number;
    _isRequest_: boolean;
    [name: string]: any;
    static getFrame(key: string | number): EZSPFrameDesc;
    constructor(key: string | number, isRequest: boolean, params: ParamsDesc | Buffer);
    serialize(): Buffer;
    get name(): string;
    get id(): number;
}
export declare class EZSPZDOResponseFrameData {
    _cls_: string;
    _id_: number;
    [name: string]: any;
    static getFrame(key: string | number): ParamsDesc;
    constructor(key: string | number, params: ParamsDesc | Buffer);
    serialize(): Buffer;
    get name(): string;
    get id(): number;
}
export declare class Ezsp extends EventEmitter {
    ezspV: number;
    cmdSeq: number;
    private serialDriver;
    private waitress;
    private queue;
    private watchdogTimer?;
    private failures;
    private inResetingProcess;
    constructor();
    connect(options: SerialPortOptions): Promise<void>;
    isInitialized(): boolean;
    private onSerialReset;
    private onSerialClose;
    close(emitClose: boolean): Promise<void>;
    /**
     * Handle a received EZSP frame
     *
     * The protocol has taken care of UART specific framing etc, so we should
     * just have EZSP application stuff here, with all escaping/stuffing and
     * data randomization removed.
     * @param data
     */
    private onFrameReceived;
    version(): Promise<number>;
    networkInit(): Promise<boolean>;
    leaveNetwork(): Promise<number>;
    setConfigurationValue(configId: number, value: number): Promise<void>;
    getConfigurationValue(configId: number): Promise<number>;
    getMulticastTableEntry(index: number): Promise<t.EmberMulticastTableEntry>;
    setMulticastTableEntry(index: number, entry: t.EmberMulticastTableEntry): Promise<EmberStatus>;
    setInitialSecurityState(entry: t.EmberInitialSecurityState): Promise<EmberStatus>;
    getCurrentSecurityState(): Promise<EZSPFrameData>;
    setValue(valueId: t.EzspValueId, value: number): Promise<EZSPFrameData>;
    getValue(valueId: t.EzspValueId): Promise<Buffer>;
    setPolicy(policyId: EzspPolicyId, value: number): Promise<EZSPFrameData>;
    updateConfig(): Promise<void>;
    updatePolicies(): Promise<void>;
    makeZDOframe(name: string | number, params: ParamsDesc): Buffer;
    private makeFrame;
    execCommand(name: string, params?: ParamsDesc): Promise<EZSPFrameData>;
    formNetwork(params: EmberNetworkParameters): Promise<number>;
    sendUnicast(direct: EmberOutgoingMessageType, nwk: number, apsFrame: EmberApsFrame, seq: number, data: Buffer): Promise<EZSPFrameData>;
    sendMulticast(apsFrame: EmberApsFrame, seq: number, data: Buffer): Promise<EZSPFrameData>;
    setSourceRouting(): Promise<void>;
    sendBroadcast(destination: number, apsFrame: EmberApsFrame, seq: number, data: Buffer): Promise<EZSPFrameData>;
    waitFor(frameId: string | number, sequence: number | null, timeout?: number): {
        start: () => {
            promise: Promise<EZSPFrame>;
            ID: number;
        };
        ID: number;
    };
    private waitressTimeoutFormatter;
    private waitressValidator;
    private watchdogHandler;
}
export {};
//# sourceMappingURL=ezsp.d.ts.map