# Level 04 — Dựng scene từ JSON

**Trước khi học:** Qua Level 03; chưa cần backend hay animation interpreter.

**Đường dẫn:** `/learn/level-04-json`.

## Mục tiêu

Tạo scene tĩnh từ dữ liệu. Chưa chạy steps. JSON chỉ mô tả vật nào, ở đâu; code renderer vẫn chịu trách nhiệm dựng vật.

File làm bài: `src/learning/level-04-json/Exercise.tsx`. Dữ liệu gợi ý: `scene.sample.json` cùng thư mục. Đây là fixture học tập, không phải contract backend đã chốt.

Giải thích chi tiết luồng chạy của các file: [`Code-Flow.md`](./Code-Flow.md).

## Cấu trúc gần production dùng trong bài

```text
level-04-json/
├── Exercise.tsx                    # Server Component: nạp và kiểm tra JSON
├── scene.sample.json               # Fixture scene thứ nhất
├── scene.second.json               # Fixture kiểm tra khả năng tái sử dụng
├── helpers/
│   ├── scene.types.ts              # Kiểu dữ liệu đã được xác nhận
│   ├── validate-scene.ts           # unknown -> SceneData hoặc danh sách lỗi
│   └── model-registry.ts           # modelId -> component primitive
└── components/
    ├── scene-primitives.tsx         # Các model primitive tái sử dụng
    ├── SceneRenderer.tsx            # Render SceneObject[] bằng registry
    └── SceneExperience.tsx          # Client boundary chứa Canvas và UI chọn scene
```

Luồng xử lý:

```text
JSON thô (unknown)
  -> validateScene
  -> SceneData đã an toàn
  -> SceneExperience (Canvas)
  -> SceneRenderer map từng object
  -> getModelComponent(modelId)
  -> primitive tương ứng hoặc UnknownModel
```

`Exercise.tsx` không có `'use client'`: fixture được kiểm tra trước khi truyền vào phần WebGL. `SceneExperience.tsx` là client boundary nhỏ nhất vì Canvas, theme và selector cần trình duyệt. Dữ liệu đi qua boundary chỉ gồm object/array/string/number nên có thể serialize. Khi nối backend ở Level 08, thay nguồn JSON nhưng giữ nguyên validator và renderer.

## Bài 04.1 — Từ mảng sang mesh

1. Tạo mảng hai object id khác nhau.
2. Dùng map để render từng object; key là `id`.
3. Tạo registry `modelId -> component primitive`, ví dụ hurdle_primitive -> Hurdle.
4. Đổi vị trí trong mảng, xác nhận renderer không cần sửa.

Gợi ý 1: id là một object cụ thể; modelId là loại asset/template. Hai hurdle có thể chung modelId nhưng phải khác id.
Gợi ý 2: đừng dùng modelId làm key hoặc khóa để highlight khi có nhiều bản sao.

## Bài 04.2 — Đọc file JSON

Import `scene.sample.json`. Dùng trường objects trước; giữ nguyên các field steps/mode để học tiếp. Một renderer chung có thể render component chuyên biệt theo registry.

## Bài 04.3 — Dữ liệu không hợp lệ

Thêm field lạ: bỏ qua field chưa hỗ trợ. Thử modelId chưa biết: có placeholder/nhãn, không crash cả trang. Thử id trùng hoặc position sai: báo dữ liệu không hợp lệ và dùng fallback phù hợp. Không nhầm “bỏ qua field lạ” với “chấp nhận mọi dữ liệu sai”.

Gợi ý: kiểm tra schemaVersion, id duy nhất, position là ba số hữu hạn. Version không hỗ trợ có thông báo/fallback; không tự đoán schema mới.

## Bài 04.4 — Tái dùng

Tạo scene thứ hai đổi số/vị trí obstacle. Cùng SceneRenderer hiển thị được. Chưa cần hoạt động khác hoặc backend.

## Checkpoint

- [ ] Đổi JSON thì số lượng/vị trí vật thay đổi.
- [ ] Hai vật chung modelId vẫn có id riêng.
- [ ] Field lạ không làm hỏng scene, dữ liệu bắt buộc sai được xử lý.
- [ ] Renderer không chứa một scene được copy riêng cho mỗi activity.

Đối chiếu Rule_3D mục 5–6. Camera và cấu trúc animation chi tiết trong fixture là đề xuất cần thống nhất ở Level 05/08.
