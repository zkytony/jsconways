jsconways
=========

javascript object-oriented implementation of conways game of life

Try it at http://kaiyuzheng.me/dump/codings/life/

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
    conways.handleColor(true); // true means the color handling is triggered from clicking a button
```
In that basic example, you will need to put this line of code above `conways.run(50)`,
so that the color setting is done before running. But you can customize this for
your own purposes.

You can also make a pattern, by creating an array of coordinates, namely, a 2D Array that has row = coordinates,
and col = 2, which is just x and y. For example, for the *Gosper's Glider Gun*,
```javascript
      var coords =
     [
          [1, 5],[1, 6],[2, 5],[2, 6],[11, 5],
          [11, 6],[11, 7],[12, 4],[12, 8],[13, 3],
          [13, 9],[14, 3],[14, 9],[15, 6],[16, 4],
          [16, 8],[17, 5],[17, 6],[17, 7],[18, 6],
          [21, 3],[21, 4],[21, 5],[22, 3],[22, 4],
          [22, 5],[23, 2],[23, 6],[25, 1],[25, 2],
          [25, 6],[25, 7],[35, 3],[35, 4],[36, 3],[36, 4]
     ];
```
Then, you can feed this pattern to the current Conways object:
```javascript
     conways.feedPattern(coords); // the current pattern will be replaced. It will call draw() itself
```

Algorithm:

This version of Life improves the performance by only caring about the 'active' cells - ones that are alive and surrounds alive.

For a reminder of the rules of Conway's Game of Life:
```
    Any live cell with fewer than two live neighbours dies, as if caused by under-population.
    Any live cell with two or three live neighbours lives on to the next generation.
    Any live cell with more than three live neighbours dies, as if by overcrowding.
    Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
```

Good Luck!

-----
Copyright 2014 Kaiyu Zheng
