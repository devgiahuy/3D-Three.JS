# Level 08 — Tích hợp, fallback và UX

**Trước khi học:** Guide và Result đã chạy với JSON local; backend có thể ghép ở đây.

**Đường dẫn:** `/learn/level-08-integration`.

## Mục tiêu

Ghép viewer vào trang activity/event để hướng dẫn, kết quả và core flow vẫn đọc/dùng được khi 3D không khả dụng. Đối chiếu toàn bộ Rule_3D, không mở rộng scope.

File làm bài: `src/learning/level-08-integration/Exercise.tsx`. Có thể thêm Activity3DViewer.tsx, FallbackContent.tsx và ErrorBoundary.tsx trong thư mục. Tái dùng các component đã làm ở Level 04–07.

## Bài 08.1 — Chỉ tải khi mở viewer

Hiển thị nội dung chính trước, người dùng bấm “Xem 3D” mới tải/mount viewer và asset. Dùng lazy/dynamic import theo môi trường Next.js đang cài. Suspense cho trạng thái đang tải; không tự thay cho trigger tải đúng lúc hoặc ErrorBoundary. Tránh preload tất cả GLB ở đầu trang nếu yêu cầu chỉ tải khi mở.

## Bài 08.2 — Fallback đầy đủ

Chuẩn bị chữ/ảnh/sơ đồ cho mục tiêu, từng bước, luật, tính điểm và dữ liệu kết quả tương ứng. Thử URL model sai, WebGL không hỗ trợ hoặc context bị mất, lỗi renderer/config và tải chậm. Có thông báo thân thiện, nút thử lại và nút chủ động bỏ qua 3D.

Gợi ý: loading là còn chờ; error là tải/khởi tạo thất bại. Fallback của Suspense không tự bắt mọi lỗi. Canvas có fallback WebGL; bổ sung ErrorBoundary và xử lý context phù hợp.

## Bài 08.3 — API và contract

Chốt schemaVersion, objectId/modelId, step/camera/action, dữ liệu Result và asset registry với backend. Mapper tên 3D Template Mapper. Thay import fixture bằng API; kiểm tra payload trước khi đưa vào viewer. Unknown field bỏ qua; version/field bắt buộc sai có thông báo/fallback.

Có thể giả lập Promise trễ/lỗi trước khi backend sẵn sàng. Không cần tạo payment/check-in API trong bài 3D.

## Bài 08.4 — UX

Nút lớn/nhãn rõ, mỗi step một hành động, camera chậm, thông tin trạng thái không chỉ có màu, bố cục mobile. Không tự phát âm thanh. Có lựa chọn chữ/ảnh để người dùng hiểu hướng dẫn mà không cần thao tác camera.

## Bài 08.5 — Hiệu năng và lifecycle

Chọn browser, điện thoại và laptop GPU tích hợp mục tiêu; ghi môi trường đo. Thống nhất budget tải asset, texture, draw calls, frame time và giới hạn bộ nhớ theo dữ liệu thực tế. Điều chỉnh DPR/shadow/effect khi cần. Đóng/mở viewer nhiều lần, kiểm tra rAF/listener/tween/mixer được dừng và tài nguyên được giải phóng đúng quyền sở hữu, không phá cache còn dùng.

Với R3F cân nhắc frameloop demand cho scene tĩnh và invalidate khi cần; học sau khi viewer đúng hành vi. Không cần tối ưu mọi primitive từ đầu.

## Checkpoint cuối

Đi từng tiêu chí 1–12 ở Rule_3D mục 10. Ghi PASS/FAIL, dữ liệu dùng, browser/thiết bị và evidence vào Notes. Những mục chưa làm không đánh PASS chỉ vì có trong roadmap. Core flow và nội dung chính hoạt động khi viewer lỗi. Target Ball/Bowling và click-popup chỉ làm sau MVP bắt buộc.

Đọc: [Canvas fallback](https://r3f.docs.pmnd.rs/api/canvas#errors-and-fallbacks), [Suspense](https://react.dev/reference/react/Suspense), [Pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls).
