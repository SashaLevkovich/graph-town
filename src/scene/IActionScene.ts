import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

import { Ground } from '@/shared/Geometry/Ground';

export interface IActionScene {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  renderer2D: CSS2DRenderer;
  ground: Ground;

  start(): Promise<void>;
}
