---
title: "Plans"
doc_id: "PLAN-INDEX"
doc_type: "index"
status: "active"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Index of roadmap and execution plans for Open Platform."
aliases:
  - "Plans Index"
  - "Plan Index"
tags:
  - "docs"
  - "plans"
  - "index"
  - "roadmap"
source_of_truth: "navigation"
related_docs:
  - "docs/README.md"
  - "docs/adr/README.md"
  - "docs/specs/platform/README.md"
---

# Plans

Plans track execution order, dependencies, milestones, blockers, and mutable implementation work. Use plans for what happens next and what is blocked by what.

## Reading Rules

- start with [Initial Implementation Plan](initial-implementation-plan.md) for the roadmap and milestone graph
- then read the numbered plan that matches the current milestone
- plans do not replace ADRs or specs; they sequence implementation of them
- if a plan conflicts with a spec, treat the spec as the current intended behavior and update the plan

## Plan Set

| Doc | Status | Focus |
| --- | --- | --- |
| [Initial Implementation Plan](initial-implementation-plan.md) | draft | roadmap, milestone boundaries, dependency graph, and overlap rules |
| [Operator Prerequisites](00-operator-prerequisites.md) | draft | manual setup and operator-owned blocking work |
| [Repo Foundations](01-repo-foundations.md) | draft | repo skeleton, task surface, hook policy, CI scaffolding, and docs conventions |
| [VM Bootstrap](02-vm-bootstrap.md) | draft | NixOS VM reproducibility, operator access, and recovery boundary |
| [Cluster Network and Kata](03-cluster-network-and-kata.md) | draft | cluster substrate verification, localhost behavior, and Kata validation |
| [Session Runtime](04-session-runtime.md) | draft | end-to-end session runtime, auth, routing, and workspace lifecycle |
| [Session Index and Operator UX](05-session-index-and-operator-ux.md) | draft | thin operator console, API contract implementation, and supported recovery UX |
| [Observability and Hardening](06-observability-and-hardening.md) | draft | telemetry, redaction, hardening, and final validation |

## Start Here If...

- you need the overall roadmap: [Initial Implementation Plan](initial-implementation-plan.md)
- you are starting from a fresh operator environment: [Operator Prerequisites](00-operator-prerequisites.md)
- you are implementing the current milestone: read the matching numbered plan after the roadmap

## Related Docs

- [ADR Index](../adr/README.md)
- [Specs Index](../specs/README.md)
