This project aims to be an open-source version of Brilliant's
Diagrammer tool; our goal is to make it easy to create interactive
diagrams quickly.

# Language

## Types

- `int`
- `float`
- `funct`
- `shape`
- `array`
- `table`
- `color`
- `string`

## Example Program

```
funct rotate { s: shape, angle: float } do
    paint group {
        rotate: angle,
        body: [
            s,
        ],
    };
end

shape arrow {
    src: {x: float, y: float},
    dst: {x: float, y: float},
} do
    paint line {
        src: src,
        dst: dst,
    };
end

let a = arrow {
    src: {
        x: 10.0,
        y: 12.0,
    },
    dst: {
        x: 100.0,
        y: 100.0,
    },
};

paint a;
```
