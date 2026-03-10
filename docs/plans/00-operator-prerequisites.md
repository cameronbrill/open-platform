---
title: "Operator Prerequisites"
doc_id: "PLAN-000"
doc_type: "plan"
status: "draft"
date: "2026-03-08"
updated: "2026-03-10"
summary: "Manual setup, accounts, and operator-owned decisions required before implementation begins."
aliases:
  - "Plan 00"
  - "Operator Prerequisites Plan"
tags:
  - "plan"
  - "prerequisites"
  - "operator"
  - "setup"
source_of_truth: "execution-plan"
scope: "manual and operator-owned setup required before implementation"
depends_on: []
blocks:
  - "docs/plans/01-repo-foundations.md"
  - "docs/plans/02-vm-bootstrap.md"
  - "docs/plans/03-cluster-network-and-kata.md"
  - "docs/plans/04-session-runtime.md"
  - "docs/plans/05-session-index-and-operator-ux.md"
  - "docs/plans/06-observability-and-hardening.md"
related_docs:
  - "docs/adr/README.md"
  - "docs/specs/platform/secret-management.md"
  - "docs/specs/platform/repository-tooling.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/plans/initial-implementation-plan.md"
---

# Operator Prerequisites

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

These must be captured in [ADRs](../adr/README.md) when they become durable architecture choices.

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

- create or access the Infisical organization, project, and environments needed for the repo
- authenticate the repo-managed `Infisical` CLI installed through `mise`
- confirm local secret access works from the intended operator environment
- confirm the repo-managed `fnox` install provided through `mise` is available locally
- confirm repo-declared local secret workflows work through `fnox`
- create or confirm model provider account and API credentials
- create Better Stack account, sources, and tokens
- decide password generation and storage approach for `OPENCODE_SERVER_PASSWORD`

### CI And Automation Prerequisites

- create or confirm Buildkite organization and pipeline access
- decide the Buildkite agent model needed for the repo
- provision the Infisical CI auth/bootstrap mechanism

### Frontend and Backend Preconditions

- confirm the preferred stack direction: Go backend and TypeScript frontend
- confirm that v1 uses an explicit API contract before UI implementation
- confirm that v1 avoids SSR and avoids `React Router`
- confirm `pnpm` as the Node package manager
- confirm `Nx` as the orchestration and caching layer
- confirm `@nx-go/nx-go` as the Go/Nx integration path

### Operator Tooling Prerequisites

- confirm local Git access strategy
- install and configure `Graphite`
- confirm browser used for local access
- confirm Zed usage mode if relevant later
- confirm understanding of Windows host vs VM vs cluster locality
- confirm understanding that `mise` is the supported validation and testing path
- confirm that Tilt is optional and not a prerequisite
- confirm understanding that Buildkite runs repo-owned tasks rather than defining a separate public workflow surface
- confirm understanding that `Graphite` is the supported interface for all normal git operations

## Completion Checklist

- [ ] virtualization is enabled
- [ ] hypervisor is selected and installed
- [ ] VM resource budget is decided
- [ ] model provider credentials are available in Infisical
- [ ] Better Stack credentials are available in Infisical
- [ ] local Infisical CLI access works
- [ ] local `fnox`-mediated secret workflows work
- [ ] Buildkite prerequisites are available for CI setup
- [ ] Graphite is installed and usable
- [ ] operator understands Graphite-based stacked workflow expectations
- [ ] operator understands host vs VM vs cluster access model
- [ ] blocking architecture decisions are captured in ADRs or explicitly deferred

## Exit Criteria

- all required manual setup is complete
- all blocking operator-owned credentials exist
- all blocking architecture decisions are recorded or explicitly deferred

## Risks / Notes

- this file should be mostly frozen after completion
- do not let this file become the source of truth for architecture decisions
