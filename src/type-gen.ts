import got from "got";
import stream from "stream";
import fs from "fs";
import path from "path";
import { Extract } from "unzipper";
import { promisify } from 'util';
import { dir } from 'tmp-promise';
import { IDocJson, EDocGroup  } from "./types/schema";
import { parse } from "./gen/parser";
import { generate } from "./gen/generator";
import builtInTypes from "./types/builtIns";
import overrides from "./types/overrides";

interface DefoldInfo {
    version: string,
    sha1: string
}

interface DefoldArchive {
    abbrevsha1: string,
    date: string,
    sha1: string,
    tag: string
}

export default async function (channel: string, version: string, outFile?:string) {
    // Pull down latest release info
    channel = ["stable", "beta", "alpha"].includes(channel) ? channel : "stable";
    const info: DefoldInfo = await got(`http://d.defold.com/${channel}/info.json`).json();

    // Pull down archive info
    const manifestData = await got(`http://d.defold.com/${channel}`);
    const matches = /\s*var model = ({.+});?/g.exec(manifestData.body);
    const archive: Array<DefoldArchive> = matches && matches.length > 1 ? JSON.parse(matches[1]).releases : {};

    // Determine what version of the docs to run type generator against, default to latest
    const a = archive.find(i => i.tag.includes(version ? version : info.version));
    const sha1 = a ? a.sha1 : info.sha1;
    const tag = a ? a.tag : info.version;
    
    // download docs from http://d.defold.com/archive/${target}/engine/share/ref-doc.zip, and extract
    const dr = await dir();
    const pipeline = promisify(stream.pipeline);
    await pipeline(
        got.stream(`http://d.defold.com/archive/${sha1}/engine/share/ref-doc.zip`),
        Extract({ path: dr.path })
    );

    // Load and parse all docs from disk
    const docs: Array<IDocJson> = [];
    const docPath = path.join(dr.path, "doc");
    for await (const d of await fs.promises.opendir(docPath)) {
        const entry = path.join(docPath, d.name);
        if (d.isFile() && d.name.endsWith("_doc.json")) {
            const docData = fs.promises.readFile(entry, 'utf8');
            const data = await docData;
            docs.push(JSON.parse(data.toString()));
        }
    }

    // Cleanup
    await fs.promises.rmdir(docPath, {recursive: true});
    await dr.cleanup();

    // Parse and Generate
    const parsedDocs = parse(docs, [EDocGroup.System, EDocGroup.Script, EDocGroup.Components, EDocGroup.Extensions]);
    const output = generate(parsedDocs, { channel, tag, sha1 }, builtInTypes, overrides);

    await fs.promises.writeFile(path.join(process.cwd(), outFile ? outFile : "index.d.ts"), output);
};
