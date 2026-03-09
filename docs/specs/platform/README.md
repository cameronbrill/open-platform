---
title: "Platform Specs"
doc_id: "SPEC-PLATFORM-INDEX"
doc_type: "index"
status: "active"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Index of active platform spec documents for Open Platform."
aliases:
  - "Platform Spec Index"
tags:
  - "docs"
  - "specs"
  - "platform"
  - "index"
source_of_truth: "navigation"
related_docs:
  - "docs/specs/README.md"
  - "docs/adr/README.md"
  - "docs/plans/README.md"
  - "docs/specs/platform/tech-spec.md"
---

# Platform Specs

This folder contains the active spec set for the platform. Use these docs for the current intended design, contracts, and operator-facing behavior. Read ADRs for rationale and plans for sequencing.

## Scope Rules

- [Open Platform Technical Specification](tech-spec.md) owns the cross-cutting platform design.
- focused specs own their narrower domain and win if wording overlaps with the umbrella tech spec.
- plans sequence implementation of these specs; they do not replace them.

## Specs

| Doc | Status | Focus |
| --- | --- | --- |
| [Open Platform Technical Specification](tech-spec.md) | draft | end-to-end platform design, requirements, and acceptance criteria |
| [Secret Management](secret-management.md) | draft | current local, CI, runtime, and scanning secret model |
| [Repository Tooling](repository-tooling.md) | draft | package manager, orchestration, hooks, CI, dependency automation, and docs workflow model |
| [Testing Strategy](testing-strategy.md) | draft | behavior-focused TDD policy, layered test loops, and verification guidance |
| [Session Index API](session-index-api.md) | draft | typed frontend and backend API contract for the session index |
| [Session Index UX](session-index-ux.md) | draft | operator-facing UX model, states, and responsive behavior |

## Reading Paths

### Platform Overview

1. [Open Platform Technical Specification](tech-spec.md)
2. the focused spec for the area you are changing

### Backend Or Frontend Contract Work

1. [Session Index API](session-index-api.md)
2. [Session Index UX](session-index-ux.md)
3. [Testing Strategy](testing-strategy.md)

### Secrets, Tooling, Or CI Work

1. [Secret Management](secret-management.md) or [Repository Tooling](repository-tooling.md)
2. [Testing Strategy](testing-strategy.md) for gate expectations

## Related Docs

- [ADR Index](../../adr/README.md)
- [Plans Index](../../plans/README.md)
