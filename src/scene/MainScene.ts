import { Event, Group, Mesh, Object3D, Raycaster, Vector2 } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { HousePainter } from '@/feature/HousePainter';
import { PathPainter } from '@/feature/PathPainter';

import { SceneConnector } from '@/entities/SceneConnector';

import { IActionScene } from './IActionScene';

export class MainScene {
  readonly actionScene: IActionScene;
  readonly assetsMap: Map<string, GLTF>;

  private raycaster: Raycaster = new Raycaster();

  housePainter: HousePainter | null = null;
  pathPainter: PathPainter | null = null;

  private sceneConnector = new SceneConnector();

  constructor(actionScene: IActionScene, assetsMap: Map<string, GLTF>) {
    this.actionScene = actionScene;
    this.assetsMap = assetsMap;

    this.sceneConnector.getPointerPosition = this.getPointerPosition.bind(this);
    this.sceneConnector.getIntersectWithGround = this.getIntersectWithGround.bind(this);
    this.sceneConnector.getIntersectWithScene = this.getIntersectWithScene.bind(this);
    this.sceneConnector.addToScene = this.addToScene.bind(this);
    this.sceneConnector.removeFromScene = this.removeFromScene.bind(this);
    this.sceneConnector.getIntersectWithSprite = this.getIntersectWithSprite.bind(this);
    this.sceneConnector.disableOrbitControl = this.disableOrbitControl.bind(this);
    this.sceneConnector.enableOrbitControl = this.enableOrbitControl.bind(this);
  }

  async start() {
    this.housePainter = new HousePainter(this.sceneConnector, this.assetsMap);
    this.pathPainter = new PathPainter(this.sceneConnector);
  }

  mountDraftHouseOnScene(title: string) {
    this.housePainter?.mountDraftHouseOnScene(title);
  }

  private addToScene(element: Object3D<Event> | Group | Mesh) {
    this.actionScene.scene.add(element);
  }

  private removeFromScene(element: Object3D<Event> | Group | Mesh) {
    this.actionScene.scene.remove(element);
  }

  private getPointerPosition(event: PointerEvent | MouseEvent) {
    const pointer = new Vector2();

    pointer.x = (event.clientX / this.actionScene.renderer.domElement.clientWidth) * 2 - 1;
    pointer.y = -(event.clientY / this.actionScene.renderer.domElement.clientHeight) * 2 + 1;

    return pointer;
  }

  private getIntersectWithGround(pointer: Vector2) {
    this.raycaster.setFromCamera(pointer, this.actionScene.camera);

    return this.raycaster.intersectObject(this.actionScene.ground)[0];
  }

  private getIntersectWithScene(pointer: Vector2) {
    this.raycaster.setFromCamera(pointer, this.actionScene.camera);

    return this.raycaster.intersectObjects(this.actionScene.scene.children, true);
  }

  private getIntersectWithSprite(pointer: Vector2, sprite: Object3D<Event> | Group | Mesh) {
    this.raycaster.setFromCamera(pointer, this.actionScene.camera);

    const firstIntersect = this.raycaster.intersectObject(sprite, true)[0];

    return firstIntersect;
  }

  private enableOrbitControl() {
    this.actionScene.orbitControl.enabled = true;
  }

  private disableOrbitControl() {
    this.actionScene.orbitControl.enabled = false;
  }
}
