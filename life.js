/*
  Any live cell with fewer than two live neighbours dies, as if caused by under-population.
  Any live cell with two or three live neighbours lives on to the next generation.
  Any live cell with more than three live neighbours dies, as if by overcrowding.
  Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 */

// given row and column, constructs a Conways object with empty fields
function Conways(row, col, parentID, id, size) {
    var additionRowTop = (row <= 20 ? row : 5);
    var additionColLeft = (col <= 20 ? col : 5);
    this.row = 2 * additionRowTop + row;
    this.col = 2 * additionColLeft + col;
    this.rowLength = row; // the length of the row that is visible
    this.colLength = col;

    this.rowBound = additionRowTop; // where the visible part's index is
    this.colBound = additionColLeft;

    this.current = this.init2DField(this.row, this.col, null);
    this.successor = this.init2DField(this.row, this.col, null);

    this.active = {}; // used for improving performance -- only care about active cells

    this.parentID = parentID;
    this.id = id;
    this.size = size;

    this.running = false;
    this.interval;
}

// given an 2D array, with 0 and 1 entries, constructs a Conways object
Conways.createAndFeedArray = function(initArray, parentID, id, size) {

    var additionRowTop = (initArray.length <= 20 ? initArray.length : 5);
    var additionColLeft = (initArray[0].length <= 20 ? initArray[0].length : 5);
    this.row = 2 * additionRowTop + initArray.length;
    this.col = 2 * additionColLeft + initArray[0].length;
    this.rowLength = initArray.length;
    this.colLength = initArray[0].length;

    this.rowBound = additionRowTop; // where the visible part's index is
    this.colBound = additionColLeft;

    this.current = this.init2DField(this.row, this.col, initArray);
    this.successor = this.init2DField(this.row, this.col, null);

    this.active = {}; // used for improving performance -- only care about active cells

    this.parentID = parentID;
    this.id = id;
    this.size = size;

    this.running = false;
    this.interval;
}

// If current is true, the new life status will apply
// to the 'current' array, otherwise, will apply the 
// new life status to successor array

// If current is true, the new life status will apply
// to the 'current' array, otherwise, will apply the 
// new life status to successor array

var gens = 0;
Conways.prototype.reproduce = function() {
    for (id in this.active) {
        var rc = id.split('-');
        var status = this.destiny(parseInt(rc[0]), parseInt(rc[1]));
    }
    this.current = this.successor.slice();
    this.successor = this.init2DField(this.row, this.col, null);
    if (gens >= 2) {
        this.deleteOldActive(gens - 2); // clean out the old actives
    }
    
    if (gens >= 100 && gens % 100 == 0) {
        this.clearOutOfBound();
    }
}

// returns 0 or 1 representing the life status of a grid in the next generation
// it also calls 'live()' if life status is 1, and 'die()' if it is 0
Conways.prototype.destiny = function(r, c) {
    var count = 0;
    if (r == 0) {
        if (c == 0) {
            count = this.current[r+1][c] + this.current[r][c+1] + this.current[r+1][c+1];
        } else if (c == this.col - 1) {
            count = this.current[r][c-1] + this.current[r+1][c] + this.current[r+1][c-1];
        } else {
            count = this.current[r][c-1] + this.current[r][c+1] 
                + this.current[r+1][c-1] + this.current[r+1][c] + this.current[r+1][c+1];
        }
    } else if (r == this.row - 1) {
        if (c == 0) {
            count = this.current[r-1][c] + this.current[r][c+1] + this.current[r-1][c+1];
        } else if (c == this.col - 1) {
            count = this.current[r][c-1] + this.current[r-1][c] + this.current[r-1][c-1];
        } else {
            count = this.current[r][c-1] + this.current[r][c+1] 
                + this.current[r-1][c-1] + this.current[r-1][c] + this.current[r-1][c+1];
        }
    } else {
        if (c == 0) {
            count = this.current[r-1][c] + this.current[r-1][c+1] + this.current[r][c+1]
                + this.current[r+1][c+1] + this.current[r+1][c];
        } else if (c == this.col - 1) {
            count = this.current[r-1][c-1] + this.current[r-1][c] + this.current[r][c-1]
                + this.current[r+1][c-1] + this.current[r+1][c];
        } else {
            count = this.current[r-1][c-1] + this.current[r-1][c]
                + this.current[r-1][c+1] + this.current[r][c-1]
                + this.current[r+1][c] + this.current[r+1][c+1]
                + this.current[r][c+1] + this.current[r+1][c-1];
        }
    }
 
    var result = 0;
    if (count < 2) {
        result = 0;
    } else if (count == 2 || count == 3) {
        result = this.current[r][c];
    } else if (count > 3) {
        result = 0;
    }
    
    if (this.current[r][c] == 0 && count == 3) {
        result = 1;
    }

    // change
    if (this.current[r][c] != result) {
        this.addActive(r, c);
    }

    if (result == 1) {
        this.successor[r][c] = 1;
    } else {
        this.successor[r][c] = 0;
    }
    return result;
}

// Produces the conways game under the element with id parentID,
// based on the current state
Conways.prototype.draw = function() {
    if($('#' + this.id).length == 0) {
        var htmlString = "<div id='" + this.id + "' class='conways-board'>";
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.col; j++) {
                if (this.inViewPort(i, j)) {
                    htmlString += this.create(i, j, this.current[i][j], true);
                } else {
                    htmlString += this.create(i, j, this.current[i][j], false);
                }
            }
        }
        $('#' + this.parentID).append(htmlString);
        $('.grid-conways').css({
            'width' : this.size - 2 + "px",
            'height' : this.size - 2 + "px"
        });

        // add hook to grid-conways class
        var conways = this; 
        $('.grid-conways').on('click', function() {
            var grid = $(this);
            conways.clicked(grid.attr("id")); 
        });

        $('#' + this.id).css({
            'width' : this.size * this.colLength + "px",
            'height' : this.size * this.rowLength + "px"
        });
    } else { 
        for (id in this.active) {
            var rc = id.split('-');
            r = parseInt(rc[0]);
            c = parseInt(rc[1]);
            if (this.current[r][c] == 1) {
                $('#' + id).addClass("alive");
            } else {
                $('#' + id).removeClass("alive");
            }
        }
    }
}

// Creates one grid; Returns the html string
Conways.prototype.create = function(r, c, alive, visible) {
    var id = r + '-' + c;
    var htmlString = "<div id='" + id + "' class='grid-conways";
    if (alive) {
        htmlString += " alive";
    }
    if (!visible) {
        htmlString += " hidden";
    }
    htmlString += "' ></div>";
    return htmlString;
}

// called when a grid is clicked
Conways.prototype.clicked = function(id) {
    var r = parseInt(id.split('-')[0]);
    var c = parseInt(id.split('-')[1]);
    if (this.current[r][c] == 0) {
        this.current[r][c] = 1;
        $('#' + id).addClass("alive");
    } else {
        this.current[r][c] = 0;
        $('#' + id).removeClass("alive");
    }
    this.addActive(r, c); // changed because of clicking
}

// run this conway's game of life
Conways.prototype.run = function(pace, currentGeneration) {
    if (!this.running) {
        var conways = this;
        conways.running = true;
        conways.interval = setInterval(function() {
            conways.reproduce();
            conways.draw();
            
            currentGeneration ++;                      
            $('.generation').html(currentGeneration);           
        }, pace);
    }
}

Conways.prototype.pause = function() {
    if (this.running) {
        this.running = false;
        clearInterval(this.interval);
    }
}

Conways.prototype.clear = function() {
    this.current = this.init2DField(this.row, this.col, null);
    this.successor = this.init2DField(this.row, this.col, null);
    this.draw();
    this.active = {};

    gens = 0;
    $('.generation').html('0');
}

// adds the possible active cell indices into the 'active' object
// gens is a global variable
Conways.prototype.addActive = function(r, c) {
    this.active[r + '-' + c] = gens;
    if (r == 0) {
        if (c == 0) {
            this.active[(r+1) + '-' + c] = gens;
            this.active[r + '-' + (c+1)] = gens; 
            this.active[(r+1) + '-' + (c+1)] = gens;
        } else if (c == this.col - 1) {
            this.active[r + '-' + (c-1)] = gens;
            this.active[(r+1) + '-' + c] = gens;
            this.active[(r+1) + '-' + (c-1)] = gens;
        } else {
            this.active[r + '-' + (c-1)] = gens; 
            this.active[r + '-' + (c+1)] = gens; 
            this.active[(r+1) + '-' + (c-1)] = gens;
            this.active[(r+1)+ '-' + c] = gens;
            this.active[(r+1) + '-' + (c+1)] = gens;
        }
    } else if (r == this.row - 1) {
        if (c == 0) {
            this.active[(r-1) + '-' + c] = gens; 
            this.active[r + '-' + (c+1)] = gens;
            this.active[(r-1) + '-' + (c+1)] = gens;
        } else if (c == this.col - 1) {
            this.active[r + '-' + (c-1)] = gens;
            this.active[(r-1) + '-' + c] = gens;
            this.active[(r-1) + '-' + (c-1)] = gens;
        } else {
            this.active[r + '-' + (c-1)] = gens;
            this.active[r + '-' + (c+1)] = gens;
            this.active[(r-1) + '-' + (c-1)] = gens; 
            this.active[(r-1) + '-' + c] = gens;
            this.active[(r-1) + '-' + (c+1)] = gens;
        }
    } else {
        if (c == 0) {
            this.active[(r-1) + '-' + c] = gens;
            this.active[(r-1) + '-' + (c+1)] = gens;
            this.active[r + '-' + (c+1)] = gens;
            this.active[(r+1) + '-' + (c+1)] = gens;
            this.active[(r+1)+ '-' + c] = gens;
        } else if (c == this.col - 1) {
            this.active[(r-1) + '-' + (c-1)] = gens;
            this.active[(r-1) + '-' + c] = gens;
            this.active[r + '-' + (c-1)] = gens;
            this.active[(r+1) + '-' + (c-1)] = gens; 
            this.active[(r+1)+ '-' + c] = gens;
        } else {
            this.active[(r-1) + '-' + (c-1)] = gens;
            this.active[(r-1) + '-' + c] = gens;
            this.active[(r-1) + '-' + (c+1)] = gens;
            this.active[r + '-' + (c-1)] = gens;
            this.active[r + '-' + (c+1)] = gens;
            this.active[(r+1) + '-' + (c-1)] = gens;
            this.active[(r+1)+ '-' + c] = gens; 
            this.active[(r+1) + '-' + (c+1)] = gens;
        }
    }    
}

Conways.prototype.inViewPort = function(r, c) {
    return (r >= this.rowBound && r < this.rowBound + this.rowLength)
        && (c >= this.colBound && c < this.colBound + this.colLength);
}

// delete the older active cells with generation gens
Conways.prototype.deleteOldActive = function(gens) {
    for (id in this.active) {
        if (this.active[id] == gens) {
            delete this.active[id];
        }
    }
}

Conways.prototype.init2DField = function(r, c, initArray) {
    var arr = new Array(r);
    var m = 0;
    var n = 0;
    for (var i = 0; i < r; i++) {
        arr[i] = new Array(c);
        for (var j = 0; j < c; j++) {
            if (initArray != null && this.inViewPort(i, j)) {
                arr[i][j] = initArray[n][m];
                m++;
                if (m >= initArray[0].length) {
                    m = 0;
                    n++;
                }
            }
            arr[i][j] = 0;
        }
    }
    return arr;
}

Conways.prototype.clearOutOfBound = function() {
    for (id in this.active) {
        var rc = id.split('-');
        r = parseInt(rc[0]);
        c = parseInt(rc[1]);
        if (!this.inViewPort(r, c)) {
            this.successor[r][c] = 0;
            delete this.active[id];
        }
    }
}