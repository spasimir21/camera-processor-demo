import _2DRenderMode from './_2DRenderMode';

class OutputRenderMode extends _2DRenderMode {
  cleanup() {
    super.cleanup();
    this.ctx.globalCompositeOperation = 'copy';
  }
}

export default OutputRenderMode;
