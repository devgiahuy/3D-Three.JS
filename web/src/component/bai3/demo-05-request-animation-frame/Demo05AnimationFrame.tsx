'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * DEMO 05 — REQUEST ANIMATION FRAME (CƠ CHẾ VÒNG LẶP HOẠT HỌA)
 * 
 * Mục đích:
 * - Hiểu rõ cơ chế hoạt động của `requestAnimationFrame(animate)`.
 * - Luồng thực thi:
 *   animate()
 *     ↓
 *   requestAnimationFrame(animate)  --> Đăng ký gọi lại hàm animate ở frame tiếp theo
 *     ↓
 *   sphere.position.x += 0.01        --> Thay đổi vị trí / thuộc tính đối tượng
 *     ↓
 *   renderer.render(scene, camera)  --> Vẽ khung hình mới ra màn hình
 *     ↓
 *   (Lặp lại liên tục cho mỗi khung hình của màn hình)
 */
export default function Demo05AnimationFrame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [posX, setPosX] = useState('-3.00');

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
    camera.position.set(0, 1, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Tạo hình cầu Sphere màu tím cyan
    const geometry = new THREE.SphereGeometry(0.8, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6, // Violet
      roughness: 0.2,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = -3; // Bắt đầu ở bên trái (x = -3)
    scene.add(sphere);

    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(3, 3, 3);
    scene.add(directionalLight);

    let animationFrameId: number;
    let frameCounter = 0;

    // BƯỚC 1: Đĩnh nghĩa hàm animate()
    const animate = () => {
      // BƯỚC 2: Đăng ký với trình duyệt để tiếp tục gọi animate() ở frame sau
      animationFrameId = requestAnimationFrame(animate);

      // BƯỚC 3: Thay đổi thuộc tính của object (mỗi frame dịch sang phải 0.01 đơn vị)
      sphere.position.x += 0.01;
      if (sphere.position.x > 3) {
        sphere.position.x = -3; // Reset lại vị trí ban đầu khi đi quá lề phải
      }

      // BƯỚC 4: Vẽ lại scene với vị trí mới của sphere
      renderer.render(scene, camera);

      frameCounter++;
      if (frameCounter % 5 === 0) {
        setPosX(sphere.position.x.toFixed(2));
      }
    };

    // BƯỚC 0: Kích hoạt lần gọi đầu tiên để bắt đầu vòng lặp vô hạn
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      // Dọn dẹp: Hủy đăng ký frame khi rời trang
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
          maxWidth: '380px',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0', color: '#a78bfa', fontSize: '16px' }}>
          Demo 05: requestAnimationFrame
        </h3>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Vị trí Sphere X: <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>{posX}</span>
        </p>
        <div
          style={{
            margin: '10px 0 0 0',
            padding: '8px 12px',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '6px',
            fontSize: '11px',
            lineHeight: '1.5',
            color: '#94a3b8',
          }}
        >
          <strong>Luồng thực thi:</strong>
          <br />
          1. <code>animate()</code>
          <br />
          2. <code>requestAnimationFrame(animate)</code>
          <br />
          3. <code>sphere.position.x += 0.01</code>
          <br />
          4. <code>renderer.render(scene, camera)</code>
          <br />
          5. Chờ frame tiếp theo &rarr; Lặp lại bước 1
        </div>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
}
