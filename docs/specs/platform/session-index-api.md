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
  - "docs/specs/platform/session-index-ux.md"
  - "docs/adr/0006-session-index-stack-and-api-boundary.md"
  - "docs/plans/05-session-index-and-operator-ux.md"
---

# Session Index API

## Purpose

Define the typed frontend/backend contract for the session index before UI implementation couples too tightly to backend internals.

## Related Documents

- [Open Platform Technical Specification](tech-spec.md)
- [Session Index UX](session-index-ux.md)
- [ADR-0006: Session Index Stack and API Boundary](../../adr/0006-session-index-stack-and-api-boundary.md)
- [Session Index and Operator UX Plan](../../plans/05-session-index-and-operator-ux.md)

## Scope

- session listing and detail data
- session create, restart, delete, and open flows
- typed request and response shapes
- error shapes and status semantics

## Out of Scope

- direct `opencode web` APIs
- terminal or chat protocols
- future remote gateway APIs

## Transport

- HTTP + JSON for the session index application
- exact framework choice is deferred, but the contract should remain stable regardless of implementation details

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

Optional future fields may include:

- `lastActivityAt`
- `workspaceState`
- `health`
- `warnings`

## Endpoints

### `GET /sessions`

Returns the current operator-visible session list.

### `POST /sessions`

Creates a new session from a typed request containing the supported creation inputs.

The request must not permit arbitrary Kubernetes resource submission.

### `POST /sessions/{id}/restart`

Restarts or recreates the specified session according to platform policy.

### `DELETE /sessions/{id}`

Deletes the specified session and applies the documented workspace cleanup policy.

### `GET /sessions/{id}/open`

Returns the resolved open URL and any operator-visible access metadata needed to open the session.

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

## Auth UX Notes

- the session index must not become a secret vault
- the session index may surface auth status or access requirements, but should not expose long-lived secrets unnecessarily
- session auth handling must stay compatible with a future authenticated remote gateway

## Versioning

- the v1 API is internal to this repo, but should still be treated as a stable contract once implemented
- breaking changes should be reflected in this doc before implementation changes land
