# Phase 3A — Stable Page Pack Review

Change: `reputation-review-social-links-configuration`

Review status: `APPROVED`

Stop gate: `PAGE_PACK_APPROVED_BEFORE_UI_CODE`

Date: `2026-09-06` (Europe/Paris)

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-06T01:50:58+02:00`

## Human authorization and preserved provenance

- Phase 1: `APPROVED_AFTER_INDEPENDENT_REVIEW`
- Phase 2: `OUT_OF_SEQUENCE_BUT_ACCEPTED_AFTER_RECONCILIATION`
- Phase 2 sequencing provenance: `IMPLEMENTED_BEFORE_AUTHORIZATION`
- Phase 1 Technical Implementation Contract: `PASS`
- Phase 2 Technical Implementation Contract: `PASS`
- Phase 3A Tasks 3.1–3.4: authorized and complete
- Phase 3B/3C/4, Browser QA and production: not authorized

## Targeted visual-authority revision

Previous human Phase 3A result: `CHANGES_REQUESTED`.

Accepted portions: page-pack protocol/integrity, Product/Data/Interaction scope
and authenticated baseline.

Previous blocker resolved by the first visual revision:
`VISUAL_AUTHORITY_INCOMPLETE`.

Latest human review result: `CHANGES_REQUESTED — TARGETED RESPONSIVE CONTENT
ORDER CORRECTION ONLY`.

Latest revision result: the 1440 proposal now uses the same major content order
as 1024/768/390: page header, metrics, existing Satisfaction inbox, then the
secondary settings card. `UI_SPEC.md` and `DESIGN_HANDOFF.md` explicitly require
one aligned semantic/DOM/visual order, natural keyboard traversal, no CSS region
reordering and no duplicate desktop/mobile form. The 1024/768/390 proposal
bytes, authenticated baselines, Product, data, interaction, authorization and
implementation semantics are unchanged.

## Pre-write integrity

Approved planning artifacts before Phase 3A:

| Artifact                    | SHA-256                                                            | Result |
| --------------------------- | ------------------------------------------------------------------ | ------ |
| Proposal                    | `12f138ad7de17186a313e14a08cb26f4f06333be2a03f8fc2445a63f8338ad61` | MATCH  |
| Analysis                    | `02c0213d17c754b3617738da4c4ef04aca4566e3ec42d669192cbe086b2a1f4d` | MATCH  |
| Spec                        | `ba36028f4d8461ca8f8742eff00d81ad14e45ee14ffbabc0b4787749679dad07` | MATCH  |
| Design                      | `3ab0ee2c9c84df1ef58157b3e026fab551cc973d88dd77448c0caa2a774f8582` | MATCH  |
| Approved Tasks pre-Phase-3A | `b7ae379fbbad0b9d9011f712177aa373bce4901fe278cb88e5483d1fddd065ce` | MATCH  |

Reconciled implementation postimages before Phase 3A:

| Path                                                                        | SHA-256                                                            | Result |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------ |
| `packages/contracts/src/reputation/index.ts`                                | `d0b67b273b94dfb9f262de9a133bdcbc69d65c86880d1fc6adf6a4447a0df752` | MATCH  |
| `packages/contracts/test/reputation.test.ts`                                | `d7143b5bb4d61e55330a56414d37216253a448c83e776d760429f2778046f394` | MATCH  |
| `packages/db-cloud/src/reputation-review-social-links.ts`                   | `7c92e70b9635717f8249f5bf7eed447c464f95a64aee31ff8c92793e241921a4` | MATCH  |
| `packages/db-cloud/src/reputation-repository.ts`                            | `1bdbad6e2f9b6d964b83ced0a8f2549805a8d3a57bbe5f9c77ff5d3464d047c2` | MATCH  |
| `packages/db-cloud/src/index.ts`                                            | `65e889949678d1b379d634b98cd2b61e92d3e0602e1933db36255a5dc1f8a3d3` | MATCH  |
| `packages/db-cloud/test/reputation-review-social-links.integration.test.ts` | `dea7284075aef73c48d41f9cdd3c46aa6b4cb5525ce0cee559997728c39d7464` | MATCH  |
| `packages/db-cloud/test/reputation-review-social-links-inventory.test.ts`   | `1596fef51c8b2b7590ca6439530dc7abd28d0edb0ab0155611fbd7c80fe973ed` | MATCH  |

Protected schema, journal, permission, session and tenant hashes also matched
the Phase 2 reconciliation packet. No new schema/migration, grant, qualified
audit cleanup/purge, second URL writer or Google connector write was introduced
by Phase 3A.

## Current implementation inventory

The current page is an authenticated persisted Direct Customer Feedback inbox
at `/visibilite-reputation/satisfaction`. The route uses the existing
Backoffice shell, server-fixed `DIRECT` mode, trusted tenant loader, current
review list/detail/actions and current navigation. The approved settings section
does not exist yet.

Exact implementation areas inspected are recorded in `DESIGN_HANDOFF.md` and
include the Satisfaction route; shared reviews loader/model/page/list/detail and
actions; `BackofficeFrame`; navigation; session/permission helpers; navigation
test; Phase 1 contracts; Phase 2 repository; and the public feedback page/form.

Authorization evidence:

- `reputation.read`: OWNER, MANAGER and STAFF under valid trusted context;
- `reputation.settings.manage`: OWNER only;
- MANAGER/STAFF inbox access remains usable and settings data/section remain
  absent;
- browser tenant/org/establishment/membership/role/permission values do not
  create authority.

## Concurrent public-boundary reconciliation

`feedback-public-trusted-boundary-hardening` currently has Proposal, Analysis,
Spec and Design and no Tasks. It owns verified/active public hostname resolution
and production client-identity configuration. Its Proposal/Design explicitly
exclude external review URLs/settings and Google/Facebook/Instagram connectors.

The current public page reads the trusted public configuration, receives the
three safe projected links and passes them to the success screen. The page pack
records this relationship only. It does not overwrite or reinterpret hostname,
slug, organization/establishment or missing-row authority.

Conflict result: `NONE`.

## Authenticated baseline evidence

Runtime: local Backoffice at `http://localhost:3001` using the current local
cloud PostgreSQL development database, authenticated synthetic OWNER
`owner@luna-restaurant.fr`, active establishment `LUNA`. The current route
loaded two persisted synthetic Direct Customer Feedback records. No production
or external data was used and no capture-time mutation occurred.

| Reference                                | Viewport | SHA-256                                                            |
| ---------------------------------------- | -------- | ------------------------------------------------------------------ |
| `references/baseline-owner-1440x900.png` | 1440×900 | `b5aac03f067d4ea8661b35a99797e0cb639e3a0bdba4e77da5ff9842436f7f8f` |
| `references/baseline-owner-1024x768.png` | 1024×768 | `fb7f2f1f30e6e96aa0f303885fe8fe4220f4bdbe6479a0d36eca5d382afe93f1` |
| `references/baseline-owner-768x1024.png` | 768×1024 | `08b1b0309d058f850c68df310a75620908347cf958c51621df49ba62ce3890a8` |
| `references/baseline-owner-390x844.png`  | 390×844  | `45c5b79d653275ed31785cbfcf35d75a6d06875f01ebe0ce87f0162e39916c66` |

The captures are current-state design inputs, not Browser QA. Current narrow
and mobile below-fold/footer pressure is documented as baseline behavior rather
than reported as an acceptance pass.

## Proposed visual references

| Reference                                | Viewport | SHA-256                                                            |
| ---------------------------------------- | -------- | ------------------------------------------------------------------ |
| `references/proposed-owner-1440x900.png` | 1440×900 | `f70e8edeee2711973bb418588006c486fa9864cb873059158c18aeaf3409c95c` |
| `references/proposed-owner-1024x768.png` | 1024×768 | `a0aeebe4cdc0040650246faa0c2f8a0eeeb248b90a27a796f1f1218f67fba281` |
| `references/proposed-owner-768x1024.png` | 768×1024 | `2e95945d094a20263f302ce4fe56daaa57bdbb830920243eabd94ba10b79c0e2` |
| `references/proposed-owner-390x844.png`  | 390×844  | `170232505d2341305847dcfcb976009bc31ea6c4577040e053559417e3c86a70` |

Generation used the built-in ImageGen edit flow with the matching baseline as
reference. Selected outputs were mechanically resampled to the exact requested
dimensions and copied into the pack without overwriting baselines.

Placement decision:

- all viewports: one semantic/DOM/visual sequence — page header, metrics,
  existing Satisfaction inbox, then settings; no CSS order crossing the inbox
  and no duplicate form;
- 1440: existing two-column inbox remains primary, followed by a compact
  full-width one-row card with right-aligned Save;
- 1024: inbox/pagination first, then settings; Google full width and the two
  social fields share a second row;
- 768: inbox/pagination first, then three stacked fields and lower-right Save;
- 390: inbox/pagination first, then a single-column empty form and full-width
  Save in normal flow above the footer.

Loading, dirty, invalid, saving, saved/no-change, server error/retry,
conflict/reload and configuration-unavailable treatment is fixed in
`UI_SPEC.md`. No modal, drawer, disclosure, route, tab or new navigation is
required.

## Exact page-pack inventory

| Relative path                            | SHA-256                                                            |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `ACCEPTANCE_CHECKLIST.md`                | `6f998fde3f855b6462b7bccb7a80eeaa783aabfb1dcb5a671a31080b2615f920` |
| `DATA_AND_INTERACTION_SPEC.md`           | `7cd469c70e8bf869b5dd26b7e9ce1dacd8c6ce56be7b7542e99d9a1cdfe4fbac` |
| `DESIGN_HANDOFF.md`                      | `a276efc7d40325410c3f0beafa1a8e24ef73d8b53717fdbb3347b4678d81490a` |
| `IMPLEMENTATION_PLAN.md`                 | `5f89ae10aa603ab3633dabecdba39e64c92aea3fccb119950a29f835a94c159e` |
| `PRODUCT_SCOPE.md`                       | `97effa96174067d8256d14be8e548884772925908b9549ffcb2c19dade3d441d` |
| `README.md`                              | `f698aeed1b40ba75f366027df358a4a18d90e973b72dbd03807bbcb3ecf51c39` |
| `UI_SPEC.md`                             | `24ba672ea443e7069ed5872459c7d80d2fe5a71c39bc67a1e1e853f6b5800498` |
| `prompt-provenance.json`                 | `42fd26d95c2cd076ad21105214402d08f408a49b6248a235a4e9d68433a6f603` |
| `prompts/00_REPOSITORY_ANALYSIS.md`      | `7ecab8ffd6d97de28f463d521172be6de8f66b7e3074e5e90e88f53f41ea394c` |
| `prompts/01_VISUAL_BASELINE.md`          | `d3075806ae38d0f9f6a945b3b42d1f3b8d7e2bd9eafa712a73587744c9f46119` |
| `prompts/02_COMPONENT_REFACTOR.md`       | `8b134cd4b462562416fb5c2e57c23eb4675a26eff7ea75fdfae44727b74648ac` |
| `prompts/03_INTERACTIONS.md`             | `e27c12d152d9270229eed6951898ab6f5e477d7d12ff9c170f4522ed45f00388` |
| `prompts/04_DATA_INTEGRATION.md`         | `f878f959d3afee428e67620c74f4c75231d2c7816f23cbf7fc6c701067538e79` |
| `prompts/05_VISUAL_QA.md`                | `5f31ec1c2a2bcfd3129643931e188365f9608958f1f8bd697ae7854e292eaad0` |
| `references/README.md`                   | `3d0021b69aad85858e0cb4fe693bf7d48f0afc90177a47788026badad04b5b55` |
| `references/baseline-owner-1024x768.png` | `fb7f2f1f30e6e96aa0f303885fe8fe4220f4bdbe6479a0d36eca5d382afe93f1` |
| `references/baseline-owner-1440x900.png` | `b5aac03f067d4ea8661b35a99797e0cb639e3a0bdba4e77da5ff9842436f7f8f` |
| `references/baseline-owner-390x844.png`  | `45c5b79d653275ed31785cbfcf35d75a6d06875f01ebe0ce87f0162e39916c66` |
| `references/baseline-owner-768x1024.png` | `08b1b0309d058f850c68df310a75620908347cf958c51621df49ba62ce3890a8` |
| `references/proposed-owner-1024x768.png` | `a0aeebe4cdc0040650246faa0c2f8a0eeeb248b90a27a796f1f1218f67fba281` |
| `references/proposed-owner-1440x900.png` | `f70e8edeee2711973bb418588006c486fa9864cb873059158c18aeaf3409c95c` |
| `references/proposed-owner-390x844.png`  | `170232505d2341305847dcfcb976009bc31ea6c4577040e053559417e3c86a70` |
| `references/proposed-owner-768x1024.png` | `2e95945d094a20263f302ce4fe56daaa57bdbb830920243eabd94ba10b79c0e2` |

The six prompt snapshots remain byte-identical to their generated provenance.
They were not edited in Phase 3A.

Tasks post-Phase-3A SHA-256 (only 3.1–3.4 marked complete):
`9373059c769515087bb1d2c2462d65d6dc851ab32a36849d916a2c7c68808323`.

## Validation

| Command                                                                             | Result                       |
| ----------------------------------------------------------------------------------- | ---------------------------- |
| `pnpm ui:pack:check backoffice-visibilite-reputation-satisfaction`                  | PASS — 1 package, 0 warnings |
| Scoped `pnpm exec prettier --check` for the pack and Tasks                          | PASS                         |
| `pnpm docs:check`                                                                   | PASS — 36 current documents  |
| `pnpm architecture:check`                                                           | PASS                         |
| `pnpm exec openspec validate reputation-review-social-links-configuration --strict` | PASS                         |
| Scoped `git diff --check` for the pack and Tasks                                    | PASS                         |

Repository-wide `pnpm format:check` was not required or claimed. Browser QA was
not started. No Backoffice/feedback-web implementation suite was rerun because
Phase 3A changed documentation/reference evidence only.

## Intentional omissions

- No separate full-page image for every transient state: exact route-local
  field/status/action treatments are fixed in `UI_SPEC.md` and keep the same
  card placement.
- No UI/server action/feedback-web code: Phase 3B/3C are not authorized.
- No Browser QA: final QA belongs to Phase 4 after implementation.
- No page-index promotion: this pack is awaiting exact-byte human approval and
  is not yet implementation-ready or as-built authority.

## Phase disposition

Phase 3A: `APPROVED`

Page Pack: `APPROVED`

Visual authority: `APPROVED`

PAGE_PACK_APPROVED_BEFORE_UI_CODE: `APPROVED`

Tasks 3.1–3.4: `COMPLETE`

Phase 3B: `NOT_AUTHORIZED`

Phase 3C: `NOT_AUTHORIZED`

Phase 4: `NOT_AUTHORIZED`

Browser QA: `NOT_STARTED`

Production: `NOT_AUTHORIZED`

Gate: `PAGE_PACK_APPROVED_BEFORE_UI_CODE — APPROVED`
