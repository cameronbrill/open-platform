---
title: "Cluster Network and Kata"
doc_id: "PLAN-003"
doc_type: "plan"
status: "draft"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Local cluster substrate verification, localhost-only forwarding, Calico enforcement, ingress-nginx behavior, and Kata validation."
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
scope: "local cluster substrate, policy enforcement, localhost behavior, and Kata validation"
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
---

# Cluster Network and Kata

## Purpose

Bring up the supported cluster substrate and validate the security-critical assumptions around networking, localhost-only forwarding, and Kata.

## In Scope

- `minikube` on the selected `none`-driver path
- namespaces and base resources
- Calico policy enforcement
- ingress-nginx behavior
- localhost-only forwarding verification
- Kata install and validation
- cluster doctor checks

## Deliverables

- `cluster/base/*`
- `cluster/networking/*`
- `cluster/kata/*`
- `mise run cluster:up`
- `mise run cluster:doctor`
- named smoke suites: `netpol-smoke`, `localhost-smoke`, `kata-smoke`
- operator runbooks for cluster bring-up and common substrate failures

## Tasks

### Cluster Bring-Up

- start `minikube` on the selected substrate
- define namespaces
- define quotas and limit ranges
- capture runtime, addon, and forwarding assumptions in repo docs

### Networking And Forwarding

- install and configure Calico
- apply default-deny policy
- validate real policy enforcement
- validate ingress-nginx behavior for the selected `*.localhost` routing model
- validate localhost-only forwarding from the Windows host to the VM and cluster boundary

### Kata

- install and configure Kata
- define the `RuntimeClass`
- validate a real test workload under Kata
- stop and record the blocker if Kata is not viable on the supported matrix

### Cluster Diagnostics

- define doctor checks for cluster health, policy enforcement, localhost-only forwarding, and Kata availability
- keep smoke checks behavior-oriented rather than manifest-only

## Validation

- cluster boots reproducibly
- Calico enforcement works in practice
- localhost-only forwarding works as documented
- a test pod runs under `runtimeClassName: kata`
- doctor and smoke checks assert behavior, not just resource existence

## Exit Criteria

- the cluster substrate is usable on the supported matrix
- security-critical network assumptions are verified
- Kata is proven viable on this machine or implementation is explicitly blocked behind a replacement decision
- Plan 04 has a stable substrate and forwarding model to build on
