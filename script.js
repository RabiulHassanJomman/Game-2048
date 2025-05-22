const gridElement = document.getElementById("grid")
const gameOver = document.getElementById("game-over-container")
const wonContainer = document.getElementById("won-container");
const finalScore = document.getElementById("final-score");
const scoreCount = document.getElementById("score-count")
const tutorialElement = document.getElementById("tutorial");
const containerElement = document.getElementById("container")
const openTutorialBtn = document.getElementById("open-tutorial")
let grid;
let score;

let touchStartX;
let touchStartY;
let touchEndX;
let touchEndY;

function touchStart(e) {
  touchStartX = e.touches[0].screenX;
  touchStartY = e.touches[0].screenY;
}

function touchEnd(e) {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleTouch();
}

document.addEventListener("touchstart", touchStart)
document.addEventListener("touchend", touchEnd)

function startGame() {
  grid = Array(4).fill().map(() => Array(4).fill(0))
  score = 0;
  
  addRandomTile();
  addRandomTile();
  
  updateGrid()
}

function addRandomTile() {
  let emptyCells = [];
  
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push({ row: i, col: j })
      }
    }
  }
  if (emptyCells.length > 0) {
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
}

function move(direction) {
  let moved = false;
  
  
  if (direction === "left") {
    let row = [];
    for (i = 0; i < 4; i++) {
      row = grid[i].filter((value) => value !== 0);
      for (j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0;
          score += row[j];
        }
      }
      row.filter((value) => value !== 0);
      while (row.length < 4) row.push(0);
      if (grid[i].join() !== row.join())
        moved = true;
      grid[i] = row;
    }
  }
  
  
  else if (direction === "right") {
    let row = [];
    for (i = 0; i < 4; i++) {
      row = grid[i].filter((value) => value !== 0);
      for (j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          row[j - 1] = 0;
          score += row[j];
        }
      }
      row.filter((value) => value !== 0);
      while (row.length < 4) row.unshift(0);
      if (grid[i].join() !== row.join())
        moved = true;
      grid[i] = row;
    }
  }
  
  else if (direction === "up") {
    let col = [];
    for (i = 0; i < 4; i++) {
      col = [grid[0][i], grid[1][i], grid[2][i], grid[3][i], ].filter((value) => value !== 0);
      for (let j = 0; j < col.length; j++) {
        if (col[j] === col[j + 1]) {
          col[j] *= 2;
          col[j + 1] = 0;
          score += col[j];
        }
      }
      col.filter((value) => value !== 0);
      while (col.length < 4) col.push(0);
      for (j = 0; j < col.length; j++) {
        if (grid[i][j] !== col[j]) moved = true;
        grid[j][i] = col[j];
      }
    }
  }
  
  else if (direction === "down") {
    let col = [];
    for (i = 0; i < 4; i++) {
      col = [grid[0][i], grid[1][i], grid[2][i], grid[3][i], ].filter((value) => value !== 0);
      for (let j = col.length; j > 0; j--) {
        if (col[j] === col[j - 1]) {
          col[j] *= 2;
          col[j - 1] = 0;
          score += col[j];
        }
      }
      col.filter((value) => value !== 0);
      while (col.length < 4) col.unshift(0);
      for (j = 0; j < col.length; j++) {
        if (grid[i][j] !== col[j]) moved = true;
        grid[j][i] = col[j];
      }
    }
  }
  
  return moved;
}

function handleTouch() {
  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;
  
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX < -30)
      move("right")
    
    else if (diffX > 30)
      move("left");
  }
  else {
    if (diffY > 30)
      move("up")
    else if (diffY < -30)
      move("down");
  }
  addRandomTile();
  updateGrid();
}

function updateGrid() {
  gridElement.innerHTML = '';
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      const tile = document.createElement("div")
      tile.className = `tile tile-${grid[i][j] || 0}`
      tile.textContent = grid[i][j] || '';
      gridElement.appendChild(tile)
    }
  }
  scoreCount.textContent = score;
  if (isGameOver()) {
    gameOver.style.visibility = 'visible'
    finalScore.textContent = 'Score: ' + score;
  }
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 4; j++) {
      if (grid[i][j] >= 2048) {
        wonContainer.style.visibility = 'visible';
      }
    }
  }
}

function isGameOver() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) return false;
      if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
      if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
    }
  }
  return true;
}

function closeTutorial() {
  tutorialElement.style.display = 'none';
  containerElement.style.display = 'flex';
  openTutorialBtn.style.display = 'block'
  
  document.addEventListener("touchstart", touchStart)
  document.addEventListener("touchend", touchEnd)
  
}

function openTutorial() {
  tutorialElement.style.display = 'block';
  containerElement.style.display = 'none';
  openTutorialBtn.style.display = 'none';
  document.removeEventListener("touchstart", touchStart)
  document.removeEventListener("touchend", touchEnd)
  
}

function restartGame() {
  gameOver.style.display = 'none'
  wonContainer.style.display = 'none'
  startGame();
}
startGame()