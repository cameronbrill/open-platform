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
  - "docs/specs/platform/secret-management.md"
  - "docs/specs/platform/repository-tooling.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/tech-spec.md"
---

# Initial Implementation Plan

## Purpose

Provide the high-level execution roadmap for implementing v1 of the platform.

## In Scope

- sequencing the numbered implementation plans
- defining milestone boundaries and decision gates
- showing dependencies and overlap rules between plans

## Out of Scope

- step-by-step implementation detail that lives in numbered plans
- operator-only manual setup details
- recording durable architecture decisions that belong in ADRs

## Milestones

### Milestone 0: Operator Prerequisites Complete

Outcome:

- manual host, account, and secret prerequisites are complete
- the selected substrate assumptions are supportable on the operator machine
- Infisical local access and CI bootstrap prerequisites are available
- blocking deviations are recorded before implementation continues

### Milestone 1: Repo And Workflow Foundations

Outcome:

- repo skeleton exists
- `mise` is the public entrypoint
- `pnpm`, `Nx`, `@nx-go/nx-go`, hooks, Buildkite, Renovate, and docs discovery foundations are in place
- the fast-loop command surface is documented and usable
- API, UX, tooling, secret, and testing specs exist as active current-truth docs

### Milestone 2: VM Bootstrap

Outcome:

- reproducible `NixOS` VM exists on the selected Hyper-V path
- operator can access, rebuild, and recover the VM reliably
- nested-virtualization viability is confirmed early enough to block later work if needed

### Milestone 3: Cluster, Network, And Kata

Outcome:

- `minikube` on the selected substrate is reproducible
- Calico policy enforcement is verified
- ingress-nginx and localhost-only forwarding assumptions are verified
- Kata works with a test workload on the supported matrix or implementation stops behind an explicit replacement decision

### Milestone 4: Session Runtime

Outcome:

- one isolated OpenCode session runs end to end
- a local browser can reach one authenticated `opencode web` session through the approved host-based routing model
- runtime secret flow, per-session auth bootstrap behavior, and workspace cleanup behavior are documented and working
- runtime recovery and doctor/reset behavior exist for the next milestone to consume

### Milestone 5: Session Index And Operator UX

Outcome:

- operator can create, open, inspect, restart, and delete sessions through supported flows
- implementation follows the approved API and UX specs rather than inventing a parallel contract
- recovery guidance exists for common session failures
- contract tests and operator-visible UI behavior tests exist for the session index boundary

### Milestone 6: Observability And Hardening

Outcome:

- OTEL and Better Stack export are wired only after redaction proof exists
- telemetry redaction, localhost-only behavior, least privilege, and auth non-leakage assumptions are validated
- slower platform, observability, and security regression suites exist for critical guarantees
- final recovery and incident guidance exists for supported v1 use

## Milestone Dependency Graph

- `00-operator-prerequisites.md` blocks all other plans
- `01-repo-foundations.md` blocks `02` through `06`
- `02-vm-bootstrap.md` blocks `03` through `06`
- `03-cluster-network-and-kata.md` blocks `04` through `06`
- `04-session-runtime.md` blocks `05` and enables preparatory observability work for `06`
- `05-session-index-and-operator-ux.md` supplies final operator-visible behavior needed for `06` signoff

## Overlap Rules

- Plan 06 may start preparatory instrumentation work after Plan 04 produces stable runtime events
- Plan 06 is not complete until Plan 05 finishes the final operator-visible auth, error, and recovery flows

## v1 Done Definition

- one operator can bring the platform up locally
- one Kata-backed session is reachable in a browser through the supported localhost-only path
- session lifecycle is manageable through supported commands and the index page
- observability works without exporting sensitive content by default
- localhost-only security posture and deny-by-default networking are verified
- the API boundary between backend and frontend is documented before UI implementation
- build, lint, typecheck, format, docs refresh, and validation commands are documented through `mise`
- package management, orchestration, CI, dependency automation, and secret handling are documented through living specs
- fast local behavior tests exist for repo-owned code and contracts
- slower platform verification exists for environment-sensitive behaviors
- doctor, reset, and recovery guidance exists for the supported failure path
- the design is ready for a later authenticated remote-access layer
