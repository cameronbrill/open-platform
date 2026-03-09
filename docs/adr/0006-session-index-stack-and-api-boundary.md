---
title: "ADR-0006: Session Index Stack and API Boundary"
doc_id: "ADR-0006"
doc_type: "adr"
status: "accepted"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Use a Go backend, thin TypeScript frontend, and explicit API contract before UI implementation for the session index."
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
  - "docs/plans/05-session-index-and-operator-ux.md"
  - "docs/adr/0007-testing-strategy-and-inner-feedback-loops.md"
supersedes: []
superseded_by: []
---

# ADR-0006: Session Index Stack and API Boundary

## Context

The platform needs a thin operator-facing session index that manages session lifecycle without duplicating the actual session experience provided by `opencode web`.

The operator wants:

- strong typing wherever possible
- an explicit frontend/backend API contract early to avoid premature coupling
- a backend technology with strong security, memory safety, type safety, and performance characteristics
- to avoid SSR and `React Router` complexity in v1

The decision is evaluated against these criteria:

- thin-UI fit for an operator console
- clarity of the frontend/backend boundary
- strict typing support
- maintainability for a single operator-maintainer
- responsive/mobile readiness
- auth and future gateway compatibility
- operational simplicity inside the VM and cluster environment

## Decision

Use the following v1 direction for the session index application:

- backend code prefers `Go`
- frontend code prefers `TypeScript`
- an explicit typed API contract must be documented before UI implementation
- the API contract is also a contract-test artifact for backend/frontend behavior
- v1 avoids SSR
- v1 avoids `React Router`
- a thin frontend served as static assets is acceptable in v1

Boundary rules:

- the backend owns Kubernetes interaction, validation, session orchestration, URL resolution, and normalized status mapping
- the frontend owns rendering, local interaction state, and typed API consumption
- the session index must not become a custom chat or terminal client

## Rationale

- `Go` fits control-plane and Kubernetes-heavy backend work well
- `TypeScript` gives the frontend a strict type system without forcing a heavy client architecture
- explicit contracts early reduce backend/frontend coupling and make future refactors easier
- avoiding SSR and routing complexity keeps the v1 operator surface smaller

## Alternatives Considered

### React Router in v1

Rejected because:

- it increases client routing and state complexity without clear v1 benefit

### SSR in v1

Rejected because:

- it adds implementation complexity that is not required for a thin operator console

### Rust backend as the default

Not chosen as the default because:

- it is viable, but `Go` has a simpler path for this Kubernetes-heavy control-plane surface in v1

## Consequences

### Positive

- clear frontend/backend contract
- strong typing across both sides of the operator UI
- lower risk of the index UI growing into a second session client
- lower risk of brittle test suites that overfit to backend/frontend implementation details

### Negative

- requires API and state-model design earlier in the implementation sequence
- future richer UI work may revisit routing or frontend architecture

## Follow-Up

- define the detailed API contract in [Session Index API](../specs/platform/session-index-api.md)
- define the detailed UI model in [Session Index UX](../specs/platform/session-index-ux.md)
- define the testing policy in [Testing Strategy](../specs/platform/testing-strategy.md)
- require contract-test coverage for the session index API boundary
