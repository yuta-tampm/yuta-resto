# Pointage employee — UI Spec

Status: DRAFT — AWAITING_HUMAN_REVIEW

Visibility: Engineering

## Layout and shared components

NO_APPLICATION_SHELL. One centered, responsive content column within the
existing root document; no app navigation or account header. Page heading:
“Pointage”. Neutral entry card or active interaction content replaces the same
region; previous personal content must be removed, not retained offscreen.

Use shared Card, FormField/Input, Button, Alert, Skeleton and StatusBadge only
as needed. Geist Sans with existing Inter fallback, semantic tokens, Lucide
when meaningful. No raw colors, extra library, decorative illustration,
custom shared primitive or global stylesheet change.

Proposed dimensions: full width on narrow viewports with 16px minimum gutters,
maximum 480px content width; at least 48px touch controls. Existing spacing and
typography tokens implement these visual targets after approval. Do not crop
long synthetic names: wrap without horizontal scroll. One primary action at
a time. Keyboard order follows heading, field/state, action, end.

## Behavioral state presentation

| State             | Visible content / French draft copy                                                              | Actions                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| CREDENTIAL_ENTRY  | “Saisissez votre code de pointage”; masked eight-digit input labelled “Code de pointage”         | “S’identifier”; disabled while input shape invalid                                      |
| IDENTIFY_PENDING  | “Identification en cours…”; neutral loading state, no prior employee                             | Disable duplicate identify; clear PIN when request settles                              |
| NOT_CLOCKED_IN    | Own display name, “Non pointé”; no previous clock-out                                            | “Enregistrer mon arrivée”, “Terminer”                                                   |
| CLOCKED_IN        | Own display name, “Pointé”; “Arrivée enregistrée le … à …” with opening date/time/offset context | “Enregistrer mon départ”, “Terminer”                                                    |
| MUTATION_PENDING  | “Enregistrement en cours…”; no optimistic success/state transition                               | Disable duplicate action; “Terminer” remains available                                  |
| CLOCK_IN success  | “Arrivée enregistrée” and server receipt date/time                                               | “Terminer”; auto-end after 10 seconds or earlier expiry                                 |
| CLOCK_OUT success | “Départ enregistré” and server receipt date/time                                                 | “Terminer”; auto-end after 10 seconds or earlier expiry                                 |
| STATE_CONFLICT    | “La situation a changé. Actualisez avant de réessayer.”                                          | Refresh own state; require explicit new intent, never auto-rebase                       |
| REQUEST_CONFLICT  | “Cette demande ne peut pas être réutilisée.”                                                     | Refresh state and explicit fresh action; never overwrite old request intent             |
| RESULT_UNKNOWN    | “Résultat non confirmé. Vérifiez cette même demande.”                                            | “Vérifier le résultat”; retry only the exact pending identity/intent                    |
| ACCESS_FAILURE    | “Accès au pointage impossible. Veuillez vous identifier à nouveau.”                              | Clear interaction, fresh entry; no former/upcoming/credential-match disclosure          |
| RATE_LIMIT        | “Trop de tentatives. Réessayez plus tard.”                                                       | No auto-retry; no candidate/dossier/count disclosure                                    |
| CLOUD_UNAVAILABLE | “Pointage indisponible. Aucun résultat ne peut être confirmé.”                                   | Retry neutral identify/state safely; pending mutation uses RESULT_UNKNOWN recovery only |
| ENDING / NEUTRAL  | Personal content removed immediately; “Interaction terminée sur cet appareil” if useful          | Fresh entry; never claim remote end confirmation without acknowledgement                |

If the server reports explicit pre-commit rejection, show its bounded failure.
If a mutation response is lost, cloud unavailability must not assert no event
exists. Once end/expiry/navigation clears the pending tuple, no historical
receipt recovery screen is restored; fresh identification shows current state
only. This is not proof the previous mutation failed.

## Interaction clearing and time

Absolute 120 seconds / idle 60 seconds enforced by server; no background
heartbeat. User foreground authorized operations may update idle remaining
time, never absolute expiry. Receipt stays at most 10 seconds. No duration,
daily total or “time worked today” counter is displayed.

Terminer, idle/absolute expiry, pagehide, hidden state, navigation, refresh,
back/forward or browser restart returns to neutral. Clear PIN, name, state,
receipt, token, guard, pending tuple and DOM; reject late responses. No
employee-specific cache, browser store, URL/history state or tab handoff.
See DATA_AND_INTERACTION_SPEC for server-confirmed end versus local clearing.

## Accessibility and responsive review

Visible labels, password input with numeric inputMode and length validation;
no auto-submit before explicit identification. Do not rely on autocomplete
attributes as a security guarantee. No reveal/stored-PIN feature.
Enter submits once; primary action has a descriptive accessible name.
Visible focus, keyboard escape route through Terminer and appropriate live
announcements for pending/conflict/receipt without reading the secret.
Errors are text-associated, not color-only; focus returns to neutral entry
after clearing. Loading placeholders contain no personal residue.

Future Browser QA: 1440x900 desktop, 1024x768 tablet landscape, 768x1024 tablet
portrait, 390x844 narrow viewport; keyboard and touch, long names, zoom/reflow,
contrast and accessible status announcements. These are planned checks, not
completed evidence.

## Excluded visible features

No manager controls/history, attendance list, totals, prior departure,
corrections, schedule, employee chooser/search, cloud account/login,
establishment switcher, production notice claims or offline mode.
No extra Product behavior may be introduced by visual polishing.
