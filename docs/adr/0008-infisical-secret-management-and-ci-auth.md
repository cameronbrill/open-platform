---
title: "ADR-0008: Infisical Secret Management, fnox UX, and CI Auth"
doc_id: "ADR-0008"
doc_type: "adr"
status: "accepted"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Adopt Infisical as the active secret backend, keep fnox as the declarative local UX layer, and use scoped machine-oriented CI auth and secret scanning."
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
  - "docs/specs/platform/repository-tooling.md"
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
- `fnox` provides the declarative repo-level local secret UX above that backend.
- CI authenticates to `Infisical` using a scoped machine-oriented auth flow.
- runtime secret delivery remains task-mediated.
- `Infisical` is used for pre-commit secret scanning.

## Boundary Rules

- `Infisical` owns secret storage, CI auth, and secret scanning capabilities
- `fnox` owns repo-declared local secret mappings and secret-aware local execution behavior
- `mise` remains the supported public path above both for normal repo workflows

## CI Trust Rules

- CI bootstrap credentials must remain minimal, rotated, auditable, and tightly scoped
- untrusted or minimally trusted jobs must not receive broader secret access than their documented responsibilities require
- CI may authenticate directly to `Infisical` even when local human workflows are mediated by `fnox`

## Break-Glass Rules

- direct `Infisical` CLI usage is allowed for documented operator bootstrap, recovery, or debugging paths
- direct CLI usage is not the normal contributor workflow when repo-managed `fnox` plus `mise` paths exist
- break-glass use must not become an undocumented replacement for the normal task-mediated model

## Rationale

- one system for local and CI secret access reduces split-brain
- `Infisical` fits unattended CI access better than a purely human-oriented vault flow
- `fnox` preserves the declarative, low-cognitive-load, repo-owned UX wanted for local work

## Follow-Up

- operational naming, rotation, revocation, and runtime rules live in [Secret Management](../specs/platform/secret-management.md)
- repo task-surface and CI execution detail live in [Repository Tooling](../specs/platform/repository-tooling.md)
