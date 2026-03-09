---
title: "ADR-0010: Repository Automation with Buildkite and RenovateBot"
doc_id: "ADR-0010"
doc_type: "adr"
status: "accepted"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Adopt Buildkite for CI and RenovateBot for dependency update automation while keeping mise as the public task interface."
aliases:
  - "Buildkite and Renovate ADR"
  - "Repository Automation ADR"
tags:
  - "adr"
  - "ci"
  - "buildkite"
  - "renovate"
  - "automation"
source_of_truth: "durable-decision"
related_docs:
  - "docs/specs/platform/repository-tooling.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/plans/01-repo-foundations.md"
  - "docs/plans/06-observability-and-hardening.md"
supersedes: []
superseded_by: []
---

# ADR-0010: Repository Automation with Buildkite and RenovateBot

## Context

The repo needs durable choices for CI and dependency automation that fit a docs-first workflow and preserve `mise` as the public interface.

## Decision

- `Buildkite` is the CI system.
- `RenovateBot` manages dependency update automation.
- CI invokes repo-owned `mise` tasks.
- dependency update PRs must pass the same repo-defined checks as other changes.
- CI and automation are not parallel public workflow surfaces.

## Decision Details

### Buildkite

- Buildkite is the CI control plane
- Buildkite jobs run repo-owned tasks
- fast and slow loops can be separated in CI

### RenovateBot

- Renovate opens update PRs according to repo policy
- update noise should be controlled with grouping and review rules
- infrastructure-sensitive updates are not assumed safe by default

## Rationale

- Buildkite fits fast and slow CI layering well
- Renovate provides structured dependency maintenance without bespoke scripts
- keeping `mise` as the public interface prevents workflow drift

## Consequences

### Positive

- cleaner CI ownership
- automated dependency maintenance
- stronger alignment between local and CI workflows

### Negative

- more repo automation configuration to maintain
- dependency update policy must remain disciplined to avoid noisy churn

## Follow-Up

- current operational model lives in [Repository Tooling](../specs/platform/repository-tooling.md)
- rollout sequencing lives in [Repo Foundations](../plans/01-repo-foundations.md)
