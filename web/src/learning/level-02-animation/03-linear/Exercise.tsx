'use client';

import * as THREE from 'three';
import VanillaScene, { type Frame } from '../../shared/VanillaScene';

function createSubject() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: '#38bdf8' });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(-2, 0.5, 0);
  return cube;
}

// PHẦN BẠN HỌC/SỬA: sau 1 giây x=-1, sau 2 giây x=0.
function update(cube: THREE.Object3D, { elapsed }: Frame) {
  const startX = -2;
  const speed = 1; // đơn vị scene/giây
  cube.position.x = startX + speed * elapsed;
  // TODO: đoán vị trí trước, sau đó đổi speed thành 0.5 hoặc -1.
}

export default function Exercise() { return <VanillaScene createSubject={createSubject} update={update} duration={4} />; }
