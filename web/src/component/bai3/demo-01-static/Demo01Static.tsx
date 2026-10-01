'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * DEMO 01 — STATIC OBJECT (VẬT THỂ TĨNH)
 * 
 * Mục đích:
 * - Hiểu cách Three.js render 1 đối tượng tĩnh.
 * - KHÔNG sử dụng requestAnimationFrame, clock, sin, cos hay rotation.
 * - Mọi thành phần cơ bản của Three.js được khởi tạo và render đúng ĐƠN LẦN.
 */
export default function Demo01Static() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. SCENE (Khung cảnh 3D)
    // Nơi chứa tất cả vật thể, đèn và camera.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111827); // Nền xám đen

    // 2. CAMERA (Góc nhìn)
    // PerspectiveCamera(FOV, AspectRatio, Near, Far)
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 4); // Đặt camera ở độ cao y=1.5, lùi lại z=4
    camera.lookAt(0, 0, 0); // Hướng camera về tâm gốc tọa độ (0,0,0)

    // 3. RENDERER (Bộ xuất hình ảnh)
    // Chuyển đổi dữ liệu 3D thành hình ảnh 2D trên HTML Canvas.
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. GEOMETRY (Hình học)
    // Tạo khung xương hình hộp kích thước 1.5 x 1.5 x 1.5
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);

    // 5. MATERIAL (Vật liệu)
    // MeshStandardMaterial phản ứng với ánh sáng (cần có Light để nhìn thấy màu)
    const material = new THREE.MeshStandardMaterial({
      color: 0x3b82f6, // Màu xanh dương (Blue)
      roughness: 0.3,  // Độ nhám (0 = cực bóng, 1 = nhám hoàn toàn)
      metalness: 0.2,  // Độ kim loại
    });

    // 6. MESH (Đối tượng 3D = Geometry + Material)
    const box = new THREE.Mesh(geometry, material);
    scene.add(box);

    // 7. LIGHTING (Ánh sáng)
    // Vì dùng MeshStandardMaterial, ta cần ánh sáng để vật thể không bị tối đen.
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Ánh sáng môi trường đều
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Ánh sáng mặt trời chiếu hướng
    directionalLight.position.set(3, 4, 3);
    scene.add(directionalLight);

    // Visual Helper: Trục tọa độ (X: Đỏ, Y: Xanh lá, Z: Xanh dương)
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    // 8. RENDERER.RENDER (Vẽ scene ra màn hình DÙNG 1 LẦN DUY NHẤT)
    // Không dùng requestAnimationFrame vì đây là demo vật thể tĩnh.
    renderer.render(scene, camera);

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera); // Render lại khi thay đổi kích thước cửa sổ
    };
    window.addEventListener('resize', handleResize);

    // Cleanup khi component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Debug Data Overlay */}
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
        <h3 style={{ margin: '0 0 8px 0', color: '#60a5fa', fontSize: '16px' }}>
          Demo 01: Static Object
        </h3>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#94a3b8' }}>
          Trạng thái: <strong>Tĩnh (Không Animation)</strong>
        </p>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#94a3b8' }}>
          Hàm render: <code>renderer.render(scene, camera)</code> chỉ gọi 1 lần.
        </p>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
}
