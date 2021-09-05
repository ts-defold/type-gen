"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const type_gen_1 = __importDefault(require("./type-gen"));
/* package.json
"ts-defold": {
    "api": "latest",
    "channel": "stable",
    "output": "index.d.ts"
    "project" "./app/game.project"
  }
*/
yargs_1.default
    .scriptName('type-gen')
    .options({
    api: { describe: 'API version [latest | x.x.x]', type: 'string' },
    channel: {
        describe: 'Release channel [stable | beta | alpha]',
        type: 'string',
    },
    project: {
        describe: 'Relative path to Defold project file [./app/game.project]',
        type: 'string',
    },
})
    .version()
    .command('$0 [outFile]', 'Generate types for defold', () => {
    /* do nothing */
}, async (argv) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const api = (_b = (_a = process.env.npm_package_ts_defold_api) !== null && _a !== void 0 ? _a : argv.api) !== null && _b !== void 0 ? _b : 'latest';
    const channel = (_d = (_c = process.env.npm_package_ts_defold_channel) !== null && _c !== void 0 ? _c : argv.channel) !== null && _d !== void 0 ? _d : 'stable';
    const project = (_f = (_e = process.env.npm_package_ts_defold_project) !== null && _e !== void 0 ? _e : argv.project) !== null && _f !== void 0 ? _f : './app/game.project';
    const outFIle = (_h = (_g = process.env.npm_package_ts_defold_output) !== null && _g !== void 0 ? _g : argv._[1]) !== null && _h !== void 0 ? _h : 'index.d.ts';
    return type_gen_1.default(channel, api, project, outFIle);
})
    .help().argv;
//# sourceMappingURL=index.js.map