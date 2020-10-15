
// parser expects an array of json objects already serialized from disk

// When parsing we should only accept things we have types for in our typeMap and emit to the log if we come accross a missing type

// Each doc Must have an elements [] to parse

// We need to translate the docs to js doc format above each call

import * as schema from "./schema";

export interface ParserOpts {
    log: unknown
}

function parseHtml(input: string, isParam?: boolean): string {

    const icons: Record<string, string> = {
        "attention": "⚠",
        "html5": "🌎",
        "android": "🤖",
        "ios": "📱",
        "macos": "🍎",
        "linux": "🐧"
    };
    const icon = /.*<span class="icon-(.*)">.*<\/span>/.exec(input)?.[1];

    return input
        .replace(/\\n<ul>/g, "")
        .replace(/.*<li>(.*)<\/li>/g, "- $1")
        .replace(/<\/?em>/g, "*")
        .replace(/<\/?code>/g, "`")
        .replace(/.*<span class="type">(.+)<\/span>(\s*)/g, isParam ? "" : "$1")
        .replace(/.*<span class="icon-(.*)">.*<\/span>/g, icon ? icons[icon] : "")
        .replace(/<.*?>/g, "");
}

function parseType(input: string, typeMap: Record<string, schema.EDocParamType>): schema.EDocParamType {
    const result = /.*<span class="type">(.+)<\/span>/.exec(input);
    const type = result && result.length > 1 ? result[1] : "";
    const key = typeMap[type];
    const paramType = Object.fromEntries(Object.entries(schema.EDocParamType).map(([key, value]) => [value, key]));
    return paramType[ key ? key : ""] ? paramType[ key ? key : ""] as schema.EDocParamType : schema.EDocParamType.Unknown;
}

function parseName(input: string): { name: string, optional: boolean } {
    const maybeOptional = /\[(.+)\]/.exec(input);
    const optional = maybeOptional && maybeOptional?.length > 1 ? true : false;
    const rawName = optional && maybeOptional ? maybeOptional[1] : input;
    const name = rawName.replace(/^[^a-zA-Z_$]|[^0-9a-zA-Z_$]/g, "_");

    return { name, optional };
}

function inNamespace(doc: schema.IDocJson): boolean {
    let hasFunction = false;
    const funcNamespace = undefined != doc.elements.find(e =>  {
        if (e.type == schema.EDocElemType.Function) {
            hasFunction = true;
            return e.name.startsWith(doc.info.namespace);
        }
    });

    return !hasFunction || funcNamespace;
}

const defaults = [schema.EDocGroup.System, schema.EDocGroup.Script, schema.EDocGroup.Components, schema.EDocGroup.Extensions];
export function parse(input: Array<schema.IDocJson>, groups: Array<schema.EDocGroup> = defaults, typeMap?: Record<string, schema.EDocParamType>): Array<schema.IDocJson> {
    
    const userTypeMap = Object.assign(schema.typeMap, typeMap || {});
    const alphabetical = input.slice().sort((a, b) => a.info.namespace.localeCompare(b.info.namespace));
    const filtered = alphabetical.filter(doc => groups.includes(doc.info.group));
    const grouped = filtered.slice().sort((a,b) => groups.indexOf(a.info.group) - groups.indexOf(b.info.group));
    
    return grouped.map(doc => {
        
        const elements = doc.elements.map(el => {
            return {
                type: el.type,
                name: el.name,
                brief: parseHtml(el.brief),
                description: parseHtml(el.description),
                parameters: el.parameters.map(p => {
                    const ext = parseName(p.name);
                    return {
                        name: ext.name,
                        type: parseType(p.doc, userTypeMap),
                        doc: parseHtml(p.doc, true),
                        optional: ext.optional
                    };
                }),
                returnvalues: el.returnvalues.map(r => {
                    const ext = parseName(r.name);
                    return {
                        name: ext.name,
                        type: parseType(r.doc, userTypeMap),
                        doc: parseHtml(r.doc, true),
                        optional: ext.optional
                    };
                }),
            };
        });

        const info: schema.IDocInfo = {
            group: doc.info.group,
            namespace: inNamespace(doc) ? doc.info.namespace : "",
            description: parseHtml(doc.info.description)
        };

        return { info, elements };
    });
}
