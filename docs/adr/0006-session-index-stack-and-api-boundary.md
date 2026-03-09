---
title: "ADR-0006: Session Index Stack and API Boundary"
doc_id: "ADR-0006"
doc_type: "adr"
status: "accepted"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Use a Go backend, thin TypeScript frontend, and an explicit API contract that must be documented and tested before UI behavior ships."
aliases:
  - "Session Index Stack and API Boundary"
tags:
  - "adr"
  - "session-index"
  - "api"
  - "go"
  - "typescript"
source_of_truth: "durable-decision"
related_docs:
  - "docs/specs/platform/tech-spec.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/session-index-api.md"
  - "docs/specs/platform/session-index-ux.md"
  - "docs/specs/platform/repository-tooling.md"
  - "docs/plans/05-session-index-and-operator-ux.md"
  - "docs/adr/0007-testing-strategy-and-inner-feedback-loops.md"
supersedes: []
superseded_by: []
---

# ADR-0006: Session Index Stack and API Boundary

## Context

The platform needs a thin operator-facing session index that manages session lifecycle without duplicating the actual session experience provided by `opencode web`.

## Decision

Use the following v1 direction for the session index application:

- backend code prefers `Go`
- frontend code prefers `TypeScript`
- an explicit typed API contract must be documented before UI implementation ships against that behavior
- the API contract is also a contract-test artifact for backend/frontend behavior
- v1 avoids SSR
- v1 avoids `React Router`
- a thin frontend served as static assets is acceptable in v1

## Boundary Rules

- the backend owns Kubernetes interaction, validation, session orchestration, URL resolution, and normalized status mapping
- the frontend owns rendering, local interaction state, and typed API consumption
- undocumented backend fields, statuses, and error shapes are out of bounds for the frontend
- the session index must not become a custom chat or terminal client

## Enforcement Rules

- backend behavior changes at the session-index boundary must update the API spec before merge
- operator-visible UX changes must update the UX spec before merge
- contract tests are required to detect drift between backend behavior and the documented boundary
- CI and local validation must use the documented repo-owned task surface for those checks

## Rationale

- `Go` fits control-plane and Kubernetes-heavy backend work well
- `TypeScript` gives the frontend a strict type system without forcing a heavy client architecture
- explicit contracts early reduce backend/frontend coupling and make future refactors easier
- avoiding SSR and routing complexity keeps the v1 operator surface smaller

## Follow-Up

- define the detailed API contract in [Session Index API](../specs/platform/session-index-api.md)
- define the detailed UI model in [Session Index UX](../specs/platform/session-index-ux.md)
- define the testing and gate policy in [Testing Strategy](../specs/platform/testing-strategy.md)
