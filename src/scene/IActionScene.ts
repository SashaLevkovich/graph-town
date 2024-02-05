import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

import { Ground } from '@/shared/Geometry/Ground';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface IActionScene {
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  readonly renderer: WebGLRenderer;
  readonly renderer2D: CSS2DRenderer;
  readonly ground: Ground;
  readonly orbitControl: OrbitControls;

  start(): Promise<void>;
}
