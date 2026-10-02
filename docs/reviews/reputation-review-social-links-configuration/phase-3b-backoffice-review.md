# Phase 3B Backoffice Review — Reputation Review Social Links Configuration

Review status: `APPROVED`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-06T14:26:40+02:00`

Change: `reputation-review-social-links-configuration`

Phase: `3B — Backoffice UI and server action`

Recorded at: `2026-09-06T02:17:26+02:00`

Prior human review: `CHANGES_REQUESTED — INVALID_STATE_UNREACHABLE_FROM_REAL_UI`

## Outcome

| Item                                         | Result           |
| -------------------------------------------- | ---------------- |
| Phase 3B                                     | `APPROVED`       |
| Technical Implementation Contract — Phase 3B | `PASS`           |
| Tasks 3.5–3.8                                | `COMPLETE`       |
| Invalid-state reachability                   | `FIXED`          |
| Phase 3C                                     | `NOT_AUTHORIZED` |
| Phase 4                                      | `NOT_AUTHORIZED` |
| Browser QA                                   | `NOT_STARTED`    |
| Production                                   | `NOT_AUTHORIZED` |

## Implemented behavior

- The existing `/visibilite-reputation/satisfaction` route keeps the current Direct Customer Feedback header, metrics, inbox, list/detail, filters, actions and pagination before the new settings section in one stable DOM tree.
- Only a trusted `OWNER` receives the settings read model and settings section. `MANAGER` and `STAFF` continue to receive the existing inbox without the settings model or form.
- The server action resolves trusted session/tenant context and requires `reputation.settings.manage` before forwarding any untrusted mutation payload to the Phase 2 operation.
- One form submits all three nullable links atomically. It reuses the Phase 1 schemas for client validation and does not define another provider allowlist.
- The UI covers loading, empty, populated, dirty, invalid, saving, saved, no-change, server-error/retry, conflict/reload and configuration-unavailable states.
- Leaving a field validates the current whole draft through the shared Phase 1 schema. Invalid provider values now produce visible field-associated errors while Save remains unavailable; correcting the field clears its stale error and restores the dirty, submittable state when the whole draft is valid.
- Failed and conflicting writes preserve the browser draft. Successful and no-change outcomes replace the baseline with the authoritative returned model. Refreshing the route can recover from an initial unavailable/error state after external provisioning.
- A route-local submission gate rejects a second concurrent submit. Blur validation never forces focus back to the field; submit-time validation retains the defensive first-error focus fallback.
- The opaque state token is transported only inside the typed mutation input and is never rendered. No internal settings, audit, actor, organization or establishment identifier is rendered.
- No autosave, partial provider save, implicit provisioning, modal, drawer, accordion, tab, duplicate responsive form or CSS major-region reordering was introduced.

## Attributed implementation inventory

| Path                                                                                                                      | Pre-Phase-3B SHA-256                                               | Post-Phase-3B SHA-256                                              |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/page.tsx`                                     | `dac74155282b1e9fdbf98e5bca129ce5944a5f779944b0229b325feef6c1cf60` | `b8caf1028cb0f579d9facb9274bdd80a404a890ce2f8ef8b7aa242c8440c44d2` |
| `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/actions.ts`                                   | `ABSENT`                                                           | `b23d7d00da9e700b91d35fdead8ab235abe70a524e32c2bf57157171805fabe1` |
| `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/_lib/review-social-links-state.ts`            | `ABSENT`                                                           | `78a05f1eead39c13919ab0b45dd66f00a1009f3bcf0d7ffa3d25d23bb3cc3d74` |
| `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/_components/review-social-links-settings.tsx` | `ABSENT`                                                           | `16710b1bedbd94ccca7932a2a2b83b475a7325c962eca7adcb4ee90d68487dbe` |
| `apps/backoffice/test/reputation-review-social-links-actions.test.ts`                                                     | `ABSENT`                                                           | `3eb692b5e351e8e6f053b95fdd6a99bd289f91dc68744188b5483028b35cc9ee` |
| `apps/backoffice/test/reputation-review-social-links-component.test.tsx`                                                  | `ABSENT`                                                           | `5d26a9b3f5892cb0b05e823d659b855e3b3ee6e6ff3c158c514c91ff15ef553a` |

Targeted invalid-state correction:

| Path                                                                                                                      | Accepted pre-correction SHA-256                                    | Corrected SHA-256                                                  |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/_lib/review-social-links-state.ts`            | `0251dfef01303a39f7643ea83653138e37876cba4e28fbdc39986ce4c2293708` | `78a05f1eead39c13919ab0b45dd66f00a1009f3bcf0d7ffa3d25d23bb3cc3d74` |
| `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/_components/review-social-links-settings.tsx` | `d06312a0d2e7e149b100fa9a4a8d49a831d81f58324fb0c0539318b7fdf3d255` | `16710b1bedbd94ccca7932a2a2b83b475a7325c962eca7adcb4ee90d68487dbe` |
| `apps/backoffice/test/reputation-review-social-links-component.test.tsx`                                                  | `d46288eedfe6b5b9a3ce1cf5259433b9b5c808a8dbc1b830e898157c65da583f` | `5d26a9b3f5892cb0b05e823d659b855e3b3ee6e6ff3c158c514c91ff15ef553a` |

Progress metadata only:

| Path                                                                     | Pre-Phase-3B SHA-256                                               | Post-Phase-3B SHA-256                                              |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `openspec/changes/reputation-review-social-links-configuration/tasks.md` | `9373059c769515087bb1d2c2462d65d6dc851ab32a36849d916a2c7c68808323` | `3bb53f11979ce87f671f1648090c4397eac4ace6df7ed321a5f9e34f27c1a01e` |

## Executable evidence

| Command                                                                                                                                                     | Exact result                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `pnpm --filter @yuta/backoffice exec vitest run test/reputation-review-social-links-actions.test.ts test/reputation-review-social-links-component.test.tsx` | `PASS` — 2 files, 27 tests                                                                     |
| `pnpm --filter @yuta/backoffice test`                                                                                                                       | `PASS` — 92 files passed, 1 skipped; 511 tests passed                                          |
| `pnpm --filter @yuta/backoffice typecheck`                                                                                                                  | `PASS` — `tsc --noEmit`, exit 0                                                                |
| `pnpm -r --if-present typecheck`                                                                                                                            | `PASS` — 15 of 16 workspace projects; all declared typechecks completed                        |
| `pnpm --filter @yuta/db-cloud exec vitest run test/reputation-review-social-links-inventory.test.ts`                                                        | `PASS` — 1 file, 5 tests                                                                       |
| `pnpm ui:pack:check backoffice-visibilite-reputation-satisfaction`                                                                                          | `PASS` — 1 package, 0 warnings                                                                 |
| `pnpm docs:check`                                                                                                                                           | `PASS` — 36 current documents                                                                  |
| `pnpm architecture:check`                                                                                                                                   | `PASS`                                                                                         |
| `pnpm exec openspec validate reputation-review-social-links-configuration --strict`                                                                         | `PASS`                                                                                         |
| Scoped Prettier checks for the six implementation/test files and `tasks.md`                                                                                 | `PASS`                                                                                         |
| Scoped `git diff --check` for the six implementation/test files                                                                                             | `PASS`; only the repository line-ending advisory for the pre-existing tracked page was emitted |

The first TypeScript run exposed a local UI type alias that incorrectly used
`Extract` against the existing generated outcome union. The route-local alias
was corrected without changing the approved shared contract; the final focused
tests, full Backoffice tests and typecheck all pass.

Initial formatting invocations that passed paths containing parentheses through
the Windows command shim were not accepted as evidence. The same files were
then checked from their route-local/application directories and passed.

## Generated-type and build disposition

- `pnpm typegen:next`: `NOT_RUN` — the current validated generated type state was already available and the approved Phase 3B contract did not require regeneration.
- Backoffice build: `NOT_RUN` — not required by the approved Phase 3B Technical Implementation Contract; final build and Browser QA remain later-phase evidence.
- No running Backoffice process was stopped and no `.next/dev/lock` was disturbed.

## Protected authority and scope

Approved planning bytes remain unchanged:

| Artifact | SHA-256                                                            | Result  |
| -------- | ------------------------------------------------------------------ | ------- |
| Proposal | `12f138ad7de17186a313e14a08cb26f4f06333be2a03f8fc2445a63f8338ad61` | `MATCH` |
| Analysis | `02c0213d17c754b3617738da4c4ef04aca4566e3ec42d669192cbe086b2a1f4d` | `MATCH` |
| Spec     | `ba36028f4d8461ca8f8742eff00d81ad14e45ee14ffbabc0b4787749679dad07` | `MATCH` |
| Design   | `3ab0ee2c9c84df1ef58157b3e026fab551cc973d88dd77448c0caa2a774f8582` | `MATCH` |

Phase 1/2 protected implementation remains unchanged:

| Artifact                            | SHA-256                                                            | Result  |
| ----------------------------------- | ------------------------------------------------------------------ | ------- |
| Contracts Reputation implementation | `d0b67b273b94dfb9f262de9a133bdcbc69d65c86880d1fc6adf6a4447a0df752` | `MATCH` |
| Contracts Reputation tests          | `d7143b5bb4d61e55330a56414d37216253a448c83e776d760429f2778046f394` | `MATCH` |
| db-cloud social-links operation     | `7c92e70b9635717f8249f5bf7eed447c464f95a64aee31ff8c92793e241921a4` | `MATCH` |
| db-cloud Reputation repository      | `1bdbad6e2f9b6d964b83ced0a8f2549805a8d3a57bbe5f9c77ff5d3464d047c2` | `MATCH` |
| db-cloud export catalog             | `65e889949678d1b379d634b98cd2b61e92d3e0602e1933db36255a5dc1f8a3d3` | `MATCH` |
| db-cloud integration tests          | `dea7284075aef73c48d41f9cdd3c46aa6b4cb5525ce0cee559997728c39d7464` | `MATCH` |
| db-cloud inventory guard            | `1596fef51c8b2b7590ca6439530dc7abd28d0edb0ab0155611fbd7c80fe973ed` | `MATCH` |

Key approved page-pack bytes remain unchanged and the complete pack check
passes:

| Artifact                                 | SHA-256                                                            | Result  |
| ---------------------------------------- | ------------------------------------------------------------------ | ------- |
| `ACCEPTANCE_CHECKLIST.md`                | `6f998fde3f855b6462b7bccb7a80eeaa783aabfb1dcb5a671a31080b2615f920` | `MATCH` |
| `DESIGN_HANDOFF.md`                      | `a276efc7d40325410c3f0beafa1a8e24ef73d8b53717fdbb3347b4678d81490a` | `MATCH` |
| `UI_SPEC.md`                             | `24ba672ea443e7069ed5872459c7d80d2fe5a71c39bc67a1e1e853f6b5800498` | `MATCH` |
| `references/proposed-owner-1440x900.png` | `f70e8edeee2711973bb418588006c486fa9864cb873059158c18aeaf3409c95c` | `MATCH` |

Schema/migration and authorization protected bytes remain unchanged:

| Artifact                          | SHA-256                                                            | Result  |
| --------------------------------- | ------------------------------------------------------------------ | ------- |
| Reputation schema                 | `3a5da535dda36c409092a3f25422c90bdc17bafab8c8cfbfa7f17da52884c02e` | `MATCH` |
| Drizzle journal                   | `04a7ddfe1c91d0acf54eee402d6e2e762780c9a13433c25d37dcc2534ee3e765` | `MATCH` |
| Migration 0017                    | `da44f6697cbf3933fd95484fef2727e48a88ac5cd1d421780ecb789b5ec7b623` | `MATCH` |
| Migration 0018                    | `98ab37e9c9b13ebea5503b30f7ace60cc25fd14758cddeb6ef144844ef10cf75` | `MATCH` |
| Backoffice permission map         | `e3a21cf5b8456a859762d8603500669ead764e3bd43a8ba06a2ad17620014353` | `MATCH` |
| Backoffice trusted session helper | `7231fb2507efa111e1674f2bf1b393955f90ff24249c91f2bbc24ec6ce932f98` | `MATCH` |
| Tenant guards                     | `5ad7c716281c9e499767bb0d897f18a598a09a65475a968b8db53cd183b39851` | `MATCH` |

- No attributable `apps/feedback-web/**` source change occurred. Its existing `next-env.d.ts` tracking removal belongs to the already-approved repository tooling change and was not touched here.
- No schema, migration, journal, permission/grant, navigation, provider, shared `@yuta/ui`, production configuration or production data change occurred.
- The inventory guard confirms no second social-link writer, no qualified-audit purge path and no schema/provider drift.
- The concurrent `feedback-public-trusted-boundary-hardening` change remains planning-only and was not modified or absorbed into Phase 3B.

## Human review boundary

Phase 3B stops at `AWAITING_HUMAN_REVIEW`. This evidence does not authorize
Phase 3C, Phase 4, Browser QA, production enablement, deployment or data
operations.
