"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const type_gen_1 = __importDefault(require("./type-gen"));
/* package.json
"ts-defold": {
    "channel": "stable",
    "api": "latest",
    "output": "index.d.ts"
  }
*/
yargs_1.default.scriptName("type-gen")
    .options({
    "channel": { describe: "Release channel [stable | beta | alpha]", type: "string" },
    "api": { describe: "API version [latest | x.x.x]", type: "string" },
})
    .version()
    .command("$0 [outFile]", "Generate types for defold", () => { }, async (argv) => {
    const channel = process.env.npm_package_ts_defold_channel ? process.env.npm_package_ts_defold_channel : argv.channel ? argv.channel : "stable";
    const api = process.env.npm_package_ts_defold_api ? process.env.npm_package_ts_defold_api : argv.api ? argv.api : "latest";
    const outFIle = process.env.npm_package_ts_defold_output ? process.env.npm_package_ts_defold_output : argv._[1] ? argv._[1] : "index.d.ts";
    return type_gen_1.default(channel, api ? api : "latest", outFIle);
})
    .help()
    .argv;
//# sourceMappingURL=index.js.map