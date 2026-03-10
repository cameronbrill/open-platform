---
title: "ADR-0002: Secret Bootstrap and Local Secret UX"
doc_id: "ADR-0002"
doc_type: "adr"
status: "superseded"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Historical rationale for operator-mediated bootstrap with declarative local secret UX through fnox; active backend and CI policy now live in ADR-0008."
aliases:
  - "Secret Bootstrap"
  - "Local Secret UX"
tags:
  - "adr"
  - "secrets"
  - "fnox"
  - "bootstrap"
source_of_truth: "durable-decision"
related_docs:
  - "docs/adr/0003-runtime-secret-materialization.md"
  - "docs/adr/0008-infisical-secret-management-and-ci-auth.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/plans/00-operator-prerequisites.md"
supersedes: []
superseded_by:
  - "docs/adr/0008-infisical-secret-management-and-ci-auth.md"
---

# ADR-0002: Secret Bootstrap and Local Secret UX

## Status Note

This ADR still explains why the repo uses an operator-mediated local secret UX, but [ADR-0008](0008-infisical-secret-management-and-ci-auth.md) is the active source of truth for backend selection, CI auth, and secret scanning policy.

## Context

The platform needs a local secret workflow for operator credentials, provider tokens, and per-environment configuration without storing secret values in the repo, in `.env` files, or in `nix` configuration.

The platform is single-user in v1 and needs a low-cognitive-load local secret workflow that remains declarative at the repo level.

## Decision

Use operator-mediated bootstrap with `fnox` as the local declarative secret UX layer.

Secret access follows this model:

- the active secret backend is external to the repo and must remain the source of truth for secret values
- `fnox` is the frontend used by repo tasks to declare and retrieve required local secret values
- `mise` is the only supported public path for secret-aware task execution
- `nix` may reference secret names or non-secret config, but must never contain secret values

The bootstrap model is operator-mediated:

- the operator authenticates to the active secret backend outside committed repo state
- `fnox` retrieves secrets on demand during task execution
- v1 does not rely on long-lived exported session tokens stored in repo-managed bootstrap artifacts

## Rationale

- best fit for a single-user local operator workflow
- keeps secret usage declarative in the repo without committing secret values
- keeps the backend choice abstract behind `fnox` if the platform later outgrows this model

## Guardrails

- do not store secret values in `nix`, `.env` files, shell profiles, or committed manifests
- do not commit secret material to the repo
- do not persist exported secret-session material in repo-managed bootstrap artifacts
- do not let application code fetch secrets directly from a local human-oriented secret UX path; secret retrieval stays behind operator-invoked `mise` workflows

## Consequences

### Positive

- simpler declarative local secret UX for the operator
- clear separation between repo-declared secret needs and secret value storage
- lower cognitive load for local secret-aware tasks

### Negative

- unattended machine-to-machine automation may need a more backend-native CI/auth path
- future multi-user or service-identity workflows may need additional secret-management policy

## Follow-Up

- pair this local secret UX policy with the active backend and CI auth policy
- define runtime materialization separately in [ADR-0003](0003-runtime-secret-materialization.md)
