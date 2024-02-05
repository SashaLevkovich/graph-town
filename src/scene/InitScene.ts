import { Color, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

import { Grid } from '@/shared/Geometry/Grid';
import { Ground } from '@/shared/Geometry/Ground';
import { DirectLight } from '@/shared/Light/DirectLight';
import { HemiLight } from '@/shared/Light/HemiLight';

import { IActionScene } from './IActionScene';

export class InitScene implements IActionScene {
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  readonly renderer: WebGLRenderer;
  readonly renderer2D: CSS2DRenderer;
  readonly orbitControl: OrbitControls;
  readonly ground: Ground;

  private animate = () => {
    requestAnimationFrame(this.animate);

    this.renderer.render(this.scene, this.camera);
    this.renderer2D.render(this.scene, this.camera);
  };

  private onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer2D.setSize(window.innerWidth, window.innerHeight);
  };

  constructor() {
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({ alpha: true });
    this.renderer2D = new CSS2DRenderer();
    this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
    this.orbitControl = new OrbitControls(this.camera, this.renderer2D.domElement);
    this.ground = new Ground();

    const directLight = new DirectLight();
    const hemiLight = new HemiLight();
    const grid = new Grid();

    this.scene.background = new Color(0x8fbc8f);
    this.scene.add(this.ground);
    this.scene.add(directLight);
    this.scene.add(grid);
    this.scene.add(hemiLight);

    this.camera.position.set(25, 16, 40);

    this.orbitControl.maxPolarAngle = Math.PI / 2;
    this.orbitControl.minDistance = 50;
    this.orbitControl.maxDistance = 200;

    document.body.appendChild(this.renderer.domElement);
    document.body.appendChild(this.renderer2D.domElement);

    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer2D.domElement.style.position = 'absolute';
    this.renderer2D.domElement.style.top = '0px';

    this.onWindowResize();

    document.addEventListener('resize', this.onWindowResize);
  }

  async start() {
    this.animate();
  }
}
