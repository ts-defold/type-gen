import { IDocJson, EDocGroup, EDocParamType, EDocElemType } from "./schema";

const overrides: Array<IDocJson> = [
    {
        info: {
            namespace: "buffer",
            description: "",
            group: EDocGroup.Script
        },
        elements: [
            {
                name: "buffer.create",
                type: EDocElemType.Function,
                parameters: [
                    {
                        name: "element_count",
                        type: ["Number" as EDocParamType],
                        optional: false,
                        doc: "The number of elements the buffer should hold"
                    },
                    {
                        name: "declaration",
                        type:["Table" as EDocParamType],
                        optional: false,
                        doc: "A table where each entry (table) describes a stream\n\n`name`: The name of the stream\n`type`: The data type of the stream\n`count`: The number of values each element should hold\n"
                    }
                ],
                returnvalues: [
                    {
                        name: "buffer",
                        type: ["Buffer" as EDocParamType],
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
            group: EDocGroup.System
        },
        elements: [
            {
                name: "resource.atlas",
                type: EDocElemType.Function,
                parameters: [
                    {
                        name: "path",
                        type: ["String" as EDocParamType],
                        optional: true,
                        doc: "resource path string to the resource"
                    }
                ],
                returnvalues: [
                    {
                        name: "path",
                        type: ["Hash" as EDocParamType],
                        optional: false,
                        doc: "a path hash to the binary version of the resource"
                    }
                ],
                brief: "",
                description: ""
            },
            {
                name: "resource.font",
                type: EDocElemType.Function,
                parameters: [
                    {
                        name: "path",
                        type: ["String" as EDocParamType],
                        optional: true,
                        doc: "resource path string to the resource"
                    }
                ],
                returnvalues: [
                    {
                        name: "path",
                        type: ["Hash" as EDocParamType],
                        optional: false,
                        doc: "a path hash to the binary version of the resource"
                    }
                ],
                brief: "",
                description: ""
            },
            {
                name: "resource.material",
                type: EDocElemType.Function,
                parameters: [
                    {
                        name: "path",
                        type: ["String" as EDocParamType],
                        optional: true,
                        doc: "resource path string to the resource"
                    }
                ],
                returnvalues: [
                    {
                        name: "path",
                        type: ["Hash" as EDocParamType],
                        optional: false,
                        doc: "a path hash to the binary version of the resource"
                    }
                ],
                brief: "",
                description: ""
            },
            {
                name: "resource.texture",
                type: EDocElemType.Function,
                parameters: [
                    {
                        name: "path",
                        type: ["String" as EDocParamType],
                        optional: true,
                        doc: "resource path string to the resource"
                    }
                ],
                returnvalues: [
                    {
                        name: "path",
                        type: ["Hash" as EDocParamType],
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

export default overrides;