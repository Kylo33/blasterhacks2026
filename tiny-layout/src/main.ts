import "@fontsource/libre-baskerville";
import "@fontsource/fira-code";
import * as monaco from "monaco-editor";
import { TinyLayout } from "./tiny.ts";

monaco.languages.register({ id: "tiny-layout" });

monaco.languages.setMonarchTokensProvider("tiny-layout", {
    keywords: ["paint", "have", "return", "if", "not", "and", "or"],
    builtins: [
        "path",
        "ellipse",
        "curve",
        "group",
        "text",
        "cos",
        "sin",
        "tan",
        "print",
    ],
    booleans: ["true", "false"],
    operators: [">=", "<=", "==", "!=", ">", "<", "+", "-", "*", "/", "=", "->"],

    tokenizer: {
        root: [
            // Comments
            [/\/\/.*$/, "comment"],

            // Strings
            [/"/, "string", "@string"],

            // Numbers
            [/\d+(\.\d+)?/, "number"],

            // Identifiers and keywords
            [
                /[a-zA-Z_]+/,
                {
                    cases: {
                        "@keywords": "keyword",
                        "@builtins": "type.identifier",
                        "@booleans": "keyword",
                        "@default": "identifier",
                    },
                },
            ],

            // Operators
            [/->|>=|<=|==|!=|[+\-*/<>=]/, "operator"],

            // Delimiters
            [/[{}()\[\]]/, "@brackets"],
            [/[;,:|]/, "delimiter"],

            // Whitespace
            [/\s+/, "white"],
        ],

        string: [
            [/\\./, "string.escape"],
            [/"/, "string", "@pop"],
            [/[^"\\]+/, "string"],
        ],
    },
});

monaco.languages.setLanguageConfiguration("tiny-layout", {
    comments: { lineComment: "//" },
    brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
        ["|", "|"],
    ],
    autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "|", close: "|" },
    ],
    surroundingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
    ],
});

const examples: Record<string, string> = {
    "Kitchen Sink": `
// path: a triangle (inherits default black fill)
have tri = path [
    points: [
        0: [x: 60, y: 100],
        1: [x: 100, y: 180],
        2: [x: 20, y: 180],
    ],
];

// path: with explicit fill and stroke
have box = path [
    points: [
        0: [x: 140, y: 100],
        1: [x: 220, y: 100],
        2: [x: 220, y: 180],
        3: [x: 140, y: 180],
    ],
    fill: "#3498db",
    stroke: "#fff",
    strokeWidth: 2,
];

// ellipse: inherits fill from default
have dot = ellipse [
    center: [x: 300, y: 140],
    radius: [x: 40, y: 40],
];

// ellipse: explicit colors
have ring = ellipse [
    center: [x: 300, y: 140],
    radius: [x: 30, y: 30],
    fill: "none",
    stroke: "#e74c3c",
    strokeWidth: 3,
];

// curve: no fill/stroke set, inherits from group
have wave = curve [
    points: [
        0: [x: 0, y: 110],
        1: [x: 50, y: 60],
        2: [x: 100, y: 110],
        3: [x: 150, y: 60],
        4: [x: 200, y: 110],
    ],
];

// group: sets stroke/strokeWidth for children, rotated
paint group [
    body: [0: wave],
    stroke: "#2ecc71",
    strokeWidth: 3,
    fill: "none",
    rotate: [degrees: 10, center: [x: 200, y: 220]],
];

// group: override stroke after paint
have grp = group [
    body: [0: tri, 1: box, 2: dot, 3: ring],
];
paint grp;
grp->fill = "#f39c12";

// text
paint text [
    content: "hello tiny",
    position: [x: 120, y: 260],
    fill: "#e74c3c",
    stroke: "none",
    fontSize: 24,
    fontFamily: "monospace",
];
`,
    "Smiley Face": `
// face
paint ellipse [
    center: [x: 150, y: 150],
    radius: [x: 100, y: 100],
    fill: "#f1c40f",
    stroke: "#e67e22",
    strokeWidth: 3,
];

// left eye
paint ellipse [
    center: [x: 115, y: 120],
    radius: [x: 12, y: 16],
    fill: "#2c3e50",
];

// right eye
paint ellipse [
    center: [x: 185, y: 120],
    radius: [x: 12, y: 16],
    fill: "#2c3e50",
];

// smile
paint curve [
    points: [
        0: [x: 100, y: 175],
        1: [x: 125, y: 210],
        2: [x: 175, y: 210],
        3: [x: 200, y: 175],
    ],
    fill: "none",
    stroke: "#2c3e50",
    strokeWidth: 4,
];
`,
    "Color Wheel": `
have size = 60;

// overlapping circles
paint ellipse [
    center: [x: 150, y: 120],
    radius: [x: size, y: size],
    fill: "#e74c3c44",
    stroke: "#e74c3c",
    strokeWidth: 2,
];

paint ellipse [
    center: [x: 115, y: 180],
    radius: [x: size, y: size],
    fill: "#3498db44",
    stroke: "#3498db",
    strokeWidth: 2,
];

paint ellipse [
    center: [x: 185, y: 180],
    radius: [x: size, y: size],
    fill: "#2ecc7144",
    stroke: "#2ecc71",
    strokeWidth: 2,
];

paint text [
    content: "RGB",
    position: [x: 125, y: 280],
    fill: "#333",
    stroke: "none",
    fontSize: 28,
    fontFamily: "monospace",
];
`,
};

const defaultCode = examples["Kitchen Sink"];

const editor = monaco.editor.create(document.getElementById("container")!, {
    value: defaultCode.trim(),
    language: "tiny-layout",
    theme: "vs-light",
    fontFamily: "Fira Code, monospace",
    minimap: { enabled: false },
    tabSize: 4,
    insertSpaces: true,
    padding: { top: 16, bottom: 16 },
    fontLigatures: true,
});

editor.getModel()!.updateOptions({ tabSize: 4 });
editor.onDidChangeModelContent(() => {
    const value = editor.getValue();
    const tinyLayout: TinyLayout = document.querySelector("tiny-layout")!;
    tinyLayout.setCode(value);
});

const value = editor.getValue();
const tinyLayout: TinyLayout = document.querySelector("tiny-layout")!;
tinyLayout.setCode(value);

// Populate example dropdown
const select = document.getElementById("example-select") as HTMLSelectElement;
for (const name of Object.keys(examples)) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
}
select.addEventListener("change", () => {
    const code = examples[select.value].trim();
    editor.setValue(code);
});
