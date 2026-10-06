'use client';

import * as THREE from 'three';
import VanillaScene, { type Frame } from '../../shared/VanillaScene';

const DURATION = 4; // giây: đổi thành 2 rồi 6 để so sánh
function createSubject() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: '#38bdf8' });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(-2, 0.5, 0);
  return cube;
}

// PHẦN BẠN HỌC/SỬA: progress đã được khung tính bằng elapsed / duration, giới hạn 0..1.
function update(cube: THREE.Object3D, { progress }: Frame) {
  const startX = -2;
  const endX = 2;
  cube.position.x = startX + (endX - startX) * progress;
  // TODO: đổi điểm cuối, rồi thử nội suy thêm Z bằng cùng progress.
  // Không nhân thêm delta vào công thức đã lấy theo progress.
}

export default function Exercise() { return <VanillaScene createSubject={createSubject} update={update} duration={DURATION} />; }
