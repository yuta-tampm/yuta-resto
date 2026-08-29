# YUTA Display Product Knowledge

Visibility: Engineering

Owner: YUTA engineering and restaurant operations

Proposed: 2026-08-27

## 1. Purpose

YUTA Display is a standalone restaurant-local digital-signage product. The
same application provides a French administration surface for media and
playlist ordering plus a fullscreen playback surface intended for a restaurant
display device.

The current player loops active images and videos, skips media that fails to
load, and retains its last successful in-memory playlist when a periodic
backend/database refresh fails. This bounded resilience does not make Display
indefinitely offline.

Display is neither Cloud Backoffice nor POS. It owns its runtime, PostgreSQL
metadata, and uploaded-media storage inside its own bounded context and shares
no database with cloud or POS runtimes.

This file is the canonical Product Knowledge entry point for Display. It does
not replace executable schemas, code and tests,
deployment and operations procedures, device/site evidence, or future
normative OpenSpec specifications.

## 2. Runtime boundary

```text
Display admin / playback -> apps/yuta-display
                           -> apps/yuta-display/src/db
                           -> Display PostgreSQL database
                           -> app-owned persistent upload directory
```

- `apps/yuta-display` owns the administration, media APIs, upload handling,
  playback UI, application runtime, and file-serving boundary.
- Server code under `apps/yuta-display/src/db` owns Display database access
  through `DISPLAY_DATABASE_URL`.
- Display does not import or depend on `packages/db-cloud` or
  `packages/db-pos`.
- Site Agent has no Display ownership or dependency.
- Current sources establish no synchronization with cloud Establishment, POS,
  or another Display installation.

## 3. Current bounded scope

Verified repository implementation includes:

- image (`JPEG`, `PNG`, `WEBP`) and video (`MP4`) upload with MIME and size
  checks, unique generated filenames, and app-owned filesystem storage;
- persisted media metadata for title, media type, file reference, duration,
  display order, active state, and timestamps;
- a French admin UI for upload, listing, preview, title/duration/order editing,
  activation/deactivation, deletion, and opening the playback surface;
- an implicit playlist composed of active media ordered by `sortOrder` and
  creation time; there is no separate playlist entity;
- fullscreen-oriented playback with a black background, timed images, muted
  inline video, continuous looping, next-image preloading, and broken-media
  skipping;
- a 60-second playlist refresh that keeps the current in-memory playlist when
  refresh fails; and
- production container configuration for a dedicated database connection and
  persistent upload bind mount.

No application health/readiness route or current Display test suite was found.
Database container health in development and documented deployment checks do
not replace application or device readiness evidence.

## 4. Capability map

| Capability / Scope    | Current boundary                                                                                                  | Owner                                     |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Media upload          | Validates supported MIME/size, generates a filename, and writes one file to the configured upload directory.      | Display upload API and filesystem.        |
| Media metadata        | Persists the file reference and presentation metadata in `display_media`.                                         | Display service and app-owned DB.         |
| Playlist management   | Admin edits active state and numeric order; active rows ordered by order/creation time form the playlist.         | Display admin/API and DB.                 |
| Playback              | Fetches the active projection, loops images/videos, applies image duration, and skips media-load failures.        | Display player in the browser.            |
| Resilience / fallback | Keeps the last successful playlist in browser memory when a later refresh fails; no durable browser cache exists. | Display player.                           |
| Administration        | Local French media-management UI and mutation APIs; no application authentication is currently implemented.       | Display app; access control needs review. |
| Storage / database    | Stores metadata in dedicated PostgreSQL and media files in the configured persistent upload directory.            | `apps/yuta-display`.                      |

## 5. Lifecycle summary

The bounded status below reuses the approved Module Registry. It describes
repository implementation, not deployment to a specific restaurant or device.

| Capability / Scope      | Product Decision | Implementation | Environment  | Production Readiness | External Dependency                                       | Review Marker                                                                 |
| ----------------------- | ---------------- | -------------- | ------------ | -------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Display bounded product | `APPROVED`       | `IMPLEMENTED`  | `UNVERIFIED` | `NOT_ASSESSED`       | `UNVERIFIED` — device/site evidence is not available here | `NEEDS REVIEW` — admin security and media-file lifecycle evidence remain open |

## 6. Data ownership

| Data / concern          | Owner                                              | Notes                                                                                                     |
| ----------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Media metadata          | `apps/yuta-display/src/db`                         | `display_media` is the sole current Display table and authoritative metadata source.                      |
| Playlist and order      | `display_media` active state and `sortOrder`       | The playlist is a query projection, not a separate persisted playlist record.                             |
| Uploaded media files    | Display app-owned upload directory                 | Files live outside PostgreSQL and require a persistent volume/bind mount plus separate backup.            |
| Playback position/state | Display browser memory                             | Current item index and last successful playlist are transient and are not persisted.                      |
| API response cache      | HTTP/browser intermediaries under response headers | The active playlist response permits bounded caching; it is not an authoritative or durable data store.   |
| Admin client list state | Admin browser memory                               | A failed refresh keeps the stale list for that session; persisted authority remains the Display database. |

`apps/yuta-display/src/db` is the app-owned persistence boundary. Cloud
`packages/db-cloud`, POS `packages/db-pos`, and Site Agent own none of this
metadata, file storage, playback state, or device context.

## 7. Cloud and POS separation

- Display is a separate runtime, persistence, migration, credential, upload,
  backup, and failure domain.
- Display uses only `DISPLAY_DATABASE_URL`; it does not use cloud or POS
  database packages or URLs.
- No approved synchronization exists between Display and Cloud Establishment,
  Backoffice, POS, Site Agent, or their user models.
- Sharing a PostgreSQL host or Docker network does not authorize database
  access or data sharing.
- Agents must not join, copy, mirror, or synchronize records across these
  runtimes. Any future integration requires a separately accepted decision,
  explicit contracts, ownership, security, and failure behavior.

## 8. Playback and resilience boundary

The authoritative playlist is the current active, ordered projection from
`display_media`. The player fetches a minimized projection on initial mount and
every 60 seconds. A successful response replaces browser state; image timing
or video completion advances the in-memory index and loops the list.

If a later playlist fetch fails, returns a non-success response, or does not
produce an array, the player retains the last successful in-memory playlist.
If one image or video fails to load, playback advances to the next item.

This resilience is transient only:

- there is no persisted browser playlist cache or service-worker media cache;
- an initial fetch failure has no last-known playlist and shows the empty
  fallback;
- a browser reload, device restart, process outage, inaccessible upload volume,
  or sufficiently broad local failure is not covered by in-memory fallback;
- broken-media skipping does not prove the remaining files are locally
  available or playable on a particular device.

Repository behavior therefore does not prove continuous playback or deployment
readiness on Samsung The Frame or another target device.

## 9. Media and storage boundary

The upload API accepts one supported media file, enforces the current 10 MB
image or 300 MB video limit, generates a collision-resistant filename, and
writes it to `UPLOAD_DIR` (or the development fallback directory). A separate
client request then creates the corresponding database record. Production
operations must mount that directory persistently and back up both the
database and uploaded files.

Deletion currently looks up the record, attempts to delete its physical file
while treating an already-missing file as acceptable, then deletes the metadata
record. The upload and metadata-create steps are not one atomic operation; a
failed metadata request can leave an orphan file. File/database consistency,
orphan reconciliation, retention, storage capacity, and verified backup/restore
remain `NEEDS REVIEW` rather than being inferred as complete.

## 10. Security and admin boundary

The current MVP implements no application authentication or roles for
`/admin`, upload, or media mutation APIs. Existing documentation assumes the
app is reachable only from a trusted local network or Tailscale and must not be
publicly exposed. That is an operational assumption, not authorization enforced
by the current application.

Input schemas validate supported mutation shapes and the upload route checks
reported MIME type and size, but browser/client values do not establish a
trusted user, site, or ownership context. There is no cloud-auth, POS-auth, or
Site Agent integration. Authentication, authorization, auditability, network
exposure controls, and security review remain `NEEDS REVIEW` before expanding
access beyond the explicitly controlled local deployment.

## 11. Related modules and runtimes

| Related module/runtime | Current relationship                                                                            | Source of truth / direction                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Cloud Backoffice       | No current data, identity, administration, or synchronization relationship.                     | Runtime/database architecture and current imports.              |
| Establishment          | No current cloud Establishment profile consumption or synchronization.                          | Establishment Product Knowledge and Display code.               |
| POS                    | Separate local product and database; no catalog, order, payment, user, or device-state sharing. | POS Product Knowledge and database boundaries.                  |
| Site Agent             | No runtime, API, persistence, printing, or device dependency.                                   | Site Agent Product Knowledge and current Display manifest/code. |

## 12. Current limitations and non-goals

- No cloud synchronization, cloud Establishment integration, or remote cloud
  content management is implemented or approved.
- No POS database sharing, POS catalog reuse, or Site Agent dependency exists.
- Repository implementation does not prove a Display instance, upload volume,
  database, network, or target device is deployed and healthy.
- In-memory fallback is not unlimited offline playback and does not survive a
  browser/device restart.
- The current app has no application authentication, roles, audit history, or
  fleet-level access control.
- No multi-site or multi-device fleet management, device enrollment,
  orchestration, monitoring, or remote-update capability is claimed.
- There is no dedicated application health/readiness endpoint.
- File/database reconciliation, retention, capacity management, and tested
  backup/restore remain unresolved.

## 13. Source map

| Question                                             | Read this source                                                                                                                                                                                                               |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| What is the Display product and bounded context?     | This Product Knowledge home.                                                                                                                                                                                                   |
| What detailed MVP behavior was intended?             | [`apps/yuta-display/docs/MVP.md`](../../../apps/yuta-display/docs/MVP.md).                                                                                                                                                     |
| What is implemented now?                             | [`apps/yuta-display`](../../../apps/yuta-display), especially [`src/app`](../../../apps/yuta-display/src/app), [`src/services`](../../../apps/yuta-display/src/services), and [`src/db`](../../../apps/yuta-display/src/db).   |
| Who owns Display persistence and runtime boundaries? | [`DATABASE_BOUNDARIES.md`](../../architecture/DATABASE_BOUNDARIES.md), [ADR-001](../../decisions/ADR-001-runtime-families-and-product-visibility.md), and [ADR-003](../../decisions/ADR-003-database-ownership-boundaries.md). |
| What lifecycle assignment is approved?               | [`MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md) and [`LIFECYCLE_STATUS_MODEL.md`](../../LIFECYCLE_STATUS_MODEL.md).                                                                                                           |
| How should conflicting evidence be interpreted?      | [`AUTHORITY_MODEL.md`](../../AUTHORITY_MODEL.md).                                                                                                                                                                              |
| How is Display deployed and its media persisted?     | [`apps/yuta-display/DEPLOY.md`](../../../apps/yuta-display/DEPLOY.md) and [`DEPLOYMENT.md`](../../operations/DEPLOYMENT.md).                                                                                                   |
| Is a particular device/site production-ready?        | [`PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md) plus dated deployment, database, upload-volume, network, backup/restore, and playback evidence.                                                          |

## 14. Agent interpretation rules

1. Treat Display as a separate bounded runtime and persistence domain.
2. Do not use cloud or POS databases for Display data without an accepted
   decision.
3. Do not infer Site Agent ownership or dependency.
4. Do not infer cloud/POS synchronization, Establishment integration, or shared
   identity.
5. Do not treat repository implementation, a successful build, or local
   playback as device/site readiness.
6. Do not infer Product Decision from code, routes, schema, or task history.
7. Keep transient in-memory resilience separate from unlimited offline or
   restart-safe playback guarantees.
8. When sources conflict or evidence is insufficient, apply the Authority
   Model and retain `NEEDS REVIEW`; do not normalize by assumption.
9. OpenSpec is not currently normative for Display.

## 15. OpenSpec position

There is no normative Display specification under `openspec/specs/` today.
This home retains broader product, runtime, data-ownership, media-storage, and
resilience context. After YUTA explicitly approves OpenSpec specifications as
normative, approved specs may become the primary authority for specific
behavioral requirements inside accepted boundaries. Accepted runtime and
database decisions remain the highest authority for their durable boundaries.
No OpenSpec artifact is created or modified by this step.

## 16. Status

Status: APPROVED
