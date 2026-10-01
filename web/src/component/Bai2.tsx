'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Bai2() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Tạo Scene
    const scene = new THREE.Scene();

    // 2. Tạo Camera (Góc nhìn phối cảnh)
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 6; // Đặt camera lùi ra xa một chút để thấy đủ 3 vật thể

    // 3. Tạo Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ==========================================
    // 4. TẠO CÁC HÌNH KHỐI (Geometry + Material)
    // ==========================================

    // --- Vật 1: Hộp lập phương (Box) - Màu đỏ ---
    const boxGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff3366, wireframe: false });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.x = -2.5; // Đặt lệch sang bên trái
    scene.add(box);

    // --- Vật 2: Hình cầu (Sphere) - Màu xanh lục ---
    // SphereGeometry(bán kính, phân đoạn chiều ngang, phân đoạn chiều dọc)
    const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true }); // Bật wireframe để thấy lưới cầu
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 0; // Đặt ở chính giữa
    scene.add(sphere);

    // --- Vật 3: Hình nón (Cone) - Màu vàng cam ---
    // ConeGeometry(bán kính đáy, chiều cao, phân đoạn tròn)
    const coneGeometry = new THREE.ConeGeometry(0.8, 1.6, 32);
    const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: false });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.x = 2.5; // Đặt lệch sang bên phải
    scene.add(cone);

    // ==========================================
    // 5. ANIMATION LOOP (Tự xoay cả 3 vật thể)
    // ==========================================
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Xoay nhẹ từng vật thể để thấy rõ chiều sâu 3D
      box.rotation.x += 0.01;
      box.rotation.y += 0.01;

      sphere.rotation.y += 0.01;

      cone.rotation.x += 0.01;
      cone.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // ==========================================
    // 6. XỬ LÝ RESIZE & DỌN DẸP BỘ NHỚ
    // ==========================================
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);

      // Dispose bộ nhớ
      renderer.dispose();
      boxGeometry.dispose();
      boxMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      coneGeometry.dispose();
      coneMaterial.dispose();
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: '#ffffff',
          fontFamily: 'sans-serif',
          zIndex: 10,
          background: 'rgba(0,0,0,0.6)',
          padding: '10px 16px',
          borderRadius: '8px',
          pointerEvents: 'none',
        }}
      >
        <h3 style={{ margin: '0 0 6px 0', fontSize: '16px' }}>Ngày 2: Geometry & Material</h3>
        <p style={{ margin: 0, fontSize: '13px', opacity: 0.85 }}>
          Box (Đỏ - Trái) | Sphere (Xanh lưới - Giữa) | Cone (Cam - Phải)
        </p>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
}
