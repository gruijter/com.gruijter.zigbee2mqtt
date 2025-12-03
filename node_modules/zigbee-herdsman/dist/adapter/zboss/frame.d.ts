import type { KeyValue } from "../../controller/tstype";
import type { DataType } from "../../zspec/zcl";
import { BuffaloZcl } from "../../zspec/zcl/buffaloZcl";
import type { BuffaloZclDataType } from "../../zspec/zcl/definition/enums";
import type { BuffaloZclOptions } from "../../zspec/zcl/definition/tstype";
import { ClusterId as ZdoClusterId } from "../../zspec/zdo";
import type { GenericZdoResponse } from "../../zspec/zdo/definition/tstypes";
import { type ParamsDesc } from "./commands";
import { BuffaloZBOSSDataType, type CommandId } from "./enums";
export declare class ZBOSSBuffaloZcl extends BuffaloZcl {
    write(type: DataType | BuffaloZclDataType | BuffaloZBOSSDataType, value: any, options: BuffaloZclOptions): void;
    read(type: DataType | BuffaloZclDataType | BuffaloZBOSSDataType, options: BuffaloZclOptions): any;
    writeByDesc(payload: KeyValue, params: ParamsDesc[]): number;
    readByDesc(params: ParamsDesc[]): KeyValue;
}
export declare function readZBOSSFrame(buffer: Buffer): ZBOSSFrame;
export declare function writeZBOSSFrame(frame: ZBOSSFrame): Buffer;
export declare enum FrameType {
    REQUEST = 0,
    RESPONSE = 1,
    INDICATION = 2
}
export interface ZBOSSFrame {
    version: number;
    type: FrameType;
    commandId: CommandId;
    tsn: number;
    payload: KeyValue & {
        zdoCluster?: ZdoClusterId;
        zdo?: GenericZdoResponse;
    };
}
export declare function makeFrame(type: FrameType, commandId: CommandId, params: KeyValue): ZBOSSFrame;
//# sourceMappingURL=frame.d.ts.map