"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const stream_1 = __importDefault(require("stream"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const unzipper_1 = require("unzipper");
const util_1 = require("util");
const tmp_promise_1 = require("tmp-promise");
const schema_1 = require("./types/schema");
const parser_1 = require("./gen/parser");
const generator_1 = require("./gen/generator");
const builtIns_1 = __importDefault(require("./types/builtIns"));
const overrides_1 = __importDefault(require("./types/overrides"));
async function default_1(channel, version, outFile) {
    // Pull down latest release info
    channel = ["stable", "beta", "alpha"].includes(channel) ? channel : "stable";
    const info = await got_1.default(`http://d.defold.com/${channel}/info.json`).json();
    // Pull down archive info
    const manifestData = await got_1.default(`http://d.defold.com/${channel}`);
    const matches = /\s*var model = ({.+});?/g.exec(manifestData.body);
    const archive = matches && matches.length > 1 ? JSON.parse(matches[1]).releases : {};
    // Determine what version of the docs to run type generator against, default to latest
    const a = archive.find(i => i.tag.includes(version ? version : info.version));
    const sha1 = a ? a.sha1 : info.sha1;
    const tag = a ? a.tag : info.version;
    // download docs from http://d.defold.com/archive/${target}/engine/share/ref-doc.zip, and extract
    const dr = await tmp_promise_1.dir();
    const pipeline = util_1.promisify(stream_1.default.pipeline);
    await pipeline(got_1.default.stream(`http://d.defold.com/archive/${sha1}/engine/share/ref-doc.zip`), unzipper_1.Extract({ path: dr.path }));
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
    const parsedDocs = parser_1.parse(docs, [schema_1.EDocGroup.System, schema_1.EDocGroup.Script, schema_1.EDocGroup.Components, schema_1.EDocGroup.Extensions]);
    const output = generator_1.generate(parsedDocs, { channel, tag, sha1 }, builtIns_1.default, overrides_1.default);
    await fs_1.default.promises.writeFile(path_1.default.join(process.cwd(), outFile ? outFile : "index.d.ts"), output);
}
exports.default = default_1;
;
//# sourceMappingURL=type-gen.js.map