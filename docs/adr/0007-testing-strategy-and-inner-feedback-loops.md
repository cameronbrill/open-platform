---
title: "ADR-0007: Testing Strategy and Inner Feedback Loops"
doc_id: "ADR-0007"
doc_type: "adr"
status: "accepted"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Adopt behavior-focused TDD, layered feedback loops, contract-drift protection, and optional Tilt usage only for slower verification workflows."
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
  - "docs/specs/platform/repository-tooling.md"
  - "docs/plans/01-repo-foundations.md"
  - "docs/plans/05-session-index-and-operator-ux.md"
  - "docs/plans/06-observability-and-hardening.md"
supersedes: []
superseded_by: []
---

# ADR-0007: Testing Strategy and Inner Feedback Loops

## Context

The platform has explicit ADRs, specs, plans, and typed frontend/backend boundaries. It needs a durable engineering decision for how behavior is verified, how fast feedback loops are organized, and where Tilt does or does not fit.

## Decision

Use the following testing and feedback-loop policy:

- behavior-focused TDD is the default engineering approach for repo-owned code and contracts
- tests target observable behavior, stable contracts, operator-visible states, and security-relevant outcomes
- the frontend/backend API contract is both a design artifact and a contract-test artifact
- contract or UX drift must be caught before merge when documented behavior changes
- `mise` remains the public entrypoint for validation and testing workflows
- Tilt is optional and only used to accelerate slower integration, end-to-end, and platform verification loops

## Layered Feedback Loops

- fast local loop for unit, component, and contract checks, including boundary drift detection for relevant changes
- default `mise` integration loop for behavior across process or service boundaries
- optional Tilt-assisted slow loop for repeated end-to-end and platform verification cycles

## Gate Rules

- required validation must run through documented repo-owned tasks
- CI is a runner for those documented tasks, not a separate source of workflow truth
- API and UX contract changes require matching tests and docs updates before merge

## Rationale

- behavior-focused tests produce lower brittleness during refactors
- explicit contract testing protects the Go and TypeScript boundary
- layered loops keep fast feedback available without requiring full cluster bring-up

## Follow-Up

- operational coverage, command maturity, and gate detail live in [Testing Strategy](../specs/platform/testing-strategy.md)
- task-surface ownership lives in [Repository Tooling](../specs/platform/repository-tooling.md)
