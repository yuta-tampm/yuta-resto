Change: review-reply-form-pending-state
Gate: Gate 3 — Final Independent Review
Review status: APPROVED
Created: 2026-09-25T09:08:15+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: NO — bounded route-local presentation change; explicit Design review was approved for Bridge Test 003
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-25T09:15:36+02:00
Reviewed pre-approval packet SHA-256: 5e8414f0777dafa2bb3f537ba15b2e803ecd70a47007018b0d8fe641a3f3797b
Current-user decision: APPROVE Gate 3 — SYNC SPECS AND ARCHIVE
Sync authorization: AUTHORIZED_BY_CURRENT_USER
Archive authorization: AUTHORIZED_BY_CURRENT_USER
Finish outcome: COMPLETED

The review-choice language below is the preserved pre-decision snapshot for the exact packet identified above. The explicit current-user decision and authorization in this approval record supersede its awaiting-review wording.

# Gate 3 — Final Review: Review Reply Form Pending State

## Decision boundary

This packet presents the exact current `PAGE_LOCAL` candidate on `/visibilite-reputation/avis` for a new, explicit Gate 3 decision. `UI_AFFECTING: YES`; `BROWSER_QA_REQUIRED: YES`. Gate 1, Gate 2, and the Bridge Test 003 Design review are approved. The user previously wrote `APPROVE Gate 3` before this required packet existed; that historical chat decision is recorded as context only and **does not approve this new packet or authorize spec sync/archive**. This packet remains `AWAITING_HUMAN_REVIEW` and records no approval source or time.

Gate 3 assessment for this exact candidate: `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`, `VERIFY: PASS`, `QA: PASS`. Tasks: `8/8` complete. `DEV_USABLE: YES`, `MANUAL_TEST_READY: YES`, and `HUMAN_PRODUCT_VALIDATION: ACCEPTED` are separate post-Apply controls. There is no unresolved implementation defect within the approved change scope.

## Approved gate and artifact integrity

Gate 1 packet `docs/reviews/review-reply-form-pending-state/01-analysis-review.md` is APPROVED and binds Proposal/Analysis. Gate 2 packet `02-specs-review.md` is APPROVED and binds the delta Spec with four Requirements and nine Scenarios. The explicit Design packet `02b-design-review.md` is APPROVED and binds the route-local implementation approach. `SENSITIVE_DESIGN_GATE: NOT_TRIGGERED` remains true because no durable/security/provider boundary changed.

Exact-byte SHA-256 command: `Get-FileHash -Algorithm SHA256 -LiteralPath <exact path>`, lowercased. The sorted path set and hashes below were recomputed immediately before packet creation. Baseline HEAD: `fc63fef58345a4d99d07b1a4c9a427c679122bb3`. The separately listed screenshot hashes were likewise checked against exact PNG bytes. No unrelated dirty path is attributed to this change.

| Repository-relative path                                                                                 | SHA-256                                                            |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-reply-form.tsx`   | `d219e4d03174b3c41be9a1deae6d65cd32e73e604109e927dc93514cb41b7db8` |
| `apps/backoffice/test/review-reply-form.test.tsx`                                                        | `2e793f1b3e094e8fee6038ac019b2c7266cecb8888b4a8904516cae2ef317f6e` |
| `docs/reviews/review-reply-form-pending-state/01-analysis-review.md`                                     | `e4f2d04bbebd549021871f90263822b9fe38689bdc50cd90f0c739b8e087a625` |
| `docs/reviews/review-reply-form-pending-state/02-specs-review.md`                                        | `d818b90b1e1cc3f92173fc23429aa29d9e5ed9745e9c060fe422c7788bb4b53a` |
| `docs/reviews/review-reply-form-pending-state/02b-design-review.md`                                      | `67a660529ccac343c7f859a7690b204dd1aaa139f128b75317e81660b0a5b331` |
| `docs/reviews/review-reply-form-pending-state/03-verify-evidence.md`                                     | `7459a6b57fd39e035ac8b979417ebb0e02cea84bedff16a266f419dc72a226ac` |
| `docs/reviews/review-reply-form-pending-state/qa/QA_REPORT.md`                                           | `77cedf6f2c7fa9c34f77380a3356b0e4ef8ae037f2adccb943d63935297075bb` |
| `docs/reviews/review-reply-form-pending-state/qa/screenshot-manifest.md`                                 | `723d230b03f6d82c986783fda6b54ab89504d3e28bd0092296118be85e9855e7` |
| `openspec/changes/review-reply-form-pending-state/analysis.md`                                           | `e038230d05014147275d5468123ca830697f053563715c4dd5e5d250a1a9b7e8` |
| `openspec/changes/review-reply-form-pending-state/design.md`                                             | `638dd3cac9257d1a5ef118d279d91930123e02af03138037e25d747613f50daa` |
| `openspec/changes/review-reply-form-pending-state/proposal.md`                                           | `dfa7d8b2c99f0ec96b1926097cbd2a026ea007a2562428250444078ad7793ce9` |
| `openspec/changes/review-reply-form-pending-state/specs/reputation/reply-draft-pending-feedback/spec.md` | `71115d2e59a52edc2e8b46bc3657683d1f329b8c400087d9d15e10fbb1aff834` |
| `openspec/changes/review-reply-form-pending-state/tasks.md`                                              | `a3f1c444f85d806f1d4b34344ae40721ca3e5572840eb5632a70c0c058ad8518` |

## Design, tasks, and technical contract

The approved Design keeps the route-local `ReplySubmit` in the existing `ReviewReplyForm`. `useFormStatus().pending` remains the sole pending source. The button retains `loading={pending}` and `disabled={disabled || pending}`, so shared Button continues to own native disabled, `aria-busy`, and `data-loading`. The idle label is `Enregistrer`; genuine pending displays `Enregistrement du brouillon…`. No second state, form-level busy, textarea disabling, timer, spinner, shared UI change, or premature success message was added.

All eight Tasks are complete: route-local implementation and focused component test (2), targeted Technical VERIFY (2), DEV_USABLE/manual handoff/Human Product validation (3), and real Browser QA (1). Each used phase's embedded Technical Implementation Contract is traced in the 15-row matrix in `docs/reviews/review-reply-form-pending-state/03-verify-evidence.md`; applicable rows PASS 15/15. Planning and implementation phases did not add Foundation/Data or Service/Domain work.

## Requirement and scenario traceability

| Approved Requirement                                                                | Scenarios (9 total)                                                    | Code, test, and runtime evidence                                                                                                                                                                                |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1 — pending feedback is limited to the selected Google review's draft-save control | Selected Google review; direct feedback unchanged                      | `ReviewReplyForm` remains the Google review detail form. Scoped source diff changes only its local submit label; no Satisfaction route or other form changed. Real authenticated Google demo review used in QA. |
| R2 — idle and pending labels are distinct, without early success                    | Idle; draft save pending; no premature success                         | One ternary uses the existing `pending` value. Focused tests cover exact labels; real pending screenshot shows the saving label; success appears only after the real action result.                             |
| R3 — submit remains disabled and busy during pending; idle disabled rules persist   | Pending cannot be reactivated; idle permission/empty-content disabling | Existing Button props are unchanged. Focused tests cover pending and both idle-disabled paths; real Browser QA observed disabled, `aria-busy=true`, and `data-loading`.                                         |
| R4 — textarea/form and existing result flow are preserved                           | Textarea not additionally locked; success/error follow existing path   | Textarea remains enabled during real pending; form has no `aria-busy`; focused tests cover success/error presentation; genuine save showed `Brouillon enregistré.` and persisted one draft reply.               |

## Scoped implementation attribution and exact diff

Changed implementation paths, sorted:

1. `apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-reply-form.tsx` — tracked, one-line label change.
2. `apps/backoffice/test/review-reply-form.test.tsx` — new untracked focused test, 131 lines.

`git diff --stat -- 'apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-reply-form.tsx'` reports `1 file changed, 1 insertion(+), 1 deletion(-)`. The second path is untracked, so this Git stat does not include its 131 new lines; the complete test diff is explicitly included below. No other production/test file belongs to this candidate.

Deterministic diff inputs, run from repository root: `git diff --no-ext-diff --no-color -- 'apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-reply-form.tsx'`; then `git diff --no-index --no-ext-diff --no-color -- /dev/null 'apps/backoffice/test/review-reply-form.test.tsx'` (expected exit 1 for a new file). Concatenate stdout in that order, normalize CRLF to LF, and strip only trailing LF bytes. The following fenced diff is the exact resulting UTF-8 text. Scoped implementation diff SHA-256: `ba576136e890b1a755da347d000fb0929f89d13ebe47f5daa43d5ca12f8bf592`.

```diff
diff --git a/apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-reply-form.tsx b/apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-reply-form.tsx
index 6d055809..afa68f01 100644
--- a/apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-reply-form.tsx
+++ b/apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-reply-form.tsx
@@ -71,7 +71,7 @@ function ReplySubmit({ disabled }: { disabled: boolean }) {
       disabled={disabled || pending}
     >
       <FilePenLine className="h-4 w-4" />
-      Enregistrer
+      {pending ? 'Enregistrement du brouillon…' : 'Enregistrer'}
     </Button>
   );
 }
diff --git a/apps/backoffice/test/review-reply-form.test.tsx b/apps/backoffice/test/review-reply-form.test.tsx
new file mode 100644
index 00000000..191ff06b
--- /dev/null
+++ b/apps/backoffice/test/review-reply-form.test.tsx
@@ -0,0 +1,131 @@
+import { renderToStaticMarkup } from 'react-dom/server';
+import { beforeEach, describe, expect, it, vi } from 'vitest';
+import type { ReviewDetailRecord } from '../src/app/(authenticated)/visibilite-reputation/avis/reviews-model';
+
+const mocks = vi.hoisted(() => ({
+  actionState: {
+    error: null as string | null,
+    success: null as string | null,
+  },
+  pending: false,
+  saveReplyDraftAction: vi.fn(),
+}));
+
+vi.mock(
+  '../src/app/(authenticated)/visibilite-reputation/avis/actions',
+  () => ({
+    saveReplyDraftAction: mocks.saveReplyDraftAction,
+  }),
+);
+vi.mock('react-dom', () => ({
+  useFormStatus: () => ({ pending: mocks.pending }),
+}));
+vi.mock('react', async (importOriginal) => {
+  const actual = await importOriginal<typeof import('react')>();
+  return {
+    ...actual,
+    useActionState: () => [mocks.actionState, vi.fn()],
+  };
+});
+
+import { ReviewReplyForm } from '../src/app/(authenticated)/visibilite-reputation/avis/_components/review-reply-form';
+
+const review: ReviewDetailRecord = {
+  id: 'google-review-1',
+  source: 'GOOGLE',
+  authorName: 'Client',
+  authorAvatarUrl: null,
+  rating: 5,
+  content: 'Excellent',
+  sentiment: null,
+  urgency: null,
+  status: 'NEW',
+  assignedToUserId: null,
+  receivedAt: '2026-09-24T12:00:00.000Z',
+  incidentId: null,
+  replyStatus: 'DRAFT',
+  externalUrl: null,
+  analysis: null,
+  latestReply: {
+    id: 'reply-1',
+    content: 'Merci pour votre avis.',
+    status: 'DRAFT',
+  },
+  notes: [],
+};
+
+function renderForm(canCreateReply = true) {
+  return renderToStaticMarkup(
+    <ReviewReplyForm review={review} canCreateReply={canCreateReply} />,
+  );
+}
+
+function submitTag(markup: string) {
+  const tag = markup.match(/<button\b[^>]*type="submit"[^>]*>/)?.[0];
+  expect(tag).toBeDefined();
+  return tag ?? '';
+}
+
+describe('ReviewReplyForm pending draft save', () => {
+  beforeEach(() => {
+    mocks.actionState = { error: null, success: null };
+    mocks.pending = false;
+    mocks.saveReplyDraftAction.mockReset();
+  });
+
+  it('keeps the existing idle label and enabled draft form', () => {
+    const markup = renderForm();
+    const button = submitTag(markup);
+
+    expect(markup).toContain('>Enregistrer</button>');
+    expect(markup).not.toContain('Enregistrement du brouillon…');
+    expect(button).not.toContain('disabled=""');
+    expect(button).not.toContain('aria-busy');
+    expect(button).not.toContain('data-loading');
+    expect(markup).toContain('name="feedbackId" value="google-review-1"');
+    expect(markup).toContain('name="content"');
+    expect(markup.match(/<textarea\b[^>]*>/)?.[0]).not.toContain('disabled=""');
+    expect(markup.match(/<form\b[^>]*>/)?.[0]).not.toContain('aria-busy');
+  });
+
+  it('uses the same pending status for visible feedback and button semantics', () => {
+    mocks.pending = true;
+    const markup = renderForm();
+    const button = submitTag(markup);
+
+    expect(markup).toContain('>Enregistrement du brouillon…</button>');
+    expect(markup).not.toContain('>Enregistrer</button>');
+    expect(button).toContain('disabled=""');
+    expect(button).toContain('aria-busy="true"');
+    expect(button).toContain('data-loading=""');
+    expect(markup.match(/<textarea\b[^>]*>/)?.[0]).not.toContain('disabled=""');
+    expect(markup.match(/<form\b[^>]*>/)?.[0]).not.toContain('aria-busy');
+  });
+
+  it('preserves permission and empty-content disabled paths while idle', () => {
+    const forbidden = renderForm(false);
+    expect(submitTag(forbidden)).toContain('disabled=""');
+    expect(forbidden.match(/<textarea\b[^>]*>/)?.[0]).toContain('disabled=""');
+
+    const empty = renderToStaticMarkup(
+      <ReviewReplyForm
+        review={{ ...review, latestReply: null }}
+        canCreateReply
+      />,
+    );
+    expect(submitTag(empty)).toContain('disabled=""');
+    expect(empty.match(/<textarea\b[^>]*>/)?.[0]).not.toContain('disabled=""');
+  });
+
+  it('keeps the existing success and error result presentation', () => {
+    mocks.actionState = { error: null, success: 'Brouillon enregistré.' };
+    const success = renderForm();
+    expect(success).toContain('role="status"');
+    expect(success).toContain('Brouillon enregistré.');
+
+    mocks.actionState = { error: 'Échec de l’enregistrement.', success: null };
+    const error = renderForm();
+    expect(error).toContain('role="alert"');
+    expect(error).toContain('Échec de l’enregistrement.');
+  });
+});
```

## Technical Implementation Compliance and TECHNICAL VERIFY

`TECHNICAL IMPLEMENTATION COMPLIANCE: PASS` with 15/15 applicable contract rows PASS and zero FAIL. `VERIFY: PASS` for all four Requirements and nine Scenarios, approved Design, scoped implementation, targeted checks, and preserved authorization/business/runtime boundaries. The full assessment and Technical Compliance Matrix source are `docs/reviews/review-reply-form-pending-state/03-verify-evidence.md` at SHA-256 `7459a6b57fd39e035ac8b979417ebb0e02cea84bedff16a266f419dc72a226ac`. The exact matrix-section source SHA-256 is `ffe6599080558e2ddaefa45998ed71318d31b4591b8619be3de8a0fdc061a88e` using the byte range defined below. This is the same reviewed source, not a separate new technical claim.

Canonical verification evidence block SHA-256: `20539ded27f187f014dcac1c3dacb5f495acced3c6a5bebd20affa9130a1ad59` over the UTF-8 bytes between the following fence lines, excluding the fence lines and the trailing line-feed immediately before the closing fence:

```text
Assessment source: docs/reviews/review-reply-form-pending-state/03-verify-evidence.md
Assessment source SHA-256: 7459a6b57fd39e035ac8b979417ebb0e02cea84bedff16a266f419dc72a226ac
Technical Compliance Matrix source: exact byte range from heading "## Technical compliance matrix" up to but excluding heading "## Commands, freshness and scope" in that assessment source
Technical Compliance Matrix source SHA-256: ffe6599080558e2ddaefa45998ed71318d31b4591b8619be3de8a0fdc061a88e
Technical Implementation Compliance: PASS (15/15 applicable matrix rows)
VERIFY: PASS (4/4 Requirements, 9/9 Scenarios; no unauthorized scope expansion)
pnpm typegen:next => PASS, 6/6 apps (prior, same source candidate)
pnpm --filter @yuta/backoffice exec vitest run test/review-reply-form.test.tsx => PASS, 1 file/4 tests (prior, same source candidate)
pnpm --filter @yuta/backoffice typecheck => PASS (prior, same source candidate)
pnpm architecture:check => PASS (prior, no ownership/import change)
pnpm docs:check => PASS, 36 current documents (formal VERIFY stage)
pnpm -r --if-present typecheck => PASS, 15 participating workspaces (formal VERIFY stage)
pnpm exec openspec validate review-reply-form-pending-state --type change --strict --json --no-interactive => PASS, 1/1 change, zero issues (approved Spec bytes)
Scoped pnpm exec prettier --check and whitespace/diff checks => PASS for source/test/evidence in their applicable stages
Full Backoffice suite, production build, repo-wide format, broader auth/tenant/DB tests => NOT_RUN; route-local copy change, no affected boundary; see assessment source for rationale
```

No broad suite, production build, repository-wide format, or new security/data test is claimed. Their skip rationale is in the VERIFY report. The implementation source and test hashes above still match the checks' candidate. No new technical command was run merely to create this review packet.

## QA and post-Apply controls

`QA: PASS` on the actual authenticated Backoffice route, with an OWNER seed identity, LUNA establishment, and an existing Google demo review. Desktop `1366x768` and mobile `390x844` each observed idle, naturally occurring pending, and the completed save. The pending button had the exact label, native disabled, `aria-busy=true`, and `data-loading`; textarea stayed enabled, form had no busy marker, the existing success message appeared, and idle state returned. No horizontal overflow occurred. Tab focused the save button with visible focus; Enter submitted successfully. Final browser runs had zero console errors or warnings. No Google provider publication occurred.

QA report: `docs/reviews/review-reply-form-pending-state/qa/QA_REPORT.md` (SHA-256 `77cedf6f2c7fa9c34f77380a3356b0e4ef8ae037f2adccb943d63935297075bb`). Screenshot manifest: `docs/reviews/review-reply-form-pending-state/qa/screenshot-manifest.md` (SHA-256 `723d230b03f6d82c986783fda6b54ab89504d3e28bd0092296118be85e9855e7`). Seven original PNG byte hashes were rechecked against that manifest:

| Repository-relative screenshot                                                        | SHA-256                                                            |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/review-reply-form-pending-state/qa/desktop-idle-1366x768.png`           | `846e0fc648235e9295ebf8f98582703e7e5b300d3246305b805dfa5c9cf0eb53` |
| `docs/reviews/review-reply-form-pending-state/qa/desktop-keyboard-focus-1366x768.png` | `b066264f802e3d435c11440d87d1dd4676cd142785324567daf71b1caafbd877` |
| `docs/reviews/review-reply-form-pending-state/qa/desktop-pending-1366x768.png`        | `d9d8aedb3c3b034bc753dd0d8a0fb3b6c57d04fb0f8d36efeab31784a6a0edee` |
| `docs/reviews/review-reply-form-pending-state/qa/desktop-saved-1366x768.png`          | `d62642b0eac90255bed953bb05de8246787701cf3693d2427b7b6add6204d422` |
| `docs/reviews/review-reply-form-pending-state/qa/mobile-idle-390x844.png`             | `ff9977b72447b36bcc5d147cff45f3af727287ae0c18d6d18fa3015c63c9e760` |
| `docs/reviews/review-reply-form-pending-state/qa/mobile-pending-390x844.png`          | `21cb3bf241d6ea253033dbb95a20a77ce1c8cc1f818121247e9796a414871fd7` |
| `docs/reviews/review-reply-form-pending-state/qa/mobile-saved-390x844.png`            | `633e2340e7ce7b280742f90e282a391a4b569411ea72109ee3950efa2436ca26` |

`DEV_USABLE: YES`: local authenticated route and genuine persisted draft save worked. `MANUAL_TEST_READY: YES`: repeatable safe test handoff recorded in Tasks. `HUMAN_PRODUCT_VALIDATION: ACCEPTED`: the current user's explicit verdict covered the pending indication, wording, disabled-submit UX, and no confusing regression reported; the user supplied no more detailed observation. These controls do not substitute for Technical VERIFY or Browser QA.

## Scope, deviations, and limitations

The scoped implementation diff shows no change to `saveReplyDraftAction`, contracts/schemas/API, database/schema, auth/authz, trusted tenant/organization/establishment or STAFF assignment rules, validation/business logic, persistence/audit/revalidation, shared `@yuta/ui`, navigation, or Google publication. The separate `async-interaction-feedback-foundation` change and unrelated dirty work remain untouched. There is no approved-Spec/Design deviation or newly discovered Product decision within this candidate.

The local Windows default cloud DB host port `55431` is reserved. The real development tests used the existing DB volume through process-only port `56431`; this override needs reapplication after local restart and is an environment limitation, not a Product defect. Browser QA exercised the authorized OWNER path; existing permission and error presentation were covered by focused/static evidence without manufacturing provider or permission failures. This packet does not claim deployment, release, Google publication readiness, or Production Readiness.

## Git scope and review choice

The changed-file list for this change is exactly the two implementation paths above plus its own planning, review, Tasks, and QA evidence files. The scoped implementation diff hash deliberately excludes unrelated dirty repository-format and VLOCK changes. `git diff --stat` on the tracked implementation path alone is incomplete because the new focused test remains untracked; both paths are shown in the full diff above. No commit or push is required by this packet.

Recommendation: `APPROVE_GATE_3_WITH_EXPLICIT_SYNC_AUTHORIZATION_IF_READY`. The current user may choose exactly `APPROVE Gate 3`, `REQUEST CHANGES at Gate 3`, or `DEFER Gate 3` for this packet and its exact hashes. For immediate finalization after an approval, the current user must **also explicitly authorize SYNC SPECS AND ARCHIVE** for `review-reply-form-pending-state`. Neither the prior chat decision nor this recommendation supplies that separate authorization. `Sync authorization: PENDING` remains until such an instruction is received.

Gate 3 approval alone does not mean the delta is synced, the change is archived or DONE, or the feature is deployed, released, production-ready, or Google-provider-ready. The repository-authoritative finish workflow must separately reconcile this packet and every reviewed hash, perform any authorized normative sync and validation, archive, then classify Knowledge Consolidation. No such finalization action is performed by this packet.

## Finalization completion record

Branch: `yuta-finish-change` active-change finalization (Branch A). The original awaiting-review packet SHA-256 was `5e8414f0777dafa2bb3f537ba15b2e803ecd70a47007018b0d8fe641a3f3797b`; its post-approval, pre-finalization SHA-256 was `eb0dbc20ebf4b78c5a72d563038f9e2796055c9c285632d5e2f49ebf8781d56c`. Before approval, the exact packet verifier passed all 20 artifact and screenshot hash rows, the scoped implementation diff hash, the canonical VERIFY block hash, and the Technical Compliance Matrix section hash. The production, focused-test, Tasks, VERIFY, QA, and screenshot bytes were unchanged. Gate 1, Gate 2, and Design remained approved; Technical Implementation Compliance, VERIFY, and QA remained PASS; Tasks remained 8/8; DEV_USABLE and MANUAL_TEST_READY remained YES; HUMAN_PRODUCT_VALIDATION remained ACCEPTED.

Pre-sync main-spec snapshot: `openspec/specs/reputation/reply-draft-pending-feedback/spec.md` did not exist and had no scoped Git edits. OpenSpec status selected exactly one delta: `openspec/changes/review-reply-form-pending-state/specs/reputation/reply-draft-pending-feedback/spec.md`. `pnpm exec openspec instructions specs --change review-reply-form-pending-state --json` succeeded and supplied the current artifact instructions and language context. The generated `openspec-sync-specs` workflow was performed inline: it created `openspec/specs/reputation/reply-draft-pending-feedback/spec.md` with the delta Purpose and all four ADDED Requirements and nine Scenarios under the main `## Requirements` header. The source Purpose and requirement text matched the approved delta exactly; operation headers and delta workflow notes were not promoted. No other main spec changed. Main-spec SHA-256: `252430fecf4732ca55de0fd5c564870d7ddd43ad6fe3a37a502b36acefff36d6`.

Main-spec validation: `pnpm exec openspec validate --specs --strict` PASS, 19/19 specs, zero failures, before and after archive. `pnpm exec openspec validate review-reply-form-pending-state --type change --strict --json --no-interactive` PASS, 1/1 change before archive. Scoped Prettier PASS. Post-archive `pnpm docs:check` PASS (36 current documents), `pnpm architecture:check` PASS, and `pnpm -r --if-present typecheck` PASS (15 participating workspaces). Prior focused test and Browser QA evidence remains bound to the unchanged implementation; neither was rerun during finalization.

Archive: `pnpm exec openspec instructions archive --change review-reply-form-pending-state --json` was read. The generated `openspec-archive-change` workflow's resolved-root move was performed synchronously with PowerShell `Move-Item` after checking both absolute paths were within this workspace and the target did not exist. Archive location: `openspec/changes/archive/2026-09-25-review-reply-form-pending-state`. The active change path is absent; `pnpm exec openspec list --json` no longer lists it. Archived `.openspec.yaml`, Proposal, Analysis, delta Spec, Design, and Tasks exist; their reviewed hashes match the pre-archive bytes. There were no incomplete-artifact or incomplete-task warnings. Review and QA evidence remains at `docs/reviews/review-reply-form-pending-state/` with its approved path/hash set.

Knowledge consolidation: NO_UPDATE_REQUIRED. Reason: this bounded button-state behavior is now in the normative main Spec; the existing Reputation knowledge already records persisted manual Google reply drafts, and no module ownership, Product Decision, milestone, lifecycle value, readiness, authorization boundary, or page pack changed. No `NEEDS REVIEW` item was resolved. Sources inspected: `docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`, `docs/features/reputation/README.md`, `docs/features/reputation/STATUS.md`, `docs/PRODUCT_KNOWLEDGE.md`, `docs/MODULE_REGISTRY.md`, `docs/CURRENT_STATE.md`, and `docs/ui/pages/README.md`. Knowledge review: NOT_REQUIRED. Knowledge files updated: NONE.

Specs: synced and validated `openspec/specs/reputation/reply-draft-pending-feedback/spec.md`. Completed: 2026-09-25T09:17:24+02:00. Workflow status: DONE. RELEASE_FOLLOW_UP: REQUIRED for a separate Backoffice release if this UX is to reach a deployed environment; that lane requires its own deployment/readiness evidence and post-deploy verification. No deployment, release, commit, push, or Google publication was performed. No lifecycle value was automatically promoted. The local Windows default DB port `55431` remains reserved; earlier development QA used a process-only `56431` override, with no tracked configuration change. Unrelated dirty work and the separate `async-interaction-feedback-foundation` change were preserved.
