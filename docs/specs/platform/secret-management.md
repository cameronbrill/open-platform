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
  - "docs/adr/0003-runtime-secret-materialization.md"
  - "docs/adr/0008-infisical-secret-management-and-ci-auth.md"
  - "docs/specs/platform/repository-tooling.md"
  - "docs/specs/platform/session-index-api.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/plans/00-operator-prerequisites.md"
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
- per-session auth secret handling
- pre-commit secret scanning
- secret hygiene, rotation, revocation, and failure handling

## Out Of Scope

- end-user identity architecture beyond what directly affects secret handling
- remote gateway design beyond secret-handling requirements

## Current Model

- `Infisical` is the active secret backend and source of truth.
- `fnox` is the declarative repo-level local secret UX.
- `mise` is the public interface for secret-aware workflows.
- runtime secrets are materialized late and cleaned up aggressively.
- pre-commit secret scanning uses `Infisical`.

## Backend Versus Interface

- `Infisical` owns secret storage, CI auth, and scanning capabilities.
- `fnox` owns repo-declared secret mappings and local secret-aware execution behavior.
- `mise` remains the only supported public path above both.

## Infisical Project Model

### Environments

Use one Open Platform project with at least these environments:

- `dev` for local operator workflows
- `ci` for Buildkite-managed automation

### Paths

Use explicit paths to separate ownership and blast radius:

- `/platform/shared` for repo-wide non-provider-specific secrets
- `/platform/observability` for Better Stack and telemetry-related secrets
- `/providers/model` for model-provider credentials used by local or CI workflows
- `/ci/bootstrap` for machine-oriented CI auth material only when required by the chosen Infisical auth flow

Session-scoped auth credentials are generated at runtime and are not stored as long-lived shared values in Infisical by default.

### Naming Rules

- use upper snake case for secret names
- prefer repo-facing generic names in task and application contracts
- map provider-specific backend names to repo-facing names through `fnox` or task config when needed

Canonical repo-facing names:

- `MODEL_API_KEY`
- `BETTER_STACK_SOURCE_TOKEN`
- `BETTER_STACK_INGESTING_HOST`
- `INFISICAL_MACHINE_IDENTITY` only if the chosen CI auth flow requires a bootstrap value

Do not use one shared long-lived `OPENCODE_SERVER_PASSWORD` secret for all sessions.

## Local Operator Auth

- operators authenticate to `Infisical` outside committed repo state
- local secret-aware tasks retrieve values through repo-declared `fnox` configuration
- long-lived exported `.env` workflows are not part of the default model
- local secret access should use `mise` rather than ad hoc shell exports or raw secret lookups as the normal supported path

## CI Auth

### Required Trust Chain

- Buildkite job
- documented machine-oriented auth flow into `Infisical`
- job-time retrieval of the minimum required secrets

### Rules

- prefer Infisical machine identity or an equivalent short-lived supported CI auth flow
- do not use broad shared long-lived service credentials when a scoped machine-oriented flow is available
- CI bootstrap credentials must be minimal, scoped, rotatable, and auditable
- jobs that do not need privileged secrets must not receive them

## Runtime Secret Materialization

### Approved Sinks

- short-lived environment variables
- short-lived files with explicit cleanup
- narrowly scoped Kubernetes `Secret` objects only when required
- backend-managed HTTP-only cookie bootstrap or equivalent non-URL transport for browser session access when raw credential exposure to the frontend is unnecessary

### Not Approved

- committed secret files
- long-lived exported `.env` files
- baking secrets into images
- storing secret values in `nix`
- returning raw session credentials in index API JSON when non-secret access metadata or cookie bootstrap is sufficient
- embedding secret material in URLs, logs, telemetry, workspaces, or frontend bundles

### Session Auth Rules

- session-scoped auth credentials should be unique per session
- the frontend may know that auth is required, but it must not become the storage system for reusable session credentials
- delete, restart, and reset flows must recreate or invalidate session-scoped auth according to the documented lifecycle

## Secret Scanning

### Pre-Commit Scanning

- staged diff scanning is required in pre-commit workflows
- likely secret commits should block by default
- scan configuration should stay repo-managed and explicit

### Ignore Policy

- use repo-level ignore files sparingly
- use inline ignores only for intentional examples or documented false positives
- review allowlist and ignore changes as security-sensitive changes

## Hygiene Rules

- docs, examples, and fixtures must avoid realistic live secret values
- tests should use fake but secret-looking values for leak detection
- logs, telemetry, URLs, error payloads, and crash output must not contain secret values
- session workspaces and persistent storage must not be treated as approved secret stores

## Rotation And Revocation

- operator-owned long-lived credentials in `dev` must have an explicit rotation owner and documented rotation path
- CI bootstrap credentials in `ci` must have an explicit rotation owner and documented revocation path
- session-scoped auth credentials must be invalidated on delete and recreated on restart when they should not survive the restart
- emergency revocation steps must exist for leaked Better Stack, model-provider, and CI auth credentials

## Failure Modes And Required Behavior

### Infisical unavailable locally

- fail the supported task early
- return actionable error text without leaking secret values
- do not fall back to undocumented local secret caches

### Infisical unavailable in CI

- fail the job before partial privileged execution continues
- do not silently reuse stale credentials from prior runs

### Runtime retrieval failure

- keep the affected session in a normalized failed or degraded state
- do not surface a speculative open URL
- record only sanitized failure detail

### Secret scanning false positive

- use the documented repo-managed ignore path
- do not normalize broad ignore patterns for convenience

## Verification Requirements

- local secret access path is documented and testable
- CI trust chain and scoping rules are documented
- runtime materialization and cleanup rules are documented
- no banned persistence patterns remain ambiguous
- fake secret fixtures exist for leak-detection tests
- redaction and non-leakage checks exist for logs, URLs, telemetry, and API behavior
