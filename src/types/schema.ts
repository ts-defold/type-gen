export enum EDocGroup {
    Script = "SCRIPT",
    Components = "COMPONENTS",
    Extensions = "EXTENSIONS",
}

export enum EDocElemType {
    Variable = "VARIABLE",
    Message = "MESSAGE",
    Property = "PROPERTY",
    Function = "FUNCTION",
}

export enum EDocParamType {
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
    Void = "void",
    Any = "any",
    Unknown = ""
}

export interface IDocParam {
    name: string,
    type: EDocParamType,
    doc: string,
    optional: boolean
}

export interface IDocTypeDecl {
    name: string,
    unions: Array<EDocParamType>,
    intersection: EDocParamType,
    definition: Record<string, EDocParamType>,
}

export interface IDocTypes {
    namespace: string,
    types: Array<IDocTypeDecl>
}

export interface IDocInfo {
    group: EDocGroup,
    namespace: string,
    description: string,
}

export interface IDocElement {
    type: EDocElemType,
    name: string,
    brief: string,
    description: string,
    parameters: Array<IDocParam>,
    returnvalues: Array<IDocParam>
}

export interface IDocJson {
    info: IDocInfo,
    elements: Array<IDocElement>
}