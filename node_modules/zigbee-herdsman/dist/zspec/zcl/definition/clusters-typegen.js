"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* v8 ignore start */
/**
 * How to run:
 * ```bash
 * npm i -g ts-node
 * ts-node ./src/zspec/zcl/definition/clusters-typegen.ts && pnpm run check:w
 * ```
 * or with compiled:
 * ```bash
 * pnpm run prepack
 * node ./dist/zspec/zcl/definition/clusters-typegen.js && pnpm run check:w
 * ```
 */
const node_fs_1 = require("node:fs");
const typescript_1 = __importDefault(require("typescript"));
const utils_1 = require("../utils");
const cluster_1 = require("./cluster");
const enums_1 = require("./enums");
const foundation_1 = require("./foundation");
const manufacturerCode_1 = require("./manufacturerCode");
const FILENAME = "clusters-types.ts";
const file = typescript_1.default.createSourceFile(FILENAME, "", typescript_1.default.ScriptTarget.ESNext, false, typescript_1.default.ScriptKind.TS);
const printer = typescript_1.default.createPrinter({ newLine: typescript_1.default.NewLineKind.LineFeed });
const emptyObject = typescript_1.default.factory.createTypeReferenceNode("Record", [
    typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.StringKeyword),
    typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.NeverKeyword),
]);
const namedImports = typescript_1.default.factory.createImportDeclaration(undefined, typescript_1.default.factory.createImportClause(true, undefined, typescript_1.default.factory.createNamedImports([
    // sorted by name
    typescript_1.default.factory.createImportSpecifier(false, undefined, typescript_1.default.factory.createIdentifier("ExtensionFieldSet")),
    typescript_1.default.factory.createImportSpecifier(false, undefined, typescript_1.default.factory.createIdentifier("Gpd")),
    typescript_1.default.factory.createImportSpecifier(false, undefined, typescript_1.default.factory.createIdentifier("GpdAttributeReport")),
    typescript_1.default.factory.createImportSpecifier(false, undefined, typescript_1.default.factory.createIdentifier("GpdChannelConfiguration")),
    typescript_1.default.factory.createImportSpecifier(false, undefined, typescript_1.default.factory.createIdentifier("GpdChannelRequest")),
    typescript_1.default.factory.createImportSpecifier(false, undefined, typescript_1.default.factory.createIdentifier("GpdCommissioningReply")),
    typescript_1.default.factory.createImportSpecifier(false, undefined, typescript_1.default.factory.createIdentifier("GpdCustomReply")),
    typescript_1.default.factory.createImportSpecifier(false, undefined, typescript_1.default.factory.createIdentifier("MiboxerZone")),
    typescript_1.default.factory.createImportSpecifier(false, undefined, typescript_1.default.factory.createIdentifier("Struct")),
    typescript_1.default.factory.createImportSpecifier(false, undefined, typescript_1.default.factory.createIdentifier("StructuredSelector")),
    typescript_1.default.factory.createImportSpecifier(false, undefined, typescript_1.default.factory.createIdentifier("ThermoTransition")),
    typescript_1.default.factory.createImportSpecifier(false, undefined, typescript_1.default.factory.createIdentifier("TuyaDataPointValue")),
    typescript_1.default.factory.createImportSpecifier(false, undefined, typescript_1.default.factory.createIdentifier("ZclArray")),
    // ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier("ZclDate")), // XXX: currently unused
    // ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier("ZclTimeOfDay")), // XXX: currently unused
    typescript_1.default.factory.createImportSpecifier(false, undefined, typescript_1.default.factory.createIdentifier("ZoneInfo")),
])), typescript_1.default.factory.createStringLiteral("./tstype"), undefined);
const getTypeFromDataType = (dataType) => {
    switch (dataType) {
        case enums_1.DataType.NO_DATA:
        case enums_1.DataType.UNKNOWN: {
            return typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.NeverKeyword);
        }
        case enums_1.DataType.DATA56:
        case enums_1.DataType.BITMAP56:
        case enums_1.DataType.UINT56:
        case enums_1.DataType.DATA64:
        case enums_1.DataType.BITMAP64:
        case enums_1.DataType.UINT64:
        case enums_1.DataType.INT56:
        case enums_1.DataType.INT64: {
            return typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.BigIntKeyword);
        }
        case enums_1.DataType.OCTET_STR:
        case enums_1.DataType.LONG_OCTET_STR:
        case enums_1.DataType.SEC_KEY: {
            return typescript_1.default.factory.createTypeReferenceNode("Buffer");
        }
        case enums_1.DataType.CHAR_STR:
        case enums_1.DataType.LONG_CHAR_STR:
        case enums_1.DataType.IEEE_ADDR: {
            return typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.StringKeyword);
        }
        case enums_1.DataType.ARRAY:
        case enums_1.DataType.SET:
        case enums_1.DataType.BAG: {
            // mismatch on read vs write, have to union
            return typescript_1.default.factory.createUnionTypeNode([
                typescript_1.default.factory.createTypeReferenceNode("ZclArray"),
                typescript_1.default.factory.createArrayTypeNode(typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.UnknownKeyword)),
            ]);
        }
        case enums_1.DataType.STRUCT: {
            return typescript_1.default.factory.createTypeReferenceNode("Struct");
        }
        case enums_1.DataType.TOD: {
            return typescript_1.default.factory.createTypeReferenceNode("ZclTimeOfDay");
        }
        case enums_1.DataType.DATE: {
            return typescript_1.default.factory.createTypeReferenceNode("ZclDate");
        }
        case enums_1.BuffaloZclDataType.USE_DATA_TYPE: {
            return typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.UnknownKeyword);
        }
        case enums_1.BuffaloZclDataType.LIST_UINT8:
        case enums_1.BuffaloZclDataType.LIST_UINT16:
        case enums_1.BuffaloZclDataType.LIST_UINT24:
        case enums_1.BuffaloZclDataType.LIST_UINT32: {
            return typescript_1.default.factory.createArrayTypeNode(typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.NumberKeyword));
        }
        case enums_1.BuffaloZclDataType.LIST_ZONEINFO: {
            return typescript_1.default.factory.createArrayTypeNode(typescript_1.default.factory.createTypeReferenceNode("ZoneInfo"));
        }
        case enums_1.BuffaloZclDataType.EXTENSION_FIELD_SETS: {
            return typescript_1.default.factory.createArrayTypeNode(typescript_1.default.factory.createTypeReferenceNode("ExtensionFieldSet"));
        }
        case enums_1.BuffaloZclDataType.LIST_THERMO_TRANSITIONS: {
            return typescript_1.default.factory.createArrayTypeNode(typescript_1.default.factory.createTypeReferenceNode("ThermoTransition"));
        }
        case enums_1.BuffaloZclDataType.BUFFER: {
            return typescript_1.default.factory.createTypeReferenceNode("Buffer");
        }
        case enums_1.BuffaloZclDataType.GPD_FRAME: {
            return typescript_1.default.factory.createUnionTypeNode([
                typescript_1.default.factory.createTypeReferenceNode("Gpd"),
                typescript_1.default.factory.createTypeReferenceNode("GpdChannelRequest"),
                typescript_1.default.factory.createTypeReferenceNode("GpdAttributeReport"),
                typescript_1.default.factory.createTypeLiteralNode([
                    typescript_1.default.factory.createPropertySignature(undefined, "raw", undefined, typescript_1.default.factory.createTypeReferenceNode("Buffer")),
                ]),
                typescript_1.default.factory.createTypeReferenceNode("Record<string, never>"),
                typescript_1.default.factory.createTypeReferenceNode("GpdCommissioningReply"),
                typescript_1.default.factory.createTypeReferenceNode("GpdChannelConfiguration"),
                typescript_1.default.factory.createTypeReferenceNode("GpdCustomReply"),
            ]);
        }
        case enums_1.BuffaloZclDataType.STRUCTURED_SELECTOR: {
            return typescript_1.default.factory.createTypeReferenceNode("StructuredSelector");
        }
        case enums_1.BuffaloZclDataType.LIST_TUYA_DATAPOINT_VALUES: {
            return typescript_1.default.factory.createArrayTypeNode(typescript_1.default.factory.createTypeReferenceNode("TuyaDataPointValue"));
        }
        case enums_1.BuffaloZclDataType.LIST_MIBOXER_ZONES: {
            return typescript_1.default.factory.createArrayTypeNode(typescript_1.default.factory.createTypeReferenceNode("MiboxerZone"));
        }
        default: {
            return typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.NumberKeyword);
        }
    }
};
const getConditionStr = (conditions) => {
    if (conditions) {
        let str = ", Conditions: [";
        for (const condition of conditions) {
            str += `{${condition.type}`;
            for (const key in condition) {
                if (key === "type") {
                    continue;
                }
                str += ` ${key}=${condition[key]}`;
            }
            str += "}";
        }
        return `${str}]`;
    }
};
const addAttributes = (attributes) => {
    const elements = [];
    for (const attributeName in attributes) {
        const attribute = attributes[attributeName];
        const element = typescript_1.default.factory.createPropertySignature(undefined, attributeName, 
        // always optional if manuf-specific
        attribute.manufacturerCode ? typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.QuestionToken) : undefined, getTypeFromDataType(attribute.type));
        elements.push(element);
        let comment = `* ID: ${attribute.ID} | Type: ${enums_1.DataType[attribute.type] ?? enums_1.BuffaloZclDataType[attribute.type]} `;
        if (attribute.manufacturerCode !== undefined) {
            comment += `| Specific to manufacturer: ${manufacturerCode_1.ManufacturerCode[attribute.manufacturerCode]} (${attribute.manufacturerCode}) `;
        }
        typescript_1.default.addSyntheticLeadingComment(element, typescript_1.default.SyntaxKind.MultiLineCommentTrivia, comment, true);
    }
    return elements.length > 0 ? typescript_1.default.factory.createTypeLiteralNode(elements) : typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.NeverKeyword);
};
const addCommands = (commands) => {
    const elements = [];
    for (const commandName in commands) {
        const command = commands[commandName];
        const cmdElements = [];
        for (const parameter of command.parameters) {
            // @ts-expect-error bad typing?
            const existing = cmdElements.find((element) => element.name.escapedText === parameter.name);
            const paramType = getTypeFromDataType(parameter.type);
            if (!existing) {
                const cmdElement = typescript_1.default.factory.createPropertySignature(undefined, parameter.name, parameter.conditions ? typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.QuestionToken) : undefined, paramType);
                const conditionComment = getConditionStr(parameter.conditions);
                cmdElements.push(cmdElement);
                typescript_1.default.addSyntheticLeadingComment(cmdElement, typescript_1.default.SyntaxKind.MultiLineCommentTrivia, `* Type: ${enums_1.DataType[parameter.type] ?? enums_1.BuffaloZclDataType[parameter.type]}${conditionComment ?? ""} `, true);
            }
            else if (
            // @ts-expect-error bad typing?
            existing.type?.typeName?.escapedText &&
                // @ts-expect-error bad typing?
                paramType.typeName?.escapedText &&
                // @ts-expect-error bad typing?
                existing.type.typeName.escapedText !== paramType.typeName.escapedText) {
                // XXX: not currently used, untested
                typescript_1.default.factory.updatePropertySignature(existing, existing.modifiers, existing.name, existing.questionToken, typescript_1.default.factory.createUnionTypeNode([existing.type, paramType]));
            }
            else if (!parameter.conditions) {
                throw new Error(`Two or more cluster command parameters have identical name without conditions. ${JSON.stringify(parameter)}`);
            }
        }
        const element = typescript_1.default.factory.createPropertySignature(undefined, commandName, undefined, cmdElements.length > 0 ? typescript_1.default.factory.createTypeLiteralNode(cmdElements) : emptyObject);
        elements.push(element);
        let comment = `* ID: ${command.ID} `;
        if (command.response !== undefined) {
            comment += `| Response ID: ${command.response} `;
        }
        typescript_1.default.addSyntheticLeadingComment(element, typescript_1.default.SyntaxKind.MultiLineCommentTrivia, comment, true);
    }
    return elements.length > 0 ? typescript_1.default.factory.createTypeLiteralNode(elements) : typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.NeverKeyword);
};
const clusterElements = [];
for (const clusterName in cluster_1.Clusters) {
    const cluster = cluster_1.Clusters[clusterName];
    const attributesProp = typescript_1.default.factory.createPropertySignature(undefined, "attributes", undefined, addAttributes(cluster.attributes));
    const commandsProp = typescript_1.default.factory.createPropertySignature(undefined, "commands", undefined, addCommands(cluster.commands));
    const commandResponsesProp = typescript_1.default.factory.createPropertySignature(undefined, "commandResponses", undefined, addCommands(cluster.commandsResponse));
    clusterElements.push(typescript_1.default.factory.createPropertySignature(undefined, clusterName, undefined, typescript_1.default.factory.createTypeLiteralNode([attributesProp, commandsProp, commandResponsesProp])));
}
const clustersDecl = typescript_1.default.factory.createInterfaceDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TClusters", undefined, undefined, clusterElements);
const addParameters = (foundation) => {
    const elements = [];
    for (const parameter of foundation.parameters) {
        const element = typescript_1.default.factory.createPropertySignature(undefined, parameter.name, parameter.conditions ? typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.QuestionToken) : undefined, getTypeFromDataType(parameter.type));
        const conditionComment = getConditionStr(parameter.conditions);
        elements.push(element);
        typescript_1.default.addSyntheticLeadingComment(element, typescript_1.default.SyntaxKind.MultiLineCommentTrivia, `* Type: ${enums_1.DataType[parameter.type] ?? enums_1.BuffaloZclDataType[parameter.type]}${conditionComment ?? ""} `, true);
    }
    if (elements.length === 0) {
        return emptyObject;
    }
    switch (foundation.parseStrategy) {
        case "repetitive": {
            return typescript_1.default.factory.createArrayTypeNode(typescript_1.default.factory.createTypeLiteralNode(elements));
        }
        case "flat": {
            return typescript_1.default.factory.createTypeLiteralNode(elements);
        }
        case "oneof": {
            if ((0, utils_1.isFoundationDiscoverRsp)(foundation.ID)) {
                const discComplete = typescript_1.default.factory.createPropertySignature(undefined, "discComplete", undefined, typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.NumberKeyword));
                typescript_1.default.addSyntheticLeadingComment(discComplete, typescript_1.default.SyntaxKind.MultiLineCommentTrivia, `* Type: ${enums_1.DataType[enums_1.DataType.UINT8]} `, true);
                return typescript_1.default.factory.createTypeLiteralNode([
                    discComplete,
                    typescript_1.default.factory.createPropertySignature(undefined, "attrInfos", undefined, typescript_1.default.factory.createArrayTypeNode(typescript_1.default.factory.createTypeLiteralNode(elements))),
                ]);
            }
        }
    }
    throw new Error(`Unknown command strategy for ${JSON.stringify(foundation)}`);
};
const foundationElements = [];
const foundationRepetitiveElements = [];
const foundationFlatElements = [];
const foundationOneOfElements = [];
for (const foundationName in foundation_1.Foundation) {
    const foundation = foundation_1.Foundation[foundationName];
    const element = typescript_1.default.factory.createPropertySignature(undefined, foundationName, undefined, addParameters(foundation));
    foundationElements.push(element);
    typescript_1.default.addSyntheticLeadingComment(element, typescript_1.default.SyntaxKind.MultiLineCommentTrivia, `* ID: ${foundation.ID} `, true);
    const stratNode = typescript_1.default.factory.createTypeReferenceNode(`"${foundationName}"`);
    switch (foundation.parseStrategy) {
        case "repetitive": {
            foundationRepetitiveElements.push(stratNode);
            break;
        }
        case "flat": {
            foundationFlatElements.push(stratNode);
            break;
        }
        case "oneof": {
            foundationOneOfElements.push(stratNode);
            break;
        }
    }
}
const foundationDecl = typescript_1.default.factory.createInterfaceDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TFoundation", undefined, undefined, foundationElements);
const foundationRepetitiveDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TFoundationRepetitive", undefined, typescript_1.default.factory.createUnionTypeNode(foundationRepetitiveElements));
const foundationFlatDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TFoundationFlat", undefined, typescript_1.default.factory.createUnionTypeNode(foundationFlatElements));
const foundationOneOfDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TFoundationOneOf", undefined, typescript_1.default.factory.createUnionTypeNode(foundationOneOfElements));
const clDecl = typescript_1.default.factory.createTypeParameterDeclaration(undefined, "Cl", typescript_1.default.factory.createUnionTypeNode([
    typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.NumberKeyword),
    typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.StringKeyword),
]));
const coDecl = typescript_1.default.factory.createTypeParameterDeclaration(undefined, "Co", typescript_1.default.factory.createUnionTypeNode([
    typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.NumberKeyword),
    typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.StringKeyword),
]));
const clusterAttributeKeysDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TClusterAttributeKeys", [clDecl], typescript_1.default.factory.createTypeReferenceNode(`Cl extends keyof ${clustersDecl.name.escapedText} ? (keyof ${clustersDecl.name.escapedText}[Cl]["attributes"])[] : (string | number)[];`));
const clusterAttributesDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TClusterAttributes", [clDecl], typescript_1.default.factory.createTypeReferenceNode(`Cl extends keyof ${clustersDecl.name.escapedText} ? ${clustersDecl.name.escapedText}[Cl]["attributes"] : never`));
const partialClusterAttributesDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TPartialClusterAttributes", [clDecl], typescript_1.default.factory.createTypeReferenceNode(`Cl extends keyof ${clustersDecl.name.escapedText} ? Partial<${clustersDecl.name.escapedText}[Cl]["attributes"]> : never`));
const clusterCommandKeysDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TClusterCommandKeys", [clDecl], typescript_1.default.factory.createTypeReferenceNode(`Cl extends keyof ${clustersDecl.name.escapedText} ? (keyof ${clustersDecl.name.escapedText}[Cl]["commands"])[] : (string | number)[];`));
const clusterCommandResponseKeysDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TClusterCommandResponseKeys", [clDecl], typescript_1.default.factory.createTypeReferenceNode(`Cl extends keyof ${clustersDecl.name.escapedText} ? (keyof ${clustersDecl.name.escapedText}[Cl]["commandResponses"])[] : (string | number)[];`));
const clusterCommandsDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TClusterCommands", [clDecl], typescript_1.default.factory.createTypeReferenceNode(`Cl extends keyof ${clustersDecl.name.escapedText} ? ${clustersDecl.name.escapedText}[Cl]["commands"] : never`));
const clusterCommandResponsesDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TClusterCommandResponses", [clDecl], typescript_1.default.factory.createTypeReferenceNode(`Cl extends keyof ${clustersDecl.name.escapedText} ? ${clustersDecl.name.escapedText}[Cl]["commandResponses"] : never`));
const clusterCommandPayloadDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TClusterCommandPayload", [clDecl, coDecl], typescript_1.default.factory.createTypeReferenceNode(`Cl extends keyof ${clustersDecl.name.escapedText} ? Co extends keyof ${clustersDecl.name.escapedText}[Cl]["commands"] ? ${clustersDecl.name.escapedText}[Cl]["commands"][Co] : never : never;`));
const clusterCommandResponsePayloadDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TClusterCommandResponsePayload", [clDecl, coDecl], typescript_1.default.factory.createTypeReferenceNode(`Cl extends keyof ${clustersDecl.name.escapedText} ? Co extends keyof ${clustersDecl.name.escapedText}[Cl]["commandResponses"] ? ${clustersDecl.name.escapedText}[Cl]["commandResponses"][Co] : never : never;`));
const clusterPayloadDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TClusterPayload", [clDecl, coDecl], typescript_1.default.factory.createTypeReferenceNode(`Cl extends keyof ${clustersDecl.name.escapedText} ? ${clustersDecl.name.escapedText}[Cl]["commands"] extends never ? ${clustersDecl.name.escapedText}[Cl]["commandResponses"] extends never ? never : Co extends keyof ${clustersDecl.name.escapedText}[Cl]["commandResponses"] ? ${clustersDecl.name.escapedText}[Cl]["commandResponses"][Co] : never : Co extends keyof ${clustersDecl.name.escapedText}[Cl]["commands"] ? ${clustersDecl.name.escapedText}[Cl]["commands"][Co] : Co extends keyof ${clustersDecl.name.escapedText}[Cl]["commandResponses"] ? ${clustersDecl.name.escapedText}[Cl]["commandResponses"][Co] : never : never;`));
const foundationGenericPayloadDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TFoundationGenericPayload", undefined, typescript_1.default.factory.createTypeReferenceNode(`${foundationDecl.name.escapedText}[keyof ${foundationDecl.name.escapedText}]`));
const foundationRepetitivePayloadDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TFoundationRepetitivePayload", undefined, typescript_1.default.factory.createTypeReferenceNode(`${foundationDecl.name.escapedText}[${foundationRepetitiveDecl.name.escapedText}]`));
const foundationFlatPayloadDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TFoundationFlatPayload", undefined, typescript_1.default.factory.createTypeReferenceNode(`${foundationDecl.name.escapedText}[${foundationFlatDecl.name.escapedText}]`));
const foundationOneOfPayloadDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TFoundationOneOfPayload", undefined, typescript_1.default.factory.createTypeReferenceNode(`${foundationDecl.name.escapedText}[${foundationOneOfDecl.name.escapedText}]`));
const foundationPayloadDecl = typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], "TFoundationPayload", [coDecl], typescript_1.default.factory.createTypeReferenceNode(`Co extends keyof ${foundationDecl.name.escapedText} ? ${foundationDecl.name.escapedText}[Co] : ${foundationGenericPayloadDecl.name.escapedText}`));
const result = `${printer.printNode(typescript_1.default.EmitHint.Unspecified, namedImports, file)}

${printer.printNode(typescript_1.default.EmitHint.Unspecified, clustersDecl, file)}

${printer.printNode(typescript_1.default.EmitHint.Unspecified, foundationDecl, file)}

${printer.printNode(typescript_1.default.EmitHint.Unspecified, foundationRepetitiveDecl, file)}
${printer.printNode(typescript_1.default.EmitHint.Unspecified, foundationFlatDecl, file)}
${printer.printNode(typescript_1.default.EmitHint.Unspecified, foundationOneOfDecl, file)}

// Clusters
${printer.printNode(typescript_1.default.EmitHint.Unspecified, clusterAttributeKeysDecl, file)}

${printer.printNode(typescript_1.default.EmitHint.Unspecified, clusterAttributesDecl, file)}

${printer.printNode(typescript_1.default.EmitHint.Unspecified, partialClusterAttributesDecl, file)}

${printer.printNode(typescript_1.default.EmitHint.Unspecified, clusterCommandKeysDecl, file)}

${printer.printNode(typescript_1.default.EmitHint.Unspecified, clusterCommandResponseKeysDecl, file)}

${printer.printNode(typescript_1.default.EmitHint.Unspecified, clusterCommandsDecl, file)}

${printer.printNode(typescript_1.default.EmitHint.Unspecified, clusterCommandResponsesDecl, file)}

${printer.printNode(typescript_1.default.EmitHint.Unspecified, clusterCommandPayloadDecl, file)}

${printer.printNode(typescript_1.default.EmitHint.Unspecified, clusterCommandResponsePayloadDecl, file)}

${printer.printNode(typescript_1.default.EmitHint.Unspecified, clusterPayloadDecl, file)}

// Foundation
${printer.printNode(typescript_1.default.EmitHint.Unspecified, foundationGenericPayloadDecl, file)}
${printer.printNode(typescript_1.default.EmitHint.Unspecified, foundationRepetitivePayloadDecl, file)}
${printer.printNode(typescript_1.default.EmitHint.Unspecified, foundationFlatPayloadDecl, file)}
${printer.printNode(typescript_1.default.EmitHint.Unspecified, foundationOneOfPayloadDecl, file)}

${printer.printNode(typescript_1.default.EmitHint.Unspecified, foundationPayloadDecl, file)}
`;
(0, node_fs_1.writeFileSync)(`./src/zspec/zcl/definition/${FILENAME}`, result, { encoding: "utf8" });
//# sourceMappingURL=clusters-typegen.js.map