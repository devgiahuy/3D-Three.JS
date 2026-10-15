'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import styles from '../shared/lab.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

// NƠI BẠN LÀM BÀI: đọc Guide.md của Level 03, rồi thay khung này từng bước.
// Đây là starter chưa triển khai tính năng; không phải lời giải hoàn chỉnh.

const START_X = -2;
const END_X = 2;
const DURATION = 4; // seconds
const ROTATION_SPEED = Math.PI / 2; // rad/s

type CubeProps = {
  running: boolean;
  replayId: number;
  onFinish: () => void;
};

function Cube({ running, replayId, onFinish }: CubeProps) {
  const cubeRef = useRef<THREE.Mesh>(null);
  const elapsedRef = useRef(0);
  const finishedRef = useRef(false);

  useEffect(() => {
    elapsedRef.current = 0;
    finishedRef.current = false;

    if (cubeRef.current) {
      cubeRef.current.position.x = START_X;
      cubeRef.current.rotation.y = 0;
    }
  }, [replayId]);

  useFrame((_state, delta) => {
    const cube = cubeRef.current;

    if (!cube || !running || finishedRef.current) return;

    elapsedRef.current = Math.min(elapsedRef.current + delta, DURATION);

    const progress = elapsedRef.current / DURATION;
    cube.position.x = START_X + (END_X - START_X) * progress;
    cube.rotation.y += ROTATION_SPEED * delta;

    if (elapsedRef.current >= DURATION) {
      finishedRef.current = true;
      onFinish();
    }
  });

  return (
    <mesh ref={cubeRef} position={[START_X, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#38bdf8" />
    </mesh>
  );
}

export default function Exercise() {
  const [running, setRunning] = useState(true);
  const [replayId, setReplayId] = useState(0);

  const handleFinish = useCallback(() => {
    setRunning(false);
  }, []);

  const handleReplay = () => {
    setReplayId((id) => id + 1);
    setRunning(true);
  };

  return (
    <section className={styles.scene} aria-label="Bài tập React Three Fiber">
      <div className={styles.viewport}>
        <Canvas camera={{ position: [4, 3, 5], fov: 50 }}>
          <color attach="background" args={['#0f172a']} />

          <ambientLight intensity={0.8} />

          <directionalLight position={[3, 5, 4]} intensity={2} />

          <gridHelper args={[10, 10, '#64748b', '#334155']} />

          <Cube running={running} replayId={replayId} onFinish={handleFinish} />

          <OrbitControls
            makeDefault
            target={[0, 0.5, 0]} // GÓC NHÌN CỦA CAMERA QUANH VẬT
            minDistance={3} // KHOẢNG CÁCH NHỎ NHẤT
            maxDistance={9} // KHOẢNG CÁCH LỚN NHẤT
            maxPolarAngle={Math.PI / 2 - 0.05} // KHÔNG CHO CAMERA NHÌN XUỐNG DƯỚI
          />
        </Canvas>
      </div>

      <div className={styles.controls}>
        <button onClick={() => setRunning((value) => !value)}>
          {running ? 'Tạm dừng' : 'Tiếp tục'}
        </button>

        <button onClick={handleReplay}>Replay — chạy lại</button>
      </div>

      <p className={styles.hint}>Kéo chuột để xoay camera, lăn chuột để zoom.</p>
    </section>
  );
}
