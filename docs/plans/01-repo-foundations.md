---
title: "Repo Foundations"
doc_id: "PLAN-001"
doc_type: "plan"
status: "draft"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Repository skeleton, task surface, package/tooling foundations, CI automation, and docs discovery conventions for the platform."
aliases:
  - "Plan 01"
  - "Repo Foundations Plan"
tags:
  - "plan"
  - "repo"
  - "mise"
  - "hk"
  - "docs"
source_of_truth: "execution-plan"
scope: "repository structure, task surface, package/tooling foundations, quality gates, and operator-facing conventions"
depends_on:
  - "docs/plans/00-operator-prerequisites.md"
blocks:
  - "docs/plans/02-vm-bootstrap.md"
  - "docs/plans/03-cluster-network-and-kata.md"
  - "docs/plans/04-session-runtime.md"
  - "docs/plans/05-session-index-and-operator-ux.md"
  - "docs/plans/06-observability-and-hardening.md"
related_docs:
  - "docs/README.md"
  - "docs/specs/platform/secret-management.md"
  - "docs/specs/platform/repository-tooling.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/specs/platform/session-index-api.md"
  - "docs/specs/platform/session-index-ux.md"
  - "docs/adr/0007-testing-strategy-and-inner-feedback-loops.md"
  - "docs/adr/0008-infisical-secret-management-and-ci-auth.md"
  - "docs/adr/0009-monorepo-toolchain-pnpm-nx-and-nx-go.md"
  - "docs/adr/0010-repository-automation-buildkite-and-renovate.md"
---

# Repo Foundations

## Purpose

Establish the repo as the single source of truth for configuration, tasks, hooks, API docs, and implementation structure.

## In Scope

- repo skeleton
- `mise.toml`
- `pnpm-workspace.yaml`
- `.npmrc`
- `pnpm-lock.yaml`
- `nx.json`
- `.config/hk/`
- `.buildkite/`
- `renovate.json`
- `.infisical-scan.toml`
- `.infisicalignore`
- `fnox.toml`
- docs and directory structure matching the tech spec
- quality-gate command surface
- secret scanning and active tooling conventions at the repo level
- repo-managed OpenCode agent config and docs discovery automation

## Out of Scope

- VM provisioning
- cluster bring-up
- app runtime behavior

## Deliverables

- `mise.toml`
- `pnpm-workspace.yaml`
- `.npmrc`
- `pnpm-lock.yaml`
- `nx.json`
- `AGENTS.md`
- `opencode.json`
- `.agents/agents/`
- `.agents/skills/`
- `.opencode/agents -> ../.agents/agents`
- `.config/hk/`
- `.buildkite/`
- `renovate.json`
- `.infisical-scan.toml`
- `.infisicalignore`
- `fnox.toml`
- initial directory skeleton under:
  - `nixos/`
  - `cluster/`
  - `apps/session-index/`
  - `images/opencode-session/`
  - `telemetry/betterstack/`
- documented repo task conventions
- documented secret-management and repository-tooling spec locations
- documented API and UX spec locations
- documented testing strategy location and test task conventions

## Tasks

### Repository Skeleton

- create missing directories from the tech spec
- ensure docs paths match the current organization

### Public `mise` Task Surface

- define stable public tasks for:
  - `docs:qmd:init`
  - `docs:qmd:refresh`
  - `docs:qmd:watch`
  - `fmt`
  - `fmt:check`
  - `lint`
  - `lint:ts`
  - `lint:go`
  - `typecheck`
  - `typecheck:ts`
  - `build`
  - `build:ts`
  - `build:go`
  - `secrets:scan`
  - `test`
  - `test:go`
  - `test:ts`
  - `test:contract`
  - `test:integration`
  - `test:e2e`
  - `cluster:smoke`
  - `security:smoke`
  - `obs:smoke`
  - `validate`
  - `check`
- make `mise` the primary public interface
- reserve internal-only helper namespaces for implementation details
- reserve optional `dev:tilt` as a contributor-only accelerator for slow loops

### Formatting, Linting, and Typechecking Policy

- define `dprint` as the public formatting entrypoint
- define `oxfmt` as the TypeScript or JavaScript formatter under `dprint`
- define `go fmt` as the Go formatter under `dprint`
- define `oxlint` for TypeScript linting
- define `golangci-lint` for Go linting
- define `tsc --noEmit` for TypeScript typechecking

### `pnpm` Package Management Policy

- define `pnpm` as the required Node package manager
- pin the package manager version through Corepack
- treat `pnpm-lock.yaml` as the canonical Node lockfile

### `Nx` Task Graph And Cache Policy

- define `Nx` as the internal orchestration and caching layer
- keep `mise` as the public interface above `Nx`
- define the initial target vocabulary and cache expectations

### Go Workspace And `@nx-go/nx-go` Conventions

- adopt a multi-module Go workspace with root `go.work`
- use `@nx-go/nx-go` for Go project integration and scaffolding
- document layout expectations needed for reliable plugin inference

### Test Task Conventions

- define fast local behavior-focused tasks for unit, component, and contract testing
- define slower integration and end-to-end tasks separately from the fast loop
- keep `check` focused on the fast local loop unless explicitly documented otherwise
- keep Tilt optional and layered under `mise` rather than exposing it as the primary path
- treat `fmt`, `lint`, `typecheck`, `build`, `test`, `test:go`, `test:ts`, `test:contract`, `validate`, and `check` as the minimum required v1 surface
- treat `test:integration`, `test:e2e`, `cluster:smoke`, `security:smoke`, and `obs:smoke` as milestone-gated capabilities that may arrive later than the fast loop

### `hk` Hook Policy

- define the initial hook set
- route hooks through `mise`
- include secret scanning and validation checks

### `Infisical` Backend Conventions

- define how `mise` tasks perform secret-aware execution with Infisical
- document the approved local and CI retrieval models
- document secret scanning and ignore policy
- document banned persistence patterns

### `fnox` Declarative UX Conventions

- define repo-managed `fnox` config for local secret-aware execution
- document how `fnox` maps local secret names and profiles to the Infisical backend
- keep `fnox` as a local UX layer beneath `mise`, not a replacement public interface

### Buildkite CI Surface

- add the initial Buildkite pipeline skeleton
- ensure Buildkite runs repo-owned `mise` tasks
- keep fast and slow validation loops alignable with the testing strategy

### Renovate Configuration

- add Renovate configuration for the intended managers
- document grouping, approval, and review policy
- keep dependency automation aligned with repo quality gates

### Documentation and Contracts

- update [the docs index](../README.md) so a new operator knows the supported entrypoints
- make sure plans, specs, and ADRs cross-reference cleanly
- reserve [Secret Management](../specs/platform/secret-management.md) and [Repository Tooling](../specs/platform/repository-tooling.md) as living current-truth docs
- reserve [Session Index API](../specs/platform/session-index-api.md) and [Session Index UX](../specs/platform/session-index-ux.md) as the contract sources for the session index

### OpenCode and Docs Discovery

- keep `AGENTS.md` minimal and point detailed docs-routing behavior to [the docs index](../README.md)
- commit `opencode.json`, `.agents/agents/`, and `.agents/skills/` to the repo
- use `.opencode/agents` only as a compatibility symlink to `.agents/agents`
- manage `qmd` and file-watching through `mise`
- automate docs discovery refresh during docs work

### Local Inner Loop and Fixtures

- define a fast loop for docs, frontend, and task-surface work
- define a default `mise` integration loop for cross-boundary behavior
- define an optional Tilt-assisted slow loop for repeated platform validation
- reserve fixture strategy for sample repos, API payloads, network policy, Kata, and telemetry redaction

## Validation

- `mise tasks` exposes a coherent operator surface
- quality-gate task names are documented
- hooks can run locally through `mise`
- OpenCode project config and skills are repo-managed
- QMD refresh works through repo-managed `mise` tasks
- docs discovery can refresh automatically during docs work
- repo layout matches the tech spec
- package management, orchestration, CI, and dependency automation docs exist
- staged secret scanning can run through repo-managed hooks and tasks
- declarative local secret UX config exists in the repo
- Buildkite and Renovate configuration exist in the repo
- API and UX spec locations are clearly documented
- layered test and validation task names are documented through `mise`

## Exit Criteria

- repo has a clean implementation skeleton
- task, formatting, linting, and hook ownership are clear
- docs discovery and agent config are reproducible across checkouts
- fast and slow validation loops are documented and distinguished
- package management, orchestration, secret scanning, CI, and dependency automation foundations are documented and scaffolded
- local secret UX and active secret backend roles are documented and scaffolded
- no ambiguity remains about `mise` vs scripts vs `nix` ownership

## Risks / Notes

- keep repo ergonomics simple early; avoid overfitting the task structure before real usage
