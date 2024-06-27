class ColumnFactory {
  public createColumn(): HTMLElement {
    const column = document.createElement("div");
    const topColumn = document.createElement("div");
    const bottomColumn = document.createElement("div");

    column.classList.add("column");
    topColumn.classList.add("top-column");
    bottomColumn.classList.add("bottom-column");

    column.appendChild(topColumn);
    column.appendChild(bottomColumn);

    topColumn.style.height = `${Math.floor((Math.random() * (innerHeight - 100) + 100) * 0.7)}px`;
    column.style.left = `${(document.getElementById("field") as HTMLElement).offsetWidth}px`;
    // column.setAttribute("passed", "false");

    return column;
  }
}

export default ColumnFactory;
