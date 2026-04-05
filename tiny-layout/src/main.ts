import "@fontsource/libre-baskerville";
import * as monaco from 'monaco-editor';
import { TinyLayout } from "./tiny.ts"

const defaultCode = `
have triangle = |x, y, size, color| {
        have half = size / 2;
        return path [
                points: [
                        0: [x: x, y: y - size],
                        1: [x: x + half, y: y],
                        2: [x: x - half, y: y],
                ],
                fill: color,
                stroke: "none",
        ];
};

have rect = |x, y, w, h, color| {
        return path [
                points: [
                        0: [x: x, y: y],
                        1: [x: x + w, y: y],
                        2: [x: x + w, y: y + h],
                        3: [x: x, y: y + h],
                ],
                fill: color,
                stroke: "none",
        ];
};

have diamond = |x, y, w, h, color| {
        return path [
                points: [
                        0: [x: x, y: y - h],
                        1: [x: x + w, y: y],
                        2: [x: x, y: y + h],
                        3: [x: x - w, y: y],
                ],
                fill: color,
                stroke: "none",
        ];
};

paint rect [x: 0, y: 0, w: 400, h: 300, color: "#0a0a2e"];

paint rect [x: 50, y: 40, w: 2, h: 2, color: "#fff"];
paint rect [x: 120, y: 70, w: 2, h: 2, color: "#fff"];
paint rect [x: 300, y: 30, w: 2, h: 2, color: "#fff"];
paint rect [x: 350, y: 90, w: 2, h: 2, color: "#fff"];
paint rect [x: 80, y: 180, w: 2, h: 2, color: "#fff"];
paint rect [x: 330, y: 200, w: 2, h: 2, color: "#fff"];
paint rect [x: 260, y: 60, w: 2, h: 2, color: "#fff"];
paint rect [x: 150, y: 240, w: 2, h: 2, color: "#fff"];

paint triangle [x: 200, y: 210, size: 30, color: "#ff4500"];
paint triangle [x: 200, y: 215, size: 20, color: "#ff8c00"];
paint triangle [x: 200, y: 218, size: 12, color: "#ffd700"];

paint diamond [x: 200, y: 140, w: 25, h: 60, color: "#b0b8c8"];
paint diamond [x: 200, y: 140, w: 20, h: 55, color: "#c8d0dc"];

paint triangle [x: 200, y: 140, size: 60, color: "#d0d8e8"];
paint triangle [x: 200, y: 140, size: 55, color: "#dce3f0"];

paint rect [x: 195, y: 95, w: 10, h: 10, color: "#00cfff"];

have lwing = path [
        points: [
                0: [x: 175, y: 145],
                1: [x: 140, y: 170],
                2: [x: 145, y: 160],
                3: [x: 175, y: 140],
        ],
        fill: "#8890a0",
        stroke: "none",
];
paint lwing;

have rwing = path [
        points: [
                0: [x: 225, y: 145],
                1: [x: 260, y: 170],
                2: [x: 255, y: 160],
                3: [x: 225, y: 140],
        ],
        fill: "#8890a0",
        stroke: "none",
];
paint rwing;
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
