import { assetsConfig } from '@/shared/constants/assetsConfig';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class LoadAssetsScene {
  readonly assetsMap = new Map<string, GLTF>();

  private loader: GLTFLoader = new GLTFLoader();

  async start() {
    for (const asset of assetsConfig) {
      const gltf = await this.loadModel(asset.path);

      this.assetsMap.set(asset.title, gltf);
    }
  }

  private async loadModel(path: string): Promise<GLTF> {
    return new Promise((res, rej) => this.loader.load(path, res, () => null, rej));
  }
}
