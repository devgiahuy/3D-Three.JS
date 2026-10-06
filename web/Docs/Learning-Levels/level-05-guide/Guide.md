# Level 05 — Guide Mode theo từng bước

**Trước khi học:** Qua Level 04; làm hai bước trước rồi mở rộng đủ Mini Obstacle Course.

**Đường dẫn:** `/learn/level-05-guide`.

## Mục tiêu

Từ một scene tĩnh thành hướng dẫn theo bước. Bắt đầu hai bước: “Đứng ở vạch” và “Vượt hurdle”. Sau khi hai bước đúng mới mở rộng toàn bộ Obstacle Course.

File làm bài: `src/learning/level-05-guide/Exercise.tsx`. Tái dùng SceneRenderer Level 04 và chuyển động Level 02/03. Có thể tách thêm StepController.tsx, CameraController.tsx, Highlight.tsx trong thư mục này.

## Bài 05.1 — Bước và UI trước

1. Tạo hai step có id, title, instruction, highlightObjectIds và durationMs.
2. Dùng state currentStepIndex; thêm Next/Previous có giới hạn đầu/cuối.
3. Hiển thị câu hướng dẫn và “Bước 1/2”. Chưa chạy animation.
4. Tách currentStep (UI) khỏi elapsed (thời gian mỗi bước).

Gợi ý: dùng state/useReducer đơn giản trước, chưa cần thư viện state machine.

## Bài 05.2 — Highlight

Lấy id cần highlight từ step. Đổi material hoặc thêm vòng/outline đơn giản cho vật. Khi đổi step, vật cũ trở lại trạng thái ban đầu. Không chỉ dùng màu: thêm nhãn “Vật ở bước hiện tại”.

Gợi ý: với primitive, truyền prop highlighted để material thay đổi rõ ràng. Với GLB dùng vật liệu dùng chung, cần tránh sửa một material làm mọi bản sao đổi màu; học ở Level 06.

## Bài 05.3 — Camera một bước

1. Tạo pose gồm position và target cho mỗi step, coi đây là đề xuất cấu hình cần thống nhất.
2. Đặt camera ngay vào pose để hiểu trước.
3. Sau đó nội suy từ pose bắt đầu tới pose đích trong thời lượng cố định.
4. Tạm ngừng thao tác OrbitControls khi camera tự di chuyển; cập nhật target và cho phép lại sau khi kết thúc theo UX đã chọn.

Gợi ý 1: camera.position là nơi đứng; target là nơi nhìn. Chỉ đổi vị trí chưa bảo đảm camera nhìn đúng vật.
Gợi ý 2: dùng progress như Level 02; chuyển chậm. Không để hai bộ điều khiển cùng ghi camera một lúc.

## Bài 05.4 — Ghép animation và nút

Start chạy bước hiện tại; Pause giữ thời gian/vị trí/camera; Replay bước đưa cả ba về điểm đầu; Replay toàn bộ về step đầu. Next/Previous dừng animation cũ, reset bước mới, cập nhật câu hướng dẫn/highlight/camera nhất quán. Không để timer cũ hoàn thành rồi đổi sai step.

Bài tập: pause giữa cú nhảy, Next, Previous, Replay; ghi trạng thái đúng mà bạn mong đợi. Autoplay tất cả bước chưa bắt buộc.

## Bài 05.5 — Mở rộng đủ hoạt động

Thêm: toàn cảnh/mục tiêu → chuẩn bị → hurdle → hoop → vòng cone → finish → điều kiện hoàn thành/cách tính điểm. Nhân vật primitive chỉ chạy đường định sẵn. Hiển thị kết quả mẫu ghi rõ “Ví dụ minh họa”, không nhầm với kết quả thực của Child.

## Checkpoint

- [ ] Có Start/Pause/Next/Previous/Replay bước và Replay toàn bộ.
- [ ] Đổi bước giữa chừng không để animation cũ chạy tiếp.
- [ ] Highlight và camera luôn theo đúng step.
- [ ] Đủ trình tự từ đầu tới cách tính điểm, câu ngắn dễ đọc.
- [ ] Không có gameplay hay điều khiển nhân vật bằng bàn phím.
