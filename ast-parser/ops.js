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
