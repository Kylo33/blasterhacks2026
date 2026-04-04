
class TinyLayout extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const overwrite = this.getAttribute("overwrite");
    const write_object = document.getElementById(overwrite);
    const text = this.textContent;

  }
}

customElements.define("tiny-layout", TinyLayout);
