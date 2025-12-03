import { EventEmitter } from "node:events";
import type { GenericZdoResponse } from "../../../zspec/zdo/definition/tstypes";
import type * as TsType from "./../../tstype";
import { EZSPAdapterBackup } from "../adapter/backup";
import type { ParamsDesc } from "./commands";
import { type EZSPFrameData, Ezsp } from "./ezsp";
import { EmberKeyData } from "./types";
import { EmberEUI64, EmberKeyType } from "./types/named";
import { EmberApsFrame, EmberIeeeRawFrame, EmberNetworkParameters, EmberRawFrame } from "./types/struct";
interface AddEndpointParameters {
    endpoint?: number;
    profileId?: number;
    deviceId?: number;
    appFlags?: number;
    inputClusters?: number[];
    outputClusters?: number[];
}
export interface EmberIncomingMessage {
    messageType: number;
    apsFrame: EmberApsFrame;
    lqi: number;
    rssi: number;
    sender: number;
    bindingIndex: number;
    addressIndex: number;
    message: Buffer;
    senderEui64: EmberEUI64;
    zdoResponse?: GenericZdoResponse;
}
export declare class Driver extends EventEmitter {
    ezsp: Ezsp;
    private nwkOpt;
    networkParams: EmberNetworkParameters;
    version: {
        product: number;
        majorrel: string;
        minorrel: string;
        maintrel: string;
        revision: string;
    };
    private eui64ToNodeId;
    ieee: EmberEUI64;
    private multicast;
    private waitress;
    private transactionID;
    private serialOpt;
    backupMan: EZSPAdapterBackup;
    constructor(serialOpt: TsType.SerialPortOptions, nwkOpt: TsType.NetworkOptions, backupPath: string);
    /**
     * Requested by the EZSP watchdog after too many failures, or by UART layer after port closed unexpectedly.
     * Tries to stop the layers below and startup again.
     * @returns
     */
    reset(): Promise<void>;
    private onEzspReset;
    private onEzspClose;
    stop(emitClose?: boolean): Promise<void>;
    startup(transmitPower?: number): Promise<TsType.StartResult>;
    private needsToBeInitialised;
    private formNetwork;
    private handleFrame;
    private handleRouteRecord;
    private handleRouteError;
    private handleNetworkStatus;
    private handleNodeLeft;
    private resetMfgId;
    handleNodeJoined(nwk: number, ieee: EmberEUI64 | number[]): void;
    setNode(nwk: number, ieee: EmberEUI64 | number[]): void;
    request(nwk: number | EmberEUI64, apsFrame: EmberApsFrame, data: Buffer, extendedTimeout?: boolean): Promise<boolean>;
    mrequest(apsFrame: EmberApsFrame, data: Buffer, _timeout?: number): Promise<boolean>;
    rawrequest(rawFrame: EmberRawFrame, data: Buffer, _timeout?: number): Promise<boolean>;
    ieeerawrequest(rawFrame: EmberIeeeRawFrame, data: Buffer, _timeout?: number): Promise<boolean>;
    brequest(destination: number, apsFrame: EmberApsFrame, data: Buffer): Promise<boolean>;
    private nextTransactionID;
    makeApsFrame(clusterId: number, disableResponse: boolean): EmberApsFrame;
    makeEmberRawFrame(): EmberRawFrame;
    makeEmberIeeeRawFrame(): EmberIeeeRawFrame;
    networkIdToEUI64(nwk: number): Promise<EmberEUI64>;
    preJoining(seconds: number): Promise<void>;
    permitJoining(seconds: number): Promise<EZSPFrameData>;
    makeZDOframe(name: string | number, params: ParamsDesc): Buffer;
    addEndpoint({ endpoint, profileId, deviceId, appFlags, inputClusters, outputClusters, }: AddEndpointParameters): Promise<void>;
    waitFor(address: number | string, clusterId: number, sequence: number, timeout?: number): ReturnType<typeof this.waitress.waitFor> & {
        cancel: () => void;
    };
    private waitressTimeoutFormatter;
    private waitressValidator;
    setChannel(channel: number): Promise<EZSPFrameData>;
    addTransientLinkKey(partner: EmberEUI64, transientKey: EmberKeyData): Promise<EZSPFrameData>;
    addInstallCode(ieeeAddress: string, key: Buffer, hashed: boolean): Promise<void>;
    getKey(keyType: EmberKeyType): Promise<EZSPFrameData>;
    getNetworkKeyInfo(): Promise<EZSPFrameData>;
    private needsToBeRestore;
}
export {};
//# sourceMappingURL=driver.d.ts.map