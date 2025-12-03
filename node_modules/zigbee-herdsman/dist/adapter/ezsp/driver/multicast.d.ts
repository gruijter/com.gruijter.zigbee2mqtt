import type { Driver } from "./driver";
import { EmberStatus } from "./types/named";
export declare class Multicast {
    tableSize: number;
    private driver;
    private _multicast;
    private _available;
    constructor(driver: Driver);
    private _initialize;
    startup(enpoints: {
        id: number;
        member_of: number[];
    }[]): Promise<void>;
    subscribe(groupId: number, endpoint: number): Promise<EmberStatus>;
}
//# sourceMappingURL=multicast.d.ts.map