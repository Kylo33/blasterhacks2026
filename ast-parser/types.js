class Funct {
  constructor(args, ast) {
    this.args = args;
    this.ast = ast;
  }
  run() {
    return ast.run();
  }
}

class Val {
  constructor(val) {
    this.val = val;
  }
  run() {
    return this.val;
  }
}

class Color {
  constructor(color) {
    this.color = color;
  }
  run() {
    return this.val;
  }
}

class Group {
  constructor() {
    this.shapes = [];
  }
  add_shape(shape) {
    this.shapes.push(shape);
  }
  run() {
    for (const shape of this.shapes) {
      shape.run();
    }
    return;
  }
}

class Zilch {
  constructor() {}
  run() {}
}
