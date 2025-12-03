import type { TsType } from "../../";
import type { StartupOptions } from "../models/startup-options";
import type { Znp } from "../znp";
import { AdapterBackup } from "./adapter-backup";
import { AdapterNvMemory } from "./adapter-nv-memory";
import type { ZStackAdapter } from "./zStackAdapter";
/**
 * ZNP Adapter Manager is responsible for handling adapter startup, network commissioning,
 * configuration backup and restore.
 */
export declare class ZnpAdapterManager {
    nv: AdapterNvMemory;
    backup: AdapterBackup;
    private znp;
    private adapter;
    private options;
    private nwkOptions;
    constructor(adapter: ZStackAdapter, znp: Znp, options: StartupOptions);
    /**
     * Performs ZNP adapter startup. After this method returns the adapter is configured, endpoints are registered
     * and network is ready to process frames.
     */
    start(): Promise<TsType.StartResult>;
    /**
     * Internal function to determine startup strategy. The strategy determination flow is described in
     * [this GitHub issue comment](https://github.com/Koenkk/zigbee-herdsman/issues/286#issuecomment-761029689).
     */
    private determineStrategy;
    /**
     * Internal method to perform regular adapter startup in coordinator mode.
     */
    private beginStartup;
    /**
     * Internal method to perform adapter restore.
     */
    private beginRestore;
    /**
     * Internal method to perform new network commissioning. Network commissioning creates a new Zigbee
     * network using the adapter.
     *
     * @param nwkOptions Options to configure the new network with.
     * @param failOnCollision Whether process should throw an error if PAN ID collision is detected.
     * @param writeConfiguredFlag Whether zigbee-herdsman `hasConfigured` flag should be written to NV.
     */
    private beginCommissioning;
    /**
     * Updates commissioning NV memory parameters in connected controller. This method should be invoked
     * to configure network commissioning parameters or update the controller after restore.
     *
     * @param options Network options to set in NV memory.
     */
    private updateCommissioningNvItems;
    /**
     * Registers endpoints before beginning normal operation.
     */
    private registerEndpoints;
    /**
     * Adds endpoint to group.
     *
     * @param endpoint Endpoint index to add.
     * @param group Target group index.
     */
    private addToGroup;
    /**
     * Internal method to reset the adapter.
     */
    private resetAdapter;
    /**
     * Internal method to reset adapter config and data.
     */
    private clearAdapter;
    /**
     * Transforms Z2M number-based network options to local Buffer-based options.
     *
     * This function also takes care of `dd:dd:dd:dd:dd:dd:dd:dd` extended PAN ID
     * and replaces it with adapter IEEE address.
     *
     * @param options Source Z2M network options.
     */
    private parseConfigNetworkOptions;
    /**
     * Writes ZNP `hasConfigured` flag to NV memory. This flag indicates the adapter has been configured.
     */
    private writeConfigurationFlag;
}
//# sourceMappingURL=manager.d.ts.map