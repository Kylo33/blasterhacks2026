import { Numba, Funct } from './types.ts'

class Math {
  a
  b
  constructor(a: Numba, b: Numba) {
    this.a = a;
    this.b = b;
  }
}

class Add extends Math{
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
    }
  }
}

class Sub extends Math {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
    }
  }
}

class Mul extends Math {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (typeof a === 'number' && typeof b === 'number') {
    return a * b;
    }
  }
}

class Div extends Math {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (typeof a === 'number' && typeof b === 'number') {
    return a / b;
    }
  }
}

class CmpType {
  a
  b
  constructor(a: Numba, b: Numba) {
    this.a = a;
    this.b = b;
  }
  run() {return true}
}

class Equ extends CmpType {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    return a == b;
  }
}

class Neq extends CmpType {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    return a != b;
  }
}

class Gt extends CmpType {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    return a > b;
  }
}

class Lt extends CmpType {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    return a < b;
  }
}

class Gte extends CmpType {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    return a >= b;
  }
}

class Lte extends CmpType {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    return a <= b;
  }
}

class If {
  cmp
  funct
  constructor(cmp: CmpType, funct: Funct) {
    this.cmp = cmp;
    this.funct = funct;
  }
  run() {
    if (this.cmp.run()) {this.funct.run()}
    return;
  }
}
