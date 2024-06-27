const birdElement = document.getElementById("bird") as HTMLDivElement;
const fieldElement = document.getElementById("field") as HTMLBodyElement;
const scoreDisplayElement = document.getElementById("score") as HTMLDivElement;
const restartWindowElement = document.getElementById("restart") as HTMLDivElement;
const restartButtonElement = document.getElementById("restart-btn") as HTMLButtonElement;
const finalScoreElement = document.getElementById("final-score") as HTMLDivElement;
const bestScoreElement = document.getElementById("best-score") as HTMLDivElement;

let animationId: number;
let inverseModeIntervalId: NodeJS.Timeout;
let columnGenerationIntervalId: NodeJS.Timeout;

const birdSpeed = getLocalStorageNumber("bird-speed", 2);
const birdJump = getLocalStorageNumber("bird-jump", 10);
const columnGap = getLocalStorageNumber("column-gap", 5);
const columnSpeed = getLocalStorageNumber("column-speed", 2000);
const isInverseMode = localStorage.getItem("inversion") === "true";

let jumpAmount = 0;
const gravity = 0.5;
let isJumping = false;
let isGameStarted = false;
let score = 0;



document.body.style.setProperty("--column-gap", `${columnGap}`);

initializeEventListeners();

function initializeEventListeners() {
  document.addEventListener("keydown", handleJump);
  document.addEventListener("touchstart", handleJump);
  restartButtonElement.addEventListener("click", restartGame);
}

function getLocalStorageNumber(key: string, defaultValue: number): number {
  return localStorage.getItem(key) ? Number(localStorage.getItem(key)) : defaultValue;
}

function restartGame(event: MouseEvent) {
  event.stopPropagation();

  resetGameState();
  removeColumns();
  cancelAnimationFrame(animationId);

  startGameListeners();
}

function resetGameState() {
  birdElement.style.top = "50%";
  score = 0;
  scoreDisplayElement.innerText = `${score}`;
  restartWindowElement.style.display = "none";

  isGameStarted = false;
  jumpAmount = 0;
  isJumping = false;

  clearInterval(inverseModeIntervalId);
  clearInterval(columnGenerationIntervalId);
}

function removeColumns() {
  const columns = document.querySelectorAll<HTMLElement>(".column");
  columns.forEach(column => column.remove());
}

function startGameListeners() {
  document.addEventListener("keydown", handleJump);
  document.addEventListener("touchstart", handleJump);
}

function handleJump(event: TouchEvent | KeyboardEvent) {
  if (event instanceof KeyboardEvent && event.key === " " || event instanceof TouchEvent) {
    if (!isGameStarted) {
      startGame();
    }
    jumpAmount = birdJump;
    isJumping = true;
  }
}

function startGame() {
  animationId = window.requestAnimationFrame(updateGame);
  if (isInverseMode) {
    inverseModeIntervalId = setInterval(changeBackgroundColor, 1000);
  }
  setTimeout(() => {
    generateColumn();
    columnGenerationIntervalId = setInterval(generateColumn, columnSpeed);
  }, 2000);
  isGameStarted = true;
}

function changeBackgroundColor() {
  fieldElement.style.backgroundColor = `rgb(${randomColorValue()}, ${randomColorValue()}, ${randomColorValue()})`;
}

function randomColorValue(): number {
  return Math.floor(Math.random() * 255);
}

function updateGame() {
  const birdRect = birdElement.getBoundingClientRect();
  const birdY = birdRect.y;
  const birdHeight = birdRect.height;

  if (isGameOver(birdY, birdHeight)) {
    endGame();
    return;
  }

  if (!isJumping) {
    jumpAmount += gravity;
  } else {
    isJumping = false;
  }

  updateColumns();
  birdElement.style.top = `${birdY + jumpAmount}px`;
  animationId = window.requestAnimationFrame(updateGame);
}

function isGameOver(birdY: number, birdHeight: number): boolean {
  if (birdY + birdHeight >= fieldElement.offsetHeight) {
    return true;
  }

  return checkForCollision();
}

function endGame() {
  console.log("GameLoop Over");
  clearInterval(inverseModeIntervalId);
  clearInterval(columnGenerationIntervalId);

  restartWindowElement.style.display = "flex";
  finalScoreElement.innerText = `${score}`;

  const bestScoreValue = getLocalStorageNumber("best-score", 0);
  if (score > bestScoreValue) {
    localStorage.setItem("best-score", `${score}`);
  }
  bestScoreElement.innerText = `${localStorage.getItem("best-score") || score}`;
}

function checkForCollision(): boolean {
  const birdRect = birdElement.getBoundingClientRect();
  const columns = document.querySelectorAll<HTMLElement>(".column");

  for (const column of columns) {
    const columnRect = column.getBoundingClientRect();
    const topColumn = column.querySelector(".top-column") as HTMLElement;
    const bottomColumn = column.querySelector(".bottom-column") as HTMLElement;

    if (
        birdRect.left < columnRect.left + columnRect.width &&
        birdRect.left + birdRect.width > columnRect.left &&
        (birdRect.top < columnRect.top + topColumn.offsetHeight ||
            birdRect.top + birdRect.height > columnRect.top + columnRect.height - bottomColumn.offsetHeight)
    ) {
      return true;
    }
  }
  return false;
}

function updateColumns() {
  const columns = document.querySelectorAll<HTMLElement>(".column");

  columns.forEach(column => {
    if (column.getBoundingClientRect().right < 0) {
      column.remove();
    } else {
      const columnLeft = parseInt(column.style.left);
      column.style.left = `${columnLeft - birdSpeed}px`;

      // @ts-ignore
      if (!column.passed && column.getBoundingClientRect().right < birdElement.getBoundingClientRect().left) {
        // @ts-ignore
        column.passed = true;
        score++;
        scoreDisplayElement.innerText = `${score}`;
      }
    }
  });
}

function generateColumn() {
  const column = document.createElement("div");
  const topColumn = document.createElement("div");
  const bottomColumn = document.createElement("div");

  column.classList.add("column");
  topColumn.classList.add("top-column");
  bottomColumn.classList.add("bottom-column");

  column.appendChild(topColumn);
  column.appendChild(bottomColumn);

  topColumn.style.height = `${Math.floor((Math.random() * (innerHeight - 100) + 100) * 0.7)}px`;
  column.style.left = `${fieldElement.offsetWidth}px`;
  // @ts-ignore
  column.passed = false;

  fieldElement.appendChild(column);
}
