import { SceneConnector } from '@/entities/SceneConnector';
import { House } from '@/shared/Geometry/House';
import { assetsConfig } from '@/shared/constants/assetsConfig';
import { IndexDB } from '@/shared/utils/indexDB';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export class HousePainter {
  private indexDB = new IndexDB();
  private draftHouse: House | null = null;

  housesMap = new Map<string, House>();

  constructor(private sceneConnector: SceneConnector, private assetMap: Map<string, GLTF>) {
    this.assetMap = assetMap;
    this.sceneConnector = sceneConnector;

    window.addEventListener('dblclick', this.handleWindowDbClick);
    window.ondblclick = this.handleWindowDbClick;
  }

  private handleWindowDbClick = (event: MouseEvent) => {
    const pointer = this.sceneConnector.getPointerPosition?.(event);

    if (!pointer) return;

    const intersect = this.sceneConnector.getIntersectWithGround?.(pointer);

    if (!intersect) return;

    this.draftHouse?.moveHouseTo(intersect.point);
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.draftHouse) {
      // this.draftHouse.removeHouseLabel();
      // this.draftHouse.removeHouseArm();
      this.sceneConnector.removeFromScene?.(this.draftHouse.mesh);
      this.sceneConnector.enableOrbitControl();
      this.draftHouse = null;
      // if (this.helperArmPlane) {
      //   this.sceneConnector.removeFromScene?.(this.helperArmPlane);
      // }
      // window.removeEventListener('pointermove', this.handlePointerMove);
      // window.addEventListener('pointerup', this.handlePointerUp);
    }
    window.removeEventListener('keydown', this.handleKeyDown);
  };

  private handleSaveHouse = () => {
    if (!this.draftHouse) return;

    this.saveHouse(this.draftHouse);
    this.draftHouse = null;
  };

  mountDraftHouseOnScene(assetTitle: string) {
    const house = this.createHouseByAssetTitle(assetTitle);

    if (!house) return;

    house.onSaveHouse = this.handleSaveHouse;
    house.setOpacity(0.5);

    this.draftHouse = house;
    this.sceneConnector.addToScene?.(house.mesh);

    house.createHouseLabel();
    // house.createHouseArm();

    window.addEventListener('keydown', this.handleKeyDown);
  }

  private createHouseByAssetTitle(assetTitle: string, id?: string) {
    const houseGLTF = this.assetMap.get(assetTitle);
    const assetConfig = assetsConfig.find(({ title }) => title === assetTitle);

    if (!houseGLTF || !assetConfig) return;

    const houseMesh = houseGLTF.scene.clone(true);

    return new House(houseMesh, assetConfig, id);
  }

  private async mountHouseFromIndexDb() {
    const houseInfo = await this.indexDB.getAllHousesInfo();

    for (const info of houseInfo) {
      const house = this.createHouseByAssetTitle(info.assetTitle, info.id)!;

      house.name = info.houseName;

      this.sceneConnector.addToScene?.(house.mesh);

      house.mesh.position.x = info.positionX;
      house.mesh.position.z = info.positionZ;

      house.isMount = true;

      house.createHouseLabel();

      this.housesMap.set(house.id, house);
    }
  }

  saveHouse(house: House) {
    house.setOpacity(1);
    house.isMount = true;

    this.housesMap.set(house.id, house);
  }
}
