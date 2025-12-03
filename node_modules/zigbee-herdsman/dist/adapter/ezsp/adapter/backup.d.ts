import type * as Models from "../../../models";
import type { Driver } from "../driver";
export declare class EZSPAdapterBackup {
    private driver;
    private defaultPath;
    constructor(driver: Driver, path: string);
    createBackup(): Promise<Models.Backup>;
    /**
     * Loads currently stored backup and returns it in internal backup model.
     */
    getStoredBackup(): Models.Backup | undefined;
}
//# sourceMappingURL=backup.d.ts.map