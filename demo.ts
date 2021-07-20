import {
  VIRTUAL_BACKGROUND_TYPE,
  RENDER_PIPELINE,
  SEGMENTATION_BACKEND,
  SegmentationAnalyzer,
  VirtualBackgroundRenderer
} from '@camera-processor/virtual-background';
import CameraProcessor from 'camera-processor';

async function getCameraStream() {
  return await navigator.mediaDevices.getUserMedia({ video: true });
}

type AnalyzerData = {
  diagnostics: { frameTime: number; fps: number };
  segmentation: { type: number; data: Uint8Array | Float32Array | null };
};

async function main(): Promise<void> {
  const video = document.querySelector('#camera-video') as HTMLVideoElement;
  const camera_stream = await getCameraStream();

  const camera_processor = new CameraProcessor<AnalyzerData>();
  camera_processor.setCameraStream(camera_stream);
  camera_processor.start();

  // prettier-ignore
  const segmentation_analyzer = new SegmentationAnalyzer(SEGMENTATION_BACKEND.MLKit);
  segmentation_analyzer.loadModel({
    modelPath: '/public/model/selfie.tflite',
    modulePath: '/public/tflite/'
  });

  camera_processor.addAnalyzer('segmentation', segmentation_analyzer);

  const background_renderer = camera_processor.addRenderer(new VirtualBackgroundRenderer(RENDER_PIPELINE._2D));

  const background_image = new Image();
  background_image.src = '/public/background/background.jpg';

  background_renderer.setBackground(VIRTUAL_BACKGROUND_TYPE.Image, background_image);
  background_renderer.setRenderSettings({ contourFilter: 'blur(4px)' });

  video.srcObject = camera_processor.getOutputStream();
  video.play();

  (window as any).camera_processor = camera_processor;
}

window.addEventListener('DOMContentLoaded', main);
