# Level 06 — Model GLB và clip nhân vật

**Trước khi học:** Guide primitive đã chạy; chưa cần tự dựng model hoặc tự rig.

**Đường dẫn:** `/learn/level-06-assets`.

## Mục tiêu

Giữ nguyên Guide đang chạy, thay từng primitive bằng GLB có sẵn. Chỉ lấy asset cần dùng, chưa cần đạt số lượng 5 model.

File làm bài: `src/learning/level-06-assets/Exercise.tsx`. Đặt file ở `public/3d-assets/movement/`. URL `/3d-assets/movement/character.glb` không chứa chữ public. Thư mục hiện có hướng dẫn nhưng chưa có GLB.

## Bài 06.1 — Load một model

1. Chọn model có nguồn/license rõ ràng, lưu metadata vào bảng ghi chú.
2. Dùng useGLTF dưới Canvas và Suspense cho loading.
3. Kiểm tra scale, hướng mặt, tâm/pivot, chân chạm đất.
4. Thay một hurdle trong registry Level 04; id của object giữ ý nghĩa cũ.

Gợi ý: asset cao 100 lần không có nghĩa camera hỏng. Đo kích thước rồi thống nhất đơn vị/hướng trước.

## Bài 06.2 — Hai bản sao và highlight

Render cùng một model tại hai vị trí. Clone scene graph đúng cách nếu cần; GLTF cache có thể chia sẻ geometry/material. Đổi màu một bản sao phải không vô tình đổi bản còn lại. Với nhân vật skinned, dùng cách clone hỗ trợ skeleton khi cần nhiều bản sao.

Gợi ý: phân biệt dữ liệu asset được chia sẻ với object instance riêng. Không dispose asset cache đang được component khác dùng.

## Bài 06.3 — Một clip nhân vật

Chọn GLB có clip đứng/chạy/nhảy và xem tên clip thực tế. Dùng useAnimations để lấy actions. Học play, paused, reset, phát một lần và dừng ở trạng thái mong muốn. Cho group nhân vật di chuyển A→B, còn clip thể hiện chân/tay; chúng là hai lớp chuyển động khác nhau.

Gợi ý: clip có thể đã có root motion. Nếu vừa áp chuyển động group vừa để clip tự dịch gốc thì nhân vật có thể đi gấp đôi. Xem asset trước, chọn clip in-place hoặc thống nhất cách dùng root motion.

## Bài 06.4 — Budget và metadata

Ghi id/name/modelUrl/thumbnailUrl/version/fileSize/isActive/license theo Rule_3D mục 7. Học nén ở mức cần thiết sau khi đo file/scene. So sánh trước/sau bằng máy mục tiêu; polygon thấp không tự bảo đảm texture và draw calls nhẹ.

## Checkpoint

- [ ] Model đúng vị trí/kích thước/hướng, loading rõ ràng.
- [ ] Có ít nhất một model kiểm tra nguồn/license và metadata.
- [ ] Hiểu clip và chuyển động group khác nhau, pause/replay nhất quán.
- [ ] Model lỗi không làm core flow ngừng hoạt động.

Đọc: [Loading Models](https://r3f.docs.pmnd.rs/tutorials/loading-models), [useAnimations](https://drei.docs.pmnd.rs/abstractions/use-animations).
