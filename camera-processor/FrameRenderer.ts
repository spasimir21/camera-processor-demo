import CameraRenderer from './CameraRenderer';

class FrameRenderer {
  public isRunning: boolean = true;

  start(): void {
    this.isRunning = true;
  }

  stop(): void {
    this.isRunning = false;
  }

  renderFrame(analyzer_data: any, camera_video: HTMLVideoElement, renderer: CameraRenderer): void {
    if (!this.isRunning) return;
    return this.render(analyzer_data, camera_video, renderer);
  }

  render(analyzer_data: any, camera_video: HTMLVideoElement, renderer: CameraRenderer): void {}
}

export default FrameRenderer;
