type Validator<TPayload, TMatcher> = (payload: TPayload, matcher: TMatcher) => boolean;
type TimeoutFormatter<TMatcher> = (matcher: TMatcher, timeout: number) => string;
export declare class Waitress<TPayload, TMatcher> {
    private waiters;
    private readonly validator;
    private readonly timeoutFormatter;
    private currentID;
    constructor(validator: Validator<TPayload, TMatcher>, timeoutFormatter: TimeoutFormatter<TMatcher>);
    clear(): void;
    resolve(payload: TPayload): boolean;
    reject(payload: TPayload, message: string): boolean;
    remove(id: number): void;
    waitFor(matcher: TMatcher, timeout: number): {
        ID: number;
        start: () => {
            promise: Promise<TPayload>;
            ID: number;
        };
    };
    private forEachMatching;
}
export {};
//# sourceMappingURL=waitress.d.ts.map