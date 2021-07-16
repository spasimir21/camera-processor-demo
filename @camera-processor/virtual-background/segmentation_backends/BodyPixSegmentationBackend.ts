import SegmentationBackend from './SegmentationBackend';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tfjs from '@tensorflow/tfjs';

tfjs.getBackend(); // Don't prune tfjs

class BodyPixSegmentationBackend extends SegmentationBackend {
  private net: bodyPix.BodyPix = null;

  public modelSettings = {
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 0.75,
    quantBytes: 2
  };

  public segmentationSettings = {
    flipHorizontal: false,
    internalResolution: 'medium',
    segmentationThreshold: 0.7,
    maxDetections: 10,
    scoreThreshold: 0.3,
    nmsRadius: 20
  };

  async loadModel(model_settings = this.modelSettings): Promise<void> {
    this.net = await bodyPix.load(model_settings as any);
    this.modelSettings = model_settings;
  }

  async analyze(camera_video: HTMLVideoElement): Promise<Uint8Array | null> {
    if (this.net == null || camera_video.readyState < 2) return null;
    return (await this.net.segmentPerson(camera_video, this.segmentationSettings as any)).data;
  }
}

export default BodyPixSegmentationBackend;
