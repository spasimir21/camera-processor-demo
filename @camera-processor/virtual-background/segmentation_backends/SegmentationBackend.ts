class SegmentationBackend {
  public segmentationSettings = {};
  public modelSettings = {};
  public width: number = null;
  public height: number = null;

  async loadModel(model_settings = this.modelSettings): Promise<void> {
    this.modelSettings = model_settings;
  }

  async analyze(camera_video: HTMLVideoElement): Promise<any> {
    return null;
  }
}

export default SegmentationBackend;
