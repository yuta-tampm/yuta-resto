# Phase 3C Public Rendering Review — Reputation Review Social Links Configuration

Review status: `APPROVED`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-06T14:26:40+02:00`

Change: `reputation-review-social-links-configuration`

Phase: `3C — feedback-web minimal safe rendering`

Recorded at: `2026-09-06T14:04:23+02:00`

## Outcome

| Item                                         | Result           |
| -------------------------------------------- | ---------------- |
| Phase 3C                                     | `APPROVED`       |
| Technical Implementation Contract — Phase 3C | `PASS`           |
| Tasks 3.9–3.10                               | `COMPLETE`       |
| Phase 4                                      | `NOT_AUTHORIZED` |
| Browser QA                                   | `NOT_STARTED`    |
| Production                                   | `NOT_AUTHORIZED` |

## Implemented behavior

- The existing public feedback success screen still receives the already-safe
  Phase 2 projection from the trusted server-rendered page. No raw persisted
  fallback is read or rendered by the component.
- Google, Facebook and Instagram CTAs retain the approved French labels and
  appear only when their corresponding safe projected value is non-null.
- Every rendered provider CTA opens in a new tab and now carries exactly
  `rel="noopener noreferrer"`.
- The current completion message, reset action, layout and styling remain
  unchanged. No provider cards, registry, network call, redirect following,
  URL rewriting, analytics or provider verification was introduced.
- The existing fail-closed `notFound` behavior for missing public
  configuration remains unchanged.

## Attributed implementation inventory

| Path                                                                                                | Pre-Phase-3C SHA-256                                               | Post-Phase-3C SHA-256                                              |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `apps/feedback-web/src/app/[tenantSlug]/_components/feedback-form.tsx`                              | `3606820c8fca288e021d59dbc123719a1fe4f2edf82be607802d331a42e81fd4` | `4a017f3b31a7a86f47813cedbc24423c4a5b79bca7f00bf732d4df5b007ad32a` |
| `docs/reviews/reputation-review-social-links-configuration/evidence/phase-3c-feedback-cta.test.tsx` | `ABSENT`                                                           | `8b934ad74f267ceeb3d88d2cb3531b326d306c87852fc1c8da2a6d6a0634bdd1` |

Progress metadata:

| Path                                                                     | Pre-Phase-3C SHA-256                                               | Post-Phase-3C SHA-256                                              |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `openspec/changes/reputation-review-social-links-configuration/tasks.md` | `3bb53f11979ce87f671f1648090c4397eac4ace6df7ed321a5f9e34f27c1a01e` | `f8e3d52f3a41d21080e3a2ac2f9ce50f261da955d3a58b3af3df7221fcf72842` |

The feedback component was clean and byte-identical to `HEAD` before Phase 3C.
Therefore its ordinary scoped Git diff is the exact attributable source diff;
no shared dirty-file reconstruction was required. The server page remained
byte-identical and was not modified.

## Focused public CTA evidence

The focused render suite uses the repository's existing Backoffice Vitest
runtime without adding a Feedback Web package script or dependency.

| Covered behavior                                      | Result |
| ----------------------------------------------------- | ------ |
| Valid Google CTA and exact label                      | `PASS` |
| Valid Facebook CTA and exact label                    | `PASS` |
| Valid Instagram CTA and exact label                   | `PASS` |
| Null Google/Facebook/Instagram independently hidden   | `PASS` |
| Mixed configured/null state                           | `PASS` |
| Unsafe legacy value projected to null is not rendered | `PASS` |
| Exact `target` and `rel` external-link attributes     | `PASS` |
| No raw unsafe fallback                                | `PASS` |
| Existing completion/reset behavior                    | `PASS` |

Final accepted command:

`pnpm --filter @yuta/backoffice exec vitest --root ../.. run docs/reviews/reputation-review-social-links-configuration/evidence/phase-3c-feedback-cta.test.tsx`

Result: `PASS` — 1 file, 7 tests.

Two initial discovery invocations were not accepted as evidence: root Vitest
was unavailable, then the Backoffice Vitest root could not resolve React from
the review directory. The final test resolves React and React DOM from the
existing Feedback Web package boundary and passes without a manifest change.

## Regression and validation evidence

| Command                                                                                                                                                      | Exact result                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `pnpm --filter @yuta/contracts test`                                                                                                                         | `PASS` — 4 files, 98 tests                                                       |
| `pnpm --filter @yuta/db-cloud exec vitest run test/reputation-review-social-links.integration.test.ts test/reputation-review-social-links-inventory.test.ts` | `PASS` — inventory file and 5 tests passed; PostgreSQL file and 10 tests skipped |
| `pnpm --filter @yuta/feedback-web typecheck`                                                                                                                 | `PASS` — `tsc --noEmit`, exit 0                                                  |
| `pnpm --filter @yuta/backoffice test`                                                                                                                        | `PASS` — 92 files passed, 1 skipped; 511 tests passed                            |
| `pnpm --filter @yuta/backoffice typecheck`                                                                                                                   | `PASS` — `tsc --noEmit`, exit 0                                                  |
| `pnpm -r --if-present typecheck`                                                                                                                             | `PASS` — 15 of 16 workspace projects                                             |
| `pnpm ui:pack:check backoffice-visibilite-reputation-satisfaction`                                                                                           | `PASS` — 1 package, 0 warnings                                                   |
| `pnpm docs:check`                                                                                                                                            | `PASS` — 36 current documents                                                    |
| `pnpm architecture:check`                                                                                                                                    | `PASS`                                                                           |
| `pnpm exec openspec validate reputation-review-social-links-configuration --strict`                                                                          | `PASS`                                                                           |
| Scoped Prettier check for the Phase 3C source and evidence test                                                                                              | `PASS`                                                                           |
| Scoped `git diff --check` for the Phase 3C source                                                                                                            | `PASS`; only the repository line-ending advisory was emitted                     |

The PostgreSQL integration tests remain environment-gated in this command. No
Phase 2 database behavior changed in Phase 3C; the already-approved Phase 2
real-database evidence remains the authority for persistence, concurrency and
audit behavior. The passing inventory regression covers the public projection
and prohibited-writer/provider/schema guards applicable to this rendering-only
phase.

Feedback Web build and Browser QA were not run: neither is authorized or
required by the approved Phase 3C contract. No running application was stopped.

## Concurrent public-boundary reconciliation

`feedback-public-trusted-boundary-hardening` remains planning-only. Its current
artifacts were inspected before the Phase 3C edit:

| Artifact | SHA-256                                                            |
| -------- | ------------------------------------------------------------------ |
| Proposal | `89d08d9ddf5ea11af8c7eb5b6530c27e4b359167150bc45641d5750d8c42b9c1` |
| Analysis | `3d41d7ad9664a3468d6956fccec4a486a779e87b7debad2d63776d2a2573c2ba` |
| Spec     | `f42e82be1b20031f7d48b5b48a59137f3d33e0b56bd3b5fb03a22c102c6c631c` |
| Design   | `6a7eb14a75f96585451bbf45f7d9da9e46f1992728c8606c6cccdb6d0ec3968b` |

The concurrent design owns verified hostname, tenant resolution, trusted
client identity and forwarding-header authority. Phase 3C changed none of those
areas. It did not modify the server page, resolver, submission route, tenant or
database adapters.

Protected public source:

| Path                                              | SHA-256                                                            | Result  |
| ------------------------------------------------- | ------------------------------------------------------------------ | ------- |
| `apps/feedback-web/src/app/[tenantSlug]/page.tsx` | `4516929921806a2196510aba69ca088e2967dc06104c0515a5d2bd9c0669af4c` | `MATCH` |

## Protected authority and scope

Approved planning bytes remain unchanged:

| Artifact | SHA-256                                                            | Result  |
| -------- | ------------------------------------------------------------------ | ------- |
| Proposal | `12f138ad7de17186a313e14a08cb26f4f06333be2a03f8fc2445a63f8338ad61` | `MATCH` |
| Analysis | `02c0213d17c754b3617738da4c4ef04aca4566e3ec42d669192cbe086b2a1f4d` | `MATCH` |
| Spec     | `ba36028f4d8461ca8f8742eff00d81ad14e45ee14ffbabc0b4787749679dad07` | `MATCH` |
| Design   | `3ab0ee2c9c84df1ef58157b3e026fab551cc973d88dd77448c0caa2a774f8582` | `MATCH` |

Phase 1/2 authority remains unchanged:

| Artifact                            | SHA-256                                                            | Result  |
| ----------------------------------- | ------------------------------------------------------------------ | ------- |
| Contracts Reputation implementation | `d0b67b273b94dfb9f262de9a133bdcbc69d65c86880d1fc6adf6a4447a0df752` | `MATCH` |
| db-cloud social-links operation     | `7c92e70b9635717f8249f5bf7eed447c464f95a64aee31ff8c92793e241921a4` | `MATCH` |
| db-cloud Reputation repository      | `1bdbad6e2f9b6d964b83ced0a8f2549805a8d3a57bbe5f9c77ff5d3464d047c2` | `MATCH` |
| db-cloud export catalog             | `65e889949678d1b379d634b98cd2b61e92d3e0602e1933db36255a5dc1f8a3d3` | `MATCH` |
| db-cloud integration tests          | `dea7284075aef73c48d41f9cdd3c46aa6b4cb5525ce0cee559997728c39d7464` | `MATCH` |
| db-cloud inventory guard            | `1596fef51c8b2b7590ca6439530dc7abd28d0edb0ab0155611fbd7c80fe973ed` | `MATCH` |

Final Phase 3B implementation remains byte-identical to the approved review:

| Artifact              | SHA-256                                                            | Result  |
| --------------------- | ------------------------------------------------------------------ | ------- |
| Backoffice page       | `b8caf1028cb0f579d9facb9274bdd80a404a890ce2f8ef8b7aa242c8440c44d2` | `MATCH` |
| Server action         | `b23d7d00da9e700b91d35fdead8ab235abe70a524e32c2bf57157171805fabe1` | `MATCH` |
| State model           | `78a05f1eead39c13919ab0b45dd66f00a1009f3bcf0d7ffa3d25d23bb3cc3d74` | `MATCH` |
| Settings component    | `16710b1bedbd94ccca7932a2a2b83b475a7325c962eca7adcb4ee90d68487dbe` | `MATCH` |
| Action tests          | `3eb692b5e351e8e6f053b95fdd6a99bd289f91dc68744188b5483028b35cc9ee` | `MATCH` |
| Component/model tests | `5d26a9b3f5892cb0b05e823d659b855e3b3ee6e6ff3c158c514c91ff15ef553a` | `MATCH` |

Schema, migration and permission bytes remain unchanged:

| Artifact                  | SHA-256                                                            | Result  |
| ------------------------- | ------------------------------------------------------------------ | ------- |
| Reputation schema         | `3a5da535dda36c409092a3f25422c90bdc17bafab8c8cfbfa7f17da52884c02e` | `MATCH` |
| Drizzle journal           | `04a7ddfe1c91d0acf54eee402d6e2e762780c9a13433c25d37dcc2534ee3e765` | `MATCH` |
| Backoffice permission map | `e3a21cf5b8456a859762d8603500669ead764e3bd43a8ba06a2ad17620014353` | `MATCH` |

The approved page-pack UI specification and 1440 reference remain unchanged.
No schema, migration, journal, grant, Google connector, navigation, shared UI,
production configuration or production data was changed. No second public
provider policy or raw-URL fallback was introduced.

## Human review boundary

Phase 3C stops at `AWAITING_HUMAN_REVIEW`. This evidence does not authorize
Phase 4, Browser QA, build, production enablement, deployment or data
operations.
