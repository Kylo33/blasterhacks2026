import { Numba } from 'types.js'

function is_numba(val) {
  return (val instanceof Numba);
}

function is_cmp(val) {
  return (val instanceof Numba);
}


class Add {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (is_numba(a) && is_numba(b)) {
      return a.val + b.val;
    } else {
      throw new Error("Invalid arithmetic type")
    }
  }
}

class Sub {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (is_numba(a) && is_numba(b)) {
      return a.val - b.val;
    } else {
      throw new Error("Invalid arithmetic type")
    }
  }
}

class Mul {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (is_numba(a) && is_numba(b)) {
      return a.val * b.val;
    } else {
      throw new Error("Invalid arithmetic type")
    }
  }
}

class Div {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (is_numba(a) && is_numba(b)) {
      return a.val / b.val;
    } else {
      throw new Error("Invalid arithmetic type")
    }
  }
}

class CmpType {}

class Equ extends CmpType {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (is_cmp(a) && is_cmp(b)) {
      return a.val == b.val;
    } else {
      throw new Error("Invalid comparison type")
    }
  }
}

class Neq extends CmpType {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (is_cmp(a) && is_cmp(b)) {
      return a.val != b.val;
    } else {
      throw new Error("Invalid comparison type")
    }
  }
}

class Gt extends CmpType {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (is_cmp(a) && is_cmp(b)) {
      return a.val > b.val;
    } else {
      throw new Error("Invalid comparison type")
    }
  }
}

class Lt extends CmpType {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (is_cmp(a) && is_cmp(b)) {
      return a.val < b.val;
    } else {
      throw new Error("Invalid comparison type")
    }
  }
}

class Gte extends CmpType {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (is_cmp(a) && is_cmp(b)) {
      return a.val>= b.val;
    } else {
      throw new Error("Invalid comparison type")
    }
  }
}

class Lte extends CmpType {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (is_cmp(a) && is_cmp(b)) {
      return a.val<= b.val;
    } else {
      throw new Error("Invalid comparison type")
    }
  }
}

class If {
  constructor(cmp, funct, context) {
    this.cmp = cmp;
    this.funct = funct;
    this.context = context;
  }
  run() {
    if (this.cmp.run()) {this.funct.run(this.context)}
    return;
  }
}
