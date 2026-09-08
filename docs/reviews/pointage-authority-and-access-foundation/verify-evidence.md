# Technical VERIFY — Pointage Authority and Access Foundation

Change: `pointage-authority-and-access-foundation`

Date: 2026-09-07

Schema: `yuta-spec-driven`

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS

VERIFY: PASS

## Assessment

All 22 approved Apply tasks are complete. The current implementation covers all
16 approved requirements and all 58 scenarios, preserves Design D1–D13, and
satisfies every applicable F1–F8, S1–S9 and R1–R7 contract row below. Formal
VERIFY found three bounded implementation defects—missing denial attribution,
an incorrect establishment operation identifier, and non-canonical UUID
generation—and corrected them inside the approved paths before restarting the
relevant focused and broader checks. No unresolved critical issue or approved
Product/authority deviation remains.

The implementation is still only a server-side cloud foundation. It adds no
Pointage UI, browser transport, usable clocking workflow, raw actual-work
evidence, local runtime, offline/sync path or production client-address provider.

## Approved planning integrity

| Artifact                                      | SHA-256                                                            |
| --------------------------------------------- | ------------------------------------------------------------------ |
| `proposal.md`                                 | `900e2c99c7f88d655a02ddc4b58d2dc5a61c140b1dea29319546d84458627494` |
| `analysis.md`                                 | `fe06a094fb0b3772cbcd2b1ca8b222055ad96f2f00e54c06451e1b7adb40f0ed` |
| `specs/authorization/pointage/spec.md`        | `55b550bb449d2fd2c342bb91d328b82c8cc5658252fa460c02de39fcddfd4058` |
| `specs/pointage/authority-foundation/spec.md` | `3d5dce5f6ed6149655cd29f2fc046b39801e2e3a86376b57abf78cee942cb613` |
| `design.md`                                   | `27537f0287bfec6c5ad6d211e143fdbec6a11ccb0e60fff04ae7dd9c32371dfa` |
| `tasks.md`                                    | `20de1adeb010dd5c26395488ddb4c5acfbfcd93dc86fbd77cc06bedbed2491a5` |
| Gate 1 packet                                 | `0bd04c07e4f1f3967e2155b7b7ed0c0a45194f7f85127f2b31b4c4fd55ebd548` |
| Gate 2 packet                                 | `6a983e23c34f945389b66550c39e892918ea0a2ea61a870e90dbd65236abe32c` |
| Gate 2b packet                                | `f92ec7ea482c33633770f7986898b426e59dbf114870267740296bc4a5c4fddd` |

The pre-existing Formalités export in `packages/auth/src/index.ts` remains exact
against its pre-Apply baseline. Removing only the new Pointage export from the
current file yields SHA-256
`f435cc08b5151437621b6cd5fda61715b0760451631bff3d1b8fd39316cb5ce7`.
It is not attributed to this change.

## Exact implementation inventory and hashes

| Path                                                               | SHA-256                                                            |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/architecture/AUTHENTICATION.md`                              | `c92736abbc1192b18a06923e5ead5ed7416c4610f8c0dbd8ae639bc65cfdf4c8` |
| `packages/auth/src/index.ts`                                       | `b5a8cb1f5bf9c87db3974a08948a8cd98418e42f3761ae228df6fd5e1642c634` |
| `packages/auth/src/pointage-credential.ts`                         | `8b294113e7a97fb83e5acff5df96224ed4c18d73d60c46a63abf824c37195fa1` |
| `packages/auth/test/pointage-credential.test.ts`                   | `6ea66dbb73a82f8586575c15f049be3ee0832987888045a593b982001c1479a0` |
| `packages/db-cloud/drizzle/0019_pointage_authority_foundation.sql` | `143b6d1e47f92336b4359c4c85a17487ead97416afbbe2c0fd0b99880c0e7056` |
| `packages/db-cloud/drizzle/meta/0019_snapshot.json`                | `3ab5d679d0802a3ba6bb3faf25f3cbfda10d282064eb202485a8029ab4f7cb49` |
| `packages/db-cloud/drizzle/meta/_journal.json`                     | `855d5ace75fac337d0fe701f130565b5673c31b84c5a47a25b6f19315e77f665` |
| `packages/db-cloud/src/index.ts`                                   | `78dfaea8430d150923eaad931a9e034c5fa9eb8e27664f3b2a356fdc1c0057e1` |
| `packages/db-cloud/src/schema/index.ts`                            | `934314b0cc16f81e050447869259554ff50366eefb5fe3c5d86be03113966264` |
| `packages/db-cloud/src/schema/pointage.ts`                         | `19ee38a3153883067eac3fd62fcfe5668968e60f5c43cef71c29f993972429e6` |
| `packages/db-cloud/src/pointage-repository.ts`                     | `4cfcfc4f5287590fde3ff44062a97efe1bd256771774495ae0ce91ab488034d8` |
| `packages/db-cloud/test/pointage-schema.test.ts`                   | `e1026fbfc7adef0773a916ed230d302005c09c711c61503159799f35f5e1b090` |
| `packages/db-cloud/test/pointage-repository.integration.test.ts`   | `4761848b92e1ebb4f2db81d15e596f654f02b480c34bd290a339755302a6c1f1` |
| `apps/backoffice/src/server/pointage/authorization.ts`             | `c33a530483f76f29065729834e07b5d4512ee54255765645bece9cef8c87cc34` |
| `apps/backoffice/src/server/pointage/service.ts`                   | `1e34ca92770148dbbaa9582a793de425163e89cd067d6d90e317b1fb2e2747ae` |
| `apps/backoffice/src/server/pointage/index.ts`                     | `5a17ce9a793561f26e7eca9c62f7835925d54d9eba61074951d58871dd910133` |
| `apps/backoffice/test/pointage-foundation.test.ts`                 | `e3f091057b9c0f21bfd2ed872b9e435fc4330ae9239ffa8e5bbd51534ed3729b` |
| `apps/backoffice/test/pointage-foundation-inventory.test.ts`       | `1a8d4d2f026d6444de11f1afc5d47e38a4098eedbd0059e330cb78d102242daa` |

Canonical exact scoped implementation diff:
`docs/reviews/pointage-authority-and-access-foundation/03-implementation.diff`.
SHA-256:
`e161c46680bc4ab0f86e383a5263736b7a8200fb6485b6e9c0f70cecfc2af0fe`.
It contains exactly 18 sections, 12,950 insertions and one deletion; the large
generated Drizzle snapshot is included. `git -c core.autocrlf=false apply
--check --reverse` passes. The custom baseline for `packages/auth/src/index.ts`
includes the unrelated Formalités export and attributes only the added Pointage
export.

## Requirement and scenario traceability

| Approved requirement family                          | Scenarios | Implementation and executable evidence                                                                         | Result |
| ---------------------------------------------------- | --------: | -------------------------------------------------------------------------------------------------------------- | ------ |
| Actual-work evidence authority and Personnel period  |         3 | No raw-evidence implementation; lifecycle guard in `service.ts`; inventory and date-matrix tests               | PASS   |
| Raw records immutable / no destructive mutation      |         3 | No evidence table, command or mutation path; migration and inventory review                                    | PASS   |
| Dossier/organization/establishment scope             |         4 | Composite schema constraints and every repository predicate; cross-scope DB tests                              | PASS   |
| Employment-period eligibility                        |         5 | Inclusive entry/departure calculation for all three employee operations; 15-case matrix                        | PASS   |
| Cloud online-only boundary                           |         3 | Backoffice server composition only; no db-pos, Site Agent, POS, offline or sync imports                        | PASS   |
| Legal/privacy classification remains unresolved      |         4 | Minimized audit only; no retention/deletion/legal-hold/visibility implementation                               | PASS   |
| No broader Pointage workflow                         |         2 | No UI, route, transport, Planning, payroll or actual-work events                                               | PASS   |
| Dedicated scoped credential                          |         4 | Eight-digit primitive, scoped digests, composite credential rows, generic validation                           | PASS   |
| One-time plaintext presentation                      |         3 | Service constructs presentation only after repository transaction resolves; repository never returns plaintext | PASS   |
| Issue/reset lifecycle only                           |         4 | Exact two lifecycle commands; reset supersedes; no revoke/suspend/retrieve operation                           | PASS   |
| Employee self-only authority                         |         5 | Immutable proof and single-operation employee context; wrong dossier/scope/lifecycle denied                    | PASS   |
| OWNER/MANAGER dedicated grants                       |         5 | Exact manager context factory; OWNER/MANAGER allow, STAFF and aliases deny                                     | PASS   |
| Trusted scoped entry and non-enumeration             |         5 | Slug resolver, required address provider, dual distributed limits, generic results and dummy path              | PASS   |
| Credential lifecycle independent of employment dates |         3 | Issue/reset require scoped dossier but do not invoke eligibility or define upcoming issuance policy            | PASS   |
| Minimized security attribution                       |         3 | Closed event/reason taxonomy and success/denial tests; no reader or legal-evidence claim                       | PASS   |
| No final workflow/product behavior                   |         2 | Static inventory and scoped diff prove explicit non-scope                                                      | PASS   |

Coverage: 16/16 requirements and 58/58 scenarios.

## Technical Compliance Matrix

| Rule | Constraint                                                             | Implementation                | Test/check/evidence                                          | Result |
| ---- | ---------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------ | ------ |
| F1   | Portable exact eight-digit CSPRNG credential                           | Auth Pointage module          | Format, Unicode/separator rejection and generation tests     | PASS   |
| F2   | Validated secret and four HKDF-separated versioned keys                | Auth Pointage module          | Invalid/canonical secret, key-separation and scope tests     | PASS   |
| F3   | Scoped HMAC; salted/peppered scrypt; constant-time real/dummy path     | Auth Pointage module          | Exact parameter, wrong/version and dummy tests               | PASS   |
| F4   | No plaintext/key/digest/raw-address logging or durable plaintext       | All three layers              | Typed return review, audit assertions and inventory tests    | PASS   |
| F5   | Exactly three additive scoped Pointage tables and constraints          | Pointage schema/migration     | Schema assertions, SQL review and clean migration            | PASS   |
| F6   | Trusted composite scope on every repository operation                  | Pointage repository           | Cross-org/establishment/dossier integration denials          | PASS   |
| F7   | Atomic lifecycle/audit and limiter updates; no raw evidence            | Repository transactions       | Concurrency, rollback and minimized-audit tests              | PASS   |
| F8   | Generated journaled migration validated on disposable DB               | Drizzle `0019` artifacts      | Clean `0000`–`0019` apply and 8/8 integration tests          | PASS   |
| S1   | Closed exact six-operation catalog                                     | Authorization module          | Exact tuple plus wildcard/unknown denial tests               | PASS   |
| S2   | Credential proof distinct from immutable employee context              | Authorization/service modules | Proof-only and single-operation context assertions           | PASS   |
| S3   | Dedicated OWNER/MANAGER grants; STAFF/no aliases deny                  | Authorization module          | Role and alias denial matrix                                 | PASS   |
| S4   | Slug is locator; server resolves active composite scope                | Service/repository            | Unknown/inactive/cross-parent generic-result tests           | PASS   |
| S5   | Required trusted client-address provider; no unsafe fallback           | Service composition           | Missing/null provider and forbidden-header inventory tests   | PASS   |
| S6   | Ordered generic validation with candidate/client limits and one scrypt | Service/auth/repository       | Invalid, throttled, dummy/real and counter-reset tests       | PASS   |
| S7   | Personnel eligibility for identify/state.read/operation.create         | Service authorization         | Upcoming/entry/active/final/former matrix for each operation | PASS   |
| S8   | Scoped issue/reset, ten collisions, post-commit one-time result        | Service/repository            | Collision/concurrency/old-credential/failed-commit tests     | PASS   |
| S9   | Closed minimized audit; no partial/offline/replay authority            | Repository/service            | Exact event/reason and denied-attribution assertions         | PASS   |
| R1   | Real guarded disposable DB; no skipped Pointage suite                  | DB integration fixture        | Verified loopback named DB, clean migration, 8/8 pass        | PASS   |
| R2   | Full tenant/dossier isolation across operations and audit              | Repository/service            | Cross-scope integration and Backoffice denial tests          | PASS   |
| R3   | Controlled lifecycle concurrency and rollback                          | Repository transactions       | Issue/reset pairings, one-current and fault tests            | PASS   |
| R4   | Dual limiter, generic response, dummy and secret minimization          | Auth/service/repository       | Security-focused auth/Backoffice/DB tests                    | PASS   |
| R5   | No raw evidence, transport/UI, alias, local/offline/sync dependency    | Entire scoped diff            | Negative inventory test and architecture check               | PASS   |
| R6   | All legal/privacy/provenance production blockers preserved             | Docs/code inventory           | No retention jobs, visibility reader or production provider  | PASS   |
| R7   | Non-UI foundation; QA applicability evaluated only after VERIFY        | Entire scoped diff            | No application route/component/browser consumer              | PASS   |

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS

## Formal command evidence

| Command/check                                                                                                                | Result                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm --filter @yuta/auth exec vitest run test/pointage-credential.test.ts`                                                  | Exit 0; 1 file, 5 tests passed.                                                                                                      |
| `pnpm --filter @yuta/db-cloud exec vitest run test/pointage-schema.test.ts`                                                  | Exit 0; 1 file, 3 tests passed.                                                                                                      |
| Guarded Pointage repository integration against `yuta_pointage_foundation_test_verifyfinal`                                  | Exit 0; 1 file, 8 tests passed, no skip.                                                                                             |
| `pnpm --filter @yuta/backoffice exec vitest run test/pointage-foundation.test.ts test/pointage-foundation-inventory.test.ts` | Exit 0; 2 files, 23 tests passed.                                                                                                    |
| Auth, db-cloud and Backoffice package typechecks                                                                             | Exit 0.                                                                                                                              |
| `pnpm test:cloud`                                                                                                            | Exit 0; cloud chain passed. Backoffice: 97 files passed, one guarded unrelated suite skipped, 541 tests passed.                      |
| `pnpm build:cloud`                                                                                                           | Exit 0; all four cloud applications built.                                                                                           |
| `pnpm docs:check`                                                                                                            | Exit 0; 36 current documents passed.                                                                                                 |
| `pnpm architecture:check`                                                                                                    | Exit 0.                                                                                                                              |
| `pnpm -r --if-present typecheck`                                                                                             | Exit 0; all 15 participating projects passed.                                                                                        |
| Strict OpenSpec validation                                                                                                   | Exit 0; this change valid with zero issues.                                                                                          |
| Scoped Prettier over all attributable implementation/planning/review paths                                                   | Exit 0.                                                                                                                              |
| `git diff --check`                                                                                                           | Exit 0; only Windows LF/CRLF advisory, no whitespace error.                                                                          |
| Reverse application check of exact implementation diff                                                                       | Exit 0.                                                                                                                              |
| `pnpm format:check`                                                                                                          | Exit 1; exactly 67 pre-existing/out-of-scope paths, matching the planning baseline. None was formatted or attributed to this change. |

The disposable PostgreSQL 17 container
`yuta-pointage-formal-verify-final-20260907` used tmpfs and dynamic loopback port 51532. Migrations `0000` through `0019` applied cleanly to the final guarded DB,
the integration suite ran without skips, and SQL inspection found exactly the
three Pointage tables. The container was stopped and its tmpfs discarded.

One earlier formal attempt used the otherwise disposable database suffix
`_verify_final`; the existing integration safety guard rejected that name before
tests ran. The guard was not weakened. A fresh allowed name `_verifyfinal` was
created in the same isolated tmpfs container and supplied the final PASS above.

`pnpm test:local` was not run because the implementation is cloud-only and the
negative dependency inventory found no local change. No skipped suite is counted
as Pointage PASS.

## Migration, deviations and blockers

The initially generated migration placed a self-referential composite foreign
key before the generated unique target index. It failed on a clean disposable
database. Only the new uncommitted `0019` schema/migration/snapshot was corrected
and regenerated; existing migrations were untouched. Clean migration and final
integration evidence then passed.

Formal VERIFY also corrected, within approved scope:

- manager/lifecycle denial audit attribution using only approved events/reasons;
- `pointage.establishment.read` as the exact approved operation identifier; and
- repository-generated UUIDv7 identifiers, consistent with current db-cloud
  conventions.

All relevant validation was rerun after those corrections. No Spec, Design,
authority, topology or non-scope change was introduced.

Still blocked for production/readiness: exact retention duration,
deletion/anonymization execution, legal hold, backup-retention interaction,
employee notice wording, detailed audit visibility, and separately reviewed
trusted production client-address provenance. Without that provider authority,
credential validation cannot be instantiated in production.

VERIFY: PASS
