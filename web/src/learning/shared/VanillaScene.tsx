'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import styles from './lab.module.css';
import { useLearningTheme } from './LearningTheme';

export type Frame = { delta: number; elapsed: number; progress: number };
type Props = {
  createSubject: () => THREE.Object3D;
  update?: (subject: THREE.Object3D, frame: Frame) => void;
  createBackdrop?: () => THREE.Object3D;
  duration?: number;
};

// KHUNG DÙNG LẠI: bài đầu chỉ sửa công thức ở Exercise.tsx.
// Khi tới mục 9 của Guide Level 02, đọc animate() để hiểu cách gọi công thức.
export default function VanillaScene({ createSubject, update, createBackdrop, duration }: Props) {
  const { isDark } = useLearningTheme();
  const sceneRef = useRef<THREE.Scene | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resetRef = useRef<(() => void) | null>(null);
  const runningRef = useRef(false);
  const elapsedRef = useRef(0);
  const stepRef = useRef(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [readout, setReadout] = useState({ elapsed: 0, delta: 0, progress: 0, x: 0, y: 0, z: 0, angle: 0 });

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    let alive = true;
    // StrictMode và đổi bài: luôn bắt đầu từ trạng thái dừng.
    runningRef.current = false;
    elapsedRef.current = 0;
    stepRef.current = 0;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    } catch {
      // Khởi tạo WebGL là đồng bộ; gửi kết quả lỗi về UI sau bước setup.
      queueMicrotask(() => {
        if (alive) setError('Không khởi tạo được 3D. Đọc Guide và công thức của bài; thử lại trên trình duyệt hỗ trợ WebGL.');
      });
      return () => { alive = false; };
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#0f172a');
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(4, 3.8, 7);
    camera.lookAt(0, 0.9, 0);
    scene.add(new THREE.AmbientLight('#ffffff', 0.9));
    const light = new THREE.DirectionalLight('#ffffff', 2);
    light.position.set(3, 5, 4);
    scene.add(light);
    const grid = new THREE.GridHelper(10, 10, '#64748b', '#334155');
    const axes = new THREE.AxesHelper(2.5);
    scene.add(grid, axes);
    const subject = createSubject();
    scene.add(subject);
    if (createBackdrop) scene.add(createBackdrop());
    const initialPosition = subject.position.clone();
    const initialRotation = subject.quaternion.clone();
    const initialScale = subject.scale.clone();
    let previous: number | null = null;
    let requestId: number | null = null;
    let lastReadout = -Infinity;

    const read = (frame: Frame) => {
      setRunning(runningRef.current);
      setReadout({ ...frame, x: subject.position.x, y: subject.position.y, z: subject.position.z, angle: subject.rotation.y });
    };
    const reset = () => {
      runningRef.current = false;
      setRunning(false);
      elapsedRef.current = 0;
      stepRef.current = 0;
      previous = null;
      subject.position.copy(initialPosition);
      subject.quaternion.copy(initialRotation);
      subject.scale.copy(initialScale);
      update?.(subject, { delta: 0, elapsed: 0, progress: 0 });
      read({ delta: 0, elapsed: 0, progress: 0 });
    };
    resetRef.current = reset;

    // VÒNG LẶP: timestamp là ms, chuyển sang giây rồi mới dùng.
    const animate = (timestamp: number) => {
      if (!alive) return;
      const rawDelta = previous === null ? 0 : (timestamp - previous) / 1000;
      previous = timestamp; // cập nhật cả khi pause, tránh nhảy khi resume
      const requestedDelta = runningRef.current ? Math.min(rawDelta, 0.1) : stepRef.current;
      stepRef.current = 0;
      const before = elapsedRef.current;
      elapsedRef.current = duration === undefined ? before + requestedDelta : Math.min(before + requestedDelta, duration);
      const frame: Frame = {
        delta: elapsedRef.current - before,
        elapsed: elapsedRef.current,
        progress: duration === undefined ? 0 : Math.min(elapsedRef.current / duration, 1),
      };
      update?.(subject, frame); // công thức bài học nằm tại đây
      if (duration !== undefined && frame.elapsed >= duration && runningRef.current) {
        runningRef.current = false;
        setRunning(false);
      }
      renderer.render(scene, camera);
      // UI số liệu cập nhật tối đa ~5 lần/giây, không giữ tọa độ bằng React state mỗi frame.
      if (timestamp - lastReadout >= 200) {
        read(frame);
        lastReadout = timestamp;
      }
      requestId = requestAnimationFrame(animate);
    };

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const visibility = () => { previous = null; };
    const contextLost = (event: Event) => {
      event.preventDefault();
      alive = false;
      runningRef.current = false;
      setRunning(false);
      setError('Trình duyệt mất kết nối 3D. Tải lại trang hoặc đọc hướng dẫn và công thức của bài.');
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    document.addEventListener('visibilitychange', visibility);
    canvas.addEventListener('webglcontextlost', contextLost);
    resize();
    update?.(subject, { delta: 0, elapsed: 0, progress: 0 });
    requestId = requestAnimationFrame(animate);

    return () => {
      alive = false;
      runningRef.current = false;
      if (requestId !== null) cancelAnimationFrame(requestId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      canvas.removeEventListener('webglcontextlost', contextLost);
      resetRef.current = null;
      // Khung này chỉ dùng primitive sở hữu riêng, chưa dùng GLTF cache.
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        const renderable = object as THREE.Mesh;
        if (renderable.geometry) geometries.add(renderable.geometry);
        if (renderable.material) {
          const values = Array.isArray(renderable.material) ? renderable.material : [renderable.material];
          values.forEach((material) => materials.add(material));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      sceneRef.current = null;
      scene.clear();
      renderer.dispose();
    };
  }, [createSubject, update, createBackdrop, duration]);

  // Đổi màu nền scene riêng: không tạo lại object hoặc reset thời gian animation.
  useEffect(() => {
    const background = sceneRef.current?.background;
    if (background instanceof THREE.Color) background.set(isDark ? '#0f172a' : '#e8eef5');
  }, [isDark, createSubject, update, createBackdrop, duration]);

  const toggle = () => {
    if (!runningRef.current && duration !== undefined && elapsedRef.current >= duration) resetRef.current?.();
    runningRef.current = !runningRef.current;
    setRunning(runningRef.current);
  };

  return (
    <section className={styles.scene} aria-label="Scene bài tập">
      {error ? <p role="alert" className={styles.error}>{error}</p> : <div className={styles.viewport} ref={hostRef}><canvas ref={canvasRef} aria-label="Object 3D minh họa bài tập" /></div>}
      <div className={styles.controls}>
        <button onClick={toggle} disabled={Boolean(error)}>{running ? 'Tạm dừng' : 'Chạy'}</button>
        <button onClick={() => resetRef.current?.()} disabled={Boolean(error)}>Replay — về đầu</button>
        <button onClick={() => { stepRef.current += 0.25; }} disabled={running || Boolean(error) || (duration !== undefined && readout.elapsed >= duration)}>Tiến 0.25 giây</button>
      </div>
      <div className={styles.readout} aria-label="Số liệu quan sát">
        <span>elapsed: {readout.elapsed.toFixed(2)}s</span>
        <span>delta: {readout.delta.toFixed(3)}s</span>
        <span>progress: {duration === undefined ? 'không dùng' : `${Math.round(readout.progress * 100)}%`}</span>
        <span>x/y/z: {readout.x.toFixed(2)} / {readout.y.toFixed(2)} / {readout.z.toFixed(2)}</span>
        <span>góc Y: {readout.angle.toFixed(2)} rad</span>
      </div>
      <p className={styles.hint}>Dự đoán trước khi chạy. Sửa một giá trị trong file bài tập rồi quan sát. Replay đưa bài về đầu và dừng; bấm Chạy để phát lại.</p>
    </section>
  );
}
