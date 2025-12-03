import type { DefinitionWithExtend } from "../lib/types";
export interface SunricherHvacThermostat {
    attributes: {
        screenTimeout: number;
        antiFreezingTemp: number;
        temperatureDisplayMode: number;
        windowOpenCheck: number;
        hysteresis: number;
        windowOpenFlag: number;
        forcedHeatingTime: number;
        errorCode: number;
        awayOrBoostMode: number;
    };
    commands: never;
    commandResponses: never;
}
export interface SunricherRemote {
    attributes: never;
    commands: {
        press: {
            messageType: number;
            button2: number;
            button1: number;
            pressType: number;
        };
    };
    commandResponses: never;
}
export declare const definitions: DefinitionWithExtend[];
//# sourceMappingURL=sunricher.d.ts.map