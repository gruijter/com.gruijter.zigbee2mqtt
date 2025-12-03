export declare class Queue {
    private jobs;
    private readonly concurrent;
    constructor(concurrent?: number);
    execute<T>(func: () => Promise<T>, key?: string | number): Promise<T>;
    private executeNext;
    private getNext;
    clear(): void;
    count(): number;
}
//# sourceMappingURL=queue.d.ts.map