import type { Endpoint } from "../model";
import type Request from "./request";
export declare class RequestQueue extends Set<Request> {
    private sendInProgress;
    private id;
    private deviceIeeeAddress;
    constructor(endpoint: Endpoint);
    send(fastPolling: boolean): Promise<void>;
    queue<Type>(request: Request<Type>): Promise<Type>;
    filter(newRequest: Request): void;
}
export default RequestQueue;
//# sourceMappingURL=requestQueue.d.ts.map