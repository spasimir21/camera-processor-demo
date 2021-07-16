import BodyPixSegmentationBackend from './segmentation_backends/BodyPixSegmentationBackend';
import MLKitSegmentationBackend from './segmentation_backends/MLKitSegmentationBackend';
import SegmentationBackend from './segmentation_backends/SegmentationBackend';
import { FrameAnalyzer } from '../../camera-processor';
import CameraProcessor from '../../camera-processor';
import { SEGMENTATION_BACKEND } from './shared';

class SegmentationFrameAnalyzer extends FrameAnalyzer {
  private segmentationResult: { type: SEGMENTATION_BACKEND; width: number; height: number; data: any };
  private readonly backends: { [key: string]: SegmentationBackend } = {};
  public backendId: SEGMENTATION_BACKEND;
  public backend: SegmentationBackend;
  public modelSettings: any;
  public segmentationSettings: any;

  constructor(segmentation_backend: SEGMENTATION_BACKEND, auto_load: boolean = true) {
    super();
    this.segmentationResult = { type: segmentation_backend, width: 1, height: 1, data: null };
    this.addBackend(SEGMENTATION_BACKEND.BodyPix, new BodyPixSegmentationBackend());
    this.addBackend(SEGMENTATION_BACKEND.MLKit, new MLKitSegmentationBackend());
    this.setBackend(segmentation_backend);
    if (auto_load) this.backend.loadModel();
  }

  setBackend(backend_id: SEGMENTATION_BACKEND): void {
    this.backendId = backend_id;
    this.backend = this.backends[this.backendId];
    this.modelSettings = this.backend.modelSettings;
    this.segmentationSettings = this.backend.segmentationSettings;
    this.segmentationResult.type = this.backendId;
  }

  async loadModel(model_settings: any) {
    await this.backend.loadModel(model_settings);
    this.modelSettings = model_settings;
  }

  setSegmentationSettings(segmentation_settings: any): void {
    this.segmentationSettings = segmentation_settings;
    this.backend.segmentationSettings = segmentation_settings;
  }

  async analyze(camera_video: HTMLVideoElement, camera_processor: CameraProcessor): Promise<any> {
    this.segmentationResult.data = await this.backend.analyze(camera_video);
    this.segmentationResult.width = this.backend.width || camera_processor.renderer.width;
    this.segmentationResult.height = this.backend.height || camera_processor.renderer.height;
    return this.segmentationResult;
  }

  // prettier-ignore
  addBackend<TBackend extends SegmentationBackend>(backend_id: SEGMENTATION_BACKEND, backend: TBackend): TBackend {
    this.backends[backend_id] = backend;
    return backend;
  }
}

export default SegmentationFrameAnalyzer;
