import { createRoot } from 'react-dom/client';

import { HouseMenu } from './feature/HouseMenu/HouseMenu';

import { InitScene } from './scene/InitScene';
import { LoadAssetsScene } from './scene/LoadAssetsScene';
import { MainScene } from './scene/MainScene';

import './index.css';

const initScene = new InitScene();
initScene.start();

const assets = new LoadAssetsScene();
assets.start();

const mainScene = new MainScene(initScene, assets.assetsMap);
mainScene.start();

const root = createRoot(document.getElementById('root')!);

root.render(
  <>
    <HouseMenu scene={mainScene} />
  </>
);
