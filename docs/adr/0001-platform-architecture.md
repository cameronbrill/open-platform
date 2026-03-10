---
title: "ADR-0001: Local Autonomous Coding Platform Architecture"
doc_id: "ADR-0001"
doc_type: "adr"
status: "proposed"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Adopt the Windows host plus NixOS VM, minikube, Kata, per-session opencode web endpoints, and Better Stack architecture for the single-user localhost-only v1 platform."
aliases:
  - "Platform Architecture"
  - "Local Autonomous Coding Platform Architecture"
tags:
  - "adr"
  - "architecture"
  - "platform"
  - "security"
  - "opencode"
source_of_truth: "durable-decision"
related_docs:
  - "docs/specs/platform/tech-spec.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/plans/initial-implementation-plan.md"
  - "docs/adr/0007-testing-strategy-and-inner-feedback-loops.md"
supersedes: []
superseded_by: []
---

# ADR-0001: Local Autonomous Coding Platform Architecture

## Status Note

This ADR is still `proposed`. Treat it as the umbrella v1 direction, not as fully ratified architecture. The unresolved substrate and routing details in [ADR-0004](0004-local-substrate-selection.md) and [ADR-0005](0005-session-exposure-and-routing.md) remain gating decisions for downstream implementation detail.

## Context

The platform should support safe autonomous OpenCode sessions while preserving a low-cognitive-load daily workflow.

Constraints and preferences:

- Windows remains the primary desktop OS for gaming.
- Linux infrastructure should be available concurrently from Windows.
- The environment should be declarative and repo-managed.
- OpenCode sessions should be sandboxed.
- Browser-based access is preferred.
- Observability should be easy to operate.
- Environment management should use `mise`.
- Git hooks should use `hk`.
- Secrets should use `fnox` backed by `Infisical`.
- Non-secret configuration should live in `mise` and `nix`; secret values must not.
- Frontend code should prefer `TypeScript` over JavaScript.
- Backend code should prefer `Go` unless a later ADR justifies another language.

Additional operating assumptions:

- v1 is a single-user system operated only by the repository owner.
- all interactive access in v1 is localhost-only by default.
- eventual remote access is a planned requirement, but it must be added through a dedicated authenticated access layer rather than by directly exposing internal services.

## Decision

Adopt the following architecture:

- `Windows 11` host for desktop UX, browser, Zed, and gaming.
- `NixOS VM` as the declarative Linux control plane.
- `minikube` inside the VM as the local cluster.
- `Kata Containers` for isolated OpenCode session pods.
- one `opencode web` endpoint per session.
- a lightweight session index page linking to all session endpoints.
- `K9s` for Kubernetes TUI operations.
- `Better Stack` for observability.
- `mise` for task and environment management.
- `hk` for pre-commit hooks.
- `fnox` for declarative local secret UX, backed by `Infisical`.
- behavior-focused TDD for repo-owned code and contracts.
- `mise` as the public entrypoint for validation and testing workflows.

Downstream specs and plans may use this as the current working direction, but any substrate-specific or session-exposure-specific implementation should stay aligned with the still-proposed ADRs that close those boundaries.

The platform is explicitly single-user in v1. All browser-facing surfaces are localhost-only by default. Future remote access must be supported by adding a dedicated authenticated gateway layer without redesigning the internal session model.

The session index follows these additional v1 rules:

- the backend prefers `Go`
- the frontend prefers `TypeScript`
- an explicit frontend/backend API contract must exist before UI implementation couples to backend details
- v1 avoids SSR
- v1 avoids `React Router`
- a thin frontend served as static assets is acceptable in v1
- Tilt is optional and only used for slower integration and platform verification loops

## Rationale

### Why `NixOS VM`

- stronger declarative system story than an ad hoc Linux setup
- easier to keep host configuration reproducible in-repo
- better fit for infrastructure-as-code than WSL2 for this use case
- avoids much of the split-brain between Windows and Linux tooling

### Why not `WSL2` as the cluster host

Rejected for the primary architecture because:

- `Kata Containers` is a weaker fit there
- there is more virtualization and runtime ambiguity
- there is less confidence in long-term maintainability for nested sandboxing

### Why `minikube`

- simple local Kubernetes distribution
- good fit for a single-machine cluster
- sufficient for session orchestration and experimentation

### Why `Kata Containers`

- stronger isolation boundary than standard containers
- suitable for autonomous coding sessions with a tighter blast radius

### Why one `opencode web` endpoint per session

- leverages native OpenCode web support
- avoids building a custom chat UI in v1
- keeps the session runtime simple
- allows a thin index page instead of a full custom product surface

### Why a lightweight session index page

- provides a central place to create, list, open, and delete sessions
- lowers engineering and maintenance cost versus a full custom session UI
- cleanly separates orchestration UI from OpenCode's own UI

### Why `K9s`

- provides fast operator workflows in the terminal
- keeps the control-plane surface smaller than a separate browser-based cluster UI
- fits the single-operator model well

### Why `Better Stack`

- lowers maintenance burden compared with self-hosting a full observability suite
- supports logs, metrics, and traces
- fits an OTEL-based telemetry export path
- matches the decision to optimize for convenience over full platform purity

### Why `mise`

- provides a single entrypoint for tools, tasks, and environment orchestration
- makes daily usage simpler
- standardizes workflows across the repo

### Why `hk`

- simple, explicit git hook management
- good fit for repo-managed development workflows

### Why `fnox` + `Infisical`

- strong fit for a low-cognitive-load, declarative local operator workflow
- keeps `Infisical` as the backend source of truth for local use and CI
- keeps secret values out of the repo and out of `nix`

### Why `Go` + `TypeScript` with an explicit API boundary

- `Go` is a good fit for a Kubernetes-heavy control-plane backend
- `TypeScript` gives the frontend strict typing without forcing a heavy runtime model
- early API design reduces premature frontend/backend coupling
- avoiding SSR and `React Router` keeps the v1 UI surface smaller

## Threat Model

The v1 threat model assumes a single trusted operator, but still treats the following as meaningful threats:

- malicious or overpowered model behavior inside a session
- untrusted repositories, dependencies, or generated code executed inside a session
- accidental exposure of browser-facing endpoints beyond localhost
- accidental leakage of secrets, prompts, code, or terminal output through logs or telemetry
- compromised session pods attempting lateral movement within the cluster or toward the host
- operational mistakes that grant excessive Kubernetes permissions to platform components
- accidental over-collection or over-export of observability data to Better Stack

The following are explicitly out of scope for v1:

- multi-user tenancy
- delegated administration
- Internet-exposed public access
- strong defenses against a fully compromised Windows host or browser profile

Kata-based isolation is treated as one containment layer, not a complete security boundary by itself. Network restrictions, least-privilege RBAC, secret scoping, runtime hardening, and telemetry redaction are required alongside it.

## Secret Bootstrap Model

The v1 bootstrap model is operator-mediated.

- `Infisical` is the source of truth for secret values.
- `fnox` is the repo-facing declarative secret UX layer for local workflows.
- `mise` is the only supported public path for secret-aware task execution.
- secret values must not be stored in `nix`, `.env` files, shell profiles, or committed manifests.
- v1 does not rely on long-lived exported secret material stored in repo-managed VM artifacts.

## Runtime Secret Materialization Policy

- secrets are fetched through `fnox` during local task execution, backed by `Infisical`
- secrets are materialized as late as possible
- per-session secrets should be unique when possible, especially for session auth
- persistent Kubernetes `Secret` objects are allowed only when needed and should remain narrowly scoped
- secret material should be deleted or invalidated when the owning session or workflow is destroyed
- secret values must not appear in logs, telemetry, URLs, or debug dumps

## Access Model

v1 access assumptions:

- the system has exactly one intended user and operator
- the session index page is localhost-only by default
- each per-session `opencode web` endpoint is localhost-only by default
- `K9s` is operator-only and runs inside the `NixOS VM`
- no multi-user authentication or shared-user workflow is required in v1

### Browser Authentication in v1

- session endpoints must require auth in v1
- the session index must not become a general-purpose secret vault
- auth failures should be distinguishable from session startup failures in operator-visible UX
- session auth handling must remain compatible with a future authenticated gateway

### Future Remote-Access Boundary Contract

- remote access from devices such as a phone or laptop is a supported future requirement
- remote access must be introduced through a single authenticated access layer
- internal session addressing, service naming, and routing must not assume permanent localhost-only exposure
- direct unauthenticated exposure of per-session endpoints is not allowed

## RBAC Model

The platform must use least-privilege Kubernetes access.

Requirements:

- session pods must not receive unnecessary Kubernetes API access
- session pods should set `automountServiceAccountToken: false` by default
- the session index backend must receive only the namespace-scoped permissions required to create, list, restart, and delete session resources
- session creation must be constrained to approved backend-owned resource shapes rather than arbitrary operator-submitted Kubernetes objects
- no application component should require cluster-admin privileges
- shared platform services must use dedicated service accounts rather than the default service account

## Telemetry Data Policy

Telemetry export must default to operational metadata rather than full session content.

Requirements:

- do not export secrets, tokens, or environment variable values
- do not export full prompts, code buffers, or terminal transcripts by default
- prefer lifecycle events, health signals, latency metrics, failure reasons, and sanitized logs
- apply redaction before export whenever there is risk of sensitive data leaving the local machine
- use an allowlist-first export approach where possible
- treat Better Stack as an external boundary for data handling purposes

## Networking Substrate Decision

The chosen local Kubernetes networking stack must support enforced `NetworkPolicy`.

Requirements:

- session workloads default to deny-all network posture except for explicitly allowed egress
- localhost-only access is the default external exposure mode in v1
- browser-facing routing must be designed so that a future authenticated remote-access layer can be added without redesigning session identity or service discovery
- `NetworkPolicy` enforcement must be verified by smoke tests rather than assumed

## Thin Operator Application Boundary

The session index is the primary operator console for normal use, but it is intentionally thin.

- the backend owns Kubernetes interaction, validation, session orchestration, URL resolution, and normalized status mapping
- the frontend owns rendering, local interaction state, and typed API consumption
- the index must not duplicate `opencode web` chat or terminal functionality
- an explicit API contract must exist before the UI implementation couples to backend behavior
- contract tests should protect the frontend/backend boundary
- UI tests should verify operator-visible behavior rather than private implementation details

## Runtime Hardening Baseline

Kata is additive isolation, not the only runtime hardening layer.

The platform should additionally require:

- restricted pod security settings
- no unnecessary Linux capabilities
- no unnecessary host integration
- no unnecessary service account tokens
- controlled volume usage

Detailed runtime hardening lives in the tech spec.

## Supply Chain Trust Position

The platform should pin and verify critical artifacts where practical, including:

- Nix inputs
- container base images
- cluster add-ons and controllers
- toolchain binaries used by repo workflows

Detailed artifact trust and update policy lives in the tech spec.

## Tool Ownership

Tool responsibilities are intentionally separated:

- `nix` owns system configuration, system packages, and long-lived machine or service definitions
- `mise` owns developer-facing tasks, build and validation entrypoints, and repo-level orchestration
- `fnox` owns the declarative local secret UX and task integration
- `hk` owns local hook execution policy
- `dprint` is the public formatting entrypoint and orchestrates underlying formatters

Scripts are implementation details and should not be the primary public interface.

## Consequences

### Positive

- lower daily cognitive load once built
- strong sandboxing model for OpenCode sessions
- declarative, repo-managed platform
- browser-based access to sessions, localhost-only by default in v1
- lower observability maintenance than self-hosted alternatives
- clear task and secret-management story
- strong typing and explicit API boundaries for the operator UI
- lower test brittleness when internals change but behavior stays the same

### Negative

- `minikube + Kata + VM` increases technical complexity
- `Better Stack` is not self-hosted
- one endpoint per session creates more routing objects than a single central UI
- `git clone per session` increases storage and startup cost
- early API and state-model design introduces upfront work before UI implementation
- behavior-focused TDD requires more up-front thinking about contracts, fixtures, and operator-visible states

### Neutral / Follow-Up

- may later replace `git clone per session` with `git worktree per session`
- may later add tighter Zed integration
- may later revisit observability if SaaS limits become annoying
- may later add an authenticated remote-access layer for phone and laptop access
- may later revisit frontend routing or SSR if the operator UI grows significantly

## Alternatives Considered

### `WSL2 + minikube + Kata`

Rejected because:

- there is less confidence in Kata behavior and long-term operability
- there is more host/runtime boundary ambiguity

### `Fedora VM` instead of `NixOS VM`

Rejected because:

- it has a weaker declarative platform story
- it requires more glue for repo-managed system configuration

### Custom session web app instead of `opencode web`

Rejected for v1 because:

- it would require too much engineering
- it would create a higher maintenance burden
- native OpenCode web already covers the core chat/session UX

### SSR and `React Router` in v1

Rejected because:

- they increase complexity without clear v1 value for a thin operator console

### Rust as the default backend

Not chosen as the default because:

- it is viable, but `Go` provides a simpler path for the Kubernetes-heavy backend in v1

## Golden Path / Recovery Path

The intended operator experience is:

- use `mise` as the primary entrypoint
- create and open sessions through the local session index page
- use the index page as the first recovery surface for normal failures
- use `K9s` only when cluster-level debugging is required
- use Better Stack only when telemetry, failures, or performance need investigation

Recovery flows must be documented and must not require ad hoc manual debugging as the default operating path.

## Implementation Notes

- keep all non-secret environment configuration in `mise` and `nix`
- keep secret retrieval behind `fnox` and `Infisical`
- do not commit `.env` files
- prefer `git clone per session` initially
- use `runtimeClassName: kata` for session pods
- use default-deny networking and explicit egress allowances
- export telemetry through an in-cluster OTEL Collector to `Better Stack`
- use `dprint` as the public formatting entrypoint

## Acceptance Criteria

- the VM can be rebuilt from repo configuration
- cluster startup is reproducible through documented `mise` entrypoints
- one Kata-backed OpenCode session works end-to-end
- session pods run with `runtimeClassName: kata`
- session pods do not receive unnecessary Kubernetes API credentials by default
- the session index page can link to live `opencode web` endpoints
- all browser-facing surfaces are localhost-only by default in v1
- `NetworkPolicy` deny-by-default behavior is validated by smoke tests
- telemetry reaches Better Stack without exporting secrets or raw session content by default
- the platform documents an explicit API contract before implementing the session index UI
- the platform documents a strict typing policy for Go and TypeScript code
- secret values are not stored in `nix`, committed manifests, or repo-managed `.env` files
- the formatting, linting, typechecking, build, and validation command surface is documented through `mise`
- a documented layered testing strategy exists and treats contracts as first-class test artifacts
- fast local behavior tests do not require full cluster bring-up
- slower platform verification exists for localhost-only exposure, network policy, auth handling, and telemetry redaction
- the architecture leaves room for a future authenticated remote-access layer without redesigning internal session routing
