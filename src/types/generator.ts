import * as schema from "./schema";

export interface GeneratorInfo {
    channel: string,
    tag: string,
    sha1: string,
}

function comment(input: string) {
    let out = '\t' + `/**` + '\n';
    input.split('\n').forEach(line => {
        out += '\t' + `* ${line}` + '\n';
    });
    out += '\t' + `*/` + '\n';

    return out;
}

function docs(input: schema.IDocElement) {
    const desc = input.description || input.brief;
    
    let out = '\t' + `/**` + '\n';
    desc.split('\n').forEach(line => {
        out += '\t' + `* ${line}` + '\n';
    });
    input.parameters.forEach(p => {
        out += '\t' + `* @param ${p.name}  ${p.doc}` + '\n';
    });
    input.returnvalues.forEach(p => {
        out += '\t' + `* @return ${p.name}  ${p.doc}` + '\n';
    });
    out += '\t' + `*/` + '\n';

    return out;
}

function type(type: schema.EDocParamType) {
    if (type == schema.EDocParamType.Unknown) return schema.EDocParamType.Any;
    if (type == schema.EDocParamType.Table) return schema.EDocParamType.Object;
    if (type === undefined || type == "constant") return schema.EDocParamType.Any; // Not certain what translates into undefined yet
    return type;
}

function hr(): string {
    return `// =^..^=   =^..^=   =^..^=    =^..^=    =^..^=    =^..^=    =^..^= //` + '\n\n';
}

export function generate(input: Array<schema.IDocJson>, info: GeneratorInfo, types?: Array<schema.IDocTypes>): string  {

    let output = "";

    // Header
    output += `/** @noSelfInFile */` + '\n';
    output += `/// <reference types="lua-types/5.1" />` + '\n';
    output += '\n';
    output += `// DEFOLD. ${info.channel} version ${info.tag} (${info.sha1})` + '\n';
    output += hr();

    // Types
    if (types) {
        types.forEach(t => {
            if (t.namespace) output += '\n' + `declare namespace ${t.namespace} {` + '\n';
            const tab = t.namespace ? '\t' : '';
            
            t.types.forEach(d => {
                const unionOrIntersect = d.unions.length ? `${d.unions.join(' | ')} ` : d.intersection ? `${d.intersection} & ` : "";
                
                output += '\n';
                output += tab + `type ${d.name} = ${unionOrIntersect}{` + '\n';

                for (const k in d.definition) {
                    output += tab + '\t' + `${k}: ${type(d.definition[k])},` + '\n';
                }

                output += tab + `}` + '\n';
            });

            if (t.namespace) output += `}` + '\n';
        });
    }
    output += hr();

    // Modules
    input.forEach(i => {
        if (i.info.namespace) {
            output += '\n' + `declare namespace ${i.info.namespace} {` + '\n';

            const elements = i.elements.sort((a, b) => Object.keys(schema.EDocElemType).indexOf(a.type) - Object.keys(schema.EDocElemType).indexOf(b.type));
            elements.forEach(e => {
                const name = e.name.replace(`${i.info.namespace}.`, "");
                output += '\n';

                switch(e.type) {
                    case schema.EDocElemType.Variable: {
                        output += comment(e.brief);
                        output += '\t' + `let ${name}: ${schema.EDocParamType.Any}` + '\n';
                    } break;

                    case schema.EDocElemType.Message: {
                        output += comment(e.description);
                        output += '\t' + `//let ${name}: ${schema.EDocParamType.String}` + '\n';
                    } break;
                    case schema.EDocElemType.Property: {
                        output += comment(e.description);
                        output += '\t' + `let ${name}: ${schema.EDocParamType.Any}` + '\n';
                    } break;

                    case schema.EDocElemType.Function: {
                        const params = e.parameters.map(p => `${p.name}${p.optional ? "?" : ""}: ${type(Object.values(schema.EDocParamType)[Object.keys(schema.EDocParamType).indexOf(p.type)])}`).join(', ');
                        const retValue = e.returnvalues.length > 0 ? e.returnvalues[0].type : Object.keys(schema.EDocParamType)[Object.values(schema.EDocParamType).indexOf(schema.EDocParamType.Void)];
                        const retOptional = e.returnvalues.length > 0 ? e.returnvalues[0].optional : false;
                        output += docs(e);
                        output += '\t' + `function ${name}(${params}): ${type(Object.values(schema.EDocParamType)[Object.keys(schema.EDocParamType).indexOf(retValue)])}${retOptional ? " | undefined" : ""}` + '\n';
                    } break;
                }
            });

            output += '\n';
            output += `}` + '\n';
            output += hr();
        }
    });

    return output;
}