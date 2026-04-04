This project aims to be an open-source version of Brilliant's
Diagrammer tool; our goal is to make it easy to create interactive
diagrams quickly.

# Language

## Types

- `numba`
- `funct`
- `shape`
- `array`
- `table`
- `color`
- `strin`
- `zilch`

## Example Program

```
have rotate = {s: shape, angle: numba} -> zilch {
	paint group {
    	rotate: angle,
        body: [
        	s,
        ],
    };
    
    have x = 5;
    if x >= 4 {
    	paint rect {
        	style: {
            	fill: #fcf,
            },
            onClick: {s: shape, angle: numba} -> zilch {
            	have x = x + 1;
            	return zilch;
            },
        };
    };
};
```
