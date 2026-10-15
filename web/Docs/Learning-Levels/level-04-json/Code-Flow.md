# Luồng code Level 04 — Dựng scene từ JSON

Tài liệu này giải thích luồng chạy của code trong `src/learning/level-04-json`. Mục tiêu là nhìn được dữ liệu đi từ JSON đến scene Three.js, file nào chịu trách nhiệm ở từng giai đoạn và lỗi được xử lý ở đâu.

## 1. Sơ đồ tổng quát

```text
scene.sample.json / scene.second.json
                 |
                 v
            Exercise.tsx
        nạp từng nguồn JSON thô
                 |
                 v
     helpers/validate-scene.ts
   kiểm tra schemaVersion, objects,
       id, modelId và position
          /              \
         /                \
        v                  v
 danh sách lỗi       SceneData an toàn
        |                  |
        v                  v
  giao diện lỗi       SceneExperience.tsx
                     chọn scene + tạo Canvas
                              |
                              v
                      SceneRenderer.tsx
                    map từng SceneObject
                              |
                              v
                  helpers/model-registry.ts
                     modelId -> component
                       /             \
                      /               \
                     v                 v
        scene-primitives.tsx       UnknownModel
          model được hỗ trợ       placeholder đỏ
```

## 2. Cấu trúc thư mục

```text
src/learning/level-04-json/
├── Exercise.tsx
├── scene.sample.json
├── scene.second.json
├── helpers/
│   ├── scene.types.ts
│   ├── validate-scene.ts
│   └── model-registry.ts
└── components/
    ├── scene-primitives.tsx
    ├── SceneRenderer.tsx
    └── SceneExperience.tsx
```

Quy ước trách nhiệm:

- JSON chỉ chứa dữ liệu, không chứa JSX hoặc logic render.
- `helpers` chứa type và logic dùng lại được.
- `components` chứa phần hiển thị React/R3F.
- `Exercise.tsx` là nơi ghép toàn bộ pipeline.

## 3. Bước 1 — JSON mô tả scene

Hai file nguồn là:

- `scene.sample.json`
- `scene.second.json`

Ví dụ một object:

```json
{
  "id": "hurdle_01",
  "modelId": "hurdle_primitive",
  "position": [0, 0, 3]
}
```

Ý nghĩa:

- `id` xác định một object cụ thể trong scene.
- `modelId` xác định loại model/component cần dựng.
- `position` xác định vị trí `[x, y, z]` của object.

JSON không biết `HurdlePrimitive` là component nào và cũng không trực tiếp tạo mesh. Việc biến `modelId` thành component thuộc trách nhiệm của registry và renderer.

Hai hurdle có thể dùng chung model:

```json
{
  "id": "hurdle_01",
  "modelId": "hurdle_primitive",
  "position": [0, 0, 3]
}
```

```json
{
  "id": "hurdle_02",
  "modelId": "hurdle_primitive",
  "position": [0, 0, 6]
}
```

Chúng dùng chung `modelId` nhưng phải có `id` khác nhau vì đây là hai object riêng biệt.

## 4. Bước 2 — `Exercise.tsx` nạp nguồn dữ liệu

`Exercise.tsx` import hai fixture:

```tsx
import sampleSceneJson from './scene.sample.json';
import secondSceneJson from './scene.second.json';
```

Sau đó gom chúng thành danh sách nguồn:

```tsx
const SCENE_SOURCES = [
  {
    id: 'sample',
    label: 'Scene mẫu',
    value: sampleSceneJson,
  },
  {
    id: 'second',
    label: 'Scene tái sử dụng',
    value: secondSceneJson,
  },
] as const;
```

Mỗi nguồn có hai loại ID khác nhau:

- `source.id`: ID của cả scene trong selector.
- `object.id`: ID của một vật thể bên trong scene.

`Exercise.tsx` là Server Component vì file không có `'use client'`. Nó không trực tiếp tạo Canvas và không giữ state phía trình duyệt.

## 5. Bước 3 — JSON thô đi qua validator

Với mỗi nguồn, `Exercise.tsx` gọi:

```tsx
const result = validateScene(source.value);
```

Tham số của validator có type `unknown`:

```tsx
export function validateScene(value: unknown): SceneValidationResult;
```

`unknown` thể hiện nguyên tắc quan trọng: dữ liệu từ JSON, API hoặc database chưa được tin tưởng cho đến khi kiểm tra xong.

Không dùng cách sau cho dữ liệu bên ngoài:

```tsx
sceneJson.objects as SceneObject[];
```

Type assertion chỉ làm TypeScript ngừng báo lỗi. Nó không kiểm tra dữ liệu khi chương trình chạy.

### Các bước kiểm tra

`validateScene()` lần lượt kiểm tra:

1. Scene có phải object hay không.
2. `schemaVersion` có đúng `1.0` hay không.
3. `objects` có phải array hay không.
4. Số lượng object có vượt giới hạn hay không.
5. Mỗi phần tử có phải object hay không.
6. `id` có phải chuỗi không rỗng hay không.
7. `id` có bị trùng hay không.
8. `modelId` có phải chuỗi không rỗng hay không.
9. `position` có đúng ba số hữu hạn hay không.

### Kết quả thất bại

```tsx
{
  ok: false,
  issues: [
    {
      path: '$.objects[1].position',
      message: 'position phải chứa đúng ba số hữu hạn [x, y, z].'
    }
  ]
}
```

`path` chỉ rõ lỗi nằm ở đâu trong JSON. Ký hiệu `$` đại diện cho object gốc.

### Kết quả thành công

```tsx
{
  ok: true,
  data: {
    schemaVersion: '1.0',
    objects: [...],
    mode: ...,
    steps: ...
  }
}
```

`data` lúc này là `SceneData` đã được chuẩn hóa. Renderer chỉ nhận nhánh thành công này.

## 6. Bước 4 — Xử lý hai nhánh kết quả

Trong `Exercise.tsx`:

```tsx
if (!result.ok) {
  errors.push(`${source.label}: ${formatSceneValidationIssues(result.issues)}`);
  continue;
}
```

Nếu dữ liệu sai:

- Không truyền dữ liệu đó vào Canvas.
- Chuyển danh sách lỗi thành chuỗi dễ đọc.
- Hiển thị giao diện lỗi có `role="alert"`.

Nếu dữ liệu đúng:

```tsx
scenes.push({
  id: source.id,
  label: source.label,
  data: result.data,
});
```

Cuối cùng dữ liệu an toàn được truyền qua client boundary:

```tsx
return <SceneExperience scenes={scenes} />;
```

Props này chỉ chứa object, array, string và number nên có thể serialize từ Server Component sang Client Component.

## 7. Bước 5 — `SceneExperience` quản lý UI và Canvas

`SceneExperience.tsx` có:

```tsx
'use client';
```

File này cần chạy phía trình duyệt vì sử dụng:

- `useState`.
- Sự kiện `onChange`.
- React Three Fiber `Canvas`.
- `OrbitControls`.
- Theme hiện tại.

State lưu scene đang chọn:

```tsx
const [selectedSceneId, setSelectedSceneId] = useState(scenes[0]?.id ?? '');
```

Scene tương ứng được tìm bằng:

```tsx
const selectedScene = scenes.find((scene) => scene.id === selectedSceneId) ?? scenes[0];
```

Khi người dùng đổi `<select>`, chỉ `selectedSceneId` thay đổi. Không cần tạo một renderer riêng cho scene mới.

Sau đó Canvas truyền objects cho renderer:

```tsx
<SceneRenderer objects={selectedScene.data.objects} />
```

## 8. Bước 6 — `SceneRenderer` map từng object

`SceneRenderer` nhận:

```tsx
type SceneRendererProps = {
  objects: SceneObject[];
};
```

Sau đó duyệt danh sách:

```tsx
objects.map((object) => {
  const Model = getModelComponent(object.modelId);

  return (
    <group key={object.id} position={object.position}>
      {Model ? <Model /> : <UnknownModel modelId={object.modelId} />}
    </group>
  );
});
```

Với mỗi object, renderer làm bốn việc:

1. Lấy `modelId`.
2. Tìm component tương ứng trong registry.
3. Tạo group có `key={object.id}` và `position={object.position}`.
4. Render model hoặc placeholder.

### Vì sao key dùng `id`?

`id` là duy nhất cho từng object:

```tsx
key={object.id}
```

Không dùng:

```tsx
key={object.modelId}
```

Hai hurdle có thể cùng `modelId`, nên dùng `modelId` sẽ tạo key trùng.

### Vì sao position nằm ở group ngoài?

```tsx
<group position={object.position}>
  <Model />
</group>
```

Primitive chỉ mô tả hình dạng quanh gốc tọa độ cục bộ. Renderer chịu trách nhiệm đặt toàn bộ model vào vị trí lấy từ JSON. Nhờ đó một primitive có thể tái sử dụng ở mọi vị trí.

### `userData` để làm gì?

Renderer còn gắn:

```tsx
userData={{
  sceneObjectId: object.id,
  modelId: object.modelId,
}}
```

Level 05 có thể dùng metadata này để raycast, highlight hoặc tìm object theo ID mà không phụ thuộc vào cấu trúc mesh con.

## 9. Bước 7 — Registry đổi `modelId` thành component

Registry chứa bảng ánh xạ:

```tsx
const MODEL_REGISTRY = {
  start_line_primitive: StartLinePrimitive,
  hurdle_primitive: HurdlePrimitive,
  character_primitive: CharacterPrimitive,
  finish_line_primitive: FinishLinePrimitive,
};
```

Renderer không đọc bảng trực tiếp mà gọi helper:

```tsx
const Model = getModelComponent(object.modelId);
```

Ví dụ:

```text
object.modelId = "hurdle_primitive"
                    |
                    v
getModelComponent("hurdle_primitive")
                    |
                    v
             HurdlePrimitive
```

Muốn hỗ trợ model mới, tạo primitive rồi đăng ký thêm một entry. Không cần sửa vòng lặp trong `SceneRenderer`.

## 10. Bước 8 — Primitive tạo mesh thật

`scene-primitives.tsx` chứa các component hình học:

- `StartLinePrimitive`
- `HurdlePrimitive`
- `CharacterPrimitive`
- `FinishLinePrimitive`

Ví dụ `HurdlePrimitive` tạo hai cột và một thanh ngang. Component này không nhận `id`, không đọc JSON và không quyết định vị trí trong scene.

Sự phân chia trách nhiệm:

```text
JSON             quyết định vật nào và ở đâu
Registry         quyết định modelId dùng component nào
Primitive        quyết định hình dạng model
SceneRenderer    nối ba phần trên lại với nhau
SceneExperience  cung cấp Canvas, camera, đèn và UI
```

## 11. Nhánh model chưa được hỗ trợ

Một `modelId` không có trong registry không làm toàn bộ scene lỗi vì object vẫn có cấu trúc hợp lệ.

```tsx
{
  Model ? <Model /> : <UnknownModel modelId={object.modelId} />;
}
```

`UnknownModel` hiện:

- Một box wireframe màu đỏ.
- Nhãn ghi modelId chưa được hỗ trợ.

Phân biệt hai trường hợp:

```text
position sai
  -> dữ liệu sai
  -> validator từ chối cả scene

modelId chưa có trong registry
  -> dữ liệu vẫn đúng cấu trúc
  -> renderer dùng placeholder
```

## 12. Theo dấu một object cụ thể

Giả sử JSON có:

```json
{
  "id": "hurdle_01",
  "modelId": "hurdle_primitive",
  "position": [0, 0, 3]
}
```

Luồng thực tế:

```text
1. Exercise import JSON.
2. validateScene nhận object dưới dạng unknown.
3. Validator xác nhận:
   - id hợp lệ và chưa trùng;
   - modelId là string;
   - position có ba số hữu hạn.
4. Object được thêm vào SceneData.objects.
5. SceneData được truyền vào SceneExperience.
6. SceneExperience truyền objects cho SceneRenderer.
7. SceneRenderer gọi getModelComponent("hurdle_primitive").
8. Registry trả về HurdlePrimitive.
9. Renderer tạo group tại [0, 0, 3].
10. HurdlePrimitive dựng các mesh bên trong group.
11. Canvas render kết quả bằng WebGL.
```

## 13. Vì sao cấu trúc này phù hợp để mở rộng

### Đổi dữ liệu

Sửa JSON hoặc lấy JSON từ backend. Renderer không cần thay đổi.

### Thêm model

Tạo primitive hoặc GLB component mới, sau đó thêm vào registry.

### Thêm scene

Thêm nguồn JSON mới vào `SCENE_SOURCES`. Không copy `SceneRenderer`.

### Thêm validation

Mở rộng `validateScene()` mà không sửa component 3D.

### Chuyển sang backend ở Level 08

Thay nguồn fixture bằng kết quả API:

```text
JSON import hiện tại -> response.json() sau này
```

Các bước phía sau vẫn giữ nguyên:

```text
unknown -> validateScene -> SceneData -> SceneRenderer
```

## 14. Bài kiểm tra nên tự làm

### Test field lạ

Thêm vào một object:

```json
"teacherNote": "field chưa hỗ trợ"
```

Kỳ vọng: scene vẫn render vì field lạ được bỏ qua.

### Test model chưa biết

```json
"modelId": "unknown_model"
```

Kỳ vọng: hiện placeholder đỏ, scene không crash.

### Test ID trùng

Cho hai object cùng `id`.

Kỳ vọng: validator báo đường dẫn của ID bị trùng và Canvas không nhận scene sai.

### Test position sai

```json
"position": [0, "sai", 3]
```

Kỳ vọng: validator báo lỗi position.

### Test schema mới

```json
"schemaVersion": "2.0"
```

Kỳ vọng: ứng dụng thông báo version chưa được hỗ trợ, không tự đoán cấu trúc mới.

## 15. Thứ tự đọc code đề xuất

Đọc theo thứ tự sau để không bị rối:

1. `scene.sample.json` — xem dữ liệu đầu vào.
2. `helpers/scene.types.ts` — xem dữ liệu hợp lệ có hình dạng gì.
3. `helpers/validate-scene.ts` — xem dữ liệu thô được kiểm tra thế nào.
4. `Exercise.tsx` — xem cách xử lý kết quả thành công/thất bại.
5. `components/SceneExperience.tsx` — xem Canvas nhận scene thế nào.
6. `components/SceneRenderer.tsx` — xem objects được map thành group.
7. `helpers/model-registry.ts` — xem modelId được tra cứu thế nào.
8. `components/scene-primitives.tsx` — xem geometry/material cuối cùng.

## 16. Kiến thức cần nhớ

```text
TypeScript type không thay thế runtime validation.

id      = danh tính object cụ thể.
modelId = loại model/template.

JSON mô tả scene.
Registry chọn component.
Primitive mô tả hình dạng.
Renderer ghép dữ liệu với component.
Canvas hiển thị kết quả.
```
