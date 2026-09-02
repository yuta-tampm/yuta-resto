# YUTA — Workflow v3 Automation Update

## Mục tiêu

Nâng workflow YUTA hiện tại lên **Workflow v3** bằng cách giữ nguyên các phần đã chứng minh hoạt động:

- OpenSpec `yuta-spec-driven`
- Analysis gate
- Gate 1 / Gate 2 / Gate 3
- review packet + SHA-256 integrity
- `$yuta-run-change`
- `$yuta-finish-change`
- normative sync + archive

và bổ sung các phần còn thiếu từ workflow implementation cũ:

1. **Phased Implementation Plan** bên trong Tasks/Apply.
2. **VERIFY** tách biệt với **QA**.
3. UI/UX change bắt buộc **Browser QA + screenshot evidence**.
4. **Knowledge Consolidation** sau archive.
5. Release/deploy giữ thành **conditional operational lane**, không trộn với
   repository implementation lifecycle.

Không thay đổi OpenSpec schema trong update này.

---

# 1. Target Workflow v3

```text
IDEA
 │
 ├─ DISCOVERY / SHAPING                    [conditional]
 │
 ▼
PROPOSAL
 │
 ▼
ANALYSIS
 │
 ▼
GATE 1 — PRODUCT / AUTHORITY REVIEW
 │
 ▼
SPECS
 │
 ▼
GATE 2 — REQUIREMENTS REVIEW
 │
 ▼
DESIGN
 │
 ├─ SENSITIVE DESIGN GATE                  [conditional]
 │
 ▼
TASKS + IMPLEMENTATION PLAN
 │
 ▼
APPLY
 │
 ├─ Foundation / Data                      [as needed]
 ├─ Service / Domain                       [as needed]
 ├─ UI / Components                        [as needed]
 ├─ Interaction / States                   [as needed]
 └─ Integration / Regression               [as needed]
 │
 ▼
VERIFY
 │
 ▼
QA
 │
 ├─ Browser interaction                    [UI mandatory]
 ├─ Responsive                             [UI mandatory]
 ├─ Accessibility
 ├─ Visual
 ├─ Role/state behavior
 ├─ Loading/error/success                  [when applicable]
 └─ Screenshot evidence                    [UI mandatory]
 │
 ▼
GATE 3 — FINAL INDEPENDENT REVIEW
 │
 ▼
APPROVAL
 │
 ▼
SYNC NORMATIVE SPECS
 │
 ▼
VALIDATE MAIN SPECS
 │
 ▼
ARCHIVE CHANGE
 │
 ▼
KNOWLEDGE CONSOLIDATION
 │
 ├─ NO UPDATE REQUIRED → DONE
 │
 └─ UPDATE REQUIRED
 │      ↓
 │   KNOWLEDGE REVIEW GATE                 [conditional]
 │      ↓
 │   APPLY APPROVED KNOWLEDGE UPDATE
 │
 ▼
DONE

RELEASE / DEPLOY / POST-DEPLOY VERIFY
= separate conditional operational lane.
```

---

# 2. Files to update/create

Update:

```text
.agents/skills/yuta-run-change/SKILL.md
.agents/skills/yuta-finish-change/SKILL.md
docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md
docs/reviews/README.md
```

Create:

```text
docs/YUTA_QA_PROTOCOL.md
docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md
docs/YUTA_WORKFLOW_V3_UPDATE_REPORT.md
```

Do NOT modify:

```text
.agents/skills/openspec-*/**
openspec/config.yaml
openspec/schemas/**
openspec/specs/**
product code
```

Do not continue/start any real OpenSpec change in this setup task.

---

# 3. Update `$yuta-run-change`

Preserve all current Gate 1 / Gate 2 / hash / adoption / sensitive-change rules.

Add the following behavior.

## 3.1 Discovery / Shaping — conditional

Before creating a new OpenSpec change, classify uncertainty.

Use Discovery/Shaping only when the requested feature has material uncertainty
that cannot be safely bounded from current Product Knowledge.

Examples:
- new capability with unclear owner;
- cross-module behavior;
- external provider behavior;
- major workflow redesign;
- unfamiliar runtime/data boundary.

Do NOT create a mandatory new OpenSpec artifact.

Discovery is a pre-change reasoning step and may result in:
- ask user / Control Tower;
- create bounded request;
- no OpenSpec change yet.

Small, well-bounded changes skip Discovery.

---

# 4. Tasks + Implementation Plan

After approved specs and applicable design, Tasks must include an
**implementation plan organized by the phases actually needed**.

Allowed phase vocabulary:

```text
Foundation / Data
Service / Domain
UI / Components
Interaction / States
Integration / Regression
```

These are planning labels, not mandatory stages.

Rules:

- include only phases relevant to the change;
- preserve dependency order;
- each phase contains verifiable checkbox tasks;
- do not invent Data/UI phases for a change that does not need them;
- sensitive migrations or cross-boundary work remain subject to the Design Gate.

Example small UI-only change:

```text
UI / Components
Interaction / States
Regression
```

Example POS change:

```text
Foundation / Data
Service / Domain
Management UI
Order-entry Interaction
Integration / Regression
```

The exact content remains change-specific.

---

# 5. APPLY behavior

Apply executes the task phases in dependency order.

For every phase:

1. implement only the approved scope;
2. run targeted checks where practical before moving to the next phase;
3. mark tasks complete only when the stated outcome exists;
4. if implementation discovery changes Product behavior or a durable boundary,
   STOP and return to the appropriate earlier gate;
5. do not silently revise specs/design to fit implementation.

`APPLY` is where real work happens:

- code;
- DB/schema/migrations when approved;
- server/service/domain implementation;
- UI/components;
- interaction/state logic;
- tests.

---

# 6. VERIFY is technical verification

`VERIFY` must remain distinct from QA.

VERIFY answers:

> Does the repository implementation match the approved Specs/Design?

Minimum applicable evidence:

- requirement/scenario → implementation mapping;
- targeted tests;
- broader relevant test suite;
- typecheck;
- build;
- OpenSpec strict validation;
- architecture/security checks when applicable;
- migration/schema checks when applicable;
- scoped diff review;
- deviations/blockers.

VERIFY must NOT claim:
- browser UX correctness;
- visual correctness;
- responsive correctness;
- production readiness;
- deployment success.

---

# 7. QA classification

Before Gate 3, classify:

```text
UI_AFFECTING: YES / NO
BROWSER_QA_REQUIRED: YES / NO
```

`BROWSER_QA_REQUIRED = YES` whenever the change affects:
- visible UI;
- user interaction;
- responsive layout;
- UI role/edit/read-only state;
- loading/error/success presentation;
- visual component behavior.

Backend/data-only changes may use a non-browser QA plan.

---

# 8. UI/UX Browser QA — mandatory

When `UI_AFFECTING = YES`, Gate 3 MUST NOT be issued as ready until Browser QA
has passed.

Create:

```text
docs/reviews/<change>/qa/
├── QA_REPORT.md
├── screenshot-manifest.md
└── *.png
```

Do not require a fixed screenshot filename set when states differ by feature.

## 8.1 Browser QA requirements

Use the real/local app route with the closest available realistic data.

Check applicable cases:

- primary happy-path interaction;
- before/after state;
- editable state;
- read-only/permission state;
- loading;
- error;
- success/feedback;
- keyboard interaction;
- basic accessibility;
- no unexpected overflow/clipping;
- responsive behavior;
- regression around the changed section.

## 8.2 Default viewport policy

Use page-specific/UI-pack viewport requirements when they exist.

Otherwise for responsive web UI use at least:

```text
Desktop: 1366x768
Mobile: 390x844
```

Add tablet/intermediate viewport when:
- the page pack requires it;
- the UI targets tablet;
- the changed layout has a meaningful breakpoint.

A common intermediate default may be:

```text
Tablet: 768x1024
```

Do not create meaningless duplicate screenshots at viewports with no relevant
layout difference.

## 8.3 Screenshot evidence

Screenshots must:

- come from actual browser QA;
- represent the state claimed in QA_REPORT;
- be listed in `screenshot-manifest.md`;
- have SHA-256 hashes recorded;
- be linked by Gate 3.

For interaction changes, capture the most relevant before/after or state
evidence.

Do not use screenshots as authority for business logic; they are QA evidence.

## 8.4 Visual regression

If the repository already has a visual-regression convention, use it.

If Playwright screenshot assertions already exist, use the current project
convention.

Do NOT add a new visual-testing dependency solely for one change unless Design
explicitly approves it.

---

# 9. QA failure states

QA status must be exactly one of:

```text
PASS
FAIL
BLOCKED_BY_ENVIRONMENT
NOT_APPLICABLE
```

Rules:

### PASS
All required QA evidence is complete.

### FAIL
Observed behavior/visual/accessibility issue exists.
Codex may fix implementation bugs inside approved behavior and rerun
VERIFY + QA.

### BLOCKED_BY_ENVIRONMENT
Required browser QA could not run because environment/dependency is unavailable.

Codex should first attempt safe, bounded self-recovery if repository instructions
define it, e.g. start required local services.

If still blocked:
- record exact blocker;
- do not claim QA PASS;
- do not issue a Gate 3 recommendation that says fully ready;
- stop and tell the user what environment action is required.

### NOT_APPLICABLE
Only for changes with no applicable user-facing/runtime QA dimension.

---

# 10. QA report contents

`QA_REPORT.md` must contain:

```text
Change:
UI_AFFECTING:
BROWSER_QA_REQUIRED:
QA status:
Route(s):
Data/test setup:
Roles/states:
Viewport(s):
Scenarios tested:
Accessibility checks:
Visual/responsive findings:
Regression findings:
Known limitations:
Screenshot evidence:
```

For each screenshot record:
- relative path;
- viewport;
- role/state;
- scenario;
- SHA-256.

---

# 11. Gate 3 update

Gate 3 packet must now contain two distinct sections:

```text
TECHNICAL VERIFY
QA
```

For UI-affecting changes:

Gate 3 requires:

```text
VERIFY = PASS
QA = PASS
```

before recommendation can be:

```text
APPROVE_GATE_3_WITH_EXPLICIT_SYNC_AUTHORIZATION_IF_READY
```

Gate 3 must include:

- QA_REPORT exact status;
- screenshot manifest;
- screenshot hashes;
- key screenshot paths;
- any unresolved visual/accessibility issue.

Gate 3 must NOT hide `BLOCKED_BY_ENVIRONMENT`.

---

# 12. Update `$yuta-finish-change`

Preserve current:

```text
Gate 3 approval
→ integrity recheck
→ sync
→ validate main specs
→ archive
```

After successful archive, add:

```text
KNOWLEDGE CONSOLIDATION
```

---

# 13. Knowledge Consolidation Scan

After archive, inspect whether the completed change requires current knowledge
to be updated.

Check:

```text
- Page Product Knowledge
- Module Product Knowledge
- docs/PRODUCT_KNOWLEDGE.md routing
- MODULE_REGISTRY
- lifecycle/current-state docs
- ADR / durable decisions
- UI page pack / as-built evidence
- CURRENT_STATE if repository-wide summary materially changed
- NEEDS REVIEW items resolved by this change
- new future work / limitations discovered
```

Do NOT assume every change updates all or any of these.

Classify exactly:

```text
NO_UPDATE_REQUIRED
UPDATE_REQUIRED
```

---

# 14. Knowledge authority safety

Knowledge Consolidation must never automatically:

- approve a new Product Decision;
- change a durable boundary;
- promote lifecycle values;
- change ownership/permissions;
- mark production readiness;
- rewrite normative specs;
- resolve NEEDS REVIEW by assumption.

If such a change is needed, it requires explicit review.

---

# 15. Knowledge Consolidation — no update path

If:

```text
NO_UPDATE_REQUIRED
```

record:

```text
Knowledge consolidation: NO_UPDATE_REQUIRED
Reason:
Sources inspected:
```

Then the repository change is fully:

```text
DONE
```

---

# 16. Knowledge Consolidation — update required path

If canonical/current documentation should change:

Create:

```text
docs/reviews/<change>/04-knowledge-consolidation-review.md
```

Do NOT modify canonical knowledge yet.

The packet must include:

- why update is required;
- exact source/evidence from completed change;
- files proposed to update;
- exact proposed diff or replacement text;
- authority classification of each proposed edit;
- confirmation that no unapproved lifecycle/Product Decision promotion occurs;
- review status `AWAITING_HUMAN_REVIEW`;
- hashes of current target files and proposed-diff content.

Then STOP.

User resumes with:

```text
$yuta-finish-change <change-name>

Knowledge consolidation review approved. Apply and close.
```

Before applying:
- recheck target file hashes;
- invalidate approval on drift.

Apply only the approved knowledge diff.
Run docs/architecture validation.
Record completion.

Then:

```text
DONE
```

---

# 17. Archived-change resume support

Because Knowledge Consolidation happens after archive, `$yuta-finish-change`
must support a second invocation for an already archived change when a
`04-knowledge-consolidation-review.md` exists.

Use the archive location recorded in Gate 3 / finish evidence.

Do not recreate an active change.

---

# 18. Release / Deploy lane

Document but do not automatically merge release into repository change closure.

After DONE, classify:

```text
RELEASE_FOLLOW_UP:
- NOT_REQUIRED
- REQUIRED
- UNKNOWN
```

Release/deploy remains a separate operational action because:

```text
IMPLEMENTED != PRODUCTION_ENABLED
```

If release is required, report:
- affected runtime/environment;
- required deployment/readiness evidence;
- post-deploy verification need.

Do not automatically deploy from `$yuta-finish-change` in this update.

---

# 19. Update review protocol docs

Update `docs/reviews/README.md` with:

```text
01-analysis-review.md
02-specs-review.md
02b-design-review.md          conditional
qa/                           conditional but mandatory for UI
03-final-review.md
04-knowledge-consolidation-review.md   conditional
```

Clarify:
- QA screenshots are evidence, not Product authority;
- Gate approval invalidates on reviewed hash drift;
- Knowledge Gate only appears when current canonical knowledge needs update.

---

# 20. Create `docs/YUTA_QA_PROTOCOL.md`

Document:

- VERIFY vs QA;
- UI_AFFECTING classification;
- Browser QA mandatory rule;
- screenshot requirements;
- viewport rules;
- status enum;
- accessibility/responsive expectations;
- blocked-environment behavior;
- Gate 3 integration.

Keep it concise and reusable.

---

# 21. Create `docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`

Document:

```text
Archive
→ Knowledge Scan
→ NO_UPDATE_REQUIRED → DONE
or
→ UPDATE_REQUIRED
→ Knowledge Review
→ Apply approved docs update
→ DONE
```

Include authority/lifecycle safeguards.

---

# 22. Existing active/archived changes

Do not mutate current/archived product changes during this setup.

This update is workflow infrastructure only.

---

# 23. Validation

Confirm:

- custom schema unchanged;
- OpenSpec config unchanged;
- generated `openspec-*` skills unchanged;
- normative specs unchanged;
- product code unchanged;
- no OpenSpec change created;
- both YUTA skills remain valid/discoverable;
- docs checks pass;
- architecture checks pass;
- typecheck if required by repo convention;
- targeted formatting pass;
- `git diff --check` pass.

If repository-wide formatting has pre-existing failures, report them as bounded
and do not rewrite unrelated files.

---

# 24. Output report

Create:

```text
docs/YUTA_WORKFLOW_V3_UPDATE_REPORT.md
```

Include:

1. exact skill changes;
2. phased implementation behavior;
3. VERIFY vs QA separation;
4. UI Browser QA rule;
5. screenshot evidence protocol;
6. Gate 3 readiness rule;
7. Knowledge Consolidation behavior;
8. conditional Knowledge Review Gate;
9. release/deploy separation;
10. protected files unchanged;
11. recommendation:

```text
READY_TO_USE_WORKFLOW_V3
```

or

```text
WORKFLOW_V3_ADJUSTMENT_REQUIRED
```

End:

```text
Status: PROPOSED FOR REVIEW
```

Stop after setup.
