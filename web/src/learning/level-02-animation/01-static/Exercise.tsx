'use client';

import * as THREE from 'three';
import VanillaScene from '../../shared/VanillaScene';

// PHẦN BẠN HỌC/SỬA: đặt vị trí một lần, chưa có công thức chuyển động.
function createSubject() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: '#38bdf8' });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = 0;
  cube.position.y = 0.5;
  // TODO: đổi X thành 2 rồi -2. Vật đổi chỗ khi reload, không tự đi.
  return cube;
}

export default function Exercise() { return <VanillaScene createSubject={createSubject} />; }
