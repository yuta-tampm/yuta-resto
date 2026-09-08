# Verify Evidence — Async Interaction Feedback Foundation

- Change: `async-interaction-feedback-foundation`
- Gate: `Technical VERIFY`
- Review status: `APPROVED`
- Approval source: explicit current-user instruction
- Approval recorded by: Codex workflow
- Approved: `2026-09-06T19:51:53.2982436+02:00`
- Created: `2026-09-06T19:34:21.1550901+02:00`
- Schema: `yuta-spec-driven`
- Analysis conclusion: `READY_FOR_SPECS`
- Sensitive change: `NO`
- Apply approval: `APPROVED`
- Verify authorization: `AUTHORIZED`
- `UI_AFFECTING: YES`
- `BROWSER_QA_REQUIRED: YES`
- `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`
- `VERIFY: PASS`
- `QA: NOT_EXECUTED`

## Authority and integrity

| Artifact                                     | Current SHA-256                                                    | Verify assessment            |
| -------------------------------------------- | ------------------------------------------------------------------ | ---------------------------- |
| `proposal.md`                                | `c973917e01917c17bb9399330312a9c7b7003ae920a11f0e0e50f876d879908e` | MATCH                        |
| `analysis.md`                                | `7535665d3bfac7bc328217fa418d045750eaeaa4d8da852613a351b030f3df39` | MATCH                        |
| Delta Spec                                   | `46840b69a936b96e9e6c49bee6330ea1a6206774f7aea7483dbabda4f159cb8e` | MATCH                        |
| `design.md`                                  | `0aa7c42257e6e9e11827c1e41a1d8dd61e96cc5391561ba75e51cbe546224138` | MATCH                        |
| Approved Tasks/TIC semantic bytes            | `20b49c57bf72341e4232b642f8fed2fc4b48643a41f7b6366c3b1692460e73fd` | MATCH                        |
| Current `tasks.md` after task 3.7 completion | `83d2f48a336c309087ce361b6f396964734869588cb657d250fa3ecbdb55eb49` | EXPECTED_PROGRESS_ONLY       |
| Apply review                                 | `ed9a067cc8cb807ebad8d2677faf671e683c63b998e79b76790c525455e94d55` | APPROVED / VERIFY_AUTHORIZED |
| Technical Compliance Matrix                  | `90d79e21c54319079bb7426b6a2b9890b7292a7544e4570e5db18f8338330ee5` | PASS, 31/31 rows             |

Verified repository HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`.

The approved Tasks/TIC semantic hash was reconstructed by reverting only the authorized checkbox progress bytes. It exactly matches the approved hash; no semantic task drift was found. OpenSpec reports `15/19` tasks complete. Only Browser QA tasks `3.4–3.6` and the post-QA Gate 3 eligibility task `3.8` remain open.

## Implementation inventory

Expected production changes only:

- `packages/ui/src/button.tsx`
- `apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-selector-panel.tsx`
- `apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-submit-button.tsx`
- `apps/backoffice/src/components/backoffice/backoffice-frame.tsx`
- `apps/backoffice/src/components/backoffice/logout-submit-button.tsx`

Expected test/tooling changes only:

- `packages/ui/package.json`
- `pnpm-lock.yaml`
- `packages/ui/test/button.test.tsx`
- `apps/backoffice/test/general-information-form.test.tsx`
- `apps/backoffice/test/google-location-submit-button.test.tsx`
- `apps/backoffice/test/logout-submit-button.test.tsx`

The lockfile delta is limited to the `packages/ui` importer and its package-local test dependencies. The root test script is unchanged. General Information, Formalités, tenant-switcher, both affected Server Actions, schemas, persistence, API, authentication, authorization and tenant boundaries are unchanged.

## Spec, Design and TIC verification

The complete row-by-row evidence is recorded in [`03-technical-compliance-matrix.md`](./03-technical-compliance-matrix.md).

- All ten Spec requirements and every scenario group: `PASS`.
- All six Design decisions: `PASS`.
- All pilot, tooling, phase-contract and protected-boundary rows: `PASS`.
- Applicable rows: `31`; `PASS: 31`; `FAIL: 0`; `BLOCKED: 0`.
- Shared native `Button loading` derives disabled and busy semantics, exposes `data-loading`, and preserves caller children rather than manufacturing a universal spinner or label.
- `asChild + loading` remains outside the normative guarantee; repository inventory found `ZERO_CURRENT_CONSUMERS`.
- Google selection and logout use the smallest local submit boundary with `useFormStatus`; action, redirect, provider, session and revalidation ownership remain unchanged.
- `CUSTOM_STATE_MACHINE_PRESERVED: YES` for Formalités and other route/domain-specific state.
- No timer, polling, router refresh, transition or reset-based stuck-pending workaround was introduced.

## Commands and results

| Command                                                                                                                                                                                                                                                                   | Result                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `pnpm --filter @yuta/ui exec vitest run test/button.test.tsx`                                                                                                                                                                                                             | PASS — 1 file, 4 tests                                                                                                      |
| `pnpm --filter @yuta/ui test`                                                                                                                                                                                                                                             | PASS — 1 file, 4 tests                                                                                                      |
| `pnpm --filter @yuta/backoffice exec vitest run test/general-information-form.test.tsx test/google-location-submit-button.test.tsx test/logout-submit-button.test.tsx test/formalites-persistent-draft-state.test.ts test/formalites-persistent-draft-component.test.tsx` | PASS — 5 files, 28 tests                                                                                                    |
| `pnpm --filter @yuta/backoffice exec vitest run test/tenant-switcher.test.tsx`                                                                                                                                                                                            | PASS — 1 file, 3 tests                                                                                                      |
| `pnpm --filter @yuta/backoffice typecheck`                                                                                                                                                                                                                                | PASS                                                                                                                        |
| `pnpm --filter @yuta/backoffice test`                                                                                                                                                                                                                                     | PASS — 95 files, 1 skipped, 518 tests                                                                                       |
| `pnpm --filter @yuta/backoffice build`                                                                                                                                                                                                                                    | PASS — Next.js 16.2.9 production build                                                                                      |
| `pnpm -r --if-present typecheck`                                                                                                                                                                                                                                          | PASS — all 15 participating workspaces                                                                                      |
| `pnpm docs:check`                                                                                                                                                                                                                                                         | PASS — 36 current documents                                                                                                 |
| `pnpm architecture:check`                                                                                                                                                                                                                                                 | PASS                                                                                                                        |
| `openspec validate async-interaction-feedback-foundation --strict --json`                                                                                                                                                                                                 | PASS — 1 change, 0 issues                                                                                                   |
| `pnpm format:check`                                                                                                                                                                                                                                                       | BASELINE_FAIL — 70 pre-existing/generated or unrelated files; no changed source/test/tooling file attributed to this change |

Change-scoped `prettier --check` over implementation, tests, tooling, `tasks.md` and review artifacts: `PASS`.

The repository-wide format baseline remains independently failing. This Verify does not repair unrelated baseline or generated-file noise. Change-scoped formatting and final diff hygiene passed after creation of this packet.

## Boundary assessment

- API / Server Actions: `UNCHANGED`
- Authentication / role / permission: `UNCHANGED`
- Tenant / establishment trust boundary: `UNCHANGED`
- Provider and external integration ownership: `UNCHANGED`
- Persistence / schema / migration / transaction: `UNCHANGED`
- Idempotency / retry / conflict identity: `UNCHANGED`
- Redirect / revalidation / authoritative completion: `UNCHANGED`
- Runtime topology: `UNCHANGED`
- Control Tower stop condition: `NOT_TRIGGERED`
- Design review required: `NO`

## QA and lifecycle boundary

Browser QA was deliberately not run in this Verify. There are no screenshots, screenshot manifest or `QA_REPORT.md` yet. Therefore this artifact makes no visual, responsive, real-route, provider-environment, keyboard/pointer, focus or end-to-end accessibility verdict.

- `QA: NOT_EXECUTED`
- `GATE_3: INELIGIBLE_UNTIL_QA_PASS`
- Sync: `NOT_AUTHORIZED / NOT_RUN`
- Archive: `NOT_AUTHORIZED / NOT_RUN`

## Verify conclusion

The implementation is technically compliant with the approved Spec, Design and Tasks/TIC. Formal Verify passes and the change is ready for the separately authorized Browser QA lane. This packet remains `AWAITING_HUMAN_REVIEW`; it does not promote Gate 3 and does not authorize sync or archive.

Recommendation: `APPROVE_VERIFY_FOR_QA`
