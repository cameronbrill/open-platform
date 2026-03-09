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
---

# Architecture Decision Records

ADRs capture durable platform choices and rationale. Use them to answer why a decision was made, what alternatives were considered, and what current specs or plans implement the decision.

## Reading Rules

- `proposed` ADRs are candidate decisions, not settled policy.
- `accepted` ADRs are active durable decisions unless superseded.
- `superseded` ADRs remain historical context only; follow the replacement ADR.
- read the matching spec after an ADR when you need current intended behavior or contracts.
- if an ADR and a spec diverge, call out the drift instead of silently picking one.

## ADR Set

| Doc | Status | Focus |
| --- | --- | --- |
| [ADR-0001: Local Autonomous Coding Platform Architecture](0001-platform-architecture.md) | accepted | top-level v1 architecture, threat model, and tool ownership |
| [ADR-0002: Secret Bootstrap and Local Secret UX](0002-secret-bootstrap-and-local-secret-ux.md) | superseded | historical rationale for operator bootstrap and local secret UX |
| [ADR-0003: Runtime Secret Materialization](0003-runtime-secret-materialization.md) | accepted | runtime secret injection, scoping, and cleanup policy |
| [ADR-0004: Local Substrate Selection](0004-local-substrate-selection.md) | accepted | supported hypervisor, networking, ingress, storage, and cluster matrix |
| [ADR-0005: Session Exposure and Routing](0005-session-exposure-and-routing.md) | accepted | backend-owned URL resolution, host-based routing, and localhost-only exposure |
| [ADR-0006: Session Index Stack and API Boundary](0006-session-index-stack-and-api-boundary.md) | accepted | thin session index stack, contract-first boundary, and UI constraints |
| [ADR-0007: Testing Strategy and Inner Feedback Loops](0007-testing-strategy-and-inner-feedback-loops.md) | accepted | behavior-focused TDD, layered test loops, and contract-drift protection |
| [ADR-0008: Infisical Secret Management and CI Auth](0008-infisical-secret-management-and-ci-auth.md) | accepted | active secret backend, local secret UX layering, CI auth, and scanning direction |
| [ADR-0009: Monorepo Toolchain with pnpm, Nx, and nx-go](0009-monorepo-toolchain-pnpm-nx-and-nx-go.md) | accepted | package management, orchestration, caching, and Go workspace model |
| [ADR-0010: Repository Automation with Buildkite and RenovateBot](0010-repository-automation-buildkite-and-renovate.md) | accepted | CI runner and dependency update automation model |

## Read Next

- for current intended behavior, go to [Platform Specs](../specs/platform/README.md)
- for implementation order and milestone gates, go to [Plans](../plans/README.md)
