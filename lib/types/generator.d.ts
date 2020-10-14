import * as schema from "./schema";
export interface GeneratorInfo {
    channel: string;
    tag: string;
    sha1: string;
}
export declare function generate(input: Array<schema.IDocJson>, info: GeneratorInfo, types?: Array<schema.IDocTypes>): string;
