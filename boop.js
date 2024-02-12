document.body.onload = init;

const n = 6;
const m = 6;
let index = 0;
const kittenCounter = document.getElementById("kittens");
const catsCounter = document.getElementById("cats");
const color = generateColor();
class Cell {
  id;
  block;
  color;
  kitten;

  constructor() {
    this.id = index++;
    this.color = "#" + color;
    this.kitten = false;
  }
}

function generateColor() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

let cells = [];

function init() {
  const mainBlock = document.getElementById("board");
  const table = document.createElement("table");
  const tableBody = document.createElement("tbody");
  table.setAttribute("border", "1");
  for (let i = 0; i < n; i++) {
    let tr = document.createElement("tr");
    const row = [];
    for (let j = 0; j < m; j++) {
      let cell = new Cell();
      row.push(cell);
      let td = document.createElement("td");
      cell.block = td;
      td.setAttribute("width", "50px");
      td.setAttribute("bgcolor", cell.color);
      td.setAttribute("height", "50px");
      td.setAttribute("text-align", "-moz-center;");
      td.setAttribute("id", cell.id);
      td.addEventListener("click", function () {
        this.classList.add("kitten");
        shift(Number(this.id));
      });
      tr.appendChild(td);
    }
    cells.push(row);
    tableBody.appendChild(tr);
  }
  table.appendChild(tableBody);
  mainBlock.appendChild(table);
}

function shift(coord) {
  let x = Math.floor(coord / n);
  let y = coord - x * m;
  cells[x][y].kitten = true;
  cells[x][y].block.classList.add("kitten");
  let tripleFound = false;
  let points = [];
  for (let i = 0; tripleFound === false && i < dirs.length; i++) {
    let res = checkTriple(x, y, 0, i);
    tripleFound = tripleFound || res;
  }
  if (tripleFound === false) {
    for (let i = 0; i < dirs.length; i++) {
      dfs(x, y, 0, i, points);
    }
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; tripleFound === false && j < dirs.length; j++) {
        let res = checkTriple(points[i][0], points[i][1], 0, j);
        tripleFound = tripleFound || res;
      }
    }
  }
  kittenCounter.innerText = `Kittens: ${
    document.getElementsByClassName("kitten").length
  }`;
}

const dirs = [
  [0, 1],
  [1, 0],
  [-1, 0],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

function checkTriple(x, y, len, directionIndex) {
  if (len === 3) return true;
  if (x < 0 || x === n || y < 0 || y === m) return false;
  if (len > 0 && cells[x][y].kitten === false) return false;
  let res = checkTriple(
    x + dirs[directionIndex][0],
    y + dirs[directionIndex][1],
    len + 1,
    directionIndex
  );
  if (res === true) {
    cells[x][y].kitten = false;
    cells[x][y].block.classList.remove("kitten");
  }
  return res;
}

function dfs(x, y, len, directionIndex, points) {
  if (x < 0 || x === n || y < 0 || y === m || len == 3) return true;
  if (len === 1 && cells[x][y].kitten === false) return false;
  if (len === 2) {
    if (cells[x][y].kitten === true) return false;
    cells[x][y].kitten = true;
    cells[x][y].block.classList.add("kitten");
    points.push([x, y]);
    return true;
  }
  if (
    dfs(
      x + dirs[directionIndex][0],
      y + dirs[directionIndex][1],
      len + 1,
      directionIndex,
      points
    )
  ) {
    if (len === 1) {
      cells[x][y].kitten = false;
      cells[x][y].block.classList.remove("kitten");
    }
  }
  return true;
}
