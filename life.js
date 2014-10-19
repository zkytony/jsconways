function Grid(size, index, ri, ci, adjlist) {
	this.rindex = ri;
	this.cindex = ci;

	this.width = size;
	this.height = size;

	this.size = size;
	this.index = index;

	this.live = false;

	// the adjlist keeps track of the indeces of the adjacent grid
	if (adjlist != null && adjlist instanceof Array) {
		this.adjlist = adjlist;
	} else {
		this.adjlist = new Array();
	}
}

Grid.prototype.decideLife = function(live) {
	this.live = live;
};

Grid.prototype.liveAdjacents = function() {
	var count = 0;
	for (var i = 0; i < this.adjlist.length; i++) {
		if (this.adjlist[i].live) {
			//alert("around " + this.index + ", " + this.adjlist[i].index + " is alive");
			count++;
		}
	} 
	return count;
};

Grid.prototype.decideState = function() {
	//alert("in decideState: " + gridList[0][2].index + " has " + gridList[0][2].liveAdjacents());
	if (this.liveAdjacents() < 2 || this.liveAdjacents() > 3) {
		return false;
	} else if (this.liveAdjacents() == 2) {
		return this.live;
	} else if (this.liveAdjacents() == 3) {
		return true;
	}
};

Grid.prototype.update = function(index) {
	var grid = document.getElementById("grid" + index);
	if (this.live) {
			grid.style.background = "black";
		} else {
			grid.style.background = "white";
		}
};

Grid.prototype.isadjacentTo = function(grid) {
	if (grid instanceof Grid) {
		if (Math.abs(this.rindex - grid.rindex) == 1) {
			//alert("two are adj! this: " + this.index + " that: " + grid.index);
			return Math.abs(this.cindex - grid.cindex) <= 1;
		} else if (Math.abs(this.rindex - grid.rindex) == 0) {
			return Math.abs(this.cindex - grid.cindex) == 1;
		}
	} else {
		alert("Wrong argument: " + grid);
		return false;
	}
	};

	Grid.prototype.adjlistContains = function(grid) {
		for (var i = 0; i < this.adjlist.length; i++) {
			if (this.adjlist[i].index == grid.index) {
				return true;
			}
		}
		return false;
	};

	Grid.prototype.withThisAroundLiving = function(grid) {
		for (var i = 0; i < this.adjlist.length; i++) {
			if (this.adjlist[i].index == grid.index) {
				return this.adjlist[i].live;
			}
		}
		return false;
	};

	Grid.prototype.changeAroundGridToLive = function(grid) {
		for (var i = 0; i < this.adjlist.length; i++) {
			if (this.adjlist[i].index == grid.index) {
				this.adjlist[i].live = true;
			}
		}
	};

	Grid.prototype.changeAroundGridToDie = function(grid) {
		for (var i = 0; i < this.adjlist.length; i++) {
			if (this.adjlist[i].index == grid.index) {
				this.adjlist[i].live = false;
			}
		}
	};

	Grid.prototype.create = function(index) {
		var grid = this; //trick
		var newnode = document.createElement("div");
		newnode.setAttribute("class", "grid");
		newnode.setAttribute("id", "grid" + index);
		newnode.style.width = this.width-2 + "px";
		newnode.style.height = this.height-2 + "px";
		newnode.style.border="1px solid #99CCFF";
		document.getElementById("whole").appendChild(newnode);

		newnode.addEventListener("click", function() {
			grid.live = !grid.live;
			grid.update(index);
		}, false);

		this.update(index);
	};

	Grid.prototype.copy = function() {
		var result = new Grid(this.size, this.index, this.rindex, this.cindex, null);
		result.live = this.live;
		//result.rindex = this.ri;
		//result.cindex = this.ci;
		//alert("before copy");
		result.adjlist = this.adjlist;//.clone();
		return result;
	};

function copy(twoDlist, update) {
	var result = new Array();
	for (var i = 0; i < twoDlist.length;i++) {
		var row = new Array();
		for (var j = 0; j < twoDlist[i].length; j++) {
			var grid = twoDlist[i][j].copy();
			//alert("now copy: " + grid.index + " " + grid.liveAdjacents());
			row.push(grid);
			if (update && grid instanceof Grid) {
				grid.update(grid.index);
			}
		}
		result.push(row);
	}
	return result;
}

function createCanvas(gridList, width, height, size) {
	var gridList = new Array();
	var whole = $('#whole');
	whole.css({
		"width" : width + "px",
		"height" : height + "px"
	})

	var numrow = height / size;
	var numcol = width / size;
	var numgrid = numrow * numcol;

	var grids = new Array();
	for (var i = 0; i < numrow; i++) {
		var rowlist = new Array();
		for (var j = 0; j < numcol; j++) {
			var index = "" + i;
			if (i < 10) {
				index = 0 + index;
			}
			if (j < 10) {
				index += "0";
			}
			index += j;
			var newgrid = new Grid(size, index, i, j, null);
			newgrid.create(index);
			rowlist.push(newgrid);
		}
		gridList.push(rowlist);
	}
	return gridList;
}

function assignAdjacents(gridList, numgrid, numcol, numrow) {
	var ti = 0;
	var tj = 0;
	for (var k = 0; k < numgrid; k++) {
		for (var i = 0; i < gridList.length; i++) {
			for (var j = 0; j < gridList[i].length; j++) {
				if (!(ti == i && tj == j)) {
					if (gridList[ti][tj].isadjacentTo(gridList[i][j])) {
						gridList[ti][tj].adjlist.push(gridList[i][j]);
						if (gridList[ti][tj].adjlist.length >= 8) {
							break;
						}
					}
				}
			}
		}
		tj++;
		if (tj == numcol) {
			tj = 0;
			ti++;
		}
	}
}