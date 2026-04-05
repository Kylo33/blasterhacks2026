import { parse } from "./parser.js";

// ── Value types ──────────────────────────────────────────────────────

type Value =
    | number
    | string
    | boolean
    | null
    | Value[]
    | TableValue
    | ShapeValue
    | FunctValue;

interface TableValue {
    __type: "table";
    entries: Record<string, Value>;
}

interface ShapeValue {
    __type: "shape";
    element: SVGElement;
}

interface FunctValue {
    __type: "funct";
    args: Record<string, string>;
    ret: string;
    stmts: any;
    closure: Env;
}

// ── Environment (lexical scoping with parent chain) ──────────────────

class Env {
    bindings = new Map<string, Value>();
    parent: Env | null;

    constructor(parent: Env | null = null) {
        this.parent = parent;
    }

    get(name: string): Value {
        if (this.bindings.has(name)) return this.bindings.get(name)!;
        if (this.parent) return this.parent.get(name);
        throw new Error(`Undefined variable: ${name}`);
    }

    set(name: string, value: Value) {
        this.bindings.set(name, value);
    }

    /** Update an existing binding in the nearest scope that has it. */
    update(name: string, value: Value) {
        if (this.bindings.has(name)) {
            this.bindings.set(name, value);
            return;
        }
        if (this.parent) {
            this.parent.update(name, value);
            return;
        }
        // Fall back to defining in current scope
        this.bindings.set(name, value);
    }
}

// ── Sentinel for return statements ───────────────────────────────────

class ReturnSignal {
    value: Value;
    constructor(value: Value) {
        this.value = value;
    }
}

// ── Interpreter ──────────────────────────────────────────────────────

class Interpreter {
    svg: SVGSVGElement;
    globalEnv: Env;

    private builtins: Record<string, (params: Record<string, Value>) => Value> = {
        circle: (p) => this.createCircle(p),
        rect: (p) => this.createRect(p),
        line: (p) => this.createLine(p),
        group: (p) => this.createGroup(p),
        text: (p) => this.createText(p),
    };

    constructor(svg: SVGSVGElement) {
        this.svg = svg;
        this.globalEnv = new Env();
    }

    run(ast: any) {
        this.svg.innerHTML = "";
        this.globalEnv = new Env();
        this.execStmts(ast, this.globalEnv);
    }

    // ── Statement execution ──────────────────────────────────────────

    execStmts(node: any, env: Env): Value | ReturnSignal {
        if (node?.type === "stmts") {
            for (const stmt of node.value) {
                const result = this.execStmt(stmt, env);
                if (result instanceof ReturnSignal) return result;
            }
        }
        return null;
    }

    execStmt(node: any, env: Env): Value | ReturnSignal | null {
        if (node?.type !== "stmt") return null;
        const s = node.value;
        switch (s.name) {
            case "have":
                env.set(s.id, this.evalExpr(s.expr, env));
                return null;
            case "paint": {
                const val = this.evalExpr(s.expr, env);
                this.paintValue(val);
                return null;
            }
            case "return":
                return new ReturnSignal(this.evalExpr(s.expr, env));
            case "if": {
                const cond = this.evalExpr(s.cond, env);
                if (cond) {
                    const result = this.execStmts(s.stmts, env);
                    if (result instanceof ReturnSignal) return result;
                }
                return null;
            }
        }
        return null;
    }

    paintValue(val: Value) {
        if (isShape(val)) {
            this.svg.appendChild(val.element);
        } else if (Array.isArray(val)) {
            for (const child of val) this.paintValue(child);
        }
    }

    // ── Expression evaluation ────────────────────────────────────────

    evalExpr(node: any, env: Env): Value {
        if (node == null) return null;

        // Binary / unary expression: [op, left, right] or ["not", expr]
        if (Array.isArray(node)) {
            if (node[0] === "not") return !this.evalExpr(node[1], env);
            const op = node[0] as string;
            const left = this.evalExpr(node[1], env);
            const right = this.evalExpr(node[2], env);
            return this.evalBinOp(op, left, right);
        }

        if (typeof node !== "object" || !("type" in node)) return null;

        switch (node.type) {
            // Wrapped binary ops from grammar (Sum / Product)
            case "sum":
            case "product":
                return this.evalExpr(node.value, env);

            // Primitives
            case "numba":
            case "strin":
            case "color":
            case "truth":
                return node.value;
            case "zilch":
                return null;

            // Identifiers
            case "identifier":
                return env.get(node.value);

            // Compound
            case "array":
                return (node.value as any[]).map((e) => this.evalExpr(e, env));
            case "table": {
                const entries: Record<string, Value> = {};
                for (const [key, val] of Object.entries(node.value)) {
                    entries[key] = this.evalExpr(val as any, env);
                }
                return { __type: "table", entries } as TableValue;
            }

            // Functions
            case "funct":
                return {
                    __type: "funct",
                    args: node.value.args,
                    ret: node.value.ret,
                    stmts: node.value.stmts,
                    closure: env,
                } as FunctValue;

            case "call":
                return this.evalCall(node.value, env);
        }

        return null;
    }

    private evalBinOp(op: string, left: Value, right: Value): Value {
        switch (op) {
            case "+":
                return (left as number) + (right as number);
            case "-":
                return (left as number) - (right as number);
            case "*":
                return (left as number) * (right as number);
            case "/":
                return (left as number) / (right as number);
            case "and":
                return !!(left && right);
            case "or":
                return !!(left || right);
            case ">":
                return (left as number) > (right as number);
            case "<":
                return (left as number) < (right as number);
            case ">=":
                return (left as number) >= (right as number);
            case "<=":
                return (left as number) <= (right as number);
            case "==":
                return left === right;
            case "!=":
                return left !== right;
            default:
                return null;
        }
    }

    // ── Function calls ───────────────────────────────────────────────

    evalCall(call: { id: string; param: Record<string, any> }, env: Env): Value {
        const params: Record<string, Value> = {};
        for (const [key, val] of Object.entries(call.param)) {
            params[key] = this.evalExpr(val, env);
        }

        if (call.id in this.builtins) {
            return this.builtins[call.id](params);
        }

        const func = env.get(call.id);
        if (!isFunct(func)) {
            throw new Error(`'${call.id}' is not a function`);
        }
        return this.callFunction(func, params);
    }

    callFunction(func: FunctValue, params: Record<string, Value>): Value {
        const localEnv = new Env(func.closure);
        for (const [key, val] of Object.entries(params)) {
            localEnv.set(key, val);
        }
        const result = this.execStmts(func.stmts, localEnv);
        if (result instanceof ReturnSignal) return result.value;
        return null;
    }

    // ── SVG shape builders ───────────────────────────────────────────

    private applyStyle(el: SVGElement, style: Value) {
        if (!isTable(style)) return;
        for (const [key, val] of Object.entries(style.entries)) {
            if (key === "onClick" || key === "onclick") continue;
            if (key === "fill" || key === "stroke") {
                el.setAttribute(key, String(val));
            } else {
                el.setAttribute(toKebab(key), String(val));
            }
        }
    }

    private attachOnClick(el: SVGElement, params: Record<string, Value>) {
        let handler = params["onClick"] ?? params["onclick"];
        if (!handler && isTable(params["style"])) {
            const style = params["style"] as TableValue;
            handler = style.entries["onClick"] ?? style.entries["onclick"];
        }
        if (isFunct(handler)) {
            el.style.cursor = "pointer";
            const func = handler;
            const interp = this;
            el.addEventListener("click", () => {
                interp.callFunction(func, {});
            });
        }
    }

    createCircle(p: Record<string, Value>): ShapeValue {
        const el = svgEl("circle");
        setAttr(el, "cx", p["x"]);
        setAttr(el, "cy", p["y"]);
        setAttr(el, "r", p["r"]);
        this.applyStyle(el, p["style"] ?? null);
        this.attachOnClick(el, p);
        return shape(el);
    }

    createRect(p: Record<string, Value>): ShapeValue {
        const el = svgEl("rect");
        setAttr(el, "x", p["x"]);
        setAttr(el, "y", p["y"]);
        setAttr(el, "width", p["width"]);
        setAttr(el, "height", p["height"]);
        setAttr(el, "rx", p["rx"]);
        setAttr(el, "ry", p["ry"]);
        this.applyStyle(el, p["style"] ?? null);
        this.attachOnClick(el, p);
        return shape(el);
    }

    createLine(p: Record<string, Value>): ShapeValue {
        const el = svgEl("line");
        for (const attr of ["x1", "y1", "x2", "y2"] as const) {
            setAttr(el, attr, p[attr]);
        }
        this.applyStyle(el, p["style"] ?? null);
        this.attachOnClick(el, p);
        return shape(el);
    }

    createGroup(p: Record<string, Value>): ShapeValue {
        const el = svgEl("g");
        const body = p["body"];
        if (Array.isArray(body)) {
            for (const child of body) {
                if (isShape(child)) el.appendChild(child.element);
            }
        }
        this.applyStyle(el, p["style"] ?? null);
        this.attachOnClick(el, p);
        return shape(el);
    }

    createText(p: Record<string, Value>): ShapeValue {
        const el = svgEl("text");
        setAttr(el, "x", p["x"]);
        setAttr(el, "y", p["y"]);
        el.textContent = String(p["content"] ?? "");
        this.applyStyle(el, p["style"] ?? null);
        this.attachOnClick(el, p);
        return shape(el);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────

function svgEl(tag: string) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function setAttr(el: SVGElement, name: string, val: Value) {
    if (val != null) el.setAttribute(name, String(val));
}

function shape(element: SVGElement): ShapeValue {
    return { __type: "shape", element };
}

function isShape(v: Value): v is ShapeValue {
    return v != null && typeof v === "object" && "__type" in v && v.__type === "shape";
}

function isTable(v: Value): v is TableValue {
    return v != null && typeof v === "object" && "__type" in v && v.__type === "table";
}

function isFunct(v: Value): v is FunctValue {
    return v != null && typeof v === "object" && "__type" in v && v.__type === "funct";
}

function toKebab(s: string): string {
    return s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

// ── Custom element ───────────────────────────────────────────────────

class TinyLayout extends HTMLElement {
    #shadow!: ShadowRoot;
    #svg!: SVGSVGElement;
    #error!: HTMLDivElement;
    #interpreter!: Interpreter;

    constructor() {
        super();
    }

    connectedCallback() {
        this.#shadow = this.attachShadow({ mode: "open" });

        this.#svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.#svg.setAttribute("width", "100%");
        this.#svg.setAttribute("height", "100%");

        this.#error = document.createElement("div");
        this.#error.style.cssText =
            "color:#c00;font-size:12px;padding:8px;font-family:monospace;white-space:pre-wrap;position:absolute;top:0;left:0;right:0;background:rgba(255,255,255,0.9);";

        const wrapper = document.createElement("div");
        wrapper.style.cssText = "position:relative;width:100%;height:100%;";

        wrapper.appendChild(this.#svg);
        wrapper.appendChild(this.#error);
        this.#shadow.appendChild(wrapper);

        this.#interpreter = new Interpreter(this.#svg);
        this.setCode(this.textContent ?? "");
    }

    setCode(code: string) {
        if (!this.#interpreter) return;
        this.#error.textContent = "";
        try {
            const ast = parse(code);
            this.#interpreter.run(ast);
        } catch (e: any) {
            this.#error.textContent = e.message ?? String(e);
        }
    }
}

customElements.define("tiny-layout", TinyLayout);

export { TinyLayout };
