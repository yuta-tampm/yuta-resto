# Backoffice clean-code QA

Change: Ordinary maintenance task, no OpenSpec lifecycle.

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

QA status: PASS for task-scoped maintenance Waves 1–6. Global repository formatting remains FAIL on 149 unchanged files outside this task. Wave-specific classifications and limitations follow.

## Wave 1

Routes: `/equipe/registre-personnel`, `/equipe/formalites-personnel/<synthetic employee>`, `/reservations`.

Data/test setup: Actual development Backoffice on loopback `localhost:3107`, exposure `internal`, normal login and establishment selection. Task-owned PostgreSQL 17 Alpine container `yuta-cleanup-829ac3ae`, loopback port `54339`, tmpfs-only storage, database and user `yuta_backoffice_cleanup_test`. Container identity, task label, mount and loopback binding were verified before migration and fixture writes. Existing Cloud/POS/Display containers were preserved. Fixture setup reused the real seed, Personnel creation, history cutover and Register repositories only on the independently verified disposable target. Three fictional employees, one inscription, one synthetic OWNER and one synthetic STAFF were used. Credentials and opt-ins were process-only; no environment file was changed. Google retrieval/publication and contract-extraction provider mode were disabled. No real PDF upload/storage or external provider operation was performed.

Roles/states: OWNER; STAFF denial. Viewports: 1440x900, 1024x768, 768x1024, 390x844.

Scenarios tested:

- OWNER opens the real Register correction dialog: effective date equals the server's Paris business date `2026-10-03`. Executable server-route tests separately cover the Paris midnight boundary and a different tenant timezone.
- Correction fields, reachable controls and local-day default inspected at all four widths. No horizontal overflow: document width equals viewport width. Escape closes the dialog and restores focus to `Corriger`.
- Loaded CDI route; stopping only the owned Next process tree makes create reject through the actual Server Action transport. Feedback becomes `Enregistrement incertain`; create is enabled again and focus moves to feedback. All four responsive error screenshots inspected.
- Reload while the server is unavailable shows `Actualisation impossible` and a usable retry control. Loading is released. Rejected Promise, duplicate-submit prevention and same-intent operation-key reuse have executable unit evidence.
- Restart restores the environment and actual create succeeds. Next development HMR automatically reloads the document after restart, so same-key retry across that restart was not claimed as Browser QA; it is covered by unit orchestration tests.
- Actual manual Booking submit with 30 guests returns the `partySize` field message. A subsequent submit with 2 guests and `2028-01-01` returns the date message and clears the party error (`aria-invalid`: date true, party false). Native required inputs remain enforced. No successful reservation was requested.
- STAFF Register access displays `Accès réservé` with no Personnel data. The unchanged connected Formalités guard denies STAFF before loading the dossier; its existing generic retry boundary returns HTTP 500. This pre-existing denial presentation was observed, is outside the four fixes, and is not represented as improved forbidden UX.

Accessibility checks: French feedback and field labels; feedback focus after rejection; submit/reload re-enabled; Register Escape/focus restoration; Booking field `aria-invalid` follows the current error. Screen-reader speech was not assessed.

Visual/responsive findings: All twelve actual screenshots inspected. No new horizontal overflow or unreachable correction controls. Existing page/dialog scrolling and shell are preserved.

Regression findings: 135 Backoffice test files pass, 1,598 cases pass; 54 gated cases are skipped. Backoffice production build, documentation, architecture and recursive workspace typecheck pass. Global formatting fails on 149 unchanged files outside this task; changed files are scoped-format checked. No source dependency/schema/auth/tenant guard change.

Known limitations: Synthetic local evidence does not claim production, real-provider, legal-template or PDF-scanner readiness. Committed-PDF rollback and replay behavior are verified through real actions with mocked repository/storage/cache dependencies; no live signed PDF was used. HMR restart limitation and unchanged STAFF Formalités error presentation are recorded above.

Screenshot evidence: [screenshot-manifest.md](screenshot-manifest.md) and [wave-1-screenshots.json](wave-1-screenshots.json), with exact lowercase SHA-256 hashes. Screenshots are JPEG bytes, consistently named `.jpg`.

## Wave 2

QA status: PASS for responsibility-based UI extraction in the bounded maintenance task. Same normal routes, OWNER session and disposable environment as Wave 1; no bypass or fixture UI.

Scenarios tested:

- Salaries quick view: Camille access-history next/previous pagination, return to page one, then switch to Alex with cursor reset and no stale Camille results. Sixty synthetic access rows were added only to the verified task-owned database for pagination.
- Alex identity correction saved through the real action while viewing history: given names changed from Alex to Alex QA2, editor closed, focus returned to Modifier, and history displayed the persisted before/after values and synthetic reason. The full dossier route subsequently displayed the stored correction. A separate full-dossier edit/save was not performed.
- Quick access view and full dossier history inspected at 1440x900, 1024x768, 768x1024 and 390x844. Document width equals viewport width.
- Register correction: toggling the temporary-company checkbox revealed the extracted fields; all four widths inspected. Escape closed the dialog and restored focus to Corriger. Reopen reset checkbox defaults and retained the trusted effective date 2026-10-03. Actual synthetic position correction saved, closed/refreshed the dialog and row, displayed revision 2, and returned focus to Corriger.
- Connected CDI: actual preparation changes saved through the existing action, first include and then exclude; Modifications enregistrées displayed and the stored exclude choice survived opening a fresh route tab. The extracted editable panel was inspected at all four widths. The abandon dialog focused Motif, kept empty-reason confirmation disabled, and Annuler closed it without abandoning the draft. Closing returned focus to BODY, matching the unchanged dialog behavior; no focus-restoration improvement is claimed.

Visual/accessibility findings: Sixteen current screenshots inspected, with actual viewport metrics and exact SHA-256. Existing scrolling and controls are retained. At 768px the full-dossier header actions crowd/partly obscure the employee name in the unchanged employee-details component; this existing layout limitation is outside the extraction scope. No new document horizontal overflow was found. French labels, history controls, checkbox defaults, revision refresh and tested focus behavior remain functional. Screen-reader speech was not assessed.

Recovery/evidence limits: Leaving a dirty CDI workspace displayed the native confirmation and blocked the browser automation tool. Human assistance cleared the warning/tab; browser checks then resumed successfully. The native cancel branch was not automatically verified and is not represented as passed Browser QA. Dirty guards and recovery retain source and executable orchestration evidence. Initial CDI screenshots captured a background tab at the wrong viewport; those four files were replaced after verifying the selected fresh tab and actual dimensions. Only the corrected captures are in the manifest.

Validation: 136 Backoffice test files and 1,605 cases pass; one gated file / 54 cases remain skipped. Documentation, architecture, Backoffice production build and final recursive workspace typecheck pass. The initial typecheck found two generic-inference errors in the new history tests; Codex corrected only those two calls, reran six helper cases and typecheck successfully. The original raw diagnostic log was overwritten by the retry; the failure summary is retained in task check evidence. Changed text files pass scoped Prettier. Global format limitations are recorded in task check evidence; no unrelated formatting was changed. No dependency, schema, auth guard, tenant scope or provider change.

Evidence: [wave-2-screenshots.json](wave-2-screenshots.json) and [screenshot-manifest.md](screenshot-manifest.md). Local fictional mutations do not establish production or provider readiness.

## Wave 3

UI_AFFECTING: NO (server command validation, effect ordering and typed reuse; no form/layout/component change). BROWSER_QA_REQUIRED: NO. Non-browser action-boundary QA: PASS. Additional actual history-route smoke: PASS. The task-level YES classification above remains for Waves 1 and 2.

Non-browser evidence exercises the real upload and history actions with mocked repository, storage, scanner and session dependencies:

- Invalid employee/retry/amendment IDs, revisions, dates, references and modes return safe form errors before PDF checks, quarantine, scanning, metadata persistence or rejection audit. The mode is now explicitly create or replace; missing/unknown modes fail instead of silently creating. Normal forms already submit the explicit mode.
- Create and replace send exactly their own validated fields, preserve empty-reference normalization, revisions and trusted tenant arguments, and ignore stray fields from the other branch.
- Real file-status failures, derived file-metadata validation, scanner rejection and storage failure retain appropriate rejection audits and cleanup. A retry keeps its command. Successful metadata persistence remains protected from cache-error cleanup; replay copies alone are discarded. No live PDF/scanner/storage/provider transaction was performed.
- All three history loaders retain trace-before-read order. Denied/unavailable traces prevent reads; temporary read failure can recover; session and MANAGER/STAFF permission rejection propagate before any trace or read. Opaque access cursors are passed unchanged with trusted scope.
- Root and nested F07 field mapping retains existing French copy, fallback keys and semantic-group ownership.

Execution evidence: actual Claude Code completed the authorized three-file command twice, with 81 passing cases each; its guarded receipt shows unchanged HEAD/index and zero path violations. Codex formatted the new history-test wrapping, then the full Backoffice suite passed 137 files / 1,664 cases, with one gated file / 54 cases skipped. Public contracts passed 118 cases and the Personnel history domain passed 14. Documentation, architecture, six-app Next type generation, recursive workspace typecheck and Backoffice production build all passed. Scoped formatting passes. Global format still fails on 149 Git-unchanged files outside the task.

Additional runtime smoke: normal OWNER session on the same independently verified disposable database opened the actual full dossier route after the refactor. Historique loaded Alex's persisted correction from Alex to Alex QA2 and its synthetic reason; Consultations showed the new authorized history-access records and first-page controls. The default 1280x720 screenshot was visually inspected; no new document overflow was present. This smoke does not exercise the unused audit-only history wrapper or live uploads; their applicable ordering/failure behavior is covered by action tests. No further employee mutation was performed in Wave 3.

Expected broad checks not run: repository-wide test:cloud/build:cloud and test:local, replaced by the relevant Backoffice build/test and shared contract/domain commands; live PDF/scanner/provider and gated integration cases remain unexecuted. No OpenSpec lifecycle, production readiness or deployment claim.

Cleanup: task-owned Next process trees were stopped by their exact recorded PIDs; the independently verified tmpfs PostgreSQL container was stopped and removed by its recorded identity. Existing Cloud/POS/Display containers were preserved. Temporary QA tabs were closed and viewport override reset.

Screenshot evidence: [wave-3-screenshots.json](wave-3-screenshots.json) and [screenshot-manifest.md](screenshot-manifest.md).

## Wave 4 — Formalités recovery follow-up

Scope: same task, checkout and branch; `CODEX_ONLY` with Claude Code implementation and Codex integration. Local commits remain authorized by the original user request and the follow-up instruction to implement sequential phases. No OpenSpec change or lifecycle action.

Author: Claude Code session `51ea4a92-11db-4180-a371-b9480d24844b`. All 11 author write paths were checked against the guarded handoff. The runner reported four concurrently appearing, unrelated OpenSpec/review files; its tool transcript confirms no Claude write to those paths and no HEAD/index change. They are preserved and excluded from this candidate and commit.

Functional Browser QA: PASS, seven executable scenarios using the real `CdiDraftWorkspace`, React DOM, Radix dialog and existing UI components in headless Chrome. The test-only Vite fixture uses synthetic deferred action promises, a mocked router refresh, and an ephemeral loopback port. It disables env-file loading, uses no database/session/provider, and closes its server and browser. From the repository root, run `node apps/backoffice/test/browser/personnel-interactions.mjs cdi`; the runner derives fixture paths from its own URL and also supports invocation by absolute path from another directory.

- Returned `server_error`, rejected Promise and `stale_draft` abandonment outcomes expose their feedback inside the modal, focus it, and keep the recovery button usable. The rejected case was tested at 390px; the other cases at 1440px. Successful reload closes the modal and focuses visible success feedback.
- A same-employee prop refresh while save is pending cannot unblock duplicate submit or replace the input. A later refresh while uncertain preserves the original command and operation key for retry.
- Explicit forbidden ends pending, displays non-retry feedback and disables mutation controls; it is not represented as uncertain persistence.
- An uncertain mutation followed by a forbidden same-key retry does not assert whether the earlier attempt persisted. Independent review requested this copy correction and a qualification of the page-pack key-reuse description; both were corrected before completion.
- An employee identity change ignores an older mutation completion.

Action/state/SSR evidence: 60 cases in three focused files pass. Real action tests verify trusted MANAGER/STAFF and independent Personnel-read denial return only `forbidden` before parsing or repository effects, while login/scope redirects, missing-establishment errors and unexpected authorization errors keep their previous behavior. Shared transport schemas, guards and repository protections are unchanged. Documentation, architecture, Backoffice typecheck and changed-file formatting pass.

Retained failed attempts: the initial integration typecheck rejected a union in the new browser fixture, corrected to explicit discriminated branches. Browser fixture bootstrap initially lacked Next's build-time environment substitutions, then its cold dependency startup exceeded an eight-second navigation timeout. Both harness issues were corrected; all seven final cases pass. The copy regression was updated after independent review removed its unsupported persistence assertion. These failures did not identify an additional application defect.

Limits: this is automated component interaction coverage, not a new full Next/session/database end-to-end or responsive visual acceptance. The prior actual-page QA did not cover failed abandonment or prop refresh during an in-flight request. Final full-suite/build/recursive typecheck and global formatting are scheduled for Wave 6; unrelated POS/local and live-provider checks remain outside this follow-up.

## Wave 5 — Employee-scoped history follow-up

Author: Claude Code session `d5c4a823-6d0c-4a43-8a91-2d5bbc8be888`; Codex added and executed the browser fixtures. The nine source/test/document write paths match the handoff. A concurrent change to an unrelated OpenSpec review file caused the runner's whole-checkout scope audit to fail; the author transcript contains no write to it and no HEAD/index change. That file and the other unrelated work remain excluded and preserved.

After the first independent candidate review, the unrelated task committed its nine planning/review paths as `f5aaba21`. No Backoffice follow-up path changed in that commit. Integration review is rebound to this new HEAD before the Wave 5 commit; the original review packet and author base are retained. This commit belongs to the other task and is excluded from the three follow-up commits.

Functional Browser QA: PASS, four scenarios against the real `useEmployeeHistory` hook in the same mounted React instance, with synthetic action ports and the isolated loopback fixture from Wave 4. Run `node apps/backoffice/test/browser/personnel-interactions.mjs history` from the repository root.

- Switching employee while access page two is pending creates a fresh operation ID, drops the old cursor and resets the page index. Render snapshots for the new employee contain no previous-employee data. A late old response is ignored; new-employee paging and Previous still work.
- Switching employee while unified history is pending creates a new operation and ignores the old completion.
- Returned error and rejected access-history requests end loading and recover through a fresh retry ID. The rejected case runs at 390px; other cases run at 1440px.

The hook owns visible state, operation IDs and cursors in an employee-scoped reducer. Both dossier pages use it without caller resets. A shared dossier-access hook replaces duplicate wrappers and ignores superseded trace-request errors. The two presentation load-state types alias the shared generic type. The existing core focus helper remains in use. Server actions, DTOs, guards, tenant scope and trace-before-read are unchanged; the real-action ordering regressions remain in the focused tests.

Validation: 38 cases in two focused files, Backoffice typecheck, docs, architecture and changed-file formatting pass. No failed application check occurred in this phase. Browser evidence covers the hook's real lifecycle, not a new full-page Next/session/database acceptance. Full suite/build/recursive checks remain scheduled for Wave 6. The now-unused `resetHistory` flag in the post-save plan will be removed in the final bounded cleanup.

## Wave 6 — Upload feedback and final cleanup

Author: Claude Code session `37f8bfb9-a7ea-464d-8294-ba4d7f424855`; its guarded receipt reports ten changed paths, zero violations and unchanged HEAD/index. Codex owns the browser integration and final validation. The independently reviewed two-path amendment removes only the unused post-save `resetHistory` result and test expectation. Operation IDs, employee identity and focus scheduling are preserved.

Invalid hidden amendment command fields now use the signed-contract stale-form feedback. Accurate visible date/reference errors remain available, including when hidden and visible fields both fail. Validation still precedes all file reads, storage, scanner, metadata and rejection-audit effects. Invalid server-derived file metadata uses the shared file message and amendment file-field feedback, retaining the `invalid_file` rejection audit and cleanup. The internal PDF-removal export is gone; its body remains inside the existing guarded discard function. The two pure CDI child files inherit their client boundary from the owning workspace. The reload failure helper already had its explicit feedback return type.

Functional Browser QA: PASS, all fifteen final cases from `node apps/backoffice/test/browser/personnel-interactions.mjs all`. Existing CDI recovery and employee-history cases pass again. Four additional cases exercise the actual workspace or Register controller with real React DOM and Radix components:

- A dirty CDI workspace cancels a dispatched `beforeunload` event; returning to the saved selection removes that guard. Dismissing the real navigation confirmation keeps the URL and local selection. No mutation action is sent.
- Opening abandonment focuses Motif and exposes its required 250-character bound. Cancelling the native close confirmation preserves the reason and modal; accepting it clears the reason on reopen and restores field focus.
- Incomplete reconciliation focuses the first missing keep-choice radio and performs no mutation.
- Clicking Corriger on the actual Register page passes the supplied business date through the dialog to the submitted command. Its deliberately fixed date `2031-01-02` is a fixture prop; trusted server-timezone derivation is separately covered by the real route tests.

The two former interaction/wiring source-string assertions are replaced by dialog SSR and these browser scenarios. Retained protected route/hash, browser-storage/autosave and client UTC-date boundary checks resolve source paths relative to `import.meta.url`. SSR renders only dialog content inline while retaining the real Radix root context; browser coverage exercises the real portal.

Validation: 76 focused cases; 137 Backoffice files / 1,696 cases pass, with one gated file / 54 cases skipped. Auth passes 64 cases and tenant passes 11. Docs, architecture, six-app Next type generation, final recursive workspace typecheck and Backoffice production build pass. Changed-file formatting passes. Global `pnpm format:check` fails on 149 files; every reported path is outside the whole follow-up allowlist and unchanged since the Wave 6 base `da1b8920`. Its failure and exact attribution are retained rather than relabelled as a repository-wide PASS. The format-preservation guard itself passes.

Retained corrections: Claude's first focused run had two SSR failures because its inline-content mocks initially removed Radix context. It preserved the real root and all 76 cases passed. Codex's initial recursive typecheck found the new Register fixture missing `pageInfo.hasMore`; the fixture was corrected and all fifteen browser cases passed again. Original failed logs/streams remain in the ignored task evidence.

Limits: action ports and router refresh are synthetic; no new real Next/session/database end-to-end or styled visual/responsive acceptance is claimed. Browser widths are 1440px, with two rejection cases at 390px. No live PDF/storage/scanner/provider execution, production action or OpenSpec lifecycle action was performed. Broad `test:cloud`, `build:cloud` and `test:local` are replaced by relevant Backoffice/shared-package checks; gated integration cases remain unexecuted. Browser and Vite processes are closed by the runner. The unrelated synthetic-AI planning commit is preserved and excluded from task delivery.

During final checks, another task also started changing the current documentation index, Product knowledge and architecture documentation and adding `AI_AND_STORAGE.md`. Those paths are excluded from this candidate and commit, and their bytes are preserved. They were not written by Claude or Codex for this Backoffice task.
