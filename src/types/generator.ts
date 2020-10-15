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

function docs(input: schema.IDocElement, TAB = '\t') {
    const desc = input.description || input.brief;
    
    let out = TAB + `/**` + '\n';
    desc.split('\n').forEach(line => {
        out += TAB + `* ${line}` + '\n';
    });
    input.parameters.forEach(p => {
        out += TAB + `* @param ${p.name}  ${p.doc}` + '\n';
    });
    input.returnvalues.forEach(p => {
        out += TAB + `* @return ${p.name}  ${p.doc}` + '\n';
    });
    out += TAB + `*/` + '\n';

    return out;
}

function type(input: schema.EDocParamType[]): string {
    const types = input.map(t => {
        let type = Object.values(schema.EDocParamType)[Object.keys(schema.EDocParamType).indexOf(t)];
        if (type == schema.EDocParamType.Unknown) type =schema.EDocParamType.Any;
        if (type == schema.EDocParamType.Table) type = schema.EDocParamType.Any;
        if (type == schema.EDocParamType.Constant) type = schema.EDocParamType.Any;
        if (type === undefined) type = schema.EDocParamType.Any;

        return type;
    });

    // Unsure the parameter names are unique (no dupes), and if a single param is any, then the union is unnecessary
    const unique = [...new Set(types)];
    return (unique.includes(schema.EDocParamType.Any) ? [schema.EDocParamType.Any] : unique).join(' | ');
}

function isReserved(name: string): { alt: string, name: string } | null {
    const reserved = ["delete"];
    return reserved.includes(name) ? {alt: name +'$', name} : null;
}

function ensureUnique(set:Map<string, number>, e: schema.IDocParam): schema.IDocParam {
    if (!set.has(e.name)) {
        set.set(e.name, 0);
        return e;
    }

    const count = set.get(e.name);
    set.set(e.name,  (count ? count : 0) + 1);

    return Object.assign({}, e, {name: `${e.name}${set.get(e.name)}`});
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
            const exp = t.namespace ? "export" : "declare";
            
            t.types.forEach(d => {
                const unionOrIntersect = d.unions.length ? `${d.unions.join(' | ')} ` : d.intersection ? `${d.intersection} & ` : "";
                
                output += '\n';
                output += tab + `${exp} type ${d.name} = ${unionOrIntersect}{` + '\n';

                for (const k in d.definition) {
                    output += tab + '\t' + `${k}: ${d.definition[k]},` + '\n';
                }

                output += tab + `}` + '\n';
            });

            if (t.namespace) output += `}` + '\n';
        });
    }
    output += hr();

    // Globals to the front
    const globals = input.filter(i => i.info.namespace === "");
    globals.forEach(g => input.splice(input.indexOf(g), 1));
    const sorted = globals.concat(input);

    // strip empty modules
    const printable = [schema.EDocElemType.Variable, schema.EDocElemType.Message, schema.EDocElemType.Function];
    const modules = sorted.filter(m => {
        const el = m.elements.find(e => printable.includes(e.type));
        if (el) return m;
    });

    // Modules
    modules.forEach(i => {
        const TAB = i.info.namespace ? '\t' : '';
        const exp = i.info.namespace ? "export" : "declare";
        output += '\n';
        if (i.info.namespace) output += `declare namespace ${i.info.namespace} {` + '\n';

        const elements = i.elements.sort((a, b) => Object.keys(schema.EDocElemType).indexOf(a.type) - Object.keys(schema.EDocElemType).indexOf(b.type));
        elements.forEach(e => {
            const name = e.name.replace(`${i.info.namespace}.`, "");
            output += '\n';

            switch(e.type) {
                case schema.EDocElemType.Variable: {
                    output += comment(e.brief);
                    output += TAB + `${exp} let ${name}: ${schema.EDocParamType.Any}` + '\n';
                } break;

                case schema.EDocElemType.Message: {
                    output += comment(e.description);
                    output += TAB + `${exp} type ${name} = "${name}"` + '\n';
                } break;
                case schema.EDocElemType.Property: {
                    output += comment(e.description);
                    output += TAB + `${exp} let ${name}: ${schema.EDocParamType.Any}` + '\n';
                } break;

                case schema.EDocElemType.Function: {
                    const scriptFunctions = ["final", "init", "on_input", "on_message", "on_reload", "update"];
                    const reserved = isReserved(name);
                    const funcName = reserved ? reserved.alt : name;
                    const funcExp = reserved ? "" : exp;
                    if (i.info.group == schema.EDocGroup.System && scriptFunctions.includes(funcName)) {
                        output.slice(0, -1); // skip reserved functions
                    }
                    else {
                        const set = new Map<string, number>();
                        const params = e.parameters.map(p => ensureUnique(set, p)).map(p => `${p.name}${p.optional ? "?" : ""}: ${type(p.type)}`).join(', ');
                        const retValues = e.returnvalues.length > 0 ? e.returnvalues[0].type : ['Void' as schema.EDocParamType]; // need a string of the key, to match parser
                        const retOptional = e.returnvalues.length > 0 ? e.returnvalues[0].optional : false;
                        output += docs(e, TAB);
                        output += TAB + `${funcExp} function ${funcName}(${params}): ${type(retValues)}${retOptional ? " | undefined" : ""}` + '\n';
                        if (reserved) output += '\t' + `export { ${reserved.alt} as ${reserved.name} }` + '\n';
                    }
                } break;
            }
        });

        output += '\n';
        if (i.info.namespace) output += `}` + '\n';
        output += hr();
    });

    return output;
}