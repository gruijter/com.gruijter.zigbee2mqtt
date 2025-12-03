import EventEmitter from "node:events";
import type { KeyValue } from "../../controller/tstype";
import type * as ZSpec from "../../zspec";
import * as Zdo from "../../zspec/zdo";
import type { TsType } from "..";
import { DeviceType } from "./enums";
import { type ZBOSSFrame } from "./frame";
import { ZBOSSUart } from "./uart";
type ZBOSSNetworkInfo = {
    joined: boolean;
    nodeType: DeviceType;
    ieeeAddr: string;
    network: {
        panID: number;
        extendedPanID: number[];
        channel: number;
    };
};
export declare class ZBOSSDriver extends EventEmitter {
    readonly port: ZBOSSUart;
    private waitress;
    private queue;
    private tsn;
    private nwkOpt;
    netInfo: ZBOSSNetworkInfo;
    constructor(options: TsType.SerialPortOptions, nwkOpt: TsType.NetworkOptions);
    connect(): Promise<boolean>;
    private reset;
    startup(transmitPower?: number): Promise<TsType.StartResult>;
    private needsToBeInitialised;
    private getNetworkInfo;
    private addEndpoint;
    private getChannelMask;
    private formNetwork;
    stop(): Promise<void>;
    private onFrame;
    isInitialized(): boolean | undefined;
    execCommand(commandId: number, params?: KeyValue, timeout?: number): Promise<ZBOSSFrame>;
    waitFor(commandId: number, tsn: number | undefined, timeout?: number): {
        start: () => {
            promise: Promise<ZBOSSFrame>;
            ID: number;
        };
        ID: number;
    };
    private waitressTimeoutFormatter;
    private waitressValidator;
    request(ieee: string, profileID: number, clusterID: number, dstEp: number, srcEp: number, data: Buffer): Promise<ZBOSSFrame>;
    brequest(addr: ZSpec.BroadcastAddress, profileID: number, clusterID: number, dstEp: number, srcEp: number, data: Buffer): Promise<ZBOSSFrame>;
    grequest(group: number, profileID: number, clusterID: number, srcEp: number, data: Buffer): Promise<ZBOSSFrame>;
    requestZdo(clusterId: Zdo.ClusterId, payload: Buffer, disableResponse: boolean): Promise<ZBOSSFrame | undefined>;
    ieeeByNwk(nwk: number): Promise<string>;
}
export {};
//# sourceMappingURL=driver.d.ts.map