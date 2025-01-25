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
        attention: '⚠',
        html5: '🌎',
        android: '🤖',
        ios: '📱',
        macos: '🍎',
        linux: '🐧',
    };
    const icon = (_a = /.*<span class="icon-(.*)">.*<\/span>/.exec(input)) === null || _a === void 0 ? void 0 : _a[1];
    return input
        .replace(/\\n<ul>/g, '')
        .replace(/.*<li>(.*)<\/li>/g, '- $1')
        .replace(/<\/?em>/g, '*')
        .replace(/<\/?code>/g, '`')
        .replace(/.*<span class="type">(.+)<\/span>(\s*)/g, isParam ? '' : '$1')
        .replace(/.*<span class="icon-(.*)">.*<\/span>/g, icon ? icons[icon] : '')
        .replace(/<.*?>/g, '');
}
function parseType(type, doc, typeMap) {
    const types = [];
    if (type) {
        const providedTypes = type.map((t) => {
            const key = typeMap[t];
            return schema.reverseTypeMap[key ? key : '']
                ? schema.reverseTypeMap[key ? key : '']
                : schema.EDocParamType.Unknown;
        });
        types.push(...providedTypes);
    }
    else if (doc) {
        const result = /.*<span class="type">(.+)<\/span>/.exec(doc);
        if (result && result.length > 1) {
            const inferredTypes = result[1]
                .split('|')
                .map((t) => t.trim())
                .map((t) => {
                const key = typeMap[t];
                return schema.reverseTypeMap[key ? key : '']
                    ? schema.reverseTypeMap[key ? key : '']
                    : schema.EDocParamType.Unknown;
            });
            types.push(...inferredTypes);
        }
    }
    return types;
}
function parseName(input, description) {
    const maybeOptional = /\[(.+)\]/.exec(input);
    const optional = maybeOptional && (maybeOptional === null || maybeOptional === void 0 ? void 0 : maybeOptional.length) > 1 ? true : false;
    const rawName = optional && maybeOptional ? maybeOptional[1] : input;
    const name = rawName
        .replace(/^[^a-zA-Z_$]|[^0-9a-zA-Z_$]/g, '_')
        // Replace reserved keyword `var`
        .replace('var', 'v');
    const altOptional = description.startsWith('optional');
    return { name, optional: optional || altOptional };
}
function inNamespace(doc) {
    let hasFunction = false;
    const funcNamespace = undefined !=
        doc.elements.find((e) => {
            if (e.type == schema.EDocElemType.Function) {
                hasFunction = true;
                return e.name.startsWith(doc.info.namespace);
            }
        });
    return !hasFunction || funcNamespace;
}
const defaults = [
    { group: schema.EDocGroup.System },
    { group: schema.EDocGroup.Script },
    { group: schema.EDocGroup.Components },
    { group: schema.EDocGroup.Extensions },
    { group: schema.EDocGroup.Lua, includes: ['socket'] },
];
// Groups are not guaranteed to be set in the Defold API
// Instead, we include some APIs by checking their name
const includedApisByName = ['liveupdate'];
function parse(input, groups = defaults, typeMap) {
    const userTypeMap = Object.assign(schema.typeMap, typeMap || {});
    const alphabetical = input
        .slice()
        .sort((a, b) => a.info.namespace.localeCompare(b.info.namespace));
    const filtered = alphabetical.filter((doc) => {
        if (doc.info.name && includedApisByName.includes(doc.info.name)) {
            return true;
        }
        const group = groups.find((g) => g.group == doc.info.group);
        if (group) {
            if (group.include) {
                return group.include.includes(doc.info.namespace);
            }
            else if (group.exclude) {
                return !group.exclude.includes(doc.info.namespace);
            }
            return true;
        }
        return false;
    });
    const grouped = filtered
        .slice()
        .sort((a, b) => groups.findIndex((g) => g.group === a.info.group) -
        groups.findIndex((g) => g.group === b.info.group));
    return grouped.map((doc) => {
        const elements = doc.elements.map((el) => {
            return {
                type: el.type,
                name: el.name,
                brief: parseHtml(el.brief),
                description: parseHtml(el.description),
                parameters: el.parameters.map((p) => {
                    const ext = parseName(p.name, p.doc);
                    return {
                        name: ext.name,
                        types: parseType(p.types, p.doc, userTypeMap),
                        doc: parseHtml(p.doc, true),
                        optional: ext.optional,
                    };
                }),
                returnvalues: el.returnvalues.map((r) => {
                    const ext = parseName(r.name, '');
                    return {
                        name: ext.name,
                        types: parseType(r.types, r.doc, userTypeMap),
                        doc: parseHtml(r.doc, true),
                        optional: ext.optional,
                    };
                }),
            };
        });
        const info = {
            group: doc.info.group,
            namespace: inNamespace(doc) ? doc.info.namespace : '',
            description: parseHtml(doc.info.description),
        };
        return { info, elements };
    });
}
exports.parse = parse;
//# sourceMappingURL=parser.js.map