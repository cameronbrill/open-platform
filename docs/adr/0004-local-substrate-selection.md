---
title: "ADR-0004: Local Substrate Selection"
doc_id: "ADR-0004"
doc_type: "adr"
status: "proposed"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Select the supported v1 local substrate matrix across hypervisor, VM networking, minikube driver, and Kata viability."
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
  - "docs/plans/02-vm-bootstrap.md"
  - "docs/plans/03-cluster-network-and-kata.md"
supersedes: []
superseded_by: []
---

# ADR-0004: Local Substrate Selection

## Status Note

This ADR is still `proposed`. Until it is accepted, downstream docs should treat the substrate details below as bounded validation targets and decision criteria rather than fully ratified long-term architecture guarantees.

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

Until that happens, the current validation target is intentionally narrow:

- Windows host plus `NixOS` VM remains the working control-plane direction
- `minikube` remains the working local cluster direction
- real `NetworkPolicy` enforcement is mandatory
- localhost-only browser exposure is mandatory
- Kata viability is a go or no-go gate for the current v1 isolation model

The still-open matrix choices are the exact hypervisor path, VM networking mode, `minikube` driver, container runtime, CNI, ingress/controller behavior, storage behavior, and local image workflow.

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
