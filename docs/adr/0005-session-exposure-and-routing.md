---
title: "ADR-0005: Session Exposure and Routing"
doc_id: "ADR-0005"
doc_type: "adr"
status: "accepted"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Use backend-owned host-based routing on *.localhost for per-session opencode web endpoints, require per-session auth in v1, and keep the open-session contract compatible with a future authenticated gateway."
aliases:
  - "Session Exposure and Routing"
tags:
  - "adr"
  - "routing"
  - "localhost-only"
  - "session-index"
  - "opencode"
source_of_truth: "durable-decision"
related_docs:
  - "docs/specs/platform/tech-spec.md"
  - "docs/specs/platform/session-index-api.md"
  - "docs/specs/platform/session-index-ux.md"
  - "docs/plans/04-session-runtime.md"
  - "docs/plans/05-session-index-and-operator-ux.md"
supersedes: []
superseded_by: []
---

# ADR-0005: Session Exposure and Routing

## Context

Each OpenCode session exposes its own `opencode web` endpoint. The platform is localhost-only in v1, but must support a later authenticated remote-access gateway without redesigning the internal session model.

Routing choices affect:

- operator-visible URLs
- browser auth behavior
- the thin session index application
- future remote access

## Decision

Use the following v1 routing and exposure contract:

- each session has a stable backend-owned session identity
- each session is exposed through host-based routing on a `*.localhost` hostname
- the backend, not the frontend, resolves the canonical operator-visible `openUrl`
- v1 browser access remains localhost-only through the substrate and forwarding model chosen in [ADR-0004](0004-local-substrate-selection.md)
- per-session auth remains required in v1
- the session index may surface access metadata and auth state, but must not become a general-purpose secret vault

## Open-Session Contract Rules

- the frontend must never construct session URLs by guessing hostnames or paths
- `GET /sessions/{id}/open` is the canonical route-resolution surface for the operator UI
- if a session is not ready, the backend returns a normalized not-ready response instead of a speculative open target
- auth failures must be distinguishable from session startup or substrate failures in operator-visible behavior

## Future Gateway Compatibility Rules

- future remote access must terminate through a dedicated authenticated gateway layer
- internal session identity must remain stable even if the future external URL shape changes
- the gateway may mint or broker future access credentials, but the session index contract should not need redesign to support that layer
- direct unauthenticated exposure of per-session endpoints is not allowed

## Rationale

- host-based routing avoids brittle path rewriting against `opencode web`
- `*.localhost` keeps the v1 URL shape compatible with localhost-only access and future host-based gateway mapping
- backend-owned URL resolution prevents contract drift and frontend guesswork

## Consequences

### Positive

- one stable routing contract now exists for the runtime plan, API spec, and UX spec
- the frontend can consume a typed open-session contract instead of inventing routing logic

### Negative

- ingress, forwarding, and local hostname behavior must be verified carefully
- per-session auth and host-based exposure require clear non-leaking operator behavior

## Follow-Up

- define typed request, response, status, and error behavior in [Session Index API](../specs/platform/session-index-api.md)
- define operator-visible auth/open-session behavior in [Session Index UX](../specs/platform/session-index-ux.md)
