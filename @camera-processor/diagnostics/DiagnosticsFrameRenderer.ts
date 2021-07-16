import { FrameRenderer, CameraRenderer, RENDER_MODE } from '../../camera-processor';

class DiagnosticsFrameRenderer extends FrameRenderer {
  render(analyzer_data: any, camera_video: HTMLVideoElement, renderer: CameraRenderer): void {
    if (analyzer_data.diagnostics == null) return;
    renderer.use(RENDER_MODE._2D);
    renderer.ctx.fillStyle = 'black';
    renderer.ctx.font = 'bold 30px Georgia';
    renderer.ctx.fillText(analyzer_data.diagnostics.fps, 10, 25);
  }
}

export default DiagnosticsFrameRenderer;
