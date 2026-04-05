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

    /**
     * @param {any[]} val
     */
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

    /**
     * @param {string} val
     */
    set fill(val) {
        this.path.setAttribute("fill", val)
    }

    /**
     * @param {string} val
     */
    set stroke(val) {
        this.path.setAttribute("stroke", val)
    }

    /**
     * @param {number} val
     */
    set strokeWidth(val) {
        this.path.setAttribute("stroke-width", val)
    }

    set onClick(func) {
        this.path.addEventListener("click", func)
    }

    get svgElement() { return this.path; }
};

let path = ({points, fill, stroke, strokeWidth, onClick}) => {
    const p = new Path();
    p.points = points;
    if (fill !== undefined) p.fill = fill;
    if (stroke !== undefined) p.stroke = stroke;
    if (strokeWidth !== undefined) p.strokeWidth = strokeWidth;
    if (onClick !== undefined) p.onClick = onClick;
    return p;
};

class Ellipse {
    ellipse

    constructor() {
        this.ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    }

    paint() {
        __svg.appendChild(this.ellipse)
    }

    set center({x, y}) {
        this.ellipse.setAttribute("cx", x)
        this.ellipse.setAttribute("cy", y)
    }

    set radius({x, y}) {
        this.ellipse.setAttribute("rx", x)
        this.ellipse.setAttribute("ry", y)
    }

    set onClick(func) {
        this.ellipse.addEventListener("click", func)
    }

    /**
     * @param {string} val
     */
    set fill(val) {
        this.ellipse.setAttribute("fill", val)
    }

    /**
     * @param {string} val
     */
    set stroke(val) {
        this.ellipse.setAttribute("stroke", val)
    }

    /**
     * @param {number} val
     */
    set strokeWidth(val) {
        this.ellipse.setAttribute("stroke-width", val)
    }

    get svgElement() { return this.ellipse; }
};

let ellipse = ({center, radius, fill, stroke, strokeWidth, onClick}) => {
    const e = new Ellipse();
    e.center = center
    e.radius = radius
    if (fill !== undefined) e.fill = fill;
    if (stroke !== undefined) e.stroke = stroke;
    if (strokeWidth !== undefined) e.strokeWidth = strokeWidth;
    if (onClick !== undefined) e.onClick = onClick;
    return e;
};

class Curve {
    path

    constructor() {
        this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    }

    paint() {
        __svg.appendChild(this.path)
    }

    /**
     * @param {any[]} val
     */
    set points(val) {
        const ptsArr = [];
        for(let i = 0; val[i] != undefined; i++) {
            ptsArr.push(val[i]);
        }

        if (ptsArr.length === 0) {
            this.path.setAttribute("d", "");
            return;
        }

        const segments = [];
        segments.push("M " + ptsArr[0].x + " " + ptsArr[0].y);
        if (ptsArr.length >= 2) {
            const cp = ptsArr[1];
            const end = ptsArr.length >= 3 ? ptsArr[2] : ptsArr[1];
            segments.push("Q " + cp.x + " " + cp.y + ", " + end.x + " " + end.y);
            for (let i = 3; i < ptsArr.length; i++) {
                segments.push("T " + ptsArr[i].x + " " + ptsArr[i].y);
            }
        }
        this.path.setAttribute("d", segments.join(" "));
    }

    /**
     * @param {string} val
     */
    set fill(val) {
        this.path.setAttribute("fill", val)
    }

    /**
     * @param {string} val
     */
    set stroke(val) {
        this.path.setAttribute("stroke", val)
    }

    /**
     * @param {number} val
     */
    set strokeWidth(val) {
        this.path.setAttribute("stroke-width", val)
    }

    set onClick(func) {
        this.path.addEventListener("click", func)
    }

    get svgElement() { return this.path; }
}

let curve = ({points, fill, stroke, strokeWidth, onClick}) => {
    const c = new Curve();
    c.points = points;
    if (fill !== undefined) c.fill = fill;
    if (stroke !== undefined) c.stroke = stroke;
    if (strokeWidth !== undefined) c.strokeWidth = strokeWidth;
    if (onClick !== undefined) c.onClick = onClick;
    return c;
};

class Group {
    g

    constructor() {
        this.g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    }

    paint() {
        __svg.appendChild(this.g)
    }

    /**
     * @param {any[]} val
     */
    set body(val) {
        for (let i = 0; val[i] != undefined; i++) {
            this.g.appendChild(val[i].svgElement);
        }
    }

    /**
     * @param {string} val
     */
    set fill(val) {
        this.g.setAttribute("fill", val)
    }

    /**
     * @param {string} val
     */
    set stroke(val) {
        this.g.setAttribute("stroke", val)
    }

    /**
     * @param {number} val
     */
    set strokeWidth(val) {
        this.g.setAttribute("stroke-width", val)
    }

    set onClick(func) {
        this.g.addEventListener("click", func)
    }

    set rotate({degrees, center}) {
        const cx = center ? center.x : 0;
        const cy = center ? center.y : 0;
        this.g.setAttribute("transform", "rotate(" + degrees + ", " + cx + ", " + cy + ")")
    }

    get svgElement() { return this.g; }
}

let group = ({body, fill, stroke, strokeWidth, rotate, onClick}) => {
    const grp = new Group();
    if (fill !== undefined) grp.fill = fill;
    if (stroke !== undefined) grp.stroke = stroke;
    if (strokeWidth !== undefined) grp.strokeWidth = strokeWidth;
    if (rotate !== undefined) grp.rotate = rotate;
    if (onClick !== undefined) grp.onClick = onClick;
    grp.body = body;
    return grp;
};

class Text {
    text

    constructor() {
        this.text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    }

    paint() {
        __svg.appendChild(this.text)
    }

    set content(val) {
        this.text.textContent = val;
    }

    set position({x, y}) {
        this.text.setAttribute("x", x)
        this.text.setAttribute("y", y)
    }

    /**
     * @param {string} val
     */
    set fill(val) {
        this.text.setAttribute("fill", val)
    }

    /**
     * @param {string} val
     */
    set stroke(val) {
        this.text.setAttribute("stroke", val)
    }

    /**
     * @param {number} val
     */
    set strokeWidth(val) {
        this.text.setAttribute("stroke-width", val)
    }

    set onClick(func) {
        this.text.addEventListener("click", func)
    }

    /**
     * @param {number} val
     */
    set fontSize(val) {
        this.text.setAttribute("font-size", val)
    }

    /**
     * @param {string} val
     */
    set fontFamily(val) {
        this.text.setAttribute("font-family", val)
    }

    get svgElement() { return this.text; }
}

let text = ({content, position, fill, stroke, strokeWidth, fontSize, fontFamily, onClick}) => {
    const t = new Text();
    t.content = content;
    t.position = position;
    if (fill !== undefined) t.fill = fill;
    if (stroke !== undefined) t.stroke = stroke;
    if (strokeWidth !== undefined) t.strokeWidth = strokeWidth;
    if (fontSize !== undefined) t.fontSize = fontSize;
    if (fontFamily !== undefined) t.fontFamily = fontFamily;
    if (onClick !== undefined) t.onClick = onClick;
    return t;
};
