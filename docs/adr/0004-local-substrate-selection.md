---
title: "ADR-0004: Local Substrate Selection"
doc_id: "ADR-0004"
doc_type: "adr"
status: "accepted"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Use a Hyper-V hosted NixOS VM with minikube on the none driver, containerd, Calico, ingress-nginx, host-based *.localhost routing, and explicit localhost-only forwarding as the supported v1 substrate matrix."
aliases:
  - "Local Substrate Selection"
tags:
  - "adr"
  - "substrate"
  - "minikube"
  - "kata"
  - "networking"
source_of_truth: "durable-decision"
related_docs:
  - "docs/specs/platform/tech-spec.md"
  - "docs/adr/0005-session-exposure-and-routing.md"
  - "docs/plans/02-vm-bootstrap.md"
  - "docs/plans/03-cluster-network-and-kata.md"
supersedes: []
superseded_by: []
---

# ADR-0004: Local Substrate Selection

## Context

The platform depends on a local substrate that must support:

- a `NixOS` VM on Windows
- `minikube`
- enforced `NetworkPolicy`
- `Kata Containers`
- localhost-only browser access in v1
- a future authenticated remote-access layer

## Decision

The supported v1 substrate matrix is:

- `Windows 11` host
- `Hyper-V` Generation 2 VM for the `NixOS` control plane
- `Hyper-V` NAT-style VM networking, with browser-facing ports exposed to the Windows host only through explicit localhost-only forwarding
- `minikube` on the `none` driver inside the `NixOS` VM
- `containerd` as the node runtime path used by the cluster
- `Calico` as the `NetworkPolicy` enforcement path
- `ingress-nginx` as the ingress controller
- host-based routing on `*.localhost` names for per-session browser access
- local host-path-style workspace storage with delete-on-teardown semantics for session workspaces
- image build and load workflows performed from inside the VM against the local cluster runtime through documented `minikube`-aware tasks

## Rationale

### Why `Hyper-V` plus `NixOS VM`

- it matches the Windows-first host model already chosen for v1
- it keeps Linux infrastructure declarative and repo-managed
- it provides a credible path for nested virtualization work needed by Kata validation

### Why `minikube` on the `none` driver

- it avoids introducing a second local virtualization layer for the Kubernetes node itself
- it keeps the nested-virtualization budget focused on Kata rather than on a minikube-managed VM
- it simplifies the relationship between the VM, cluster runtime, and local image workflow

### Why `Calico`

- it provides a clear and well-understood `NetworkPolicy` enforcement path for a local cluster
- it is a better fit for deny-by-default verification than relying on a stack where enforcement is ambiguous

### Why `ingress-nginx` plus `*.localhost`

- it supports the host-based routing direction chosen in [ADR-0005](0005-session-exposure-and-routing.md)
- it keeps the v1 access boundary local to the operator machine when combined with explicit localhost-only forwarding
- it avoids brittle path rewriting against `opencode web`

## Hard Rules

- browser-facing services must not bind directly to a LAN-facing address as the supported v1 path
- localhost-only exposure must be verified through smoke tests, not assumed from configuration alone
- Kata viability on this matrix is a milestone gate, not a soft preference
- if Kata is not viable on this matrix, implementation must stop and record a replacement decision rather than silently weakening isolation

## Consequences

### Positive

- one concrete matrix exists for VM, cluster, policy enforcement, ingress, storage, and image workflows
- the local architecture now has a stable substrate assumption for plans and specs

### Negative

- `Hyper-V` plus `NixOS VM` plus `minikube` plus Kata remains operationally demanding
- explicit localhost-only forwarding and host-based routing require clear automation and verification

## Follow-Up

- validate and document the exact operator runbooks in [VM Bootstrap](../plans/02-vm-bootstrap.md) and [Cluster Network and Kata](../plans/03-cluster-network-and-kata.md)
- keep storage cleanup, rollback, and doctor/reset behavior aligned with the tech spec and numbered plans
