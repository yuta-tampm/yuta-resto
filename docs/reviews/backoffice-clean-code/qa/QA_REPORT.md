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
