import { IDocTypes, EDocParamType  } from "./schema";

const types: Array<IDocTypes> = [
    {
        namespace: "",
        types: [
            {
                name: "hash",
                unions: [],
                intersections: [],
                definition: {}
            },
            {
                name: "url",
                unions: [],
                intersections: [],
                definition: {}
            },
            {
                name: "node",
                unions: [],
                intersections: [],
                definition: {}
            },
            {
                name: "buffer",
                unions: [],
                intersections: [],
                definition: {}
            },
            {
                name: "bufferstream",
                unions: [],
                intersections: [EDocParamType.NumberArray, EDocParamType.LuaUserdata],
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
                intersections: [EDocParamType.Number],
                definition: {
                    x: EDocParamType.Number,
                    y: EDocParamType.Number,
                    z: EDocParamType.Number
                }
            },
            {
                name: "vector4",
                unions: [],
                intersections: [EDocParamType.Number],
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
                intersections: [EDocParamType.Number],
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
                intersections: [EDocParamType.Number],
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