interface BackgroundStrategy {
  changeBackgroundColor(): void;
}

class InverseBackgroundStrategy implements BackgroundStrategy {
  private fieldElement: HTMLElement;

  constructor(fieldElement: HTMLElement) {
    this.fieldElement = fieldElement;
  }

  public changeBackgroundColor(): void {
    this.fieldElement.style.backgroundColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
  }
}

class NormalBackgroundStrategy implements BackgroundStrategy {
  private fieldElement: HTMLElement;

  constructor(fieldElement: HTMLElement) {
    this.fieldElement = fieldElement;
  }

  public changeBackgroundColor(): void {
    this.fieldElement.style.backgroundColor = "white"; // or any default color
  }
}

export { InverseBackgroundStrategy, NormalBackgroundStrategy };
export type { BackgroundStrategy };
