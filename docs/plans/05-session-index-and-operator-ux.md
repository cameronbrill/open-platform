---
title: "Session Index and Operator UX"
doc_id: "PLAN-005"
doc_type: "plan"
status: "draft"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Thin operator-facing session console implemented against the approved API and UX contracts, with supported recovery guidance."
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
scope: "thin operator-facing session management UI, explicit API contract implementation, and recovery commands"
depends_on:
  - "docs/plans/04-session-runtime.md"
blocks:
  - "docs/plans/06-observability-and-hardening.md"
related_docs:
  - "docs/adr/0005-session-exposure-and-routing.md"
  - "docs/adr/0006-session-index-stack-and-api-boundary.md"
  - "docs/adr/0007-testing-strategy-and-inner-feedback-loops.md"
  - "docs/specs/platform/session-index-api.md"
  - "docs/specs/platform/session-index-ux.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/tech-spec.md"
---

# Session Index and Operator UX

## Purpose

Provide the single-user operator with the supported UX for normal platform use.

## In Scope

- thin session index page
- implementation against the approved typed frontend/backend API contract
- session lifecycle commands
- local URL discovery through backend-owned `openUrl` behavior
- operator recovery guidance for normal day-to-day use

## Deliverables

- `apps/session-index/`
- maintained [Session Index API](../specs/platform/session-index-api.md)
- maintained [Session Index UX](../specs/platform/session-index-ux.md)
- `mise run session:create`
- `mise run session:list`
- `mise run session:open`
- `mise run session:restart`
- `mise run session:delete`
- `mise run session:logs`

## Tasks

### Docs-First Boundary Work

- confirm implementation matches the approved API spec
- confirm implementation matches the approved UX spec
- update the specs before shipping behavior changes when the contract changes

### Thin Frontend And Backend Implementation

- keep orchestration logic on the backend
- keep the frontend thin and typed
- use static frontend assets in v1 if they preserve the thin operator-console model
- verify the boundary through contract and operator-visible behavior tests

### State, Error, And Loading UX

- implement documented session state rendering
- implement loading, empty, and error states
- implement recovery guidance for degraded and failed sessions

### Auth And Open-Session UX

- consume backend-resolved open-session behavior from Plan 04
- keep the index page from becoming a secret vault
- distinguish auth failures from session failures in UI messaging

### Operator Commands And Recovery UX

- ensure supported flows exist behind `mise`
- treat scripts as internal implementation details, not public entrypoints
- document the supported recovery path for common session failures

## Validation

- normal operator use no longer requires raw manifest management
- the API contract covers the supported operator flows
- the index remains thin and does not duplicate `opencode web`
- contract drift is caught by tests when behavior changes
- auth-failure and session-failure behavior are distinguishable to the operator

## Exit Criteria

- normal daily workflow is coherent and low-friction
- operator can create, open, restart, delete, and recover sessions with supported interfaces
- the frontend/backend contract is stable enough to guide implementation and tests
- UI behavior coverage exists for operator-visible states and major flows
