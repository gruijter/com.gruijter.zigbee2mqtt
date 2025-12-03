import type * as Models from "../models";
export declare function isTcpPath(path: string): boolean;
export declare function parseTcpPath(path: string): {
    host: string;
    port: number;
};
export declare function readBackup(path: string): Models.UnifiedBackupStorage | Models.LegacyBackupStorage | undefined;
//# sourceMappingURL=utils.d.ts.map