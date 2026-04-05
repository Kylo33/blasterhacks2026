import "@fontsource/libre-baskerville";
import * as monaco from 'monaco-editor';
import { TinyLayout } from "./tiny.ts"

const defaultCode = `
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
paint g [
        body: [0: wave],
        stroke: "#2ecc71",
        strokeWidth: 3,
        fill: "none",
        rotate: [degrees: 10, center: [x: 200, y: 220]],
];

// group: override stroke after paint
have grp = g [
        body: [0: tri, 1: box, 2: dot, 3: ring],
];
paint grp;
grp->fill = "#f39c12";
`

const editor = monaco.editor.create(document.getElementById('container')!, {
    value: defaultCode.trim(),
    theme: 'vs-light',
    minimap: { enabled: false },
    tabSize: 8,
    insertSpaces: true,
    padding: { top: 16, bottom: 16 },
})

editor.getModel()!.updateOptions({ tabSize: 8 });
editor.onDidChangeModelContent(() => {
    const value = editor.getValue();
    const tinyLayout: TinyLayout = document.querySelector("tiny-layout")!
    tinyLayout.setCode(value);
})

const value = editor.getValue();
const tinyLayout: TinyLayout = document.querySelector("tiny-layout")!
tinyLayout.setCode(value);
