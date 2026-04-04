class Add {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    return this.a.run() + this.b.run();
  }
}

class Sub {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    return this.a.run() - this.b.run();
  }
}

class Mul {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    return this.a.run() * this.b.run();
  }
}

class Div {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    return this.a.run() / this.b.run();
  }
}

class Equ {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    return this.a.run() == this.b.run();
  }
}

class Neq {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    return this.a.run() != this.b.run();
  }
}

class Gt {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    return this.a.run() > this.b.run();
  }
}

class Lt {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    return this.a.run() < this.b.run();
  }
}

class Gte {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    return this.a.run() >= this.b.run();
  }
}

class Lte {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  run() {
    return this.a.run() <= this.b.run();
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
