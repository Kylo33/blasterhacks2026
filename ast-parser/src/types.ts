class Varia {
  constructor(val) {
    this.val = val;
  }
  run() {
    return this.val.run();
  }
}

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

class Return extends Varia {}

class Numba extends Varia {}

class Truth extends Varia {}

class Color extends Varia {}

class Group extends Varia {
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

class Array extends Varia {
  constructor(array) {
    this.array = array;
  }
  run() {}
}

class Table extends Varia {
  constructor(table) {
    this.table = table;
  }
  run() {}
}

class Strin extends Varia {}

class Zilch extends Varia {
  constructor() {}
  run() {}
}
