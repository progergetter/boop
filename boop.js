document.body.onload = init;

let index = 0;
let turn = 1;
let cats1 = 0;
let cats2 = 0;
let kittens1Available = 8;
let kittens2Available = 8;
let cats1Available = 0;
let cats2Available = 0;
let cells = [];
let table = undefined;
const n = 6;
const m = 6;
const kittenCounter = document.getElementById("kittens");
const body = document.body;
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
  type;

  constructor() {
    this.id = index++;
    this.color = "#" + color;
    this.type = undefined;
  }
}

function generateColor() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

function changeTurn() {
  body.classList.toggle("playerTurn" + turn);
  if (turn === 1) turn = 2;
  else turn = 1;
  body.classList.toggle("playerTurn" + turn);
}

function init() {
  const mainBlock = document.getElementById("board");
  table = document.createElement("table");
  body.classList.toggle("playerTurn" + turn);
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
        shift(Number(this.id), "kitten");
        changeTurn();
      });
      // right click
      td.addEventListener(
        "contextmenu",
        function (ev) {
          ev.preventDefault();
          if (isCatMovePossible()) {
            this.classList.add("cat" + turn);
            shift(Number(this.id), "cat");
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

function decreaseCatCount() {
  if (turn === 1) cats1--;
  else cats2--;
}

function updateKittensCounter() {
  let player1KittensLen = document.getElementsByClassName("kitten1").length;
  let player2KittensLen = document.getElementsByClassName("kitten2").length;
  let player1KittensOutcome = `Player's 1 Kittens: ${player1KittensLen} / ${kittens1Available}`;
  let player2KittensOutcome = `Player's 2 Kittens: ${player2KittensLen} / ${kittens2Available}`;
  if (player1KittensLen === 8 || player2KittensLen === 8) {
    table.classList.add("lock");
  }
  kittenCounter.innerText =
    player1KittensOutcome + "\n" + player2KittensOutcome;
}

function updateCatsCounter() {
  let player1CatsLen = document.getElementsByClassName("cat1").length;
  let player2CatsLen = document.getElementsByClassName("cat2").length;
  let player1CatsOutcome = `Player's 1 Cats: ${player1CatsLen} / ${cats1Available}`;
  let player2CatsOutcome = `Player's 2 Cats: ${player2CatsLen} / ${cats2Available}`;
  catsCounter.innerText = player1CatsOutcome + "\n" + player2CatsOutcome;
}

function isCatMovePossible() {
  let currCatsLen = document.getElementsByClassName("cat" + turn).length;
  let currAvailableCatsLen = turn === 1 ? cats1Available : cats2Available;
  return currAvailableCatsLen > currCatsLen;
}

function shift(coord, type) {
  let x = Math.floor(coord / n);
  let y = coord - x * m;
  cells[x][y].type = type;
  cells[x][y].block.classList.add(type + turn);
  let tripleFound = tripleHelper(type);
  if (tripleFound === false) {
    for (let i = 0; i < dirs.length; i++) {
      dfs(x, y, 0, i, type, type + turn);
    }
    tripleHelper(type);
  }
  updateKittensCounter();
  if (type === "cat") decreaseCatCount();
  updateCatsCounter();
}

function tripleHelper(type) {
  let res = false;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      for (let k = 0; k < dirs.length; k++) {
        res = res || checkTriple(i, j, 0, k, type);
      }
    }
  }
  return res;
}

function checkTriple(x, y, len, directionIndex, type) {
  if (len === 3) return true;
  if (x < 0 || x === n || y < 0 || y === m) return false;
  if (
    cells[x][y].type === undefined ||
    cells[x][y].block.classList.contains(type + turn) === false
  )
    return false;
  let res = checkTriple(
    x + dirs[directionIndex][0],
    y + dirs[directionIndex][1],
    len + 1,
    directionIndex,
    type
  );
  if (res === true) {
    if (len === 0) {
      if (turn === 1) cats1Available = ++cats1;
      else cats2Available = ++cats2;
      updateCatsCounter();
    } else if (len === 2 && type === "cat") {
      table.classList.add("lock");
      console.log(`${turn} player win!`);
    }
    if (type === "kitten") {
      cells[x][y].type = undefined;
      cells[x][y].block.classList.remove(type + turn);
    }
  }
  return res;
}

function dfs(x, y, len, directionIndex, startType, catType) {
  if (x < 0 || x === n || y < 0 || y === m || len == 3) return true;
  if (
    len === 1 &&
    (cells[x][y].type === undefined ||
      (startType === "kitten" && cells[x][y].type === "cat"))
  )
    return false;
  if (len === 2) {
    if (cells[x][y].type === "kitten") return false;
    cells[x][y].type = startType;
    cells[x][y].block.classList.add(catType);
    return true;
  }
  let currCatType = len === 1 ? cells[x][y].block.classList.value : catType;
  if (
    dfs(
      x + dirs[directionIndex][0],
      y + dirs[directionIndex][1],
      len + 1,
      directionIndex,
      cells[x][y].type,
      currCatType
    )
  ) {
    if (len === 1) {
      cells[x][y].type = undefined;
      cells[x][y].block.classList.remove(currCatType);
    }
  }
  return true;
}
