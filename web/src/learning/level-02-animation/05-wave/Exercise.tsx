'use client';

import * as THREE from 'three';
import VanillaScene, { type Frame } from '../../shared/VanillaScene';

function createSubject() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: '#38bdf8' });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.y = 1.5;
  return cube;
}

// PHẦN BẠN HỌC/SỬA: sin tạo giá trị -1..1, học sau chuyển động A→B.
function update(cube: THREE.Object3D, { elapsed }: Frame) {
  const baseY = 1.5;
  const amplitude = 0.5;
  const angularSpeed = Math.PI; // chu kỳ 2 giây
  cube.position.y = baseY + amplitude * Math.sin(elapsed * angularSpeed);
  // TODO: đổi từng biến riêng. Vì sao baseY=0.5 có thể làm cube xuyên sàn?
}

export default function Exercise() { return <VanillaScene createSubject={createSubject} update={update} />; }
