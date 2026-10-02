# POS management users - UI Specification

Status: Implemented and QA verified

Visibility: Engineering

## Current baseline

The current populated desktop screen has a standalone page header, one primary
create action, and a four-column table with icon-only edit, PIN, and activation
actions. It is functional but predates the approved shared POS Management
header and has no explicit empty-state composition.

## Required hierarchy

1. Approved compact POS Management header and account/session controls.
2. In-content return to `/management`.
3. `Equipe POS` title, concise operational description, and `Ajouter un
utilisateur` primary action.
4. Scannable user collection showing identity, role, active state, and allowed
   actions.
5. Create, edit, PIN-reset, and activation confirmation dialogs.

Desktop may use a table. Narrow layouts must use a readable stacked pattern or
responsive rows without horizontal document overflow. Icon-only actions retain
accessible names and at least touch-appropriate targets. Dialogs must trap
focus, remain scroll-safe, and keep footer actions reachable.

## Truthful states

Cover populated, empty, load unavailable, pending, validation error, duplicate
email conflict, forbidden role, last-active-admin conflict, stale/not-found,
success, and expired-session recovery. Status is never conveyed by color alone.

All operator copy is French. Use Geist Sans, semantic tokens, `@yuta/ui`, and
Lucide icons; no raw colors, decorative dashboard content, or invented data.
