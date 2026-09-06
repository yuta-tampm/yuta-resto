# Knowledge Consolidation Review — Reputation Review and Social Links Configuration

Change: `reputation-review-social-links-configuration`

Review status: `APPROVED`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-06T15:41:38.4268280+02:00`

Knowledge consolidation: `COMPLETED` — approved `UPDATE_REQUIRED` path

Workflow status: `DONE`

Created: `2026-09-06T15:33:24.1810836+02:00`

## Why an update is required

The completed change is synced, validated, and archived. The owning durable
Reputation Product Knowledge and stable Satisfaction page pack already describe
the as-built behavior. The operational Reputation tracker still predates this
completed slice and does not list the implemented OWNER-only three-link
configuration or its shared safe public projection.

This proposal reconciles that tracker only. It does not create Product intent or
change a durable boundary.

## Completed-change evidence

- Gate 3: `APPROVED`
- Technical Implementation Compliance: `PASS`
- VERIFY: `PASS`
- QA: `PASS`
- Tasks: `33/33 COMPLETE`
- Approved implementation aggregate SHA-256:
  `0faa1b118f6b7104f1463c83c9279a99cbf138b31eea13c4aea51d1cb75f327f`
- Main capability Spec:
  `openspec/specs/reputation/review-social-links-configuration/spec.md`
- Main Spec SHA-256:
  `80a228f2fad6431d817218e9fde147159f583fab4f6bfd495e73d9d9e0d2c756`
- Archive:
  `openspec/changes/archive/2026-09-06-reputation-review-social-links-configuration`
- Implementation file integrity after archive: `14/14 MATCH`

## Proposed target and integrity boundary

| Target                               | Current SHA-256                                                    | Authority classification                                                             |
| ------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `docs/features/reputation/STATUS.md` | `e4e31d3ffa26a8ca3a673a0cf386747aaf2bc9f517d265b32c0693b9085cb1ed` | Operational tracker reconciliation from approved, implemented, and verified behavior |

No other canonical Knowledge file is proposed for modification. In particular,
the owning `docs/features/reputation/README.md`, Product Knowledge routing,
Module Registry, Current State summary, and stable page pack are already
accurate at their intended level of detail.

## Exact proposed diff

Canonical proposed-diff artifact:
[`04-proposed-knowledge.patch`](04-proposed-knowledge.patch)

Proposed-diff SHA-256:
`efaed1f98cf1f2f75731590a420948da64904e199b45cf2e68c1b0b345c0e26f`

```diff
diff --git a/docs/features/reputation/STATUS.md b/docs/features/reputation/STATUS.md
--- a/docs/features/reputation/STATUS.md
+++ b/docs/features/reputation/STATUS.md
@@ -6,7 +6,7 @@ Visibility: Engineering

 Owner: YUTA engineering

-Last updated: 2026-08-08
+Last updated: 2026-09-06

 This file is the operational implementation tracker for
 the reputation feature. Durable behavior belongs in the adjacent `README.md`.
@@ -21,6 +21,11 @@ Implement idempotent Google review import and a manual synchronization action.
   reads, permissions, LUNA seed data, and the independent `feedback-web` app.
 - Unified inbox list and feedback detail reads.
 - Public direct-feedback page with validation, consent handling, external review
   links, tenant resolution, and abuse rate limiting.
+- OWNER-only configuration of the active establishment's Google review,
+  Facebook, and Instagram destinations through one explicit atomic Save.
+- Shared fail-closed URL policy for private validation and public safe projection;
+  missing Reputation settings remain unavailable and are not provisioned by this
+  capability.
 - Database-backed back-office authentication with HttpOnly sessions.
 - Tenant and establishment selector with server-side membership validation and
   session rotation.
```

`git apply --check` against the current target bytes: `PASS`.

## Boundary confirmation

The proposed update records only already-approved facts:

- OWNER alone manages exactly the Google review, Facebook, and Instagram URLs
  for the trusted active establishment;
- one explicit atomic Save is used;
- private validation and public projection share the fail-closed URL policy;
- a missing `reputation_settings` row remains unavailable and is not provisioned
  by this capability.

The proposal does not:

- approve a new Product Decision;
- change ownership, permissions, tenancy, authorization, or runtime boundaries;
- change lifecycle, Environment, Production Readiness, or provider readiness;
- edit a normative Spec or archived change;
- authorize settings-row provisioning, deployment, production data mutation, or
  any production operation.

Production remains `NOT_AUTHORIZED`.

## Sources inspected

- `docs/features/reputation/README.md`
- `docs/features/reputation/STATUS.md`
- `docs/PRODUCT_KNOWLEDGE.md`
- `docs/MODULE_REGISTRY.md`
- `docs/CURRENT_STATE.md`
- `docs/ui/pages/backoffice-visibilite-reputation-satisfaction/README.md`
- `docs/reviews/reputation-review-social-links-configuration/03-final-review.md`
- `docs/reviews/reputation-review-social-links-configuration/03-verify-evidence.md`
- `openspec/specs/reputation/review-social-links-configuration/spec.md`

## Application and closure result

Knowledge Review: `APPROVED`

Patch disposition: `APPROVED_AND_APPLIED`

Approval source: explicit current-user instruction

Applied target: `docs/features/reputation/STATUS.md`

Target preimage SHA-256:
`e4e31d3ffa26a8ca3a673a0cf386747aaf2bc9f517d265b32c0693b9085cb1ed`

Target post-apply SHA-256:
`1df9c82d22a18b2bdab2f0ae5d8c20a31f464c4f007c74d3ad2929b439ef8cc1`

The approved patch reverse-applies cleanly to the post-apply target. Combined
with the exact approved preimage and patch hashes, this proves the resulting
target bytes are the approved patch outcome. Only this one canonical Knowledge
file changed in the Knowledge application step.

Validation completed at `2026-09-06T15:43:19.9291424+02:00`:

- `pnpm exec prettier --check docs/features/reputation/STATUS.md`: `PASS`
- `pnpm docs:check`: `PASS` — 36 current documents
- `pnpm architecture:check`: `PASS`
- `pnpm exec openspec validate --specs --strict`: `PASS` — 12/12
- approved implementation aggregate: `MATCH`
- current implementation file integrity: `14/14 MATCH`
- synced main Spec: present and hash `MATCH`
- exact archive occurrence: `1`
- active change occurrence: `0`

No implementation source, production configuration, production data, provider
state, or deployment state changed during Knowledge application. Production
remains `NOT_AUTHORIZED`.
