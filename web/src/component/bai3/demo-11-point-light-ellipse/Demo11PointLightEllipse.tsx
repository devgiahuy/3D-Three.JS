'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * DEMO 11 — POINT LIGHT ELLIPSE (QUỸ ĐẠO HÌNH ELLIPSE CỦA BÀI 3)
 * 
 * Mục đích:
 * - Tái hiện chính xác công thức chuyển động trên mặt phẳng XZ của Bài 3:
 *   `pointLight.position.x = Math.sin(elapsedTime * 1.5) * 3;`
 *   `pointLight.position.z = Math.cos(elapsedTime * 1.5) * 2 + 1;`
 * - Giải thích tại sao ĐÂY LÀ ELLIPSE chứ không phải HÌNH TRÒN:
 *   1. Trục X nhân với 3 (Biên độ rộng = 3).
 *   2. Trục Z nhân với 2 (Biên độ hẹp = 2).
 *   3. Trục Z cộng thêm 1 (+ 1) làm dịch chuyển tâm ellipse lên phía trước z = +1.
 * - Có vẽ thêm đường Ellipse Trajectory màu vàng mỏng để nhìn thấy quỹ đạo thực tế.
 */
export default function Demo11PointLightEllipse() {
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
    camera.position.set(0, 4.5, 6.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Vật thể chính ở tâm
    const boxGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0xec4899, // Pink
      roughness: 0.2,
      metalness: 0.3,
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    scene.add(box);

    const floorGeo = new THREE.PlaneGeometry(12, 10);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    scene.add(floor);

    // Vẽ Vệt Đường Ellipse (Visual Orbit Line)
    const points: THREE.Vector3[] = [];
    for (let t = 0; t <= Math.PI * 2; t += 0.05) {
      const x = Math.sin(t) * 3;
      const z = Math.cos(t) * 2 + 1;
      points.push(new THREE.Vector3(x, 1, z));
    }
    const ellipseGeo = new THREE.BufferGeometry().setFromPoints(points);
    const ellipseMat = new THREE.LineBasicMaterial({ color: 0xfacc15 });
    const ellipseLine = new THREE.Line(ellipseGeo, ellipseMat);
    scene.add(ellipseLine);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // PointLight Hồng Tím
    const pointLight = new THREE.PointLight(0xf43f5e, 18, 12);
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

      // CÔNG THỨC HÌNH ELLIPSE BÀI 3:
      // Tốc độ góc = elapsedTime * 1.5
      // X = sin(t * 1.5) * 3 (Bán trục lớn = 3)
      // Z = cos(t * 1.5) * 2 + 1 (Bán trục nhỏ = 2, Tâm tịnh tiến Z = +1)
      pointLight.position.x = Math.sin(elapsedTime * 1.5) * 3;
      pointLight.position.z = Math.cos(elapsedTime * 1.5) * 2 + 1;
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
      boxGeo.dispose();
      boxMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      ellipseGeo.dispose();
      ellipseMat.dispose();
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
        <h3 style={{ margin: '0 0 8px 0', color: '#f43f5e', fontSize: '16px' }}>
          Demo 11: Point Light Ellipse
        </h3>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Công thức Bài 3:
        </p>
        <pre style={{ margin: '4px 0', color: '#f43f5e', fontSize: '12px' }}>
          x = Math.sin(t * 1.5) * 3;{'\n'}
          z = Math.cos(t * 1.5) * 2 + 1;
        </pre>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>
          Light X: <span style={{ color: '#ef4444' }}>{lightPos.x}</span> | Light Z: <span style={{ color: '#60a5fa' }}>{lightPos.z}</span>
        </p>
        <p style={{ margin: '4px 0', fontSize: '12px', color: '#94a3b8' }}>
          * Đường màu VÀNG biểu diễn quỹ đạo Ellipse thực tế (rộng 3 theo X, dài 2 theo Z).
        </p>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
}
