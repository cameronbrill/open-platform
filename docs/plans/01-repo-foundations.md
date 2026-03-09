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
  - "docs/specs/platform/repository-tooling.md"
  - "docs/specs/platform/secret-management.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/session-index-api.md"
  - "docs/specs/platform/session-index-ux.md"
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

## Deliverables

- repo skeleton and directory layout
- public `mise` task surface for required-now workflows
- documented later-milestone task names reserved in the tooling spec
- hook scaffolding through `hk`
- initial Buildkite and Renovate configuration
- docs discovery and QMD refresh workflows
- active tooling, secret, testing, API, and UX specs committed to the repo

## Tasks

### Repository Skeleton

- create missing directories from the tech spec
- ensure docs paths match the current organization

### Public `mise` Task Surface

Required in this milestone:

- `fmt`, `fmt:check`
- `lint`, `lint:ts`, `lint:go`
- `typecheck`, `typecheck:ts`
- `build`, `build:ts`, `build:go`
- `test`, `test:go`, `test:ts`, `test:contract`
- `secrets:scan`
- `validate`, `check`
- `docs:qmd:refresh`, `docs:qmd:watch`

Reserved for later milestones and documented in specs:

- `test:integration`, `test:e2e`
- `cluster:smoke`, `security:smoke`, `obs:smoke`
- `cluster:doctor`, `cluster:reset`
- `session:create`, `session:list`, `session:open`, `session:restart`, `session:delete`, `session:logs`

### Tooling And Hook Scaffolding

- wire `pnpm`, `Nx`, and `@nx-go/nx-go` according to the tooling spec
- route hooks through `mise`
- include staged secret scanning in the pre-commit path

### CI And Dependency Automation

- add the initial Buildkite pipeline skeleton
- ensure Buildkite runs repo-owned `mise` tasks
- add Renovate configuration aligned with documented repo policy

### Docs And Contracts

- keep `docs/README.md` and the folder indexes aligned with the current source-of-truth model
- ensure [Session Index API](../specs/platform/session-index-api.md) and [Session Index UX](../specs/platform/session-index-ux.md) exist before session-index implementation starts
- keep [Repository Tooling](../specs/platform/repository-tooling.md), [Secret Management](../specs/platform/secret-management.md), and [Testing Strategy](../specs/platform/testing-strategy.md) as current-truth docs

## Validation

- `mise` exposes a coherent required-now operator surface
- hooks can run locally through `mise`
- Buildkite and Renovate configuration exist in the repo
- docs discovery can refresh through repo-managed tasks
- current-truth specs exist for tooling, secrets, testing, API, and UX

## Exit Criteria

- repo has a clean implementation skeleton
- task, formatting, linting, hook, CI, and dependency automation ownership are clear
- no ambiguity remains about `mise` vs scripts vs `nix` ownership
- contract-first session-index work is unblocked by the required docs
