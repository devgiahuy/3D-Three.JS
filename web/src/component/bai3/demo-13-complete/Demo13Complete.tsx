'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * DEMO 13 — COMPLETE DEMO (TỔNG HỢP CÁC KỸ THUẬT BÀI 3)
 * 
 * Sau khi đã học độc lập từ Demo 01 đến Demo 12:
 * 1. Demo 01-04: Tạo khối 3D & Xoay các trục (rotation.x, rotation.y, rotation.x+y)
 * 2. Demo 05-06: Vòng lặp requestAnimationFrame & Đếm thời gian elapsedTime
 * 3. Demo 07-08: Hàm lượng giác Math.sin() và Math.cos()
 * 4. Demo 09-12: Nguồn sáng điểm PointLight & Quỹ đạo bay 3D (Circle, Ellipse, Vertical)
 * 
 * Demo 13 này gộp toàn bộ logic của Bài 3 với comment giải thích rõ ràng từng phần.
 */
export default function Demo13Complete() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [debug, setDebug] = useState({
    time: '0.00',
    lightX: '0.00',
    lightY: '0.50',
    lightZ: '1.00',
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ==========================================
    // 1. KHỞI TẠO SCENE, CAMERA, RENDERER
    // ==========================================
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ==========================================
    // 2. TẠO CÁC VẬT THỂ (OBJECTS)
    // ==========================================
    // --- Box (Đỏ) ---
    const boxGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3, metalness: 0.2 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.x = -2.5;
    scene.add(box);

    // --- Sphere (Xanh Ngọc) ---
    const sphereGeo = new THREE.SphereGeometry(0.8, 64, 32);
    const sphereMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.1, metalness: 0.6 });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.x = 0;
    scene.add(sphere);

    // --- Cone (Cam Vàng) ---
    const coneGeo = new THREE.ConeGeometry(0.8, 1.6, 32);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5, metalness: 0.1 });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.x = 2.5;
    scene.add(cone);

    // --- Mặt sàn (Floor) ---
    const floorGeo = new THREE.PlaneGeometry(12, 6);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    scene.add(floor);

    // ==========================================
    // 3. THÊM ÁNH SÁNG (LIGHTS)
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 4);
    scene.add(directionalLight);

    // PointLight Hồng Tím bay lượn 3D
    const pointLight = new THREE.PointLight(0xd946ef, 15, 10);
    pointLight.position.set(0, 1, 2);
    scene.add(pointLight);

    // Visual Helpers
    const lightHelper = new THREE.PointLightHelper(pointLight, 0.2);
    scene.add(lightHelper);

    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    // ==========================================
    // 4. ANIMATION LOOP VỚI ĐẦY ĐỦ LOGIC BÀI 3
    // ==========================================
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let frameCounter = 0;

    const animate = () => {
      // 1. requestAnimationFrame: Tiếp tục đăng ký vòng lặp
      animationFrameId = requestAnimationFrame(animate);

      // 2. elapsedTime: Lấy tổng số giây đã trôi qua
      const elapsedTime = clock.getElapsedTime();

      // 3. Object Rotation: Xoay các vật thể theo các trục đã học
      box.rotation.x += 0.01; // Xoay X + Y (Demo 04)
      box.rotation.y += 0.01;

      sphere.rotation.y += 0.01; // Xoay Y (Demo 03)

      cone.rotation.x += 0.01; // Xoay X + Y (Demo 04)
      cone.rotation.y += 0.01;

      // 4. Sin/Cos & PointLight Movement: Quỹ đạo bay 3D hình số 8
      // Trục X (Sin) + Trục Z (Cos) với biên độ khác nhau -> Ellipse (Demo 10 & 11)
      pointLight.position.x = Math.sin(elapsedTime * 1.5) * 3;
      pointLight.position.z = Math.cos(elapsedTime * 1.5) * 2 + 1;

      // Trục Y (Sin với tần số gấp đôi) -> Nhấp nhô hình sóng đứng (Demo 12)
      pointLight.position.y = Math.sin(elapsedTime * 3) * 0.8 + 0.5;

      // 5. Render Scene
      renderer.render(scene, camera);

      frameCounter++;
      if (frameCounter % 5 === 0) {
        setDebug({
          time: elapsedTime.toFixed(2),
          lightX: pointLight.position.x.toFixed(2),
          lightY: pointLight.position.y.toFixed(2),
          lightZ: pointLight.position.z.toFixed(2),
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
      boxGeo.dispose();
      boxMat.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      coneGeo.dispose();
      coneMat.dispose();
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
          background: 'rgba(15, 23, 42, 0.88)',
          padding: '16px 20px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.15)',
          zIndex: 10,
          maxWidth: '380px',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0', color: '#e879f9', fontSize: '16px' }}>
          Demo 13: Complete Bai 3
        </h3>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Elapsed Time: <span style={{ color: '#e879f9', fontWeight: 'bold' }}>{debug.time}s</span>
        </p>
        <div style={{ fontSize: '12px', color: '#cbd5e1', margin: '6px 0' }}>
          PointLight Position:
          <br />
          X: <span style={{ color: '#ef4444' }}>{debug.lightX}</span> | Y: <span style={{ color: '#22c55e' }}>{debug.lightY}</span> | Z: <span style={{ color: '#60a5fa' }}>{debug.lightZ}</span>
        </div>
        <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
          * Tất cả 12 kỹ thuật đơn lẻ đã được kết hợp mượt mà vào vòng lặp animate() hoàn chỉnh!
        </p>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
}
