document.body.onload = init;

let index = 0;
let turn = 1;
let cats1 = 0;
let cats2 = 0;
let kittenLimit = 8;
let catLimit = 3;
let cells = [];
const n = 6;
const m = 6;
const kittenCounter = document.getElementById("kittens");
const catsCounter = document.getElementById("cats");
const color = generateColor();
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

class Cell {
  id;
  block;
  color;
  kitten;

  constructor() {
    this.id = index++;
    this.color = "#" + color;
    this.kitten = false;
    this.cat = false;
  }
}

function generateColor() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

function changeTurn() {
  if (turn === 1) turn = 2;
  else turn = 1;
}

function init() {
  const mainBlock = document.getElementById("board");
  const table = document.createElement("table");
  const tableBody = document.createElement("tbody");
  for (let i = 0; i < n; i++) {
    let tr = document.createElement("tr");
    const row = [];
    for (let j = 0; j < m; j++) {
      let cell = new Cell();
      row.push(cell);
      let td = document.createElement("td");
      cell.block = td;
      td.setAttribute("bgcolor", cell.color);
      td.setAttribute("id", cell.id);
      // left click
      td.addEventListener("click", function () {
        this.classList.add("kitten" + turn);
        shift(Number(this.id));
        changeTurn();
      });
      // right click
      td.addEventListener(
        "contextmenu",
        function (ev) {
          ev.preventDefault();
          if (turn === 1 ? cats1 > 0 : cats2 > 0) {
            this.classList.add("cat" + turn);
            shift(Number(this.id));
            changeTurn();
          }
          return false;
        },
        false
      );
      tr.appendChild(td);
    }
    cells.push(row);
    tableBody.appendChild(tr);
  }
  table.appendChild(tableBody);
  mainBlock.appendChild(table);
}

function updateKittensCounter() {
  let player1Kittens = `Player's 1 Kittens: ${
    document.getElementsByClassName("kitten1").length
  } / ${kittenLimit}`;
  let player2Kittens = `Player's 2 Kittens: ${
    document.getElementsByClassName("kitten2").length
  } / ${kittenLimit}`;
  kittenCounter.innerText = player1Kittens + "\n" + player2Kittens;
}

function updateCatsCounter() {
  let player1Cats = `Player's 1 Cats: ${cats1} / ${catLimit}`;
  let player2Cats = `Player's 2 Cats: ${cats2} / ${catLimit}`;
  catsCounter.innerText = player1Cats + "\n" + player2Cats;
}

function shift(coord) {
  let x = Math.floor(coord / n);
  let y = coord - x * m;
  cells[x][y].kitten = true;
  cells[x][y].block.classList.add("kitten" + turn);
  let tripleFound = tripleHelper();
  if (tripleFound === false) {
    for (let i = 0; i < dirs.length; i++) {
      dfs(x, y, 0, i, "");
    }
    tripleHelper();
  }
  updateKittensCounter();
}

function tripleHelper() {
  let res = false;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      for (let k = 0; k < dirs.length; k++) {
        res = res || checkTriple(i, j, 0, k);
      }
    }
  }
  return res;
}

function checkTriple(x, y, len, directionIndex) {
  if (len === 3) return true;
  if (x < 0 || x === n || y < 0 || y === m) return false;
  if (
    cells[x][y].kitten === false ||
    cells[x][y].block.classList.contains("kitten" + turn) === false
  )
    return false;
  let res = checkTriple(
    x + dirs[directionIndex][0],
    y + dirs[directionIndex][1],
    len + 1,
    directionIndex
  );
  if (res === true) {
    if (len === 0) {
      if (turn === 1) cats1++;
      else cats2++;
      updateCatsCounter();
    }
    cells[x][y].kitten = false;
    cells[x][y].block.classList.remove("kitten" + turn);
  }
  return res;
}

function dfs(x, y, len, directionIndex, turn) {
  if (x < 0 || x === n || y < 0 || y === m || len == 3) return true;
  if (len === 1 && cells[x][y].kitten === false) return false;
  if (len === 2) {
    if (cells[x][y].kitten === true) return false;
    cells[x][y].kitten = true;
    cells[x][y].block.classList.add("kitten" + turn);
    return true;
  }
  let currTurn =
    len === 1
      ? cells[x][y].block.classList.contains("kitten1") === true
        ? 1
        : 2
      : turn;
  if (
    dfs(
      x + dirs[directionIndex][0],
      y + dirs[directionIndex][1],
      len + 1,
      directionIndex,
      currTurn
    )
  ) {
    if (len === 1) {
      cells[x][y].kitten = false;
      cells[x][y].block.classList.remove("kitten" + currTurn);
    }
  }
  return true;
}
