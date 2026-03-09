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

Plans track execution order, dependencies, milestones, blockers, and mutable implementation work. Use plans for what is happening next and what is blocked by what.

## Reading Rules

- Start with [Initial Implementation Plan](initial-implementation-plan.md) for the roadmap and milestone graph.
- Then read the numbered plan that matches the current milestone.
- Plans do not replace ADRs or specs; they sequence implementation of them.

## Plan Set

| Doc | Status | Focus |
| --- | --- | --- |
| [Initial Implementation Plan](initial-implementation-plan.md) | draft | roadmap, milestone boundaries, and dependency graph |
| [Operator Prerequisites](00-operator-prerequisites.md) | draft | manual setup and operator-owned blocking work |
| [Repo Foundations](01-repo-foundations.md) | draft | repo skeleton, task surface, hook policy, and docs conventions |
| [VM Bootstrap](02-vm-bootstrap.md) | draft | NixOS VM reproducibility and operator tooling |
| [Cluster Network and Kata](03-cluster-network-and-kata.md) | draft | cluster substrate, localhost behavior, and Kata validation |
| [Session Runtime](04-session-runtime.md) | draft | end-to-end session runtime, auth, and routing |
| [Session Index and Operator UX](05-session-index-and-operator-ux.md) | draft | thin operator console, API contract, and recovery UX |
| [Observability and Hardening](06-observability-and-hardening.md) | draft | telemetry, redaction, hardening, and final validation |

## Recommended Reading Order

1. [Initial Implementation Plan](initial-implementation-plan.md)
2. [Operator Prerequisites](00-operator-prerequisites.md)
3. [Repo Foundations](01-repo-foundations.md)
4. [VM Bootstrap](02-vm-bootstrap.md)
5. [Cluster Network and Kata](03-cluster-network-and-kata.md)
6. [Session Runtime](04-session-runtime.md)
7. [Session Index and Operator UX](05-session-index-and-operator-ux.md)
8. [Observability and Hardening](06-observability-and-hardening.md)
