# Operator Prerequisites

- Status: Draft
- Date: 2026-03-08
- Scope: manual and operator-owned setup required before implementation
- Depends on:
  - none
- Blocks:
  - `docs/plans/01-repo-foundations.md`
  - `docs/plans/02-vm-bootstrap.md`
  - `docs/plans/03-cluster-network-and-kata.md`
  - `docs/plans/04-session-runtime.md`
  - `docs/plans/05-session-index-and-operator-ux.md`
  - `docs/plans/06-observability-and-hardening.md`

## Purpose

List all manual work that must be completed by the operator before implementation can proceed.

## In Scope

- host OS and hypervisor setup
- BIOS or UEFI and Windows feature toggles
- account, credential, and secret setup that requires operator approval
- storage and resource allocation choices
- any manual confirmations required before running automation

## Out of Scope

- recording architecture decisions directly in this file
- implementation steps that can be automated in repo tasks
- cluster or app bootstrap work

## Required Decisions Referenced Elsewhere

- hypervisor choice
- `minikube` driver choice
- networking or CNI choice
- ingress or routing preference
- secret materialization approach
- final localhost exposure mechanics

These must be captured in ADRs when they become durable architecture choices.

## Manual Host Prerequisites

### Windows and Firmware

- confirm virtualization is enabled in BIOS or UEFI
- confirm required Windows virtualization features for the chosen hypervisor
- confirm nested virtualization requirements for the VM path
- confirm available disk location for VM storage

### Hypervisor Preparation

- install and configure the chosen hypervisor
- create or reserve VM storage location
- decide CPU and RAM allocation range for the VM
- confirm networking mode for the VM

### Account and Secret Prerequisites

- install and sign in to the `1Password` desktop app
- install the `1Password` CLI
- confirm `fnox` can retrieve secrets through `1Password`
- create or confirm model provider account and API credentials
- create Better Stack account, sources, and tokens
- decide password generation and storage approach for `OPENCODE_SERVER_PASSWORD`

### Frontend and Backend Preconditions

- confirm the preferred stack direction: Go backend and TypeScript frontend
- confirm that v1 uses an explicit API contract before UI implementation
- confirm that v1 avoids SSR and avoids `React Router`

### Operator Tooling Prerequisites

- confirm local Git access strategy
- confirm browser used for local access
- confirm Zed usage mode if relevant later
- confirm understanding of Windows host vs VM vs cluster locality

## Completion Checklist

- [ ] virtualization is enabled
- [ ] hypervisor is selected and installed
- [ ] VM resource budget is decided
- [ ] model provider credentials are available in `1Password`
- [ ] Better Stack credentials are available in `1Password`
- [ ] `fnox` is usable with `1Password`
- [ ] operator understands host vs VM vs cluster access model
- [ ] blocking architecture decisions are captured in ADRs or explicitly deferred

## Exit Criteria

- all required manual setup is complete
- all blocking operator-owned credentials exist
- all blocking architecture decisions are recorded or explicitly deferred

## Risks / Notes

- this file should be mostly frozen after completion
- do not let this file become the source of truth for architecture decisions
