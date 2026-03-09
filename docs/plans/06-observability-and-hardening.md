---
title: "Observability and Hardening"
doc_id: "PLAN-006"
doc_type: "plan"
status: "draft"
date: "2026-03-08"
updated: "2026-03-09"
summary: "Finalize OTEL, Better Stack export, telemetry redaction, RBAC hardening, and final v1 security verification."
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
scope: "final observability verification, telemetry redaction, RBAC hardening, auth leakage prevention, and localhost-only validation"
depends_on:
  - "docs/plans/04-session-runtime.md"
blocks:
  - "v1 completion"
related_docs:
  - "docs/specs/platform/secret-management.md"
  - "docs/specs/platform/repository-tooling.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/specs/platform/tech-spec.md"
  - "docs/plans/05-session-index-and-operator-ux.md"
---

# Observability and Hardening

## Purpose

Finalize and verify v1 observability and security posture after runtime behavior exists.

Preparatory instrumentation may begin after Plan 04 exposes stable runtime events. Final signoff depends on the operator-visible auth, error, and recovery behavior completed in Plan 05.

## In Scope

- OTEL collector
- Better Stack export
- dashboards and alerts
- telemetry redaction
- RBAC hardening
- runtime hardening validation
- localhost-only verification
- final smoke validation against acceptance criteria

## Deliverables

- `cluster/observability/otel-collector.yaml`
- `telemetry/betterstack/setup.md`
- `telemetry/betterstack/dashboards.md`
- `telemetry/betterstack/alerts.md`
- RBAC manifests
- final smoke and security regression docs or suites
- incident and recovery notes for telemetry or hardening failures

## Tasks

### Observability

- deploy the OTEL collector
- instrument operator-visible lifecycle events
- instrument API and session-index action failures
- prove redaction locally before enabling external export
- wire Better Stack export only after that proof exists
- create baseline dashboards and alerts

### Telemetry Data Policy Verification

- confirm secrets and raw session content are not exported by default
- confirm auth or password data does not leak through URLs, logs, cookies, or telemetry
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
- ensure Buildkite can run or schedule the documented slower security and observability suites when required

### Failure Response

- define what to do if telemetry export leaks sensitive content
- define what to do if collector export fails
- define what to do if a hardening regression fails late in the milestone

## Validation

- Better Stack receives usable telemetry
- no sensitive defaults leak
- localhost-only behavior is confirmed
- final acceptance criteria can be demonstrated
- slower platform verification suites confirm the expected security and observability behaviors

## Exit Criteria

- v1 security and observability assumptions are tested
- no external telemetry export is enabled before redaction proof exists
- the platform is ready for real use as a single-user localhost-only system
- slow verification loops exist independently of fast local tests
