---
title: "Observability and Hardening"
doc_id: "PLAN-006"
doc_type: "plan"
status: "draft"
date: "2026-03-08"
updated: "2026-03-09"
summary: "OTEL, Better Stack, telemetry redaction, RBAC hardening, and final v1 security validation."
aliases:
  - "Plan 06"
  - "Observability and Hardening Plan"
tags:
  - "plan"
  - "observability"
  - "telemetry"
  - "security"
  - "hardening"
source_of_truth: "execution-plan"
scope: "OTEL, Better Stack, telemetry redaction, RBAC hardening, auth leakage prevention, and localhost-only verification"
depends_on:
  - "docs/plans/05-session-index-and-operator-ux.md"
blocks:
  - "v1 completion"
related_docs:
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/plans/04-session-runtime.md"
  - "docs/plans/05-session-index-and-operator-ux.md"
---

# Observability and Hardening

## Purpose

Finish v1 by adding observability and validating the security posture.

## In Scope

- OTEL collector
- Better Stack export
- dashboards and alerts
- telemetry redaction
- RBAC hardening
- runtime hardening validation
- localhost-only verification
- final smoke validation against acceptance criteria

## Out of Scope

- self-hosted observability
- public or remote access gateway
- multi-user auth

## Deliverables

- `cluster/observability/otel-collector.yaml`
- `telemetry/betterstack/setup.md`
- `telemetry/betterstack/dashboards.md`
- `telemetry/betterstack/alerts.md`
- RBAC manifests
- final smoke tests

## Tasks

### Observability

- deploy OTEL collector
- instrument operator-visible lifecycle events
- instrument API and session-index action failures
- wire Better Stack export
- create baseline dashboards and alerts

### Telemetry Data Policy

- enforce redaction rules
- confirm secrets and raw session content are not exported by default
- confirm auth or password data does not leak through URLs, logs, or telemetry
- document what is and is not sent

### Hardening

- tighten RBAC
- verify session pods have no unnecessary API access
- verify localhost-only exposure
- verify restricted egress behavior
- verify runtime hardening baseline

### Platform Verification Layers

- define which checks belong to integration tests, platform smoke tests, and security regressions
- keep these slower verification layers separate from the fast local loop
- Tilt may optionally assist repeated slow verification, but must not replace `mise` workflows

Minimum required security regressions should include:

- unauthorized or malformed open-session attempts
- secret leakage checks for logs, URLs, and telemetry
- localhost-only exposure verification
- deny-by-default egress and blocked lateral movement checks
- absence of unnecessary Kubernetes API credentials in session pods

### Final Validation

- run acceptance-criteria smoke tests
- validate auth-open flow and failure handling
- record remaining gaps as follow-up work
- explicitly cover localhost-only exposure, network policy behavior, auth leakage, and telemetry redaction

## Validation

- Better Stack receives usable telemetry
- no sensitive defaults leak
- localhost-only behavior is confirmed
- final acceptance criteria can be demonstrated
- slower platform verification suites confirm the expected security and observability behaviors

## Exit Criteria

- v1 security and observability assumptions are tested
- the platform is ready for real use as a single-user localhost-only system
- follow-up work for remote access or future refinements is clearly separated
- slow verification loops exist independently of fast local tests

## Risks / Notes

- if observability requires exporting too much raw session data, stop and redesign the telemetry scope before calling v1 done
