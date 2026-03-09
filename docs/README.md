---
title: "Documentation"
doc_id: "DOCS-INDEX"
doc_type: "index"
status: "active"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Canonical entrypoint, docs map, and source-of-truth guide for Open Platform."
aliases:
  - "Docs Index"
  - "Documentation Index"
tags:
  - "docs"
  - "index"
  - "navigation"
  - "qmd"
  - "obsidian"
source_of_truth: "navigation"
related_docs:
  - "docs/adr/README.md"
  - "docs/specs/README.md"
  - "docs/plans/README.md"
  - "docs/specs/platform/tech-spec.md"
---

# Documentation

Open Platform treats repository docs as the primary source of truth for architecture, intended behavior, and execution sequencing. Start here before reading code or editing plans.

## Source Of Truth Rules

- [ADRs](adr/README.md) record durable decisions and rationale.
- [Specs](specs/README.md) record what should be true now for current intended behavior and implementation requirements.
- [Plans](plans/README.md) record execution order, dependencies, milestones, and mutable work.
- If an ADR, spec, and plan disagree, use the spec for current behavior, the ADR for durable rationale, and the plan for sequencing only.
- If docs and implementation drift, call out the gap explicitly instead of silently choosing one source.

## Reading Paths

### New To The Repo

1. [Documentation](README.md)
2. [Specs Index](specs/README.md)
3. [Platform Specs](specs/platform/README.md)
4. the focused spec for the area you are touching
5. the supporting ADR or plan only as needed

### Implementing A Change

1. relevant spec
2. relevant ADR for rationale and durable constraints
3. relevant plan for sequencing and milestone context

### Reviewing Architecture Or Tradeoffs

1. [ADR Index](adr/README.md)
2. the matching ADR
3. the current spec that implements that decision

## ADRs

Status legend:

- `proposed` = candidate decision, not yet settled policy
- `accepted` = active durable decision
- `superseded` = historical context only; follow the replacement ADR

| Doc | Status | Use It For |
| --- | --- | --- |
| [ADR Index](adr/README.md) | active | navigate durable decisions |
| [ADR-0001: Local Autonomous Coding Platform Architecture](adr/0001-platform-architecture.md) | accepted | top-level platform architecture and v1 constraints |
| [ADR-0002: Secret Bootstrap and Local Secret UX](adr/0002-secret-bootstrap-and-local-secret-ux.md) | superseded | historical rationale for operator bootstrap and local secret UX |
| [ADR-0003: Runtime Secret Materialization](adr/0003-runtime-secret-materialization.md) | accepted | runtime secret injection, scoping, and cleanup rules |
| [ADR-0004: Local Substrate Selection](adr/0004-local-substrate-selection.md) | accepted | supported hypervisor, VM, cluster, policy, ingress, and storage matrix |
| [ADR-0005: Session Exposure and Routing](adr/0005-session-exposure-and-routing.md) | accepted | backend-owned open URL resolution, host-based routing, and localhost-only exposure contract |
| [ADR-0006: Session Index Stack and API Boundary](adr/0006-session-index-stack-and-api-boundary.md) | accepted | Go and TypeScript split, thin UI boundary, and contract-first rule |
| [ADR-0007: Testing Strategy and Inner Feedback Loops](adr/0007-testing-strategy-and-inner-feedback-loops.md) | accepted | behavior-focused TDD, layered test loops, and contract-drift protection |
| [ADR-0008: Infisical Secret Management and CI Auth](adr/0008-infisical-secret-management-and-ci-auth.md) | accepted | active secret backend, local secret UX layering, CI auth, and secret scanning direction |
| [ADR-0009: Monorepo Toolchain with pnpm, Nx, and nx-go](adr/0009-monorepo-toolchain-pnpm-nx-and-nx-go.md) | accepted | package management, orchestration, caching, and Go workspace model |
| [ADR-0010: Repository Automation with Buildkite and RenovateBot](adr/0010-repository-automation-buildkite-and-renovate.md) | accepted | CI runner and dependency update automation model |

## Specs

The tables below are navigational summaries. The target specs are the canonical source of current intended behavior.

| Doc | Status | Use It For |
| --- | --- | --- |
| [Specs Index](specs/README.md) | active | navigate active specs |
| [Platform Specs Index](specs/platform/README.md) | active | navigate platform implementation requirements |
| [Open Platform Technical Specification](specs/platform/tech-spec.md) | draft | end-to-end platform design and cross-cutting requirements |
| [Secret Management](specs/platform/secret-management.md) | draft | current local, CI, runtime, and scanning secret model |
| [Repository Tooling](specs/platform/repository-tooling.md) | draft | current package manager, orchestration, CI, dependency automation, and docs workflow model |
| [Testing Strategy](specs/platform/testing-strategy.md) | draft | behavior-focused TDD policy, layered test loops, and verification guidance |
| [Session Index API](specs/platform/session-index-api.md) | draft | typed frontend and backend API contract |
| [Session Index UX](specs/platform/session-index-ux.md) | draft | operator UX model and responsive behavior |

## Plans

These summaries are navigational only. The target plan files are canonical for sequencing and milestone detail.

| Doc | Status | Use It For |
| --- | --- | --- |
| [Plans Index](plans/README.md) | active | navigate milestones and numbered plans |
| [Initial Implementation Plan](plans/initial-implementation-plan.md) | draft | roadmap, milestone boundaries, dependency graph, and overlap rules |
| [Operator Prerequisites](plans/00-operator-prerequisites.md) | draft | manual setup and operator-owned blocking work |
| [Repo Foundations](plans/01-repo-foundations.md) | draft | repo skeleton, task surface, hooks, CI scaffolding, and docs conventions |
| [VM Bootstrap](plans/02-vm-bootstrap.md) | draft | NixOS VM setup, reproducibility, and recovery boundary |
| [Cluster Network and Kata](plans/03-cluster-network-and-kata.md) | draft | cluster substrate verification, policy enforcement, localhost behavior, and Kata validation |
| [Session Runtime](plans/04-session-runtime.md) | draft | end-to-end OpenCode runtime, auth, routing, and workspace behavior |
| [Session Index and Operator UX](plans/05-session-index-and-operator-ux.md) | draft | thin operator console, contract-first UI implementation, and supported recovery UX |
| [Observability and Hardening](plans/06-observability-and-hardening.md) | draft | telemetry, redaction, RBAC hardening, and final security validation |

## Current Defaults

- `Infisical` is the active secret backend and CI secret system per [ADR-0008](adr/0008-infisical-secret-management-and-ci-auth.md).
- `fnox` provides the declarative repo-managed local secret UX above `Infisical`.
- `pnpm` is the Node package manager and `Nx` is the internal orchestration layer per [ADR-0009](adr/0009-monorepo-toolchain-pnpm-nx-and-nx-go.md).
- `Buildkite` is CI and `RenovateBot` manages dependency updates per [ADR-0010](adr/0010-repository-automation-buildkite-and-renovate.md).
- backend code prefers `Go` and frontend code prefers `TypeScript` per [ADR-0006](adr/0006-session-index-stack-and-api-boundary.md).
- v1 requires an explicit frontend and backend API contract before UI implementation.
- v1 avoids SSR and avoids `React Router`.
- `mise` is the public entrypoint for validation, testing, and docs workflows.
- `dprint` is the public formatting entrypoint.
- behavior-focused TDD is the default engineering policy per [ADR-0007](adr/0007-testing-strategy-and-inner-feedback-loops.md).
- Tilt is optional and only used for slower integration and platform loops.

## QMD And Obsidian Notes

- `AGENTS.md` stays minimal and delegates detailed docs-routing rules to this index.
- frontmatter is the canonical metadata surface for status, tags, aliases, and related docs.
- folder `README.md` files act as map-of-content pages for both Obsidian and repository navigation.
- prefer Markdown links over raw path literals when referencing other docs.
- prefer `mise run docs:qmd:watch` during docs work; use `mise run docs:qmd:refresh` for a manual rebuild.
