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
        console.log(parts.join("\n"))
    }
}

function processAstNode(astNode: any, parts: string[]) {
    switch (astNode["type"]) {
        case "stmts":
            for(const stmt of astNode["value"]) {
                processAstNode(stmt, parts);
            }
            break;
        case "stmt":
            switch (astNode["value"]["name"]) {
                case "have":
                    // TODO: allow re-assigning variables
                    switch (astNode["value"]["expr"]["type"]) {
                        case "numba":
                        case "truth":
                        case "identifier":
                            parts.push(`let ${astNode["value"]["id"]} = ${astNode["value"]["expr"]["value"]};`)
                            break;
                        case "strin":
                        case "color":
                            parts.push(`let ${astNode["value"]["id"]} = "${astNode["value"]["expr"]["value"]}";`)
                            break;
                        case "zilch":
                            parts.push(`let ${astNode["value"]["id"]} = undefined;`)
                            break;
                    }
                    break;
            }
    }
}


customElements.define("tiny-layout", TinyLayout);

export { TinyLayout };
