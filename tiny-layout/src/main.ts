import { parse } from "./parser.js";

class TinyLayout extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const text = this.textContent.trim();
        const ast = parse(text);
        console.log(ast)
    }
}

customElements.define("tiny-layout", TinyLayout);
