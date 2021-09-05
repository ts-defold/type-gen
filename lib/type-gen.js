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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
const schema = __importStar(require("./types/schema"));
const parser_1 = require("./gen/parser");
const generator_1 = require("./gen/generator");
const builtIns_1 = __importDefault(require("./types/builtIns"));
const overrides_1 = __importDefault(require("./types/overrides"));
async function default_1(channel, version, project, outFile) {
    var _a, _b;
    // Pull down latest release info
    channel = ['stable', 'beta', 'alpha'].includes(channel) ? channel : 'stable';
    const info = await (await node_fetch_1.default(`http://d.defold.com/${channel}/info.json`)).json();
    // Pull down archive info
    const archive = {
        sha: info.sha1,
        version: version === 'latest' ? info.version : version,
    };
    const tag = channel === 'stable'
        ? `${archive.version}`
        : `${archive.version}-${channel}`;
    const ref = await node_fetch_1.default(`https://api.github.com/repos/defold/defold/git/ref/tags/${tag}`);
    if (ref.status == 200) {
        const refInfo = await ref.json();
        const tagInfo = await (await node_fetch_1.default(refInfo.object.url)).json();
        archive.sha = tagInfo.object.sha;
    }
    // Download and extract the docs from the archive
    const req = await node_fetch_1.default(`http://d.defold.com/archive/${archive.sha}/engine/share/ref-doc.zip`);
    if (req.status != 200) {
        throw new Error(`Unable to download archive for ${archive.version} (${archive.sha}): ${req.status}`);
    }
    const zip = new adm_zip_1.default(await req.buffer());
    const docs = zip
        .getEntries()
        .filter((entry) => entry.name.endsWith('_doc.json'))
        .map((entry) => JSON.parse(entry.getData().toString('utf8')));
    // collect docs from project dependencies
    if (project) {
        const absPath = path_1.default.join((_a = process.env.INIT_CWD) !== null && _a !== void 0 ? _a : process.cwd(), project ? project : './app/game.project');
        if (await new Promise((r) => fs_1.default.access(absPath, fs_1.default.constants.F_OK, (e) => r(!e)))) {
            const iniData = await fs_1.default.promises.readFile(absPath, 'utf8');
            const deps = iniData
                .split('\n')
                .filter((l) => l.startsWith('dependencies'))
                .map((dep) => {
                return dep.split('=')[1].trim();
            });
            docs.push(...(await Promise.all(deps.map(async (dep) => {
                const req = await node_fetch_1.default(dep);
                const zip = new adm_zip_1.default(await req.buffer());
                return zip
                    .getEntries()
                    .filter((entry) => entry.name.endsWith('.script_api'))
                    .map((entry) => yaml_1.default.parse(entry.getData().toString('utf8'))[0])
                    .map((api) => ({
                    info: {
                        group: schema.EDocGroup.Extensions,
                        namespace: api.name,
                        name: api.name,
                        description: api.desc,
                    },
                    elements: api.members.map((m) => ({
                        name: `${api.name}.${m.name}`,
                        type: m.type === 'function'
                            ? schema.EDocElemType.Function
                            : schema.EDocElemType.Variable,
                        brief: '',
                        description: m.desc,
                        parameters: m.parameters
                            ? m.parameters.map((p) => {
                                var _a, _b;
                                return ({
                                    name: p.name,
                                    types: [
                                        (_b = (_a = schema.typeMap) === null || _a === void 0 ? void 0 : _a[p.type]) !== null && _b !== void 0 ? _b : schema.EDocParamType.Any,
                                    ],
                                    doc: p.desc,
                                    optional: p.optional === true,
                                });
                            })
                            : [],
                        returnvalues: m.returns
                            ? m.returns.map((r) => {
                                var _a, _b, _c;
                                return ({
                                    name: (_a = r.name) !== null && _a !== void 0 ? _a : '',
                                    types: [
                                        (_c = (_b = schema.typeMap) === null || _b === void 0 ? void 0 : _b[r.type]) !== null && _c !== void 0 ? _c : schema.EDocParamType.Any,
                                    ],
                                    doc: r.desc,
                                    optional: false,
                                });
                            })
                            : [],
                    })),
                }));
            }))).flat());
        }
    }
    // Parse and Generate
    const parsedDocs = parser_1.parse(docs, [
        schema.EDocGroup.System,
        schema.EDocGroup.Script,
        schema.EDocGroup.Components,
        schema.EDocGroup.Extensions,
    ]);
    const output = generator_1.generate(parsedDocs, { channel, tag: archive.version, sha1: archive.sha }, builtIns_1.default, overrides_1.default);
    await fs_1.default.promises.writeFile(path_1.default.join((_b = process.env.INIT_CWD) !== null && _b !== void 0 ? _b : process.cwd(), outFile ? outFile : 'index.d.ts'), output);
}
exports.default = default_1;
//# sourceMappingURL=type-gen.js.map