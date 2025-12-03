import { DataType, DataTypeClass } from "./definition/enums";
import { type FoundationDefinition } from "./definition/foundation";
import type { Cluster, ClusterName, Command, CustomClusters } from "./definition/tstype";
export declare function getDataTypeClass(dataType: DataType): DataTypeClass;
export declare function getCluster(key: string | number, manufacturerCode?: number | undefined, customClusters?: CustomClusters): Cluster;
export declare function getGlobalCommand(key: number | string): Command;
export declare function isClusterName(name: string): name is ClusterName;
export declare function getFoundationCommand(id: number): FoundationDefinition;
export declare function isFoundationDiscoverRsp(id: number): boolean;
//# sourceMappingURL=utils.d.ts.map