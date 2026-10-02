# POS Order Entry - Reference Metadata

Status: Baseline evidence and generated design proposals

Visibility: Engineering

Reference status: `APPROVED`

Capture status: `CAPTURED`

Captured: 2026-08-13, Europe/Paris

Route/state: canonical `/pos`, healthy populated operational state, captured at
clean dev origin `http://localhost:3013/pos`

Viewport: 1366 x 768, DPR 1

Runtime/session: existing local PostgreSQL, site-agent, real seeded users, no
cloud dependency, no staff/management authentication, selected employee
attribution `YuTa Staff`, no submitted mutation

Visible health: local server/database available, Internet probe unconfigured,
printer unconfigured

Purpose: current hierarchy, shell, field order, density, and operational state.

Review note: this is a real baseline, not an approved renewal design.

Intentional non-authority: this image defines no new routes, product scope,
authentication, permissions, contracts, APIs, persistence, runtime/device
ownership, business logic, raw colors, or unsupported state behavior.

## Generated desktop proposal

Reference file: `design-proposal-01-desktop.png`

Reference status: `APPROVED`

Generated: 2026-08-14 with the built-in ImageGen workflow

Output: 1672 x 941 PNG; represents the requested 1366 x 768 desktop
composition and uses the real baseline as a visual reference, not an edit
target.

Purpose: review the compact primary form hierarchy, direct order-type controls,
dominant create action, and subordinate no-staff, pending, validation, and local
service state studies.

Review boundary: typography, icons, pixel values, generated text rendering, and
state-study messages are directional. Repository copy, tokens, components,
contracts, and behavior remain authoritative.

SHA-256: `20de12f0cf7e1f1f9122f16bc8d5991795c1dcfa45b80848097938cfeeba45c6`

## Generated narrow proposal

Reference file: `design-proposal-02-narrow.png`

Reference status: `APPROVED`

Generated: 2026-08-14 with the built-in ImageGen workflow

Output: 852 x 1846 PNG; matches the requested 390 x 844 aspect and uses the
baseline plus desktop proposal as visual references, not edit targets.

Purpose: review the compact header, scroll-safe single-column form, immediately
visible order types, touch sizing, reachable create action, and a subordinate
local service failure study.

Review boundary: the failure block is a separate state study placed after the
healthy form, not a simultaneous runtime state. It does not authorize new copy,
recovery behavior, or service semantics.

SHA-256: `1a0a336d8604d9caeda1dc93484170648996d6dac1a13fa022f4a6b2b1505f51`

## Shared generated-reference exclusions

Neither proposal authorizes a new route, field, order type, entity, login,
permission, API, contract, schema, persistence path, cloud relationship,
offline queue, printer action, or fixture-backed behavior. Reference approval
must remain separate from Phase 1 authorization.

Approval record: the product owner approved the shared desktop/narrow visual
direction and authorized Phase 1 on 2026-08-14. Generated details remain
subordinate to repository copy, behavior, components, and semantic tokens.

## Phase 5 as-built evidence

Captured on 2026-08-14 from the real local stack at clean production-build
origin `http://localhost:3013/pos`. The healthy captures use the actual
`YuTa Staff` employee attribution, `dine_in` default, local server/database
available status, and truthful unconfigured printer state. They contain no
fixture data and no form submission.

| File                              | State                          | SHA-256                                                            |
| --------------------------------- | ------------------------------ | ------------------------------------------------------------------ |
| `phase-05-as-built-1366x768.png`  | healthy desktop                | `668156c7674287340b6902d924177f4d1843ca9c845b64543e89c6f6ea92210e` |
| `phase-05-as-built-1024x768.png`  | healthy compact desktop        | `2e327934fe1cafdd63036adbc909d04de46246b81005e2e2830403dbf22cebd4` |
| `phase-05-as-built-768x1024.png`  | healthy tablet                 | `a689629194f2054d75bd66012640d7695562b98db5bfd8858003fd2887f4641b` |
| `phase-05-as-built-390x844.png`   | healthy narrow                 | `3f40af8fc23c84348eaad671594d96e7f90b05b49a887e7cd094c63e786d9552` |
| `phase-05-validation-390x844.png` | non-mutating server validation | `ff6a1523f60871f02fd588a78c2aee42bd4517edec269824d5ad6b9e5c7d350d` |

Measured evidence: zero horizontal overflow at all four requested viewports,
48 CSS pixels minimum effective touch target, visible 56-pixel submit action,
and no browser warning/error logs. The validation capture deliberately submits
whitespace for table/reference, so it cannot create an order; it demonstrates
associated error text and preservation of `delivery`, note, and table values.

The viewport evidence was refreshed after the product-owner header correction.
At 1366 and 1024 the `/pos` header is full-width and uses the approved prominent
desktop scale: 90px header, 56px logo, 30px title, and 56px command actions. At
768 and 390 the action menu remains compact, preventing the header from wrapping
while preserving zero overflow and the established mobile hierarchy. Sibling
POS routes retain the default shared-header density.

The no-staff state was not induced because changing eligible local users would
be an unnecessary data mutation. Loader failure/recovery, stale employee, and
unconfirmed service failure were already verified against the real stack in
Phase 3; focused tests protect those paths and the success redirect.
