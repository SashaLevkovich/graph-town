import { DirectLight } from '@/shared/DirectLight';
import { Grid } from '@/shared/Grid';
import { Ground } from '@/shared/Ground';
import { HemiLight } from '@/shared/HemiLight';

import { Color, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { IActionScene } from './IActionScene';

export class InitScene implements IActionScene {
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  readonly renderer: WebGLRenderer;
  readonly orbitControl: OrbitControls;
  readonly ground: Ground;

  animate = () => {
    requestAnimationFrame(this.animate);

    this.renderer.render(this.scene, this.camera);
  };

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  constructor() {
    this.scene = new Scene();
    this.renderer = new WebGLRenderer();
    this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
    this.orbitControl = new OrbitControls(this.camera, this.renderer.domElement);
    this.ground = new Ground();

    const directLight = new DirectLight();
    const hemiLight = new HemiLight();
    const grid = new Grid();

    this.scene.background = new Color(0x8fbc8f);
    this.scene.add(this.ground);
    this.scene.add(directLight);
    this.scene.add(grid);
    this.scene.add(hemiLight);

    this.camera.position.set(11.355728920849053, 50.579716475504686, 100.31142433676645);

    this.orbitControl.maxPolarAngle = Math.PI / 2;
    this.orbitControl.minDistance = 50;
    this.orbitControl.maxDistance = 200;

    document.body.appendChild(this.renderer.domElement);

    this.onWindowResize();

    document.addEventListener('resize', this.onWindowResize);
  }

  async start() {
    this.animate();
  }
}
