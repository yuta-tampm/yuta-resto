# Browser QA Report — Async Interaction Feedback Foundation

- Change: `async-interaction-feedback-foundation`
- Gate: `QA`
- Review status: `AWAITING_HUMAN_REVIEW`
- Created: `2026-09-06T20:08:23.0790921+02:00`
- Schema: `yuta-spec-driven`
- Analysis conclusion: `READY_FOR_SPECS`
- Sensitive change: `NO`
- `UI_AFFECTING: YES`
- `BROWSER_QA_REQUIRED: YES`
- QA status: `BLOCKED_BY_ENVIRONMENT`

## Environment

- App/runtime: Next.js `16.2.9` Backoffice development server at `http://localhost:3001`.
- Browser: Codex in-app Chromium browser with exact viewport override.
- Account/role: authenticated local `OWNER` for the LUNA development establishment.
- Database: existing local cloud PostgreSQL volume `yuta-cloud-db-dev-data`; no reset, migration or seed was run.
- Safe data: existing local LUNA profile plus fictional employee `Gisèle QA-Romeo`. Formalités created one local development draft and returned its probation choice to `À décider` after the viewport saves.
- Runtime flags: Formalités employee-scoped route exercised with process-only `BACKOFFICE_PERSONNEL_FORMALITES_READ_PROTOTYPE_ENABLED=true`, as required by its development-only page-pack boundary. No `.env` or production setting changed.
- Port recovery: Windows reserves the repository default host-port range containing `55431`; QA used process-only cloud DB port `56431` with the same named volume. This recovery succeeded and is not the final blocker.
- Mandatory limitation: Google Business Profile credentials, redirect URI, encryption key, connected account and locations are unavailable. The real route renders `Configuration serveur requise` and exposes no location-selection control.
- Conditional limitations: no safe deterministic mechanism was available to manufacture a General Information operation error or Formalités uncertain/conflict/retry state. Those states were not simulated.

## QA environment recovery assessment

- Previous consolidated verdict: `BLOCKED_BY_ENVIRONMENT`.
- Recovery assessment: repository/local inspection completed after the blocked Browser QA run; no provider interaction was attempted.
- Environment classification: `HUMAN_SETUP_REQUIRED`.
- Existing safe QA environment found: `NO`.
- Runtime configuration: the four supported Google connector variables are documented and present only in `apps/backoffice/.env.example`; they are absent from the active process and local Backoffice environment files. No value was printed or copied.
- Persisted connector state: the existing local cloud database contains zero Reputation connector rows, zero encrypted access tokens and zero encrypted refresh tokens.
- Repository authority: application-side OAuth, discovery and selection support exists, while Google Cloud API enablement, OAuth consent/configuration, approved callback registration and production credentials remain operator tasks.
- Human setup required: an authorized operator must configure the four documented variables using an approved non-production Google Cloud OAuth client, register the exact callback used by the QA host, confirm Business Profile API access, and connect an approved non-production Google account that exposes at least one safe selectable location.
- Sensitive-data boundary: do not send credentials, encryption keys, OAuth tokens, account identifiers or location identifiers through chat or commit them to the repository. Codex will know setup is complete when the real integrations route reports a configured connector and exposes provider-discovered account/location choices without revealing secrets.
- Recovery result: no required Google configured/idle/pending/completion scenario became executable. No screenshots were added, the prior 26 screenshots remain the current evidence set, and the consolidated QA verdict remains `BLOCKED_BY_ENVIRONMENT`.

## Current lifecycle status

`QA BLOCKED — PENDING GOOGLE PROVIDER APPROVAL`

- Lifecycle marker: `QA_BLOCKED_PENDING_PROVIDER_APPROVAL`.
- External dependency status: `PENDING_EXTERNAL_PROVIDER_APPROVAL`.
- Blocking scope: mandatory Google Business Profile location-selection Browser QA.
- Blocking reason: approved provider/API access and an approved non-production Google QA configuration are not currently available.
- Completed evidence: General Information passed its executed mandatory delta states; Logout passed; Formalités compatibility passed for safely reachable states; delta defects remain `0`; stuck-pending was not reproduced; post-Verify production drift remains `NO`.
- Remaining evidence: Google configured/idle state, selectable location, real pending, duplicate prevention, action-specific pending accessibility semantics, authoritative completion/result and responsive coverage at 1440x900, 1024x768, 768x1024 and 390x844.
- Resume trigger: Google provider/API approval is granted; the documented variables are configured safely outside tracked files; an approved non-production account connects and exposes at least one safe selectable location; `/parametres/integrations` reaches the real configured provider state; and implementation integrity is reconfirmed.
- Resume scope: run only the missing targeted Google Browser QA first. Proposal, Analysis, Specs, Design, Apply and Verify need not repeat unless implementation or authority changes.
- `GATE_3_ELIGIBLE: NO`.
- Gate 3 reason: `MANDATORY_BROWSER_QA_BLOCKED_BY_ENVIRONMENT`.
- Change state: implementation and Verify are complete; QA is incomplete; Gate 3 is ineligible; the change remains open.

## Artifact and implementation integrity

Pre-QA HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`.

| Evidence                     | SHA-256 / assessment                                               |
| ---------------------------- | ------------------------------------------------------------------ |
| Approved Spec                | `46840b69a936b96e9e6c49bee6330ea1a6206774f7aea7483dbabda4f159cb8e` |
| Approved Design              | `0aa7c42257e6e9e11827c1e41a1d8dd61e96cc5391561ba75e51cbe546224138` |
| Pre-QA `tasks.md`            | `83d2f48a336c309087ce361b6f396964734869588cb657d250fa3ecbdb55eb49` |
| Approved Verify packet       | `d810fb044b8bfa511648726e48fb39e937ca291af63ffd072bd939ab6394c144` |
| Technical Compliance Matrix  | `90d79e21c54319079bb7426b6a2b9890b7292a7544e4570e5db18f8338330ee5` |
| Post-Verify production drift | `NO`                                                               |

The current production paths and their change-scoped diff exactly match the five-file inventory reviewed by Verify. QA changed only Verify approval metadata, lifecycle checkboxes and QA evidence.

## Pilot matrix

| Pilot                     | Route                                                                          | States exercised                                                                                                               | Viewports                             | Result                                                               |
| ------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- | -------------------------------------------------------------------- |
| General Information       | `/etablissement/informations-generales`                                        | idle, dirty, native validation, real submit pending, authoritative success and settled recovery                                | 1440x900, 1024x768, 768x1024, 390x844 | PASS for delta behavior; one unrelated baseline defect recorded      |
| Google location selection | `/parametres/integrations`                                                     | truthful unconfigured/empty provider state only                                                                                | 1440x900, 1024x768, 768x1024, 390x844 | BLOCKED_BY_ENVIRONMENT for selection pending and provider completion |
| Logout                    | shell from `/aujourdhui` and Formalités                                        | idle, pointer activation, keyboard Enter activation, pending, duplicate prevention and redirect                                | 1440x900, 1024x768, 768x1024, 390x844 | PASS                                                                 |
| Formalités compatibility  | `/equipe/formalites-personnel` and `/equipe/formalites-personnel/[employeeId]` | generic baseline, no-draft, create pending, editable draft, three save decisions, save pending and authoritative settled state | 1440x900, 1024x768, 768x1024, 390x844 | PASS for safely reachable states                                     |

## General Information

- Real pending at all four viewports exposed `Enregistrement…`, native `disabled`, `aria-busy="true"` and `data-loading=""` on the submit control only.
- Repeated activation was unavailable while pending because the native button was disabled.
- The action completed on the server and the control returned to `Enregistrer`; authoritative `Informations générales enregistrées.` was rendered.
- A whitespace-only safe change normalized back to the original profile value; the resulting draft and persisted profile remained `LUNA` with the original description.
- Clearing required `Nom commercial` and pressing Enter kept focus on `#name`; the invalid draft value was restored without a server mutation.
- No page/region-wide busy attribute, horizontal overflow, pending-label clipping or unexpected layout jump was observed.

Result: `PASS` for the async-feedback delta.

## Google location selection

- The route is real, authenticated and responsive at every required viewport.
- It truthfully reports `Configuration serveur requise`, `Non connecté` and `Aucun compte Google chargé`.
- No account/location option and no `Sélectionner` submit control exists in this environment, so idle-selection, `Sélection en cours…`, duplicate prevention, accessible pending state and provider/redirect completion cannot be executed.
- No credential, OAuth token, provider configuration, fixture or production mock was created for QA.

Local blocked-state UI: `PASS`.  
Provider-dependent required scenario: `BLOCKED_BY_ENVIRONMENT`.

## Logout

- Idle control was reachable at all four viewports.
- At `120 ms` after activation, every viewport exposed `disabled=true`, `aria-busy="true"` and the action-specific accessible name/title `Déconnexion en cours…`.
- The spinner remained bounded to the shell icon control; no page or shell-wide busy state appeared.
- Pointer activation passed at all viewports. Enter-key activation passed at `390x844`.
- Every attempt completed at `http://localhost:3001/connexion`; the session-authoritative server action returned `303` and no premature success surface was invented.

Result: `PASS`.

## Formalités compatibility

- The generic entirely-fictional prototype remained visually distinct and unchanged.
- The employee-scoped development route used existing fictional employee `Gisèle QA-Romeo` and displayed the Formalités-owned no-draft state.
- Creating the draft entered local pending with the create button disabled and `aria-busy="true"`, then produced the authoritative editable-draft state.
- Saves at 1024x768, 768x1024 and 390x844 exercised `Prévoir`, `Ne pas prévoir` and final `À décider`. Each save exposed disabled/busy state and later returned `Modifications enregistrées` with controls usable again.
- The route-specific labels, probation decision, operation lifecycle, editable badge and authoritative success remained distinct; the shared foundation did not replace them with a generic state.
- Uncertain/conflict/retry/reconciliation states were not safely manufactured. Their absence from this run is recorded rather than treated as browser evidence.

`CUSTOM_STATE_MACHINE_PRESERVED_IN_BROWSER: YES`

Result: `PASS` for safely reachable compatibility states.

## Responsive result

| Viewport | Result                   | Observation                                                                                          |
| -------- | ------------------------ | ---------------------------------------------------------------------------------------------------- |
| 1440x900 | PASS for executed states | Desktop grids, pending controls, preview and shell remain aligned; no horizontal overflow.           |
| 1024x768 | PASS for executed states | Cards reflow without clipping; shell actions and pending text remain reachable.                      |
| 768x1024 | PASS for executed states | Intermediate layout remains usable; pending labels fit and Formalités facts remain readable.         |
| 390x844  | PASS for executed states | Mobile shell collapses, buttons remain tappable, content stacks, and `document.scrollWidth === 390`. |

Google selection/completion remains environment-blocked at every viewport. No unrelated existing page behavior was classified as a delta defect.

## Accessibility result

- Keyboard: General Information native validation via Enter focused the required name input. Logout Enter activation entered pending and navigated correctly. Radio controls exposed specific labels and selection state.
- Accessible names: `Enregistrement…` and `Déconnexion en cours…` remained action-specific; no generic-only `Loading` name appeared.
- Disabled semantics: native submit/icon buttons reported disabled throughout observed pending windows.
- Busy semantics: `aria-busy="true"` was observed on the initiating control; the page and unrelated regions were not marked busy.
- Focus/error behavior: required-field validation focused `#name`; logout navigation reset focus to the destination document body, which is reasonable for full navigation.
- Scope: this is basic Browser QA evidence, not a claim of WCAG conformance.

Result: `PASS` for executed states; Google pending accessibility remains `BLOCKED_BY_ENVIRONMENT`.

## State and result behavior

- General Information and Formalités showed no success before their Server Actions completed.
- Both pending states settled without manual timeout, polling, forced refresh or route workaround.
- Logout used redirect to `/connexion` as authoritative completion.
- Native validation remained contextual and prevented an invalid General Information submission.
- Provider completion was not inferred from the Google blocked-state UI.

## Defects

### QA-B1 — stale General Information success during a new invalid draft

- Severity: `MEDIUM`
- Classification: `BASELINE_DEFECT`
- Delta attribution: `NO`; General Information production code was not modified by this change.
- Reproduction: complete a successful save, clear required `Nom commercial`, then press Enter. Native validation focuses the empty name field, but the prior `Informations générales enregistrées.` alert remains visible while the current draft is invalid and unsaved.
- Evidence: `1440x900-general-information-validation.png`.
- Effect on this change: does not invalidate the new shared pending contract, but the stale baseline feedback may mislead users and should be handled by a separately authorized owning-page change.

Delta defects: `0`.  
Baseline defects: `1`.  
Control Tower routing required for the baseline defect: `NO`.

## Provider and environment blockers

### QA-E1 — Google provider selection unavailable

- Classification: `ENVIRONMENT_LIMITATION`
- Blocking: `YES`
- Route evidence: `/parametres/integrations` renders server configuration required, no connected account and no locations.
- Missing prerequisites: provider credentials, redirect URI, encryption key, OAuth account state and accessible locations.
- Required scenarios blocked: location idle selection, `Sélection en cours…`, duplicate activation prevention on the new control, provider result and redirect completion.
- Required action: configure a safe non-production Google Business Profile QA environment with an authorized test account/location, then rerun only the blocked Google rows and reissue the QA verdict.

### QA-E2 — repository default DB port reserved by Windows

- Classification: `ENVIRONMENT_LIMITATION_RECOVERED`
- Blocking: `NO`
- Evidence: Windows excluded TCP range `55426–55525` contains `55431`.
- Recovery: recreated only `yuta-cloud-db-dev` against the existing named volume on process-only host port `56431`; no volume removal, reset, migration or seed.

## Stuck-pending runtime track

- `STUCK_PENDING_REPRODUCED: NO`
- General Information Server Actions completed in `16–75 ms`; Formalités create/save actions completed in `53–95 ms`; logout completed in `5–28 ms` according to the local Next server log.
- The browser observed pending at `120 ms`, then authoritative settlement and usable controls within the next `1.5 s` for retained-page interactions.
- No timeout/reset, forced refresh, polling, redirect sequencing change or transition rewrite was used.
- `CONTROL_TOWER_REVIEW_REQUIRED: NO`

## Screenshot evidence

- Manifest: [`screenshot-manifest.md`](screenshot-manifest.md)
- Screenshot count: `26`
- Exact PNG hash verification: `26/26 MATCH`
- Viewports: `1440x900`, `1024x768`, `768x1024`, `390x844`

## Task completion

Tasks `3.4`, `3.5` and `3.6` are open because the newly requested recovery rule requires mandatory Google coverage to be genuinely complete before those QA tasks are complete. Task `3.8` remains open because independent Gate 3 review is not authorized in this lane.

- Completed: `15/19`
- Remaining: `4` (`3.4`, `3.5`, `3.6`, `3.8`)

## Overall QA verdict

`BLOCKED_BY_ENVIRONMENT`

The implemented General Information, logout and safely reachable Formalités behavior passed real Browser QA with responsive and accessibility evidence. The mandatory Google selection/provider-completion scenario cannot run in the current safe environment, so QA cannot be promoted to `PASS` and Gate 3 remains ineligible.

Recommendation: `BLOCKED`
