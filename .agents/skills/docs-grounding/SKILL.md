---
name: docs-grounding
description: Route documentation questions through docs indexes, ADRs, specs, plans, and QMD discovery
compatibility: opencode
metadata:
  audience: maintainers
  scope: project-docs
---
## What I do

- Start with `docs/README.md` to identify the right source documents.
- Use QMD for discovery when the right file is unclear or the topic spans multiple docs.
- Read the actual repository files after retrieval before making claims.
- Distinguish ADRs, specs, and plans instead of flattening them into one source.
- Call out drift when docs disagree with each other or with implementation.

## When to use me

Use this when answering architecture, requirements, milestone, blocker, or operator-workflow questions from repo docs.

## Source Of Truth Rules

- `docs/adr/` = durable decisions and rationale
- `docs/specs/` = current intended design and implementation requirements
- `docs/plans/` = sequencing, dependencies, milestones, and mutable execution work

## Validation

- Prefer repository docs over external notes or web content for project truth.
- Prefer Markdown links and frontmatter metadata when navigating the docs set.
- After substantial docs edits, refresh retrieval with `mise run docs:qmd:refresh`.
