export interface ParamsDesc {
    [s: string]: any;
}
export interface EZSPFrameDesc {
    ID: number;
    request?: ParamsDesc;
    response?: ParamsDesc;
    minV?: number;
    maxV?: number;
}
export declare const FRAMES: {
    [key: string]: EZSPFrameDesc;
};
export declare const FRAME_NAMES_BY_ID: {
    [key: string]: string[];
};
interface EZSPZDOResponseFrame {
    ID: number;
    params: ParamsDesc;
}
export declare const ZDOREQUESTS: {
    [key: string]: EZSPFrameDesc;
};
export declare const ZDORESPONSES: {
    [key: string]: EZSPZDOResponseFrame;
};
export declare const ZGP: {
    [key: string]: EZSPZDOResponseFrame;
};
export declare const ZDOREQUEST_NAME_BY_ID: {
    [key: string]: string;
};
export declare const ZDORESPONSE_NAME_BY_ID: {
    [key: string]: string;
};
export {};
//# sourceMappingURL=commands.d.ts.map