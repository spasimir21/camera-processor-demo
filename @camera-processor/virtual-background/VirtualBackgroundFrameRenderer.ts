import { SEGMENTATION_BACKEND, VIRTUAL_BACKGROUND_TYPE, VirtualBackground } from './shared';
import BodyPixRenderPipeline from './render_pipelines/BodyPixRenderPipeline';
// import MLKitRenderPipeline from './render_pipelines/MLKitRenderPipeline';
import { FrameRenderer, CameraRenderer } from '../../camera-processor';
import RenderPipeline from './render_pipelines/RenderPipeline';

class VirtualBackgroundFrameRenderer extends FrameRenderer {
  public readonly background: VirtualBackground = { type: VIRTUAL_BACKGROUND_TYPE.None, data: null };
  private readonly pipelines: { [key: string]: RenderPipeline } = {};
  public pipelineId: SEGMENTATION_BACKEND;
  public pipeline: RenderPipeline;
  public renderSettings: any;

  constructor() {
    super();
    this.addPipeline(SEGMENTATION_BACKEND.BodyPix, new BodyPixRenderPipeline());
    this.addPipeline(SEGMENTATION_BACKEND.MLKit, new BodyPixRenderPipeline());
  }

  setBackground(type: VIRTUAL_BACKGROUND_TYPE, data: any = null) {
    this.background.type = type;
    this.background.data = data;
  }

  setPipeline(pipeline_id: SEGMENTATION_BACKEND): void {
    this.pipelineId = pipeline_id;
    this.pipeline = this.pipelines[this.pipelineId];
    this.renderSettings = this.pipeline.renderSettings;
  }

  setRenderSettings(render_settings: any): void {
    this.renderSettings = render_settings;
  }

  render(analyzer_data: any, camera_video: HTMLVideoElement, renderer: CameraRenderer): void {
    if (analyzer_data.segmentation?.data == null) return;
    if (this.pipelineId != analyzer_data.segmentation.type) this.setPipeline(analyzer_data.segmentation.type);
    this.pipeline.renderSettings = this.renderSettings;
    this.pipeline.render(analyzer_data.segmentation, this.background, camera_video, renderer);
  }

  // prettier-ignore
  addPipeline<TPipeline extends RenderPipeline>(pipeline_id: SEGMENTATION_BACKEND, pipeline: TPipeline): TPipeline {
    this.pipelines[pipeline_id] = pipeline;
    return pipeline;
  }
}

export default VirtualBackgroundFrameRenderer;
