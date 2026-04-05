import "@fontsource/libre-baskerville";
import * as monaco from 'monaco-editor';
import { TinyLayout } from "./tiny.ts"

const defaultCode = `
paint curve [
        points: [
                0: [x: 50, y: 200],
                1: [x: 200, y: 50],
                2: [x: 350, y: 200],
        ],
        stroke: "#e74c3c",
        strokeWidth: 3,
];

paint curve [
        points: [
                0: [x: 50, y: 250],
                1: [x: 150, y: 100],
                2: [x: 250, y: 200],
                3: [x: 350, y: 100],
        ],
        stroke: "#3498db",
        strokeWidth: 3,
];
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
