---
title: "Initial Implementation Plan"
doc_id: "PLAN-INIT-001"
doc_type: "plan"
status: "draft"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Roadmap, milestone boundaries, and dependency graph for the v1 platform implementation."
aliases:
  - "Implementation Plan"
  - "Roadmap"
tags:
  - "plan"
  - "roadmap"
  - "milestones"
  - "execution"
source_of_truth: "execution-plan"
scope: "roadmap for v1 single-user localhost-only platform bootstrap"
depends_on:
  - "docs/plans/00-operator-prerequisites.md"
blocks: []
source_docs:
  - "docs/adr/0001-platform-architecture.md"
  - "docs/specs/platform/tech-spec.md"
related_docs:
  - "docs/plans/README.md"
  - "docs/adr/0001-platform-architecture.md"
  - "docs/specs/platform/secret-management.md"
  - "docs/specs/platform/repository-tooling.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/tech-spec.md"
---

# Initial Implementation Plan

## Purpose

Provide the high-level execution roadmap for implementing v1 of the platform.

This file is intentionally roadmap-oriented. Detailed execution lives in the numbered plans listed in the [Plans Index](README.md).

Plans 03 and 04 currently depend on still-proposed ADRs for substrate and routing. Treat those plans as working execution direction until [ADR-0004](../adr/0004-local-substrate-selection.md) and [ADR-0005](../adr/0005-session-exposure-and-routing.md) are accepted or explicitly deferred.

## In Scope

- sequencing the numbered implementation plans
- defining milestone boundaries
- showing dependencies and exit criteria between plans

## Out of Scope

- step-by-step implementation details that live in numbered plans
- operator-only manual setup details
- recording architecture decisions that belong in [the ADR set](../adr/README.md)

## Plan Set

- [Operator Prerequisites](00-operator-prerequisites.md)
- [Repo Foundations](01-repo-foundations.md)
- [VM Bootstrap](02-vm-bootstrap.md)
- [Cluster Network and Kata](03-cluster-network-and-kata.md)
- [Session Runtime](04-session-runtime.md)
- [Session Index and Operator UX](05-session-index-and-operator-ux.md)
- [Observability and Hardening](06-observability-and-hardening.md)

## Milestones

### Milestone 0: Operator Prerequisites Complete

Outcome:

- manual host, account, and secret prerequisites are complete
- Infisical backend access works for the operator and CI prerequisites are available
- local declarative `fnox` secret workflows are ready for repo use
- Graphite is installed and configured for the supported git workflow
- blocking choices are captured in ADRs or explicitly deferred

### Milestone 1: Repo and Workflow Foundations

Outcome:

- repo skeleton exists
- `mise` is the operator entrypoint
- `pnpm`, `Nx`, and `@nx-go/nx-go` repo conventions are established
- project-level OpenCode config, agents, and skills are committed to the repo
- `hk`, Infisical secret scanning, declarative `fnox` secret UX, Buildkite, and Renovate foundations are in place
- Graphite workflow is documented as the standard contribution model
- QMD discovery is repo-managed and refreshable through `mise`
- docs refresh automation exists for active docs work
- formatting, linting, typechecking, build, and validation task surfaces are documented
- the layered testing strategy and fast/slow feedback loops are documented

### Milestone 2: VM Bootstrap

Outcome:

- reproducible `NixOS` VM exists
- operator can access and rebuild it reliably
- Go and TypeScript build prerequisites exist in the supported operator path

### Milestone 3: Cluster, Network, and Kata

Outcome:

- `minikube` is reproducible
- localhost exposure assumptions are verified
- `NetworkPolicy` enforcement is verified
- Kata works with a test workload or is blocked by an explicit decision

### Milestone 4: Session Runtime

Outcome:

- one isolated OpenCode session runs in Kubernetes
- a local browser can reach one authenticated `opencode web` session
- runtime secret flow and per-session auth behavior are documented and working
- runtime behavior tests exist for the session lifecycle

### Milestone 5: Session Index and Operator UX

Outcome:

- operator can create, open, inspect, and delete sessions through supported flows
- the session API contract, state model, and UX spec are documented before implementation coupling grows
- recovery commands exist for common failure cases
- API contract tests and UI behavior tests exist for the session index boundary

### Milestone 6: Observability and Hardening

Outcome:

- OTEL and Better Stack are wired
- telemetry redaction is enforced
- localhost-only, least-privilege, and auth leakage assumptions are validated
- slower platform and security regression suites exist for critical guarantees
- Buildkite-backed slow validation and dependency-update gates are in place

## Milestone Dependency Graph

- `00-operator-prerequisites.md` blocks all other plans
- `01-repo-foundations.md` blocks `02` through `06`
- `02-vm-bootstrap.md` blocks `03` through `06`
- `03-cluster-network-and-kata.md` blocks `04` through `06`
- `04-session-runtime.md` blocks `05` and `06`
- `05-session-index-and-operator-ux.md` and `06-observability-and-hardening.md` can overlap after `04`

## v1 Done Definition

- one operator can bring the platform up locally
- one Kata-backed session is reachable in a browser
- session lifecycle is manageable through supported commands and the index page
- observability works without exporting sensitive content by default
- localhost-only security posture is verified
- the API boundary between backend and frontend is documented before UI implementation
- build, lint, typecheck, format, and validation commands are documented through `mise`
- package management, orchestration, CI, dependency automation, and secret scanning are documented through living specs
- Graphite-based stacked workflow is documented and expected
- `main` is treated as the clean integration baseline
- fast local behavior tests exist for repo-owned code and contracts
- slower platform verification exists for environment-sensitive behaviors
- Tilt remains optional and is not required for v1 completion
- the design is ready for a later authenticated remote-access layer

## Risks / Notes

- keep this file summary-oriented and stable
- move execution details into the numbered plan files
- record lasting architecture choices in [the ADR set](../adr/README.md), not in plan files
