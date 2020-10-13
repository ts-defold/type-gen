/// <reference types="node" />
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { exec } from "child_process";

const sh = promisify(exec);

void (async () => {
    const src = path.join(__dirname, "..", "dist", "build.js");
    const destDir = path.join(__dirname, "..", "bin");
    const dest = path.join(destDir, "build.js");
    
    // Copy our file to the bin folder and prepend the shebang
    const data = await fs.promises.readFile(src, 'utf8');

    const fd = await fs.promises.open(dest, 'w');
    try {
        await fd.write("#!/usr/bin/env node\n");
        await fd.write(data);
    } catch(e) {
        console.log((e as Error).message);
    }

    await fd.close();

    // Mark the file for add +x
    await sh(`cd ${destDir} && git add --chmod=+x build.js`);
})();