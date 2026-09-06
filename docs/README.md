# YUTA Documentation Index

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-09-03

## Finding the right authority

YUTA does not use one universal source order for every question. Start with
[`AUTHORITY_MODEL.md`](AUTHORITY_MODEL.md) to classify the question and select
the appropriate authority.

- Use [`PRODUCT_KNOWLEDGE.md`](PRODUCT_KNOWLEDGE.md) to locate current product
  and module knowledge.
- Use [`MODULE_REGISTRY.md`](MODULE_REGISTRY.md) to locate bounded capabilities,
  ownership, lifecycle evidence, and review markers.
- Use [`LIFECYCLE_STATUS_MODEL.md`](LIFECYCLE_STATUS_MODEL.md) to interpret
  lifecycle values without promoting one dimension from another.
- Treat `CURRENT_STATE.md` as a broad summary and routing source, not the
  highest authority for every question.
- Keep accepted decisions authoritative for their durable boundaries and use
  the specific verification source required by the Authority Model.

Completed plans, audits, migration checkpoints, implementation reports, and
task history are not current product or architecture authority.

## Documentation visibility

- `Visibility: Public product` describes capabilities approved for public,
  pricing, commercial, partner, and customer-facing communication.
- `Visibility: Engineering` may describe every maintained runtime, including
  POS, Site Agent, Display, devices, printing, offline behavior, and local data.
- `Visibility: Local operator` is intended for restaurant operation.

Visibility labels define communication scope, not confidentiality. Secrets and
sensitive details never belong in the repository.

## Current documents

### Project state

- [`AUTHORITY_MODEL.md`](AUTHORITY_MODEL.md)
- [`LIFECYCLE_STATUS_MODEL.md`](LIFECYCLE_STATUS_MODEL.md)
- [`PRODUCT_KNOWLEDGE.md`](PRODUCT_KNOWLEDGE.md)
- [`MODULE_REGISTRY.md`](MODULE_REGISTRY.md)
- [`CURRENT_STATE.md`](CURRENT_STATE.md)
- [`REPOSITORY_MAP.md`](REPOSITORY_MAP.md)

### Architecture

- [`architecture/OVERVIEW.md`](architecture/OVERVIEW.md)
- [`architecture/DATABASE_BOUNDARIES.md`](architecture/DATABASE_BOUNDARIES.md)
- [`architecture/TENANCY.md`](architecture/TENANCY.md)
- [`architecture/AUTHENTICATION.md`](architecture/AUTHENTICATION.md)
- [`architecture/IDENTITY_AND_MEMBERSHIP.md`](architecture/IDENTITY_AND_MEMBERSHIP.md)
- [`architecture/DATA_MODEL.md`](architecture/DATA_MODEL.md)

### Cloud features

- [`features/identity-access/README.md`](features/identity-access/README.md)
- [`features/establishment/README.md`](features/establishment/README.md)
- [`features/establishment/general-information/README.md`](features/establishment/general-information/README.md)
- [`features/personnel/README.md`](features/personnel/README.md)
- [`features/today/README.md`](features/today/README.md)
- [`features/public-website/README.md`](features/public-website/README.md)
- [`features/public-booking/README.md`](features/public-booking/README.md)
- [`features/public-booking/PRODUCT_SPEC.md`](features/public-booking/PRODUCT_SPEC.md)
- [`features/public-booking/STATUS.md`](features/public-booking/STATUS.md)
- [`features/reputation/README.md`](features/reputation/README.md)
- [`features/reputation/STATUS.md`](features/reputation/STATUS.md)

### Local products

- [`products/display/README.md`](products/display/README.md)
- [`products/pos/README.md`](products/pos/README.md)
- [`products/pos/site-agent/README.md`](products/pos/site-agent/README.md)
- [`products/pos/USER_GUIDE.md`](products/pos/USER_GUIDE.md)
- [`products/pos/OFFLINE_STRATEGY.md`](products/pos/OFFLINE_STRATEGY.md)
- [`products/pos/QA_CHECKLIST.md`](products/pos/QA_CHECKLIST.md)
- [`products/pos/PRODUCT_SPEC.md`](products/pos/PRODUCT_SPEC.md)

Display Product Knowledge starts at `products/display/README.md`; runtime-local
instructions remain in `apps/yuta-display/AGENTS.md`, with deployment authority
in the shared operations documents.

### UI implementation

- [`ui/README.md`](ui/README.md)
- [`ui/DESIGN_TO_CODE_WORKFLOW.md`](ui/DESIGN_TO_CODE_WORKFLOW.md)
- [`ui/DELIVERY_WORKFLOW_MODES.md`](ui/DELIVERY_WORKFLOW_MODES.md)
- [`ui/YUTA_FRONTEND_RULES.md`](ui/YUTA_FRONTEND_RULES.md)
- [`ui/BACKOFFICE_FRONTEND_RULES.md`](ui/BACKOFFICE_FRONTEND_RULES.md)
- [`ui/POS_FRONTEND_RULES.md`](ui/POS_FRONTEND_RULES.md)
- [`ui/PAGE_PACK_PROTOCOL.md`](ui/PAGE_PACK_PROTOCOL.md)
- [`ui/UI_PACK_TOOLING_SPEC.md`](ui/UI_PACK_TOOLING_SPEC.md)
- [`ui/UI_WORKFLOW_DELIVERY_CHECKLIST.md`](ui/UI_WORKFLOW_DELIVERY_CHECKLIST.md)
- [`ui/pages/hours-services/README.md`](ui/pages/hours-services/README.md)
- [`ui/pages/establishment-general-information/README.md`](ui/pages/establishment-general-information/README.md)
- [`ui/pages/today/README.md`](ui/pages/today/README.md)
- [`ui/pages/backoffice-equipe-salaries/README.md`](ui/pages/backoffice-equipe-salaries/README.md)
- [`ui/pages/backoffice-equipe-formalites-personnel/README.md`](ui/pages/backoffice-equipe-formalites-personnel/README.md)
- [`ui/pages/backoffice-equipe-registre-personnel/README.md`](ui/pages/backoffice-equipe-registre-personnel/README.md)
- [`ui/pages/pos-order-detail/README.md`](ui/pages/pos-order-detail/README.md)

### Operations and process

#### YUTA Workflow v3

Start with [`YUTA_WORKFLOW_V3.md`](YUTA_WORKFLOW_V3.md), the **Canonical
human-readable YUTA Workflow v3 operating guide**. It explains the complete
operating model and routes to the detailed sources below; those sources retain
their specialized authority and executable responsibilities.

| Source                                                                                                                                                    | Role                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [`YUTA_WORKFLOW_V3.md`](YUTA_WORKFLOW_V3.md)                                                                                                              | Primary human-readable operating guide                                  |
| [`YUTA_AUTOMATED_CHANGE_WORKFLOW.md`](YUTA_AUTOMATED_CHANGE_WORKFLOW.md)                                                                                  | Detailed automation/workflow protocol                                   |
| [`YUTA_QA_PROTOCOL.md`](YUTA_QA_PROTOCOL.md)                                                                                                              | Detailed QA protocol                                                    |
| [`YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`](YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md)                                                                    | Detailed post-archive knowledge protocol                                |
| [`.agents/skills/yuta-run-change/SKILL.md`](../.agents/skills/yuta-run-change/SKILL.md)                                                                   | Executable change start/run/resume behavior through the next human gate |
| [`.agents/skills/yuta-finish-change/SKILL.md`](../.agents/skills/yuta-finish-change/SKILL.md)                                                             | Executable finalization and archived Knowledge Review resume behavior   |
| [`openspec/config.yaml`](../openspec/config.yaml) and [`openspec/schemas/yuta-spec-driven/schema.yaml`](../openspec/schemas/yuta-spec-driven/schema.yaml) | OpenSpec artifact and dependency mechanics                              |
| [`chatGPT/YuTa_Workflow_v3.pdf`](archive/yuta-workflow/reference/YuTa_Workflow_v3.pdf)                                                                    | Static snapshot only; non-canonical—use the human-readable guide        |

Historical setup, approval evidence, and completed tasks are indexed in
[`archive/yuta-workflow/README.md`](archive/yuta-workflow/README.md).
They are provenance, not current workflow instructions.

- [`operations/LOCAL_DEVELOPMENT.md`](operations/LOCAL_DEVELOPMENT.md)
- [`operations/DEPLOYMENT.md`](operations/DEPLOYMENT.md)
- [`operations/PRODUCTION_READINESS.md`](operations/PRODUCTION_READINESS.md)
- [`operations/OPENAI_PROVIDER_ELIGIBILITY.md`](operations/OPENAI_PROVIDER_ELIGIBILITY.md)
- [`operations/EXTERNAL_DELIVERABLES.md`](operations/EXTERNAL_DELIVERABLES.md)
- [`DEVELOPMENT_WORKFLOW.md`](DEVELOPMENT_WORKFLOW.md)
- [`DOCUMENTATION_POLICY.md`](DOCUMENTATION_POLICY.md)
- [`tasks/TASK_TEMPLATE.md`](tasks/TASK_TEMPLATE.md)
- [`decisions/ADR-000-template.md`](decisions/ADR-000-template.md)
- [`decisions/ADR-001-runtime-families-and-product-visibility.md`](decisions/ADR-001-runtime-families-and-product-visibility.md)
- [`decisions/ADR-002-independent-public-booking-application.md`](decisions/ADR-002-independent-public-booking-application.md)
- [`decisions/ADR-003-database-ownership-boundaries.md`](decisions/ADR-003-database-ownership-boundaries.md)
- [`decisions/ADR-004-independent-public-feedback-application.md`](decisions/ADR-004-independent-public-feedback-application.md)
- [`decisions/ADR-005-today-operational-steering.md`](decisions/ADR-005-today-operational-steering.md)
- [`decisions/ADR-006-cloud-establishment-profile-context.md`](decisions/ADR-006-cloud-establishment-profile-context.md)
- [`decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md`](decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md)

Completed task specifications are removed after durable behavior is reflected
in current feature documentation and remaining work is captured in `STATUS.md`.

## Maintenance

- Update an existing current document instead of adding an overlapping report.
- Remove superseded plans only after durable rules have been extracted.
- Keep `packages/ui/src/index.ts` authoritative for public UI exports; do not
  duplicate its catalog in instruction files.
- Check links after moving or deleting files.
- Public-product documents must not promote local operational workflows as
  YUTA public-service capabilities.
