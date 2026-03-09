---
title: "ADR-0007: Testing Strategy and Inner Feedback Loops"
doc_id: "ADR-0007"
doc_type: "adr"
status: "accepted"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Adopt behavior-focused TDD, layered feedback loops, and optional Tilt usage only for slower integration and platform workflows."
aliases:
  - "Testing Strategy ADR"
  - "Inner Feedback Loops ADR"
tags:
  - "adr"
  - "testing"
  - "tdd"
  - "feedback-loop"
  - "tilt"
source_of_truth: "durable-decision"
related_docs:
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/session-index-api.md"
  - "docs/specs/platform/session-index-ux.md"
  - "docs/plans/01-repo-foundations.md"
  - "docs/plans/05-session-index-and-operator-ux.md"
  - "docs/plans/06-observability-and-hardening.md"
supersedes: []
superseded_by: []
---

# ADR-0007: Testing Strategy and Inner Feedback Loops

## Context

The platform now has explicit ADRs, specs, plans, and typed frontend/backend boundaries. It needs a durable engineering decision for how behavior is verified, how fast feedback loops are organized, and where Tilt does or does not fit.

The platform is docs-first, single-user in v1, and relies on a thin operator application, security-sensitive runtime boundaries, and a local Kubernetes substrate.

## Decision

Use the following testing and feedback-loop policy:

- behavior-focused TDD is the default engineering approach for repo-owned code and contracts
- tests should target observable behavior, stable contracts, operator-visible states, and security-relevant outcomes
- tests should avoid coupling to implementation details such as private component state, incidental DOM structure, or non-contractual infrastructure internals
- the frontend/backend API contract is both a design artifact and a contract-test artifact
- `mise` remains the public entrypoint for validation and testing workflows
- Tilt is optional and is only used to accelerate the slower integration, end-to-end, and platform verification loops
- Tilt is not required for bootstrap, normal operator workflows, or v1 acceptance criteria

Operational detail such as execution gates, minimum required coverage, fixture discipline, and slow-loop scope lives in [Testing Strategy](../specs/platform/testing-strategy.md).

## Layered Feedback Loops

The platform uses three feedback-loop tiers:

- fast local loop for unit, component, and contract tests
- default `mise` integration loop for behavior across process or service boundaries
- optional Tilt-assisted slow loop for repeated integration, end-to-end, and platform verification cycles

## Rationale

- behavior-focused tests produce lower brittleness during refactors
- explicit contract testing protects the Go and TypeScript boundary
- layered loops keep fast feedback available without requiring full cluster bring-up
- Tilt is useful only where repeated rebuild, apply, watch, and observe cycles become the bottleneck

## Consequences

### Positive

- implementation details can change without rewriting broad sections of the test suite when behavior is unchanged
- the contract-first session index design becomes verifiable early
- the repo gets a clear distinction between fast contributor loops and slower platform verification

### Negative

- requires more up-front thought about contracts, operator-visible states, and fixture design
- introduces another optional contributor tool if Tilt is adopted later

## Tilt Scope

Tilt may be used for:

- repeated integration loops involving frontend, backend, and cluster resources
- repeated platform verification involving session runtime, routing, logs, and smoke suites

Tilt must not:

- replace `mise` as the public command surface
- become mandatory for repo bootstrap or normal operator workflows
- hide required platform validation behind a Tilt-only path

## Follow-Up

- define the detailed testing policy in [Testing Strategy](../specs/platform/testing-strategy.md)
- map test responsibilities into the numbered plans in [Plans](../plans/README.md)
