1. Scene

- nơi chứa mọi thứ
- Scenegraph: là một cấu trúc dữ liệu dạng cây để biểu diễn các đối tượng trong scene
- Mesh: vật thể
- Light: Nguồn sáng
- scene.add(...): thêm vật thể vào scene
- scene.remove(...): xóa vật thể khỏi scene
- scene.children: danh sách các vật thể trong scene

2. Camera
   - là mắt nhìn object
   - **PerspectiveCamera**:
     - Mô phỏng mắt người (vật ở xa sẽ nhỏ lại, vật ở gần sẽ to ra).
     - Parameters: `fov` (góc nhìn), `aspect` (tỷ lệ khung hình), `near` (điểm gần nhất thấy), `far` (điểm xa nhất thấy).
   - **OrthographicCamera**:
     - Giữ nguyên kích thước vật thể bất kể khoảng cách (thường dùng cho game 2D, isometric hoặc bản vẽ kỹ thuật).
     - Parameters: `left`, `right`, `top`, `bottom` (vùng nhìn thấy).

3. Renderer (Bộ dựng hình)
   - **Vẽ lên đâu:** Renderer tính toán và **vẽ trực tiếp lên thẻ HTML** **<canvas>** trên trang web của bạn
   - **Nhiệm vụ:** Nhận đầu vào là **Scene** và **Camera**, sau đó sử dụng GPU (qua WebGL hoặc WebGPU) để tính toán màu sắc, ánh sáng, vật liệu và xuất ra khung hình hoàn chỉnh bằng lệnh:

   ```javascript
   renderer.render(scene, camera);
   ```

   💡 Tóm tắt mối liên hệ qua Code:
   // 1. Tạo không gian
   const scene = new THREE.Scene()
   // 2. Đặt góc nhìn
   const camera = new THREE.PerspectiveCamera(
   75, // góc nhìn
   window.innerWidth / window.innerHeight, // tỷ lệ khung hình
   0.1, // điểm gần nhất thấy
   1000 // điểm xa nhất thấy
   )
   // 3. Tạo bộ vẽ và gắn thẻ <canvas> vào trang web
   const renderer = new THREE.WebGLRenderer();
   document.body.appendChild(renderer.domElement);

// vẽ Scên theo góc nhìn của Camera lên Canvas
renderer.render(scene, camera);

### 2\. Các Geometry phổ biến (`Primitives`)

Trong **Three.js Docs** (mục _Geometries_) và **Three.js Manual** (mục _Primitives_), bạn sẽ thấy các dạng hình học cơ bản sẵn có[2][4]:

- **BoxGeometry**: Khối hình hộp chữ nhật hoặc lập phương[2].
- **SphereGeometry**: Khối hình cầu[2].
- **CylinderGeometry**: Khối hình trụ[2].
- **ConeGeometry**: Khối hình nón[2].
- **TorusGeometry**: Khối hình hình bánh hình vòng (donut)[2].
- **PlaneGeometry**: Mặt phẳng 2D trong không gian 3D[2].

---

### 3\. Các Material phổ biến (`Materials` &amp; `Material Table`)

Trong **Three.js Docs** (mục _Materials_) và **Three.js Manual** (mục _Materials_ và _Material Table_), các loại vật liệu được phân chia theo cách chúng tương tác với ánh sáng[3]:

- **MeshBasicMaterial**:
  - **Đặc điểm:** Không phản ứng với ánh sáng (flat shading)[3][4].
  - **Sử dụng:** Giúp hiển thị màu sắc hoặc hình ảnh nguyên bản mà **không cần tạo thêm nguồn sáng (** **Light** **)** trong Scene[3][4].
- **MeshStandardMaterial**:
  - **Đặc điểm:** Vật liệu tiêu chuẩn PBR (_Physically Based Rendering_) giúp mô phỏng chất liệu thực tế (kim loại, nhựa, gỗ...)[3][4].
  - **Sử dụng:** **Bắt buộc phải có nguồn sáng (** **Light** **)** trong Scene thì mới hiển thị được độ đổ bóng và phản xạ[3].

### 1\. Phân biệt 3 loại đèn phổ biến (`Lights`)

- **AmbientLight** **(Ánh sáng môi trường / Ánh sáng nền):**[1]
  - **Đặc điểm:** Tỏa đều ánh sáng lên **tất cả mặt** của mọi vật thể trong Scene từ mọi hướng.
  - **Tính chất:** Không có vị trí cụ thể, **không tạo bóng đổ** (no shadows).
  - **Mục đích:** Dùng làm ánh sáng nền nhẹ để các vùng tối của vật thể không bị đen hoàn toàn.
- **DirectionalLight** **(Ánh sáng có hướng / Ánh nắng mặt trời):**[1]
  - **Đặc điểm:** Các tia sáng chiếu **song song** theo một hướng nhất định từ khoảng cách xa vô tận (giống như ánh mặt trời).[1]
  - **Tính chất:** Tạo hiệu ứng sáng/tối rõ rệt giữa các mặt và **có thể tạo bóng đổ**.[1]
  - **Mục đích:** Dùng làm nguồn sáng chính (Key Light) cho khung cảnh.
- **PointLight** **(Ánh sáng điểm / Đèn cục bộ):**[1]
  - **Đặc điểm:** Phát ra ánh sáng từ **một điểm** lan tỏa ra mọi hướng xung quanh (như bóng đèn tròn, ngọn nến, hay đom đóm).[1]
  - **Tính chất:** Cường độ sáng sẽ **giảm dần theo khoảng cách** (decay) và có thể tạo bóng đổ.
