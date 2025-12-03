import type * as Models from "../../../models";
import type { Znp } from "../znp";
import type { AdapterNvMemory } from "./adapter-nv-memory";
/**
 * Class providing ZNP adapter backup and restore procedures based mostly on NV memory manipulation.
 */
export declare class AdapterBackup {
    private znp;
    private nv;
    private defaultPath;
    constructor(znp: Znp, nv: AdapterNvMemory, path: string);
    /**
     * Loads currently stored backup and returns it in internal backup model.
     */
    getStoredBackup(): Models.Backup | undefined;
    /**
     * Creates a new backup from connected ZNP adapter and returns it in internal backup model format.
     */
    createBackup(ieeeAddressesInDatabase: string[]): Promise<Models.Backup>;
    /**
     * Restores a structure in internal backup format to connected ZNP adapter.
     *
     * @param backup Backup to restore to connected adapter.
     */
    restoreBackup(backup: Models.Backup): Promise<void>;
    /**
     * Acquires ZNP version internal to `zigbee-herdsman` from controller.
     *
     * *If Z-Stack 1.2 controller is detected an error is thrown, since Z-Stack 1.2 backup
     * and restore procedures are not supported.*
     */
    private getAdapterVersion;
    /**
     * Internal method to retrieve address manager table.
     *
     * @param version ZNP stack version the adapter is running.
     */
    private getAddressManagerTable;
    /**
     * Internal method to retrieve security manager table. Also referred to as APS Link Key Table.
     */
    private getSecurityManagerTable;
    /**
     * Internal method to retrieve APS Link Key Data Table containing arbitrary APS link keys.
     *
     * @param version ZNP stack version the adapter is running.
     */
    private getApsLinkKeyDataTable;
    /**
     * Internal method to retrieve Trust Center Link Key table which describes seed-based APS link keys for devices.
     *
     * @param version ZNP stack version the adapter is running.
     */
    private getTclkTable;
    /**
     * Internal method to retrieve network security material table, which contains network key frame counter.
     *
     * @param version ZNP stack version the adapter is running.
     */
    private getNetworkSecurityMaterialTable;
}
//# sourceMappingURL=adapter-backup.d.ts.map