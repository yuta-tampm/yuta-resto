# YUTA — Step 6.2E2: Implement Generated Snapshot Topology

## Mục tiêu

Triển khai mô hình đã được APPROVED trong:

`docs/ui/UI_PROMPT_TOPOLOGY_REVIEW.md`

Mô hình chính thức:

**GENERATED SNAPSHOTS**

Ý nghĩa:

- canonical prompts vẫn nằm tại `docs/ui/templates/page/prompts/`;
- khi tạo page pack mới, tooling copy 6 prompt vào `prompts/` của pack;
- các prompt local là **snapshot lịch sử** của input đã dùng cho pack;
- sau khi snapshot được seal (khóa), template mới KHÔNG được tự ghi đè pack cũ;
- validator được phép phát hiện provenance mismatch nhưng KHÔNG được auto-repair;
- 18 page pack hiện có chưa được migrate provenance trong Step E2.

Đây là bước sửa protocol, tooling spec, generator/validator và tests.

Không migrate 18 page pack cũ trong bước này.
Không xóa prompt duplicate.
Không sửa Product Knowledge.
Không sửa OpenSpec.

## Bắt buộc đọc trước

1. `AGENTS.md`
2. `docs/ui/UI_PROMPT_TOPOLOGY_REVIEW.md`
3. `docs/ui/PAGE_PACK_PROTOCOL.md`
4. `docs/ui/UI_PACK_TOOLING_SPEC.md`
5. `docs/ui/templates/page/`
6. `docs/ui/templates/page/prompts/`
7. `scripts/ui-pack-tooling.mjs`
8. tooling tests liên quan
9. `docs/ui/pages/README.md`

Đọc một số page pack hiện tại để đảm bảo backward compatibility, nhưng KHÔNG sửa chúng.

## Scope được phép sửa

Chỉ được sửa các file thuộc các nhóm sau khi thật sự cần:

### Documentation contract
- `docs/ui/PAGE_PACK_PROTOCOL.md`
- `docs/ui/UI_PACK_TOOLING_SPEC.md`
- documentation/template README trực tiếp liên quan tới page-pack generation nếu cần

### Canonical template metadata
- `docs/ui/templates/page/README.md`
- hoặc một metadata section/template file hợp lý bên trong `docs/ui/templates/page/`

### Tooling
- `scripts/ui-pack-tooling.mjs`

### Tests
- UI-pack tooling test files liên quan trực tiếp

Không sửa:
- `docs/ui/pages/**` existing page packs
- bất kỳ prompt body hiện có trong existing packs
- Product Knowledge Homes
- `MODULE_REGISTRY.md`
- `CURRENT_STATE.md`
- architecture/ADR
- application code
- OpenSpec

Nếu scope cần mở rộng ngoài danh sách trên, dừng và report `NEEDS REVIEW`.

## 1. Protocol — define Generated Immutable Snapshots

Cập nhật `PAGE_PACK_PROTOCOL.md` để chính thức định nghĩa:

### Canonical source
Canonical phase prompts nằm tại:
`docs/ui/templates/page/prompts/`

### Generated snapshot
Khi page pack được tạo:
- 6 canonical prompt được copy vào `page-pack/prompts/`;
- local copies trở thành execution inputs của page pack;
- agent làm việc trong existing pack phải đọc local snapshot, không đọc latest canonical template để thay thế.

### Sealing
Định nghĩa sealing point đơn giản:
- snapshot được coi là sealed khi page pack generation hoàn thành thành công và provenance được ghi;
- sau seal, prompt local không được silently edited.

Nếu workflow hiện tại thật sự cần customization trước execution:
- cho phép pre-seal customization;
- provenance phải ghi final snapshot hash;
- sau đó mới seal.

Không thiết kế lifecycle phức tạp hơn nếu không cần.

### Existing packs
Existing page packs chưa có provenance metadata:
- vẫn valid theo compatibility mode;
- không tự coi là lỗi;
- validator có thể warning về missing provenance;
- Step E3 sẽ migrate riêng.

### No auto-update
Canonical template thay đổi:
- chỉ ảnh hưởng pack tạo mới;
- không rewrite pack cũ;
- validator không copy latest template đè vào pack cũ.

## 2. Minimal provenance model

Triển khai provenance tối thiểu, không over-engineer.

Mỗi phase prompt cần metadata đủ để xác định:
- phase prompt filename
- template source path
- template revision
- template SHA-256
- snapshot SHA-256
- generation commit hoặc generation timestamp fallback
- local modification state
- provenance status

Có thể lưu provenance trong page-pack `README.md` dưới một machine-readable hoặc
strictly parseable section nếu tooling hiện tại phù hợp.

Nếu việc parse Markdown table quá fragile cho tooling:
- có thể chọn một metadata file nhỏ như `PROMPT_PROVENANCE.json`
  hoặc `prompt-provenance.json`
- nhưng chỉ nếu implementation đơn giản và đáng tin hơn rõ rệt.

Nếu chọn file metadata riêng:
- phải giải thích lý do trong `UI_PACK_TOOLING_SPEC.md`;
- metadata file là tooling metadata, không phải Product Knowledge.

Không tạo schema/database.

## 3. Template revision

Định nghĩa một revision đơn giản cho canonical prompt template set.

Yêu cầu:
- revision phải deterministic;
- generator có thể ghi revision vào pack;
- template đổi có thể increment revision;
- không dùng current date làm revision duy nhất.

Ví dụ acceptable:
- `prompt-template-v1`
- integer/string revision trong template metadata.

Không tự generate semantic version phức tạp nếu repo chưa cần.

## 4. Generator behavior

Cập nhật generator để:

1. đọc canonical template revision;
2. copy page template như hiện tại;
3. tính SHA-256 từng canonical prompt;
4. tính SHA-256 local snapshot cuối cùng;
5. ghi provenance;
6. hoàn thành atomic generation;
7. tuyệt đối không overwrite existing pack.

Generator không được:
- rewrite existing page packs;
- migrate old packs;
- update old prompt bodies;
- read latest template và auto-repair existing packs.

## 5. Validator behavior

Validator phải tiếp tục yêu cầu đủ 6 local prompt files.

Thêm validation cho provenance theo compatibility model:

### New packs with provenance
Validator kiểm tra:
- metadata đủ 6 phase;
- filenames khớp;
- snapshot SHA-256 khớp file local;
- template source path hợp lệ;
- provenance fields hợp lệ;
- duplicate/missing phase không hợp lệ.

### Existing legacy packs without provenance
Trong Step E2:
- vẫn pass structural validation;
- emit warning như `missing-prompt-provenance` hoặc tên phù hợp;
- KHÔNG fail toàn pack chỉ vì chưa migrate.

### Mismatch
Nếu snapshot file bị sửa sau seal:
- validator report error hoặc high-severity issue;
- KHÔNG auto-repair.

Nếu current template hash khác recorded template hash:
- không phải error cho old pack;
- template evolution là hợp lệ;
- chỉ cần recorded provenance internally consistent.

## 6. Immutability rule

Tooling phải enforce ở mức validation, không tự sửa file.

Nếu snapshot hash khác metadata:
- report violation;
- hướng dẫn tạo explicit successor/reseal flow ở future task nếu cần;
- trong E2 chưa cần implement full reseal command.

Không dùng Git file permissions để enforce immutability.

## 7. Tests bắt buộc

### Generation
- generated pack vẫn có đủ 6 prompt;
- provenance được tạo đủ 6 phase;
- template revision được ghi;
- template SHA-256 đúng;
- snapshot SHA-256 đúng.

### Validation
- valid generated pack pass;
- missing prompt fail như trước;
- missing provenance ở legacy pack => warning, không fail compatibility;
- new/provenance-enabled pack thiếu metadata => fail hoặc issue phù hợp theo spec;
- snapshot content thay đổi sau seal => validation mismatch;
- canonical template đổi sau pack generation => old pack vẫn valid;
- generator không overwrite existing pack.

### Cross-platform
Hash/path behavior không phụ thuộc Windows vs POSIX path separator.

Giữ tất cả tests hiện tại đang có.

## 8. Backward compatibility

18 page pack hiện có:
- không sửa trong Step E2;
- không regenerate;
- không thêm provenance;
- không đổi prompt body.

Validator phải nhận dạng legacy page pack an toàn.

E3 sẽ xử lý migration provenance riêng.

## 9. Documentation clarity

Sau E2, documentation phải trả lời rõ:
- Template nào dùng để tạo pack mới?
- Agent trong pack cũ đọc prompt nào?
- Template update có tác động pack cũ không?
- Snapshot có được sửa không?
- Missing provenance ở legacy pack xử lý thế nào?
- Validator có auto-fix không? → NO.
- Duplicate prompt bodies có phải cleanup error không? → NO, nếu là snapshot hợp lệ.

## 10. Không làm trong E2

Không:
- migrate existing 18 packs;
- add provenance vào existing packs;
- delete/merge 19 duplicate prompt bodies;
- modify page-pack product/design/QA docs;
- modify Product Knowledge;
- modify lifecycle/registry;
- modify app code;
- modify OpenSpec;
- implement automatic reseal/migration command nếu không thật sự cần.

## 11. Validation

Sau implementation:

1. Confirm existing prompt bodies under `docs/ui/pages/**/prompts/` unchanged.
2. Confirm existing 18 packs still validate in compatibility mode.
3. Confirm newly generated disposable test pack includes provenance.
4. Confirm changing canonical template after generation does not invalidate old snapshot.
5. Confirm changing a sealed snapshot does trigger mismatch.
6. Confirm generator still refuses overwrite.
7. Run:
   - UI tooling tests
   - `pnpm docs:check`
   - `pnpm architecture:check`
   - workspace typecheck
   - targeted Prettier
   - `git diff --check`

Nếu test tạo generated files trong repo, cleanup/restore chúng.

## 12. Report

Report:
- files modified;
- chosen provenance storage format;
- chosen template revision model;
- sealing definition;
- generator changes;
- validator compatibility behavior;
- tests added/updated;
- count of existing legacy packs;
- warnings expected before E3;
- validation results.

Không bắt đầu E3.
Dừng sau Step 6.2E2 và chờ review.
