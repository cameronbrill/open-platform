---
title: "Cluster Network and Kata"
doc_id: "PLAN-003"
doc_type: "plan"
status: "draft"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Local cluster substrate, ingress behavior, localhost exposure, and Kata validation."
aliases:
  - "Plan 03"
  - "Cluster Network and Kata Plan"
tags:
  - "plan"
  - "cluster"
  - "networking"
  - "kata"
  - "localhost-only"
source_of_truth: "execution-plan"
scope: "local cluster substrate, policy enforcement, ingress behavior, and Kata validation"
depends_on:
  - "docs/plans/02-vm-bootstrap.md"
blocks:
  - "docs/plans/04-session-runtime.md"
  - "docs/plans/05-session-index-and-operator-ux.md"
  - "docs/plans/06-observability-and-hardening.md"
related_docs:
  - "docs/adr/0004-local-substrate-selection.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/plans/04-session-runtime.md"
---

# Cluster Network and Kata

## Purpose

Bring up the cluster substrate and validate the security-critical assumptions around networking, localhost exposure, and Kata.

## In Scope

- `minikube`
- cluster namespaces and base resources
- `NetworkPolicy` enforcement
- ingress or local exposure behavior
- runtime class
- Kata install and validation
- cluster health checks

## Out of Scope

- full session app behavior
- session index page
- Better Stack export

## Deliverables

- `cluster/base/*`
- `cluster/kata/*`
- `mise run cluster:up`
- `mise run cluster:doctor`
- named smoke suites:
  - `netpol-smoke`
  - `localhost-smoke`
  - `kata-smoke`
- substrate decision outputs captured in [ADRs](../adr/README.md)

## Tasks

### Cluster Bring-Up

- start `minikube`
- define namespaces
- define quotas and limit ranges
- capture selected driver, runtime, and addon assumptions

### Networking Substrate

- document the chosen networking or CNI path
- apply default-deny policy
- validate actual policy enforcement
- validate localhost-only access behavior
- ensure smoke checks assert observable platform behavior rather than only manifest presence

### Kata

- install and configure Kata
- define `RuntimeClass`
- validate a test workload under Kata
- define a go or no-go gate if Kata is not viable on the chosen substrate
- prefer runtime behavior assertions over merely proving config was applied

### Cluster Diagnostics

- define doctor checks for:
  - cluster health
  - policy enforcement
  - localhost exposure assumptions
  - Kata availability
- Tilt may optionally accelerate repeated rebuild, apply, watch, and observe cycles, but does not replace `mise run cluster:smoke`

Expected smoke ownership:

- `netpol-smoke` proves deny-by-default and allowed-egress behavior
- `localhost-smoke` proves browser surfaces remain local-only
- `kata-smoke` proves the workload actually runs with the intended runtime behavior

## Validation

- cluster boots reproducibly
- policy enforcement works in practice
- localhost-only exposure works as documented
- a test pod runs under `runtimeClassName: kata`
- smoke suites assert behavior, not just resource existence

## Exit Criteria

- the cluster substrate is usable
- security-critical network assumptions are verified
- Kata is proven viable on this machine or explicitly blocked by a recorded decision

## Risks / Notes

- if policy enforcement is weak or inconsistent in the chosen local stack, fix that before relying on network isolation anywhere else
