import { parse } from "./parser.js";

class TinyLayout extends HTMLElement {
    #shadow!: ShadowRoot;
    #svg!: SVGElement;
    #debug!: HTMLSpanElement;
    #script!: HTMLScriptElement;

    constructor() {
        super();
    }

    connectedCallback() {
        this.#shadow = this.attachShadow({ mode: "open" });
        this.#svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.#script = document.createElement("script")
        this.#debug = document.createElement("span")

        this.#shadow.appendChild(this.#svg)
        this.#shadow.appendChild(this.#script)
        this.#shadow.appendChild(this.#debug)

        this.setCode(this.textContent ?? "")
    }

    setCode(code: string) {
        this.textContent = code;
        const ast = parse(code);
        console.log(ast)
        const parts: string[] = [];
        processAstNode(ast, parts)
        console.log(parts.join(" "))
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
            parts.push(`${astNode['id']}(${astNode['args']})`)
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
            for(const decl of astNode["value"]) {
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
    }
}


customElements.define("tiny-layout", TinyLayout);

export { TinyLayout };
