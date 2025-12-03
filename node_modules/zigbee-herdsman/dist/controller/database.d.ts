import type { DatabaseEntry, EntityType } from "./tstype";
export declare class Database {
    private entries;
    private path;
    private maxId;
    private constructor();
    static open(path: string): Database;
    getEntriesIterator(type: EntityType[]): Generator<DatabaseEntry>;
    insert(databaseEntry: DatabaseEntry): void;
    update(databaseEntry: DatabaseEntry, write: boolean): void;
    remove(id: number): void;
    has(id: number): boolean;
    newID(): number;
    write(): void;
}
export default Database;
//# sourceMappingURL=database.d.ts.map