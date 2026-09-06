# YUTA — Step 7.0B: OpenSpec 1.11 Delta Re-Audit

## Mục tiêu

Re-audit OpenSpec **sau khi upgrade từ 1.10.0 lên 1.11.0** để bảo đảm
`docs/OPENSPEC_BASELINE_AUDIT.md` phản ánh đúng local CLI/schema/skills hiện tại
trước khi tạo custom schema cho YUTA.

Đây là audit-only.

Không fork schema.
Không sửa `openspec/config.yaml`.
Không tạo change/spec.
Không sửa code.
Không thay Product Knowledge.
Không bắt đầu Step 7.1.

---

## 1. Xác nhận local version

Chạy:

```bash
openspec --version
openspec schemas --json
openspec schema which spec-driven --json
openspec schema validate spec-driven --json --verbose
openspec templates --schema spec-driven --json
openspec context --json
openspec list --json
openspec list --specs --json
```

Kết quả version phải là `1.11.0`.

Nếu không phải 1.11.0:
- dừng;
- report blocker;
- không sửa baseline audit.

---

## 2. Inspect schema thật của 1.11.0

Dùng path từ:

`openspec schema which spec-driven --json`

để đọc schema thật đang cài.

Kiểm tra:

- `schema.yaml`
- artifacts
- `requires`
- `apply.requires`
- `apply.tracks`
- templates
- instruction text quan trọng

Xác nhận xem default graph còn là:

`proposal -> specs -> design -> tasks`

hay có thay đổi.

Phân biệt:
- displayed order
- dependency graph thực tế

Không suy từ audit 1.10.

---

## 3. Inspect schema command behavior của 1.11.0

Chạy:

```bash
openspec schema --help
openspec schema init --help
openspec schema fork --help
openspec schema validate --help
openspec schema which --help
```

Xác nhận:

- command nào còn experimental;
- syntax/options hiện tại;
- `schema init --artifacts` hỗ trợ artifact IDs nào;
- custom artifact IDs có còn khả thi qua fork/edit schema không;
- project-local schema resolution/shadowing behavior có thay đổi không.

Không chạy `schema fork` hoặc `schema init`.

---

## 4. Inspect Codex skills sau `openspec update`

Đọc:

`.agents/skills/`

Tối thiểu inspect các OpenSpec skills:

- propose
- new-change
- continue-change
- apply-change
- verify-change
- update-change
- sync-specs
- archive-change
- explore

Ghi:

- `generatedBy`
- skill path
- schema-awareness behavior
- có hard-code chỉ 4 artifact mặc định không
- workflow có dùng CLI `status/instructions/templates` để discover artifact graph không

Xác nhận skills hiện tại có thực sự được refresh/generated cho 1.11.0 hay chỉ
CLI được upgrade.

Không regenerate hoặc sửa skill trong step này.

---

## 5. So sánh với baseline 1.10

Đọc:

`docs/OPENSPEC_BASELINE_AUDIT.md`

Tạo một delta table:

| Concern | 1.10 finding | 1.11 observed | Impact on YUTA |
|---|---|---|---|

Tối thiểu:

- default artifact graph
- proposal meaning
- propose workflow meaning
- schema command syntax
- custom artifact feasibility
- schema init limitation
- schema fork behavior
- schema resolution/shadowing
- apply config
- Codex skill location
- skill schema-awareness
- project specs/changes state

---

## 6. Re-evaluate Candidate B

Baseline 1.10 recommended:

`proposal -> analysis -> specs -> design -> tasks`

Re-evaluate this exact graph against 1.11.0.

Check:

- custom `analysis` artifact is still supported by schema parser;
- dependency graph can encode:
  - analysis requires proposal
  - specs requires analysis
  - design requires specs
  - tasks requires specs + design
- apply can remain:
  - requires: [tasks]
  - tracks: tasks.md
- workflow skills can discover the custom artifact;
- verify/archive/update flows do not assume only the built-in graph.

Do not implement it.

Conclusion must be one of:

- `CANDIDATE_B_STILL_RECOMMENDED`
- `CANDIDATE_B_NEEDS_ADJUSTMENT`
- `CANDIDATE_B_BLOCKED`

Explain why.

---

## 7. OpenSpec 1.11 official behavior vs local behavior

Local executable evidence remains primary for this audit.

If repository-local installed behavior differs from documentation/comments:
record the difference explicitly.

Do not silently choose internet docs over local CLI.

---

## 8. Update current baseline audit

If 1.11 findings confirm or refine the baseline:

Update only:

`docs/OPENSPEC_BASELINE_AUDIT.md`

Required changes:

- local version -> 1.11.0
- audited/re-audited date
- current schema command behavior
- current skill `generatedBy`
- any changed compatibility concerns
- Candidate B conclusion

Preserve still-valid reasoning.

Do not create a second competing active baseline document.

If a 1.10 detail is historically useful but no longer current:
briefly note it as previous baseline behavior, not current authority.

Final status must remain:

`Status: PROPOSED FOR REVIEW`

until user review.

---

## 9. Output / allowed modifications

Allowed to modify only:

`docs/OPENSPEC_BASELINE_AUDIT.md`

No other file.

Do not modify:

- `.agents/skills/**`
- `openspec/**`
- Product Knowledge docs
- code
- archive
- tooling

---

## 10. Validation

Confirm:

1. `openspec --version` = 1.11.0.
2. built-in schema resolves from package unless local evidence says otherwise.
3. no schema was forked/initialized.
4. no OpenSpec config/skill/change/spec file changed.
5. only `docs/OPENSPEC_BASELINE_AUDIT.md` changed.
6. Markdown formatting/link checks pass.

Report:

- 1.11 delta summary;
- Candidate B conclusion;
- any compatibility concern before Step 7.1;
- validation result.

Stop after Step 7.0B.
Do not start Step 7.1.
