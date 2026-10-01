# Apply evidence — Pointage manual-test environment

Change: `pointage-manual-test-environment`
Recorded: 2026-10-01, Europe/Paris
Schema: `yuta-spec-driven`
Authority: current user “Duyệt Tasks và cho phép Apply.”; approved Gate 1, Sensitive Design and Tasks packet.
Status: `APPLY IN PROGRESS — 13/14; task 3.5 awaits human operator feedback`.

This is implementation-completion evidence, not formal Technical Implementation Compliance, VERIFY, QA, Gate 3, deployment or readiness promotion.

## Approval and scope

Before implementation, the exact three Gate 1, five Design and seven Tasks packet path/hash entries matched. HEAD was `516e9605ca77e24c3adacf95aafb9501c3438c37`. The four existing implementation targets matched their recorded hashes; both new targets were absent. Initial dirty paths were only the Design approval packet, Tasks packet and Tasks artifact from the preceding planning work; these were preserved and separately attributed.

Approved Design remains `75e69ec26104b8ba7988e708e923738eda89d637d82775b2861b8a7d0fbd1e08`. Approved Tasks baseline remains `ce567c0ade4fd48ddae261667827de5e01cb03535f33e48b64a7c11ba97fbb4f`; subsequent Tasks changes record authorization, checkbox progress and development feedback, not revised contracts.

Current candidate: `manual-dev-20261001-01`.

| Implementation path                                              | Current raw-byte SHA-256                                           |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/backoffice/package.json`                                   | `3c6210bac030d633cc103dda98e17f580acc79bf794baf2a0d8c59f5b6a09a19` |
| `apps/backoffice/scripts/pointage-manual-test.ts`                | `09c2d7ff6ff494b8aa515ddf6bc9908ad70e2dfb3c3f329b968b8f3c2d962f3c` |
| `apps/backoffice/test/helpers/pointage-raw-clocking-launcher.ts` | `7a073f47371f8a200d4e34363f7bbabc1c195386c0eae3d938b4d3ec9f947707` |
| `apps/backoffice/test/pointage-manual-test.test.ts`              | `c28b747d33824f2a6680fdeadea6f6a67cd541d3a4d18fde2200d4fd14158923` |
| `docs/operations/LOCAL_DEVELOPMENT.md`                           | `94bde5e68165921e95148ee659e08e89bbf02cd987e2705f29bf5399ab3b52d1` |
| `pnpm-lock.yaml`                                                 | `c007d66fc5e2a28997fbef166a63f203c576cca02a342f82866dd7ec56745835` |

Hash method: `Get-FileHash -LiteralPath <path> -Algorithm SHA256`, lowercase hex. The exact six-file diff is 91,065 bytes, SHA-256 `5423814f0e48c3df6e2f4ce70d083ccb50afeeff3468f97bb13c77885973a395`. Reproduce by sorting the six paths, concatenating the raw stdout bytes of `git diff --no-ext-diff --no-color --binary HEAD -- <tracked path>` and `git diff --no-index --no-ext-diff --no-color --binary -- /dev/null <new path>` for each path, then SHA-256. Accept exit 1 only for the two no-index diffs. Untracked implementation is included; review/Tasks evidence is excluded from this implementation diff.

No additional implementation path was introduced. No Product route, UI, auth/tenancy contract, db-cloud source/helper, canonical migration, env file, normative Spec or archived change was edited. `git diff --exit-code` for the protected source/Spec/archive areas passed. A sorted `path + NUL + raw SHA-256 + LF` manifest over 674 tracked protected files was identical before and after runtime exercises: `fc2f472fc36df8487542690934ea862f03e1c13b6054543737d53231d4e00d5b`. Its selection covers main Specs, all archived changes, Backoffice source, package source, db-cloud migrations, existing Next child and db-cloud Pointage test helper. This is a runtime pre/post comparison, not a claim to have hashed ignored environment-file contents.

## Implemented outcomes

- F1–F5: existing guarded disposable provisioning, canonical migration sequence plus existing test-only extension, two scoped synthetic dossiers with independent CSPRNG-issued credentials, initial empty raw chains, and ownership registered before resource creation/fixture return. Existing fixture defaults remain single-person. Mocked creation/port failures prove exact-name fallback or recorded-ID cleanup without any database connection.
- S1–S4: app-owned command and direct `tsx` development dependency; strict TTY/local/CI/port/Docker guards; four-file key-name inventory; frozen 13-key denial profile; parent environment sealing before reused synchronous Docker inspections; parent-only Windows `USERPROFILE` for the already-selected local context; Next still excludes that OS directory. Unknown keys and profile/file drift refuse operation. No broad environment inheritance or profile serialization.
- S5–S7: existing generation/PID-bound IPC, source watcher, admission trace and reconsumer proof plus HTTP context 200; identify/end probes through normal employee authorization; one-time two-person terminal handoff only after readiness; exact-ID/name/label cleanup and verified port release; persistent signal handlers and direct Node loader retain cleanup ownership.
- R1–R4: focused and broader regression, real disposable startup/stop proof, updated existing development guide, six-file attribution and protected-source checks. Human operator judgement remains pending; no completed formal matrix is claimed.

PINs were redacted before emitting automation evidence. No PIN, continuation, auth key or functional database credential is recorded here. The operator session displays its PINs only in the visible interactive terminal.

## Commands and results

| Command / check                                                                                                                                                                                          | Result and scope                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install --offline --frozen-lockfile --ignore-scripts --filter @yuta/backoffice...`                                                                                                                 | Exit 0; existing resolution linked, no lifecycle scripts; direct `tsx` resolves 4.22.4.                                                                                                                                                                               |
| `pnpm --filter @yuta/backoffice exec vitest run test/pointage-manual-test.test.ts`                                                                                                                       | Final 116/116 PASS; process/socket/DB seams mocked, no live effects.                                                                                                                                                                                                  |
| `pnpm --filter @yuta/backoffice exec vitest run test/pointage-raw-clocking-bootstrap.test.ts -t 'ADMISSION_TRACE_V1 pure\|D1b independent re-consumer detectors\|D1b strict private bootstrap contract'` | 71 PASS, 26 skipped. The actual shell argument contains literal pipes, without Markdown escaping.                                                                                                                                                                     |
| `pnpm --filter @yuta/backoffice test`                                                                                                                                                                    | Final exit 0; 109 files passed, 1 skipped; 1,104 tests passed, 54 skipped. Includes existing no-DB actual-child negative admission and temporary socket tests while port 3001 was free. Live Next/DB/source-drift and OpenAI flags remained absent.                   |
| `pnpm --filter @yuta/auth test`                                                                                                                                                                          | Exit 0; 64 tests passed, 6 files.                                                                                                                                                                                                                                     |
| `pnpm --filter @yuta/db-cloud test`                                                                                                                                                                      | Exit 0; 148 tests passed, 224 skipped; 14 files passed, 23 skipped. Integration flags absent; no live DB tests. Collection loads package env files, whose inventoried key names did not include enable flags; lazy clients in skipped suites did not execute queries. |
| `pnpm --filter @yuta/backoffice typecheck`                                                                                                                                                               | Final exit 0 after correcting the fake watcher interface. Earlier test-only TS2352 failure is resolved, not erased.                                                                                                                                                   |
| `pnpm -r --if-present typecheck`                                                                                                                                                                         | Exit 0 across applicable workspace packages after runtime-source fixes; final additional test cases also passed the package typecheck.                                                                                                                                |
| `pnpm docs:check`                                                                                                                                                                                        | Exit 0, 36 current documents; rerun after guide updates.                                                                                                                                                                                                              |
| `pnpm architecture:check`                                                                                                                                                                                | Exit 0; runtime imports, URLs, client boundaries and migration baselines.                                                                                                                                                                                             |
| `pnpm exec openspec validate pointage-manual-test-environment --strict`                                                                                                                                  | Exit 0; no-spec branch remains valid.                                                                                                                                                                                                                                 |
| `pnpm exec prettier --check <the six implementation paths above>`                                                                                                                                        | Exit 0, final candidate.                                                                                                                                                                                                                                              |
| `pnpm format:check`                                                                                                                                                                                      | Exit 1, 92 pre-existing unrelated warnings retained. Earlier in-progress run had 93, including the then-unformatted new CLI; that scoped issue was fixed and the diagnostic rerun returned the existing 92. No unrelated formatter write.                             |
| `git diff --check -- <tracked implementation paths>`                                                                                                                                                     | Exit 0; untracked paths separately covered by scoped formatting and explicit no-index diff.                                                                                                                                                                           |
| Noninteractive `pnpm --filter @yuta/backoffice pointage:manual:test`                                                                                                                                     | Expected exit 1, `INTERACTIVE_TERMINAL_REQUIRED`, before Docker/fixture. Checked both initial and direct-Node entrypoints.                                                                                                                                            |

Regression environments used explicit OS allowlists and `NODE_ENV=test`, without inherited integration/provider enable flags. The auth/cloud agent used the installed pnpm 10.11.0 entrypoint; the repository command wrapper selected pnpm 11.8.0. Runtime versions observed: Node 24.17.0, Next 16.2.9, tsx 4.22.4. Builds/cloud/local suites and Browser QA were not run: no production bundle or local-product target changed; this command uses the existing Next development child. Formal VERIFY will re-evaluate applicability and evidence only after human feedback.

## Disposable execution and recovery history

### Preflight: Windows Docker context

One initial automation result was not retained because the orchestration wrapper attempted to store an absent session ID; it is not credited as successful evidence. The captured preflight run `3178ae32-adbd-4142-acf4-10ca26570888` exited 1 with `LOCAL_DOCKER_REQUIRED`, before fixture creation. Read-only comparison showed the original local context was `desktop-linux` / `npipe:////./pipe/dockerDesktopLinuxEngine`, but stripping `USERPROFILE` selected `default` / `npipe:////./pipe/docker_engine`.

Local correction: retain the Windows OS directory only in the sealed manual parent and manual fixture Docker calls. Do not change Docker configuration, allow a remote context, relax endpoint checks or inherit original application values. Next's existing allowlist still strips it. Focused tests cover uppercase/lowercase original spelling and exclusion from both Next paths. The subsequent disposable launch passed this preflight. Rejected preflight is not an actual disposable execution generation.

### Generation 1: READY, then failed handled cleanup

Generation: `74fb9233-4450-43f0-b004-89a9fdc9ecd6`.
Owned container: `035f8c307b3558aad080958ffed0be6e3301a68bb974d1c94a0804a63574c3ad`.
Database: `yuta_pointage_raw_clocking_test_74fb9233445043f0b00489a9`.

The initial `tsx scripts/pointage-manual-test.ts` command reached the full READY handoff. Context was 200 with `{"available":true}`, `no-store, max-age=0, private`, and no Set-Cookie; page HTML was 200 with the credential input. Both employee probes passed and printed initial `NOT_CLOCKED_IN` states. Container inspection proved loopback-only port 54154 and tmpfs `/var/lib/postgresql/data` with `rw,size=512m`.

A read-only count query initially used an incorrect table name and failed; the corrected query observed the exact database name, 22 migration journal rows (existing 21 canonical entries plus the test extension), two dossiers, two credential-version rows and zero raw events. No credentials or dossier contents were selected.

Ctrl+C terminated the CLI before cleanup, leaving its container. Read-only local source inspection found tsx's spawned-child signal relay and fast escalation, together with one-shot CLI signal listeners. Local correction: direct `node --import tsx scripts/pointage-manual-test.ts`, persistent `process.on` handlers until cleanup finishes. No Product or Design revision was needed.

Before recovery, exact ID/name/generation-label equality was required. Only the above owned ID was removed; exact-ID absence was checked. Its disposable synthetic data was deleted and cannot be recovered. Unrelated historical containers were not removed. This generation's cleanup remains **FAIL**.

### Generation 2: READY and owned cleanup pass

Generation: `93735f3b-9d09-4c40-8881-55cc838996b4`.
Owned container: `b36e85254919b44e858b91ad4a76d317dff15b3ca962a4142c1a74c89730a4ae`.
Command: `pnpm --filter @yuta/backoffice pointage:manual:test`, now the direct Node loader.

This fresh fixture reached full READY and the two independent `NOT_CLOCKED_IN` handoffs through the same guarded migration/admission path. Ctrl+C produced `Pointage arrêté ; ressources temporaires supprimées, port 3001 libéré.`. Independent checks found no exact owned container, no port-3001 listener, no remaining manual/Next child, and the old context URL no longer serving.

The Windows pnpm/cmd wrappers still displayed `Terminate batch job (Y/N)?`; answering their prompts ended the outer tool with exit 1. That wrapper interruption is recorded separately from the observed successful CLI/resource cleanup, not falsely reported as process exit 0. The existing guide now explains waiting for the cleanup confirmation and answering residual prompts.

The cleanup lineage used two actual disposable execution generations out of three. The corrective run resolved the blocker, so failed recovery attempts are 0/2. No additional equivalent recovery was run. Pure type/format corrections and preflight diagnostics did not consume disposable-generation counts. Existing synchronous db-cloud Docker inspections can delay signal handling while blocked; no guarantee is made for hung OS/engine calls or uncatchable termination.

## Current human handoff

A separate interactive operator window was opened after regression, titled `YUTA Pointage - Synthetic manual test`, PowerShell PID 25024. Current generation suffix: `04736c859dbe4dc3a042fd04`; full generation UUID and both synthetic PINs are displayed only in that terminal, not copied to evidence.

Owned container: `dd824550cd9cac96ccfca0730bd23cf65c18fafcf7b966b465dd968ab40a1a2e`.
Entry: `http://127.0.0.1:3001/pointage/synthetic-next-04736c859dbe4dc3a042fd04`.
Observed context: HTTP 200, `{"available":true}`, private/no-store, no Set-Cookie.

This generation is intentionally left serving for the requested human manual test. It is not another failed-cleanup retry. Use only `Synthetic Next` and `Synthetic Deux`; follow the existing Local Development Edge checklist for identification, in/out, separate state, Terminer, conflict/retry and stop. Ctrl+C in that owning terminal resets the disposable data; rerun the command for fresh identities/PINs. No real employee attendance is authorized.

`DEV_USABLE: YES` — actual guarded route/identity use and handled stop observed.
`MANUAL_TEST_READY: YES` — live operator window, exact route, safe identities/PIN reference, guide and reset/recovery instructions available.
`HUMAN_PRODUCT_VALIDATION: AWAITING_RESPONSE` — operator usability/flow acceptance has not been received. A conversational acknowledgement is not claimed as a completed manual-test verdict.

## Workflow stop

APPLY: IN_PROGRESS — task 3.5 awaiting human feedback
Tasks: 13/14
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Browser QA: NOT_RUN
Gate 3: NOT_CREATED
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED

All seven blockers remain: retention duration, deletion/anonymization, legal hold, backup-retention interaction, employee notice, detailed audit visibility and trusted production client-address provenance. No sync, archive, deployment, production provider or lifecycle promotion occurred.
