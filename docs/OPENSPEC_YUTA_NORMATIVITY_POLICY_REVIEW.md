# YUTA OpenSpec Normativity Policy Review

Visibility: Engineering

Owner: YUTA product and engineering

Reviewed: 2026-08-29 against the active OpenSpec 1.11.0 baseline

## 1. Current State

The `yuta-spec-driven` schema is active as the project default. The approved
activation policy still states that schema activation does not make OpenSpec
normative.

Live repository checks found:

```text
Default schema:       yuta-spec-driven
Main OpenSpec specs:  0
Active changes:       0
```

`openspec/specs/**` is therefore still non-normative. No legacy main spec needs
classification or migration before YUTA defines the normative role.

This review defines the governance policy for a future explicit normativity
activation. It does not activate that role, create a spec or change, sync or
archive anything, or modify current authority sources.

## 2. Normative Scope

After a separate explicit normativity activation, content promoted through the
approved gate into `openspec/specs/**` becomes the primary normative authority
for **precise observable behavioral requirements** within its bounded
capability. This includes testable inputs, outputs, state transitions, error
behavior, constraints, and scenarios that users or downstream systems rely on.

Only requirement and scenario semantics carry that normative behavioral role.
Purpose, rationale, provenance, and navigation text remain supporting context
unless they explicitly state a requirement.

Main specs are not authority for:

- repository Implementation state;
- the version deployed in an environment;
- environment enablement;
- Production Readiness;
- external-provider or device readiness;
- executable database shape;
- architecture, security, runtime, or data-ownership boundaries outside the
  bounded requirement; or
- broader Product Knowledge context and purpose.

`openspec/changes/**` is always proposed or in-progress material. Proposal,
analysis, delta specs, design, tasks, apply completion, verification, pending
archive, or the presence of explicit approval evidence does not make a change
artifact normative. Promotion occurs only through an authorized, successful,
validated sync into the main-spec tree after normativity is activated.

## 3. Authority Relationship

The authority relationship is:

| Source                                                      | Controlling question                                                                                     |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Product Knowledge                                           | WHY, broader WHAT, module purpose, product context, relationships, scope, and non-goals                  |
| Accepted ADRs and architecture/security/runtime authorities | Durable product, architecture, authorization, security, runtime, database, and data-ownership boundaries |
| Approved normative `openspec/specs/**`                      | Precise observable behavioral requirements inside those durable boundaries                               |
| Current code and tests                                      | Repository Implemented State and verified implementation coverage                                        |
| Dated deployment/runtime/readiness evidence                 | Deployed version, environment state, Production Readiness, and scoped external readiness                 |

An OpenSpec spec must not silently override an accepted durable boundary.
Specificity does not outrank that boundary. Product Knowledge remains the
broader context source and must not silently override a normative behavioral
requirement; conversely, a spec must not expand broader Product Intent by
implication.

When a source conflict exists at the controlling authority level, the change
stops as `CONFLICT` / `NEEDS REVIEW` until the owning authority resolves it.

## 4. Approval Gate

YUTA should adopt the proposed gate immediately before sync:

```text
change planning
-> apply
-> verify
-> SPEC APPROVAL GATE
   -> not approved: do not sync
   -> approved: sync
-> validate main specs
-> archive
```

This is the best default for YUTA because it separates the governance decision
from the mechanical promotion and lets the accountable reviewer evaluate the
exact verified delta that would become normative. It is not permission to defer
unresolved product or authority decisions until after implementation: analysis
must already stop before specs on requirement-level blockers, and apply must not
start through an unresolved authority conflict.

The approval gate must confirm all of the following:

1. Product Intent for the bounded capability has been accepted.
2. No unresolved `CONFLICT` affects a requirement.
3. Every `NEEDS REVIEW` item affecting requirements is resolved or explicitly
   scoped out of the delta.
4. Delta specs accurately express the approved observable behavior.
5. The specs remain inside accepted ADR, architecture, security, runtime, data,
   legal, and privacy boundaries.
6. When implementation is part of the change, verification evidence supports
   the bounded repository implementation claim. Verification need not establish
   deployment or production readiness.
7. The accountable reviewer explicitly authorizes sync for the identified
   capability paths and delta version.

Production Readiness is not required to approve desired behavioral
requirements. Provider evidence is required when the requirement asserts or
depends on actual provider behavior; otherwise that dependency must remain
explicitly unverified, blocked, or outside the approved requirement scope.

Approval evidence must be dated and auditable and identify the bounded
capability paths, the exact reviewed delta or repository revision, the decision,
any scoped-out items, and explicit sync authorization. A general approval of a
feature, implementation, pull request, or OpenSpec workflow is not sufficient
unless it contains that bounded authorization.

## 5. Reviewer and Authority Rule

The approver is the **accountable YUTA reviewer** for the relevant decision. No
person, title, Codex agent, or OpenSpec command is invented as a universal
approver.

Required authority follows the change scope:

- product behavior requires the applicable Product authority;
- architecture or security boundary changes require the owning architecture or
  security authority before the spec gate can pass;
- legal- or privacy-sensitive behavior requires the applicable legal or privacy
  review;
- provider-dependent behavior requires current provider evidence and the
  applicable external-dependency review; and
- a cross-cutting change may require more than one accountable reviewer.

Codex may assemble evidence and execute an explicitly authorized sync. It may
not approve Product Intent, resolve a conflict by assumption, or infer approval
from workflow status.

## 6. Sync Semantics

```text
approval permits sync
sync performs mechanical promotion
```

Approval is the governance event. `openspec-sync-specs` is the technical action
that applies the reviewed delta to the main-spec tree. Sync cannot create or
substitute for approval.

After normativity is explicitly activated, main-spec content is normative only
when all of these are true:

1. the exact delta passed the approval gate;
2. the accountable reviewer explicitly authorized sync;
3. sync completed without partial or unexpected changes; and
4. the resulting main specs passed validation and diff review.

If sync fails, the last successfully validated main-spec state remains
normative, and the change is not promoted. If sync is partial or misaligned,
stop, preserve evidence, compare against the pre-sync snapshot, and restore that
exact prior state through an explicit recorded technical rollback before
retrying. Do not claim that promotion completed and do not archive the change
as successfully promoted.

## 7. Archive Semantics

The default order for a behavior-changing change is:

```text
approve -> sync -> validate main specs -> archive
```

Archive closes history. It is not an authority event and does not make content
normative, approve Product Intent, prove implementation, or establish any
environment, deployment, readiness, or provider state.

For `skip_specs: true`, there is no behavioral-spec promotion. The change may be
archived after its applicable planning, implementation, verification, and review
policies pass. A placeholder spec must never be created solely to produce a
promotion or silence an archive warning.

## 8. Conflict Policy

Before sync, apply these deterministic rules:

- **Accepted durable boundary conflict:** do not sync. Change the boundary only
  through its own explicit approval authority, then revise and reapprove the
  delta.
- **Broader Product Knowledge conflict:** stop and resolve Product Intent before
  sync; do not let either source silently overwrite the other.
- **Existing main-spec conflict:** use correct `ADDED`, `MODIFIED`, `REMOVED`, or
  `RENAMED` delta semantics so the resulting normative tree has one coherent
  requirement. Do not leave contradictory requirements active.
- **Code conflict:** the spec may remain the normative desired behavior; record
  the mismatch as an implementation gap. Do not weaken or rewrite the spec to
  normalize incorrect code.
- **Production runtime conflict:** record a deployment, environment, or readiness
  gap. Do not change the behavioral requirement merely to match a stale or
  divergent deployment.

If a conflict is discovered after promotion, the higher durable authority still
controls its boundary. Mark the affected spec as disputed for use, stop further
dependent promotion, and create an explicit corrective change; do not silently
edit or reinterpret the main spec.

## 9. Main-Spec Modification Policy

Once main specs are normative, normal behavioral changes must follow:

```text
new change
-> proposal
-> analysis
-> delta specs
-> design/tasks as applicable
-> apply/verify as applicable
-> approval
-> sync
```

Direct manual edits must not change normative behavior. A bounded typo,
formatting, link, or non-semantic clarification may use an approved
non-behavioral documentation process only when diff review proves that no
requirement or scenario meaning changes. A semantic change cannot be labelled a
typo to bypass the gate.

Emergency direct behavioral correction remains prohibited until YUTA separately
approves an emergency correction policy. Until then, use an expedited but
explicit OpenSpec change and the same required authorities.

## 10. Lifecycle Separation

```text
normative spec approved
!= Product Decision automatically APPROVED outside the bounded decision
!= code IMPLEMENTED
!= environment enabled
!= production READY
!= external dependency READY
```

The spec approval gate may provide evidence for a separately scoped Product
Decision update, but that update is a distinct governance action. Sync must not
automatically edit the Module Registry, Product Knowledge, or any of the five
lifecycle dimensions. Implementation, Environment, Production Readiness, and
External Dependency values require their own evidence and authority.

## 11. Clean-Cutover Strategy

YUTA should use a clean cutover because the main-spec tree and active-change
tree are empty:

```text
normativity policy approved
-> explicit current-authority activation
-> every future main spec must pass the approval gate before sync
```

No legacy main-spec audit, migration, or grandfathering is required. Empty
directories do not become authority. The normative role begins only when the
current authority sources are explicitly updated; the first actual normative
content appears only after a future approved delta is successfully synced and
validated.

An explicit current-authority update is required. Approval of this review alone
records the accepted policy but must not silently convert the current repository
position.

## 12. Required Authority Model Update

The later activation step should update `docs/AUTHORITY_MODEL.md` conceptually
as follows:

- accepted durable decisions remain highest for their product, architecture,
  security, runtime, and data-ownership boundaries;
- approved main specs under `openspec/specs/**` are the primary authority for
  precise observable behavioral requirements inside those boundaries;
- Product Knowledge remains the broader Product Intent and context source;
- `openspec/changes/**` remains non-normative proposed or in-progress work;
- current tracked code and tests remain repository Implemented State evidence;
  and
- dated runtime, deployment, readiness, and external evidence remains authority
  for live and production claims.

This conceptual update is proposed only and is not applied in Step 7.6A.

## 13. Failure and Rollback Policy

| Condition                                      | Required action                                                                                                                                                                                           |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Approval is absent or ambiguous                | Do not sync. Request explicit dated, bounded authorization.                                                                                                                                               |
| Verification fails                             | Do not approve the implementation claim, sync, or archive as complete. Correct implementation or revise approved planning, then verify again.                                                             |
| Sync fails                                     | Preserve the last validated normative main-spec state; the change remains unpromoted. Diagnose and retry only after review.                                                                               |
| Sync is partial or creates unexpected conflict | Stop, capture the diff, and explicitly restore the exact pre-sync state. Reconcile the delta and repeat approval when its semantics changed.                                                              |
| Main-spec validation fails                     | Treat promotion as incomplete. Restore the last validated state, fix the delta, reapprove semantic changes, resync, and revalidate.                                                                       |
| An approved spec is later found wrong          | Keep a visible issue/conflict record and create a corrective OpenSpec change. The current spec remains the recorded normative state except where a higher durable boundary requires fail-closed handling. |
| An emergency behavioral correction is needed   | Use an expedited explicit change with the applicable authorities. Do not directly edit normative behavior until a separate emergency policy authorizes that path.                                         |

No rollback is silent. Every restoration records the reason, affected capability,
before/after state, validation result, and authority for the action. Code must be
corrected to meet the normative requirement when code is wrong; the requirement
must not be rewritten merely to match the defect.

## 14. Day-to-Day Flow

For behavior-changing work after normativity activation:

```text
IDEA
  -> PROPOSE
  -> ANALYSIS
  -> SPECS
  -> DESIGN (when applicable)
  -> TASKS
  -> APPLY
  -> VERIFY
  -> APPROVE SPECS
  -> SYNC
  -> VALIDATE MAIN SPECS
  -> ARCHIVE
```

Planning and apply stop on unresolved requirement-level authority findings. The
approval gate reviews the exact delta and authorizes mechanical promotion.

For a true non-behavioral `skip_specs: true` change:

```text
IDEA
  -> PROPOSE / ANALYSIS
  -> DESIGN (when applicable) / TASKS
  -> APPLY / VERIFY
  -> ARCHIVE
```

There is no spec approval or normative promotion in the skip-specs path.

## 15. Exact Activation Changes Proposed

After this review is approved, a separate bounded activation step should make
only these governance changes:

1. Update the current OpenSpec position in `docs/AUTHORITY_MODEL.md` from future
   to active using the conceptual authority relationship in section 12.
2. Update the `openspec/specs/**` routing and integration checkpoint in
   `docs/PRODUCT_KNOWLEDGE.md` to state that successfully gated, synced, and
   validated main specs are normative for precise behavior.
3. Update the OpenSpec relationship in `docs/LIFECYCLE_STATUS_MODEL.md` to remove
   the stale pre-schema/pre-normativity statement while preserving all five
   dimensions and the no-auto-promotion rule.
4. Update the OpenSpec position in `docs/MODULE_REGISTRY.md` to state the active
   normative role; add capability-specific spec links only when approved main
   specs actually exist.
5. Record that this approved policy governs the spec approval, sync, validation,
   conflict, modification, and rollback gates.

That activation step must not create a main spec, change, lifecycle promotion,
or code change. It does not require a config, schema, generated-skill, sync, or
archive modification. The empty main-spec tree remains empty until the first
future behavioral change passes the gate.

## 16. Final Recommendation

`READY_TO_ENABLE_NORMATIVE_SPECS`

The repository has an active authority-aware workflow, an approved activation
policy, and no legacy main specs or changes to reconcile. The policy above gives
YUTA a deterministic approval gate, authority routing, mechanical sync boundary,
validation requirement, lifecycle separation, and failure behavior. A separate
bounded current-authority activation is still required before any main spec is
treated as normative.

Status: APPROVED
