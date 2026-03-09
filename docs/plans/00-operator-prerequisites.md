---
title: "Operator Prerequisites"
doc_id: "PLAN-000"
doc_type: "plan"
status: "draft"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Manual setup, accounts, and operator-owned environment checks required before implementation begins."
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
  - "docs/adr/0004-local-substrate-selection.md"
  - "docs/adr/0008-infisical-secret-management-and-ci-auth.md"
  - "docs/specs/platform/secret-management.md"
  - "docs/specs/platform/repository-tooling.md"
  - "docs/specs/platform/tech-spec.md"
---

# Operator Prerequisites

## Purpose

List all manual work that must be completed by the operator before implementation can proceed.

## In Scope

- host OS, firmware, and Hyper-V readiness
- account, credential, and secret setup that requires operator approval
- storage and resource allocation choices for the selected matrix
- manual environment checks that automation depends on

## Out Of Scope

- recording new architecture decisions directly in this file
- implementation steps that can be automated in repo tasks

## Operator-Owned Environment Gates

- confirm the operator machine can support the selected Hyper-V plus `NixOS` plus `minikube` plus Kata path
- confirm disk, CPU, and RAM budgets are acceptable for the VM and cluster
- record any local deviation that would break the supported matrix before implementation proceeds

## Manual Host Prerequisites

### Windows And Firmware

- confirm virtualization is enabled in BIOS or UEFI
- confirm required Windows virtualization features for Hyper-V
- confirm nested-virtualization support for the selected VM path
- confirm available disk location for VM storage

### Hyper-V Preparation

- install and configure Hyper-V
- create or reserve VM storage location
- decide CPU and RAM allocation range for the VM
- confirm the NAT-style VM networking model needed by the selected substrate

### Account And Secret Prerequisites

- create or access the Infisical project and `dev` and `ci` environments needed for the repo
- install and authenticate the `Infisical` CLI
- confirm local secret access works from the intended operator environment
- install or bootstrap `fnox` for the local operator path
- confirm repo-declared local secret workflows work through `fnox`
- create or confirm model provider account and API credentials
- create Better Stack account, sources, and tokens

### CI And Automation Prerequisites

- create or confirm Buildkite organization and pipeline access
- confirm the Buildkite agent model needed for the repo
- provision the documented Infisical CI bootstrap path or machine-oriented auth prerequisite

### Operator Tooling Prerequisites

- confirm local Git access strategy
- confirm browser used for local access
- confirm understanding of Windows host vs VM vs cluster locality
- confirm understanding that `mise` is the supported validation and testing path

## Failure And Recovery Notes

- if Hyper-V or firmware support is missing, stop before repo or VM work and record the blocker
- if local Infisical access fails, fix that before repo scaffolding depends on it
- if Buildkite bootstrap is incomplete, local work may continue only if CI-dependent milestones are not claimed complete

## Completion Checklist

- [ ] virtualization is enabled
- [ ] Hyper-V is installed and usable
- [ ] VM resource budget is decided
- [ ] model provider credentials are available in Infisical
- [ ] Better Stack credentials are available in Infisical
- [ ] local Infisical CLI access works
- [ ] local `fnox`-mediated secret workflows work
- [ ] Buildkite prerequisites are available for CI setup
- [ ] operator understands host vs VM vs cluster access model
- [ ] blocking deviations from the supported matrix are recorded

## Exit Criteria

- all required manual setup is complete
- all blocking operator-owned credentials exist
- the operator environment is ready for the supported matrix without undocumented assumptions
