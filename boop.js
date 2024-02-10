document.body.onload = init;

const n = 6;
const m = 6;
let index = 0;

class Cell {
  id;
  block;
  color;
  cat;

  constructor() {
    this.id = index++;
    this.color = "#3cbdff";
    this.cat = false;
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
        this.classList.add("circle");
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
  let y = Math.floor(coord / n);
  let x = coord - y * m;
  let hash = {};
  cells[y][x].cat = true;
  cells[y][x].block.classList.add("circle");
  dfs(y, x, "", 0, hash, "");
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
const dirsLabels = ["a", "b", "c", "d", "e", "f", "g", "k"];

function dfs(x, y, direction, len, hash, desire) {
  if (
    x < 0 ||
    x === n ||
    y < 0 ||
    y === m ||
    len === 3 ||
    hash.hasOwnProperty([x, y])
  )
    return;
  if (len === 2 && direction === desire) {
    cells[x][y].cat = true;
    cells[x][y].block.classList.add("circle");
  }
  hash[[x, y]] = true;
  for (let i = 0; i < dirs.length; i++) {
    if (len === 0 || (len === 1 && cells[x][y].cat)) {
      if (len !== 0 && direction === dirsLabels[i]) {
        cells[x][y].cat = false;
        cells[x][y].block.classList.remove("circle");
      }
      dfs(
        x + dirs[i][0],
        y + dirs[i][1],
        len === 0 ? dirsLabels[i] : direction,
        len + 1,
        hash,
        dirsLabels[i]
      );
    }
  }
}
