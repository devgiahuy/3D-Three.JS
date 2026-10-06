# Roadmap học 3D theo level — Smart Kids Activity Platform

**Cập nhật:** 06/10/2026. **Nguồn phạm vi:** `D:/Capstone/Capstone-Project-Docs/Rule_3D.md`.

## 1. Bạn đang ở đâu?

Theo `Take-Note.md`, `Day-1/note.md` và các bài `Bai1`–`Bai4`, bạn đã tiếp xúc với Scene, Camera, Renderer, Mesh, Geometry, Material, Light, position/rotation/scale và Group. Bạn xác nhận mới hiểu cách tạo object, còn chuyển động chưa rõ. Vì vậy, **điểm học tiếp là Level 02 — Animation**, sau một lượt tự kiểm tra Level 01.

Các demo animation đã có trong project là tài liệu quan sát; chúng không tự chứng minh bạn đã nắm được kiến thức. Checklist cũ không được dùng làm bằng chứng hoàn thành. Không phải học lại toàn bộ Bài 1–4 nếu đã giải thích và tự sửa được.

Đích cuối là **Shared 3D Renderer + Guide Mode + Result Mode cho Mini Obstacle Course**. Bài tổng hợp này ở cuối lộ trình; hiện tại chưa cần hiểu toàn bộ JSON, camera tự chuyển hoặc GLB.

## 2. Flow học mỗi bài

1. Đọc mục tiêu và dự đoán kết quả trước khi bấm Chạy.
2. Mở file bài tập và tìm đoạn được đánh dấu “PHẦN BẠN HỌC/SỬA”.
3. Chỉ đổi một biến: trục, tốc độ, vị trí hoặc thời lượng.
4. Quan sát trên trình duyệt, so sánh với dự đoán.
5. Giải thích bằng lời vì sao vật chuyển động như vậy.
6. Tự làm biến thể nhỏ theo đề, rồi ghi vào `Notes.md` của level.
7. Chuyển bài khi đạt checkpoint, không chuyển chỉ vì demo chạy được.

Một buổi gợi ý 45–90 phút: 10 phút đọc, 15 phút quan sát, 20–45 phút sửa/tự làm, 10 phút ghi chú. Đây là gợi ý, không phải deadline. Một bài có thể cần nhiều buổi. Không ép toàn bộ lộ trình thành 4–5 tuần.

## 3. Môi trường và nơi làm bài

Bạn dùng tiếp project Next.js hiện có, không cần tạo project Vite khác.

```powershell
Set-Location 'D:\Capstone\3D-Three.JS\web'
npm run dev
```

Mở địa chỉ terminal thông báo rồi thêm `/learn`. Ví dụ nếu server ở cổng 3000: `http://localhost:3000/learn`. Nếu cổng 3000 bận, dùng cổng terminal thực sự báo.

```text
web/
├── Docs/
│   ├── 3D_Learning_Roadmap.md       # bản đồ tổng thể này
│   ├── Study-3D.md                  # bắt đầu học thế nào ngay hôm nay
│   ├── Take-Note.md                 # ghi chú cũ để đối chiếu
│   ├── Day-1/note.md                # ghi chú cũ
│   ├── Archive/                     # bản roadmap/study trước khi tổ chức lại
│   └── Learning-Levels/
│       ├── Guide.md                 # cách dùng khu học tập
│       ├── Progress.md              # checklist tự đánh giá
│       └── level-00-... ... level-08-.../
│           ├── Guide.md             # đề bài, giải thích, gợi ý, checkpoint
│           └── Notes.md             # bạn ghi lại điều đã hiểu và lỗi
├── src/learning/
│   ├── shared/                     # khung scene dùng lại cho bài đầu
│   ├── level-01-objects/Exercise.tsx
│   ├── level-02-animation/
│   │   ├── 01-static/Exercise.tsx
│   │   ├── 02-rotation/Exercise.tsx
│   │   ├── 03-linear/Exercise.tsx
│   │   ├── 04-duration/Exercise.tsx
│   │   ├── 05-wave/Exercise.tsx
│   │   ├── 06-jump/Exercise.tsx
│   │   └── Exercise.tsx            # chỉ chọn bài, không chứa công thức chuyển động
│   └── level-03-... ... level-08-.../Exercise.tsx
├── src/app/learn/                  # đường dẫn mở từng level trên web
└── public/3d-assets/movement/      # nơi đặt asset sau này, hiện chưa có GLB
```

**Đã setup:** trang `/learn`, trang từng level, bài ôn object và sáu ví dụ animation chạy độc lập. Các Level 03–08 có nơi làm bài, đề/gợi ý và khung chờ bạn triển khai; không phải các tính năng đã được làm xong. R3F/drei chưa cài: chỉ cài khi tới Level 03.

## 4. Các level và điều kiện đi tiếp

| Level | Học gì? | Đầu ra | Chỉ đi tiếp khi |
|---|---|---|---|
| [00 — Bắt đầu](Learning-Levels/level-00-start/Guide.md) | Môi trường, sửa file, state/ref cơ bản | Mở `/learn`, sửa được nhãn và chạy lại | Biết file code khác file ghi chú ở đâu |
| [01 — Object](Learning-Levels/level-01-objects/Guide.md) | Ôn primitive, ánh sáng, transform, group | Tự dựng một hurdle đơn giản | Giải thích được tâm mesh, tọa độ local và group |
| [02 — Animation](Learning-Levels/level-02-animation/Guide.md) | Frame, delta, elapsed, progress, chuyển động và nút điều khiển | Một cube vượt thanh chắn theo đường minh họa định sẵn | Tự giải thích/tạo lại move A→B và pause/replay |
| [03 — R3F](Learning-Levels/level-03-r3f/Guide.md) | JSX, Canvas, ref, useFrame, controls | Viết lại bài A→B bằng R3F | Hiểu React state khác biến cập nhật mỗi frame |
| [04 — JSON](Learning-Levels/level-04-json/Guide.md) | Object registry, schema và dựng scene từ dữ liệu | Một scene tĩnh thay đổi bằng JSON | id riêng cho từng object; xử lý dữ liệu không hỗ trợ |
| [05 — Guide](Learning-Levels/level-05-guide/Guide.md) | Step controller, highlight, camera, instruction | Hướng dẫn đủ trình tự Obstacle Course bằng primitive | Next/Previous/Replay giữa chừng vẫn đúng |
| [06 — Asset](Learning-Levels/level-06-assets/Guide.md) | GLB, scale/pivot, clips, nguồn/license | Thay ít nhất một vật và thử clip nhân vật | Asset không phá logic Guide hoặc phần còn lại |
| [07 — Result](Learning-Levels/level-07-result/Guide.md) | Chuyển dữ liệu kết quả thành nhãn/màu | Hai bộ kết quả: tối thiểu và chi tiết | Không tự suy đoán chi tiết chưa được ghi nhận |
| [08 — Hoàn thiện](Learning-Levels/level-08-integration/Guide.md) | API, loading/error, fallback, cleanup, UX, hiệu năng | Viewer tích hợp hoạt động độc lập core flow | Đủ 12 tiêu chí nghiệm thu Rule_3D |

Level 06 và 07 có thể đổi thứ tự sau Level 05. Click-popup, Target Ball/Bowling, giọng đọc, âm thanh, hiệu ứng và autoplay toàn bộ là tùy chọn sau phần bắt buộc.

## 5. Vì sao animation học trước JSON và Guide?

Animation là **thay đổi thuộc tính của object theo thời gian, rồi vẽ lại scene**. Ví dụ bạn biết `cube.position.x = 2`; bước tiếp theo là hiểu `cube.position.x = -2 + speed * elapsed`. JSON chỉ lưu các giá trị đầu vào của những công thức/bước bạn đã hiểu; nó không tự tạo ra chuyển động.

```text
Tạo cube → đổi position một lần → đổi position theo thời gian
→ đi A đến B → pause/reset → minh họa một thao tác
→ làm lại bằng R3F → lấy dữ liệu từ JSON
→ nhiều bước + camera/highlight → Guide → Result → tích hợp
```

## 6. Ranh giới kỹ thuật và phạm vi

- Mapper Phase 1 gọi là **3D Template Mapper**, xử lý rule/template; không gọi AI→3D.
- Shared renderer vẫn có component cho hurdle/hoop/character; “dùng chung” không có nghĩa cấm component chuyên biệt. Scene được chọn/bố trí từ cấu hình, không copy cả renderer cho từng activity.
- Bài vượt thanh chắn minh họa chuyển động đã định trước; không dùng physics hay cho người dùng điều khiển nhân vật.
- Không học AI sinh model/scene/animation, editor kéo thả, creative workspace, camera recognition trong lộ trình Phase 1.
- Chỉ một số kiểu hành động đã định nghĩa rõ là đủ; không cần xây một ngôn ngữ animation hoặc interpreter tổng quát.
- Dữ liệu/field bổ sung trong fixture là đề xuất học tập, không phải schema backend đã phê duyệt. Đồng bộ contract khi tích hợp.
- Tránh hứa “10k polygon chắc chắn mượt”; budget phải xét cả scene, texture, draw calls và thiết bị mục tiêu.

## 7. Truy vết 12 tiêu chí nghiệm thu Rule_3D

| Tiêu chí | Level chuẩn bị |
|---|---|
| 1. Mở được trên browser mục tiêu | 00, 08 |
| 2. Scene từ JSON | 04 |
| 3. Tuần tự bước đầu đến cuối | 05 |
| 4. Start/Pause/Next/Previous/Replay | 02, 05 |
| 5. Highlight đúng object | 05 |
| 6. Camera đúng khu vực | 05 |
| 7. Hướng dẫn và tính điểm đọc được | 05, 08 |
| 8. Result đúng dữ liệu backend | 07, 08 |
| 9. Không dựng thêm chi tiết kết quả | 07 |
| 10. Fallback hoạt động | 08 |
| 11. Core flow độc lập viewer | 08 |
| 12. Đúng phạm vi Guide/Result | Tất cả level |

## 8. Tài liệu tra đúng lúc

- Level 01: [Three.js Fundamentals](https://threejs.org/manual/#en/fundamentals), [Scenegraph](https://threejs.org/manual/#en/scenegraph).
- Level 02: [requestAnimationFrame — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame). Đọc timestamp và ví dụ duration, chưa cần đọc toàn bộ tài liệu.
- Level 03: [R3F Introduction](https://r3f.docs.pmnd.rs/getting-started/introduction), [Basic Animations](https://r3f.docs.pmnd.rs/tutorials/basic-animations), [Performance pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls).
- Level 06: [Loading Models](https://r3f.docs.pmnd.rs/tutorials/loading-models), [useAnimations](https://drei.docs.pmnd.rs/abstractions/use-animations).
- Level 08: [Canvas errors/fallback](https://r3f.docs.pmnd.rs/api/canvas#errors-and-fallbacks), [React Suspense](https://react.dev/reference/react/Suspense).

Các bài cũ dùng `THREE.Clock`; bản Three.js đang cài đã đánh dấu Clock deprecated. Khung bài mới dùng timestamp của requestAnimationFrame để bạn nhìn rõ delta/elapsed. Khi chuyển R3F dùng delta từ useFrame. Đây là cùng một kiến thức về thời gian, không phải hai môn khác nhau.
