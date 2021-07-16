import { CameraRenderer, RENDER_MODE } from '../../../camera-processor';
import { VIRTUAL_BACKGROUND_TYPE, VirtualBackground } from '../shared';
import RenderPipeline from './RenderPipeline';
import * as scaling from './scaling';

class MLKitRenderPipeline extends RenderPipeline {
  public renderSettings = {};

  render(
    segmentation: { type: number; width: number; height: number; data: any },
    background: VirtualBackground,
    camera_video: HTMLVideoElement,
    renderer: CameraRenderer
  ): void {}
}

export default MLKitRenderPipeline;
