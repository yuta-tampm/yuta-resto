# YUTA — Knowledge Audit Task

## Mục tiêu

Thực hiện **Knowledge Audit** (kiểm kê và đánh giá kiến thức hiện có của dự án YuTa) trước khi chuẩn hóa Product Knowledge và trước khi tạo custom OpenSpec workflow.

Ở giai đoạn này, mục tiêu là **đọc, phân tích, đối chiếu và báo cáo**.

Không được tự ý tái cấu trúc hoặc viết lại hàng loạt tài liệu hiện có.

---

## Phạm vi cần đọc

Đọc và phân tích các nguồn sau:

1. `AGENTS.md`
2. Toàn bộ `docs/`
3. Cấu trúc `apps/`
4. Cấu trúc `packages/`
5. Code hiện tại khi cần để kiểm chứng tài liệu
6. `openspec/` chỉ để hiểu trạng thái hiện tại; chưa custom schema và chưa tạo change mới

Không cần đọc:
- `node_modules/`
- `.tmp/`
- `tmp/`
- `exports/`
- `output/`
- các thư mục build/cache/generated không liên quan

---

## Nguyên tắc bắt buộc

### 1. Phân biệt rõ "ý định sản phẩm" và "đã triển khai"

Không được coi tài liệu mô tả một chức năng là bằng chứng rằng chức năng đó đã được code.

Luôn phân biệt:

- **Product Intent**: YuTa muốn/đã quyết định sản phẩm phải có gì.
- **Implemented State**: code hiện tại thực sự đã có gì.
- **Unknown / Unverified**: chưa đủ bằng chứng để kết luận.

### 2. Không tự suy đoán

Nếu thiếu thông tin hoặc có mâu thuẫn:
- ghi rõ là chưa xác định;
- chỉ ra các nguồn mâu thuẫn;
- không tự chọn một phiên bản làm sự thật nếu không có bằng chứng đủ mạnh.

### 3. Không sửa tài liệu hiện có ở vòng này

KHÔNG:
- xóa file;
- đổi tên file;
- di chuyển file;
- rewrite hàng loạt;
- merge tài liệu;
- sửa business rule;
- sửa code chỉ để làm docs khớp.

Chỉ được tạo 2 file output quy định bên dưới.

### 4. Ưu tiên nguồn

Khi đánh giá Product Knowledge, dùng thứ tự tham khảo sau:

1. `docs/decisions/` — quyết định đã chốt và lý do
2. `docs/features/` — chức năng/nghiệp vụ mong muốn
3. `docs/ui/` — UX/UI đã chốt
4. `docs/architecture/` — kiến trúc kỹ thuật
5. Code hiện tại — bằng chứng cho trạng thái đã triển khai
6. `docs/CURRENT_STATE.md` — tóm tắt hiện trạng, nhưng cần đối chiếu khi có thể
7. `docs/tasks/` — chỉ là task/lịch sử công việc, KHÔNG mặc định là Product Knowledge chính thức

Nếu repo hiện tại có quy định khác trong `AGENTS.md` hoặc `DOCUMENTATION_POLICY.md`, hãy ghi nhận xung đột và giải thích.

---

## Những gì cần phân tích

### A. Bản đồ sản phẩm

Xác định:
- các sản phẩm/app chính;
- các module chức năng;
- mối liên hệ giữa các module;
- tài liệu chính của từng module.

### B. Tình trạng tài liệu

Phát hiện:
- file trùng nội dung;
- file có vẻ lỗi thời;
- file mâu thuẫn nhau;
- tài liệu không còn phản ánh code;
- chức năng có code nhưng thiếu tài liệu;
- chức năng có tài liệu nhưng chưa thấy bằng chứng đã triển khai.

### C. Tình trạng code

Không cần audit toàn bộ code chi tiết.

Chỉ kiểm tra code khi cần xác minh các tuyên bố quan trọng trong docs, ví dụ:
- route/page có tồn tại không;
- module/app có tồn tại không;
- feature được ghi là "đã làm" có thật sự có dấu hiệu triển khai không;
- kiến trúc thực tế có khác docs không.

### D. Knowledge còn thiếu

Xác định những kiến thức nền quan trọng còn thiếu, ví dụ:
- mục tiêu module;
- người dùng/role;
- business rules;
- dependency giữa module;
- state/status chính;
- flow chính;
- quyền;
- terminology;
- source of truth.

---

## Output bắt buộc

Chỉ tạo 2 file:

### 1. `docs/KNOWLEDGE_AUDIT.md`

Đây là báo cáo audit, gồm tối thiểu:

1. Executive summary
2. Sources reviewed
3. Product/app map
4. Feature/module map
5. Documentation quality findings
6. Docs ↔ code inconsistencies
7. Conflicts / ambiguities
8. Missing Product Knowledge
9. Potentially outdated documents
10. Recommendations for the next normalization step

Với mỗi phát hiện quan trọng, ghi:
- file/source liên quan;
- kết luận;
- mức độ chắc chắn: `High / Medium / Low`;
- nếu có thể, bằng chứng từ code hoặc docs.

### 2. `docs/PRODUCT_KNOWLEDGE.md`

Đây CHỈ là **entry point** (điểm bắt đầu để agent tìm kiến thức), không phải file chứa toàn bộ Product Knowledge.

Nó cần:
- giải thích Product Knowledge của YuTa nằm ở đâu;
- chỉ dẫn agent nên đọc tài liệu nào theo loại câu hỏi;
- phân biệt `docs/`, `openspec/specs/`, `openspec/changes/`, và code;
- chỉ ra các nhóm tài liệu chính như `features`, `products`, `ui`, `decisions`, `architecture`;
- cảnh báo rằng `docs/tasks/` không mặc định là source of truth.

Không copy nội dung của toàn bộ docs vào file này.

---

## Format kết luận

Cuối `docs/KNOWLEDGE_AUDIT.md`, thêm:

```md
## Readiness for Product Knowledge normalization

Status: READY | READY WITH QUESTIONS | NOT READY

### Blocking questions
- ...

### Recommended next step
- ...
```

---

## Điều kiện hoàn thành

Task chỉ hoàn thành khi:

- [ ] Đã đọc `AGENTS.md`
- [ ] Đã đọc cấu trúc và tài liệu chính trong `docs/`
- [ ] Đã kiểm tra `apps/` và `packages/`
- [ ] Đã đối chiếu code cho các tuyên bố quan trọng
- [ ] Không sửa/xóa/di chuyển tài liệu hiện có
- [ ] Đã tạo `docs/KNOWLEDGE_AUDIT.md`
- [ ] Đã tạo `docs/PRODUCT_KNOWLEDGE.md`
- [ ] Báo cáo phân biệt rõ Product Intent và Implemented State
- [ ] Các điểm không chắc chắn được ghi rõ thay vì suy đoán

Sau khi hoàn thành, dừng lại và chờ review. Không tự chuyển sang bước chuẩn hóa docs hoặc custom OpenSpec schema.
