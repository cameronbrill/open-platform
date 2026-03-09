---
title: "Session Runtime"
doc_id: "PLAN-004"
doc_type: "plan"
status: "draft"
date: "2026-03-08"
updated: "2026-03-09"
summary: "First end-to-end OpenCode session runtime with isolated workspaces, runtime secrets, auth, and local routing."
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
  - "docs/specs/platform/tech-spec.md"
  - "docs/plans/05-session-index-and-operator-ux.md"
---

# Session Runtime

## Purpose

Implement the first end-to-end session runtime.

## In Scope

- session image
- session manifests
- workspace model
- local routing or exposure
- runtime secret materialization
- auth for session endpoints

## Out of Scope

- session index UX
- full observability stack
- remote access

## Deliverables

- `images/opencode-session/Dockerfile`
- `images/opencode-session/entrypoint.sh`
- `cluster/sessions/opencode-session.yaml`
- `cluster/sessions/service.yaml`
- `cluster/sessions/ingress.yaml`
- `cluster/sessions/workspace-pvc.yaml`
- documented session auth and secret materialization behavior

## Tasks

### Session Image

- build the runtime image
- run `opencode web`
- support the secret and environment contract
- ensure auth is enabled
- document local image build and load behavior

### Session Secrets and Auth

- generate per-session auth material where practical
- document how runtime secrets enter the pod
- ensure secret values do not land in committed artifacts or persistent debug output

### Session Pod Security

- disable service account token mounting
- apply resource requests and limits
- confirm runtime class usage

### Workspace Model

- implement `git clone per session`
- define naming, cleanup, and isolation rules
- assess whether a local clone cache is needed
- define restart and recreate semantics relative to workspace cleanup

### Session Routing

- validate path-based routing if attempted
- switch to host-based routing if needed
- ensure browser access remains localhost-only
- ensure routing decisions remain compatible with the API contract

## Validation

- a manual session pod is reachable in browser
- the pod uses `runtimeClassName: kata`
- the session workspace is isolated
- the session can be deleted and recreated cleanly
- no unnecessary Kubernetes API credentials are present
- auth exists and is enforced

## Exit Criteria

- one working OpenCode session exists end-to-end
- routing, auth, and workspace behavior are stable enough for operator use

## Risks / Notes

- do not over-engineer routing before validating how `opencode web` behaves behind the chosen exposure model
