export default class CanvasDraw {
  // 上层上下文，用于绘制交互元素
  upperCtx: CanvasRenderingContext2D
  // 下层上下文，用于绘制静态元素
  lowerCtx: CanvasRenderingContext2D
  container: HTMLElement
  constructor(container: HTMLElement, width: number, height: number) {
    this.container = container
    const canvas = document.createElement('canvas')
    this.upperCtx = this.lowerCtx = canvas.getContext('2d')!
    container.appendChild(canvas)
    this.resize(width, height);
    const dpr = this.getDpr()
    this.upperCtx.scale(dpr, dpr);
  }
  
  resize(width: number, height: number) {
    this.container.style.width = `${width}px`;
    this.container.style.height = `${height}px`;
    this.upperCtx.canvas.width = this.lowerCtx.canvas.width = width;
    this.upperCtx.canvas.height = this.lowerCtx.canvas.height = height;
  }

  getDpr() {
    return window.devicePixelRatio || 1
  }
}