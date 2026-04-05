import "@fontsource/libre-baskerville";
import * as monaco from 'monaco-editor';
import { TinyLayout } from "./tiny.ts"

const defaultCode = `
// "have" defines a variable.
have a = 5;
have b = 10;


// paint lets you draw a shape
paint circle {
        x: a,
        y: b,
        style: {
                fill: #01796f,
        },
};


// functions are values too
have hat = {fill: color} -> shape {
        return group {
                body: [
                        rect {
                                x: 10,
                                y: 10,
                                width: 10,
                                height: 20,
                        },
                        rect {
                                x: 0,
                                y: 20,
                                width: 30,
                                height: 5,
                        },
                ],
        };
};

paint hat {
        fill: #fc0
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
editor.onDidChangeModelContent(() => {
    const value = editor.getValue();
    const tinyLayout: TinyLayout = document.querySelector("tiny-layout")!
    tinyLayout.setCode(value);
})
