'use client'; // 1. Bắt buộc để chạy được ở phía Client (trình duyệt)

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Bai1() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current; // lấy thẻ canvas
    if (!canvas) return; // nếu không có canvas thì return

    // 1. Tạo Scene & Camera
    const scene = new THREE.Scene(); // tạo scene
    const camera = new THREE.PerspectiveCamera(
      // tạo camera
      75, // góc nhìn
      window.innerWidth / window.innerHeight, // tỷ lệ khung hình
      0.1, // điểm gần nhất thấy
      1000 // điểm xa nhất thấy
    );
    camera.position.z = 5; // lùi camera ra xa để nhìn thấy vật

    // 2. Tạo Renderer truyền trực tiếp thẻ canvas vào
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight); // điều chỉnh kích thước renderer

    // 3. Tạo hình lập phương (Mesh = Geometry + Material)
    const geometry = new THREE.BoxGeometry(1, 1, 1); // hình lập phương
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // vật liệu cơ bản màu xanh
    const cube = new THREE.Mesh(geometry, material); // tạo mesh
    scene.add(cube); // thêm mesh vào scene

    // 4. Render lần đầu
    renderer.render(scene, camera);

    // Xử lý khi resize màn hình
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight; // cập nhật tỷ lệ khung hình
      camera.updateProjectionMatrix(); // cập nhật lại ma trận chiếu
      renderer.setSize(window.innerWidth, window.innerHeight); // cập nhật kích thước
      renderer.render(scene, camera); // render lại scene
    };
    window.addEventListener('resize', handleResize); // lắng nghe sự kiện resize

    // 5. Dọn dẹp tài nguyên khi component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose(); // dọn dẹp renderer
      geometry.dispose(); // dọn dẹp geometry
      material.dispose(); // dọn dẹp material
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
