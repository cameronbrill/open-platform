---
title: "ADR-0010: Repository Automation with Buildkite and RenovateBot"
doc_id: "ADR-0010"
doc_type: "adr"
status: "accepted"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Adopt Buildkite as the CI runner for repo-owned mise tasks and RenovateBot for dependency update automation under the same documented gates."
aliases:
  - "Repository Automation ADR"
  - "Buildkite and Renovate ADR"
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
  - "docs/specs/platform/secret-management.md"
  - "docs/adr/0008-infisical-secret-management-and-ci-auth.md"
  - "docs/plans/01-repo-foundations.md"
supersedes: []
superseded_by: []
---

# ADR-0010: Repository Automation with Buildkite and RenovateBot

## Context

The repo needs one CI system and one dependency-update automation system that:

- run repo-owned validation through documented entrypoints
- preserve the docs-first source-of-truth model
- keep trust boundaries explicit for secrets and privileged automation
- avoid inventing a second workflow surface separate from local development

## Decision

Adopt the following v1 automation model:

- `Buildkite` is the CI system.
- `Buildkite` runs documented repo-owned `mise` tasks.
- `RenovateBot` manages dependency update automation.
- dependency-update PRs must pass the same relevant documented gates as normal PRs.

## CI Trust Rules

- CI is a runner for repo-owned workflows, not the source of truth for workflow definition.
- privileged secret access must be limited to documented jobs that need it.
- untrusted or minimally trusted change paths must not receive broader secret access than their documented validation requires.
- a green required Buildkite result means the documented required gates for that change class passed; it does not imply undocumented or advisory checks passed.

## Repository Automation Rules

- required versus advisory gates must be documented in living specs, not inferred from pipeline shape alone
- CI should prefer `mise` tasks that may delegate internally to `Nx`
- CI task names should match local task names wherever possible
- Renovate PRs follow the same gate model as human-authored PRs for the relevant change scope

## Rationale

- Buildkite is a good fit for repo-owned task execution and explicit gate control.
- RenovateBot reduces dependency drift while keeping review and validation policy centralized.
- using the same public task surface locally and in CI lowers docs drift.

## Consequences

### Positive

- one documented validation surface for local and CI usage
- clearer trust signaling for reviewers and maintainers
- dependency updates stay inside normal repo quality gates

### Negative

- CI trust policy must be documented and maintained carefully
- slower platform and security suites still need intentional scheduling and scoping

## Alternatives Considered

### CI-specific workflow definitions as the main source of truth

Rejected because it would drift from the repo-managed `mise` task surface.

### Manual dependency upgrades only

Rejected because the repo needs a consistent, reviewable update path for toolchain and dependency drift.

## Follow-Up

- define the operational CI and dependency automation model in [Repository Tooling](../specs/platform/repository-tooling.md)
- define gate ownership and test-layer expectations in [Testing Strategy](../specs/platform/testing-strategy.md)
- align CI auth and secret access detail with [Secret Management](../specs/platform/secret-management.md)
