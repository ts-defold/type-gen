"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const schema = __importStar(require("../types/schema"));
function parseHtml(input, isParam) {
    var _a;
    const icons = {
        "attention": "⚠",
        "html5": "🌎",
        "android": "🤖",
        "ios": "📱",
        "macos": "🍎",
        "linux": "🐧"
    };
    const icon = (_a = /.*<span class="icon-(.*)">.*<\/span>/.exec(input)) === null || _a === void 0 ? void 0 : _a[1];
    return input
        .replace(/\\n<ul>/g, "")
        .replace(/.*<li>(.*)<\/li>/g, "- $1")
        .replace(/<\/?em>/g, "*")
        .replace(/<\/?code>/g, "`")
        .replace(/.*<span class="type">(.+)<\/span>(\s*)/g, isParam ? "" : "$1")
        .replace(/.*<span class="icon-(.*)">.*<\/span>/g, icon ? icons[icon] : "")
        .replace(/<.*?>/g, "");
}
function parseType(input, typeMap) {
    const result = /.*<span class="type">(.+)<\/span>/.exec(input);
    const types = (result && result.length > 1 ? result[1] : "").split("|").map(t => t.trim()).map(t => {
        const key = typeMap[t];
        return schema.reverseTypeMap[key ? key : ""] ? schema.reverseTypeMap[key ? key : ""] : schema.EDocParamType.Unknown;
    });
    return types;
}
function parseName(input) {
    const maybeOptional = /\[(.+)\]/.exec(input);
    const optional = maybeOptional && (maybeOptional === null || maybeOptional === void 0 ? void 0 : maybeOptional.length) > 1 ? true : false;
    const rawName = optional && maybeOptional ? maybeOptional[1] : input;
    const name = rawName.replace(/^[^a-zA-Z_$]|[^0-9a-zA-Z_$]/g, "_");
    return { name, optional };
}
function inNamespace(doc) {
    let hasFunction = false;
    const funcNamespace = undefined != doc.elements.find(e => {
        if (e.type == schema.EDocElemType.Function) {
            hasFunction = true;
            return e.name.startsWith(doc.info.namespace);
        }
    });
    return !hasFunction || funcNamespace;
}
const defaults = [schema.EDocGroup.System, schema.EDocGroup.Script, schema.EDocGroup.Components, schema.EDocGroup.Extensions];
function parse(input, groups = defaults, typeMap) {
    const userTypeMap = Object.assign(schema.typeMap, typeMap || {});
    const alphabetical = input.slice().sort((a, b) => a.info.namespace.localeCompare(b.info.namespace));
    const filtered = alphabetical.filter(doc => groups.includes(doc.info.group));
    const grouped = filtered.slice().sort((a, b) => groups.indexOf(a.info.group) - groups.indexOf(b.info.group));
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
        const info = {
            group: doc.info.group,
            namespace: inNamespace(doc) ? doc.info.namespace : "",
            description: parseHtml(doc.info.description)
        };
        return { info, elements };
    });
}
exports.parse = parse;
//# sourceMappingURL=parser.js.map