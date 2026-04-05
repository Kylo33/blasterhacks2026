import type { isAssertEntry } from 'typescript';
import { Numba, Funct } from './types.ts'

class Math {
  a
  b
  constructor(a: Numba, b: Numba) {
    this.a = a;
    this.b = b;
  }
}

export class Add extends Math{
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
    }
  }
}

export class Sub extends Math {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
    }
  }
}

export class Mul extends Math {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (typeof a === 'number' && typeof b === 'number') {
    return a * b;
    }
  }
}

export class Div extends Math {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    if (typeof a === 'number' && typeof b === 'number') {
    return a / b;
    }
  }
}

export class CmpType {
  a
  b
  constructor(a: Numba, b: Numba) {
    this.a = a;
    this.b = b;
  }
  run() {return true}
}

export class Equ extends CmpType {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    return a == b;
  }
}

export class Neq extends CmpType {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    return a != b;
  }
}

export class Gt extends CmpType {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    return a > b;
  }
}

export class Lt extends CmpType {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    return a < b;
  }
}

export class Gte extends CmpType {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    return a >= b;
  }
}

export class Lte extends CmpType {
  run() {
    const a = this.a.run();
    const b = this.b.run();
    return a <= b;
  }
}

export class IfStatement {
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
