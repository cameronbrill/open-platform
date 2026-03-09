---
title: "Open Platform Technical Specification"
doc_id: "SPEC-PLATFORM-001"
doc_type: "spec"
status: "draft"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Current intended design and implementation requirements for the local single-user OpenCode platform."
aliases:
  - "Platform Tech Spec"
tags:
  - "spec"
  - "platform"
  - "opencode"
  - "kubernetes"
  - "kata"
source_of_truth: "implementation-requirements"
related_docs:
  - "docs/adr/0001-platform-architecture.md"
  - "docs/adr/0002-secret-bootstrap-and-1password-integration.md"
  - "docs/adr/0003-runtime-secret-materialization.md"
  - "docs/adr/0004-local-substrate-selection.md"
  - "docs/adr/0005-session-exposure-and-routing.md"
  - "docs/adr/0006-session-index-stack-and-api-boundary.md"
  - "docs/specs/platform/session-index-api.md"
  - "docs/specs/platform/session-index-ux.md"
  - "docs/plans/initial-implementation-plan.md"
---

# Open Platform Technical Specification

## Overview

This document specifies the initial implementation of a local autonomous coding platform built around isolated OpenCode web sessions.

The platform targets a single powerful Windows desktop, with Linux infrastructure running in a declarative `NixOS` virtual machine. OpenCode sessions run inside a local Kubernetes cluster using `Kata Containers` for isolation. Each session exposes its own `opencode web` endpoint. A lightweight session index provides session discovery and lifecycle controls. Observability is exported to `Better Stack` using OpenTelemetry.

The platform is explicitly single-user in v1. All browser-facing surfaces are localhost-only by default. Future remote access, including access from a phone, must be supported later through a dedicated authenticated gateway layer without requiring a redesign of the internal session model.

The session index follows a strict v1 boundary:

- backend prefers `Go`
- frontend prefers `TypeScript`
- API contract is defined before UI implementation
- v1 avoids SSR
- v1 avoids `React Router`

## Related Documents

- [ADR-0001: Local Autonomous Coding Platform Architecture](../../adr/0001-platform-architecture.md)
- [ADR-0002: Secret Bootstrap and 1Password Integration](../../adr/0002-secret-bootstrap-and-1password-integration.md)
- [ADR-0003: Runtime Secret Materialization](../../adr/0003-runtime-secret-materialization.md)
- [ADR-0004: Local Substrate Selection](../../adr/0004-local-substrate-selection.md)
- [ADR-0005: Session Exposure and Routing](../../adr/0005-session-exposure-and-routing.md)
- [ADR-0006: Session Index Stack and API Boundary](../../adr/0006-session-index-stack-and-api-boundary.md)
- [Session Index API](session-index-api.md)
- [Session Index UX](session-index-ux.md)

## Source Of Truth

- Use ADRs for durable decisions and rationale.
- Use this spec and the linked sub-specs for current intended implementation requirements.
- Use plans for sequencing, milestones, and exit criteria.

## Goals

- provide isolated autonomous OpenCode sessions
- keep the daily workflow simple after setup
- keep platform configuration declarative and repo-managed
- support browser-based access to sessions, localhost-only by default in v1
- make cluster state and session health observable
- centralize tasks and environment handling through `mise`
- centralize secrets through `fnox` backed by `1Password`
- standardize local validation and guardrails with `hk`
- prefer strict typing everywhere practical
- document the frontend/backend API contract before UI implementation
- keep the operator UI responsive and mobile-tolerant even before remote access exists

## Non-Goals

- building a custom chat UI in v1
- supporting a multi-node production cluster
- supporting multiple human users in v1
- achieving full self-hosting for observability in v1
- public Internet exposure in v1
- SSR in v1
- `React Router` in v1

## Single-User Operating Model

v1 is designed for exactly one trusted operator.

Implications:

- there is no multi-user tenancy model in v1
- there is no delegated admin model in v1
- all primary workflows assume one local operator controlling the VM, cluster, and browser access
- localhost-only access is the default exposure mode
- future remote access must be layered on top of this model through a dedicated authenticated access boundary

## Repository Structure

```text
open-platform/
  README.md
  AGENTS.md
  mise.toml
  opencode.json
  flake.nix
  flake.lock

  .agents/
    agents/
      docs-reader.md
    skills/
      docs-grounding/
        SKILL.md

  .opencode/
    agents -> ../.agents/agents

  docs/
    README.md
    adr/
      README.md
      0001-platform-architecture.md
      0002-secret-bootstrap-and-1password-integration.md
      0003-runtime-secret-materialization.md
      0004-local-substrate-selection.md
      0005-session-exposure-and-routing.md
      0006-session-index-stack-and-api-boundary.md
    specs/
      README.md
      platform/
        README.md
        tech-spec.md
        session-index-api.md
        session-index-ux.md
    plans/
      README.md

  .config/
    hk/

  nixos/
    hosts/
      op-platform-vm.nix
    modules/
      base.nix
      ssh.nix
      minikube.nix
      kata.nix
      k9s.nix
      opencode-tools.nix
      reverse-proxy.nix

  cluster/
    base/
      namespaces.yaml
      quotas.yaml
      limitranges.yaml
      networkpolicy-default-deny.yaml
      ingress.yaml
    kata/
      runtimeclass.yaml
      install.yaml
    sessions/
      opencode-session.yaml
      service.yaml
      ingress.yaml
      workspace-pvc.yaml
    observability/
      otel-collector.yaml

  apps/
    session-index/
      README.md
      src/

  images/
    opencode-session/
      Dockerfile
      entrypoint.sh

  telemetry/
    betterstack/
      setup.md
      dashboards.md
      alerts.md

  scripts/
    bootstrap-vm
    cluster-up
    cluster-doctor
    session-create
    session-delete
    session-list
    session-open
    session-logs
    cluster-reset
```

## System Context

### Host Layer

- `Windows 11`
  - gaming host
  - browser
  - `Zed`
  - hypervisor

### Linux Control Plane

- `NixOS VM`
  - `mise`
  - `fnox`
  - `hk`
  - `kubectl`
  - `helm`
  - `k9s`
  - `minikube`
  - reverse proxy or ingress support
  - session index service

### Cluster Layer

- `minikube`
  - session pods
  - `OpenTelemetry Collector`
  - ingress and service resources
  - resource quotas and policies

### Session Layer

- one pod per session
- `runtimeClassName: kata`
- `opencode web`
- isolated workspace
- secrets injected at runtime

### Observability Layer

- OTEL collection inside the cluster
- export to `Better Stack`
- dashboards and alerts managed outside the cluster, documented in-repo

## Threat Model

### In Scope

The platform must account for:

- malicious or unsafe model behavior inside a session
- untrusted repositories, dependencies, and generated code
- accidental over-privilege in Kubernetes service accounts
- accidental exposure of session endpoints beyond localhost
- accidental exfiltration of secrets or sensitive content through logs, traces, or metrics
- compromised session pods attempting network egress or lateral movement

### Out of Scope in v1

The platform does not attempt to solve:

- multi-user isolation between different humans
- public Internet exposure
- strong containment after full compromise of the Windows host
- enterprise identity and access management

### Security Position

`Kata Containers` is treated as one isolation layer, not a complete system-wide guarantee. The design also depends on least-privilege RBAC, strict network policy, secret scoping, runtime hardening, and telemetry redaction.

## Configuration and Tooling Model

### `nix`

Owns:

- system configuration
- machine-level packages
- long-lived services
- reproducible VM definitions

`nix` must not contain secret values.

### `mise`

`mise` is the primary human entrypoint for tool management, tasks, builds, validation, and docs discovery automation.

Responsibilities:

- install and pin required CLI tools, including docs discovery and file-watching tools
- define repeatable local tasks
- provide a standard shell or task environment
- integrate with `fnox` for secrets-aware task execution
- expose the public command surface for operators and contributors
- automate repo-local docs indexing and refresh workflows

Expected task groups:

- `vm:*`
- `cluster:*`
- `session:*`
- `obs:*`
- `dev:*`
- `docs:*`
- top-level quality gates such as `fmt`, `lint`, `typecheck`, `build`, `validate`, and `check`

### `OpenCode`

Project agent behavior is committed to the repo.

Requirements:

- keep `AGENTS.md` minimal and delegate detailed docs-routing rules to [docs/README.md](../../README.md)
- commit `opencode.json` to the repo for project-level OpenCode config
- store custom agents in `.agents/agents/`
- store reusable skills in `.agents/skills/`
- use `.opencode/agents` only as a compatibility symlink to `.agents/agents`
- prefer skills over project commands for reusable repo guidance

### `fnox`

`fnox` is the secret retrieval frontend.

In v1 it is backed by `1Password` and should follow an operator-mediated workflow.

Requirements:

- secrets are not committed to the repo
- secret values are not stored in `nix`
- secrets are retrieved during task execution rather than embedded in static artifacts
- banned patterns include long-lived exported secret files, committed manifests with secret values, and repo-managed `.env` files

### `hk`

`hk` manages git hooks from the repo.

Hooks should route through `mise` tasks rather than invoking raw tools directly.

### Scripts

Files under `scripts/` are implementation details and should be invoked through `mise` rather than treated as the primary public interface.

## Secrets Backend and Materialization

### Backend

- `1Password` is the v1 secret backend
- `fnox` is the repo-facing retrieval layer

### Materialization Rules

- secret values are materialized as late as possible
- runtime injection should prefer short-lived values over long-lived persistent storage
- narrowly scoped Kubernetes `Secret` objects are allowed when necessary but are not the default for every workflow
- per-session auth secrets should be unique when practical
- secret values must not appear in logs, telemetry, URLs, or debug output

## Strict Typing Policy

- prefer `TypeScript` over JavaScript
- prefer `Go` over dynamic backend languages
- avoid untyped payloads across the frontend/backend boundary
- API contracts and session resource shapes should be documented before they are implemented

## Validation and Quality Gates

### Formatting

- `dprint` is the public formatting entrypoint
- `dprint` orchestrates formatting across supported file types
- `oxfmt` is the formatter for TypeScript and JavaScript under the `dprint` entrypoint
- `go fmt` is the formatter for Go under the `dprint` entrypoint

### Linting

- `oxlint` is used for TypeScript linting
- `golangci-lint` is used for Go linting

### Typechecking

- `tsc --noEmit` is used for TypeScript typechecking

### Public Command Surface

Documented public quality-gate tasks should include:

- `mise run fmt`
- `mise run fmt:check`
- `mise run lint`
- `mise run lint:ts`
- `mise run lint:go`
- `mise run typecheck`
- `mise run typecheck:ts`
- `mise run build`
- `mise run build:ts`
- `mise run build:go`
- `mise run validate`
- `mise run check`

Detailed testing and TDD policy is intentionally deferred to a follow-up pass.

## Build Command Surface

- frontend builds must be available through `mise run build:ts`
- backend builds must be available through `mise run build:go`
- aggregate builds must be available through `mise run build`

## Local Inner Loop

The platform should support two inner loops:

- a fast local loop for documentation, frontend, and task-surface work
- a full platform loop for VM, cluster, networking, Kata, and session validation

The fast loop should avoid requiring a full cluster bring-up when not necessary.

## Fixture Strategy

The repo should define canonical fixtures for:

- sample session repos
- network policy smoke validation
- Kata validation
- telemetry redaction validation
- safe fake secrets and auth placeholders for local validation

## VM Specification

### Hypervisor Assumptions

- Windows host supports hardware virtualization
- nested virtualization must be available to the guest sufficiently for the chosen `Kata` setup
- the VM is provisioned with enough CPU and RAM for `minikube`, session pods, and observability agents

Initial sizing target:

- `8-12 vCPU`
- `16-24 GB RAM`
- fast storage on an NVMe-backed virtual disk

### Reproducibility Boundary

The repo should make explicit which parts are reproduced by repo-managed configuration and which remain manual operator setup.

Repo-managed scope should include:

- guest OS configuration
- guest packages and tools
- cluster manifests and platform config

Manual scope should be limited to:

- BIOS or UEFI virtualization settings
- hypervisor installation and configuration
- secret backend login and operator credentials

### NixOS Responsibilities

The NixOS host should declaratively define:

- system packages
- SSH access
- `mise` availability
- `kubectl`, `helm`, `k9s`, and `git`
- Go and TypeScript build prerequisites where appropriate
- container and virtualization prerequisites
- `minikube` prerequisites
- reverse proxy support if used outside Kubernetes ingress

## Kubernetes Design

### Cluster Topology

- single-node `minikube` cluster
- cluster runs entirely inside the `NixOS VM`
- no HA assumptions in v1

### Namespaces

Suggested v1 namespaces:

- `platform-system`
- `platform-sessions`
- `platform-observability`

### CNI and NetworkPolicy Enforcement

The selected local networking stack must support real `NetworkPolicy` enforcement.

The final substrate choice should document:

- CNI or equivalent networking path
- how deny-by-default is enforced
- how enforcement is smoke-tested

### Ingress Model

The final substrate choice should document:

- ingress/controller behavior
- localhost-only exposure model in v1
- compatibility with future authenticated remote access

### Storage Model

The final platform should document:

- workspace storage type
- PVC lifecycle and reclaim behavior
- cleanup semantics on delete and reset

## Access Model

### v1 Access Rules

- the session index page is localhost-only by default
- each per-session `opencode web` endpoint is localhost-only by default
- `K9s` is available only to the local operator inside the VM
- no shared-user or multi-user access path exists in v1

### Future Access Rules

- remote access from a phone or laptop is a supported future requirement
- remote access must be introduced through a single authenticated gateway layer
- internal services and routing should not assume permanent localhost-only addressing
- direct unauthenticated exposure of session endpoints is not allowed

## RBAC Model

### Principles

- least privilege by default
- namespace-scoped permissions wherever possible
- no cluster-admin for application components
- no Kubernetes API access for session pods unless explicitly required

### Requirements

- session pods must set `automountServiceAccountToken: false` by default
- session workloads should use dedicated service accounts only if strictly necessary
- the session index backend may only create, list, update, and delete session-scoped resources in the designated session namespace
- session creation must be constrained to approved backend-owned resource shapes
- shared platform services must not rely on the default service account

## Session Pod Specification

Each session pod should include:

- `opencode web`
- workspace mount
- OTEL environment configuration
- auth environment configuration
- explicit CPU and memory requests and limits
- `runtimeClassName: kata`
- `automountServiceAccountToken: false`

### Runtime Hardening Baseline

Session workloads should additionally follow a hardened runtime profile, including:

- non-root execution where practical
- no unnecessary capabilities
- no unnecessary host integration
- controlled writable paths
- minimal volume and service-account scope

## Session Exposure Model

Each session has its own `opencode web` endpoint.

Routing options may include path-based or host-based routing, but the final choice must be validated against actual `opencode web` behavior and future gateway compatibility.

The index backend, not the frontend, should own URL resolution for operator-visible open URLs.

## Session Index Application Architecture

### Backend Responsibilities

- Kubernetes interaction
- validation of session create and delete inputs
- session orchestration
- URL resolution
- normalized session status mapping

### Frontend Responsibilities

- rendering the operator console
- local interaction state
- typed API consumption
- responsive layout and operator-friendly presentation

### Boundary Rules

- the session index remains an orchestration surface, not a second session client
- orchestration logic stays on the backend
- the API contract must exist before UI implementation couples to backend internals

## Session Resource Shape

Canonical operator-facing fields are defined in [Session Index API](session-index-api.md) and should include at least:

- `id`
- `name`
- `repo`
- `branch`
- `status`
- `createdAt`
- `lastTransitionAt`
- `url`
- `authRequired`
- `restartCount`
- `failureReason`

## API Contract

The detailed API contract lives in [Session Index API](session-index-api.md).

The initial contract should support:

- session listing
- session creation
- session restart
- session deletion
- session open URL resolution

## Session Status Semantics

The operator-visible state model should be stable and typed.

Expected statuses include:

- `creating`
- `pending_clone`
- `starting`
- `ready`
- `degraded`
- `restarting`
- `deleting`
- `failed`

These statuses should be mapped by backend logic rather than directly exposing raw Kubernetes conditions to the UI.

## Session Index Page

The detailed UX contract lives in [Session Index UX](session-index-ux.md).

At a minimum, the session index must define:

- core user flows
- empty/loading/error states
- session list/card information model
- destructive action confirmations
- responsive behavior
- auth and open-session UX
- maintainability constraints

## Session Lifecycle

### Create

1. operator requests a session from the index page or a `mise` task
2. backend validates the request and creates session resources
3. repo is cloned into the session workspace
4. pod starts under `runtimeClassName: kata`
5. `opencode web` binds on the expected port
6. service or ingress becomes reachable
7. session appears as ready in the index page

### Delete

1. session is selected for deletion
2. pod, service, ingress, and related resources are removed
3. workspace storage is cleaned up according to policy
4. lifecycle event is emitted to telemetry

### Restart

1. session resources are recycled or recreated
2. index page reflects transient state
3. telemetry records restart cause and outcome

## Observability Design

### Telemetry Pipeline

1. apps and session wrappers emit OTEL telemetry
2. in-cluster `OpenTelemetry Collector` receives signals
3. collector exports logs, metrics, and traces to `Better Stack`

## Telemetry Data Policy

### Default Policy

Telemetry should prioritize operational visibility without exporting raw session content.

### Allowed by Default

- session lifecycle events
- startup and teardown status
- latency and error metrics
- sanitized failure reasons
- resource usage metrics
- operator-meaningful action outcomes for the session index

### Not Exported by Default

- secret values
- provider tokens
- full prompt contents
- full code buffers
- full terminal transcripts
- raw environment variable values

### Requirements

- redact sensitive values before export
- treat Better Stack as an external boundary
- verify through smoke tests that common secret patterns are not exported

## Data Retention and Deletion Policy

The platform should document retention for:

- session workspaces
- session logs
- OTEL buffers
- Better Stack retention settings
- cleanup behavior for session delete and cluster reset

## Supply Chain and Artifact Trust Policy

The platform should pin and review critical artifacts where practical, including:

- Nix inputs
- container base images
- cluster add-ons and controllers
- Go and TypeScript toolchains used by repo workflows

## Session Index Stack Decision

The preferred v1 direction is:

- Go backend
- thin TypeScript frontend
- explicit typed API contract first
- no SSR in v1
- no `React Router` in v1
- static frontend assets are acceptable in v1

Evaluation criteria include:

- thin-UI fit for an operator console
- explicit frontend/backend boundary
- strict typing support
- responsive/mobile readiness
- auth and future gateway compatibility
- operational simplicity inside the VM and cluster environment
- maintainability for a single operator-maintainer

Richer frontend architecture can be reconsidered later if the operator UI outgrows this boundary.

## Golden Path

The expected happy path for the single operator is:

1. start the `NixOS VM`
2. run `mise run cluster:up`
3. run `mise run session:create -- <name>`
4. open the local session index page
5. open the target session's `opencode web` endpoint
6. use `K9s` only when debugging cluster behavior
7. use Better Stack only when debugging telemetry, failures, or performance

The daily workflow should not require direct interaction with low-level Kubernetes resources during normal use.

## Recovery Path

The expected recovery path is:

1. run `mise run cluster:doctor`
2. inspect known cluster and session failure signals
3. run `mise run session:list`
4. run `mise run session:logs -- <name>` if needed
5. delete and recreate the affected session if only the session is unhealthy
6. run `mise run cluster:reset` if the substrate itself is unhealthy

Recovery flows must be documented and must not require ad hoc manual debugging as the default operator experience.

## Plan References

Execution details live in:

- [Operator Prerequisites](../../plans/00-operator-prerequisites.md)
- [Repo Foundations](../../plans/01-repo-foundations.md)
- [VM Bootstrap](../../plans/02-vm-bootstrap.md)
- [Cluster Network and Kata](../../plans/03-cluster-network-and-kata.md)
- [Session Runtime](../../plans/04-session-runtime.md)
- [Session Index and Operator UX](../../plans/05-session-index-and-operator-ux.md)
- [Observability and Hardening](../../plans/06-observability-and-hardening.md)

## Risks and Open Questions

- nested virtualization requirements for the chosen Kata path may need tuning
- the exact substrate matrix still needs to be finalized in follow-on ADRs
- final routing choice depends on `opencode web` validation
- detailed testing and TDD policy is intentionally deferred to a later pass

## Acceptance Criteria

- repo contains declarative host and cluster definitions
- `mise` is the primary documented entrypoint for operator workflows
- secrets flow through `fnox` backed by `1Password`
- secret values are not stored in `nix`, committed manifests, or repo-managed `.env` files
- `hk` hooks run locally
- the public formatting, linting, typechecking, build, and validation surface is documented
- a Kata-backed OpenCode session is reachable in browser
- session pods run with `runtimeClassName: kata`
- session pods do not receive unnecessary Kubernetes API credentials by default
- all browser-facing surfaces are localhost-only by default in v1
- `NetworkPolicy` deny-by-default behavior is verified by smoke tests
- telemetry reaches `Better Stack`
- smoke tests confirm that secrets and raw session content are not exported by default
- `mise run cluster:doctor` can identify common substrate or session failures
- `mise run cluster:reset` can restore a clean local platform state
- the frontend/backend API contract is documented before UI implementation
- the session resource shape and status model are documented before UI implementation
- the architecture leaves room for a future authenticated remote-access layer without redesigning internal session identity or routing
