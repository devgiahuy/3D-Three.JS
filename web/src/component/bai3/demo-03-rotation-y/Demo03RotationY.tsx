'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * DEMO 03 — ROTATION Y (XOAY QUANH TRỤC Y)
 * 
 * Mục đích:
 * - Quan sát vật thể chỉ xoay quanh duy nhất trục Y (Trục thẳng đứng màu XANH LÁ).
 * - Code chính trong vòng lặp animation: `box.rotation.y += 0.01;`
 * - Không xoay X hay Z (`rotation.x = 0`, `rotation.z = 0`).
 * - So sánh trực tiếp với Demo 02 (Xoay quanh trục X).
 */
export default function Demo03RotationY() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotY, setRotY] = useState('0.00');

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
    camera.position.set(2, 2, 4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Vật thể Box màu xanh lá
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshStandardMaterial({
      color: 0x22c55e, // Green
      roughness: 0.4,
    });
    const box = new THREE.Mesh(geometry, material);
    scene.add(box);

    // AxesHelper (X: Đỏ, Y: Xanh lá, Z: Xanh dương)
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    // Đèn
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(3, 3, 3);
    scene.add(directionalLight);

    let animationFrameId: number;
    let frameCounter = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // CHỈ XOAY TRỤC Y:
      // Tăng góc quay quanh trục đứng Y thêm 0.01 rad/frame
      box.rotation.y += 0.01;

      frameCounter++;
      if (frameCounter % 5 === 0) {
        setRotY(box.rotation.y.toFixed(2));
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
        <h3 style={{ margin: '0 0 8px 0', color: '#4ade80', fontSize: '16px' }}>
          Demo 03: Rotation Y
        </h3>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Code chính: <code>box.rotation.y += 0.01;</code>
        </p>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Rotation Y (rad): <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{rotY} rad</span>
        </p>
        <p style={{ margin: '4px 0', fontSize: '12px', color: '#94a3b8' }}>
          * Trục Y màu XANH LÁ thẳng đứng. Vật thể quay tròn như múa cột / chong chóng trên trục Y.
        </p>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
}
