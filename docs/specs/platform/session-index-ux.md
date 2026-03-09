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
  - "docs/adr/0005-session-exposure-and-routing.md"
  - "docs/adr/0006-session-index-stack-and-api-boundary.md"
  - "docs/specs/platform/session-index-api.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/tech-spec.md"
---

# Session Index UX

## Purpose

Define the operator experience for the session index without expanding it into a second session client.

This document is also the source of truth for behavior-oriented UI tests.

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

### First-Run Bootstrap Check

- start state: operator opens the index with no confirmed runtime availability yet
- success state: index confirms backend reachability and can render the session list or an empty state
- failure state: index presents a clear platform-not-ready message with the next supported recovery step

### Create Session

- start state: operator sees the create form from the main index view
- success state: new session appears immediately in a transient status and converges toward `ready`
- failure state: validation or substrate errors are shown inline with safe, actionable messaging

### Open Ready Session

- start state: session is `ready`
- success state: operator opens the backend-resolved `openUrl`
- failure state: if open bootstrap fails, the operator gets auth-specific or session-specific guidance without raw secret exposure

### Inspect Failed Or Degraded Session

- start state: session is `degraded` or `failed`
- success state: operator can understand the likely problem scope and next supported action

### Restart Session

- start state: session is `ready`, `degraded`, or `failed`
- success state: session enters a visible transient state and later settles into `ready` or `failed`

### Delete Session

- start state: operator chooses delete from the list view
- success state: confirmation explains the cleanup consequence and the session leaves the list after delete completes

## Information Architecture

The primary view must make it easy to scan, open, and recover sessions.

Per-session information must include:

- session name
- repo and ref
- status badge
- time created
- last transition time
- open action
- restart action
- delete action
- failure summary when relevant

## UI States

### Page-Level States

- bootstrap-check in progress
- empty list
- loading list
- ready list
- partial degradation
- platform unavailable

### Per-Session States

- matches the status model from [Session Index API](session-index-api.md)
- transient states must disable or limit conflicting actions where necessary
- `degraded` and `failed` states must show the next supported action or escalation path

## Error And Recovery UX

For common failures, the UI should present:

- plain-language summary
- likely scope of the problem: session, auth, or substrate
- recommended next action
- escalation path if the simple action fails

The index page is the first recovery surface. `K9s`, logs, and deeper cluster inspection are escalation tools, not the default first step.

## Async And Refresh Behavior

- the UI tolerates eventual consistency between requested actions and platform state
- in-progress actions have visible pending states
- stale data converges toward the documented state model without manual refresh for the happy path
- tests assert stable operator-visible outcomes rather than exact polling cadence

## Authentication And Open-Session UX

- auth requirements must be visible without turning the UI into a password store
- the frontend consumes backend-resolved open-session behavior and must not guess URLs or manage reusable credentials directly
- a ready session open flow may rely on backend-managed HTTP-only cookie bootstrap or an equivalent non-secret transport
- auth failure messaging must be distinguishable from session startup or substrate failure messaging

## Responsive Behavior

The index page must remain usable on narrow viewports in preparation for future phone access.

Requirements:

- works at mobile widths
- avoids hover-only interaction
- uses touch-friendly action targets
- keeps session status and next action readable at reduced width
- tolerates long repo names, many sessions, and multiple degraded sessions without hiding the next supported action

## Canonical Behavior Scenarios

- empty session list
- loading session list
- successful session creation
- validation failure during session creation
- ready session open flow
- not-ready open flow
- degraded or failed session with recovery guidance
- auth failure distinguished from session failure
- restart flow with visible in-progress and completion states
- delete flow with confirmation and consequence messaging
- stale state converging to the correct operator-visible outcome
- narrow-width usability

## Test Traceability

- operator-visible list and form states map to component or integration tests
- open-session, restart, delete, and recovery flows map to integration or end-to-end tests as needed
- auth-vs-session failure distinction maps to contract plus component or integration coverage

## Maintainability Guardrails

- keep orchestration logic on the backend
- keep frontend state shallow and typed
- do not duplicate `opencode web` features
- prefer simplicity and operator clarity over feature richness in v1
