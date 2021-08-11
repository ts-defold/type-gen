import yargs from 'yargs';
import gen from './type-gen';

/* package.json
"ts-defold": {
    "api": "latest",
    "channel": "stable",
    "output": "index.d.ts"
    "project" "./app/game.project"
  }
*/

yargs
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
  .command(
    '$0 [outFile]',
    'Generate types for defold',
    () => {
      /* do nothing */
    },
    async (argv) => {
      const api = process.env.npm_package_ts_defold_api ?? argv.api ?? 'latest';
      const channel =
        process.env.npm_package_ts_defold_channel ?? argv.channel ?? 'stable';
      const project =
        process.env.npm_package_ts_defold_project ??
        argv.project ??
        './app/game.project';
      const outFIle =
        process.env.npm_package_ts_defold_output ?? argv._[1] ?? 'index.d.ts';

      return gen(channel, api, project, outFIle);
    }
  )
  .help().argv;
