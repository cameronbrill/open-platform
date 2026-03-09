---
title: "Repository Tooling"
doc_id: "SPEC-PLATFORM-TOOLING-001"
doc_type: "spec"
status: "draft"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Current tooling, task-surface, CI, dependency automation, and docs workflow model for the Open Platform repository."
aliases:
  - "Platform Tooling"
  - "Repo Tooling"
tags:
  - "spec"
  - "tooling"
  - "mise"
  - "pnpm"
  - "nx"
  - "buildkite"
source_of_truth: "implementation-requirements"
related_docs:
  - "docs/adr/0009-monorepo-toolchain-pnpm-nx-and-nx-go.md"
  - "docs/adr/0010-repository-automation-buildkite-and-renovate.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/secret-management.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/plans/01-repo-foundations.md"
---

# Repository Tooling

## Purpose

Define the current active repository tooling model for package management, orchestration, hooks, CI, dependency automation, and docs workflows.

## Scope

- public task surface
- package and workspace management
- orchestration and caching
- hook execution
- CI and dependency automation
- docs indexing and refresh workflows

## Source Of Truth Rules

- [ADR-0009](../../adr/0009-monorepo-toolchain-pnpm-nx-and-nx-go.md) records the durable toolchain decision.
- [ADR-0010](../../adr/0010-repository-automation-buildkite-and-renovate.md) records the durable CI and dependency automation decision.
- this spec defines the current operational detail and command ownership.
- [Testing Strategy](testing-strategy.md) owns testing policy and gate expectations, not this file.

## Tool Ownership Matrix

| Tool | Owns | Does Not Own |
| --- | --- | --- |
| `mise` | public commands, task environments, tool pinning, docs refresh entrypoints | low-level system provisioning, hidden bespoke workflows |
| `Nx` | internal task graph, affected execution, caching, project orchestration | the public operator/contributor command surface |
| `pnpm` | Node dependency installation and workspace lockfile | cross-language orchestration policy |
| `@nx-go/nx-go` | default Go project integration for Nx | permanent excuse for undocumented exceptions |
| `nix` | system configuration, reproducible VM definitions, machine packages | secret values or day-to-day public repo task names |
| `hk` | local hook installation and execution policy | ad hoc standalone validation logic |
| `dprint` | public formatting entrypoint | broader linting or test orchestration |
| `Buildkite` | CI execution of documented repo-owned tasks | a parallel public workflow model |
| `RenovateBot` | dependency update PR generation | validation policy or review policy ownership |
| QMD | docs discovery and retrieval index | architectural source of truth |

## Public Command Surface

The supported public workflow surface is `mise`.

Rules:

- operators, contributors, and CI invoke documented `mise` tasks
- `mise` may delegate internally to `Nx`, language tooling, docs tooling, or scripts
- raw `nx`, `pnpm`, or shell scripts are implementation details unless a spec explicitly promotes them
- scripts under `scripts/` must be called through `mise` when they are part of a supported workflow

## Command Surface Maturity

### Required Now

- `mise run fmt`
- `mise run fmt:check`
- `mise run lint`
- `mise run lint:ts`
- `mise run lint:go`
- `mise run typecheck`
- `mise run typecheck:ts`
- `mise run build`
- `mise run build:ts`
- `mise run build:go`
- `mise run test`
- `mise run test:go`
- `mise run test:ts`
- `mise run test:contract`
- `mise run secrets:scan`
- `mise run validate`
- `mise run check`
- `mise run docs:qmd:refresh`
- `mise run docs:qmd:watch`

### Required By Later Milestones

- `mise run test:integration`
- `mise run test:e2e`
- `mise run cluster:smoke`
- `mise run security:smoke`
- `mise run obs:smoke`
- `mise run cluster:doctor`
- `mise run cluster:reset`
- `mise run session:create`
- `mise run session:list`
- `mise run session:open`
- `mise run session:restart`
- `mise run session:delete`
- `mise run session:logs`

### Optional

- `mise run dev:tilt`

## Package Management

### Node

- `pnpm` is the only supported Node package manager
- `pnpm-lock.yaml` is the canonical lockfile
- Corepack pins the package-manager version for supported workflows
- repo-owned TypeScript packages use workspace-aware dependency management

### Go

- Go uses a multi-module workspace by default where that layout improves repo organization
- Go build and test commands remain reachable through `mise`
- Go project layouts should stay conventional enough for `@nx-go/nx-go` support where practical

## Orchestration And Caching

- `Nx` owns project graph evaluation and affected execution behind `mise`
- target names should stay stable and human-meaningful where they surface through `mise`
- cacheable versus non-cacheable targets must be declared intentionally
- when `@nx-go/nx-go` inference is insufficient, use explicit Nx target configuration before inventing a new public workflow

## Hook Model

- `hk` installs and runs repo-managed hooks
- hooks invoke repo-owned `mise` tasks
- hook scope stays fast enough for normal local use
- staged secret scanning is part of the default pre-commit path

## CI Model

- Buildkite runs documented repo-owned `mise` tasks
- Buildkite may use `Nx` internally for affected execution, but that remains an implementation detail
- required versus advisory gates must be documented in repo specs
- a required green Buildkite result attests that the documented required tasks for that change class passed
- privileged secret access is limited to jobs that need it and must align with [Secret Management](secret-management.md)

## Dependency Automation Model

- RenovateBot opens dependency update PRs under repo-managed policy
- update grouping and review expectations stay explicit
- dependency update PRs run the same relevant documented gates as normal PRs
- high-risk updates may require broader review or slower suites

## Docs Tooling And QMD

- QMD discovery is repo-managed and refreshed through `mise`
- `mise run docs:qmd:watch` is the preferred docs-work loop
- `mise run docs:qmd:refresh` is the manual refresh path after substantial docs changes
- docs indexes remain navigational summaries; the target docs remain canonical

## Contributor Workflow Examples

### Add a TypeScript package

1. add the package in the workspace using `pnpm`
2. wire the project into repo-owned tooling conventions
3. expose supported validation through `mise`
4. run the relevant fast loop through `mise`

### Add a Go module or service

1. create the Go project in the conventional workspace layout
2. integrate it through `@nx-go/nx-go` or explicit Nx configuration if needed
3. expose supported build and test paths through `mise`
4. run the relevant fast loop through `mise`

### Run pre-merge validation

1. use the relevant documented `mise` tasks locally
2. let Buildkite run the documented required CI path
3. use slower milestone-gated suites only when the change crosses those boundaries

### Refresh docs discovery after major docs edits

1. run `mise run docs:qmd:refresh`
2. verify indexes and references still resolve cleanly

## Acceptance Criteria

- one public task surface exists and is documented through `mise`
- package management, orchestration, hooks, CI, and docs workflows have clear owners
- CI and local workflows share the same supported task names wherever practical
- command maturity is documented
- fallback behavior for Go and Nx integration is documented
- docs refresh and discovery workflows are repo-managed
