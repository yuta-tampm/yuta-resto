# YUTA Authority Model

Visibility: Engineering

Owner: YUTA product and engineering

Proposed: 2026-08-25

## 1. Purpose

This model tells agents which sources to use when YUTA sources disagree. It
does not change any feature, business rule, status, architecture, or source
document.

YUTA does not use one universal precedence order because different sources
answer different questions. An accepted decision can define intended ownership,
while code proves current behavior, an executable schema defines current data
shape, and dated operational evidence proves release readiness. Before choosing
an authority, the agent must first classify the **knowledge question type**.

Repository instructions such as root and nested `AGENTS.md` always govern how
an agent works in their scope. They are not, by themselves, proof that a
specific product capability is implemented or production-ready.

This proposal reconciles the differing orders recorded in
[`docs/README.md`](README.md), [`docs/ui/README.md`](ui/README.md),
[`docs/architecture/DATA_MODEL.md`](architecture/DATA_MODEL.md), and
[the archived Knowledge Audit](archive/knowledge-normalization/KNOWLEDGE_AUDIT.md)
by applying an order per question type.

## 2. Knowledge question types

### A. Product Intent

What YUTA has decided, approved, or proposes the product should do. Product
Intent includes user outcomes, business rules, capability scope, non-goals,
and public product positioning. Code can reveal divergence, but code alone
does not create product approval.

### B. Implemented State

What the current tracked repository implementation actually does. This
includes routes, guards, contracts, repositories, transactions, provider
boundaries, and tested behavior. Current tracked code and tests describe
repository Implemented State; they do not prove which version is currently
deployed in production. A claim about the live production runtime requires
dated deployment/runtime evidence. A document saying “implemented” is a claim
to verify, not sufficient evidence by itself.

### C. Executable Data Shape

What active schemas and migrations currently define for persisted data.
Transport contracts describe boundary payloads, not database rows. A future
data proposal in prose does not alter the executable shape.

### D. UI Delivery

How a UI target is classified, designed, approved, implemented, and verified.
This covers shared UI governance, application rules, page-pack scope, current
UI code, accessibility, responsive evidence, and visual references.

### E. Production Readiness

Whether a capability has the approved legal, privacy, security,
infrastructure, provider, operational, deployment, and recovery evidence needed
for real production use. Code existence and local QA do not answer this
question.

### F. Authorization / Security

What identity, trusted scope, permission, denial, data-minimization, and
fail-closed rules apply. This is separate because a security invariant cannot
be reduced to Product Intent or inferred only from current code. A mismatch
between the normative security boundary and code may be a defect requiring
review, not a new product decision.

### G. Runtime Ownership

Which application or package owns a runtime, database, device, provider, or
failure domain. This is separate because YUTA treats cloud, POS, and Display
ownership as durable architecture. A route, page pack, or incidental import
must not silently reassign that ownership.

### H. Operational Behavior

How an environment is configured, deployed, migrated, backed up, monitored,
recovered, or operated. This differs from Production Readiness: operations
documents define procedures, while readiness asks whether dated evidence and
approvals satisfy the gates for a particular release.

## 3. Authority matrix

| Question type            | Primary authority                                                                                                                                                                                                           | Secondary authority                                                                                                              | Verification source                                                                                                                               | Sources that must NOT be treated as final authority                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Product Intent           | Accepted ADRs/decisions for durable boundaries; approved normative OpenSpec main specs for specific behavioral requirements inside those boundaries; otherwise, the most specific current approved feature/product document | Current feature/product docs as broader Product Knowledge/context; approved UI product/interaction source for UX-specific intent | Code and tests only to identify implemented alignment or divergence                                                                               | Code alone; `CURRENT_STATE.md` alone; tasks/history; OpenSpec changes; page-pack implementation plans; screenshots                          |
| Implemented State        | Current tracked repository code and relevant tests                                                                                                                                                                          | Contracts, runtime guards, repositories, package manifests, and the most specific current feature/product status source          | Targeted test/typecheck/build and route/import inspection for repository state; dated deployment/runtime evidence for the live production version | Product vision; future phases; tasks; screenshots; `CURRENT_STATE.md` or a status label without code evidence                               |
| Executable Data Shape    | Active executable schemas for the owning database boundary                                                                                                                                                                  | Applied migration history, relevant constraints/indexes, then boundary contracts and current data architecture                   | Migration journal/SQL, schema tests, guarded disposable-database verification                                                                     | UI models; screenshots; tasks; future schema proposals; prose that is not reflected in active schema/migrations                             |
| UI Delivery              | Root/nearest instructions plus current shared and application UI governance                                                                                                                                                 | The current specific page pack and approved page scope; `@yuta/ui` export/token authority                                        | Current UI code, component tests, browser/accessibility/responsive evidence                                                                       | Screenshot/reference image for business logic, permissions, navigation, data shape, or implementation status; generic mockups; tasks        |
| Production Readiness     | `docs/operations/PRODUCTION_READINESS.md` and capability-specific approved readiness gates                                                                                                                                  | Current deployment/operations policy and required external/provider/legal approvals                                              | Dated environment, deployment, migration, monitoring, backup/restore, provider, and release evidence                                              | Code existence; local development success; page-pack QA; a provider plan; an undated claim                                                  |
| Authorization / Security | Relevant accepted decision, root/nearest scoped instructions, and current tenancy/authentication/security architecture                                                                                                      | Specific feature permission policy and trusted-context contract                                                                  | Server guards, repositories, schemas/constraints, audit behavior, and allowed/cross-scope denial tests                                            | Client visibility; browser input; screenshots; fixtures; tasks; code that weakens a higher-authority invariant without an approved decision |
| Runtime Ownership        | Accepted runtime/database ADRs and current runtime/database architecture                                                                                                                                                    | Root/nearest instructions and current product/feature ownership documents                                                        | Active manifests, imports, environment ownership, schema location, architecture checks, and runtime code                                          | Filesystem directory presence alone; page packs; tasks; mockups; convenience imports that contradict the approved boundary                  |
| Operational Behavior     | Current operations authority for the procedure, especially `docs/operations/DEPLOYMENT.md`                                                                                                                                  | Owning product/operator guide and application-specific environment contract                                                      | Current scripts/manifests plus dated runtime/server/journal/health evidence                                                                       | Old commands in tasks/chat; product specs; screenshots; an undocumented local workaround                                                    |

### Matrix interpretation

- “Primary” may contain two complementary sources. An accepted ADR controls a
  durable boundary; a specific current feature/product document controls
  behavior inside that boundary when it does not contradict the decision.
- Instructions control agent conduct and protected scope. They do not replace
  product or implementation evidence.
- Verification can disprove or qualify a claim in prose. It does not silently
  create a new approved requirement.
- `docs/CURRENT_STATE.md` remains a useful project summary and routing source,
  but material conclusions should be checked against the specific authority
  for their question type.

## 4. Conflict resolution rules

1. Classify the question type before selecting sources. If a question contains
   several types, answer each type separately.
2. Apply the corresponding matrix row and inspect the nearest scoped source.
3. If two sources at the same authority level conflict, do not guess. Record
   both files/sources, label the result `CONFLICT`, and stop that conclusion as
   `NEEDS REVIEW`.
4. An accepted decision must not be silently overridden by an OpenSpec change,
   page pack, task, implementation plan, or newer code. Record the divergence
   and request review.
5. Code can prove Implemented State, but it does not by itself prove product
   approval, legal compliance, Production Readiness, or public marketing scope.
6. A task, backlog, completed report, chat, or Git history is not a default
   source of current truth. Use it as context or provenance only.
7. A screenshot or visual reference is not authority for business logic,
   navigation ownership, permissions, contracts, schemas, persistence, or
   capability maturity.
8. If documentation claims a feature is implemented but code/tests cannot
   verify it, label the claim `UNVERIFIED`. If code contradicts the claim,
   label it `CONFLICT`. Do not conclude that it is implemented.
9. If code violates a higher-authority authorization, runtime, data, or public
   visibility boundary, do not normalize the code behavior into Product
   Intent. Report the potential defect as `NEEDS REVIEW`.
10. If an operational claim lacks dated environment evidence, distinguish the
    documented procedure from the unverified execution result.
11. Do not resolve a conflict by editing sources unless a separately approved
    normalization or implementation task authorizes that change.

## 5. Scope and specificity rule

Within the **same authority level**, prefer the current source closest to the
question's product, runtime, feature, route, environment, and date over a broad
summary.

For example,
[`docs/features/public-booking/README.md`](features/public-booking/README.md) is
more specific than [`docs/CURRENT_STATE.md`](CURRENT_STATE.md) for current
public-booking behavior. A route-specific page pack is more specific than the
UI page-pack index for that route's delivery evidence.

Specificity does not allow a lower-authority source to override an accepted
decision, protected runtime/security invariant, executable schema, or
production gate. “More specific” is a tie-breaker within a level, not a way to
bypass the matrix.

## 6. OpenSpec position

### Current position

- YUTA's normative main-spec role is enabled under the approved
  [OpenSpec Normativity Policy](OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md).
- An OpenSpec main spec is normative only when its exact delta passed the
  accountable approval gate, sync was explicitly authorized and completed
  successfully, and the resulting main specs passed validation and diff review.
- The current `openspec/specs/` tree is empty, so no normative main-spec content
  exists yet.
- `openspec/changes/` always represents proposed or in-progress work and is
  non-normative, including after apply or verify.

Accepted durable decisions remain the highest authority for durable product,
architecture, security, runtime, and data-ownership boundaries. Approved
normative OpenSpec main specs are the primary authority for **specific
observable behavioral requirements** inside those accepted boundaries.

Feature/product documents remain the broader Product Knowledge and context
source. They must not silently override an approved normative OpenSpec
behavioral spec. A sync command does not create approval, and apply, verify,
sync, or archive does not by itself prove that a capability is implemented,
deployed, legally approved, externally enabled, or production-ready.

## 7. Examples

### Example 1 — Public feedback ownership

- **Question type:** Runtime Ownership and Implemented State.
- **Sources used:** accepted ADR-004, root instructions, application manifests,
  `apps/feedback-web` routes, and the conflicting statement in
  [`docs/features/public-website/README.md`](features/public-website/README.md).
- **Conclusion:** the current approved and implemented owner of anonymous direct
  feedback is `apps/feedback-web`, not `apps/web`.
- **Why:** the accepted runtime decision and current tracked routes agree. The
  website feature statement is a lower/same-domain stale claim and remains a
  documented inconsistency; this step does not edit it.

### Example 2 — Formalités prototype versus planned wording

- **Question type:** Implemented State, Product Intent, and Production
  Readiness.
- **Sources used:** Formalités routes and runtime guards, its specific page
  pack, the two conflicting sections of `CURRENT_STATE.md`, and
  `PRODUCTION_READINESS.md`.
- **Conclusion:** a development-bounded prototype is implemented; a full
  production Formalités capability is not thereby proven or production-ready.
  The broad “planned personnel formalities” wording is ambiguous about which
  scope it describes.
- **Why:** code can verify the prototype boundary, while production gates
  control readiness. The ambiguous current-state classification is
  `NEEDS REVIEW`, not permission to change either status.

### Example 3 — UI page-pack lifecycle drift

- **Question type:** UI Delivery.
- **Sources used:** shared UI governance, the specific route page-pack README,
  current UI code/evidence, and the broader
  [`docs/ui/pages/README.md`](ui/pages/README.md) index.
- **Conclusion:** the specific page pack is normally closer in scope than the
  index, but conflicting `Status`, `Package status`, base-page status, or
  extension status must be reported as `CONFLICT` and `NEEDS REVIEW` when the
  intended dimension is unclear.
- **Why:** specificity helps locate evidence; it cannot invent a lifecycle
  interpretation or silently rewrite the index.

### Example 4 — Legacy `packages/db` filesystem residue

- **Question type:** Runtime Ownership and Implemented State.
- **Sources used:** accepted database-boundary decision, active package
  manifests, Git-tracked files, imports, and architecture checks.
- **Conclusion:** `packages/db` is not an active YUTA package. Empty folders,
  `node_modules`, or ignored local files do not restore `@yuta/db`.
- **Why:** filesystem presence alone is not implementation authority. Active
  manifests, tracked source, imports, and the approved database boundaries are
  the relevant evidence.

## 8. Agent decision procedure

1. What type of question is this?
2. What is the primary authority for that question type?
3. Is there a more specific source at the same authority level?
4. Does code/test or dated operational verification matter for this conclusion?
5. Are there conflicting sources?
6. If conflict exists, stop and mark `NEEDS REVIEW`.

## 9. Status of this document

Status: APPROVED
