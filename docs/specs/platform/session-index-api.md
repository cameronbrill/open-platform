---
title: "Session Index API"
doc_id: "SPEC-PLATFORM-API-001"
doc_type: "spec"
status: "draft"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Typed frontend and backend API contract for the session index."
aliases:
  - "Session API"
  - "Session Index Contract"
tags:
  - "spec"
  - "api"
  - "session-index"
  - "contract"
source_of_truth: "implementation-requirements"
related_docs:
  - "docs/specs/platform/tech-spec.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/session-index-ux.md"
  - "docs/adr/0006-session-index-stack-and-api-boundary.md"
  - "docs/adr/0007-testing-strategy-and-inner-feedback-loops.md"
  - "docs/plans/05-session-index-and-operator-ux.md"
---

# Session Index API

## Purpose

Define the typed frontend/backend contract for the session index before UI implementation couples too tightly to backend internals.

This document is also the source of truth for contract tests at the session index boundary.

## Related Documents

- [Open Platform Technical Specification](tech-spec.md)
- [Testing Strategy](testing-strategy.md)
- [Session Index UX](session-index-ux.md)
- [ADR-0006: Session Index Stack and API Boundary](../../adr/0006-session-index-stack-and-api-boundary.md)
- [ADR-0007: Testing Strategy and Inner Feedback Loops](../../adr/0007-testing-strategy-and-inner-feedback-loops.md)
- [Session Index and Operator UX Plan](../../plans/05-session-index-and-operator-ux.md)

## Scope

- session listing and detail data
- session create, restart, delete, and open flows
- typed request and response shapes
- error shapes and status semantics

## Provider And Consumer Ownership

- the backend is the provider of the session index contract
- the frontend is the primary consumer of the session index contract
- this document is the canonical contract source for both sides
- implementation details on either side must not redefine the contract informally

## Out of Scope

- direct `opencode web` APIs
- terminal or chat protocols
- future remote gateway APIs

## Transport

- HTTP + JSON for the session index application
- exact framework choice is deferred, but the contract should remain stable regardless of implementation details
- tests should assert transport-visible behavior and normalized responses, not backend implementation details

## Session Resource Shape

Each session record should expose typed fields suitable for the operator UI:

- `id`
- `name`
- `repo`
- `branch`
- `status`
- `createdAt`
- `lastTransitionAt`
- `url`
- `authRequired`
- `restartCount`
- `failureReason`

`url` should be absent or `null` until the backend can safely resolve an operator-visible open target.

Optional future fields may include:

- `lastActivityAt`
- `workspaceState`
- `health`
- `warnings`

## Endpoints

### `GET /sessions`

Returns the current operator-visible session list.

Contract tests should verify empty, populated, degraded, and failed-session list behavior.

### `POST /sessions`

Creates a new session from a typed request containing the supported creation inputs.

The request must not permit arbitrary Kubernetes resource submission.

Contract tests should verify valid creation, validation failure, and rejection of unsupported or unsafe inputs.

### `POST /sessions/{id}/restart`

Restarts or recreates the specified session according to platform policy.

The working v1 default is that restart preserves the session workspace for that session unless a later documented recreate flow says otherwise.

Contract tests should verify observable restart behavior and normalized restart errors.

### `DELETE /sessions/{id}`

Deletes the specified session and applies the documented workspace cleanup policy.

The working v1 default is that delete removes the session workspace and invalidates session-scoped auth material for that session.

Contract tests should verify deletion semantics and normalized failures.

### `GET /sessions/{id}/open`

Returns the resolved open URL and any operator-visible access metadata needed to open the session.

Working v1 contract:

- the backend owns URL resolution
- the frontend must not guess or construct session URLs
- if the session is not ready, the backend returns a normalized not-ready response rather than a speculative open URL
- if the session is ready, the response includes the resolved open URL and non-secret access metadata only
- normal API responses must not expose raw reusable credentials or embed them in URLs
- auth failures must be distinguishable from session-startup or substrate failures

Contract tests should verify ready, not-ready, and auth-related open behavior without leaking sensitive values.

### Optional follow-up endpoints

- `GET /sessions/{id}`
- `GET /sessions/{id}/events`
- `GET /sessions/{id}/logs/summary`

## Error Shape

Errors returned by the backend should be normalized for operator use and should distinguish between:

- validation errors
- auth/access errors
- session provisioning failures
- cluster substrate failures
- unresolved or unknown errors

Errors must avoid including raw secret values or sensitive runtime content.

Tests should assert normalized observable error behavior rather than internal exception details.

## State and Status Semantics

The backend is responsible for mapping Kubernetes and runtime behavior into stable operator-facing statuses.

Expected statuses include:

- `creating`
- `pending_clone`
- `starting`
- `ready`
- `degraded`
- `restarting`
- `deleting`
- `failed`

Contract tests should verify the mapping of runtime conditions into these operator-visible statuses.

## Contract Test Requirements

Contract tests should cover at least:

- create, list, open, restart, and delete success paths
- validation failures
- auth failures and open-session failures
- normalized error payloads
- status mapping and transition visibility
- non-leakage of secret or auth-sensitive fields

## Compatibility Rules

- additive optional fields are preferred over breaking response shape changes
- renaming or removing fields is breaking and requires coordinated updates
- changing status or error semantics is breaking unless explicitly documented and migrated
- backend and frontend changes must land with matching contract updates when behavior changes

## Auth UX Notes

- the session index must not become a secret vault
- the session index may surface auth status or access requirements, but should not expose long-lived secrets unnecessarily
- session auth handling must stay compatible with a future authenticated remote gateway

## Versioning

- the v1 API is internal to this repo, but should still be treated as a stable contract once implemented
- breaking changes should be reflected in this doc before implementation changes land
- contract tests should fail on undocumented contract drift
