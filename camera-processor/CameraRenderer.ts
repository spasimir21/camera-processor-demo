import OutputRenderMode from './render_modes/OutputRenderMode';
import WebGLRenderMode from './render_modes/WebGLRenderMode';
import _2DRenderMode from './render_modes/_2DRenderMode';
import RenderMode from './render_modes/RenderMode';
import FrameRenderer from './FrameRenderer';

enum RENDER_MODE {
  _2D = '_2d',
  WebGL = 'webgl'
}

class CameraRenderer {
  private readonly renderModes: { [key: string]: RenderMode } = {};
  public readonly renderers: FrameRenderer[] = [];

  public canvas: HTMLCanvasElement;
  public ctx: any;

  public renderModeId: string;
  public renderMode: RenderMode;

  public stream: MediaStream;
  public width: number = 1;
  public height: number = 1;

  constructor() {
    this.addRenderMode('output', new OutputRenderMode());
    this.addRenderMode(RENDER_MODE._2D, new _2DRenderMode());
    this.addRenderMode(RENDER_MODE.WebGL, new WebGLRenderMode());

    this.stream = this.renderModes['output'].getStream();
    this.use(RENDER_MODE._2D, false);
  }

  setDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
    Object.values(this.renderModes).forEach(mode => mode.setDimensions(width, height));
  }

  use(render_mode_id: string, copy: boolean = true): void {
    this.renderModes[render_mode_id].cleanup();

    if (this.renderModeId == render_mode_id) return;
    if (copy) this.renderModes[render_mode_id].copy(this.renderMode.canvas);

    this.canvas = this.renderModes[render_mode_id].canvas;
    this.ctx = this.renderModes[render_mode_id].ctx;

    this.renderMode = this.renderModes[render_mode_id];
    this.renderModeId = render_mode_id;
  }

  render(passthrough: boolean, analyzer_data: any, camera_video: HTMLVideoElement): void {
    this.use(RENDER_MODE._2D, false);
    this.ctx.drawImage(camera_video, 0, 0, this.width, this.height);

    if (!passthrough) {
      for (const renderer of this.renderers) {
        renderer.renderFrame(analyzer_data, camera_video, this);
      }
    }

    this.use('output');
  }

  addRenderMode<TRenderMode extends RenderMode>(id: string, render_mode: TRenderMode): TRenderMode {
    this.renderModes[id] = render_mode;
    return render_mode;
  }

  addRenderer<TRenderer extends FrameRenderer>(renderer: TRenderer): TRenderer {
    this.renderers.push(renderer);
    return renderer;
  }

  removeRenderer(idx: number): FrameRenderer {
    return this.renderers.splice(idx, 1)[0];
  }
}

export default CameraRenderer;
export { RENDER_MODE };
