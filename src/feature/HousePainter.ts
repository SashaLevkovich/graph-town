import { Event, Group, Intersection, Mesh, Object3D, Vector2 } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

type GetIntersectWithGround = (pointer: Vector2) => Intersection<Object3D<Event>>;
type GetPointerPosition = (pointer: PointerEvent | MouseEvent) => Vector2;
type AddToScene = (element: Object3D<Event> | Group | Mesh) => void;

export class HousePainter {
  getPointerPosition: GetPointerPosition | null = null;
  getIntersectWithGround: GetIntersectWithGround | null = null;
  addToScene: AddToScene | null = null;

  constructor(assetsMap: Map<string, GLTF>) {}
}
