export declare enum EDocGroup {
    System = "SYSTEM",
    Script = "SCRIPT",
    Components = "COMPONENTS",
    Extensions = "EXTENSIONS"
}
export declare enum EDocElemType {
    Variable = "VARIABLE",
    Message = "MESSAGE",
    Property = "PROPERTY",
    Function = "FUNCTION"
}
export declare enum EDocParamType {
    Table = "table",
    Object = "object",
    Constant = "constant",
    Number = "number",
    String = "string",
    Boolean = "boolean",
    Hash = "hash",
    Url = "url",
    Node = "node",
    Buffer = "buffer",
    BufferStream = "bufferstream",
    Vector3 = "vmath.vector3",
    Vector4 = "vmath.vector4",
    Matrix4 = "vmath.matrix4",
    Quaternion = "vmath.quaternion",
    NumberArray = "Array<number>",
    StringArray = "Array<string>",
    Void = "void",
    Any = "any",
    LuaUserdata = "LuaUserdata",
    Unknown = ""
}
export declare const typeMap: Record<string, EDocParamType>;
export declare const reverseTypeMap: {
    [k: string]: string;
};
export interface IDocParam {
    name: string;
    type: EDocParamType[];
    doc: string;
    optional: boolean;
}
export interface IDocTypeDecl {
    name: string;
    unions: Array<EDocParamType>;
    intersections: Array<EDocParamType>;
    definition: Record<string, EDocParamType>;
}
export interface IDocTypes {
    namespace: string;
    types: Array<IDocTypeDecl>;
}
export interface IDocInfo {
    group: EDocGroup;
    namespace: string;
    description: string;
    name?: string;
}
export interface IDocElement {
    type: EDocElemType;
    name: string;
    brief: string;
    description: string;
    parameters: Array<IDocParam>;
    returnvalues: Array<IDocParam>;
}
export interface IDocJson {
    info: IDocInfo;
    elements: Array<IDocElement>;
}
