import * as Zcl from "../../zspec/zcl";
import type { CustomClusters } from "../../zspec/zcl/definition/tstype";
import type { ClusterOrRawAttributeKeys, ClusterOrRawPayload, KeyValue, PartialClusterOrRawWriteAttributes, TCustomCluster } from "../tstype";
import type Endpoint from "./endpoint";
import { ZigbeeEntity } from "./zigbeeEntity";
interface Options {
    manufacturerCode?: number;
    direction?: Zcl.Direction;
    srcEndpoint?: number;
    reservedBits?: number;
    transactionSequenceNumber?: number;
}
export declare class Group extends ZigbeeEntity {
    #private;
    private databaseID;
    readonly groupID: number;
    private readonly _members;
    readonly meta: KeyValue;
    private static readonly groups;
    private static loadedFromDatabase;
    /** Member endpoints with valid devices (not unknown/deleted) */
    get members(): Endpoint[];
    /** List of server / client custom clusters common to all devices in the group */
    get customClusters(): [input: CustomClusters, output: CustomClusters];
    private constructor();
    /**
     * Reset runtime lookups.
     */
    static resetCache(): void;
    private static fromDatabaseEntry;
    private toDatabaseRecord;
    private static loadFromDatabaseIfNecessary;
    static byGroupID(groupID: number): Group | undefined;
    /**
     * @deprecated use allIterator()
     */
    static all(): Group[];
    static allIterator(predicate?: (value: Group) => boolean): Generator<Group>;
    static create(groupID: number): Group;
    removeFromNetwork(): Promise<void>;
    removeFromDatabase(): void;
    save(writeDatabase?: boolean): void;
    addMember(endpoint: Endpoint): void;
    removeMember(endpoint: Endpoint): void;
    hasMember(endpoint: Endpoint): boolean;
    write<Cl extends number | string, Custom extends TCustomCluster | undefined = undefined>(clusterKey: Cl, attributes: PartialClusterOrRawWriteAttributes<Cl, Custom>, options?: Options): Promise<void>;
    read<Cl extends number | string, Custom extends TCustomCluster | undefined = undefined>(clusterKey: Cl, attributes: ClusterOrRawAttributeKeys<Cl, Custom>, options?: Options): Promise<undefined>;
    command<Cl extends number | string, Co extends number | string, Custom extends TCustomCluster | undefined = undefined>(clusterKey: Cl, commandKey: Co, payload: ClusterOrRawPayload<Cl, Co, Custom>, options?: Options): Promise<undefined>;
    private getOptionsWithDefaults;
}
export default Group;
//# sourceMappingURL=group.d.ts.map