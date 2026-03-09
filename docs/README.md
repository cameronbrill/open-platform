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
  - "docs/specs/platform/testing-strategy.md"
---

# Documentation

Open Platform treats repository docs as the primary source of truth for architecture, intended behavior, and execution sequencing. Start here before reading code or editing plans.

## Source Of Truth Rules

- [ADRs](adr/README.md) record durable decisions and rationale.
- [Specs](specs/README.md) record the current intended design and implementation requirements.
- [Plans](plans/README.md) record execution order, dependencies, milestones, and mutable work.
- If docs and implementation drift, call out the gap explicitly instead of silently choosing one source.

## Reading Order

1. [Documentation](README.md)
2. [ADR Index](adr/README.md)
3. [Specs Index](specs/README.md)
4. [Plans Index](plans/README.md)
5. The specific ADR, spec, or plan that matches the question

## ADRs

| Doc | Status | Use It For |
| --- | --- | --- |
| [ADR Index](adr/README.md) | active | navigate durable decisions |
| [ADR-0001: Local Autonomous Coding Platform Architecture](adr/0001-platform-architecture.md) | proposed | top-level platform architecture and v1 constraints |
| [ADR-0002: Secret Bootstrap and Local Secret UX](adr/0002-secret-bootstrap-and-local-secret-ux.md) | accepted | operator-mediated bootstrap and declarative local secret UX |
| [ADR-0003: Runtime Secret Materialization](adr/0003-runtime-secret-materialization.md) | accepted | runtime secret injection and lifecycle rules |
| [ADR-0004: Local Substrate Selection](adr/0004-local-substrate-selection.md) | proposed | hypervisor, networking, and local cluster substrate choices |
| [ADR-0005: Session Exposure and Routing](adr/0005-session-exposure-and-routing.md) | proposed | session URL resolution and localhost-only routing direction |
| [ADR-0006: Session Index Stack and API Boundary](adr/0006-session-index-stack-and-api-boundary.md) | accepted | Go and TypeScript split, thin UI boundary, and API-first rule |
| [ADR-0007: Testing Strategy and Inner Feedback Loops](adr/0007-testing-strategy-and-inner-feedback-loops.md) | accepted | behavior-focused TDD, layered test loops, and optional Tilt scope |
| [ADR-0008: Infisical Secret Management and CI Auth](adr/0008-infisical-secret-management-and-ci-auth.md) | accepted | active secret manager, CI auth, and secret scanning direction |
| [ADR-0009: Monorepo Toolchain with pnpm, Nx, and nx-go](adr/0009-monorepo-toolchain-pnpm-nx-and-nx-go.md) | accepted | package management, task orchestration, caching, and Go workspace model |
| [ADR-0010: Repository Automation with Buildkite and RenovateBot](adr/0010-repository-automation-buildkite-and-renovate.md) | accepted | CI system and dependency update automation |

## Specs

| Doc | Status | Use It For |
| --- | --- | --- |
| [Specs Index](specs/README.md) | active | navigate active specs |
| [Platform Specs Index](specs/platform/README.md) | active | navigate platform spec docs |
| [Open Platform Technical Specification](specs/platform/tech-spec.md) | draft | current intended platform design and implementation requirements |
| [Secret Management](specs/platform/secret-management.md) | draft | current local, CI, runtime, and scanning secret model |
| [Repository Tooling](specs/platform/repository-tooling.md) | draft | current package manager, orchestration, CI, and dependency automation model |
| [Testing Strategy](specs/platform/testing-strategy.md) | draft | behavior-focused TDD policy, layered test loops, and feedback-loop guidance |
| [Session Index API](specs/platform/session-index-api.md) | draft | typed frontend and backend API contract |
| [Session Index UX](specs/platform/session-index-ux.md) | draft | operator UX model and responsive behavior |

## Plans

| Doc | Status | Use It For |
| --- | --- | --- |
| [Plans Index](plans/README.md) | active | navigate milestones and numbered plans |
| [Initial Implementation Plan](plans/initial-implementation-plan.md) | draft | roadmap, milestone boundaries, and dependency graph |
| [Operator Prerequisites](plans/00-operator-prerequisites.md) | draft | manual setup and blocking operator-owned decisions |
| [Repo Foundations](plans/01-repo-foundations.md) | draft | repo skeleton, tasks, hooks, and docs conventions |
| [VM Bootstrap](plans/02-vm-bootstrap.md) | draft | NixOS VM setup and reproducibility boundary |
| [Cluster Network and Kata](plans/03-cluster-network-and-kata.md) | draft | cluster substrate, ingress, localhost behavior, and Kata validation |
| [Session Runtime](plans/04-session-runtime.md) | draft | end-to-end OpenCode session runtime, auth, and routing |
| [Session Index and Operator UX](plans/05-session-index-and-operator-ux.md) | draft | thin session console, contract-first UI, and recovery UX |
| [Observability and Hardening](plans/06-observability-and-hardening.md) | draft | telemetry, redaction, RBAC hardening, and final validation |

## Current Defaults

- `Infisical` is the active secret backend and CI secret system per [ADR-0008](adr/0008-infisical-secret-management-and-ci-auth.md).
- `fnox` provides the declarative repo-managed local secret UX backed by `Infisical`.
- `Infisical` secret scanning is used in pre-commit workflows.
- `pnpm` is the Node package manager per [ADR-0009](adr/0009-monorepo-toolchain-pnpm-nx-and-nx-go.md).
- `Nx` is the task orchestration and caching layer, with `@nx-go/nx-go` for Go integration.
- `Buildkite` is CI and `RenovateBot` manages dependency updates per [ADR-0010](adr/0010-repository-automation-buildkite-and-renovate.md).
- Backend code prefers `Go` and frontend code prefers `TypeScript` per [ADR-0006](adr/0006-session-index-stack-and-api-boundary.md).
- v1 requires an explicit frontend and backend API contract before UI implementation.
- v1 avoids SSR and avoids `React Router`.
- `dprint` is the public formatting entrypoint.
- Behavior-focused TDD is the default engineering policy per [ADR-0007](adr/0007-testing-strategy-and-inner-feedback-loops.md).
- `mise` is the public entrypoint for validation and testing workflows.
- Tilt is optional and only used for slower integration and platform loops.

## QMD And Obsidian Notes

- `AGENTS.md` stays minimal and delegates detailed docs-routing rules to this index.
- Frontmatter is the canonical metadata surface for status, tags, aliases, and related docs.
- Folder `README.md` files act as map-of-content pages for both Obsidian and repository navigation.
- Prefer Markdown links over raw path literals when referencing other docs.
- Prefer `mise run docs:qmd:watch` during docs work; use `mise run docs:qmd:refresh` for a manual rebuild.
