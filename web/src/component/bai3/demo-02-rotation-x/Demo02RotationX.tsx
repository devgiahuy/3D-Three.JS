'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * DEMO 02 — ROTATION X (XOAY QUANH TRỤC X)
 * 
 * Mục đích:
 * - Quan sát vật thể chỉ xoay quanh duy nhất trục X (Trục nằm ngang màu ĐỎ).
 * - Code chính trong vòng lặp animation: `box.rotation.x += 0.01;`
 * - Giữ nguyên `rotation.y = 0` và `rotation.z = 0`.
 */
export default function Demo02RotationX() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotX, setRotX] = useState('0.00');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Khởi tạo Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111827);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(2, 2, 4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 2. Vật thể Box
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Màu đỏ nổi bật
      roughness: 0.4,
    });
    const box = new THREE.Mesh(geometry, material);
    scene.add(box);

    // 3. AxesHelper để nhìn rõ các trục tọa độ
    // Trục X = Đỏ (Red), Trục Y = Xanh lá (Green), Trục Z = Xanh dương (Blue)
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    // Ánh sáng
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(3, 3, 3);
    scene.add(directionalLight);

    // 4. ANIMATION LOOP
    let animationFrameId: number;
    let frameCounter = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // CHỈ XOAY TRỤC X:
      // Mỗi khung hình (frame), góc quay quanh trục X tăng thêm 0.01 radian (~0.57 độ)
      box.rotation.x += 0.01;

      // Cập nhật giá trị lên UI Debug mỗi 5 frames để không gây giật UI React
      frameCounter++;
      if (frameCounter % 5 === 0) {
        setRotX(box.rotation.x.toFixed(2));
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: '#ffffff',
          fontFamily: 'monospace',
          background: 'rgba(15, 23, 42, 0.85)',
          padding: '16px 20px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.1)',
          zIndex: 10,
        }}
      >
        <h3 style={{ margin: '0 0 8px 0', color: '#f87171', fontSize: '16px' }}>
          Demo 02: Rotation X
        </h3>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Code chính: <code>box.rotation.x += 0.01;</code>
        </p>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Rotation X (rad): <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{rotX} rad</span>
        </p>
        <p style={{ margin: '4px 0', fontSize: '12px', color: '#94a3b8' }}>
          * Trục X màu ĐỎ nằm ngang. Vật thể cuộn xoay quanh trục đỏ này.
        </p>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
}
