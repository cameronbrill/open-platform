---
title: "VM Bootstrap"
doc_id: "PLAN-002"
doc_type: "plan"
status: "draft"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Reproducible NixOS VM setup, operator access, and build-tool availability."
aliases:
  - "Plan 02"
  - "VM Bootstrap Plan"
tags:
  - "plan"
  - "vm"
  - "nixos"
  - "bootstrap"
source_of_truth: "execution-plan"
scope: "reproducible NixOS VM setup, operator access, and build-tool availability"
depends_on:
  - "docs/plans/01-repo-foundations.md"
blocks:
  - "docs/plans/03-cluster-network-and-kata.md"
  - "docs/plans/04-session-runtime.md"
  - "docs/plans/05-session-index-and-operator-ux.md"
  - "docs/plans/06-observability-and-hardening.md"
related_docs:
  - "docs/specs/platform/secret-management.md"
  - "docs/specs/platform/repository-tooling.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/plans/03-cluster-network-and-kata.md"
  - "docs/plans/04-session-runtime.md"
---

# VM Bootstrap

## Purpose

Create the NixOS VM control plane and make it reproducible from repo configuration.

## In Scope

- `flake.nix`
- `nixos/hosts/op-platform-vm.nix`
- base NixOS modules
- SSH
- operator tooling inside the VM
- Go and TypeScript build prerequisites in the VM path
- VM rebuild workflow

## Out of Scope

- cluster-specific manifests
- session workloads
- observability apps

## Deliverables

- `flake.nix`
- `nixos/hosts/op-platform-vm.nix`
- initial modules:
  - `base.nix`
  - `ssh.nix`
  - `minikube.nix`
  - `kata.nix`
  - `k9s.nix`
  - `opencode-tools.nix`
  - `reverse-proxy.nix`
- `mise run vm:bootstrap`
- `mise run vm:rebuild`
- documented VM reproducibility boundary

## Tasks

### Base Host Definition

- define system packages
- define SSH access
- define baseline networking assumptions
- define operator user expectations

### Toolchains

- ensure `git`, `kubectl`, `helm`, `k9s`, and `mise` are available
- ensure Corepack and `pnpm` are available where the operator workflow depends on Node tooling
- ensure `Nx` can run in the supported operator path
- ensure `fnox` is available if local secret-aware workflows run from the VM path
- ensure the Go toolchain is available for backend builds
- ensure the TypeScript build path is available where needed for frontend builds
- Tilt may be installed later as optional contributor tooling, but it is not part of bootstrap success

### Secrets Access Path

- document how the operator uses `Infisical` while running tasks that execute in the VM path
- document how repo-declared `fnox` flows are used in local secret-aware VM workflows
- ensure bootstrap does not leave exported secret material on disk

### Rebuild and Recovery

- define a reliable rebuild path
- document how to verify host health after rebuild
- document rollback expectations where practical

## Validation

- VM boots
- SSH works
- rebuild succeeds
- documented `mise` tasks run from the expected operator context
- Go and TypeScript build prerequisites are available

## Exit Criteria

- NixOS VM is reproducible
- operator can access and manage the VM reliably
- toolchains and secret access path are documented and usable

## Risks / Notes

- nested virtualization support should be verified early because it affects later Kata work
