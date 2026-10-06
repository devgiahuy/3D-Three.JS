# Level 00 — Cách học và môi trường

**Trước khi học:** Bắt đầu ở đây một lần; môi trường Next.js và Three.js đã có.

**Đường dẫn:** `/learn/level-00-start`.

## Mục tiêu

Biết chạy project, tìm file bài, đọc lỗi và phân biệt state/ref. Môi trường đã có Next.js, React, TypeScript và Three.js; không cần khởi tạo lại.

## Bài 00.1 — Chạy đúng thư mục

1. Mở terminal ở `D:/Capstone/3D-Three.JS/web`, chạy `npm run dev`.
2. Đọc cổng terminal báo, mở `/learn`.
3. Mở `/` để nhận ra Bài 1–4 cũ vẫn ở đâu.
4. Sửa dòng mô tả trong `src/learning/level-00-start/Exercise.tsx` và lưu.

Gợi ý: lỗi không tìm thấy package.json thường là terminal đang ở nhầm thư mục. Nếu đã có dev server thì dùng server đó; không cần mở thêm.

## Bài 00.2 — State và ref

Workspace có hai bộ đếm. Nút state tăng giá trị và giao diện đổi ngay. Nút ref tăng một giá trị nhưng không yêu cầu React vẽ lại; bấm state tiếp thì giá trị ref mới xuất hiện.

1. Dự đoán điều xảy ra khi bấm ref ba lần.
2. Quan sát. Sau đó bấm state một lần.
3. Giải thích: ref lưu giá trị có thể đổi mà không gây React render; state phục vụ UI.
4. Đổi bước tăng của state thành 2.

Đây là cơ sở cho animation: không cần yêu cầu React dựng lại toàn bộ giao diện cho mỗi tọa độ 60 lần/giây. Vẫn dùng state cho bước hiện tại, mode hoặc nhãn nút.

## Đọc khung scene theo lớp

Trong `shared/VanillaScene.tsx`: tìm scene/camera/renderer → subject → animate → resize → cleanup. Không cần thuộc toàn bộ hôm nay. Tên biến và comment cho biết phần nào là môi trường, phần nào là chuyển động.

## Checkpoint

- [ ] Mở được `/learn` và tìm đúng file khi chọn bài.
- [ ] Sửa được một dòng rồi nhìn thấy thay đổi.
- [ ] Giải thích được sự khác nhau state/ref bằng bộ đếm.
- [ ] Biết gửi lỗi console đầu tiên và đoạn vừa sửa khi cần giúp.
