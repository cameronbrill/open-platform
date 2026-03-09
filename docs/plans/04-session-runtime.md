---
title: "Session Runtime"
doc_id: "PLAN-004"
doc_type: "plan"
status: "draft"
date: "2026-03-08"
updated: "2026-03-09"
summary: "First end-to-end OpenCode session runtime with isolated workspaces, runtime secrets, per-session auth, and host-based localhost routing."
aliases:
  - "Plan 04"
  - "Session Runtime Plan"
tags:
  - "plan"
  - "session-runtime"
  - "opencode"
  - "auth"
  - "routing"
source_of_truth: "execution-plan"
scope: "one OpenCode web session per pod with isolated workspace, runtime secrets, and local routing"
depends_on:
  - "docs/plans/03-cluster-network-and-kata.md"
blocks:
  - "docs/plans/05-session-index-and-operator-ux.md"
  - "docs/plans/06-observability-and-hardening.md"
related_docs:
  - "docs/adr/0003-runtime-secret-materialization.md"
  - "docs/adr/0005-session-exposure-and-routing.md"
  - "docs/adr/0008-infisical-secret-management-and-ci-auth.md"
  - "docs/specs/platform/secret-management.md"
  - "docs/specs/platform/session-index-api.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/tech-spec.md"
---

# Session Runtime

## Purpose

Implement the first end-to-end session runtime.

## In Scope

- session image
- session manifests
- workspace model
- host-based localhost routing
- runtime secret materialization
- per-session auth bootstrap behavior
- runtime recovery and cleanup behavior

## Deliverables

- `images/opencode-session/Dockerfile`
- `images/opencode-session/entrypoint.sh`
- `cluster/sessions/opencode-session.yaml`
- `cluster/sessions/service.yaml`
- `cluster/sessions/ingress.yaml`
- `cluster/sessions/workspace-pvc.yaml`
- documented session auth, open-session, cleanup, and recovery behavior

## Tasks

### Session Image

- build the runtime image
- run `opencode web`
- support the documented secret and environment contract
- ensure auth is enabled
- document local image build and load behavior

### Session Secrets And Auth

- generate per-session auth material where practical
- use the documented task-mediated secret retrieval path
- ensure secret values do not land in committed artifacts, URLs, logs, telemetry, or persistent debug output
- implement backend-managed browser access bootstrap without returning raw reusable credentials in JSON

### Session Pod Security

- disable service account token mounting
- apply resource requests and limits
- confirm runtime class usage

### Workspace Model

- implement `git clone per session`
- define naming, cleanup, and isolation rules
- define delete, restart, and recreate semantics relative to workspace cleanup

### Session Routing

- implement host-based routing on `*.localhost`
- ensure browser access remains localhost-only through the supported forwarding path
- ensure the backend owns canonical `openUrl` resolution

### Runtime Behavior Tests

- define behavior-focused checks for session creation, auth enforcement, readiness, restart, delete, and workspace isolation
- separate fast runtime checks from slower integration and platform verification
- assert eventual operator-visible outcomes rather than exact orchestration internals

## Validation

- a manual session pod is reachable in a browser through the supported host-based localhost path
- the pod uses `runtimeClassName: kata`
- the session workspace is isolated
- the session can be deleted and recreated cleanly
- per-session auth exists and is enforced without raw credential leakage through the documented API path
- no unnecessary Kubernetes API credentials are present

## Exit Criteria

- one working OpenCode session exists end to end
- routing, auth, workspace, and cleanup behavior are stable enough for operator use
- recovery and cleanup behavior is documented for Plan 05 and Plan 06 to consume
