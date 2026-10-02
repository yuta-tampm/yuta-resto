# Executed Phase 2 Checks

Exact captured command output. Local verification only, not deployment.

## backoffice

Command: `pnpm --filter @yuta/backoffice test`

Exit code: 0

```text
$ vitest run

 RUN  v4.1.9 D:/working/yuta/yuta-resto/apps/backoffice


 Test Files  85 passed | 1 skipped (86)
      Tests  436 passed (436)
   Start at  23:02:22
   Duration  16.62s (transform 11.44s, setup 0ms, import 51.93s, tests 3.54s, environment 14ms)
```

## tenant

Command: `pnpm --filter @yuta/tenant test`

Exit code: 0

```text
$ vitest run

 RUN  v4.1.9 D:/working/yuta/yuta-resto/packages/tenant


 Test Files  2 passed (2)
      Tests  11 passed (11)
   Start at  23:02:37
   Duration  702ms (transform 147ms, setup 0ms, import 276ms, tests 22ms, environment 0ms)
```

## build

Command: `pnpm --filter @yuta/backoffice build`

Exit code: 0

```text
$ next build
▲ Next.js 16.2.9 (Turbopack)
- Environments: .env.local, .env

  Creating an optimized production build ...
✓ Compiled successfully in 40s
  Running TypeScript ...
  Finished TypeScript in 40s ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/7) ...
  Generating static pages using 7 workers (1/7)
  Generating static pages using 7 workers (3/7)
  Generating static pages using 7 workers (5/7)
✓ Generating static pages using 7 workers (7/7) in 409ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /acces/aucun-etablissement
├ ƒ /api/personnel/amendments/[employeeId]/[amendmentId]
├ ƒ /api/personnel/documents/[employeeId]/[documentId]
├ ƒ /api/personnel/register/export
├ ƒ /api/reputation/google/oauth/callback
├ ƒ /api/reputation/google/oauth/start
├ ƒ /aujourdhui
├ ƒ /conformite/veille
├ ƒ /connexion
├ ƒ /equipe/formalites-personnel
├ ƒ /equipe/formalites-personnel/[employeeId]
├ ƒ /equipe/planning
├ ƒ /equipe/pointage
├ ƒ /equipe/registre-personnel
├ ƒ /equipe/salaries
├ ƒ /equipe/salaries/[employeeId]
├ ƒ /equipe/taches-quotidiennes
├ ƒ /etablissement/carte-menus
├ ƒ /etablissement/horaires-services
├ ƒ /etablissement/informations-generales
├ ƒ /etablissement/ressources-internes
├ ƒ /etablissement/salles-tables
├ ƒ /marketing/contenus
├ ƒ /marketing/studio-creatif
├ ○ /mot-de-passe-oublie
├ ƒ /parametres/abonnement
├ ƒ /parametres/integrations
├ ƒ /parametres/restaurant
├ ƒ /parametres/utilisateurs-acces
├ ƒ /reinitialiser-mot-de-passe
├ ƒ /reservations
├ ƒ /reservations/[reservationId]
├ ƒ /reservations/calendrier
├ ƒ /reservations/parametres
├ ƒ /resolution-etablissement
├ ƒ /selection-etablissement
├ ƒ /stock/fiches-techniques
├ ƒ /stock/fournisseurs
├ ƒ /stock/inventaire
├ ƒ /stock/mouvements
├ ƒ /visibilite-reputation/avis
├ ƒ /visibilite-reputation/avis/[reviewId]
└ ƒ /visibilite-reputation/satisfaction


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

## checks

Command: `pnpm --filter @yuta/backoffice typecheck; pnpm -r --if-present typecheck; pnpm docs:check; pnpm architecture:check; openspec validate formalites-authorization --strict`

Exit code: 0

```text
$ tsc --noEmit
Scope: 15 of 16 workspace projects
packages/contracts typecheck$ tsc --noEmit
packages/core typecheck$ tsc --noEmit
packages/db-pos typecheck$ tsc --noEmit
packages/tenant typecheck$ tsc --noEmit
packages/tenant typecheck: Done
packages/core typecheck: Done
packages/contracts typecheck: Done
packages/db-pos typecheck: Done
apps/site-agent typecheck$ tsc --noEmit
apps/yuta-pos typecheck$ tsc --noEmit
packages/auth typecheck$ tsc --noEmit
apps/yuta-display typecheck$ tsc --noEmit
packages/auth typecheck: Done
packages/booking typecheck$ tsc --noEmit
packages/booking typecheck: Done
apps/yuta-pos typecheck: Done
apps/yuta-display typecheck: Done
apps/site-agent typecheck: Done
packages/db-cloud typecheck$ tsc --noEmit
packages/db-cloud typecheck: Done
apps/backoffice typecheck$ tsc --noEmit
apps/feedback-web typecheck$ tsc --noEmit
apps/booking-web typecheck$ tsc --noEmit
apps/web typecheck$ tsc --noEmit
apps/feedback-web typecheck: Done
apps/web typecheck: Done
apps/booking-web typecheck: Done
apps/backoffice typecheck: Done
$ node ./scripts/check-documentation-consistency.mjs
Documentation consistency check passed (36 current documents).
$ node ./scripts/check-import-boundaries.mjs
Architecture check passed: runtime imports, database URLs, client boundaries, and migration baselines are valid.
Change 'formalites-authorization' is valid
```

## format

Command: `pnpm format:check`

Exit code: 1

```text
$ prettier --check .
Checking formatting...
[warn] .agents/skills/openspec-apply-change/SKILL.md
[warn] .agents/skills/openspec-archive-change/SKILL.md
[warn] .agents/skills/openspec-continue-change/SKILL.md
[warn] .agents/skills/openspec-explore/SKILL.md
[warn] .agents/skills/openspec-new-change/SKILL.md
[warn] .agents/skills/openspec-propose/SKILL.md
[warn] .agents/skills/openspec-sync-specs/SKILL.md
[warn] .agents/skills/openspec-update-change/SKILL.md
[warn] .agents/skills/openspec-verify-change/SKILL.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_KNOWLEDGE_AUDIT_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_1_AUTHORITY_MODEL_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_2_LIFECYCLE_STATUS_MODEL_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_3_MODULE_REGISTRY_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_1_PERSONNEL_PRODUCT_KNOWLEDGE_HOME_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_2_TODAY_PRODUCT_KNOWLEDGE_HOME_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_3_ESTABLISHMENT_PRODUCT_KNOWLEDGE_HOME_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_4_IDENTITY_ACCESS_PRODUCT_KNOWLEDGE_HOME_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_5_SITE_AGENT_PRODUCT_KNOWLEDGE_HOME_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_6_DISPLAY_PRODUCT_KNOWLEDGE_HOME_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_AUTOMATED_OPEN_SPEC_REVIEW_WORKFLOW_SETUP_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0_OPENSPEC_LOCAL_BASELINE_AUDIT_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0B_OPENSPEC_1_11_DELTA_REAUDIT_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_1_FORK_AND_DESIGN_YUTA_SCHEMA_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_2_ISOLATED_OPENSPEC_SCHEMA_SMOKE_TEST_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3A_OPENSPEC_SCHEMA_HARDENING_ANALYSIS_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3B_MINIMAL_SCHEMA_HARDENING_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_4_OPENSPEC_ACTIVATION_POLICY_REVIEW_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_5_ACTIVATE_YUTA_SPEC_DRIVEN_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6A_OPENSPEC_NORMATIVITY_POLICY_REVIEW_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6B_ENABLE_NORMATIVE_SPECS_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md
[warn] docs/features/establishment/general-information/README.md
[warn] docs/features/establishment/README.md
[warn] docs/reviews/personnel-reconstructable-value-history/04-knowledge-consolidation-review.md
[warn] docs/reviews/restaurant-knowledge-communication-identity/04-knowledge-consolidation-review.md
[warn] docs/reviews/restaurant-knowledge-team-culture/04-knowledge-consolidation-review.md
[warn] docs/reviews/restaurant-knowledge-validated-knowledge/02-specs-review.md
[warn] docs/reviews/restaurant-knowledge-validated-knowledge/02b-design-review.md
[warn] docs/reviews/restaurant-knowledge-validated-knowledge/04-knowledge-consolidation-review.md
[warn] docs/tasks/INFORMATIONS_GENERALES_PAGE_PRODUCT_KNOWLEDGE.md
[warn] docs/tasks/YUTA_INFORMATIONS_GENERALES_PAGE_KNOWLEDGE_INTEGRATION_AUDIT_TASK.md
[warn] docs/tasks/YUTA_INFORMATIONS_GENERALES_PRODUCT_DECISION_INTEGRATION_TASK.md
[warn] docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_DESIGN_TASK.md
[warn] docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_PROPOSAL_ANALYSIS_TASK.md
[warn] docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_SPECS_TASK.md
[warn] docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_TASKS_TASK.md
[warn] docs/tasks/YUTA_STEP_6_1_DOCUMENTATION_CLEANUP_AUDIT_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2A_INDEX_TRUTHFULNESS_CLEANUP_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2B1_CURRENT_STATE_SLIM_PLAN_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2C_ARCHIVE_KNOWLEDGE_NORMALIZATION_HISTORY_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2D1_PUBLIC_BOOKING_PRODUCT_SPEC_REVIEW_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2D3_POS_PRODUCT_SPEC_REVIEW_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2E1_UI_PROMPT_TOPOLOGY_REVIEW_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2E2_IMPLEMENT_GENERATED_SNAPSHOT_TOPOLOGY_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2E3_MIGRATE_EXISTING_PROMPT_PROVENANCE_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2F_FINAL_DOCUMENTATION_CLEANUP_VALIDATION_TASK.md
[warn] openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public/analysis.md
[warn] openspec/schemas/yuta-spec-driven/templates/design.md
[warn] openspec/schemas/yuta-spec-driven/templates/proposal.md
[warn] openspec/schemas/yuta-spec-driven/templates/spec.md
[warn] openspec/specs/restaurant-knowledge/cuisine-know-how/spec.md
[warn] openspec/specs/restaurant-knowledge/validated-knowledge/spec.md
[warn] Code style issues found in 62 files. Run Prettier with --write to fix.
[ELIFECYCLE] Command failed with exit code 1.
```

## regression

Command: `pnpm --filter @yuta/backoffice test test/personnel-permissions.test.ts test/restaurant-knowledge-permissions.test.ts test/establishment-profile-permissions.test.ts test/access-audit-permissions.test.ts test/formalites-cdi-prototype.test.tsx test/formalites-cdi-connected-read.test.tsx "src/app/(authenticated)/equipe/formalites-personnel/_lib/formalites-read-prototype-runtime.test.ts" --reporter=verbose`

Exit code: 1

```text
/equipe/formalites-personnel/_lib/formalites-read-prototype-runtime.test.ts was unexpected at this time.

D:\working\yuta\yuta-resto>  "C:\Users\Tam\AppData\Local\pnpm\\node.exe"  "C:\Users\Tam\AppData\Local\pnpm\\.tools\pnpm\10.11.0\node_modules\.pnpm\pnpm@10.11.0\node_modules\pnpm\bin\pnpm.cjs" --filter @yuta/backoffice test test/personnel-permissions.test.ts test/restaurant-knowledge-permissions.test.ts test/establishment-profile-permissions.test.ts test/access-audit-permissions.test.ts test/formalites-cdi-prototype.test.tsx test/formalites-cdi-connected-read.test.tsx src/app/(authenticated)/equipe/formalites-personnel/_lib/formalites-read-prototype-runtime.test.ts --reporter=verbose
```

## regressionRetry

Command: `pnpm --filter @yuta/backoffice test test/personnel-permissions.test.ts test/restaurant-knowledge-permissions.test.ts test/establishment-profile-permissions.test.ts test/access-audit-permissions.test.ts test/formalites-cdi-prototype.test.tsx test/formalites-cdi-connected-read.test.tsx formalites-read-prototype-runtime.test.ts --reporter=verbose`

Exit code: 0

```text
$ vitest run "test/personnel-permissions.test.ts" "test/restaurant-knowledge-permissions.test.ts" "test/establishment-profile-permissions.test.ts" "test/access-audit-permissions.test.ts" "test/formalites-cdi-prototype.test.tsx" "test/formalites-cdi-connected-read.test.tsx" "formalites-read-prototype-runtime.test.ts" "--reporter=verbose"

 RUN  v4.1.9 D:/working/yuta/yuta-resto/apps/backoffice

 ✓ src/app/(authenticated)/equipe/formalites-personnel/_lib/formalites-read-prototype-runtime.test.ts > isFormalitesReadPrototypeEnabled > requires an explicit development-only opt-in 2ms
 ✓ test/access-audit-permissions.test.ts > access audit permissions > allows owners to read access history 2ms
 ✓ test/access-audit-permissions.test.ts > access audit permissions > denies MANAGER 0ms
 ✓ test/access-audit-permissions.test.ts > access audit permissions > denies STAFF 0ms
 ✓ test/personnel-permissions.test.ts > personnel permissions > allows only owners to read and manage employee dossiers 4ms
 ✓ test/personnel-permissions.test.ts > personnel permissions > denies public and service actors 1ms
 ✓ test/establishment-profile-permissions.test.ts > establishment profile permissions > allows OWNER to read the profile 3ms
 ✓ test/establishment-profile-permissions.test.ts > establishment profile permissions > allows MANAGER to read the profile 0ms
 ✓ test/establishment-profile-permissions.test.ts > establishment profile permissions > allows STAFF to read the profile 0ms
 ✓ test/establishment-profile-permissions.test.ts > establishment profile permissions > allows owners and managers to edit but denies staff 1ms
 ✓ test/establishment-profile-permissions.test.ts > establishment profile permissions > allows only owners and managers to manage the weekly schedule 0ms
 ✓ test/restaurant-knowledge-permissions.test.ts > restaurant knowledge permissions > grants READ and MANAGE independently to OWNER 4ms
 ✓ test/restaurant-knowledge-permissions.test.ts > restaurant knowledge permissions > grants READ and MANAGE independently to MANAGER 1ms
 ✓ test/restaurant-knowledge-permissions.test.ts > restaurant knowledge permissions > keeps READ and MANAGE as separate typed operations 1ms
 ✓ test/restaurant-knowledge-permissions.test.ts > restaurant knowledge permissions > denies STAFF for both operations without inheriting profile read access 1ms
 ✓ test/restaurant-knowledge-permissions.test.ts > restaurant knowledge permissions > denies the 'public' actor for both operations 1ms
 ✓ test/restaurant-knowledge-permissions.test.ts > restaurant knowledge permissions > denies the 'service' actor for both operations 0ms
 ✓ test/restaurant-knowledge-permissions.test.ts > restaurant knowledge permissions > does not let YUTA_ADMIN bypass the active membership role 0ms
 ✓ test/restaurant-knowledge-permissions.test.ts > restaurant knowledge permissions > does not let YUTA_SUPPORT bypass the active membership role 0ms
 ✓ test/formalites-cdi-prototype.test.tsx > CDI draft readiness prototype > uses only the bounded fictional fixture 2ms
 ✓ test/formalites-cdi-prototype.test.tsx > CDI draft readiness prototype > states the transient boundary and keeps generation disabled 18ms
 ✓ test/formalites-cdi-prototype.test.tsx > CDI draft readiness prototype > derives demo readiness without treating missing or undecided values as ready 0ms
 ✓ test/formalites-cdi-prototype.test.tsx > CDI draft readiness prototype > keeps checkpoints in reducer memory and resets to the fictional fixture 1ms
 ✓ test/formalites-cdi-prototype.test.tsx > CDI draft readiness prototype > blocks the review step until required demo inputs are populated 0ms
 ✓ test/formalites-cdi-connected-read.test.tsx > connected CDI draft local-interaction prototype > projects only the six approved employee facts 2ms
 ✓ test/formalites-cdi-connected-read.test.tsx > connected CDI draft local-interaction prototype > renders the trusted source before the local-only input step 22ms

 Test Files  7 passed (7)
      Tests  26 passed (26)
   Start at  23:04:30
   Duration  1.81s (transform 1.25s, setup 0ms, import 3.48s, tests 80ms, environment 1ms)
```
