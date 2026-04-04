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

export class Funct extends Node {
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

export class Return extends Varia {}

export class Numba extends Varia {
  declare val: number;
}

export class Truth extends Varia {}

export class Color extends Varia {}

export class Shape extends Node {
  x
  y
  constructor(x: number, y: number) {
    super()
    this.x = x;
    this.y = y;
  }
}

export class Group extends Shape {
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

export class Suite<T> extends Varia {
  array
  constructor(array: Array<T>) {
    super();
    this.array = array;
  }
  run() {}
}

export class Access extends Varia {
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

export class Table extends Varia {
  table
  constructor(table: Suite<Identifier>) {
    super();
    this.table = table;
  }
  run() { }
}

export class Strin extends Varia {
  declare val: string;
}

export class Zilch extends Varia {
  constructor() { super(0); }
  run() {null}
}
