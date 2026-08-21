# Préparer un projet de contrat CDI — UI Specification

Status: Approved and implemented Phase 1 reference

Visibility: Engineering

## Authority and target

`apps/backoffice`, `/equipe/formalites-personnel`, `NEW_PAGE`, visual-only
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
3. Fictional employee context and three non-interactive steps.
4. Two balanced cards: reusable Salariés facts and missing Formalités facts.
5. Readiness warning and disabled generation button.

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

Interactive form controls, modals, document preview, generated artifact,
employee dossier linkage, loading/retry states for data, and shell changes.
