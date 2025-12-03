import { BuffaloZclDataType, DataType } from "../../zspec/zcl/definition/enums";
import { ClusterId as ZdoClusterId } from "../../zspec/zdo";
import { BuffaloZBOSSDataType, CommandId } from "./enums";
export interface ParamsDesc {
    name: string;
    type: DataType | BuffaloZclDataType | BuffaloZBOSSDataType;
    condition?: (payload: any, buffalo: any) => boolean;
    typed?: any;
    options?: (payload: any, options: any) => void;
}
interface ZBOSSFrameDesc {
    request: ParamsDesc[];
    response: ParamsDesc[];
    indication?: ParamsDesc[];
}
export declare const ZDO_REQ_CLUSTER_ID_TO_ZBOSS_COMMAND_ID: Readonly<Partial<Record<ZdoClusterId, CommandId>>>;
export declare const ZBOSS_COMMAND_ID_TO_ZDO_RSP_CLUSTER_ID: Readonly<Partial<Record<CommandId, ZdoClusterId>>>;
export declare const FRAMES: Partial<Record<CommandId, ZBOSSFrameDesc>>;
export {};
//# sourceMappingURL=commands.d.ts.map