#!/usr/bin/env node
'use strict';

var require$$0 = require('got');
var require$$1 = require('stream');
var require$$2 = require('fs');
var require$$3 = require('path');
var unzipper_1 = require('unzipper');
var util_1 = require('util');
var tmp_promise_1 = require('tmp-promise');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
var require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);
var require$$3__default = /*#__PURE__*/_interopDefaultLegacy(require$$3);
var unzipper_1__default = /*#__PURE__*/_interopDefaultLegacy(unzipper_1);
var util_1__default = /*#__PURE__*/_interopDefaultLegacy(util_1);
var tmp_promise_1__default = /*#__PURE__*/_interopDefaultLegacy(tmp_promise_1);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var schema = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.EDocParamType = exports.EDocElemType = exports.EDocGroup = void 0;
var EDocGroup;
(function (EDocGroup) {
    EDocGroup["System"] = "SYSTEM";
    EDocGroup["Script"] = "SCRIPT";
    EDocGroup["Components"] = "COMPONENTS";
    EDocGroup["Extensions"] = "EXTENSIONS";
})(EDocGroup = exports.EDocGroup || (exports.EDocGroup = {}));
var EDocElemType;
(function (EDocElemType) {
    EDocElemType["Variable"] = "VARIABLE";
    EDocElemType["Message"] = "MESSAGE";
    EDocElemType["Property"] = "PROPERTY";
    EDocElemType["Function"] = "FUNCTION";
})(EDocElemType = exports.EDocElemType || (exports.EDocElemType = {}));
var EDocParamType;
(function (EDocParamType) {
    EDocParamType["Table"] = "table";
    EDocParamType["Object"] = "object";
    EDocParamType["Constant"] = "constant";
    EDocParamType["Number"] = "number";
    EDocParamType["String"] = "string";
    EDocParamType["Boolean"] = "boolean";
    EDocParamType["Hash"] = "hash";
    EDocParamType["Url"] = "url";
    EDocParamType["Node"] = "node";
    EDocParamType["Buffer"] = "buffer";
    EDocParamType["BufferStream"] = "bufferstream";
    EDocParamType["Vector3"] = "vmath.vector3";
    EDocParamType["Vector4"] = "vmath.vector4";
    EDocParamType["Matrix4"] = "vmath.matrix4";
    EDocParamType["Quaternion"] = "vmath.quaternion";
    EDocParamType["Void"] = "void";
    EDocParamType["Any"] = "any";
    EDocParamType["Unknown"] = "";
})(EDocParamType = exports.EDocParamType || (exports.EDocParamType = {}));

});

var parser = createCommonjsModule(function (module, exports) {
// parser expects an array of json objects already serialized from disk
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
// When parsing we should only accept things we have types for in our typeMap and emit to the log if we come accross a missing type
// Each doc Must have an elements [] to parse
// We need to translate the docs to js doc format above each call
const schema$1 = __importStar(schema);
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
function parseType(input) {
    const result = /.*<span class="type">(.+)<\/span>/.exec(input);
    const type = result && result.length > 1 ? result[1] : "";
    const paramType = Object.fromEntries(Object.entries(schema$1.EDocParamType).map(([key, value]) => [value, key]));
    return paramType[type] ? paramType[type] : schema$1.EDocParamType.Unknown;
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
        if (e.type == schema$1.EDocElemType.Function) {
            hasFunction = true;
            return e.name.startsWith(doc.info.namespace);
        }
    });
    return !hasFunction || funcNamespace;
}
function parse(input, groups = [schema$1.EDocGroup.System, schema$1.EDocGroup.Script, schema$1.EDocGroup.Components, schema$1.EDocGroup.Extensions]) {
    const docs = input
        .filter(doc => groups.includes(doc.info.group))
        .sort((a, b) => groups.indexOf(a.info.group) - groups.indexOf(b.info.group));
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
        const info = {
            group: doc.info.group,
            namespace: inNamespace(doc) ? doc.info.namespace : "",
            description: parseHtml(doc.info.description)
        };
        return { info, elements };
    });
}
exports.parse = parse;

});

var generator = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const schema$1 = __importStar(schema);
function comment(input) {
    let out = '\t' + `/**` + '\n';
    input.split('\n').forEach(line => {
        out += '\t' + `* ${line}` + '\n';
    });
    out += '\t' + `*/` + '\n';
    return out;
}
function docs(input, TAB = '\t') {
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
function type(type) {
    if (type == schema$1.EDocParamType.Unknown)
        return schema$1.EDocParamType.Any;
    if (type == schema$1.EDocParamType.Table)
        return schema$1.EDocParamType.Any;
    if (type === undefined || type == "constant")
        return schema$1.EDocParamType.Any; // Not certain what translates into undefined yet
    return type;
}
function isReserved(name) {
    const reserved = ["delete"];
    return reserved.includes(name) ? { alt: name + '$', name } : null;
}
function ensureUnique(set, e) {
    if (!set.has(e.name)) {
        set.set(e.name, 0);
        return e;
    }
    const count = set.get(e.name);
    set.set(e.name, (count ? count : 0) + 1);
    return Object.assign({}, e, { name: `${e.name}${set.get(e.name)}` });
}
function hr() {
    return `// =^..^=   =^..^=   =^..^=    =^..^=    =^..^=    =^..^=    =^..^= //` + '\n\n';
}
function generate(input, info, types) {
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
            if (t.namespace)
                output += '\n' + `declare namespace ${t.namespace} {` + '\n';
            const tab = t.namespace ? '\t' : '';
            const exp = t.namespace ? "export" : "declare";
            t.types.forEach(d => {
                const unionOrIntersect = d.unions.length ? `${d.unions.join(' | ')} ` : d.intersection ? `${d.intersection} & ` : "";
                output += '\n';
                output += tab + `${exp} type ${d.name} = ${unionOrIntersect}{` + '\n';
                for (const k in d.definition) {
                    output += tab + '\t' + `${k}: ${type(d.definition[k])},` + '\n';
                }
                output += tab + `}` + '\n';
            });
            if (t.namespace)
                output += `}` + '\n';
        });
    }
    output += hr();
    // Globals to the front
    const globals = input.filter(i => i.info.namespace === "");
    globals.forEach(g => input.splice(input.indexOf(g), 1));
    const sorted = globals.concat(input);
    // strip empty modules
    const printable = [schema$1.EDocElemType.Variable, schema$1.EDocElemType.Message, schema$1.EDocElemType.Function];
    const modules = sorted.filter(m => {
        const el = m.elements.find(e => printable.includes(e.type));
        if (el)
            return m;
    });
    // Modules
    modules.forEach(i => {
        const TAB = i.info.namespace ? '\t' : '';
        const exp = i.info.namespace ? "export" : "declare";
        output += '\n';
        if (i.info.namespace)
            output += `declare namespace ${i.info.namespace} {` + '\n';
        const elements = i.elements.sort((a, b) => Object.keys(schema$1.EDocElemType).indexOf(a.type) - Object.keys(schema$1.EDocElemType).indexOf(b.type));
        elements.forEach(e => {
            const name = e.name.replace(`${i.info.namespace}.`, "");
            output += '\n';
            switch (e.type) {
                case schema$1.EDocElemType.Variable:
                    {
                        output += comment(e.brief);
                        output += TAB + `${exp} let ${name}: ${schema$1.EDocParamType.Any}` + '\n';
                    }
                    break;
                case schema$1.EDocElemType.Message:
                    {
                        output += comment(e.description);
                        output += TAB + `${exp} type ${name} = "${name}"` + '\n';
                    }
                    break;
                case schema$1.EDocElemType.Property:
                    {
                        output += comment(e.description);
                        output += TAB + `${exp} let ${name}: ${schema$1.EDocParamType.Any}` + '\n';
                    }
                    break;
                case schema$1.EDocElemType.Function:
                    {
                        const scriptFunctions = ["final", "init", "on_input", "on_message", "on_reload", "update"];
                        const reserved = isReserved(name);
                        const funcName = reserved ? reserved.alt : name;
                        const funcExp = reserved ? "" : exp;
                        if (i.info.group == schema$1.EDocGroup.System && scriptFunctions.includes(funcName)) {
                            output.slice(0, -1); // skip reserved functions
                        }
                        else {
                            const set = new Map();
                            const params = e.parameters.map(p => ensureUnique(set, p)).map(p => `${p.name}${p.optional ? "?" : ""}: ${type(Object.values(schema$1.EDocParamType)[Object.keys(schema$1.EDocParamType).indexOf(p.type)])}`).join(', ');
                            const retValue = e.returnvalues.length > 0 ? e.returnvalues[0].type : Object.keys(schema$1.EDocParamType)[Object.values(schema$1.EDocParamType).indexOf(schema$1.EDocParamType.Void)];
                            const retOptional = e.returnvalues.length > 0 ? e.returnvalues[0].optional : false;
                            output += docs(e, TAB);
                            output += TAB + `${funcExp} function ${funcName}(${params}): ${type(Object.values(schema$1.EDocParamType)[Object.keys(schema$1.EDocParamType).indexOf(retValue)])}${retOptional ? " | undefined" : ""}` + '\n';
                            if (reserved)
                                output += '\t' + `export { ${reserved.alt} as ${reserved.name} }` + '\n';
                        }
                    }
                    break;
            }
        });
        output += '\n';
        if (i.info.namespace)
            output += `}` + '\n';
        output += hr();
    });
    return output;
}
exports.generate = generate;

});

var builtIns = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const types = [
    {
        namespace: "",
        types: [
            {
                name: "hash",
                unions: [],
                intersection: schema.EDocParamType.Unknown,
                definition: {}
            },
            {
                name: "url",
                unions: [],
                intersection: schema.EDocParamType.Unknown,
                definition: {}
            },
            {
                name: "node",
                unions: [],
                intersection: schema.EDocParamType.Unknown,
                definition: {}
            },
            {
                name: "buffer",
                unions: [],
                intersection: schema.EDocParamType.Unknown,
                definition: {}
            },
            {
                name: "bufferstream",
                unions: [],
                intersection: schema.EDocParamType.Unknown,
                definition: {}
            }
        ]
    },
    {
        namespace: "vmath",
        types: [
            {
                name: "vector3",
                unions: [],
                intersection: schema.EDocParamType.Number,
                definition: {
                    x: schema.EDocParamType.Number,
                    y: schema.EDocParamType.Number,
                    z: schema.EDocParamType.Number
                }
            },
            {
                name: "vector4",
                unions: [],
                intersection: schema.EDocParamType.Number,
                definition: {
                    x: schema.EDocParamType.Number,
                    y: schema.EDocParamType.Number,
                    z: schema.EDocParamType.Number,
                    w: schema.EDocParamType.Number
                }
            },
            {
                name: "matrix4",
                unions: [],
                intersection: schema.EDocParamType.Number,
                definition: {
                    c0: schema.EDocParamType.Vector4,
                    c1: schema.EDocParamType.Vector4,
                    c2: schema.EDocParamType.Vector4,
                    c3: schema.EDocParamType.Vector4,
                    m01: schema.EDocParamType.Number,
                    m02: schema.EDocParamType.Number,
                    m03: schema.EDocParamType.Number,
                    m04: schema.EDocParamType.Number,
                    m11: schema.EDocParamType.Number,
                    m12: schema.EDocParamType.Number,
                    m13: schema.EDocParamType.Number,
                    m14: schema.EDocParamType.Number,
                    m21: schema.EDocParamType.Number,
                    m22: schema.EDocParamType.Number,
                    m23: schema.EDocParamType.Number,
                    m24: schema.EDocParamType.Number,
                    m31: schema.EDocParamType.Number,
                    m32: schema.EDocParamType.Number,
                    m33: schema.EDocParamType.Number,
                    m34: schema.EDocParamType.Number,
                }
            },
            {
                name: "quaternion",
                unions: [],
                intersection: schema.EDocParamType.Number,
                definition: {
                    x: schema.EDocParamType.Number,
                    y: schema.EDocParamType.Number,
                    z: schema.EDocParamType.Number,
                    w: schema.EDocParamType.Number
                }
            },
        ]
    }
];
exports.default = types;

});

var dist = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require$$0__default['default']);
const stream_1 = __importDefault(require$$1__default['default']);
const fs_1 = __importDefault(require$$2__default['default']);
const path_1 = __importDefault(require$$3__default['default']);






const builtIns_1 = __importDefault(builtIns);
const channel = "stable"; // "alpha" | "beta"
const out = "index.d.ts";
void (async () => {
    // Pull down latest release info
    const info = await got_1.default(`http://d.defold.com/${channel}/info.json`).json();
    // Pull down archive info
    const manifestData = await got_1.default(`http://d.defold.com/${channel}`);
    const matches = /\s*var model = ({.+});?/g.exec(manifestData.body);
    const archive = matches && matches.length > 1 ? JSON.parse(matches[1]).releases : {};
    // Determine what version of the docs to run type generator against, default to latest
    const a = archive.find(i => i.tag.includes( info.version));
    const sha1 = a ? a.sha1 : info.sha1;
    const tag = a ? a.tag : info.version;
    // download docs from http://d.defold.com/archive/${target}/engine/share/ref-doc.zip, and extract
    const dr = await tmp_promise_1__default['default'].dir();
    const pipeline = util_1__default['default'].promisify(stream_1.default.pipeline);
    await pipeline(got_1.default.stream(`http://d.defold.com/archive/${sha1}/engine/share/ref-doc.zip`), unzipper_1__default['default'].Extract({ path: dr.path }));
    // Load and parse all docs from disk
    const docs = [];
    const docPath = path_1.default.join(dr.path, "doc");
    for await (const d of await fs_1.default.promises.opendir(docPath)) {
        const entry = path_1.default.join(docPath, d.name);
        if (d.isFile() && d.name.endsWith("_doc.json")) {
            const docData = fs_1.default.promises.readFile(entry, 'utf8');
            const data = await docData;
            docs.push(JSON.parse(data.toString()));
        }
    }
    // Cleanup
    await fs_1.default.promises.rmdir(docPath, { recursive: true });
    await dr.cleanup();
    // Parse and Generate
    const parsedDocs = parser.parse(docs, [schema.EDocGroup.System, schema.EDocGroup.Script, schema.EDocGroup.Components, schema.EDocGroup.Extensions]);
    const output = generator.generate(parsedDocs, { channel, tag, sha1 }, builtIns_1.default);
    await fs_1.default.promises.writeFile(path_1.default.join(process.cwd(), out), output);
})();

});

var index = /*@__PURE__*/getDefaultExportFromCjs(dist);

module.exports = index;
