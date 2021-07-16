import CameraAnalyzer from './CameraAnalyzer';
import CameraRenderer from './CameraRenderer';
import FrameAnalyzer from './FrameAnalyzer';
import FrameRenderer from './FrameRenderer';

class CameraProcessor<TAnalyzerData = any> {
  public readonly analyzer: CameraAnalyzer<TAnalyzerData> = new CameraAnalyzer();
  public readonly renderer: CameraRenderer = new CameraRenderer();

  private readonly cameraVideo: HTMLVideoElement = document.createElement('video');
  public cameraStream: MediaStream;

  public passthrough: boolean = false;
  public isRunning: boolean = false;
  public frameTime: number = NaN;
  public fps: number = NaN;

  constructor() {
    this.processFrame = this.processFrame.bind(this); // For callback purposes
  }

  start(): void {
    this.isRunning = true;
    this.cameraVideo.play();
    requestAnimationFrame(this.processFrame);
  }

  stop(): void {
    this.isRunning = false;
    this.cameraVideo.pause();
  }

  setCameraStream(stream: MediaStream): void {
    this.cameraVideo.srcObject = stream;
    this.cameraStream = stream;

    const stream_settings = stream.getVideoTracks()[0].getSettings();
    this.renderer.setDimensions(stream_settings.width, stream_settings.height);
  }

  private async processFrame(): Promise<void> {
    const start_time = Date.now();

    if (!this.passthrough) await this.analyzer.analyze(this.cameraVideo, this);
    this.renderer.render(this.passthrough, this.analyzer.data, this.cameraVideo);

    this.frameTime = Date.now() - start_time;
    this.fps = Math.min(1000 / this.frameTime, 1000);
    if (this.isRunning) requestAnimationFrame(this.processFrame);
  }

  addAnalyzer<TAnalyzer extends FrameAnalyzer>(name: string, analyzer: TAnalyzer): TAnalyzer {
    return this.analyzer.addAnalyzer(name, analyzer);
  }

  removeAnalyzer(name: string): FrameAnalyzer {
    return this.analyzer.removeAnalyzer(name);
  }

  addRenderer<TRenderer extends FrameRenderer>(renderer: TRenderer): TRenderer {
    return this.renderer.addRenderer(renderer);
  }

  removeRenderer(idx: number): FrameRenderer {
    return this.renderer.removeRenderer(idx);
  }
}

export default CameraProcessor;
