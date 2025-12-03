import type { Header as ZclHeader } from "../zspec/zcl";
export type DeviceJoinedPayload = {
    networkAddress: number;
    ieeeAddr: string;
};
export type DeviceLeavePayload = {
    networkAddress?: number;
    ieeeAddr: string;
} | {
    networkAddress: number;
    ieeeAddr?: string;
};
export interface ZclPayload {
    clusterID: number;
    address: number | string;
    header: ZclHeader | undefined;
    data: Buffer;
    endpoint: number;
    linkquality: number;
    groupID: number;
    wasBroadcast: boolean;
    destinationEndpoint: number;
}
//# sourceMappingURL=events.d.ts.map