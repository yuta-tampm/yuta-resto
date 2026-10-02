# <Page or screen name> — UI Specification

Status: Draft design reference

Visibility: Engineering

## Authority and target

State the target application, real route/screen, `NEW_PAGE`/`EXISTING_PAGE`
classification, and implementation class.

The implementation and current product documentation remain behavior authority. Visual references guide hierarchy and proportions only.

## Shared UI context

Record the resolved global, application, and section/flow context that this
target inherits. Identify shell/navigation mode, shared references, elements to
reuse exactly, allowed responsive adaptations, and excluded shared changes.

## Current baseline

Describe the current shell, layout, components, runtime states, and high-level
behavior discovered in Phase 0.

## Visual hierarchy

Define the title/context area, primary task surface, primary and secondary
actions, main sections, supporting information, and priority of status/error
information.

Do not add breadcrumb, sidebar, dashboard summary, toolbar, or navigation
solely because it appears in a reference image.

## Content and copy

Define approved UI labels in the language required by the target application.
Do not invent domain labels unsupported by product documentation.

## Service-time / interaction density

For an operational application, specify intended density, touch priority,
action reachability, and information scan order. Omit when not applicable.

## Responsive behavior

Use the viewport or device matrix from target-application rules or current
product/operator documentation. If the page needs a different measured target,
state it here with the reason. Do not inherit Backoffice widths automatically.

## Accessibility

Define focus, keyboard/touch behavior, labels, errors, status text, dialogs,
disabled/pending states, and target-size needs appropriate to the screen.

## Visual acceptance

Identify the `APPROVED` reference or explicit no-image decision. List measurable
visual outcomes and intentional deviations from the approved visual state.

## Out of scope

List backend, schema, runtime, device, shell, and unrelated changes excluded
from this UI pass.
