import "../../utils/patchBigIntSerialization";
import { Direction, FrameType } from "./definition/enums";
import type { FoundationCommandName } from "./definition/foundation";
import type { Cluster, ClusterName, Command, CustomClusters, ParameterDefinition } from "./definition/tstype";
import { ZclHeader } from "./zclHeader";
type ZclPayload = any;
export declare class ZclFrame {
    readonly header: ZclHeader;
    readonly payload: ZclPayload;
    readonly cluster: Cluster;
    readonly command: Command;
    private constructor();
    toString(): string;
    /**
     * Creating
     */
    static create(frameType: FrameType, direction: Direction, disableDefaultResponse: boolean, manufacturerCode: number | undefined, transactionSequenceNumber: number, commandKey: number | string | Command, clusterKey: number | string | Cluster, payload: ZclPayload, customClusters: CustomClusters, reservedBits?: number): ZclFrame;
    toBuffer(): Buffer;
    private writePayloadGlobal;
    private writePayloadCluster;
    /**
     * Parsing
     */
    static fromBuffer(clusterID: number, header: ZclHeader | undefined, buffer: Buffer, customClusters: CustomClusters): ZclFrame;
    private static parsePayload;
    private static parsePayloadCluster;
    private static parsePayloadGlobal;
    /**
     * Utils
     */
    static conditionsValid(parameter: ParameterDefinition, entry: ZclPayload, remainingBufferBytes: number | undefined): boolean;
    isCluster(clusterName: FoundationCommandName | ClusterName): boolean;
    isCommand(commandName: FoundationCommandName | "remove" | "add" | "write" | "enrollReq" | "checkin" | "getAlarm" | "arm"): boolean;
}
export {};
//# sourceMappingURL=zclFrame.d.ts.map