# POS management printing — Product Scope

Status: Approved

Visibility: Engineering

## User goal

Allow an authenticated local manager or administrator to inspect the printer
channel and local queue, adjust supported ticket rendering settings, test
printing, and recover supported jobs without bypassing the site-agent.

## Current approved capabilities

- Safe printer-channel status and complete-queue summary.
- Paginated recent jobs with current status and error message.
- Supported job commands: start, mark printed, mark failed, retry, and reprint.
- Kitchen/BAR copy counts, font preset, and spacing settings with preview.
- Explicit test-print job creation.

## Current boundaries

This is an authenticated local POS management screen. The browser talks to the
site-agent through the existing client; the site-agent owns `@yuta/db-pos`, the
queue, settings, worker, and printer device boundary. Nothing here is a cloud
tenant capability or cloud-synchronized data.

## Approved change boundary

The reviewed UI boundary keeps the proposal 01 visual language, introduces the
dark management header on this screen by reusing the current management home
session context, `Retour au POS`, and existing sign-out action, and keeps ticket
settings collapsed below the desktop `xl` layout. Wide desktop keeps settings
and previews side by side. Queue mapping, status truth, fixed ten-job pagination,
and current actions remain unchanged. No database, API/contract,
permission/auth, cross-application, or runtime/device behavior change is
approved.

## Out of scope

Printer pairing/discovery, RFCOMM configuration, cloud sync, new queue states,
bulk operations, new roles, order mutation, payment behavior, and changes to
the worker or ticket-rendering rules are out of scope.

## Proposed capabilities requiring approval

Rollout of the new header to other management routes, a new shared shell
abstraction, mutable page size, printer configuration, new queue data, and new
interaction semantics require separate review. Proposal 02 is approved only for
the printing-screen scope documented here.

Do not present proposals as implemented behavior.

## Relationships

Jobs originate from existing local POS workflows and link to `/orders/[id]`
when an order ID exists. The local printer worker consumes eligible queued jobs.
