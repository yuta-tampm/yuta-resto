Change: platform-admin-formalites-template-authority-foundation
Stage: Post-archive Knowledge Consolidation
Classification: UPDATE_REQUIRED
Review status: APPROVED
Created: 2026-09-06T22:55:26.9414587+02:00
Revision: 2
Revised: 2026-09-06T23:03:07.1783879+02:00
Previous review result: CHANGES_REQUESTED
Superseded proposed-diff SHA-256: 8e32939226292e81820ea12ba0bfae720e1b252f39d1331ee6157c216a0c7140
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-06T23:08:11.0250397+02:00
Approved proposed-diff SHA-256: a37694a01a30365a16aac7a2b1d4e3237da2a487ccb27b62b9c66c21ff1c0a65
Apply status: COMPLETED
Knowledge Consolidation status: COMPLETED
Completed: 2026-09-06T23:25:35.2588797+02:00
Workflow status: DONE

# Knowledge Consolidation Review

## Completed-change evidence

Gate 3 is approved and records Technical Implementation Compliance `PASS`,
Verify `PASS`, and QA `NOT_APPLICABLE` for the non-UI/non-runtime authorization
change. Authorized Sync created and strictly validated the normative main spec:

`openspec/specs/authorization/platform-admin-formalites-template-administration/spec.md`

Main-spec SHA-256:
`3b53193f63cc3536d00506826d5281aea7607a01604112051edebef5bb810db2`.

The completed change is archived at:

`openspec/changes/archive/2026-09-06-platform-admin-formalites-template-authority-foundation`

The active change path is absent. The archive retains the approved Proposal,
Analysis, Specs, Design, all `12/12` completed Tasks, and the Technical
Implementation Contracts. The approved implementation remains bounded to the
portable `@yuta/auth` source/test path set documented by Gate 3.

## Classification and reason

`UPDATE_REQUIRED`

Current canonical sources still say that Platform Admin has no approved
capability scope or no implemented identity/access behavior. That is now stale
in one narrow respect: the completed change established a portable,
non-runtime authorization foundation for exactly five GLOBAL YUTA Formalités
template operations.

The application/runtime is still reserved and unimplemented. No template
lifecycle, persistence, legal-review governance, tenant access, deployment, or
production enablement was added. The proposed reconciliation makes that
distinction explicit and does not broaden the completed capability.

Revision 2 corrects the Identity / Access proposal to use the exact normative
operation identifiers:

- `formalites.template.read`
- `formalites.template.draft.manage`
- `formalites.template.review.submit`
- `formalites.template.publish`
- `formalites.template.retire`

It also states the system-only boundary without implying tenant prerequisites:
authorization requires a trusted active internal user and the exact approved
system-operation grant; tenant membership and `TenantContext` are not required
and provide no global authority. Wildcard, prefix, implication, and role
hierarchy semantics remain absent.

## Sources inspected

| Source                                         | Result                                                                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `docs/features/identity-access/README.md`      | Update required: current identity/access scope omits the completed bounded system authorization foundation.                                |
| `docs/architecture/IDENTITY_AND_MEMBERSHIP.md` | Update required: current system-role description needs the accepted system-only, non-tenant boundary.                                      |
| `docs/architecture/OVERVIEW.md`                | Update required: clarify that the app remains future/unimplemented while the portable auth foundation now exists.                          |
| `docs/CURRENT_STATE.md`                        | Update required: two summaries still state that no capability scope exists.                                                                |
| `docs/MODULE_REGISTRY.md`                      | Update required: the Platform Admin note still states that no capability scope is approved.                                                |
| `docs/PRODUCT_KNOWLEDGE.md`                    | No update proposed: its routing/authority role remains accurate and it does not duplicate this capability detail.                          |
| ADR and durable-decision set                   | No update proposed: the completed change did not alter runtime ownership, persistence ownership, tenant semantics, or deployment topology. |

## Exact target set and current hashes

No file outside this exact target set is authorized by this packet.

| Exact target                                   | Current SHA-256                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------ |
| `docs/features/identity-access/README.md`      | `6629981d7360302774bd84397a3c8c6c5430d24280a6364cf6fe34f68b17344e` |
| `docs/architecture/IDENTITY_AND_MEMBERSHIP.md` | `723bf3bab0aa52414b7c14d8b5ee991447c3a8d82e15a3f09bcac0b12bef6711` |
| `docs/architecture/OVERVIEW.md`                | `9a4a3b43b9646b4b1ab1e5559456fa1344f9379be6e534de6e86cbe0c7415a80` |
| `docs/CURRENT_STATE.md`                        | `273fc1aae6b8add9eeaa251bb0042a62004c2be4d3df422bb0fefd563848ec16` |
| `docs/MODULE_REGISTRY.md`                      | `3c78451ab4fb5a452d081e82e27f4077f842836ae805b279daa4f0443a86c437` |

Any target-set or target-hash drift invalidates this packet and requires a new
review packet before applying documentation changes.

## Authority classification by proposed edit

| Target                                         | Classification                                            | Bounded purpose                                                                                                                                                                              |
| ---------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/features/identity-access/README.md`      | Current Product Knowledge reconciliation                  | Record the exact five-operation grant/denial and fail-closed system-only behavior already approved and implemented; retain all tenant isolation and non-production limits.                   |
| `docs/architecture/IDENTITY_AND_MEMBERSHIP.md` | Current architecture summary reconciliation               | Describe the implemented portable system-auth composition without changing identity, session, tenant, runtime, or persistence architecture.                                                  |
| `docs/architecture/OVERVIEW.md`                | Architecture clarification, not a durable-boundary change | Preserve future `apps/platform-admin` ownership and clarify that the present foundation is non-runtime and does not establish a general product.                                             |
| `docs/CURRENT_STATE.md`                        | Implemented-state orientation                             | Replace the stale no-capability statement with the exact bounded repository reality while retaining unimplemented runtime and non-enabled production state.                                  |
| `docs/MODULE_REGISTRY.md`                      | Registry narrative reconciliation only                    | Update scope/source/review text while preserving the lifecycle cell values exactly: Decision wording, Implementation `NOT_STARTED`, Environment `NOT_ENABLED`, and Readiness `NOT_ASSESSED`. |

## Exact proposed diff

The complete and only proposed canonical edit is the exact byte content of:

`docs/reviews/platform-admin-formalites-template-authority-foundation/04-proposed-knowledge.diff`

Proposed-diff SHA-256:
`a37694a01a30365a16aac7a2b1d4e3237da2a487ccb27b62b9c66c21ff1c0a65`.

`git apply --check --whitespace=nowarn` passes against the current target
bytes. Approval of this packet authorizes that exact diff only. Formatting or
follow-up content changes beyond the reviewed diff require separate review if
they alter bytes or meaning.

## Safeguards

The proposal does not:

- approve or promote a Product Decision;
- change any lifecycle, Environment, Production Readiness, or External
  Dependency value;
- change a durable architecture, security, runtime, data, or deployment
  boundary;
- change resource ownership, principals, roles, grants, contracts, APIs, or
  normative specs;
- create or enable `apps/platform-admin`;
- create template persistence, content, lifecycle, legal-review evidence,
  generation, signature, or Documents handoff;
- create a tenant authorization bypass or modify tenant authorization;
- claim deployment, production enablement, legal compliance, or legal opinion.

The five operation names and grant/denial behavior are copied from the approved
normative spec and completed implementation evidence; they are not new
decisions introduced by Knowledge Consolidation.

## Packet preparation validation

- Approved archived Proposal, Analysis, Design, Tasks, and delta-spec hashes:
  exact match.
- Four approved implementation-file hashes: exact match.
- Synced main-spec hash: exact match.
- `openspec validate --specs --strict --json`: PASS — 13 specs passed, 0
  failed; informational long-text notices only.
- `pnpm docs:check`: PASS.
- `pnpm architecture:check`: PASS.
- Scoped packet formatting: PASS.
- Proposed diff applicability against current target bytes: PASS.
- Canonical Knowledge target diff before review: empty.

## Review decision

The current user approved this exact packet and proposed-diff hash. That
approval did not authorize any formatter rewrite beyond the reviewed diff.

## Approved apply result

Approved at: 2026-09-06T23:08:11.0250397+02:00.

Applied at: 2026-09-06T23:09:23.8957066+02:00.

The approved diff was applied exactly after the five pre-apply target paths and
hashes matched this packet. The changed canonical path set contains exactly the
five approved targets. Reverse applicability of the approved diff passes,
which, together with the exact pre-apply hashes and clean target diff, confirms
that the resulting target bytes came only from the approved patch.

| Applied target                                 | Post-apply SHA-256                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------ |
| `docs/features/identity-access/README.md`      | `1d36f7a43a574f1992983022a1f4ed5bd2609d12f5652ea4ac2cc6f33cfcb6f0` |
| `docs/architecture/IDENTITY_AND_MEMBERSHIP.md` | `dc56d157de118a368991a570e3f29c15d96d00051795b909a89bf4b3365d0401` |
| `docs/architecture/OVERVIEW.md`                | `b41460c72391c4febbc1f41b9f8826d033b387dfcd8fce0a024710bf083b2f7e` |
| `docs/CURRENT_STATE.md`                        | `0357250fff345d2079a93995affd85cebdfb3afafe5c22ce14207086b9095389` |
| `docs/MODULE_REGISTRY.md`                      | `6c2e8a9d294b1e726ae05cc82cc09df9a50ca7af275a19c40a5b95295d6acb3e` |

Validation results:

- exact approved path set: PASS — five targets only;
- exact approved diff application and reverse check: PASS;
- normative main-spec hash unchanged: PASS;
- `pnpm docs:check`: PASS;
- `pnpm architecture:check`: PASS;
- scoped Prettier check on the five targets: FAIL — all five targets would be
  rewritten by Prettier.

The pre-apply `HEAD` bytes for each of the five targets pass the same scoped
Prettier check through `--stdin-filepath`; therefore this failure is introduced
by the exact approved diff rather than inherited from the repository-wide
formatting baseline.

No formatter write was run because it would change bytes beyond the exact
approved diff. No unreviewed canonical edit was made. Knowledge Consolidation
cannot be marked complete while this scoped formatting check is failing;
Control Tower review is required for any formatting remediation.

The authorized format-only remediation is recorded in
`docs/reviews/platform-admin-formalites-template-authority-foundation/05-formatting-remediation-review.md`
with `Review status: APPROVED` and `Apply status: COMPLETED`. Its exact formatter
patch was applied to the same five canonical targets; all five expected hashes,
scoped Prettier, `docs:check`, `architecture:check`, main-spec integrity, and
operation-identifier checks pass. Knowledge Consolidation is complete and the
repository workflow is `DONE`.
