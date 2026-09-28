Change: pointage-manual-test-environment
Gate: 2b — SENSITIVE DESIGN REVIEW
Review status: AWAITING_HUMAN_REVIEW
Created: 2026-09-27T15:12:20Z
Schema: yuta-spec-driven
Analysis conclusion: NO_SPEC_BEHAVIOR_CHANGE
Sensitive change: YES — synthetic credential, disposable database, environment isolation, trusted-address test provider, runtime admission, and cleanup

# Review decision requested

Approve the exact Design below for Tasks/Implementation Planning only, request bounded Design changes, or reject. This packet is not Apply authority. No Specs are created because `skip_specs: true` and no Product behavior changes.

## Exact artifact set and SHA-256

| Artifact                                                                                | SHA-256                                                            |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/pointage-manual-test-environment/.openspec.yaml`                      | `ad5d1392b83e1fb364af846ecfc007e0da466a5405703f35acbeaac52dbc3eed` |
| `openspec/changes/pointage-manual-test-environment/proposal.md`                         | `bfb4624f359a666bba24d06388072344e0a3e20cb6eb09ff1b8c7a8b8beaab3e` |
| `openspec/changes/pointage-manual-test-environment/analysis.md`                         | `82d409d08297a1679c1f6de263b28f46e73cac831905801d9ab46ab9ef748560` |
| `openspec/changes/pointage-manual-test-environment/design.md`                           | `75e69ec26104b8ba7988e708e923738eda89d637d82775b2861b8a7d0fbd1e08` |
| `docs/reviews/pointage-manual-test-environment/01-analysis-review.md` (Gate 1 APPROVED) | `f41921c8db4420d266eedb8f0ed45352cc35b73cb3e8e50e7971e443fbfd4a34` |

## Exact Design content

```text
## Context

Pointage employee route already exists in Backoffice, but the existing synthetic Browser QA harness is not an operator-facing manual-test command. Its disposable fixture provisions one employee; QA adds another in its own script. The existing `--serve` path does not provide a two-person handoff or complete container cleanup. Ordinary `dev:backoffice` does not establish synthetic Pointage admission. This change is tooling-only, `NO_SPEC_BEHAVIOR_CHANGE`, and must not modify the archived raw-clocking implementation authority.

The sensitive boundary includes disposable PostgreSQL, synthetic Personnel dossiers and credentials, Next dev environment-file loading, injected trusted-client-address test provider, exact runtime admission, and resource ownership. The command must work only on a local developer machine with synthetic/disposable data. Real employee attendance remains unauthorized in development, staging, and production.

## Goals / Non-Goals

### Goals

- Provide one repository-supported command that starts a disposable two-employee Pointage environment, proves the existing route is READY, then prints a minimal manual handoff for Microsoft Edge.
- Reuse the current cloud migrations, Pointage test-only extension, admission protocol, credential primitives, repositories, and Backoffice route without introducing a competing implementation.
- Keep real environment credentials and shared dev databases out of the child runtime; clean only resources owned by this invocation on normal stop and handled failure.
- Make guard, readiness, secret-output, and cleanup behavior testable before any human manual test.

### Non-Goals

- No Product, Spec, transport, permission, UI, canonical schema/migration, production provider, deployment, or lifecycle change.
- No automatic Edge/Playwright control in the operator command; no use of an existing employee or shared development database.
- No guarantee of synchronous cleanup after power loss, OS crash, or uncatchable force-kill; these are explicitly reported recovery cases.
- No release or production-readiness evidence from a successful local synthetic session.

## Decisions

### D1 — Entrypoint, ownership, and fixed topology

Add an app-owned TypeScript CLI under `apps/backoffice/scripts/` and an explicit Backoffice package script, invoked as `pnpm --filter @yuta/backoffice pointage:manual:test`. A direct `tsx` development dependency may be added to that package and reflected in the lockfile; the executable is not a production route or package export. The only runtime is the existing Backoffice Next dev child on `127.0.0.1:3001`, controlled by the existing Pointage test IPC protocol. No new app, service, browser transport, trusted production address provider, or public interface is created.

Preflight rejects an explicitly non-development/test `NODE_ENV`, any present `VERCEL` or CI indicator, remote Docker context/host override, an unavailable local Docker Desktop Linux engine, a serving port 3001, or a serving deny-sink port 65431. An absent `NODE_ENV` is admitted only in this explicitly invoked local command and set to `development` for its sanitized children; it is never used to override an explicit production value. Existing database guards remain authoritative: exact `^yuta_pointage_raw_clocking_test(?:_[a-z0-9]+)?$` whole-string name, loopback host, parsed name exactly equal to `SELECT current_database()`, and independent current-database name validation. No provider, fixture, migration, or attendance write occurs before all relevant guards pass. Browser QA cannot bypass them.

### D2 — Frozen, safe Next environment shadow profile

Before provisioning, inventory **key names only** from every Backoffice production-loadable env file for development (`.env.development.local`, `.env.local`, `.env.development`, `.env`), plus the relevant original process environment. Never read a secret value into evidence or print it. Build one immutable in-memory profile from a narrow OS subprocess allowlist, the required Pointage synthetic settings, and deliberate nonempty shadows for every inventoried application key. Reject an unknown or newly added env-file key until its deny value is reviewed. Revalidate inventory and profile identity before child start; detect relevant env-file changes during the session and shut down rather than continuing with a changed authority surface.

The currently inventoried shadow keys are `AUTH_SECRET`, `CLOUD_DATABASE_SSL`, `CLOUD_DATABASE_URL`, `GOOGLE_BUSINESS_PROFILE_CLIENT_ID`, `GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET`, `GOOGLE_BUSINESS_PROFILE_REDIRECT_URI`, `NEXT_PUBLIC_APP_URL`, `REPUTATION_CREDENTIAL_ENCRYPTION_KEY`, `YUTA_OPENAI_EVALUATION_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_TOKEN_ENCRYPTION_KEY`, and `YUTA_PERSONNEL_CONTRACT_EXTRACTION_MODE`. `CLOUD_DATABASE_URL` is a syntactically valid loopback deny sink at `127.0.0.1:65431`, never the disposable Pointage URL or a real target; `CLOUD_DATABASE_SSL=false`; `NEXT_PUBLIC_APP_URL=http://127.0.0.1:3001`; provider/API/secrets are deliberately invalid nonempty poison values; contract extraction is `deterministic-synthetic`. The Pointage disposable URLs and random secret continue only through the existing validated parent-to-child IPC initialization, not general env or command-line arguments. No functional auth secret or provider credential is supplied. Never inherit broad `process.env`, use private Next flags, or write this profile to disk.

Framework fact for the installed Next/@next-env 16.2.9 behavior: original environment **key presence**, including an empty original value, controls whether a matching env-file key is selected into the parsed environment. Separate YUTA policy: every shadow in this command must nevertheless be deliberately **nonempty**; an empty shadow is rejected because it is ambiguous to downstream consumers and weak evidence of intentional denial. The guarantee is about effective application values, not a claim that Next never opens or parses env-file bytes. If a real target, functional production credential, or unsafe effective value becomes necessary, stop for human review.

The existing `pointageChildEnvironment` strips arbitrary entries. Introduce only a narrowly validated manual shadow-profile input/composition path to the shared launcher, keeping existing QA callers and their defaults unchanged. The parent’s Docker commands also receive only safe env plus their ephemeral Postgres bootstrap variables, never copied real env values.

### D3 — Disposable two-person fixture and resource identity

Reuse `provisionPointageNextFixture` and its canonical migrations followed by test-only extension `0021`, role admission, and repository credential issuance. The manual entrypoint supplies or receives one random generation/run ID before any resource creation; derive the exact database name and Docker container name/label from it. Register the exact container ID immediately after creation, including failure paths between `docker run` and fixture return. Scope cleanup to that recorded ID or a verified exact name **and matching generation label**; never enumerate-and-remove by broad label, remove an unrelated container, or kill an unrelated process. Existing Browser QA default behavior must remain unchanged.

Create a second synthetic Personnel dossier in the same new synthetic organization and establishment with a distinct dossier ID, display name, and freshly issued eight-digit CSPRNG credential through the existing Pointage primitives/repository. Both employees must be currently eligible according to existing Personnel checks. No synthetic marker field, altered authorization, or real dossier lookup is introduced. Assert both credentials differ; if collision occurs, regenerate through approved issue mechanics before handoff. Assert neither has raw events and both derive `NOT_CLOCKED_IN` before announcing READY. The disposable Postgres data remains in tmpfs and is removed with the owned container.

### D4 — Admission and context-driven READY

Launch only the current Next child through the existing IPC `POINTAGE_TEST_INIT` protocol with generation-bound parent/child PIDs, loopback origin, validated foundation/raw disposable URLs, and injected synthetic `SERVER_VERIFIED` client address. Retain its role checks, source-integrity watcher, trace collector, and reconsumer proof. A TCP listener or child IPC `READY` alone is insufficient. The parent waits with a bounded timeout for the existing `/api/pointage/<slug>/context` to return HTTP 200 with the expected validated neutral contract **and** matching generation/admission proof. Reject a stale process, wrong slug/scope/generation, provider failure, 503, child exit, source/env drift, or timeout. Do not claim READY or print credentials on any such path.

The operator opens the existing employee route in Edge. This CLI does not automate, alter, or bypass Pointage’s normal identify/state-read/mutation authorization, continuation handling, lifecycle guards, rate limiting, or trusted-address gate. It is only a synthetic test-provider composition in the approved disposable context.

### D5 — One-time handoff and manual interaction

Require an interactive terminal for credential display. After all D4 checks, print only: local URL, generation ID, two synthetic display names, their eight-digit PINs, each `NOT_CLOCKED_IN` initial state, and stop instruction. Print PINs once, without JSON evidence, logs, files, browser storage, command arguments, child stdout/stderr, or telemetry. Suppress raw child output; surface sanitized stage/error codes. Terminal scrollback and screenshots are outside the CLI’s ability to erase; instruct the operator to treat the display as ephemeral synthetic data. Do not promise a retained PIN can be recovered after restart.

The development guide gives a short Edge checklist for two separate employees, valid in/out, conflict and retry, Terminer/shared-device clearing, and expected no-owner failure after stop. It does not claim that a human’s manual observation substitutes for formal VERIFY or Browser QA of any future UI change.

### D6 — Deterministic owned-resource cleanup

Maintain a parent-owned, idempotent cleanup state machine from preflight through provision, child start, READY, and interactive serving. On normal Ctrl+C/SIGTERM or a handled error, stop the exact generation-bound child via existing IPC and bounded PID fallback, close only owned database clients, remove only the verified owned container, then verify its absence and that port 3001 is released. Preserve the original failure and report any cleanup failure separately with the exact sanitized generation/container identity and manual recovery instruction. Never suppress a failed cleanup as success, reuse a leftover fixture, or remove an unverified resource. A pre-existing occupant of 3001 is an immediate refusal, never a process to stop.

The script must exit nonzero if startup, admission, readiness, or cleanup fails. Hard kill/power loss may leave a container; local recovery must inspect exact generation/name/label before an operator removes it. This is a limitation, not an automated broad cleanup exception.

### D7 — Verification and change boundary

Use test-only unit/process tests for env inventory/profile rejection, preflight, two-person isolation, one-time output, readiness ordering, failed admission, and every owned-resource cleanup transition. A disposable-DB integration run may prove canonical + extension migrations, exact database guard, two eligible dossiers, and independent credentials, but only after the next approved Apply gate. Tests must use synthetic data and must not make a real employee attendance claim. Check package typecheck, relevant tests, docs and architecture checks, and scoped formatting. `UI_AFFECTING: NO`, so no UI pack or mandatory Browser QA is introduced by this tooling change; the user’s later manual Edge observation is an operational acceptance step, not authorization to run it during Design.

The Apply allowlist is expected to remain limited to the new CLI/test, narrow existing launcher helper changes, Backoffice package manifest/lockfile, and existing local-development guide. Any need to edit Product runtime, route, page, auth/tenancy contracts, canonical migration, Specs, or archived raw-clocking artifacts stops this change for review.

## Risks / Trade-offs

- Next can still read env-file bytes even when safe original-env shadows control effective values. We explicitly assert the effective-value boundary and stop on unknown keys; we do not claim file-read prevention.
- A fixed local port makes the handoff simple but can be occupied. Fail closed rather than stop/rebind another process.
- One-time terminal PIN display is necessary for manual testing and may remain in scrollback. Only synthetic, disposable PINs are allowed.
- Retrofitting precise container ownership into the fixture helper requires a narrow test-helper change. Existing Browser QA callers must be regression-tested rather than copied into a second provisioning implementation.
- Uncatchable host termination cannot guarantee cleanup. Exact resource identification and recovery guidance limit this residual risk.

## Migration Plan

There is no durable schema migration or deployment. The command creates a new uniquely named, loopback-only tmpfs PostgreSQL container, applies existing canonical migrations and existing test-only `0021` only there, then removes the container on handled stop. Rollback is removing the new CLI/script and narrow helper/test/docs changes; no production data conversion, sync, or feature flag exists. A successful local run does not authorize production enablement, real attendance, or closure of retention, deletion/anonymization, legal hold, backup-retention, employee notice, detailed audit visibility, or trusted production client-address provenance blockers.

## Open Questions

None requiring a Product or authority decision for this bounded Design. If exact implementation reveals a required new runtime, production credential/provider, broader file path, or weaker cleanup/environment guarantee, stop before Tasks/Apply and return for review.
```

## Sensitive implications and resolution

- Security/data: only synthetic dossiers and disposable loopback PostgreSQL; nonempty in-memory env shadows deny effective real credentials; PINs only once on an interactive terminal after READY. No real employee attendance in any environment.
- Runtime: one existing Backoffice Next child, fixed loopback port 3001, existing injected synthetic trusted-address provider and admission protocol. Context HTTP 200 plus generation-bound proof is required; listener-only evidence is insufficient.
- Cleanup: exact generation/container/PID ownership, idempotent handled-stop cleanup and verified port/container release. Uncatchable host termination has an explicit scoped recovery limitation.
- Migration/rollback: no canonical migration or durable data conversion; existing test-only 0021 runs only in the new disposable DB. Rollback removes tooling changes and any verified owned fixture.
- Deferred choices: none required for this bounded design. A need for new Product/Spec authority, real target/credential, production provider, broader runtime topology, or weaker safety boundary stops the change before Tasks/Apply.

## Preserved boundaries

`UI_AFFECTING: NO`; `UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE`. No Pointage page/UI or Browser QA execution in this gate. No Product, Spec, schema, canonical migration, authorization, tenancy, public route, POS/Site Agent/offline/sync, or production-readiness changes. The seven unresolved blockers remain retention duration, deletion/anonymization, legal hold, backup-retention interaction, employee notice, detailed audit visibility, and trusted production client-address provenance.

## Validation and recommendation

Strict OpenSpec validation: PASS for this exact Design before packet generation. Repository docs/architecture/typecheck/format results are recorded separately after packet creation; none is authority to advance a human gate.

Recommendation: APPROVE_FOR_TASKS_AND_IMPLEMENTATION_PLANNING only if this exact Design and its bounded risks are accepted. Otherwise request precise changes. Do not Apply, start a database/container, open Browser QA, or enable Pointage.

SENSITIVE DESIGN GATE
Review status: AWAITING_HUMAN_REVIEW
