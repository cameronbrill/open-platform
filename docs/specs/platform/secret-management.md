---
title: "Secret Management"
doc_id: "SPEC-PLATFORM-SECRETS-001"
doc_type: "spec"
status: "draft"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Current secret management model for local development, CI, runtime materialization, and secret scanning, with Infisical as backend and fnox as local declarative UX."
aliases:
  - "Platform Secret Management"
  - "Secrets Model"
tags:
  - "spec"
  - "secrets"
  - "infisical"
  - "fnox"
  - "ci"
  - "security"
source_of_truth: "implementation-requirements"
related_docs:
  - "docs/adr/0008-infisical-secret-management-and-ci-auth.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/plans/00-operator-prerequisites.md"
  - "docs/plans/01-repo-foundations.md"
  - "docs/plans/04-session-runtime.md"
  - "docs/plans/06-observability-and-hardening.md"
---

# Secret Management

## Purpose

Define the current active secret-management model for Open Platform.

## Scope

- local operator secret access
- CI secret access
- task-mediated runtime secret materialization
- pre-commit secret scanning
- secret hygiene and guardrails

## Out Of Scope

- end-user auth flows
- external secret-provider comparison
- full remote-access auth architecture beyond what directly affects secret handling

## Related Documents

- [ADR-0008: Infisical Secret Management and CI Auth](../../adr/0008-infisical-secret-management-and-ci-auth.md)
- [Open Platform Technical Specification](tech-spec.md)
- [Repo Foundations](../../plans/01-repo-foundations.md)
- [Session Runtime](../../plans/04-session-runtime.md)

## Current Model

- `Infisical` is the secret backend and source of truth.
- `fnox` is the declarative repo-level secret UX for local secret-aware workflows.
- `Infisical` secret scanning is used in pre-commit workflows.
- runtime secrets use task-mediated materialization.
- `mise` remains the public interface for secret-aware tasks.
- CI should use a machine-oriented Infisical auth flow rather than a human desktop-oriented flow.

## Backend Versus Interface

- `Infisical` owns secret storage, CI auth, and scanning capabilities.
- `fnox` owns the repo-declared mapping of secret names, profiles, and local secret-aware execution behavior.
- `mise` remains the public task surface above both.

## Infisical Project Model

### Project Layout

- define the platform project or projects used for Open Platform
- separate at least local development and CI environments
- use paths to isolate subsystems when needed

The repo should converge on a small, explicit environment model such as:

- `dev` for local operator workflows
- `ci` for Buildkite-managed automation

### Naming Conventions

- document secret naming rules
- document path naming rules
- document session/runtime secret naming expectations

## Local Operator Auth

- operators bootstrap local secret access for `fnox` using `Infisical`
- local tasks fetch secrets through repo-declared `fnox` configuration
- long-lived exported `.env` flows are not part of the default model
- local secret access should prefer `mise`-invoked execution rather than ad hoc shell exports or raw direct secret lookups

## CI Auth

- CI uses a machine-oriented Infisical auth flow
- CI retrieves secrets at job runtime
- CI bootstrap credentials must remain minimal, scoped, and rotatable
- prefer machine identity or equivalent supported CI auth over long-lived shared service credentials

## Runtime Secret Materialization

### Approved Model

- `mise` or task-mediated retrieval using repo-declared `fnox` mappings backed by `Infisical`
- late materialization
- narrow scoping
- cleanup when sessions or workflows are destroyed

### Not Approved

- committed secret files
- long-lived exported `.env` files
- baking secrets into images
- storing secret values in `nix`

## Secret Scanning

### Pre-Commit Scanning

- staged diff scanning is required in pre-commit workflows
- likely secret commits should block by default
- scan configuration should stay repo-managed and explicit

### Ignore Policy

- use repo-level ignore files sparingly
- use inline ignores only for intentional examples or documented false positives
- fix unrealistic examples before normalizing ignores
- allowlists and ignores should be reviewed as security-sensitive changes

## Secret Hygiene Rules

- docs, examples, and fixtures must avoid realistic live secret values
- logs, telemetry, and URLs must not contain secret values
- tests should use fake but secret-looking values for leak detection

## fnox Declarative Model

- repo-managed `fnox` config should declare required secret names and profiles without storing secret values
- local overrides should remain explicit and non-committed
- the repo should prefer declarative secret name mappings over undocumented one-off shell conventions

## Rotation And Revocation

- document operator credential rotation expectations
- document CI bootstrap credential rotation expectations
- document session-scoped secret invalidation expectations

## Failure Modes

- Infisical unavailable locally
- Infisical unavailable in CI
- auth failure
- scanning false positives
- runtime retrieval failure

## Acceptance Criteria

- local secret access is documented
- CI secret access is documented
- runtime materialization path is documented
- scanning policy is documented
- pre-commit secret scanning flow is documented
- declarative repo-managed local secret UX is documented
- banned storage patterns are explicit
