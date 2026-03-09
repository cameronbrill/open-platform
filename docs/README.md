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
| [ADR-0002: Secret Bootstrap and 1Password Integration](adr/0002-secret-bootstrap-and-1password-integration.md) | accepted | secret backend and operator-mediated bootstrap |
| [ADR-0003: Runtime Secret Materialization](adr/0003-runtime-secret-materialization.md) | accepted | runtime secret injection and lifecycle rules |
| [ADR-0004: Local Substrate Selection](adr/0004-local-substrate-selection.md) | proposed | hypervisor, networking, and local cluster substrate choices |
| [ADR-0005: Session Exposure and Routing](adr/0005-session-exposure-and-routing.md) | proposed | session URL resolution and localhost-only routing direction |
| [ADR-0006: Session Index Stack and API Boundary](adr/0006-session-index-stack-and-api-boundary.md) | accepted | Go and TypeScript split, thin UI boundary, and API-first rule |

## Specs

| Doc | Status | Use It For |
| --- | --- | --- |
| [Specs Index](specs/README.md) | active | navigate active specs |
| [Platform Specs Index](specs/platform/README.md) | active | navigate platform spec docs |
| [Open Platform Technical Specification](specs/platform/tech-spec.md) | draft | current intended platform design and implementation requirements |
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

- `fnox` retrieves secret values from `1Password` per [ADR-0002](adr/0002-secret-bootstrap-and-1password-integration.md).
- Backend code prefers `Go` and frontend code prefers `TypeScript` per [ADR-0006](adr/0006-session-index-stack-and-api-boundary.md).
- v1 requires an explicit frontend and backend API contract before UI implementation.
- v1 avoids SSR and avoids `React Router`.
- `dprint` is the public formatting entrypoint.

## QMD And Obsidian Notes

- `AGENTS.md` stays minimal and delegates detailed docs-routing rules to this index.
- Frontmatter is the canonical metadata surface for status, tags, aliases, and related docs.
- Folder `README.md` files act as map-of-content pages for both Obsidian and repository navigation.
- Prefer Markdown links over raw path literals when referencing other docs.
- Prefer `mise run docs:qmd:watch` during docs work; use `mise run docs:qmd:refresh` for a manual rebuild.
