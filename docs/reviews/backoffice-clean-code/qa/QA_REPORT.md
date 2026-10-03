# Backoffice clean-code QA

Change: Ordinary maintenance task, no OpenSpec lifecycle.

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

QA status: PASS for the bounded Wave 1 changes.

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
