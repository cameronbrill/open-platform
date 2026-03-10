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

[ADR-0008](../../adr/0008-infisical-secret-management-and-ci-auth.md) is the active secret-management ADR. [ADR-0002](../../adr/0002-secret-bootstrap-and-local-secret-ux.md) remains historical context for the local declarative UX only.

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

## Initial Secret Inventory

### Required Now

- `OPENCODE_SERVER_PASSWORD`
- `MODEL_PROVIDER`
- `MODEL_API_KEY`
- `BETTER_STACK_SOURCE_TOKEN`
- `BETTER_STACK_INGESTING_HOST`

If `OPENCODE_SERVER_PASSWORD` remains required by the current OpenCode runtime, treat it as runtime bootstrap input only. It must not be surfaced directly through the session index API or URLs, and any later per-session derivation or replacement must still follow the lifecycle matrix below.

### Required When CI Is Enabled

- `INFISICAL_CI_CLIENT_ID`
- `INFISICAL_CI_CLIENT_SECRET`
- `BUILDKITE_AGENT_TOKEN` or the chosen Buildkite bootstrap credential

### Optional Or Provider-Specific

- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`

Use either the generic provider model or provider-specific naming, but do not mix both patterns casually.

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

## Secret Lifecycle Matrix

| Phase | Source of truth | Materialization rules | Cleanup / invalidation |
| --- | --- | --- | --- |
| local bootstrap | `Infisical` via operator-authenticated `fnox` flows | retrieve only through documented `mise` or repo-declared `fnox` execution | no committed `.env`, no shell-profile persistence as the default path |
| CI execution | `Infisical` via machine-oriented CI auth | only documented trusted jobs may retrieve the secrets they need at runtime | job-scoped credentials stay minimal and rotatable; untrusted jobs receive no privileged secret access |
| session create | `Infisical`-backed task mediation | materialize only the secret and auth state required for that session | secret-bearing setup output must not persist in committed artifacts, URLs, or debug logs |
| session restart | same source of truth as create | recreate or revalidate any session-scoped auth needed after restart | invalidate superseded session-scoped auth material |
| session delete | same source of truth as create | no new secret material should be created during teardown except as required for safe cleanup | remove session-scoped auth material and any teardown-owned runtime secret state |
| cluster reset / incident response | same source of truth as create and CI | treat reset as destructive recovery, not a normal lifecycle shortcut | remove local runtime secret state and rotate or revoke impacted credentials when the incident requires it |

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

For v1, the minimum expectation is that delete and reset invalidate session-scoped auth material, and restart does not rely on stale reusable credentials.

## Failure Modes

- Infisical unavailable locally
- Infisical unavailable in CI
- auth failure
- scanning false positives
- runtime retrieval failure

## CI Trust Boundary

- Buildkite jobs that run on untrusted changes must not receive Infisical-backed runtime secrets or other privileged credentials
- only documented trusted jobs may authenticate to `Infisical`
- CI logs and artifacts must not contain secret values or become an alternate secret transport path

## Acceptance Criteria

- local secret access is documented
- CI secret access is documented
- runtime materialization path is documented
- scanning policy is documented
- pre-commit secret scanning flow is documented
- declarative repo-managed local secret UX is documented
- banned storage patterns are explicit
