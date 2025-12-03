import type { DefinitionWithExtend, Zh } from "./types";
export declare function generateDefinition(device: Zh.Device): Promise<{
    externalDefinitionSource: string;
    definition: DefinitionWithExtend;
}>;
export declare function generateGreenPowerDefinition(device: Zh.Device): {
    externalDefinitionSource: string;
    definition: DefinitionWithExtend;
};
//# sourceMappingURL=generateDefinition.d.ts.map