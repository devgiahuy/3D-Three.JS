'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * DEMO 04 — ROTATION X + Y (XOAY ĐỒNG THỜI TRỤC X VÀ TRỤC Y)
 * 
 * Mục đích:
 * - Quan sát sự kết hợp khi vật thể vừa xoay gật đầu (X) vừa xoay tròn (Y).
 * - Code chính:
 *   `box.rotation.x += 0.01;`
 *   `box.rotation.y += 0.01;`
 * - Giúp phân biệt rõ sự khác biệt giữa xoay 1 trục đơn lẻ và xoay kết hợp 2 trục 3D.
 */
export default function Demo04RotationXY() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rot, setRot] = useState({ x: '0.00', y: '0.00' });

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

    // Box màu vàng cam
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber
      roughness: 0.3,
    });
    const box = new THREE.Mesh(geometry, material);
    scene.add(box);

    // AxesHelper (X: Red, Y: Green, Z: Blue)
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(3, 3, 3);
    scene.add(directionalLight);

    let animationFrameId: number;
    let frameCounter = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // XOAY ĐỒNG THỜI CẢ 2 TRỤC X VÀ Y:
      box.rotation.x += 0.01; // Xoay quanh trục X
      box.rotation.y += 0.01; // Xoay quanh trục Y

      frameCounter++;
      if (frameCounter % 5 === 0) {
        setRot({
          x: box.rotation.x.toFixed(2),
          y: box.rotation.y.toFixed(2),
        });
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
        <h3 style={{ margin: '0 0 8px 0', color: '#fbbf24', fontSize: '16px' }}>
          Demo 04: Rotation X + Y
        </h3>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Code chính:
        </p>
        <pre style={{ margin: '4px 0', color: '#fbbf24', fontSize: '12px' }}>
          box.rotation.x += 0.01;{'\n'}
          box.rotation.y += 0.01;
        </pre>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Rot X: <span style={{ color: '#ef4444' }}>{rot.x}</span> | Rot Y: <span style={{ color: '#22c55e' }}>{rot.y}</span>
        </p>
        <p style={{ margin: '4px 0', fontSize: '12px', color: '#94a3b8' }}>
          * Nhìn rõ sự kết hợp: Khối lập phương xoay chéo tự nhiên trong không gian 3D.
        </p>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
}
