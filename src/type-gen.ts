import fetch from 'node-fetch';
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import * as schema from './types/schema';
import { parse } from './gen/parser';
import { generate } from './gen/generator';
import builtInTypes from './types/builtIns';
import overrides from './types/overrides';

interface DefoldInfo {
  version: string;
  sha1: string;
}

interface DefoldGitTag {
  ref?: string;
  tag?: string;
  object: {
    sha: string;
    url: string;
  };
}

export default async function (
  channel: string,
  version: string,
  project?: string,
  outFile?: string
): Promise<void> {
  // Pull down latest release info
  channel = ['stable', 'beta', 'alpha'].includes(channel) ? channel : 'stable';
  const info: DefoldInfo = await (
    await fetch(`http://d.defold.com/${channel}/info.json`)
  ).json();

  // Pull down archive info
  const archive = {
    sha: info.sha1,
    version: version === 'latest' ? info.version : version,
  };
  const tag =
    channel === 'stable'
      ? `${archive.version}`
      : `${archive.version}-${channel}`;
  const ref = await fetch(
    `https://api.github.com/repos/defold/defold/git/ref/tags/${tag}`
  );
  if (ref.status == 200) {
    const refInfo: DefoldGitTag = await ref.json();
    const tagInfo: DefoldGitTag = await (
      await fetch(refInfo.object.url)
    ).json();
    archive.sha = tagInfo.object.sha;
  }

  // Download and extract the docs from the archive
  const req = await fetch(
    `http://d.defold.com/archive/${archive.sha}/engine/share/ref-doc.zip`
  );
  if (req.status != 200) {
    throw new Error(
      `Unable to download archive for ${archive.version} (${archive.sha}): ${req.status}`
    );
  }

  const zip = new AdmZip(await req.buffer());
  const docs = zip
    .getEntries()
    .filter((entry) => entry.name.endsWith('_doc.json'))
    .map(
      (entry) => JSON.parse(entry.getData().toString('utf8')) as schema.IDocJson
    );

  // collect docs from project dependencies
  if (project) {
    const absPath = path.join(
      process.env.INIT_CWD ?? process.cwd(),
      project ? project : './app/game.project'
    );
    if (
      await new Promise((r) =>
        fs.access(absPath, fs.constants.F_OK, (e) => r(!e))
      )
    ) {
      const iniData = await fs.promises.readFile(absPath, 'utf8');
      const deps = iniData
        .split('\n')
        .filter((l) => l.startsWith('dependencies'))
        .map((dep) => {
          return dep.split('=')[1].trim();
        });

      docs.push(
        ...(
          await Promise.all(
            deps.map(async (dep) => {
              const req = await fetch(dep);
              const zip = new AdmZip(await req.buffer());
              return zip
                .getEntries()
                .filter((entry) => entry.name.endsWith('.script_api'))
                .map<schema.IDocYaml>(
                  (entry) => yaml.parse(entry.getData().toString('utf8'))[0]
                )
                .map<schema.IDocJson>((api) => ({
                  info: {
                    group: schema.EDocGroup.Extensions,
                    namespace: api.name,
                    name: api.name,
                    description: api.desc,
                  },
                  elements: api.members.map<schema.IDocElement>((m) => ({
                    name: `${api.name}.${m.name}`,
                    type:
                      m.type === 'function'
                        ? schema.EDocElemType.Function
                        : schema.EDocElemType.Variable,
                    brief: '',
                    description: m.desc,
                    parameters: m.parameters
                      ? m.parameters.map((p) => ({
                          name: p.name,
                          types: [
                            schema.typeMap?.[p.type] ??
                              schema.EDocParamType.Any,
                          ],
                          doc: p.desc,
                          optional: p.optional === true,
                        }))
                      : [],
                    returnvalues: m.returns
                      ? m.returns.map((r) => ({
                          name: r.name ?? '',
                          types: [
                            schema.typeMap?.[r.type] ??
                              schema.EDocParamType.Any,
                          ],
                          doc: r.desc,
                          optional: false,
                        }))
                      : [],
                  })),
                }));
            })
          )
        ).flat()
      );
    }
  }

  // Parse and Generate
  const parsedDocs = parse(docs, [
    { group: schema.EDocGroup.Lua, include: ['socket'] },
    { group: schema.EDocGroup.System },
    { group: schema.EDocGroup.Script },
    { group: schema.EDocGroup.Components },
    { group: schema.EDocGroup.Extensions },
  ]);
  const output = generate(
    parsedDocs,
    { channel, tag: archive.version, sha1: archive.sha },
    builtInTypes,
    overrides
  );

  await fs.promises.writeFile(
    path.join(
      process.env.INIT_CWD ?? process.cwd(),
      outFile ? outFile : 'index.d.ts'
    ),
    output
  );
}
