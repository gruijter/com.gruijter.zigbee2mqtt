import ParameterType from "./parameterType";
export interface ZiGateMessageParameter {
    name: string;
    parameterType: ParameterType;
    options?: object;
}
export interface ZiGateMessageType {
    response: ZiGateMessageParameter[];
}
export declare const ZiGateMessage: {
    [k: number]: ZiGateMessageType;
};
//# sourceMappingURL=messageType.d.ts.map