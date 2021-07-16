import CameraProcessor, { FrameAnalyzer } from '../../camera-processor';

class DiagnosticsFrameAnalyzer extends FrameAnalyzer {
  async analyze(camera_video: HTMLVideoElement, camera_processor: CameraProcessor) {
    return {
      frameTime: camera_processor.frameTime,
      fps: Math.floor(camera_processor.fps)
    };
  }
}

export default DiagnosticsFrameAnalyzer;
