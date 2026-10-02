Change: pointage-manual-test-environment
Gate: TASKS / IMPLEMENTATION PLAN REVIEW
Review status: APPROVED
Created: 2026-10-01T00:07:50+02:00
Schema: yuta-spec-driven
Analysis conclusion: NO_SPEC_BEHAVIOR_CHANGE
Sensitive change: YES — Design approved; bounded synthetic/disposable tooling
Apply authorization: GRANTED
Approval source: explicit current-user instruction — “Duyệt Tasks và cho phép Apply.”
Approval recorded by: Codex workflow
Approved: 2026-09-30T22:10:21Z
Approved Tasks baseline: ce567c0ade4fd48ddae261667827de5e01cb03535f33e48b64a7c11ba97fbb4f

# Bounded decision requested

Phê duyệt Tasks/Implementation Plan dưới đây và cấp Apply cho đúng 14 task trong ba phase nếu chấp nhận kế hoạch. Phê duyệt Design hiện tại chỉ cho phép lập Tasks/Implementation Planning, theo scope của packet `02b-design-review.md`; chưa phải authority để chạy Docker, database, Next hoặc manual testing. Lần này chỉ ghi nhận Design approval và tạo plan/review, không sửa implementation.

## Approval and integrity

Current-user instruction: “phê duyệt Design”. Trước ghi nhận, cả năm path/hash trong packet Design và ba path/hash Gate 1 đều khớp. Existing change artifact set chính xác là `.openspec.yaml`, `analysis.md`, `design.md`, `proposal.md`; không có Specs hoặc Tasks trước lượt này. Gate 1 vẫn APPROVED; Design packet đã ghi APPROVED lúc `2026-09-30T21:57:58Z`. Approved Design bytes không đổi.

Hash command: `Get-FileHash -Algorithm SHA256 <exact path>`, raw bytes, lowercase hexadecimal. Bảng là exact current review input set, sắp xếp theo repository-relative path. Đây là artifact references có hash; nội dung Tasks đầy đủ nằm tại file liên kết, không có bản kế hoạch khác trong packet này.

| Path                                                                  | SHA-256                                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/pointage-manual-test-environment/01-analysis-review.md` | `f41921c8db4420d266eedb8f0ed45352cc35b73cb3e8e50e7971e443fbfd4a34` |
| `docs/reviews/pointage-manual-test-environment/02b-design-review.md`  | `2417df8d5294328af3bb55c0cc21a2ec4882a93bfc91dd1166f94a8213b72b36` |
| `openspec/changes/pointage-manual-test-environment/.openspec.yaml`    | `ad5d1392b83e1fb364af846ecfc007e0da466a5405703f35acbeaac52dbc3eed` |
| `openspec/changes/pointage-manual-test-environment/analysis.md`       | `82d409d08297a1679c1f6de263b28f46e73cac831905801d9ab46ab9ef748560` |
| `openspec/changes/pointage-manual-test-environment/design.md`         | `75e69ec26104b8ba7988e708e923738eda89d637d82775b2861b8a7d0fbd1e08` |
| `openspec/changes/pointage-manual-test-environment/proposal.md`       | `bfb4624f359a666bba24d06388072344e0a3e20cb6eb09ff1b8c7a8b8beaab3e` |
| `openspec/changes/pointage-manual-test-environment/tasks.md`          | `ce567c0ade4fd48ddae261667827de5e01cb03535f33e48b64a7c11ba97fbb4f` |

Full Tasks/Implementation Plan and embedded contracts: [tasks.md](../../../openspec/changes/pointage-manual-test-environment/tasks.md).
Approved Design: [design.md](../../../openspec/changes/pointage-manual-test-environment/design.md).

## Phase and contract coverage

| Phase                    | Tasks      | Embedded TIC | Design coverage / outcome                                                                                                                                                            |
| ------------------------ | ---------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Foundation / Data        | 1.1–1.3: 3 | F1–F5        | D1/D3/D6; exact disposable guard, early resource ownership, existing canonical + test-only migration, two synthetic dossiers/PINs, preserved default fixture callers.                |
| Service / Domain         | 2.1–2.6: 6 | S1–S7        | D1/D2/D4/D5/D6; app-owned command, preflight, frozen nonempty env shadows, existing child and context/trace readiness, one-time terminal handoff, idempotent exact-resource cleanup. |
| Integration / Regression | 3.1–3.5: 5 | R1–R4        | D3–D7; scoped tests, actual disposable command proof, operator instructions, completion evidence and candidate-bound human handoff.                                                  |

Total: **14 tasks, 0 complete**. Không có UI / Components hoặc Interaction / States phase vì không sửa Pointage UI hay interaction implementation. Không tạo Foundation/Data schema mới; phase đó chỉ sở hữu fixture dùng lại migration hiện có.

Reviewed implementation allowlist: đúng sáu file trong Tasks — Backoffice manifest, CLI mới, launcher helper hiện có, test mới, Local Development guide, lockfile. Baseline HEAD `516e9605ca77e24c3adacf95aafb9501c3438c37`; initial working tree sạch. Existing bốn target có hash; hai target mới ABSENT. Trước Apply phải kiểm tra lại status/hash và giữ mọi unrelated edit phát sinh sau baseline. Không cần sửa Next child, db-cloud helper, Product route/contracts/schema, env file, migration hoặc UI pack.

## Sensitive guarantees carried forward

- Giữ exact database rule `^yuta_pointage_raw_clocking_test(?:_[a-z0-9]+)?$`, NODE_ENV dev/test, VERCEL absent, loopback, parsed/actual database equality và independent name validation. Không dữ liệu thật hoặc shared dev database.
- D2 profile giữ 13 reviewed application key names, original-process key-name inventory, deliberate nonempty poison/deny values, loopback deny DB sink và app URL; revalidate ngay trước child start, dừng khi unknown key/drift. Framework origEnv presence và YUTA nonempty policy được phân biệt. Không secret values trong evidence, không functional production credentials.
- Không PIN trước đủ READY; đủ trace/reconsumer/context HTTP 200 và generation-bound admission. Plaintext synthetic PIN chỉ một lần ở interactive terminal; không lưu vào review/test evidence.
- Exact container/PID ownership cho cleanup, không tác động process đang chiếm cổng; failed cleanup là failure thật. Hard kill/power loss giữ explicit recovery limitation.
- Credential/continuation/lifecycle/tenancy/clocking semantics, provider production và bảy blocker không đổi.

## Separate post-Apply stages

Tasks ghi adoption `REQUIRED` từ human-authorized finish/archive của `development-usability-and-iteration-control` ngày 2026-09-24, theo final-review record và archive hiện có. DEV_USABLE và MANUAL_TEST_READY đều applicability YES/result PENDING vì đây là operator CLI; cần candidate thật và handoff dùng được. Human validation request chỉ gửi khi candidate có thể thử; chưa có verdict hoặc pending request giả.

Sau completion/feedback mới có POST-APPLY VERIFY PLAN và Technical Compliance Matrix đủ 16 TIC items (F1–F5, S1–S7, R1–R4), baseline/Design-to-code/test mapping, exact scoped diff, migration proof, command results và deviations. Apply evidence phải được re-evaluate cho current candidate. QA riêng chỉ sau VERIFY PASS; CLI có runtime/operator QA dimension nên không mặc định NOT_APPLICABLE. `UI_AFFECTING: NO`, `BROWSER_QA_REQUIRED: NO`; human Edge test không bị trình bày thành full Browser QA.

Gate 3 packet chỉ sau Apply/current feedback hoàn tất, Technical Implementation Compliance PASS, VERIFY PASS và required QA PASS. Không sync/archive/deploy hoặc production enablement trong plan approval.

## Planning validation evidence

| Command / check                                                                                                                                            | Result                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm exec openspec status --change pointage-manual-test-environment --json`                                                                               | Schema `yuta-spec-driven`; Specs skipped; Tasks là next artifact trước tạo.                                                                                        |
| `pnpm exec openspec instructions tasks --change pointage-manual-test-environment --json`                                                                   | Trả đúng change/output path, numbered checkbox template, Design dependency satisfied; dùng làm nguồn artifact instructions.                                        |
| `pnpm exec openspec validate pointage-manual-test-environment --strict`                                                                                    | Exit 0; `Change 'pointage-manual-test-environment' is valid`.                                                                                                      |
| `pnpm docs:check`                                                                                                                                          | Exit 0; 36 current documents PASS.                                                                                                                                 |
| `pnpm architecture:check`                                                                                                                                  | Exit 0; runtime imports, DB URLs, client boundaries, migration baselines PASS.                                                                                     |
| `pnpm -r --if-present typecheck`                                                                                                                           | Exit 0; 15/16 workspace projects, applicable typecheck scripts PASS.                                                                                               |
| `pnpm exec prettier --check openspec/changes/pointage-manual-test-environment/tasks.md docs/reviews/pointage-manual-test-environment/02b-design-review.md` | Exit 0; scoped PASS.                                                                                                                                               |
| `pnpm format:check`                                                                                                                                        | Exit 1; **92 unrelated existing files** warned. No current Tasks/Design-review target warned; none of those 92 files edited. Không relabel global FAIL thành PASS. |
| Task/contract review                                                                                                                                       | 14 unchecked tasks, 3 phases, 16 TIC rows; fixed command table selector formatting and carried D1/D2 requirements explicitly, không đổi approved Design.           |
| `git diff --check`                                                                                                                                         | Exit 0; Git cảnh báo CRLF checkout conversion cho review file, không whitespace error. Raw file hashes vẫn là authority.                                           |

Không chạy implementation tests, build/start, Docker/container/database/migration, Edge/Browser QA, formal VERIFY hoặc formal QA. Chưa có candidate code để đánh giá chúng. Planning checks không phải implementation compliance evidence.

## Recommendation and checkpoint

Không phát hiện blocker Product/Security/Architecture mới. Đề nghị duyệt exact Tasks hash và cấp Apply cho ba phase/14 task/6 implementation targets. Hiện chỉ thay đổi workflow files: cập nhật Design approval packet; tạo Tasks và packet này. Normative Specs, approved Design, archive, implementation và env files không đổi.

TASKS / IMPLEMENTATION PLAN REVIEW
Status: APPROVED
Apply authorization: GRANTED
Tasks: 0/14
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED

Bảy blocker giữ nguyên: retention duration; deletion/anonymization; legal hold; backup-retention interaction; employee notice; detailed audit visibility; trusted production client-address provenance.
