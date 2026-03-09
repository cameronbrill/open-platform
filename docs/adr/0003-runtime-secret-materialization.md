---
title: "ADR-0003: Runtime Secret Materialization"
doc_id: "ADR-0003"
doc_type: "adr"
status: "accepted"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Define how secrets are fetched through fnox and materialized at runtime as late as possible."
aliases:
  - "Runtime Secret Materialization"
tags:
  - "adr"
  - "secrets"
  - "runtime"
  - "fnox"
  - "kubernetes"
source_of_truth: "durable-decision"
related_docs:
  - "docs/adr/0002-secret-bootstrap-and-1password-integration.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/plans/04-session-runtime.md"
supersedes: []
superseded_by: []
---

# ADR-0003: Runtime Secret Materialization

## Context

The platform needs a clear and safe way to move secrets from the operator-controlled secret backend into runtime components such as session pods, the index backend, and observability configuration.

## Decision

Runtime secret materialization follows these rules:

- secret values are fetched through `fnox` during task execution
- secrets are materialized as late as possible
- secret values must not be stored in `nix`, committed manifests, image layers, or long-lived repo-managed files
- per-session secrets should be unique when possible, especially for session auth
- persistent Kubernetes `Secret` objects are allowed only when necessary and should be scoped as narrowly as possible
- secret material should be deleted or invalidated when the owning session or workflow is destroyed

Preferred v1 behavior:

- operator runs a `mise` task
- task retrieves values through `fnox`
- task injects values into runtime via short-lived environment variables, ephemeral files, or narrowly scoped Kubernetes `Secret` objects when unavoidable

## Rationale

- reduces accidental persistence of secrets
- keeps runtime handling consistent across Go, TypeScript, and cluster workflows
- limits blast radius for session-specific credentials

## Guardrails

- no plaintext secret values in logs, telemetry, URLs, or crash diagnostics
- no secret values baked into static assets or frontend bundles
- no shared long-lived session password across all sessions by default
- no default service account tokens mounted into session pods

## Consequences

### Positive

- predictable secret lifecycle
- stronger separation between secret storage and runtime execution

### Negative

- task orchestration becomes more important because secret flow is not fully transparent to raw commands
- some Kubernetes workflows are slightly more complex because secret scope and cleanup must be explicit

## Follow-Up

- align final session auth behavior with session-routing and browser auth decisions
- define retention and secure deletion rules in the tech spec
