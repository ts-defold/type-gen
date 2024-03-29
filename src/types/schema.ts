export enum EDocGroup {
  System = 'SYSTEM',
  Script = 'SCRIPT',
  Components = 'COMPONENTS',
  Extensions = 'EXTENSIONS',
  Lua = 'LUA STANDARD LIBS',
}

export enum EDocElemType {
  Variable = 'VARIABLE',
  Message = 'MESSAGE',
  Property = 'PROPERTY',
  Function = 'FUNCTION',
}

export enum EDocParamType {
  Table = 'table',
  Object = 'object',
  Constant = 'constant',
  Number = 'number',
  String = 'string',
  Boolean = 'boolean',
  Hash = 'hash',
  Url = 'url',
  Node = 'node',
  Buffer = 'buffer',
  BufferStream = 'bufferstream',
  Vector3 = 'vmath.vector3',
  Vector4 = 'vmath.vector4',
  Matrix4 = 'vmath.matrix4',
  Quaternion = 'vmath.quaternion',
  NumberArray = 'Array<number>',
  StringArray = 'Array<string>',
  Void = 'void',
  Any = 'any',
  LuaUserdata = 'LuaUserdata',
  Unknown = '',
}

export const typeMap: Record<string, EDocParamType> = {
  table: EDocParamType.Table,
  object: EDocParamType.Object,
  constant: EDocParamType.Constant,
  number: EDocParamType.Number,
  string: EDocParamType.String,
  boolean: EDocParamType.Boolean,
  hash: EDocParamType.Hash,
  url: EDocParamType.Url,
  node: EDocParamType.Node,
  buffer: EDocParamType.Buffer,
  bufferstream: EDocParamType.BufferStream,
  'vmath.vector3': EDocParamType.Vector3,
  vector3: EDocParamType.Vector3,
  'vmath.vector4': EDocParamType.Vector4,
  vector4: EDocParamType.Vector4,
  'vmath.matrix4': EDocParamType.Matrix4,
  matrix4: EDocParamType.Matrix4,
  'vmath.quaternion': EDocParamType.Quaternion,
  quaternion: EDocParamType.Quaternion,
  quatertion: EDocParamType.Quaternion, // typo in docs [defold/defold #5278]
  quat: EDocParamType.Quaternion,
  'Array<number>': EDocParamType.NumberArray,
  'Array<string>': EDocParamType.StringArray,
  void: EDocParamType.Void,
  any: EDocParamType.Any,
  '': EDocParamType.Unknown,
};

export const reverseTypeMap = Object.fromEntries(
  Object.entries(EDocParamType).map(([key, value]) => [value, key])
);

export interface IDocGroupFilter {
  group: EDocGroup;
  include?: string[];
  exclude?: string[];
}

export interface IDocParam {
  name: string;
  types: EDocParamType[];
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

export interface IDocYamlEntry {
  name: string;
  desc: string;
  type: string;
}
export interface IDocYaml extends IDocYamlEntry {
  members: Array<
    IDocYamlEntry & {
      examples: Array<string>;
      parameters?: Array<
        IDocYamlEntry & {
          optional?: boolean;
        }
      >;
      returns?: Array<{
        name?: string;
        desc: string;
        type: string;
      }>;
    }
  >;
}
