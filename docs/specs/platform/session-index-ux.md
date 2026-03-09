# Session Index UX

- Status: Draft
- Date: 2026-03-08

## Purpose

Define the operator experience for the session index without expanding it into a second session client.

## Product Role

The session index is the primary daily operator console for normal use.

It is responsible for:

- showing current sessions
- creating, opening, restarting, and deleting sessions
- surfacing operator-meaningful status and failure information
- guiding the operator toward the next supported recovery step

It is not responsible for:

- replacing `opencode web`
- rendering chat history as a custom experience
- embedding a terminal client in v1

## Core Operator Flows

- first-run bootstrap check
- create a session
- open a ready session
- inspect a failed or degraded session
- restart a session
- delete a session safely

## Information Architecture

The primary view should make it easy to scan, open, and recover sessions.

Expected information per session:

- session name
- repo and branch
- status badge
- time created
- last transition or activity
- open action
- restart action
- delete action
- failure summary when relevant

## Session States

The UI should support at least these states:

- empty
- loading
- ready list
- partial degradation
- action in progress
- failed action

Per-session states should match the status model defined in `session-index-api.md`.

## Error and Recovery UX

For common failures, the UI should present:

- plain-language summary
- likely scope of the problem
- recommended next action
- escalation path if the simple action fails

The index page should be the first recovery surface. `K9s` and deeper cluster inspection are escalation tools.

## Authentication and Open-Session UX

- auth requirements must be visible without turning the UI into a password store
- the operator should be able to tell whether a failure is auth-related or session-related
- future remote gateway support must not require redesigning the UI model

## Responsive Behavior

The index page must remain usable on narrow viewports in preparation for future phone access.

Requirements:

- works at mobile widths
- avoids hover-only interaction
- uses touch-friendly action targets
- keeps session status and next action readable at reduced width

## Maintainability Guardrails

- keep orchestration logic on the backend
- keep frontend state shallow and typed
- do not duplicate `opencode web` features
- prefer simplicity and operator clarity over feature richness in v1
