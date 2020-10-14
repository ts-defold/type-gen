import * as schema from "./schema";
export interface ParserOpts {
    log: unknown;
}
export declare function parse(input: Array<schema.IDocJson>, groups?: Array<schema.EDocGroup>): Array<schema.IDocJson>;
