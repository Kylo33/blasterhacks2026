class Funct {
  constructor(args, ast, context) {
    this.args = args;
    this.ast = ast;
    this.context = context;
  }
  run() {
    for (const ast of this.ast) {
      let ret = ast.run(context);
      if (ret !== undefined) {
        context.append(ret);
      }
      if (ast instanceof Return) {
        return ret;
      }
    }
  }
}

class Assign {
  constructor(funct) {
    this.val = undefined;
    this.funct = funct;
    this.run = false;
  }
  run() {
    if (this.run == false) {
      this.run = true;
      if (this.funct instanceof Funct) {
        this.val = this.funct.run();
      } else {
        this.val = this.funct;
      }
    }
    return this.val;
  }
}

class Return {
  constructor(val) {
    this.val = val;
  }
  run() {
    return this.val.run();
  }
}

class Numba {
  constructor(val) {
    this.val = val;
  }
  run() { return this.val; }
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

class Array {
  constructor(array) {
    this.array = array;
  }
  run() {}
}

class Table {
  constructor(table) {
    this.table = table;
  }
  run() {}
}

class Strin {
  constructor(val) {
    this.val = val;
  }
  run() { return this.val };
}

class Zilch {
  constructor() {}
  run() {}
}
