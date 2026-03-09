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

### Final Validation

- run acceptance-criteria smoke tests
- validate auth-open flow and failure handling
- record remaining gaps as follow-up work

## Validation

- Better Stack receives usable telemetry
- no sensitive defaults leak
- localhost-only behavior is confirmed
- final acceptance criteria can be demonstrated

## Exit Criteria

- v1 security and observability assumptions are tested
- the platform is ready for real use as a single-user localhost-only system
- follow-up work for remote access or future refinements is clearly separated

## Risks / Notes

- if observability requires exporting too much raw session data, stop and redesign the telemetry scope before calling v1 done
