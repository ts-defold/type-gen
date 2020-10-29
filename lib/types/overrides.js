"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
const overrides = [
    {
        info: {
            namespace: "buffer",
            description: "",
            group: schema_1.EDocGroup.Script
        },
        elements: [
            {
                name: "buffer.create",
                type: schema_1.EDocElemType.Function,
                parameters: [
                    {
                        name: "element_count",
                        type: ["Number"],
                        optional: false,
                        doc: "The number of elements the buffer should hold"
                    },
                    {
                        name: "declaration",
                        type: ["Table"],
                        optional: false,
                        doc: "A table where each entry (table) describes a stream\n\n`name`: The name of the stream\n`type`: The data type of the stream\n`count`: The number of values each element should hold\n"
                    }
                ],
                returnvalues: [
                    {
                        name: "buffer",
                        type: ["Buffer"],
                        optional: false,
                        doc: "The new buffer"
                    }
                ],
                brief: "",
                description: ""
            }
        ]
    },
    {
        info: {
            namespace: "resource",
            description: "",
            group: schema_1.EDocGroup.System
        },
        elements: [
            {
                name: "resource.atlas",
                type: schema_1.EDocElemType.Function,
                parameters: [
                    {
                        name: "path",
                        type: ["String"],
                        optional: true,
                        doc: "resource path string to the resource"
                    }
                ],
                returnvalues: [
                    {
                        name: "path",
                        type: ["Hash"],
                        optional: false,
                        doc: "a path hash to the binary version of the resource"
                    }
                ],
                brief: "",
                description: ""
            },
            {
                name: "resource.font",
                type: schema_1.EDocElemType.Function,
                parameters: [
                    {
                        name: "path",
                        type: ["String"],
                        optional: true,
                        doc: "resource path string to the resource"
                    }
                ],
                returnvalues: [
                    {
                        name: "path",
                        type: ["Hash"],
                        optional: false,
                        doc: "a path hash to the binary version of the resource"
                    }
                ],
                brief: "",
                description: ""
            },
            {
                name: "resource.material",
                type: schema_1.EDocElemType.Function,
                parameters: [
                    {
                        name: "path",
                        type: ["String"],
                        optional: true,
                        doc: "resource path string to the resource"
                    }
                ],
                returnvalues: [
                    {
                        name: "path",
                        type: ["Hash"],
                        optional: false,
                        doc: "a path hash to the binary version of the resource"
                    }
                ],
                brief: "",
                description: ""
            },
            {
                name: "resource.texture",
                type: schema_1.EDocElemType.Function,
                parameters: [
                    {
                        name: "path",
                        type: ["String"],
                        optional: true,
                        doc: "resource path string to the resource"
                    }
                ],
                returnvalues: [
                    {
                        name: "path",
                        type: ["Hash"],
                        optional: false,
                        doc: "a path hash to the binary version of the resource"
                    }
                ],
                brief: "",
                description: ""
            }
        ]
    }
];
exports.default = overrides;
//# sourceMappingURL=overrides.js.map