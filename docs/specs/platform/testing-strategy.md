---
title: "Testing Strategy"
doc_id: "SPEC-PLATFORM-TEST-001"
doc_type: "spec"
status: "draft"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Behavior-focused TDD policy, layered test loops, and fixture strategy for Open Platform."
aliases:
  - "Platform Testing Strategy"
  - "TDD Strategy"
tags:
  - "spec"
  - "testing"
  - "tdd"
  - "contracts"
  - "tilt"
source_of_truth: "implementation-requirements"
related_docs:
  - "docs/adr/0007-testing-strategy-and-inner-feedback-loops.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/specs/platform/session-index-api.md"
  - "docs/specs/platform/session-index-ux.md"
  - "docs/plans/01-repo-foundations.md"
  - "docs/plans/05-session-index-and-operator-ux.md"
  - "docs/plans/06-observability-and-hardening.md"
---

# Testing Strategy

## Purpose

Define the repo-wide testing policy for Open Platform, with an emphasis on behavior-focused TDD, explicit contract verification, and layered feedback loops.

This document is the operational source of truth for testing expectations. [ADR-0007](../../adr/0007-testing-strategy-and-inner-feedback-loops.md) records the durable decision; this spec defines the living implementation rules.

## Scope

- repo-owned backend code
- repo-owned frontend code
- API contracts
- operator-visible UX behavior
- integration and platform verification
- security- and observability-relevant smoke checks

## Out Of Scope

- third-party upstream test policy
- full multi-user load or scale testing in v1

## Testing Principles

- tests should target observable behavior and stable contracts
- tests should prefer user-visible or contract-visible outcomes over implementation details
- contract-first design should be enforced with tests at the boundary
- the fastest useful test layer should be preferred before reaching for slower end-to-end or platform loops

## Minimum Required Testing Bar

Use the smallest useful layer that proves the behavior.

- API contract changes require contract tests
- backend behavior changes require unit or integration tests at the cheapest layer that proves the behavior
- operator-visible UI changes require component or interaction tests
- infra, auth, secret-handling, routing, or observability changes require the relevant slower smoke or security regressions
- end-to-end tests are required only when a behavior cannot be proved sufficiently at a cheaper layer

## Contributor Default Workflow

For most changes, contributors should:

1. update the relevant contract or UX doc if the behavior changes
2. write the smallest failing test that proves the behavior
3. implement the minimum code or config to make the test pass
4. run the fast local loop through `mise`
5. run slower integration or platform loops only when the change crosses those boundaries

## Anti-Patterns

Avoid tests that primarily assert:

- private component state
- incidental DOM structure or class names that are not part of the UI contract
- backend internals that are not part of the API contract
- raw Kubernetes details when the required behavior is a higher-level platform outcome
- broad snapshot coverage that is brittle and low-signal

## Layered Test Model

### Unit Tests

Use for backend domain logic, small frontend utilities, and local pure behavior.

### Component Tests

Use for frontend UI behavior, state transitions, loading and error states, and operator-visible affordances.

### Contract Tests

Use for API schemas, request and response behavior, status mapping, and error normalization.

### Integration Tests

Use for backend plus frontend behavior across a real boundary without requiring the full platform stack.

### End-To-End Tests

Use for operator workflows such as create, open, restart, delete, and recover.

### Platform Smoke And Security Regression Tests

Use for network policy, localhost-only exposure, runtime auth behavior, telemetry redaction, and other environment-sensitive guarantees.

## Change Type To Test Layer Matrix

| Change Type | Primary Layer | Secondary Layer When Needed |
| --- | --- | --- |
| backend domain logic | unit | integration |
| frontend operator-visible state | component | end-to-end |
| session index API payload or error behavior | contract | integration |
| session create/open/delete UX | component or integration | end-to-end |
| status mapping and normalization | contract | integration |
| localhost-only exposure | platform smoke | security regression |
| network policy and egress restrictions | platform smoke | security regression |
| auth handling and auth failure behavior | contract or integration | security regression |
| telemetry redaction and secret non-leakage | security regression | platform smoke |
| Kata/runtime substrate behavior | platform smoke | end-to-end |

## Inner Feedback Loops

### Fast Local Loop

The default TDD loop for everyday development.

Should include:

- unit tests
- component tests
- contract tests
- fast validation such as format, lint, and typecheck

This loop should avoid requiring a full cluster bring-up whenever possible.

### Default `mise` Integration Loop

Use when behavior crosses process or service boundaries but does not yet require the full platform substrate.

### Optional Tilt-Assisted Slow Loop

Use only when repeated integration, end-to-end, or platform validation cycles become slow enough that Tilt materially improves iteration speed.

Tilt remains optional and does not replace `mise` as the public entrypoint.

## Execution Gates

### Hook / Pre-Commit Gate

Keep this fast and local.

- formatting
- linting
- typechecking where practical
- the cheapest relevant unit, component, or contract checks
- staged secret scanning through `Infisical`

### Pre-Merge Gate

- all required fast local checks
- change-appropriate integration tests
- contract drift detection for API and UX-visible changes
- Buildkite runs the documented required fast and boundary-crossing gates through repo-owned tasks

### Slow Manual Or CI Gate

- end-to-end flows that depend on the real session runtime
- platform smoke suites
- security regressions
- observability regressions
- Buildkite should run or schedule these slower suites where they are part of the documented milestone or release gates

## Command Surface Maturity

### Required Now

- `mise run fmt`
- `mise run fmt:check`
- `mise run lint`
- `mise run lint:ts`
- `mise run lint:go`
- `mise run typecheck`
- `mise run typecheck:ts`
- `mise run build`
- `mise run build:ts`
- `mise run build:go`
- `mise run secrets:scan`
- `mise run test`
- `mise run test:go`
- `mise run test:ts`
- `mise run test:contract`
- `mise run validate`
- `mise run check`

### Required By Later Milestones

- `mise run test:integration`
- `mise run test:e2e`
- `mise run cluster:smoke`
- `mise run security:smoke`
- `mise run obs:smoke`

### Optional

- `mise run dev:tilt`

## Command Surface

The public command surface should be exposed through `mise`.

Use the command maturity table above as the canonical list of required, later, and optional commands.

## Security Regression Minimums

At minimum, the platform must have regression coverage for:

- committed-secret detection in staged changes
- unauthorized or malformed attempts to open sessions
- secret leakage through logs, URLs, telemetry, and errors
- localhost-only exposure from outside the expected local boundary
- deny-by-default egress and blocked lateral movement
- absence of unnecessary Kubernetes API credentials in session pods
- runtime hardening baseline checks for the documented pod profile

## Abuse-Case Coverage

The strategy should include negative tests for:

- malformed create requests
- hostile repo or branch names
- auth bypass attempts
- stale or reused session credentials
- compromised-session attempts to reach disallowed endpoints
- sensitive-value leakage under error conditions

## Contract Testing Mechanics

- [Session Index API](session-index-api.md) is the provider-facing source of truth for the backend/frontend contract
- backend changes that alter request, response, status, or error behavior must update the API doc first
- frontend code consumes the contract and should fail fast on undocumented drift
- additive changes should remain backward-compatible where possible
- breaking changes require coordinated doc and test updates before merge

## Async And Eventual-Consistency Guidance

- assert eventual operator-visible outcomes rather than exact polling cadence or timing
- prefer waiting on documented status transitions over low-level implementation signals
- avoid tests that depend on unstable timestamps, ordering, or incidental retries unless those are contractual

## Fixture Strategy

The repo should define stable fixtures for:

- sample repos used by session runtime tests
- API payload examples and error cases
- session status transitions
- auth and secret-redaction cases using safe fake values
- network policy smoke scenarios
- Kata validation scenarios

Fixtures should model behavior and contracts, not just internal implementation shapes.

## Fixture Discipline

- prefer small focused fixtures, builders, or factories over large opaque golden fixtures
- use fake but secret-looking values for redaction tests
- separate transport fixtures, domain fixtures, and platform fixtures where practical
- avoid fixtures that encode incidental ordering, timing, or environment noise

## Contract Drift Policy

- update [Session Index API](session-index-api.md) before shipping behavior changes to the session index boundary
- update [Session Index UX](session-index-ux.md) before shipping operator-visible UX behavior changes
- tests should fail when behavior changes drift from the documented contract

## Not Required Yet

- mandatory Tilt usage for normal development
- treating Infisical secret scanning as a substitute for runtime leak-prevention tests
- full end-to-end coverage for every change
- broad snapshot-heavy UI testing
- broad platform-smoke execution for small local-only refactors that do not cross relevant boundaries
- treating Buildkite as a separate public workflow surface instead of a runner for repo-owned tasks

## Acceptance Mapping

- fast loops must cover contract and operator-visible behavior without requiring the full platform stack
- slower loops must cover environment-sensitive security and integration guarantees
- v1 is not complete until both the fast and slow layers are in place for the platform's critical behaviors
