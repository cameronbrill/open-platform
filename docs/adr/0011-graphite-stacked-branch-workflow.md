---
title: "ADR-0011: Graphite Stacked Branch Workflow"
doc_id: "ADR-0011"
doc_type: "adr"
status: "accepted"
date: "2026-03-09"
updated: "2026-03-09"
summary: "Adopt Graphite for all normal git operations and use small, independently testable stacked branches as the default contribution model."
aliases:
  - "Graphite Workflow ADR"
  - "Stacked Branch Workflow ADR"
tags:
  - "adr"
  - "git"
  - "graphite"
  - "review"
  - "workflow"
source_of_truth: "durable-decision"
related_docs:
  - "docs/specs/platform/repository-tooling.md"
  - "docs/specs/platform/testing-strategy.md"
  - "docs/plans/00-operator-prerequisites.md"
  - "docs/plans/01-repo-foundations.md"
  - "AGENTS.md"
supersedes: []
superseded_by: []
---

# ADR-0011: Graphite Stacked Branch Workflow

## Context

- the repo is docs-first and review-heavy
- the operator will manually review 100% of produced changes
- large pull requests increase review burden and reduce confidence
- the desired workflow is incremental, independently testable, and independently reviewable changes
- `main` should stay clean and not accumulate in-flight feature work

## Decision

- `Graphite` is the required interface for all normal git operations in this repo
- stacked branches are the default contribution model
- pull requests should be pragmatically small
- each branch and pull request should be independently understandable and independently testable where practical
- `main` is a clean integration branch, not a branch for in-flight feature work
- raw `git` is reserved for low-level inspection and recovery, not normal day-to-day branching or submission

## Decision Details

### Expected Workflow

- start from clean trunk
- create a focused branch in a stack
- keep changes scoped narrowly
- validate at the smallest useful layer
- submit and review bottom-up
- land incrementally

### Review Expectations

- small review units
- clear dependency ordering
- no mixed unrelated concerns in one pull request
- each pull request should have a clear reason to exist independently

### `main` Policy

- no normal feature development directly on `main`
- `main` should remain suitable as the trunk and integration baseline
- if work accidentally lands on `main`, move it off before treating the workflow as healthy

## Rationale

- reduces review load
- improves incremental delivery
- supports contract-first and behavior-focused testing
- makes failures and regressions easier to localize

## Consequences

### Positive

- smaller, faster reviews
- cleaner merge history
- easier incremental testing and rollback reasoning

### Negative

- requires discipline in branch shaping
- requires Graphite setup and familiarity
- stacked branches add some workflow complexity compared with one-off branches

## Alternatives Considered

### Plain git branches only

- possible
- weaker support for disciplined stacked review as the default workflow

### Large single pull requests

- simpler mechanically
- poor fit for manual review of all produced work

## Follow-Up

- operational workflow detail lives in [Repository Tooling](../specs/platform/repository-tooling.md)
- implementation sequencing lives in [Repo Foundations](../plans/01-repo-foundations.md)
