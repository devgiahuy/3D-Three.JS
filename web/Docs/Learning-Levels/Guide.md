# Cách dùng khu học tập

## Mở bài

Chạy `npm run dev` trong `D:/Capstone/3D-Three.JS/web`, mở `/learn`. Trang cũ `/` vẫn dùng để xem Bài 1–4. Mỗi level có một đường dẫn `/learn/<tên-thư-mục>` và một `Exercise.tsx` để làm bài.

## Ba nơi có nhiệm vụ khác nhau

| Nơi | Nhiệm vụ |
|---|---|
| `Docs/Learning-Levels/<level>/Guide.md` | Đọc đề, giải thích, gợi ý và checkpoint |
| `src/learning/<level>/Exercise.tsx` | Sửa code, chạy và quan sát |
| `Docs/Learning-Levels/<level>/Notes.md` | Ghi dự đoán, kết quả, lỗi và điều chưa hiểu |

Level 02 có sáu file `Exercise.tsx` con. File `Exercise.tsx` ngoài cùng chỉ chọn bài. Khung `shared/VanillaScene.tsx` lo canvas/camera/light/resize/cleanup; các công thức chuyển động ở file con để bạn đọc một ý mỗi lần. Khi đã hiểu công thức, đọc phần vòng lặp trong khung để hiểu nó được gọi thế nào.

## Trạng thái starter

Level 01 và 02 có code chạy để quan sát, kèm nhiệm vụ tự sửa. Level 03–08 có khung workspace và đề bài; bạn sẽ viết dần khi tới level. Chúng không phải lời giải hoàn chỉnh hoặc viewer đã nghiệm thu. Chưa cần cài R3F ở Level 02.

## Không nhìn code mà tự hỏi

- Đối tượng nào đang thay đổi? Thuộc tính nào? Đơn vị gì?
- Giá trị đầu/cuối là bao nhiêu?
- Ai gọi hàm cập nhật, khi nào gọi?
- Khi pause, biến thời gian nào dừng?
- Khi replay, vị trí/góc/thời gian nào phải reset?

## Khi mắc lỗi

Ghi bài đang làm, file vừa sửa, kỳ vọng, thực tế và lỗi đầu tiên trong console. Đọc gợi ý 1 trước; vẫn chưa được mới đọc gợi ý 2. Tách bài thành một object, một trục, một công thức. Không nhờ AI làm toàn bộ bài trước khi tự dự đoán/sửa một biến.

## Tích hợp Next.js

Canvas dùng browser API nên đặt trong Client Component; khởi tạo WebGL trong effect. `use client` không biến mọi dòng code ngoài effect thành an toàn với SSR. Trong R3F, các hook useFrame/useThree nằm bên trong Canvas. Thay đổi UI theo bước dùng state; tọa độ mỗi frame dùng ref/object.
