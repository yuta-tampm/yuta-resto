```text
Change: release-a-customer-exposure-foundation
Schema: yuta-spec-driven
Task mode: CODEX_ONLY
Review status: APPROVED
Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW
Independent reviewer: /root/release_a_knowledge_review
Approval recorded by: Codex workflow
Approved: 2026-10-01T15:26:50.539Z
Knowledge consolidation: UPDATE_REQUIRED
Created: 2026-10-01T15:23:01.345Z
Finish outcome: COMPLETED
Workflow status: DONE
```

## Completed-change evidence and reason

Twelve approved deltas were synced to main specs and strictly validated: 21/21 specifications passed, with 136 informational long-text notices and zero warnings/errors. The change is archived at `openspec/changes/archive/2026-10-01-release-a-customer-exposure-foundation`; all 17 original archive-file hashes and all 294 reviewed identities remain intact under the explicit path mapping. [finish-result.json](finish-result.json) records the exact sources, validation, synced paths and hashes. No rollback or lifecycle/readiness promotion occurred.

The only proposed canonical Knowledge change repairs the ADR-009 Proposal reference after archive. Current Product homes, Today page pack, routing, Registry and current-state sources already describe the accepted A/internal foundation and preserve its readiness/provider limits. No resolved `NEEDS REVIEW` item or broader Product decision is inferred. Earlier review/QA candidate paths remain historical evidence, with the archive mapping recorded in Gate 3 rather than rewriting frozen source records.

## Exact proposed change

Target: `docs/decisions/ADR-009-release-a-customer-exposure.md`, line 14. Authority classification: non-semantic durable-decision reference maintenance; the accepted decision body, ownership, role/permission, product scope and operational/lifecycle qualifications remain byte-identical.

Current target SHA-256: `e8ab1be4f677e6eeaf649c9349c131c10a53c230eec968d30e05254054a1991e`. Proposed target SHA-256: `ff5d7e77b0313ae4d9633045cdb6cd68c0f2d1c6c002737859847b633fa1e13c`.

Old link destination:

```text
../../openspec/changes/release-a-customer-exposure-foundation/proposal.md#requirement_baseline
```

New link destination:

```text
../../openspec/changes/archive/2026-10-01-release-a-customer-exposure-foundation/proposal.md#requirement_baseline
```

Exact proposed diff: [04-knowledge-consolidation.diff](04-knowledge-consolidation.diff), SHA-256 `80d53355b04fa3cf4b6042b08fa4e020dcf7310d1ccdea38c78884c58133f41d`, 1263 bytes. Full diff:

```diff
diff --git a/docs/decisions/ADR-009-release-a-customer-exposure.md b/docs/decisions/ADR-009-release-a-customer-exposure.md
index e672154685a36ea6383d75a7d0dda8c1ba539189..b746825138cd5406245bf47b6418541f5bc97aa6 100644
--- a/docs/decisions/ADR-009-release-a-customer-exposure.md
+++ b/docs/decisions/ADR-009-release-a-customer-exposure.md
@@ -11,7 +11,7 @@ Decision owners: YUTA product and engineering
 Decision source: The current user chose "Chốt profile A cho instance khách
 hàng; giữ chế độ nội bộ riêng" for
 `release-a-customer-exposure-foundation`, with build/test scope and no
-staging/production activation. The [Proposal requirement baseline](../../openspec/changes/release-a-customer-exposure-foundation/proposal.md#requirement_baseline)
+staging/production activation. The [Proposal requirement baseline](../../openspec/changes/archive/2026-10-01-release-a-customer-exposure-foundation/proposal.md#requirement_baseline)
 and [Gate 1 decision record](../reviews/release-a-customer-exposure-foundation/01-analysis-review.md#current-candidate-3-and-delegation)
 attribute that choice. [RR-01–RR-03](../PRODUCT_RELEASE_ROADMAP.md#bounded-foundation-and-release-a-decisions)
 provide the accepted release-specific Product baseline. The
```

The archived Proposal exists, retains its reviewed hash and contains the same `REQUIREMENT_BASELINE` anchor. Target path set is exactly one ADR file. The Knowledge Review packet and Gate 3 may additionally record bounded review/apply/validation/outcome metadata, per the canonical protocol. No source code, normative main spec, Product Decision, lifecycle, permission, ownership, durable boundary, deployment or readiness edit is proposed.

## Required independent review and application

Within the current user's step-3 full-completion delegation, CODEX_ONLY requires a fresh separate read-only reviewer for this exact proposed diff and current target hash. The Gate 3 author and its earlier reviewer continuation cannot approve this new Knowledge diff. Recheck the exact target/diff hashes before application; retain the archive and normative promotion if this post-archive review is pending. No canonical Knowledge edit has been applied.

After a valid review or an explicit current-user bounded alternative, apply only the exact one-link diff, run targeted formatting and documentation/architecture checks, record the actual approval/apply evidence and close DONE. Complete the authorized task-local commit on main after the applicable Knowledge obligations. No push or deployment.

## Independent approval and exact application

Mode selection source: actual current-user CODEX_ONLY for the named task and subsequent step-3 full-completion delegation. Independent reviewer: /root/release_a_knowledge_review, separate fresh read-only context (fork_turns: none). Reviewed at 2026-10-01T15:25:50Z. Verdict: APPROVED, no findings or requested changes.

The reviewer checked the complete one-target, one-hunk, one-line diff and independently reconstructed the proposed ADR. Embedded and standalone diff bytes match; the archived Proposal and REQUIREMENT_BASELINE anchor exist, while the active change is absent. Every other ADR byte remains unchanged. No code, normative spec, Product/ownership/permission/lifecycle/readiness edit is introduced.

Exact reviewed packet before approval metadata: b993a9cf93015066b450a197c2867105c3ad913374e314f9dcbe7d13139ad4e6. Exact diff: 80d53355b04fa3cf4b6042b08fa4e020dcf7310d1ccdea38c78884c58133f41d. Target preimage: e8ab1be4f677e6eeaf649c9349c131c10a53c230eec968d30e05254054a1991e. Approved postimage: ff5d7e77b0313ae4d9633045cdb6cd68c0f2d1c6c002737859847b633fa1e13c.

Author Branch B target/diff/path-set recheck passed at 2026-10-01T15:26:50.539Z. Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW. Approval recorded by Codex workflow at 2026-10-01T15:26:50.539Z. Applied exactly the approved one-link replacement to docs/decisions/ADR-009-release-a-customer-exposure.md; postimage verified exact. This branch checks the Knowledge boundary, without reopening active-change gates or repeating sync/archive. Documentation/architecture/targeted-format checks remain pending before DONE.

## Repository workflow completion

Workflow status: DONE. Completed: 2026-10-01T15:27:48.489Z. Knowledge consolidation UPDATE_REQUIRED was resolved by the independently approved exact ADR-009 link repair. Post-apply pnpm docs:check passed (36 current documents), pnpm architecture:check passed and targeted Prettier passed. Full repository pnpm format:check passed with 67 exact preserved artifacts; full workspace typecheck passed. Archive link and REQUIREMENT_BASELINE anchor resolve, and approved ADR postimage remains exact. No rollback or lifecycle value was automatically promoted.

RELEASE_FOLLOW_UP: REQUIRED for a separately requested customer Backoffice activation, with its explicit staging/production profile, deployment/readiness and post-deploy verification authority. Import/publication, provider/privacy and operational limits remain unchanged; no deployment performed. Retained tests/build/Browser QA remain exact historical evaluated evidence; no new runtime/DB/provider QA was executed in this documentation/spec-only closeout.

Task-local commit preference YES is carried from the current user's direct commit request and this step-3 closeout. Safely stage only attributed finalization changes on main after the completed obligations; report the created commit SHA in chat, without editing committed evidence to insert its own identity. No push, PR or branch change.
