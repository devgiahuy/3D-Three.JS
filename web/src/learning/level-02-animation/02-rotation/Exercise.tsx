'use client';

import * as THREE from 'three';
import VanillaScene, { type Frame } from '../../shared/VanillaScene';

function createSubject() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: '#38bdf8' });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.y = 0.5;
  return cube;
}

// PHẦN BẠN HỌC/SỬA: góc = tốc độ (rad/giây) × thời gian (giây).
function update(cube: THREE.Object3D, { elapsed }: Frame) {
  const speed = Math.PI / 2;
  cube.rotation.y = speed * elapsed;
  // TODO: đổi speed thành PI/4, rồi đổi trục Y thành Z.
  // Biến thể sau: dùng cube.rotation.y += speed * delta (thêm delta vào tham số).
}

export default function Exercise() { return <VanillaScene createSubject={createSubject} update={update} />; }
