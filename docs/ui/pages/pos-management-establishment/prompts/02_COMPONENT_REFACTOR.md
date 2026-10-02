# Codex Prompt — Phase 2: Component Structure

Begin only after the product scope and visual reference are approved. Keep the
page under `management/establishment`, reuse the approved Management shell and
`@yuta/ui`, default to Server Components, and isolate only the form interaction
that needs a client boundary. Do not promote POS-domain components to
`@yuta/ui` or redefine the shared header/navigation.

Preserve the local session/runtime boundary and make no contract/schema/receipt
change in this phase unless a separately approved vertical-slice plan explicitly includes it.
