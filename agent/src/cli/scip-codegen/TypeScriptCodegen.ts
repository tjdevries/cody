import fspromises from "node:fs/promises";
import path from "node:path";
import { BaseCodegen, DiscriminatedUnion, DiscriminatedUnionMember } from "./BaseCodegen";
import { CodePrinter } from "./CodePrinter";
import { resetOutputPath } from "./resetOutputPath";
import { scip } from "./scip";
import {
    isTypescriptKeyword,
    typescriptKeyword,
    typescriptKeywordSyntax,
} from "./utils";
import dedent from "dedent";
import { isNullOrUndefinedOrUnknownType } from "./isNullOrUndefinedOrUnknownType";
import { Diagnostic, Severity } from "./Diagnostic";
import { stringLiteralType } from "./stringLiteralType";

export class TypeScriptCodegen extends BaseCodegen {
    public queue: scip.SymbolInformation[] = [];
    public generatedSymbols = new Set<string>();

    public async run(): Promise<void> {
        await resetOutputPath(this.options.output);
        const p = new CodePrinter();
        p.line('import * as rpc from "vscode-jsonrpc/node";');

        // Collect all types
        const client = BaseCodegen.protocolSymbols.client;
        this.collectTypes("ClientRequest", client.requests, true);
        this.collectTypes("ClientNoficiation", client.notifications, false);

        const server = BaseCodegen.protocolSymbols.server;
        this.collectTypes("ServerRequest", server.requests, true);
        this.collectTypes("ServerNofication", server.notifications, false);

        // Write requests/notifications
        p.sectionComment("Client->Server");
        this.addMethods(p, BaseCodegen.protocolSymbols.client.requests);
        this.addMethods(p, BaseCodegen.protocolSymbols.client.notifications);

        p.sectionComment("Server->Client");
        this.addMethods(p, BaseCodegen.protocolSymbols.server.requests);
        this.addMethods(p, BaseCodegen.protocolSymbols.server.notifications);

        // Write types
        p.sectionComment("Relevant Types");
        this.writeTypes(p);

        await fspromises.writeFile(
            path.join(this.options.output, "protocol.ts"),
            p.build(),
        );
    }

    private writeType(p: CodePrinter, info: scip.SymbolInformation): void {
        const name = this.typeName(info)

        p.line()
        p.line(`// ${name}`)

        const alias = this.aliasType(info)
        if (alias) {
            p.line(`typealias ${name} = ${alias}`)
        } else {
            const discriminatedUnion = this.discriminatedUnions.get(info.symbol)
            if (discriminatedUnion) {
                p.line('//  discriminated union');
                //this.writeSealedClass(c, name, info, discriminatedUnion)
            } else {
                this.writeDataClass(p, name, info)
            }
        }
        // p.line()
        // await fspromises.writeFile(path.join(this.options.output, `${name}.kt`), p.build())
    }

    private async writeDataClass(
        p: CodePrinter,
        name: string,
        info: scip.SymbolInformation,
    ): Promise<void> {
        if (info.kind === scip.SymbolInformation.Kind.Class) {
            this.reporter.warn(
                info.symbol,
                `classes should not be exposed in the agent protocol because they don't serialize to JSON.`
            )
        }
        const generatedName = new Set<string>()
        const enums: { name: string; members: string[] }[] = []
        p.line(`interface ${name} {`)
        p.block(() => {
            for (const memberSymbol of this.infoProperties(info)) {
                if (memberSymbol.endsWith('().')) {
                    // Ignore method members because they should not leak into
                    // the protocol in the first place because functions don't
                    // have meaningful JSON serialization. The most common cause
                    // is that a class leaks into the protocol.
                    continue
                }

                const member = this.symtab.info(memberSymbol)

                if (generatedName.has(member.display_name)) { continue }
                generatedName.add(member.display_name)

                if (!member.signature.has_value_signature) {
                    throw new TypeError(
                        `not a value signature: ${JSON.stringify(member.toObject(), null, 2)}`
                    )
                }
                if (member.signature.value_signature.tpe.has_lambda_type) {
                    this.reporter.warn(
                        memberSymbol,
                        `ignoring property '${member.display_name}' because it does not serialize correctly to JSON. ` +
                        `To fix this warning, don't expose this lambda type to the protocol`
                    )
                    // Ignore properties with signatures like
                    // `ChatButton.onClick: (action: string) => void`
                    continue
                }
                const memberType = member.signature.value_signature.tpe
                if (memberType === undefined) {
                    throw new TypeError(`no type: ${JSON.stringify(member.toObject(), null, 2)}`)
                }
                if (
                    memberType.has_type_ref &&
                    memberType.type_ref.symbol.endsWith(' lib/`lib.es5.d.ts`/Omit#')
                ) {
                    // FIXME
                    continue
                }

                let memberTypeSyntax = this.jsonrpcTypeName(member, memberType, 'parameter')
                const constants = this.stringConstantsFromInfo(member)
                const nullSyntax = this.nullableSyntax(memberType)


                if (constants.length > 0 && memberTypeSyntax.startsWith('String')) {
                    const enumTypeName = member.display_name
                    memberTypeSyntax = enumTypeName
                    enums.push({ name: enumTypeName, members: constants })
                } else {
                    this.queueClassLikeType(memberType, member, 'parameter')
                }

                p.line(
                    `${member.display_name}${nullSyntax}: ${memberTypeSyntax}`
                )
            }
        })
        //if (enums.length === 0) {
        //    p.line(`)${params?.heritageClause ?? ''}`)
        //    return
        //}
        //p.line(`)${params?.heritageClause ?? ''} {`)
        // Nest enum classe inside data class to avoid naming conflicts with
        // enums for other data classes in the same package.
        //p.block(() => {
        //    p.addImport('import com.google.gson.annotations.SerializedName')
        //
        //    for (const { name, members } of enums) {
        //        p.line()
        //        p.line(`enum class ${name} {`)
        //        p.block(() => {
        //            for (const member of members) {
        //                const serializedName = `@SerializedName("${member}")`
        //                const enumName = capitalize(member)
        //                p.line(`${serializedName} ${enumName},`)
        //            }
        //        })
        //        p.line('}')
        //    }
        //})
        p.line('}')
    }

    public writeTypes(p: CodePrinter) {
        let info = this.queue.pop();
        while (info !== undefined) {
            if (!this.generatedSymbols.has(info.symbol)) {
                this.writeType(p, info);
                this.generatedSymbols.add(info.symbol);
            }
            info = this.queue.pop();
        }

    }

    // We are referencing the given type in the generated code. If this type
    // references a class-like symbol (example, TypeScript interface), then we
    // should queue the generation of this type.
    private queueClassLikeType(
        type: scip.Type,
        jsonrpcMethod: scip.SymbolInformation,
        kind: 'parameter' | 'result'
    ): void {
        if (type.has_type_ref) {
            if (type.type_ref.symbol === typescriptKeyword('array')) {
                this.queueClassLikeType(type.type_ref.type_arguments[0], jsonrpcMethod, kind)
            } else if (this.isRecord(type.type_ref.symbol)) {
                if (type.type_ref.type_arguments.length !== 2) {
                    throw new TypeError(`record must have 2 type arguments: ${this.debug(type)}`)
                }
                this.queueClassLikeType(type.type_ref.type_arguments[0], jsonrpcMethod, kind)
                this.queueClassLikeType(type.type_ref.type_arguments[1], jsonrpcMethod, kind)
            } else if (typescriptKeywordSyntax(type.type_ref.symbol)) {
                // Typescript keywords map to primitive types (Int, Double) or built-in types like String
            } else {
                this.queueClassLikeInfo(this.symtab.info(type.type_ref.symbol))
            }
            return
        }

        if (type.has_structural_type || type.has_intersection_type) {
            // Generate new (nominal) type for this anonymous
            // structural/intersection type. For example, consider the property
            // `foo` in `interface Foo { foo: A & B }` or `foo: { a: b, c: d}`,
            // we create a new type with the name `FooParams` that contains the
            // aggregate properties of `A & B` or `{a: b, c: d}`.
            this.queueClassLikeInfo(
                new scip.SymbolInformation({
                    display_name: this.jsonrpcTypeName(jsonrpcMethod, type, kind),
                    // Need unique symbol for parameter+result types
                    symbol: `${jsonrpcMethod.symbol}(${kind}).`,
                    signature: new scip.Signature({
                        // Convert structural types to class signature with name of the JSON-RPC method
                        class_signature: new scip.ClassSignature({
                            declarations: new scip.Scope({ symlinks: this.properties(type) }),
                        }),
                    }),
                })
            )
            return
        }

        if (type.has_union_type && type.union_type.types.every(type => type.has_constant_type)) {
            // No need need to come up with a nominal type for unions of string
            // contants, like `foo: 'a' | 'b'`.
            return
        }

        if (type.has_union_type) {
            const nonNullableTypes = type.union_type.types.filter(type => !this.isNullable(type))
            if (
                nonNullableTypes.every(
                    tpe => tpe.has_type_ref && isTypescriptKeyword(tpe.type_ref.symbol)
                )
            ) {
                // Nothing to queue
                return
            }
            if (nonNullableTypes.length === 1) {
                // Ignore `| null` union types and just queue the non-null type.
                // All properties in the generated bindings are nullable by
                // defaults anyways, even if the original type is not nullable.
                this.queueClassLikeType(nonNullableTypes[0], jsonrpcMethod, kind)
            } else {
                // Used hardcoded list of exceptions for how to resolve union
                // types. In some cases, we are exposing VS Code  APIs that have
                // unions like `string | MarkdownString` where we just assume
                // the type will always be `string`.
                const exceptionIndex = this.unionTypeExceptionIndex.find(({ prefix }) =>
                    jsonrpcMethod.symbol.startsWith(prefix)
                )?.index
                if (exceptionIndex !== undefined) {
                    this.reporter.warn(
                        jsonrpcMethod.symbol,
                        `resolving unsupported union by picking type ${exceptionIndex}. ${this.debug(
                            jsonrpcMethod
                        )}`
                    )
                    this.queueClassLikeType(nonNullableTypes[exceptionIndex], jsonrpcMethod, kind)
                } else {
                    throw new Error(
                        `unsupported union type: ${JSON.stringify(jsonrpcMethod.toObject(), null, 2)}`
                    )
                }
            }
            return
        }

        if (type.has_constant_type) {
            return
        }

        throw new Error(`unsupported type: ${this.debug(type)}`)
    }

    // Same as `queueClassLikeType` but for `scip.SymbolInformation` instead of `scip.Type`.
    private queueClassLikeInfo(jsonrpcMethod: scip.SymbolInformation): void {
        if (jsonrpcMethod.signature.has_class_signature) {
            // Easy, this looks like a class/interface.
            this.queue.push(jsonrpcMethod)
            return
        }

        if (this.isStringTypeInfo(jsonrpcMethod)) {
            // Easy, we can create a string type alias
            this.queue.push(jsonrpcMethod)
            return
        }

        const discriminatedUnion = this.isNestedDiscriminatedUnion
            ? this.discriminatedUnion(jsonrpcMethod)
            : undefined
        if (discriminatedUnion) {
            this.discriminatedUnions.set(jsonrpcMethod.symbol, discriminatedUnion)
            this.queue.push(jsonrpcMethod)
            return
        }

        if (jsonrpcMethod.signature.has_type_signature) {
            // Tricky case, creatively convert this type alias into a class signature. This is tricky because
            // a type alias can have all sorts of shapes. For example,
            //   type Foo1 = A & B
            //   type Foo2 = { kind: 'a' } | {kind: 'b'}
            //   type Foo3 = ({ kind: 'a' } & A) | ({kind: 'b'} & B)
            //  The logic below does a best-effort to convert any shape into a
            //  basic data class (aka. struct). Simplified, we collect all the transitive properties of the referenced
            // types and create a class with all those properties while ensuring that no two properties have the same
            // name but incompatible type signatures. For example, there's no straighforward translation for the
            // following case because `member` has the type `string | number`:
            //   type ExtensionMessage =
            //      { kind: 'a', member: string } |
            //      { kind: 'a', member: number }
            //  When encountering these cases, we report an error message.

            const declarations = new Map<
                string,
                { info: scip.SymbolInformation; diagnostic: Diagnostic; siblings: string[] }
            >()
            for (const property of this.properties(jsonrpcMethod.signature.type_signature.lower_bound)) {
                const propertyInfo = this.symtab.info(property)
                const sibling = declarations.get(propertyInfo.display_name)
                if (!sibling) {
                    declarations.set(propertyInfo.display_name, {
                        info: propertyInfo,
                        diagnostic: {
                            severity: Severity.Error,
                            symbol: property,
                            message: dedent`Incompatible signatures. For discriminated unions, each property name must map to a unique type.
                                   For example, it's not allowed to have a property named 'result', which is a string for one type in the
                                   discrimated union and a number for another type in the union. To fix this problem, give one of the
                                   following properties a unique name and try running the code generator again.`,
                            additionalInformation: [],
                        },
                        siblings: [],
                    })
                    continue
                }
                const { info: siblingProperty, diagnostic, siblings } = sibling

                if (!this.compatibleSignatures(siblingProperty, propertyInfo)) {
                    diagnostic.additionalInformation?.push({
                        severity: Severity.Error,
                        symbol: property,
                        message: 'conflict here',
                    })
                } else {
                    siblings.push(property)
                }
            }

            if (declarations.size > 0) {
                for (const { info, diagnostic, siblings } of declarations.values()) {
                    this.siblingDiscriminatedUnionProperties.set(info.symbol, siblings)
                    if (
                        diagnostic.additionalInformation &&
                        diagnostic.additionalInformation.length > 0
                    ) {
                        this.reporter.report(diagnostic)
                    }
                }

                this.queue.push(
                    new scip.SymbolInformation({
                        display_name: jsonrpcMethod.display_name,
                        symbol: jsonrpcMethod.symbol,
                        signature: new scip.Signature({
                            class_signature: new scip.ClassSignature({
                                declarations: new scip.Scope({
                                    symlinks: [...declarations.values()].map(({ info }) => info.symbol),
                                }),
                            }),
                        }),
                    })
                )
            } else {
                this.reporter.warn(jsonrpcMethod.symbol, 'no properties found for this type')
            }
            return
        }

        throw new TypeError(`unknown info: ${JSON.stringify(jsonrpcMethod.toObject(), null, 2)}`)
    }

    public collectTypes(_: string, symbol: string, isRequest: boolean) {
        const symtab = this.symtab;
        for (const method of symtab.structuralType(
            symtab.canonicalSymbol(symbol),
        )) {
            const typeArguments =
                method.signature.value_signature.tpe.type_ref.type_arguments;

            const paramType = typeArguments[0];
            this.queueClassLikeType(paramType, method, 'parameter');

            if (isRequest) {
                const resultType = typeArguments[1];
                this.queueClassLikeType(resultType, method, 'result');
            }
        }
    }

    public addMethods(p: CodePrinter, symbol: string): void {
        const symtab = this.symtab;
        for (const method of symtab.structuralType(
            symtab.canonicalSymbol(symbol),
        )) {
            // Process a JSON-RPC request signature. For example:
            // type Requests = { 'textDocument/inlineCompletions': [RequestParams, RequestResult] }
            const typeArguments =
                method.signature.value_signature.tpe.type_ref.type_arguments;
            const isRequest = typeArguments.length > 1;
            const methodVariableName = method.display_name.replaceAll("/", "_");

            const parameterType = typeArguments[0];
            const parameterName = this.jsonrpcTypeName(method, parameterType, 'parameter');
            //const parameterInfo = this.symtab.info(parameterType.type_ref.symbol);
            //const parameterName = parameterInfo.display_name

            if (isRequest) {
                const resultType = typeArguments[1];
                const resultName = this.jsonrpcTypeName(method, resultType, 'result');
                //const resultInfo = this.symtab.info(resultType.type_ref.symbol);
                //const resultName = resultInfo.display_name

                p.line(
                    dedent(`const ${methodVariableName} = new rpc.RequestType<
                        ${parameterName},
                        ${resultName},
                        void
                     >("${method.display_name}")`),
                );
            } else {
                p.line(
                    `const ${methodVariableName} = new rpc.NotificationType<${parameterType}, void>("${method.display_name}")`,
                );
            }
        }
    }

    public functionName(info: scip.SymbolInformation): string {
        return info.display_name.replaceAll("$/", "").replaceAll("/", "_");
    }

    public typeName(info: scip.SymbolInformation): string {
        if (info.display_name === "URI") {
            // HACK, just need to get this compiling
            return "Uri";
        }

        return info.display_name
    }

    private aliasType(info: scip.SymbolInformation): string | undefined {
        if (info.display_name === 'Date') {
            // Special case for built-in `Date` type because it doesn't
            // serialize to JSON objects with `JSON.stringify()` like it does
            // for other classes.
            return 'String'
        }

        if (this.isStringTypeInfo(info)) {
            const constants = this.stringConstantsFromInfo(info)
            return constants.join(' | ');
        }

        return undefined
    }

    protected infoProperties(info: scip.SymbolInformation): string[] {
        if (info.signature.has_class_signature) {
            const result: string[] = [];
            for (const parent of info.signature.class_signature.parents) {
                result.push(...this.properties(parent));
            }
            result.push(
                ...info.signature.class_signature.declarations.symlinks,
            );
            return result;
        }

        if (info.signature.has_type_signature) {
            return this.properties(info.signature.type_signature.lower_bound);
        }

        if (info.signature.has_value_signature) {
            return this.properties(info.signature.value_signature.tpe);
        }

        if (isTypescriptKeyword(info.symbol)) {
            return [];
        }

        this.reporter.error(
            info.symbol,
            `info has no properties: ${this.debug(info)}`,
        );
        return [];
    }

    public jsonrpcTypeName(
        jsonrpcMethod: scip.SymbolInformation,
        parameterOrResultType: scip.Type,
        kind: "parameter" | "result",
    ): string {
        return this.nonNullableJsonrpcTypeName(
            jsonrpcMethod,
            parameterOrResultType,
            kind,
        );
    }

    public nonNullableJsonrpcTypeName(
        jsonrpcMethod: scip.SymbolInformation,
        parameterOrResultType: scip.Type,
        kind: "parameter" | "result",
    ): string {
        if (parameterOrResultType.has_type_ref) {
            if (this.isRecord(parameterOrResultType.type_ref.symbol)) {
                const [k, v] = parameterOrResultType.type_ref.type_arguments;
                const key = this.jsonrpcTypeName(jsonrpcMethod, k, kind);
                const value = this.jsonrpcTypeName(jsonrpcMethod, v, kind);
                return `Map<${key}, ${value}>`;
            }
            const keyword = typescriptKeywordSyntax(
                parameterOrResultType.type_ref.symbol,
            );

            switch (keyword) {
                case "List": {
                    const elementType = this.jsonrpcTypeName(
                        jsonrpcMethod,
                        parameterOrResultType.type_ref.type_arguments[0],
                        kind,
                    );
                    return `${elementType}[]`;
                }
            }

            if (keyword) {
                return keyword.toLowerCase();
            }

            return this.typeName(
                this.symtab.info(parameterOrResultType.type_ref.symbol),
            );
        }

        if (
            parameterOrResultType.has_constant_type &&
            parameterOrResultType.constant_type.constant.has_string_constant
        ) {
            return "string";
        }

        if (
            parameterOrResultType.has_constant_type &&
            parameterOrResultType.constant_type.constant.has_int_constant
        ) {
            return "int";
        }

        if (
            parameterOrResultType.has_structural_type ||
            parameterOrResultType.has_intersection_type
        ) {
            const suffix = kind === "parameter" ? "Params" : "Result";
            return this.typeName(jsonrpcMethod) + suffix;
        }

        if (parameterOrResultType.has_union_type) {
            const nonNullableTypes =
                parameterOrResultType.union_type.types.filter(
                    (tpe) => !this.isNullable(tpe),
                );
            if (nonNullableTypes.length === 1) {
                return this.nonNullableJsonrpcTypeName(
                    jsonrpcMethod,
                    nonNullableTypes[0],
                    kind,
                );
            }

            if (nonNullableTypes.every((tpe) => this.isStringType(tpe))) {
                return "String";
            }
            const nonNullTypes = parameterOrResultType.union_type.types.filter(
                (type) => !isNullOrUndefinedOrUnknownType(type),
            );
            if (nonNullTypes.length === 1) {
                return this.jsonrpcTypeName(
                    jsonrpcMethod,
                    nonNullTypes[0],
                    kind,
                );
            }

            const exceptionIndex = this.unionTypeExceptionIndex.find(
                ({ prefix }) => jsonrpcMethod.symbol.startsWith(prefix),
            )?.index;
            if (exceptionIndex !== undefined) {
                return this.jsonrpcTypeName(
                    jsonrpcMethod,
                    nonNullTypes[exceptionIndex],
                    kind,
                );
            }
        }

        throw new Error(
            `no syntax: ${JSON.stringify(
                {
                    jsonrpcMethod: jsonrpcMethod.toObject(),
                    parameterOrResultType: parameterOrResultType.toObject(),
                },
                null,
                2,
            )}`,
        );
    }

    public isNullish(symbol: string): boolean {
        return (
            symbol === typescriptKeyword("undefined") ||
            symbol === typescriptKeyword("null")
        );
    }
    public isNullableInfo(info: scip.SymbolInformation): boolean {
        return this.isNullable(info.signature.value_signature.tpe);
    }
    public nullableSyntax(tpe: scip.Type): string {
        return this.isNullable(tpe) ? "?" : "";
    }
    public isNullable(tpe: scip.Type): boolean {
        if (tpe.has_type_ref) {
            return this.isNullish(tpe.type_ref.symbol);
        }
        return (
            tpe.has_union_type &&
            tpe.union_type.types.length >= 2 &&
            tpe.union_type.types.some((t) => this.isNullable(t))
        );
    }
    public isRecord(symbol: string): boolean {
        return (
            symbol.endsWith(" lib/`lib.es5.d.ts`/Record#") ||
            symbol.endsWith(" lib/`lib.es2015.collection.d.ts`/Map#")
        );
    }

    public readonly unionTypeExceptionIndex: { prefix: string; index: number }[] = [
        { prefix: 'scip-typescript npm @types/vscode ', index: 0 },
    ]

    private unionTypes(type: scip.Type): scip.Type[] {
        const result: scip.Type[] = []
        const loop = (t: scip.Type): void => {
            if (t.has_union_type) {
                for (const unionType of t.union_type.types) {
                    if (unionType.has_type_ref) {
                        const info = this.symtab.info(unionType.type_ref.symbol)
                        if (
                            info.signature.has_type_signature &&
                            info.signature.type_signature.lower_bound.has_union_type
                        ) {
                            loop(info.signature.type_signature.lower_bound)
                            continue
                        }
                    }
                    result.push(unionType)
                }
            }
        }
        loop(type)
        return result
    }

    private discriminatedUnion(info: scip.SymbolInformation): DiscriminatedUnion | undefined {
        if (!info.signature.has_type_signature) {
            return undefined
        }
        const type = info.signature.type_signature.lower_bound
        if (!type.has_union_type || type.union_type.types.length === 0) {
            return undefined
        }
        const candidates = new Map<string, number>()
        const memberss = new Map<string, DiscriminatedUnionMember[]>()
        const unionTypes = this.unionTypes(type)
        for (const unionType of unionTypes) {
            for (const propertySymbol of this.properties(unionType)) {
                const property = this.symtab.info(propertySymbol)
                const stringLiteral = stringLiteralType(property.signature.value_signature.tpe)
                if (!stringLiteral) {
                    continue
                }
                const count = candidates.get(property.display_name) ?? 0
                candidates.set(property.display_name, count + 1)
                let members = memberss.get(property.display_name)
                if (!members) {
                    members = []
                    memberss.set(property.display_name, members)
                }
                members.push({ value: stringLiteral, type: unionType })
            }
        }
        for (const [candidate, count] of candidates.entries()) {
            if (count === unionTypes.length) {
                return {
                    symbol: info.symbol,
                    discriminatorDisplayName: candidate,
                    members: memberss.get(candidate) ?? [],
                }
            }
        }
        return undefined
    }
}
