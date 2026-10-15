# Nhật ký tiến độ học Three.js / React Three Fiber

Tài liệu này ghi lại phần code đã thực hiện, kiến thức đã đi qua và các checkpoint còn cần tự kiểm tra. “Code đã chạy” không tự động có nghĩa là “đã hiểu hoàn toàn”.

## Trạng thái hiện tại

- Ngày cập nhật: 2026-10-15.
- Đang học: Level 04 — Dựng scene từ JSON.
- Code đã triển khai đến hết nội dung hướng dẫn Level 04.
- Checkpoint tự giải thích và tự thử dữ liệu lỗi của Level 04: chưa xác nhận hoàn tất.
- Level tiếp theo sau khi tự kiểm tra: Level 05 — Guide Mode theo từng bước.

## Level 03 — Chuyển sang React Three Fiber

### Code đã làm

- Tạo scene bằng `Canvas` thay cho việc tự tạo `WebGLRenderer`.
- Tạo cube bằng JSX với `mesh`, `boxGeometry` và `meshStandardMaterial`.
- Dùng `position={[x, y, z]}` để đặt vị trí mesh.
- Dùng `args={[1, 1, 1]}` làm đối số constructor của `BoxGeometry`.
- Dùng `useRef<THREE.Mesh>(null)` để giữ tham chiếu tới mesh thật.
- Dùng `useFrame` và `delta` để xoay cube không phụ thuộc FPS.
- Dùng state `running` cho UI pause/resume.
- Dùng ref `elapsedRef` để giữ thời gian animation mà không render React mỗi frame.
- Dùng công thức nội suy A → B:

```text
progress = elapsed / duration
position = start + (end - start) * progress
```

- Replay đặt lại elapsed, position và rotation.
- Thêm `OrbitControls`, giới hạn khoảng cách zoom và góc quay để camera không đi xuống dưới sàn.

### Kiến thức chính đã đi qua

```text
React state  -> dữ liệu ảnh hưởng UI và cần render lại.
React ref    -> dữ liệu mutable thay đổi thường xuyên, không cần render lại.
useFrame     -> callback được R3F gọi ở mỗi frame.
delta        -> thời gian giữa hai frame, dùng để chuyển động độc lập FPS.
Canvas       -> quản lý renderer, scene, camera và render loop.
```

### Bằng chứng trong source

- `src/learning/level-03-r3f/Exercise.tsx`

### Tự kiểm tra còn nên làm

- Tự đổi tốc độ xoay và dự đoán kết quả trước khi chạy.
- Tự đổi `START_X`, `END_X` và `DURATION`.
- Tự giải thích vì sao không dùng `setState` để cập nhật góc mỗi frame.
- Tự giải thích vì sao `useFrame` phải nằm trong component con của `Canvas`.

## Level 04 — Dựng scene từ JSON

### Code đã làm

- Đọc hai scene từ file JSON.
- Tách type dữ liệu dùng chung vào `helpers/scene.types.ts`.
- Viết runtime validator nhận đầu vào `unknown`.
- Kiểm tra `schemaVersion` trước khi đọc scene.
- Kiểm tra `objects` là array và giới hạn số lượng object.
- Kiểm tra `id` không rỗng và không trùng.
- Kiểm tra `modelId` không rỗng.
- Kiểm tra `position` có đúng ba số hữu hạn `[x, y, z]`.
- Trả danh sách lỗi kèm đường dẫn JSON khi dữ liệu sai.
- Tạo model registry ánh xạ `modelId -> component primitive`.
- Tách primitive thành các component dùng lại được.
- Tạo `SceneRenderer` chung dùng `map()` để dựng mọi scene hợp lệ.
- Dùng `object.id` làm React key, không dùng `modelId`.
- Hiện `UnknownModel` thay vì làm crash scene khi model chưa được hỗ trợ.
- Gắn `id` và `modelId` vào `userData` để chuẩn bị cho highlight/raycast ở Level 05.
- Tách `Exercise.tsx` thành Server Component và giữ Canvas trong client boundary nhỏ hơn.
- Tạo scene thứ hai để chứng minh cùng validator, registry và renderer có thể tái sử dụng.
- Tạo selector đổi scene mà không copy renderer.

### Luồng đã học

```text
JSON thô
  -> validateScene
  -> SceneData an toàn
  -> SceneExperience tạo Canvas
  -> SceneRenderer map objects
  -> registry tra modelId
  -> primitive hoặc UnknownModel
  -> WebGL render scene
```

### Phân biệt quan trọng

```text
id      = danh tính của một object cụ thể.
modelId = loại asset hoặc template mà object sử dụng.
```

Ví dụ hai hurdle có thể cùng `modelId = "hurdle_primitive"`, nhưng phải có hai `id` khác nhau.

### Bằng chứng trong source và tài liệu

- `src/learning/level-04-json/Exercise.tsx`
- `src/learning/level-04-json/helpers/`
- `src/learning/level-04-json/components/`
- `src/learning/level-04-json/scene.sample.json`
- `src/learning/level-04-json/scene.second.json`
- `Docs/Learning-Levels/level-04-json/Code-Flow.md`

### Đã xác minh kỹ thuật

- TypeScript type-check: đạt.
- ESLint: đạt.
- Next.js production build: đạt.

### Chưa tự xác nhận checkpoint

Trước khi đánh dấu hoàn thành Level 04, tự thực hiện lần lượt:

- [ ] Thêm một field lạ và xác nhận scene vẫn chạy.
- [ ] Dùng `modelId` chưa đăng ký và xác nhận placeholder đỏ xuất hiện.
- [ ] Tạo hai object trùng `id` và đọc đúng thông báo lỗi.
- [ ] Đổi position thành dữ liệu sai và đọc đúng thông báo lỗi.
- [ ] Đổi `schemaVersion` thành version chưa hỗ trợ và xác nhận scene bị từ chối.
- [ ] Tự thêm một primitive mới vào registry mà không sửa `SceneRenderer`.
- [ ] Tự giải thích lại toàn bộ luồng mà không nhìn `Code-Flow.md`.

## Phần chưa học trong lộ trình hiện tại

- Level 05: chạy `steps`, highlight object, camera theo từng bước và animation guide.
- Level 06: tải model GLB và sử dụng animation clip.
- Level 07: Result Mode từ dữ liệu kết quả.
- Level 08: kết nối backend, loading, fallback, error handling và UX tích hợp.

## Việc nên làm tiếp theo

1. Chạy các test JSON lỗi trong checklist Level 04.
2. Khôi phục JSON hợp lệ sau mỗi test.
3. Ghi kết quả quan sát vào `level-04-json/Notes.md`.
4. Chỉ đánh dấu Level 04 hoàn thành khi có thể tự giải thích luồng JSON → validator → renderer → registry.
5. Sau đó mới chuyển sang Level 05.
