# 📌 SỔ TAY ÔN TẬP NHANH THREE.JS (BÀI 1 - 2 - 3)

---

## 🎯 BÀI 1: BỘ TỨ CỐT LÕI (Scene, Camera, Renderer, Mesh)

Để hiển thị bất kỳ thứ gì lên màn hình bằng Three.js, bạn **luôn luôn cần 4 yếu tố**:

```
[Scene] + [Mesh]  ──(được nhìn bởi)──>  [Camera]  ──(vẽ bởi)──>  [Renderer]  ──>  <canvas>
```

### 1. Scene (Không gian chứa)
- Là vũ trụ 3D chứa mọi vật thể, ánh sáng và camera.
```javascript
const scene = new THREE.Scene();
```

### 2. Camera (Góc nhìn phối cảnh - `PerspectiveCamera`)
- Mô phỏng mắt người (vật ở gần thì to, ở xa thì nhỏ).
```javascript
const camera = new THREE.PerspectiveCamera(
  fov,    // Field of View: góc nhìn (độ), thường dùng 75
  aspect, // Tỷ lệ khung hình: window.innerWidth / window.innerHeight
  near,   // Khoảng cách gần nhất nhìn thấy được (ví dụ: 0.1)
  far     // Khoảng cách xa nhất nhìn thấy được (ví dụ: 1000)
);
camera.position.z = 5; // Mặc định ở (0,0,0) nên PHẢI LÙI RA để thấy vật ở tâm
```

### 3. Renderer (Bộ vẽ)
- Vẽ những gì camera nhìn thấy trong scene lên thẻ `<canvas>`.
```javascript
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera); // Lệnh bấm máy chụp/vẽ 1 khung hình
```

### 4. Mesh (Vật thể 3D)
> **Công thức bất hủ:** `Mesh = Geometry (Bộ xương/Hình dáng) + Material (Lớp da/Bề mặt)`
```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube); // Luôn nhớ add vào scene
```

---

## 🎨 BÀI 2: GEOMETRY & MATERIAL (Hình dạng & Vật liệu)

### 1. Các Geometry (Hình khối cơ bản - `Primitives`)
| Tên Geometry | Hình dạng thực tế | Tham số cơ bản cần nhớ |
| :--- | :--- | :--- |
| `BoxGeometry` | Hộp chữ nhật / lập phương | `(width, height, depth)` |
| `SphereGeometry` | Quả cầu tròn | `(radius, widthSegments, heightSegments)` |
| `CylinderGeometry`| Hình trụ tròn | `(radiusTop, radiusBottom, height, radialSegments)` |
| `ConeGeometry` | Hình nón chóp | `(radius, height, radialSegments)` |
| `TorusGeometry` | Bánh Donut / phao bơi | `(radius, tube, radialSegments, tubularSegments)` |
| `PlaneGeometry` | Mặt phẳng 2D trong 3D | `(width, height)` |

### 2. Phân biệt 2 loại Material cơ bản
- **`MeshBasicMaterial`**:
  - Không phản ứng với ánh sáng (Flat Shading).
  - Không cần đèn trong Scene vẫn nhìn thấy màu sắc.
  - Nhược điểm: Nhìn phẳng lì, không có chiều sâu (trừ khi bật `wireframe: true`).
- **`MeshStandardMaterial`**:
  - Chuẩn vật lý PBR (*Physically Based Rendering*).
  - **Bắt buộc phải có ánh sáng (`Light`)**, nếu không sẽ bị đen hoàn toàn.
  - Hỗ trợ độ bóng bẩy qua:
    - `roughness` (độ nhám, từ `0` bóng loáng đến `1` nhám mờ).
    - `metalness` (độ kim loại, từ `0` phi kim đến `1` kim loại).

---

## 💡 BÀI 3: LIGHTS (Ánh sáng) & LỖI KINH ĐIỂN

Khi dùng vật liệu chuẩn (`MeshStandardMaterial`), phải chiếu sáng thì mắt mới thấy được vật.

### 1. Phân biệt 3 loại đèn cốt lõi
| Loại đèn | Cơ chế hoạt động | Đặc điểm nhận dạng | Sử dụng thực tế |
| :--- | :--- | :--- | :--- |
| **`AmbientLight`** | Tỏa đều từ mọi hướng | Không có vị trí cụ thể, **không tạo bóng đổ** | Làm sáng mờ nền, tránh vật bị đen kịt ở góc khuất |
| **`DirectionalLight`** | Chiếu các tia sáng song song | Giống **ánh nắng mặt trời**, tạo ranh giới sáng/tối rõ | Làm nguồn sáng chính (Key Light) tạo khối cho vật thể |
| **`PointLight`** | Phát ra từ 1 điểm tròn | Giống **bóng đèn ngủ / đom đóm**, yếu dần theo khoảng cách | Làm đèn cục bộ, hiệu ứng đuốc, đèn xe, đạn phép |

### 2. Cú pháp khai báo nhanh
```javascript
// 1. Ánh sáng môi trường
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// 2. Ánh sáng mặt trời (có vị trí chiếu xuống tâm)
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// 3. Đèn điểm (màu, cường độ, tầm chiếu xa)
const pointLight = new THREE.PointLight(0xff00ff, 3, 10);
pointLight.position.set(0, 2, 2);
scene.add(pointLight);
```

---

## ⚠️ CÁC LỖI KINH ĐIỂN CẦN TRÁNH (CHÚ Ý KHI PHỎNG VẤN / REVIEW)

1. **Màn hình đen thui (`Black screen`)**:
   - Dùng `MeshStandardMaterial` nhưng **quên add đèn (`Light`)**.
   - Quên chưa lùi camera ra sau (`camera.position.z = 5`), camera nằm lọt thỏm ngay bên trong ruột của Mesh.
   - Chưa gọi lệnh `renderer.render(scene, camera)`.
2. **Khối 3D nhìn như hình 2D phẳng lì**:
   - Camera đặt nhìn chính diện góc `(0, 0, z)` + dùng `MeshBasicMaterial`.
   - *Cách khắc phục*: Cho vật thể xoay nhẹ (`rotation.x += 0.01; rotation.y += 0.01`) hoặc đổi sang `MeshStandardMaterial` + `DirectionalLight`.
3. **Trong React / Next.js**:
   - Quên `'use client';` ở đầu file.
   - Viết code gọi `window` ngoài `useEffect` gây lỗi SSR lúc build.
   - **Rò rỉ bộ nhớ (Memory Leak)**: Quên `dispose()` geometry, material và renderer trong cleanup function của `useEffect`.

---

## 🔄 KHUNG MẪU (BOILERPLATE) CHUẨN TRONG NEXT.JS

```tsx
'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function MyScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 2. Mesh (Box)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff88, roughness: 0.2 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 3. Light
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    // 4. Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // 5. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
```
