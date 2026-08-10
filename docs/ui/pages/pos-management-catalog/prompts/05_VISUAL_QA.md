# Codex Prompt — Phase 5: Visual and Operational QA

First verify that applicable functional/regression checks have passed. If they
failed, report the regression and stop visual parity work unless the failure is
explicitly accepted as a blocker.

Use target-application UI rules/product docs and this page package to determine
the required viewport/device matrix. Do not use a global Backoffice width list.

Capture browser evidence for the target screen and compare it with the approved
hierarchy/reference. Fix major differences in shell alignment, proportions,
density, spacing, typography, semantic color, responsive behavior, overflow,
focus, and touch behavior without changing protected business/runtime behavior.

Verify truthful loading, empty, unauthorized/forbidden, pending, validation,
conflict, error, degraded/offline, device, success, retry, and recovery states
that apply to the target.

For operational/device-coupled screens, also verify that UI state does not
overclaim local service, database, printer, worker, or physical-device success.

Run exact existing repository checks defined by the target app/page. Report
commands and results, browser/device evidence, intentional deviations, deferred
work, and risks. Synchronize the stable page package with the as-built result,
including deviations and final evidence, before setting `Package status:
implemented`. Do not claim visual parity, lint, or a successful check without
evidence.
