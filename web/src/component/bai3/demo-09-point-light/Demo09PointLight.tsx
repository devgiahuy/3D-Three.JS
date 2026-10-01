'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * DEMO 09 — POINT LIGHT (ĐÈN ĐIỂM CỤC BỘ TĨNH)
 * 
 * Mục đích:
 * - Quan sát đặc tính nguồn sáng điểm (PointLight):
 *   + Phát ra ánh sáng đều theo mọi hướng từ 1 điểm cố định (như bóng đèn tròn).
 *   + Cường độ ánh sáng giảm dần theo khoảng cách (decay/distance).
 * - Vật thể sử dụng `MeshStandardMaterial` để phản xạ ánh sáng chuẩn vật lý.
 * - PointLight giữ TĨNH tại tọa độ (2, 2, 2).
 * - Sử dụng `PointLightHelper` để trực quan hóa vị trí nguồn phát sáng.
 */
export default function Demo09PointLight() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Box gỗ nhám vừa phải
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Sky Blue
      roughness: 0.2, // Độ nhám bóng nhẹ
      metalness: 0.3,
    });
    const box = new THREE.Mesh(geometry, material);
    scene.add(box);

    // Mặt sàn tĩnh để hứng ánh sáng tỏa xuống
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.5;
    scene.add(floor);

    // 1. AmbientLight nhẹ làm sáng vùng tối bóng râm
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // 2. PointLight tỏa sáng màu vàng ấm tại (2, 2, 2)
    // PointLight(color, intensity, distance, decay)
    const pointLight = new THREE.PointLight(0xfacc15, 15, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    // Visual Debug Helper cho PointLight (Quả cầu dây thể hiện nguồn sáng)
    const lightHelper = new THREE.PointLightHelper(pointLight, 0.3);
    scene.add(lightHelper);

    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    // Render 1 lần vì không có animation
    renderer.render(scene, camera);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
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
        <h3 style={{ margin: '0 0 8px 0', color: '#facc15', fontSize: '16px' }}>
          Demo 09: Point Light (Static)
        </h3>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          PointLight Position: <code>(X: 2.0, Y: 2.0, Z: 2.0)</code>
        </p>
        <p style={{ margin: '4px 0', fontSize: '12px', color: '#94a3b8' }}>
          * Quan sát: Góc hộp gần PointLight (màu vàng) sáng và phản xạ rõ, các mặt phía sau xa nguồn sáng sẽ tối đi.
        </p>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
}
