---
title: "Repository Tooling"
doc_id: "SPEC-PLATFORM-TOOLING-001"
doc_type: "spec"
status: "draft"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Current tooling architecture for package management, task orchestration, Go project integration, CI, dependency automation, and secret scanning."
aliases:
  - "Repo Tooling"
  - "Monorepo Tooling"
tags:
  - "spec"
  - "tooling"
  - "pnpm"
  - "nx"
  - "buildkite"
  - "renovate"
source_of_truth: "implementation-requirements"
related_docs:
  - "docs/specs/platform/secret-management.md"
  - "docs/adr/0009-monorepo-toolchain-pnpm-nx-and-nx-go.md"
  - "docs/adr/0010-repository-automation-buildkite-and-renovate.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/plans/01-repo-foundations.md"
---

# Repository Tooling

## Purpose

Define the current active tooling architecture for the repo.

## Scope

- package management
- task orchestration
- caching
- Go project integration and scaffolding
- CI execution
- dependency update automation
- secret scanning integration

## Out Of Scope

- application architecture itself
- runtime session behavior beyond tooling boundaries
- deep CI runbook detail unless needed for contributor understanding

## Related Documents

- [ADR-0009: Monorepo Toolchain with pnpm, Nx, and nx-go](../../adr/0009-monorepo-toolchain-pnpm-nx-and-nx-go.md)
- [ADR-0010: Repository Automation with Buildkite and RenovateBot](../../adr/0010-repository-automation-buildkite-and-renovate.md)
- [Open Platform Technical Specification](tech-spec.md)
- [Testing Strategy](testing-strategy.md)

## Tool Ownership Model

### `mise`

- public developer and operator entrypoint
- environment bootstrap and stable task surface

### `fnox`

- declarative repo-level secret UX for local secret-aware workflows
- maps repo-declared secret names and profiles to the active backend
- integrates with `mise` rather than replacing it

### `pnpm`

- Node package manager
- workspace dependency management
- lockfile ownership

### `Nx`

- project graph
- target graph
- orchestration
- caching
- affected execution

### `@nx-go/nx-go`

- Go project integration and scaffolding
- inferred targets for Go projects
- multi-module Go workspace conventions

### `Buildkite`

- CI execution system
- runs repo-owned tasks

### `RenovateBot`

- dependency update automation
- bounded by repo policy

### `Infisical`

- active secret backend and secret scanning integration
- active secret-management model is covered more fully in [Secret Management](secret-management.md)

## Package Management Policy

- `pnpm` is the required Node package manager
- pin package manager version through Corepack
- `pnpm-lock.yaml` is the canonical lockfile
- use `workspace:` protocol for internal package references where appropriate
- do not commit npm or yarn lockfiles
- prefer the default strict workspace model unless a specific tool proves it needs a documented exception

Expected install flow:

- contributors use the repo-managed environment to run `pnpm install`
- CI uses lockfile-driven installs and should prefer frozen lockfile behavior

## Workspace Layout Conventions

- document where TypeScript apps, tools, and packages live
- document where Go projects live
- document where shared docs/tooling packages live if added later

## Nx Model

### Mental Model

- projects
- targets
- project graph
- task graph
- affected execution
- caching

Use `Nx` as the internal execution engine for repo tasks, while keeping `mise` as the public interface that contributors and operators invoke.

### Target Vocabulary

- define expected common targets such as `build`, `test`, `lint`, `typecheck`, and docs-related targets
- keep the public task surface routed through `mise`

### Caching Policy

- cache deterministic tasks
- avoid caching stateful or environment-sensitive platform checks unless they are truly reproducible
- prefer correctness over aggressive cache coverage
- local caching is the default expectation; remote caching can be added later if the repo proves it is worth the complexity

## Go Workspace Model

### Multi-Module Convention

- root `go.work`
- per-project `go.mod`
- clear app and library layout rules

### `@nx-go/nx-go` Conventions

- use the plugin for Go project integration and scaffolding
- keep project layout conventional so inferred targets work reliably
- document version and maturity constraints in repo tooling updates
- treat the plugin as community-maintained and pin compatible Nx/plugin versions intentionally

## CI Model

### Buildkite Responsibilities

- run repo-owned tasks
- separate fast and slow validation where appropriate
- preserve local and CI parity by avoiding bespoke CI-only command surfaces

Fast checks should be cheap enough for routine PR use. Slower platform and security loops may run on broader gates such as `main`, scheduled builds, or explicitly promoted CI paths.

### Local vs CI Parity

- local commands should map cleanly to CI commands
- CI should not invent a separate public workflow surface

## Dependency Update Policy

### Renovate Scope

- supported managers should include the ecosystems actually used in this repo
- start narrow and expand intentionally

The initial intended scope should include at least:

- `npm`
- `gomod`
- `mise`
- `dockerfile`
- `buildkite`

`nix` or flake support may be added later with explicit caution because support quality and risk tolerance differ from the more standard managers above.

### Noise Control

- use grouping, schedules, and review rules to avoid update spam
- use dashboards or approval flows for higher-risk updates
- keep PR concurrency intentionally low until the repo's update volume is understood

### Review Policy

- lower-risk tooling updates may later be streamlined
- higher-risk infra and major-version changes should remain review-heavy by default

## Secret Scanning Integration

- Infisical staged secret scanning runs in pre-commit workflows
- secret scanning complements but does not replace runtime leak-prevention checks
- ignore and allowlist policy should remain explicit and narrow

The canonical staged scan should be routed through `mise` rather than a bespoke local command.

## Contributor Guidance

- use `mise` to bootstrap the environment
- use repo-declared `fnox` flows for local secret-aware execution
- use `pnpm` for Node dependency management
- use `Nx` for internal project/task orchestration
- follow the multi-module Go conventions when adding Go code
- treat Buildkite as the CI runner for repo-owned tasks, not as a separate manual workflow surface

## Acceptance Criteria

- package manager policy is explicit
- task/orchestration model is explicit
- declarative local secret UX ownership is explicit
- Go workspace and scaffolding model is explicit
- CI model is explicit
- dependency automation policy is explicit
- secret scanning role is explicit
