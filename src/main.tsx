import { createRoot } from 'react-dom/client';

import { HouseMenu } from './feature/HouseMenu/HouseMenu';

import { InitScene } from './scene/InitScene';
import { LoadAssetsScene } from './scene/LoadAssetsScene';
import { MainScene } from './scene/MainScene';

import { FindPathMenu } from './feature/FindPathMenu/FindPathMenu';
import './index.css';
import { IndexDB } from './shared/utils/indexDB';

const indexDb = new IndexDB();

indexDb.onSuccessOpened = async () => {
  const initScene = new InitScene();
  initScene.start();

  const assets = new LoadAssetsScene();
  await assets.start();

  const mainScene = new MainScene(initScene, assets.assetsMap);
  mainScene.start();

  const root = createRoot(document.getElementById('root')!);

  root.render(
    <>
      <HouseMenu scene={mainScene} />
      <FindPathMenu pathPainter={mainScene.pathPainter} housePainter={mainScene.housePainter} />
    </>
  );
};
