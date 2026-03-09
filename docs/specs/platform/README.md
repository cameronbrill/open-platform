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
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/secret-management.md"
  - "docs/specs/platform/repository-tooling.md"
---

# Platform Specs

This folder contains the active spec set for the platform. Read these after the relevant ADRs when you need the current intended design, contracts, and operator-facing behavior.

## Specs

| Doc | Status | Focus |
| --- | --- | --- |
| [Open Platform Technical Specification](tech-spec.md) | draft | end-to-end platform design, requirements, and acceptance criteria |
| [Secret Management](secret-management.md) | draft | current local, CI, runtime, and scanning secret model |
| [Repository Tooling](repository-tooling.md) | draft | package manager, orchestration, CI, and dependency automation model |
| [Testing Strategy](testing-strategy.md) | draft | behavior-focused TDD policy, layered test loops, and fixture strategy |
| [Session Index API](session-index-api.md) | draft | typed frontend and backend API contract for the session index |
| [Session Index UX](session-index-ux.md) | draft | operator-facing UX model, states, and responsive behavior |

## Reading Order

1. [Open Platform Technical Specification](tech-spec.md)
2. [Secret Management](secret-management.md)
3. [Repository Tooling](repository-tooling.md)
4. [Testing Strategy](testing-strategy.md)
5. [Session Index API](session-index-api.md)
6. [Session Index UX](session-index-ux.md)

## Related Docs

- [ADR Index](../../adr/README.md)
- [Plans Index](../../plans/README.md)
