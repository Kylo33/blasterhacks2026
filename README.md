This project aims to be an open-source version of Brilliant's
Diagrammer tool; our goal is to make it easy to create interactive
diagrams quickly.

# Language

## Types

## Example Program

```
// Draw a rectangle with a circle in it
draw rectangle {
    x: 0.0,
    y: 0.0,
    width: 100.0,
    height: 100.0,
    style: {
        fill: #ff0000,
    },
    body: [
        circle {
            x: 0.0,
            y: 0.0,
            radius: 100.0,
            style: {
                fill: #00ff00,
            }
        },
    ],
};

draw myRectangle;
```

- All arguments should be passed as dictionaries, which can be
  nested and destructured.

```
shape Arrow (
    src: {x: float, y: float},
    dst: {x: float, y: float},
) {
    draw Rectangle(
        x: 0.0,
        y: 0.0,
        width: 10.0,
        height: 10.0,
    );
}
```

## More Ideas

```
shape arrow {
    
}

var a = arrow {
    src: {
        x: 10.0,
        y: 12.0,
    },
    dst: {
        x: 100.0,
        y: 100.0,
    },
};
```




