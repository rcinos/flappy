const bird = document.getElementById("bird") as HTMLDivElement;
const field = document.getElementById("field") as HTMLBodyElement;
const scoreDisplay = document.getElementById("score") as HTMLDivElement;
const restartWindow = document.getElementById("restart") as HTMLDivElement;
const restartButton = document.getElementById(
  "restart-btn",
) as HTMLButtonElement;
const finalScore = document.getElementById("final-score") as HTMLDivElement;
const bestScore = document.getElementById("best-score") as HTMLDivElement;
let animId: number;
const birdSpeed = localStorage.getItem("bird-speed")
  ? Number(localStorage.getItem("bird-speed"))
  : 2;
const birdJump = localStorage.getItem("bird-jump")
  ? Number(localStorage.getItem("bird-jump"))
  : 10;
const columnGap = localStorage.getItem("column-gap")
  ? Number(localStorage.getItem("column-gap"))
  : 5;

const isInverse = localStorage.getItem("inversion") === "true" || false;
let stopInverseInterval: NodeJS.Timeout;

document.body.style.setProperty("--column-gap", `${columnGap}`);

let jump = 0;
let gravity = 0.5;
let isJumping = false;
let isGameStarted = false;
let stopInterval: NodeJS.Timeout;
let scoreCounter = 0;

function restartGame(e: MouseEvent) {
  e.stopPropagation();
  bird.style.top = "50%";
  scoreCounter = 0;
  scoreDisplay.innerText = `${scoreCounter}`;
  restartWindow.style.display = "none";
  const columns = Array.from(document.querySelectorAll<HTMLElement>(".column"));
  columns.forEach((column) => {
    column.remove();
  });
  cancelAnimationFrame(animId); // Ensure previous animation is canceled
  isGameStarted = false;
  jump = 0; // Reset jump
  isJumping = false; // Reset jumping state
  window.scrollTo(0, 0);
  clearInterval(stopInterval);
  clearInterval(stopInverseInterval);

  document.removeEventListener("keydown", handleJump);
  document.removeEventListener("touchstart", handleJump);

  document.addEventListener("keydown", handleJump);
  document.addEventListener("touchstart", handleJump);
}

document.addEventListener("keydown", handleJump);
document.addEventListener("touchstart", handleJump);
restartButton.addEventListener("click", restartGame);

function step() {
  const birdRect = bird.getBoundingClientRect();
  const birdY = birdRect.y;
  const birdHeight = birdRect.height;

  if (isGameOver(birdY, birdHeight)) {
    console.log("Game Over");
    clearInterval(stopInverseInterval);
    restartWindow.style.display = "flex";
    finalScore.innerText = `${scoreCounter}`;
    const bestScoreValue = localStorage.getItem("best-score");
    if (!bestScoreValue || scoreCounter > Number(bestScoreValue)) {
      localStorage.setItem("best-score", `${scoreCounter}`);
    }
    bestScore.innerText = `${localStorage.getItem("best-score") || scoreCounter}`;
    return;
  }

  if (!isJumping) {
    jump += gravity;
  } else {
    isJumping = false;
  }

  const columns = Array.from(document.querySelectorAll<HTMLElement>(".column"));

  if (columns.length > 0) {
    columns.forEach((column) => {
      if (column.getBoundingClientRect().right < 0) {
        column.remove();
      } else {
        const columnLeft = parseInt(column.style.left);
        column.style.left = `${columnLeft - birdSpeed}px`;

        // Check if the bird passed the column
        if (
          // @ts-ignore
          !column.passed &&
          column.getBoundingClientRect().right < birdRect.left
        ) {
          // @ts-ignore
          column.passed = true; // Mark column as passed
          scoreCounter++;
          scoreDisplay.innerText = `${scoreCounter}`;
        }
      }
    });
  }

  bird.style.top = `${birdY + jump}px`;

  animId = window.requestAnimationFrame(step);
}

function handleJump(e: TouchEvent | KeyboardEvent) {
  if (
    (e instanceof KeyboardEvent && e.key === " ") ||
    e instanceof TouchEvent
  ) {
    if (!isGameStarted) {
      animId = window.requestAnimationFrame(step);
      if (isInverse) {
        stopInverseInterval = setInterval(() => {
          field.style.backgroundColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
        }, 1000);
      }
      setTimeout(() => {
        drawColumns();
        stopInterval = setInterval(() => {
          drawColumns();
        }, 2000);
      }, 2000);
      isGameStarted = true;
    }
    jump = birdJump;
    isJumping = true;
  }
}

function drawColumns() {
  const column = document.createElement("div");
  const topColumn = document.createElement("div");
  const bottomColumn = document.createElement("div");
  column.classList.add("column");
  topColumn.classList.add("top-column");
  bottomColumn.classList.add("bottom-column");
  column.appendChild(topColumn);
  column.appendChild(bottomColumn);
  topColumn.style.height =
    Math.floor((Math.random() * (innerHeight - 100) + 100) * 0.7) + "px";
  column.style.left = `${field.offsetWidth}px`;
  // @ts-ignore
  column.passed = false;
  field.appendChild(column);
}

function checkForCollision(): boolean {
  const birdRect = bird.getBoundingClientRect();

  const columns = Array.from(document.querySelectorAll<HTMLElement>(".column"));

  for (const column of columns) {
    const columnRect = column.getBoundingClientRect();
    const topColumn = column.querySelector(".top-column") as HTMLElement;
    const bottomColumn = column.querySelector(".bottom-column") as HTMLElement;

    if (
      birdRect.left < columnRect.left + columnRect.width &&
      birdRect.left + birdRect.width > columnRect.left &&
      (birdRect.top < columnRect.top + topColumn.offsetHeight ||
        birdRect.top + birdRect.height >
          columnRect.top + columnRect.height - bottomColumn.offsetHeight)
    ) {
      return true;
    }
  }
  return false;
}

function isGameOver(birdY: number, birdHeight: number): boolean {
  if (birdY + birdHeight >= field.offsetHeight) {
    clearInterval(stopInterval);
    return true;
  }

  if (checkForCollision()) {
    clearInterval(stopInterval);
    return true;
  }

  return false;
}
