'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * DEMO 10 — POINT LIGHT CIRCLE (ĐÈN CHẠY THEO QUỸ ĐẠO HÌNH TRÒN)
 * 
 * Mục đích:
 * - Hiểu cách kết hợp `sin` và `cos` cùng biên độ (bán kính R = 3) để tạo quỹ đạo HÌNH TRÒN hoàn hảo trên mặt phẳng XZ:
 *   + `pointLight.position.x = Math.sin(elapsedTime) * 3;`
 *   + `pointLight.position.z = Math.cos(elapsedTime) * 3;`
 *   + `pointLight.position.y = 1;` (Độ cao giữ cố định)
 */
export default function Demo10PointLightCircle() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lightPos, setLightPos] = useState({ x: '0.00', z: '3.00', time: '0.00' });

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
    camera.position.set(0, 4, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Vật thể trung tâm (Sphere màu tím)
    const sphereGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7, // Purple
      roughness: 0.1,
      metalness: 0.5,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // Mặt sàn
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    scene.add(floor);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // PointLight xanh ngọc
    const pointLight = new THREE.PointLight(0x06b6d4, 15, 12);
    pointLight.position.set(0, 1, 3);
    scene.add(pointLight);

    const lightHelper = new THREE.PointLightHelper(pointLight, 0.3);
    scene.add(lightHelper);

    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    const clock = new THREE.Clock();

    let animationFrameId: number;
    let frameCounter = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // CÔNG THỨC HÌNH TRÒN (Bán kính = 3):
      // x = R * sin(t)
      // z = R * cos(t)
      pointLight.position.x = Math.sin(elapsedTime) * 3;
      pointLight.position.z = Math.cos(elapsedTime) * 3;
      pointLight.position.y = 1; // Giữ nguyên độ cao Y

      renderer.render(scene, camera);

      frameCounter++;
      if (frameCounter % 5 === 0) {
        setLightPos({
          x: pointLight.position.x.toFixed(2),
          z: pointLight.position.z.toFixed(2),
          time: elapsedTime.toFixed(2),
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
      sphereGeo.dispose();
      sphereMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      lightHelper.dispose();
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
          Demo 10: Point Light Circle
        </h3>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Code chính:
        </p>
        <pre style={{ margin: '4px 0', color: '#22d3ee', fontSize: '12px' }}>
          x = Math.sin(t) * 3;{'\n'}
          z = Math.cos(t) * 3;
        </pre>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Light Pos X: <span style={{ color: '#ef4444' }}>{lightPos.x}</span> | Light Pos Z: <span style={{ color: '#60a5fa' }}>{lightPos.z}</span>
        </p>
        <p style={{ margin: '4px 0', fontSize: '12px', color: '#94a3b8' }}>
          * Biên độ bằng nhau (cùng nhân 3) &rarr; Tạo quỹ đạo HÌNH TRÒN hoàn hảo trên mặt phẳng ngang XZ.
        </p>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
}
