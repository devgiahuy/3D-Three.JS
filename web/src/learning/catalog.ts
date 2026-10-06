export const levels = [
  {
    "id": "level-00-start",
    "number": "00",
    "title": "Cách học và môi trường",
    "focus": "Chạy project, tìm file, sửa một giá trị và ghi lại điều quan sát được.",
    "before": "Bắt đầu ở đây một lần; môi trường Next.js và Three.js đã có."
  },
  {
    "id": "level-01-objects",
    "number": "01",
    "title": "Ôn object và transform",
    "focus": "Tự dựng vật thể, đặt chúng trên sàn và hiểu group cha–con.",
    "before": "Đã đọc ghi chú Bài 1–4; tự kiểm tra trước khi đánh dấu đạt."
  },
  {
    "id": "level-02-animation",
    "number": "02",
    "title": "Hiểu chuyển động từ đầu",
    "focus": "Vòng lặp → thời gian → xoay → đi thẳng → lên xuống → vượt thanh chắn.",
    "before": "Đây là level nên tập trung hiện tại. Chỉ cần biết tạo mesh và đổi position."
  },
  {
    "id": "level-03-r3f",
    "number": "03",
    "title": "Chuyển sang React Three Fiber",
    "focus": "Viết lại một bài đã hiểu bằng JSX, useRef và useFrame.",
    "before": "Qua Level 02; hiểu React props, state, ref và cleanup cơ bản."
  },
  {
    "id": "level-04-json",
    "number": "04",
    "title": "Dựng scene từ JSON",
    "focus": "Phân biệt object id với modelId; tạo scene tĩnh từ cấu hình.",
    "before": "Qua Level 03; chưa cần backend hay animation interpreter."
  },
  {
    "id": "level-05-guide",
    "number": "05",
    "title": "Guide Mode theo từng bước",
    "focus": "Kết hợp bước, highlight, camera và chuyển động đã học.",
    "before": "Qua Level 04; làm hai bước trước rồi mở rộng đủ Mini Obstacle Course."
  },
  {
    "id": "level-06-assets",
    "number": "06",
    "title": "Model GLB và clip nhân vật",
    "focus": "Thay primitive bằng asset có nguồn rõ ràng, dùng clip có sẵn.",
    "before": "Guide primitive đã chạy; chưa cần tự dựng model hoặc tự rig."
  },
  {
    "id": "level-07-result",
    "number": "07",
    "title": "Result Mode từ dữ liệu mẫu",
    "focus": "Hiển thị đúng điểm, thời gian, completion và penalty thực sự được cung cấp.",
    "before": "Qua Level 05; có thể học song song Level 06 nếu asset chưa sẵn sàng."
  },
  {
    "id": "level-08-integration",
    "number": "08",
    "title": "Tích hợp, fallback và UX",
    "focus": "Tải đúng lúc, chịu được lỗi, dọn tài nguyên và kiểm tra đủ Rule_3D.",
    "before": "Guide và Result đã chạy với JSON local; backend có thể ghép ở đây."
  }
] as const;

export type LevelId = (typeof levels)[number]["id"];
