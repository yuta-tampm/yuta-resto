# YUTA — Step 6.2E3: Migrate Prompt Provenance for Existing Page Packs

## Mục tiêu

Bổ sung provenance metadata (thông tin truy vết nguồn prompt) cho **18 page pack hiện có**
theo topology đã APPROVED:

**GENERATED SNAPSHOTS**

Nguyên tắc quan trọng:

- KHÔNG sửa body của bất kỳ prompt hiện có nào;
- KHÔNG regenerate prompt từ canonical template hiện tại;
- KHÔNG normalize mixed historical revisions về cùng một revision giả;
- provenance phải dựa trên evidence;
- nếu không chứng minh được nguồn → dùng `PARTIAL` hoặc `NEEDS_REVIEW`;
- snapshot hash hiện tại luôn phải được ghi và enforce;
- tooling KHÔNG auto-repair.

Đây là migration provenance, không phải prompt cleanup.

---

## Bắt buộc đọc trước

1. `AGENTS.md`
2. `docs/ui/UI_PROMPT_TOPOLOGY_REVIEW.md`
3. `docs/ui/PAGE_PACK_PROTOCOL.md`
4. `docs/ui/UI_PACK_TOOLING_SPEC.md`
5. `scripts/ui-pack-tooling.mjs`
6. `scripts/ui-pack-tooling.test.mjs`
7. `docs/ui/templates/page/prompt-template.json`
8. `docs/ui/templates/page/prompts/`
9. `docs/ui/pages/README.md`
10. toàn bộ 18 page-pack README và `prompts/`

Dùng Git history khi cần xác minh historical source/revision.

---

# Scope được phép sửa

## Existing page packs

Được phép tạo/update trong từng page pack:

- `prompt-provenance.json`
- README metadata:
  - `Prompt snapshot topology: GENERATED_SNAPSHOTS`
  - `Prompt provenance: prompt-provenance.json`

Chỉ thêm/sửa các field provenance cần thiết.

## Tooling

Chỉ sửa tooling/tests nếu migration phát hiện bug thật sự ngăn provenance hợp lệ.
Nếu cần sửa ngoài phạm vi migration metadata, dừng và report `NEEDS REVIEW`.

## Không được sửa

- bất kỳ `prompts/*.md` body nào;
- PRODUCT_SCOPE / UI_SPEC / DATA_AND_INTERACTION_SPEC;
- DESIGN_HANDOFF / IMPLEMENTATION_PLAN / ACCEPTANCE_CHECKLIST;
- references;
- Product Knowledge;
- lifecycle docs;
- architecture / ADR;
- app code;
- OpenSpec.

---

# 1. Inventory 18 page packs

Tạo inventory trước khi ghi provenance.

Với mỗi pack:

- slug;
- 6 prompt filenames;
- SHA-256 hiện tại của từng local snapshot;
- current canonical-template SHA-256;
- Git history evidence nếu cần;
- template cohort/revision nếu chứng minh được;
- page-specific divergence nếu có.

Không ghi provenance trước khi inventory hoàn tất cho pack đó.

---

# 2. Provenance classification per prompt

Mỗi prompt phải dùng một trong:

## `PROVEN`

Chỉ dùng khi source/revision được chứng minh rõ.

Ví dụ:
- generator history/commit chứng minh prompt copy từ canonical template revision X;
- Git history chứng minh exact historical canonical body;
- source path/revision/hash xác minh được.

Yêu cầu:
- template source path hợp lệ;
- template revision cụ thể;
- template SHA-256 cụ thể;
- snapshot SHA-256 cụ thể.

## `PARTIAL`

Dùng khi:
- biết historical source/cohort tương đối rõ;
- nhưng thiếu một phần evidence như exact commit/revision;
- hoặc source path historical đã thay đổi nhưng lineage đủ mạnh.

Không đoán missing data.

## `NEEDS_REVIEW`

Dùng khi:
- không chứng minh được source;
- divergent prompt không rõ intentional hay stale;
- exact historical template/revision không xác định được;
- Git history không đủ.

Snapshot SHA-256 vẫn phải được ghi chính xác.

---

# 3. Root provenance model

Đối với pack mới đồng nhất, root `templateRevision` có thể là revision của template set.

Đối với historical pack:

- nếu toàn bộ 6 prompt được chứng minh cùng một template set → ghi root revision;
- nếu mixed cohorts/revisions → `templateRevision: null`;
- không invent một revision chung chỉ để pass validation.

Per-prompt `templateRevision` mới là record chính xác cho historical source.

---

# 4. Historical source handling

Nếu historical canonical source không còn tồn tại ở current path:

- không fail migration chỉ vì file current không tồn tại;
- ghi source path/revision khi evidence đủ;
- dùng `PARTIAL` hoặc `NEEDS_REVIEW` theo evidence;
- snapshot body hiện tại không được đổi.

Không copy latest canonical template để thay thế historical source.

---

# 5. Page-specific prompt variants

Nếu Git/content evidence cho thấy prompt được deliberately customized trước seal:

- giữ body nguyên trạng;
- `localModificationState: PRE_SEAL`;
- ghi final `snapshotSha256`;
- provenanceStatus theo evidence.

Không dùng `PRE_SEAL` chỉ vì prompt khác canonical hiện tại.
Phải có evidence.

Nếu khác nhưng không rõ vì sao:
- `NEEDS_REVIEW`;
- không giả định modification state.

---

# 6. Generation evidence

Ưu tiên:

1. Git commit tạo/gắn prompt vào page pack;
2. commit có bằng chứng generation/cohort;
3. timestamp chỉ khi commit provenance không thể xác định theo model đã approve.

Không dùng filesystem mtime như historical proof.

---

# 7. Known cohorts cần kiểm tra kỹ

Cleanup/topology review đã xác định các nhóm cần chú ý:

- Registre Phase 0 page-specific divergence;
- POS Catalog Phase 1 page-specific divergence;
- POS Printing / POS Catalog Phase 5 shared older cohort;
- các prompt byte-identical với canonical template hiện tại;
- Formalités / Registre / Printing / Catalog prompt cohorts.

Không tự kết luận chỉ từ equality với current template.

---

# 8. README metadata

Sau khi `prompt-provenance.json` hợp lệ cho một pack:

README phải khai báo:

```text
Prompt snapshot topology: GENERATED_SNAPSHOTS
Prompt provenance: prompt-provenance.json
```

Không đổi lifecycle metadata khác.

Không đổi `Package status`, `Scope status`, `Reference status`, v.v. chỉ vì migration provenance.

---

# 9. Validation per pack

Sau mỗi pack:

- validator pass structural/provenance checks;
- `PROVEN` không warning provenance;
- `PARTIAL` warning `partial-prompt-provenance`;
- `NEEDS_REVIEW` warning `unresolved-prompt-provenance`;
- snapshot hash phải match;
- không có prompt body thay đổi.

Không sửa provenance để che warning.
Warnings là kết quả hợp lệ khi evidence chưa đủ.

---

# 10. Migration report

Tạo một report mới:

`docs/ui/PROMPT_PROVENANCE_MIGRATION_REPORT.md`

Report phải gồm:

## Summary

- total packs migrated;
- total prompts = 108;
- counts:
  - PROVEN
  - PARTIAL
  - NEEDS_REVIEW
- mixed-revision packs;
- page-specific variants;
- unresolved cohorts.

## Per-pack table

| Pack | Root template revision | PROVEN | PARTIAL | NEEDS_REVIEW | Notes |
|---|---|---:|---:|---:|---|

## Unresolved provenance

Liệt kê rõ:
- pack;
- phase;
- snapshot hash;
- missing evidence;
- recommended future review.

## Integrity confirmation

Xác nhận:
- 108 prompt bodies unchanged;
- no prompt regenerated;
- no snapshot auto-repaired.

Cuối file:

`Status: PROPOSED FOR REVIEW`

---

# 11. Không cleanup duplicates trong E3

19 byte-identical copies vẫn giữ nguyên.

Sau migration:
- proven snapshots sẽ được reclassify ở E4;
- unresolved copies vẫn giữ `NEEDS REVIEW`.

Không:
- merge;
- delete;
- replace with reference;
- regenerate.

---

# 12. Validation toàn repo

Sau migration:

1. Hash toàn bộ 108 prompt bodies trước/sau và confirm unchanged.
2. Validate all 18 packs.
3. Count provenance warnings by status.
4. Confirm no `missing-prompt-provenance` remains for migrated packs.
5. Confirm mixed-revision packs validate.
6. Confirm unresolved provenance remains visible.
7. Run:
   - UI tooling tests
   - `pnpm docs:check`
   - `pnpm architecture:check`
   - workspace typecheck
   - targeted Prettier
   - Markdown link check
   - `git diff --check`

---

# 13. Report cuối

Report:

- packs migrated;
- prompts classified PROVEN/PARTIAL/NEEDS_REVIEW;
- mixed revision packs;
- page-specific variants;
- unresolved prompts;
- files created/modified;
- prompt-body integrity result;
- validation result.

Không bắt đầu E4.

Dừng sau Step 6.2E3 và chờ review.
