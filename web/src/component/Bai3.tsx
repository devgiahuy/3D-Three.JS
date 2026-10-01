'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Bai3() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // State điều khiển bật/tắt 3 loại đèn để người học dễ quan sát sự khác biệt
  const [ambientOn, setAmbientOn] = useState(true);
  const [directionalOn, setDirectionalOn] = useState(true);
  const [pointOn, setPointOn] = useState(true);

  // Dùng ref để truyền trạng thái bật/tắt vào vòng lặp Three.js mà không cần re-render scene
  const lightsRef = useRef<{
    ambient?: THREE.AmbientLight;
    directional?: THREE.DirectionalLight;
    point?: THREE.PointLight;
    pointLightMesh?: THREE.Mesh;
  }>({});

  useEffect(() => {
    if (lightsRef.current.ambient) lightsRef.current.ambient.visible = ambientOn;
  }, [ambientOn]);

  useEffect(() => {
    if (lightsRef.current.directional) lightsRef.current.directional.visible = directionalOn;
  }, [directionalOn]);

  useEffect(() => {
    if (lightsRef.current.point) lightsRef.current.point.visible = pointOn;
    if (lightsRef.current.pointLightMesh) lightsRef.current.pointLightMesh.visible = pointOn;
  }, [pointOn]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Khởi tạo Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 6);
    camera.lookAt(0, 0, 0);

    // 3. Renderer (Bật hỗ trợ đổ bóng nếu cần)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ==========================================
    // 4. VẬT LIỆU MESH STANDARD MATERIAL (PBR)
    // ==========================================
    // Lưu ý: MeshStandardMaterial CẦN CÓ ÁNH SÁNG để hiển thị (nếu tắt hết đèn sẽ tối đen)

    // --- Box (Đỏ) ---
    const boxGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: 0xff3366,
      roughness: 0.3, // độ nhám (càng thấp càng bóng)
      metalness: 0.2, // độ kim loại
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.x = -2.5;
    scene.add(box);

    // --- Sphere (Xanh Ngọc) ---
    const sphereGeometry = new THREE.SphereGeometry(0.8, 64, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      roughness: 0.1, // rất bóng
      metalness: 0.6, // hiệu ứng kim loại rõ rệt
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 0;
    scene.add(sphere);

    // --- Cone (Cam Vàng) ---
    const coneGeometry = new THREE.ConeGeometry(0.8, 1.6, 32);
    const coneMaterial = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      roughness: 0.5,
      metalness: 0.1,
    });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.x = 2.5;
    scene.add(cone);

    // --- Mặt sàn (Plane) để quan sát ánh sáng tỏa ra nền ---
    const floorGeometry = new THREE.PlaneGeometry(12, 6);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    scene.add(floor);

    // ==========================================
    // 5. THÊM 3 LOẠI LIGHT VÀO SCENE
    // ==========================================

    // --- Đèn 1: AmbientLight (Ánh sáng môi trường) ---
    // Tỏa đều mọi hướng, không bóng đổ, giúp vật thể không bị đen ngòm ở vùng khuất
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // cường độ nhẹ 0.3
    scene.add(ambientLight);
    lightsRef.current.ambient = ambientLight;

    // --- Đèn 2: DirectionalLight (Ánh nắng / ánh sáng có hướng) ---
    // Các tia sáng song song, tạo tương phản sáng/tối rõ rệt
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 4);
    scene.add(directionalLight);
    lightsRef.current.directional = directionalLight;

    // --- Đèn 3: PointLight (Đèn bóng tròn / điểm sáng cục bộ) ---
    // Phát ra từ 1 điểm, cường độ giảm dần theo khoảng cách
    const pointLight = new THREE.PointLight(0xff00ff, 4, 10); // Ánh sáng màu hồng tím rực rỡ
    pointLight.position.set(0, 1, 2);
    scene.add(pointLight);
    lightsRef.current.point = pointLight;

    // Quả cầu nhỏ hiển thị vị trí của PointLight để dễ quan sát nguồn phát
    const pointHelperGeometry = new THREE.SphereGeometry(0.08, 16, 8);
    const pointHelperMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const pointLightMesh = new THREE.Mesh(pointHelperGeometry, pointHelperMaterial);
    pointLight.add(pointLightMesh);
    lightsRef.current.pointLightMesh = pointLightMesh;

    // ==========================================
    // 6. ANIMATION LOOP
    // ==========================================
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Xoay các vật thể
      box.rotation.x += 0.01;
      box.rotation.y += 0.01;

      sphere.rotation.y += 0.01;

      cone.rotation.x += 0.01;
      cone.rotation.y += 0.01;

      // Di chuyển PointLight bay lượn hình số 8 xung quanh các vật thể để thấy rõ ánh sáng cục bộ
      pointLight.position.x = Math.sin(elapsedTime * 1.5) * 3;
      pointLight.position.z = Math.cos(elapsedTime * 1.5) * 2 + 1;
      pointLight.position.y = Math.sin(elapsedTime * 3) * 0.8 + 0.5;

      renderer.render(scene, camera);
    };

    animate();

    // ==========================================
    // 7. RESIZE VÀ CLEANUP
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

      renderer.dispose();
      boxGeometry.dispose();
      boxMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      coneGeometry.dispose();
      coneMaterial.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      pointHelperGeometry.dispose();
      pointHelperMaterial.dispose();
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Bảng điều khiển bật/tắt đèn trực quan để quan sát sự khác biệt */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: '#ffffff',
          fontFamily: 'sans-serif',
          zIndex: 10,
          background: 'rgba(20, 20, 30, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '16px 20px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          maxWidth: '360px',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0', fontSize: '17px', color: '#60a5fa' }}>
          Ngày 3: StandardMaterial & 3 Loại Light
        </h3>
        <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.4' }}>
          Vật liệu <code>MeshStandardMaterial</code> cần có ánh sáng. Hãy thử bật/tắt các loại đèn bên dưới để quan sát:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={ambientOn}
              onChange={(e) => setAmbientOn(e.target.checked)}
            />
            <span><strong>AmbientLight:</strong> Ánh sáng nền đều (chống tối đen)</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={directionalOn}
              onChange={(e) => setDirectionalOn(e.target.checked)}
            />
            <span><strong>DirectionalLight:</strong> Ánh nắng chiếu xiên (tạo khối)</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={pointOn}
              onChange={(e) => setPointOn(e.target.checked)}
            />
            <span><strong>PointLight:</strong> Điểm sáng tím di chuyển (cục bộ)</span>
          </label>
        </div>

        {(!ambientOn && !directionalOn && !pointOn) && (
          <div style={{ marginTop: '12px', padding: '8px', background: '#e11d48', borderRadius: '6px', fontSize: '12px' }}>
            ⚠️ <strong>Lỗi kinh điển:</strong> Khi tắt toàn bộ đèn, StandardMaterial sẽ biến thành màn hình đen hoàn toàn!
          </div>
        )}
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
}
