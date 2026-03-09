# Repo Foundations

- Status: Draft
- Date: 2026-03-08
- Scope: repository structure, task surface, hook policy, quality gates, and operator-facing conventions
- Depends on:
  - `docs/plans/00-operator-prerequisites.md`
- Blocks:
  - `docs/plans/02-vm-bootstrap.md`
  - `docs/plans/03-cluster-network-and-kata.md`
  - `docs/plans/04-session-runtime.md`
  - `docs/plans/05-session-index-and-operator-ux.md`
  - `docs/plans/06-observability-and-hardening.md`

## Purpose

Establish the repo as the single source of truth for configuration, tasks, hooks, API docs, and implementation structure.

## In Scope

- repo skeleton
- `mise.toml`
- `.config/hk/`
- docs and directory structure matching the tech spec
- quality-gate command surface
- `fnox` integration conventions at the repo level

## Out of Scope

- VM provisioning
- cluster bring-up
- app runtime behavior

## Deliverables

- `mise.toml`
- `.config/hk/`
- initial directory skeleton under:
  - `nixos/`
  - `cluster/`
  - `apps/session-index/`
  - `images/opencode-session/`
  - `telemetry/betterstack/`
- documented repo task conventions
- documented API and UX spec locations

## Tasks

### Repository Skeleton

- create missing directories from the tech spec
- ensure docs paths match the current organization

### Public `mise` Task Surface

- define stable public tasks for:
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
  - `validate`
  - `check`
- make `mise` the primary public interface
- reserve internal-only helper namespaces for implementation details

### Formatting, Linting, and Typechecking Policy

- define `dprint` as the public formatting entrypoint
- define `oxfmt` as the TypeScript or JavaScript formatter under `dprint`
- define `go fmt` as the Go formatter under `dprint`
- define `oxlint` for TypeScript linting
- define `golangci-lint` for Go linting
- define `tsc --noEmit` for TypeScript typechecking

### `hk` Hook Policy

- define the initial hook set
- route hooks through `mise`
- include secret scanning and validation checks

### `fnox` Conventions

- define how `mise` tasks receive secrets from `fnox`
- document the approved `1Password` retrieval model
- document banned persistence patterns

### Documentation and Contracts

- update root docs so a new operator knows the supported entrypoints
- make sure plans, specs, and ADRs cross-reference cleanly
- reserve `docs/specs/platform/session-index-api.md` and `docs/specs/platform/session-index-ux.md` as the contract sources for the session index

### Local Inner Loop and Fixtures

- define a fast loop for docs, frontend, and task-surface work
- define a full loop for VM, cluster, and Kata validation
- reserve fixture strategy for sample repos, network policy, Kata, and telemetry redaction

## Validation

- `mise tasks` exposes a coherent operator surface
- quality-gate task names are documented
- hooks can run locally through `mise`
- repo layout matches the tech spec
- API and UX spec locations are clearly documented

## Exit Criteria

- repo has a clean implementation skeleton
- task, formatting, linting, and hook ownership are clear
- no ambiguity remains about `mise` vs scripts vs `nix` ownership

## Risks / Notes

- keep repo ergonomics simple early; avoid overfitting the task structure before real usage
