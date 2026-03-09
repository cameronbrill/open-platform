---
title: "Session Index UX"
doc_id: "SPEC-PLATFORM-UX-001"
doc_type: "spec"
status: "draft"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Operator-facing UX model, states, and responsive behavior for the session index."
aliases:
  - "Session UX"
  - "Session Index UX"
tags:
  - "spec"
  - "ux"
  - "session-index"
  - "operator-console"
source_of_truth: "implementation-requirements"
related_docs:
  - "docs/specs/platform/tech-spec.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/session-index-api.md"
  - "docs/adr/0006-session-index-stack-and-api-boundary.md"
  - "docs/adr/0007-testing-strategy-and-inner-feedback-loops.md"
  - "docs/plans/05-session-index-and-operator-ux.md"
---

# Session Index UX

## Purpose

Define the operator experience for the session index without expanding it into a second session client.

This document is also the source of truth for behavior-oriented UI tests.

## Related Documents

- [Open Platform Technical Specification](tech-spec.md)
- [Testing Strategy](testing-strategy.md)
- [Session Index API](session-index-api.md)
- [ADR-0006: Session Index Stack and API Boundary](../../adr/0006-session-index-stack-and-api-boundary.md)
- [ADR-0007: Testing Strategy and Inner Feedback Loops](../../adr/0007-testing-strategy-and-inner-feedback-loops.md)
- [Session Index and Operator UX Plan](../../plans/05-session-index-and-operator-ux.md)

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

These are behavior scenarios that tests should cover at the smallest useful layer.

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

Per-session states should match the status model defined in [Session Index API](session-index-api.md).

Tests should assert operator-visible behavior for each state rather than implementation details of how that state is rendered internally.

## Error and Recovery UX

For common failures, the UI should present:

- plain-language summary
- likely scope of the problem
- recommended next action
- escalation path if the simple action fails

The index page should be the first recovery surface. `K9s` and deeper cluster inspection are escalation tools.

Tests should verify that common failures produce operator-meaningful guidance and a clear next action.

## Async And Refresh Behavior

- the UI should tolerate eventual consistency between requested actions and platform state
- in-progress actions should have visible pending states
- stale data should converge toward the documented state model rather than requiring manual page reloads for the happy path
- tests should assert stable operator-visible outcomes rather than exact timing or polling cadence

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

## Behavior Test Scenarios

Canonical behavior scenarios include:

- empty session list
- loading session list
- successful session creation
- validation failure during session creation
- ready session open flow
- degraded or failed session with recovery guidance
- auth failure distinguished from session failure
- restart flow with visible in-progress and completion states
- delete flow with confirmation and consequence messaging
- stale or eventually consistent state converging to the correct operator-visible outcome
- mobile or narrow-width usability

## Maintainability Guardrails

- keep orchestration logic on the backend
- keep frontend state shallow and typed
- do not duplicate `opencode web` features
- prefer simplicity and operator clarity over feature richness in v1
- avoid tests that couple to private component state, incidental DOM structure, or backend implementation artifacts
