# VM Bootstrap

- Status: Draft
- Date: 2026-03-08
- Scope: reproducible NixOS VM setup, operator access, and build-tool availability
- Depends on:
  - `docs/plans/01-repo-foundations.md`
- Blocks:
  - `docs/plans/03-cluster-network-and-kata.md`
  - `docs/plans/04-session-runtime.md`
  - `docs/plans/05-session-index-and-operator-ux.md`
  - `docs/plans/06-observability-and-hardening.md`

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
- ensure the Go toolchain is available for backend builds
- ensure the TypeScript build path is available where needed for frontend builds

### Secrets Access Path

- document how the operator uses `fnox` and `1Password` while running tasks that execute in the VM path
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
