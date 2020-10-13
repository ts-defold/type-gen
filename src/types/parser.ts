
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

function parseType(input: string): schema.EDocParamType {
    const result = /.*<span class="type">(.+)<\/span>/.exec(input);
    const type = result && result.length > 1 ? result[1] : "";
    const paramType = Object.fromEntries(Object.entries(schema.EDocParamType).map(([key, value]) => [value, key]));
    
    return paramType[type] ? paramType[type] as schema.EDocParamType : schema.EDocParamType.Unknown;
}

function parseName(input: string): { name: string, optional: boolean } {
    const maybeOptional = /\[(.+)\]/.exec(input);
    const optional = maybeOptional && maybeOptional?.length > 1 ? true : false;
    const rawName = optional && maybeOptional ? maybeOptional[1] : input;
    const name = rawName.replace(/^[^a-zA-Z_$]|[^0-9a-zA-Z_$]/g, "_");

    return { name, optional };
}

export function parse(input: Array<schema.IDocJson>, groups: Array<schema.EDocGroup> = [schema.EDocGroup.System, schema.EDocGroup.Script, schema.EDocGroup.Components, schema.EDocGroup.Extensions]): Array<schema.IDocJson> {
    
    const docs = input
        .filter(doc => groups.includes(doc.info.group))
        .sort((a,b) => groups.indexOf(a.info.group) - groups.indexOf(b.info.group));
    
    return docs.map(doc => {
        
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
                        type: parseType(p.doc),
                        doc: parseHtml(p.doc, true),
                        optional: ext.optional
                    };
                }),
                returnvalues: el.returnvalues.map(r => {
                    const ext = parseName(r.name);
                    return {
                        name: ext.name,
                        type: parseType(r.doc),
                        doc: parseHtml(r.doc, true),
                        optional: ext.optional
                    };
                }),
            };
        });

        const info: schema.IDocInfo = {
            group: doc.info.group,
            namespace: elements.find(e => e.name.startsWith(doc.info.namespace)) ? doc.info.namespace : "",
            description: parseHtml(doc.info.description)
        };

        return { info, elements };
    });
}
