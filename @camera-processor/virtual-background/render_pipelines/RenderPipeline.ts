import { CameraRenderer } from '../../../camera-processor';
import { VirtualBackground } from '../shared';

class RenderPipeline {
  public renderSettings: any = {};

  render(
    segmentation: { type: number; width: number; height: number; data: any },
    background: VirtualBackground,
    camera_video: HTMLVideoElement,
    renderer: CameraRenderer
  ): void {}
}

export default RenderPipeline;
