import events from "node:events";
import type { Adapter } from "../../adapter";
import type Database from "../database";
type EventMap<T> = Record<keyof T, any[]> | DefaultEventMap;
type DefaultEventMap = [never];
export declare abstract class Entity<T extends EventMap<T> = DefaultEventMap> extends events.EventEmitter<T> {
    protected static database: Database;
    protected static adapter: Adapter;
    static injectDatabase(database: Database): void;
    static injectAdapter(adapter: Adapter): void;
}
export default Entity;
//# sourceMappingURL=entity.d.ts.map