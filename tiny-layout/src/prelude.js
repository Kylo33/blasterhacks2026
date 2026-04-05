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

    get svgElement() { return this.path; }
};

let path = ({points, fill, stroke, strokeWidth}) => {
    const p = new Path();
    p.points = points;
    if (fill !== undefined) p.fill = fill;
    if (stroke !== undefined) p.stroke = stroke;
    if (strokeWidth !== undefined) p.strokeWidth = strokeWidth;
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

let ellipse = ({center, radius, fill, stroke, strokeWidth}) => {
    const e = new Ellipse();
    e.center = center
    e.radius = radius
    if (fill !== undefined) e.fill = fill;
    if (stroke !== undefined) e.stroke = stroke;
    if (strokeWidth !== undefined) e.strokeWidth = strokeWidth;
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

    get svgElement() { return this.path; }
}

let curve = ({points, fill, stroke, strokeWidth}) => {
    const c = new Curve();
    c.points = points;
    if (fill !== undefined) c.fill = fill;
    if (stroke !== undefined) c.stroke = stroke;
    if (strokeWidth !== undefined) c.strokeWidth = strokeWidth;
    return c;
};

class G {
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

    set rotate({degrees, center}) {
        const cx = center ? center.x : 0;
        const cy = center ? center.y : 0;
        this.g.setAttribute("transform", "rotate(" + degrees + ", " + cx + ", " + cy + ")")
    }

    get svgElement() { return this.g; }
}

let g = ({body, fill, stroke, strokeWidth, rotate}) => {
    const grp = new G();
    if (fill !== undefined) grp.fill = fill;
    if (stroke !== undefined) grp.stroke = stroke;
    if (strokeWidth !== undefined) grp.strokeWidth = strokeWidth;
    if (rotate !== undefined) grp.rotate = rotate;
    grp.body = body;
    return grp;
};
