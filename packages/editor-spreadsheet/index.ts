import CanvasDraw from "./canvas"

export default class Spreadsheet {
  canvasDraw: CanvasDraw
  constructor(container: HTMLElement, width: number, height: number) {
    this.canvasDraw = new CanvasDraw(container, width, height)
  }
}