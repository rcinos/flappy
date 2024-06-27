import GameState from "./gameState";
import ColumnManager from "./columnManager";
import { BackgroundStrategy } from "./backgroundStrategy";

class GameLoop {
  get animationId(): number | undefined {
    return this._animationId;
  }

  set animationId(value: number | undefined) {
    this._animationId = value;
  }
  private birdElement = document.getElementById("bird");
  private gameState: GameState;
  private columnManager: ColumnManager;
  private backgroundStrategy: BackgroundStrategy;
  private _animationId: number | undefined;
  private inverseModeIntervalId: NodeJS.Timeout = setTimeout(() => {}, 0);
  private columnGenerationIntervalId: NodeJS.Timeout = setTimeout(() => {}, 0);

  constructor(backgroundStrategy: BackgroundStrategy) {
    this.gameState = GameState.getInstance();
    this.columnManager = new ColumnManager();
    this.backgroundStrategy = backgroundStrategy;
  }

  public start() {
    this._animationId = window.requestAnimationFrame(() => this.updateGame());
    if (this.gameState.isInverseMode) {
      this.inverseModeIntervalId = setInterval(
        () => this.backgroundStrategy.changeBackgroundColor(),
        1000,
      );
    }
    setTimeout(() => {
      this.columnManager.generateColumn();
      this.columnGenerationIntervalId = setInterval(
        () => this.columnManager.generateColumn(),
        this.gameState.columnSpeed,
      );
    }, 2000);
    this.gameState.isGameStarted = true;
  }

  private updateGame() {
    if (this.birdElement) {
      const birdRect = this.birdElement.getBoundingClientRect();
      const birdY = birdRect.y;
      const birdHeight = birdRect.height;

      if (this.isGameOver(birdY, birdHeight)) {
        this.endGame();
        return;
      }

      if (!this.gameState.isJumping) {
        this.gameState.jumpAmount += 0.5; // gravity
      } else {
        this.gameState.isJumping = false;
      }

      this.columnManager.updateColumns();
      this.birdElement.style.top = `${birdY + this.gameState.jumpAmount}px`;
      this._animationId = window.requestAnimationFrame(() => this.updateGame());
    }
  }

  private isGameOver(birdY: number, birdHeight: number): boolean {
    const fieldElement = document.getElementById("field");
    if (fieldElement && birdY + birdHeight >= fieldElement.offsetHeight) {
      return true;
    }

    return this.columnManager.checkForCollision();
  }

  private endGame() {
    console.log("Game Over");
    clearInterval(this.inverseModeIntervalId);
    clearInterval(this.columnGenerationIntervalId);
    const restartWindowElement = document.getElementById("restart");
    if (restartWindowElement) {
      restartWindowElement.style.display = "flex";
    }
    const finalScoreElement = document.getElementById("final-score");
    if (finalScoreElement) {
      finalScoreElement.innerText = `${this.gameState.score}`;
    }

    const bestScoreValue = this.gameState.getLocalStorageNumber(
      "best-score",
      0,
    );
    if (this.gameState.score > bestScoreValue) {
      localStorage.setItem("best-score", `${this.gameState.score}`);
    }
    const bestScoreElement = document.getElementById("best-score");
    if (bestScoreElement) {
      bestScoreElement.innerText = `${localStorage.getItem("best-score") || this.gameState.score}`;
    }
  }
}

export default GameLoop;
