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
    }
];
exports.default = overrides;
//# sourceMappingURL=overrides.js.map