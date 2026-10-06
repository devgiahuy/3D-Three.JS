# Level 03 — Chuyển sang React Three Fiber

**Trước khi học:** Qua Level 02; hiểu React props, state, ref và cleanup cơ bản.

**Đường dẫn:** `/learn/level-03-r3f`.

## Mục tiêu

Viết lại bài đã hiểu ở Level 02 bằng R3F. R3F là React renderer cho Three.js; kiến thức mesh/position/thời gian vẫn giữ nguyên. Cú pháp tạo scene chuyển sang JSX.

## Setup khi tới level này

Ở thư mục `web`, chạy `npm install @react-three/fiber @react-three/drei`. React hiện tại là 19; chọn phiên bản R3F tương thích React 19 theo [Installation](https://r3f.docs.pmnd.rs/getting-started/installation). Không cài khi chưa hiểu Level 02.

Sửa `src/learning/level-03-r3f/Exercise.tsx`. Workspace hiện là placeholder; sau khi cài, thay bằng Client Component chứa Canvas có cha cao khoảng 420px.

## Bài 03.1 — Một cube bằng JSX

1. Tạo Canvas, ambientLight, directionalLight và mesh.
2. Đặt boxGeometry và meshStandardMaterial bên trong mesh.
3. Đổi position của mesh bằng mảng `[x,y,z]`.
4. Giải thích `args={[1,1,1]}` là đối số constructor geometry.

Gợi ý 1: không gọi `new WebGLRenderer` trong bài R3F; Canvas quản lý renderer.
Gợi ý 2: tạo component Cube riêng, render `<Cube />` bên trong Canvas.

## Bài 03.2 — Xoay qua ref

1. Tạo `useRef<THREE.Mesh>(null)` và gắn vào mesh.
2. Dùng `useFrame((state,delta)=>...)` trong Cube.
3. Cập nhật `ref.current.rotation.y += speed*delta`.
4. So sánh với bài 02-rotation: công thức giống nhau, người gọi frame khác.

Gợi ý: useFrame chỉ ở component con của Canvas. Không dùng setState để lưu góc mỗi frame.

## Bài 03.3 — A→B và pause/replay

Tái tạo bài 04-duration. UI state giữ đang chạy; ref giữ elapsed. Chỉ cộng elapsed khi chạy; replay đặt elapsed=0. Dùng delta của useFrame, không lấy clock elapsed toàn cục rồi mong nó tự pause cùng UI.

## Bài 03.4 — Camera và controls

Thêm OrbitControls, đặt giới hạn zoom và tránh lật xuống dưới sàn. Biết target là điểm nhìn. Camera tự chuyển theo step học ở Level 05.

## Checkpoint

- [ ] Scene hiện trong container có chiều cao, resize được.
- [ ] A→B chạy và pause/replay đúng như Level 02.
- [ ] Giải thích ref/state và vì sao hook nằm trong Canvas.
- [ ] Có thể chia Cube/Obstacle/Scene thành component nhỏ.

Đọc: [Basic Animations](https://r3f.docs.pmnd.rs/tutorials/basic-animations), [Pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls).
