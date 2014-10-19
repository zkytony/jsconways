var canvw = 945;
			var canvh = 525
			var size = 15;
			var gridList = createCanvas(gridList, canvw, canvh, size);

			var numrow = canvh / size;
			var numcol = canvw / size;
			var numgrid = numrow * numcol;

			assignAdjacents(gridList, numgrid, numcol, numrow);

			var myVar;
			var generation = 0;
			function startit() {
				myVar = setInterval(function() {
					generation++;
					$('#gen').text("Generation: " + generation);
					var nextgen = copy(gridList, false);
					for (var i = 0; i < nextgen.length; i++) {
						for (var j = 0; j < nextgen[i].length; j++) {
							if (nextgen[i][j] instanceof Grid) {
								nextgen[i][j].decideLife(gridList[i][j].decideState());
							} else {
								alert("I am not even a grid");
							}
						}
					}
					refresh(nextgen, numgrid);

					gridList = copy(nextgen, true);
					return true;
				}, 20);
			}

			function clearit(gridList) {
				location.reload();
			}

			function stopit() {
				clearInterval(myVar);
			}

			function refresh(gridList, numgrid) {
				var ti = 0;
				var tj = 0;
				for (var k = 0; k < numgrid; k++) {
					for (var i = 0; i < gridList.length; i++) {
						for (var j = 0; j < gridList[i].length; j++) {
							if (!(ti == i && tj == j)) {
								if (gridList[ti][tj].isadjacentTo(gridList[i][j])) {
									if (gridList[i][j].live) {
										gridList[ti][tj].changeAroundGridToLive(gridList[i][j]);
									} else {
										gridList[ti][tj].changeAroundGridToDie(gridList[i][j]);
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
