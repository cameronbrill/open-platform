---
title: "ADR-0005: Session Exposure and Routing"
doc_id: "ADR-0005"
doc_type: "adr"
status: "proposed"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Define how session URLs are resolved and exposed while keeping v1 localhost-only and future remote access compatible."
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
  - "docs/plans/04-session-runtime.md"
supersedes: []
superseded_by: []
---

# ADR-0005: Session Exposure and Routing

## Status Note

This ADR is still `proposed`. The flow below defines the current working contract that downstream docs should align to, but the final URL shape and routing implementation remain subject to this ADR being accepted.

## Context

Each OpenCode session exposes its own `opencode web` endpoint. The platform is localhost-only in v1, but must support a later authenticated remote-access gateway without redesigning the internal session model.

Routing choices affect:

- operator-visible URLs
- browser auth behavior
- the thin session index application
- future remote access

## Proposed Direction

The platform should establish a stable session identity and a backend-owned URL resolution contract before implementation is finalized.

Requirements:

- session URLs must be resolved by trusted backend logic rather than hand-constructed in the client
- session endpoints remain localhost-only in v1
- per-session auth remains required in v1
- future remote access must terminate through a dedicated gateway boundary rather than direct unauthenticated exposure

Path-based routing may be used only if it works cleanly with `opencode web`. If not, host-based routing is preferred over brittle path rewriting.

## Working v1 Open-Session Contract

Until this ADR is accepted, downstream docs should use the following working contract:

1. the backend owns stable session identity and operator-visible URL resolution
2. the frontend must not construct session URLs directly
3. `GET /sessions/{id}/open` is the canonical session-open entrypoint for the session index
4. if a session is not ready, the backend returns a normalized not-ready response instead of a speculative open target
5. if a session is ready, the backend returns the resolved open URL and only non-secret access metadata needed by the operator UI
6. raw reusable credentials must not be returned in normal API responses or embedded in URLs
7. auth failures must be distinguishable from session-startup or substrate failures in operator-visible behavior

This closes ownership and failure semantics for v1 without forcing the final path-based versus host-based implementation decision prematurely.

## Follow-Up

- finalize path-based vs host-based routing after `opencode web` validation
- document how the session index computes or resolves operator-visible open URLs
