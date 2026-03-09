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
  - "docs/adr/0005-session-exposure-and-routing.md"
  - "docs/adr/0006-session-index-stack-and-api-boundary.md"
  - "docs/specs/platform/session-index-ux.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/tech-spec.md"
---

# Session Index API

## Purpose

Define the typed frontend/backend contract for the session index before UI implementation couples to backend internals.

This document is also the source of truth for contract tests at the session index boundary.

## Scope

- session listing and detail data
- session create, restart, delete, and open flows
- typed request and response shapes
- normalized errors
- operator-visible status semantics

## Provider And Consumer Ownership

- the backend is the provider of the session index contract
- the frontend is the primary consumer of the session index contract
- this document is the canonical contract source for both sides
- implementation details on either side must not redefine the contract informally

## Transport

- HTTP + JSON for the session index application
- exact framework choice is deferred, but the contract remains stable regardless of implementation details
- tests assert transport-visible behavior and normalized responses, not backend internals

## Type Definitions

### SessionSummary

```ts
type SessionStatus =
  | 'creating'
  | 'pending_clone'
  | 'starting'
  | 'ready'
  | 'degraded'
  | 'restarting'
  | 'deleting'
  | 'failed'

type SessionSummary = {
  id: string
  name: string
  repo: string
  ref: string | null
  status: SessionStatus
  createdAt: string
  lastTransitionAt: string
  openUrl: string | null
  authRequired: boolean
  restartCount: number
  failureReason: string | null
  warnings: string[]
}
```

Field rules:

- `id` is a stable opaque identifier and must match `^[a-z0-9][a-z0-9-]{2,62}$`
- timestamps use RFC 3339 UTC strings
- `openUrl` is nullable and may be omitted from operator action logic in favor of the canonical open endpoint
- `failureReason` is sanitized operator-visible text, not raw stack traces or secret-bearing output

### CreateSessionRequest

```ts
type CreateSessionRequest = {
  name: string
  repo: string
  ref?: string | null
}
```

Validation rules:

- `name` must be 3-63 chars, lowercase letters, numbers, and hyphens only
- `repo` must be a supported repo reference or git URL accepted by backend policy
- `ref` may be null, branch-like, tag-like, or commit-like, but must not contain shell metacharacters or path traversal patterns

### ErrorEnvelope

```ts
type ErrorEnvelope = {
  error: {
    code:
      | 'VALIDATION_ERROR'
      | 'AUTH_REQUIRED'
      | 'SESSION_NOT_READY'
      | 'SESSION_FAILED'
      | 'SUBSTRATE_UNAVAILABLE'
      | 'INTERNAL_ERROR'
    message: string
    retryable: boolean
    sessionId?: string
  }
}
```

Rules:

- `message` is safe for operator display
- error payloads must not include raw secrets, tokens, cookie values, or backend-only diagnostics

## Endpoints

### `GET /sessions`

Returns the current operator-visible session list.

Example response:

```json
{
  "sessions": [
    {
      "id": "dev-issue-123",
      "name": "dev-issue-123",
      "repo": "github.com/example/repo",
      "ref": "main",
      "status": "ready",
      "createdAt": "2026-03-09T12:00:00Z",
      "lastTransitionAt": "2026-03-09T12:03:00Z",
      "openUrl": "http://dev-issue-123.localhost",
      "authRequired": true,
      "restartCount": 0,
      "failureReason": null,
      "warnings": []
    }
  ]
}
```

### `POST /sessions`

Creates a new session asynchronously.

- success response: `202 Accepted`
- failure response: `400` for validation failures, `503` for substrate-unavailable behavior when applicable

Example request:

```json
{
  "name": "dev-issue-123",
  "repo": "github.com/example/repo",
  "ref": "main"
}
```

Example `202` response:

```json
{
  "session": {
    "id": "dev-issue-123",
    "name": "dev-issue-123",
    "repo": "github.com/example/repo",
    "ref": "main",
    "status": "creating",
    "createdAt": "2026-03-09T12:00:00Z",
    "lastTransitionAt": "2026-03-09T12:00:00Z",
    "openUrl": null,
    "authRequired": true,
    "restartCount": 0,
    "failureReason": null,
    "warnings": []
  }
}
```

### `POST /sessions/{id}/restart`

Restarts or recreates the specified session according to platform policy.

- success response: `202 Accepted`
- normalized failures: `404`, `409`, or `503` as appropriate

### `DELETE /sessions/{id}`

Deletes the specified session and applies the documented workspace and credential cleanup policy.

- success response: `202 Accepted`
- normalized failures: `404` or `409` as appropriate

### `GET /sessions/{id}/open`

Returns the canonical open target for a ready session.

Rules:

- the backend owns URL resolution
- the frontend must not guess hostnames or paths
- the backend may set or refresh short-lived HTTP-only cookie state as part of the open flow when needed
- the response must never include raw secret or reusable credential values

Example `200` response:

```json
{
  "sessionId": "dev-issue-123",
  "status": "ready",
  "openUrl": "http://dev-issue-123.localhost",
  "authRequired": true,
  "accessMode": "browser_cookie"
}
```

Example `409` response:

```json
{
  "error": {
    "code": "SESSION_NOT_READY",
    "message": "Session is still starting and cannot be opened yet.",
    "retryable": true,
    "sessionId": "dev-issue-123"
  }
}
```

## Status Semantics

### Allowed Statuses

- `creating`
- `pending_clone`
- `starting`
- `ready`
- `degraded`
- `restarting`
- `deleting`
- `failed`

### Transition Rules

- `creating -> pending_clone -> starting -> ready`
- `creating | pending_clone | starting -> failed`
- `ready -> degraded | restarting | deleting`
- `degraded -> ready | restarting | deleting | failed`
- `failed -> restarting | deleting`
- `restarting -> starting | ready | failed`

`lastTransitionAt` records the most recent backend-mapped transition into the current operator-visible status.

## Contract Test Requirements

Contract tests must cover at least:

- create, list, open, restart, and delete success paths
- validation failures
- ready versus not-ready open behavior
- auth-required open behavior without raw secret leakage
- normalized error payloads
- status mapping and transition visibility

## Compatibility Rules

- additive optional fields are preferred over breaking response shape changes
- renaming or removing fields is breaking and requires coordinated updates
- changing status or error semantics is breaking unless explicitly documented and migrated
- backend and frontend changes must land with matching contract updates when behavior changes
