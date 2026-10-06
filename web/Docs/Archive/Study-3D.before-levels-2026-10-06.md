Dưới đây là lộ trình cụ thể, được thiết kế cho tình huống của team (mạnh backend, mới bắt đầu 3D, mục tiêu cuối = render được "Mini Obstacle Course" theo Scene Config JSON).

A. Kiến thức nền — lộ trình 2–3 tuần
Nguyên tắc chung: học bằng cách dựng, đừng học lý thuyết suông. Mỗi ngày phải có 1 scene chạy được.

Tuần 1 — Nền tảng 3D + Three.js
Chỉ cần nắm 6 khái niệm, đủ để tự tin trước khi vào R3F:

Scene / Camera / Renderer: ai nhìn gì, vẽ lên đâu.
Mesh = Geometry + Material: hình dạng + bề mặt (box, sphere, cone, torus...).
Light: meshStandardMaterial cần ánh sáng mới hiện — thiếu light = màn hình đen (lỗi số 1 của người mới).
Hệ tọa độ + Transform: position / rotation / scale (rotation tính bằng radian).
Animation loop: dùng delta nhân vào chuyển động, không dùng số cố định (tránh phụ thuộc fps).
Mô hình thực tế: Three.js dùng useFrame + ref mutate trực tiếp, không trigger re-render React.
Nguồn học (miễn phí/giá rẻ):

threejs.org/manual — "Discover Three.js" (bản miễn phí, đầy đủ, có Tips & Tricks).
Three.js Journey (threejs-journey.com) — được đánh giá là nguồn tốt nhất, các lesson đầu (02, 05, 06, 08) miễn phí; có cả chapter R3F riêng. Đáng đầu tư ~$95 nếu team quyết tâm làm 3D sâu.
threejs.org docs + examples làm tài liệu tra cứu song song.
Tuần 2 — React Three Fiber (R3F) + drei
Điều kiện tiên quyết: biết React hooks (nếu chưa vững, xem lại React docs mục hooks trước — R3F dựa toàn bộ trên đó).
Tư duy cốt lõi: R3F = "viết JSX, nó render ra Three.js". Mọi class của Three.js thành thẻ camelCase (<mesh>, <boxGeometry>, <ambientLight>), args = tham số constructor.
Học 3 helper thiết yếu trước: OrbitControls, useGLTF, Html — cộng Suspense để lazy-load model. Đây đúng là những gì bạn cần cho Obstacle Course.
Mẹo lỗi thường gặp cần biết trước:
Canvas phải có cha có chiều cao (0px = không hiện gì).
Các hook R3F (useFrame, useLoader) chỉ chạy bên trong Canvas.
Next.js App Router: Canvas phải nằm trong Client Component ("use client").
Nguồn học:

r3f.docs.pmnd.rs (docs chính thức).
Wawa Sensei — "React Three Fiber: The Ultimate Guide" (miễn phí, không cần biết 3D trước, dạy đúng kiểu "học bằng project").
R3F Chapter trong Three.js Journey.
Tuần 3 — Asset pipeline + kỹ năng cho đúng project
Hiểu GLB/GLTF: "JPEG của 3D", gói gọn mesh + material + texture + animation trong 1 file.
useGLTF load model; gltfjsx sinh ra component typed để animate/đổi màu từng bộ phận.
Raycasting cho tính năng "click obstacle → hiện thông tin" (FR-3D-06).
Animation đơn giản: useFrame + lerp, hoặc gsap cho timeline steps (phát/pause — đúng nhu cầu animationScript).
Tối ưu: React.lazy + Suspense, nén GLB bằng gltf-transform (Draco/Meshopt) để giảm đa giác cho web.
📌 Sau tuần 3, bạn đã đủ khả năng dựng renderer đọc Scene Config JSON. Phần còn lại (Mapper backend) không phụ thuộc 3D.

B. Dùng AI để tạo model 3D
Có 2 cách dùng AI, cách thứ 2 hiệu quả hơn cho team này:

B1. AI tạo model (text/image → 3D)
Các tool đáng dùng năm 2026:

Tool Điểm mạnh Free tier ⚠️ Giấy phép
Meshy Cân bằng nhất: text+image→3D, PBR, GLB, nhiều style (Cartoon/Voxel) 100 credits/tháng (~5 lần gen) Được dùng thương mại (CC BY 4.0, phải ghi công)
Tripo Nhanh nhất (~10–30s), topology sạch, auto-rig 200–300 credits/tháng Free KHÔNG được dùng thương mại
Rodin (Hyper3D) Chất lượng cao nhất, quad-mesh chuẩn ít credits Phải trả phí mới có quyền thương mại
Lưu ý quan trọng cho đồ án:

Licensing khác nhau là bẫy số 1 — đọc kỹ trước khi dùng model cho demo/public. Meshy free tier an toàn nhất (chỉ cần ghi công Meshy).
Model AI tạo thường rất high-poly (~13k–20k mặt) → bắt buộc chạy qua gltf-transform (--decimate) để giảm xuống vài nghìn mặt cho web chạy mượt trên máy yếu.
Giữ style đồng nhất: dùng art style "Cartoon/Voxel" của Meshy, hoặc image-to-3D từ 1 ảnh tham chiếu để các vật thể cùng phong cách.
AI 3D chỉ nên dùng cho các item "điểm nhấn". Đừng phụ thuộc nó cho demo chính.
B2. AI viết/hỗ trợ CODE — cách dùng AI hiệu quả nhất cho team này
Vì team yếu frontend, AI coding assistant (Claude/Cursor/Copilot) là "trợ lý 3D" mạnh nhất:

Nhờ AI viết component R3F: "viết component React Three Fiber load GLB từ URL, có OrbitControls và click hiện label bằng Html" — AI làm rất tốt vì R3F là code declarative, pattern chuẩn.
Nhờ AI viết bộ interpreter cho animationScript (parse JSON → chạy useFrame/gsap).
Nhờ AI debug lỗi 3D (màn hình đen, model không hiện, texture đen...).
Nhờ AI sinh Scene Config JSON mẫu để test renderer mà không cần backend.
C. Workflow thực tế đề xuất cho project
Ngày 1 : cài môi trường → Canvas + 1 box màu + light + OrbitControls chạy được
Ngày 2-3 : dựng scene Obstacle Course bằng PRIMITIVE shapes
(hurdle=box, hoop=torus, cone, mat=box dẹt) — 3D "đủ xịn" ngay, không cần model
Ngày 4-5 : thêm click-raycast → hiện Html popup (độ khó/tuổi/thời gian)
Ngày 6-8 : thêm animationScript đơn giản (bóng bay qua các obstacle, play/pause/replay)
Song song : GLB cho từng vật thể — ưu tiên asset pack miễn phí (Quaternius/Kenney),
dùng Meshy free tier cho item đặc thù, rồi gltf-transform để nén
Sau đó : ghép pipeline Scene Config JSON từ backend (Mapper) vào renderer
Thứ tự ưu tiên nguồn model: primitive shapes → asset pack miễn phí → AI 3D gen → Blender. Nếu đã xong 3 bước đầu, bạn đã có đủ bản demo cho đồ án; AI 3D gen chỉ thêm phần "wow".
