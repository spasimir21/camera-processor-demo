import { DiagnosticsFrameAnalyzer, DiagnosticsFrameRenderer } from './@camera-processor/diagnostics';
import {
  VIRTUAL_BACKGROUND_TYPE,
  SEGMENTATION_BACKEND,
  SegmentationFrameAnalyzer,
  VirtualBackgroundFrameRenderer
} from './@camera-processor/virtual-background';
import CameraProcessor from './camera-processor';
import createModel from './@camera-processor/tflite-helper';

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
  const segmentation_analyzer = new SegmentationFrameAnalyzer(SEGMENTATION_BACKEND.MLKit, false);
  segmentation_analyzer.loadModel({
    modelPath: '/public/model/selfie.tflite',
    modulePath: '/public/tflite/'
  });

  camera_processor.addAnalyzer('diagnostics', new DiagnosticsFrameAnalyzer());
  camera_processor.addAnalyzer('segmentation', segmentation_analyzer);

  const background_renderer = camera_processor.addRenderer(new VirtualBackgroundFrameRenderer());
  camera_processor.addRenderer(new DiagnosticsFrameRenderer());

  const background_image = new Image();
  background_image.src = '/public/background/background.jpg';

  background_renderer.setBackground(VIRTUAL_BACKGROUND_TYPE.Image, background_image);
  background_renderer.setRenderSettings({ contourFilter: 'blur(4px)' });

  video.srcObject = camera_processor.renderer.stream;
  video.play();

  (window as any).camera_processor = camera_processor;
  (window as any).createModel = createModel;
}

window.addEventListener('DOMContentLoaded', main);
