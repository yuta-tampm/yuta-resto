# YUTA Production Readiness Register

Status: Current

Visibility: Engineering

Owner: YUTA product, engineering, legal/privacy, security, and operations

Last updated: 2026-08-22

## Purpose

This document is the canonical cross-product register for work and evidence
required before enabling a YUTA capability in production. It answers whether a
release scope is ready. `DEPLOYMENT.md` remains the authority for how approved
software is deployed.

Feature documents retain detailed requirements. This register links them and
tracks the release gate; it does not copy their full specifications.

## Security and document-storage rule

This public repository stores only task descriptions, status, accountable role,
approval date, and an opaque evidence reference. Never commit or link directly
to:

- incorporation certificates, identity documents, bank or insurance records;
- signed legal opinions, contracts, DPAs, invoices, or vendor account details;
- employee, customer, health, financial, or other personal data;
- passwords, API keys, tokens, private project identifiers, or recovery codes;
- internal vulnerability reports, incident evidence, or production credentials.

The actual evidence must live in a separately controlled private company vault.
Use an opaque reference such as `PRIVATE-LEGAL-001`; do not record a private URL,
folder path, account identifier, or secret in Git.

## Readiness rule

A production capability is `NOT_READY` while any row that blocks its scope is
not `APPROVED` or `NOT_APPLICABLE`. Approval requires a named accountable owner,
the applicable independent reviewer, a review date, and an evidence reference.
A checkmark or completed implementation alone is not legal, privacy, security,
or operational approval.

A blocked optional capability does not automatically block unrelated releases.
For example, `PERSONNEL` or `AI_PERSONNEL` may remain fail-closed while an
independently approved public capability is released.

## Status vocabulary

| Status             | Meaning                                                                    |
| ------------------ | -------------------------------------------------------------------------- |
| `NOT_STARTED`      | Work or evidence has not begun.                                            |
| `IN_PROGRESS`      | An owner is actively preparing the requirement.                            |
| `BLOCKED`          | Progress requires an external decision, provider, document, or authority.  |
| `READY_FOR_REVIEW` | Evidence is assembled but the required reviewer has not approved it.       |
| `APPROVED`         | Required owner and reviewer accepted dated evidence for the stated scope.  |
| `NOT_APPLICABLE`   | A dated decision explains why the gate does not apply to the stated scope. |

## Scope vocabulary

| Scope             | Capability blocked when incomplete                            |
| ----------------- | ------------------------------------------------------------- |
| `GLOBAL_CLOUD`    | Any customer-facing YUTA cloud production launch.             |
| `BACKOFFICE`      | Authenticated restaurant Backoffice production use.           |
| `PUBLIC_BOOKING`  | Public booking production traffic.                            |
| `PUBLIC_FEEDBACK` | Public direct-feedback production traffic.                    |
| `PERSONNEL`       | Real employee dossiers, documents, registers, and Formalités. |
| `AI_PERSONNEL`    | External AI/OCR processing of real personnel data or files.   |
| `LOCAL_POS`       | A restaurant-local POS/site-agent production release.         |

## Evidence record format

Every row promoted to `READY_FOR_REVIEW`, `APPROVED`, or `NOT_APPLICABLE` must
record the following in its notes or a linked current document:

```text
Accountable role:
Reviewer role:
Review date: YYYY-MM-DD
Evidence reference: PRIVATE-<AREA>-<NUMBER> | REPOSITORY:<path>
Scope and expiry/review date:
Decision notes:
```

## Master gate register

### Company and commercial foundation

| ID        | Requirement                                                                                                              | Blocking scope | Accountable/reviewer               | Status        | Required evidence or decision                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------ | -------------- | ---------------------------------- | ------------- | ---------------------------------------------------------- |
| `CORP-01` | Create the operating legal entity and confirm the legal name, form, registration number, and registered address.         | `GLOBAL_CLOUD` | Founder / legal-accounting adviser | `NOT_STARTED` | Private incorporation and registration evidence.           |
| `CORP-02` | Confirm VAT position and invoicing identity.                                                                             | `GLOBAL_CLOUD` | Founder / accountant               | `NOT_STARTED` | Private tax/VAT decision and identifiers when applicable.  |
| `CORP-03` | Put required professional/cyber insurance in place or record a reviewed non-applicability decision.                      | `GLOBAL_CLOUD` | Founder / insurance adviser        | `NOT_STARTED` | Private policy or dated adviser decision.                  |
| `CORP-04` | Approve customer contract, pricing/order, billing, support, and termination responsibilities for enabled cloud services. | `GLOBAL_CLOUD` | Product / legal adviser            | `NOT_STARTED` | Approved private contract pack and public copy references. |

### Public legal and privacy material

| ID         | Requirement                                                                                                                       | Blocking scope              | Accountable/reviewer                                      | Status        | Required evidence or decision                               |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | --------------------------------------------------------- | ------------- | ----------------------------------------------------------- |
| `LEGAL-01` | Approve legal notice, terms of service, privacy notice, and controller/contact identity for each public or authenticated product. | `GLOBAL_CLOUD`              | Product / legal and privacy reviewer                      | `NOT_STARTED` | Approved dated copy and deployment locations.               |
| `PRIV-01`  | Maintain a processing inventory with purpose, data subjects, data classes, recipients, legal basis, and international transfers.  | `GLOBAL_CLOUD`              | Privacy owner / DPO or legal reviewer                     | `NOT_STARTED` | Private processing register and reviewed summary.           |
| `PRIV-02`  | Decide whether a DPO is required or voluntarily appointed and record the contact/escalation route.                                | `GLOBAL_CLOUD`              | Founder / privacy adviser                                 | `NOT_STARTED` | Dated private decision; appointment evidence if applicable. |
| `PRIV-03`  | Define access, correction, deletion, restriction, portability, objection, and identity-verification procedures.                   | `GLOBAL_CLOUD`              | Privacy owner / DPO or legal reviewer                     | `NOT_STARTED` | Approved rights-request procedure and response owner.       |
| `PRIV-04`  | Define a per-data-class retention, archive, legal-hold, deletion, backup, and replica-propagation schedule.                       | `GLOBAL_CLOUD`              | Privacy owner / legal, security, and operations reviewers | `BLOCKED`     | Approved retention matrix plus deletion-test evidence.      |
| `PRIV-05`  | Complete and approve DPIA/AIPD decisions for high-risk processing before enabling that processing.                                | `PERSONNEL`, `AI_PERSONNEL` | Privacy owner / DPO or legal reviewer                     | `BLOCKED`     | Private DPIA/AIPD decision and mitigation acceptance.       |

### Security and operational foundation

| ID       | Requirement                                                                                                           | Blocking scope            | Accountable/reviewer                             | Status        | Required evidence or decision                                          |
| -------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------ | ------------- | ---------------------------------------------------------------------- |
| `SEC-01` | Approve production identity, least-privilege access, MFA, joiner/mover/leaver, and periodic access-review procedures. | `GLOBAL_CLOUD`            | Security owner / operations reviewer             | `NOT_STARTED` | Access matrix and completed review evidence.                           |
| `SEC-02` | Approve secret creation, storage, rotation, revocation, emergency access, and leak-response procedures.               | `GLOBAL_CLOUD`            | Security owner / operations reviewer             | `NOT_STARTED` | Secret inventory without secret values; rotation test.                 |
| `SEC-03` | Complete threat review and proportionate vulnerability/security testing for each exposed capability.                  | `GLOBAL_CLOUD`            | Security owner / independent reviewer            | `NOT_STARTED` | Private report reference, remediation evidence, risk acceptance.       |
| `SEC-04` | Approve incident detection, severity, containment, notification, evidence handling, and responsible contacts.         | `GLOBAL_CLOUD`            | Security and operations / legal-privacy reviewer | `NOT_STARTED` | Incident plan and exercise evidence.                                   |
| `OPS-01` | Assign production release, on-call, provider, database, storage, security, and privacy incident owners.               | `GLOBAL_CLOUD`            | Operations / product owner                       | `NOT_STARTED` | Current ownership matrix and escalation contacts in the private vault. |
| `OPS-02` | Configure privacy-safe logs, metrics, health probes, alert thresholds, dashboards, and retention.                     | `GLOBAL_CLOUD`            | Operations / security-privacy reviewers          | `NOT_STARTED` | Monitoring inventory and alert exercise evidence.                      |
| `OPS-03` | Prove backup, point-in-time recovery where applicable, restore, disaster recovery, and recovery-time expectations.    | `GLOBAL_CLOUD`            | Operations / product owner                       | `BLOCKED`     | Dated backup and restore exercise evidence.                            |
| `OPS-04` | Run the documented release, rollback, migration, smoke-test, and post-release review process.                         | capability being released | Release owner / product owner                    | `NOT_STARTED` | Release record linked to `DEPLOYMENT.md`.                              |

### Data infrastructure and vendors

| ID        | Requirement                                                                                                                       | Blocking scope              | Accountable/reviewer                                      | Status        | Required evidence or decision                                |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | --------------------------------------------------------- | ------------- | ------------------------------------------------------------ |
| `DATA-01` | Approve Neon production region, access, encryption, backups/PITR, restore, retention, subprocessor, and DPA evidence.             | `GLOBAL_CLOUD`              | Engineering / security, privacy, and operations reviewers | `BLOCKED`     | Vendor evidence, DPA reference, restore test, access review. |
| `VEND-01` | Maintain a vendor/subprocessor register with purpose, data, region, DPA, retention, access, incident terms, owner, and exit plan. | `GLOBAL_CLOUD`              | Operations / legal-privacy reviewer                       | `NOT_STARTED` | Private vendor register and current contract references.     |
| `VEND-02` | Define provider offboarding, export, deletion confirmation, credential revocation, and continuity procedures.                     | capability using the vendor | Operations / security-product reviewers                   | `NOT_STARTED` | Tested exit plan and deletion evidence requirements.         |

### Personnel, documents, and Formalités

| ID                | Requirement                                                                                                                                             | Blocking scope | Accountable/reviewer                                           | Status    | Required evidence or decision                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | -------------------------------------------------------------- | --------- | ----------------------------------------------------------------------- |
| `HR-LEGAL-01`     | Approve purposes, legal bases, employee notice, recipients, rights process, and access roles for personnel data.                                        | `PERSONNEL`    | Product / legal, DPO, and privacy reviewers                    | `BLOCKED` | Approved personnel privacy pack and access decision.                    |
| `HR-TEMPLATE-01`  | Obtain and version legally reviewed CDI/CDD templates, clauses, annexes, applicability rules, and effective dates.                                      | `PERSONNEL`    | Product / French employment-law reviewer                       | `BLOCKED` | Private approved template set and version register.                     |
| `HR-FORMALITY-01` | Obtain qualified employment-law approval for the F5-07/F5-08 Formalités workflow, OWNER confirmations, and non-legal-advice boundary.                   | `PERSONNEL`    | Product / employment-law reviewer                              | `BLOCKED` | F5-07/F5-08 product decisions plus external legal approval evidence.    |
| `HR-RET-01`       | Approve retention/deletion/legal-hold rules for dossiers, drafts, generated versions, signed documents, audit events, and backups.                      | `PERSONNEL`    | Privacy owner / legal, DPO, security, and operations reviewers | `BLOCKED` | Per-class retention matrix and deletion/restore behavior.               |
| `HR-STORE-01`     | Select and approve private EU file storage outside Neon, including encryption, tenant isolation, access logs, backup/restore, and deletion propagation. | `PERSONNEL`    | Engineering / security, privacy, and operations reviewers      | `BLOCKED` | Architecture decision, provider evidence, isolation and restore tests.  |
| `HR-SCAN-01`      | Select and approve production malware scanning and quarantine/recovery operations.                                                                      | `PERSONNEL`    | Security / operations and privacy reviewers                    | `BLOCKED` | Provider/architecture decision and malicious/failed-scan test evidence. |
| `HR-SIGN-01`      | Decide the e-signature provider and legal/identity/evidence boundary; keep signed artifacts owned by Documents.                                         | `PERSONNEL`    | Product / legal, security, and operations reviewers            | `BLOCKED` | Provider/DPA decision, signing evidence model, recovery and exit plan.  |
| `HR-AUDIT-01`     | Approve personnel audit event visibility, minimization, retention, reviewer access, and incident use.                                                   | `PERSONNEL`    | Security and privacy / legal-DPO reviewer                      | `BLOCKED` | Audit taxonomy, access matrix, retention and review procedure.          |
| `HR-REGISTER-01`  | Approve register-specific legal fields, categories, ordering/history, inspection presentation, and retention operations.                                | `PERSONNEL`    | Product / French employment-law and DPO reviewers              | `BLOCKED` | Reviewed register dictionary and operating procedure.                   |

Detailed current evidence and unresolved decisions remain in:

- `docs/ui/pages/backoffice-equipe-salaries/README.md`;
- `docs/ui/pages/backoffice-equipe-registre-personnel/README.md`;
- `docs/ui/pages/backoffice-equipe-formalites-personnel/README.md`.

### External AI/OCR for personnel

| ID      | Requirement                                                                                                                                            | Blocking scope | Accountable/reviewer                                 | Status    | Required evidence or decision                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | ---------------------------------------------------- | --------- | --------------------------------------------------------------------- |
| `AI-01` | Approve the provider organization/project and verify EU processing/residency for the exact endpoint, model, and file-input mode.                       | `AI_PERSONNEL` | Engineering / privacy, legal, and security reviewers | `BLOCKED` | Dated provider evidence and approved account/project configuration.   |
| `AI-02` | Approve DPA, subprocessors, training use, abuse-monitoring exceptions, retention control, deletion, and incident terms.                                | `AI_PERSONNEL` | Privacy owner / legal-DPO reviewer                   | `BLOCKED` | Private DPA and retention decision for the exact API use.             |
| `AI-03` | Approve data minimization, synthetic-to-real evaluation gate, human confirmation, accuracy thresholds, failure behavior, and prohibited automation.    | `AI_PERSONNEL` | Product / privacy, legal, and security reviewers     | `BLOCKED` | Evaluation report and signed use-case controls.                       |
| `AI-04` | Configure server-only credentials, project separation, model snapshots, rate/cost limits, monitoring, key rotation, and provider fail-closed behavior. | `AI_PERSONNEL` | Engineering / security and operations reviewers      | `BLOCKED` | Configuration review without secrets plus failure/cost test evidence. |

The provider-specific question and evidence pack remains
`docs/operations/OPENAI_PROVIDER_ELIGIBILITY.md`. Synthetic evaluation and a
personal test project are not production evidence.

### Public and local capability registers

| ID              | Requirement                                                                                                                  | Blocking scope                  | Accountable/reviewer                              | Status        | Required evidence or decision                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------- |
| `BOOK-01`       | Close every blocking item in the public-booking acceptance register.                                                         | `PUBLIC_BOOKING`                | Booking product and operations / release owner    | `BLOCKED`     | `docs/features/public-booking/STATUS.md`.                                                                     |
| `REPUTATION-01` | Close provider, privacy, security, operations, and release blockers for enabled reputation/public-feedback capabilities.     | `PUBLIC_FEEDBACK`, `BACKOFFICE` | Reputation product and operations / release owner | `BLOCKED`     | `docs/features/reputation/STATUS.md`.                                                                         |
| `POS-01`        | Complete the release-specific Luna/local-site preflight, migration, backup, health, timezone, device, and rollback evidence. | `LOCAL_POS`                     | Local operations / release owner                  | `NOT_STARTED` | Release record under the procedures in `DEPLOYMENT.md`; never reuse cloud gates as POS persistence authority. |

## Current readiness summary

| Scope             | Current result   | Reason                                                                                                      |
| ----------------- | ---------------- | ----------------------------------------------------------------------------------------------------------- |
| `GLOBAL_CLOUD`    | `NOT_READY`      | Company, legal/privacy, security, vendor, monitoring, and recovery gates are open.                          |
| `BACKOFFICE`      | `NOT_READY`      | Global cloud gates and capability-specific release evidence are incomplete.                                 |
| `PUBLIC_BOOKING`  | `NOT_READY`      | `BOOK-01` and global cloud gates remain blocked.                                                            |
| `PUBLIC_FEEDBACK` | `NOT_READY`      | `REPUTATION-01` and global cloud gates remain blocked.                                                      |
| `PERSONNEL`       | `NOT_READY`      | Legal/DPO/privacy, templates, retention, EU storage/scanning, audit, signature, and operations are blocked. |
| `AI_PERSONNEL`    | `NOT_READY`      | Real personnel data is prohibited until all personnel and provider gates are approved.                      |
| `LOCAL_POS`       | release-specific | Local releases use their own persisted state, migration journal, backup, device, and host evidence.         |

## Update procedure

1. Add or update a stable gate ID here; do not create a second global checklist.
2. Keep detailed feature requirements in their owning current document and link
   the gate ID from that document.
3. Record only opaque private-evidence references in Git.
4. Require the stated reviewer before changing a blocking row to `APPROVED` or
   `NOT_APPLICABLE`.
5. Recalculate only the affected scope summary; do not treat one capability's
   approval as approval for another.
6. Before production deployment, the release owner records the reviewed gate
   snapshot and follows `docs/operations/DEPLOYMENT.md`.

## Related authorities

- `docs/operations/DEPLOYMENT.md`
- `docs/operations/OPENAI_PROVIDER_ELIGIBILITY.md`
- `docs/architecture/DATABASE_BOUNDARIES.md`
- `docs/architecture/TENANCY.md`
- `docs/architecture/AUTHENTICATION.md`
- `docs/features/public-booking/STATUS.md`
- `docs/features/reputation/STATUS.md`
- `docs/DOCUMENTATION_POLICY.md`
