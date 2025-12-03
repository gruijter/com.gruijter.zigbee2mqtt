import type { ClusterOrRawAttributeKeys, ClusterOrRawAttributes, ClusterOrRawPayload, KeyValue, PartialClusterOrRawWriteAttributes, TCustomCluster } from "../tstype";
import Entity from "./entity";
export declare abstract class ZigbeeEntity extends Entity {
    abstract read<Cl extends number | string, Custom extends TCustomCluster | undefined = undefined>(clusterKey: Cl, attributes: ClusterOrRawAttributeKeys<Cl, Custom>, options?: KeyValue): Promise<ClusterOrRawAttributes<Cl, Custom> | undefined>;
    abstract write<Cl extends number | string, Custom extends TCustomCluster | undefined = undefined>(clusterKey: Cl, attributes: PartialClusterOrRawWriteAttributes<Cl, Custom>, options?: KeyValue): Promise<void>;
    abstract command<Cl extends number | string, Co extends number | string, Custom extends TCustomCluster | undefined = undefined>(clusterKey: Cl, commandKey: Co, payload: ClusterOrRawPayload<Cl, Co, Custom>, options?: KeyValue): Promise<undefined | KeyValue>;
}
//# sourceMappingURL=zigbeeEntity.d.ts.map