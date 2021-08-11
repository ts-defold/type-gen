"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const schema = __importStar(require("../types/schema"));
function comment(input) {
    let out = "\t" + `/**` + "\n";
    input.split("\n").forEach((line) => {
        out += "\t" + `* ${line}` + "\n";
    });
    out += "\t" + `*/` + "\n";
    return out;
}
function docs(input, TAB = "\t") {
    const desc = input.description || input.brief;
    let out = TAB + `/**` + "\n";
    desc.split("\n").forEach((line) => {
        out += TAB + `* ${line}` + "\n";
    });
    input.parameters.forEach((p) => {
        out += TAB + `* @param ${p.name}  ${p.doc}` + "\n";
    });
    input.returnvalues.forEach((p) => {
        out += TAB + `* @return ${p.name}  ${p.doc}` + "\n";
    });
    out += TAB + `*/` + "\n";
    return out;
}
function type(input) {
    const types = input.map((t) => {
        let type = Object.values(schema.EDocParamType)[Object.keys(schema.EDocParamType).indexOf(t)];
        if (type == schema.EDocParamType.Unknown)
            type = schema.EDocParamType.Any;
        if (type == schema.EDocParamType.Table)
            type = schema.EDocParamType.Any;
        if (type == schema.EDocParamType.Constant)
            type = schema.EDocParamType.Any;
        if (type === undefined)
            type = schema.EDocParamType.Any;
        return type;
    });
    // Unsure the parameter names are unique (no dupes), and if a single param is any, then the union is unnecessary
    const unique = [...new Set(types)];
    return (unique.includes(schema.EDocParamType.Any)
        ? [schema.EDocParamType.Any]
        : unique).join(" | ");
}
function isOverloadedFunction(e) {
    if (e.parameters.length && e.returnvalues.length) {
        const params = e.parameters
            .map((p) => p.types)
            .concat(e.returnvalues.map((r) => r.types));
        let isOverload = true;
        let reqCount = 1;
        let overloadRun = -1;
        // a function overload is 1 or more single value params followed by at least 2 multi-value params
        for (let i = 0; i < params.length; i++) {
            const p = params[i];
            if (reqCount <= 1 && p.length >= reqCount) {
                reqCount = p.length;
                overloadRun = i;
            }
            if (reqCount > 1 && p.length != reqCount) {
                isOverload = false;
                break;
            }
        }
        if (isOverload && overloadRun + 1 < params.length) {
            for (let i = overloadRun + 1; i < params.length; i++) {
                if (params[i].toString() != params[overloadRun].toString())
                    return { overload: false, start: -1 };
            }
            return { overload: true, start: overloadRun };
        }
    }
    return { overload: false, start: -1 };
}
function isReserved(name) {
    const reserved = ["delete"];
    return reserved.includes(name) ? { alt: name + "$", name } : null;
}
function ensureUnique(set, e) {
    if (!set.has(e.name)) {
        set.set(e.name, 0);
        return e;
    }
    const count = set.get(e.name);
    set.set(e.name, (count ? count : 0) + 1);
    return Object.assign({}, e, { name: `${e.name}${set.get(e.name)}` });
}
function hr() {
    return (`// =^..^=   =^..^=   =^..^=    =^..^=    =^..^=    =^..^=    =^..^= //` +
        "\n\n");
}
function generate(input, info, types, overrides) {
    let output = "";
    // Header
    output += `/** @noSelfInFile */` + "\n";
    output += `/// <reference types="lua-types/5.1" />` + "\n";
    output += "\n";
    output +=
        `// DEFOLD. ${info.channel} version ${info.tag} (${info.sha1})` + "\n";
    output += hr();
    // Types
    if (types) {
        types.forEach((t) => {
            if (t.namespace)
                output += "\n" + `declare namespace ${t.namespace} {` + "\n";
            const tab = t.namespace ? "\t" : "";
            const exp = t.namespace ? "export" : "declare";
            t.types.forEach((d) => {
                const unionOrIntersect = d.unions.length
                    ? `${d.unions.join(" | ")} `
                    : d.intersections.length
                        ? `${d.intersections.join(" & ")} & `
                        : "";
                output += "\n";
                output += tab + `${exp} type ${d.name} = ${unionOrIntersect}{` + "\n";
                for (const k in d.definition) {
                    output += tab + "\t" + `${k}: ${d.definition[k]},` + "\n";
                }
                output += tab + `}` + "\n";
            });
            if (t.namespace)
                output += `}` + "\n";
        });
    }
    output += hr();
    // Globals to the front
    const globals = input.filter((i) => i.info.namespace === "");
    globals.forEach((g) => input.splice(input.indexOf(g), 1));
    const sorted = globals.concat(input);
    // strip empty modules
    const printable = [
        schema.EDocElemType.Variable,
        schema.EDocElemType.Message,
        schema.EDocElemType.Function,
    ];
    const modules = sorted.filter((m) => {
        const el = m.elements.find((e) => printable.includes(e.type));
        if (el)
            return m;
    });
    // Apply overrides
    overrides === null || overrides === void 0 ? void 0 : overrides.forEach((o) => {
        modules.forEach((m) => {
            if (o.info.namespace == m.info.namespace) {
                o.elements.forEach((overrideElem) => {
                    const targetElem = m.elements.find((elem) => elem.name == overrideElem.name);
                    if (targetElem) {
                        targetElem.parameters = overrideElem.parameters;
                        targetElem.returnvalues = overrideElem.returnvalues;
                        targetElem.type = overrideElem.type;
                        if (overrideElem.brief)
                            targetElem.brief = overrideElem.brief;
                        if (overrideElem.description)
                            targetElem.description = overrideElem.description;
                    }
                });
            }
        });
    });
    // Modules
    modules.forEach((i) => {
        const TAB = i.info.namespace ? "\t" : "";
        const exp = i.info.namespace ? "export" : "declare";
        output += "\n";
        if (i.info.namespace)
            output += `declare namespace ${i.info.namespace} {` + "\n";
        // Sort element output by name then type
        const elements = i.elements.sort((a, b) => {
            const keys = Object.values(schema.EDocElemType);
            return ((a.name > b.name ? 1 : a.name < b.name ? -1 : 0) ||
                keys.indexOf(a.type) - keys.indexOf(b.type));
        });
        elements.forEach((e) => {
            const name = e.name.replace(`${i.info.namespace}.`, "");
            output += "\n";
            switch (e.type) {
                case schema.EDocElemType.Variable:
                    {
                        output += comment(e.brief);
                        output +=
                            TAB + `${exp} let ${name}: ${schema.EDocParamType.Any}` + "\n";
                    }
                    break;
                case schema.EDocElemType.Message:
                    {
                        output += comment(e.description);
                        output += TAB + `${exp} type ${name} = "${name}"` + "\n";
                    }
                    break;
                case schema.EDocElemType.Property:
                    {
                        output += comment(e.description);
                        output +=
                            TAB + `${exp} let ${name}: ${schema.EDocParamType.Any}` + "\n";
                    }
                    break;
                case schema.EDocElemType.Function:
                    {
                        const scriptFunctions = [
                            "final",
                            "init",
                            "on_input",
                            "on_message",
                            "on_reload",
                            "update",
                        ];
                        const reserved = isReserved(name);
                        const funcName = reserved ? reserved.alt : name;
                        const funcExp = reserved ? "" : exp;
                        if (i.info.group == schema.EDocGroup.System &&
                            scriptFunctions.includes(funcName)) {
                            output.slice(0, -1); // skip script functions
                        }
                        else {
                            output += docs(e, TAB);
                            const { overload, start } = isOverloadedFunction(e);
                            if (overload && e.returnvalues.length) {
                                e.returnvalues[0].types.forEach((ret, i) => {
                                    const set = new Map();
                                    let params = [];
                                    e.parameters.forEach((p, j) => {
                                        const uniqueParam = ensureUnique(set, p);
                                        params.push(`${uniqueParam.name}${uniqueParam.optional ? "?" : ""}: ${type(j < start ? uniqueParam.types : [uniqueParam.types[i]])}`);
                                    });
                                    const optional = e.returnvalues[0].optional;
                                    output +=
                                        TAB +
                                            `${funcExp} function ${funcName}(${params.join(", ")}): ${type([ret])}${optional ? " | undefined" : ""}` +
                                            "\n";
                                    if (reserved)
                                        output +=
                                            "\t" +
                                                `export { ${reserved.alt} as ${reserved.name} }` +
                                                "\n";
                                });
                            }
                            else {
                                const set = new Map();
                                const params = e.parameters
                                    .map((p) => ensureUnique(set, p))
                                    .map((p) => `${p.name}${p.optional ? "?" : ""}: ${type(p.types)}`)
                                    .join(", ");
                                const retValues = e.returnvalues.length > 0
                                    ? e.returnvalues[0].types
                                    : ["Void"]; // need a string of the key, to match parser
                                const retOptional = e.returnvalues.length > 0
                                    ? e.returnvalues[0].optional
                                    : false;
                                output +=
                                    TAB +
                                        `${funcExp} function ${funcName}(${params}): ${type(retValues)}${retOptional ? " | undefined" : ""}` +
                                        "\n";
                                if (reserved)
                                    output +=
                                        "\t" +
                                            `export { ${reserved.alt} as ${reserved.name} }` +
                                            "\n";
                            }
                        }
                    }
                    break;
            }
        });
        output += "\n";
        if (i.info.namespace)
            output += `}` + "\n";
        output += hr();
    });
    return output;
}
exports.generate = generate;
//# sourceMappingURL=generator.js.map