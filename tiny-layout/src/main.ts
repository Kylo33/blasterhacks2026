import "@fontsource/libre-baskerville";
import * as monaco from 'monaco-editor';
import { TinyLayout } from "./tiny.ts"

const defaultCode = `
// "have" defines a variable.
have cx = 150;
have cy = 100;

// paint draws a shape to the SVG
paint circle {
        x: cx,
        y: cy,
        r: 40,
        style: { fill: #01796f },
        onClick: {} -> zilch {
                paint text {
                        x: 110,
                        y: 180,
                        content: "clicked!",
                        style: {
                                fill: #333,
                                fontSize: 14,
                        },
                };
        },
};

// functions are values too
have hat = {fill: color} -> shape {
        return group {
                body: [
                        rect {
                                x: 60,
                                y: 30,
                                width: 30,
                                height: 40,
                        },
                        rect {
                                x: 50,
                                y: 60,
                                width: 50,
                                height: 10,
                        },
                ],
                style: { fill: fill },
        };
};

paint hat { fill: #fc0 };

// lines work too
paint line {
        x1: 20,
        y1: 200,
        x2: 280,
        y2: 200,
        style: {
                stroke: #999,
                strokeWidth: 2,
        },
};
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

const tinyLayout: TinyLayout = document.querySelector("tiny-layout")!;
tinyLayout.setCode(defaultCode.trim());

editor.onDidChangeModelContent(() => {
    tinyLayout.setCode(editor.getValue());
})
