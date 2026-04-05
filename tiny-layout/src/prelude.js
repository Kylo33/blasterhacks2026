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
};

let path = ({points, fill = "#000", stroke = "none", strokeWidth = 2}) => {
    const p = new Path();
    p.points = points;
    p.fill = fill;
    p.strokeWidth = strokeWidth;
    p.stroke = stroke;
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
};

let ellipse = ({center, radius, fill = "#000", stroke = "none", strokeWidth = 2}) => {
    const e = new Ellipse();
    e.center = center
    e.radius = radius
    e.fill = fill
    e.stroke = stroke
    e.strokeWidth = strokeWidth
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
}

let curve = ({points, fill = "none", stroke = "#000", strokeWidth = 2}) => {
    const c = new Curve();
    c.points = points;
    c.fill = fill;
    c.stroke = stroke;
    c.strokeWidth = strokeWidth;
    return c;
};
