# Préparer un projet de contrat CDI — UI Specification

Status: Phase 5 documentation completed; Phase 4 UI remains current

Visibility: Engineering

## Authority and target

`apps/backoffice`, `/equipe/formalites-personnel`, `NEW_PAGE`, interactive
fictional prototype. Runtime code and product decisions remain authoritative.

## Shared UI context

Reuse the current authenticated Backoffice shell (`REUSE_CURRENT_TARGET`),
`BackofficePage`, French copy, semantic tokens, Geist typography, and shared
cards, alerts, badges, and buttons. Shell, navigation order, account controls,
and unrelated routes are excluded.

## Current baseline

Before Phase 1 the route was a generic planned-page message. Because no
Formalités capability existed, baseline status is `NOT_APPLICABLE` for the new
task surface.

## Visual hierarchy

1. Page title and short readiness purpose.
2. Permanent warning that every business fact is fictional and nothing is read,
   saved, generated, or sent.
3. Fictional employee context, three local step controls, and checkpoint status.
4. One task card for the active source, inputs, or review step.
5. Demo-only readiness and disabled generation button in review.

## Content and copy

French UI uses “Prototype — données entièrement fictives”, “Données qui
viendraient de Salariés”, “Informations propres au projet CDI”, and
“Préparation impossible pour le moment”. It must never say a contract was
generated, validated, compliant, saved, or sent.

## Responsive behavior

One column on narrow screens; two information columns only at desktop width.
Cards, status, and disabled action must not cause horizontal overflow at
390/768/1024/1440 CSS pixels.

## Accessibility

Status is expressed in text, decorative icons are hidden, headings preserve a
logical hierarchy, and the unimplemented primary action is natively disabled.

## Visual acceptance

No image reference. Acceptance is repository-native Backoffice composition,
clear prototype labelling, scan-friendly grouping, semantic tokens, and no
horizontal overflow.

## Out of scope

Document preview, generated artifact, employee dossier linkage, loading/retry
states for data, durable form behavior, and shell changes.

## Phase 2 UI extension

Status: `APPROVED AND IMPLEMENTED OFFLINE`

The current Phase 1 hierarchy and permanent fictional-data warning remain. The
three orientation steps are local step controls with these behaviors:

1. “Données réutilisables” stays read-only and fictional.
2. “Informations à compléter” exposes only the three existing illustrative
   fields. Labels and help text must say they are demo values, not a complete
   legal contract questionnaire.
3. “Vérification” summarizes local values, displays the derived demo readiness,
   and permits a local acknowledgement. “Générer le projet de contrat” remains
   disabled.

Implemented controls:

- `Précédent` and `Continuer` move between local steps.
- `Simuler l’enregistrement` stores an in-memory checkpoint only and announces
  “Mémorisé pour cette démonstration — perdu au rechargement”.
- `Réinitialiser la démonstration` restores the known fictional fixture after a
  local confirmation; it does not represent business deletion or abandonment.
- Editing after a checkpoint shows “Modifications non mémorisées dans cette
  démonstration”.

Validation is limited to demo completeness. Empty illustrative fields receive
inline text and an associated accessible description. The probation choice may
require an explicit fictional yes/no/to-be-decided selection; it is not legal
advice. Focus moves to the first invalid demo field when continuing is blocked.

No loading, server-error, conflict, or persisted-success state may be invented.
The only success notice is the clearly labelled local checkpoint. Existing
390/768/1024/1440 responsive requirements remain unchanged; step controls and
footer actions stack on narrow screens without horizontal overflow.

## Phase 3 UI extension

Status: `APPROVED AND IMPLEMENTED — DEVELOPMENT READ-ONLY`

- Add `Préparer un projet CDI` to the full employee dossier header only when the
  development gate and OWNER permission both pass.
- Keep the list quick view unchanged; it may only link to the full dossier.
- The integrated route identifies the selected employee, labels the surface as
  a read-only connected prototype, and states that nothing is modified or
  saved.
- Show the six trusted Salariés facts in the existing source-facts composition.
- Do not render the three Phase 2 editable demo inputs on the integrated route.
- Show `Informations à compléter` and `Vérification` as unavailable future
  steps, not clickable fake actions.
- Provide `Retour au dossier salarié`; keep generation absent or disabled with
  truthful explanation.
- Reuse the current Backoffice shell and responsive rules. Add no modal, quick
  view action, template preview, file action, legal badge, or readiness success.

Unauthorized, invalid, missing, and cross-tenant targets fail before employee
content is rendered. Production with the gate disabled exposes neither the
dossier action nor the integrated prototype.

## Phase 4 UI extension

Status: `APPROVED AND IMPLEMENTED — DEVELOPMENT LOCAL-ONLY`

- Preserve the Phase 3 connected header, fictional-development warning, return
  link, and six read-only employee facts.
- Activate the existing three-step flow only on the connected development route.
- In “Informations à compléter”, show only the three Phase 2 illustrative
  inputs, initially empty or undecided, with permanent local-only wording.
- Reuse the existing demo completeness messages, in-memory checkpoint, dirty
  indication, review acknowledgement, reset, keyboard behavior, and focus on the
  first missing field.
- Call the checkpoint “mémorisé pour cette démonstration” and explicitly say it
  is lost on reload or navigation. Never label it `brouillon enregistré`.
- Keep “Générer le projet de contrat” disabled even when demo readiness is
  `READY`.
- Add no save/resume, loading/pending/success server states, document preview,
  modal, legal badge, template selector, or leave-page interception.
- Preserve responsive behavior at 1440/1024/768/390 with no horizontal overflow.

## Phase 5 UI impact

Status: `NO RUNTIME UI CHANGE`

Phase 5 defines field and applicability decisions in documentation only. The
Phase 4 page, labels, three illustrative inputs, local state, disabled generation
action, and production gate remain unchanged. A decision-matrix row does not
authorize a field, control, validation message, readiness badge, or template
preview in the UI.
