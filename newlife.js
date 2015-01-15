/*
  Any live cell with fewer than two live neighbours dies, as if caused by under-population.
  Any live cell with two or three live neighbours lives on to the next generation.
  Any live cell with more than three live neighbours dies, as if by overcrowding.
  Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 */

// given an 2D array, with 0 and 1 entries, constructs a Conways object
function Conways(initArray, parentID, id, size) {
    this.row = 3 * initArray.length;
    this.col = 3 * initArray[0].length;

    this.rowBound = initArray.length; // where the visible part's index is
    this.colBound = initArray[0].length;

    this.current = Conways.init2DArray(this.row, this.col);
    this.successor = Conways.init2DArray(this.row, this.col);

    this.active = {}; // used for improving performance -- only care about active cells

    this.parentID = parentID;
    this.id = id;
    this.size = size;

    this.running = false;
    this.interval;

/*    this.row = initArray.length;
    this.col = initArray[0].length;

    this.current = initArray.slice();
    this.successor = Conways.init2DArray(this.row, this.col);

    this.parentID = parentID;
    this.id = id;
    this.size = size;

    this.running = false;
    this.interval;
*/
}

// If current is true, the new life status will apply
// to the 'current' array, otherwise, will apply the 
// new life status to successor array

// If current is true, the new life status will apply
// to the 'current' array, otherwise, will apply the 
// new life status to successor array


Conways.prototype.reproduce = function() {
    for (id in this.active) {
        if (this.active.hasOwnProperty(id)) {
            var rc = id.split('-');
            var status = this.destiny(rc[0], rc[1]);
        }
    }
    this.current = this.successor.slice();
    this.successor = Conways.init2DArray(this.row, this.col);
/*    for (var i = 0; i < this.row; i++) {
        for (var j = 0; j < this.col; j++) {
            var status = this.destiny(i, j); // could be used for track
        }
    }
    // successor has been constructed
    this.current = this.successor.slice();
    this.successor = Conways.init2DArray(this.row, this.col);
*/
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
            count = this.current[r-1][c-1] + this.current[r-1][c] + this.current[r-1][c+1]
                + this.current[r][c-1] + this.current[r][c+1] + this.current[r+1][c-1]
                + this.current[r+1][c] + this.current[r+1][c+1];
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
                htmlString += this.create(i, j, this.current[i][j]);
            }
        }
        $('#' + this.parentID).append(htmlString);
        $('.grid').css({
            'width' : this.size - 2 + "px",
            'height' : this.size - 2 + "px"
        });
        $('#' + this.id).css({
            'width' : this.size * this.col + "px",
            'height' : this.size * this.row + "px"
        });
    } else {
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.col; j++) {
                var id = i + '-' + j;
                if (this.current[i][j] == 1) {
                    $('#' + id).addClass("alive");
                } else {
                    $('#' + id).removeClass("alive");
                }           
            }
        }
    }
}

// Creates one grid; Returns the html string
Conways.prototype.create = function(r, c, alive) {
    var id = r + '-' + c;
    var htmlString = "<div id='" + id + "' class='grid";
    if (alive) {
        htmlString += " alive";
    }
    htmlString += "' ></div>";
    return htmlString;
}

// called when a grid is clicked
Conways.prototype.clicked = function(id) {
    var r = id.split('-')[0];
    var c = id.split('-')[1];
    if (this.current[r][c] == 0) {
        this.current[r][c] = 1;
        $('#' + id).addClass("alive");
    } else {
        this.current[r][c] = 0;
        $('#' + id).removeClass("alive");
    }
}

// run this conway's game of life
Conways.prototype.run = function(pace, currentGeneration) {
    var conways = this;
    conways.running = true;
    conways.interval = setInterval(function() {
        conways.reproduce();
        conways.draw();
        
        currentGeneration ++;
        $('#generation h3').html(currentGeneration);
    }, pace);
}

Conways.prototype.pause = function() {
    this.running = false;
    clearInterval(this.interval);
}

Conways.prototype.clear = function() {
    if (this.running) {
        this.running = false;
        clearInterval(this.interval);
    }
    this.current = init2DArray(this.row, this.col);
    this.successor = init2DArray(this.row, this.col);
    this.draw();
}

// adds the possible active cell indices into the 'active' object
Conways.prototype.addActive = function(r, c) {
    this.active[r + '-' + c] = 0;
    if (r == 0) {
        if (c == 0) {
            this.active[(r+1) + '-' + c] = 0;
            this.active[r + '-' + (c+1)]; 
            this.active[(r+1)(c+1)];
        } else if (c == this.col - 1) {
            this.active[r + '-' + (c-1)];
            this.active[(r+1) + '-' + c];
            this.active[(r+1) + '-' + (c-1)];
        } else {
            this.active[r + '-' + (c-1)]; 
            this.active[r + '-' + (c+1)]; 
            this.active[(r+1) + '-' + (c-1)];
            this.active[(r+1)+ '-' + c];
            this.active[(r+1) + '-' + (c+1)];
        }
    } else if (r == this.row - 1) {
        if (c == 0) {
            this.active[(r-1) + '-' + c]; 
            this.active[r + '-' + (c+1)];
            this.active[(r-1) + '-' + (c+1)];
        } else if (c == this.col - 1) {
            this.active[r + '-' + (c-1)];
            this.active[(r-1) + '-' + c];
            this.active(r-1](c-1);
        } else {
            this.active[r + '-' + (c-1)];
            this.active[r + '-' + (c+1)];
            this.active[(r-1) + '-' + (c-1)]; 
            this.active[(r-1) + '-' + c];
            this.active[(r-1) + '-' + (c+1);
        }
    } else {
        if (c == 0) {
            this.active[(r-1) + '-' + c];
            this.active[(r-1) + '-' + (c+1)];
            this.active[r + '-' + (c+1)];
            this.active[(r+1) + '-' + (c+1)];
            this.active[(r+1)+ '-' + c];
        } else if (c == this.col - 1) {
            this.active[(r-1) + '-' + (c-1)];
            this.active[(r-1) + '-' + c];
            this.active[r + '-' + (c-1)];
            this.active[(r+1) + '-' + (c-1)]; 
            this.active[(r+1)+ '-' + c];
        } else {
            this.active[(r-1) + '-' + (c-1)];
            this.active[(r-1) + '-' + c];
            this.active[(r-1) + '-' + (c+1)];
            this.active[r + '-' + (c-1)];
            this.active[r + '-' + (c+1)];
            this.active[(r+1) + '-' + (c-1)];
            this.active[(r+1)+ '-' + c]; 
            this.active[(r+1) + '-' + (c+1);
        }
    }    
}

Conways.init2DArray = function(r, c) {
    var arr = new Array(r);
    for (var i = 0; i < r; i++) {
        arr[i] = new Array(c);
        for (var j = 0; j < c; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}
