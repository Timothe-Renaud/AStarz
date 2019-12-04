function removeFromArray(arr, elt) {
  // Could use indexOf here instead to be more efficient
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

// An educated guess of how far it is between two points
function heuristic(a, b) {
  var d = dist(a.i, a.j, b.i, b.j);
  // var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

// Taille du labi
var cols = 50;
var rows = 50;

// tableau en 2D
var grid = new Array(cols);

// Open and closed set
var openSet = [];
var closedSet = [];

// Start and end
var start;
var end;

// Taille du tab
var w, h;

// route emprinter
var path = [];

function setup() {
  createCanvas(400, 400);
  console.log('A*');

  // cellule de grille.
  w = width / cols;
  h = height / rows;

  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  // recherche de tout les voisins ap^ppeller "neighbors".
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }


  // Start and end
  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;

  // openSet debut
  openSet.push(start);
}

function draw() {

  // si on continue de cherché
  if (openSet.length > 0) {

    // Best next option
    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }
    var current = openSet[winner];

    // est ce finie?
    if (current === end) {
      noLoop();
      console.log("DONE!");
    }

    // Meilleur option pour aller de openSet  closeSet.
    removeFromArray(openSet, current);
    closedSet.push(current);

    // verifie tout les voisins
    var neighbors = current.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      // Valid le prochain chemin.
      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = current.g + heuristic(neighbor, current);

        // meilleur chemin qu'avant ou non?
        var newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }

        // oui meilleur chemin.
        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }

    }
  // pas de solution?
  } else {
    console.log('no solution');
    noLoop();
    return;
  }

  // affiche le chemin.
  background(255);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }

  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0, 50));
  }

  for (var i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0, 50));
  }


  // recherche du chemin en arrire plan
  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  // affiche le chemin par une ligne.
  noFill();
  stroke(255, 0, 200);
  strokeWeight(w / 2);
  beginShape();
  for (var i = 0; i < path.length; i++) {
    vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
  }
  endShape();



}