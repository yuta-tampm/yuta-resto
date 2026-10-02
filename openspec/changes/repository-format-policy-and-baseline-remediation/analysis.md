# Change Analysis

## Scope and Change Type

`CROSS_MODULE / REPOSITORY_TOOLING / WORKFLOW_INTEGRITY_SENSITIVE`.
Change thay đổi observable validation behavior, không đổi application behavior.
Phạm vi lượt này: Proposal, Analysis, Gate 1 packet. Không Specs/Design/Tasks/TIC/Apply.

## Sources Consulted

- [Repository instructions](../../../AGENTS.md), [documentation index](../../../docs/README.md), [Current State](../../../docs/CURRENT_STATE.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Module Registry](../../../docs/MODULE_REGISTRY.md).
- [Workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), [activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md), [archive preservation](../../../docs/archive/README.md).
- [Package scripts](../../../package.json), [Prettier exclusions](../../../.prettierignore), [CI](../../../.github/workflows/ci.yml), [schema configuration](../../config.yaml).
- [Parent retained evidence](../ui-ux-pro-max-integration/tasks.md), [active async-feedback verification](../../../docs/reviews/async-interaction-feedback-foundation/03-verify-evidence.md), [external advisory applicability](../../../docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md).
- Approved Control Tower discovery and policy direction; current instruction authorizes only opening this change and Gate 1 artifacts.

## Authority and Product Decision

DECIDED_FROM_AUTHORITY: direction A, explicit artifact-class formatting scope with enforced alternate validation, được duyệt để Proposal/Analysis. Không phải approval cho concrete exclusions, validator implementation hoặc baseline mutation.

Historical silent rewrite + old approval reuse: NOT_ALLOWED. General revision/rebind migration: NOT_CURRENTLY_ESTABLISHED. Archive exact-byte policy: UNSPECIFIED. Code existence và formatter output không giải quyết các câu hỏi này.

## Current Implemented State

`format:check = prettier --check .`; CI gọi command này sau docs check và trước architecture check. Prettier config chọn semi, singleQuote, tabWidth 2, trailingComma all. Current ignore đã loại một số generated/runtime outputs, nhưng không loại 67 baseline paths. Chưa có authority-class validation orchestration được chứng minh.

Approved discovery: 67/67 exact hashes khớp retained table trong parent Tasks; 9 generated, 3 active-owned, 5 normative/schema, 24 historical/hash-bound, 22 archive-policy unresolved, 4 current mutable docs. Không có app/package runtime source trong tập. Last measured global format: exit 1, 67 warnings; không relabel PASS và không rerun parent closure. Formalités metadata remediation đã được Control Tower duyệt, aggregate UI-pack PASS với 90 unrelated warnings; không thuộc delivery này.

No existing formatting change trùng tên được tìm thấy trước scaffold. HEAD provenance: `415990386327aaccab3c32b1fef0569a0fde7f3a`; dirty checkout chứa Pointage, parent integration và approved Formalités README edits. Tất cả pre-existing edits nằm ngoài delivery.

Discovery SHA-reference scan cho 46 historical/archive targets: 793 exact digest occurrences, 747 khi loại parent documents, 655 target/document edges trong 24 referring files, trên 1,006 text artifacts. Đây là occurrences, không phải 793 approvals. Baseline references không tự tạo perpetual immutability.

## Affected Boundaries

Các ô proposed effect là policy concepts để review, không triển khai.

| Domain                     | CURRENT_AUTHORITY            | CURRENT_BEHAVIOR                                 | PROPOSED_POLICY_EFFECT                               | RISK                        | OWNER                        | CONFLICTS / NEEDS_REVIEW                        |
| -------------------------- | ---------------------------- | ------------------------------------------------ | ---------------------------------------------------- | --------------------------- | ---------------------------- | ----------------------------------------------- |
| Repository tooling         | AGENTS, workflow             | Scripts quyết định validation result             | Complete class-aware contract                        | Fail-open                   | Repository engineering       | NEEDS_REVIEW: admission authority               |
| Prettier orchestration     | package/config/ignore        | Global check                                     | Mutable check và enforced alternate checks           | Convenience exclusion       | Tooling owner                | NEEDS_REVIEW: mandatory orchestration           |
| Generated OpenSpec skills  | Activation policy, generator | Nine outputs included                            | Generation/reproducibility validation                | Update regression           | Tooling custodian            | NEEDS_REVIEW: eight pure-generation differences |
| Archived docs              | Archive preservation         | Historical wording retained, checked by Prettier | Registered preservation                              | Loss of provenance          | Knowledge/workflow custodian | NEEDS_REVIEW: byte policy UNSPECIFIED           |
| Historical review/evidence | Exact-hash workflow          | Bytes bind approvals                             | Preserve originals, reviewed corrections             | False old approval          | Owning reviewers             | CONFLICT: direct rewrite vs old binding         |
| Schema/templates           | Activation policy            | Custom yuta-spec-driven                          | Explicit reviewed non-behavioral changes             | Changed artifact generation | Workflow owner               | NEEDS_REVIEW: equivalence evidence              |
| Main specs                 | Normativity policy           | Precise behavioral authority                     | Owner-approved formatting only                       | Semantic drift              | Capability owners            | NEEDS_REVIEW: parsed equivalence                |
| Active-change ownership    | Change review contracts      | Async-feedback 15/19, hash-bound                 | WAIT_FOR_OWNER                                       | Invalidation                | Async-feedback owner         | NEEDS_REVIEW: explicit coordination             |
| Current Product Knowledge  | Authority/Registry           | Four current docs included                       | Mutable formatting without semantic/lifecycle change | Accidental promotion        | Product/Knowledge owners     | NEEDS_REVIEW: exact future diff                 |
| CI/validation semantics    | CI workflow, package scripts | format failure fails CI                          | Same mandatory entry contract covers every class     | Alternate checks skipped    | CI/tooling owner             | NEEDS_REVIEW: no optional bypass                |

Runtime/database/auth/tenancy/public-product behavior: not affected. No provider, data transmission, runtime enablement or production action.

### Proposed artifact classes

| Class                         | Admission / owner                                                             | Mutable format                   | Alternate validation                                               | Mutation and correction/revision                                       | Fail-closed conditions                                |
| ----------------------------- | ----------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------- | ----------------------------------------------------- |
| MUTABLE_FORMATTED             | Repository-owned editable source/docs; owning maintainer                      | Yes                              | Scope/diff integrity                                               | Exact approved non-semantic diff when review-bound                     | Unknown authority or unexpected drift                 |
| GENERATED_EXTERNAL_OR_DERIVED | Proven generator/source/version and reviewed output membership; tooling owner | Proposed no                      | Reproducibility, exact inventory, approved deviations              | Reviewed regeneration/version change; no manual patch                  | Missing source, unexplained difference, stale binding |
| HISTORICAL_HASH_BOUND         | Reviewed historical evidence with explicit registration; evidence owner       | Proposed no                      | Exact path/byte preservation and reference integrity               | Original preserved; new correction/revision subject to Gate 1 decision | Rewrite, deletion, stale/missing preservation record  |
| ARCHIVED_PRESERVED            | Registered archive evidence; archive custodian                                | Proposed no                      | Preservation/readability under approved policy                     | Byte/correction policy unresolved; no blanket permission               | Unapproved admission or mutation                      |
| ACTIVE_CHANGE_OWNED           | Active owner and bound artifacts; owning reviewer                             | Not exempt merely because active | Existing approval integrity plus coordinated formatting validation | WAIT_FOR_OWNER; approved revision and re-review if needed              | Owner conflict or reused stale approval               |
| NORMATIVE_REVIEW_REQUIRED     | Main spec/custom schema; capability/workflow owner                            | Yes after owner approval         | Parsed requirements/scenarios or schema structural equivalence     | No semantic change, exact preimage/diff review                         | Behavioral drift or missing strict validation         |
| UNCLASSIFIED                  | No complete unambiguous admission                                             | No silent omission               | Classification failure                                             | Owner must classify through reviewed process                           | Always blocks successful aggregate result             |

Class overlap/transition precedence requires Design after policy decisions; a path name alone cannot turn arbitrary files into historical/generated exclusions. Every covered file must have validation ownership. Unknown/new files cannot disappear from validation.

### Generated alternatives

FIX_GENERATOR_OUTPUT requires pinned generator source, upstream/fork authority, exact reproduction and update tests. POST_GENERATION_FORMAT_STEP requires deterministic generator+formatter+config bindings and proof that transformations preserve instructions. EXCLUDE_FROM_MUTABLE_FORMAT_SCOPE_WITH_REPRODUCIBILITY_VALIDATION is preferred direction for evaluation, but requires full generation-pipeline evidence and enforced alternate validation first.

Pure generator comparison previously matched only openspec-new-change; eight differences remain unexplained by the full Codex pipeline. Do not call that generator failure or reproducibility PASS. MANUAL_FORMAT_GENERATED_OUTPUT remains non-recommended. No openspec update is authorized.

### Historical/archive and active owners

Option B reformat/rebind is HIGH_RISK: retain old bytes/approvals; never replace historical SHA observations to pretend old approval covers new bytes. Option C, unchanged global checker plus unchanged failing history and no exclusions, cannot unblock parent.

Active overlap is exactly `docs/reviews/async-interaction-feedback-foundation/01-analysis-review.md`, `docs/reviews/async-interaction-feedback-foundation/02-specs-review.md`, and `openspec/changes/async-interaction-feedback-foundation/analysis.md`. Current recorded Technical VERIFY PASS does not authorize changes to these artifacts. WAIT_FOR_OWNER. Migration cannot invalidate their bindings silently; entering/leaving active ownership needs explicit coordination and preservation of old evidence.

### Normative acceptance concepts

Three schema templates (design/proposal/spec) and two Restaurant Knowledge main specs (cuisine-know-how/validated-knowledge) require owner approval, exact preimage/path binding, diff review, parsed requirement/scenario equivalence where applicable, schema/template structural equivalence, strict validation and no lifecycle promotion. Historical hash references remain historical truth.

Future supported checks include `openspec schema validate yuta-spec-driven --json` and `openspec validate --specs --strict --no-interactive`; exact application and additional negative tests belong to approved Design/Tasks, not this planning authorization.

## Lifecycle Baseline

No new Product or Module Registry lifecycle assignment. Parent 19/23, task 5.4 COMPLETE, 6.1 FAIL/UNCHECKED, 6.2–6.4 BLOCKED; receipt VERIFIED. Production NOT_AUTHORIZED. This change has no implemented policy or verified deployment.

## Requirement Readiness

BLOCKED_NEEDS_REVIEW: archive byte semantics and historical correction/admission policy affect observable validator behavior. Gate 1 review is ready to decide them; Specs are not authorized. This is not NO_SPEC_BEHAVIOR_CHANGE; do not set skip_specs merely to satisfy early validation.

## UI / UX Applicability

UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE

Reason: tooling/workflow validation, no UI design or advisory self-validation.
Scope: repository-format-policy-and-baseline-remediation.
Decision source: bounded current Control Tower request and external design intelligence policy; proposed record for Gate 1 acceptance.

UI_AFFECTING: NO. Browser QA is not implied; applicable non-browser command/integrity QA must be assessed later, not pre-labelled PASS or NOT_APPLICABLE.

## Conflicts and Unknowns

DECIDED_FROM_AUTHORITY: explicit direction A; no silent exclusions; unknown coverage fail-closed; no silent old-approval reuse; no generated manual formatting; normative behavior unchanged; active-owner coordination; no parent progression; Sensitive Design mandatory.

NEEDS_CONTROL_TOWER_DECISION:

1. Do registered archive artifacts preserve exact bytes? Existing policy is UNSPECIFIED, not inferred permission.
2. Do corrections use append/new revision preserving originals rather than rewrite? General rebind migration is NOT_CURRENTLY_ESTABLISHED.
3. Are registered historical/hash-bound artifacts outside mutable-format scope, with mandatory exact preservation/reference validation? Define admission owner and avoid treating every incidental SHA reference as immutable authority.
4. Which generated policy is preferred, and what full-pipeline/deviation evidence is required before acceptance?
5. Confirm complete classification and mandatory alternate checks as requirements; representation/manifest, safe paths and orchestration placement remain Design decisions unless Control Tower supplies constraints.
6. Confirm WAIT_FOR_OWNER and reviewed admission/exit rules for active artifacts; no hygiene takeover.
7. Confirm migration binds exact 67-file inventory/current hashes and stops on drift, with no arbitrary rebaseline; approve which owners may subsequently authorize each mutable subset.

## Analysis Conclusion

BLOCKED_NEEDS_REVIEW

Bounded Proposal/Analysis are prepared for Gate 1 decision. Requirement-level questions 1–4 must be explicitly resolved before Specs; approval word alone cannot silently answer them. Representation/orchestration details remain Design work after approved requirements. No Specs, Design or Tasks authored.

SENSITIVE_DESIGN_REQUIRED: YES. Later review must address fail-open/closed behavior, completeness, bypass resistance, stale manifests, safe path classification, enforced alternate validators, generated reproducibility, historical preservation, active-owner conflicts, migration rollback/recovery and auditability.
