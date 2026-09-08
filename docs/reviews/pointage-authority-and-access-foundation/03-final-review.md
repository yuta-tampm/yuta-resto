Change: `pointage-authority-and-access-foundation`

Gate: 3 — Final Independent Review

Review status: APPROVED

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: 2026-09-07T15:12:27.0842740+02:00

Approval scope: exact reviewed Gate 3 packet SHA-256
`339ffba42c4dd44b6eec17435424e1d683cdb5c726600dc92b0f7dac996cc723`,
two approved delta capability paths, implementation diff SHA-256
`e161c46680bc4ab0f86e383a5263736b7a8200fb6485b6e9c0f70cecfc2af0fe`,
VERIFY evidence SHA-256
`fd81bfc8c9f645d9f99a64da7203d329fecb3f6a40821d6e4bf75465728742a2`,
and accepted `QA: NOT_APPLICABLE` only.

Created: 2026-09-07T00:28:49.1800121+02:00

Schema: `yuta-spec-driven`

Sensitive change: YES — credential security, authorization, tenancy and cloud
persistence foundation

Apply authorization: GRANTED by explicit current-user instruction

Sync authorization: AUTHORIZED_BY_CURRENT_USER

Finish outcome: COMPLETED

Specs: synced and strictly validated — `authorization/pointage` and
`pointage/authority-foundation`

Archive location:
`openspec/changes/archive/2026-09-07-pointage-authority-and-access-foundation`

Completed: 2026-09-07T15:20:40.4747398+02:00

Knowledge consolidation: UPDATE_REQUIRED

Knowledge review:
`docs/reviews/pointage-authority-and-access-foundation/04-knowledge-consolidation-review.md`
— `APPROVED`, exact byte application completed

Workflow status: DONE

KNOWLEDGE CONSOLIDATION: COMPLETE

Knowledge completed: 2026-09-07T16:22:33.5133947+02:00

Knowledge application: 2026-09-07T16:17:50.6638648+02:00 — exactly four targets
and ten byte substitutions, approved by explicit current-user instruction for
proposal SHA-256
`6c4e9e47b7cdf7257924b62673e82de36b8045a7c57ce1b6bbd91405823a01d9`
and manifest SHA-256
`5b6288188fe0c7b98c8758da6760e6460eaf0ba228f5a4c7b16204e8da109b51`.
All pre-write hashes and unique preimages matched; complete target bytes and
all ten After positions matched the expected result. Final target hashes,
exact applied knowledge diff and preservation proof are recorded in the
Knowledge Review packet. The 15 main Specs, 7 archive files and 18 scoped
implementation/evidence-source files remain byte-for-byte unchanged.

Knowledge validation: docs:check PASS (36 documents), architecture:check PASS,
and scoped Prettier check with `--end-of-line auto` PASS. The unmodified default
formatting diagnostic reports only CRLF-to-LF differences in the two targets
whose CRLF bytes are explicitly protected by the approved manifest; read-only
comparison proved there is no other formatting difference. No target was
formatted. The exact-byte update does not clear any legal/privacy or trusted
client-address provenance blocker, promote usable-workflow/readiness lifecycle,
or authorize production enablement. Gate 3 approval, successful finish and
archive evidence remain historical and were not reopened.

Final scoped preservation verification: PASS. The final scan also detected
concurrent drift in the unrelated Formalités legal-review Gate 1 packet; it
was not written or reverted by this operation and is excluded from the exact
four-target Knowledge diff. Before/observed hashes are recorded in the
Knowledge Review packet; no claim of an entirely unchanged checkout is made.

Knowledge resume — 2026-09-07: Branch B dừng trước Apply do Before 5/8/10
trong proposal dùng LF nhưng Personnel target dùng CRLF. Proposal hash và bốn
target hashes vẫn khớp; kiểm tra cũ đã normalize newline nên không phải byte
proof. Proposal/Knowledge Review đã regenerate kèm exact byte manifest và chờ
human review. Không canonical knowledge, main Spec, archive hoặc implementation
byte nào thay đổi. Gate 3 approval và finish/archive outcome được giữ nguyên.

Production enablement: NOT_AUTHORIZED

RELEASE_FOLLOW_UP: NOT_REQUIRED — the implemented foundation has no usable
transport or production provider and remains deliberately not enabled; any
future deployment belongs to a separately approved capability/readiness change.

Production release/enablement: NOT_AUTHORIZED

# Gate 3 — Final Independent Review

## Independent results

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS

VERIFY: PASS

UI_AFFECTING: NO

BROWSER_QA_REQUIRED: NO

QA: NOT_APPLICABLE

Tasks: 22/22 complete across exactly the three approved Apply phases:

1. Foundation / Data
2. Service / Domain
3. Integration / Regression

Formal VERIFY was performed after Apply and QA was evaluated separately only
after VERIFY passed. This packet requests human Gate 3 review; it does not
approve itself or authorize sync, archive, deploy, production enablement or any
lifecycle/readiness promotion.

## Approved prerequisite integrity

| Gate/artifact                   | Status                               | SHA-256                                                            |
| ------------------------------- | ------------------------------------ | ------------------------------------------------------------------ |
| Proposal                        | approved scope preserved             | `900e2c99c7f88d655a02ddc4b58d2dc5a61c140b1dea29319546d84458627494` |
| Analysis                        | `READY_FOR_SPECS` preserved          | `fe06a094fb0b3772cbcd2b1ca8b222055ad96f2f00e54c06451e1b7adb40f0ed` |
| Gate 1 review                   | approved                             | `0bd04c07e4f1f3967e2155b7b7ed0c0a45194f7f85127f2b31b4c4fd55ebd548` |
| Authorization delta Spec        | approved                             | `55b550bb449d2fd2c342bb91d328b82c8cc5658252fa460c02de39fcddfd4058` |
| Authority-foundation delta Spec | approved                             | `3d5dce5f6ed6149655cd29f2fc046b39801e2e3a86376b57abf78cee942cb613` |
| Gate 2 review                   | approved                             | `6a983e23c34f945389b66550c39e892918ea0a2ea61a870e90dbd65236abe32c` |
| Sensitive Design                | approved                             | `27537f0287bfec6c5ad6d211e143fdbec6a11ccb0e60fff04ae7dd9c32371dfa` |
| Gate 2b review                  | approved                             | `f92ec7ea482c33633770f7986898b426e59dbf114870267740296bc4a5c4fddd` |
| Tasks / Implementation Plan     | approved; 22/22 Apply tasks complete | `20de1adeb010dd5c26395488ddb4c5acfbfcd93dc86fbd77cc06bedbed2491a5` |

## Reviewed implementation

The implementation provides:

- an eight-digit CSPRNG credential primitive with HKDF key separation, scoped
  HMAC lookup, salted and peppered scrypt, constant-time verification and a
  dummy verification path in `@yuta/auth`;
- exactly three additive `@yuta/db-cloud` Pointage tables, a generated and
  journaled `0019` migration, composite tenant/dossier constraints, atomic
  distributed rate limits, minimized audit and transactional issue/reset;
- a server-only Backoffice Pointage foundation with trusted establishment scope,
  required injected client-address provenance, exact six-operation catalog,
  dedicated OWNER/MANAGER grants, STAFF/no-alias denial, separate credential
  proof and employee contexts, and Personnel eligibility for all three employee
  operations; and
- focused and broader security, tenancy, concurrency, rollback, lifecycle and
  negative-inventory regression evidence.

It does not create a UI, API/browser transport, usable clocking path, raw
Pointage evidence, Planning/payroll integration, POS/Site Agent/local/offline/
sync dependency, or a production trusted-address provider.

## Exact implementation diff and attribution

Canonical full scoped diff:
[03-implementation.diff](03-implementation.diff)

SHA-256:
`e161c46680bc4ab0f86e383a5263736b7a8200fb6485b6e9c0f70cecfc2af0fe`

The diff contains exactly 18 implementation paths, including untracked source,
tests, migration SQL/snapshot and bounded documentation: 12,950 insertions and
one deletion. Reverse application check passes against the current checkout.

The pre-existing unrelated Formalités export in
`packages/auth/src/index.ts` was preserved byte-for-byte and is part of the
custom pre-Apply baseline, not this implementation diff. Removing only the new
Pointage export from the current file reproduces baseline SHA-256
`f435cc08b5151437621b6cd5fda61715b0760451631bff3d1b8fd39316cb5ce7`.
No unrelated dirty path is attributed to this change.

## Formal VERIFY

Exact evidence:
[verify-evidence.md](verify-evidence.md)

SHA-256:
`fd81bfc8c9f645d9f99a64da7203d329fecb3f6a40821d6e4bf75465728742a2`

The evidence includes:

- all F1–F8, S1–S9 and R1–R7 rows with authority, implementation and actual
  check evidence;
- mapping for 16/16 requirements and 58/58 scenarios;
- exact implementation and planning hashes;
- clean disposable-database migration and no-skip Pointage integration proof;
- focused and broader command results;
- bounded corrections discovered during implementation/VERIFY; and
- remaining production blockers and excluded scope.

Final technical command summary:

- focused Pointage suites: auth 5/5, schema 3/3, repository integration 8/8
  without skips, Backoffice 23/23;
- `pnpm test:cloud`: PASS, including Backoffice 541 tests; one unrelated guarded
  external suite remained skipped by its existing guard;
- `pnpm build:cloud`: PASS for all four cloud applications;
- package and recursive typechecks, docs, architecture and strict OpenSpec
  validation: PASS;
- scoped Prettier and `git diff --check`: PASS; and
- global `pnpm format:check`: FAIL on exactly 67 pre-existing/out-of-scope paths,
  matching the planning baseline. No global formatting write or false PASS is
  claimed.

`pnpm test:local` was intentionally not run because the foundation is cloud-only
and no local dependency appeared.

## Separate QA evaluation

Exact assessment:
[qa-assessment.md](qa-assessment.md)

SHA-256:
`7cc4da306e6ff45e7491e303b7a3248636b91b220322ac7908ae99096a88b6e2`

The final diff has no visible UI, browser transport, route handler or usable
runtime consumer. Browser QA would therefore be artificial. Under
`YUTA_QA_PROTOCOL`, the honest result is `QA: NOT_APPLICABLE`, not a pre-recorded
or inferred PASS. Any later UI/transport/provider composition change must make
its own QA determination.

## Deviations and failure history

Approved Product/authority deviation: NONE.

Unresolved technical critical issue: NONE.

Implementation/VERIFY encountered and resolved these bounded technical issues:

- the first generated self-referential credential constraint depended on an
  index created later; the uncommitted `0019` artifacts were regenerated and a
  clean `0000`–`0019` migration then passed;
- denied manager/lifecycle operations initially lacked required minimized audit
  attribution; the approved attribution path and tests were added;
- the establishment read identifier was corrected to the approved exact
  `pointage.establishment.read`; and
- generated repository IDs were aligned with existing db-cloud UUIDv7
  convention.

All affected validation was restarted after the final corrections. An attempted
disposable DB name ending `_verify_final` was refused by the existing safety
guard before tests; the guard stayed intact and the final allowed disposable DB
`yuta_pointage_foundation_test_verifyfinal` supplied the clean PASS evidence.

## Preserved production and legal/privacy blockers

This foundation does not resolve or clear:

- exact retention duration;
- deletion/anonymization execution;
- legal hold;
- backup-retention interaction;
- employee notice wording;
- detailed audit visibility; or
- trusted production client-address provenance.

Without separately reviewed deployment authority for a trusted production
`TrustedPointageClientAddressProvider`, credential validation remains impossible
to instantiate or enable in production by design.

## Review recommendation and stop

Recommendation: `APPROVE_GATE_3_WITH_EXPLICIT_SYNC_AUTHORIZATION_IF_READY`

Gate 3 approval alone is not sync authorization. `$yuta-run-change` never syncs
or archives normative specs. No deployment, production migration, provider
activation or readiness promotion is requested by this packet.

## Finish result — 2026-09-07

Gate 3 approval and explicit sync authorization were accepted only after every
reviewed planning, gate, implementation-diff, VERIFY/matrix and QA hash matched.
Both selected delta Specs were promoted mechanically into new canonical main
Specs; normalized delta-to-main comparisons matched 2/2 and
`openspec validate --specs --strict --json` passed 15/15 with advisory long-text
INFO only. No unexpected requirement, capability or delta-operation header was
introduced.

The active change was moved synchronously to the exact archive location above
only after validation, with all artifacts and 22/22 tasks complete. No rollback
was required. The post-archive Knowledge Scan classified `UPDATE_REQUIRED`
because current knowledge still describes all Pointage scope as unapproved and
not started. The exact four-target proposal is pending separate human review;
no canonical knowledge edit has been applied.

No Product/authority boundary was expanded, no lifecycle value was
automatically promoted, and no deploy, production migration, provider
activation, Pointage enablement, UI/transport, raw evidence or local/offline/sync
operation occurred.

GATE 3 — FINAL INDEPENDENT REVIEW

Review status: APPROVED
