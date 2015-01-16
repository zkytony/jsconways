jsconways
=========

javascript object-oriented implementation of conways game of life
Try it at http://zkytony.com/codings/life

Basic example:
Suppose you have a `div` tag with id `my-conways-space`, with which you 
intend to wrap a Conway's Game of Life board then you can place a 
instance of Conway's Game of Life under that `div`:
```javascript
     var conways = new Conways(number_of_rows, number_of_columns, 'my-conways-space', 'id-for-this-conways-board', 10);
     conways.draw();
     conways.run(50); // 50 is a pace (speed) for the game to run
``` 
*(Currently, if you try to place two Conways objects, only one will be run. Looking to fix that)*

Note that if you want to use buttons to control the game, here are some
functions that are helpful:
```javascript
    conways.pause(); // pause the game
    
    conways.clear(); // clears the world
```
To enable the display of color representing the strength (activity of a grid),
you need to do:
```javascript
    conways.color = true;
```
In that basic example, you will need to put this line of code above `conways.run(50)`,
so that the color setting is done before running. But you can customize this for
your own purposes.

For a reminder of the rules of Conway's Game of Life:
```
    Any live cell with fewer than two live neighbours dies, as if caused by under-population.
    Any live cell with two or three live neighbours lives on to the next generation.
    Any live cell with more than three live neighbours dies, as if by overcrowding.
    Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
```

-----
Copyright 2014 Kaiyu Zheng
