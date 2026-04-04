export class Node {
  run() {}
}

export class Varia extends Node {
  val
  constructor(val: string | number | void) {
    super();
    this.val = val;
  }
  run() {
    return this.val;
  }
}

class Funct extends Node {
  args
  stmts
  constructor(args: Table, stmts: Array<Node>) {
    super();
    this.args = args;
    this.stmts = stmts;
  }
  run() {
    for (const stmt of this.stmts) {
      let ret = stmt.run();
      if (stmt instanceof Return) {
        return ret;
      }
      // need to handle if statements here
    }
  }
}

class Identifier extends Node {
  key
  val
  constructor(key: string, val: Varia) {
    super();
    this.key = key;
    this.val = val;
  }
  get() {
    return this.val.run(); 
  }
}

class Return extends Varia {}

class Numba extends Varia {}

class Truth extends Varia {}

class Color extends Varia {}

class Shape extends Node {
  x
  y
  constructor(x: number, y: number) {
    super()
    this.x = x;
    this.y = y;
  }
}

class Group extends Shape {
  shapes: Array<Shape>
  constructor(x: number, y: number) {
    super(x, y);
    this.shapes = [];
  }
  add_shape(shape: Shape) {
    this.shapes.push(shape);
  }
  run() {
    for (const shape of this.shapes) {
      shape.run();
    }
    return;
  }
}

class Suite<T> extends Varia {
  array
  constructor(array: Array<T>) {
    super();
    this.array = array;
  }
  run() {}
}

class Access extends Varia {
  key
  table
  constructor(table: Table, key: Strin) {
    super();
    this.table = table;
    this.key = key;
  }
  run() {
    let ret = this.table.table.array.find((value) => (value.key == this.key.val));
    if (ret != undefined) {
      return ret.val.run();
    }
    return undefined;
  }
}

class Table extends Varia {
  table
  constructor(table: Suite<Identifier>) {
    super();
    this.table = table;
  }
  run() { }
}

class Strin extends Varia {
  declare val: string;
}

class Zilch extends Varia {
  constructor() { super(0); }
  run() {null}
}
