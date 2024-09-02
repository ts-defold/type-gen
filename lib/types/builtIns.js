"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
const types = [
    {
        namespace: '',
        types: [
            {
                name: 'hash',
                unions: [],
                intersections: [],
                definition: {},
            },
            {
                name: 'url',
                unions: [],
                intersections: [],
                definition: {
                    socket: schema_1.EDocParamType.Hash,
                    path: schema_1.EDocParamType.Hash,
                    fragment: schema_1.EDocParamType.Hash,
                },
            },
            {
                name: 'node',
                unions: [],
                intersections: [],
                definition: {},
            },
            {
                name: 'buffer',
                unions: [],
                intersections: [],
                definition: {},
            },
            {
                name: 'bufferstream',
                unions: [],
                intersections: [schema_1.EDocParamType.NumberArray, schema_1.EDocParamType.LuaUserdata],
                definition: {},
            },
        ],
    },
    {
        namespace: 'vmath',
        types: [
            {
                name: 'vector3',
                unions: [],
                intersections: [schema_1.EDocParamType.Number],
                definition: {
                    x: schema_1.EDocParamType.Number,
                    y: schema_1.EDocParamType.Number,
                    z: schema_1.EDocParamType.Number,
                },
            },
            {
                name: 'vector4',
                unions: [],
                intersections: [schema_1.EDocParamType.Number],
                definition: {
                    x: schema_1.EDocParamType.Number,
                    y: schema_1.EDocParamType.Number,
                    z: schema_1.EDocParamType.Number,
                    w: schema_1.EDocParamType.Number,
                },
            },
            {
                name: 'matrix4',
                unions: [],
                intersections: [schema_1.EDocParamType.Number],
                definition: {
                    c0: schema_1.EDocParamType.Vector4,
                    c1: schema_1.EDocParamType.Vector4,
                    c2: schema_1.EDocParamType.Vector4,
                    c3: schema_1.EDocParamType.Vector4,
                    m01: schema_1.EDocParamType.Number,
                    m02: schema_1.EDocParamType.Number,
                    m03: schema_1.EDocParamType.Number,
                    m04: schema_1.EDocParamType.Number,
                    m11: schema_1.EDocParamType.Number,
                    m12: schema_1.EDocParamType.Number,
                    m13: schema_1.EDocParamType.Number,
                    m14: schema_1.EDocParamType.Number,
                    m21: schema_1.EDocParamType.Number,
                    m22: schema_1.EDocParamType.Number,
                    m23: schema_1.EDocParamType.Number,
                    m24: schema_1.EDocParamType.Number,
                    m31: schema_1.EDocParamType.Number,
                    m32: schema_1.EDocParamType.Number,
                    m33: schema_1.EDocParamType.Number,
                    m34: schema_1.EDocParamType.Number,
                },
            },
            {
                name: 'quaternion',
                unions: [],
                intersections: [schema_1.EDocParamType.Number],
                definition: {
                    x: schema_1.EDocParamType.Number,
                    y: schema_1.EDocParamType.Number,
                    z: schema_1.EDocParamType.Number,
                    w: schema_1.EDocParamType.Number,
                },
            },
        ],
    },
];
exports.default = types;
//# sourceMappingURL=builtIns.js.map