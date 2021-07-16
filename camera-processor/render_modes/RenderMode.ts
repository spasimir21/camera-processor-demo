class RenderMode<TContext extends RenderingContext = any> {
  public readonly canvas: HTMLCanvasElement = document.createElement('canvas');
  public ctx: TContext;

  public width: number = 1;
  public height: number = 1;

  constructor() {
    this.ctx = this.getContext();
  }

  getContext(): TContext {
    return null;
  }

  setDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  copy(source: CanvasImageSource): void {}

  cleanup(): void {}

  getStream(): MediaStream {
    return (this.canvas as any).captureStream();
  }
}

export default RenderMode;
