# Préparer un projet de contrat CDI — Design Handoff

Status: Phase 5 documentation completed; Phase 4 handoff remains current

Visibility: Engineering

## Phase 0 source

The complete inventory is summarized in `README.md`. Target: cloud Backoffice
page `/equipe/formalites-personnel`; `NEW_PAGE`; visual-only Phase 1 followed by
interactive offline Phase 2; goal is a fictional CDI-readiness explanation and
local walkthrough with no real data or generated artifact.

## Shared UI context resolution

Shared context status: `RESOLVED`

| Layer        | Owner/source                                          | Reference status | Reuse exactly                             | May adapt               | Excluded                 | Decision/blocker |
| ------------ | ----------------------------------------------------- | ---------------- | ----------------------------------------- | ----------------------- | ------------------------ | ---------------- |
| YUTA global  | `YUTA_FRONTEND_RULES.md`, `@yuta/ui`                  | APPROVED         | tokens, typography, accessible primitives | route composition       | new framework/raw colors | none             |
| Application  | `BACKOFFICE_FRONTEND_RULES.md`, current shell         | APPROVED         | auth shell, account, navigation           | responsive content flow | shell redesign           | none             |
| Section/flow | current Équipe navigation and personnel authorization | APPROVED         | OWNER visibility                          | route-local wording     | new permission           | none             |
| Page/screen  | F5-02–F5-06 approval, this pack                       | APPROVED         | fictional boundary                        | card hierarchy          | real data/actions        | none             |

Shell mode: `REUSE_CURRENT_TARGET`.

The shell, sidebar/mobile navigation, account/session area, and existing real
routes remain unchanged. Only the Formalités navigation item adopts the same
server-derived personnel visibility gate as Salariés.

## Current baseline capture

Baseline status: `NOT_APPLICABLE`

The route previously contained only a generic planned-page notice, not a
Formalités task screen. This is a `NEW_PAGE` discovery prototype.

## Design-generation prompt

Design prompt status: `READY`

### Ready-to-use prompt

Design a repository-native, authenticated YUTA Backoffice page for
`/equipe/formalites-personnel` at 1440/1024/768/390 widths. Reuse the existing
shell exactly. The page is an OWNER-only, read-only prototype using entirely
fictional data for “Préparer un projet de contrat CDI”. Show a permanent warning
that it does not read an open employee dossier, save data, generate a document,
or contact an external service. Present a fictional employee, a simple
three-step orientation, one group of reusable Salariés facts, one group of
missing Formalités facts, and a blocked readiness summary with disabled
generation. Use French copy, YUTA semantic tokens, Geist, `@yuta/ui`, clear
headings, textual status, and no horizontal overflow. Do not invent forms,
modals, templates, legal claims, providers, document preview, signature,
download, save, audit, APIs, schema, or production behavior. Return hierarchy
and responsive design guidance, not implementation code.

## Handoff result

The product owner explicitly approved the no-image Phase 1 and the bounded
interactive offline Phase 2 on 2026-08-22. Repository patterns are the visual
reference. F5-07 and F5-08 product decisions are documented; their integrated
implementation and every external production gate remain pending.

## Phase 4 handoff

No new image or shell design was required. Phase 4 composes the already
implemented Phase 3 connected employee header/source facts with the already
implemented Phase 2 local input and review patterns. The implementation must
visually distinguish read-only Salariés facts from unsaved demonstration inputs
and repeat that all edits disappear on reload or navigation. It must not add a
persisted-success visual state, document preview, legal-validity signal, or
enabled generation action.

## Phase 5 handoff impact

No design handoff or reference image was produced. Phase 5 records internal
candidate product/legal data decisions only. Any later UI design must be derived
from an externally reviewed and product-approved matrix and return through a
separate design/implementation approval gate.
