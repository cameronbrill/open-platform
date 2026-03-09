---
title: "Session Index and Operator UX"
doc_id: "PLAN-005"
doc_type: "plan"
status: "draft"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Thin operator-facing session console, API contract, and recovery UX for the platform."
aliases:
  - "Plan 05"
  - "Session Index and Operator UX Plan"
tags:
  - "plan"
  - "session-index"
  - "ux"
  - "api"
  - "operator-console"
source_of_truth: "execution-plan"
scope: "thin operator-facing session management UI, explicit API contract, and recovery commands"
depends_on:
  - "docs/plans/04-session-runtime.md"
blocks:
  - "docs/plans/06-observability-and-hardening.md"
related_docs:
  - "docs/adr/0006-session-index-stack-and-api-boundary.md"
  - "docs/adr/0007-testing-strategy-and-inner-feedback-loops.md"
  - "docs/specs/platform/session-index-api.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/session-index-ux.md"
  - "docs/specs/platform/tech-spec.md"
---

# Session Index and Operator UX

## Purpose

Provide the single-user operator with the supported UX for normal platform use.

## In Scope

- thin session index page
- typed frontend/backend API contract
- session lifecycle commands
- local URL discovery
- operator recovery commands
- normal day-to-day UX

## Out of Scope

- richer custom chat UX beyond `opencode web`
- SSR in v1
- `React Router` in v1
- remote or mobile access beyond responsive readiness

## Deliverables

- `apps/session-index/`
- [Session Index API](../specs/platform/session-index-api.md)
- [Session Index UX](../specs/platform/session-index-ux.md)
- session lifecycle `mise` commands
- `mise run session:create`
- `mise run session:list`
- `mise run session:delete`
- `mise run session:open`
- `mise run session:logs`
- `mise run cluster:reset`

## Tasks

### Frontend / Backend Boundary

- implement the chosen Go backend and TypeScript frontend boundary
- keep orchestration logic on the backend
- keep the frontend thin and typed
- allow static frontend assets in v1 if they preserve the thin operator-console model
- verify this boundary through contract and behavior tests rather than implementation-coupled tests

### API Contract

- finalize session resource shape
- finalize create/list/open/restart/delete contract
- ensure the UI consumes typed backend data rather than backend implementation details
- define canonical contract scenarios alongside the API spec

### Behavior-First TDD Workflow

- write failing behavior-oriented tests before implementation at the smallest useful layer
- prefer contract and component tests before reaching for full end-to-end coverage
- keep tests focused on operator-visible behavior and stable contracts
- require contract tests for API behavior changes and component or interaction tests for operator-visible UI behavior changes

### State, Error, and Loading UX

- define session state model
- define loading, empty, and error states
- define operator-facing failure and retry behavior
- require behavior coverage for visible state transitions and recovery affordances

### Responsive and Mobile Behavior

- make the index usable on narrow viewports
- avoid hover-only interaction
- keep the operator mental model simple
- cover responsive behavior with focused UI behavior tests rather than broad snapshots

### Auth and Open-Session UX

- clarify how the operator opens authenticated sessions
- keep the index page from becoming a general-purpose secret vault
- distinguish auth failures from session failures in UI messaging

### Operator Commands and Recovery UX

- ensure all supported flows exist behind `mise`
- make scripts internal, not public entrypoints
- implement `cluster:doctor`, `cluster:reset`, and session log retrieval
- document the supported recovery path
- Tilt may optionally accelerate slow integration loops, but does not replace the supported `mise` operator path

## Validation

- normal operator use no longer requires raw manifest management
- the API contract covers the supported operator flows
- the index page is enough for common workflows
- the documented recovery path works
- the index remains thin and does not duplicate `opencode web`
- behavior-focused tests cover create, open, restart, delete, and recovery flows at appropriate layers
- narrow-width and auth-failure behavior are covered at appropriate layers

## Exit Criteria

- normal daily workflow is coherent and low-friction
- operator can create, open, delete, and recover sessions with supported interfaces
- the frontend/backend contract is stable enough to guide implementation
- UI behavior coverage exists for operator-visible states and major flows

## Risks / Notes

- keep the index page intentionally thin; if it starts duplicating `opencode web`, scope is drifting
