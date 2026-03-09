---
title: "ADR-0009: Monorepo Toolchain with pnpm, Nx, and nx-go"
doc_id: "ADR-0009"
doc_type: "adr"
status: "accepted"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Adopt pnpm for Node package management, Nx for internal orchestration and caching, @nx-go/nx-go for Go integration, and mise as the only public task interface."
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
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/plans/01-repo-foundations.md"
supersedes: []
superseded_by: []
---

# ADR-0009: Monorepo Toolchain with pnpm, Nx, and nx-go

## Context

The platform needs one repo-managed tooling model for:

- Node package management
- task orchestration and caching
- Go and TypeScript project discovery
- CI execution through repo-owned entrypoints
- contributor workflows that stay simple at the command line

The repo already prefers `mise` as the public task surface and uses docs-first specifications to define current operational detail.

## Decision

Adopt the following v1 tooling model:

- `pnpm` is the only supported Node package manager.
- `Nx` is the internal orchestration and caching layer for repo tasks.
- `@nx-go/nx-go` is the default Go integration path for Nx.
- `mise` is the only supported public command surface for operators, contributors, and CI.
- scripts remain implementation details and must not become a parallel public workflow surface.

## Boundary Rules

- Contributors and CI invoke documented `mise` tasks, not raw `nx` graphs, package-manager scripts, or ad hoc shell commands, as the supported interface.
- `Nx` owns project graph evaluation, affected execution, and cacheable target orchestration behind `mise`.
- `pnpm-lock.yaml` is the canonical Node lockfile.
- Go projects should remain conventional enough for `@nx-go/nx-go` inference to work reliably where practical.

## Fallback Rules

When `@nx-go/nx-go` inference is insufficient for a specific project shape, the fallback is:

1. keep `mise` as the public entrypoint
2. keep the target inside the repo-owned `Nx` graph where practical
3. use explicit Nx target configuration or generators before inventing a separate public script surface
4. document the exception in the living tooling spec

Fallbacks must preserve the durable decision that `mise` is the supported interface and that Go and TypeScript workflows still participate in repo-owned validation.

## Rationale

- `pnpm` gives fast, workspace-aware dependency management with one lockfile.
- `Nx` provides graph-aware orchestration and caching without replacing the repo's public task surface.
- `@nx-go/nx-go` gives a credible default path for Go integration in the same repo model as TypeScript projects.
- keeping `mise` public and `Nx` internal prevents shadow workflow surfaces from forming.

## Consequences

### Positive

- one supported command surface for humans and CI
- one canonical Node package manager and lockfile
- shared task vocabulary across frontend, backend, docs, and platform work
- room for affected execution and caching without exposing orchestration internals as product policy

### Negative

- contributors may need to learn both the public and internal layers
- Go layout must stay disciplined enough for plugin support to remain ergonomic
- some exceptional cases will still need explicit Nx configuration

## Alternatives Considered

### Raw package-manager and Makefile driven workflows

Rejected because they create more drift risk between local execution, CI execution, and docs-owned task names.

### Expose `nx` directly as the public interface

Rejected because the repo already treats `mise` as the stable operator and contributor entrypoint.

### Avoid Go integration with Nx entirely

Rejected because it would create an avoidable split between Go and TypeScript workflow ownership in the monorepo.

## Follow-Up

- define operational detail, command maturity, and contributor examples in [Repository Tooling](../specs/platform/repository-tooling.md)
- scaffold the initial command surface and project layout in [Repo Foundations](../plans/01-repo-foundations.md)
