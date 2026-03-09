---
title: "ADR-0009: Monorepo Toolchain with pnpm, Nx, and nx-go"
doc_id: "ADR-0009"
doc_type: "adr"
status: "accepted"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Adopt pnpm for Node package management, Nx for orchestration and caching, and @nx-go/nx-go for multi-module Go project integration."
aliases:
  - "Monorepo Toolchain ADR"
  - "pnpm Nx nx-go ADR"
tags:
  - "adr"
  - "tooling"
  - "pnpm"
  - "nx"
  - "go"
source_of_truth: "durable-decision"
related_docs:
  - "docs/specs/platform/repository-tooling.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/plans/01-repo-foundations.md"
supersedes: []
superseded_by: []
---

# ADR-0009: Monorepo Toolchain with pnpm, Nx, and nx-go

## Context

The repo needs a consistent package manager, orchestration layer, caching model, and Go workspace/scaffolding model for a mixed Go and TypeScript codebase.

## Decision

- `pnpm` is the Node package manager.
- `Nx` is the repo task graph, orchestration, and caching layer.
- `@nx-go/nx-go` is the Go/Nx integration plugin.
- the Go workspace model is multi-module-first:
  - root `go.work`
  - per-project `go.mod`
- `mise` remains the public interface for contributors and operators.
- `Nx` operates beneath `mise` as the orchestration layer.

## Decision Details

### `pnpm`

- one workspace package manager
- one shared lockfile
- Corepack-pinned version model

### `Nx`

- project graph
- task graph
- caching
- affected execution
- not a replacement for `mise`

### `@nx-go/nx-go`

- used for Go project integration and scaffolding
- assumes multi-module Go layout
- version pairing and caveats live in the spec

## Rationale

- strong fit for monorepo dependency and task management
- better incremental orchestration than ad hoc scripting
- clearer repo-wide structure for Go and TypeScript projects

## Consequences

### Positive

- clearer repo-wide task model
- faster incremental work through caching and affected execution
- stronger project structure for Go and TypeScript

### Negative

- more tooling and config overhead
- Nx and nx-go correctness depends on disciplined inputs, outputs, and project conventions
- nx-go maturity and version compatibility must be tracked explicitly

## Alternatives Considered

### npm without Nx

- simpler initially
- weaker orchestration, caching, and graph model

### one-module Go layout

- possible
- not the preferred scaffolding model for this repo

## Follow-Up

- operational details live in [Repository Tooling](../specs/platform/repository-tooling.md)
- rollout sequencing lives in [Repo Foundations](../plans/01-repo-foundations.md)
