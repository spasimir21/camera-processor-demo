import {
  VIRTUAL_BACKGROUND_TYPE,
  RENDER_PIPELINE,
  SEGMENTATION_BACKEND,
  SegmentationAnalyzer,
  VirtualBackgroundRenderer
} from '@camera-processor/virtual-background';
import CameraProcessor from 'camera-processor';

function getCameraStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({ video: true });
}

function loadImage(path: string): Promise<HTMLImageElement> {
  const background_image = new Image();
  background_image.src = path;
  return new Promise((resolve, reject) => {
    background_image.onload = _ => resolve(background_image);
    background_image.onerror = _ => reject(new Error(`Failed loading the background image: "${background_image.src}"`));
  });
}

type AnalyzerData = {
  segmentation: { type: number; data: Uint8Array | Float32Array | null };
};

async function main(): Promise<void> {
  const segmentation_analyzer = new SegmentationAnalyzer(SEGMENTATION_BACKEND.MLKit);
  await segmentation_analyzer.loadModel({
    modelPath: '/public/model/selfie.tflite',
    modulePath: '/public/tflite/'
  });

  const background_image = await loadImage('/public/background/background.jpg');
  const background_renderer = new VirtualBackgroundRenderer(RENDER_PIPELINE._2D);
  background_renderer.setBackground(VIRTUAL_BACKGROUND_TYPE.Image, background_image);
  background_renderer.setRenderSettings({ contourFilter: 'blur(4px)' });

  const camera_processor = new CameraProcessor<AnalyzerData>();
  camera_processor.setCameraStream(await getCameraStream());
  camera_processor.addAnalyzer('segmentation', segmentation_analyzer);
  camera_processor.addRenderer(background_renderer);
  await camera_processor.start();

  const video = document.querySelector('#camera-video') as HTMLVideoElement;
  video.srcObject = camera_processor.getOutputStream();
  await video.play();

  (window as any).camera_processor = camera_processor;
  (window as any).video = video;
}

window.addEventListener('DOMContentLoaded', main);
