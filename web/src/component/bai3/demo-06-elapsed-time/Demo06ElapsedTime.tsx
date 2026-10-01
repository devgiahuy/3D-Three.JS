'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * DEMO 06 — ELAPSED TIME (THỜI GIAN TRÔI QUA VỚI THREE.CLOCK)
 * 
 * Mục đích:
 * - Hiểu tác dụng của `THREE.Clock` và `clock.getElapsedTime()`.
 * - `getElapsedTime()` trả về số giây tăng dần đều liên tục từ 0 (0.00s, 1.25s, 3.50s,...).
 * - Gán trực tiếp vị trí X theo elapsedTime: `sphere.position.x = (elapsedTime % 6) - 3;`
 * - KHÔNG sử dụng sin() hay cos().
 */
export default function Demo06ElapsedTime() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [debugData, setDebugData] = useState({ elapsedTime: '0.00', posX: '-3.00' });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111827);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Sphere màu ngọc lam (Cyan)
    const geometry = new THREE.SphereGeometry(0.8, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x06b6d4, // Cyan
      roughness: 0.2,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(3, 3, 3);
    scene.add(directionalLight);

    // 1. Khởi tạo Đồng hồ Three.js Clock
    const clock = new THREE.Clock();

    let animationFrameId: number;
    let frameCounter = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // 2. Lấy thời gian trôi qua tính bằng giây (tăng dần 0 -> 1 -> 2 -> 3...)
      const elapsedTime = clock.getElapsedTime();

      // 3. Di chuyển vật thể theo thời gian tuyến tính (Reset vòng lặp sau mỗi 6 giây từ -3 đến +3)
      const currentX = (elapsedTime % 6) - 3;
      sphere.position.x = currentX;

      renderer.render(scene, camera);

      frameCounter++;
      if (frameCounter % 5 === 0) {
        setDebugData({
          elapsedTime: elapsedTime.toFixed(2),
          posX: currentX.toFixed(2),
        });
      }
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
        <h3 style={{ margin: '0 0 8px 0', color: '#22d3ee', fontSize: '16px' }}>
          Demo 06: Elapsed Time
        </h3>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Elapsed Time: <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>{debugData.elapsedTime}s</span>
        </p>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          X Position: <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{debugData.posX}</span>
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
          * <code>clock.getElapsedTime()</code> giúp chuyển động chạy đều theo thời gian thực (giây), không bị ảnh hưởng bởi màn hình 60Hz hay 144Hz.
        </p>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
}
