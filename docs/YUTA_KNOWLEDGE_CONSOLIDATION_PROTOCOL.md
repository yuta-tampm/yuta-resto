# YUTA Knowledge Consolidation Protocol

Status: Proposed

Visibility: Engineering

Owner: YUTA product and engineering

## Purpose

Knowledge Consolidation runs after a successfully validated OpenSpec change is
archived. It reconciles current repository knowledge with completed evidence
without treating every change as a documentation rewrite.

```text
ARCHIVE
  -> KNOWLEDGE SCAN
     -> NO_UPDATE_REQUIRED -> DONE
     -> UPDATE_REQUIRED
        -> KNOWLEDGE REVIEW
        -> APPLY APPROVED KNOWLEDGE UPDATE
        -> DONE
```

Release/deploy remains a separate operational lane after repository `DONE`.

## Knowledge scan

Inspect only sources that may materially need reconciliation:

- page Product Knowledge and page-pack/as-built evidence;
- owning Module Product Knowledge;
- `docs/PRODUCT_KNOWLEDGE.md` routing;
- `docs/MODULE_REGISTRY.md`;
- lifecycle/current-state documents;
- ADRs and durable decisions;
- `docs/CURRENT_STATE.md` when its broad summary materially changed;
- `NEEDS REVIEW` items actually resolved by the completed change;
- new limitations or future work discovered during implementation/QA.

Classify exactly:

```text
NO_UPDATE_REQUIRED
UPDATE_REQUIRED
```

Do not infer an update merely because code, specs, or an archive exists.

## Authority and lifecycle safeguards

Knowledge Consolidation never automatically:

- approves a Product Decision;
- changes a durable architecture/security/runtime/data boundary;
- changes ownership, roles, permissions, contracts, or APIs;
- promotes Implementation, Environment, Production Readiness, External
  Dependency, or another lifecycle value;
- rewrites normative specs;
- resolves `NEEDS REVIEW` by assumption.

Any such need returns to its own authority/review process.

## No-update path

For `NO_UPDATE_REQUIRED`, record in Gate 3:

```text
Knowledge consolidation: NO_UPDATE_REQUIRED
Reason:
Sources inspected:
Workflow status: DONE
```

Then classify `RELEASE_FOLLOW_UP` as `NOT_REQUIRED`, `REQUIRED`, or `UNKNOWN`.

## Update-required path

Do not edit canonical knowledge. Create:

```text
docs/reviews/<change-name>/04-knowledge-consolidation-review.md
```

The packet includes:

- exact completed-change evidence and reason for updating knowledge;
- exact target files;
- authority classification for every proposed edit;
- exact proposed diff or replacement text;
- SHA-256 hashes of current target files and exact proposed-diff bytes;
- confirmation that no unapproved Product Decision, durable boundary,
  ownership/permission, lifecycle/readiness, or normative-spec change occurs;
- `Review status: AWAITING_HUMAN_REVIEW`.

Record `Workflow status: AWAITING_KNOWLEDGE_REVIEW` in Gate 3 and stop.

## Approved knowledge update

Resume `$yuta-finish-change` against the archive location recorded by Gate 3;
never recreate an active change. Require explicit current-user Knowledge Review
approval for the exact packet.

Before applying, recompute the complete target path set, target-file hashes,
and proposed-diff hash. Any drift changes the packet to
`INVALIDATED_BY_ARTIFACT_CHANGE` and stops without editing.

Apply only the approved diff. Run targeted formatting, `pnpm docs:check`, and
`pnpm architecture:check`; add checks only when the approved edit makes them
applicable. Record applied paths, post-apply hashes, commands/results, and
completion time in the packet and Gate 3, then set `Workflow status: DONE`.

## Operational separation

After `DONE`, report any separate release need:

```text
RELEASE_FOLLOW_UP: NOT_REQUIRED | REQUIRED | UNKNOWN
```

When required, identify runtime/environment, deployment/readiness evidence, and
post-deploy verification. Knowledge Consolidation never deploys:

```text
IMPLEMENTED != PRODUCTION_ENABLED
```
