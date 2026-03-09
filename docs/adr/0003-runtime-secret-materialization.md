---
title: "ADR-0003: Runtime Secret Materialization"
doc_id: "ADR-0003"
doc_type: "adr"
status: "accepted"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Materialize secrets as late as possible through task-mediated workflows, keep them narrowly scoped, and clean them up when sessions or workflows end."
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
  - "docs/adr/0002-secret-bootstrap-and-local-secret-ux.md"
  - "docs/adr/0008-infisical-secret-management-and-ci-auth.md"
  - "docs/specs/platform/secret-management.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/plans/04-session-runtime.md"
supersedes: []
superseded_by: []
---

# ADR-0003: Runtime Secret Materialization

## Context

The platform needs a clear and safe way to move secrets from the operator-controlled backend into runtime components such as session pods, the index backend, and observability configuration.

## Decision

Runtime secret materialization follows these lifecycle rules.

### 1. Retrieval

- local operator workflows retrieve secret values through repo-declared `fnox` mappings backed by `Infisical`
- CI may authenticate directly to `Infisical` when that is the documented machine-oriented path
- secret retrieval remains behind documented `mise` workflows, not ad hoc shell exports as the supported interface

### 2. Injection

- secret values are materialized as late as possible
- injection should prefer short-lived environment variables, short-lived files, or narrowly scoped Kubernetes `Secret` objects only when required
- secret values must not be stored in `nix`, committed manifests, image layers, or long-lived repo-managed files

### 3. In-Session Use

- per-session secrets should be unique when practical, especially for session auth
- the session index API and UX may expose auth state or access requirements, but must not become a general-purpose secret vault
- secret values must not appear in session URLs, index API payloads, frontend bundles, logs, telemetry, crash diagnostics, or workspace storage

### 4. Restart And Rotation

- restart flows must recreate or revalidate any session-scoped secret material that should not survive the restart
- rotation and revocation behavior must be defined in the living secret-management spec
- no shared long-lived session password across all sessions is allowed as the default pattern

### 5. Delete And Reset Cleanup

- secret material must be deleted or invalidated when the owning session or workflow is destroyed
- any Kubernetes `Secret` object created for runtime use must remain narrowly scoped and must be removed during teardown when it is no longer needed
- delete and reset flows must not leave behind reusable session credentials or orphaned secret objects

## Rationale

- reduces accidental persistence of secrets
- keeps runtime handling consistent across Go, TypeScript, and cluster workflows
- limits blast radius for session-specific credentials

## Guardrails

- no plaintext secret values in logs, telemetry, URLs, crash diagnostics, or workspace files
- no secret values baked into static assets or frontend bundles
- no default service account tokens mounted into session pods
- no secret-bearing API responses where non-secret auth metadata is sufficient

## Follow-Up

- operational naming, rotation, revocation, and failure handling live in [Secret Management](../specs/platform/secret-management.md)
- auth and open-session contract detail lives in [Session Index API](../specs/platform/session-index-api.md) and [Session Index UX](../specs/platform/session-index-ux.md)
