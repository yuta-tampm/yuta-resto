# YUTA OpenSpec Normativity Activation Report

Visibility: Engineering

Owner: YUTA product and engineering

Activated: 2026-08-29

## Preconditions

All Step 7.6B preconditions passed before the authority-document updates:

- `docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md` is `APPROVED` and retains
  `READY_TO_ENABLE_NORMATIVE_SPECS`;
- `yuta-spec-driven` is the active default schema;
- `openspec/specs/**` contains zero main specs; and
- the repository contains zero active OpenSpec changes.

The empty spec and change trees permit a clean cutover without legacy spec
classification, migration, or grandfathering.

## Authority Changes

Step 7.6B made these bounded current-authority updates:

1. `docs/AUTHORITY_MODEL.md` now records the active normative role, its four
   promotion conditions, the higher durable-boundary authority, and the
   permanent non-normative status of OpenSpec changes.
2. `docs/PRODUCT_KNOWLEDGE.md` now routes precise behavioral requirements to
   successfully promoted main specs, links the approved policy, and preserves
   broader Product Knowledge, Implemented State, and runtime/readiness sources.
3. `docs/LIFECYCLE_STATUS_MODEL.md` now records that normative spec state does
   not promote any lifecycle dimension and that any bounded Product Decision
   update remains separate.
4. `docs/MODULE_REGISTRY.md` now recognizes promoted main specs as precise
   behavioral authority while remaining a lifecycle/ownership index. It adds no
   fake capability link or row while the main-spec count is zero.

No lifecycle value, capability boundary, owner, relationship, or registry row
was changed.

## Normative Rule

```text
exact delta passes accountable approval gate
-> sync is explicitly authorized
-> sync completes successfully
-> resulting main specs pass validation and diff review
-> promoted main-spec content is normative
```

Successfully promoted `openspec/specs/**` content is the primary authority for
precise observable behavioral requirements inside accepted durable product,
architecture, security, runtime, and data-ownership boundaries. File existence
alone is not authority.

## Non-Normative Areas

The following remain non-normative:

- every artifact under `openspec/changes/**`;
- unsynced delta specs;
- output from a failed or partial sync;
- a resulting main-spec state that has not passed validation and diff review;
  and
- an empty main-spec directory.

Approval is the governance event. Sync is mechanical promotion and cannot
create approval.

## Lifecycle Separation

The five lifecycle dimensions remain independent:

- Product Decision;
- Implementation;
- Environment;
- Production Readiness; and
- External Dependency.

Normative spec state does not automatically promote any dimension. Approval and
sync may support a separately bounded Product Decision update, while
implementation, environment, readiness, and external status require their own
evidence and governance actions.

## Repository Safety

- `openspec/config.yaml` was not modified;
- the custom schema and generated OpenSpec skills were not modified;
- no main spec or real change was created;
- no sync or archive command ran;
- no product code or architecture document was modified; and
- pre-existing unrelated worktree changes were preserved.

Only the four approved authority/routing documents and this activation report
belong to Step 7.6B.

Validation results:

| Check                                                | Result                                                                                                                                                                     |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Targeted Prettier check for all five Step 7.6B files | PASS                                                                                                                                                                       |
| `git diff --check` for all five Step 7.6B files      | PASS                                                                                                                                                                       |
| `pnpm docs:check`                                    | PASS — documentation consistency passed for 36 current documents.                                                                                                          |
| `pnpm architecture:check`                            | PASS                                                                                                                                                                       |
| `pnpm -r --if-present typecheck`                     | PASS — all 15 participating workspace projects completed successfully.                                                                                                     |
| Repository-wide `pnpm format:check`                  | BOUNDED PRE-EXISTING FAILURE — 42 out-of-scope generated-skill, archive/task, and schema-template files remain unformatted; none of the five Step 7.6B files was reported. |

## Current State After Activation

```text
Normative role:             ENABLED
Normative main spec count:  0
Active real change count:   0
```

The role is active, but there is no normative behavioral content until a future
real change passes the approved gate and its delta is successfully synced and
validated.

## Final Recommendation

`NORMATIVE_SPECS_POLICY_ACTIVE`

YUTA's authority sources now consistently recognize the approved normative
main-spec role without inventing content, changing lifecycle state, or altering
OpenSpec execution infrastructure.

Status: APPROVED
