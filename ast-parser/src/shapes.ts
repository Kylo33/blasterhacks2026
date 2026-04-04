import { Shape } from './types.js'

class Rectangle extends Shape {
  constructor(x, y, w, h, rot, color, id, parent) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.rot = rot;
    this.color = color;
    this.id = id
    this.parent = parent;
  }
  build() {
    const obj = document.createElement('div');
    this.obj = obj;
    const parent = document.getElementById(parent);
    obj.id = this.id;
    obj.style.top = y;
    obj.style.left = x;
    obj.style.transform = `rotate(${this.rot}deg)`;
    obj.style.width = this.w;
    obj.style.height = this.h;
    obj.style.backgroundColor = this.color;
    obj.style.position = "absolute";
    parent.appendChild(obj);
  }
}
