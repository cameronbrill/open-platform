---
title: "ADR-0008: Infisical Secret Management, fnox UX, and CI Auth"
doc_id: "ADR-0008"
doc_type: "adr"
status: "accepted"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Adopt Infisical as the active secret backend, use fnox for declarative repo-driven local secret UX, and use Infisical for CI auth and pre-commit secret scanning."
aliases:
  - "Infisical Secret Management ADR"
  - "fnox Secret UX ADR"
  - "CI Secret Auth ADR"
tags:
  - "adr"
  - "secrets"
  - "infisical"
  - "ci"
  - "security"
source_of_truth: "durable-decision"
related_docs:
  - "docs/specs/platform/secret-management.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/plans/00-operator-prerequisites.md"
  - "docs/plans/01-repo-foundations.md"
supersedes:
  - "docs/adr/0002-secret-bootstrap-and-local-secret-ux.md"
superseded_by: []
---

# ADR-0008: Infisical Secret Management, fnox UX, and CI Auth

## Context

The platform needs one current secret system that works for:

- local operator workflows
- CI access
- task-mediated runtime materialization
- pre-commit secret scanning

## Decision

- `Infisical` is the active secret management backend and source of truth.
- `fnox` provides the declarative repo-level secret UX for local secret-aware workflows.
- CI authenticates to `Infisical` using a CI-appropriate machine identity or equivalent supported auth flow.
- runtime secret delivery remains task-mediated.
- `Infisical` is also used for pre-commit secret scanning.

## Decision Details

### Local Operator Auth Model

- local operator workflows use repo-declared `fnox` configuration backed by `Infisical`
- repo tasks retrieve secrets through `fnox` for local secret-aware execution
- committed `.env` files remain disallowed

### CI Auth Model

- CI uses a scoped machine-oriented auth flow
- CI retrieves secrets at job runtime rather than baking them into pipeline definitions
- CI bootstrap credentials must remain minimal, rotated, and tightly scoped
- CI may authenticate directly to `Infisical` even if local operator workflows are mediated by `fnox`

### Runtime Materialization

- task-mediated materialization remains the runtime model
- secrets are fetched late, scoped narrowly, and cleaned up when sessions or workflows end

### Secret Scanning

- staged secret scanning is required in pre-commit workflows
- secret scanning complements, but does not replace, runtime leak prevention and telemetry redaction

## Rationale

- one system for local and CI secret access reduces split-brain
- `Infisical` fits unattended CI access better than a purely human-oriented vault flow
- `fnox` provides the declarative, low-cognitive-load, repo-owned UX the operator wants for local work
- keeping task-mediated runtime materialization avoids adding Kubernetes-side secret operators before they are needed

## Consequences

### Positive

- cleaner local and CI secret model
- one current source of truth for secret values
- declarative secret requirements and mappings can live in the repo
- simpler future path for automation and CI-backed validation

### Negative

- more operational complexity than a purely local human vault workflow
- one additional local tool must be understood and maintained
- CI bootstrap auth requires careful scoping and rotation

## Alternatives Considered

### Use direct `Infisical` CLI only

- simpler toolchain on paper
- weaker fit for declarative, repo-driven, low-cognitive-load local secret UX

### Introduce Kubernetes-native secret delivery first

- possible later
- not necessary for the current task-mediated runtime model

## Follow-Up

- operational details live in [Secret Management](../specs/platform/secret-management.md)
- repo sequencing lives in [Operator Prerequisites](../plans/00-operator-prerequisites.md) and [Repo Foundations](../plans/01-repo-foundations.md)
