import { parse } from "./parser.js";
import type { Program } from "./types.js";

class TinyLayout extends HTMLElement {
    #shadow!: ShadowRoot;
    #pt!: HTMLParagraphElement;

    constructor() {
        super();
    }

    connectedCallback() {
        this.#shadow = this.attachShadow({ mode: "open" })
        this.#shadow.appendChild(this.#pt)

        const text = this.textContent!.trim();
        this.setCode(text)
    }

    setCode(code: string) {
        this.textContent = code;
        const ast = parse(code);
        console.log(ast)
    }
}

customElements.define("tiny-layout", TinyLayout);

const tl: TinyLayout = document.querySelector("tiny-layout")!
document.querySelector("#codeInput")?.addEventListener("input", () => {
    const elem: HTMLTextAreaElement = document.querySelector("#codeInput")!
    const code = elem.value;
    tl.setCode(code);
})
