# Lộ Trình Học & Triển Khai 3D — Smart Kids Activity Platform

> Tài liệu scaffold cho việc học và xây dựng phần **3D Activity Visualization** (theo `Rule_3D.md` + `Phase1_Feature_Business_Analysis.md`, mục FR-3D-\*).
>
> Bối cảnh: team 4 người, mạnh Backend, Frontend **chưa có kinh nghiệm 3D**. Mục tiêu cuối: một **renderer dùng chung** đọc `Scene Config JSON` do backend (AI→3D Mapper) sinh ra, render "Mini Obstacle Course" — và các activity khác sau này.

---

## 1. Mục Tiêu & Phạm Vi

| Mục tiêu                        | Mô tả                                                  | Liên kết                   |
| :------------------------------ | :----------------------------------------------------- | :------------------------- |
| **M0 — Demo chạy được**         | Canvas + mesh + light + OrbitControls                  | —                          |
| **M1 — Kiến thức Three.js**     | 6 khái niệm nền tảng, dựng được scene tĩnh             | —                          |
| **M2 — React Three Fiber**      | Renderer declarative + drei helpers                    | —                          |
| **M3 — Asset pipeline**         | GLB/GLTF, load, nén, nguồn asset (AI gen + free packs) | —                          |
| **M4 — Obstacle Course demo**   | Scene từ primitive, click info, animation script       | FR-3D-02/03/04/05/06       |
| **M5 — Tích hợp JSON pipeline** | Renderer đọc `Scene Config JSON` từ backend            | FR-3D-01/02, mục 8 Phase 1 |

**KHÔNG làm trong giai đoạn này** (đã loại scope): gameplay 3D thật, drag & drop tự do, snap system, physics, AI Pose/Recognition camera, Creative Workspace (Add/Rotate/Scale/Undo).

---

## 2. Nguyên Tắc Học

1. **Học bằng dựng scene, không học lý thuyết suông** — mỗi ngày phải có 1 scene chạy được trên trình duyệt.
2. **Chỉ học 20% kiến thức, dùng 80% thời gian** — 6 khái niệm ở Tuần 1 là đủ cho toàn bộ project.
3. **Gặp bí → hỏi AI + tra docs trước, rồi mới hỏi người.** R3F là code declarative pattern chuẩn nên AI trả lời rất tốt.
4. **Mỗi lỗi gặp phải → ghi vào mục 11 (Sổ lỗi)** để cả team tránh.
5. **Demo trước, làm đẹp sau** — primitive shapes trước, GLB/AI model thay vào cuối.
6. **1 người phụ trách 3D (renderer)**, các thành viên khác làm việc song song theo contract JSON — không ai phải chờ 3D.

---

## 3. Lộ Trình Tổng Thể

| Giai đoạn | Thời lượng  | Kết quả đầu ra                                                                |
| :-------- | :---------- | :---------------------------------------------------------------------------- |
| Tuần 1    | 7 ngày      | Nền tảng Three.js: scene/mesh/material/light/transform/animation              |
| Tuần 2    | 7 ngày      | R3F + drei: Canvas, useFrame, OrbitControls, useGLTF, raycast                 |
| Tuần 3    | 7 ngày      | Asset pipeline: GLB, gltfjsx, gltf-transform, nguồn asset + AI gen            |
| Tuần 4    | 7 ngày      | **Milestone M4**: Obstacle Course demo hoàn chỉnh (primitive)                 |
| Tuần 5+   | tùy tiến độ | **Milestone M5**: ghép `Scene Config JSON` + lazy load + fallback 2D + tối ưu |

> Tổng ~4–5 tuần cho 1 người tập trung. Có thể chạy song song với các sprint khác của team.

---

## 4. Tuần 1 — Nền Tảng 3D + Three.js

> Mục tiêu: hiểu và dựng được scene tĩnh + 1 animation đơn giản bằng vanilla Three.js.
> Nguồn chính: `threejs.org/manual` ("Discover Three.js"), Three.js Journey (lesson 01–13, các lesson đầu miễn phí).

### 4.1. Ngày 1 — Scene, Camera, Renderer, Mesh

- [x] Học: scene là gì (không gian chứa mọi thứ), camera nhìn thế nào, renderer vẽ lên đâu.
- [ ] Cài môi trường: Vite + `npm install three`.
- [ ] Bài tập: hiện 1 box màu ở giữa màn hình (tối thiểu: scene + camera + renderer + mesh).

### 4.2. Ngày 2 — Geometry & Material

- [ ] Học: **Mesh = Geometry (hình dạng) + Material (bề mặt)**.
- [ ] Các geometry hay dùng: `BoxGeometry`, `SphereGeometry`, `CylinderGeometry`, `ConeGeometry`, `TorusGeometry`, `PlaneGeometry`.
- [ ] Các material hay dùng: `MeshBasicMaterial` (không cần light), `MeshStandardMaterial` (cần light, realistic).
- [ ] Bài tập: dựng scene gồm box + sphere + cone, mỗi vật một màu.

### 4.3. Ngày 3 — Light (Ánh sáng)

- [ ] Học: `ambientLight` (ánh sáng nền), `directionalLight` (ánh nắng), `pointLight` (đèn cục bộ).
- [ ] Lỗi kinh điển: **màn hình đen vì thiếu light** với StandardMaterial.
- [ ] Bài tập: thay toàn bộ material basic → standard, thêm 3 loại light, quan sát khác biệt.

### 4.4. Ngày 4 — Hệ Tọa Độ & Transform

- [ ] Học: trục X/Y/Z, `position`, `rotation` (đơn vị **radian**), `scale`.
- [ ] Học: cha-con (group) — xoay group là xoay cả con.
- [ ] Bài tập: dựng 1 "chướng ngại vật" = 2 trụ + 1 thanh ngang bằng transform.

### 4.5. Ngày 5 — Animation Loop

- [ ] Học: vòng lặp render, `requestAnimationFrame` / `clock.getDelta()`.
- [ ] **Quy tắc vàng: luôn nhân với `delta`**, không dùng số cố định (tránh phụ thuộc fps).
- [ ] Bài tập: box tự xoay + di chuyển lên xuống đều nhau trên mọi máy.

### 4.6. Ngày 6–7 — Ôn tập & Mini Project

- [ ] Mini project: "Sân tập 3D" — 3 obstacle bằng primitive, có light, có camera di chuyển, 1 vật đang animation.
- [ ] Ôn lại 6 khái niệm (mục 4.1–4.5) — nếu tự dựng lại được không cần nhìn bài cũ là đạt.
- [ ] Ghi nhật ký học + sổ lỗi (mục 11).

> **Checkpoint tuần 1:** dựng lại được scene "3 obstacle + light + 1 animation" trong 30 phút không cần tài liệu.

---

## 5. Tuần 2 — React Three Fiber (R3F) + drei

> Mục tiêu: chuyển từ imperative (Three.js thuần) sang declarative (JSX), dùng được các helper của drei.
> Điều kiện tiên quyết: **React hooks** (useRef, useState, useEffect). Nếu chưa vững, dành 1 buổi ôn lại React docs.
> Nguồn chính: `r3f.docs.pmnd.rs`, Wawa Sensei course (miễn phí), Three.js Journey chapter R3F.

### 5.1. Ngày 1 — Tư Duy R3F

- [ ] Học: R3F = React renderer cho Three.js — "viết JSX, nó dựng Three.js".
- [ ] Cài: `npm install three @react-three/fiber @react-three/drei` (R3F v9 ↔ React 19; nếu React 18 dùng R3F v8).
- [ ] Học: mọi class Three.js = thẻ camelCase (`<mesh>`, `<boxGeometry>`), `args` = tham số constructor.
- [ ] Bài tập: Canvas + 1 mesh (lặp lại ngày 1 bằng JSX).

### 5.2. Ngày 2 — Cấu Trúc Scene JSX

- [ ] Học: cách lồng component, `position/rotation/scale` là props dạng mảng `[x, y, z]`.
- [ ] Lỗi kinh điển: **Canvas không hiện gì vì cha có chiều cao 0px** → cha phải có height.
- [ ] Lỗi kinh điển: hook R3F gọi **ngoài Canvas** → lỗi runtime.
- [ ] Bài tập: scene 3 vật thể (lặp lại ngày 2 của tuần 1) bằng R3F.

### 5.3. Ngày 3 — useFrame & Ref

- [ ] Học: `useFrame` chạy mỗi frame, mutate trực tiếp qua `ref` (không trigger React re-render → mượt 60fps).
- [ ] Học: `delta` từ useFrame, quy tắc vàng áp dụng lại.
- [ ] Bài tập: box xoay bằng useFrame (so sánh với cách setState — thấy sự khác biệt hiệu năng).

### 5.4. Ngày 4 — Camera & OrbitControls

- [ ] Học: `OrbitControls` từ drei — xoay/zoom/pan chuột, đúng tính năng FR-3D-05.
- [ ] Học: cấu hình camera (vị trí, fov) qua prop `camera` của Canvas.
- [ ] Bài tập: scene + OrbitControls với giới hạn zoom/phóng hợp lý cho trẻ em (không zoom lọt vào vật).

### 5.5. Ngày 5 — Load Model (useGLTF)

- [ ] Học: format **GLB/GLTF** ("JPEG của 3D" — mesh + material + texture trong 1 file).
- [ ] Học: `useGLTF` từ drei + `Suspense` (hiện fallback khi đang tải).
- [ ] Học: `preload` để tải trước model.
- [ ] Bài tập: load 1 GLB miễn phí bất kỳ từ Quaternius/Kenney hiển thị được.

### 5.6. Ngày 6 — Click & Raycast + Html Popup

- [ ] Học: `onClick` trên mesh (R3F tự xử lý raycast).
- [ ] Học: `<Html>` từ drei — gắn DOM/UI (popup thông tin) vào vị trí 3D.
- [ ] Bài tập: click vào từng obstacle → hiện popup "Difficulty: MEDIUM, Age: 7–10, Time: 3 phút" (đúng FR-3D-06).

### 5.7. Ngày 7 — Mini Project

- [ ] Mini project: "Sân tập 3D tương tác" bằng R3F: 3 obstacle (primitive), OrbitControls, click → popup, 1 vật animation.
- [ ] Thử nghiệm: chia scene thành component (Obstacle.jsx, Popup.jsx...) — chuẩn bị cho kiến trúc renderer dùng chung.
- [ ] Ghi nhật ký + sổ lỗi.

> **Checkpoint tuần 2:** dựng được scene tương tác (orbit + click popup) bằng R3F trong 1 buổi chiều.

---

## 6. Tuần 3 — Asset Pipeline (Model 3D)

> Mục tiêu: biết cách lấy, xử lý, nén và đưa model vào web đúng chuẩn — và biết khi nào nên dùng AI tạo model.
> Chi tiết AI sinh model: mục 9.

### 6.1. GLB/GLTF & gltfjsx

- [ ] Học: cấu trúc GLB (scene graph: node → mesh → material → texture).
- [ ] Học: **gltfjsx** (`npx gltfjsx model.glb`) — sinh component typed, animate/đổi màu từng bộ phận dễ dàng.
- [ ] Bài tập: chạy gltfjsx trên 1 model, đổi màu 1 bộ phận trong code.

### 6.2. Tối Ưu Model cho Web

- [ ] Học: **gltf-transform** (CLI/npm) — `--draco` (nén geometry), `--meshopt`, `--decimate` (giảm đa giác).
- [ ] Mục tiêu: mỗi model ≤ 10k mặt cho máy yếu chạy mượt.
- [ ] Bài tập: nén 1 GLB, so sánh kích thước file trước/sau, kiểm tra chất lượng hiển thị.

### 6.3. Nguồn Asset — Thứ Tự Ưu Tiên

| Thứ tự | Nguồn                                    | Khi nào dùng                 | License                           |
| :----- | :--------------------------------------- | :--------------------------- | :-------------------------------- |
| 1      | **Primitive shapes** (box/cone/torus...) | Demo chính, milestone M4     | Không vấn đề (tự dựng)            |
| 2      | **Free asset packs**: Quaternius, Kenney | Vật thể đẹp, style đồng nhất | Miễn phí, rõ ràng                 |
| 3      | **Sketchfab (CC0)** / Poly Pizza         | Item hiếm                    | Lọc kỹ license CC0                |
| 4      | **AI 3D generation** (Meshy/Tripo/Rodin) | Item "điểm nhấn" đặc thù     | Xem mục 9.1 — KHÁC NHAU từng tool |
| 5      | **Blender tự dựng**                      | Cleanup, sửa model hỏng      | Tự làm                            |

### 6.4. Blender (Tùy Chọn, Chỉ Cần Mức Tối Thiểu)

- [ ] Học 3 thao tác đủ dùng: import GLB, **Decimate** (giảm mặt), sửa material/texture lỗi.
- [ ] Không cần học dựng model từ đầu — AI gen + pack miễn phí đã đủ.

### 6.5. Quy Ước Asset Của Project

- [ ] Thống nhất thư mục theo `Rule_3D.md` mục 9: `/3d-assets/movement/*.glb`, `/education/*`, `/products/*`.
- [ ] Quy ước đặt tên: `hurdle_01.glb`, `hoop_01.glb`... khớp với `modelId` trong `Scene Config JSON`.
- [ ] Mỗi model có thumbnail + version (khớp schema bảng `3DModel`).

> **Checkpoint tuần 3:** có ít nhất 5 GLB đã nén, đặt đúng thư mục, load được trong R3F.

---

## 7. Tuần 4 — Milestone M4: Obstacle Course Demo

> Mục tiêu: **renderer hoàn chỉnh bằng primitive** — đây là bản demo chính của đồ án, không phụ thuộc model đẹp.

### 7.1. Các Bước

- [ ] **7.1.1.** Dựng scene Obstacle Course: START → Hurdle → Hoop → Cone → Mat → FINISH (theo sơ đồ Rule_3D.md mục 3).
- [ ] **7.1.2.** OrbitControls + giới hạn camera.
- [ ] **7.1.3.** Click từng obstacle → Html popup (độ khó, tuổi, thời gian, hướng dẫn).
- [ ] **7.1.4.** **Animation script interpreter**: parse mảng bước (vd: `[{object:"ball", moveTo:[1,0,3], duration:2}]`) → chạy bằng `useFrame` + lerp; có nút Play/Pause/Replay.
- [ ] **7.1.5.** Trình diễn từng bước (steps): Bắt đầu → Thao tác chính → Kết quả (FR-3D-03).
- [ ] **7.1.6.** Kết thúc → thông điệp "Giờ hãy chơi thật bằng đồ chơi!" (FR-3D-07).
- [ ] **7.1.7.** Fallback: nếu 3D lỗi/đang tải → ảnh + 2D diagram (FR-3D-09).
- [ ] **7.1.8.** Lazy-load component 3D (`React.lazy`) + Suspense.

### 7.2. Kiến Trúc Component Đề Xuất

```
Activity3DViewer (điểm vào, đọc Scene Config JSON)
├── SceneRenderer (Canvas, light, environment)
│   ├── Obstacle / ModelObject (dùng chung cho mọi modelId)
│   ├── ObjectInfoPopup (Html + raycast click)
│   └── AnimationController (interpreter animationScript)
└── Fallback2D (ảnh/diagram khi 3D chưa sẵn sàng)
```

### 7.3. Bàn Giao Contract

- [ ] Renderer chỉ đọc JSON — **không hard-code scene theo activity nào** (FR-3D-02).
- [ ] Định nghĩa schema `Scene Config JSON` chung với backend (xem mục 8) — phát triển song song được ngay.

---

## 8. Tuần 5+ — Milestone M5: Tích Hợp & Tối Ưu

### 8.1. Contract Scene Config JSON

- [ ] Định nghĩa + version hóa schema (tham khảo Rule_3D.md mục 10 và Phase 1 mục 8):

```json
{
  "schemaVersion": "1.0",
  "activityType": "OBSTACLE_COURSE",
  "difficulty": "MEDIUM",
  "objects": [
    { "modelId": "hurdle_01", "position": [0, 0, 2] },
    { "modelId": "hoop_01", "position": [2, 0, 4] }
  ],
  "labels": {
    "hurdle_01": {
      "title": "Hurdle",
      "difficulty": "MEDIUM",
      "age": "7-10",
      "time": "3 min"
    }
  },
  "animationScript": [{ "object": "ball", "moveTo": [1, 0, 3], "duration": 2 }]
}
```

- [ ] Tạo file JSON mẫu cho backend test và frontend debug (trang debug: dán JSON → thấy scene).

### 8.2. Tích Hợp Backend (AI→3D Mapper)

- [ ] Backend sinh `Scene Config JSON` từ Activity Config (thuần logic, test bằng JSON — không cần 3D).
- [ ] API trả JSON → frontend đẩy thẳng vào renderer.
- [ ] Cache `scene_configs` trong DB (entity sketch Phase 1 mục 10).

### 8.3. Hiệu Năng

- [ ] Lazy-load từng GLB, không tải tất cả một lúc.
- [ ] Nén GLB (mục 6.2), giới hạn đa giác.
- [ ] `PerformanceMonitor` (drei) hoặc tự đo FPS — hạ chất lượng nếu chậm.
- [ ] Cache header cho file tĩnh GLB (CDN/static hosting).

### 8.4. Fallback & Kiểm Thử

- [ ] Fallback ảnh/2D bắt buộc sẵn sàng (đồ án không vỡ dù 3D trục trặc).
- [ ] Test trên máy yếu (không GPU) — đối tượng thực tế của venue.
- [ ] Test các thiết bị khác nhau (mobile, laptop).

---

## 9. Dùng AI Hỗ Trợ Làm Model 3D

### 9.1. Các Tool AI Tạo Model (2026)

| Tool                | Điểm mạnh                                                   | Free tier                       | Giấy phép (free tier)                                      | Ghi chú                                        |
| :------------------ | :---------------------------------------------------------- | :------------------------------ | :--------------------------------------------------------- | :--------------------------------------------- |
| **Meshy**           | Cân bằng nhất, text+image→3D, PBR, GLB, style Cartoon/Voxel | ~100 credits/tháng (~5 lần gen) | **Được dùng thương mại** (CC BY 4.0 — phải ghi công Meshy) | Lựa chọn an toàn nhất cho đồ án                |
| **Tripo**           | Nhanh nhất (10–30s), topology sạch, auto-rig                | 200–300 credits/tháng           | **KHÔNG được dùng thương mại**                             | Chỉ dùng thử nghiệm, không đưa vào demo public |
| **Rodin (Hyper3D)** | Chất lượng cao nhất, quad-mesh                              | Ít credits                      | Cần trả phí mới có quyền thương mại                        | Đắt, không cần thiết cho đồ án                 |

> **Quy tắc license:** trước khi đưa model vào demo/public, kiểm tra license của từng tool. "Free tier" không đồng nghĩa "được dùng tự do".

### 9.2. Workflow Dùng AI Tạo Model

```
1. Chọn vật thể cần model (ưu tiên thấp — chỉ item "điểm nhấn")
2. Chọn tool: Meshy (ưu tiên), giữ style "Cartoon/Low-poly" cho đồng nhất
3. Prompt (xem 9.4) HOẶC image-to-3D từ 1 ảnh tham chiếu (chất lượng ổn định hơn)
4. Download GLB
5. Chạy gltf-transform: decimate (giảm mặt) + draco/meshopt (nén)
6. Xem lại trong trình xem GLB (threejs editor / model-viewer) — check lỗi mesh/texture
7. Đặt đúng thư mục /3d-assets/ + cập nhật DB 3DModel
```

> **Lưu ý quan trọng:** model AI tạo thường **high-poly (13k–20k mặt)** → bắt buộc bước 5 trước khi đưa lên web. Một số model có lỗi mesh (lỗ thủng, mặt ngược) → sửa bằng Blender hoặc bỏ qua, gen lại.

### 9.3. AI Hỗ Trợ VIẾT CODE (Quan Trọng Nhất Cho Team Này)

AI coding assistant (Claude/Cursor/Copilot) là "trợ lý 3D" hiệu quả nhất vì R3F là code declarative pattern chuẩn:

- [ ] Nhờ AI viết component R3F chuẩn (Canvas, loader GLB, OrbitControls, popup).
- [ ] Nhờ AI viết **animationScript interpreter** (parse JSON → useFrame/gsap, play/pause/replay).
- [ ] Nhờ AI **debug lỗi 3D** (màn hình đen, model không hiện, texture đen, webgl context lost).
- [ ] Nhờ AI sinh **Scene Config JSON mẫu** để test renderer không cần backend.
- [ ] Nhờ AI viết unit test cho Mapper (backend) — độc lập với 3D.

### 9.4. Prompt Mẫu

**Tạo model (Meshy):**

```
low poly cartoon hurdle for kids obstacle course, game asset,
soft colors, no background, stylized children toy style
```

**Viết code R3F:**

```
Viết component React Three Fiber (TypeScript) load model GLB từ URL bằng useGLTF,
có OrbitControls từ drei giới hạn zoom, click vào mesh hiển thị popup Html
chứa thông tin truyền vào từ prop. Dùng Suspense để lazy load.
```

**Debug:**

```
Scene R3F của tôi hiện màn hình đen, code: [paste code].
Không có lỗi console. Nguyên nhân có thể là gì và cách fix?
```

---

## 10. Checklist Tổng Theo Dõi

- [ ] **Tuần 1**: dựng lại scene 3 obstacle + light + animation trong 30 phút không cần tài liệu
- [ ] **Tuần 2**: scene tương tác R3F (orbit + click popup) hoàn chỉnh
- [ ] **Tuần 3**: ít nhất 5 GLB đã nén, đặt đúng thư mục, load được
- [ ] **Tuần 4**: M4 — Obstacle Course demo (7 mục con ở 7.1) chạy được
- [ ] **Tuần 5+**: M5 — renderer đọc Scene Config JSON từ backend + fallback 2D
- [ ] License tất cả asset đã kiểm tra
- [ ] Hiệu năng OK trên máy không GPU
- [ ] Trang debug JSON → render hoạt động

---

## 11. Sổ Lỗi Thường Gặp (Cập Nhật Liên Tục)

| #   | Lỗi                           | Nguyên nhân                                       | Cách fix                               |
| :-- | :---------------------------- | :------------------------------------------------ | :------------------------------------- |
| 1   | Màn hình đen                  | Thiếu light với StandardMaterial / Canvas cha 0px | Thêm light; set height cho cha         |
| 2   | Không có gì hiện              | Canvas không có kích thước                        | Cha phải có chiều cao                  |
| 3   | `useFrame` lỗi runtime        | Gọi hook ngoài Canvas                             | Chỉ gọi trong component trong Canvas   |
| 4   | Animation nhanh/chậm theo máy | Không nhân `delta`                                | Luôn `x += speed * delta`              |
| 5   | Model không hiện / janky      | Không có Suspense / không preload                 | Wrap Suspense + `useGLTF.preload`      |
| 6   | Model nặng, giật              | High-poly, chưa nén                               | gltf-transform decimate + draco        |
| 7   | Click không ăn                | Object không có `onClick` hoặc bị vật khác che    | Kiểm tra raycast, đặt `visible` hợp lý |
| 8   | Next.js lỗi khi build         | Canvas chạy server-side                           | `"use client"` cho component 3D        |
| 9   | Texture đen                   | Material không có light / texture lỗi             | Thêm light; kiểm tra UV                |

---

## 12. Glossary (Thuật Ngữ)

| Thuật ngữ                      | Ý nghĩa                                                          |
| :----------------------------- | :--------------------------------------------------------------- |
| **Scene / Camera / Renderer**  | Không gian 3D / ống kính nhìn / bộ phận vẽ ra màn hình           |
| **Mesh = Geometry + Material** | Vật thể = hình dạng + bề mặt                                     |
| **Primitive**                  | Hình cơ bản có sẵn (box, sphere, cone, torus...)                 |
| **Transform**                  | position / rotation / scale của vật                              |
| **GLB / GLTF**                 | Format chuẩn của model 3D web (mesh + material + texture 1 file) |
| **Raycast**                    | Kỹ thuật "bắn tia" từ chuột để biết click trúng vật nào          |
| **useFrame**                   | Hook R3F chạy mỗi frame (thay cho animation loop)                |
| **drei**                       | Thư viện helper của R3F (OrbitControls, useGLTF, Html...)        |
| **Lerp**                       | Nội suy tuyến tính — di chuyển mượt từ A đến B                   |
| **Decimate / Draco**           | Giảm đa giác / nén geometry                                      |
| **Scene Config JSON**          | Contract giữa backend (AI→3D Mapper) và renderer                 |

---

## 13. Nguồn Tài Nguyên Tổng Hợp

### Docs chính thức

- Three.js manual: `threejs.org/manual`
- R3F docs: `r3f.docs.pmnd.rs`
- drei docs: `github.com/pmndrs/drei`

### Khóa học

- Three.js Journey (paid, tốt nhất, có chapter R3F): `threejs-journey.com`
- Wawa Sensei — R3F Ultimate Guide (free): `wawasensei.dev`
- Tutorial R3F cho beginner: `hontran.dev/blog/react-three-fiber-tutorial-for-beginners`

### Asset miễn phí

- Quaternius: `quaternius.com`
- Kenney: `kenney.nl`
- Sketchfab CC0: `sketchfab.com`

### AI tạo model

- Meshy: `meshy.ai`
- Tripo: `tripo3d.ai`
- Rodin/Hyper3D: `hyper3d.ai`

### Công cụ

- gltf-transform (nén): `gltf.report` (web tool) / `gltf-transform.dev` (CLI)
- gltfjsx: `github.com/pmndrs/gltfjsx`
- Three.js editor (xem/test model): `threejs.org/editor`
- Blender (cleanup): `blender.org`
