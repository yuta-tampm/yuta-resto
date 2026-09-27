# Product Release Browser QA report

Change: `product-version-management-foundation`  
UI_AFFECTING: YES  
BROWSER_QA_REQUIRED: YES  
QA status: PASS  
Assessed: 2026-09-27, Europe/Paris

## Route(s), data and roles

- Public Web: local production build at `http://localhost:3000/`, public visitor.
- Backoffice: local production build at `http://localhost:3001/aujourdhui`, authenticated owner of `LuNa Poitiers` in the existing local development database.
- Both routes used real application shells and the same Core Product Release record. No fixture page, fabricated browser state, database mutation, seed or authentication bypass was used. The agent did not handle the user's credentials.

The first Backoffice visit redirected to login. The existing healthy `yuta-cloud-db-dev` container was published at host port `56431`, while the ignored local `apps/backoffice/.env.local` used `55431`. Only that local port was corrected, then the Backoffice server was restarted. `pg_isready`, read-only `select 1`, and the host listener check passed. The user signed in directly in the browser without sharing a password in chat, selected `LuNa Poitiers`, and the authenticated route loaded. The initial redirect screenshot remains historical environment evidence; it is not the basis for Backoffice PASS.

## Viewports and scenarios

| Scenario                        | Viewport  | Observation                                                                                                                                                         | Result |
| ------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Public Web footer               | 1366×768  | Exactly one `YUTA Alpha · v0.1.0-alpha.1`; prior `Projet pilote` absent from footer; copyright, links and `Déployé sur Vercel` retained                             | PASS   |
| Public Web responsive footer    | 390×844   | Full label visible at 13px, inside x=16–359px; no document horizontal overflow                                                                                      | PASS   |
| Backoffice authenticated footer | 1366×768  | Existing `AppFooter` shows `Alpha · v0.1.0-alpha.1` from the shared record; `YUTA v1.0.0` absent; desktop navigation and selected establishment visible             | PASS   |
| Backoffice responsive footer    | 390×844   | Footer text wraps to two readable lines inside 390px viewport; text bounds x=16–360.6px, y=808.5–840.5px within footer y=804–844px; no document horizontal overflow | PASS   |
| Backoffice mobile navigation    | 390×844   | Menu opens and closes with accessible controls; authenticated route and footer remain present                                                                       | PASS   |
| Browser errors                  | Both apps | No captured console errors or error overlay during inspected states                                                                                                 | PASS   |

No extra tablet capture was required for this bounded footer change: the meaningful shell states were covered by the desktop sidebar and mobile menu, and no separate tablet footer state was identified.

## Accessibility, visual and regression findings

The Web release label and footer links were present in the accessibility tree; inspected links had accessible text. Keyboard Tab reached the footer contact link with `:focus-visible` and a visible focus ring. The Backoffice footer text was present in the authenticated accessibility tree on both viewports. Its mobile text bounds stayed inside the footer, and the menu had accessible open/close controls. Both apps retained their existing low-emphasis footer placement. No clipping, horizontal overflow, stale release wording, or relevant navigation regression was observed.

## Known limitations

This QA proves the two local production-build routes and the Product Release footer scope. It is not deployment, external-provider, or capability-readiness evidence. The initial unauthenticated redirect and local DB port correction are preserved as environmental history, not a current QA blocker.

## Screenshot evidence

Exact paths, viewports, roles/states, scenarios and SHA-256 values are in [screenshot-manifest.md](screenshot-manifest.md). The current acceptance captures are [Web desktop](web-desktop.png), [Web mobile](web-mobile.png), [Backoffice desktop](backoffice-desktop.png) and [Backoffice mobile](backoffice-mobile.png). The [initial Backoffice redirect](backoffice-auth-required.png) is retained only as historical environment evidence.
