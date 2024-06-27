import GameState from "./gameState";
import ColumnFactory from "./columnFactory";
import EventManager from "./eventManager";

class ColumnManager {
  private gameState: GameState;
  private columnFactory: ColumnFactory;
  private eventManager: EventManager;

  constructor() {
    this.gameState = GameState.getInstance();
    this.columnFactory = new ColumnFactory();
    this.eventManager = EventManager.getInstance();
  }

  public generateColumn() {
    const fieldElement = document.getElementById("field");
    const column = this.columnFactory.createColumn();
    if (fieldElement) {
      fieldElement.appendChild(column);
    }
  }

  public updateColumns() {
    const birdElement = document.getElementById("bird");
    const columns = document.querySelectorAll<HTMLElement>(".column");

    if (birdElement) {
      const birdRect = birdElement.getBoundingClientRect();

      columns.forEach((column) => {
        if (column.getBoundingClientRect().right < 0) {
          column.remove();
        } else {
          const columnLeft = parseInt(column.style.left);
          column.style.left = `${columnLeft - this.gameState.birdSpeed}px`;
          // console.log(
          //   column.getBoundingClientRect().right, birdRect.left,
          //   column.getAttribute("passed"),
          // );
          if (
            !column.getAttribute("passed") &&
            column.getBoundingClientRect().right < birdRect.left
          ) {
            column.setAttribute("passed", "true");
            this.gameState.score++;
            this.eventManager.notify("scoreUpdated", this.gameState.score);
            // console.log("notified");
          }
        }
      });
    }
  }

  public checkForCollision(): boolean {
    const birdElement = document.getElementById("bird");
    const columns = document.querySelectorAll<HTMLElement>(".column");

    if (birdElement) {
      const birdRect = birdElement.getBoundingClientRect();

      for (const column of columns) {
        const columnRect = column.getBoundingClientRect();
        const topColumn = column.querySelector(".top-column") as HTMLElement;
        const bottomColumn = column.querySelector(
          ".bottom-column",
        ) as HTMLElement;

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
    }
    return false;
  }
}

export default ColumnManager;
