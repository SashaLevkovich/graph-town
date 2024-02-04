import { Ground } from '@/shared/Ground';
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export interface IActionScene {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  ground: Ground;

  start(): Promise<void>;
}
