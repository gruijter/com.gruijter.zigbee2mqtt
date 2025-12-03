import { type Controller } from "zigbee-herdsman";
/** biome-ignore-start lint/style/useNamingConvention: MQTT convention */
export interface MqttRawPayload {
    ieee_address?: string;
    network_address?: number;
    group_id?: number;
    dst_endpoint?: number;
    /** defaults to `ZSpec.HA_ENDPOINT` */
    src_endpoint?: number;
    /** defaults to false */
    interpan?: boolean;
    /** defaults to `ZSpec.HA_PROFILE_ID` */
    profile_id?: number;
    /** Expected as `number` for ZDO */
    cluster_key?: number | string;
    /** Only used for ZDO */
    zdo_params?: unknown[];
    /** Only used for ZCL */
    zcl?: {
        frame_type?: number;
        direction?: number;
        disable_default_response?: boolean;
        manufacturer_code?: number;
        tsn?: number;
        command_key: string;
        payload?: Record<string, unknown> | Record<string, unknown>[];
    };
    /** defaults to false */
    disable_response?: boolean;
    /** defaults to 10000 */
    timeout?: number;
}
/** biome-ignore-start lint/style/useNamingConvention: MQTT convention */
export declare const ACTIONS: Record<string, (controller: Controller, args: Record<string, unknown>) => ReturnType<typeof controller.sendRaw>>;
/** biome-ignore-end lint/style/useNamingConvention: MQTT convention */
//# sourceMappingURL=actions.d.ts.map