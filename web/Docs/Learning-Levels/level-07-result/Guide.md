# Level 07 — Result Mode từ dữ liệu mẫu

**Trước khi học:** Qua Level 05; có thể học song song Level 06 nếu asset chưa sẵn sàng.

**Đường dẫn:** `/learn/level-07-result`.

## Mục tiêu

Result Mode là trình bày dữ liệu đã ghi nhận; không phát lại tưởng tượng chuyển động thật của Child. Đây là bài riêng với Guide, dùng cùng scene/registry.

File làm bài: `src/learning/level-07-result/Exercise.tsx`. Có `result-minimal.sample.json` và `result-detailed.sample.json`. Các fixture là dữ liệu mẫu, chưa phải dữ liệu trẻ thật hay API đã triển khai.

## Bài 07.1 — Chỉ score và duration

Đọc fixture minimal, hiển thị điểm và giây. Các obstacle không có dữ liệu completion giữ nhãn “Chưa có dữ liệu”; không đánh tất cả xanh hoặc tự diễn cú nhảy của trẻ.

Gợi ý: 0 là giá trị hợp lệ. Dùng kiểm tra null/undefined, không dùng if(score) để kết luận thiếu dữ liệu.

## Bài 07.2 — Kết quả chi tiết

Từ completedObjectIds, failedObjectIds và penalties, dựng nhãn/trạng thái cho object id tương ứng. Quy ước đề xuất: xanh đạt, vàng cảnh báo/penalty, đỏ lỗi, xám không có dữ liệu; thêm chữ/icon.

Gợi ý: “có penalty” không tự chứng minh “không hoàn thành”. Phải thống nhất quan hệ các trạng thái theo dữ liệu nghiệp vụ. Nếu id không nằm trong scene, ghi rõ dữ liệu không đối chiếu được, không đoán obstacle gần nhất.

## Bài 07.3 — Guide và Result

Đổi mode bằng nút UI. Khi sang Result, dừng animation Guide; không mang highlight step đang chạy sang trạng thái kết quả. Đổi lại Guide thì khởi tạo trạng thái theo quy ước rõ ràng. Asset/registry dùng chung.

## Bài 07.4 — Thiếu và mâu thuẫn

Thử score=0, duration=0, field thiếu, penalty id lạ và completion/failed mâu thuẫn. Chọn thông báo/fallback; ghi câu hỏi cần backend trả lời thay vì tự tạo một kết quả mới. Không tự tính lại điểm chính thức bằng công thức frontend khi backend là nguồn kết quả.

## Checkpoint

- [ ] Fixture minimal chỉ hiển thị thông tin có thật.
- [ ] Fixture detailed highlight đúng object id và nhãn.
- [ ] Dữ liệu thiếu không thành “thất bại”; số 0 vẫn hiển thị.
- [ ] Đổi mode không để animation cũ chạy tiếp.
- [ ] Không suy đoán quỹ đạo, tư thế, thao tác thực tế.

Fixture detailed dùng hurdle_01, hoop_01 và cone_01 của scene đầy đủ ở Level 05. Nếu đang dùng scene hai bước Level 04, hãy bổ sung object tương ứng trong cấu hình hoặc dùng fixture minimal trước; không giả định id vắng mặt vẫn được đối chiếu.
