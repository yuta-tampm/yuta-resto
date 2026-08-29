# YUTA — Step 6.2C: Archive Knowledge-Normalization History

## Mục tiêu

Chuyển các tài liệu **lịch sử/provenance** (bằng chứng quá trình đã hoàn thành)
ra khỏi active reading path mà vẫn giữ chúng trong repository để có thể tra cứu
khi cần.

Đây là cleanup có kiểm soát, KHÔNG phải delete.

Chiến lược:
- dùng archive trong repository;
- archive không phải current authority;
- current agents không đọc archive mặc định;
- giữ nguyên nội dung tối đa để bảo toàn provenance;
- update mọi inbound link bị ảnh hưởng trong cùng change.

Không sửa code.
Không sửa OpenSpec.
Không archive Product Knowledge Homes, ADRs, architecture, page packs, lifecycle
models, Module Registry hoặc CURRENT_STATE.

---

## Nguồn phải đọc

1. `AGENTS.md`
2. `docs/DOCUMENTATION_CLEANUP_AUDIT.md`
3. `docs/DOCUMENTATION_POLICY.md`
4. `docs/README.md`
5. `docs/PRODUCT_KNOWLEDGE.md`
6. `docs/AUTHORITY_MODEL.md`
7. `docs/MODULE_REGISTRY.md`
8. `docs/CURRENT_STATE.md`

Kiểm tra toàn bộ inbound links tới các file sẽ archive trước khi move.

---

## Archive location

Tạo:

`docs/archive/README.md`

và:

`docs/archive/knowledge-normalization/`

Mục tiêu:
- giữ lịch sử Knowledge Normalization 2026-08;
- không làm archive thành source of truth mới.

---

## Files được phép archive

### Initial audit

Move:

`docs/KNOWLEDGE_AUDIT.md`

to:

`docs/archive/knowledge-normalization/KNOWLEDGE_AUDIT.md`

### Completed normalization task instructions

Move các task đã hoàn thành từ `docs/tasks/` vào:

`docs/archive/knowledge-normalization/tasks/`

Chỉ move các task đã hoàn thành thuộc chuỗi Knowledge Normalization trước
Step 6 cleanup execution.

Expected completed task files include:

- `YUTA_KNOWLEDGE_AUDIT_TASK.md`
- Step 1 Authority Model task
- Step 2 Lifecycle Status Model task
- Step 3 Module Registry task
- Step 5.1 Personnel Product Knowledge Home task
- Step 5.2 Today Product Knowledge Home task
- Step 5.3 Establishment Product Knowledge Home task
- Step 5.4 Identity / Access Product Knowledge Home task
- Step 5.5 Site Agent Product Knowledge Home task
- Step 5.6 Display Product Knowledge Home task

Use actual filenames present in the repository.

Do NOT archive:
- `docs/tasks/TASK_TEMPLATE.md`
- the currently active Step 6 task(s)
- any unfinished/review-pending task
- OpenSpec-related task that is still needed for upcoming setup

If completion is uncertain, leave the task in place and report `NEEDS REVIEW`.

---

## 1. Create `docs/archive/README.md`

The README must clearly state:

### Purpose

Archive content is historical/provenance only.

It is NOT:
- current Product Knowledge;
- current architecture authority;
- current lifecycle authority;
- current operations/readiness authority;
- current OpenSpec authority.

### Current entry points

Agents should normally start from:

- `docs/README.md`
- `docs/PRODUCT_KNOWLEDGE.md`
- `docs/MODULE_REGISTRY.md`
- `docs/AUTHORITY_MODEL.md`
- scoped Product Knowledge Homes

### Reading rule

Archive content should be opened only when:
- investigating historical decisions/process;
- tracing provenance;
- comparing old and current behavior;
- auditing how a current source was produced.

If archive content conflicts with current approved sources, current authority
wins according to `docs/AUTHORITY_MODEL.md`.

### Preservation rule

Do not rewrite archived documents merely to make them current.
Their historical wording is part of their provenance.

---

## 2. Move historical files

Use Git-aware moves where possible.

Preserve filenames.

Target structure:

```text
docs/archive/
├── README.md
└── knowledge-normalization/
    ├── KNOWLEDGE_AUDIT.md
    └── tasks/
        ├── YUTA_KNOWLEDGE_AUDIT_TASK.md
        └── ...
```

Do not modify archived file content unless a relative link must be repaired for
the file to remain readable.

Prefer not to rewrite historical content.

---

## 3. Update current inbound links

Search repository docs for links/references to moved files.

Update current docs only when the reference is still useful.

Rules:

- current docs must NOT route archive files as current authority;
- provenance links may point to archive;
- references saying the Knowledge Audit is a blocking/current prerequisite must
  be removed or rewritten because approved models now exist;
- do not add archive links everywhere.

Likely files to inspect:
- `docs/README.md`
- `docs/PRODUCT_KNOWLEDGE.md`
- `docs/DOCUMENTATION_CLEANUP_AUDIT.md`
- any source that explicitly links `KNOWLEDGE_AUDIT.md`
- task/process indexes if present

Do not rewrite unrelated content.

---

## 4. `docs/tasks/` after cleanup

After moving completed normalization tasks, `docs/tasks/` should retain only:
- reusable/current task template;
- active/incomplete Step 6 tasks;
- other genuinely active task instructions.

Do not move unrelated historical implementation tasks in this batch unless they
were explicitly classified by the cleanup audit as part of this normalization
history.

---

## 5. Do not archive current authorities

Explicitly protect:

- `docs/AUTHORITY_MODEL.md`
- `docs/LIFECYCLE_STATUS_MODEL.md`
- `docs/MODULE_REGISTRY.md`
- `docs/PRODUCT_KNOWLEDGE.md`
- `docs/CURRENT_STATE.md`
- Product Knowledge Homes
- `docs/decisions/**`
- `docs/architecture/**`
- `docs/operations/**`
- `docs/ui/pages/**`
- public booking/reputation current docs
- POS current docs
- OpenSpec files

---

## 6. Validation

After the move:

1. Confirm archived files exist under `docs/archive/knowledge-normalization/`.
2. Confirm no completed normalization task intended for archive remains in the
   active `docs/tasks/` path.
3. Confirm active Step 6 task(s) and `TASK_TEMPLATE.md` remain.
4. Confirm all Markdown links resolve.
5. Confirm no current authority source was moved.
6. Confirm `docs/archive/README.md` clearly marks archive as historical-only.
7. Search for stale links to:
   - `docs/KNOWLEDGE_AUDIT.md`
   - moved task paths
8. Confirm no code changed.
9. Confirm no OpenSpec file changed.
10. Run:
   - `pnpm docs:check`
   - `pnpm architecture:check`
   - targeted Prettier
   - Markdown link check
   - `git diff --check`

---

## 7. Report

Report:

- archive directories created;
- exact files moved;
- current files whose links were updated;
- files intentionally left in `docs/tasks/`;
- any `NEEDS REVIEW` task not moved;
- validation results.

Do not:
- delete archived history;
- slim anything else;
- modify Product Specs;
- touch UI prompt duplicates;
- modify OpenSpec.

Stop after Step 6.2C.
