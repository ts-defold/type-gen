"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseTypeMap = exports.typeMap = exports.EDocParamType = exports.EDocElemType = exports.EDocGroup = void 0;
var EDocGroup;
(function (EDocGroup) {
    EDocGroup["System"] = "SYSTEM";
    EDocGroup["Script"] = "SCRIPT";
    EDocGroup["Components"] = "COMPONENTS";
    EDocGroup["Extensions"] = "EXTENSIONS";
})(EDocGroup = exports.EDocGroup || (exports.EDocGroup = {}));
var EDocElemType;
(function (EDocElemType) {
    EDocElemType["Variable"] = "VARIABLE";
    EDocElemType["Message"] = "MESSAGE";
    EDocElemType["Property"] = "PROPERTY";
    EDocElemType["Function"] = "FUNCTION";
})(EDocElemType = exports.EDocElemType || (exports.EDocElemType = {}));
var EDocParamType;
(function (EDocParamType) {
    EDocParamType["Table"] = "table";
    EDocParamType["Object"] = "object";
    EDocParamType["Constant"] = "constant";
    EDocParamType["Number"] = "number";
    EDocParamType["String"] = "string";
    EDocParamType["Boolean"] = "boolean";
    EDocParamType["Hash"] = "hash";
    EDocParamType["Url"] = "url";
    EDocParamType["Node"] = "node";
    EDocParamType["Buffer"] = "buffer";
    EDocParamType["BufferStream"] = "bufferstream";
    EDocParamType["Vector3"] = "vmath.vector3";
    EDocParamType["Vector4"] = "vmath.vector4";
    EDocParamType["Matrix4"] = "vmath.matrix4";
    EDocParamType["Quaternion"] = "vmath.quaternion";
    EDocParamType["Void"] = "void";
    EDocParamType["Any"] = "any";
    EDocParamType["Unknown"] = "";
})(EDocParamType = exports.EDocParamType || (exports.EDocParamType = {}));
exports.typeMap = {
    "table": EDocParamType.Table,
    "object": EDocParamType.Object,
    "constant": EDocParamType.Constant,
    "number": EDocParamType.Number,
    "string": EDocParamType.String,
    "boolean": EDocParamType.Boolean,
    "hash": EDocParamType.Hash,
    "url": EDocParamType.Url,
    "node": EDocParamType.Node,
    "buffer": EDocParamType.Buffer,
    "bufferstream": EDocParamType.BufferStream,
    "vmath.vector3": EDocParamType.Vector3,
    "vector3": EDocParamType.Vector3,
    "vmath.vector4": EDocParamType.Vector4,
    "vector4": EDocParamType.Vector4,
    "vmath.matrix4": EDocParamType.Matrix4,
    "matrix4": EDocParamType.Matrix4,
    "vmath.quaternion": EDocParamType.Quaternion,
    "quaternion": EDocParamType.Quaternion,
    "quatertion": EDocParamType.Quaternion,
    "quat": EDocParamType.Quaternion,
    "void": EDocParamType.Void,
    "any": EDocParamType.Any,
    "": EDocParamType.Unknown
};
exports.reverseTypeMap = Object.fromEntries(Object.entries(EDocParamType).map(([key, value]) => [value, key]));
//# sourceMappingURL=schema.js.map