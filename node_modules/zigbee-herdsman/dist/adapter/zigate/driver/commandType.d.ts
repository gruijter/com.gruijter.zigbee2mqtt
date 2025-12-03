import { ZiGateMessageCode, type ZiGateObjectPayload } from "./constants";
import ParameterType from "./parameterType";
export interface PermitJoinPayload extends ZiGateObjectPayload {
    targetShortAddress: number;
    interval: number;
    TCsignificance?: number;
}
export interface RawAPSDataRequestPayload extends ZiGateObjectPayload {
    addressMode: number;
    targetShortAddress: number;
    sourceEndpoint: number;
    destinationEndpoint: number;
    profileID: number;
    clusterID: number;
    securityMode: number;
    radius: number;
    dataLength: number;
    data: Buffer;
}
export interface ZiGateCommandParameter {
    name: string;
    parameterType: ParameterType;
}
export interface ZiGateCommandType {
    request: ZiGateCommandParameter[];
    response?: ZiGateResponseMatcher[];
    waitStatus?: boolean;
}
export interface ZiGateResponseMatcherRule {
    receivedProperty: string;
    matcher: (expected: string | number | ZiGateMessageCode, received: string | number | ZiGateMessageCode) => boolean;
    expectedProperty?: string;
    expectedExtraParameter?: string;
    value?: string | number | ZiGateMessageCode;
}
export declare function equal(expected: string | number | ZiGateMessageCode, received: string | number | ZiGateMessageCode): boolean;
export declare function notEqual(expected: string | number | ZiGateMessageCode, received: string | number | ZiGateMessageCode): boolean;
export type ZiGateResponseMatcher = ZiGateResponseMatcherRule[];
export declare const ZiGateCommand: {
    [key: string]: ZiGateCommandType;
};
//# sourceMappingURL=commandType.d.ts.map