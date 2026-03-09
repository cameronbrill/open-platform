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
  - "docs/specs/platform/repository-tooling.md"
  - "docs/specs/platform/secret-management.md"
  - "docs/specs/platform/session-index-api.md"
  - "docs/specs/platform/session-index-ux.md"
  - "docs/specs/platform/tech-spec.md"
---

# Testing Strategy

## Purpose

Define the repo-wide testing policy for Open Platform, with an emphasis on behavior-focused TDD, explicit contract verification, and layered feedback loops.

## Scope

- repo-owned backend code
- repo-owned frontend code
- API contracts
- operator-visible UX behavior
- integration and platform verification
- security- and observability-relevant smoke checks

## Testing Principles

- tests target observable behavior and stable contracts
- tests prefer user-visible or contract-visible outcomes over implementation details
- contract-first design is enforced with docs and tests at the boundary
- the fastest useful layer should be preferred before slower end-to-end or platform loops

## Minimum Required Testing Bar

Use the smallest useful layer that proves the behavior.

- API contract changes require contract tests
- backend behavior changes require unit or integration tests at the cheapest layer that proves the behavior
- operator-visible UI changes require component or interaction tests
- infra, auth, secret-handling, routing, or observability changes require the relevant slower smoke or security regressions
- end-to-end tests are required only when a cheaper layer cannot prove the behavior sufficiently

## Contributor Default Workflow

1. update the relevant spec first if the behavior changes
2. write the smallest failing test that proves the behavior
3. implement the minimum code or config to make the test pass
4. run the minimum documented `mise` loop for that change type
5. run slower integration or platform loops only when the change crosses those boundaries

## Change Type To Command Guidance

| Change Type | Minimum Local Loop | Add When Needed |
| --- | --- | --- |
| docs-only wording or navigation | `mise run fmt:check` | `mise run docs:qmd:refresh` after substantial docs changes |
| backend-only logic | `mise run test:go` | `mise run test:contract` if the API changed |
| frontend operator-visible behavior | `mise run test:ts` | `mise run test:contract` if the contract changed |
| API payload, status, or error change | `mise run test:contract` | `mise run test` and integration coverage if the change crosses a real boundary |
| secret, auth, routing, or network-policy change | relevant fast tests plus `mise run test:contract` when the API changes | `mise run security:smoke` and `mise run cluster:smoke` once those suites exist |
| telemetry or redaction change | relevant fast tests | `mise run obs:smoke` and security regressions once available |

## Anti-Patterns

Avoid tests that primarily assert:

- private component state
- incidental DOM structure or class names that are not part of the UI contract
- backend internals that are not part of the API contract
- raw Kubernetes details when the required behavior is a higher-level platform outcome
- broad snapshot coverage that is brittle and low-signal

## Layered Test Model

### Unit Tests

Use for backend domain logic, frontend utilities, and local pure behavior.

### Component Tests

Use for frontend UI behavior, state transitions, loading and error states, and operator-visible affordances.

### Contract Tests

Use for API schemas, request and response behavior, status mapping, auth/open-session behavior, and error normalization.

### Integration Tests

Use for backend plus frontend behavior across a real boundary without requiring the full platform substrate.

### End-To-End Tests

Use for operator workflows such as create, open, restart, delete, and recover.

### Platform Smoke And Security Regression Tests

Use for network policy, localhost-only exposure, runtime auth behavior, telemetry redaction, retention, and other environment-sensitive guarantees.

## Inner Feedback Loops

### Fast Local Loop

Should include:

- unit tests
- component tests
- contract tests
- fast validation such as format, lint, and typecheck

This loop should avoid requiring a full cluster bring-up whenever possible.

### Default `mise` Integration Loop

Use when behavior crosses process or service boundaries but does not yet require the full platform substrate.

### Optional Tilt-Assisted Slow Loop

Use only when repeated end-to-end or platform validation cycles become slow enough that Tilt materially improves iteration speed.

Tilt remains optional and does not replace `mise` as the public entrypoint.

## Execution Gates

### Hook / Pre-Commit Gate

- formatting
- linting
- typechecking where practical
- the cheapest relevant unit, component, or contract checks
- staged secret scanning through `Infisical`

### Required Pre-Merge Gate

- all required fast local checks for the change class
- change-appropriate integration or contract checks
- contract drift detection for API and UX-visible changes
- Buildkite runs the documented required gates through repo-owned tasks

### Slower Milestone Or Release Gate

- end-to-end flows that depend on the real session runtime
- platform smoke suites
- security regressions
- observability regressions

These slower suites may run in CI, scheduled validation, or milestone-specific gates as documented by plans and tooling specs.

## Command Ownership

- [Repository Tooling](repository-tooling.md) owns the public command-surface policy
- this doc owns which test layers and gates are required, not the entire repo command list

## Security Regression Minimums

At minimum, the platform must have regression coverage for:

- committed-secret detection in staged changes
- unauthorized or malformed attempts to create or open sessions
- secret leakage through logs, URLs, telemetry, cookies, and errors
- localhost-only exposure from outside the expected local boundary
- deny-by-default egress and blocked lateral movement
- absence of unnecessary Kubernetes API credentials in session pods
- runtime hardening baseline checks for the documented pod profile
- retention and cleanup behavior for delete, restart, and reset flows

## Abuse-Case Coverage

The strategy should include negative tests for:

- malformed create requests
- hostile repo or branch names
- auth bypass attempts
- stale or reused session credentials
- compromised-session attempts to reach disallowed endpoints
- sensitive-value leakage under error conditions

## Contract Drift Policy

- update [Session Index API](session-index-api.md) before shipping behavior changes to the session index boundary
- update [Session Index UX](session-index-ux.md) before shipping operator-visible UX behavior changes
- tests should fail when behavior changes drift from the documented contract

## Guarantee To Suite Mapping

| Guarantee | Minimum Suite |
| --- | --- |
| normalized API payloads and error envelopes | contract tests |
| operator-visible list, create, open, restart, and delete behavior | component or integration tests, with end-to-end tests when cheaper layers are insufficient |
| backend-owned open URL resolution and auth bootstrap behavior | contract tests plus integration coverage |
| localhost-only exposure | platform smoke plus security regression |
| deny-by-default egress and network policy enforcement | platform smoke plus security regression |
| telemetry redaction and secret non-leakage | security regression plus observability smoke |
| delete, restart, and reset cleanup behavior | integration or end-to-end plus security regression |

## Fixture Strategy

The repo should define stable fixtures for:

- sample repos used by session runtime tests
- API payload examples and error cases
- session status transitions
- auth and secret-redaction cases using safe fake values
- network policy smoke scenarios
- Kata validation scenarios

Fixtures should model behavior and contracts, not just internal implementation shapes.

## Acceptance Mapping

- fast loops must cover contract and operator-visible behavior without requiring the full platform stack
- slower loops must cover environment-sensitive security and integration guarantees
- v1 is not complete until both the fast and slow layers exist for the platform's critical behaviors
