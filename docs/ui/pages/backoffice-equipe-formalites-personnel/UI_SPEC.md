# Préparer un projet de contrat CDI — UI Specification

Status: Persistent draft foundation UI implemented — development local-only;
production deferred

Visibility: Engineering

## Authority and target

`apps/backoffice`, generic `/equipe/formalites-personnel` fictional prototype,
and development-gated connected route
`/equipe/formalites-personnel/[employeeId]`. Runtime code and approved Product
decisions remain authoritative.

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

1. Page title and explicit connected employee context.
2. Current persistent state or recoverable feedback.
3. One task surface for create, editable draft, reconciliation, ineligible
   recovery, or abandoned read-only.
4. Clearly separated draft and current Personnel values where they differ.
5. Explicit save/reconcile/abandon actions; no generation control.

## Content and copy

The connected French UI uses “Dossier salarié connecté”, “Brouillon en cours”,
“Valeur du brouillon”, “Valeur actuelle du dossier salarié”, and explicit
success/recovery wording. It may say the preparation draft was saved, but must
never say a legal contract was generated, validated, compliant, signed, or sent.

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

Document preview, generated artifact, address, remuneration, legal advice,
probation duration/renewal, MANAGER/STAFF access, Personnel write-back,
automatic retention cleanup, production enablement, and shell changes.

## Persistent draft foundation UI

Status: `IMPLEMENTED — DEVELOPMENT LOCAL-ONLY`

- Eligible CDI with no active draft shows the seven current Personnel facts and
  an explicit “Créer le brouillon” action; nothing is auto-created.
- Editable `DRAFT` shows the three probation choices and explicit Save/Abandon.
  Successful save refreshes the authoritative model.
- Reconciliation renders only server-derived divergent facts. Each shows draft
  and current Personnel values plus KEEP/REFRESH controls. Missing choices focus
  the first unresolved fact.
- Ineligible recovery is read-only except for abandon. An abandoned record is
  read-only and shows its reason; a separate new draft can be created only when
  current CDI eligibility is restored.
- Validation, stale draft, stale source, replay conflict, and server failure are
  visible and recoverable without losing relevant local input. Pending state
  blocks accidental double submission.
- Dirty navigation requires confirmation. Dialogs retain accessible names,
  labels, focus behavior, and required reason feedback.
- At 1024 and below, the probation choices remain stacked to avoid cramped
  labels; content remains free of horizontal overflow at 1440/1024/768/390.
- No raw identifiers, operation evidence, address, remuneration, legal
  recommendation, document-generation, or provider UI is rendered.

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

## F08 Phase 0 UI disposition

No UI changes are authorized. The current Phase 4 connected prototype remains
the truthful baseline. Its checkpoint and readiness language must stay
demonstration-only, and generation remains disabled.

Do not add the external flow's generic document selection, missing-information
questionnaire, preview, generated-success, PDF/download, signature, delivery,
or saved/link state. Those controls require separately approved product meaning,
data, template/version, lifecycle, permissions, audit, and failure behavior.
