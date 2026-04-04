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

class Shape {
  constructor() {
    // i actively don't know
  }
}
