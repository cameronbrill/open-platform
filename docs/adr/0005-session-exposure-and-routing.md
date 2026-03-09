# ADR-0005: Session Exposure and Routing

- Status: Proposed
- Date: 2026-03-08

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

## Follow-Up

- finalize path-based vs host-based routing after `opencode web` validation
- document how the session index computes or resolves operator-visible open URLs
