# Level 02 — Hiểu chuyển động từ đầu

**Điểm học hiện tại:** bạn biết tạo object; animation còn chưa chắc. Học theo thứ tự 01→06, không cần đọc GLB/JSON/Guide Mode lúc này.

**Mở bài:** `/learn/level-02-animation`. Trang có bộ chọn sáu bài. File ngoài cùng `src/learning/level-02-animation/Exercise.tsx` chỉ chọn bài; công thức nằm trong `01-static` đến `06-jump`.

## 1. Animation thực chất là gì?

Bạn đã biết `cube.position.x = 2`: đặt vật ở x=2. Animation là cập nhật position/rotation theo thời gian, sau đó vẽ lại scene.

```text
Tạo scene và cube một lần
        ↓
Đến frame mới → tính thời gian → cập nhật cube → renderer.render
        ↑                                           ↓
        └──────── requestAnimationFrame lần tới ─────┘
```

`requestAnimationFrame` nhờ trình duyệt gọi hàm trước lần vẽ tiếp. Số lần gọi phụ thuộc màn hình/máy; không luôn là 60. Vì vậy ta tính chuyển động theo giây. Chưa cần shader, physics, skeleton hoặc một animation engine.

## 2. Ba biến thời gian

| Biến | Nghĩa | Ví dụ |
|---|---|---|
| `delta` | Số giây của bước cập nhật hiện tại | khoảng 0.0167 giây ở 60Hz |
| `elapsed` | Tổng số giây bài tập đã thực sự chạy | 0, 0.25, 1, 2... |
| `progress` | Tỷ lệ đã đi trong đoạn có thời lượng: min(elapsed/duration,1) | 0→1 |

Khung bài dừng **elapsed của bài tập** khi Pause, không lấy thời gian đồng hồ ngoài đời rồi mong nó tự dừng. Nút “Tiến 0.25 giây” giúp nhìn từng mốc mà không cần phản xạ bấm Pause đúng lúc.

Khung có giới hạn delta=0.1 giây để tránh bước nhảy lớn khi trình duyệt bị gián đoạn; khi tab ẩn, nó bỏ khoảng thời gian ẩn. Đây là quy ước bài học, không phải cam kết elapsed luôn bằng đồng hồ ngoài đời trong mọi điều kiện. Đơn vị scene là đơn vị quy ước, chưa mặc định mét.

## 3. Bài 01 — Vật đứng yên

**File:** `src/learning/level-02-animation/01-static/Exercise.tsx`.

**Mục tiêu:** phân biệt “đặt vị trí” và “thay đổi liên tục”.

1. Chưa bấm Chạy: cube ở giữa, chân trên sàn.
2. Đổi `cube.position.x = 0` thành 2, lưu và quan sát.
3. Đổi thành -2, đoán bên trái/phải trước khi xem.
4. Bấm Chạy: thời gian tăng nhưng cube không đi vì hàm update chưa đổi thuộc tính.
5. Viết một câu: “Có vòng lặp render không có nghĩa object tự chuyển động”.

Gợi ý 1: `position.x` thay đổi trục ngang; `position.y` trục cao.
Gợi ý 2: tạo cube cao 1, tâm y=0.5 để chân ở sàn y=0.

**Đạt khi:** tự đặt cube vào (-1,0.5,0), giải thích được vì sao đứng yên dù elapsed tăng.

## 4. Bài 02 — Xoay quanh một trục

**File:** `02-rotation/Exercise.tsx` trong thư mục level này.

Code mẫu dùng `cube.rotation.y = speed * elapsed`. Speed đơn vị radian/giây. Với speed=π/2, sau 1 giây cube xoay 90 độ.

1. Bấm “Tiến 0.25 giây” bốn lần: elapsed=1, góc khoảng π/2.
2. Đổi speed từ π/2 sang π/4: cùng 1 giây chỉ xoay 45 độ.
3. Đổi `rotation.y` thành `rotation.x`; quan sát trục xoay thay đổi.
4. Thử viết biến thể tích lũy `rotation.y += speed * delta`.
5. Replay rồi so sánh hai cách.

Gợi ý 1: cách gán từ elapsed tính lại góc tại mốc thời gian; cách `+=` cộng bước nhỏ mỗi lần.
Gợi ý 2: đừng giữ cả hai công thức cùng lúc. `+=0.01` là 0.01 mỗi frame, nên máy nhiều frame sẽ xoay nhanh hơn.

**Đạt khi:** tự sửa để vật xoay quanh Z với tốc độ π/4 rad/s; giải thích được đơn vị và tác dụng delta.

## 5. Bài 03 — Đi thẳng

**File:** `03-linear/Exercise.tsx`.

```ts
cube.position.x = startX + speed * elapsed;
```

startX=-2, speed=1 đơn vị/giây. Sau 1 giây x=-1; sau 2 giây x=0. Cube không cần hướng quay để đi ngang trong bài này.

1. Dự đoán x tại 0, 1, 2, 3 giây; ghi bảng trước.
2. Tiến từng 0.25 giây để kiểm tra.
3. Đổi speed thành 0.5 rồi thành -1; giải thích dấu âm.
4. Thử đi trên Z thay vì X, giữ Y cố định.
5. Khung dừng thời gian sau 4 giây; nếu đổi speed, điểm cuối thay đổi. Đây là điểm khác với bài 04 có đích cố định.

**Đạt khi:** tự làm vật đi từ x=1 với speed=-0.5; tính được vị trí sau 2 giây mà không chạy.

## 6. Bài 04 — Đi A→B trong thời gian cố định

**File:** `04-duration/Exercise.tsx`.

Mục tiêu: x=-2 tới x=2 trong 4 giây, tới đích thì dừng.

```ts
const progress = Math.min(elapsed / duration, 1);
cube.position.x = startX + (endX - startX) * progress;
```

| elapsed | progress | x |
|---|---|---|
| 0s | 0 | -2 |
| 1s | 0.25 | -1 |
| 2s | 0.5 | 0 |
| 3s | 0.75 | 1 |
| 4s | 1 | 2 |

1. Tiến từng mốc, đối chiếu bảng.
2. Đổi duration=2: đích vẫn x=2, chuyển động nhanh hơn.
3. Đổi endX=3: quãng đường dài hơn, thời lượng giữ nguyên.
4. Pause giữa chừng, chờ 3 giây, Chạy lại: vật đi tiếp từ vị trí đang dừng.
5. Replay: elapsed/progress/position về trạng thái đầu, sau đó bấm Chạy lại.
6. Tự đổi A=(−2,0.5,−1), B=(2,0.5,1): nội suy cả X và Z bằng cùng progress.

Gợi ý 1: progress là phần quãng đường đã hoàn thành, không phải tọa độ.
Gợi ý 2: không nhân thêm delta vào công thức position đã tính từ elapsed/progress. Delta chỉ dùng để cộng elapsed trong khung.

**Đạt khi:** tự viết A→B với đầu/đích/thời lượng khác và giải thích được ba nút Play/Pause/Replay.

## 7. Bài 05 — Lên xuống với sin

**File:** `05-wave/Exercise.tsx`. Chỉ tới đây khi đã hiểu bài 04.

```ts
cube.position.y = baseY + amplitude * Math.sin(elapsed * angularSpeed);
```

sin tạo giá trị từ -1 tới 1; amplitude quyết định biên độ, baseY là độ cao giữa. Chu kỳ = 2π/angularSpeed giây. Bài mẫu baseY=1.5, amplitude=0.5 nên tâm y nằm trong [1,2], chân cube không xuyên sàn.

1. Đổi amplitude=0 rồi 0.25: độ nhấp nhô thay đổi, không phải tốc độ.
2. Đổi angularSpeed để nhanh/chậm.
3. Tạm dừng tại một đỉnh; Chạy lại không nhảy về vị trí khác.
4. Tự chọn baseY để vật không xuyên sàn.

Gợi ý: “lên xuống lặp lại” khác “nhảy một lần”. Chưa cần sin/cos cho quỹ đạo vòng tròn hoặc ánh sáng.

**Đạt khi:** phân biệt baseY/amplitude/tốc độ và biết vì sao vật có thể xuyên sàn nếu chọn sai độ cao.

## 8. Bài 06 — Vượt một thanh chắn bằng primitive

**File:** `06-jump/Exercise.tsx`.

Cube đóng vai nhân vật minh họa. Thanh chắn đứng yên. Đường đi định sẵn từ x=-2 tới x=2; không có physics hoặc phát hiện va chạm.

```ts
cube.position.x = startX + (endX - startX) * progress;
cube.position.y = groundY + jumpHeight * Math.sin(Math.PI * progress);
```

progress=0: ở đầu và y=groundY. progress=0.5: giữa đường và cao nhất. progress=1: ở đích và trở về groundY. Sin từ 0 tới π chỉ tạo **một vòm**, khác vòng nhấp nhô bài 05.

1. Quan sát thanh ngang ở x=0, y=1.0, dày 0.15; cube cao 1, groundY=0.5.
2. Với jumpHeight=1.5, ở giữa cube tâm y=2.0, chân y=1.5, cao hơn thanh. Đây là minh họa kiểm tra bằng tọa độ, chưa có collision engine.
3. Đổi jumpHeight=0.2: nhìn thấy cube có thể đi xuyên thanh. Giải thích vì không có physics.
4. Trả jumpHeight=1.5; đổi duration=6 để quan sát chậm.
5. Pause ở đỉnh, Replay và Chạy lại. Dự đoán trước vị trí mỗi lần.
6. Tự đổi sang di chuyển theo Z qua một hurdle hướng phù hợp; đừng xoay camera và sửa công thức cùng lúc.

Gợi ý 1: vận động X/Z và độ cao Y dùng chung progress để xảy ra cùng một thao tác.
Gợi ý 2: thanh chắn là nền minh họa; không animate cả sân khi muốn nhân vật di chuyển.

**Đạt khi:** tự giải thích được vì sao cube lên rồi xuống trong một lần, reset về đâu và vì sao đây chưa phải game có physics.

## 9. Đọc vòng lặp sau khi đã hiểu công thức

File: `src/learning/shared/VanillaScene.tsx`.

```ts
const rawDelta = previous === null ? 0 : (timestamp - previous) / 1000;
previous = timestamp;
const delta = running ? Math.min(rawDelta, 0.1) : 0;
elapsed += delta;
update(subject, { delta, elapsed, progress });
renderer.render(scene, camera);
requestAnimationFrame(animate);
```

Đây là phiên bản giải thích rút gọn; code thật còn clamp duration, nút tiến từng mốc, resize và cleanup. `timestamp` đơn vị mili giây, chia 1000 thành giây. Khung vẫn cập nhật timestamp khi Pause để resume không cộng cả khoảng đã dừng. Object tạo một lần, không tạo lại mỗi frame. UI số liệu chỉ cập nhật theo nhịp chậm hơn; không dùng React state để giữ tọa độ mỗi frame.

Nút Replay reset thời gian và transform ban đầu; nó dừng để bạn quan sát, bấm Chạy để phát lại. Nhãn “Tiến 0.25 giây” là công cụ học, không phải nút bắt buộc trong sản phẩm cuối.

## 10. Checkpoint cả level

- [ ] Phân biệt tạo object, vòng lặp render và cập nhật transform.
- [ ] Tính được x tại một thời điểm từ speed/elapsed.
- [ ] Phân biệt delta, elapsed, progress và đơn vị.
- [ ] Tự viết A→B trong duration, tới đích không vượt quá.
- [ ] Pause không làm elapsed tăng, Replay về trạng thái đầu.
- [ ] Tự tạo được một vòm nhảy minh họa đơn giản.
- [ ] Ghi một biến thể tự viết và giải thích vào Notes.

Khi đạt, sang R3F để viết lại công thức bằng useFrame. Bài Mini Obstacle Course nhiều bước chỉ ghép sau Level 04–05.

Đọc thêm đúng phần cần: [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame), [R3F Basic Animations](https://r3f.docs.pmnd.rs/tutorials/basic-animations).
