---
title: "VM Bootstrap"
doc_id: "PLAN-002"
doc_type: "plan"
status: "draft"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Reproducible NixOS VM setup, operator access, and build-tool availability on the selected Hyper-V path."
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
  - "docs/adr/0004-local-substrate-selection.md"
  - "docs/specs/platform/repository-tooling.md"
  - "docs/specs/platform/secret-management.md"
  - "docs/specs/platform/tech-spec.md"
---

# VM Bootstrap

## Purpose

Create the `NixOS` VM control plane on the selected Hyper-V path and make it reproducible from repo configuration.

## In Scope

- `flake.nix`
- `nixos/hosts/op-platform-vm.nix`
- base NixOS modules
- SSH
- operator tooling inside the VM
- Go and TypeScript build prerequisites in the VM path
- VM rebuild and recovery workflow

## Deliverables

- `flake.nix`
- `nixos/hosts/op-platform-vm.nix`
- initial modules for base system, SSH, minikube prerequisites, Kata prerequisites, `k9s`, and OpenCode tooling
- `mise run vm:bootstrap`
- `mise run vm:rebuild`
- documented VM reproducibility and recovery boundary

## Tasks

### Base Host Definition

- define system packages
- define SSH access
- define Hyper-V-specific VM assumptions
- define operator user expectations

### Toolchains

- ensure `git`, `kubectl`, `helm`, `k9s`, and `mise` are available
- ensure Corepack and `pnpm` are available where the operator workflow depends on Node tooling
- ensure `Nx` can run in the supported operator path
- ensure `fnox` is available if local secret-aware workflows run from the VM path
- ensure the Go toolchain is available for backend builds
- ensure the TypeScript build path is available where needed for frontend builds

### Secrets Access Path

- document how the operator uses `Infisical` while running tasks in the VM path
- ensure bootstrap does not leave exported secret material on disk

### Rebuild And Recovery

- define a reliable rebuild path
- define a rollback-safe recovery path when rebuild or host integration fails
- document health checks after rebuild

### Early Viability Gate

- confirm nested virtualization is viable early enough for later Kata work
- stop the milestone if the selected matrix cannot support the next stage safely

## Validation

- VM boots
- SSH works
- rebuild succeeds
- documented `mise` tasks run from the expected operator context
- Go and TypeScript build prerequisites are available
- the operator can recover the VM without undocumented manual steps

## Exit Criteria

- `NixOS` VM is reproducible on the selected Hyper-V path
- operator can access, rebuild, and recover the VM reliably
- toolchains and secret access path are documented and usable
