# YuTa POS QA Checklist

Status: Current

Visibility: Local operator

Owner: YUTA engineering and QA

Last updated: 2026-08-16

Use this checklist to stabilize the POS MVP before adding larger features.

This checklist targets the post-reset local architecture. Cloud `apps/backoffice`
must not be used for POS staff, menu/catalog, combo, printer, order, payment,
or operational-report QA.

Run QA against the local apps:

```txt
POS:        http://localhost:3003
Site agent: configured local URL
```

Target local services:

```bash
docker compose --project-name yuta-pos-dev -f docker-compose.local.dev.yml up -d --wait
pnpm db:pos:migrate
pnpm db:pos:seed
pnpm dev:site-agent
pnpm --filter @yuta/pos dev
```

The POS development script uses the supported Next.js webpack fallback because
Turbopack can keep stale route state after route files are added or after a
production build shares the same `.next` directory. If a route still returns
`404`, restart the affected dev server before marking the case as failed.

## Result Legend

```txt
PASS      works as expected
FAIL      broken or incorrect
BLOCKED   cannot test because another issue blocks it
N/A       not applicable for this run
```

## Preflight

| Case                                | Expected Result                                                                                                                                                 | Result | Notes |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -----: | ----- |
| Local database container is running | `yuta-pos-db-dev` is healthy on port `55432`                                                                                                                    |        |       |
| POS health endpoint is ready        | `/api/health` returns application and database availability                                                                                                     |        |       |
| Local service strip is visible      | Strip distinguishes local, database, and server failure states                                                                                                  |        |       |
| POS dev server opens                | `http://localhost:3003` loads without error                                                                                                                     |        |       |
| Site agent is ready                 | Local health endpoint reports POS DB readiness                                                                                                                  |        |       |
| Local print worker starts           | `site-agent` reports printer queue processing ready                                                                                                             |        |       |
| Seed data exists                    | POS shows menu categories/items and staff users                                                                                                                 |        |       |
| POS shell uses the full viewport    | Route canvas/header/main content have no desktop max-width cap                                                                                                  |        |       |
| Service-time headers are consistent | `/`, `/pos`, `/kitchen`, and `/orders/*` share prominent desktop geometry and compact behavior below `lg`                                                       |        |       |
| New-order navigation is Home-only   | Only `/` exposes the direct `Nouvelle commande` navigation action                                                                                               |        |       |
| Service header has no back arrow    | Non-management service-time headers do not render a leading arrow action                                                                                        |        |       |
| Service navigation menu is present  | Every non-management service-time route exposes the three-line menu; sibling routes offer `Commandes`, `Cuisine`, and `Gestion`, while Home omits its self-link |        |       |
| Header controls share one height    | Prominent desktop direct actions/status controls and the three-line trigger are all 48px high; compact trigger is 44px                                          |        |       |
| Focused content remains readable    | Forms, login cards, dialogs, and success cards stay intentional                                                                                                 |        |       |

## POS Staff Selector

| Case                                                   | Expected Result                                    | Result | Notes |
| ------------------------------------------------------ | -------------------------------------------------- | -----: | ----- |
| POS home shows employee selector                       | `Employe` select is visible                        |        |       |
| Select active staff and click `Changer`                | Session text updates to selected employee          |        |       |
| Create order after selecting employee                  | Order is created with selected employee as creator |        |       |
| Inactive staff is not selectable                       | Deactivated staff does not appear in POS selector  |        |       |
| Kitchen-only user is not selectable for order creation | Role `kitchen` does not appear in POS selector     |        |       |

## Create Order

| Case                    | Expected Result                                      | Result | Notes |
| ----------------------- | ---------------------------------------------------- | -----: | ----- |
| Create dine-in order    | Order screen opens with table label and order number |        |       |
| Create takeaway order   | Order type saves as takeaway                         |        |       |
| Create delivery order   | Order type saves as delivery                         |        |       |
| Missing table/reference | Form validation prevents empty order creation        |        |       |

## Command List Service Day

| Case                        | Expected Result                                                    | Result | Notes |
| --------------------------- | ------------------------------------------------------------------ | -----: | ----- |
| Open list after 05:00       | Unfinished orders created before 05:00 are hidden                  |        |       |
| Open list before 05:00      | Orders created after 05:00 on the previous calendar day remain     |        |       |
| Paid-today list             | Only orders paid during the current 05:00 service day appear       |        |       |
| Activity-today list         | Orders created or paid during the current 05:00 service day appear |        |       |
| Order exactly at next 05:00 | Order belongs to the next service day and not the previous one     |        |       |
| Home request count          | One `/api/v1/orders/home` request loads rows and all tab counts    |        |       |
| Home search                 | Table/order-number query is applied server-side and preserves view |        |       |
| Home pagination             | Results use 50 rows; Previous/Next preserve `view` and `q`         |        |       |
| Out-of-range page           | Site-agent clamps to the last available page                       |        |       |
| More than 200 orders        | Relevant service-day rows remain discoverable beyond old list cap  |        |       |

## Order Item Entry

| Case                                | Expected Result                                                  | Result | Notes |
| ----------------------------------- | ---------------------------------------------------------------- | -----: | ----- |
| Select menu category                | Item grid changes to selected category                           |        |       |
| Slight pointer movement on category | Category still opens; only intentional horizontal drag scrolls   |        |       |
| Add item                            | Item appears in `Commande en cours`                              |        |       |
| Add same item twice                 | Two rows or expected quantity behavior is visible                |        |       |
| Item total displays correctly       | Row amount equals snapshot unit price times quantity             |        |       |
| Order total displays correctly      | Total equals sum of active non-cancelled items minus discounts   |        |       |
| Add or edit pending item note       | Note appears below the item and persists                         |        |       |
| Nems quick options                  | Nems shows specific choices and never `Sans legumes`             |        |       |
| Open `Autres`                       | Additional choices appear without replacing current choices      |        |       |
| Select conflicting options          | New option automatically removes the incompatible option         |        |       |
| Structured option persistence       | Code and label snapshot persist on the order item                |        |       |
| Select Mochi flavours               | Flavor quantities equal two per ordered portion                  |        |       |
| Add two Mochi portions              | Two quantity-one rows retain independent two-flavour selections  |        |       |
| Increase Mochi row quantity         | No plus control is shown and the API rejects quantity above one  |        |       |
| Send with incomplete Mochi flavours | French recovery alert appears and kitchen send stays disabled    |        |       |
| Locate incomplete Mochi item        | Exact desktop/mobile row is highlighted until flavours are valid |        |       |
| Configure another separate item     | Catalog policy works without adding an item-name code rule       |        |       |
| Save invalid variant policy         | Duplicate codes or required count without options is rejected    |        |       |
| Add Menu Petit Enfant               | One pork-or-vegan nem choice is required for each separate menu  |        |       |
| Edit sent item note                 | Note action is unavailable after kitchen send                    |        |       |
| Item allergy without details        | Form validation blocks saving the instructions                   |        |       |
| Add allergies to different items    | Each warning stays attached to its own item                      |        |       |
| One item from positive combo        | Truthful one-step completion suggestion appears below search     |        |       |
| Narrow combo candidate cards        | Full candidate names remain readable before staff adds an item   |        |       |
| Search while suggestion is visible  | Shelf hides; clearing search restores the eligible suggestion    |        |       |
| Change category with suggestion     | Current shelf dismisses and selected catalog remains reachable   |        |       |
| Add unrelated item after dismissal  | The same dismissed combo state does not immediately reappear     |        |       |
| Add another relevant combo item     | A new combo state may produce the same rule suggestion again     |        |       |
| Open another category directly      | Eligible suggestion may appear outside `Toutes`                  |        |       |
| Add suggested catalog item          | Existing add-item pending/revalidation behavior is reused        |        |       |
| Locked order                        | Combo-completion suggestions and add actions are absent          |        |       |

## Quantity, Cancel, Restore

| Case                             | Expected Result                                               | Result | Notes |
| -------------------------------- | ------------------------------------------------------------- | -----: | ----- |
| Increase pending item quantity   | Quantity and total increase                                   |        |       |
| Decrease pending item quantity   | Quantity and total decrease                                   |        |       |
| Decrease quantity at `1`         | Button is disabled or quantity remains `1`                    |        |       |
| Cancel pending item              | Item becomes `Annule`; total excludes it                      |        |       |
| Restore pending-cancelled item   | Item returns to `A envoyer`; total includes it again          |        |       |
| Send item to kitchen then cancel | Item becomes `Annule`; kitchen queue excludes it              |        |       |
| Restore sent-cancelled item      | Item returns to `Cuisine` / `sent`; kitchen queue includes it |        |       |
| Sent item quantity controls      | Quantity controls are disabled for sent item                  |        |       |

## Kitchen Flow

| Case                                        | Expected Result                                                                                                                                                | Result | Notes |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -----: | ----- |
| Send pending items to kitchen               | Items become `Cuisine`; kitchen ticket job is created                                                                                                          |        |       |
| Desktop kitchen-send placement              | Send action is at the bottom of `Commande actuelle`                                                                                                            |        |       |
| Mobile kitchen-send placement               | Send action appears in the order drawer above `Fermer`                                                                                                         |        |       |
| Send button with no pending items           | Button is disabled                                                                                                                                             |        |       |
| Send allergic item without confirmation     | Kitchen send is blocked                                                                                                                                        |        |       |
| Confirm allergy and send                    | Acknowledgement is stored on the affected item                                                                                                                 |        |       |
| Kitchen displays allergic item              | Red alert appears directly below the affected item                                                                                                             |        |       |
| Allergy missing allergen or severity        | Item instruction form cannot be saved                                                                                                                          |        |       |
| Mark allergic item ready before KDS confirm | `Pret` remains unavailable                                                                                                                                     |        |       |
| Confirm allergy on KDS                      | Confirmation is stored and `Pret` becomes available                                                                                                            |        |       |
| Kitchen station filter `Cuisine`            | Only kitchen station items are shown                                                                                                                           |        |       |
| Combined `Bar` / `Desserts` screen          | One two-line button shows both bar and dessert station items                                                                                                   |        |       |
| Cuisine course order                        | Unfinished Entrées appear before other Cuisine categories, following catalog order within each priority                                                        |        |       |
| Counter station order                       | Unfinished Bar rows appear before Dessert rows regardless of order-item insertion order                                                                        |        |       |
| Course/station background                   | Entrées use warning-soft, Bar uses info-soft, and ready rows retain the completed treatment                                                                    |        |       |
| Bounded Kitchen read                        | One `/api/v1/kitchen` response supplies selected tickets and authoritative station/queue counts without per-order detail requests                              |        |       |
| Kitchen limit after filtering               | Service-day, production station/status, and active/ready queue selection happen before the ticket limit                                                        |        |       |
| Kitchen read query budget                   | A populated refresh uses at most three database queries and does not load discounts or the full catalog                                                        |        |       |
| Kitchen SSE notification payload            | Event contains only revision, affected screen, reason, timestamp, and type; no order/item payload                                                              |        |       |
| Matching Kitchen SSE event                  | Visible selected screen refreshes once after a short debounce                                                                                                  |        |       |
| Other-screen Kitchen SSE event              | Selected screen does not refresh                                                                                                                               |        |       |
| Burst Kitchen SSE events                    | Events are debounced and a pending refresh is coalesced instead of overlapping                                                                                 |        |       |
| Site-agent reconnect                        | Stream reconnects and Kitchen reloads current persisted state                                                                                                  |        |       |
| Hidden Kitchen tab                          | Stream closes while hidden and reconnects plus refreshes when visible                                                                                          |        |       |
| Kitchen notification fallback               | Visible Kitchen refreshes after 60 seconds even when no event arrives                                                                                          |        |       |
| Enable Kitchen sound                        | One operator click enables the green `Son` state and plays a short confirmation chime                                                                          |        |       |
| New Cuisine batch                           | Enabled Cuisine screen plays one short chime after a non-replayed send                                                                                         |        |       |
| New Bar / Desserts batch                    | Enabled counter screen plays one short chime after a matching non-replayed send                                                                                |        |       |
| Kitchen state-only event                    | Preparing, ready, reopen, allergy, payment, catalog, and fallback refresh events remain silent                                                                 |        |       |
| Kitchen sound burst                         | Multiple matching new-ticket events within 2.5 seconds produce at most one chime                                                                               |        |       |
| Disable Kitchen sound                       | `Son` returns to muted state and later new tickets stay silent                                                                                                 |        |       |
| Kitchen queue `A preparer`                  | Sent, preparing, and mixed-completion tickets are shown together                                                                                               |        |       |
| Kitchen has no `En preparation` queue tab   | Preparing remains an item state, not a separate ticket queue                                                                                                   |        |       |
| Kitchen queue `Pret`                        | Only tickets whose active rows are all ready are shown                                                                                                         |        |       |
| Shared button with Bar and Dessert rows     | Bar and Desserts show separate order counts; the combined queue count deduplicates the order                                                                   |        |       |
| Queue badge with a multi-item order         | One order contributes one ticket to `A preparer` or `Pret`, regardless of its item-row count or quantities                                                     |        |       |
| Tap ticket `Tout préparer`                  | Every sent item in that order/screen becomes `Preparation` atomically                                                                                          |        |       |
| Replay ticket `Tout préparer`               | No additional change; the command remains idempotent by state                                                                                                  |        |       |
| Ticket prepare station isolation            | Cuisine action does not change Bar or Dessert items                                                                                                            |        |       |
| Counter ticket prepare scope                | One transaction changes matching Bar and Dessert rows but leaves Cuisine rows unchanged                                                                        |        |       |
| Tap ticket preparation undo                 | Preparing rows return to sent; ready and other-station rows stay intact                                                                                        |        |       |
| Replay ticket preparation undo              | No additional change; the command remains idempotent by state                                                                                                  |        |       |
| Mark item `Pret`                            | Item becomes `Pret`                                                                                                                                            |        |       |
| Mark one item `Pret` in a multi-item ticket | Ticket keeps the same height and board position; no `Terminés · N` row is inserted, the ready row moves below unfinished rows, and other tickets do not reflow |        |       |
| Reopen that ready item                      | Ticket keeps the same height and board position; the row returns above completed rows and other tickets do not reflow                                          |        |       |
| Mark the final active item `Pret`           | The completed ticket leaves `A preparer`; downstream reflow is expected only because the ticket is removed from that queue                                     |        |       |
| Open kitchen `Pret`                         | Fully-ready tickets are visible by station                                                                                                                     |        |       |
| Tap `Reouvrir` on a ready item              | Item returns to `Preparation` and active kitchen queue                                                                                                         |        |       |
| Paid order in kitchen `A preparer`          | Ticket can still use `Tout préparer`; items can become `Pret`                                                                                                  |        |       |
| Paid order in kitchen `Pret`                | Ready item can still be reopened for kitchen correction                                                                                                        |        |       |
| Cancelled order in kitchen                  | Item is read-only and does not show rollback buttons                                                                                                           |        |       |
| Order status refreshes from item statuses   | Order status reflects sent/preparing/ready state                                                                                                               |        |       |

## Full Payment

| Case                                                              | Expected Result                                                  | Result | Notes |
| ----------------------------------------------------------------- | ---------------------------------------------------------------- | -----: | ----- |
| Open payment page                                                 | Payment page shows total, paid, remaining                        |        |       |
| Submit payment with empty amount                                  | Payment page shows a validation message, no server error overlay |        |       |
| Submit payment with empty tendered amount                         | Payment uses the amount being collected as the tendered amount   |        |       |
| Select `Especes` and enter tendered amount above collected amount | Payment UI shows change to return                                |        |       |
| Enter collected amount above remaining amount                     | Submit is blocked and payment UI shows a validation message      |        |       |
| Pay partial amount                                                | Payment saves; order remains open                                |        |       |
| Partial payment receipt                                           | Payment creates no automatic `customer_receipt` job              |        |       |
| Pay remaining amount                                              | Order becomes `Payee`                                            |        |       |
| Overpay attempt                                                   | Payment is rejected                                              |        |       |
| Tendered amount below amount                                      | Payment is rejected                                              |        |       |
| Full payment receipt                                              | Payment creates no automatic `customer_receipt` print job        |        |       |
| Full payment records staff                                        | Payment `paidBy` equals selected POS employee                    |        |       |

## Split Equally

| Case                            | Expected Result                                                | Result | Notes |
| ------------------------------- | -------------------------------------------------------------- | -----: | ----- |
| Create equal split with 2 parts | Two checks are created                                         |        |       |
| Create equal split with 3 parts | Three checks are created and cents are distributed             |        |       |
| Pay one check                   | Check becomes paid; order remains open if other checks unpaid  |        |       |
| Pay partial check amount        | Payment saves; check remains open                              |        |       |
| Pay all checks                  | Order becomes paid                                             |        |       |
| Paid check receipt              | Payment creates no automatic `customer_receipt` job            |        |       |
| Partial check receipt           | Payment creates no automatic `customer_receipt` job            |        |       |
| Cancel unpaid equal split       | Split checks become `void` and `Payer tout` is available again |        |       |
| Cancel split after paid check   | Action is disabled or rejected                                 |        |       |

## Split By Items

| Case                                                               | Expected Result                                                                                                     | Result | Notes |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | -----: | ----- |
| Open item split page                                               | Two default client columns load                                                                                     |        |       |
| Choose 3 clients on item split page                                | `Client 1` through `Client 3` assignment UI loads                                                                   |        |       |
| Equal split does not drive item split clients                      | Changing equal split parts does not change item split client count unless the item split client selector is changed |        |       |
| Assign valid item quantities                                       | Checks are created                                                                                                  |        |       |
| Assign no item                                                     | Action is rejected                                                                                                  |        |       |
| Assign more than available quantity                                | Action is rejected                                                                                                  |        |       |
| Assign total item quantity above available quantity across clients | User is returned to item split screen with an error message                                                         |        |       |
| Pay split-by-items check                                           | Check becomes paid and no receipt job is created                                                                    |        |       |
| Combo discounts apply per check                                    | Eligible check gets combo discount                                                                                  |        |       |
| Replace unpaid split mode                                          | Old unpaid checks become `void` in the database and new checks are created                                          |        |       |
| Replace split after payment                                        | Action is rejected after any split check has been paid                                                              |        |       |
| Cancel unpaid item split                                           | Split checks become `void` and `Payer tout` is available again                                                      |        |       |

## Print Jobs

| Case                                      | Expected Result                                                                                              | Result | Notes |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -----: | ----- |
| Kitchen send creates station print jobs   | Queue shows a Cuisine job when applicable and one full BAR job                                               |        |       |
| Second kitchen send prints only new items | Later kitchen ticket excludes items printed by the earlier send                                              |        |       |
| Payment creates print job                 | Payment succeeds and creates no print job                                                                    |        |       |
| Paid single receipt action                | One durable `customer_receipt` job is queued from the order snapshot                                         |        |       |
| Paid split-check receipt action           | Only the selected paid non-void check is queued                                                              |        |       |
| Unpaid receipt target                     | Target is visible for context but printing is disabled                                                       |        |       |
| Equal-split receipt                       | Receipt does not invent a full-order item allocation                                                         |        |       |
| Receipt operation retry                   | Replaying one UUIDv7 operation returns the same job                                                          |        |       |
| Active receipt de-duplication             | Repeated print intent does not create a second pending/printing target job                                   |        |       |
| Failed receipt retry                      | A new job uses the failed job's immutable receipt snapshot                                                   |        |       |
| Printed receipt reprint                   | A deliberate new job uses the printed job's immutable receipt snapshot                                       |        |       |
| Receipt printer unavailable               | Job remains queued and UI does not claim physical output                                                     |        |       |
| Non-fiscal receipt renderer               | One cut ticket says `REÇU DE PAIEMENT`, retains `Document non fiscal`, and contains no invented VAT identity |        |       |
| Configured establishment receipt          | A new source job snapshots and renders the configured local display name                                     |        |       |
| Unconfigured/legacy receipt               | Payload without the optional display name still renders with no blank identity line                          |        |       |
| Rename after receipt creation             | Retry and reprint keep the old display-name snapshot                                                         |        |       |
| Printer adapter processes pending jobs    | Job status changes to `printed`                                                                              |        |       |
| Visible queue auto-refresh                | Queue and printer status changes appear within five seconds without F5                                       |        |       |
| Hidden queue polling                      | Hidden tab stops polling and refreshes immediately when visible again                                        |        |       |
| Print queue pagination                    | Newest 10 tickets load and older pages use Previous/Next navigation                                          |        |       |
| Print queue total counters                | Status cards count the complete queue rather than only the visible page                                      |        |       |
| Printer ready status                      | Writable RFCOMM character device shows ready without opening the device                                      |        |       |
| Printer unavailable status                | Missing, invalid, or non-writable RFCOMM device shows unavailable                                            |        |       |
| Printer attention status                  | Failed or stale pending work shows attention with queue counts                                               |        |       |
| Global printer badge                      | POS shell updates summarized printer state every 15 seconds while visible                                    |        |       |
| One-printer station routing               | TM-m30 prints and fully cuts Cuisine then BAR separately                                                     |        |       |
| Disable Cuisine printing                  | New sends create no physical Cuisine ticket while BAR remains active                                         |        |       |
| Disable BAR printing                      | New sends create no physical BAR ticket while Cuisine remains active where applicable                        |        |       |
| Disable every destination                 | UI, API contract, and database reject settings with both destinations disabled                               |        |       |
| Print copy settings                       | Each station prints the configured 1 to 3 copies                                                             |        |       |
| Print font preset                         | Compact, Standard, and Large change new ticket item typography                                               |        |       |
| Dense standard ticket                     | Standard uses uppercase bold double-height item names with no extra blank line between adjacent items        |        |       |
| Prominent order type                      | Service type is centered, bold, double-height, and immediately precedes the item sections                    |        |       |
| Print spacing settings                    | Top, left, and bottom values from 0 to 8 change new ticket layout                                            |        |       |
| Compact section grouping                  | Cuisine: Entrées, Suppléments, Plats; BAR: Boissons first, Desserts last                                     |        |       |
| Full BAR batch                            | BAR ticket contains every production item in the sent batch                                                  |        |       |
| Physical station separation               | Full cut executes once after each Cuisine or BAR copy                                                        |        |       |
| Bluetooth cutter pacing                   | Body and delayed feed/full-cut use two separate RFCOMM writer phases                                         |        |       |
| Test print action                         | One test job prints and cuts samples only for currently enabled destinations                                 |        |       |
| ESC/POS punctuation                       | Curly apostrophes and dash variants print as `'` and `-`, never `?`                                          |        |       |
| Printed allergy severity                  | Intolerance, allergy, and severe-no-traces jobs render without failure                                       |        |       |
| Print settings snapshot                   | Retried old job keeps its original routing, copies, font, and spacing                                        |        |       |
| Station `none` item                       | Item is not present on the physical ticket                                                                   |        |       |
| Mark job failed manually                  | Job status changes to `failed`                                                                               |        |       |
| Retry failed job                          | Job status changes back to `pending`                                                                         |        |       |
| Reprint completed job                     | `Réimprimer` changes a printed job back to `pending` with the same snapshot                                  |        |       |
| Kitchen send is atomic                    | Forced print insert failure leaves the item pending and creates no job                                       |        |       |
| Final payment is atomic                   | Payment and paid order/check state commit without a receipt job                                              |        |       |
| Kitchen retry is idempotent               | Replaying one command UUID creates one kitchen ticket job                                                    |        |       |
| Payment retry is idempotent               | Replaying one command UUID creates one payment and no receipt job                                            |        |       |
| Concurrent full payments are serialized   | Only one competing full payment succeeds for an order                                                        |        |       |
| Cancellation versus payment is serialized | The order ends cancelled without payment or paid with one payment                                            |        |       |
| Site-agent heartbeat is healthy           | Site-agent health reports the local database available                                                       |        |       |

## Edge Offline Acceptance

| Check                                       | Expected result                                                 | Pass / Fail | Notes |
| ------------------------------------------- | --------------------------------------------------------------- | ----------- | ----- |
| Disconnect the Internet uplink only         | POS and site-agent services remain healthy                      |             |       |
| Open a new POS page over the LAN            | Page loads from the restaurant edge server                      |             |       |
| Create and edit an order                    | Writes succeed against local PostgreSQL                         |             |       |
| Send a new batch to kitchen                 | Kitchen receives it and station-specific print jobs are created |             |       |
| Record an allowed local payment             | Payment persists and no customer receipt job is created         |             |       |
| Restart POS and site-agent services         | Existing order remains available and pending jobs resume        |             |       |
| Disconnect PostgreSQL                       | Health endpoint and service strip report database unavailable   |             |       |
| Stop the POS container                      | Browser reports the local server unavailable                    |             |       |
| Restore latest backup into a drill database | Checksum, restore, migrations, and sample reads succeed         |             |       |

## Local POS Staff Management

| Case                  | Expected Result                                                    | Result | Notes |
| --------------------- | ------------------------------------------------------------------ | -----: | ----- |
| Open local staff UI   | Staff management page loads                                        |        |       |
| Create staff user     | User appears in staff list                                         |        |       |
| Edit staff user       | Name/email/role changes are saved                                  |        |       |
| Deactivate staff user | User becomes inactive and is hidden from POS selector              |        |       |
| Reactivate staff user | User becomes active and appears when role is selectable            |        |       |
| Kitchen role user     | User can be managed but is not shown in POS order creator selector |        |       |
| Manager role boundary | Manager can manage only Service and Cuisine users                  |        |       |
| Duplicate local email | Normalized duplicate email is rejected without losing form values  |        |       |
| Last active admin     | Concurrent demotion/deactivation leaves one active administrator   |        |       |
| Reset local PIN       | PIN is hashed and existing sessions are invalidated                |        |       |

## Local Establishment Management

| Case                         | Expected Result                                                                 | Result | Notes |
| ---------------------------- | ------------------------------------------------------------------------------- | -----: | ----- |
| Open establishment UI        | Authenticated admin/manager sees the current local profile                      |        |       |
| Configure first display name | A trimmed 1-80 character name is stored at revision 1                           |        |       |
| Rename display name          | Revision increments and only future source receipt jobs use the new name        |        |       |
| Empty or multiline name      | Save is rejected and no profile change persists                                 |        |       |
| Stale concurrent save        | Compare-and-set rejects it; latest baseline reloads while the draft is retained |        |       |
| Unauthorized request         | Missing or invalid local management session is rejected                         |        |       |
| Local-only boundary          | No cloud organization/establishment record, key, or database access is used     |        |       |

## Local Menu Management

| Case                   | Expected Result                                                    | Result | Notes |
| ---------------------- | ------------------------------------------------------------------ | -----: | ----- |
| Open local menu UI     | Menu management page loads                                         |        |       |
| Create category        | Category appears in POS category tabs                              |        |       |
| Create menu item       | Item appears in POS item grid when available                       |        |       |
| Edit menu item price   | New orders use new price; old order item snapshots stay unchanged  |        |       |
| Change kitchen station | New order items use updated station snapshot                       |        |       |
| Deactivate item        | Item disappears from POS item grid                                 |        |       |
| Reactivate item        | Item appears again in POS item grid                                |        |       |
| Add quick instruction  | New definition can be assigned to a category or item               |        |       |
| Add local allergen     | New allergen appears in the item allergy selector                  |        |       |
| Category inheritance   | Item without an override receives the category instruction lists   |        |       |
| Item override          | Custom item lists replace the inherited category lists             |        |       |
| Delete assigned option | Save is blocked until the option is removed from all assignments   |        |       |
| Rename selected option | Existing order keeps its snapshotted label; new order uses new one |        |       |
| Cocktail instructions  | `Sans alcool` is offered for `Cocktails & mocktails`               |        |       |

## Local Combo Management

| Case                                 | Expected Result                                          | Result | Notes |
| ------------------------------------ | -------------------------------------------------------- | -----: | ----- |
| Open local combo UI                  | Combo management page loads                              |        |       |
| Create combo rule                    | Rule appears in combo list                               |        |       |
| Add combo group                      | Group appears under rule                                 |        |       |
| Add eligible item                    | Item can be used by combo optimizer                      |        |       |
| Disable order suggestion             | Rule stays Active for discounts but leaves suggestion UI |        |       |
| Enable order suggestion              | Eligible incomplete order can show the rule suggestion   |        |       |
| Check Luna entry eligibility         | Mix LUNA is excluded from Menu Express and Menu Gourmand |        |       |
| Combo applies at full payment        | Order total reflects discount                            |        |       |
| Combo applies at split check payment | Eligible check total reflects discount                   |        |       |

## Local Operational Reports

| Case                       | Expected Result                                                    | Result | Notes |
| -------------------------- | ------------------------------------------------------------------ | -----: | ----- |
| Open local reports UI      | Reports page loads                                                 |        |       |
| Paid revenue updates       | Paid payment amount appears in daily revenue                       |        |       |
| Open order count updates   | Active orders appear in open orders count                          |        |       |
| Paid order count updates   | Paid orders appear in paid count                                   |        |       |
| Open POS order from report | Link opens the correct POS order                                   |        |       |
| Missing bearer session     | Redirects to Management login with no report body                  |        |       |
| Staff or kitchen role      | Site-agent returns 403 with no financial data                      |        |       |
| 04:59 / 05:00 boundaries   | Start is inclusive and next 05:00 is exclusive                     |        |       |
| Partial and split payments | Paid principal is summed once; parent order counts only when final |        |       |
| Refunded/pending/failed    | Rows do not contribute to paid revenue                             |        |       |
| Cancelled same-day order   | Appears in activity but not in summary metrics                     |        |       |
| Empty service              | Real zero metrics and a distinct empty list are shown              |        |       |
| More than 200 orders       | Every row remains reachable through bounded pagination             |        |       |
| Local dependency outage    | No fabricated totals; retry guidance is visible                    |        |       |
| Internet-only outage       | Report remains available while the local stack is healthy          |        |       |
| Luna timezone preflight    | Host and site-agent both resolve `Europe/Paris`                    |        |       |

## Regression Checks

| Case               | Expected Result                                     | Result | Notes |
| ------------------ | --------------------------------------------------- | -----: | ----- |
| `@yuta/core` tests | `corepack pnpm --filter @yuta/core test` passes     |        |       |
| POS typecheck      | `corepack pnpm --filter @yuta/pos typecheck` passes |        |       |
| POS build          | `corepack pnpm --filter @yuta/pos build` passes     |        |       |
| Site-agent checks  | Site-agent typecheck/tests pass                     |        |       |

## QA Notes

Use this section to record issues found during manual QA.

```txt
Date:
Tester:
Environment:

Issues:
-

Follow-up:
-
```
