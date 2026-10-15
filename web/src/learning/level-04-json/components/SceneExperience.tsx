'use client';

import { useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import styles from '../../shared/lab.module.css';
import { useLearningTheme } from '../../shared/LearningTheme';
import type { SceneOption } from '../helpers/scene.types';
import { SceneRenderer } from './SceneRenderer';

type SceneExperienceProps = {
  scenes: SceneOption[];
};

export function SceneExperience({ scenes }: SceneExperienceProps) {
  const { isDark } = useLearningTheme();
  const [selectedSceneId, setSelectedSceneId] = useState(scenes[0]?.id ?? '');
  const selectedScene = scenes.find((scene) => scene.id === selectedSceneId) ?? scenes[0];

  if (!selectedScene) {
    return (
      <section className={styles.scene}>
        <p className={styles.error} role="alert">
          Không có scene hợp lệ để hiển thị.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.scene} aria-label="Scene dựng từ JSON">
      <label>
        <span className={styles.hint}>Chọn dữ liệu scene</span>
        <select
          className={styles.selector}
          value={selectedScene.id}
          onChange={(event) => setSelectedSceneId(event.target.value)}
        >
          {scenes.map((scene) => (
            <option key={scene.id} value={scene.id}>
              {scene.label}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.viewport}>
        <Canvas camera={{ position: [6, 5, 10], fov: 50 }}>
          <color attach="background" args={[isDark ? '#0f172a' : '#e8eef5']} />

          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 6, 3]} intensity={2} />

          <gridHelper args={[14, 14, '#64748b', '#334155']} />
          <SceneRenderer objects={selectedScene.data.objects} />

          <OrbitControls
            makeDefault
            target={[0, 0.8, 4]}
            minDistance={3}
            maxDistance={16}
            maxPolarAngle={Math.PI / 2 - 0.05}
          />
        </Canvas>
      </div>

      <div className={styles.readout} aria-label="Thông tin scene">
        <span>scene: {selectedScene.id}</span>
        <span>schema: {selectedScene.data.schemaVersion}</span>
        <span>objects: {selectedScene.data.objects.length}</span>
      </div>

      <p className={styles.hint}>
        Đổi scene chỉ thay dữ liệu đầu vào; validator, registry và renderer được tái sử dụng nguyên
        vẹn.
      </p>
    </section>
  );
}
