'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * DEMO 07 — SIN MOTION (CHUYỂN ĐỘNG DAO ĐỘNG HÀM SIN)
 * 
 * Mục đích:
 * - Tập trung quan sát duy nhất hàm `Math.sin()`.
 * - `Math.sin(time)` có đặc tính trả về giá trị dao động điều hòa trong khoảng [-1, 1].
 * - Khi nhân với 3 (`* 3`), phạm vi di chuyển mở rộng thành [-3, 3].
 * - Quỹ đạo: -3 ←────── Sphere ──────→ +3 (Đi qua đi lại liên tục mượt mà).
 */
export default function Demo07SinMotion() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [data, setData] = useState({ time: '0.00', sinVal: '0.00', posX: '0.00' });

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

    // Sphere màu hồng neon
    const geometry = new THREE.SphereGeometry(0.8, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xec4899, // Pink
      roughness: 0.2,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const axesHelper = new THREE.AxesHelper(4);
    scene.add(axesHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(3, 3, 3);
    scene.add(directionalLight);

    const clock = new THREE.Clock();

    let animationFrameId: number;
    let frameCounter = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Math.sin(t) cho giá trị từ -1 đến +1.
      // Nhân với 3 mở rộng biên độ thành từ -3 đến +3.
      const sinValue = Math.sin(elapsedTime);
      const posX = sinValue * 3;

      sphere.position.x = posX;

      renderer.render(scene, camera);

      frameCounter++;
      if (frameCounter % 5 === 0) {
        setData({
          time: elapsedTime.toFixed(2),
          sinVal: sinValue.toFixed(3),
          posX: posX.toFixed(2),
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
        <h3 style={{ margin: '0 0 8px 0', color: '#f472b6', fontSize: '16px' }}>
          Demo 07: Sin Motion
        </h3>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Công thức: <code>sphere.position.x = Math.sin(t) * 3;</code>
        </p>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Time (t): {data.time}s
        </p>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Math.sin(t): <span style={{ color: '#fb7185', fontWeight: 'bold' }}>{data.sinVal}</span> (Khoảng [-1, 1])
        </p>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Position X: <span style={{ color: '#f472b6', fontWeight: 'bold' }}>{data.posX}</span> (Khoảng [-3, 3])
        </p>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
}
