# ADR-0004: Local Substrate Selection

- Status: Proposed
- Date: 2026-03-08

## Context

The platform depends on a local substrate that must support:

- a `NixOS` VM on Windows
- `minikube`
- enforced `NetworkPolicy`
- `Kata Containers`
- localhost-only browser access in v1
- a future authenticated remote-access layer

Several decisions materially affect feasibility and security:

- hypervisor
- VM networking mode
- `minikube` driver
- container runtime
- CNI
- ingress/controller behavior
- storage and PVC behavior
- local image build and distribution workflow

## Proposed Direction

Before implementation moves beyond foundations, the platform must settle on one supported v1 substrate matrix and record it here.

The chosen substrate must:

- support nested virtualization well enough for Kata or clearly fail early
- support real `NetworkPolicy` enforcement rather than assuming it
- support localhost-only exposure without accidentally widening the access surface
- keep session storage and reset behavior understandable to a single operator

## Evaluation Criteria

- Kata viability on the chosen Windows and VM stack
- enforceable `NetworkPolicy`
- reproducible VM and cluster setup
- simple local image workflow
- predictable ingress and URL behavior
- acceptable operator complexity

## Follow-Up

- finalize the supported substrate matrix
- add reset, rollback, storage, and local image decisions once selected
