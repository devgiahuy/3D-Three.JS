# Level 01 — Ôn object và transform

**Trước khi học:** Đã đọc ghi chú Bài 1–4; tự kiểm tra trước khi đánh dấu đạt.

**Đường dẫn:** `/learn/level-01-objects`.

## Mục tiêu và điểm học hiện tại

Đây là ôn tập từ Take-Note và Day-1/note. Chỉ làm lại phần bạn chưa tự giải thích được. Starter đã có một cube trong group; nhiệm vụ là tự dựng hurdle, chưa có animation.

## Bài 01.1 — Dựng và đặt object

File: `src/learning/level-01-objects/Exercise.tsx`, sửa hàm `createSubject`.

1. Đổi kích thước/màu cube, nói rõ Geometry và Material mỗi phần làm gì.
2. Đặt cube cao 1 đơn vị lên sàn y=0: tâm cube ở y=0.5.
3. Thêm một sphere ở x=2. Khung camera đã nhìn toàn bộ khoảng x=-4..4.
4. Thử BasicMaterial rồi StandardMaterial. Khung có ánh sáng sẵn; tắt một light trong shared để quan sát nếu muốn.

Gợi ý 1: tâm primitive thường nằm giữa hình, không ở chân.
Gợi ý 2: `new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material)`; thêm mesh vào group.

## Bài 01.2 — Hurdle gồm ba phần

1. Thay cube bằng hai trụ BoxGeometry cao 1.5, rộng/sâu 0.15.
2. Đặt hai tâm ở (-1,0.75,0) và (1,0.75,0).
3. Thanh ngang BoxGeometry(2.2,0.15,0.15), tâm (0,1.2,0).
4. Gom vào cùng Group, đổi `group.position.x=1` để cả ba cùng dịch.
5. Đổi vị trí thanh ngang con, so sánh với đổi vị trí group cha.

Gợi ý: dùng box để hiểu hình trước; cylinder và xoay 90 độ là biến thể sau. Tọa độ con là local so với group; vị trí nhìn trên scene còn chịu transform của cha.

## Bài 01.3 — Tự kiểm tra bằng góc nhìn

Xoay group một lần quanh Y bằng `Math.PI/4`. Đổi scale=0.8. Trả lại góc 0. Các thao tác này là transform tĩnh. Radian: π tương ứng 180°, π/2 tương ứng 90°.

Một đơn vị scene không tự động là một mét. Dự án có thể thống nhất 1 đơn vị=1m để kích thước asset và vị trí nhất quán; ghi rõ quy ước.

## Checkpoint

- [ ] Tự dựng ba mesh thành hurdle mà không copy Bai4 toàn bộ.
- [ ] Giải thích vì sao trụ cao 1.5 có tâm y=0.75.
- [ ] Phân biệt position con và position group.
- [ ] Đọc được tọa độ X/Y/Z và rotation tính bằng radian.

Khi đạt, sang Level 02. Không cần hoàn thiện shadow, texture hay UI điều khiển nhiều slider.

Số liệu x/y/z bên dưới scene là transform của subject (group cha trong bài này). Position của từng mesh con đọc trong hàm createSubject; không nhầm hai hệ tọa độ.
