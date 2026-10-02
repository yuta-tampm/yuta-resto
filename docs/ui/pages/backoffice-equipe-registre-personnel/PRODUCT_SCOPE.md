# Backoffice Équipe — Registre du personnel — Product Scope

Status: Phase 2 interaction and data proposal ready for review

Visibility: Engineering

## User goal and MVP

The first user is the OWNER of the active establishment. The proposed MVP is a
read-only, establishment-wide register in stable hiring/arrival order, a
truthful readiness summary for missing required information, a distinct future
stagiaire/service-civique part, and protected server-mediated PDF export from
the same structured snapshot.

The page is proposed at `/equipe/registre-personnel`, entered by a secondary
action from Salariés. It is not a drawer tab or sidebar module.

## Repository and legal boundary

Current employee dossiers provide names, position, qualification, entry/exit,
CDD status, and part-time status only. Missing domains include nationality,
birth date, sex, conditional authorization/work-title facts, temporary-work and
employer-group facts, apprenticeship/professionalization, stagiaires, service
civique, immutable arrival order/history, retention, and PDF.

Official Phase 0 sources are current
[L1221-13 to L1221-15-1](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000006195588/2026-05-18),
[D1221-23 to D1221-27](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000018482871/2026-06-26),
[D8113-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018520854),
and [CNIL personnel guidance](https://www.cnil.fr/fr/les-regles-pour-la-gestion-du-personnel).
They inform discovery; YUTA makes no compliance claim.

The sources were reviewed again on 2026-08-18 for Phase 2. Article D1221-23
defines the employee mentions; D1221-23-1 defines separate stagiaire mentions;
D1221-25 requires later events to be recorded when they occur; R1221-26 defines
five-year retention after departure for employees and stagiaires; and D8113-2
requires a substitute medium to remain understandable and resistant to
alteration. Legal/DPO approval remains a later gate.

## Ownership, authorization, and sensitive data

Every future operation repeats trusted organization + establishment scope.
Distinct `personnel.register.read` and `personnel.register.export` permissions
are proposed, initially OWNER-only. CSE/inspection presentation does not create
a public link or external account in the MVP.

The multi-person register and PDF are confidential. Names, birth dates,
nationality, sex, work-title details, missing values, and PDF content must not
enter URLs, analytics, browser storage, generic logs, or audit metadata. Later
reads/exports require one minimized event containing actor, trusted scope,
action, and time only.

## Approved Phase 0 decisions

WE0-01 through WE0-10 are approved for design exploration: dedicated route,
one establishment, stable order, separate person categories, structured source
with protected PDF representation, truthful missing-data state, OWNER-only
first access, reconstructable non-destructive history, five-year retention
review, minimized audit, no public link/external portal, and Wave F separation.

## Approved Phase 1 prototype

The approved visual direction may be implemented locally at the proposed route
with typed fictional records. The prototype reuses the existing OWNER-only
personnel-read guard, keeps `Salariés` as the navigation owner, exposes a
secondary entry from Salariés, and keeps PDF export disabled. It must not read
or mutate employee operational data.

## Phase 2 proposed boundary

The recommended first later real-data slice covers `employee` entries only.
`intern` and `service_civic_volunteer` remain separate, truthful unavailable
categories until their own exact fields, arrival/departure rules, retention,
authorization, and tests are approved. This avoids forcing three legally
different populations into one employee shape.

The register is proposed as an establishment-owned ordered and reconstructable
record, not a live projection of the mutable employee table. Approved Salariés
facts may seed a reviewed inscription, but later corrections are append-only
and never delete or reorder the original entry. PDF is generated only from one
complete authorized snapshot and is never the source of truth.

## Phase 3 approved local boundary

The employee-only register schema, migration, contracts, repository, distinct
OWNER permissions, minimized audit, reviewed inscription, reasoned correction,
and transient PDF generator are authorized and implemented only for local
development. They are not production-approved and make no compliance claim.

Still deferred: destructive correction, import/bulk export,
organization-wide view, public/share/email, CSE/inspection portal, annexes,
certification/signature, DPAE/DSN, Formalités, payroll, Planning, Pointage,
intern/service-civic models, automated retention/legal hold/purge, OCR,
extraction, ChatGPT/AI suggestions, and autofill. AI remains Wave F.

## Relationships

Salariés owns employee dossier facts and the proposed entry point. Documents
owns signed evidence only. Register owns ordered legal presentation/history.
Formalités and providers remain separate future capabilities.
