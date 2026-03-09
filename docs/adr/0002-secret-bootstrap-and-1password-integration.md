---
title: "ADR-0002: Secret Bootstrap and 1Password Integration"
doc_id: "ADR-0002"
doc_type: "adr"
status: "accepted"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Use 1Password as the v1 secret backend behind fnox and operator-invoked mise workflows."
aliases:
  - "Secret Bootstrap"
  - "1Password Integration"
tags:
  - "adr"
  - "secrets"
  - "1password"
  - "fnox"
  - "bootstrap"
source_of_truth: "durable-decision"
related_docs:
  - "docs/adr/0003-runtime-secret-materialization.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/plans/00-operator-prerequisites.md"
supersedes: []
superseded_by: []
---

# ADR-0002: Secret Bootstrap and 1Password Integration

## Context

The platform needs a secret backend for operator credentials, provider tokens, and per-environment configuration without storing secret values in the repo, in `.env` files, or in `nix` configuration.

The platform is single-user in v1 and the operator already uses `1Password`.

## Decision

Use `1Password` as the v1 backend for `fnox`.

Secret access follows this model:

- `1Password` is the source of truth for secret values.
- `fnox` is the frontend used by repo tasks to retrieve secrets.
- `mise` is the only supported public path for secret-aware task execution.
- `nix` may reference secret names or non-secret config, but must never contain secret values.

The bootstrap model is operator-mediated:

- the operator unlocks `1Password` through the desktop app and CLI integration
- `fnox` retrieves secrets on demand during task execution
- v1 does not rely on a long-lived service-account token or exported session token stored in the VM

## Rationale

- best fit for a single-user local operator workflow
- lowest day-to-day overhead compared with a self-hosted secret manager
- good desktop and mobile ergonomics for the operator
- keeps the backend choice abstract behind `fnox` if the platform later outgrows this model

## Guardrails

- do not store secret values in `nix`, `.env` files, shell profiles, or committed manifests
- do not commit secret material to the repo
- do not persist `1Password` session tokens in repo-managed bootstrap artifacts
- do not let application code fetch secrets directly from `1Password` in v1; secret retrieval stays behind operator-invoked `mise` workflows

## Consequences

### Positive

- simpler secret UX for the single operator
- clear source of truth for secret values
- lower infrastructure burden in v1

### Negative

- not ideal for unattended machine-to-machine automation
- future multi-user or service-identity workflows may need a different backend

## Follow-Up

- revisit the backend choice if future remote access or automation requires machine identities
- define runtime materialization separately in [ADR-0003](0003-runtime-secret-materialization.md)
