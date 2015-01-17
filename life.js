/*
  Any live cell with fewer than two live neighbours dies, as if caused by under-population.
  Any live cell with two or three live neighbours lives on to the next generation.
  Any live cell with more than three live neighbours dies, as if by overcrowding.
  Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

  Copyright 2014 Kaiyu Zheng
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
    this.counter = this.init2DField(this.row, this.col, null);

    this.active = {}; // used for improving performance -- only care about active cells

    this.parentID = parentID;
    this.id = id;
    this.size = size;

    this.running = false;
    this.color = false;
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
        r = parseInt(rc[0]);
        c = parseInt(rc[1]);
        var status = this.destiny(r, c);
        this.counter[r][c] += status;
    }
    this.current = this.successor.slice();
    this.successor = this.init2DField(this.row, this.col, null);
    if (gens >= 1) {
        this.deleteOldActive(gens - 1); // clean out the old actives
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
            'float' : 'left',
            'border' : '1px solid #66CCFF',
            'background-color' : 'white',
            'width' : this.size - 2 + "px",
            'height' : this.size - 2 + "px"
        });

        $('.hidden').css({
            'display' : 'none'
        });

        // add hook to grid-conways class
        var conways = this; 
        var clicked = 0;
        var dragged = false;
        $('.grid-conways')
            .mouseup(function() {
                $('.grid-conways').unbind('mouseenter.namespace');
            })
            .mousedown(function() {
                $('.grid-conways').bind('mouseenter.namespace', function(e) {
                    conways.clicked(e.target.id);
                });
                return false;
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
                $('#' + id).css('background-color', 'black');
            } else {
                $('#' + id).css('background-color', 'white');
            }
        }
    }
}

// Creates one grid; Returns the html string
Conways.prototype.create = function(r, c, alive, visible) {
    var id = r + '-' + c;
    var htmlString = "<div id='" + id + "' class='grid-conways";
    if (alive) {
        $('#' + id).css('background-color', 'black');
    } else {
        $('#' + id).css('background-color', 'white');
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
        $('#' + id).css('background-color', 'black');
    } else {
        this.current[r][c] = 0;
        $('#' + id).css('background-color', 'white');
    }
    this.addActive(r, c); // changed because of clicking
}

// run this conway's game of life
var count = 0;
Conways.prototype.run = function(pace) {
    if (!this.running) {
        var conways = this;
        conways.running = true;
        conways.interval = setInterval(function() {
            conways.reproduce();
            conways.draw();
            if (conways.color) {
                conways.applyColor();
            } else {
                conways.removeColor();
            }
            
            count ++;                      
            $('.generation').html(count);
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
    this.counter = this.init2DField(this.row, this.col, null);
    this.removeColor();
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

// handles the color depending on whether or not the conway's game is running
Conways.prototype.handleColor = function() {
    if (this.running) {
        this.color = !this.color;
    } else {
        if (!this.color) {
            this.applyColor();
        } else {
            this.removeColor();
        }
    }
}

// applies the color to each grid
Conways.prototype.applyColor = function() {
    this.color = true;
    for (id in this.active) {
        var rc = id.split('-');
        r = parseInt(rc[0]);
        c = parseInt(rc[1]);
        if (this.current[r][c] == 1) {
            $('#' + id).css('background-color', 'black');
        } else if (this.counter[r][c] == 0) {
            $('#' + id).css('background-color', 'white');            
        } else if (this.counter[r][c] > 0 && this.counter[r][c] <= 5) {
            $('#' + id).css('background-color', '#0000FF');
        } else if (this.counter[r][c] > 5 && this.counter[r][c] <= 10) {
            $('#' + id).css('background-color', '#99CCFF');
        } else if (this.counter[r][c] > 10 && this.counter[r][c] <= 20) {
            $('#' + id).css('background-color', '#66FF66');
        } else if (this.counter[r][c] > 20 && this.counter[r][c] <= 30) {
            $('#' + id).css('background-color', '#FFCC00');
        } else {
            $('#' + id).css('background-color', '#FF3300');
        }
    }
}

// remove the color from each grid
Conways.prototype.removeColor = function() {
    this.color = false;
    for (id in this.active) {
        var rc = id.split('-');
        r = parseInt(rc[0]);
        c = parseInt(rc[1]);
        if (this.current[r][c] == 1) {
            $('#' + id).css('background-color', 'black');
        } else {
            $('#' + id).css('background-color', 'white');
        }
    }
}