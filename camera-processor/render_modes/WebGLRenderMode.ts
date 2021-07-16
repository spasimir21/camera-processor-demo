import RenderMode from './RenderMode';

class WebGLRenderMode extends RenderMode<WebGL2RenderingContext | WebGLRenderingContext> {
  public isWebGL2: boolean;

  getContext(): WebGL2RenderingContext | WebGLRenderingContext {
    const webgl2_ctx = this.canvas.getContext('webgl2');
    this.isWebGL2 = webgl2_ctx != null;

    return (
      webgl2_ctx ||
      this.canvas.getContext('webgl') ||
      (this.canvas.getContext('experimental-webgl') as WebGLRenderingContext)
    );
  }

  cleanup(): void {}

  copy(source: CanvasImageSource): void {}
}

export default WebGLRenderMode;
