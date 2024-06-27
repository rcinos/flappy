import GameState from "./gameState";
import EventManager from "./eventManager";
import {
  BackgroundStrategy,
  InverseBackgroundStrategy,
  NormalBackgroundStrategy,
} from "./backgroundStrategy";
import GameLoop from "./gameLoop.ts";

class GameInitializer {
  private gameState: GameState;
  private eventManager: EventManager;
  private fieldElement: HTMLElement;
  public backgroundStrategy: BackgroundStrategy;

  constructor() {
    this.gameState = GameState.getInstance();
    this.eventManager = EventManager.getInstance();
    this.fieldElement = document.getElementById("field") as HTMLElement;

    if (this.gameState.isInverseMode) {
      this.backgroundStrategy = new InverseBackgroundStrategy(
        this.fieldElement,
      );
    } else {
      this.backgroundStrategy = new NormalBackgroundStrategy(this.fieldElement);
    }

    this.initializeEventListeners();
    document.body.style.setProperty(
      "--column-gap",
      `${this.gameState.columnGap}`,
    );
  }

  private initializeEventListeners() {
    document.addEventListener("keydown", (event) => this.handleJump(event));
    document.addEventListener("touchstart", (event) => this.handleJump(event));
    const restartButtonElement = document.getElementById(
      "restart-btn",
    ) as HTMLButtonElement;
    restartButtonElement.addEventListener("click", (event) =>
      this.restartGame(event),
    );
    this.eventManager.subscribe("scoreUpdated", (score) => {
      const scoreDisplayElement = document.getElementById("score");
      (scoreDisplayElement as HTMLElement).innerText = `${score}`;
    });
  }

  private handleJump(event: TouchEvent | KeyboardEvent) {
    if (
      (event instanceof KeyboardEvent && event.key === " ") ||
      event instanceof TouchEvent
    ) {
      if (!this.gameState.isGameStarted) {
        this.startGame();
      }
      this.gameState.jumpAmount = this.gameState.birdJump;
      this.gameState.isJumping = true;
    }
  }

  private startGame() {
    const gameLoop = new GameLoop(this.backgroundStrategy);
    gameLoop.start();
  }

  private restartGame(event: MouseEvent) {
    event.stopPropagation();
    this.gameState.reset();
    this.removeColumns();
    const restartWindowElement = document.getElementById(
      "restart",
    ) as HTMLElement;
    restartWindowElement.style.display = "none";
    this.initializeEventListeners();
    const bird = document.getElementById("bird") as HTMLElement;
    bird.style.top = "50%";
    const scoreDisplayElement = document.getElementById("score") as HTMLElement;
    scoreDisplayElement.innerText = "0";
  }

  private removeColumns() {
    const columns = document.querySelectorAll<HTMLElement>(".column");
    columns.forEach((column) => column.remove());
  }
}

export default GameInitializer;
