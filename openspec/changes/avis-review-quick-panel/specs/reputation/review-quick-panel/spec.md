## Purpose

Provide quick viewing and processing of an Avis item in a right-side modal while keeping the current list and its navigation context behind it.

## ADDED Requirements

### Requirement: Explicit selection opens the quick panel

The Avis page SHALL open a modal sliding in from the right when the user selects a review, replacing inline detail. Without explicit selection the page SHALL show the list without automatically opening the modal. A URL containing `selected` SHALL open the modal for that selection. While loading a new item, the modal SHALL NOT display the previous item's content. An inaccessible selected item SHALL have a truthful unavailable state.

#### Scenario: Open an item from the list

- **WHEN** a user selects a review in the list
- **THEN** the right-side modal SHALL open for that item and no inline detail SHALL appear below or beside the list

#### Scenario: Initial list and direct link

- **WHEN** a user visits Avis without `selected` and then visits a URL containing `selected`
- **THEN** the first visit SHALL show only the list and the second SHALL open the requested review or its unavailable state

### Requirement: Closing preserves the list context

Opening and closing the modal SHALL preserve filters, ordering, pagination and list scroll position. An accessibly named close button, Escape and backdrop dismissal SHALL return to the list. After opening from a row, focus SHALL return to that row when it still exists. Filter/search/pagination SHALL retain existing semantics. Closing SHALL NOT automatically Save or publish.

#### Scenario: Process a review on a later page

- **WHEN** a user opens and closes an item from page 2 of a filtered list
- **THEN** page 2, filters and list scroll position SHALL remain, and focus SHALL return to the opening row

### Requirement: Existing processing remains usable in the panel

The modal SHALL expose the same review information and authorized existing status/assignee, manual-draft and internal-note actions. Saves SHALL retain current validation, pending/success/error feedback and persistence. While open, the modal SHALL preserve the selected item and unsaved input across revalidation/retrieval. Server permissions, tenant scope and provider semantics SHALL remain unchanged, without enabling new publication or AI behavior.

#### Scenario: Save a manual draft

- **WHEN** an authorized user saves a draft in the modal
- **THEN** pending and success SHALL be visible, the modal SHALL stay open for the same review, and the draft SHALL persist across reload

#### Scenario: Preserve unsubmitted writing during a local save

- **WHEN** a user has an unsaved draft and saves an internal note for the same review
- **THEN** the modal SHALL preserve the unsaved draft and selected review while the note persists

### Requirement: Accessible responsive quick processing

The modal SHALL have an accessible name, description, focus containment and keyboard operation. Its content SHALL scroll within the modal while header/close remain accessible. Mobile SHALL use the screen width. At 1440/1024/768/390, processing controls SHALL remain accessible without horizontal overflow or clipping. Satisfaction SHALL retain its existing layout and semantics.

#### Scenario: Mobile keyboard and scroll

- **WHEN** a user opens a review at 390px, scrolls to the editor and uses keyboard/close
- **THEN** content and Save SHALL be accessible, focus SHALL stay in the open modal and return to the list after closing
