import * as schema from "../types/schema";
export interface ParserOpts {
    log: unknown;
}
export declare function parse(input: Array<schema.IDocJson>, groups?: Array<schema.EDocGroup>, typeMap?: Record<string, schema.EDocParamType>): Array<schema.IDocJson>;
