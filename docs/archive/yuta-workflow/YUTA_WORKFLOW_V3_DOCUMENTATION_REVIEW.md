# YUTA Workflow v3 — Documentation Review

Status: APPROVED

Visibility: Engineering

Owner: YUTA product and engineering

Reviewed: 2026-09-03

Provenance notice: This approved document is historical review evidence for the
canonical guide. It is not current operating guidance; use
[`YUTA_WORKFLOW_V3.md`](../../YUTA_WORKFLOW_V3.md) to operate Workflow v3. The approved
review decision recorded below is unchanged.

## Scope

Review này đánh giá `docs/YUTA_WORKFLOW_V3.md` như một human-readable operating
guide cho Product owner, Page Chat reviewers, YUTA Control Tower và Codex /
engineering contributors. Nó không đánh giá hoặc thay đổi product behavior,
skills, OpenSpec schema/config, normative specs, Product Knowledge, lifecycle,
ADRs hoặc product code.

## Sources consulted

- `AGENTS.md`
- `docs/README.md`
- `docs/CURRENT_STATE.md`
- `docs/tasks/YUTA_WORKFLOW_V3_DOCUMENTATION_FINALIZATION_TASK.md` — one-time
  source task not retained in the current repository/worktree; it was not
  reconstructed. This approved review and `docs/YUTA_WORKFLOW_V3.md` are the
  durable outputs.
- `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`
- `docs/YUTA_QA_PROTOCOL.md`
- `docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`
- `docs/YUTA_WORKFLOW_V3_UPDATE_REPORT.md`
- `docs/AUTHORITY_MODEL.md`
- `docs/LIFECYCLE_STATUS_MODEL.md`
- `docs/PRODUCT_KNOWLEDGE.md`
- `docs/MODULE_REGISTRY.md`
- `docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`
- `.agents/skills/yuta-run-change/SKILL.md`
- `.agents/skills/yuta-finish-change/SKILL.md`
- `openspec/config.yaml`
- `openspec/schemas/yuta-spec-driven/schema.yaml`
- `docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md`
- `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md`
- `docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md`

## Coverage matrix

| Required area                                                   | Guide section | Review result                                         |
| --------------------------------------------------------------- | ------------- | ----------------------------------------------------- |
| Purpose and operating principle                                 | 1             | Covered                                               |
| Roles and non-replacement of authority layers                   | 2             | Covered                                               |
| Full end-to-end flow and separate release lane                  | 3, 16         | Covered                                               |
| `PAGE_LOCAL` / `CROSS_MODULE` / `UNCERTAIN` routing             | 4             | Covered with canonical prompt/template links          |
| Every core step with question/input/output/stop condition       | 5             | Covered in one compact table                          |
| Analysis purpose, sources, conclusions and `CONFLICT` semantics | 6             | Covered with exact conclusion enum                    |
| Gate 1, Gate 2, Sensitive Design Gate and Gate 3                | 7             | Covered with exact packet names and hash invalidation |
| Optional phases and Technical Implementation Contract           | 8             | Covered                                               |
| VERIFY versus QA and exact QA enum                              | 9             | Covered                                               |
| Gate 3 readiness and UI screenshot evidence                     | 10            | Covered                                               |
| Normative scope, approval and mechanical sync                   | 11            | Covered                                               |
| `$yuta-run-change` start/resume/adoption behavior               | 12            | Covered with concise examples                         |
| `$yuta-finish-change` Branch A and Branch B isolation           | 13            | Covered with distinct preconditions/actions           |
| Post-archive Knowledge Consolidation paths                      | 14            | Covered                                               |
| Approved `skip_specs: true` path                                | 15            | Covered without fake requirements                     |
| Release/deploy separation and release enum                      | 16            | Covered                                               |
| Three conceptual day-to-day examples                            | 17            | Covered                                               |
| One-page-style quick reference and exact invariants             | 18            | Covered                                               |

## Intentional omissions delegated to detailed sources

Để guide không trở thành bản sao của skill implementation, các chi tiết sau chỉ
được tóm tắt và liên kết đến authority chuyên biệt:

- full Browser QA scenario/report schema, safe environment recovery và evidence
  rules: `docs/YUTA_QA_PROTOCOL.md`;
- exact post-archive scan packet fields và application procedure:
  `docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`;
- CLI discovery/instructions mechanics, adoption algorithm, packet mutation và
  deterministic diff construction: hai YUTA skills;
- OpenSpec artifact dependency graph, template grammar và `skip_specs`
  validation mechanics: active schema/config;
- sync conflict, rollback và main-spec modification policy:
  `docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`;
- product/module-specific owner, permission, lifecycle và implementation facts:
  Product Knowledge, Module Registry, ADRs và current code/tests.

## Contradictions found and resolved in the guide

- **Conditional steps:** End-to-end shorthand có thể trông như mọi change đều
  cần Discovery, Design Gate, Gate 2 và sync. Guide đánh dấu rõ điều kiện và có
  no-spec path riêng.
- **Gate 3 wording:** `PASS` hoặc recommendation không phải approval. Guide tách
  readiness khỏi explicit current-user approval và sync/archive authorization.
- **VERIFY/QA overlap:** Backend/database correctness được đặt trong VERIFY;
  Browser QA chỉ bắt buộc khi UI-affecting, giữ `NOT_APPLICABLE` đúng phạm vi.
- **Archive/Done ambiguity:** Archive được mô tả là đầu vào của Knowledge
  Consolidation, không phải repository `DONE`.
- **Finish branch leakage:** Archived Knowledge Review resume không rerun Gate
  3/sync/archive hoặc mượn authorization lịch sử.
- **Normativity/lifecycle ambiguity:** Mechanical sync không tạo Product
  approval và workflow progress không tự promote bất kỳ lifecycle dimension.

Không phát hiện contradiction chưa giải quyết giữa guide và current Workflow v3
skills/protocols trong phạm vi tài liệu này.

## Validation record

Các validation bắt buộc đã hoàn tất:

| Check                                                  | Result                                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Targeted formatting for both new Markdown files        | PASS — targeted Prettier write                                                                               |
| Required-section and invariant coverage audit          | PASS — đủ 18 sections, enums, packet names và exact invariants                                               |
| Cross-check against both YUTA skills and protocol docs | PASS — conditional paths, stop gates, integrity scopes, QA và finalization branches nhất quán                |
| `pnpm docs:check`                                      | PASS — documentation consistency check passed (36 current documents)                                         |
| `pnpm architecture:check`                              | PASS — runtime imports, database URLs, client boundaries và migration baselines hợp lệ                       |
| `pnpm -r --if-present typecheck`                       | PASS — 15 participating workspaces                                                                           |
| `git diff --check`                                     | PASS — không có whitespace error; line-ending warnings chỉ thuộc các Personnel files có sẵn ngoài task scope |

## Recommendation

Historical review recommendation: `READY_FOR_HUMAN_REVIEW`

Status: APPROVED
