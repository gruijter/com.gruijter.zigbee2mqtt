import type * as Models from "../models";
/**
 * Converts internal backup format to unified backup storage format as described by
 * [zigpy/open-coordinator-backup](https://github.com/zigpy/open-coordinator-backup).
 *
 * @param backup Backup to create unified backup format from.
 */
export declare const toUnifiedBackup: (backup: Models.Backup) => Models.UnifiedBackupStorage;
/**
 * Converts unified backup storage format to internal backup format.
 *
 * @param backup Unified format to convert to internal backup format.
 */
export declare const fromUnifiedBackup: (backup: Models.UnifiedBackupStorage) => Models.Backup;
/**
 * Converts legacy Zigbee2MQTT format to internal backup format.
 *
 * @param backup Legacy format to convert.
 */
export declare const fromLegacyBackup: (backup: Models.LegacyBackupStorage) => Models.Backup;
//# sourceMappingURL=backup.d.ts.map