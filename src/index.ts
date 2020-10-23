import yargs from "yargs";
import gen from "./type-gen";

/* package.json
"ts-defold": {
    "channel": "stable",
    "api": "latest",
    "output": "index.d.ts"
  }
*/

yargs.scriptName("type-gen")
    .options({
        "channel": { describe: "Release channel [stable | beta | alpha]", type: "string" },
        "api": { describe: "API version [latest | x.x.x]", type: "string" },
    })
    .version()
    .command("$0 [outFile]", "Generate types for defold", () => {/* do nothing */}, async (argv) => {
        const channel = process.env.npm_package_ts_defold_channel ? process.env.npm_package_ts_defold_channel : argv.channel ? argv.channel : "stable";
        const api = process.env.npm_package_ts_defold_api ? process.env.npm_package_ts_defold_api : argv.api ? argv.api : "latest";
        const outFIle = process.env.npm_package_ts_defold_output ?  process.env.npm_package_ts_defold_output : argv._[1] ? argv._[1] : "index.d.ts";
        return gen(channel, api ? api : "latest", outFIle);
    })
    .help()
    .argv;