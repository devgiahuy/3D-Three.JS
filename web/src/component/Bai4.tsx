'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * BÀI 4: HỆ TỌA ĐỘ & TRANSFORM (NGÀY 4 — ROADMAP 3D)
 *
 * Mục tiêu kiến thức:
 * 1. Hệ trục tọa độ 3D: X (Đỏ - Trái/Phải), Y (Xanh lá - Lên/Xuống), Z (Xanh dương - Trước/Sau).
 * 2. Transform: Position (vị trí), Rotation (góc xoay theo Radian), Scale (thu phóng).
 * 3. Quan hệ Cha - Con (Parent-Child Hierarchy) bằng THREE.Group.
 * 4. Bài tập: Dựng chướng ngại vật (Obstacle Hurdle) = 2 trụ đứng + 1 thanh ngang bắc qua.
 */
type CameraView = 'perspective' | 'front' | 'top' | 'side';
type TabType = 'control' | 'theory' | 'code';

export default function Bai4() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- State điều khiển Transform của CẢ CHƯỚNG NGẠI VẬT (Group Cha) ---
  const [groupPos, setGroupPos] = useState({ x: 0, y: 0, z: 0 });
  const [groupRotY, setGroupRotY] = useState(0); // độ (degrees)
  const [groupScale, setGroupScale] = useState(1);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const isAutoRotateRef = useRef(isAutoRotate);

  useEffect(() => {
    isAutoRotateRef.current = isAutoRotate;
  }, [isAutoRotate]);

  // --- State điều khiển CÁC THÀNH PHẦN CON (Children Transform) ---
  const [pillarSpacing, setPillarSpacing] = useState(3.0); // Khoảng cách giữa 2 trụ
  const [crossbarHeight, setCrossbarHeight] = useState(2.0); // Độ cao thanh ngang
  const [crossbarAngle, setCrossbarAngle] = useState(90); // Góc xoay thanh ngang (độ)

  // --- Trợ thị (Helpers) ---
  const [showAxes, setShowAxes] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showWireframe, setShowWireframe] = useState(false);

  // --- Tab thông tin giải thích ---
  const [activeTab, setActiveTab] = useState<TabType>('control');

  // Ref lưu trữ các đối tượng Three.js để update mượt mà
  const threeRefs = useRef<{
    obstacleGroup: THREE.Group | null;
    leftPillarGroup: THREE.Group | null;
    rightPillarGroup: THREE.Group | null;
    crossbarGroup: THREE.Group | null;
    crossbarMesh: THREE.Mesh | null;
    axesHelper: THREE.AxesHelper | null;
    gridHelper: THREE.GridHelper | null;
    controls: OrbitControls | null;
    camera: THREE.PerspectiveCamera | null;
    materials: THREE.MeshStandardMaterial[];
  }>({
    obstacleGroup: null,
    leftPillarGroup: null,
    rightPillarGroup: null,
    crossbarGroup: null,
    crossbarMesh: null,
    axesHelper: null,
    gridHelper: null,
    controls: null,
    camera: null,
    materials: [],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. KHỞI TẠO SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1120); // Dark theme thể thao hiện đại

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Đặt camera góc chéo phối cảnh (Perspective isometric-like view)
    camera.position.set(0, 3.2, 5.8);
    camera.lookAt(0, 1.2, 0);
    threeRefs.current.camera = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // OrbitControls: Cho phép người học xoay góc nhìn 360 độ bằng chuột
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.2, 0);
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Không lộn xuống dưới sàn
    controls.minDistance = 2;
    controls.maxDistance = 15;
    threeRefs.current.controls = controls;

    // 2. HỆ THỐNG ÁNH SÁNG (LIGHTS)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 8, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Đèn phụ dịu màu xanh tím neon tạo chiều sâu
    const fillLight = new THREE.PointLight(0x38bdf8, 8, 15);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    // 3. MẶT SÀN (FLOOR) & CÁC TRỢ THỊ (HELPERS)
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.85,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2; // Nằm ngang trục XZ
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);
    threeRefs.current.materials.push(floorMat);

    // GridHelper: Lưới ô vuông trên sàn
    const gridHelper = new THREE.GridHelper(16, 16, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = 0.001; // Cao hơn sàn một chút để tránh z-fighting
    scene.add(gridHelper);
    threeRefs.current.gridHelper = gridHelper;

    // AxesHelper: Trục tọa độ (X: Đỏ, Y: Xanh lá, Z: Xanh dương)
    const axesHelper = new THREE.AxesHelper(3.5);
    scene.add(axesHelper);
    threeRefs.current.axesHelper = axesHelper;

    // =========================================================================
    // 4. DỰNG CHƯỚNG NGẠI VẬT (OBSTACLE) = 2 TRỤ + 1 THANH NGANG BẰNG TRANSFORM
    // =========================================================================

    // --- GROUP CHA: Chứa toàn bộ chướng ngại vật ---
    const obstacleGroup = new THREE.Group();
    scene.add(obstacleGroup);
    threeRefs.current.obstacleGroup = obstacleGroup;

    // Tạo các Material chuẩn phong cách chướng ngại vật thể thao (Obstacle Course)
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Xanh thể thao (Cyan Blue)
      roughness: 0.3,
      metalness: 0.4,
    });
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Đế cao su đen xám vững chắc
      roughness: 0.6,
      metalness: 0.2,
    });
    const crossbarMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Màu cam vàng nổi bật
      roughness: 0.2,
      metalness: 0.3,
    });
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Vạch sọc trắng phản quang
      roughness: 0.2,
      metalness: 0.1,
    });
    threeRefs.current.materials.push(pillarMat, baseMat, crossbarMat, stripeMat);

    // --- HÀM TẠO 1 TRỤ ĐỨNG (GỒM THÂN TRỤ + ĐẾ + MŨ TRỤ) ---
    const createPillar = () => {
      const pGroup = new THREE.Group();

      // Thân trụ hình Cylinder: cao 2.4, bán kính 0.12
      // Lưu ý: Tâm của Cylinder nằm ở giữa chiều cao của nó!
      // Do đó để chân trụ chạm sàn (y = 0), ta phải dịch: position.y = chiều cao / 2 = 1.2
      const pillarGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.4, 32);
      const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat);
      pillarMesh.position.y = 1.2;
      pillarMesh.castShadow = true;
      pillarMesh.receiveShadow = true;
      pGroup.add(pillarMesh);

      // Đế trụ cao su (Base): Dày 0.1, bán kính 0.35
      const baseGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.1, 32);
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.05; // Đặt nằm sát sàn
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      pGroup.add(baseMesh);

      // Mũ chụp đầu trụ (Cap): bán kính 0.14, cao 0.08
      const capGeo = new THREE.CylinderGeometry(0.15, 0.13, 0.08, 32);
      const capMesh = new THREE.Mesh(capGeo, baseMat);
      capMesh.position.y = 2.44;
      pGroup.add(capMesh);

      return pGroup;
    };

    // --- TRỤ 1: TRỤ TRÁI (LEFT PILLAR) ---
    const leftPillarGroup = createPillar();
    leftPillarGroup.position.set(-1.5, 0, 0); // Đặt lệch sang bên trái theo trục X
    obstacleGroup.add(leftPillarGroup);
    threeRefs.current.leftPillarGroup = leftPillarGroup;

    // --- TRỤ 2: TRỤ PHẢI (RIGHT PILLAR) ---
    const rightPillarGroup = createPillar();
    rightPillarGroup.position.set(1.5, 0, 0); // Đặt lệch sang bên phải theo trục X
    obstacleGroup.add(rightPillarGroup);
    threeRefs.current.rightPillarGroup = rightPillarGroup;

    // --- THANH NGANG (CROSSBAR) ---
    // Thanh xà ngang dài 3.6 bắc ngang 2 trụ (khoảng cách 3.0 + nhô ra 2 bên mỗi bên 0.3)
    const crossbarGroup = new THREE.Group();

    // Mặc định CylinderGeometry trong Three.js dựng đứng dọc theo trục Y.
    // ĐỂ NÓ NẰM NGANG SONG SONG TRỤC X: Ta dùng Transform -> rotation.z = Math.PI / 2 (xoay 90 độ)!
    const barLength = 3.6;
    const barGeo = new THREE.CylinderGeometry(0.09, 0.09, barLength, 32);
    const crossbarMesh = new THREE.Mesh(barGeo, crossbarMat);
    crossbarMesh.rotation.z = Math.PI / 2; // PHÉP TRANSFORM QUAN TRỌNG: Quay từ đứng sang ngang!
    crossbarMesh.castShadow = true;
    crossbarGroup.add(crossbarMesh);
    threeRefs.current.crossbarMesh = crossbarMesh;

    // Thêm các vạch phản quang trên thanh ngang tạo kiểu chướng ngại vật điền kinh
    const stripeGeo = new THREE.CylinderGeometry(0.092, 0.092, 0.35, 32);
    const stripe1 = new THREE.Mesh(stripeGeo, stripeMat);
    stripe1.rotation.z = Math.PI / 2;
    stripe1.position.x = -0.7;
    crossbarGroup.add(stripe1);

    const stripe2 = new THREE.Mesh(stripeGeo, stripeMat);
    stripe2.rotation.z = Math.PI / 2;
    stripe2.position.x = 0.7;
    crossbarGroup.add(stripe2);

    // Đặt thanh ngang ở độ cao y = 2.0 (gần đỉnh 2 trụ)
    crossbarGroup.position.set(0, 2.0, 0);
    obstacleGroup.add(crossbarGroup);
    threeRefs.current.crossbarGroup = crossbarGroup;

    // =========================================================================
    // 5. ANIMATION & RENDER LOOP
    // =========================================================================
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      // Nếu bật chế độ Auto-Rotate thì tự động xoay toàn bộ chướng ngại vật
      if (threeRefs.current.obstacleGroup) {
        if (isAutoRotateRef.current) {
          threeRefs.current.obstacleGroup.rotation.y += delta * 0.8;
          // Cập nhật giá trị hiển thị trên UI
          setGroupRotY(
            Math.round(THREE.MathUtils.radToDeg(threeRefs.current.obstacleGroup.rotation.y) % 360)
          );
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // =========================================================================
    // 6. XỬ LÝ RESIZE & CLEANUP
    // =========================================================================
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // =========================================================================
  // EFFECT: ĐỒNG BỘ CÁC THAM SỐ TƯƠNG TÁC TỪ REACT VÀO THREE.JS MESH/GROUP
  // =========================================================================

  // 1. Cập nhật Group Transform (Position, Rotation, Scale của chướng ngại vật)
  useEffect(() => {
    const group = threeRefs.current.obstacleGroup;
    if (!group) return;

    group.position.set(groupPos.x, groupPos.y, groupPos.z);
    if (!isAutoRotate) {
      group.rotation.y = THREE.MathUtils.degToRad(groupRotY);
    }
    group.scale.set(groupScale, groupScale, groupScale);
  }, [groupPos, groupRotY, groupScale, isAutoRotate]);

  // 2. Cập nhật khoảng cách 2 trụ (Pillar Spacing)
  useEffect(() => {
    const left = threeRefs.current.leftPillarGroup;
    const right = threeRefs.current.rightPillarGroup;
    const bar = threeRefs.current.crossbarMesh;
    if (!left || !right || !bar) return;

    // Dịch chuyển 2 trụ đối xứng qua trục Y
    left.position.x = -pillarSpacing / 2;
    right.position.x = pillarSpacing / 2;

    // Tự động scale chiều dài thanh ngang tương ứng
    const newBarLength = pillarSpacing + 0.6;
    bar.scale.y = newBarLength / 3.6; // Scale trục Y của Cylinder ban đầu
  }, [pillarSpacing]);

  // 3. Cập nhật độ cao & góc xoay thanh ngang (Crossbar Transform)
  useEffect(() => {
    const crossbarGroup = threeRefs.current.crossbarGroup;
    if (!crossbarGroup) return;

    crossbarGroup.position.y = crossbarHeight;
    // Góc xoay: 90 độ (PI/2) là nằm ngang hoàn hảo. Cho phép người học thử nghiệm từ 0 (đứng dọc) đến 90 (nằm ngang)
    crossbarGroup.rotation.z = THREE.MathUtils.degToRad(crossbarAngle - 90);
  }, [crossbarHeight, crossbarAngle]);

  // 4. Bật/Tắt Helpers & Wireframe
  useEffect(() => {
    if (threeRefs.current.axesHelper) {
      threeRefs.current.axesHelper.visible = showAxes;
    }
    if (threeRefs.current.gridHelper) {
      threeRefs.current.gridHelper.visible = showGrid;
    }
    threeRefs.current.materials.forEach((mat) => {
      mat.wireframe = showWireframe;
    });
  }, [showAxes, showGrid, showWireframe]);

  // Các preset góc nhìn camera nhanh
  const setCameraView = (view: CameraView) => {
    const camera = threeRefs.current.camera;
    const controls = threeRefs.current.controls;
    if (!camera || !controls) return;

    if (view === 'perspective') {
      camera.position.set(0, 3.2, 5.8);
      controls.target.set(0, 1.2, 0);
    } else if (view === 'front') {
      camera.position.set(0, 1.5, 6);
      controls.target.set(0, 1.2, 0);
    } else if (view === 'top') {
      camera.position.set(0, 7.5, 0.001);
      controls.target.set(0, 0, 0);
    } else if (view === 'side') {
      camera.position.set(6, 1.5, 0);
      controls.target.set(0, 1.2, 0);
    }
    controls.update();
  };

  const handleReset = () => {
    setGroupPos({ x: 0, y: 0, z: 0 });
    setGroupRotY(0);
    setGroupScale(1);
    setIsAutoRotate(false);
    setPillarSpacing(3.0);
    setCrossbarHeight(2.0);
    setCrossbarAngle(90);
    setCameraView('perspective');
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#0b1120',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 3D Canvas */}
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* HEADER / TIÊU ĐỀ BÀI HỌC */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 20,
          zIndex: 10,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '14px',
          padding: '14px 20px',
          maxWidth: '420px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
          color: '#f8fafc',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span
            style={{
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              color: '#0f172a',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '800',
              letterSpacing: '0.5px',
            }}
          >
            NGÀY 4
          </span>
          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#e2e8f0' }}>
            Hệ Tọa Độ & Transform 3D
          </h2>
        </div>
        <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#94a3b8', lineHeight: '1.4' }}>
          Bài tập: Dựng 1 <strong>&quot;chướng ngại vật&quot;</strong> = 2 trụ + 1 thanh ngang bằng{' '}
          <code
            style={{
              color: '#38bdf8',
              background: '#1e293b',
              padding: '1px 5px',
              borderRadius: '4px',
            }}
          >
            transform
          </code>{' '}
          &amp;{' '}
          <code
            style={{
              color: '#a855f7',
              background: '#1e293b',
              padding: '1px 5px',
              borderRadius: '4px',
            }}
          >
            THREE.Group
          </code>
          .
        </p>

        {/* Chú thích trục tọa độ trực quan */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(30, 41, 59, 0.7)',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        >
          <span style={{ fontWeight: '600', color: '#cbd5e1' }}>Hệ trục tọa độ:</span>
          <span style={{ color: '#ef4444', fontWeight: 'bold' }}>● X (Đỏ): Ngang</span>
          <span style={{ color: '#22c55e', fontWeight: 'bold' }}>● Y (Xanh lá): Cao</span>
          <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>● Z (Xanh dương): Sâu</span>
        </div>
      </div>

      {/* GÓC NHÌN CAMERA PRESETS (FLOATING BUTTONS) */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 20,
          zIndex: 10,
          display: 'flex',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '6px 10px',
          borderRadius: '12px',
        }}
      >
        <span
          style={{
            color: '#94a3b8',
            fontSize: '12px',
            alignSelf: 'center',
            marginRight: '4px',
            fontWeight: '600',
          }}
        >
          Góc nhìn:
        </span>
        {(
          [
            { key: 'perspective', label: '3D Tự do' },
            { key: 'front', label: 'Chính diện' },
            { key: 'top', label: 'Từ trên (Top)' },
            { key: 'side', label: 'Cạnh bên' },
          ] as const
        ).map((v) => (
          <button
            key={v.key}
            onClick={() => setCameraView(v.key)}
            style={{
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = '#38bdf8')}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = '#334155')}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* BẢNG ĐIỀU KHIỂN & HỌC TẬP (RIGHT SIDEBAR) */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 20,
          bottom: 24,
          width: '390px',
          zIndex: 10,
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
          color: '#f8fafc',
          overflowY: 'auto',
        }}
      >
        {/* TAB BUTTONS */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            marginBottom: '16px',
            background: '#1e293b',
            padding: '4px',
            borderRadius: '10px',
          }}
        >
          {(
            [
              { id: 'control', label: '⚙️ Điều Khiển' },
              { id: 'theory', label: '📖 Lý Thuyết' },
              { id: 'code', label: '💻 Mã Nguồn' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px 4px',
                fontSize: '12px',
                fontWeight: '600',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                background: activeTab === tab.id ? '#38bdf8' : 'transparent',
                color: activeTab === tab.id ? '#0f172a' : '#94a3b8',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: INTERACTIVE CONTROL PANEL */}
        {activeTab === 'control' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
            {/* NHÓM 1: CẢ CHƯỚNG NGẠI VẬT (GROUP TRANSFORM) */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '12px',
                padding: '12px 14px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <span style={{ fontWeight: '700', color: '#38bdf8' }}>
                  1. Group Cha (Toàn Bộ Vật Thể)
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#94a3b8',
                    background: '#0f172a',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  obstacleGroup
                </span>
              </div>

              {/* Vị trí X */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Position X (Trái ↔ Phải):</span>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>
                    {groupPos.x.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="0.1"
                  value={groupPos.x}
                  onChange={(e) => setGroupPos({ ...groupPos, x: parseFloat(e.target.value) })}
                  style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                />
              </div>

              {/* Vị trí Z */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Position Z (Trước ↔ Sau):</span>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>
                    {groupPos.z.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="0.1"
                  value={groupPos.z}
                  onChange={(e) => setGroupPos({ ...groupPos, z: parseFloat(e.target.value) })}
                  style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                />
              </div>

              {/* Xoay quanh trục Y (Radian / Độ) */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Rotation Y (Xoay cả chướng ngại vật):</span>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                    {groupRotY}° ({THREE.MathUtils.degToRad(groupRotY).toFixed(2)} rad)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  disabled={isAutoRotate}
                  value={groupRotY}
                  onChange={(e) => setGroupRotY(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: '#f59e0b',
                    cursor: isAutoRotate ? 'not-allowed' : 'pointer',
                  }}
                />
              </div>

              {/* Nút Auto-Rotate để thấy rõ: Cha xoay thì con xoay theo */}
              <button
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '7px',
                  background: isAutoRotate ? '#f43f5e' : '#1e293b',
                  color: isAutoRotate ? '#ffffff' : '#38bdf8',
                  border: '1px solid ' + (isAutoRotate ? '#f43f5e' : '#38bdf8'),
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {isAutoRotate ? '⏹ Dừng Xoay Tự Động' : '🔄 Auto-Rotate Demo (Cha xoay → Con xoay)'}
              </button>

              {/* Scale cả Group */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Scale (Thu phóng kích thước):</span>
                  <span style={{ color: '#a855f7', fontWeight: 'bold' }}>
                    {groupScale.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.6"
                  step="0.05"
                  value={groupScale}
                  onChange={(e) => setGroupScale(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#a855f7', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* NHÓM 2: BIẾN ĐỔI THÀNH PHẦN CON (CHILDREN TRANSFORM) */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '12px',
                padding: '12px 14px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <span style={{ fontWeight: '700', color: '#f59e0b' }}>
                  2. Thành Phần Con (2 Trụ + Thanh Ngang)
                </span>
              </div>

              {/* Khoảng cách 2 trụ */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Khoảng cách 2 trụ (X spacing):</span>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>
                    {pillarSpacing.toFixed(1)}m
                  </span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="5.0"
                  step="0.1"
                  value={pillarSpacing}
                  onChange={(e) => setPillarSpacing(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                />
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Trụ Trái: x = -{(pillarSpacing / 2).toFixed(2)} | Trụ Phải: x = +
                  {(pillarSpacing / 2).toFixed(2)}
                </div>
              </div>

              {/* Độ cao thanh ngang */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Độ cao thanh ngang (Position Y):</span>
                  <span style={{ color: '#22c55e', fontWeight: 'bold' }}>
                    {crossbarHeight.toFixed(2)}m
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.35"
                  step="0.05"
                  value={crossbarHeight}
                  onChange={(e) => setCrossbarHeight(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#22c55e', cursor: 'pointer' }}
                />
              </div>

              {/* Phép xoay thanh ngang: Trọng tâm bài học */}
              <div style={{ marginBottom: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Góc xoay thanh ngang (Rotation Z):</span>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{crossbarAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="1"
                  value={crossbarAngle}
                  onChange={(e) => setCrossbarAngle(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
                />
                <div
                  style={{
                    fontSize: '11px',
                    color: '#94a3b8',
                    marginTop: '2px',
                    lineHeight: '1.3',
                  }}
                >
                  {crossbarAngle === 90 ? (
                    <span style={{ color: '#22c55e' }}>
                      ✓ 90° (π/2 rad): Nằm ngang chuẩn bắc qua 2 trụ.
                    </span>
                  ) : (
                    <span style={{ color: '#f43f5e' }}>
                      Cylinder mặc định đứng dọc (0°). Kéo đến 90° để nằm ngang!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* NHÓM 3: BẬT TẮT TIỆN ÍCH QUAN SÁT */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.4)',
                borderRadius: '10px',
                padding: '10px 12px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                <input
                  type="checkbox"
                  checked={showAxes}
                  onChange={(e) => setShowAxes(e.target.checked)}
                  style={{ accentColor: '#38bdf8' }}
                />
                Trục Axes (X/Y/Z)
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  style={{ accentColor: '#38bdf8' }}
                />
                Lưới sàn (Grid)
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                <input
                  type="checkbox"
                  checked={showWireframe}
                  onChange={(e) => setShowWireframe(e.target.checked)}
                  style={{ accentColor: '#38bdf8' }}
                />
                Wireframe
              </label>
            </div>

            {/* NÚT RESET */}
            <button
              onClick={handleReset}
              style={{
                padding: '9px',
                background: '#334155',
                color: '#e2e8f0',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#475569')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#334155')}
            >
              ↺ Đặt lại thông số ban đầu
            </button>
          </div>
        )}

        {/* TAB 2: GIẢI THÍCH LÝ THUYẾT BÀI 4 */}
        {activeTab === 'theory' && (
          <div
            style={{
              fontSize: '12.5px',
              color: '#cbd5e1',
              lineHeight: '1.6',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                padding: '10px 12px',
                borderRadius: '10px',
              }}
            >
              <h4 style={{ margin: '0 0 6px 0', color: '#38bdf8', fontSize: '14px' }}>
                1. Hệ Trục Tọa Độ (Coordinate Axes)
              </h4>
              <p style={{ margin: 0 }}>
                Three.js sử dụng hệ tọa độ bàn tay phải (Right-handed Coordinate System):
                <br />• <strong>Trục X (Đỏ)</strong>: Trái (-) sang Phải (+)
                <br />• <strong>Trục Y (Xanh lá)</strong>: Dưới (-) lên Trên (+)
                <br />• <strong>Trục Z (Xanh dương)</strong>: Sau (-) ra Trước hướng vào mắt người
                xem (+)
              </p>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                padding: '10px 12px',
                borderRadius: '10px',
              }}
            >
              <h4 style={{ margin: '0 0 6px 0', color: '#f59e0b', fontSize: '14px' }}>
                2. Góc Xoay Tính Bằng Radian
              </h4>
              <p style={{ margin: 0 }}>
                Góc xoay trong Three.js <strong>không dùng độ (degrees)</strong> mà dùng{' '}
                <strong>Radian</strong>:
                <br />
                <code style={{ color: '#f59e0b' }}>180° = Math.PI rad ≈ 3.14159</code>
                <br />
                <code style={{ color: '#f59e0b' }}>90° = Math.PI / 2 rad ≈ 1.5708</code>
                <br />
                Để đổi độ sang radian: <br />
                <code style={{ color: '#38bdf8' }}>THREE.MathUtils.degToRad(degrees)</code>
              </p>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                padding: '10px 12px',
                borderRadius: '10px',
              }}
            >
              <h4 style={{ margin: '0 0 6px 0', color: '#a855f7', fontSize: '14px' }}>
                3. Quan Hệ Cha - Con (THREE.Group)
              </h4>
              <p style={{ margin: 0 }}>
                Nếu không dùng Group, khi muốn di chuyển hoặc xoay cả chướng ngại vật bạn phải cộng
                trừ tọa độ từng cây trụ và thanh ngang.
                <br />
                Bằng cách gom vào <strong>THREE.Group</strong>:
                <br />• Tọa độ của các trụ là <strong>tọa độ cục bộ (Local)</strong> so với Group.
                <br />• Khi xoay hoặc dịch chuyển Group cha, toàn bộ các con tự động giữ nguyên vị
                trí tương đối và xoay theo!
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: MẪU CODE CHÍNH */}
        {activeTab === 'code' && (
          <div
            style={{
              fontSize: '11.5px',
              fontFamily: 'monospace',
              color: '#e2e8f0',
              background: '#020617',
              padding: '12px',
              borderRadius: '10px',
              overflowX: 'auto',
              lineHeight: '1.5',
            }}
          >
            <pre style={{ margin: 0 }}>
              {`// 1. Tạo Group Cha
const obstacleGroup = new THREE.Group();

// 2. Tạo Trụ Trái & Trụ Phải (Cylinder đứng)
const pillarGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.4, 32);
const leftPillar = new THREE.Mesh(pillarGeo, mat);
leftPillar.position.set(-1.5, 1.2, 0); // y = cao/2

const rightPillar = new THREE.Mesh(pillarGeo, mat);
rightPillar.position.set(1.5, 1.2, 0);

// 3. Tạo Thanh Ngang (Xoay 90° quanh trục Z)
const barGeo = new THREE.CylinderGeometry(0.09, 0.09, 3.6, 32);
const crossbar = new THREE.Mesh(barGeo, barMat);
// Cylinder mặc định đứng dọc Y -> Xoay sang ngang X:
crossbar.rotation.z = Math.PI / 2;
crossbar.position.set(0, 2.0, 0); // Đặt ở độ cao 2m

// 4. Gom cả 3 vào Group cha
obstacleGroup.add(leftPillar);
obstacleGroup.add(rightPillar);
obstacleGroup.add(crossbar);
scene.add(obstacleGroup);

// 5. Khi biến đổi Group cha -> Cả 3 con biến đổi theo
obstacleGroup.rotation.y += 0.01;`}
            </pre>
          </div>
        )}

        {/* FOOTER INFO */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '11px',
            color: '#64748b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Dùng chuột trái để xoay 3D, lăn chuột để zoom</span>
        </div>
      </div>
    </div>
  );
}
