---
title: "ADR-0002: Secret Bootstrap and Local Secret UX"
doc_id: "ADR-0002"
doc_type: "adr"
status: "superseded"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Historical rationale for operator-mediated bootstrap and declarative local secret UX through fnox. Active backend, CI auth, and scanning policy now live in ADR-0008."
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
  - "docs/specs/platform/secret-management.md"
  - "docs/specs/platform/tech-spec.md"
supersedes: []
superseded_by:
  - "docs/adr/0008-infisical-secret-management-and-ci-auth.md"
---

# ADR-0002: Secret Bootstrap and Local Secret UX

## Status

This ADR remains useful for the local-UX rationale around operator-mediated bootstrap and `fnox`, but it is no longer the active decision for backend selection, CI auth, or secret scanning.

## Context

The platform needs a local secret workflow for operator credentials, provider tokens, and per-environment configuration without storing secret values in the repo, in `.env` files, or in `nix` configuration.

The platform is single-user in v1 and needs a low-cognitive-load local secret workflow that remains declarative at the repo level.

## Historical Decision

Use operator-mediated bootstrap with `fnox` as the local declarative secret UX layer.

The durable parts of that reasoning still apply:

- local secret-aware workflows should remain repo-declared
- `mise` should remain the supported public path for secret-aware task execution
- secret values must stay out of committed repo state, `.env` files, and `nix`
- repo tasks should not force ad hoc shell export conventions for normal local use

## What Changed

[ADR-0008](0008-infisical-secret-management-and-ci-auth.md) now records the active backend and CI decision:

- `Infisical` is the active backend and source of truth
- `fnox` remains the local declarative UX layer
- CI auth and pre-commit scanning are active parts of the secret model

This ADR should therefore be read as historical rationale for the operator-mediated local UX, not as the current end-to-end secret authority.

## Guardrails That Still Apply

- do not store secret values in `nix`, `.env` files, shell profiles, or committed manifests
- do not commit secret material to the repo
- do not persist exported secret-session material in repo-managed bootstrap artifacts
- do not let application code fetch secrets directly from a local human-oriented secret UX path; secret retrieval stays behind operator-invoked `mise` workflows

## Follow-Up

- active backend, CI auth, and scanning policy live in [ADR-0008](0008-infisical-secret-management-and-ci-auth.md)
- living operational detail lives in [Secret Management](../specs/platform/secret-management.md)
- runtime injection and cleanup policy live in [ADR-0003](0003-runtime-secret-materialization.md)
