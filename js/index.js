const wrapper = document.querySelector(".wrapper");
const startBtn = document.querySelector(".start");
const stopBtn = document.querySelector(".stop");
const clearBtn = document.querySelector(".clear");
const generationSpan = document.querySelector(".generationCount");

let timerId;

let generation = 0;

let state = [];

const INIT_ROW = 26;
const INIT_COL = 50;

initState(INIT_ROW, INIT_COL);
randomState();
render();

function initState(r, c) {
  state.splice(0);
  for (let i = 0; i < r; i++) {
    state.push([...new Array(c)].map(() => 0));
  }
}

function randomState() {
  state[10][26] = 1;
  state[11][27] = 1;
  state[12][27] = 1;
  state[12][26] = 1;
  state[12][25] = 1;
}

function render() {
  let markup = "";
  for (let i = 0; i < state.length; i++) {
    markup += '<div class="row">';

    for (let j = 0; j < state[i].length; j++) {
      markup += `<div class="cell ${
        state[i][j] ? "alive" : ""
      }" data-row="${i}" data-col="${j}" ></div>`;
    }

    markup += "</div>";
  }
  wrapper.innerHTML = markup;
}

function toggleCell(e) {
  if (e.target === wrapper) return;
  const { row, col } = e.target.dataset;

  e.target.classList.toggle("alive");
  state[row][col] = state[row][col] === 1 ? 0 : 1;
}

function getNextState() {
  for (let row = 0; row < state.length; row++) {
    for (let col = 0; col < state[row].length; col++) {
      cellWillRevive(row, col);
      cellSurvival(row, col);
    }
  }
}

function countAliveNeighbors(row, col) {
  const neighbors = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  let neighborsCount = 0;

  for (let i = 0; i < neighbors.length; i++) {
    const neighborRow = neighbors[i][0] + row;
    const neighborCol = neighbors[i][1] + col;

    const neighbor = document.querySelector(
      `.cell[data-row="${neighborRow}"][data-col="${neighborCol}"]`
    );

    if (neighbor && neighbor.classList.contains("alive")) neighborsCount++;
  }

  return neighborsCount;
}

function cellSurvival(row, col) {
  const neighborsCount = countAliveNeighbors(row, col);

  if (state[row][col] === 1) {
    if (neighborsCount < 2 || neighborsCount > 3) {
      state[row][col] = 0;
    }
  }
}

function cellWillRevive(row, col) {
  const neighborsCount = countAliveNeighbors(row, col);

  if (neighborsCount === 3 && !state[row][col]) {
    state[row][col] = 1;
  }
}

wrapper.addEventListener("click", toggleCell);

startBtn.addEventListener("click", () => {
  timerId = setInterval(() => {
    generation += 1;
    generationSpan.textContent = generation;
    getNextState();
    render();
  }, 300);
});

stopBtn.addEventListener("click", () => {
  clearInterval(timerId);
});

clearBtn.addEventListener("click", () => {
  initState(INIT_ROW, INIT_COL);

  render();
  clearInterval(timerId);
  generation = 0;
  generationSpan.textContent = "";
});
