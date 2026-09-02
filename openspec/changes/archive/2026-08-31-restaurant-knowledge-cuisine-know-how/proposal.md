## Why

Trang `Informations générales` cần mở rộng Restaurant Knowledge bằng lát cắt
`Cuisine & savoir-faire` đã được Product phê duyệt, để nhà hàng có thể lưu giữ
ba nội dung mô tả thuộc knowledge canon mà không trộn chúng với Establishment
Profile hoặc dữ liệu vận hành của `Carte & menus`.

## What Changes

- Thêm đúng ba khối Restaurant Knowledge: `Description de la cuisine`,
  `Savoir-faire & particularités` và `Fait maison`.
- Cho phép xem, nhập thủ công và chỉnh sửa độc lập từng giá trị; cả ba đều
  optional và trạng thái ban đầu hoàn toàn rỗng là hợp lệ.
- Dùng một thao tác lưu explicit cho toàn bộ lát cắt `Cuisine & savoir-faire`;
  không autosave.
- Dùng `restaurant-knowledge.read` để xem và
  `restaurant-knowledge.manage` để chỉnh sửa/lưu theo contract authorization
  hiện có: `OWNER` và `MANAGER` có cả hai operation, `STAFF` không có quyền
  Restaurant Knowledge mặc định.
- Giữ Restaurant Knowledge là canonical owner của ba giá trị mô tả và
  persistence/domain boundary của chúng. Dữ liệu có semantic scope theo
  establishment; Organization tiếp tục là tenancy/access envelope.
- Không kế thừa dữ liệu hoặc permission của Establishment Profile và không tạo
  liên kết, đồng bộ hoặc bản sao của dishes, products, prices, ingredients,
  recipes, availability, menu configuration, suppliers hay dữ liệu vận hành
  khác thuộc `Carte & menus`/POS.
- Không thêm validation Product, enum, taxonomy, checklist, structured
  dish/product relationship, AI, automatic learning, provenance/history,
  Marketing/social integration, external provider, embedding/vector DB hoặc
  section Restaurant Knowledge khác.

## Capabilities

### New Capabilities

- `restaurant-knowledge/cuisine-know-how`: Hành vi xem, nhập/chỉnh sửa thủ công
  và lưu explicit ba giá trị optional của lát cắt `Cuisine & savoir-faire`,
  dưới quyền READ/MANAGE và tenant boundary hiện có.

### Modified Capabilities

Không có.

## Impact

- Trang Backoffice `/etablissement/informations-generales` và page pack hiện
  tại sẽ được mở rộng bằng một section Restaurant Knowledge độc lập với
  Establishment Profile.
- Restaurant Knowledge sẽ sở hữu persistence/domain boundary của lát cắt mới
  trong cloud boundary hiện có; schema, repository/table và storage
  representation cụ thể chưa được quyết định ở Proposal và phải được giải
  quyết qua Analysis/Design.
- Authorization, active membership validation và organization + establishment
  tenant scope hiện có được tái sử dụng mà không thêm permission, role,
  principal, shared contract, API hoặc cross-runtime behavior.
- Normative specs hiện có cho `authorization/restaurant-knowledge` và
  `restaurant-knowledge/concept-history` không bị thay đổi.
