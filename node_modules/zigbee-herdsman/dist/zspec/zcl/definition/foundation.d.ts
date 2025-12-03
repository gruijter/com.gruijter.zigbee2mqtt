import type { ParameterDefinition } from "./tstype";
export type FoundationCommandName = "read" | "readRsp" | "write" | "writeUndiv" | "writeRsp" | "writeNoRsp" | "configReport" | "configReportRsp" | "readReportConfig" | "readReportConfigRsp" | "report" | "defaultRsp" | "discover" | "discoverRsp" | "readStructured" | "writeStructured" | "writeStructuredRsp" | "discoverCommands" | "discoverCommandsRsp" | "discoverCommandsGen" | "discoverCommandsGenRsp" | "discoverExt" | "discoverExtRsp";
export interface FoundationDefinition {
    ID: number;
    parseStrategy: "repetitive" | "flat" | "oneof";
    parameters: readonly ParameterDefinition[];
    response?: number;
}
export declare const Foundation: Readonly<Record<FoundationCommandName, Readonly<FoundationDefinition>>>;
//# sourceMappingURL=foundation.d.ts.map