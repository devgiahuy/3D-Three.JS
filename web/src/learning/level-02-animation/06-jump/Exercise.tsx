'use client';

import * as THREE from 'three';
import VanillaScene, { type Frame } from '../../shared/VanillaScene';

const DURATION = 4;
function createSubject() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: '#38bdf8' });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(-2, 0.5, 0);
  return cube;
}

function createBackdrop() {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: '#fbbf24' });
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 2.3), material);
  bar.position.set(0, 1, 0);
  group.add(bar);
  for (const z of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1, 0.15), material);
    post.position.set(0, 0.5, z);
    group.add(post);
  }
  return group;
}

// PHẦN BẠN HỌC/SỬA: một vòm nhảy, không physics hay điều khiển gameplay.
function update(cube: THREE.Object3D, { progress }: Frame) {
  const startX = -2;
  const endX = 2;
  const groundY = 0.5;
  const jumpHeight = 1.5;
  cube.position.x = startX + (endX - startX) * progress;
  cube.position.y = groundY + jumpHeight * Math.sin(Math.PI * progress);
  // TODO: giảm jumpHeight=0.2, quan sát và giải thích vì sao có thể xuyên thanh.
}

export default function Exercise() { return <VanillaScene createSubject={createSubject} createBackdrop={createBackdrop} update={update} duration={DURATION} />; }
