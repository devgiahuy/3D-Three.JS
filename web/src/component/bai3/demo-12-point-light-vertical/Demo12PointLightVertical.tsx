'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * DEMO 12 — POINT LIGHT VERTICAL (CHUYỂN ĐỘNG NÂNG LÊN HẠ XUỐNG THEO TRỤC Y)
 * 
 * Mục đích:
 * - Tập trung phân tích duy nhất công thức biến đổi độ cao Y trong Bài 3:
 *   `pointLight.position.y = Math.sin(elapsedTime * 3) * 0.8 + 0.5;`
 * 
 * GIẢI THÍCH Từng Bước Toán Học:
 *   Step 1: Math.sin(t * 3)              --> Trả về dao động trong khoảng [-1.0 , +1.0]
 *   Step 2: Math.sin(t * 3) * 0.8        --> Thu hẹp biên độ xuống khoảng [-0.8 , +0.8]
 *   Step 3: Math.sin(t * 3) * 0.8 + 0.5  --> Tịnh tiến (dịch lên) +0.5 unit 
 *                                            ==> Kết quả cuối cùng: [-0.3 , +1.3]
 */
export default function Demo12PointLightVertical() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [data, setData] = useState({
    time: '0.00',
    sinVal: '0.00',
    scaled: '0.00',
    posY: '0.50',
  });

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

    // Cone cam vàng ở tâm
    const coneGeo = new THREE.ConeGeometry(1, 2, 32);
    const coneMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber
      roughness: 0.3,
    });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.y = 0;
    scene.add(cone);

    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    scene.add(floor);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // PointLight màu xanh lá lục bảo
    const pointLight = new THREE.PointLight(0x10b981, 15, 10);
    pointLight.position.set(0, 0.5, 1.5);
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

      // CÔNG THỨC TRỤC Y BÀI 3:
      const sinRaw = Math.sin(elapsedTime * 3);
      const sinScaled = sinRaw * 0.8;
      const posY = sinScaled + 0.5;

      // X và Z giữ nguyên 0 để chỉ tập trung nhìn chuyển động Y
      pointLight.position.x = 0;
      pointLight.position.z = 1.5;
      pointLight.position.y = posY;

      renderer.render(scene, camera);

      frameCounter++;
      if (frameCounter % 5 === 0) {
        setData({
          time: elapsedTime.toFixed(2),
          sinVal: sinRaw.toFixed(2),
          scaled: sinScaled.toFixed(2),
          posY: posY.toFixed(2),
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
          background: 'rgba(15, 23, 42, 0.85)',
          padding: '16px 20px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.1)',
          zIndex: 10,
          maxWidth: '420px',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0', color: '#34d399', fontSize: '16px' }}>
          Demo 12: Point Light Vertical Motion
        </h3>
        <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
          <p style={{ margin: '2px 0' }}>1. <code>sin(t * 3)</code> = {data.sinVal} (Khoảng [-1, +1])</p>
          <p style={{ margin: '2px 0' }}>2. <code>* 0.8</code> = {data.scaled} (Khoảng [-0.8, +0.8])</p>
          <p style={{ margin: '2px 0' }}>
            3. <code>+ 0.5</code> = <span style={{ color: '#34d399', fontWeight: 'bold' }}>{data.posY}</span> (Khoảng [-0.3, +1.3])
          </p>
        </div>
        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
          * Đèn di chuyển nhịp nhàng lên xuống theo trục thẳng đứng Y.
        </p>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
}
