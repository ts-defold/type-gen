import { IDocTypes, EDocParamType  } from "./schema";

const types: Array<IDocTypes> = [
    {
        namespace: "",
        types: [
            {
                name: "hash",
                unions: [],
                intersection: EDocParamType.Unknown,
                definition: {}
            },
            {
                name: "url",
                unions: [],
                intersection: EDocParamType.Unknown,
                definition: {}
            },
            {
                name: "node",
                unions: [],
                intersection: EDocParamType.Unknown,
                definition: {}
            },
            {
                name: "buffer",
                unions: [],
                intersection: EDocParamType.Unknown,
                definition: {}
            },
            {
                name: "bufferstream",
                unions: [],
                intersection: EDocParamType.NumberArray,
                definition: {}
            }
        ]
    },
    {
        namespace: "vmath",
        types: [
            {
                name: "vector3",
                unions: [],
                intersection: EDocParamType.Number,
                definition: {
                    x: EDocParamType.Number,
                    y: EDocParamType.Number,
                    z: EDocParamType.Number
                }
            },
            {
                name: "vector4",
                unions: [],
                intersection: EDocParamType.Number,
                definition: {
                    x: EDocParamType.Number,
                    y: EDocParamType.Number,
                    z: EDocParamType.Number,
                    w: EDocParamType.Number
                }
            },
            {
                name: "matrix4",
                unions: [],
                intersection: EDocParamType.Number,
                definition: {
                    c0: EDocParamType.Vector4,
                    c1: EDocParamType.Vector4,
                    c2: EDocParamType.Vector4,
                    c3: EDocParamType.Vector4,
                    m01: EDocParamType.Number,
                    m02: EDocParamType.Number,
                    m03: EDocParamType.Number,
                    m04: EDocParamType.Number,
                    m11: EDocParamType.Number,
                    m12: EDocParamType.Number,
                    m13: EDocParamType.Number,
                    m14: EDocParamType.Number,
                    m21: EDocParamType.Number,
                    m22: EDocParamType.Number,
                    m23: EDocParamType.Number,
                    m24: EDocParamType.Number,
                    m31: EDocParamType.Number,
                    m32: EDocParamType.Number,
                    m33: EDocParamType.Number,
                    m34: EDocParamType.Number,
                }
            },
            {
                name: "quaternion",
                unions: [],
                intersection: EDocParamType.Number,
                definition: {
                    x: EDocParamType.Number,
                    y: EDocParamType.Number,
                    z: EDocParamType.Number,
                    w: EDocParamType.Number
                }
            },
        ]
    }
];

export default types;