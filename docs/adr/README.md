---
title: "Architecture Decision Records"
doc_id: "ADR-INDEX"
doc_type: "index"
status: "active"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Index of Open Platform architecture decision records."
aliases:
  - "ADR Index"
  - "Architecture Decisions"
tags:
  - "docs"
  - "adr"
  - "index"
  - "architecture"
source_of_truth: "navigation"
related_docs:
  - "docs/README.md"
  - "docs/specs/platform/README.md"
  - "docs/plans/README.md"
  - "docs/specs/platform/testing-strategy.md"
---

# Architecture Decision Records

ADRs capture durable platform choices and rationale. Use them to answer why a decision was made, what alternatives were considered, and what follow-up docs implement the decision.

## Reading Rules

- Read the matching spec after an ADR when you need current intended behavior or contracts.
- Proposed ADRs represent active decisions that still need confirmation.
- Accepted ADRs remain authoritative until superseded by a newer ADR.

## ADR Set

| Doc | Status | Focus |
| --- | --- | --- |
| [ADR-0001: Local Autonomous Coding Platform Architecture](0001-platform-architecture.md) | proposed | top-level v1 architecture, threat model, and tool ownership |
| [ADR-0002: Secret Bootstrap and 1Password Integration](0002-secret-bootstrap-and-1password-integration.md) | accepted | secret backend, operator bootstrap, and guardrails |
| [ADR-0003: Runtime Secret Materialization](0003-runtime-secret-materialization.md) | accepted | runtime secret injection and lifecycle policy |
| [ADR-0004: Local Substrate Selection](0004-local-substrate-selection.md) | proposed | hypervisor, networking, and local cluster substrate selection |
| [ADR-0005: Session Exposure and Routing](0005-session-exposure-and-routing.md) | proposed | session URL resolution, exposure, and routing contract |
| [ADR-0006: Session Index Stack and API Boundary](0006-session-index-stack-and-api-boundary.md) | accepted | thin session index stack, contract-first boundary, and UI constraints |
| [ADR-0007: Testing Strategy and Inner Feedback Loops](0007-testing-strategy-and-inner-feedback-loops.md) | accepted | behavior-focused TDD, layered test loops, and optional Tilt scope |

## Related Docs

- [Platform Specs](../specs/platform/README.md)
- [Implementation Plans](../plans/README.md)
