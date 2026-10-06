'use client';

import * as THREE from 'three';
import VanillaScene from '../shared/VanillaScene';

// PHẦN BẠN HỌC/SỬA: tự thêm hai trụ và thanh ngang theo Guide Level 01.
function createSubject() {
  const group = new THREE.Group();
  const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#38bdf8' }));
  cube.position.set(0, 0.5, 0);
  group.add(cube);
  // TODO 1: thay cube bằng hai trụ cao 1.5, tâm y=0.75, x=-1 và x=1.
  // TODO 2: thêm thanh ngang tâm y=1.2, gom cùng group.
  // TODO 3: đổi position/rotation của group, so sánh với đổi một mesh con.
  return group;
}

export default function Exercise() { return <VanillaScene createSubject={createSubject} />; }
