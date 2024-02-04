import { HousePainter } from '@/feature/HousePainter';
import { House } from '@/shared/House';
import { Event, Group, Mesh, Object3D, Raycaster, Vector2 } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { IActionScene } from './IActionScene';

export class MainScene {
  readonly actionScene: IActionScene;
  readonly assetsMap: Map<string, GLTF>;

  private raycaster: Raycaster = new Raycaster();
  private draftHouse: House | null = null;
  private housePainter: HousePainter | null = null;

  constructor(actionScene: IActionScene, assetsMap: Map<string, GLTF>) {
    this.actionScene = actionScene;
    this.assetsMap = assetsMap;

    window.ondblclick = (event) => {
      const pointer = this.getPointerPosition(event);
      const intersect = this.getIntersectWithGround(pointer);

      this.draftHouse?.moveTo(intersect.point);
    };

    window.onkeydown = (event) => {
      if (event.key === 'Enter' && this.draftHouse) {
        this.draftHouse.setOpacity(1);

        this.draftHouse = null;
      }
    };
  }

  async start() {
    this.housePainter = new HousePainter(this.assetsMap);
    this.housePainter.getPointerPosition = this.getPointerPosition.bind(this);
    this.housePainter.getIntersectWithGround = this.getIntersectWithGround.bind(this);
    this.housePainter.addToScene = this.addToScene.bind(this);
  }

  mountDraftHouseOnScene(title: string) {
    const houseGLTF = this.assetsMap.get(title);

    if (!houseGLTF) return;

    const houseCloneMesh = houseGLTF.scene.clone(true);

    const house = new House(houseCloneMesh);

    house.setOpacity(0.5);

    this.draftHouse = house;

    this.actionScene.scene.add(houseCloneMesh);
  }

  private addToScene(element: Object3D<Event> | Group | Mesh) {
    this.actionScene.scene.add(element);
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
}
