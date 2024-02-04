import { Group, Mesh, Vector3 } from 'three';
import { v4 as uuidv4 } from 'uuid';

export class House {
  readonly mesh: Group;
  readonly id: string;

  constructor(mesh: Group) {
    this.mesh = mesh;
    this.id = uuidv4();

    this.cloneMaterial();
  }

  setOpacity(opacity: number) {
    this.mesh.traverse((child) => {
      if (child instanceof Mesh) {
        child.material.transparent = true;
        child.material.opacity = opacity;
      }
    });
  }

  moveTo(vector: Vector3) {
    this.mesh.position.copy(vector);
  }

  cloneMaterial() {
    this.mesh.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = child.material.clone();
      }
    });
  }
}
