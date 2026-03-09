# Initial Implementation Plan

- Status: Draft
- Date: 2026-03-08
- Scope: roadmap for v1 single-user localhost-only platform bootstrap
- Depends on:
  - `docs/plans/00-operator-prerequisites.md`
- Source docs:
  - `docs/adr/0001-platform-architecture.md`
  - `docs/specs/platform/tech-spec.md`

## Purpose

Provide the high-level execution roadmap for implementing v1 of the platform.

This file is intentionally roadmap-oriented. Detailed execution lives in the numbered plans in `docs/plans/`.

## In Scope

- sequencing the numbered implementation plans
- defining milestone boundaries
- showing dependencies and exit criteria between plans

## Out of Scope

- step-by-step implementation details that live in numbered plans
- operator-only manual setup details
- recording architecture decisions that belong in `docs/adr/`

## Plan Set

- `docs/plans/00-operator-prerequisites.md`
- `docs/plans/01-repo-foundations.md`
- `docs/plans/02-vm-bootstrap.md`
- `docs/plans/03-cluster-network-and-kata.md`
- `docs/plans/04-session-runtime.md`
- `docs/plans/05-session-index-and-operator-ux.md`
- `docs/plans/06-observability-and-hardening.md`

## Milestones

### Milestone 0: Operator Prerequisites Complete

Outcome:

- manual host, account, and secret prerequisites are complete
- `1Password` + `fnox` bootstrap works for the operator
- blocking choices are captured in ADRs or explicitly deferred

### Milestone 1: Repo and Workflow Foundations

Outcome:

- repo skeleton exists
- `mise` is the operator entrypoint
- `hk` and `fnox` conventions are in place
- formatting, linting, typechecking, build, and validation task surfaces are documented

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

### Milestone 5: Session Index and Operator UX

Outcome:

- operator can create, open, inspect, and delete sessions through supported flows
- the session API contract, state model, and UX spec are documented before implementation coupling grows
- recovery commands exist for common failure cases

### Milestone 6: Observability and Hardening

Outcome:

- OTEL and Better Stack are wired
- telemetry redaction is enforced
- localhost-only, least-privilege, and auth leakage assumptions are validated

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
- the design is ready for a later authenticated remote-access layer

## Risks / Notes

- keep this file summary-oriented and stable
- move execution details into the numbered plan files
- record lasting architecture choices in `docs/adr/`, not in plan files
