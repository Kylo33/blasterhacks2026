import { parse, SyntaxError } from "./parser.js";

const prelude = `
let cos = ({x}) => Math.cos(x);
let sin = ({x}) => Math.sin(x);
let tan = ({x}) => Math.tan(x);
let print = ({text}) => console.log(text);

class Path {
    path

    constructor() {
        this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    }

    paint() {
        __svg.appendChild(this.path)
    }

    set points(val) {
        const ptsArr = [];
        for(let i = 0; val[i] != undefined; i++) {
            ptsArr.push(val[i]);
        }

        const segments = [];
        let first = true;
        for (const {x, y} of ptsArr) {
            segments.push((first ? "M " : "L ") + x.toString() + " " + y.toString());
            first = false;
        }
        this.path.setAttribute("d", segments.join(" "));
    }

    set fill(val) {
        this.path.setAttribute("fill", val)
    }

    set stroke(val) {
        this.path.setAttribute("stroke", val)
    }

    set strokeWidth(val) {
        this.path.setAttribute("stroke-width", val)
    }
};

let path = ({points, fill = "#000", stroke = "none", strokeWidth = 2}) => {
    const p = new Path();
    p.points = points;
    p.fill = fill;
    p.strokeWidth = strokeWidth;
    p.stroke = stroke;
    return p;
};
`

class TinyLayout extends HTMLElement {
    #shadow!: ShadowRoot;
    #svg!: SVGElement;
    #debug!: HTMLDivElement;
    #scriptContainer!: HTMLDivElement;
    #lineContainer!: HTMLParagraphElement;
    #errorContainer!: HTMLParagraphElement;

    constructor() {
        super();
    }

    connectedCallback() {
        this.#shadow = this.attachShadow({ mode: "open" });
        this.#svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.#svg.style.width = "100%";
        this.#svg.style.height = "100%";
        this.#scriptContainer = document.createElement("div")

        this.#lineContainer = document.createElement("p")
        this.#lineContainer.style.display = "inline-block";
        this.#lineContainer.style.margin = "10px";
        this.#lineContainer.style.padding = "2px 6px";
        this.#lineContainer.style.backgroundColor = "#eb3443";
        this.#lineContainer.style.borderRadius = "3px";
        this.#lineContainer.style.whiteSpace = "nowrap";
        this.#lineContainer.style.margin = "4px";

        this.#errorContainer = document.createElement("p")
        this.#errorContainer.style.margin = "0px";

        this.#debug = document.createElement("div")
        this.#debug.style.display = "flex";
        this.#debug.style.alignItems = "start";
        this.#debug.style.padding = "10px";
        this.#debug.style.gap = "10px";
        this.#debug.appendChild(this.#lineContainer)
        this.#debug.appendChild(this.#errorContainer)

        this.#shadow.appendChild(this.#scriptContainer)
        this.#shadow.appendChild(this.#debug)
        this.#shadow.appendChild(this.#svg)

        this.setCode(this.textContent ?? "")
    }

    setCode(tinyLayoutCode: string) {
        tinyLayoutCode = tinyLayoutCode.replace(/\/\/.*(\n|$)/g, "")

        this.textContent = tinyLayoutCode;
        let ast;
        try {
            ast = parse(tinyLayoutCode);
        } catch (error: unknown) {
            this.#debug.style.display = "flex";
            console.error("got error parsing")
            if (error instanceof SyntaxError) {
                this.#lineContainer.textContent = "Line " + error.location.start.line + ":" + error.location.start.column + " ";
                this.#errorContainer.textContent = error.message;
            }
            return;
        }
        this.#svg.replaceChildren();
        this.#debug.style.display = "none";
        const parts: string[] = [];
        processAstNode(ast, parts)

        const script: HTMLScriptElement = document.createElement("script")

        const svgRef = `__tinySvg_${Math.random().toString(36).slice(2)}`;
        (globalThis as any)[svgRef] = this.#svg;

        script.textContent = `
        (() => {
            const __svg = globalThis["${svgRef}"];
            delete globalThis["${svgRef}"];
            ${prelude}
            ${parts.join(' ')}
        })()
        `

        this.#scriptContainer.replaceChildren(script);
    }
}

function processAstNode(astNode: any, parts: string[]) {
    switch (astNode["type"]) {
        case "stmts":
            for (const child of astNode["value"]) {
                processAstNode(child, parts)
            }
            break;
        case "infix":
            processAstNode(astNode["values"][0], parts);
            parts.push(astNode["operator"])
            processAstNode(astNode["values"][1], parts);
            break;
        case "have":
            parts.push("let")
            processAstNode(astNode["id"], parts)
            parts.push("=")
            processAstNode(astNode["expr"], parts)
            parts.push(";")
            break;
        case "assign":
            processAstNode(astNode["id"], parts)
            parts.push("=")
            processAstNode(astNode["expr"], parts)
            parts.push(";")
            break;
        case "return":
            parts.push("return")
            if (astNode["expr"]) {
                processAstNode(astNode["expr"], parts)
            }
            parts.push(";")
            break;
        case "if":
            parts.push("if (")
            processAstNode(astNode["expr"], parts)
            parts.push(") {")
            processAstNode(astNode["stmts"], parts)
            parts.push("}")
            break;
        case "negation":
            parts.push("!")
            processAstNode(astNode["value"], parts)
            break
        case "number":
        case "truth":
            parts.push(astNode["value"].toString())
            break;
        case "string":
            parts.push(`"${astNode['value']}"`)
            break;
        case "call":
            processAstNode(astNode["id"], parts)
            parts.push("(")
            processAstNode(astNode["args"], parts)
            parts.push(")")
            break;
        case "function":
            parts.push("({")
            processAstNode(astNode["args"], parts)
            parts.push("}) => {")

            processAstNode(astNode["stmts"], parts)
            parts.push("}")
            break;
        case "args":
            for (const arg of astNode["value"]) {
                processAstNode(arg, parts)
                parts.push(",")
            }
            break;
        case "identifier":
            parts.push(astNode["value"])
            break;
        case "table":
            parts.push("{")
            for (const decl of astNode["value"]) {
                processAstNode(decl, parts)
            }
            parts.push("}")
            break;
        case "tablePairDcl":
            processAstNode(astNode["id"], parts)
            parts.push(":")
            processAstNode(astNode["expr"], parts)
            parts.push(",")
            break;
        case "tableKey":
            parts.push(astNode["value"])
            break;
        case "identifierSeq":
            for (const id of astNode["value"]) {
                processAstNode(id, parts)
                parts.push(".")
            }
            parts.pop()
            break;
        case "paint":
            processAstNode(astNode["expr"], parts)
            parts.push(".paint();")
            break;
    }
}


customElements.define("tiny-layout", TinyLayout);

export { TinyLayout };
